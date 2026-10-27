// Student app: sign in, baseline, adaptive practice, progress tracker, class leaderboard.
import { api, LIVE, getSession, setSession, resetDemo } from "./api.js";
import { PRACTICE_TEXTS, BASELINE, STRATEGY } from "./content.js";
import * as E from "./engine.js";
import * as U from "./ui.js";
import * as P from "./practice.js";
import * as S from "./sound.js";
import { SEQUENCE, UNITS } from "./curriculum.js";
import { VOCAB } from "./vocab.js";
import { LISTENING, listeningFor } from "./listening.js";
import { TIMES } from "./listening-times.js";
import * as G from "./games.js";
import * as L from "./look.js";

const $app = document.getElementById("app");
const $meta = document.getElementById("meta");
let session = getSession();
let me = null, history = [];
let run = null;              // the reading in progress (practice or baseline), kept on this device
let timerId = null;

const RUN_KEY = () => "ckpt-run-" + (session ? session.username : "");
function saveRun() { if (run && run.kind === "game" && run.phase !== "done") return; try { run ? localStorage.setItem(RUN_KEY(), JSON.stringify(run)) : localStorage.removeItem(RUN_KEY()); } catch (e) {} }
function loadRun() { try { return JSON.parse(localStorage.getItem(RUN_KEY())); } catch (e) { return null; } }
const top = () => window.scrollTo(0, 0);

/* ---------------- header ---------------- */
function header() {
  if (!session || !me) { $meta.innerHTML = ""; return; }
  let h = "";
  if (run && run.kind === "practice" && run.phase !== "done") {
    h += `<div class="meter" aria-label="Text level">${E.LEVELS.map((l, i) => `<span class="${i === run.r.level ? "on" : ""}">${l}</span>`).join("")}</div>`;
  }
  if (run && run.phase !== "done" && run.kind !== "game") h += `<span class="pill" id="clock">00:00</span>`;
  h += `<span class="pill xp" title="Your XP">${me.xp_total + (run && run.xpSoFar ? run.xpSoFar : 0)} XP</span>`;
  const on = S.soundOn();
  h += `<button class="pill snd" id="snd" aria-pressed="${on}" aria-label="Sound effects ${on ? "on" : "off"}" title="Sound effects ${on ? "on" : "off"}">${on ? SOUND_ON : SOUND_OFF}</button>`;
  if (!run || run.phase === "done") h += `<button class="linkbtn" id="out">Sign out</button>`;
  $meta.innerHTML = h;
  const out = document.getElementById("out"); if (out) out.onclick = signOut;
  document.getElementById("snd").onclick = () => { S.setSound(!S.soundOn()); S.play("ok"); header(); };
  tick();
}
const SOUND_ON = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const SOUND_OFF = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
function tick() {
  const el = document.getElementById("clock"); if (!el || !run) return;
  const s = Math.floor((Date.now() - run.t0) / 1000), m = Math.floor(s / 60), r = s % 60;
  const target = { baseline: 15, practice: 20, small: 10, cards: 5, listen: 12 }[run.kind];
  el.textContent = `${m < 10 ? "0" : ""}${m}:${r < 10 ? "0" : ""}${r} / ${target}:00`;
  el.classList.toggle("over", s > target * 60);
}
setInterval(tick, 1000);

async function signOut() {
  try { await api.logout(session.token); } catch (e) {}
  setSession(null); session = null; me = null; run = null; route();
}

