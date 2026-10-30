// Student app: sign in, baseline, adaptive practice, progress tracker, class leaderboard.
import { api, LIVE, getSession, setSession, resetDemo } from "./api.js";
import { PRACTICE_TEXTS, BASELINE, STRATEGY } from "./content.js";
import * as C from "./checks.js";
import * as E from "./engine.js";
import * as U from "./ui.js";
import * as P from "./practice.js";
import * as S from "./sound.js";
import * as Cel from "./celebrate.js";
import { SEQUENCE, UNITS } from "./curriculum.js";
import { VOCAB } from "./vocab.js";
import { LISTENING, listeningFor } from "./listening.js";
import { TIMES, AUDIO_V } from "./listening-times.js";
import * as G from "./games.js";
import * as L from "./look.js";
import * as I from "./icons.js";
import * as W from "./workout.js";
import * as M from "./minitests.js";
import * as X from "./escape.js";
import * as Lab from "./lab.js";
import * as RL from "./rlab.js";
import * as D from "./drill.js";
import * as GL from "./glab.js";

const $app = document.getElementById("app");
L.applyLook();                 // the device's look, also on the sign-in page
const $meta = document.getElementById("meta");
let session = getSession();
let me = null, history = [];
let run = null;              // the reading in progress (practice or baseline), kept on this device
let timerId = null;

const RUN_KEY = () => "ckpt-run-" + (session ? session.username : "");
function saveRun() { if (run && run.kind === "game" && run.phase !== "done") return; try { run ? localStorage.setItem(RUN_KEY(), JSON.stringify(run)) : localStorage.removeItem(RUN_KEY()); } catch (e) {} }
function loadRun() { try { return JSON.parse(localStorage.getItem(RUN_KEY())); } catch (e) { return null; } }
const top = () => window.scrollTo(0, 0);
// An error after a tap (not while a page is drawn) shows the message too, so a stuck screen can be reported.
function oops(e) { if (document.getElementById("oops")) return; const d = document.createElement("div"); d.id = "oops"; d.className = "panel";
  d.style.cssText = "position:fixed;left:12px;right:12px;bottom:84px;z-index:99;box-shadow:0 6px 24px rgba(0,0,0,.25)";
  d.innerHTML = `<p style="margin:0 0 6px"><b>Something went wrong.</b> Tap Reload. If it keeps happening, show your teacher: <span class="err" style="font-family:monospace;font-size:.85em">${U.esc(String(e && e.message || e))}</span></p><button class="btn" id="oops-r">Reload</button>`;
  document.body.appendChild(d); document.getElementById("oops-r").onclick = () => location.reload(); }
window.addEventListener("error", ev => oops(ev.error || ev.message));
window.addEventListener("unhandledrejection", ev => oops(ev.reason));

