// Teacher dashboard: class overview, skills heat map, each student's tracker, class leaderboard, PIN resets.
import { api, LIVE, getSession, setSession } from "./api.js";
import * as U from "./ui.js";

const $app = document.getElementById("app");
const $meta = document.getElementById("meta");
let session = getSession("teacher");
let classes = [], cls = null, rows = [], tab = "overview";

function header() {
  $meta.innerHTML = session ? `<span class="pill">${U.esc(session.name)}</span><button class="linkbtn" id="out">Sign out</button>` : "";
  const o = document.getElementById("out");
  if (o) o.onclick = async () => { try { await api.logout(session.token); } catch (e) {} setSession(null, "teacher"); session = null; start(); };
}

function loginView(msg) {
  header();
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Teacher dashboard</p><h1>Sign in</h1></div>
    ${LIVE ? "" : `<div class="demo"><b>Demo mode.</b> Username <b>teacher</b>, password <b>demo</b>. You will see a sample class.</div>`}
    <form class="panel" id="f" novalidate>
      <label class="fld" for="u">Username<input type="text" id="u" autocomplete="username" autocapitalize="none" value="teacher"></label>
      <label class="fld" for="p">Password<input type="password" id="p" autocomplete="current-password"></label>
      <p class="err" id="e" role="alert">${msg ? U.esc(msg) : ""}</p>
      <div class="row"><button class="btn" type="submit" id="go">Sign in</button><a class="note" href="index.html">Student sign-in</a></div></form></div>`;
  document.getElementById("f").addEventListener("submit", async ev => {
    ev.preventDefault();
    const b = document.getElementById("go"); b.disabled = true;
    try {
      const r = await api.login(document.getElementById("u").value, document.getElementById("p").value);
      if (r.role !== "teacher") throw new Error("This is a student account. Students sign in on the main page.");
      session = { token: r.token, name: r.name }; setSession(session, "teacher"); start();
    } catch (e) { document.getElementById("e").textContent = e.message; b.disabled = false; }
  });
}

async function start() {
  if (!session) return loginView();
  header();
  $app.innerHTML = `<p class="note">Loading…</p>`;
  try { classes = await api.teacherClasses(session.token); }
  catch (e) { setSession(null, "teacher"); session = null; return loginView(e.message); }
  cls = cls && classes.includes(cls) ? cls : classes[0];
  if (!cls) { $app.innerHTML = `<div class="narrow"><p>No students yet. Run seed.sql in Supabase to add your classes.</p></div>`; return; }
  await loadClass();
}
async function loadClass() {
  $app.innerHTML = `<p class="note">Loading ${U.esc(cls)}…</p>`;
  try { rows = await api.teacherClass(session.token, cls); } catch (e) { $app.innerHTML = `<p class="err">${U.esc(e.message)}</p>`; return; }
  draw();
}

const pct = k => k && k.total ? Math.round(100 * k.right / k.total) : null;
function weakest(skills) {
  let w = null;
  U.SKILLS.forEach(s => { const p = pct(skills[s]); if (p != null && skills[s].total >= 2 && (w == null || p < w.p)) w = { s, p }; });
  return w;
}
function ago(d) {
  if (!d) return "Never";
  const days = Math.floor((Date.now() - new Date(d)) / 86400e3);
  return days === 0 ? "Today" : days === 1 ? "Yesterday" : days + " days ago";
}

function draw() {
  const placed = rows.filter(r => r.level != null);
  const lv = [0, 1, 2].map(l => placed.filter(r => r.level === l).length);
  const active = rows.filter(r => r.last_active && Date.now() - new Date(r.last_active) < 7 * 86400e3).length;
  const needHelp = rows.filter(r => r.last_active == null || Date.now() - new Date(r.last_active) > 14 * 86400e3);
  let h = `<div class="narrow" style="max-width:1100px">
    <div class="row" style="justify-content:space-between"><div class="hero"><p class="eyebrow">Teacher dashboard</p><h1>Class ${U.esc(cls)}</h1></div>
      <div class="tabs" role="tablist" aria-label="Class">${classes.map(c => `<button role="tab" aria-selected="${c === cls}" data-c="${U.esc(c)}">${U.esc(c)}</button>`).join("")}</div></div>
    <div class="stats">
      <div class="stat"><b>${placed.length}/${rows.length}</b><span>took the baseline</span></div>
      <div class="stat"><b>${lv[0]} · ${lv[1]} · ${lv[2]}</b><span>Easier · Core · Harder</span></div>
      <div class="stat"><b>${active}</b><span>active in the last 7 days</span></div>
      <div class="stat gold"><b>${rows.reduce((t, r) => t + r.xp_week, 0)}</b><span>class XP this week</span></div></div>
    <div class="tabs" role="tablist" aria-label="View">${[["overview", "Students"], ["heat", "Skills heat map"], ["board", "Leaderboard"]].map(([k, l]) => `<button role="tab" aria-selected="${k === tab}" data-t="${k}">${l}</button>`).join("")}</div>`;
  if (tab === "overview") {
    h += `<div class="tbl"><table><thead><tr><th>Student</th><th>Username</th><th>Level</th><th class="num">Baseline</th><th class="num">XP week</th><th class="num">XP total</th><th class="num">Texts</th><th>Last active</th><th>Weakest skill</th></tr></thead><tbody>${
      rows.map(r => { const w = weakest(r.skills || {});
        return `<tr><td><button class="linkbtn" style="color:var(--teal);text-align:left" data-s="${r.id}">${U.esc(r.name)}</button></td><td>${U.esc(r.username)}</td>
          <td><span class="lvl">${U.levelName(r.level)}</span></td>
          <td class="num">${r.baseline_first == null ? "–" : r.baseline_latest !== r.baseline_first ? `${r.baseline_first} → ${r.baseline_latest}` : r.baseline_first}</td>
          <td class="num">${r.xp_week}</td><td class="num">${r.xp_total}</td><td class="num">${r.texts_done}</td><td>${ago(r.last_active)}</td>
          <td>${w ? `${U.esc(w.s)} (${w.p}%)` : "–"}</td></tr>`; }).join("")
    }</tbody></table></div>
    ${needHelp.length ? `<div class="panel"><h3>Not active for 2 weeks or more</h3><p style="margin:0">${needHelp.map(r => U.esc(r.name)).join(", ")}</p></div>` : ""}`;
  } else if (tab === "heat") {
    h += `<p class="lede">Percentage of questions right first time, per student and skill. Blank cells mean not tried yet.</p>
      <div class="legend"><span><i class="h0"></i>under 40%</span><span><i class="h1"></i>40–59%</span><span><i class="h2"></i>60–79%</span><span><i class="h3"></i>80% or more</span></div>
      <div class="tbl"><table class="heat"><thead><tr><th>Student</th>${U.SKILLS.map(s => `<th class="num" title="${U.esc(s)}">${U.esc(s.replace("Vocabulary in context", "Vocab").replace("Detail: two points", "Two points").replace("Cause and effect", "Cause/effect").replace("Writer's ", "W. "))}</th>`).join("")}</tr></thead><tbody>${
        rows.map(r => `<tr><td>${U.esc(r.name)}</td>${U.SKILLS.map(s => { const p = pct((r.skills || {})[s]);
          return p == null ? `<td class="h hn"></td>` : `<td class="h h${p < 40 ? 0 : p < 60 ? 1 : p < 80 ? 2 : 3}">${p}%</td>`; }).join("")}</tr>`).join("")
      }</tbody><tfoot><tr><th>Class</th>${U.SKILLS.map(s => { let rt = 0, tt = 0; rows.forEach(r => { const k = (r.skills || {})[s]; if (k) { rt += k.right; tt += k.total; } });
          return `<th class="num">${tt ? Math.round(100 * rt / tt) + "%" : "–"}</th>`; }).join("")}</tr></tfoot></table></div>`;
  } else {
    h += `<div id="board"><p class="note">Loading…</p></div>`;
  }
  h += `</div>`;
  $app.innerHTML = h;
  $app.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { cls = b.dataset.c; loadClass(); });
  $app.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { tab = b.dataset.t; draw(); });
  $app.querySelectorAll("[data-s]").forEach(b => b.onclick = () => studentView(b.dataset.s));
  if (tab === "board") boardView();
}

async function boardView() {
  const el = document.getElementById("board");
  let lb; try { lb = await api.leaderboard(session.token, cls); } catch (e) { el.innerHTML = `<p class="err">${U.esc(e.message)}</p>`; return; }
  let cur = "week";
  const d = () => {
    el.innerHTML = `<div class="tabs">${[["week", "This week"], ["all", "All time"], ["improved", "Most improved"]].map(([k, l]) => `<button aria-selected="${k === cur}" data-k="${k}">${l}</button>`).join("")}</div>
      <div style="margin-top:12px">${U.boardTable(lb[cur], cur === "improved" ? "gain" : "xp")}</div>`;
    el.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { cur = b.dataset.k; d(); });
  };
  d();
}

async function studentView(id) {
  $app.innerHTML = `<p class="note">Loading…</p>`;
  let d; try { d = await api.teacherStudent(session.token, id); } catch (e) { $app.innerHTML = `<p class="err">${U.esc(e.message)}</p>`; return; }
  const s = d.student;
  $app.innerHTML = `<div class="narrow pop"><div class="row"><button class="linkbtn" style="color:var(--teal)" id="back">← Class ${U.esc(s.class_code)}</button></div>
    <div class="hero"><p class="eyebrow">${U.esc(s.username)}</p><h1>${U.esc(s.name)}</h1></div>
    ${U.trackerHTML(d.history, s)}
    <form class="panel" id="pin"><h3>Reset PIN</h3><p class="note">Use this if the student forgets their PIN. They will be signed out on their devices.</p>
      <div class="row"><input type="tel" id="np" inputmode="numeric" maxlength="4" placeholder="New 4-digit PIN" style="max-width:12em"><button class="btn small" type="submit">Set PIN</button></div>
      <p class="note" id="pm" aria-live="polite"></p></form></div>`;
  document.getElementById("back").onclick = () => draw();
  document.getElementById("pin").addEventListener("submit", async ev => {
    ev.preventDefault();
    const m = document.getElementById("pm");
    try { await api.resetPin(session.token, id, document.getElementById("np").value.trim()); m.textContent = "PIN changed."; }
    catch (e) { m.innerHTML = `<span class="err">${U.esc(e.message)}</span>`; }
  });
}

start();