/* ---------------- bottom navigation ---------------- */
const ico = d => `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const NAV = [
  ["home", "Home", ico('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>')],
  ["units", "Units", ico('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>')],
  ["review", "Review", ico('<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>')],
  ["games", "Games", ico('<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="18" cy="14" r="1" fill="currentColor"/>')],
  ["me", "Me", ico('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>')]];
// The bar shows on every page except sign-in and while an activity is running. `view` null hides it.
function nav(view) {
  let el = document.getElementById("nav");
  if (!el) { el = document.createElement("nav"); el.id = "nav"; el.className = "bnav"; el.setAttribute("aria-label", "Main"); document.body.appendChild(el); }
  document.body.classList.toggle("has-nav", view != null);
  if (view == null) { el.hidden = true; return; }
  const on = /^unit-/.test(view) ? "units" : ["progress", "leaderboard", "settings"].includes(view) ? "me" : NAV.some(n => n[0] === view) ? view : "home";
  const due = P.wordsToReview(history).length;
  el.hidden = false;
  el.innerHTML = `<div class="bnav-in">${NAV.map(([k, label, icon]) => `<a href="#${k}" ${k === on ? 'aria-current="page"' : ""}>${icon}<span>${label}</span>${k === "review" && due ? `<b class="nbadge">${due > 99 ? "99+" : due}</b>` : ""}</a>`).join("")}</div>`;
}

/* ---------------- sign in ---------------- */
function loginView(msg) {
  header(); nav(null); L.clearLook();
  $app.innerHTML = `<div class="narrow pop">
    <div class="hero"><p class="eyebrow">Stage 9 · Checkpoint English</p><h1>Read, learn words, practise grammar and level up</h1>
    <p class="lede">Sign in with the username and PIN your teacher gave you.</p></div>
    ${LIVE ? "" : `<div class="demo"><b>Demo mode.</b> Try username <b>demo</b> with PIN <b>1234</b>. The sample class and your progress are saved only in this browser.</div>`}
    <form class="panel" id="f" novalidate>
      <label class="fld" for="u">Username<input type="text" id="u" autocomplete="username" autocapitalize="none" placeholder="for example 8b3-07" required></label>
      <label class="fld" for="p">PIN<input type="password" id="p" inputmode="numeric" autocomplete="current-password" placeholder="4 digits" required></label>
      <p class="err" id="e" role="alert">${msg ? U.esc(msg) : ""}</p>
      <div class="row"><button class="btn" id="go" type="submit">Sign in</button><a class="note" href="teacher.html">Teacher sign-in</a></div>
    </form></div>`;
  document.getElementById("f").addEventListener("submit", async ev => {
    ev.preventDefault();
    const u = document.getElementById("u").value, p = document.getElementById("p").value, b = document.getElementById("go");
    b.disabled = true;
    try {
      const r = await api.login(u, p);
      if (r.role === "teacher") { setSession({ token: r.token, name: r.name }, "teacher"); location.href = "teacher.html"; return; }
      session = { token: r.token, username: u.trim().toLowerCase(), name: r.name }; setSession(session);
      await route();
    } catch (e) { document.getElementById("e").textContent = e.message; b.disabled = false; }
  });
}

/* ---------------- loading ---------------- */
async function refresh() {
  [me, history] = await Promise.all([api.me(session.token), api.history(session.token)]);
}
async function route() {
  clearInterval(timerId);
  if (!session) return loginView();
  S.soundUser(session.username); L.lookUser(session.username);
  if (!me) {
    $app.innerHTML = `<div class="narrow"><p class="note">Loading…</p></div>`;
    try { await refresh(); } catch (e) { setSession(null); session = null; return loginView(e.message); }
  }
  L.applyLook(L.getLook(), lookStats());
  if (!run) { const r = loadRun(); if (r && !r.pausedAt) run = r; }
  if (run) return runView();
  const view = (location.hash || "#home").slice(1);
  header();
  nav(view);
  if (view === "progress" || view === "me") return progressView();
  if (view === "settings") return settingsView();
  if (view === "leaderboard") return leaderboardView();
  if (view === "units") return unitsView();
  if (view === "review") return reviewView();
  if (view === "games") return gamesView();
  const m = /^unit-(\d)(?:\/(\w+))?$/.exec(view);
  if (m) return unitView(+m[1], m[2]);
  return homeView();
}
window.addEventListener("hashchange", () => { if (!run) route(); });

/* ---------------- home ---------------- */
function homeView() {
  const { streak, thisWeek } = E.weeklyStreak(history);
  const lastBase = [...history].reverse().find(h => h.mode === "baseline");
  const canRetake = lastBase && Date.now() - new Date(lastBase.created_at) > 28 * 86400e3;
  const first = me.name.split(" ").pop();
  const review = P.wordsToReview(history);
  let h = `<div class="narrow pop">
    <div class="hero"><p class="eyebrow">Class ${U.esc(me.class_code)}</p><h1>Hi, ${U.esc(first)}</h1></div>`;
  const paused = pausedRun();
  if (paused) h += `<div class="tcard"><span class="tag gold">Unfinished</span><h3>${U.esc(runName(paused))}</h3>
      <p class="note">Carry on where you stopped. Starting a different activity will replace this one.</p>
      <div class="row"><button class="btn" id="resume">Continue</button></div></div>`;
  if (!me.baseline_done && !(paused && paused.kind === "baseline")) {
    h += `<div class="tcard"><span class="tag gold">Start here</span><h3>Baseline reading</h3>
      <p class="note" style="font-size:1rem">Three short texts, from easier to harder, with 12 questions and no hints. Your score sets your starting reading level. It takes about 15 minutes.</p>
      <div class="row"><button class="btn" id="base">Start the baseline</button></div></div>`;
  } else if (me.baseline_done) {
    h += `<div class="stats">
      <div class="stat gold"><b>${me.xp_week}</b><span>XP this week</span></div>
      <div class="stat"><b>${U.levelName(me.level)}</b><span>reading level</span></div>
      <div class="stat"><b>${streak} wk</b><span>streak</span></div>
      <div class="stat"><b>${me.xp_total}</b><span>XP in total</span></div></div>`;
  }
  h += `<div class="panel goal"><b>This week: ${Math.min(thisWeek, 2)} of 2 activities</b><div class="bar"><i style="width:${Math.min(thisWeek, 2) * 50}%"></i></div>
      <p class="note">Finish 2 activities a week (a reading text, a vocabulary set or a grammar set) to keep your streak and earn a ${E.XP.streakWeek} XP bonus.</p></div>`;
  const fu = P.focusUnit();
  h += `<h2>This week in class</h2>${focusCard(fu)}`;
  if (review.length) h += `<div class="tcard"><span class="tag gold">Review</span><h3>${review.length} word${review.length > 1 ? "s" : ""} to review today</h3>
      <p class="note">${U.esc(review.slice(0, 6).map(x => x.w).join(", "))}${review.length > 6 ? "…" : ""}</p>
      <div class="row"><button class="btn" data-review="1">Review ${Math.min(review.length, 10)} words</button></div></div>`;
  h += `${canRetake ? `<div class="row"><button class="btn alt" id="rebase">Retake the baseline</button></div>` : ""}
    ${LIVE ? "" : `<p class="note">Demo mode: <button class="linkbtn" style="color:var(--teal)" id="reset">reset the demo data</button></p>`}</div>`;
  $app.innerHTML = h;
  const b = document.getElementById("base"); if (b) b.onclick = startBaseline;
  const rr = document.getElementById("resume"); if (rr) rr.onclick = resumeRun;
  const rb = document.getElementById("rebase"); if (rb) rb.onclick = startBaseline;
  const rs = document.getElementById("reset"); if (rs) rs.onclick = () => { resetDemo(); setSession(null); session = null; me = null; route(); };
  bindActivities();
}

/* ---------------- units ---------------- */
const STATUS = { done: ["Done", "none"], now: ["Now", "hint"], upcoming: ["Coming up", "rescue"] };
// A unit page has one tab per section; units without reading texts or listening leave those tabs out.
function unitSections(u) {
  const texts = PRACTICE_TEXTS.filter(t => t.unitNo === u);
  const done = new Set(history.filter(h => h.mode === "practice" || h.mode === "listening").map(h => h.text_id));
  const vm = P.vocabMastery(u, history);
  const lists = VOCAB[u].map((l, i) => `List ${i + 1}: ${l.length} words`).join(" · ");
  const secs = [{ key: "mission", label: "Mission", html: missionHTML(u) }];
  if (texts.length) secs.push({ key: "read", label: "Reading", html: `<div class="usec">${texts.map(t => `<div class="urow"><div><b>${U.esc(t.topic)}</b><br><span class="note">${done.has(t.id) ? "Done before: half XP this time." : U.esc(t.blurb)}</span></div>
        ${me.baseline_done ? `<button class="btn small" data-text="${t.id}">${done.has(t.id) ? "Read again" : "Read"}</button>` : `<span class="note">Take the baseline first</span>`}</div>`).join("")}</div>` });
  if (listeningFor(u).length) secs.push({ key: "listen", label: "Listening", html: `<div class="usec">${listeningFor(u).map(t => `<div class="urow"><div><b>${U.esc(t.topic)}</b><br><span class="note">${U.esc(t.part)} · ${done.has(t.id) ? "Done before" : U.esc(t.blurb)}</span></div>
        <button class="btn small" data-listen="${t.id}">${done.has(t.id) ? "Again" : "Listen"}</button></div>`).join("")}</div>` });
  secs.push({ key: "words", label: "Words", html: `<div class="usec"><div class="urow"><div><b>${vm.mastered} of ${vm.total} words learned</b><br><span class="note">${lists}</span>
        <div class="bar" style="margin-top:6px"><i style="width:${Math.round(100 * vm.mastered / vm.total)}%;background:var(--teal)"></i></div></div>
      <button class="btn small" data-vocab="${u}">Practise 10 words</button></div>
      <div class="row"><button class="btn small alt" data-cards="${u}">Word cards</button><button class="btn small alt" data-family="${u}">Word families</button></div></div>` });
  secs.push({ key: "grammar", label: "Grammar", html: `<div class="usec">${P.unitGrammar(u).map(g => { const m = P.grammarMastery(g.id, history);
        return `<div class="urow"><div><b>${g.id} ${U.esc(g.title)}</b><br><span class="note">${g.code ? g.code + " · " : ""}${m == null ? "Not tried yet" : m + "% right first time"}</span></div>
          <button class="btn small alt" data-gram="${g.id}">Practise</button></div>`; }).join("")}
      <div class="row"><button class="btn small" data-gramunit="${u}">Mixed quiz: all of Unit ${u}</button></div></div>` });
  secs.push({ key: "games", label: "Games", html: gamesHTML(u) });
  return secs;
}
function gamesHTML(u) {
  return `<div class="usec">${Object.entries(G.GAMES).filter(([g]) => g !== "speed" || G.speedTexts(u).length).map(([g, x]) => {
        const best = G.bestScore(history, G.gameId(g, u)), locked = g === "speed" && !readTexts(u).length;
        return `<div class="urow"><div><b>${x.name}</b><br><span class="note">${locked ? "Finish a reading text in this unit first. Speed Read uses the texts you have read." : U.esc(x.blurb)}${best ? ` Your best: ${best} points.` : ""}</span></div>
          <button class="btn small" data-game="${g}" data-unit="${u}" ${locked ? "disabled" : ""}>Play</button></div>`; }).join("")}</div>`;
}
const lastTab = {};
function unitCard(u, tab) {
  const secs = unitSections(u), cur = secs.find(x => x.key === tab) || secs[0], st = P.unitStatus(u);
  lastTab[u] = cur.key;
  return `<div class="tcard unit">
    <div class="row" style="justify-content:space-between"><h3>${U.esc(P.unitTitle(u))}</h3><span class="chip ${STATUS[st][1]}">${STATUS[st][0]}</span></div>
    <div class="utabs" role="tablist" aria-label="Unit ${u} sections">${secs.map(x => `<a role="tab" href="#unit-${u}/${x.key}" aria-selected="${x === cur}">${x.label}</a>`).join("")}</div>
    <div role="tabpanel" aria-label="${cur.label}">${cur.html}</div></div>`;
}
// The home page shows a short card for this week's unit; the full unit is one tap away.
function focusCard(u) {
  const m = P.mission(u, history), n = m.steps.filter(s => s.done).length;
  return `<div class="tcard"><div class="row" style="justify-content:space-between"><h3>${U.esc(P.unitTitle(u))}</h3><span class="chip hint">Now</span></div>
    <div class="mbar" aria-hidden="true"><i style="width:${Math.round(100 * n / m.steps.length)}%"></i></div>
    <p class="note">Mission: ${n} of ${m.steps.length} steps${m.complete ? ". Badge won!" : m.next ? `. Next: <b>${U.esc(m.next.label)}</b>` : ""}</p>
    <div class="row">${m.next && !m.complete ? `<button class="btn" data-step="${m.next.key}" data-unit="${u}">${m.next.key === "boss" ? "Start the challenge" : "Next step"}</button>` : ""}
      <a class="btn alt" href="#unit-${u}">Open Unit ${u}</a></div></div>`;
}
const TICK = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function missionHTML(u) {
  const m = P.mission(u, history), n = m.steps.filter(s => s.done).length;
  return `<div class="mission${m.complete ? " won" : ""}"><div class="row" style="justify-content:space-between"><p class="eyebrow">Unit ${u} mission · ${n} of ${m.steps.length} steps</p>
      ${m.complete ? `<span class="chip none">Badge won</span>` : ""}</div>
    <div class="mbar" aria-hidden="true"><i style="width:${Math.round(100 * n / m.steps.length)}%"></i></div>
    <ol class="msteps">${m.steps.map((s, k) => `<li class="${s.done ? "done" : s.locked ? "locked" : m.next === s ? "next" : ""}"><span class="mdot">${s.done ? TICK : k + 1}</span>
      <div><b>${U.esc(s.label)}</b><br><span class="note">${U.esc(s.detail)}</span></div>
      ${!s.done && !s.locked ? `<button class="btn small${m.next === s ? "" : " alt"}" data-step="${s.key}" data-unit="${u}">${s.key === "boss" ? "Start" : "Go"}</button>` : ""}</li>`).join("")}</ol>
    <p class="note">${m.complete ? `You won the <b>${U.esc(m.badge)}</b> badge.` : `Finish the final challenge to win the <b>${U.esc(m.badge)}</b> badge and +${P.BOSS_BONUS} XP.`}</p></div>`;
}
function missionStep(key, u) {
  if (key === "cards") return startCards(u);
  if (key === "vocab") return startSmall("vocab", `vocab-u${u}`, `Unit ${u} vocabulary`, P.vocabSet({ unit: u, history }));
  if (key === "family") return startSmall("vocab", `family-u${u}`, `Unit ${u} word families`, P.familySet(u));
  if (key === "boss") return startBoss(u);
  if (key === "listen") { const done = new Set(history.map(h => h.text_id)), ts = listeningFor(u); return startListening((ts.find(t => !done.has(t.id)) || ts[0]).id); }
  if (key === "grammar") { const g = P.unitGrammar(u).find(x => P.grammarMastery(x.id, history) == null) || P.unitGrammar(u)[0]; return startPoint(g.id); }
  if (key === "read") {
    if (!me.baseline_done) { alert("Take the baseline reading first. It is on your home page."); return; }
    const done = new Set(history.map(h => h.text_id)), ts = PRACTICE_TEXTS.filter(t => t.unitNo === u);
    return startPractice((ts.find(t => !done.has(t.id)) || ts[0]).id);
  }
}
function pathHTML(fu) {
  const cur = P.currentEntry();
  return `<div class="path">${SEQUENCE.map(e => {
    const isNow = e === cur;
    if (e.kind !== "unit") return `<div class="pstep minor${isNow ? " now" : ""}"><span class="dot"></span><div><b>${U.esc(e.title)}</b> <span class="note">${e.weeks}</span></div></div>`;
    const vm = P.vocabMastery(e.unit, history), st = P.unitStatus(e.unit);
    return `<a class="pstep ${st}${e.unit === fu ? " focus" : ""}" href="#unit-${e.unit}"><span class="dot">${e.unit}</span><div><b>${U.esc(UNITS[e.unit].title)}</b> <span class="note">${e.weeks}${isNow ? " · now" : ""}</span>
      <br><span class="note">${vm.mastered}/${vm.total} words · ${P.unitGrammar(e.unit).length} grammar points</span></div></a>`;
  }).join("")}</div>`;
}
function unitView(u, tab) {
  if (!UNITS[u]) return homeView();
  $app.innerHTML = `<div class="narrow pop"><div class="row"><a href="#units">← All units</a></div>${unitCard(u, tab || lastTab[u])}</div>`;
  bindActivities();
}
function unitsView() {
  const fu = P.focusUnit();
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Units</p><h1>The school year</h1>
    <p class="lede">Tap a unit to see its mission, reading, listening, words, grammar and games.</p></div>${pathHTML(fu)}</div>`;
}
function reviewView() {
  const review = P.wordsToReview(history), fu = P.focusUnit();
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Review</p><h1>Words to review</h1></div>
    ${review.length ? `<div class="tcard"><h3>${review.length} word${review.length > 1 ? "s" : ""} due today</h3>
      <p class="note">${U.esc(review.slice(0, 12).map(x => x.w).join(", "))}${review.length > 12 ? "…" : ""}</p>
      <div class="row"><button class="btn" data-review="1">Review ${Math.min(review.length, 10)} words</button></div></div>`
      : `<div class="panel"><p style="margin:0"><b>Nothing due today.</b> Well done! Learn some new words below.</p></div>`}
    <div class="panel"><p class="note" style="margin:0">A word you miss comes back straight away. A word you get right comes back after 1, then 3, 7 and 14 days, so it stays in your memory.</p></div>
    <h2>Unit ${fu} words</h2>${unitSections(fu).find(x => x.key === "words").html}</div>`;
  bindActivities();
}
function gamesView() {
  const fu = P.focusUnit(), u = UNITS[gamesUnit] ? gamesUnit : fu;
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Games</p><h1>Play and practise</h1>
    <p class="lede">Games use the words and texts from the unit you choose. You can earn up to ${G.GAME_XP_DAY} XP a day from games.</p></div>
    <div class="tabs" role="tablist" aria-label="Unit">${SEQUENCE.filter(e => e.kind === "unit").map(e => `<button role="tab" aria-selected="${e.unit === u}" data-gu="${e.unit}">Unit ${e.unit}</button>`).join("")}</div>
    <h2>${U.esc(P.unitTitle(u))}</h2>${gamesHTML(u)}</div>`;
  $app.querySelectorAll("[data-gu]").forEach(b => b.onclick = () => { gamesUnit = +b.dataset.gu; S.play("tap"); gamesView(); });
  bindActivities();
}
let gamesUnit = null;
function bindActivities() {
  $app.querySelectorAll("[data-text]").forEach(btn => btn.onclick = () => startPractice(btn.dataset.text));
  $app.querySelectorAll("[data-vocab]").forEach(btn => btn.onclick = () => { const u = +btn.dataset.vocab;
    startSmall("vocab", `vocab-u${u}`, `Unit ${u} vocabulary`, P.vocabSet({ unit: u, history })); });
  $app.querySelectorAll("[data-review]").forEach(btn => btn.onclick = () =>
    startSmall("vocab", "vocab-review", "Word review", P.vocabSet({ review: true, history })));
  $app.querySelectorAll("[data-gram]").forEach(btn => btn.onclick = () => startPoint(btn.dataset.gram));
  $app.querySelectorAll("[data-listen]").forEach(btn => btn.onclick = () => startListening(btn.dataset.listen));
  $app.querySelectorAll("[data-cards]").forEach(btn => btn.onclick = () => startCards(+btn.dataset.cards));
  $app.querySelectorAll("[data-family]").forEach(btn => btn.onclick = () => { const u = +btn.dataset.family;
    startSmall("vocab", `family-u${u}`, `Unit ${u} word families`, P.familySet(u)); });
  $app.querySelectorAll("[data-game]").forEach(btn => btn.onclick = () => startGame(btn.dataset.game, +btn.dataset.unit));
  $app.querySelectorAll("[data-step]").forEach(btn => btn.onclick = () => missionStep(btn.dataset.step, +btn.dataset.unit));
  $app.querySelectorAll("[data-gramunit]").forEach(btn => btn.onclick = () => { const u = +btn.dataset.gramunit;
    startSmall("grammar", `grammar-u${u}`, `Unit ${u} grammar quiz`, P.grammarSet({ unit: u })); });
}