/* ---------------- header ---------------- */
function header() {
  if (!session || !me) { $meta.innerHTML = ""; return; }
  let h = "";
  if (run && run.kind === "practice" && run.phase !== "done") {
    h += `<div class="meter" aria-label="Text level">${E.LEVELS.slice(0, (PRACTICE_TEXTS.find(t => t.id === run.textId) || { levels: [0, 1, 2] }).levels.length).map((l, i) => `<span class="${i === run.r.level ? "on" : ""}">${l}</span>`).join("")}</div>`;
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
  escTick();
  const el = document.getElementById("clock"); if (!el || !run) return;
  const s = run.kind === "escape" ? (run.play ? X.escapeSeconds(run.play) : 0) : Math.floor((Date.now() - run.t0) / 1000), m = Math.floor(s / 60), r = s % 60;
  const target = { baseline: 15, practice: 20, small: 10, cards: 5, listen: 12, mini: 20, escape: 12, lab: 10, rlab: 10, glab: 12, drill: 6 }[run.kind] || 15;
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
  header(); nav(null);
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
// Any error while drawing a page shows a message with a way out, instead of leaving the page stuck on "Loading…".
async function route() {
  try { await draw(); } catch (e) { crashView(e); }
}
function crashView(e) {
  console.error(e);
  const inRun = !!run;
  $app.innerHTML = `<div class="narrow"><div class="panel"><h2>Sorry, this page didn't load</h2>
    <p>Try again. If it happens again, show your teacher this message:</p>
    <p class="err" style="font-family:monospace;font-size:.85em;word-break:break-word">${U.esc(String(e && e.message || e))}</p>
    <div class="row"><button class="btn" id="cr-again">Try again</button>
    ${inRun ? `<button class="btn alt" id="cr-leave">Leave this activity</button>` : ""}
    <button class="btn alt" id="cr-out">Sign out</button></div></div></div>`;
  document.getElementById("cr-again").onclick = () => location.reload();
  const lv = document.getElementById("cr-leave"); if (lv) lv.onclick = () => { run = null; saveRun(); location.hash = "#home"; location.reload(); };
  document.getElementById("cr-out").onclick = () => { try { localStorage.removeItem(RUN_KEY()); } catch (x) {} setSession(null); session = null; me = null; run = null; location.hash = ""; location.reload(); };
}
async function draw() {
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
  if (view === "lab") return labHubView();
  if (view === "glab") return glabHubView();
  const rv = /^rlab(?:-(\d))?$/.exec(view);
  if (rv) return rlabHubView(rv[1] ? +rv[1] : rlUnitNow());
  const m = /^unit-(\d)(?:\/(\w+))?$/.exec(view);
  if (m) return unitView(+m[1], m[2]);
  return homeView();
}
window.addEventListener("hashchange", () => { if (!run) route(); });

/* ---------------- home ---------------- */
function homeView() {
  const { streak, thisWeek } = E.weeklyStreak(history);
  const check = me.baseline_done ? C.checkDue(history) : null, checkIn = me.baseline_done ? C.daysToCheck(history) : null;
  const first = firstName();
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
    if (check && !(paused && paused.kind === "baseline")) h += `<div class="tcard"><span class="tag gold">New</span><h3>${U.esc(check.title)}</h3>
      <p class="note" style="font-size:1rem">Your half-term reading check: four short texts, from easier to Challenge, with 16 questions and no hints. It shows how far your reading has come. About 20 minutes.</p>
      <div class="row"><button class="btn" id="check">Start the check</button></div></div>`;
    h += workoutCard();
  }
  if (me.baseline_done && GL.GLAB.some(x => !history.some(a => a.text_id === x.id))) h += `<div class="tcard"><span class="tag gold">New</span><h3>Grammar Lab</h3>
      <p class="note" style="font-size:1rem">Grammar missions: solve a mystery and write a news story while you work out the rules yourself.</p>
      <div class="row"><button class="btn" data-glabhub="1">Open the Grammar Lab</button></div></div>`;
  h += quickTiles(review.length);
  if (me.baseline_done) {
    h += `<div class="stats">
      <div class="stat gold"><b>${me.xp_week}</b><span>XP this week</span></div>
      <div class="stat"><b>${U.bandName(history, me.level)}</b><span>reading level</span></div>
      <div class="stat"><b>${streak} wk</b><span>streak</span></div>
      <div class="stat"><b>${me.xp_total}</b><span>XP in total</span></div></div>`;
  }
  h += `<div class="panel goal"><b>This week: ${Math.min(thisWeek, 2)} of 2 activities</b><div class="bar"><i style="width:${Math.min(thisWeek, 2) * 50}%"></i></div>
      <p class="note">Finish 2 activities a week (a reading text, a vocabulary set or a grammar set) to keep your streak and earn a ${E.XP.streakWeek} XP bonus.</p></div>`;
  h += `${!check && checkIn != null ? `<p class="note">Your next Checkpoint check opens in ${checkIn} day${checkIn === 1 ? "" : "s"}.</p>` : ""}
    ${LIVE ? "" : `<p class="note">Demo mode: <button class="linkbtn" style="color:var(--teal)" id="reset">reset the demo data</button></p>`}</div>`;
  $app.innerHTML = h;
  const b = document.getElementById("base"); if (b) b.onclick = () => startBaseline();
  const rr = document.getElementById("resume"); if (rr) rr.onclick = resumeRun;
  const ck = document.getElementById("check"); if (ck) ck.onclick = () => startBaseline(check.id);
  const rs = document.getElementById("reset"); if (rs) rs.onclick = () => { resetDemo(); setSession(null); session = null; me = null; route(); };
  $app.querySelectorAll("[data-wo]").forEach(b => b.onclick = () => startWorkoutItem(workout[+b.dataset.wo]));
  bindActivities();
}

/* ---------------- today's workout and quick tiles ---------------- */
let workout = [];
const AREA_ICON = { drill: "read", baseline: "read", review: "review", text: "read", listen: "listen", lab: "lab", vocab: "words", grammar: "grammar" };
function workoutCard() {
  const fu = P.focusUnit();
  workout = W.workoutPlan(history, fu, { level: E.steadyLevel(history, me.level ?? 1), baselineDone: me.baseline_done });
  const n = workout.filter(i => i.done).length, next = workout.find(i => !i.done);
  return `<div class="tcard workout"><div class="wo-head">${ringSVG(workout)}<div><p class="eyebrow">Today's workout</p>
      <h3>${next ? "Strengthen your weakest areas" : "Workout complete!"}</h3>
      <p class="note">${next ? `${n} of ${workout.length} done. Your weakest areas come first.` : "Great work. A new workout is ready tomorrow."}</p></div></div>
    <ol class="wo-list">${workout.map(it => `<li class="${it.done ? "done" : it === next ? "next" : ""}">${I.tile(it.kind === "game" ? it.game : AREA_ICON[it.kind], "s")}
      <span>${U.esc(it.label)}</span>${it.done ? `<span class="wo-tick" aria-label="done">${TICK}</span>` : ""}</li>`).join("")}</ol>
    ${next ? `<button class="btn go" data-wo="${workout.indexOf(next)}">${n ? "Continue workout" : "Start workout"}</button>` : ""}</div>`;
}
function ringSVG(items) {
  const n = items.length, gap = 16, seg = 360 / n, r = 42;
  const pt = a => [50 + r * Math.sin(a * Math.PI / 180), 50 - r * Math.cos(a * Math.PI / 180)].map(v => v.toFixed(1)).join(" ");
  const arcs = items.map((it, k) => { const a0 = k * seg + gap / 2, a1 = (k + 1) * seg - gap / 2;
    return `<path d="M${pt(a0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${pt(a1)}"${it.done ? ' class="on"' : ""}/>`; }).join("");
  return `<div class="ring"><svg viewBox="0 0 100 100" aria-hidden="true">${arcs}</svg>${I.tile("workout", "m")}</div>`;
}
function startWorkoutItem(it) {
  if (!it) return;
  const u = P.focusUnit();
  if (it.kind === "baseline") return startBaseline();
  if (it.kind === "review") return startSmall("vocab", "vocab-review", "Word review", P.vocabSet({ review: true, history, tier: P.tierFor(history) }));
  if (it.kind === "text") return startPractice(it.id);
  if (it.kind === "drill") return startDrill(it.skill);
  if (it.kind === "listen") return startListening(it.id);
  if (it.kind === "lab") return startLab(it.id);
  if (it.kind === "vocab") return startSmall("vocab", `vocab-u${u}`, `Unit ${u} vocabulary`, P.vocabSet({ unit: u, history, tier: P.tierFor(history) }));
  if (it.kind === "grammar") return startPoint(it.point);
  if (it.kind === "game") return startGame(it.game, u);
}
function quickTiles(due) {
  const fu = P.focusUnit(), m = P.mission(fu, history), sc = W.areaScores(history, E.steadyLevel(history, me.level ?? 1)).overall;
  const best = Math.max(0, ...Object.keys(G.GAMES).map(g => G.bestScore(history, G.gameId(g, fu))));
  const t = (href, ic, title, note) => `<a class="qtile" href="${href}">${I.tile(ic, "m")}<b>${title}</b><span class="note">${note}</span></a>`;
  return `<div class="qtiles">${t(`#unit-${fu}`, I.unitIcon(fu), `Unit ${fu}`, `Mission ${m.steps.filter(x => x.done).length} of ${m.steps.length}`)}
    ${t("#review", "review", "Review", due ? `${due} word${due > 1 ? "s" : ""} due` : "Nothing due")}
    ${t("#games", "games", "Games", best ? `Best ${best} points` : "Play and practise")}
    ${t("#me", "stats", "My stats", sc == null ? "Score: not yet" : `Score ${sc}`)}</div>`;
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
  if (texts.length) secs.push({ key: "read", label: "Reading", html: `<div class="usec">${me.baseline_done ? "" : `<p class="note">Take the baseline on the Home page first. It sets your reading level.</p>`}
      <div class="tiles">${RL.RLAB_UNITS.includes(u) ? aTile("lab", `data-rlabhub="${u}"`, "Reading Lab", "Beat the tricks in Checkpoint reading: 8 short missions") : ""}${texts.map(t => aTile("read", `data-text="${t.id}" ${me.baseline_done ? "" : "disabled"}`, t.topic, done.has(t.id) ? "Done before: half XP this time" : t.blurb, done.has(t.id))).join("")}</div>
      </div>` });
  if (listeningFor(u).length) secs.push({ key: "listen", label: "Listening", html: `<div class="usec"><div class="tiles">${aTile("lab", "data-labhub", "Listening Lab", "Learn the examiner's tricks: 6 short missions")}${gameTile("dodge", u)}${listeningFor(u).map(t =>
      aTile("listen", `data-listen="${t.id}"`, t.topic, `${t.part} · ${done.has(t.id) ? "Done before" : t.blurb}`, done.has(t.id))).join("")}</div></div>` });
  secs.push({ key: "words", label: "Words", html: `<div class="usec"><div><b>${vm.mastered} of ${vm.total} words learned</b><br><span class="note">${lists}</span>
        <div class="bar" style="margin-top:6px"><i style="width:${Math.round(100 * vm.mastered / vm.total)}%;background:var(--teal)"></i></div></div>
      <div class="tiles">${aTile("words", `data-vocab="${u}"`, "Practise 10 words", "Questions on the words you need most")}
        ${aTile("cards", `data-cards="${u}"`, "Word cards", "Meet the words and hear them")}${aTile("family", `data-family="${u}"`, "Word families", "Choose the right form of the word")}</div></div>` });
  const glabs = GL.GLAB.filter(x => x.unit === u);
  secs.push({ key: "grammar", label: "Grammar", html: `<div class="usec">${glabs.length ? `<div class="tiles">${glabs.map(x => aTile("grammar", `data-glab="${x.id}"`, `Grammar Lab: ${x.title}`, `New · ${x.point} ${x.short}. Work out the rule, then use it.`, history.some(h => h.text_id === x.id))).join("")}</div>` : ""}${P.unitGrammar(u).map(g => { const m = P.grammarMastery(g.id, history), gl = GL.glabForPoint(g.id);
        return `<div class="urow">${I.tile("grammar", "s")}<div><b>${g.id} ${U.esc(g.title)}</b><br><span class="note">${g.code ? g.code + " · " : ""}${m == null ? "Not tried yet" : m + "% right first time"}</span></div>
          <span class="row" style="gap:6px;flex-wrap:nowrap">${gl ? `<button class="btn small" data-glab="${gl.id}">Lab</button>` : ""}<button class="btn small alt" data-gram="${g.id}">Practise</button></span></div>`; }).join("")}
      <div class="row"><button class="btn small" data-gramunit="${u}">Mixed quiz: all of Unit ${u}</button></div></div>` });
  secs.push({ key: "games", label: "Games", html: gamesHTML(u) });
  return secs;
}
// An activity tile: a coloured header with the icon, then the title and a short note. `attrs` makes it start the activity.
function aTile(ic, attrs, title, note, done = false) {
  return `<button class="atile" style="--hue:${I.hue(ic)}" ${attrs}><span class="ahead">${I.icon(ic, 34)}${done ? `<span class="adone" aria-label="done">${TICK}</span>` : ""}</span>
    <span class="abody"><b>${U.esc(title)}</b><span class="note">${U.esc(note)}</span></span></button>`;
}
const GAME_GROUPS = [["Words", ["rain", "train"]], ["Reading", ["speed"]], ["Listening", ["dodge"]]];
function gameTile(g, u) {
  const x = G.GAMES[g], best = G.bestScore(history, G.gameId(g, u)), locked = g === "speed" && !readTexts(u).length;
  return aTile(g, `data-game="${g}" data-unit="${u}" ${locked ? "disabled" : ""}`, x.name,
    locked ? "Finish a reading text in this unit first" : best ? `Your best: ${best} points` : x.blurb);
}
function escapeTile(u) {
  if (!X.ESCAPES[u]) return "";
  const best = X.bestEscape(history, u);
  return aTile("escape", `data-escape="${u}"`, `Escape room: ${X.ESCAPES[u].title}`, best != null ? `Your best escape: ${U.fmtTime(best)}` : "Solve word, reading and grammar puzzles to get out");
}
function gamesHTML(u, grouped = false) {
  const groups = GAME_GROUPS.map(([name, gs]) => [name, gs.filter(g => g !== "speed" || G.speedTexts(u).length)]).filter(([, gs]) => gs.length);
  if (!grouped) return `<div class="usec"><div class="tiles">${escapeTile(u)}${groups.flatMap(([, gs]) => gs).map(g => gameTile(g, u)).join("")}</div></div>`;
  return (X.ESCAPES[u] ? `<h3 class="ghead">Escape room</h3><div class="tiles">${escapeTile(u)}</div>` : "")
    + groups.map(([name, gs]) => `<h3 class="ghead">${name}</h3><div class="tiles">${gs.map(g => gameTile(g, u)).join("")}</div>`).join("");
}
const lastTab = {};
const TAB_ICON = { mission: "mission", read: "read", listen: "listen", words: "words", grammar: "grammar", games: "games" };
function unitCard(u, tab) {
  const secs = unitSections(u), cur = secs.find(x => x.key === tab) || secs[0], st = P.unitStatus(u);
  lastTab[u] = cur.key;
  return `<div class="tcard unit">
    <div class="row uhead">${I.tile(I.unitIcon(u), "m")}<h3>${U.esc(P.unitTitle(u))}</h3><span class="chip ${STATUS[st][1]}">${STATUS[st][0]}</span></div>
    <div class="utabs" role="tablist" aria-label="Unit ${u} sections">${secs.map(x => `<a role="tab" href="#unit-${u}/${x.key}" aria-selected="${x === cur}">${I.icon(TAB_ICON[x.key], 16)}${x.label}</a>`).join("")}</div>
    <div role="tabpanel" aria-label="${cur.label}">${cur.html}</div></div>`;
}
const TICK = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const STEP_ICON = { cards: "cards", read: "read", listen: "listen", vocab: "words", family: "family", grammar: "grammar", boss: "boss" };
function missionHTML(u) {
  const m = P.mission(u, history), n = m.steps.filter(s => s.done).length;
  return `<div class="mission${m.complete ? " won" : ""}"><div class="row" style="justify-content:space-between"><p class="eyebrow">Unit ${u} mission · ${n} of ${m.steps.length} steps</p>
      ${m.complete ? `<span class="chip none">Badge won</span>` : ""}</div>
    <div class="mbar" aria-hidden="true"><i style="width:${Math.round(100 * n / m.steps.length)}%"></i></div>
    <ol class="msteps">${m.steps.map((s, k) => `<li class="${s.done ? "done" : s.locked ? "locked" : m.next === s ? "next" : ""}"><span class="mico">${I.tile(STEP_ICON[s.key] || "mission", "s")}${s.done ? `<span class="mtick">${TICK}</span>` : ""}</span>
      <div><b>${U.esc(s.label)}</b><br><span class="note">${U.esc(s.detail)}</span></div>
      ${!s.done && !s.locked ? `<button class="btn small${m.next === s ? "" : " alt"}" data-step="${s.key}" data-unit="${u}">${s.key === "boss" ? "Start" : "Go"}</button>` : ""}</li>`).join("")}</ol>
    <p class="note">${m.complete ? `You won the <b>${U.esc(m.badge)}</b> badge.` : `Finish the final challenge to win the <b>${U.esc(m.badge)}</b> badge and +${P.BOSS_BONUS} XP.`}</p></div>
    ${miniCard(u, m.complete)}`;
}
// The unit checkpoint: the gate on the Road to Checkpoint. Always open; best taken after the mission.
function miniCard(u, missionDone) {
  const T = M.MINI[u]; if (!T) return "";
  const best = M.miniBest(u, history), passed = best != null && best >= M.MINI_PASS;
  return `<div class="minicard${passed ? " won" : ""}">${I.tile("check", "m")}<div><p class="eyebrow">Unit checkpoint</p><b>${U.esc(T.title)}</b>
      <p class="note">${passed ? `Passed with ${Math.round(best * 100)}%. The gate on your Road to Checkpoint is open.`
        : `16 questions: reading, listening, vocabulary and grammar, with no hints. Score ${M.MINI_PASS * 100}% to open the gate on your Road to Checkpoint.${best != null ? ` Best so far ${Math.round(best * 100)}%.` : missionDone ? "" : " Best taken after the mission."}`}</p></div>
    <button class="btn small${passed ? " alt" : ""}" data-mini="${u}">${passed ? "Try again" : best != null ? "Try again" : "Start"}</button></div>`;
}
function missionStep(key, u) {
  if (key === "cards") return startCards(u);
  if (key === "vocab") return startSmall("vocab", `vocab-u${u}`, `Unit ${u} vocabulary`, P.vocabSet({ unit: u, history, tier: P.tierFor(history) }));
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
    return `<a class="pstep ${st}${e.unit === fu ? " focus" : ""}" href="#unit-${e.unit}"><span class="dot">${I.icon(I.unitIcon(e.unit), 18)}</span><div><b>Unit ${e.unit}: ${U.esc(UNITS[e.unit].title)}</b> <span class="note">${e.weeks}${isNow ? " · now" : ""}</span>
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
    <p class="lede">Games use the words and texts from the unit you choose, and Trap Dodger uses the Listening Lab clips. You can earn up to ${G.GAME_XP_DAY} XP a day from games.</p></div>
    <div class="tabs" role="tablist" aria-label="Unit">${SEQUENCE.filter(e => e.kind === "unit").map(e => `<button role="tab" aria-selected="${e.unit === u}" data-gu="${e.unit}">Unit ${e.unit}</button>`).join("")}</div>
    <h2>${U.esc(P.unitTitle(u))}</h2>${gamesHTML(u, true)}</div>`;
  $app.querySelectorAll("[data-gu]").forEach(b => b.onclick = () => { gamesUnit = +b.dataset.gu; S.play("tap"); gamesView(); });
  bindActivities();
}
let gamesUnit = null;
function bindActivities() {
  $app.querySelectorAll("[data-text]").forEach(btn => btn.onclick = () => startPractice(btn.dataset.text));
  $app.querySelectorAll("[data-vocab]").forEach(btn => btn.onclick = () => { const u = +btn.dataset.vocab;
    startSmall("vocab", `vocab-u${u}`, `Unit ${u} vocabulary`, P.vocabSet({ unit: u, history, tier: P.tierFor(history) })); });
  $app.querySelectorAll("[data-review]").forEach(btn => btn.onclick = () =>
    startSmall("vocab", "vocab-review", "Word review", P.vocabSet({ review: true, history, tier: P.tierFor(history) })));
  $app.querySelectorAll("[data-gram]").forEach(btn => btn.onclick = () => startPoint(btn.dataset.gram));
  $app.querySelectorAll("[data-listen]").forEach(btn => btn.onclick = () => startListening(btn.dataset.listen));
  $app.querySelectorAll("[data-lab]").forEach(btn => btn.onclick = () => startLab(btn.dataset.lab));
  $app.querySelectorAll("[data-labhub]").forEach(btn => btn.onclick = () => { location.hash = "#lab"; });
  $app.querySelectorAll("[data-rlab]").forEach(btn => btn.onclick = () => startRLab(btn.dataset.rlab, +(btn.dataset.ru || rlUnitNow())));
  $app.querySelectorAll("[data-glab]").forEach(btn => btn.onclick = () => startGLab(btn.dataset.glab));
  $app.querySelectorAll("[data-glabhub]").forEach(btn => btn.onclick = () => { location.hash = "#glab"; });
  $app.querySelectorAll("[data-rlabhub]").forEach(btn => btn.onclick = () => { location.hash = `#rlab-${btn.dataset.rlabhub}`; });
  $app.querySelectorAll("[data-cards]").forEach(btn => btn.onclick = () => startCards(+btn.dataset.cards));
  $app.querySelectorAll("[data-family]").forEach(btn => btn.onclick = () => { const u = +btn.dataset.family;
    startSmall("vocab", `family-u${u}`, `Unit ${u} word families`, P.familySet(u)); });
  $app.querySelectorAll("[data-game]").forEach(btn => btn.onclick = () => startGame(btn.dataset.game, +btn.dataset.unit));
  $app.querySelectorAll("[data-escape]").forEach(btn => btn.onclick = () => startEscape(+btn.dataset.escape));
  $app.querySelectorAll("[data-step]").forEach(btn => btn.onclick = () => missionStep(btn.dataset.step, +btn.dataset.unit));
  $app.querySelectorAll("[data-mini]").forEach(btn => btn.onclick = () => startMini(+btn.dataset.mini));
  $app.querySelectorAll("[data-gramunit]").forEach(btn => btn.onclick = () => { const u = +btn.dataset.gramunit;
    startSmall("grammar", `grammar-u${u}`, `Unit ${u} grammar quiz`, P.grammarSet({ unit: u, tier: P.tierFor(history) })); });
}

/* ---------------- vocabulary and grammar sets ---------------- */
function startSmall(sub, textId, label, qs, extra = {}) {
  run = { kind: "small", sub, textId, label, set: P.newSet(qs), phase: "q", t0: Date.now(), orders: {}, pick: null, fb: null, xpSoFar: 0,
          draft: "", tiles: [], match: null, ...extra };
  prepQuestion(); saveRun(); route(); top();
}
function startPoint(id) {
  const g = P.grammarPoint(id);
  startSmall("grammar", `grammar-${g.id}`, `${g.id} ${g.title}`, P.grammarSet({ point: g.id, tier: P.tierFor(history) }), { notice: { ...P.noticeTask(g.id), result: null } });
}
function startBoss(u) {
  startSmall("vocab", `boss-u${u}`, `Unit ${u} final challenge`, P.bossSet(u), { boss: u });
}
function stemHTML(stem) { return U.esc(stem).replaceAll("___", '<span class="gap">______</span>'); }
const SPEAKER = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const listenBtn = (text, label = "Listen") => S.canSpeak ? `<button class="btn small alt say" type="button" data-say="${U.esc(text)}">${SPEAKER} ${label}</button>` : "";
function tagOf(q) {
  if (q.kind === "match") return "Vocabulary · match";
  if (q.kind === "vocab") return q.type === "type" ? "Vocabulary · type the word" : q.type === "paraphrase" ? "Vocabulary · same meaning" : "Vocabulary";
  if (q.kind === "family") return "Word family";
  const v = { tap: " · find the mistake", tiles: " · build it", type: " · type it", fix: " · correct it" }[q.variant] || "";
  return `Grammar ${q.point}${v}`;
}
const answerText = q => q.variant === "tiles" ? q.answer.join(" ") : q.variant === "tap" ? q.fixed : q.opts[0];
function smallView() {
  if (run.notice && run.notice.result !== "done") return noticeView();
  const set = run.set, q = set.qs[set.i], fb = run.fb, locked = !!(fb && (fb.kind === "ok" || fb.kind === "reveal"));
  let h = `<div class="narrow pop"><p class="eyebrow">${U.esc(run.label)}</p>
    <div class="progress">${set.qs.map((_, i) => { const r = set.results[i]; return `<i class="${i === set.i ? "cur" : r ? (r.first_try ? "ok" : "help") : ""}"></i>`; }).join("")}</div>
    ${set.moved && set.moved.at === set.i ? `<div class="fb ${set.moved.up ? "ok" : "info"} pop tiermove"><p><strong>${set.moved.up ? `Level up: ${P.TIERS[set.moved.tier]} questions!` : `Let's try some ${P.TIERS[set.moved.tier]} questions`}</strong> ${set.moved.up ? `${P.TIER_UP} right first time in a row. The next questions are harder, with more XP.` : "These give you a little more help. Get 3 right in a row to move back up."}</p></div>` : ""}
    <div class="qcard"><div class="qhead"><span class="tag">${U.esc(tagOf(q))}</span>${q.extra ? `<span class="chip tier t${q.extra}">New ${q.extra === 2 ? "C1" : "B2"} word</span>` : q.tier ? `<span class="chip tier t${q.tier}">${P.TIERS[q.tier]}</span>` : ""}<span class="qnum">Question ${set.i + 1} of ${set.qs.length}</span></div>`;
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
  const n = q.answer.replace(/[^a-z]/gi, "").length, letters = q.letters || "full", gram = q.kind === "grammar";
  return `<p class="stem">${stemHTML(q.stem)}</p>
    ${q.clue ? `<p class="clue"><b>${U.esc(q.clueLabel || "Meaning")}:</b> ${U.esc(q.clue)}</p>` : ""}
    ${letters === "full" ? `<p class="letters"><span aria-hidden="true">${U.esc(P.letterBlanks(q.answer))}</span> <span class="note">(${n} letters, starts with "${U.esc(q.answer[0])}")</span></p>`
      : letters === "first" ? `<p class="letters"><span class="note">Starts with "${U.esc(q.answer[0])}"</span></p>` : ""}
    <label class="fld" for="typed"><span class="note">${gram ? "Type the missing words." : "Type the missing word."}</span>
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
  } else prepQuestion();
  saveRun(); runView(); top();
  if (run.phase === "done") run.result.win ? Cel.big({ icon: "🏅", title: `Mission complete, ${firstName()}!`, sub: `${P.MISSION_BADGES[run.boss]} badge`, xp: run.result.xp }) : Cel.set(run.result.xp);
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
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept, ${U.esc(firstName())}!</strong> That's 2 activities this week: <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
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
    if (run.i >= run.words.length) { run.phase = "done"; run.xpSoFar = 0;
      run.result = { xp: run.words.length + 5, seconds: Math.round((Date.now() - run.t0) / 1000) }; }
    saveRun(); runView(); top(); if (run.phase === "done") Cel.set(run.result.xp); };
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
  document.getElementById("practise").onclick = () => { run = null; saveRun(); startSmall("vocab", `vocab-u${u}`, `Unit ${u} vocabulary`, P.vocabSet({ unit: u, history, tier: P.tierFor(history) })); };
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
$app.addEventListener("click", ev => { const b = ev.target.closest(".gw"); if (b) b.dataset.gt ? showTerm(b.dataset.gt) : showGloss(b.dataset.gw); });
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
    : run.game === "dodge"
    ? `<li>Read the question and the four bubbles. Then listen to the clip.</li>
       <li>Pop the bubble with the answer before it floats away. The other bubbles are traps: words you hear that are <b>not</b> the answer.</li>
       <li>Pop early for more points, but a trap or an answer that gets away costs one of your ${G.DODGE_LIVES} lives.</li>
       <li>${G.DODGE_ROUNDS} clips from the Listening Lab. Every 2 right, the clips get harder and the bubbles faster.</li>`
    : run.game === "rain"
    ? `<li>A meaning falls from the sky. Tap the word that matches it before it reaches the water.</li>
       <li>Catch it high up for more points. A wrong tap loses 5 points.</li>
       <li>Every 5 words you catch, the rain gets faster. From level 3, two meanings fall at once.</li>
       <li>Three meanings in the water and the game ends. A game lasts up to ${G.RAIN_SECONDS / 60} minutes.</li>
       ${P.tierFor(history) ? `<li>You're a strong reader, so <b>${P.tierFor(history) === 2 ? "Stretch and Challenge" : "Stretch"}</b> words fall too. They are marked on the raindrop.</li>` : ""}`
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
    const play = { rain: G.playRain, train: G.playTrain, speed: G.playSpeed, dodge: G.playDodge }[run.game];
    stopGame = play(document.getElementById("gbox"), { unit: run.unit, wordTier: P.tierFor(history), tier: Lab.labStartLevel(history, P.tierFor(history)), seen: G.dodgeSeen(history), missed: G.dodgeMissed(history), texts: readTexts(run.unit), level: Math.min(2, E.steadyLevel(history, me.level ?? 1)), wpm: run.wpm, onEnd: R => {
      stopGame = null; if (!run || run.kind !== "game") return;
      run.result = { ...R, xp: G.gameXP(R.hits, history), best };
      run.phase = "done"; saveRun(); runView(); top(); Cel.set(run.result.xp);
    } });
  }
}
function gameDone() {
  const R = run.result, x = G.GAMES[run.game], u = run.unit, record = R.points > R.best;
  const caught = run.game === "dodge" ? Object.entries(R.words.filter(w => !w.hit).reduce((c, w) => (c[w.trap] = (c[w.trap] || 0) + 1, c), {})).sort((a, b) => b[1] - a[1]) : [];
  const missed = run.game === "dodge"
    ? R.words.filter(w => !w.hit).map(w => `<li>${U.esc(w.stem)} <b>${U.esc(w.answer)}</b>${w.picked ? ` <span class="note">(you popped “${U.esc(w.picked)}”)</span>` : ""}</li>`)
    : run.game === "speed"
    ? R.words.filter(w => !w.hit).map(w => `<li>${U.esc(w.w)} <b>${U.esc(w.answer)}</b></li>`)
    : run.game === "rain"
    ? [...new Set(R.words.filter(w => !w.hit).map(w => w.w))].map(w => P.unitWords(u).find(v => v.w === w)).filter(Boolean)
        .map(v => `<li><b>${U.esc(v.w)}</b>: ${U.esc(v.def)}</li>`)
    : R.words.filter(w => !w.hit).map(w => `<li><b>${U.esc(w.w)}</b> is ${/^[aeiou]/.test(w.pos) ? "an" : "a"} ${w.pos}</li>`);
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished · Unit ${u} ${x.name}</p><h1>${R.points} points</h1>
    ${record ? `<div class="fb ok winbox"><p class="big">New personal best!</p>${R.best ? `<p>Your old best was ${R.best} points.</p>` : ""}</div>` : R.best ? `<p class="note">Your best is ${R.best} points.</p>` : ""}
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.hits}</b><span>${{ rain: "words caught", train: "trains on time", speed: `of ${R.words.length} right`, dodge: `of ${R.words.length} clips right` }[run.game]}</span></div>
      <div class="stat"><b>${R.level}</b><span>${run.game === "speed" ? "top speed (wpm)" : "level reached"}</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    ${R.xp === 0 ? `<p class="note">You have reached today's ${G.GAME_XP_DAY} XP from games. Your points still count for your best score.</p>` : ""}
    ${caught.length ? `<div class="panel"><b>Traps that caught you</b><ul>${caught.map(([t, n]) => `<li>🪤 ${U.esc(t === "prime" ? "Not reading the question carefully" : Lab.TRAPS[t].name)} × ${n}</li>`).join("")}</ul>
      ${caught[0][0] !== "prime" ? `<p class="note">The Listening Lab mission “${U.esc(Lab.missionForTrap(caught[0][0]).title)}” shows how to beat this trap.</p>` : ""}</div>` : ""}
    ${missed.length ? `<div class="panel"><b>${{ rain: "Words to learn (they come back in your word review)", train: "Words to look at again", speed: "Questions you missed, with the answers", dodge: "Clips you missed, with the answers (they come back in your next games)" }[run.game]}</b><ul>${missed.join("")}</ul></div>` : ""}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="again">Play again</button><button class="btn alt" id="unit">Back to Unit ${u}</button></div></div>`;
  document.getElementById("again").onclick = () => { const g = run.game; run = null; saveRun(); startGame(g, u); };
  document.getElementById("unit").onclick = () => { run = null; saveRun(); location.hash = "#unit-" + u; route(); top(); };
  saveAttempt({ mode: "vocab", text_id: run.id, level_start: null, level_end: null, score: R.hits, max_score: R.words.length,
                xp: R.xp, seconds: R.seconds, answers: G.gameAnswers(run.game, R, u) });
}

/* ---------------- escape room ---------------- */
// Three rooms; in each, tap an object to open a puzzle. Each puzzle solved shows one part of the lock code.
// Wrong answers, hints and wrong codes add time instead of ending the game.
function startEscape(u) {
  run = { kind: "escape", unit: u, game: X.makeEscape(u, P.tierFor(history)), play: null, phase: "intro", t0: Date.now(), fb: null, msg: null };
  saveRun(); route(); top();
}
const DIAL = { letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", digits: "0123456789" };
// A small night picture of each room (fixed colours: it is dark inside the museum in both themes).
function escPic(kind) {
  const door = (x, lock) => `<rect x="${x}" y="22" width="38" height="58" rx="3" fill="#3B2A1E" stroke="#6B4A2E" stroke-width="2"/><circle cx="${x + 31}" cy="52" r="2.5" fill="#C9A24A"/>
    ${lock ? `<rect x="${x + 12}" y="44" width="14" height="12" rx="2" fill="#C9A24A"/><path d="M${x + 14} 44v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#C9A24A" stroke-width="2"/>` : ""}`;
  const parts = {
    vocab: `<rect x="30" y="50" width="120" height="30" rx="3" fill="#2E3E52"/><rect x="30" y="46" width="120" height="6" fill="#41556E"/>
      <rect x="44" y="28" width="22" height="16" fill="#41556E"/><rect x="70" y="34" width="14" height="10" fill="#8B5E3C"/>
      <rect x="180" y="58" width="34" height="22" fill="#5A4632"/><text x="186" y="72" font-size="8" fill="#C9B79A" font-family="sans-serif">LOST</text>${door(250, true)}`,
    reading: `<rect x="24" y="24" width="40" height="30" fill="#3A2F22" stroke="#C9A24A" stroke-width="3"/><path d="M28 50l10-12 8 8 6-6 8 10z" fill="#4B6A57"/>
      <rect x="80" y="20" width="30" height="38" fill="#3A2F22" stroke="#C9A24A" stroke-width="3"/><circle cx="95" cy="36" r="8" fill="#7A5A3A"/>
      <rect x="128" y="62" width="70" height="6" fill="#6B4A2E"/><rect x="140" y="56" width="18" height="6" fill="#E8E0CC"/>
      <rect x="236" y="38" width="56" height="42" rx="4" fill="#4A5563" stroke="#7E8A99" stroke-width="2"/><circle cx="264" cy="59" r="10" fill="none" stroke="#C9D3DC" stroke-width="3"/><path d="M264 59l5-5" stroke="#C9D3DC" stroke-width="2"/>`,
    grammar: `<rect x="20" y="22" width="80" height="58" fill="none" stroke="#6B4A2E" stroke-width="3"/><path d="M20 42h80M20 62h80" stroke="#6B4A2E" stroke-width="3"/>
      <rect x="28" y="30" width="14" height="12" fill="#8B5E3C"/><rect x="60" y="50" width="22" height="12" fill="#5A4632"/>
      <rect x="120" y="54" width="44" height="26" fill="#8B5E3C" stroke="#5A3E26" stroke-width="2"/><path d="M120 54l44 26M164 54l-44 26" stroke="#5A3E26" stroke-width="2"/>
      <rect x="172" y="30" width="16" height="12" fill="#F2D86B" transform="rotate(-8 180 36)"/>${door(250, false)}<rect x="236" y="40" width="10" height="16" rx="2" fill="#4A5563"/>`,
    exit: `${door(141, false)}<path d="M143 24h34v56h-34z" fill="#F2D86B" opacity=".25"/><path d="M160 80l-60 10h120z" fill="#F2D86B" opacity=".2"/>
      <text x="138" y="16" font-size="10" fill="#9FD6B6" font-family="sans-serif" font-weight="700">EXIT</text>`
  };
  return `<svg class="escpic" viewBox="0 0 320 90" role="img" aria-label="The room in the dark"><rect width="320" height="90" fill="#141C28"/>
    <rect x="0" y="80" width="320" height="10" fill="#202A38"/><circle cx="300" cy="14" r="6" fill="#E6E2C8" opacity=".7"/>${parts[kind] || ""}</svg>`;
}
function escHud(pl) {
  const left = X.guardLeft(pl), keys = pl.keys.filter(k => k === true).length;
  return `<div class="eschud"><span id="guard" class="${left < 60 ? "near" : ""}">${guardText(left)}</span>
    <span class="chip gold" title="Golden keys">${I.icon("lock", 14)} ${keys}/${pl.keys.length} keys</span></div>`;
}
// The dark closing in: one layer over the whole page (outside the app, so the page animation can't move it).
function escDark(pl) {
  let el = document.getElementById("escdark");
  if (!pl) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement("div"); el.id = "escdark"; el.setAttribute("aria-hidden", "true"); document.body.appendChild(el); }
  el.style.opacity = darkness(pl); el.classList.toggle("caught", !!pl.caught);
}
const guardText = left => left > 0 ? `The guard is back in <b>${U.fmtClock(Math.ceil(left))}</b>` : `<b>Caught!</b> The guard is back`;
const darkness = pl => Math.min(1, 0.15 + 0.85 * X.escapeSeconds(pl) / X.GUARD_SECONDS).toFixed(2);
function escToast(t, kind = "") {
  const el = document.createElement("div"); el.className = `esctoast ${kind}`; el.setAttribute("role", "status"); el.textContent = t;
  document.body.appendChild(el); setTimeout(() => el.remove(), 3500);
}
function escapeView() {
  const g = run.game, E = X.ESCAPES[run.unit];
  if (run.phase === "intro") {
    const best = X.bestEscape(history, run.unit);
    $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Unit ${run.unit} · escape room</p><h1>${U.esc(E.title)}</h1>
      ${escPic("vocab")}
      <div class="panel escstory"><p>${U.esc(E.story)}</p></div>
      <div class="panel"><ul><li>There are ${g.rooms.length} rooms. In each one, tap the things you can search to find a puzzle.</li>
        <li>Every puzzle you solve shows one part of the lock code in your notebook.</li>
        <li><b>The guard comes back in ${X.GUARD_SECONDS / 60} minutes!</b> Wrong answers add ${X.ESCAPE_PENALTY.wrong} s, hints and wrong codes add ${X.ESCAPE_PENALTY.hint} s, so he comes sooner.</li>
        <li>Each room hides a <b>golden key</b>: a harder question, one try only. Get it right to take ${X.KEY_BONUS} s off.</li>
        <li>Listen for footsteps… and the exit door has one last lock, with ${X.FINAL_SECONDS} seconds to open it.</li>
        <li>Escape in under ${X.STAR_TIMES[0] / 60} minutes for 3 stars.</li>
        <li>Playing as a team? Share one tablet and talk it through!</li></ul></div>
      <div class="stats"><div class="stat"><b>${best != null ? U.fmtTime(best) : "–"}</b><span>your best escape</span></div>
        <div class="stat"><b><span class="chip tier t${g.tier}">${U.esc(g.tierName)}</span></b><span>puzzle level</span></div></div>
      <div class="row"><button class="btn" id="go">Play on my own</button><button class="btn alt" id="team">Join a team game</button></div>
      <p class="note">Team game: your teacher shows a 4-digit code on the board. One tablet per team, signed in as one of you.</p></div>`;
    backButton();
    document.getElementById("go").onclick = () => { S.play("creak"); run.phase = "play"; run.play = X.newPlay(g); run.t0 = run.play.t0; saveRun(); escapeView(); top(); };
    document.getElementById("team").onclick = () => { S.play("tap"); run.phase = "join"; saveRun(); escapeView(); };
    return;
  }
  if (run.phase === "join") return liveJoinView();
  if (run.phase === "wait") return liveWaitView();
  const pl = run.play;
  if (pl.final && !pl.final.done) return finalView();
  const R = g.rooms[pl.room], found = X.roomFound(g, pl), chars = DIAL[R.lock];
  if (!pl.dial) pl.dial = R.code.map(() => 0);
  const isKey = pl.open === "key", open = isKey ? R.key : pl.open != null ? R.puzzles[pl.open] : null, key = i => `${pl.room}-${i}`;
  const tried = open && !isKey ? (pl.wrong || {})[key(pl.open)] || [] : [];
  const dark = R.event.type === "powercut" && X.leafletDark(g, pl), torch = R.event.type === "powercut" && pl.torchUntil > Date.now();
  const doc = R.kind !== "reading" ? "" : dark
    ? `<div class="panel escdoc off"><p><b>The lights went out!</b> It's too dark to read the leaflet.</p>
        <button class="btn small" id="torch">Use your torch (+${X.ESCAPE_PENALTY.torch} s)</button></div>`
    : `<details class="panel escdoc${torch ? " torch" : ""}" open><summary><b>${U.esc(E.doc.title)}</b>${torch ? ` <span class="chip gold">Torch: <b id="torchs">${Math.ceil((pl.torchUntil - Date.now()) / 1000)}</b> s</span>` : ""}</summary>
      ${E.doc.paras.map((t, i) => `<p><b>${i + 1}</b> ${U.esc(t)}</p>`).join("")}</details>`;
  const kst = pl.keys[pl.room];
  const puzzle = !open ? "" : isKey
    ? `<div class="panel escpuz goldkey"><p class="eyebrow">${U.esc(R.keyObject)}</p>
        ${kst === true ? `<div class="fb ok"><p><strong>A golden key!</strong> ${X.KEY_BONUS} seconds off your time.</p></div>`
        : kst === false ? `<div class="fb bad"><p>Not that one. The key slips away into the dark… The answer was <b>${U.esc(R.key.answer)}</b>.</p></div>`
        : `<p class="note">One try only! Right: −${X.KEY_BONUS} s.</p><p class="stem">${U.esc(R.key.prompt)}</p>${R.key.text ? `<p class="esctext">${U.esc(R.key.text)}</p>` : ""}
          <div class="escopts">${R.key.opts.map(o => `<button class="opt" data-k="${U.esc(o)}">${U.esc(o)}</button>`).join("")}</div>`}</div>`
    : `<div class="panel escpuz"><p class="eyebrow">${U.esc(open.object)}</p>
      ${pl.solved[pl.room][pl.open]
        ? `<div class="fb ok"><p><strong>Solved!</strong> You found <b class="mono">${U.esc(open.gives)}</b>. It's in your notebook.</p></div>`
        : `<p class="stem">${U.esc(open.prompt)}</p>${open.text ? `<p class="esctext">${U.esc(open.text)}</p>` : ""}
          <div class="escopts">${open.opts.map(o => `<button class="opt" data-ans="${U.esc(o)}" ${tried.includes(o) ? "disabled" : ""}>${U.esc(o)}</button>`).join("")}</div>
          ${run.fb ? `<div class="fb bad"><p>${U.esc(run.fb)}</p></div>` : ""}
          ${pl.hints[pl.room][pl.open] ? `<div class="fb"><p><strong>Hint:</strong> ${U.esc(open.hint)}</p></div>`
            : `<button class="btn small alt" id="hint">Hint (+${X.ESCAPE_PENALTY.hint} s)</button>`}`}</div>`;
  const ev = R.event, steps = ev.type === "footsteps" && pl.evAt && pl.events[pl.room] == null;
  $app.innerHTML = `<div class="narrow pop esc${pl.caught ? " caught" : ""}">${escHud(pl)}
    <p class="eyebrow">Room ${pl.room + 1} of ${g.rooms.length}</p><h1>${U.esc(R.name)}</h1>
    ${escPic(R.kind)}
    <p class="lede">${U.esc(R.scene)}</p>
    <div class="escroom">${R.puzzles.map((p, i) => `<button class="escobj${pl.solved[pl.room][i] ? " done" : ""}${pl.open === i ? " on" : ""}" data-obj="${i}">
      ${I.icon(pl.solved[pl.room][i] ? "check" : R.kind === "reading" ? "read" : R.kind === "grammar" ? "grammar" : "words", 26)}<span>${U.esc(p.object)}</span></button>`).join("")}
      <button class="escobj key${kst == null ? " glint" : kst ? " done" : " lost"}${isKey ? " on" : ""}" data-obj="key">${I.icon("lock", 20)}<span>${kst == null ? U.esc(R.keyObject) : kst ? "Golden key found" : "The key is lost"}</span></button></div>
    ${doc}${puzzle}
    <div class="panel esclock"><h3>${I.icon("lock", 20)} The lock</h3>
      <p class="note">Your notebook: ${found.map(c => `<b class="nb mono">${c == null ? "?" : U.esc(c)}</b>`).join("")}</p>
      <div class="dials">${pl.dial.map((d, k) => `<div class="dial"><button data-up="${k}" aria-label="Next">▲</button><b class="mono">${chars[d]}</b><button data-dn="${k}" aria-label="Back">▼</button></div>`).join("")}</div>
      ${run.msg ? `<p class="${run.msg.ok ? "note" : "err"}">${U.esc(run.msg.t)}</p>` : ""}
      <div class="row"><button class="btn" id="try">Try the code</button></div></div></div>
    ${steps ? `<div class="escmodal" role="dialog" aria-modal="true" aria-labelledby="evh"><div class="panel">
      <p class="eyebrow">Footsteps!</p><h2 id="evh">The guard is near. Stay quiet!</h2>
      <p>Answer in <b id="evtime">${Math.max(0, Math.ceil(X.EVENT_SECONDS - (Date.now() - pl.evAt) / 1000))}</b> seconds to stay hidden.</p>
      <p class="stem">Tap the word that means…</p><p class="esctext">${U.esc(ev.text)}</p>
      <div class="escopts">${ev.opts.map(o => `<button class="opt" data-ev="${U.esc(o)}">${U.esc(o)}</button>`).join("")}</div></div></div>` : ""}`;
  backButton(); escDark(pl);
  const redraw = () => { saveRun(); escapeView(); };
  $app.querySelectorAll("[data-obj]").forEach(b => b.onclick = () => {
    const k = b.dataset.obj; S.play(k === "key" && kst == null ? "glint" : "tap"); pl.open = k === "key" ? "key" : +k; run.fb = null; redraw(); });
  $app.querySelectorAll("[data-ans]").forEach(b => b.onclick = () => {
    const out = X.answerPuzzle(g, pl, pl.open, b.dataset.ans);
    if (out === "right") { S.play("ok"); run.fb = null; }
    else { S.play("bad"); (pl.wrong = pl.wrong || {})[key(pl.open)] = [...tried, b.dataset.ans]; run.fb = `Not that one: +${X.ESCAPE_PENALTY.wrong} s. Try again.`; }
    livePush(); redraw();
  });
  $app.querySelectorAll("[data-k]").forEach(b => b.onclick = () => {
    if (X.answerKey(g, pl, b.dataset.k)) { S.play("level"); escToast(`Golden key! −${X.KEY_BONUS} seconds`, "gold"); } else S.play("bad");
    livePush(); redraw();
  });
  $app.querySelectorAll("[data-ev]").forEach(b => b.onclick = () => {
    const ok = b.dataset.ev === ev.answer; X.answerEvent(pl, ok); pl.evAt = null;
    if (ok) { S.play("ok"); escToast("Phew! The footsteps go away."); } else { S.play("bad"); escToast(`The guard heard you! +${X.ESCAPE_PENALTY.event} s`, "bad"); }
    livePush(); redraw();
  });
  const tb = document.getElementById("torch"); if (tb) tb.onclick = () => { X.useTorch(pl); S.play("click"); livePush(); redraw(); };
  const h = document.getElementById("hint"); if (h) h.onclick = () => { X.takeHint(pl, pl.open); S.play("info"); livePush(); redraw(); };
  const spin = (k, by) => { pl.dial[k] = (pl.dial[k] + by + chars.length) % chars.length; run.msg = null; S.play("tap"); redraw(); };
  $app.querySelectorAll("[data-up]").forEach(b => b.onclick = () => spin(+b.dataset.up, 1));
  $app.querySelectorAll("[data-dn]").forEach(b => b.onclick = () => spin(+b.dataset.dn, -1));
  document.getElementById("try").onclick = () => {
    const was = pl.room;
    if (X.tryCode(g, pl, pl.dial.map(d => chars[d]))) {
      S.play("click"); run.fb = null; run.msg = pl.final ? null : { ok: true, t: `Click! The lock opens. On to room ${was + 2}.` }; saveRun(); livePush();
      const lk = $app.querySelector(".esclock"); lk.classList.add("open"); lk.querySelector("h3").innerHTML = `${I.icon("lock", 20)} Click! It opens!`;
      $app.querySelectorAll("button").forEach(x => x.disabled = true);
      setTimeout(() => { if (!run || run.play !== pl) return; S.play(pl.final ? "creak" : "level"); escapeView(); top(); }, 900);
    } else {
      S.play("bad"); run.msg = { ok: false, t: `The lock doesn't open: +${X.ESCAPE_PENALTY.code} s. Check your notebook.` }; livePush(); redraw();
      const lk = $app.querySelector(".esclock"); if (lk) lk.classList.add("shake");
    }
  };
  liveChips();
}
function liveChips() {
  const top = $app.querySelector(".esc"); if (!top || !run.live) return;
  top.insertAdjacentHTML("afterbegin", `<p class="chip">Team ${U.esc(run.live.team)} · game ${U.esc(run.live.code)}</p>`);
  if (run.live.ended) top.insertAdjacentHTML("afterbegin", `<div class="fb bad"><p>Your teacher has ended this game.</p></div>`);
}
// The exit door: put the letters of a word from the ticket hall in order, in 60 seconds.
function finalView() {
  const pl = run.play, F = run.game.final, pick = pl.final.pick || (pl.final.pick = []);
  const left = Math.max(0, Math.ceil(X.finalLeft(pl)));
  $app.innerHTML = `<div class="narrow pop esc final${pl.caught ? " caught" : ""}">${escHud(pl)}
    <p class="eyebrow">The exit door</p><h1>One last lock!</h1>
    ${escPic("exit")}
    <p class="lede">The street door has a word lock. Tap the letters in order to spell a word you found in the ticket hall.</p>
    <div class="ftimer${left <= 10 ? " near" : ""}"><b id="ftime">${left}</b><span>seconds left</span></div>
    ${F.clue ? `<p class="note">Clue: ${U.esc(F.clue)}</p>` : ""}
    <div class="fword" aria-label="Your word">${F.tiles.map((_, k) => `<b class="mono">${pick[k] != null ? U.esc(F.tiles[pick[k]]) : ""}</b>`).join("")}</div>
    <div class="ftiles">${F.tiles.map((c, k) => `<button class="opt mono" data-tile="${k}" ${pick.includes(k) ? "disabled" : ""}>${U.esc(c)}</button>`).join("")}</div>
    <div class="row"><button class="btn small alt" id="fundo" ${pick.length ? "" : "disabled"}>Undo</button><button class="btn small alt" id="fclear" ${pick.length ? "" : "disabled"}>Start again</button></div></div>`;
  backButton(); escDark(pl);
  $app.querySelectorAll("[data-tile]").forEach(b => b.onclick = () => {
    pick.push(+b.dataset.tile); S.play("tap");
    if (pick.length === F.tiles.length) {
      if (pick.map(k => F.tiles[k]).join("") === F.word) { X.finishFinal(pl, true); S.play("creak"); return escapeOut(); }
      S.play("bad"); saveRun(); finalView(); const w = $app.querySelector(".fword"); if (w) w.classList.add("shake");
      setTimeout(() => { if (run && run.play === pl && !pl.final.done) { pl.final.pick = []; saveRun(); finalView(); } }, 700);
      return;
    }
    saveRun(); finalView();
  });
  document.getElementById("fundo").onclick = () => { pick.pop(); S.play("tap"); saveRun(); finalView(); };
  document.getElementById("fclear").onclick = () => { pl.final.pick = []; S.play("tap"); saveRun(); finalView(); };
  liveChips();
}
function escapeOut() {
  const pl = run.play; S.play("win");
  run.phase = "done"; run.result = X.escapeResult(run.game, pl, history); saveRun(); livePush(); runView(); top();
}
// Every second while a room is on screen: the guard's countdown, the darkness, heartbeats, events, the exit door timer, rival alerts.
let feedN = 0;
function escTick() {
  if (!run || run.kind !== "escape" || run.phase !== "play" || !run.play || !$app.querySelector(".esc")) return escDark(null);
  const g = run.game, pl = run.play, now = Date.now(), left = X.guardLeft(pl, now);
  const gd = document.getElementById("guard"); if (gd) { gd.innerHTML = guardText(left); gd.classList.toggle("near", left < 60); }
  escDark(pl);
  if (left <= 0 && !pl.caught) {
    pl.caught = true; S.play("alarm"); saveRun(); $app.querySelector(".esc").classList.add("caught");
    escToast("The guard is back! You're caught… but keep going to get out.", "bad");
  } else if (left > 0 && left <= 60) S.play("heart");
  if (run.live && ++feedN % 5 === 0) liveFeed();
  if (pl.final && !pl.final.done) {
    const f = X.finalLeft(pl, now), el = document.getElementById("ftime");
    if (el) { el.textContent = Math.max(0, Math.ceil(f)); el.parentElement.classList.toggle("near", f <= 10); }
    if (f > 0 && f <= 10) S.play("tick");
    if (f <= 0) { X.finishFinal(pl, false); S.play("alarm"); escToast(`Too slow! The door jams for a minute (+${X.ESCAPE_PENALTY.final} s)… then it opens.`, "bad"); escapeOut(); }
    return;
  }
  if (!$app.querySelector(".escroom")) return;
  const R = g.rooms[pl.room], ev = R.event;
  if (ev.type === "footsteps" && pl.events[pl.room] == null) {
    if (!pl.evAt && X.roomSeconds(pl, now) >= ev.at) { pl.evAt = now; S.play("steps"); saveRun(); return escapeView(); }
    if (pl.evAt) {
      const s = X.EVENT_SECONDS - (now - pl.evAt) / 1000, el = document.getElementById("evtime");
      if (el) el.textContent = Math.max(0, Math.ceil(s));
      if (s <= 0) { X.answerEvent(pl, false); pl.evAt = null; S.play("bad"); escToast(`Too slow! The guard heard you: +${X.ESCAPE_PENALTY.event} s`, "bad"); livePush(); saveRun(); return escapeView(); }
      S.play("tick");
    }
  }
  if (ev.type === "powercut") {
    const dark = X.leafletDark(g, pl, now), ts = document.getElementById("torchs");
    if (ts) ts.textContent = Math.max(0, Math.ceil((pl.torchUntil - now) / 1000));
    if (dark !== !!$app.querySelector(".escdoc.off")) { if (dark && !pl.cut) { pl.cut = true; S.play("dark"); escToast("The lights went out!", "bad"); } saveRun(); escapeView(); }
  }
}
function starsHTML(R) {
  const n = R.stars, next = n === 3 ? "" : n === 2 ? `Under ${X.STAR_TIMES[0] / 60} minutes for 3 stars.` : n === 1 ? `Under ${X.STAR_TIMES[1] / 60} minutes for 2 stars.` : `Get out before the guard for a star.`;
  return `<div class="escstars" aria-label="${n} of 3 stars">${[0, 1, 2].map(k => `<span class="${k < n ? "on" : ""}" style="animation-delay:${k * 0.25}s">★</span>`).join("")}</div>
    <p class="note center">${R.finalOk ? "You opened the exit door in time." : "The exit door jammed (+60 s)."} ${next}</p>`;
}
function liveDone() {
  const R = run.result, L = run.live, u = run.unit;
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Team ${U.esc(L.team)} · game ${U.esc(L.code)}</p><h1>${R.caught ? "Caught… but you got out!" : "You escaped!"}</h1>
    ${starsHTML(R)}
    <div class="panel escstory"><p>${U.esc(X.ESCAPES[u].escaped)}</p></div>
    <div class="stats"><div class="stat"><b>${U.fmtTime(L.seconds ?? R.seconds)}</b><span>team time</span></div>
      ${L.place ? `<div class="stat gold"><b>${L.place === 1 ? "1st" : L.place === 2 ? "2nd" : L.place === 3 ? "3rd" : L.place + "th"}</b><span>place so far</span></div>` : ""}
      <div class="stat"><b>${R.keys}/3</b><span>golden keys</span></div></div>
    <p class="lede">Look at the board to see the other teams.</p>
    <div class="row"><button class="btn alt" id="unit">Back to Unit ${u}</button></div></div>`;
  document.getElementById("unit").onclick = () => { run = null; saveRun(); location.hash = `#unit-${u}/games`; route(); top(); };
}

