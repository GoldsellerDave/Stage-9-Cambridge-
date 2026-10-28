// Teacher dashboard: class overview, skills heat map, each student's tracker, class leaderboard, PIN resets.
// Teachers add their own classes and print login sheets; the admin also adds colleagues (Teachers page).
import { api, LIVE, getSession, setSession } from "./api.js";
import * as U from "./ui.js";

const $app = document.getElementById("app");
const $meta = document.getElementById("meta");
let session = getSession("teacher");
let me = null, classes = [], cls = null, rows = [], tab = "overview";
const codes = () => classes.map(c => c.code);
const clsInfo = () => classes.find(c => c.code === cls) || {};

function header() {
  $meta.innerHTML = session ? `<span class="pill">${U.esc(session.name)}</span>${me && !me.must_change ? `<button class="linkbtn" id="pw">Password</button>` : ""}<button class="linkbtn" id="out">Sign out</button>` : "";
  const o = document.getElementById("out");
  if (o) o.onclick = async () => { try { await api.logout(session.token); } catch (e) {} setSession(null, "teacher"); session = null; me = null; start(); };
  const pw = document.getElementById("pw"); if (pw) pw.onclick = () => passwordView(false);
}
const page = (title, eyebrow, body, back = true) => `<div class="narrow pop">${back ? `<div class="row noprint"><button class="linkbtn" style="color:var(--teal)" id="back">← ${cls ? "Class " + U.esc(cls) : "Back"}</button></div>` : ""}
  <div class="hero"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1></div>${body}</div>`;
const onBack = () => { const b = document.getElementById("back"); if (b) b.onclick = () => (cls ? draw() : start()); };

