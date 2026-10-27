// Student app: sign in, baseline, adaptive practice, progress tracker, class leaderboard.
import { api, LIVE, getSession, setSession, resetDemo } from "./api.js";
import { PRACTICE_TEXTS, BASELINE, STRATEGY } from "./content.js";
import * as E from "./engine.js";
import * as U from "./ui.js";
import * as P from "./practice.js";
import { SEQUENCE, UNITS } from "./curriculum.js";
import { VOCAB } from "./vocab.js";

const $app = document.getElementById("app");
const $meta = document.getElementById("meta");
let session = getSession();
let me = null, history = [];
let run = null;              // the reading in progress (practice or baseline), kept on this device
let timerId = null;

const RUN_KEY = () => "ckpt-run-" + (session ? session.username : "");
function saveRun() { try { run ? localStorage.setItem(RUN_KEY(), JSON.stringify(run)) : localStorage.removeItem(RUN_KEY()); } catch (e) {} }
function loadRun() { try { return JSON.parse(localStorage.getItem(RUN_KEY())); } catch (e) { return null; } }
const top = () => window.scrollTo(0, 0);

/* ---------------- header ---------------- */
function header() {
  if (!session || !me) { $meta.innerHTML = ""; return; }
  let h = "";
  if (run && run.kind === "practice" && run.phase !== "done") {
    h += `<div class="meter" aria-label="Text level">${E.LEVELS.map((l, i) => `<span class="${i === run.r.level ? "on" : ""}">${l}</span>`).join("")}</div>`;
  }
  if (run && run.phase !== "done") h += `<span class="pill" id="clock">00:00</span>`;
  h += `<span class="pill xp" title="Your XP">${me.xp_total + (run && run.xpSoFar ? run.xpSoFar : 0)} XP</span>`;
  if (!run || run.phase === "done") h += `<button class="linkbtn" id="out">Sign out</button>`;
  $meta.innerHTML = h;
  const out = document.getElementById("out"); if (out) out.onclick = signOut;
  tick();
}
function tick() {
  const el = document.getElementById("clock"); if (!el || !run) return;
  const s = Math.floor((Date.now() - run.t0) / 1000), m = Math.floor(s / 60), r = s % 60;
  const target = { baseline: 15, practice: 20, small: 10 }[run.kind];
  el.textContent = `${m < 10 ? "0" : ""}${m}:${r < 10 ? "0" : ""}${r} / ${target}:00`;
  el.classList.toggle("over", s > target * 60);
}
setInterval(tick, 1000);

async function signOut() {
  try { await api.logout(session.token); } catch (e) {}
  setSession(null); session = null; me = null; run = null; route();
}

/* ---------------- sign in ---------------- */
function loginView(msg) {
  header();
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
  if (!me) {
    $app.innerHTML = `<div class="narrow"><p class="note">Loading…</p></div>`;
    try { await refresh(); } catch (e) { setSession(null); session = null; return loginView(e.message); }
  }
  run = run || loadRun();
  if (run) return runView();
  const view = (location.hash || "#home").slice(1);
  header();
  if (view === "progress") return progressView();
  if (view === "leaderboard") return leaderboardView();
  if (/^unit-\d$/.test(view)) return unitView(+view.slice(5));
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
  if (!me.baseline_done) {
    h += `<div class="tcard"><span class="tag gold">Start here</span><h3>Baseline reading</h3>
      <p class="note" style="font-size:1rem">Three short texts, from easier to harder, with 12 questions and no hints. Your score sets your starting reading level. It takes about 15 minutes.</p>
      <div class="row"><button class="btn" id="base">Start the baseline</button></div></div>`;
  } else {
    h += `<div class="stats">
      <div class="stat gold"><b>${me.xp_week}</b><span>XP this week</span></div>
      <div class="stat"><b>${U.levelName(me.level)}</b><span>reading level</span></div>
      <div class="stat"><b>${streak} wk</b><span>streak</span></div>
      <div class="stat"><b>${me.xp_total}</b><span>XP in total</span></div></div>`;
  }
  h += `<div class="panel goal"><b>This week: ${Math.min(thisWeek, 2)} of 2 activities</b><div class="bar"><i style="width:${Math.min(thisWeek, 2) * 50}%"></i></div>
      <p class="note">Finish 2 activities a week (a reading text, a vocabulary set or a grammar set) to keep your streak and earn a ${E.XP.streakWeek} XP bonus.</p></div>`;
  const fu = P.focusUnit();
  h += `<h2>This week in class</h2>${unitCard(fu)}`;
  if (review.length) h += `<div class="tcard"><span class="tag gold">Review</span><h3>Words to review</h3>
      <p class="note">${review.length} word${review.length > 1 ? "s" : ""} you got wrong last time: ${U.esc(review.slice(0, 6).map(x => x.w).join(", "))}${review.length > 6 ? "…" : ""}</p>
      <div class="row"><button class="btn" data-review="1">Review ${Math.min(review.length, 10)} words</button></div></div>`;
  h += `<h2>The school year</h2>${pathHTML(fu)}`;
  h += `<div class="row"><a class="btn alt" href="#progress">My progress</a><a class="btn alt" href="#leaderboard">Class leaderboard</a>
    ${canRetake ? `<button class="btn alt" id="rebase">Retake the baseline</button>` : ""}</div>
    ${LIVE ? "" : `<p class="note">Demo mode: <button class="linkbtn" style="color:var(--teal)" id="reset">reset the demo data</button></p>`}</div>`;
  $app.innerHTML = h;
  const b = document.getElementById("base"); if (b) b.onclick = startBaseline;
  const rb = document.getElementById("rebase"); if (rb) rb.onclick = startBaseline;
  const rs = document.getElementById("reset"); if (rs) rs.onclick = () => { resetDemo(); setSession(null); session = null; me = null; route(); };
  bindActivities();
}