/* ---------------- vocabulary and grammar sets ---------------- */
function startSmall(sub, textId, label, qs, extra = {}) {
  run = { kind: "small", sub, textId, label, set: P.newSet(qs), phase: "q", t0: Date.now(), orders: {}, pick: null, fb: null, xpSoFar: 0,
          draft: "", tiles: [], match: null, ...extra };
  prepQuestion(); saveRun(); route(); top();
}
function startPoint(id) {
  const g = P.grammarPoint(id);
  startSmall("grammar", `grammar-${g.id}`, `${g.id} ${g.title}`, P.grammarSet({ point: g.id }), { notice: { ...P.noticeTask(g.id), result: null } });
}
function startBoss(u) {
  startSmall("vocab", `boss-u${u}`, `Unit ${u} final challenge`, P.bossSet(u), { boss: u });
}
function stemHTML(stem) { return U.esc(stem).replaceAll("___", '<span class="gap">______</span>'); }
const SPEAKER = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const listenBtn = (text, label = "Listen") => S.canSpeak ? `<button class="btn small alt say" type="button" data-say="${U.esc(text)}">${SPEAKER} ${label}</button>` : "";
function tagOf(q) {
  if (q.kind === "match") return "Vocabulary · match";
  if (q.kind === "vocab") return q.type === "type" ? "Vocabulary · type the word" : "Vocabulary";
  if (q.kind === "family") return "Word family";
  const v = { tap: " · find the mistake", tiles: " · build it" }[q.variant] || "";
  return `Grammar ${q.point}${v}`;
}
const answerText = q => q.variant === "tiles" ? q.answer.join(" ") : q.variant === "tap" ? q.fixed : q.opts[0];
function smallView() {
  if (run.notice && run.notice.result !== "done") return noticeView();
  const set = run.set, q = set.qs[set.i], fb = run.fb, locked = !!(fb && (fb.kind === "ok" || fb.kind === "reveal"));
  let h = `<div class="narrow pop"><p class="eyebrow">${U.esc(run.label)}</p>
    <div class="progress">${set.qs.map((_, i) => { const r = set.results[i]; return `<i class="${i === set.i ? "cur" : r ? (r.first_try ? "ok" : "help") : ""}"></i>`; }).join("")}</div>
    <div class="qcard"><div class="qhead"><span class="tag">${U.esc(tagOf(q))}</span><span class="qnum">Question ${set.i + 1} of ${set.qs.length}</span></div>`;
  h += q.kind === "match" ? matchHTML(q, fb, locked) : q.type === "type" ? typeHTML(q, locked) : q.variant === "tap" ? tapHTML(q, fb, locked)
     : q.variant === "tiles" ? tilesHTML(q, locked)
     : `<p class="stem">${stemHTML(q.stem)}</p>${optsHTML(q, order("s" + set.i, q.opts.length), fb ? { right: fb.kind === "ok", wrong: fb.wrong, reveal: fb.kind === "reveal", locked } : null)}`;
  if (fb) h += smallFeedback(q, fb);
  h += `<div class="row">${locked ? `<button class="btn" id="next">${set.i === set.qs.length - 1 ? "See my results" : "Next question"}</button>`
                               : `<button class="btn" id="check" ${canCheck(q) ? "" : "disabled"}>Check answer</button>`}</div></div></div>`;
  $app.innerHTML = h;
  bindSmall(q, locked);
}
function canCheck(q) {
  if (q.kind === "match") return Object.keys(run.match.pairs).length === q.words.length;
  if (q.type === "type") return true;
  if (q.variant === "tiles") return run.tiles.length > 0;
  return run.pick !== null;
}
function typeHTML(q, locked) {
  const n = q.answer.replace(/[^a-z]/gi, "").length;
  return `<p class="stem">${stemHTML(q.stem)}</p>
    <p class="clue"><b>Meaning:</b> ${U.esc(q.clue)}</p>
    <p class="letters"><span aria-hidden="true">${U.esc(P.letterBlanks(q.answer))}</span> <span class="note">(${n} letters, starts with "${U.esc(q.answer[0])}")</span></p>
    <label class="fld" for="typed"><span class="note">Type the missing word.</span>
    <input type="text" id="typed" autocomplete="off" autocapitalize="none" spellcheck="false" value="${U.esc(run.draft)}" ${locked ? "disabled" : ""}></label>`;
}
function matchHTML(q, fb, locked) {
  const m = run.match, at = d => { const k = Object.keys(m.pairs).find(k => m.pairs[k] === d); return k == null ? null : +k; };
  const chips = q.words.map((w, k) => { const placed = m.pairs[k] != null;
    return `<button class="mword${m.sel === k ? " sel" : ""}${placed ? " used" : ""}" data-mw="${k}" ${locked || m.ok[k] ? "disabled" : ""}>${U.esc(w.w)}</button>`; }).join("");
  const defs = q.order.map(d => { const k = at(d), ok = k != null && m.ok[k];
    const cls = locked ? (k === d ? " right" : " wrong") : ok ? " right" : "";
    return `<button class="mdef${cls}" data-md="${d}" ${locked || ok ? "disabled" : ""}><span class="slot">${k != null ? U.esc(q.words[k].w) : "tap a word, then here"}</span><span>${U.esc(q.words[d].def)}</span></button>`; }).join("");
  return `<p class="stem">${U.esc(q.stem)}</p><div class="mwords">${chips}</div><div class="mdefs">${defs}</div>`;
}
function tapHTML(q, fb, locked) {
  return `<p class="stem">${U.esc(q.stem)}</p><div class="tapline">${q.chunks.map((c, k) => {
    let cls = "tw";
    if (locked && c.bad) cls += " bad";
    else if (locked && run.pick === k) cls += " right";
    else if (run.pick === k) cls += fb && fb.wrong === k ? " nope" : " sel";
    return `<button class="${cls}" data-tw="${k}" ${locked ? "disabled" : ""}>${U.esc(c.t)}</button>`; }).join("")}</div>
    ${locked ? `<p class="fixed">✓ ${U.esc(q.explain)}</p>` : ""}`;
}
function tilesHTML(q, locked) {
  const [a, b] = q.stem.split("___");
  const built = run.tiles.length ? run.tiles.map((t, pos) => `<button class="tile placed" data-tp="${pos}" ${locked ? "disabled" : ""}>${U.esc(q.tiles[t])}</button>`).join("")
                                  : `<span class="note">tap the words below</span>`;
  return `<p class="note">Build the missing words. Tap the tiles in order. One tile is extra.</p>
    <p class="stem tilestem">${U.esc(a)}<span class="gapbox">${built}</span>${U.esc(b)}</p>
    <div class="bank">${q.tiles.map((t, k) => `<button class="tile${run.tiles.includes(k) ? " used" : ""}" data-tb="${k}" ${locked || run.tiles.includes(k) ? "disabled" : ""}>${U.esc(t)}</button>`).join("")}</div>`;
}
function smallFeedback(q, fb) {
  const note = n => n ? `<p>${U.esc(n)}</p>` : "";
  const rule = t => `<div class="strat"><b>Rule</b><p style="margin:6px 0 0">${U.esc(t)}</p></div>`;
  if (fb.kind === "ok") {
    let extra = "";
    if (q.kind === "family") extra = `<p class="note">Word family: ${U.esc(q.family)}</p>`;
    if (q.variant === "tap") extra = `<p>Yes, "${U.esc(q.chunks.find(c => c.bad).t)}" is wrong. It should be "<b>${U.esc(q.fixed)}</b>".</p>${note(q.note)}`;
    return `<div class="fb ok pop"><p><strong>${fb.firstTry ? "Correct, first time!" : "Correct."}</strong> <span class="xpgain">+${fb.xp} XP</span></p>${extra}</div>`;
  }
  if (fb.kind === "hint") {
    if (q.kind === "match") return `<div class="fb bad pop"><p><strong>${fb.n} of ${q.words.length} are right.</strong> The right pairs are locked. Match the others again.</p></div>`;
    if (q.kind === "grammar" && q.variant === "tap") return `<div class="fb bad pop"><p><strong>Not quite.</strong> That part is correct. Find the part that is wrong.</p></div>${rule(P.grammarPoint(q.point).rule)}`;
    if (q.kind === "grammar" && q.variant === "tiles") return `<div class="fb bad pop"><p><strong>Not quite.</strong> Start with "${U.esc(q.answer[0])}".</p></div>${rule(P.grammarPoint(q.point).rule)}`;
    if (q.kind === "grammar") return `<div class="fb bad pop"><p><strong>Not quite.</strong></p>${note(q.notes[fb.wrong])}</div>${rule(q.hint)}`;
    if (q.type === "type") return `<div class="fb bad pop"><p><strong>Not quite.</strong> ${U.esc(q.hint)}</p></div>`;
    if (q.kind === "family") return `<div class="fb bad pop"><p><strong>Not quite.</strong> ${U.esc(q.hint)}</p></div>`;
    return `<div class="fb bad pop"><p><strong>Not quite.</strong> ${q.type === "meaning" ? "See the word in a sentence:" : "Hint:"} ${U.esc(q.hint)}</p></div>`;
  }
  if (q.kind === "match") return `<div class="fb info pop"><p><strong>Here are the right pairs.</strong></p><ul class="pairs">${q.words.map(w => `<li><b>${U.esc(w.w)}</b>: ${U.esc(w.def)}</li>`).join("")}</ul><p class="note">The words you missed will come back in your review.</p></div>`;
  if (q.variant === "tap") return `<div class="fb info pop"><p><strong>The mistake is "${U.esc(q.chunks.find(c => c.bad).t)}". It should be "${U.esc(q.fixed)}".</strong></p>${note(q.note)}<p class="note">No XP for this one.</p></div>`;
  const why = q.kind === "grammar" && q.variant === "choose" && fb.wrong != null ? note(q.notes[fb.wrong]) : "";
  return `<div class="fb info pop"><p><strong>The answer is "${U.esc(answerText(q))}".</strong></p>${why}<p>${U.esc(q.explain)}</p>
    <p class="note">No XP for this one. ${q.kind === "grammar" ? "Try this point again soon." : "It will come back in your review."}</p></div>`;
}
function bindSmall(q, locked) {
  bindOpts(smallView);
  const re = () => { saveRun(); smallView(); backButton(); };
  const typed = document.getElementById("typed");
  if (typed) { typed.oninput = () => { run.draft = typed.value; saveRun(); };
    typed.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); const c = document.getElementById("check"); if (c) c.click(); } };
    if (!locked) typed.focus({ preventScroll: true }); }
  $app.querySelectorAll("[data-tw]").forEach(b => b.onclick = () => { run.pick = +b.dataset.tw; S.play("tap"); re(); });
  $app.querySelectorAll("[data-tb]").forEach(b => b.onclick = () => { run.tiles.push(+b.dataset.tb); S.play("tap"); re(); });
  $app.querySelectorAll("[data-tp]").forEach(b => b.onclick = () => { run.tiles.splice(+b.dataset.tp, 1); re(); });
  $app.querySelectorAll("[data-mw]").forEach(b => b.onclick = () => {
    const k = +b.dataset.mw, m = run.match;
    if (m.pairs[k] != null) delete m.pairs[k];
    m.sel = m.sel === k ? null : k; S.play("tap"); re();
  });
  $app.querySelectorAll("[data-md]").forEach(b => b.onclick = () => {
    const d = +b.dataset.md, m = run.match;
    Object.keys(m.pairs).forEach(k => { if (m.pairs[k] === d && !m.ok[k]) delete m.pairs[k]; });
    if (m.sel != null) { m.pairs[m.sel] = d; m.sel = null; S.play("tap"); }
    re();
  });
  const c = document.getElementById("check"); if (c) c.onclick = () => checkSmall(q);
  const n = document.getElementById("next"); if (n) n.onclick = nextSmallQ;
}
function checkSmall(q) {
  const set = run.set;
  if (q.kind === "match") {
    const right = q.words.map((_, k) => run.match.pairs[k] === k), out = P.submitMatch(set, right);
    if (out === "hint") {
      right.forEach((ok, k) => { if (ok) run.match.ok[k] = true; else delete run.match.pairs[k]; });
      run.fb = { kind: "hint", n: right.filter(Boolean).length }; S.play("bad");
    } else return afterSmall(out);
    saveRun(); return runView();
  }
  let correct;
  if (q.type === "type") { const v = (document.getElementById("typed").value || "").trim(); if (!v) return; run.draft = v; correct = P.markTyped(q, v); }
  else if (q.variant === "tiles") correct = run.tiles.map(i => q.tiles[i]).join(" ") === q.answer.join(" ");
  else if (q.variant === "tap") correct = !!q.chunks[run.pick].bad;
  else correct = run.pick === 0;
  const out = P.submitSmall(set, correct);
  if (out === "hint") { run.fb = { kind: "hint", wrong: run.pick }; if (q.variant === "tiles") run.tiles = []; S.play("bad"); saveRun(); return runView(); }
  afterSmall(out);
}
function afterSmall(out) {
  const set = run.set, r = set.results[set.i];
  if (out === "correct") {
    const xp = P.smallXP([r]) - P.XP_SMALL.finish; run.xpSoFar += xp;
    run.fb = { kind: "ok", xp, firstTry: r.first_try }; S.play("ok");
  } else { run.fb = { kind: "reveal", wrong: run.pick }; if (run.match) run.match.pairs = Object.fromEntries(set.qs[set.i].words.map((_, k) => [k, k])); S.play("info"); }
  saveRun(); runView();
  const el = $app.querySelector(".fb"); if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function nextSmallQ() {
  const set = run.set;
  run.pick = null; run.fb = null; run.draft = ""; run.tiles = []; run.match = null;
  if (P.nextSmall(set) === "done") {
    const flat = P.flatResults(set.results), score = flat.filter(r => r.first_try).length;
    const win = run.boss && score / flat.length >= P.BOSS_PASS;
    const firstWin = win && !history.some(h => h.text_id === run.textId && h.max_score > 0 && h.score / h.max_score >= P.BOSS_PASS);
    const bonus = E.streakBonus(history), boss = firstWin ? P.BOSS_BONUS : 0;
    run.result = { xp: P.smallXP(set.results) + bonus + boss, bonus, boss, win, score, max: flat.length, seconds: Math.round((Date.now() - run.t0) / 1000) };
    run.phase = "done"; run.xpSoFar = 0;
    S.play(win ? "win" : "done");
  } else prepQuestion();
  saveRun(); runView(); top();
}
// Per-question state that a question type needs before it is shown.
function prepQuestion() {
  const q = run.set.qs[run.set.i];
  if (q && q.kind === "match" && !run.match) run.match = { sel: null, pairs: {}, ok: {} };
}
function smallDone() {
  const set = run.set, R = run.result, flat = P.flatResults(set.results);
  const what = r => r.skill === "Grammar" ? `${r.point} ${P.grammarPoint(r.point).title}` : r.skill === "Word family" ? `${r.word} (word family)` : r.word;
  const rows = flat.map((r, i) => `<tr><td>${i + 1}</td><td>${U.esc(what(r))}</td><td><span class="chip ${r.support}">${E.SUPPORT_LABEL[r.support] || "After a hint"}</span></td></tr>`).join("");
  const badge = run.boss ? P.MISSION_BADGES[run.boss] : null;
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished · ${U.esc(run.label)}</p><h1>${R.score} of ${R.max} right first time</h1>
    ${run.boss ? (R.win ? `<div class="fb ok winbox"><p class="big">Mission complete!</p><p>You won the <b>${U.esc(badge)}</b> badge${R.boss ? ` and a <span class="xpgain">+${R.boss} XP</span> bonus` : ""}.</p></div>`
                        : `<div class="fb info"><p><strong>So close.</strong> You need ${Math.ceil(P.BOSS_PASS * R.max)} of ${R.max} right first time to win the badge. Look at the answers below, practise those words and grammar points, then try again.</p></div>`) : ""}
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${R.max}</b><span>right first time</span></div>
      <div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div><div class="stat"><b>${flat.filter(r => r.support === "explained").length}</b><span>to review</span></div></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept!</strong> That's 2 activities this week: <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    <div class="tbl"><table><thead><tr><th>#</th><th>${run.sub === "grammar" ? "Grammar point" : run.boss ? "Word or grammar point" : "Word"}</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="home">Back to home</button></div></div>`;
  document.getElementById("home").onclick = () => { run = null; saveRun(); location.hash = "#home"; route(); };
  saveAttempt({ mode: run.sub, text_id: run.textId, level_start: null, level_end: null, score: R.score, max_score: R.max,
                xp: R.xp, seconds: R.seconds, answers: flat });
}

/* ---- notice the rule (before practising one grammar point) ---- */
function noticeView() {
  const n = run.notice, answered = n.result != null;
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">${U.esc(run.label)} · first, notice</p>
    <div class="qcard"><div class="qhead"><span class="tag">Notice the pattern</span><span class="qnum">Then ${run.set.qs.length} questions</span></div>
    <p class="stem">Read these sentences. Look at the highlighted words.</p>
    <ul class="examples">${n.examples.map(ex => `<li>${ex.map(p => p.hi ? `<mark>${U.esc(p.t)}</mark>` : U.esc(p.t)).join("")}</li>`).join("")}</ul>
    <p class="stem">Which rule explains the highlighted words?</p>
    ${optsHTML({ opts: n.opts }, order("notice", n.opts.length), answered ? { right: n.result === "right", wrong: run.pick, reveal: true, locked: true } : null)}
    ${answered ? `<div class="fb ${n.result === "right" ? "ok" : "info"} pop"><p><strong>${n.result === "right" ? "Yes, well noticed!" : "Not quite. The highlighted words follow this rule."}</strong></p></div>
      <div class="strat"><b>The rule</b><p style="margin:6px 0 0">${U.esc(n.rule)}</p></div>` : ""}
    <div class="row">${answered ? `<button class="btn" id="go">Start practising</button>` : `<button class="btn" id="check" ${run.pick === null ? "disabled" : ""}>Check</button>`}</div></div></div>`;
  bindOpts(noticeView);
  const c = document.getElementById("check"); if (c) c.onclick = () => { n.result = run.pick === 0 ? "right" : "wrong"; S.play(n.result === "right" ? "ok" : "info"); saveRun(); runView(); };
  const g = document.getElementById("go"); if (g) g.onclick = () => { n.result = "done"; run.pick = null; prepQuestion(); saveRun(); runView(); top(); };
}

/* ---- word cards ---- */
function startCards(u) {
  run = { kind: "cards", unit: u, words: P.cardSet(u, history).map(x => x.w), i: 0, side: "front", known: [], phase: "q", t0: Date.now(), orders: {}, pick: null, xpSoFar: 0 };
  saveRun(); route(); top();
}
function cardsView() {
  const w = P.unitWords(run.unit).find(x => x.w === run.words[run.i]), back = run.side === "back";
  const ex = back ? P.textExample(w) : null, filled = U.esc(w.ex).replace("___", `<b>${U.esc(w.w)}</b>`);
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Unit ${run.unit} · meet the words</p>
    <div class="progress">${run.words.map((_, i) => `<i class="${i === run.i ? "cur" : i < run.i ? (run.known[i] ? "ok" : "help") : ""}"></i>`).join("")}</div>
    <div class="wcard${back ? " back" : ""}"><p class="qnum">Card ${run.i + 1} of ${run.words.length}</p>
      <p class="wword">${U.esc(w.w)}</p>
      <div class="row center">${listenBtn(w.w)}</div>
      ${back ? `<p class="wdef">${U.esc(w.def)}</p><p class="wex">${filled}</p>
        ${ex ? `<div class="wtext"><p class="eyebrow">In the text "${U.esc(ex.topic)}"</p><p>${U.esc(ex.sentence)}</p>${listenBtn(ex.sentence, "Listen to the sentence")}</div>` : ""}
        <p class="stem" style="text-align:center">Do you know this word?</p>
        <div class="row center"><button class="btn" id="know">I know it</button><button class="btn alt" id="unsure">Not sure yet</button></div>`
      : `<p class="note" style="text-align:center">Say what you think it means, then check.</p><div class="row center"><button class="btn" id="flip">Show the meaning</button></div>`}
    </div><p class="note">"Not sure yet" words come first in your next vocabulary practice.</p></div>`;
  bindSay();
  const f = document.getElementById("flip"); if (f) f.onclick = () => { run.side = "back"; S.play("flip"); saveRun(); runView(); };
  const rate = known => { run.known[run.i] = known; run.xpSoFar += 1; S.play(known ? "ok" : "tap");
    run.i++; run.side = "front";
    if (run.i >= run.words.length) { run.phase = "done"; run.xpSoFar = 0; S.play("done");
      run.result = { xp: run.words.length + 5, seconds: Math.round((Date.now() - run.t0) / 1000) }; }
    saveRun(); runView(); top(); };
  const k = document.getElementById("know"); if (k) k.onclick = () => rate(true);
  const u = document.getElementById("unsure"); if (u) u.onclick = () => rate(false);
}
function cardsDone() {
  const R = run.result, unsure = run.words.filter((_, i) => !run.known[i]);
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished · Unit ${run.unit} word cards</p><h1>${run.words.length - unsure.length} of ${run.words.length} words you know</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${unsure.length}</b><span>not sure yet</span></div></div>
    ${unsure.length ? `<div class="panel"><p style="margin:0"><b>Not sure yet:</b> ${U.esc(unsure.join(", "))}. These come first when you practise the unit's words.</p></div>` : ""}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="practise">Practise these words</button><button class="btn alt" id="home">Back to home</button></div></div>`;
  const u = run.unit;
  document.getElementById("home").onclick = () => { run = null; saveRun(); location.hash = "#home"; route(); };
  document.getElementById("practise").onclick = () => { run = null; saveRun(); startSmall("vocab", `vocab-u${u}`, `Unit ${u} vocabulary`, P.vocabSet({ unit: u, history })); };
  saveAttempt({ mode: "vocab", text_id: `cards-u${u}`, level_start: null, level_end: null, score: run.words.length - unsure.length, max_score: run.words.length,
                xp: R.xp, seconds: R.seconds, answers: run.words.map((w, i) => ({ skill: "Word card", word: w, unit: u, known: !!run.known[i] })) });
}

/* ---- read aloud and tap-a-word meanings ---- */
function bindSay() { $app.querySelectorAll("[data-say]").forEach(b => b.onclick = () => S.say(b.dataset.say)); }
function showGloss(key) {
  const i = key.indexOf(":"), u = +key.slice(0, i), w = P.unitWords(u).find(x => x.w === key.slice(i + 1));
  if (!w) return;
  let el = document.getElementById("sheet");
  if (!el) { el = document.createElement("div"); el.id = "sheet"; el.className = "sheet"; document.body.appendChild(el); }
  el.innerHTML = `<div class="sheet-in pop" role="dialog" aria-label="Meaning of ${U.esc(w.w)}">
    <div class="row" style="justify-content:space-between"><b class="sw">${U.esc(w.w)}</b><button class="xbtn" id="sclose" aria-label="Close">✕</button></div>
    <p style="margin:0">${U.esc(w.def)}</p><div class="row">${listenBtn(w.w)}<span class="note">Unit ${u} word</span></div></div>`;
  el.hidden = false; S.play("tap");
  el.querySelectorAll("[data-say]").forEach(b => b.onclick = () => S.say(b.dataset.say));
  document.getElementById("sclose").onclick = () => { el.hidden = true; };
}
$app.addEventListener("click", ev => { const b = ev.target.closest(".gw"); if (b) showGloss(b.dataset.gw); });
document.addEventListener("keydown", ev => { const el = document.getElementById("sheet"); if (ev.key === "Escape" && el) el.hidden = true; });

/* ---------------- games ---------------- */
// A game is not paused or kept on the device while it is being played: leaving ends it without saving.
let stopGame = null;
function startGame(game, u) {
  run = { kind: "game", game, unit: u, id: G.gameId(game, u), phase: "intro", t0: Date.now() };
  route(); top();
}
// Speed Read only uses texts the student has already finished in practice.
const readTexts = u => G.speedTexts(u).filter(t => history.some(h => h.mode === "practice" && h.text_id === t.id));
function quitGame() { if (stopGame) stopGame(); stopGame = null; run = null; saveRun(); }
function gameView() {
  const x = G.GAMES[run.game], best = G.bestScore(history, run.id), left = Math.max(0, G.GAME_XP_DAY - G.gameXPToday(history));
  if (run.game === "speed" && !run.wpm) run.wpm = G.lastSpeed(history, run.id);
  const how = run.game === "speed"
    ? `<li>A paragraph from a text you have read flashes up ${G.CHUNK} words at a time. Read every word.</li>
       <li>Then answer one question about it. You can't go back, so concentrate!</li>
       <li>Two right in a row and the words come faster. A wrong answer slows them down.</li>
       <li>${G.SPEED_ROUND} paragraphs. Faster speeds earn more points.</li>`
    : run.game === "rain"
    ? `<li>A meaning falls from the sky. Tap the word that matches it before it reaches the water.</li>
       <li>Catch it high up for more points. A wrong tap loses 5 points.</li>
       <li>Every 5 words you catch, the rain gets faster. From level 3, two meanings fall at once.</li>
       <li>Three meanings in the water and the game ends. A game lasts up to ${G.RAIN_SECONDS / 60} minutes.</li>`
    : `<li>Each train carries a word. Decide if it is a noun, a verb, an adjective or an adverb.</li>
       <li>Tap that station to set the points <b>before</b> the train reaches the junction.</li>
       <li>When more trains come at once, set the points for the train nearest the junction first.</li>
       <li>${G.TRAIN_COUNT} trains. Every 5 right, the trains get faster.</li>`;
  $app.innerHTML = `<div class="narrow pop"><div class="row back"><a href="#home" id="leave">← Back</a><span class="note">${run.phase === "play" ? "Leaving ends this game." : ""}</span></div>
    <p class="eyebrow">Unit ${run.unit} · game</p>
    ${run.phase === "intro" ? `<h1>${x.name}</h1><div class="panel"><ul>${how}</ul></div>
      <div class="stats"><div class="stat"><b>${best || "–"}</b><span>your best</span></div><div class="stat gold"><b>${left}</b><span>game XP left today</span></div></div>
      ${run.game === "speed" ? `<p class="stem">Starting speed (words a minute)</p><div class="row" role="radiogroup">${G.SPEEDS.slice(0, 5).map(w =>
        `<button class="btn small${w === run.wpm ? "" : " alt"}" role="radio" aria-checked="${w === run.wpm}" data-wpm="${w}">${w}</button>`).join("")}</div>
        <p class="note">${G.SPEEDS[0]} is slow and careful. ${G.SPEEDS[3]} is a good reading speed for Checkpoint.</p>` : ""}
      <div class="row"><button class="btn" id="gstart">Start</button></div>`
      : `<div id="gbox"></div>`}</div>`;
  document.getElementById("leave").onclick = ev => { ev.preventDefault(); const u = run.unit; quitGame(); location.hash = "#unit-" + u; route(); top(); };
  const b = document.getElementById("gstart");
  if (b) b.onclick = () => { S.play("tap"); run.phase = "play"; gameView(); };
  $app.querySelectorAll("[data-wpm]").forEach(w => w.onclick = () => { run.wpm = +w.dataset.wpm; S.play("tap"); gameView(); });
  if (run.phase === "play") {
    const play = { rain: G.playRain, train: G.playTrain, speed: G.playSpeed }[run.game];
    stopGame = play(document.getElementById("gbox"), { unit: run.unit, texts: readTexts(run.unit), level: me.level ?? 1, wpm: run.wpm, onEnd: R => {
      stopGame = null; if (!run || run.kind !== "game") return;
      run.result = { ...R, xp: G.gameXP(R.hits, history), best };
      run.phase = "done"; S.play(R.points > best ? "win" : "done"); saveRun(); runView(); top();
    } });
  }
}
function gameDone() {
  const R = run.result, x = G.GAMES[run.game], u = run.unit, record = R.points > R.best;
  const missed = run.game === "speed"
    ? R.words.filter(w => !w.hit).map(w => `<li>${U.esc(w.w)} <b>${U.esc(w.answer)}</b></li>`)
    : run.game === "rain"
    ? [...new Set(R.words.filter(w => !w.hit).map(w => w.w))].map(w => P.unitWords(u).find(v => v.w === w)).filter(Boolean)
        .map(v => `<li><b>${U.esc(v.w)}</b>: ${U.esc(v.def)}</li>`)
    : R.words.filter(w => !w.hit).map(w => `<li><b>${U.esc(w.w)}</b> is ${/^[aeiou]/.test(w.pos) ? "an" : "a"} ${w.pos}</li>`);
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished · Unit ${u} ${x.name}</p><h1>${R.points} points</h1>
    ${record ? `<div class="fb ok winbox"><p class="big">New personal best!</p>${R.best ? `<p>Your old best was ${R.best} points.</p>` : ""}</div>` : R.best ? `<p class="note">Your best is ${R.best} points.</p>` : ""}
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.hits}</b><span>${{ rain: "words caught", train: "trains on time", speed: `of ${R.words.length} right` }[run.game]}</span></div>
      <div class="stat"><b>${R.level}</b><span>${run.game === "speed" ? "top speed (wpm)" : "level reached"}</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    ${R.xp === 0 ? `<p class="note">You have reached today's ${G.GAME_XP_DAY} XP from games. Your points still count for your best score.</p>` : ""}
    ${missed.length ? `<div class="panel"><b>${{ rain: "Words to learn (they come back in your word review)", train: "Words to look at again", speed: "Questions you missed, with the answers" }[run.game]}</b><ul>${missed.join("")}</ul></div>` : ""}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="again">Play again</button><button class="btn alt" id="unit">Back to Unit ${u}</button></div></div>`;
  document.getElementById("again").onclick = () => { const g = run.game; run = null; saveRun(); startGame(g, u); };
  document.getElementById("unit").onclick = () => { run = null; saveRun(); location.hash = "#unit-" + u; route(); top(); };
  saveAttempt({ mode: "vocab", text_id: run.id, level_start: null, level_end: null, score: R.hits, max_score: R.words.length,
                xp: R.xp, seconds: R.seconds, answers: G.gameAnswers(run.game, R, u) });
}

/* ---------------- listening ---------------- */
// One recording, played twice in full like the exam; all questions on one page with a check for the whole task.
// A wrong answer gets a hint and a replay of just that part; a second wrong answer shows the answer.
let audioEl = null, audioFor = null, segEnd = null;
const MAX_PLAYS = 2;
function startListening(id) {
  run = { kind: "listen", id, phase: "q", plays: 0, resp: {}, stage: {}, results: {}, notes: {}, t0: Date.now(), orders: {}, pick: null, xpSoFar: 0 };
  saveRun(); route(); top();
}
function audio() {
  if (!audioEl || audioFor !== run.id) {
    if (audioEl) audioEl.pause();
    audioEl = new Audio(`audio/listening/${run.id}.mp3`); audioFor = run.id; audioEl.preload = "auto";
    audioEl.addEventListener("timeupdate", () => {
      if (segEnd != null && audioEl.currentTime >= segEnd) { audioEl.pause(); segEnd = null; }
      playerUpdate();
    });
    audioEl.addEventListener("ended", () => {
      if (run && run.kind === "listen" && segEnd == null && !audioEl.seg) { run.plays++; saveRun(); }
      segEnd = null; audioEl.seg = false; playerUpdate();
    });
    audioEl.addEventListener("pause", playerUpdate); audioEl.addEventListener("play", playerUpdate);
  }
  return audioEl;
}
function stopAudio() { if (audioEl) { audioEl.pause(); segEnd = null; } }
function playerUpdate() {
  const a = audioEl, btn = document.getElementById("lplay"); if (!a || !btn || !run || run.kind !== "listen") return;
  const playing = !a.paused && !a.seg, left = MAX_PLAYS - run.plays, full = !a.seg;
  const bar = document.getElementById("lbar"), t = document.getElementById("ltime");
  if (bar && full && a.duration) bar.style.width = `${Math.min(100, 100 * a.currentTime / a.duration)}%`;
  if (t && a.duration) t.textContent = `${U.fmtClock(a.currentTime)} / ${U.fmtClock(a.duration)}`;
  btn.disabled = left <= 0 && !playing && !(a.currentTime > 0 && a.currentTime < a.duration && !a.seg);
  btn.innerHTML = playing ? `${PAUSE} Pause` : left <= 0 ? "You have heard it twice" : a.currentTime > 0 && a.currentTime < a.duration && !a.seg ? `${PLAY} Carry on` : `${PLAY} Play (${left === MAX_PLAYS ? "first" : "second"} time)`;
  const n = document.getElementById("lplays"); if (n) n.textContent = `Listen ${Math.min(run.plays + (playing ? 1 : 0), MAX_PLAYS)} of ${MAX_PLAYS}`;
  const c = document.getElementById("check"); if (c) c.disabled = !canCheckListen();
}
const PLAY = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>`;
const PAUSE = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/></svg>`;
function playFull() {
  const a = audio();
  if (!a.paused && !a.seg) return a.pause();
  if (a.seg || a.ended || a.currentTime === 0 || a.currentTime >= a.duration) { if (run.plays >= MAX_PLAYS) return; a.seg = false; segEnd = null; a.currentTime = 0; }
  a.play().catch(() => {}); S.play("tap");
}
function playPart(k) {
  const task = LISTENING.find(t => t.id === run.id), [a, b] = P.cueLines(task, task.qs[k]), span = TIMES[run.id];
  if (!span) return;
  const el = audio(); el.seg = true; el.currentTime = Math.max(0, span[a][0] - 0.2); segEnd = span[b][1] + 0.3; el.play().catch(() => {});
}
const lockedQ = k => !!run.results[k];
function canCheckListen() {
  const task = LISTENING.find(t => t.id === run.id);
  return run.plays >= 1 && task.qs.every((q, k) => lockedQ(k) || (run.resp[k] != null && run.resp[k] !== ""));
}
function listenView() {
  const task = LISTENING.find(t => t.id === run.id), total = task.qs.length;
  let h = `<div class="narrow pop"><p class="eyebrow">Unit ${task.unitNo} listening · ${U.esc(task.part)}</p><h1>${U.esc(task.topic)}</h1>
    <div class="panel"><p style="margin:0">${U.esc(task.instructions)}</p><p class="note">You can hear the recording twice, like in the exam. Read the questions first.</p></div>
    <div class="player"><button class="btn" id="lplay">${PLAY} Play</button><div class="lmeta"><div class="bar"><i id="lbar" style="width:0;background:var(--teal)"></i></div>
      <div class="row" style="justify-content:space-between"><span class="note" id="lplays"></span><span class="note" id="ltime"></span></div></div></div>`;
  if (task.statements) h += `<div class="panel stmts">${task.statements.map(s => `<p style="margin:0">${U.esc(s)}</p>`).join("")}</div>`;
  h += task.qs.map((q, k) => listenQ(task, q, k)).join("");
  const done = task.qs.every((_, k) => lockedQ(k));
  h += `<div class="row">${done ? `<button class="btn" id="lfinish">See my results</button>` : `<button class="btn" id="check" disabled>Check my answers</button>`}
    ${!done && run.plays < 1 ? `<span class="note">Listen once before you check.</span>` : ""}</div></div>`;
  $app.innerHTML = h;
  $app.querySelectorAll("[data-lq]").forEach(b => b.onclick = () => { run.resp[+b.dataset.lq] = +b.dataset.v; S.play("tap"); saveRun(); listenView(); backButton(); });
  $app.querySelectorAll("[data-lg]").forEach(inp => inp.oninput = () => { run.resp[+inp.dataset.lg] = inp.value; saveRun(); playerUpdate(); });
  $app.querySelectorAll("[data-part]").forEach(b => b.onclick = () => playPart(+b.dataset.part));
  document.getElementById("lplay").onclick = playFull;
  const c = document.getElementById("check"); if (c) c.onclick = () => checkListen(task);
  const f = document.getElementById("lfinish"); if (f) f.onclick = () => finishListen(task);
  audio(); playerUpdate();
}
function listenQ(task, q, k) {
  const r = run.results[k], st = run.stage[k] || 0, locked = !!r, resp = run.resp[k];
  let body;
  if (q.type === "gap") {
    const [a, b] = q.stem.split("___");
    body = `<p class="stem lgap">${U.esc(a)}<input type="text" class="gapin${locked ? (r.support === "explained" ? " wrong" : " right") : ""}" data-lg="${k}" value="${U.esc(resp || "")}" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Answer ${k + 1}" ${locked ? "disabled" : ""}>${U.esc(b)}</p>`;
  } else {
    const opts = task.statements ? task.statements.map(s => s.slice(0, 1)) : q.opts, ord = task.statements ? opts.map((_, i) => i) : order(`l${k}`, opts.length);
    const correct = q.answer != null ? q.answer : 0;
    body = `<p class="stem">${U.esc(q.stem)}</p><div class="${task.statements ? "letters-row" : "opts"}">${ord.map((oi, n) => {
      let cls = (task.statements ? "lopt" : "opt") + (resp === oi ? " sel" : "");
      if (locked && oi === correct) cls += " right"; else if (resp === oi && (locked || run.notes[k] === "wrong")) cls += " wrong";
      return `<button class="${cls}" data-lq="${k}" data-v="${oi}" ${locked ? "disabled" : ""}>${task.statements ? U.esc(opts[oi]) : `<span class="k">${"ABCD"[n]}</span><span>${U.esc(opts[oi])}</span>`}</button>`; }).join("")}</div>`;
  }
  let fb = "";
  if (locked && r.support !== "explained") fb = `<div class="fb ok"><p><strong>Correct.</strong> <span class="xpgain">+${r.support === "none" ? P.XP_LISTEN.first : P.XP_LISTEN.hint} XP</span>${run.notes[k] === "spelling" ? ` Check the spelling: <b>${U.esc(q.answers[0])}</b>.` : ""}</p></div>`;
  else if (locked) fb = `<div class="fb info"><p><strong>The answer is "${U.esc(q.type === "gap" ? q.answers[0] : task.statements ? task.statements[q.answer] : q.opts[0])}".</strong></p><p>${U.esc(q.explain)}</p>
    <div class="row">${partBtn(k, "Hear that part again")}</div></div>`;
  else if (st === 1) fb = `<div class="fb bad"><p><strong>Not quite.</strong> ${U.esc(q.hint)}</p><div class="row">${partBtn(k, "Listen to that part again")}</div></div>`;
  return `<div class="qcard lq${locked ? " done" : ""}"><div class="qhead"><span class="tag">${U.esc(q.skill)}</span><span class="qnum">${k + 1} of ${task.qs.length}</span></div>${q.type === "gap" || task.statements ? (task.statements ? body : `${body}`) : body}${fb}</div>`;
}
const partBtn = (k, label) => TIMES[run.id] ? `<button class="btn small alt" data-part="${k}">${PLAY} ${label}</button>` : "";
function checkListen(task) {
  let right = 0, wrong = 0;
  task.qs.forEach((q, k) => {
    if (lockedQ(k)) return;
    const ok = P.listenCorrect(q, run.resp[k]), st = run.stage[k] || 0;
    if (ok) {
      if (q.type === "gap" && P.markGap(q, run.resp[k]) === "spelling") run.notes[k] = "spelling";
      run.results[k] = { skill: "Listening", sub: q.skill, first_try: st === 0, support: st === 0 ? "none" : "hint" }; right++;
    } else if (st === 0) { run.stage[k] = 1; run.notes[k] = "wrong"; wrong++; }
    else { run.results[k] = { skill: "Listening", sub: q.skill, first_try: false, support: "explained" }; wrong++; }
  });
  run.xpSoFar = P.listenXP(Object.values(run.results)) - P.XP_LISTEN.finish;
  S.play(wrong ? (right ? "info" : "bad") : "ok");
  saveRun(); listenView(); backButton();
  const first = $app.querySelector(".fb.bad, .fb.info"); if (first) first.scrollIntoView({ block: "center", behavior: "smooth" });
}
function finishListen(task) {
  stopAudio();
  const results = task.qs.map((_, k) => run.results[k]), bonus = E.streakBonus(history);
  run.result = { results, score: results.filter(r => r.first_try).length, xp: P.listenXP(results) + bonus, bonus, seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; run.xpSoFar = 0; S.play("done"); saveRun(); runView(); top();
}
function listenDone() {
  const task = LISTENING.find(t => t.id === run.id), R = run.result;
  const hot = new Set(task.qs.flatMap(q => { const [a, b] = P.cueLines(task, q); return Array.from({ length: b - a + 1 }, (_, i) => a + i); }));
  const rows = R.results.map((r, k) => `<tr><td>${k + 1}</td><td>${U.esc(task.qs[k].skill)}</td><td><span class="chip ${r.support}">${E.SUPPORT_LABEL[r.support]}</span></td></tr>`).join("");
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished · ${U.esc(task.topic)}</p><h1>${R.score} of ${task.qs.length} right first time</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${task.qs.length}</b><span>right first time</span></div>
      <div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div><div class="stat"><b>${R.results.filter(r => r.support === "explained").length}</b><span>to review</span></div></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept!</strong> That's 2 activities this week: <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    <div class="tbl"><table><thead><tr><th>#</th><th>Skill</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table></div>
    <details class="panel"><summary><b>Read the transcript</b> <span class="note">(the parts with answers are highlighted)</span></summary>
      <div class="transcript">${task.lines.map((l, i) => `<p class="${hot.has(i) ? "hot" : ""}"><b>${U.esc(l[0] === "NARRATOR" ? "Narrator" : l[0][0] + l[0].slice(1).toLowerCase())}:</b> ${U.esc(l[1])}</p>`).join("")}</div></details>
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="home">Back to home</button></div></div>`;
  document.getElementById("home").onclick = () => { run = null; saveRun(); location.hash = "#home"; route(); };
  saveAttempt({ mode: "listening", text_id: task.id, level_start: null, level_end: null, score: R.score, max_score: task.qs.length,
                xp: R.xp, seconds: R.seconds, answers: R.results });
}

/* ---------------- progress & leaderboard ---------------- */
const meTabs = cur => `<div class="tabs" role="tablist">${[["me", "My progress"], ["leaderboard", "Leaderboard"], ["settings", "Settings"]]
  .map(([k, l]) => `<a role="tab" aria-selected="${k === cur}" href="#${k}">${l}</a>`).join("")}</div>`;
const lookStats = () => ({ xp: me ? me.xp_total : 0, missionBadges: P.missionBadges(history).length });
function settingsView() {
  const l = L.getLook(), st = lookStats();
  const seg = (key, opts) => `<div class="seg" role="radiogroup">${opts.map(([v, label]) =>
    `<button role="radio" aria-checked="${l[key] === v}" data-look="${key}" data-v="${v}">${label}</button>`).join("")}</div>`;
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Me</p><h1>Settings</h1></div>${meTabs("settings")}
    <div class="panel"><h3>Light or dark</h3>${seg("mode", [["auto", "Auto"], ["light", "Light"], ["dark", "Dark"]])}
      <p class="note">Auto follows your phone or computer.</p></div>
    <div class="panel"><h3>Colour theme</h3><div class="swatches" role="radiogroup">${L.THEMES.map(t => { const open = L.themeOpen(t, st);
        return `<button class="swatch" role="radio" aria-checked="${l.theme === t.id}" data-look="theme" data-v="${t.id}" ${open ? "" : "disabled"}>
          <span class="chips">${t.colors.map(c => `<i style="background:${c}"></i>`).join("")}</span>${t.name}${open ? "" : `<small>🔒 ${t.need}</small>`}</button>`; }).join("")}</div></div>
    <div class="panel"><h3>Text size</h3>${seg("size", [["m", "Normal"], ["l", "Large"], ["xl", "Extra large"]])}</div>
    <div class="panel"><h3>Font</h3>${seg("font", [["normal", "Normal"], ["easy", "Easy-read"]])}
      <p class="note">Easy-read uses a clear, wide font with more space between lines.</p></div>
    <div class="panel"><h3>Reading texts</h3>${seg("paper", [["off", "White page"], ["on", "Paper"]])}
      <p class="note">Paper puts the reading texts on a soft cream page, which some people find easier on the eyes.</p></div>
    <div class="text"><h2>A sample paragraph</h2><p>Teenagers need between eight and ten hours of sleep a night, but most get around seven. This is how reading texts will look.</p></div>
    <p class="note">Your settings are saved on this device.</p></div>`;
  $app.querySelectorAll("[data-look]").forEach(b => b.onclick = () => { L.setLook({ [b.dataset.look]: b.dataset.v }); S.play("tap"); settingsView(); });
}
function progressView() {
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Me</p><h1>${U.esc(me.name)}</h1></div>
    ${meTabs("me")}
    ${U.trackerHTML(history, me)}</div>`;
}
async function leaderboardView() {
  $app.innerHTML = `<div class="narrow"><p class="note">Loading the leaderboard…</p></div>`;
  let lb; try { lb = await api.leaderboard(session.token); } catch (e) { $app.innerHTML = `<div class="narrow"><p class="err">${U.esc(e.message)}</p></div>`; return; }
  const tabs = [["week", "This week"], ["all", "All time"], ["improved", "Most improved"]];
  let cur = "week";
  const draw = () => {
    $app.innerHTML = `<div class="narrow pop">${meTabs("leaderboard")}
      <div class="hero"><p class="eyebrow">Class ${U.esc(lb.class_code)}</p><h1>Leaderboard</h1>
      <p class="lede">${cur === "week" ? "XP earned since Monday. It starts again every week." : cur === "all" ? "All the XP earned since the start." : "Biggest rise from the first baseline to the latest one."}</p></div>
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${k === cur}" data-k="${k}">${l}</button>`).join("")}</div>
      ${U.boardTable(lb[cur], cur === "improved" ? "gain" : "xp")}</div>`;
    $app.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { cur = b.dataset.k; draw(); });
  };
  draw();
}

/* ---------------- reading runs ---------------- */
function startBaseline() {
  run = { kind: "baseline", phase: "read", part: 0, qi: 0, answers: [], t0: Date.now(), readStart: Date.now(), orders: {}, pick: null };
  saveRun(); route(); top();
}
function startPractice(id) {
  const text = PRACTICE_TEXTS.find(t => t.id === id);
  run = { kind: "practice", textId: id, phase: "read", r: E.newRun(text, me.level ?? 1), t0: Date.now(), readStart: Date.now(),
          orders: {}, pick: null, draft: "", fb: null, xpSoFar: 0 };
  saveRun(); route(); top();
}
function runView() {
  header(); nav(null);
  if (run.phase === "done") return run.kind === "baseline" ? baselineDone() : run.kind === "small" ? smallDone() : run.kind === "cards" ? cardsDone()
    : run.kind === "listen" ? listenDone() : run.kind === "game" ? gameDone() : practiceDone();
  if (run.kind === "game") return gameView();
  if (run.kind === "baseline") baselineView();
  else if (run.kind === "small") smallView();
  else if (run.kind === "cards") cardsView();
  else if (run.kind === "listen") listenView();
  else practiceView();
  backButton();
}
// Leaving an activity part-way pauses it on this device; the home page offers to continue it.
function backButton() {
  if (document.getElementById("leave")) return;
  const box = $app.querySelector(".narrow") || $app;
  box.insertAdjacentHTML("afterbegin", `<div class="row back"><a href="#home" id="leave">← Home</a><span class="note">Your place is saved.</span></div>`);
  document.getElementById("leave").onclick = ev => {
    ev.preventDefault(); stopAudio(); run.pausedAt = Date.now(); saveRun(); run = null; location.hash = "#home"; route(); top();
  };
}
function pausedRun() { const r = loadRun(); return r && r.pausedAt ? r : null; }
function runName(r) {
  if (r.kind === "baseline") return `Baseline reading (text ${r.part + 1} of 3)`;
  if (r.kind === "small") return `${r.label} (question ${r.set.i + 1} of ${r.set.qs.length})`;
  if (r.kind === "listen") return `Listening: ${LISTENING.find(t => t.id === r.id).topic}`;
  if (r.kind === "cards") return `Unit ${r.unit} word cards (card ${r.i + 1} of ${r.words.length})`;
  return U.textTitle(r.textId);
}
function resumeRun() {
  const r = pausedRun(); if (!r) return;
  const away = Date.now() - r.pausedAt;          // the timer does not count time away
  r.t0 += away; if (r.readStart) r.readStart += away; delete r.pausedAt;
  run = r; saveRun(); route(); top();
}
function readGate(paras, onGo, label) {
  const need = E.minReadSeconds(paras);
  const btn = document.getElementById("go");
  const upd = () => {
    const left = need - Math.floor((Date.now() - run.readStart) / 1000);
    if (left > 0) { btn.disabled = true; btn.textContent = `Read carefully… questions open in ${left} s`; }
    else { btn.disabled = false; btn.textContent = label; clearInterval(timerId); }
  };
  upd(); clearInterval(timerId); timerId = setInterval(upd, 500);
  btn.onclick = onGo;
}
function order(key, n) { if (!run.orders[key]) run.orders[key] = E.shuffle(n); return run.orders[key]; }
function optsHTML(q, ord, state) {
  return `<div class="opts" role="radiogroup">${ord.map((oi, n) => {
    let cls = "opt" + (run.pick === oi ? " sel" : "");
    if (state && state.right && run.pick === oi) cls += " right";
    if (state && state.wrong === oi && run.pick === oi) cls += " wrong";
    if (state && state.reveal && oi === 0) cls += " right";
    return `<button class="${cls}" data-o="${oi}" role="radio" aria-checked="${run.pick === oi}" ${state && state.locked ? "disabled" : ""}><span class="k">${"ABCD"[n]}</span><span>${U.esc(q.opts[oi])}</span></button>`;
  }).join("")}</div>`;
}
function bindOpts(after) {
  $app.querySelectorAll(".opt").forEach(b => b.onclick = () => { run.pick = +b.dataset.o; S.play("tap"); saveRun(); after(); backButton(); });
}

/* ---- baseline ---- */
function baselineView() {
  const P = BASELINE[run.part];
  if (run.phase === "read") {
    $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Baseline · text ${run.part + 1} of 3 · read it all first</p>
      ${run.part === 0 ? `<div class="panel"><p style="margin:0">There are no hints in the baseline. Just do your best: it finds the right starting level for you.</p></div>` : ""}
      ${U.textHTML(P)}<div class="row"><button class="btn" id="go">Start the questions</button></div></div>`;
    readGate(P.paras, () => { run.phase = "q"; saveRun(); runView(); top(); }, "Start the questions");
    return;
  }
  const q = P.qs[run.qi], ord = order("b" + run.part + "-" + run.qi, q.opts.length), n = run.part * 4 + run.qi;
  $app.innerHTML = `<div class="qgrid"><div class="qcol">
      <div class="progress">${Array.from({ length: 12 }, (_, i) => `<i class="${i < n ? "ok" : i === n ? "cur" : ""}"></i>`).join("")}</div>
      <div class="qcard pop"><div class="qhead"><span class="tag">${U.esc(q.skill)}</span><span class="qnum">Question ${n + 1} of 12</span></div>
      <p class="stem">${U.esc(q.stem)}</p>${optsHTML(q, ord)}
      <div class="row"><button class="btn" id="next" ${run.pick === null ? "disabled" : ""}>${n === 11 ? "Finish" : "Next"}</button></div></div></div>
    <div class="textcol"><details id="tx"><summary>Read the text again</summary>${U.textHTML(P)}</details></div></div>`;
  if (matchMedia("(min-width:900px)").matches) document.getElementById("tx").open = true;
  bindOpts(baselineView);
  document.getElementById("next").onclick = () => {
    run.answers.push({ skill: q.skill, level: P.level, first_try: run.pick === 0, support: "none" });
    run.pick = null; run.qi++;
    if (run.qi >= P.qs.length) { run.part++; run.qi = 0; run.phase = run.part >= BASELINE.length ? "finish" : "read"; run.readStart = Date.now(); }
    saveRun();
    if (run.phase === "finish") return finishBaseline();
    runView(); top();
  };
}
async function finishBaseline() {
  const score = run.answers.filter(a => a.first_try).length, level = E.placement(score);
  run.result = { score, level, xp: E.baselineXP(score), seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; S.play("done"); saveRun(); runView(); top();
}
async function saveAttempt(payload) {
  const msg = document.getElementById("savemsg");
  try {
    if (!run.saved) { await api.save(session.token, payload); run.saved = true; saveRun(); }
    if (msg) msg.textContent = "Saved.";
    await refresh(); header();
  } catch (e) {
    if (msg) msg.innerHTML = `<span class="err">Not saved yet: ${U.esc(e.message)}</span> <button class="btn small" id="retry">Try again</button>`;
    const r = document.getElementById("retry"); if (r) r.onclick = () => saveAttempt(payload);
  }
}
function baselineDone() {
  const R = run.result;
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Baseline finished</p><h1>You scored ${R.score} out of 12</h1>
    <div class="stats"><div class="stat"><b>${R.score}/12</b><span>score</span></div><div class="stat"><b>${E.LEVELS[R.level]}</b><span>your starting level</span></div>
      <div class="stat gold"><b>+${R.xp}</b><span>XP</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    <div class="panel"><p style="margin:0">Your practice texts will start on the <b>${E.LEVELS[R.level]}</b> version. The platform moves you up or down as you answer.</p></div>
    ${U.resultRows(null, run.answers)}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="home">Go to my home page</button></div></div>`;
  document.getElementById("home").onclick = () => { run = null; saveRun(); location.hash = "#home"; route(); };
  saveAttempt({ mode: "baseline", text_id: "baseline", level_start: 0, level_end: R.level, score: R.score, max_score: 12,
                xp: R.xp, seconds: R.seconds, answers: run.answers });
}

/* ---- practice ---- */
function practiceView() {
  const text = PRACTICE_TEXTS.find(t => t.id === run.textId), r = run.r, T = text.levels[r.level];
  // Unit words are tappable for their meaning, except a word the current question asks about.
  const slotNow = text.slots[r.slot];
  const unit = { no: text.unitNo, skip: slotNow.skill === "Vocabulary in context" ? slotNow.q.map(x => x.stem).join(" ") : "" };
  if (run.phase === "read" || run.phase === "shift") {
    const up = run.shift === "up";
    $app.innerHTML = `<div class="narrow pop">
      ${run.phase === "shift" ? `<div class="fb ${up ? "ok" : "info"}"><p class="big">${up ? "Level up!" : "Let's try a different version"}</p>
        <p>${up ? `You got ${E.UP_AFTER} questions right first time in a row: <span class="xpgain">+${E.XP.levelUp} XP</span>. The next questions use the <b>Harder</b> text, with the same ideas in more difficult language.`
                : `This question is tricky in the ${E.LEVELS[r.level + 1]} text. Here is the <b>${E.LEVELS[r.level]}</b> version, with the same ideas in simpler words. Read it, then try question ${r.slot + 1} again.`}</p></div>`
        : `<p class="eyebrow">${E.LEVELS[r.level]} text · read it all first</p>`}
      ${U.textHTML(T, { unit })}<div class="row"><button class="btn" id="go">Go</button></div></div>`;
    const label = r.slot > 0 || r.results.length ? `Go to question ${r.slot + 1}` : "Start the questions";
    readGate(T.paras, () => { run.phase = "q"; run.shift = null; saveRun(); runView(); top(); }, label);
    return;
  }
  const slot = text.slots[r.slot], q = E.question(text, r), short = q.type === "short";
  const fb = run.fb, locked = !!(fb && (fb.kind === "ok" || fb.kind === "explained"));
  const p = q.para || slot.para;
  let h = `<div class="qgrid"><div class="qcol">
    <div class="progress">${text.slots.map((_, i) => { const x = r.results[i]; return `<i class="${i === r.slot ? "cur" : x ? (x.first_try ? "ok" : "help") : ""}"></i>`; }).join("")}</div>
    <div class="qcard pop"><div class="qhead"><span class="tag">${U.esc(slot.skill)}</span><span class="qnum">Question ${r.slot + 1} of ${text.slots.length} · ${E.LEVELS[r.level]} text</span></div>
    <p class="stem">${U.esc(q.stem)}</p>`;
  if (short) h += `<label class="fld" for="ans" style="font-weight:400"><span class="note">Short answer. Use your own words or words from the text.${q.need > 1 ? ` Give ${q.need} different points.` : ""}</span>
      <textarea id="ans" ${locked ? "disabled" : ""}>${U.esc(run.draft)}</textarea></label>`;
  else h += optsHTML(q, order(r.level + "-" + r.slot, q.opts.length), fb ? { right: fb.kind === "ok", wrong: fb.wrong, reveal: fb.kind === "explained", locked } : null);
  if (fb) h += feedbackHTML(text, q, p, T, unit);
  h += `<div class="row">${locked ? `<button class="btn" id="next">${r.slot === text.slots.length - 1 ? "See my results" : "Next question"}</button>`
                                  : `<button class="btn" id="check">Check answer</button>`}</div>`;
  if (!locked && r.missedRow === 1 && r.stage === 0) h += `<p class="note">Take care: one more wrong answer and you will get extra support.</p>`;
  if (!fb && r.rightRow > 0 && r.level < 2) h += `<p class="note">Right first time in a row: ${r.rightRow} of ${E.UP_AFTER} to move up.</p>`;
  h += `</div></div><div class="textcol"><details id="tx"><summary>Read the text again</summary>${U.textHTML(T, r.stage >= 1 && !locked ? { para: p, unit } : { unit })}</details></div></div>`;
  $app.innerHTML = h;
  if (matchMedia("(min-width:900px)").matches) document.getElementById("tx").open = true;
  bindOpts(practiceView);
  const a = document.getElementById("ans"); if (a) a.oninput = () => { run.draft = a.value; saveRun(); };
  const c = document.getElementById("check"); if (c) c.onclick = () => check(text);
  const n = document.getElementById("next"); if (n) n.onclick = () => next(text);
}
function feedbackHTML(text, q, p, T, unit) {
  const f = run.fb, r = run.r;
  if (f.kind === "ok") return `<div class="fb ok pop"><p><strong>Correct.</strong> ${f.firstTry ? "Right first time." : "Well done for sticking with it."} <span class="xpgain">+${f.xp} XP</span></p></div>`;
  if (f.kind === "explained") return `<div class="fb info pop"><p><strong>Let's look at the answer together.</strong></p><p>${U.esc(q.explain)}</p><p class="note">No XP for this one. Remember the strategy for next time.</p></div>`;
  const msg = f.partial || (f.tooShort ? "Write at least a few words." : q.type === "short" ? "Your answer does not match the text yet." : "That is not the answer.");
  if (f.tooShort) return `<div class="fb bad pop"><p><strong>Too short.</strong> ${U.esc(msg)}</p></div>`;
  if (r.stage === 1) return `<div class="fb bad pop"><p><strong>Not quite.</strong> ${U.esc(msg)}</p><p><b>Hint:</b> ${U.esc(q.hint)}</p></div>`;
  const st = STRATEGY[text.slots[r.slot].skill], para = T.paras.find(x => x[0] === p);
  return `<div class="fb bad pop"><p><strong>Not quite.</strong> ${U.esc(msg)}</p></div>
    <div class="rescue pop"><p class="eyebrow">Read this part again</p>${U.paraHTML(para, q.focus, true, unit)}
    <div class="strat"><b>Strategy: ${U.esc(st.name)}</b><ol>${st.steps.map(s => `<li>${U.esc(s)}</li>`).join("")}</ol></div>
    <p class="note">${r.level > 0 ? `If this answer is wrong too, you will move to the ${E.LEVELS[r.level - 1]} text.` : "Try once more. The highlighted words will help."}</p></div>`;
}
function check(text) {
  const r = run.r, q = E.question(text, r);
  const response = q.type === "short" ? (document.getElementById("ans").value || "") : run.pick;
  if (q.type !== "short" && response === null) return;
  const m = E.mark(q, response);
  if (m.tooShort) { run.fb = { kind: "bad", tooShort: true }; saveRun(); return runView(); }
  const res = E.submit(text, r, m.ok);
  if (res.outcome === "correct") {
    const xp = E.answerXP(r.results[r.slot]); run.xpSoFar += xp;
    run.fb = { kind: "ok", firstTry: res.firstTry, xp }; S.play("ok");
  } else if (res.outcome === "down") {
    run.pick = null; run.draft = ""; run.fb = null; run.phase = "shift"; run.shift = "down"; run.readStart = Date.now(); S.play("info");
    saveRun(); runView(); return top();
  } else if (res.outcome === "explained") {
    run.fb = { kind: "explained" }; S.play("info");
  } else {
    const partial = q.type === "short" && m.hits.length ? `You have ${m.hits.length} good point${m.hits.length > 1 ? "s" : ""}. You need ${q.need} different points.` : null;
    run.fb = { kind: "bad", wrong: run.pick, partial }; S.play("bad");
  }
  saveRun(); runView();
  const el = $app.querySelector(".fb"); if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function next(text) {
  const out = E.advance(text, run.r);
  run.pick = null; run.draft = ""; run.fb = null;
  if (out === "done") { finishPractice(text); return; }
  if (out === "up") { run.xpSoFar += E.XP.levelUp; run.phase = "shift"; run.shift = "up"; run.readStart = Date.now(); S.play("level"); }
  saveRun(); runView(); top();
}
function finishPractice(text) {
  const r = run.r, replay = history.some(h => h.mode === "practice" && h.text_id === text.id);
  const bonus = E.streakBonus(history);
  const xp = E.runXP(r, { replay }) + bonus;
  run.result = { xp, bonus, replay, score: r.results.filter(x => x.first_try).length, seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; run.xpSoFar = 0; S.play("done"); saveRun(); runView(); top();
}
function practiceDone() {
  const text = PRACTICE_TEXTS.find(t => t.id === run.textId), r = run.r, R = run.result;
  const strong = [], practise = [];
  text.slots.forEach((s, i) => (r.results[i] && r.results[i].first_try ? strong : practise).push(s.skill));
  const path = r.path.map(p => E.LEVELS[p.level] + (p.at ? ` (from Q${p.at + 1})` : "")).join(" → ");
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished</p><h1>Well done, ${U.esc(me.name.split(" ").pop())}</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${text.slots.length}</b><span>right first time</span></div>
      <div class="stat"><b>${E.LEVELS[r.level]}</b><span>finished on</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept!</strong> That's 2 texts this week: <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    ${R.replay ? `<p class="note">You have read this text before, so this time earns half XP.</p>` : ""}
    <div class="panel"><p style="margin:0"><b>Strong:</b> ${strong.length ? U.esc(strong.join(", ")) : "Keep going, you will get there."}</p>
      <p style="margin:0"><b>Practise next:</b> ${practise.length ? U.esc(practise.join(", ")) : "Nothing. Try to finish on the Harder text next time."}</p></div>
    ${U.resultRows(text.slots, r.results)}<p class="note">Text path: ${U.esc(path)}</p>
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="home">Back to home</button><a class="btn alt" href="#leaderboard" id="lb">See the leaderboard</a></div></div>`;
  const leave = () => { run = null; saveRun(); };
  document.getElementById("home").onclick = () => { leave(); location.hash = "#home"; route(); };
  document.getElementById("lb").onclick = leave;
  saveAttempt({ mode: "practice", text_id: text.id, level_start: r.levelStart, level_end: r.level, score: R.score, max_score: text.slots.length,
                xp: R.xp, seconds: R.seconds, answers: r.results });
}

route();