function loginView(msg) {
  header();
  $app.innerHTML = `<div class="narrow pop"><div class="hero"><p class="eyebrow">Teacher dashboard</p><h1>Sign in</h1></div>
    ${LIVE ? "" : `<div class="demo"><b>Demo mode.</b> Username <b>teacher</b>, password <b>demo</b>. You will see a sample class.</div>`}
    <form class="panel" id="f" novalidate>
      <label class="fld" for="u">Username<input type="text" id="u" autocomplete="username" autocapitalize="none"></label>
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
  try { me = await api.me(session.token); if (me.must_change) { header(); return passwordView(true); } await refreshClasses(); }
  catch (e) { setSession(null, "teacher"); session = null; me = null; return loginView(e.message); }
  header();
  cls = cls && codes().includes(cls) ? cls : (classes.find(c => c.mine) || classes[0] || {}).code || null;
  if (!cls) return addClassView(true);
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
  const lv = [0, 1, 2, 3].map(l => placed.filter(r => r.level === l).length);
  const active = rows.filter(r => r.last_active && Date.now() - new Date(r.last_active) < 7 * 86400e3).length;
  const needHelp = rows.filter(r => r.last_active == null || Date.now() - new Date(r.last_active) > 14 * 86400e3);
  let h = `<div class="narrow" style="max-width:1100px">
    <div class="row" style="justify-content:space-between"><div class="hero"><p class="eyebrow">Teacher dashboard${clsInfo().mine === false ? ` · ${U.esc(clsInfo().teacher || "No teacher")}'s class` : ""}</p><h1>Class ${U.esc(cls)}</h1></div>
      <div class="tabs" role="tablist" aria-label="Class">${classes.map(c => `<button role="tab" aria-selected="${c.code === cls}" data-c="${U.esc(c.code)}">${U.esc(c.code)}</button>`).join("")}
        <button id="addcls" title="Add a class">+ Add class</button>${me && me.is_admin ? `<button id="tch">Teachers</button>` : ""}</div></div>
    <div class="stats">
      <div class="stat"><b>${placed.length}/${rows.length}</b><span>took the baseline</span></div>
      <div class="stat"><b>${lv.join(" · ")}</b><span>Easier · Core · Harder · Challenge</span></div>
      <div class="stat"><b>${active}</b><span>active in the last 7 days</span></div>
      <div class="stat gold"><b>${rows.reduce((t, r) => t + r.xp_week, 0)}</b><span>class XP this week</span></div></div>
    <div class="tabs" role="tablist" aria-label="View">${[["overview", "Students"], ["heat", "Skills heat map"], ["board", "Leaderboard"], ["ai", "AI marking"], ["manage", "Manage class"]].map(([k, l]) => `<button role="tab" aria-selected="${k === tab}" data-t="${k}">${l}</button>`).join("")}</div>`;
  if (tab === "overview") {
    h += `<div class="tbl"><table><thead><tr><th>Student</th><th>Username</th><th>Level</th><th class="num" title="First baseline and latest baseline or Checkpoint check, as a percentage">Baseline / check</th><th class="num">XP week</th><th class="num">XP total</th><th class="num">Texts</th><th>Last active</th><th>Weakest skill</th></tr></thead><tbody>${
      rows.map(r => { const w = weakest(r.skills || {});
        return `<tr><td><button class="linkbtn" style="color:var(--teal);text-align:left" data-s="${r.id}">${U.esc(r.name)}</button></td><td>${U.esc(r.username)}</td>
          <td><span class="lvl">${U.levelName(r.level)}</span></td>
          <td class="num">${r.baseline_first == null ? "–" : r.baseline_latest !== r.baseline_first ? `${r.baseline_first}% → ${r.baseline_latest}%` : r.baseline_first + "%"}</td>
          <td class="num">${r.xp_week}</td><td class="num">${r.xp_total}</td><td class="num">${r.texts_done}</td><td>${ago(r.last_active)}</td>
          <td>${w ? `${U.esc(w.s)} (${w.p}%)` : "–"}</td></tr>`; }).join("")
    }</tbody></table></div>
    ${needHelp.length ? `<div class="panel"><h3>Not active for 2 weeks or more</h3><p style="margin:0">${needHelp.map(r => U.esc(r.name)).join(", ")}</p></div>` : ""}`;
  } else if (tab === "heat") {
    h += `<p class="lede">Percentage of questions right first time, per student and skill. Blank cells mean not tried yet.</p>
      <div class="legend"><span><i class="h0"></i>under 40%</span><span><i class="h1"></i>40–59%</span><span><i class="h2"></i>60–79%</span><span><i class="h3"></i>80% or more</span></div>
      <div class="tbl"><table class="heat"><thead><tr><th>Student</th>${U.SKILLS.map(s => `<th class="num" title="${U.esc(s)}">${U.esc(s.replace("Vocabulary in context", "In context").replace("Detail: two points", "Two points").replace("Cause and effect", "Cause/effect").replace("Writer's ", "W. "))}</th>`).join("")}</tr></thead><tbody>${
        rows.map(r => `<tr><td>${U.esc(r.name)}</td>${U.SKILLS.map(s => { const p = pct((r.skills || {})[s]);
          return p == null ? `<td class="h hn"></td>` : `<td class="h h${p < 40 ? 0 : p < 60 ? 1 : p < 80 ? 2 : 3}">${p}%</td>`; }).join("")}</tr>`).join("")
      }</tbody><tfoot><tr><th>Class</th>${U.SKILLS.map(s => { let rt = 0, tt = 0; rows.forEach(r => { const k = (r.skills || {})[s]; if (k) { rt += k.right; tt += k.total; } });
          return `<th class="num">${tt ? Math.round(100 * rt / tt) + "%" : "–"}</th>`; }).join("")}</tr></tfoot></table></div>`;
  } else if (tab === "manage") {
    h += manageHTML();
  } else if (tab === "ai") {
    h += `<p class="lede">Short answers the keyword marker missed are checked by AI. Here are its last 200 decisions. Flag any you disagree with: a flag is a note for you and does not change XP or scores.</p>
      <div id="ailog"><p class="note">Loading…</p></div>`;
  } else {
    h += `<div id="board"><p class="note">Loading…</p></div>`;
  }
  h += `</div>`;
  $app.innerHTML = h;
  $app.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { cls = b.dataset.c; loadClass(); });
  $app.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { tab = b.dataset.t; draw(); });
  $app.querySelectorAll("[data-s]").forEach(b => b.onclick = () => studentView(b.dataset.s));
  document.getElementById("addcls").onclick = () => addClassView(false);
  const tb = document.getElementById("tch"); if (tb) tb.onclick = () => teachersView();
  if (tab === "manage") manageWire();
  if (tab === "board") boardView();
  if (tab === "ai") aiView();
}

async function aiView() {
  const el = document.getElementById("ailog");
  let log; try { log = await api.aiLog(session.token, cls); } catch (e) { el.innerHTML = `<p class="err">${U.esc(e.message)}</p>`; return; }
  if (!log.length) { el.innerHTML = `<p class="note">${LIVE ? "No AI decisions yet for this class." : "AI marking only runs on the live site."}</p>`; return; }
  el.innerHTML = `<div class="tbl"><table><thead><tr><th>When</th><th>Student</th><th>Question</th><th>Answer</th><th>AI said</th><th></th></tr></thead><tbody>${
    log.map(l => `<tr class="${l.overruled ? "flagged" : ""}"><td>${U.fmtDate(l.created_at)}</td><td>${U.esc(l.name)}</td>
      <td>${U.esc(U.textTitle(l.text_id))}<br><span class="note">${U.esc(l.question || "")}</span></td><td>${U.esc(l.answer)}</td>
      <td><span class="chip ${l.ok ? "ok" : "bad"}">${l.ok ? "Accepted" : "Not yet"}</span><br><span class="note">${U.esc((l.hits || []).join("; ") || l.feedback || "")}</span></td>
      <td><button class="btn small ${l.overruled ? "" : "alt"}" data-flag="${l.id}" data-on="${l.overruled ? 0 : 1}">${l.overruled ? "Flagged" : "Flag"}</button></td></tr>`).join("")
  }</tbody></table></div>`;
  el.querySelectorAll("[data-flag]").forEach(b => b.onclick = async () => {
    b.disabled = true;
    try { await api.aiFlag(session.token, Number(b.dataset.flag), b.dataset.on === "1"); aiView(); }
    catch (e) { b.disabled = false; b.textContent = "Try again"; }
  });
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
    ${U.trackerHTML(d.history, s, { links: false })}
    <form class="panel" id="pin"><h3>Reset PIN</h3><p class="note">Use this if the student forgets their PIN. They will be signed out on their devices.</p>
      <div class="row"><input type="tel" id="np" inputmode="numeric" maxlength="4" placeholder="New 4-digit PIN" style="max-width:12em"><button class="btn small" type="submit">Set PIN</button></div>
      <p class="note" id="pm" aria-live="polite"></p></form>
    <div class="panel"><h3>Remove student</h3><p class="note">Removes ${U.esc(s.name)} and all their work from the site. This cannot be undone.</p>
      <button class="btn small alt danger" id="rm">Remove ${U.esc(s.name)}</button><p class="note" id="rmm" aria-live="polite"></p></div></div>`;
  document.getElementById("rm").onclick = async () => {
    if (!confirm(`Remove ${s.name} and all their work? This cannot be undone.`)) return;
    try { await api.removeStudent(session.token, id); await refreshClasses(); loadClass(); }
    catch (e) { document.getElementById("rmm").innerHTML = `<span class="err">${U.esc(e.message)}</span>`; }
  };
  document.getElementById("back").onclick = () => draw();
  document.getElementById("pin").addEventListener("submit", async ev => {
    ev.preventDefault();
    const m = document.getElementById("pm");
    try { await api.resetPin(session.token, id, document.getElementById("np").value.trim()); m.textContent = "PIN changed."; }
    catch (e) { m.innerHTML = `<span class="err">${U.esc(e.message)}</span>`; }
  });
}