/* ---------------- units ---------------- */
const STATUS = { done: ["Done", "none"], now: ["Now", "hint"], upcoming: ["Coming up", "rescue"] };
function unitCard(u) {
  const texts = PRACTICE_TEXTS.filter(t => t.unitNo === u);
  const done = new Set(history.filter(h => h.mode === "practice").map(h => h.text_id));
  const vm = P.vocabMastery(u, history), st = P.unitStatus(u);
  const lists = VOCAB[u].map((l, i) => `List ${i + 1}: ${l.length} words`).join(" · ");
  return `<div class="tcard unit">
    <div class="row" style="justify-content:space-between"><h3>${U.esc(P.unitTitle(u))}</h3><span class="chip ${STATUS[st][1]}">${STATUS[st][0]}</span></div>
    <div class="usec"><p class="eyebrow">Reading</p>${texts.length ? texts.map(t => `<div class="urow"><div><b>${U.esc(t.topic)}</b><br><span class="note">${done.has(t.id) ? "Done before: half XP this time." : U.esc(t.blurb)}</span></div>
        ${me.baseline_done ? `<button class="btn small" data-text="${t.id}">${done.has(t.id) ? "Read again" : "Read"}</button>` : `<span class="note">Take the baseline first</span>`}</div>`).join("")
      : `<p class="note">A reading text for this unit is coming soon.</p>`}</div>
    <div class="usec"><p class="eyebrow">Vocabulary</p><div class="urow"><div><b>${vm.mastered} of ${vm.total} words learned</b><br><span class="note">${lists}</span>
        <div class="bar" style="margin-top:6px"><i style="width:${Math.round(100 * vm.mastered / vm.total)}%;background:var(--teal)"></i></div></div>
      <button class="btn small" data-vocab="${u}">Practise 10 words</button></div></div>
    <div class="usec"><p class="eyebrow">Grammar</p>${P.unitGrammar(u).map(g => { const m = P.grammarMastery(g.id, history);
        return `<div class="urow"><div><b>${g.id} ${U.esc(g.title)}</b><br><span class="note">${g.code ? g.code + " · " : ""}${m == null ? "Not tried yet" : m + "% right first time"}</span></div>
          <button class="btn small alt" data-gram="${g.id}">Practise</button></div>`; }).join("")}
      <div class="row"><button class="btn small" data-gramunit="${u}">Mixed quiz: all of Unit ${u}</button></div></div></div>`;
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
function unitView(u) {
  if (!UNITS[u]) return homeView();
  $app.innerHTML = `<div class="narrow pop"><div class="row"><a href="#home">← Home</a></div>${unitCard(u)}</div>`;
  bindActivities();
}
function bindActivities() {
  $app.querySelectorAll("[data-text]").forEach(btn => btn.onclick = () => startPractice(btn.dataset.text));
  $app.querySelectorAll("[data-vocab]").forEach(btn => btn.onclick = () => { const u = +btn.dataset.vocab;
    startSmall("vocab", `vocab-u${u}`, `Unit ${u} vocabulary`, P.vocabSet({ unit: u, history })); });
  $app.querySelectorAll("[data-review]").forEach(btn => btn.onclick = () =>
    startSmall("vocab", "vocab-review", "Word review", P.vocabSet({ review: true, history })));
  $app.querySelectorAll("[data-gram]").forEach(btn => btn.onclick = () => { const g = P.grammarPoint(btn.dataset.gram);
    startSmall("grammar", `grammar-${g.id}`, `${g.id} ${g.title}`, P.grammarSet({ point: g.id })); });
  $app.querySelectorAll("[data-gramunit]").forEach(btn => btn.onclick = () => { const u = +btn.dataset.gramunit;
    startSmall("grammar", `grammar-u${u}`, `Unit ${u} grammar quiz`, P.grammarSet({ unit: u })); });
}

/* ---------------- vocabulary and grammar sets ---------------- */
function startSmall(sub, textId, label, qs) {
  run = { kind: "small", sub, textId, label, set: P.newSet(qs), phase: "q", t0: Date.now(), orders: {}, pick: null, fb: null, xpSoFar: 0 };
  saveRun(); route(); top();
}
function stemHTML(stem) { return U.esc(stem).replaceAll("___", '<span class="gap">______</span>'); }
function smallView() {
  const set = run.set, q = set.qs[set.i], fb = run.fb, locked = !!(fb && (fb.kind === "ok" || fb.kind === "reveal"));
  const tag = q.kind === "vocab" ? "Vocabulary" : `Grammar ${q.point}${q.code ? " · " + q.code : ""}`;
  let h = `<div class="narrow pop"><p class="eyebrow">${U.esc(run.label)}</p>
    <div class="progress">${set.qs.map((_, i) => { const r = set.results[i]; return `<i class="${i === set.i ? "cur" : r ? (r.first_try ? "ok" : "help") : ""}"></i>`; }).join("")}</div>
    <div class="qcard"><div class="qhead"><span class="tag">${U.esc(tag)}</span><span class="qnum">Question ${set.i + 1} of ${set.qs.length}</span></div>
    <p class="stem">${stemHTML(q.stem)}</p>
    ${optsHTML(q, order("s" + set.i, q.opts.length), fb ? { right: fb.kind === "ok", wrong: fb.wrong, reveal: fb.kind === "reveal", locked } : null)}`;
  if (fb && fb.kind === "ok") h += `<div class="fb ok pop"><p><strong>Correct.</strong> <span class="xpgain">+${fb.xp} XP</span></p></div>`;
  if (fb && fb.kind === "hint") h += q.kind === "grammar"
    ? `<div class="fb bad pop"><p><strong>Not quite.</strong> Read the rule, then try again.</p></div><div class="strat"><b>Rule</b><p style="margin:6px 0 0">${U.esc(q.hint)}</p></div>`
    : `<div class="fb bad pop"><p><strong>Not quite.</strong> ${q.type === "meaning" ? "See the word in a sentence:" : "Hint:"} ${U.esc(q.hint)}</p></div>`;
  if (fb && fb.kind === "reveal") h += `<div class="fb info pop"><p><strong>The answer is "${U.esc(q.opts[0])}".</strong></p><p>${U.esc(q.explain)}</p><p class="note">No XP for this one. It will come back in your review.</p></div>`;
  h += `<div class="row">${locked ? `<button class="btn" id="next">${set.i === set.qs.length - 1 ? "See my results" : "Next question"}</button>` : `<button class="btn" id="check" ${run.pick === null ? "disabled" : ""}>Check answer</button>`}</div></div></div>`;
  $app.innerHTML = h;
  bindOpts(smallView);
  const c = document.getElementById("check"); if (c) c.onclick = () => {
    const out = P.submitSmall(set, run.pick === 0);
    if (out === "correct") { const xp = set.results[set.i].support === "none" ? P.XP_SMALL.first : P.XP_SMALL.hint; run.xpSoFar += xp; run.fb = { kind: "ok", xp }; }
    else if (out === "hint") run.fb = { kind: "hint", wrong: run.pick };
    else run.fb = { kind: "reveal" };
    saveRun(); header(); smallView();
  };
  const n = document.getElementById("next"); if (n) n.onclick = () => {
    run.pick = null; run.fb = null;
    if (P.nextSmall(set) === "done") {
      const bonus = E.streakBonus(history);
      run.result = { xp: P.smallXP(set.results) + bonus, bonus, score: set.results.filter(r => r.first_try).length, seconds: Math.round((Date.now() - run.t0) / 1000) };
      run.phase = "done"; run.xpSoFar = 0;
    }
    saveRun(); runView(); top();
  };
}
function smallDone() {
  const set = run.set, R = run.result;
  const rows = set.results.map((r, i) => { const q = set.qs[i];
    const what = q.kind === "vocab" ? q.word : `${q.point} ${P.grammarPoint(q.point).title}`;
    return `<tr><td>${i + 1}</td><td>${U.esc(what)}</td><td><span class="chip ${r.support}">${E.SUPPORT_LABEL[r.support] || "After a hint"}</span></td></tr>`; }).join("");
  $app.innerHTML = `<div class="narrow pop"><p class="eyebrow">Finished · ${U.esc(run.label)}</p><h1>${R.score} of ${set.qs.length} right first time</h1>
    <div class="stats"><div class="stat gold"><b>+${R.xp}</b><span>XP earned</span></div><div class="stat"><b>${R.score}/${set.qs.length}</b><span>right first time</span></div>
      <div class="stat"><b>${U.fmtTime(R.seconds)}</b><span>time</span></div><div class="stat"><b>${set.results.filter(r => r.support === "explained").length}</b><span>to review</span></div></div>
    ${R.bonus ? `<div class="fb ok"><p><strong>Streak week kept!</strong> That's 2 activities this week: <span class="xpgain">+${R.bonus} XP</span> bonus.</p></div>` : ""}
    <div class="tbl"><table><thead><tr><th>#</th><th>${run.sub === "vocab" ? "Word" : "Grammar point"}</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="note" id="savemsg" aria-live="polite">Saving…</p>
    <div class="row"><button class="btn" id="home">Back to home</button></div></div>`;
  document.getElementById("home").onclick = () => { run = null; saveRun(); location.hash = "#home"; route(); };
  saveAttempt({ mode: run.sub, text_id: run.textId, level_start: null, level_end: null, score: R.score, max_score: set.qs.length,
                xp: R.xp, seconds: R.seconds, answers: set.results });
}

/* ---------------- progress & leaderboard ---------------- */
function progressView() {
  $app.innerHTML = `<div class="narrow pop"><div class="row"><a href="#home">← Home</a></div>
    <div class="hero"><p class="eyebrow">My progress</p><h1>${U.esc(me.name)}</h1></div>${U.trackerHTML(history, me)}</div>`;
}
async function leaderboardView() {
  $app.innerHTML = `<div class="narrow"><p class="note">Loading the leaderboard…</p></div>`;
  let lb; try { lb = await api.leaderboard(session.token); } catch (e) { $app.innerHTML = `<div class="narrow"><p class="err">${U.esc(e.message)}</p></div>`; return; }
  const tabs = [["week", "This week"], ["all", "All time"], ["improved", "Most improved"]];
  let cur = "week";
  const draw = () => {
    $app.innerHTML = `<div class="narrow pop"><div class="row"><a href="#home">← Home</a></div>
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
  header();
  if (run.phase === "done") return run.kind === "baseline" ? baselineDone() : run.kind === "small" ? smallDone() : practiceDone();
  if (run.kind === "baseline") return baselineView();
  if (run.kind === "small") return smallView();
  return practiceView();
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
  $app.querySelectorAll(".opt").forEach(b => b.onclick = () => { run.pick = +b.dataset.o; saveRun(); after(); });
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
  run.phase = "done"; saveRun(); runView(); top();
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
  if (run.phase === "read" || run.phase === "shift") {
    const up = run.shift === "up";
    $app.innerHTML = `<div class="narrow pop">
      ${run.phase === "shift" ? `<div class="fb ${up ? "ok" : "info"}"><p class="big">${up ? "Level up!" : "Let's try a different version"}</p>
        <p>${up ? `You got ${E.UP_AFTER} questions right first time in a row: <span class="xpgain">+${E.XP.levelUp} XP</span>. The next questions use the <b>Harder</b> text, with the same ideas in more difficult language.`
                : `This question is tricky in the ${E.LEVELS[r.level + 1]} text. Here is the <b>${E.LEVELS[r.level]}</b> version, with the same ideas in simpler words. Read it, then try question ${r.slot + 1} again.`}</p></div>`
        : `<p class="eyebrow">${E.LEVELS[r.level]} text · read it all first</p>`}
      ${U.textHTML(T)}<div class="row"><button class="btn" id="go">Go</button></div></div>`;
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
  if (fb) h += feedbackHTML(text, q, p, T);
  h += `<div class="row">${locked ? `<button class="btn" id="next">${r.slot === text.slots.length - 1 ? "See my results" : "Next question"}</button>`
                                  : `<button class="btn" id="check">Check answer</button>`}</div>`;
  if (!locked && r.missedRow === 1 && r.stage === 0) h += `<p class="note">Take care: one more wrong answer and you will get extra support.</p>`;
  if (!fb && r.rightRow > 0 && r.level < 2) h += `<p class="note">Right first time in a row: ${r.rightRow} of ${E.UP_AFTER} to move up.</p>`;
  h += `</div></div><div class="textcol"><details id="tx"><summary>Read the text again</summary>${U.textHTML(T, r.stage >= 1 && !locked ? { para: p } : {})}</details></div></div>`;
  $app.innerHTML = h;
  if (matchMedia("(min-width:900px)").matches) document.getElementById("tx").open = true;
  bindOpts(practiceView);
  const a = document.getElementById("ans"); if (a) a.oninput = () => { run.draft = a.value; saveRun(); };
  const c = document.getElementById("check"); if (c) c.onclick = () => check(text);
  const n = document.getElementById("next"); if (n) n.onclick = () => next(text);
}
function feedbackHTML(text, q, p, T) {
  const f = run.fb, r = run.r;
  if (f.kind === "ok") return `<div class="fb ok pop"><p><strong>Correct.</strong> ${f.firstTry ? "Right first time." : "Well done for sticking with it."} <span class="xpgain">+${f.xp} XP</span></p></div>`;
  if (f.kind === "explained") return `<div class="fb info pop"><p><strong>Let's look at the answer together.</strong></p><p>${U.esc(q.explain)}</p><p class="note">No XP for this one. Remember the strategy for next time.</p></div>`;
  const msg = f.partial || (f.tooShort ? "Write at least a few words." : q.type === "short" ? "Your answer does not match the text yet." : "That is not the answer.");
  if (f.tooShort) return `<div class="fb bad pop"><p><strong>Too short.</strong> ${U.esc(msg)}</p></div>`;
  if (r.stage === 1) return `<div class="fb bad pop"><p><strong>Not quite.</strong> ${U.esc(msg)}</p><p><b>Hint:</b> ${U.esc(q.hint)}</p></div>`;
  const st = STRATEGY[text.slots[r.slot].skill], para = T.paras.find(x => x[0] === p);
  return `<div class="fb bad pop"><p><strong>Not quite.</strong> ${U.esc(msg)}</p></div>
    <div class="rescue pop"><p class="eyebrow">Read this part again</p>${U.paraHTML(para, q.focus, true)}
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
    run.fb = { kind: "ok", firstTry: res.firstTry, xp };
  } else if (res.outcome === "down") {
    run.pick = null; run.draft = ""; run.fb = null; run.phase = "shift"; run.shift = "down"; run.readStart = Date.now();
    saveRun(); runView(); return top();
  } else if (res.outcome === "explained") {
    run.fb = { kind: "explained" };
  } else {
    const partial = q.type === "short" && m.hits.length ? `You have ${m.hits.length} good point${m.hits.length > 1 ? "s" : ""}. You need ${q.need} different points.` : null;
    run.fb = { kind: "bad", wrong: run.pick, partial };
  }
  saveRun(); runView();
  const el = $app.querySelector(".fb"); if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function next(text) {
  const out = E.advance(text, run.r);
  run.pick = null; run.draft = ""; run.fb = null;
  if (out === "done") { finishPractice(text); return; }
  if (out === "up") { run.xpSoFar += E.XP.levelUp; run.phase = "shift"; run.shift = "up"; run.readStart = Date.now(); }
  saveRun(); runView(); top();
}
function finishPractice(text) {
  const r = run.r, replay = history.some(h => h.mode === "practice" && h.text_id === text.id);
  const bonus = E.streakBonus(history);
  const xp = E.runXP(r, { replay }) + bonus;
  run.result = { xp, bonus, replay, score: r.results.filter(x => x.first_try).length, seconds: Math.round((Date.now() - run.t0) / 1000) };
  run.phase = "done"; run.xpSoFar = 0; saveRun(); runView(); top();
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