/* team game: join with the teacher's code, wait for Start, play the same puzzles as every other team */
let liveTimer = null;
function liveJoinView() {
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Unit ${run.unit} · team escape room</p><h1>Join a team game</h1>
    <form class="panel" id="f" novalidate>
      <label class="fld" for="lc">Game code (on the board)<input type="tel" id="lc" inputmode="numeric" maxlength="4" placeholder="4 digits" style="max-width:10em"></label>
      <label class="fld" for="lt">Team name<input type="text" id="lt" maxlength="24" placeholder="for example The Explorers"></label>
      <p class="err" id="e" role="alert"></p>
      <div class="row"><button class="btn" type="submit" id="j">Join</button></div></form></div>`;
  backButton();
  document.getElementById("f").addEventListener("submit", async ev => {
    ev.preventDefault(); const b = document.getElementById("j"); b.disabled = true;
    const code = document.getElementById("lc").value.trim(), team = document.getElementById("lt").value.trim();
    if (!team) { document.getElementById("e").textContent = "Choose a team name."; b.disabled = false; return; }
    try { const r = await api.liveJoin(session.token, code, team);
      if (r.unit !== run.unit) { run.unit = r.unit; }
      run.live = { code: r.code, team, seed: r.seed }; run.phase = "wait"; saveRun(); liveWaitView(r); }
    catch (e) { document.getElementById("e").textContent = e.message; b.disabled = false; }
  });
}
function liveWaitView(state) {
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Team ${U.esc(run.live.team)} · game ${U.esc(run.live.code)}</p><h1>Get ready…</h1>
    <div class="panel escstory"><p>${U.esc(X.ESCAPES[run.unit].story)}</p></div>
    <p class="lede" id="ws">Waiting for your teacher to press Start.</p></div>`;
  backButton();
  const go = r => {
    clearInterval(liveTimer); liveTimer = null;
    run.game = X.makeEscape(run.unit, 0, X.seededRandom(run.live.seed));      // every team: the same puzzles at Core level
    run.play = X.newPlay(run.game, Date.now() - Math.round(r.elapsed * 1000)); run.t0 = run.play.t0;
    run.phase = "play"; S.play("level"); saveRun(); escapeView(); top();
  };
  const poll = async () => {
    if (!run || run.phase !== "wait") { clearInterval(liveTimer); liveTimer = null; return; }
    try { const r = await api.liveJoin(session.token, run.live.code, "");
      if (r.status === "playing") go(r); }
    catch (e) { const w = document.getElementById("ws"); if (w) w.textContent = e.message; clearInterval(liveTimer); liveTimer = null; }
  };
  if (state && state.status === "playing") return go(state);
  clearInterval(liveTimer); liveTimer = setInterval(poll, 2000);
}
// Rival alerts: what the other teams just did, from the class game (every 5 seconds while playing).
async function liveFeed() {
  if (!run || !run.live) return;
  try { const r = await api.liveFeed(session.token, run.live.code); if (!run || !run.live) return;
    const was = run.live.feed, names = ["the ticket hall", "the gallery", "the storeroom"];
    run.live.feed = Object.fromEntries(r.teams.map(t => [t.team, { room: t.room, out: t.out }]));
    if (r.status === "ended" && !run.live.ended) { run.live.ended = true; saveRun(); return escapeView(); }
    if (!was) return;
    for (const t of r.teams) { if (t.team === run.live.team) continue; const o = was[t.team]; if (!o) continue;
      if (t.out && !o.out) { S.play("alarm"); escToast(`🚪 ${t.team} just got out of the museum!`, "bad"); }
      else if (t.room > o.room) { S.play("info"); escToast(t.room >= 3 ? `⚡ ${t.team} reached the exit door!` : `⚡ ${t.team} just escaped ${names[t.room - 1] || "a room"}!`); } }
  } catch (e) {}
}
async function livePush() {
  if (!run || !run.live || !run.play) return;
  const pl = run.play;
  try { const r = await api.liveProgress(session.token, run.live.code, run.live.team, { room: pl.final ? run.game.rooms.length : pl.room, solved: X.solvedCount(pl), penalty: pl.penalty, out: !!pl.out });
    if (r.status === "ended" && run && run.live) { run.live.ended = true; saveRun(); }
    if (pl.out && run && run.live) { run.live.place = r.place; run.live.seconds = r.seconds; saveRun(); if (run.phase === "done") escapeDone(); } }
  catch (e) {}
}
function escapeDone() {
  if (run.live) return liveDone();
  const R = run.result, u = run.unit, E = X.ESCAPES[u], best = X.bestEscape(history, u), record = best == null || R.seconds < best;
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Unit ${u} · escape room</p><h1>${R.caught ? "Caught… but you got out!" : "You escaped!"}</h1>
    ${starsHTML(R)}
    <div class="panel escstory"><p>${U.esc(R.caught ? "The guard caught you at the door. He let you go home, but next time, be faster!" : E.escaped)}</p></div>
    ${record && best != null ? `<div class="fb ok winbox"><p class="big">New best time!</p><p>Your old best was ${U.fmtTime(best)}.</p></div>` : best != null ? `<p class="note">Your best is ${U.fmtTime(best)}.</p>` : ""}
    <div class="stats"><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>escape time</span></div>
      <div class="stat"><b>${R.right}/${R.total}</b><span>right first time</span></div>
      <div class="stat"><b>${R.keys}/3</b><span>golden keys</span></div>
      <div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div></div>
    ${R.caught ? `<p class="note">No escape bonus this time. Get out before the guard comes back (${X.GUARD_SECONDS / 60} minutes) for it.</p>` : ""}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="again">Play again</button><button class="btn alt" id="unit">Back to Unit ${u}</button></div></div>`;
  document.getElementById("again").onclick = () => { run = null; saveRun(); startEscape(u); };
  document.getElementById("unit").onclick = () => { run = null; saveRun(); location.hash = `#unit-${u}/games`; route(); top(); };
  saveAttempt({ mode: "vocab", text_id: X.escapeId(u), level_start: null, level_end: null, score: R.right, max_score: R.total,
                xp: R.xp, seconds: R.seconds, answers: R.answers });
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
    audioEl = new Audio(`audio/listening/${run.id}.mp3?v=${AUDIO_V}`); audioFor = run.id; audioEl.preload = "auto";
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
function stopAudio() { if (audioEl) { audioEl.pause(); segEnd = null; } if (miniAudio) miniAudio.pause(); if (labAudio) labAudio.pause(); }
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
  else if (st === 1) fb = `<div class="fb bad"><p><strong>Not quite.</strong> ${U.esc(q.hint)}</p>${trapTip(task.id, k)}<div class="row">${partBtn(k, "Listen to that part again")}</div></div>`;
  return `<div class="qcard lq${locked ? " done" : ""}"><div class="qhead"><span class="tag">${U.esc(q.skill)}</span><span class="qnum">${k + 1} of ${task.qs.length}</span></div>${q.type === "gap" || task.statements ? (task.statements ? body : `${body}`) : body}${fb}</div>`;
}
// Which examiner's trick a unit question uses, with a link to its Listening Lab mission.
function trapTip(taskId, k) {
  const t = Lab.unitTrap(taskId, k); if (!t) return "";
  return `<p class="note traptip">🪤 <b>Watch out: ${U.esc(Lab.TRAPS[t].name.toLowerCase())}.</b> ${U.esc(Lab.TRAPS[t].tip)}</p>`;
}
const partBtn = (k, label) => TIMES[run.id] ? `<button class="btn small alt" data-part="${k}">${PLAY} ${label}</button>` : "";
function checkListen(task) {
  let right = 0, wrong = 0;
  task.qs.forEach((q, k) => {
    if (lockedQ(k)) return;
    const ok = P.listenCorrect(q, run.resp[k]), st = run.stage[k] || 0;
    if (ok) {
      if (q.type === "gap" && P.markGap(q, run.resp[k]) === "spelling") run.notes[k] = "spelling";
      run.results[k] = { skill: "Listening", sub: q.skill, trap: Lab.unitTrap(task.id, k), first_try: st === 0, support: st === 0 ? "none" : "hint" }; right++;
    } else if (st === 0) { run.stage[k] = 1; run.notes[k] = "wrong"; wrong++; }
    else { run.results[k] = { skill: "Listening", sub: q.skill, trap: Lab.unitTrap(task.id, k), first_try: false, support: "explained" }; wrong++; }
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
  run.phase = "done"; run.xpSoFar = 0; saveRun(); runView(); top();
  // The big show when this task completes the unit's whole listening section for the first time.
  const done = new Set(history.filter(h => h.mode === "listening").map(h => h.text_id)), all = listeningFor(task.unitNo);
  if (!done.has(task.id) && all.every(t => t.id === task.id || done.has(t.id)))
    Cel.big({ icon: "🎧", title: `Unit ${task.unitNo} listening complete, ${firstName()}!`, sub: `All ${all.length} parts done`, xp: run.result.xp });
  else Cel.set(run.result.xp);
}
function listenDone() {
  const task = LISTENING.find(t => t.id === run.id), R = run.result;
  const hot = new Set(task.qs.flatMap(q => { const [a, b] = P.cueLines(task, q); return Array.from({ length: b - a + 1 }, (_, i) => a + i); }));
  const rows = R.results.map((r, k) => `<tr><td>${k + 1}</td><td>${U.esc(task.qs[k].skill)}</td><td><span class="chip ${r.support}">${E.SUPPORT_LABEL[r.support]}</span></td></tr>`).join("");
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished · ${U.esc(task.topic)}</p><h1>${R.score} of ${task.qs.length} right first time</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${task.qs.length}</b><span>right first time</span></div>
      <div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div><div class="stat"><b>${R.results.filter(r => r.support === "explained").length}</b><span>to review</span></div></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept, ${U.esc(firstName())}!</strong> That's 2 activities this week: <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    <div class="tbl"><table><thead><tr><th>#</th><th>Skill</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table></div>
    <details class="panel"><summary><b>Read the transcript</b> <span class="note">(the parts with answers are highlighted)</span></summary>
      <div class="transcript">${task.lines.map((l, i) => `<p class="${hot.has(i) ? "hot" : ""}"><b>${U.esc(l[0] === "NARRATOR" ? "Narrator" : l[0][0] + l[0].slice(1).toLowerCase())}:</b> ${U.esc(l[1])}</p>`).join("")}</div></details>
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="home">Back to home</button></div></div>`;
  document.getElementById("home").onclick = () => { run = null; saveRun(); location.hash = "#home"; route(); };
  saveAttempt({ mode: "listening", text_id: task.id, level_start: null, level_end: null, score: R.score, max_score: task.qs.length,
                xp: R.xp, seconds: R.seconds, answers: R.results });
}

/* ---------------- Listening Lab ---------------- */
// Six missions on the examiner's tricks. Each: two teaching cards, then 6 short clips with one question each. The Lab is
// adaptive (lab.js): 2 right first time in a row moves up a level (Core, Stretch, Challenge); 2 missed in a row brings a
// strategy rescue (the tips again and a guided replay of the missed clip), then a level down. After each answer the
// transcript lights up the words with the answer (green) and the trap (orange). "Prime your brain" adds three steps
// before listening: key words, answer type, prediction.
let labAudio = null, labFor = null;
const labLevel = l => Lab.LAB_LEVELS[l || 0];
const lvChip = l => `<span class="lvchip lv${l || 0}">${labLevel(l)}</span>`;
function labHubView() {
  const att = id => history.filter(h => h.text_id === id);
  const best = id => { const s = att(id).map(h => h.score); return s.length ? Math.max(...s) : null; };
  const peak = id => Math.max(0, ...att(id).map(h => Lab.labPeak(h.answers || [])));
  const start = Lab.labStartLevel(history, P.tierFor(history));
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Listening</p><h1>Listening Lab</h1>
      <p class="lede">Learn the tricks examiners use in listening questions, and how to beat them. Six short missions, about 10 minutes each.</p>
      <p class="note">The questions change with you. Get 2 right first time in a row and you move up: Core, Stretch, then Challenge (hear it once!). You start your next mission on ${lvChip(start)}.</p></div>
    <div class="tiles">${Lab.LAB.map(m => { const b = best(m.id);
      return aTile("lab", `data-lab="${m.id}"`, `${m.n}. ${m.title}`, b != null ? `Best: ${b} of ${Lab.MISSION_LEN} · reached ${labLevel(peak(m.id))}` : m.blurb, b != null); }).join("")}</div>
    <div class="panel"><h3>Your trap tracker</h3>${U.trapsHTML(history)}</div></div>`;
  bindActivities();
}
function startLab(id) {
  const level = Lab.labStartLevel(history, P.tierFor(history));
  run = { kind: "lab", id, phase: "teach", card: 0, i: 0, st: {}, results: [], t0: Date.now(), orders: {}, level, start: level, rightRow: 0, wrongRow: 0, seq: [] };
  labPick(); saveRun(); route(); top();
}
const labM = () => Lab.labMission(run.id);
// A run saved before the Lab was adaptive has no question list: give it the Core questions in order.
function labSeq() {
  if (run.seq) return;
  Object.assign(run, { seq: labM().items.filter(x => !x.level).map(x => x.clip), level: 0, start: 0, rightRow: 0, wrongRow: 0 });
}
function labPick() { run.seq[run.i] = Lab.nextLabItem(labM(), run.level, run.seq.slice(0, run.i), Lab.seenClips(history)).clip; }
const labItem = (i = run.i) => { labSeq(); return labM().items.find(x => x.clip === run.seq[i]); };
function labClip(clip = labItem().clip) {
  if (!labAudio || labFor !== clip) {
    if (labAudio) labAudio.pause();
    labAudio = new Audio(`audio/listening/${clip}.mp3?v=${AUDIO_V}`); labFor = clip; labAudio.preload = "auto";
    labAudio.addEventListener("ended", () => { const s = run && run.kind === "lab" && run.phase === "q" && run.st[run.i]; if (s && labFor === labItem().clip) { s.plays++; saveRun(); } labPlayer(); });
    labAudio.addEventListener("play", labPlayer); labAudio.addEventListener("pause", labPlayer);
  }
  return labAudio;
}
const labPlaysMax = s => Lab.LAB_PLAYS[labItem().level] + (s.wrong || []).length;
const labPlaysLeft = s => labPlaysMax(s) - s.plays;
function labPlayer() {
  const btn = document.getElementById("labplay"); if (!btn || !run || run.kind !== "lab" || !labAudio) return;
  const playing = !labAudio.paused && !labAudio.ended;
  if (run.phase === "rescue") { btn.innerHTML = playing ? `${PAUSE} Pause` : `${PLAY} ${labAudio.currentTime > 0 ? "Play again" : "Play"}`; return; }
  const s = run.st[run.i], left = labPlaysLeft(s);
  btn.disabled = !playing && left <= 0;
  btn.innerHTML = playing ? `${PAUSE} Pause` : left <= 0 ? "No more listens" : `${PLAY} ${s.plays === 0 ? "Play" : "Play again"}${left < labPlaysMax(s) ? ` (${left} left)` : ""}`;
  $app.querySelectorAll("[data-lo]").forEach(b => { if (!s.done && !(s.wrong || []).includes(+b.dataset.lo)) b.disabled = !(s.plays > 0 || playing); });
}
function labPlay() {
  const a = labClip(run.phase === "rescue" ? run.rescueClip : undefined), s = run.st[run.i];
  if (!a.paused && !a.ended) return a.pause();
  if (run.phase === "q" && labPlaysLeft(s) <= 0) return;
  if (a.ended || a.currentTime === 0 || a.currentTime >= (a.duration || 1e9) - 0.05) a.currentTime = 0;
  if (run.phase === "q") { s.heard = true; saveRun(); }
  a.play().catch(() => {}); S.play("tap");
}
// One line of the transcript with the answer and the traps marked.
function labLine(it, [who, text]) {
  const name = who[0] + who.slice(1).toLowerCase();
  return `<p><b>${U.esc(name)}:</b> ${Lab.markLine(text, it.key, it.traps).map(p => p.kind === "key" ? `<mark class="lkey">${U.esc(p.t)}</mark>`
    : p.kind === "trap" ? `<mark class="ltrap" title="${U.esc(p.label)}">${U.esc(p.t)}</mark>` : U.esc(p.t)).join("")}</p>`;
}
const labTrans = it => `${it.lines.map(l => labLine(it, l)).join("")}
  <p class="note legend"><mark class="lkey">green</mark> gives the answer${it.traps.length ? ` · <mark class="ltrap">orange</mark> is the trap` : ""}</p>
  ${it.traps.length ? `<ul class="trapnotes">${it.traps.map(([t, l]) => `<li>🪤 “${U.esc(t)}”: ${U.esc(l)}</li>`).join("")}</ul>` : ""}`;
// Strategy rescue after 2 missed in a row: the mission's tips again, then the missed clip with the transcript lit up.
function labRescueView() {
  const m = labM(), it = m.items.find(x => x.clip === run.rescueClip), down = run.level > 0;
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Listening Lab · Strategy rescue</p><h1>Let's beat this trap together</h1>
    <p class="lede">Those two were tricky. Look at the strategy again, then listen to the last one with the words lit up.</p>
    <div class="panel labteach"><p class="eyebrow">The strategy</p><h2>${U.esc(Lab.TRAPS[m.trap].name)}</h2><p><b>${U.esc(Lab.TRAPS[m.trap].tip)}</b></p>
      ${m.teach.map(c => `<p><b>${U.esc(c.h)}</b> ${U.esc(c.p)}</p>`).join("")}</div>
    <div class="panel"><p class="eyebrow">Guided replay</p><p class="stem">${U.esc(it.stem)}</p>
      <p class="egrow"><span class="chip">Answer</span> ${U.esc(it.opts[0].t)}</p>
      <div class="player labplayer"><button class="btn" id="labplay">${PLAY} Play</button><span class="note">Read along. Listen for the green words, and notice how the orange ones try to trick you.</span></div>
      <div class="ltrans">${labTrans(it)}</div></div>
    <div class="row"><button class="btn" id="lnext">Try a similar question</button></div>
    ${down ? `<p class="note">The next question is ${lvChip(run.level - 1)}, so you can practise the strategy.</p>` : ""}</div>`;
  document.getElementById("labplay").onclick = labPlay; labClip(it.clip); labPlayer();
  document.getElementById("lnext").onclick = () => {
    if (labAudio) labAudio.pause(); S.play("tap");
    if (run.level > 0) { run.level--; run.flash = "down"; }
    run.phase = "q"; run.rescueClip = null; labPick(); saveRun(); labRunView(); backButton(); top();
  };
}
function stemKeys(stem, keys, sel, done) {
  const keyWords = new Set(keys.flatMap(k => k.toLowerCase().split(" ")));
  return stem.split(" ").map((w, k) => { const norm = w.replace(/[?.,!]/g, "").toLowerCase(), isKey = keyWords.has(norm);
    const cls = done ? (isKey ? " key" : sel.includes(k) ? " extra" : "") : sel.includes(k) ? " on" : "";
    return `<button class="kw${cls}" data-kw="${k}" ${done ? "disabled" : ""}>${U.esc(w)}</button>`; }).join(" ");
}
function labRunView() {
  const m = labM(), n = Lab.MISSION_LEN; labSeq();
  if (run.phase === "rescue") return labRescueView();
  if (run.phase === "teach") {
    const c = m.teach[run.card], eg = c.eg, last = run.card === m.teach.length - 1;
    const ex = eg.q ? `<p class="stem">${stemKeys(eg.q, eg.keys || [], [], true)}</p>${eg.note ? `<p class="note">${U.esc(eg.note)}</p>` : ""}`
      : `${eg.opt ? `<p class="egrow"><span class="chip">Option</span> ${U.esc(eg.opt)}</p>` : ""}<p class="egrow"><span class="chip">You hear</span> “${U.esc(eg.said)}”</p>${eg.note ? `<p class="note">${U.esc(eg.note)}</p>` : ""}`;
    $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Listening Lab · Mission ${m.n} of ${Lab.LAB.length}</p><h1>${U.esc(m.title)}</h1>
      <div class="panel labteach"><p class="eyebrow">Tip ${run.card + 1} of ${m.teach.length}</p><h2>${U.esc(c.h)}</h2><p>${U.esc(c.p)}</p><div class="labeg">${ex}</div></div>
      <div class="row">${run.card ? `<button class="btn alt" id="lprev">Back</button>` : ""}<button class="btn" id="lnext">${last ? `Start the ${n} questions` : "Next tip"}</button></div></div>`;
    document.getElementById("lnext").onclick = () => { S.play("tap"); if (last) run.phase = "q"; else run.card++; saveRun(); labRunView(); backButton(); top(); };
    const pv = document.getElementById("lprev"); if (pv) pv.onclick = () => { run.card--; saveRun(); labRunView(); backButton(); };
    return;
  }
  const it = labItem(), prime = m.trap === "prime";
  const s = run.st[run.i] || (run.st[run.i] = { stage: prime ? "keys" : "listen", sel: [], plays: 0, wrong: [], done: false });
  const tag = run.i === n - 1 ? "Checkpoint challenge" : prime ? "Get ready, then listen" : run.i < 2 && !it.level ? "Spot the trap" : "Practice";
  const flash = run.flash === "up" ? `<div class="lvup pop"><b>⬆ Level up!</b> 2 in a row. You're on ${lvChip(run.level)} now.${run.level === 2 ? " You hear each clip once, so read the question carefully first." : " The questions are harder."}</div>`
    : run.flash === "down" ? `<div class="lvdown">Back to ${lvChip(run.level)} to practise the strategy. Get 2 right in a row to move up again.</div>` : "";
  let h = `<div class="narrow pop"><p class="eyebrow">Listening Lab · ${U.esc(m.title)}</p>
    <div class="labdots">${Array.from({ length: n }, (_, k) => `<i class="${k < run.i ? `done l${labItem(k).level}` : k === run.i ? "now" : ""}"></i>`).join("")}</div>${flash}
    <div class="qcard"><div class="qhead"><span class="tag">${tag}</span>${lvChip(it.level)}<span class="qnum">${run.i + 1} of ${n}</span></div>`;
  if (s.stage === "keys") {
    h += `<p class="eyebrow">Step 1 of 3 · Before you listen</p><h3>Tap the key words in the question.</h3>
      <p class="stem kws">${stemKeys(it.stem, it.keys, s.sel, !!s.keysChecked)}</p>`;
    if (!s.keysChecked) h += `<div class="row"><button class="btn" id="lcheck" ${s.sel.length ? "" : "disabled"}>Check</button></div>`;
    else h += `<div class="fb ${s.keysOk ? "ok" : "info"}"><p><strong>${s.keysOk ? "Good underlining!" : "Here are the key words."}</strong> The key words are <b>${it.keys.map(U.esc).join(", ")}</b>: the question word and the words that tell you the topic.</p></div>
      <div class="row"><button class="btn" id="lnext">Next step</button></div>`;
  } else if (s.stage === "type") {
    h += `<p class="eyebrow">Step 2 of 3 · Before you listen</p><p class="stem">${stemKeys(it.stem, it.keys, [], true)}</p><h3>What type of answer do you need?</h3>
      <div class="chips-row">${Lab.ANSWER_TYPES.map(t => `<button class="pick${s.type === t ? (t === it.type ? " right" : " wrong") : s.type && t === it.type ? " right" : ""}" data-type="${U.esc(t)}" ${s.type ? "disabled" : ""}>${U.esc(t)}</button>`).join("")}</div>`;
    if (s.type) h += `<div class="fb ${s.type === it.type ? "ok" : "info"}"><p><strong>${s.type === it.type ? "Yes!" : "Not quite."}</strong> You need <b>${U.esc(it.type)}</b>. Now you know what to listen for.</p></div>
      <div class="row"><button class="btn" id="lnext">Next step</button></div>`;
  } else if (s.stage === "predict") {
    h += `<p class="eyebrow">Step 3 of 3 · Predict</p><p class="stem">${stemKeys(it.stem, it.keys, [], true)}</p><h3>Which of these could be the answer? Tap all that fit.</h3>
      <div class="chips-row">${it.predict.map(([t, fit], k) => { const on = s.sel.includes(k);
        return `<button class="pick${s.predChecked ? (fit ? " right" : on ? " wrong" : "") : on ? " on" : ""}" data-pr="${k}" ${s.predChecked ? "disabled" : ""}>${U.esc(t)}</button>`; }).join("")}</div>`;
    if (!s.predChecked) h += `<div class="row"><button class="btn" id="lcheck" ${s.sel.length ? "" : "disabled"}>Check</button></div>`;
    else h += `<div class="fb ${s.predOk ? "ok" : "info"}"><p><strong>${s.predOk ? "Great prediction!" : "Here's what could fit."}</strong> The answer must be ${U.esc(it.type)}, so only the green ones could be right. Now listen for them!</p></div>
      <div class="row"><button class="btn" id="lnext">Listen now</button></div>`;
  } else {
    const ord = order(`lab${run.i}`, it.opts.length), heard = s.plays > 0 || s.heard;
    if (prime) h += `<p class="note">You need <b>${U.esc(it.type)}</b>. Key words: ${it.keys.map(k => `<u>${U.esc(k)}</u>`).join(", ")}.</p>`;
    h += `<div class="player labplayer"><button class="btn" id="labplay">${PLAY} Play</button><span class="note">${Lab.LAB_PLAYS[it.level] === 1 ? "Challenge: you hear it once. Read the question first!" : "Read the question first. You can listen twice."}</span></div>
      <p class="stem">${U.esc(it.stem)}</p><div class="opts">${ord.map((oi, k) => {
        let cls = "opt"; if (s.done && oi === 0) cls += " right"; else if (s.wrong.includes(oi)) cls += " wrong";
        return `<button class="${cls}" data-lo="${oi}" ${s.done || s.wrong.includes(oi) || !heard ? "disabled" : ""}><span class="k">${"ABCD"[k]}</span><span>${U.esc(it.opts[oi].t)}</span></button>`; }).join("")}</div>`;
    if (!s.done && s.wrong.length) { const w = it.opts[s.wrong[s.wrong.length - 1]];
      h += `<div class="fb bad"><p><strong>Not quite.</strong> ${U.esc(w.why)}</p><p>${U.esc(it.hint)}</p><p class="note">You can listen once more.</p></div>`; }
    if (s.done) {
      const r = run.results.find(x => x.item === run.i && x.skill === "Listening"), first = r.first_try, got = r.support !== "explained";
      h += `<div class="fb ${got ? "ok" : "info"}"><p><strong>${first ? "Correct, first time!" : got ? "Correct." : `The answer is "${U.esc(it.opts[0].t)}".`}</strong>
          ${got ? `<span class="xpgain">+${first ? Lab.XP_LAB.first[it.level] : Lab.XP_LAB.hint} XP</span>` : ""}</p>
          ${s.wrong.length ? `<p>You chose "${U.esc(it.opts[s.wrong[0]].t)}": ${U.esc(it.opts[s.wrong[0]].why)}</p>` : ""}
          ${s.step && s.step.up && run.i < n - 1 ? `<p><b>2 in a row!</b> The next question is ${lvChip(s.step.level)}.</p>` : ""}
          ${s.step && s.step.rescue && run.i < n - 1 ? `<p><b>2 missed in a row.</b> Next, a quick strategy rescue to help you.</p>` : ""}</div>
        <div class="panel ltrans"><p class="eyebrow">What they said</p>${labTrans(it)}</div>
        <div class="row"><button class="btn" id="lnext">${run.i === n - 1 ? "See my results" : s.step && s.step.rescue ? "Strategy rescue" : "Next question"}</button></div>`;
    }
  }
  h += `</div></div>`;
  $app.innerHTML = h;
  const redraw = () => { saveRun(); labRunView(); backButton(); };
  const res = (sub, ok) => run.results.push({ item: run.i, skill: "Listening strategy", sub, first_try: ok, support: ok ? "none" : "explained" });
  $app.querySelectorAll("[data-kw]").forEach(b => b.onclick = () => { const k = +b.dataset.kw; s.sel = s.sel.includes(k) ? s.sel.filter(x => x !== k) : [...s.sel, k]; S.play("tap"); redraw(); });
  $app.querySelectorAll("[data-pr]").forEach(b => b.onclick = () => { const k = +b.dataset.pr; s.sel = s.sel.includes(k) ? s.sel.filter(x => x !== k) : [...s.sel, k]; S.play("tap"); redraw(); });
  $app.querySelectorAll("[data-type]").forEach(b => b.onclick = () => { s.type = b.dataset.type; const ok = s.type === it.type; res("Answer type", ok); S.play(ok ? "ok" : "bad"); redraw(); });
  const chk = document.getElementById("lcheck"); if (chk) chk.onclick = () => {
    if (s.stage === "keys") {
      const words = it.stem.split(" "), keyWords = new Set(it.keys.flatMap(k => k.toLowerCase().split(" ")));
      const need = words.map((w, k) => keyWords.has(w.replace(/[?.,!]/g, "").toLowerCase()) ? k : -1).filter(k => k >= 0);
      s.keysOk = need.every(k => s.sel.includes(k)) && s.sel.length - need.filter(k => s.sel.includes(k)).length <= 1;
      s.keysChecked = true; res("Key words", s.keysOk); S.play(s.keysOk ? "ok" : "info");
    } else {
      const fit = it.predict.map((p, k) => p[1] ? k : -1).filter(k => k >= 0);
      s.predOk = fit.length === s.sel.length && fit.every(k => s.sel.includes(k)); s.predChecked = true; res("Prediction", s.predOk); S.play(s.predOk ? "ok" : "info");
    }
    redraw();
  };
  $app.querySelectorAll("[data-lo]").forEach(b => b.onclick = () => {
    const oi = +b.dataset.lo, trap = m.trap === "prime" ? null : m.trap;
    if (labAudio) labAudio.pause();
    if (oi === 0) { run.results.push({ item: run.i, skill: "Listening", sub: "Detail", trap, lab: it.clip, level: it.level, first_try: !s.wrong.length, support: s.wrong.length ? "hint" : "none" }); s.done = true; S.play("ok"); }
    else { s.wrong.push(oi); S.play("bad");
      if (s.wrong.length >= 2) { run.results.push({ item: run.i, skill: "Listening", sub: "Detail", trap, lab: it.clip, level: it.level, first_try: false, support: "explained" }); s.done = true; } }
    if (s.done) { s.step = Lab.labStep(run, !s.wrong.length); Object.assign(run, { level: s.step.level, rightRow: s.step.rightRow, wrongRow: s.step.wrongRow }); if (s.step.up) S.play("level"); }
    redraw();
    const fb = $app.querySelector(".fb"); if (fb) fb.scrollIntoView({ block: "center", behavior: "smooth" });
  });
  const nx = document.getElementById("lnext"); if (nx) nx.onclick = () => {
    S.play("tap");
    if (s.stage === "keys") { s.stage = "type"; s.sel = []; }
    else if (s.stage === "type") s.stage = "predict";
    else if (s.stage === "predict") { s.stage = "listen"; s.sel = []; }
    else {
      if (labAudio) labAudio.pause(); if (run.i === n - 1) return finishLab();
      run.i++; run.flash = s.step && s.step.up ? "up" : null;
      if (s.step && s.step.rescue) { run.phase = "rescue"; run.rescueClip = it.clip; } else labPick();
    }
    redraw(); top();
  };
  const pb = document.getElementById("labplay"); if (pb) { pb.onclick = labPlay; labClip(); labPlayer(); }
}
function finishLab() {
  if (labAudio) labAudio.pause();
  const main = run.results.filter(r => r.skill === "Listening"), bonus = E.streakBonus(history);
  if (main.length) main[main.length - 1].next = run.level;
  run.result = { score: main.filter(r => r.first_try).length, xp: Lab.labXP(run.results) + bonus, bonus, peak: Lab.labPeak(main),
                 seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; saveRun(); runView(); top();
  const m = labM(), first = !history.some(h => h.text_id === m.id);
  first ? Cel.big({ icon: "🔬", title: `Mission ${m.n} complete, ${firstName()}!`, sub: m.title, xp: run.result.xp }) : Cel.set(run.result.xp);
}
function labDoneView() {
  const m = labM(), R = run.result, main = run.results.filter(r => r.skill === "Listening"), next = Lab.LAB.find(x => x.n === m.n + 1);
  const caught = main.filter(r => !r.first_try).map(r => m.items.find(x => x.clip === r.lab)).filter(Boolean), peak = R.peak ?? Lab.labPeak(main);
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Listening Lab · Mission ${m.n} done</p><h1>${R.score} of ${main.length} right first time</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${main.length}</b><span>right first time</span></div>
      <div class="stat"><b>${labLevel(peak)}</b><span>highest level</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    <div class="panel"><h3>Your level path</h3><ol class="lvpath">${main.map(r => `<li class="lv${r.level || 0}${r.first_try ? " ok" : ""}"><span>${r.first_try ? "✓" : "✗"}</span>${labLevel(r.level)}</li>`).join("")}</ol>
      <p class="note">${peak === 2 ? "You reached Challenge. Excellent listening!" : peak === 1 ? "You reached Stretch. Get 2 right in a row there to reach Challenge." : "Get 2 right first time in a row to move up to Stretch."}</p></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept, ${U.esc(firstName())}!</strong> <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    <div class="panel"><h3>Remember</h3><p style="margin:0">${U.esc(Lab.TRAPS[m.trap].tip)}</p></div>
    ${caught.length ? `<div class="panel"><h3>The traps that caught you</h3><ul>${caught.map(it => `<li>${U.esc(it.stem)} ${it.traps.length ? `<span class="note">(${it.traps.map(t => U.esc(t[1])).join(", ")})</span>` : ""}</li>`).join("")}</ul></div>`
      : `<div class="fb ok winbox"><p class="big">No traps caught you!</p></div>`}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row">${next ? `<button class="btn" id="lnextm">Next mission: ${U.esc(next.title)}</button>` : ""}<button class="btn alt" id="lhub">Back to the Lab</button></div></div>`;
  const nm = document.getElementById("lnextm"); if (nm) nm.onclick = () => { run = null; saveRun(); startLab(next.id); };
  document.getElementById("lhub").onclick = () => { run = null; saveRun(); location.hash = "#lab"; route(); top(); };
  saveAttempt({ mode: "listening", text_id: m.id, level_start: run.start ?? 0, level_end: null, score: R.score, max_score: main.length,
                xp: R.xp, seconds: R.seconds, answers: run.results.map(({ item, ...r }) => r) });
}

/* ---------------- Reading Lab ---------------- */
// Eight missions on Checkpoint Reading (Paper 1) and its traps, with texts on the Unit 2 and 3 topics (rlab.js). Same
// adaptive engine as the Listening Lab: two teaching cards, then 6 questions; 2 right first time in a row moves up a level,
// 2 missed in a row brings a strategy rescue, then a level down. After each answer the text lights up the evidence (green)
// and the trap (orange), and a gap is filled with the right answer. Saved as mode "vocab" (see rlab.js).
// Each unit has its own questions (it.u): Unit 2 Well-being, Unit 3 Tourism. The trap tracker and the start level are shared.
const RL_TOPIC = { 2: "Well-being", 3: "Tourism" };
let rlLastUnit = null;
const rlUnitNow = () => rlLastUnit || (RL.RLAB_UNITS.includes(P.focusUnit()) ? P.focusUnit() : RL.RLAB_UNITS[0]);
const rlRunUnit = () => run.unit || RL.rItemUnit(run.seq[0]) || RL.RLAB_UNITS[0];
function rlabHubView(u) {
  if (!RL.RLAB_UNITS.includes(u)) u = rlUnitNow();
  rlLastUnit = u;
  const att = id => history.filter(h => h.text_id === id && (h.answers || []).some(a => a.skill === "Reading Lab" && RL.rItemUnit(a.rlab) === u));
  const best = id => { const s = att(id).map(h => h.score); return s.length ? Math.max(...s) : null; };
  const peak = id => Math.max(0, ...att(id).map(h => RL.rlabPeak(h.answers || [])));
  const start = RL.rlabStartLevel(history, P.tierFor(history));
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Reading · Unit ${u}: ${RL_TOPIC[u]}</p><h1>Reading Lab</h1>
      <p class="lede">Learn the tricks in Checkpoint reading questions, and how to beat them. Eight short missions, one for each kind of question, with texts on ${RL_TOPIC[u]}.</p>
      <p class="note">The questions change with you. Get 2 right first time in a row and you move up: Core, Stretch, then Challenge. You start your next mission on ${lvChip(start)}.</p></div>
    <div class="tabs" role="tablist" aria-label="Unit">${RL.RLAB_UNITS.map(x => `<button role="tab" aria-selected="${x === u}" data-rlu="${x}">Unit ${x}: ${RL_TOPIC[x]}</button>`).join("")}</div>
    <div class="tiles">${RL.RLAB.map(m => { const b = best(m.id);
      return aTile("lab", `data-rlab="${m.id}" data-ru="${u}"`, `${m.n}. ${m.title}`, b != null ? `Best: ${b} of ${Lab.MISSION_LEN} · reached ${labLevel(peak(m.id))}` : `${m.part} · ${m.blurb}`, b != null); }).join("")}</div>
    <div class="panel"><h3>Your reading trap tracker</h3><p class="note">For both units.</p>${U.rTrapsHTML(history)}</div></div>`;
  bindActivities();
  $app.querySelectorAll("[data-rlu]").forEach(b => b.onclick = () => { location.hash = `#rlab-${b.dataset.rlu}`; });
}
function startRLab(id, unit = rlUnitNow()) {
  const level = RL.rlabStartLevel(history, P.tierFor(history));
  run = { kind: "rlab", id, unit, phase: "teach", card: 0, i: 0, st: {}, results: [], t0: Date.now(), orders: {}, level, start: level, rightRow: 0, wrongRow: 0, seq: [] };
  rlPick(); saveRun(); route(); top();
}
const rlM = () => RL.rlabMission(run.id);
function rlPick() { run.seq[run.i] = Lab.nextLabItem(RL.unitMission(rlM(), rlRunUnit()), run.level, run.seq.slice(0, run.i), RL.seenRItems(history)).id; }
const rlItem = (i = run.i) => rlM().items.find(x => x.id === run.seq[i]);
// A gap: an empty line before the answer, the right answer after it.
const rlGap = (t, fill) => U.esc(t).split("___").join(fill != null ? `<b class="rgap fill">${U.esc(fill)}</b>` : `<span class="rgap" role="img" aria-label="gap"></span>`);
function rlText(it, text, done) {
  if (!done) return rlGap(text);
  const f = it.opts[0].t;
  return Lab.markLine(text, it.key, it.traps).map(p => p.kind === "key" ? `<mark class="lkey">${rlGap(p.t, f)}</mark>`
    : p.kind === "trap" ? `<mark class="ltrap" title="${U.esc(p.label)}">${rlGap(p.t, f)}</mark>` : rlGap(p.t, f)).join("");
}
function rlPassage(it, done) {
  const body = it.lines ? `<div class="rconv">${it.lines.map(([who, t]) => `<p><b>${U.esc(who)}:</b> ${rlText(it, t, done)}</p>`).join("")}</div>`
    : `<div class="rpass">${it.paras.map(([l, t]) => `<p>${l ? `<b class="plabel">${U.esc(l)}</b>` : ""}<span>${rlText(it, t, done)}</span></p>`).join("")}</div>`;
  if (!done) return body;
  return `${body}<p class="note legend"><mark class="lkey">green</mark> shows the answer${it.traps.length ? ` · <mark class="ltrap">orange</mark> is the trap` : ""}</p>
    ${it.traps.length ? `<ul class="trapnotes">${it.traps.map(([t, l]) => `<li>🪤 “${U.esc(t)}”: ${U.esc(l)}</li>`).join("")}</ul>` : ""}`;
}
// "Paragraph C" and "C: Wild Ways" options keep their letters, in order; other options are shuffled.
const rlLetter = t => /^(?:Paragraph )?([A-D])(?:: (.+))?$/.exec(t);
function rlOrder(it) {
  if (rlLetter(it.opts[0].t)) return it.opts.map((o, k) => k).sort((a, b) => it.opts[a].t.localeCompare(it.opts[b].t));
  return order(`rl${run.i}`, it.opts.length);
}
function rlRescueView() {
  const m = rlM(), it = m.items.find(x => x.id === run.rescueItem), down = run.level > 0, T = RL.RTRAPS[m.trap];
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Reading Lab · Strategy rescue</p><h1>Let's beat this trap together</h1>
    <p class="lede">Those two were tricky. Look at the strategy again, then look at the last question with the words lit up.</p>
    <div class="panel labteach"><p class="eyebrow">The strategy</p><h2>${U.esc(T.name)}</h2><p><b>${U.esc(T.tip)}</b></p>
      ${m.teach.map(c => `<p><b>${U.esc(c.h)}</b> ${U.esc(c.p)}</p>`).join("")}</div>
    <div class="panel"><p class="eyebrow">Look again</p><p class="stem">${U.esc(it.stem)}</p>
      <p class="egrow"><span class="chip">Answer</span> ${U.esc(it.opts[0].t)}</p>
      <div class="rbox ltrans">${rlPassage(it, true)}</div><p class="note">${U.esc(it.hint)}</p></div>
    <div class="row"><button class="btn" id="lnext">Try a similar question</button></div>
    ${down ? `<p class="note">The next question is ${lvChip(run.level - 1)}, so you can practise the strategy.</p>` : ""}</div>`;
  document.getElementById("lnext").onclick = () => {
    S.play("tap");
    if (run.level > 0) { run.level--; run.flash = "down"; }
    run.phase = "q"; run.rescueItem = null; rlPick(); saveRun(); rlRunView(); backButton(); top();
  };
}
function rlRunView() {
  const m = rlM(), n = Lab.MISSION_LEN;
  if (run.phase === "rescue") return rlRescueView();
  if (run.phase === "teach") {
    const c = m.teach[run.card], eg = c.eg, last = run.card === m.teach.length - 1;
    $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Reading Lab · Unit ${rlRunUnit()} · Mission ${m.n} of ${RL.RLAB.length} · Checkpoint ${U.esc(m.part)}</p><h1>${U.esc(m.title)}</h1>
      <div class="panel labteach"><p class="eyebrow">Tip ${run.card + 1} of ${m.teach.length}</p><h2>${U.esc(c.h)}</h2><p>${U.esc(c.p)}</p>
        <div class="labeg"><p class="egrow"><span class="chip">Text</span> ${rlGap(eg.text)}</p>${eg.opt ? `<p class="egrow"><span class="chip">Option</span> ${U.esc(eg.opt)}</p>` : ""}${eg.note ? `<p class="note">${U.esc(eg.note)}</p>` : ""}</div></div>
      <div class="row">${run.card ? `<button class="btn alt" id="lprev">Back</button>` : ""}<button class="btn" id="lnext">${last ? `Start the ${n} questions` : "Next tip"}</button></div></div>`;
    document.getElementById("lnext").onclick = () => { S.play("tap"); if (last) run.phase = "q"; else run.card++; saveRun(); rlRunView(); backButton(); top(); };
    const pv = document.getElementById("lprev"); if (pv) pv.onclick = () => { run.card--; saveRun(); rlRunView(); backButton(); };
    return;
  }
  const it = rlItem(), s = run.st[run.i] || (run.st[run.i] = { wrong: [], done: false });
  const tag = run.i === n - 1 ? "Checkpoint challenge" : run.i < 2 && !it.level ? "Spot the trap" : "Practice";
  const flash = run.flash === "up" ? `<div class="lvup pop"><b>⬆ Level up!</b> 2 in a row. You're on ${lvChip(run.level)} now. The texts and options are harder.</div>`
    : run.flash === "down" ? `<div class="lvdown">Back to ${lvChip(run.level)} to practise the strategy. Get 2 right in a row to move up again.</div>` : "";
  let h = `<div class="narrow pop"><p class="eyebrow">Reading Lab · Unit ${rlRunUnit()} · ${U.esc(m.title)}</p>
    <div class="labdots">${Array.from({ length: n }, (_, k) => `<i class="${k < run.i ? `done l${rlItem(k).level}` : k === run.i ? "now" : ""}"></i>`).join("")}</div>${flash}
    <div class="qcard"><div class="qhead"><span class="tag">${tag}</span>${lvChip(it.level)}<span class="qnum">${run.i + 1} of ${n}</span></div>
    <div class="rbox">${rlPassage(it, s.done)}</div>
    ${m.trap === "match" ? `<p class="note">Which one is best for this person?</p>` : ""}<p class="stem">${U.esc(it.stem)}</p>
    <div class="opts">${rlOrder(it).map((oi, k) => {
      let cls = "opt"; if (s.done && oi === 0) cls += " right"; else if (s.wrong.includes(oi)) cls += " wrong";
      const L = rlLetter(it.opts[oi].t);
      return `<button class="${cls}" data-ro="${oi}" ${s.done || s.wrong.includes(oi) ? "disabled" : ""}><span class="k">${L ? L[1] : "ABCD"[k]}</span><span>${U.esc(L && L[2] ? L[2] : it.opts[oi].t)}</span></button>`; }).join("")}</div>`;
  if (!s.done && s.wrong.length) { const w = it.opts[s.wrong[s.wrong.length - 1]];
    h += `<div class="fb bad"><p><strong>Not quite.</strong> ${U.esc(w.why)}</p><p>${U.esc(it.hint)}</p><p class="note">Have another try.</p></div>`; }
  if (s.done) {
    const r = run.results.find(x => x.item === run.i), first = r.first_try, got = r.support !== "explained";
    h += `<div class="fb ${got ? "ok" : "info"}"><p><strong>${first ? "Correct, first time!" : got ? "Correct." : `The answer is "${U.esc(it.opts[0].t)}".`}</strong>
        ${got ? `<span class="xpgain">+${first ? Lab.XP_LAB.first[it.level] : Lab.XP_LAB.hint} XP</span>` : ""}</p>
        ${s.wrong.length ? `<p>You chose "${U.esc(it.opts[s.wrong[0]].t)}": ${U.esc(it.opts[s.wrong[0]].why)}</p>` : ""}
        <p class="note">Look at the text: the green words prove the answer.</p>
        ${s.step && s.step.up && run.i < n - 1 ? `<p><b>2 in a row!</b> The next question is ${lvChip(s.step.level)}.</p>` : ""}
        ${s.step && s.step.rescue && run.i < n - 1 ? `<p><b>2 missed in a row.</b> Next, a quick strategy rescue to help you.</p>` : ""}</div>
      <div class="row"><button class="btn" id="lnext">${run.i === n - 1 ? "See my results" : s.step && s.step.rescue ? "Strategy rescue" : "Next question"}</button></div>`;
  }
  h += `</div></div>`;
  $app.innerHTML = h;
  const redraw = () => { saveRun(); rlRunView(); backButton(); };
  $app.querySelectorAll("[data-ro]").forEach(b => b.onclick = () => {
    const oi = +b.dataset.ro, res = support => ({ item: run.i, skill: "Reading Lab", sub: RL.RTRAPS[m.trap].name, trap: m.trap, rlab: it.id, level: it.level, first_try: support === "none", support });
    if (oi === 0) { run.results.push(res(s.wrong.length ? "hint" : "none")); s.done = true; S.play("ok"); }
    else { s.wrong.push(oi); S.play("bad"); if (s.wrong.length >= 2) { run.results.push(res("explained")); s.done = true; } }
    if (s.done) { s.step = Lab.labStep(run, !s.wrong.length); Object.assign(run, { level: s.step.level, rightRow: s.step.rightRow, wrongRow: s.step.wrongRow }); if (s.step.up) S.play("level"); }
    redraw();
    const fb = $app.querySelector(s.done ? ".rbox" : ".fb"); if (fb) fb.scrollIntoView({ block: s.done ? "start" : "center", behavior: "smooth" });
  });
  const nx = document.getElementById("lnext"); if (nx) nx.onclick = () => {
    S.play("tap");
    if (run.i === n - 1) return finishRLab();
    run.i++; run.flash = s.step && s.step.up ? "up" : null;
    if (s.step && s.step.rescue) { run.phase = "rescue"; run.rescueItem = it.id; } else rlPick();
    redraw(); top();
  };
}
function finishRLab() {
  const main = run.results.filter(r => r.skill === "Reading Lab"), bonus = E.streakBonus(history);
  if (main.length) main[main.length - 1].next = run.level;
  run.result = { score: main.filter(r => r.first_try).length, xp: Lab.labXP(run.results) + bonus, bonus, peak: RL.rlabPeak(main),
                 seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; saveRun(); runView(); top();
  const m = rlM(), first = !history.some(h => h.text_id === m.id);
  first ? Cel.big({ icon: "📖", title: `Mission ${m.n} complete, ${firstName()}!`, sub: m.title, xp: run.result.xp }) : Cel.set(run.result.xp);
}
function rlDoneView() {
  const m = rlM(), R = run.result, main = run.results.filter(r => r.skill === "Reading Lab"), next = RL.RLAB.find(x => x.n === m.n + 1);
  const caught = main.filter(r => !r.first_try).map(r => m.items.find(x => x.id === r.rlab)).filter(Boolean), peak = R.peak;
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Reading Lab · Mission ${m.n} done</p><h1>${R.score} of ${main.length} right first time</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${main.length}</b><span>right first time</span></div>
      <div class="stat"><b>${labLevel(peak)}</b><span>highest level</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    <div class="panel"><h3>Your level path</h3><ol class="lvpath">${main.map(r => `<li class="lv${r.level || 0}${r.first_try ? " ok" : ""}"><span>${r.first_try ? "✓" : "✗"}</span>${labLevel(r.level)}</li>`).join("")}</ol>
      <p class="note">${peak === 2 ? "You reached Challenge. Excellent reading!" : peak === 1 ? "You reached Stretch. Get 2 right in a row there to reach Challenge." : "Get 2 right first time in a row to move up to Stretch."}</p></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept, ${U.esc(firstName())}!</strong> <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    <div class="panel"><h3>Remember</h3><p style="margin:0">${U.esc(RL.RTRAPS[m.trap].tip)}</p></div>
    ${caught.length ? `<div class="panel"><h3>The questions that caught you</h3><ul>${caught.map(it => `<li>${U.esc(it.stem)} <span class="note">(answer: ${U.esc(it.opts[0].t)})</span></li>`).join("")}</ul></div>`
      : `<div class="fb ok winbox"><p class="big">No traps caught you!</p></div>`}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row">${next ? `<button class="btn" id="lnextm">Next mission: ${U.esc(next.title)}</button>` : ""}<button class="btn alt" id="lhub">Back to the Reading Lab</button></div></div>`;
  const nm = document.getElementById("lnextm"); if (nm) nm.onclick = () => { const u = rlRunUnit(); run = null; saveRun(); startRLab(next.id, u); };
  document.getElementById("lhub").onclick = () => { const u = rlRunUnit(); run = null; saveRun(); location.hash = `#rlab-${u}`; route(); top(); };
  saveAttempt({ mode: "vocab", text_id: m.id, level_start: run.start ?? 0, level_end: null, score: R.score, max_score: main.length,
                xp: R.xp, seconds: R.seconds, answers: run.results.map(({ item, ...r }) => r) });
}

/* ---------------- Grammar Lab ---------------- */
// Grammar missions that start with meaning (glab.js): a scene with the grammar lit up, Spot it (sort the examples, choose
// the rule), Get it (4 meaning checks with a meter or a timeline), Use it (the mission's game, then one sentence that the
// AI marker checks, keywords as the backup), then Prove it: 6 Checkpoint-style questions on the Lab engine, with a rescue.
const GL_STEPS = [["Spot it", "Find the pattern in a short scene."], ["Get it", "Check what it means, with a meter or a timeline."],
  ["Use it", "Use it to solve the mission."], ["Prove it", "6 Checkpoint-style questions that change with you."]];
function glabHubView() {
  const att = id => history.filter(h => h.text_id === id);
  const start = GL.glabStartLevel(history, P.tierFor(history));
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Grammar · New</p><h1>Grammar Lab</h1>
      <p class="lede">Grammar missions where you work out the rule yourself, then use it to solve something.</p></div>
    <ol class="glsteps">${GL_STEPS.map(([h, p]) => `<li><b>${h}</b><span class="note">${p}</span></li>`).join("")}</ol>
    <div class="tiles">${GL.GLAB.map(m => { const a = att(m.id), best = a.length ? Math.max(...a.map(h => h.score)) : null;
      return aTile("grammar", `data-glab="${m.id}"`, `${m.n}. ${m.title}`, best != null ? `${m.point} ${m.short} · best ${best} of ${GL.GLAB_LEN} · reached ${labLevel(Math.max(...a.map(h => GL.glabPeak(h.answers || []))))}`
        : `Unit ${m.unit} · ${m.point} ${m.short}. ${m.blurb}`, best != null); }).join("")}</div>
    <p class="note">Prove it starts on ${lvChip(start)}. Get 2 right first time in a row to move up.</p></div>`;
  bindActivities();
}
function startGLab(id) {
  const level = GL.glabStartLevel(history, P.tierFor(history));
  run = { kind: "glab", id, phase: "scene", gi: 0, ui: 0, i: 0, sort: {}, sortTries: 0, sortBad: [], cs: {}, st: {}, results: [], seq: [], draft: "", wtries: 0,
          level, start: level, rightRow: 0, wrongRow: 0, t0: Date.now(), orders: {} };
  saveRun(); route(); top();
}
const glM = () => GL.glabMission(run.id);
const glPick = () => { run.seq[run.i] = Lab.nextLabItem({ items: glM().prove }, run.level, run.seq.slice(0, run.i), GL.seenGItems(history)).id; };
const glItem = (i = run.i) => glM().prove.find(x => x.id === run.seq[i]);
const glScene = (m, open = true) => `<div class="rbox glscene"><p class="eyebrow">${U.esc(m.scene.title)}</p>${m.scene.paras.map(p =>
  `<p>${GL.sceneParts(p).map(x => x.hi ? `<mark>${U.esc(x.t)}</mark>` : U.esc(x.t)).join("")}</p>`).join("")}</div>`;
const glGap = t => U.esc(t).split("___").join(`<span class="rgap" role="img" aria-label="gap"></span>`);
// Lab text with the grammar words (past participle, plural…) as buttons that open a short explanation.
const glx = t => U.esc(t).replace(GL.TERM_RE, w => `<button type="button" class="gw" data-gt="${GL.termKey(w)}">${w}</button>`);
// Base form → past participle for this mission's verbs. Open by default while support is on.
const glBank = m => { const v = GL.VERBS[m.id]; return v ? `<details class="glbank"${run.helpOn ? " open" : ""}><summary>🧰 Verb helper: past participles</summary>
  <div class="glbank-in">${v.map(([a, b]) => `<span>${U.esc(a)} → <b>${U.esc(b)}</b></span>`).join("")}</div>
  ${m.point === "3.3" ? `<p class="note">One thing → <b>was</b> being. More than one (plural) → <b>were</b> being.</p>` : `<p class="note">must / might / can't + <b>have</b> + past participle</p>`}</details>` : ""; };
function showTerm(key) {
  const t = GL.TERMS[key]; if (!t) return;
  let el = document.getElementById("sheet");
  if (!el) { el = document.createElement("div"); el.id = "sheet"; el.className = "sheet"; document.body.appendChild(el); }
  el.innerHTML = `<div class="sheet-in pop" role="dialog" aria-label="What is ${U.esc(t.t)}?">
    <div class="row" style="justify-content:space-between"><b class="sw">${U.esc(t.t)}</b><button class="xbtn" id="sclose" aria-label="Close">✕</button></div>
    <p class="note" style="margin:0">Tiếng Việt: ${U.esc(t.vi)}</p><p style="margin:0">${U.esc(t.def)}</p>
    <div class="glbank-in">${t.ex.map(([a, b]) => `<span>${U.esc(a)} → <b>${U.esc(b)}</b></span>`).join("")}</div>
    <p style="margin:0"><b>Tip:</b> ${U.esc(t.tip)}</p></div>`;
  el.hidden = false; S.play("tap");
  document.getElementById("sclose").onclick = () => { el.hidden = true; };
}
const glHead = (step, extra = "") => `<p class="eyebrow">Grammar Lab · ${U.esc(glM().title)}</p>
  <div class="glbar">${GL_STEPS.map(([h], k) => `<span class="${k < step ? "done" : k === step ? "now" : ""}">${h}</span>`).join("")}</div>${extra}`;
// A meter (how sure), a timeline (what was in progress) or a quote, drawn above a meaning check.
function glVisual(v) {
  if (!v) return "";
  if (v.kind === "quote") return `<p class="glquote">“${U.esc(v.t)}”</p>`;
  if (v.kind === "meter") return `<div class="glmeter" role="img" aria-label="${U.esc(v.who)} is ${v.at}% sure"><div class="glm-track"><i style="left:${v.at}%"></i></div>
      <div class="glm-labels"><span>0% sure it happened</span><span>50%</span><span>100% sure</span></div><p class="note">${U.esc(v.who)}: ${v.at}% sure</p></div>`;
  if (v.kind === "timeline") return `<div class="gltime" role="img" aria-label="${U.esc(v.span)} from ${U.esc(v.from)} to ${U.esc(v.to)}; ${U.esc(v.point)}">
      <div class="glt-line"><span class="glt-span">${U.esc(v.span)}</span><i class="glt-dot" style="left:${Math.round(v.at * 100)}%"></i></div>
      <div class="glt-ends"><span>${U.esc(v.from)}</span><span>${U.esc(v.to)}</span></div><p class="note">⚡ ${U.esc(v.point)}</p></div>`;
  return "";
}
// Help that adapts. Every question has "Need a hint?". One wrong answer shows why it's wrong plus the hint; two wrong
// answers explain the right answer, then (Get it, Use it) a question like it to try straight away. After 2 explained
// answers (1 for a student who started on Core), support turns on: the hint shows with every question until they get
// 3 right in a row.
const glHintHTML = (key, item, s) => !item.hint || s.done ? "" : s.hint && !s.wrong.length ? `<div class="fb hint"><p><b>💡 Hint:</b> ${glx(item.hint)}</p></div>`
  : s.hint || s.wrong.length ? "" : `<div class="row"><button class="btn alt small" data-ghint="${key}">💡 Need a hint?</button></div>`;
function glTrack(explained) {
  if (explained) { run.okRow = 0; run.helpN = (run.helpN || 0) + 1;
    if (!run.helpOn && run.helpN >= (run.start ? 2 : 1)) { run.helpOn = true; run.helpMsg = "on"; } return; }
  run.okRow = (run.okRow || 0) + 1;
  if (run.helpOn && run.okRow >= 3) { run.helpOn = false; run.helpN = 0; run.helpMsg = "off"; }
}
const glHelpNote = () => { const k = run.helpMsg; run.helpMsg = null;
  return k === "on" ? `<div class="lvdown">💡 <b>Support is on.</b> You'll see a hint with each question. It switches off when you get 3 right in a row.</div>`
    : k === "off" ? `<div class="lvup pop">⬆ <b>3 in a row!</b> Hints are off now. You can still tap "Need a hint?".</div>` : ""; };
function glChoiceHTML(key, item) {
  const s = run.cs[key] || (run.cs[key] = { wrong: [], done: false, hint: !!run.helpOn });
  let h = `<div class="opts">${order(key, item.opts.length).map((oi, k) => {
    let cls = "opt"; if (s.done && oi === 0) cls += " right"; else if (s.wrong.includes(oi)) cls += " wrong";
    return `<button class="${cls}" data-go="${oi}" data-gk="${key}" ${s.done || s.wrong.includes(oi) ? "disabled" : ""}><span class="k">${"ABCD"[k]}</span><span>${U.esc(item.opts[oi].t)}</span></button>`; }).join("")}</div>`;
  h += glHintHTML(key, item, s);
  if (!s.done && s.wrong.length) h += `<div class="fb bad"><p><strong>Not quite.</strong> ${glx(item.opts[s.wrong[s.wrong.length - 1]].why)}</p>
    ${item.hint ? `<p><b>💡 Hint:</b> ${glx(item.hint)}</p>` : ""}<p class="note">Have another try.</p></div>`;
  if (s.done) h += s.wrong.length >= 2 ? `<div class="fb info"><p><strong>Let's work it out together, ${U.esc(firstName())}.</strong></p><p>${glx(item.explain || "")}</p></div>`
    : `<div class="fb ok"><p><strong>${s.wrong.length ? "Yes, that's it." : s.hint ? "Correct!" : "Correct, first time!"}</strong> ${s.wrong.length || s.hint ? "" : `<span class="xpgain">+${GL.XP_GLAB.step} XP</span>`}</p></div>`;
  return h;
}
// A question like the one just explained. Its result upgrades the main answer from "explained" to "twin".
function glTwinHTML(key, item) {
  const s = run.cs[key];
  if (!s || !s.done || s.wrong.length < 2 || !item.twin) return "";
  if (!s.twinOn) return `<div class="row"><button class="btn" data-gtwin="${key}">Try one like it</button></div>`;
  const t = run.cs[`${key}~t`];
  return `<div class="qcard pop" id="gtwinq"><div class="qhead"><span class="tag">Try one like it</span></div>${glVisual(item.twin.visual)}<p class="stem">${glGap(item.twin.stem)}</p>
    ${glChoiceHTML(`${key}~t`, item.twin)}${t && t.done && t.wrong.length < 2 ? `<p class="note">You've got it now. +${GL.XP_GLAB.twin} XP</p>` : ""}</div>`;
}
const glStepDone = (key, item) => { const s = run.cs[key]; return !!s && s.done && (s.wrong.length < 2 || !item.twin || !!(run.cs[`${key}~t`] || {}).done); };
function glBindChoice(step, items, redraw) {
  $app.querySelectorAll("[data-ghint]").forEach(b => b.onclick = () => { run.cs[b.dataset.ghint].hint = true; S.play("tap"); redraw(); });
  $app.querySelectorAll("[data-gtwin]").forEach(b => b.onclick = () => { run.cs[b.dataset.gtwin].twinOn = true; S.play("tap"); redraw(); const q = document.getElementById("gtwinq"); if (q) q.scrollIntoView({ block: "start", behavior: "smooth" }); });
  $app.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
    const key = b.dataset.gk, oi = +b.dataset.go, s = run.cs[key], twin = key.endsWith("~t"), main = twin ? key.slice(0, -2) : key, item = twin ? items(main).twin : items(key);
    const res = support => ({ skill: "Grammar Lab", step, point: glM().point, item: items(main).id || main, first_try: support === "none", support });
    if (oi === 0) { s.done = true; S.play("ok");
      if (twin) { const r = run.results.find(x => x.item === (items(main).id || main) && x.step === step); if (r && s.wrong.length < 2) r.support = "twin"; }
      else { run.results.push(res(s.wrong.length || s.hint ? "hint" : "none")); glTrack(false); } }
    else { s.wrong.push(oi); S.play("bad"); if (s.wrong.length >= 2) { s.done = true; if (!twin) { run.results.push(res("explained")); glTrack(true); } } }
    redraw(); const f = $app.querySelectorAll(".fb"); if (f.length) f[f.length - 1].scrollIntoView({ block: "center", behavior: "smooth" });
  });
}
function glRunView() {
  const m = glM(), redraw = () => { saveRun(); glRunView(); backButton(); }, go = (fn) => { S.play("tap"); fn(); saveRun(); glRunView(); backButton(); top(); };
  const nextBtn = (label, id = "gnext") => `<div class="row"><button class="btn" id="${id}">${label}</button></div>`;
  if (run.phase === "scene") {
    $app.innerHTML = `<div class="narrow pop">${glHead(0)}<h1>${U.esc(m.title)}</h1><p class="lede">${U.esc(m.blurb)}</p>
      ${glScene(m)}<div class="panel"><p style="margin:0"><b>Look at the highlighted words.</b> What do they tell you? You'll work out the rule yourself.</p></div>${nextBtn("Spot it: sort the sentences")}</div>`;
    document.getElementById("gnext").onclick = () => go(() => { run.phase = "spot"; });
    return;
  }
  if (run.phase === "spot") {
    const sp = m.spot, checked = run.sortDone, bad = run.sortBad || [];
    let h = `<div class="narrow pop">${glHead(0)}<h2>Sort the sentences</h2><p class="note">Tap a group for each sentence. Use the scene to help you.</p>${glScene(m)}
      <div class="glsort">${sp.sentences.map((x, k) => `<div class="glrow${checked || run.sortShown ? (run.sort[k] === x.bin ? " ok" : " bad") : bad.includes(k) ? " bad" : ""}"><p>${U.esc(x.t)}</p>
        <div class="glbins">${sp.bins.map((b, j) => `<button class="glbin${run.sort[k] === j ? " on" : ""}${run.sortShown && x.bin === j ? " ans" : ""}" data-sk="${k}" data-sb="${j}" ${checked ? "disabled" : ""}>${U.esc(b)}</button>`).join("")}</div></div>`).join("")}</div>`;
    if (!checked && bad.length) h += `<div class="fb bad"><p><strong>${sp.sentences.length - bad.length} of ${sp.sentences.length} right.</strong> The red ones are in the wrong group. Look at the highlighted words in the scene again.</p></div>`;
    if (checked) h += run.sortShown ? `<div class="fb info"><p><strong>Here are the right groups.</strong> Look at what is the same in each group.</p></div>`
      : `<div class="fb ok"><p><strong>${run.sortTries ? "All sorted!" : "All sorted, first time!"}</strong> ${run.sortTries ? "" : `<span class="xpgain">+${GL.XP_GLAB.step} XP</span>`}</p></div>`;
    h += checked ? nextBtn("Now choose the rule") : `<div class="row"><button class="btn" id="gcheck" ${Object.keys(run.sort).length < sp.sentences.length ? "disabled" : ""}>Check my groups</button></div>`;
    $app.innerHTML = h + `</div>`;
    $app.querySelectorAll("[data-sk]").forEach(b => b.onclick = () => { run.sort[+b.dataset.sk] = +b.dataset.sb; run.sortBad = (run.sortBad || []).filter(k => k !== +b.dataset.sk); S.play("tap"); redraw(); });
    const c = document.getElementById("gcheck"); if (c) c.onclick = () => {
      run.sortBad = sp.sentences.map((x, k) => run.sort[k] === x.bin ? -1 : k).filter(k => k >= 0);
      const res = support => ({ skill: "Grammar Lab", step: "spot", point: m.point, item: "sort", first_try: support === "none", support });
      if (!run.sortBad.length) { run.sortDone = true; run.results.push(res(run.sortTries ? "hint" : "none")); S.play("ok"); }
      else { run.sortTries++; S.play("bad"); if (run.sortTries >= 2) { run.sortDone = true; run.sortShown = true; run.results.push(res("explained")); } }
      redraw(); const f = $app.querySelector(".fb"); if (f) f.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    const n = document.getElementById("gnext"); if (n) n.onclick = () => go(() => { run.phase = "rule"; });
    return;
  }
  if (run.phase === "rule") {
    const item = { opts: m.spot.rules, hint: m.spot.hint, explain: m.spot.explain }, s = run.cs.rule;
    $app.innerHTML = `<div class="narrow pop">${glHead(0)}${glHelpNote()}<h2>Which rule explains the sentences?</h2>${glScene(m)}${glChoiceHTML("rule", item)}
      ${s && s.done ? `<div class="strat"><b>The rule</b><p style="margin:6px 0 0">${glx(m.rule)}</p></div>${nextBtn("Get it: check the meaning")}` : ""}</div>`;
    glBindChoice("rule", () => item, redraw);
    const n = document.getElementById("gnext"); if (n) n.onclick = () => go(() => { run.phase = "get"; run.gi = 0; });
    return;
  }
  if (run.phase === "get") {
    const it = m.get[run.gi], last = run.gi === m.get.length - 1;
    $app.innerHTML = `<div class="narrow pop">${glHead(1, `<div class="labdots">${m.get.map((_, k) => `<i class="${k < run.gi ? "done" : k === run.gi ? "now" : ""}"></i>`).join("")}</div>`)}
      <div class="qcard"><div class="qhead"><span class="tag">Get it</span><span class="qnum">${run.gi + 1} of ${m.get.length}</span></div>
      ${glHelpNote()}${glVisual(it.visual)}<p class="stem">${glx(it.stem)}</p>${glChoiceHTML(it.id, it)}</div>
      ${glTwinHTML(it.id, it)}${glStepDone(it.id, it) ? nextBtn(last ? `Use it: ${m.use.h.toLowerCase()}` : "Next") : ""}</div>`;
    glBindChoice("get", () => it, redraw);
    const n = document.getElementById("gnext"); if (n) n.onclick = () => go(() => { if (last) { run.phase = "use"; run.ui = 0; } else run.gi++; });
    return;
  }
  const clues = `<div class="panel glclues"><p class="eyebrow">${m.point === "2.4" ? "The clues" : "Security log"}</p><ul>${m.use.clues.map(c => `<li>${U.esc(c)}</li>`).join("")}</ul></div>`;
  if (run.phase === "use") {
    const it = m.use.items[run.ui], last = run.ui === m.use.items.length - 1;
    $app.innerHTML = `<div class="narrow pop">${glHead(2, `<div class="labdots">${m.use.items.map((_, k) => `<i class="${k < run.ui ? "done" : k === run.ui ? "now" : ""}"></i>`).join("")}</div>`)}
      <h2>${U.esc(m.use.h)}</h2><p class="note">${U.esc(m.use.intro)}</p>${clues}${glBank(m)}
      <div class="qcard"><div class="qhead"><span class="tag">Use it</span><span class="qnum">${run.ui + 1} of ${m.use.items.length}</span></div>
      ${glHelpNote()}<p class="stem">${glGap(it.stem)}</p>${glChoiceHTML(it.id, it)}</div>
      ${glTwinHTML(it.id, it)}${glStepDone(it.id, it) ? nextBtn(last ? "Write your own sentence" : "Next") : ""}</div>`;
    glBindChoice("use", () => it, redraw);
    const n = document.getElementById("gnext"); if (n) n.onclick = () => go(() => { if (last) run.phase = "write"; else run.ui++; });
    return;
  }
  if (run.phase === "write") {
    const w = m.use.write, fb = run.wfb, done = fb && (fb.kind === "ok" || fb.kind === "explained");
    let h = `<div class="narrow pop">${glHead(2)}<h2>Your turn</h2>${clues}${glBank(m)}
      <div class="qcard"><div class="qhead"><span class="tag">Use it</span><span class="qnum">Your sentence</span></div><p class="stem">${glx(w.stem)}</p>
      <label class="fld" for="gans" style="font-weight:400"><span class="note">One sentence is enough.</span><textarea id="gans" rows="3" ${done ? "disabled" : ""}>${U.esc(run.draft)}</textarea></label>`;
    if (fb) h += fb.kind === "ok" ? `<div class="fb ok pop"><p><strong>Great sentence, ${U.esc(firstName())}!</strong> <span class="xpgain">+${run.wtries >= 2 ? GL.XP_GLAB.frame : GL.XP_GLAB.write} XP</span></p>${fb.ai ? `<p class="note">Checked by AI: ${U.esc(fb.ai)}</p>` : ""}</div>`
      : fb.kind === "explained" ? `<div class="fb info pop"><p><strong>Let's look at an example together, ${U.esc(firstName())}.</strong></p><p>${U.esc(w.model)}</p><p>${glx(w.explain || "")}</p></div>`
      : `<div class="fb bad pop"><p><strong>${fb.tooShort ? "Too short." : "Not quite yet."}</strong> ${glx(fb.tooShort ? "Write a whole sentence." : fb.msg)}</p>
        ${fb.frame ? `<p><b>Let's build it together.</b> Start like this and fill the gaps with ideas from the clues:</p><p class="egrow"><span class="chip">Start</span> ${U.esc(w.frame)}</p>
          <div class="row"><button class="btn alt small" id="gframe">Use this start</button></div>` : ""}</div>`;
    h += done ? nextBtn("Prove it: 6 Checkpoint questions") : `<div class="row"><button class="btn" id="gcheck">Check my sentence</button></div>`;
    $app.innerHTML = h + `</div></div>`;
    const a = document.getElementById("gans"); if (a) a.oninput = () => { run.draft = a.value; saveRun(); };
    const fr = document.getElementById("gframe"); if (fr) fr.onclick = () => { run.draft = w.frame; saveRun(); a.value = w.frame; a.focus(); a.setSelectionRange(w.frame.indexOf("___"), w.frame.indexOf("___") + 3); };
    const c = document.getElementById("gcheck"); if (c) c.onclick = async () => {
      const q = { type: "short", groups: w.groups, need: w.need }, response = a.value || "";
      let mk = E.mark(q, response), ai = null;
      if (mk.tooShort) { run.wfb = { kind: "bad", tooShort: true }; return redraw(); }
      c.disabled = true; c.textContent = "Checking your sentence…";
      ai = await api.aiMark(session.token, { text_id: m.id, slot: 0, level: 0, stem: w.stem, paragraph: [...m.scene.paras.map(p => p.replace(/\[\[|\]\]/g, "")), ...m.use.clues].join("\n"),
        points: w.groups.map(g => g.label), need: w.need, answer: response, name: firstName() });
      if (!run || run.kind !== "glab" || run.phase !== "write") return;
      if (ai) mk = { ok: ai.ok, hits: ai.hits };
      const res = support => ({ skill: "Grammar Lab", step: "write", point: m.point, item: "write", first_try: support === "none", support, ai: !!ai });
      if (mk.ok) { run.results.push(res(run.wtries >= 2 ? "frame" : run.wtries ? "hint" : "none")); run.wfb = { kind: "ok", ai: ai && ai.feedback }; S.play("ok"); }
      else if (run.wtries >= 2) { run.results.push(res("explained")); run.wfb = { kind: "explained" }; S.play("info"); }
      else { run.wtries++; const miss = w.groups.find(g => !mk.hits.includes(g.label));
        run.wfb = { kind: "bad", frame: run.wtries >= 2 && !!w.frame, msg: ai && ai.feedback ? ai.feedback : miss ? miss.ask : "Read the task again." }; S.play("bad"); }
      redraw();
    };
    const n = document.getElementById("gnext"); if (n) n.onclick = () => go(() => { run.phase = "prove"; run.i = 0; glPick(); });
    return;
  }
  if (run.phase === "rescue") return glRescueView();
  glProveView();
}
function glRescueView() {
  const m = glM(), it = m.prove.find(x => x.id === run.rescueItem), down = run.level > 0;
  $app.innerHTML = `<div class="narrow pop">${glHead(3)}<h1>Let's look at the rule again</h1>
    <p class="lede">Those two were tricky. Read the rule and the scene again, then try a similar question.</p>
    <div class="strat"><b>The rule</b><p style="margin:6px 0 0">${glx(m.rule)}</p></div>${glScene(m)}
    <div class="panel"><p class="eyebrow">The last question</p><p class="stem">${glGap(it.stem)}</p><p class="egrow"><span class="chip">Answer</span> ${U.esc(it.type === "type" ? it.accept[0] : it.opts[0].t)}</p></div>
    <div class="row"><button class="btn" id="gnext">Try a similar question</button></div>
    ${down ? `<p class="note">The next question is ${lvChip(run.level - 1)}, so you can practise the rule.</p>` : ""}</div>`;
  document.getElementById("gnext").onclick = () => { S.play("tap");
    if (run.level > 0) { run.level--; run.flash = "down"; }
    run.phase = "prove"; run.rescueItem = null; glPick(); saveRun(); glRunView(); backButton(); top(); };
}
function glProveView() {
  const m = glM(), n = GL.GLAB_LEN, it = glItem(), s = run.st[run.i] || (run.st[run.i] = { wrong: [], tries: [], done: false, hint: !!run.helpOn });
  const flash = run.flash === "up" ? `<div class="lvup pop"><b>⬆ Level up!</b> 2 in a row. You're on ${lvChip(run.level)} now.</div>`
    : run.flash === "down" ? `<div class="lvdown">Back to ${lvChip(run.level)} to practise the rule. Get 2 right in a row to move up again.</div>` : "";
  let h = `<div class="narrow pop">${glHead(3, `<div class="labdots">${Array.from({ length: n }, (_, k) => `<i class="${k < run.i ? `done l${glItem(k).level}` : k === run.i ? "now" : ""}"></i>`).join("")}</div>`)}${flash}${glHelpNote()}
    <div class="qcard"><div class="qhead"><span class="tag">${run.i === n - 1 ? "Checkpoint challenge" : "Prove it"}</span>${lvChip(it.level)}<span class="qnum">${run.i + 1} of ${n}</span></div>
    <p class="stem">${glGap(it.stem)}</p>`;
  if (it.type === "type") {
    h += `<p class="note">Write ONE word.</p><div class="row"><input type="text" id="gword" autocomplete="off" autocapitalize="off" spellcheck="false" style="max-width:14em" ${s.done ? "disabled" : ""} value="${U.esc(s.done ? it.accept[0] : "")}">
      ${s.done ? "" : `<button class="btn" id="gcheck">Check</button>`}</div>`;
    if (!s.done && s.tries.length) h += `<div class="fb bad"><p><strong>Not quite.</strong> "${U.esc(s.tries[s.tries.length - 1])}" doesn't fit.</p><p><b>💡 Hint:</b> ${glx(it.hint)}</p><p class="note">Have another try.</p></div>`;
    else h += glHintHTML("p", it, { ...s, wrong: s.tries });
  } else h += `<div class="opts">${order(`gp${run.i}`, it.opts.length).map((oi, k) => {
      let cls = "opt"; if (s.done && oi === 0) cls += " right"; else if (s.wrong.includes(oi)) cls += " wrong";
      return `<button class="${cls}" data-gp="${oi}" ${s.done || s.wrong.includes(oi) ? "disabled" : ""}><span class="k">${"ABCD"[k]}</span><span>${U.esc(it.opts[oi].t)}</span></button>`; }).join("")}</div>
    ${!s.done && s.wrong.length ? `<div class="fb bad"><p><strong>Not quite.</strong> ${glx(it.opts[s.wrong[s.wrong.length - 1]].why)}</p>${it.hint ? `<p><b>💡 Hint:</b> ${glx(it.hint)}</p>` : ""}<p class="note">Have another try.</p></div>` : glHintHTML("p", it, s)}`;
  if (s.done) {
    const r = run.results.find(x => x.item === `p${run.i}`), first = r.first_try, got = r.support !== "explained";
    h += `<div class="fb ${got ? "ok" : "info"}"><p><strong>${first ? "Correct, first time!" : got ? "Correct." : `Let's work it out together, ${U.esc(firstName())}.`}</strong>
        ${got ? `<span class="xpgain">+${first ? GL.XP_GLAB.first[it.level] : GL.XP_GLAB.hint} XP</span>` : ""}</p>
        ${got ? "" : `<p>The answer is <b>${U.esc(it.type === "type" ? it.accept[0] : it.opts[0].t)}</b>. ${glx(it.explain || "")}</p>`}
        ${s.step && s.step.up && run.i < n - 1 ? `<p><b>2 in a row!</b> The next question is ${lvChip(s.step.level)}.</p>` : ""}
        ${s.step && s.step.rescue && run.i < n - 1 ? `<p><b>2 missed in a row.</b> Next, a quick look at the rule.</p>` : ""}</div>
      <div class="row"><button class="btn" id="gnext">${run.i === n - 1 ? "See my results" : s.step && s.step.rescue ? "Look at the rule" : "Next question"}</button></div>`;
  }
  $app.innerHTML = h + `</div></div>`;
  const redraw = () => { saveRun(); glRunView(); backButton(); };
  const finish = right => {
    const res = support => ({ item: `p${run.i}`, skill: "Grammar", point: m.point, glab: it.id, level: it.level, first_try: support === "none", support });
    const tries = it.type === "type" ? s.tries.length : s.wrong.length;
    if (right) { run.results.push(res(tries || s.hint ? "hint" : "none")); s.done = true; S.play("ok"); glTrack(false); }
    else { S.play("bad"); if (tries >= 2) { run.results.push(res("explained")); s.done = true; glTrack(true); } }
    if (s.done) { s.step = Lab.labStep(run, right && !tries && !s.hint);
      Object.assign(run, { level: s.step.level, rightRow: s.step.rightRow, wrongRow: s.step.wrongRow }); if (s.step.up) S.play("level"); }
    redraw(); const f = $app.querySelector(".fb"); if (f) f.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  $app.querySelectorAll("[data-ghint]").forEach(b => b.onclick = () => { s.hint = true; S.play("tap"); redraw(); });
  $app.querySelectorAll("[data-gp]").forEach(b => b.onclick = () => { const oi = +b.dataset.gp; if (oi !== 0) s.wrong.push(oi); finish(oi === 0); });
  const c = document.getElementById("gcheck"), inp = document.getElementById("gword");
  if (c) { const check = () => { const v = inp.value.trim(); if (!v) return; const ok = GL.typedOk(it, v); if (!ok) s.tries.push(v); finish(ok); };
    c.onclick = check; inp.onkeydown = ev => { if (ev.key === "Enter") check(); }; }
  const nx = document.getElementById("gnext"); if (nx) nx.onclick = () => {
    S.play("tap");
    if (run.i === n - 1) return finishGLab();
    run.i++; run.flash = s.step && s.step.up ? "up" : null;
    if (s.step && s.step.rescue) { run.phase = "rescue"; run.rescueItem = it.id; } else glPick();
    redraw(); top();
  };
}
function finishGLab() {
  const main = run.results.filter(r => r.skill === "Grammar"), bonus = E.streakBonus(history);
  if (main.length) main[main.length - 1].next = run.level;
  run.result = { score: main.filter(r => r.first_try).length, xp: GL.glabXP(run.results) + bonus, bonus, peak: GL.glabPeak(main), seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; saveRun(); runView(); top();
  const m = glM(), first = !history.some(h => h.text_id === m.id);
  first ? Cel.big({ icon: "🔎", title: `Mission complete, ${firstName()}!`, sub: m.title, xp: run.result.xp }) : Cel.set(run.result.xp);
}
function glDoneView() {
  const m = glM(), R = run.result, main = run.results.filter(r => r.skill === "Grammar"), next = GL.GLAB.find(x => x.n === m.n + 1);
  const caught = main.filter(r => !r.first_try).map(r => m.prove.find(x => x.id === r.glab)).filter(Boolean);
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Grammar Lab · Mission ${m.n} done</p><h1>${R.score} of ${main.length} right first time</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${main.length}</b><span>Prove it, first time</span></div>
      <div class="stat"><b>${labLevel(R.peak)}</b><span>highest level</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    <div class="strat"><b>Remember: ${U.esc(m.point)} ${U.esc(m.short)}</b><p style="margin:6px 0 0">${U.esc(m.rule)}</p></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept, ${U.esc(firstName())}!</strong> <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    ${caught.length ? `<div class="panel"><h3>The questions that caught you</h3><ul>${caught.map(it => `<li>${glGap(it.stem)} <span class="note">(answer: ${U.esc(it.type === "type" ? it.accept[0] : it.opts[0].t)})</span></li>`).join("")}</ul></div>`
      : `<div class="fb ok winbox"><p class="big">Perfect proof!</p></div>`}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row">${next ? `<button class="btn" id="gnextm">Next mission: ${U.esc(next.title)}</button>` : ""}<button class="btn alt" id="gmore">More ${U.esc(m.point)} practice</button><button class="btn alt" id="ghub">Back to the Grammar Lab</button></div></div>`;
  const nm = document.getElementById("gnextm"); if (nm) nm.onclick = () => { run = null; saveRun(); startGLab(next.id); };
  document.getElementById("gmore").onclick = () => { const p = m.point; run = null; saveRun(); startPoint(p); };
  document.getElementById("ghub").onclick = () => { run = null; saveRun(); location.hash = "#glab"; route(); top(); };
  saveAttempt({ mode: "vocab", text_id: m.id, level_start: run.start ?? 0, level_end: null, score: R.score, max_score: main.length,
                xp: R.xp, seconds: R.seconds, answers: run.results.map(({ item, ...r }) => r) });
}

/* ---------------- skill drills ---------------- */
// Four questions on one reading skill, from different texts at the student's level. A wrong answer shows the hint and
// lights up the words that prove the answer; a second wrong answer shows the answer and moves on.
// The English name if the teacher added one (it can be two words, like "Ryan A"), otherwise the last word of the full name.
function firstName() { return me.english_name || me.name.split(" ").pop(); }
function startDrill(skill, { exclude = null } = {}) {
  const seed = history.filter(h => h.text_id === D.drillId(skill)).length;
  const items = D.drillItems(skill, { unit: P.focusUnit(), level: E.steadyLevel(history, me.level ?? 1), exclude, seed });
  if (!items.length) return;
  run = { kind: "drill", skill, textId: D.drillId(skill), items, i: 0, tries: 0, phase: "teach", results: [], orders: {}, pick: null, draft: "", fb: null, t0: Date.now() };
  saveRun(); route(); top();
}
function drillView() {
  const st = STRATEGY[run.skill], n = run.items.length;
  if (run.phase === "teach") {
    $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Skill drill</p><h1>${U.esc(run.skill)}</h1>
      <p class="lede">${n} questions on this skill, each from a different text. Read the part of the text, then answer.</p>
      <div class="strat"><b>Strategy: ${U.esc(st.name)}</b><ol>${st.steps.map(s => `<li>${U.esc(s)}</li>`).join("")}</ol></div>
      <div class="row"><button class="btn" id="dgo">Start the ${n} questions</button></div></div>`;
    document.getElementById("dgo").onclick = () => { S.play("tap"); run.phase = "q"; saveRun(); runView(); top(); };
    return;
  }
  const it = run.items[run.i], { text, q, explain, paras } = D.drillQuestion(it), short = q.type === "short";
  const fb = run.fb, locked = !!(fb && (fb.kind === "ok" || fb.kind === "explained")), lit = run.tries > 0 || locked;
  const whole = run.skill === "Main idea" || run.skill === "Writer's view";
  const part = whole ? paras : paras.filter(p => it.para.includes(p[0]));
  const T = { title: text.levels[it.level].title, paras: part, gloss: text.levels[it.level].gloss };
  let h = `<div class="narrow pop"><p class="eyebrow">Skill drill · ${U.esc(run.skill)}</p>
    <div class="progress">${run.items.map((_, k) => { const x = run.results[k]; return `<i class="${k === run.i ? "cur" : x ? (x.first_try ? "ok" : "help") : ""}"></i>`; }).join("")}</div>
    <p class="note">From <b>${U.esc(text.topic)}</b> (${E.LEVELS[it.level]} text)${whole ? "" : `, paragraph${part.length > 1 ? "s" : ""} ${part.map(p => p[0]).join(" and ")}`}</p>
    <div class="rbox">${U.textHTML(T, lit ? { para: it.para[0], focus: q.focus } : {})}</div>
    ${whole ? "" : `<details class="dwhole"><summary>Read the whole text</summary>${U.textHTML(text.levels[it.level])}</details>`}
    <div class="qcard"><div class="qhead"><span class="tag">${U.esc(run.skill)}</span><span class="qnum">Question ${run.i + 1} of ${run.items.length}</span></div>
    <p class="stem">${U.esc(q.stem)}</p>`;
  if (short) h += `<label class="fld" for="ans" style="font-weight:400"><span class="note">Short answer. Use your own words or words from the text.${q.need > 1 ? ` Give ${q.need} different points.` : ""}</span>
      <textarea id="ans" ${locked ? "disabled" : ""}>${U.esc(run.draft)}</textarea></label>`;
  else h += optsHTML(q, order("d" + run.i, q.opts.length), fb ? { right: fb.kind === "ok", wrong: fb.wrong, reveal: fb.kind === "explained", locked } : null);
  if (fb) {
    if (fb.kind === "ok") h += `<div class="fb ok pop"><p><strong>Correct.</strong> ${fb.first ? "Right first time." : "Well done for using the hint."} ${fb.xp ? `<span class="xpgain">+${fb.xp} XP</span>` : ""}</p>${fb.ai ? `<p class="note">Checked by AI: ${U.esc(fb.ai)}</p>` : ""}</div>`;
    else if (fb.kind === "explained") h += `<div class="fb info pop"><p><strong>Let's look at the answer together, ${U.esc(firstName())}.</strong></p>
        <p>${U.esc(explain || `The answer is "${short ? "" : q.opts[0]}". The highlighted words in the text show why.`)}</p></div>`;
    else h += `<div class="fb bad pop"><p><strong>${fb.tooShort ? "Too short." : "Not quite."}</strong> ${U.esc(fb.tooShort ? "Write at least a few words." : fb.partial || (short ? "Your answer does not match the text yet." : "That is not the answer."))}</p>
        ${fb.tooShort ? "" : `<p><b>Hint:</b> ${U.esc(q.hint)}</p><p class="note">The highlighted words in the text will help. Try once more.</p>`}</div>`;
  }
  h += `<div class="row">${locked ? `<button class="btn" id="dnext">${run.i === run.items.length - 1 ? "See my results" : "Next question"}</button>`
                                  : `<button class="btn" id="dcheck">Check answer</button>`}</div></div></div>`;
  $app.innerHTML = h;
  bindOpts(() => { runView(); });
  const a = document.getElementById("ans"); if (a) a.oninput = () => { run.draft = a.value; saveRun(); };
  const c = document.getElementById("dcheck"); if (c) c.onclick = () => drillCheck();
  const nx = document.getElementById("dnext"); if (nx) nx.onclick = () => {
    S.play("tap");
    if (run.i === run.items.length - 1) return finishDrill();
    run.i++; run.tries = 0; run.pick = null; run.draft = ""; run.fb = null; saveRun(); runView(); top();
  };
}
async function drillCheck() {
  const it = run.items[run.i], { text, q } = D.drillQuestion(it), iNow = run.i;
  const response = q.type === "short" ? (document.getElementById("ans").value || "") : run.pick;
  if (q.type !== "short" && response === null) return;
  let m = E.mark(q, response), ai = null;
  if (m.tooShort) { run.fb = { kind: "bad", tooShort: true }; saveRun(); return runView(); }
  if (q.type === "short") {
    const btn = document.getElementById("dcheck"); if (btn) { btn.disabled = true; btn.textContent = "Checking your answer…"; }
    const lv = text.levels[it.level], para = lv.paras.find(x => x[0] === it.para[0]);
    ai = await api.aiMark(session.token, { text_id: text.id, slot: it.slot, level: it.level, stem: q.stem,
      paragraph: para ? para[1] : lv.paras.map(x => x[1]).join("\n"), points: q.groups.map(g => g.label), need: q.need, answer: response, name: firstName() });
    if (!run || run.kind !== "drill" || run.i !== iNow) return;
    if (ai) m = { ok: ai.ok, hits: ai.hits };
  }
  const res = support => ({ skill: run.skill, first_try: support === "none", support, text: it.text, level: it.level, drill: true });
  if (m.ok) {
    const r = res(run.tries ? "hint" : "none"); run.results.push(r);
    run.fb = { kind: "ok", first: !run.tries, xp: r.first_try ? D.DRILL_XP.first : D.DRILL_XP.hint, ai: ai && ai.ok ? ai.feedback : null }; S.play("ok");
  } else if (run.tries >= 1) { run.results.push(res("explained")); run.fb = { kind: "explained" }; S.play("info"); }
  else { run.tries++; run.fb = { kind: "bad", wrong: run.pick, partial: ai && ai.feedback ? ai.feedback : q.type === "short" && m.hits.length ? shortNudge(q, m.hits) : null }; S.play("bad"); }
  saveRun(); runView();
  const el = $app.querySelector(".fb"); if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function finishDrill() {
  const bonus = E.streakBonus(history);
  run.result = { score: run.results.filter(r => r.first_try).length, xp: D.drillXP(run.results) + bonus, bonus, seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; saveRun(); runView(); top(); Cel.set(run.result.xp);
}
function drillDoneView() {
  const R = run.result, n = run.items.length, good = R.score >= n - 1;
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Skill drill done</p><h1>${U.esc(run.skill)}: ${R.score} of ${n} right first time</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${n}</b><span>right first time</span></div></div>
    <div class="sumcard ${good ? "good" : "next"}"><p class="sumhead">${good ? "✓ Getting stronger" : "🎯 Keep practising"}</p>
      <p>${good ? `Nice work, ${U.esc(firstName())}. This skill will come up again in your texts, so keep using the strategy.` : `${U.esc(firstName())}, this skill still needs work. Try another drill: the questions come from different texts.`}</p></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept, ${U.esc(firstName())}!</strong> <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    <div class="panel"><h3>Your answers</h3><ul>${run.items.map((it, k) => { const r = run.results[k] || {};
      return `<li>${U.esc(PRACTICE_TEXTS.find(t => t.id === it.text).topic)}: ${U.esc(E.SUPPORT_LABEL[r.support] || "")}</li>`; }).join("")}</ul></div>
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="dagain">Another ${U.esc(run.skill)} drill</button><button class="btn alt" id="dhome">Back to home</button></div></div>`;
  const skill = run.skill;
  document.getElementById("dagain").onclick = () => { run = null; saveRun(); startDrill(skill); };
  document.getElementById("dhome").onclick = () => { run = null; saveRun(); location.hash = "#home"; route(); };
  saveAttempt({ mode: "vocab", text_id: run.textId, level_start: run.items[0].level, level_end: null, score: R.score, max_score: n,
                xp: R.xp, seconds: R.seconds, answers: run.results });
}

/* ---------------- progress & leaderboard ---------------- */
const meTabs = cur => `<div class="tabs" role="tablist">${[["me", "My stats"], ["leaderboard", "Leaderboard"], ["settings", "Settings"]]
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
    <p class="note">Your settings are saved on this device and stay when you sign out.</p></div>`;
  $app.querySelectorAll("[data-look]").forEach(b => b.onclick = () => { L.setLook({ [b.dataset.look]: b.dataset.v }); S.play("tap"); settingsView(); });
}
const CHEV = `<svg class="chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>`;
const AREA_LINK = { Reading: "read", Listening: "listen", Vocabulary: "words", Grammar: "grammar", Speed: "games" };
function statsCard() {
  const s = W.areaScores(history, E.steadyLevel(history, me.level ?? 1)), fu = P.focusUnit();
  const row = (label, score, detail, big = false) => `<details class="srow${big ? " big" : ""}"><summary><span class="sname">${label}</span>
      <span class="sline"><span class="sbar"><i style="width:${score == null ? 0 : score / 10}%"></i></span><b>${score ?? "–"}</b></span>${CHEV}</summary><div class="sdet">${detail}</div></details>`;
  const det = a => {
    if (a.score == null) return `<p class="note">Answer at least ${W.MIN_ANSWERS} ${a.name === "Speed" ? "Speed Read questions" : "questions in this area"} to get a score.</p>${practise(a.name)}`;
    const how = a.name === "Speed" ? `From your last ${a.n} Speed Read questions: ${a.right} right. Reading faster and getting them right raises this score.`
      : `From your last ${a.n} answers: ${a.right} right first time.${a.name === "Reading" ? ` Your reading level (${U.bandName(history, me.level)}) counts too: moving up a level raises your score.` : ""}`;
    return `<p class="note">${how}</p>${practise(a.name)}${a.name === "Listening" ? ` <a class="btn small alt" href="#lab">Listening Lab</a>` : ""}`;
  };
  const practise = name => (name === "Listening" && !listeningFor(fu).length) || (name === "Reading" && !PRACTICE_TEXTS.some(t => t.unitNo === fu)) ? ""
    : `<a class="btn small alt" href="#unit-${fu}/${AREA_LINK[name]}">Practise ${name === "Speed" ? "with games" : name.toLowerCase()}</a>`;
  return `<div class="scard"><div class="shead">${I.icon("workout", 18)}<span>Checkpoint score</span></div>
    ${row("Overall", s.overall, `<p class="note">The average of your area scores. Each area is out of ${W.SCORE_MAX}.</p>`, true)}
    ${s.areas.map(a => row(a.name, a.score, det(a))).join("")}</div>`;
}
function progressView() {
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Me</p><h1>${U.esc(me.name)}</h1></div>
    ${meTabs("me")}${statsCard()}
    <h2>My progress</h2>${U.trackerHTML(history, me)}</div>`;
  bindActivities();
}
async function leaderboardView() {
  $app.innerHTML = `<div class="narrow"><p class="note">Loading the leaderboard…</p></div>`;
  let lb; try { lb = await api.leaderboard(session.token); } catch (e) { $app.innerHTML = `<div class="narrow"><p class="err">${U.esc(e.message)}</p></div>`; return; }
  const tabs = [["week", "This week"], ["all", "All time"], ["improved", "Most improved"]];
  let cur = "week";
  const draw = () => {
    $app.innerHTML = `<div class="narrow pop">${meTabs("leaderboard")}
      <div class="hero"><p class="eyebrow">Class ${U.esc(lb.class_code)}</p><h1>Leaderboard</h1>
      <p class="lede">${cur === "week" ? "XP earned since Monday. It starts again every week." : cur === "all" ? "All the XP earned since the start." : "Biggest rise in percentage from the first baseline to the latest Checkpoint check."}</p></div>
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${k === cur}" data-k="${k}">${l}</button>`).join("")}</div>
      ${U.boardTable(lb[cur], cur === "improved" ? "gain" : "xp")}</div>`;
    $app.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { cur = b.dataset.k; draw(); });
  };
  draw();
}

/* ---------------- reading runs ---------------- */
// The baseline and the half-term checks run the same way: passages in order, MCQs with no hints.
// Anything that is not a check id (an old saved run, for example) is the baseline.
const testOf = id => C.CHECKS.find(c => c.id === id) || { id: "baseline", title: "Baseline", passages: BASELINE };
function startBaseline(test = "baseline") {
  run = { kind: "baseline", test, phase: "read", part: 0, qi: 0, answers: [], t0: Date.now(), readStart: Date.now(), orders: {}, pick: null };
  saveRun(); route(); top();
}
function startPractice(id) {
  const text = PRACTICE_TEXTS.find(t => t.id === id);
  run = { kind: "practice", textId: id, phase: "read", r: E.newRun(text, E.steadyLevel(history, me.level ?? 1)), t0: Date.now(), readStart: Date.now(),
          orders: {}, pick: null, draft: "", fb: null, xpSoFar: 0 };
  saveRun(); route(); top();
}
function runView() {
  header(); nav(null);
  if (run.phase === "done") return run.kind === "baseline" ? baselineDone() : run.kind === "mini" ? miniDone() : run.kind === "small" ? smallDone() : run.kind === "cards" ? cardsDone()
    : run.kind === "listen" ? listenDone() : run.kind === "lab" ? labDoneView() : run.kind === "rlab" ? rlDoneView() : run.kind === "glab" ? glDoneView() : run.kind === "drill" ? drillDoneView() : run.kind === "game" ? gameDone() : run.kind === "escape" ? escapeDone() : practiceDone();
  if (run.kind === "game") return gameView();
  if (run.kind === "escape") return escapeView();
  if (run.kind === "lab") { labRunView(); return backButton(); }
  if (run.kind === "rlab") { rlRunView(); return backButton(); }
  if (run.kind === "glab") { glRunView(); return backButton(); }
  if (run.kind === "drill") { drillView(); return backButton(); }
  if (run.kind === "baseline") baselineView();
  else if (run.kind === "mini") miniView();
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
  if (r.kind === "baseline") { const T = testOf(r.test); return `${T.id === "baseline" ? "Baseline reading" : T.title} (text ${r.part + 1} of ${T.passages.length})`; }
  if (r.kind === "small") return `${r.label} (question ${r.set.i + 1} of ${r.set.qs.length})`;
  if (r.kind === "mini") return `${M.MINI[r.unit].title} (question ${r.qi + 1} of ${M.miniQuestions(r.unit).length})`;
  if (r.kind === "listen") return `Listening: ${LISTENING.find(t => t.id === r.id).topic}`;
  if (r.kind === "lab") return `Listening Lab: ${Lab.labMission(r.id).title}${r.phase === "q" ? ` (question ${r.i + 1} of ${Lab.MISSION_LEN})` : ""}`;
  if (r.kind === "rlab") return `Reading Lab, Unit ${r.unit || RL.rItemUnit(r.seq[0]) || 2}: ${RL.rlabMission(r.id).title}${r.phase === "q" ? ` (question ${r.i + 1} of ${Lab.MISSION_LEN})` : ""}`;
  if (r.kind === "glab") return `Grammar Lab: ${GL.glabMission(r.id).title}${r.phase === "prove" ? ` (question ${r.i + 1} of ${GL.GLAB_LEN})` : ""}`;
  if (r.kind === "drill") return `Skill drill: ${r.skill}${r.phase === "q" ? ` (question ${r.i + 1} of ${r.items.length})` : ""}`;
  if (r.kind === "cards") return `Unit ${r.unit} word cards (card ${r.i + 1} of ${r.words.length})`;
  if (r.kind === "escape") return `Unit ${r.unit} escape room${r.play ? ` (room ${r.play.room + 1} of ${r.game.rooms.length})` : ""}`;
  return U.textTitle(r.textId);
}
function shiftPlay(pl, away) {
  pl.t0 += away; pl.roomStart = (pl.roomStart || []).map(t => t == null ? t : t + away);
  if (pl.torchUntil) pl.torchUntil += away; if (pl.evAt) pl.evAt += away; if (pl.final && pl.final.t0) pl.final.t0 += away;
}
function resumeRun() {
  const r = pausedRun(); if (!r) return;
  const away = Date.now() - r.pausedAt;          // the timer does not count time away
  r.t0 += away; if (r.readStart) r.readStart += away; if (r.play && !r.live) shiftPlay(r.play, away); delete r.pausedAt;   // a live game's clock keeps going
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

/* ---- baseline and half-term checks ---- */
function baselineView() {
  const T = testOf(run.test), PS = T.passages, P = PS[run.part], total = PS.reduce((n, x) => n + x.qs.length, 0), isBase = T.id === "baseline";
  if (run.phase === "read") {
    $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">${U.esc(T.title)} · text ${run.part + 1} of ${PS.length} · read it all first</p>
      ${run.part === 0 ? `<div class="panel"><p style="margin:0">${isBase ? "There are no hints in the baseline. Just do your best: it finds the right starting level for you." : "There are no hints in the check. Just do your best: it shows how far your reading has come since last time."}</p></div>` : ""}
      ${U.textHTML(P)}<div class="row"><button class="btn" id="go">Start the questions</button></div></div>`;
    readGate(P.paras, () => { run.phase = "q"; saveRun(); runView(); top(); }, "Start the questions");
    return;
  }
  const q = P.qs[run.qi], ord = order("b" + run.part + "-" + run.qi, q.opts.length), n = PS.slice(0, run.part).reduce((k, x) => k + x.qs.length, 0) + run.qi;
  $app.innerHTML = `<div class="qgrid"><div class="qcol">
      <div class="progress">${Array.from({ length: total }, (_, i) => `<i class="${i < n ? "ok" : i === n ? "cur" : ""}"></i>`).join("")}</div>
      <div class="qcard pop"><div class="qhead"><span class="tag">${U.esc(q.skill)}</span><span class="qnum">Question ${n + 1} of ${total}</span></div>
      <p class="stem">${U.esc(q.stem)}</p>${optsHTML(q, ord)}
      <div class="row"><button class="btn" id="next" ${run.pick === null ? "disabled" : ""}>${n === total - 1 ? "Finish" : "Next"}</button></div></div></div>
    <div class="textcol"><details id="tx"><summary>Read the text again</summary>${U.textHTML(P)}</details></div></div>`;
  if (matchMedia("(min-width:900px)").matches) document.getElementById("tx").open = true;
  bindOpts(baselineView);
  document.getElementById("next").onclick = () => {
    run.answers.push({ skill: q.skill, level: P.level, first_try: run.pick === 0, support: "none" });
    run.pick = null; run.qi++;
    if (run.qi >= P.qs.length) { run.part++; run.qi = 0; run.phase = run.part >= PS.length ? "finish" : "read"; run.readStart = Date.now(); }
    saveRun();
    if (run.phase === "finish") return finishBaseline();
    runView(); top();
  };
}
async function finishBaseline() {
  const T = testOf(run.test), isBase = T.id === "baseline", score = run.answers.filter(a => a.first_try).length;
  const max = T.passages.reduce((n, x) => n + x.qs.length, 0), band = E.testBand(T.id, score);
  const level = isBase ? E.placement(score) : Math.floor(band / 2);
  const attempt = { mode: "baseline", text_id: T.id, level_end: level, score, max_score: max, answers: run.answers };
  const up = isBase ? null : E.levelUpAfter(history, attempt);
  run.result = { score, max, band, level, levelUp: up, xp: E.baselineXP(score) + (up ? E.LEVEL_UP_XP : 0), seconds: Math.round((Date.now() - run.t0) / 1000),
                 next: E.steadyLevel([...history, attempt], level) };
  run.phase = "done"; saveRun(); runView(); top(); levelCel(run.result);
}
// A level up gets the big show; any other finish gets the coins.
function levelCel(R) { R.levelUp ? Cel.big({ icon: "🚀", title: `Level up, ${firstName()}!`, sub: `Your reading level is now ${E.BANDS[R.levelUp.to]}`, xp: R.xp }) : Cel.set(R.xp); }
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
// The celebration when a reading lifts the steady level to a step never reached before.
function levelUpHTML(up) {
  if (!up) return "";
  return `<div class="lvlup pop"><span class="lvl-from">${E.BANDS[up.from]}</span><span class="lvl-arrow" aria-hidden="true">→</span><span class="lvl-to">${E.BANDS[up.to]}</span>
    <div><b>Reading level up, ${U.esc(firstName())}!</b><p>Your reading level is now <b>${E.BANDS[up.to]}</b>. <span class="xpgain">+${E.LEVEL_UP_XP} XP</span></p></div></div>`;
}
function baselineDone() {
  const R = run.result, T = testOf(run.test), isBase = T.id === "baseline";
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">${U.esc(T.title)} finished</p><h1>You scored ${R.score} out of ${R.max}</h1>
    ${levelUpHTML(R.levelUp)}
    <div class="stats"><div class="stat"><b>${R.score}/${R.max}</b><span>score</span></div><div class="stat"><b>${isBase ? E.LEVELS[R.level] : E.BANDS[R.band]}</b><span>${isBase ? "your starting level" : "this check"}</span></div>
      <div class="stat gold"><b>+${R.xp}</b><span>XP</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    <div class="panel"><p style="margin:0">${isBase ? `Your practice texts will start on the <b>${E.LEVELS[R.level]}</b> version. The platform moves you up or down as you answer.`
      : `This check counts as one of your readings. Your practice texts now start on the <b>${E.LEVELS[R.next]}</b> version.`}</p></div>
    ${U.resultRows(null, run.answers)}
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="home">Go to my home page</button></div></div>`;
  document.getElementById("home").onclick = () => { run = null; saveRun(); location.hash = "#home"; route(); };
  saveAttempt({ mode: "baseline", text_id: T.id, level_start: 0, level_end: R.level, next_level: R.next, score: R.score, max_score: R.max,
                xp: R.xp, seconds: R.seconds, answers: run.answers });
}

/* ---- unit checkpoint mini tests ---- */
// Four parts, no hints, one answer per question. Listening: all four questions on one page, the recording plays twice.
let miniAudio = null, miniAudioFor = null;
function startMini(u) {
  run = { kind: "mini", unit: u, phase: "read", qi: 0, answers: [], plays: 0, lpick: {}, t0: Date.now(), readStart: Date.now(), orders: {}, pick: null };
  saveRun(); route(); top();
}
function miniHead(T, q, Q) {
  const k = M.PARTS.findIndex(p => p[0] === q.part);
  return `<div class="progress">${Q.map((_, i) => `<i class="${i < run.qi ? "ok" : i === run.qi || (q.part === "listening" && Q[i].part === "listening") ? "cur" : ""}"></i>`).join("")}</div>
    <p class="eyebrow">${U.esc(T.title)} · Part ${k + 1} of ${M.PARTS.length}: ${M.PARTS[k][1]}</p>`;
}
function miniView() {
  const T = M.MINI[run.unit], Q = M.miniQuestions(run.unit), q = Q[run.qi];
  if (q.part === "reading" && run.phase === "read") {
    $app.innerHTML = `<div class="narrow pop">${miniHead(T, q, Q)}
      ${run.qi === 0 ? `<div class="panel"><p style="margin:0"><b>${Q.length} questions in ${M.PARTS.length} parts:</b> reading, listening, vocabulary and grammar. There are no hints, like the real Checkpoint test. Score ${M.MINI_PASS * 100}% or more (${Math.ceil(M.MINI_PASS * Q.length)} of ${Q.length}) to pass.</p></div>` : ""}
      ${U.textHTML(T.reading)}<div class="row"><button class="btn" id="go">Start the questions</button></div></div>`;
    readGate(T.reading.paras, () => { run.phase = "q"; saveRun(); runView(); top(); }, "Start the questions");
    return;
  }
  if (q.part === "listening") return miniListenView(T, Q);
  const ord = order("m" + run.qi, q.opts.length), last = run.qi === Q.length - 1;
  $app.innerHTML = `<div class="${q.part === "reading" ? "qgrid" : "narrow"}"><div class="qcol">${miniHead(T, q, Q)}
      <div class="qcard pop"><div class="qhead"><span class="tag">${U.esc(q.skill)}</span><span class="qnum">Question ${run.qi + 1} of ${Q.length}</span></div>
      <p class="stem">${stemHTML(q.stem)}</p>${optsHTML(q, ord)}
      <div class="row"><button class="btn" id="next" ${run.pick === null ? "disabled" : ""}>${last ? "Finish" : "Next"}</button></div></div></div>
    ${q.part === "reading" ? `<div class="textcol"><details id="tx"><summary>Read the text again</summary>${U.textHTML(T.reading)}</details></div>` : ""}</div>`;
  const tx = document.getElementById("tx"); if (tx && matchMedia("(min-width:900px)").matches) tx.open = true;
  bindOpts(miniView);
  document.getElementById("next").onclick = () => { miniAnswer(q, run.pick === 0); run.pick = null; miniNext(Q); };
}
function miniAnswer(q, right) {
  const a = { skill: q.skill, part: q.part, first_try: right, support: "none" };
  if (q.word) { a.word = q.word; a.unit = q.unit; }
  if (q.point) a.point = q.point;
  run.answers.push(a);
}
function miniNext(Q) {
  run.qi++;
  if (run.qi >= Q.length) { saveRun(); return finishMini(); }
  saveRun(); runView(); top();
}
function miniPlayer() {
  const T = M.MINI[run.unit];
  if (!miniAudio || miniAudioFor !== T.listening.id) {
    if (miniAudio) miniAudio.pause();
    miniAudio = new Audio(`audio/listening/${T.listening.id}.mp3?v=${AUDIO_V}`); miniAudioFor = T.listening.id; miniAudio.preload = "auto";
    const upd = () => miniPlayerUpdate();
    miniAudio.addEventListener("timeupdate", upd); miniAudio.addEventListener("play", upd); miniAudio.addEventListener("pause", upd);
    miniAudio.addEventListener("ended", () => { if (run && run.kind === "mini") { run.plays++; saveRun(); } miniPlayerUpdate(); });
  }
  return miniAudio;
}
function miniPlayerUpdate() {
  const a = miniAudio, btn = document.getElementById("mplay"); if (!a || !btn || !run || run.kind !== "mini") return;
  const left = MAX_PLAYS - run.plays, playing = !a.paused;
  const bar = document.getElementById("mbar"); if (bar && a.duration) bar.style.width = `${Math.min(100, 100 * a.currentTime / a.duration)}%`;
  btn.disabled = !playing && left <= 0;
  btn.innerHTML = `${SPEAKER} ${playing ? "Pause" : a.currentTime > 0 && !a.ended ? "Continue" : left > 0 ? `Play the recording (${left} ${left === 1 ? "play" : "plays"} left)` : "No plays left"}`;
}
function miniListenView(T, Q) {
  const first = Q.findIndex(x => x.part === "listening"), qs = Q.filter(x => x.part === "listening");
  const all = qs.every((_, k) => run.lpick[k] != null);
  $app.innerHTML = `<div class="narrow pop">${miniHead(T, qs[0], Q)}
    <div class="panel"><p style="margin:0">${U.esc(M.MINI_LISTENING.find(l => l.id === T.listening.id).lines[0][1])} You can play the recording twice. Read the questions first.</p>
      <div class="player" style="margin-top:10px"><button class="btn" id="mplay"></button><div class="lmeta"><div class="bar" aria-hidden="true"><i id="mbar" style="width:0;background:var(--teal)"></i></div></div></div></div>
    ${qs.map((q, k) => { const ord = order("l" + k, q.opts.length);
      return `<div class="qcard"><div class="qhead"><span class="tag">Listening</span><span class="qnum">Question ${first + k + 1} of ${Q.length}</span></div>
        <p class="stem">${U.esc(q.stem)}</p><div class="opts" role="radiogroup">${ord.map((oi, n) => `<button class="opt${run.lpick[k] === oi ? " sel" : ""}" data-lq="${k}" data-o="${oi}" role="radio" aria-checked="${run.lpick[k] === oi}"><span class="k">${"ABCD"[n]}</span><span>${U.esc(q.opts[oi])}</span></button>`).join("")}</div></div>`; }).join("")}
    <div class="row"><button class="btn" id="next" ${all ? "" : "disabled"}>Next part</button></div></div>`;
  miniPlayer(); miniPlayerUpdate();
  document.getElementById("mplay").onclick = () => { const a = miniPlayer(); if (!a.paused) a.pause(); else if (MAX_PLAYS - run.plays > 0) { if (a.ended) a.currentTime = 0; a.play(); } };
  $app.querySelectorAll("[data-lq]").forEach(b => b.onclick = () => {
    const k = +b.dataset.lq; run.lpick[k] = +b.dataset.o; S.play("tap"); saveRun();
    $app.querySelectorAll(`[data-lq="${k}"]`).forEach(x => { const on = +x.dataset.o === run.lpick[k]; x.classList.toggle("sel", on); x.setAttribute("aria-checked", on); });
    document.getElementById("next").disabled = !qs.every((_, j) => run.lpick[j] != null);
  });
  document.getElementById("next").onclick = () => {
    stopAudio(); qs.forEach((q, k) => miniAnswer(q, run.lpick[k] === 0));
    run.qi = first + qs.length - 1; run.lpick = {}; miniNext(Q);
  };
}
function finishMini() {
  const u = run.unit, Q = M.miniQuestions(u), score = run.answers.filter(a => a.first_try).length, max = Q.length;
  run.result = { score, max, passed: score / max >= M.MINI_PASS, xp: M.miniXP(score, max, history, u), seconds: Math.round((Date.now() - run.t0) / 1000),
                 parts: M.PARTS.map(([k, name]) => { const a = run.answers.filter(x => x.part === k); return { name, right: a.filter(x => x.first_try).length, total: a.length }; }) };
  run.phase = "done"; saveRun(); runView(); top();
  run.result.passed ? Cel.big({ icon: "🏆", title: `Unit ${u} test passed, ${firstName()}!`, sub: `${Math.round(100 * score / max)}% · the next gate is open`, xp: run.result.xp }) : Cel.set(run.result.xp);
}
function miniDone() {
  const R = run.result, T = M.MINI[run.unit];
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">${U.esc(T.title)}</p>
    <h1>${R.passed ? "Checkpoint passed!" : "Not passed yet"}</h1>
    ${R.passed ? `<div class="lvlup pop">${I.tile("check", "m")}<div><b>The Unit ${run.unit} gate is open.</b><p>You scored ${Math.round(100 * R.score / R.max)}%. Your Road to Checkpoint moves on to the next unit.</p></div></div>`
      : `<div class="fb info"><p>You scored ${R.score} out of ${R.max}. You need ${Math.ceil(M.MINI_PASS * R.max)} to pass. Practise the part with the lowest score, then try again.</p></div>`}
    <div class="stats"><div class="stat"><b>${R.score}/${R.max}</b><span>score</span></div><div class="stat gold"><b>+${R.xp}</b><span>XP</span></div>
      <div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    <div class="parts">${R.parts.map(p => `<div class="part"><b>${p.right}/${p.total}</b><span>${p.name}</span><div class="bar"><i class="${p.right / p.total < 0.5 ? "low" : ""}" style="width:${100 * p.right / p.total}%"></i></div></div>`).join("")}</div>
    <div class="tbl"><table><thead><tr><th>#</th><th>Part</th><th>Skill</th><th>Result</th></tr></thead><tbody>${run.answers.map((a, i) => `<tr><td>${i + 1}</td><td>${M.PARTS.find(p => p[0] === a.part)[1]}</td><td>${U.esc(a.skill === "Vocabulary" ? a.word : a.skill === "Grammar" ? (P.grammarPoint(a.point) || {}).title || "Grammar" : a.skill)}</td><td>${a.first_try ? `<span class="chip none">Right</span>` : `<span class="chip explained">Wrong</span>`}</td></tr>`).join("")}</tbody></table></div>
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="road">See my Road to Checkpoint</button><button class="btn alt" id="home">Back to home</button></div></div>`;
  const leave = h => { run = null; saveRun(); location.hash = h; route(); top(); };
  document.getElementById("home").onclick = () => leave("#home");
  document.getElementById("road").onclick = () => leave("#me");
  saveAttempt({ mode: "vocab", text_id: T.id, score: R.score, max_score: R.max, xp: R.xp, seconds: R.seconds, answers: run.answers });
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
      ${run.phase === "shift" ? `<div class="fb ${up ? "ok" : "info"}"><p class="big">${up ? (r.level === 3 ? "Challenge unlocked!" : "Level up!") : "Let's try a different version"}</p>
        <p>${up ? `You got ${E.UP_AFTER} questions right first time in a row: <span class="xpgain">+${E.XP.levelUp} XP</span>. The next questions use the <b>${E.LEVELS[r.level]}</b> text, with the same ideas in more difficult language.${r.level === 3 ? " This is C1 level, a real stretch: take your time." : ""}`
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
  if (!fb && r.rightRow > 0 && r.level < text.levels.length - 1) h += `<p class="note">Right first time in a row: ${r.rightRow} of ${E.UP_AFTER} to move up.</p>`;
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
  if (f.kind === "ok") return `<div class="fb ok pop"><p><strong>Correct.</strong> ${f.firstTry ? "Right first time." : "Well done for sticking with it."} <span class="xpgain">+${f.xp} XP</span></p>${f.ai ? `<p class="note">Checked by AI: ${U.esc(f.ai)}</p>` : ""}</div>`;
  if (f.kind === "explained") return `<div class="fb info pop"><p><strong>Let's look at the answer together, ${U.esc(firstName())}.</strong></p><p>${U.esc(q.explain)}</p><p class="note">No XP for this one. Remember the strategy for next time.</p></div>`;
  const msg = f.partial || (f.tooShort ? "Write at least a few words." : q.type === "short" ? "Your answer does not match the text yet." : "That is not the answer.");
  if (f.tooShort) return `<div class="fb bad pop"><p><strong>Too short.</strong> ${U.esc(msg)}</p></div>`;
  if (r.stage === 1) return `<div class="fb bad pop"><p><strong>Not quite.</strong> ${U.esc(msg)}</p><p><b>Hint:</b> ${U.esc(q.hint)}</p></div>`;
  const st = STRATEGY[text.slots[r.slot].skill], para = T.paras.find(x => x[0] === p);
  return `<div class="fb bad pop"><p><strong>Not quite yet, ${U.esc(firstName())}.</strong> ${U.esc(msg)}</p></div>
    <div class="rescue pop"><p class="eyebrow">Read this part again</p>${U.paraHTML(para, q.focus, true, unit)}
    <div class="strat"><b>Strategy: ${U.esc(st.name)}</b><ol>${st.steps.map(s => `<li>${U.esc(s)}</li>`).join("")}</ol></div>
    <p class="note">${r.level > 0 ? `If this answer is wrong too, you will move to the ${E.LEVELS[r.level - 1]} text.` : "Try once more. The highlighted words will help."}</p></div>`;
}
async function check(text) {
  const r = run.r, q = E.question(text, r), slotNow = r.slot, levelNow = r.level;
  const response = q.type === "short" ? (document.getElementById("ans").value || "") : run.pick;
  if (q.type !== "short" && response === null) return;
  let m = E.mark(q, response), ai = null;
  if (m.tooShort) { run.fb = { kind: "bad", tooShort: true }; saveRun(); return runView(); }
  // Every short answer goes to the AI marker, which accepts the same points in other words and catches answers
  // that only borrow the keywords. Any problem returns null and the keyword result stands.
  if (q.type === "short") {
    const btn = document.getElementById("check"); if (btn) { btn.disabled = true; btn.textContent = "Checking your answer…"; }
    const para = text.levels[r.level].paras.find(x => x[0] === (q.para || text.slots[r.slot].para));
    ai = await api.aiMark(session.token, { text_id: text.id, slot: r.slot, level: r.level, stem: q.stem,
      paragraph: para ? para[1] : text.levels[r.level].paras.map(x => x[1]).join("\n"),
      points: q.groups.map(g => g.label), need: q.need, answer: response, name: firstName() });
    if (!run || run.r !== r || r.slot !== slotNow || r.level !== levelNow) return; // left the question while waiting
    if (ai) m = { ok: ai.ok, hits: ai.hits };
  }
  const res = E.submit(text, r, m.ok);
  if (res.outcome === "correct") {
    const xp = E.answerXP(r.results[r.slot]); run.xpSoFar += xp;
    if (ai && ai.ok) r.results[r.slot].ai = true;
    run.fb = { kind: "ok", firstTry: res.firstTry, xp, ai: ai && ai.ok ? ai.feedback : null }; S.play("ok");
  } else if (res.outcome === "down") {
    run.pick = null; run.draft = ""; run.fb = null; run.phase = "shift"; run.shift = "down"; run.readStart = Date.now(); S.play("info");
    saveRun(); runView(); return top();
  } else if (res.outcome === "explained") {
    run.fb = { kind: "explained" }; S.play("info");
  } else {
    const partial = ai && ai.feedback ? ai.feedback
      : q.type === "short" && m.hits.length ? shortNudge(q, m.hits) : null;
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
  const score = r.results.filter(x => x.first_try).length;
  const attempt = { mode: "practice", text_id: text.id, level_end: r.level, score, max_score: text.slots.length, answers: r.results };
  const up = E.levelUpAfter(history, attempt);
  const xp = E.runXP(r, { replay }) + bonus + (up ? E.LEVEL_UP_XP : 0);
  run.result = { xp, bonus, replay, score, levelUp: up, next: E.steadyLevel([...history, attempt], r.level), seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; run.xpSoFar = 0; saveRun(); runView(); top(); levelCel(run.result);
}
function practiceDone() {
  const text = PRACTICE_TEXTS.find(t => t.id === run.textId), r = run.r, R = run.result;
  const strong = [], practise = [];
  text.slots.forEach((s, i) => (r.results[i] && r.results[i].first_try ? strong : practise).push(s.skill));
  const path = r.path.map(p => E.LEVELS[p.level] + (p.at ? ` (from Q${p.at + 1})` : "")).join(" → ");
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished</p><h1>Well done, ${U.esc(firstName())}</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${text.slots.length}</b><span>right first time</span></div>
      <div class="stat"><b>${E.LEVELS[r.level]}</b><span>finished on</span></div><div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div></div>
    <div class="sumcards">
      <div class="sumcard good"><p class="sumhead">✓ Strong</p>${strong.length ? `<div class="sumchips">${strong.map(x => `<span class="schip">${U.esc(x)}</span>`).join("")}</div>` : `<p>Keep going, ${U.esc(firstName())}. You will get there.</p>`}</div>
      <div class="sumcard next${practise.length ? " flash" : ""}"><p class="sumhead">🎯 Practise next</p>${practise.length ? `<p>${U.esc(firstName())}, this is your next target:</p><div class="sumchips">${practise.map(x => `<button class="schip" data-drill="${U.esc(x)}">${U.esc(x)}</button>`).join("")}</div>
        <button class="btn" data-drill="${U.esc(practise[0])}">Practise now: ${U.esc(practise[0])}</button><p class="note">Or tap a skill above. Each drill is ${D.DRILL_LEN} quick questions from other texts.</p>`
        : `<p>${r.level < text.levels.length - 1 ? `Nothing. Try to finish on the ${E.LEVELS[r.level + 1]} text next time.` : "Nothing. Brilliant work!"}</p>`}</div></div>
    ${levelUpHTML(R.levelUp)}
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept, ${U.esc(firstName())}!</strong> That's 2 texts this week: <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    ${R.replay ? `<p class="note">You have read this text before, so this time earns half XP.</p>` : ""}
    ${U.resultRows(text.slots, r.results)}<p class="note">Text path: ${U.esc(path)}</p>
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="home">Back to home</button><a class="btn alt" href="#leaderboard" id="lb">See the leaderboard</a></div></div>`;
  const leave = () => { run = null; saveRun(); };
  document.getElementById("home").onclick = () => { leave(); location.hash = "#home"; route(); };
  document.getElementById("lb").onclick = leave;
  $app.querySelectorAll("[data-drill]").forEach(b => b.onclick = () => { leave(); startDrill(b.dataset.drill, { exclude: text.id }); });
  saveAttempt({ mode: "practice", text_id: text.id, level_start: r.levelStart, level_end: r.level, next_level: R.next, score: R.score, max_score: text.slots.length,
                xp: R.xp, seconds: R.seconds, answers: r.results });
}

route();

// Partial short answer: say how many points count, and for cause-and-effect questions ask about the missing part.
function shortNudge(q, hits) {
  const missing = q.groups.find(g => g.ask && !hits.includes(g.label));
  return `You have ${hits.length} good point${hits.length > 1 ? "s" : ""}. You need ${q.need} different points.`
    + (missing ? ` Your answer doesn't say this yet: ${missing.ask}` : " Add a point about something different.");
}