/* ---------------- classes: add, manage, login sheets ---------------- */
// Before schema.sql is re-run, the database sends plain class codes: treat them as the admin's own classes.
async function refreshClasses() { classes = (await api.teacherClasses(session.token)).map(c => typeof c === "string" ? { code: c, mine: true } : c); }
// One name per line, as copied from a register or spreadsheet. A number in front ("1.", "12 ", "3)") is dropped.
const parseNames = t => t.split(/\r?\n/).map(l => l.split("\t").find(x => /\p{L}/u.test(x)) || "")
  .map(l => l.replace(/^\s*\d+[\s.,)\-]*/, "").trim()).filter(Boolean);

function namesField(id) {
  return `<label class="fld" for="${id}">Student names, one per line<textarea id="${id}" rows="10" placeholder="Paste from your register, for example:\nNguyễn Văn An\nTrần Thị Bình"></textarea></label>
    <p class="note" id="${id}-n">Usernames are numbered in this order.</p>`;
}
function countNames(id) { const t = document.getElementById(id), n = document.getElementById(id + "-n");
  t.oninput = () => { const k = parseNames(t.value).length; n.textContent = k ? `${k} student${k === 1 ? "" : "s"}. Usernames are numbered in this order.` : "Usernames are numbered in this order."; }; }

function addClassView(first) {
  $app.innerHTML = page(first ? "Add your first class" : "Add a class", "Teacher dashboard", `
    ${first ? `<p class="lede">You don't have any classes yet. Type a class code and paste your students' names. You'll get a login sheet to print.</p>` : ""}
    <form class="panel" id="f" novalidate>
      <label class="fld" for="code">Class code<input type="text" id="code" maxlength="10" placeholder="for example 7A2" style="max-width:12em;text-transform:uppercase"></label>
      <p class="note">Usernames start with the class code, for example 7a2-01. Use a code no other teacher uses.</p>
      ${namesField("names")}
      <p class="err" id="e" role="alert"></p>
      <div class="row"><button class="btn" type="submit" id="go">Make logins</button></div></form>`, !first);
  onBack(); countNames("names");
  document.getElementById("f").addEventListener("submit", async ev => {
    ev.preventDefault(); const b = document.getElementById("go"); b.disabled = true;
    try { const r = await api.addStudents(session.token, document.getElementById("code").value, parseNames(document.getElementById("names").value));
      await refreshClasses(); cls = r.class_code; sheetView(r, "New class"); }
    catch (e) { document.getElementById("e").textContent = e.message; b.disabled = false; }
  });
}

function manageHTML() {
  const others = me.is_admin ? `<form class="panel" id="mv"><h3>Give this class to another teacher</h3>
      <p class="note">They will see it on their dashboard. Students keep their logins and progress.</p>
      <div class="row"><select id="mvt" style="max-width:20em"><option value="">Loading teachers…</option></select><button class="btn small" type="submit">Move class</button></div>
      <p class="note" id="mvm" aria-live="polite"></p></form>` : "";
  return `<form class="panel" id="ad"><h3>Add students to ${U.esc(cls)}</h3>${namesField("more")}
      <div class="row"><button class="btn small" type="submit">Add and print their logins</button></div><p class="note" id="adm" aria-live="polite"></p></form>
    <div class="panel"><h3>New login sheet</h3><p class="note">PINs are stored scrambled, so the site can't show old ones. This gives every student in ${U.esc(cls)} a new PIN and prints a fresh sheet. They are signed out, but their progress is kept.</p>
      <div class="row"><button class="btn small alt" id="np2">New PINs for the whole class</button></div><p class="note" id="npm" aria-live="polite"></p></div>
    ${others}
    <form class="panel" id="del"><h3>Delete this class</h3><p class="note">Removes ${U.esc(cls)}, its students and all their work. This cannot be undone. Type the class code to confirm.</p>
      <div class="row"><input type="text" id="delc" placeholder="${U.esc(cls)}" style="max-width:10em"><button class="btn small alt danger" type="submit">Delete class</button></div>
      <p class="note" id="delm" aria-live="polite"></p></form>`;
}
function manageWire() {
  const say = (id, e) => { document.getElementById(id).innerHTML = `<span class="err">${U.esc(e.message)}</span>`; };
  countNames("more");
  document.getElementById("ad").addEventListener("submit", async ev => { ev.preventDefault();
    try { const r = await api.addStudents(session.token, cls, parseNames(document.getElementById("more").value)); await refreshClasses(); sheetView(r, "New students"); }
    catch (e) { say("adm", e); } });
  document.getElementById("np2").onclick = async () => {
    if (!confirm(`Give every student in ${cls} a new PIN? Their old PINs stop working.`)) return;
    try { sheetView(await api.newPins(session.token, cls), "New PINs"); } catch (e) { say("npm", e); } };
  document.getElementById("del").addEventListener("submit", async ev => { ev.preventDefault();
    if (document.getElementById("delc").value.trim().toUpperCase() !== cls) return say("delm", new Error(`Type ${cls} to confirm.`));
    if (!confirm(`Delete ${cls} and all its students' work? This cannot be undone.`)) return;
    try { await api.deleteClass(session.token, cls); cls = null; start(); } catch (e) { say("delm", e); } });
  const mv = document.getElementById("mv");
  if (mv) {
    api.teachers(session.token).then(ts => { document.getElementById("mvt").innerHTML = `<option value="">Choose a teacher</option>` +
      ts.map(t => `<option value="${U.esc(t.id)}">${U.esc(t.name)} (${U.esc(t.username)})</option>`).join(""); }).catch(e => say("mvm", e));
    mv.addEventListener("submit", async ev => { ev.preventDefault(); const id = document.getElementById("mvt").value; if (!id) return;
      try { await api.moveClass(session.token, cls, id); await refreshClasses(); document.getElementById("mvm").textContent = "Moved."; }
      catch (e) { say("mvm", e); } });
  }
}

// The printable login sheet: a teacher list, then one cut-out slip per student. PINs are shown only here.
function sheetView(r, what) {
  const site = new URL("./", location.href).href.replace(/^https?:\/\//, "").replace(/\/$/, ""), list = r.students;
  $app.innerHTML = page(`${U.esc(what)}: ${U.esc(r.class_code)}`, "Login sheet", `
    <div class="panel noprint"><p style="margin:0"><b>Print this page now, or save it as a PDF.</b> PINs are shown only once. If a sheet gets lost, use "New PINs" on the Manage class tab.</p>
      <div class="row" style="margin-top:10px"><button class="btn" id="print">Print or save as PDF</button><button class="btn alt" id="done">Done</button></div></div>
    <div class="lsheet"><h2 class="printonly">${U.esc(r.class_code)} logins (teacher copy)</h2>
      <p>Website: <b>${U.esc(site)}</b>. Students sign in with their username and 4-digit PIN.</p>
      <div class="tbl"><table><thead><tr><th>No</th><th>Name</th><th>Username</th><th>PIN</th></tr></thead><tbody>${
        list.map(x => `<tr><td>${x.no}</td><td>${U.esc(x.name)}</td><td class="mono">${U.esc(x.username)}</td><td class="mono">${U.esc(x.pin)}</td></tr>`).join("")}</tbody></table></div>
      <div class="slips">${list.map(x => `<div class="slip"><div class="sl-t">Checkpoint Reading · ${U.esc(r.class_code)}</div><div class="sl-n">${U.esc(x.name)}</div>
        <div class="sl-l">Website</div><div class="sl-u">${U.esc(site)}</div>
        <div class="sl-g"><div><div class="sl-l">Username</div><b>${U.esc(x.username)}</b></div><div><div class="sl-l">PIN</div><b>${U.esc(x.pin)}</b></div></div>
        <div class="sl-l">Keep your PIN secret.</div></div>`).join("")}</div></div>`);
  onBack();
  document.getElementById("print").onclick = () => window.print();
  document.getElementById("done").onclick = () => { tab = "overview"; loadClass(); };
}

/* ---------------- passwords and colleagues ---------------- */
function passwordView(forced) {
  $app.innerHTML = page(forced ? "Choose your password" : "Change your password", "Teacher dashboard", `
    ${forced ? `<p class="lede">You signed in with a one-time password. Choose your own to carry on.</p>` : ""}
    <form class="panel" id="f" novalidate>
      <label class="fld" for="o">${forced ? "One-time password" : "Current password"}<input type="password" id="o" autocomplete="current-password"></label>
      <label class="fld" for="n">New password (at least 8 characters)<input type="password" id="n" autocomplete="new-password"></label>
      <label class="fld" for="n2">New password again<input type="password" id="n2" autocomplete="new-password"></label>
      <p class="err" id="e" role="alert"></p>
      <div class="row"><button class="btn" type="submit" id="go">Save password</button></div></form>`, !forced);
  onBack();
  document.getElementById("f").addEventListener("submit", async ev => {
    ev.preventDefault(); const e = document.getElementById("e"), n = document.getElementById("n").value;
    if (n !== document.getElementById("n2").value) { e.textContent = "The two new passwords are different."; return; }
    try { await api.setPassword(session.token, document.getElementById("o").value, n); start(); }
    catch (x) { e.textContent = x.message; }
  });
}

async function teachersView(added) {
  $app.innerHTML = `<p class="note">Loading…</p>`;
  let ts; try { ts = await api.teachers(session.token); } catch (e) { $app.innerHTML = `<p class="err">${U.esc(e.message)}</p>`; return; }
  const site = new URL("teacher.html", location.href).href;
  const card = added ? `<div class="panel pass"><h3>${added.reset ? "New one-time password" : "Account made"} for ${U.esc(added.name)}</h3>
      <p>Send them this. They choose their own password when they first sign in.</p>
      <pre id="msg">Checkpoint Reading teacher sign-in
${U.esc(site)}
Username: ${U.esc(added.username)}
One-time password: ${U.esc(added.password)}</pre>
      <div class="row"><button class="btn small" id="copy">Copy</button></div></div>` : "";
  $app.innerHTML = page("Teachers", "Admin", `${card}
    <div class="tbl"><table><thead><tr><th>Name</th><th>Username</th><th>Classes</th><th>Status</th><th></th></tr></thead><tbody>${
      ts.map(t => `<tr><td>${U.esc(t.name)}${t.is_admin ? ` <span class="chip">Admin</span>` : ""}</td><td>${U.esc(t.username)}</td>
        <td>${t.classes.length ? t.classes.map(U.esc).join(", ") : "–"}</td><td>${t.must_change ? "Not signed in yet" : "Active"}</td>
        <td>${t.me ? "" : `<button class="btn small alt" data-rs="${U.esc(t.id)}" data-n="${U.esc(t.name)}">New password</button>
          <button class="btn small alt danger" data-rm="${U.esc(t.id)}" data-n="${U.esc(t.name)}">Remove</button>`}</td></tr>`).join("")}</tbody></table></div>
    <form class="panel" id="f" novalidate><h3>Add a teacher</h3>
      <label class="fld" for="tn">Name<input type="text" id="tn" placeholder="for example Ms Lan"></label>
      <label class="fld" for="tu">Username<input type="text" id="tu" autocapitalize="none" placeholder="for example ms.lan"></label>
      <p class="err" id="e" role="alert"></p>
      <div class="row"><button class="btn" type="submit">Add teacher</button></div>
      <p class="note">They add their own classes and see only those. You see every class. Removing a teacher keeps their classes, and you can give them to someone else on each class's Manage tab.</p></form>`);
  onBack();
  const c = document.getElementById("copy");
  if (c) c.onclick = async () => { try { await navigator.clipboard.writeText(document.getElementById("msg").textContent); c.textContent = "Copied"; } catch (e) { c.textContent = "Select and copy the text"; } };
  document.getElementById("f").addEventListener("submit", async ev => {
    ev.preventDefault(); const name = document.getElementById("tn").value;
    try { const r = await api.addTeacher(session.token, name, document.getElementById("tu").value); teachersView({ ...r, name }); }
    catch (e) { document.getElementById("e").textContent = e.message; }
  });
  $app.querySelectorAll("[data-rs]").forEach(b => b.onclick = async () => {
    if (!confirm(`Give ${b.dataset.n} a new one-time password? Their old one stops working.`)) return;
    try { const r = await api.resetTeacher(session.token, b.dataset.rs); teachersView({ ...r, name: b.dataset.n, reset: true }); } catch (e) { alert(e.message); } });
  $app.querySelectorAll("[data-rm]").forEach(b => b.onclick = async () => {
    if (!confirm(`Remove ${b.dataset.n}'s account? Their classes and students stay.`)) return;
    try { await api.removeTeacher(session.token, b.dataset.rm); await refreshClasses(); teachersView(); } catch (e) { alert(e.message); } });
}

start();
