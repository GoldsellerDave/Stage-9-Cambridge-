// Data layer. Live mode calls the Supabase functions in supabase/schema.sql;
// demo mode imitates them in this browser's storage so the site can be tried before Supabase is set up.
import { CONFIG } from "./config.js";
import { labOverview } from "./lab.js";

export const LIVE = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);

async function rpc(fn, args) {
  let res;
  // A slow or dropped school Wi-Fi connection gives up after 20 s with a message, so the page never just hangs.
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 20000);
  try {
    res = await fetch(`${CONFIG.supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
      method: "POST", signal: ctl.signal,
      // Only the apikey header: new sb_publishable_ keys are not JWTs, so they must not go in Authorization.
      headers: { "Content-Type": "application/json", apikey: CONFIG.supabaseAnonKey },
      body: JSON.stringify(args)
    });
  } catch (e) {
    throw new Error(e.name === "AbortError" ? "The connection is too slow right now. Check the Wi-Fi and try again."
      : `No connection to the database (${e.message}). Check your internet and try again.`);
  } finally { clearTimeout(timer); }
  const body = await res.json().catch(() => null);
  if (body && body.code === "PGRST202") throw new Error("The database is not set up yet. Your teacher needs to run supabase/schema.sql.");
  if (body && /Unknown attempt type/.test(body.message || "")) throw new Error("The database needs an update before this can be saved. Your teacher needs to run supabase/schema.sql again.");
  if (!res.ok) throw new Error((body && body.message) || "Server error " + res.status);
  if (body && body.error) throw new Error(body.error);
  return body;
}

const live = {
  login: (u, p) => rpc("ck_login", { p_username: u, p_pin: p }),
  logout: t => rpc("ck_logout", { p_token: t }),
  me: t => rpc("ck_me", { p_token: t }),
  history: t => rpc("ck_history", { p_token: t }),
  save: (t, a) => rpc("ck_save_attempt", { p_token: t, p_attempt: a }),
  leaderboard: (t, c = null) => rpc("ck_leaderboard", { p_token: t, p_class: c }),
  teacherClasses: t => rpc("ck_teacher_classes", { p_token: t }),
  teacherClass: (t, c) => rpc("ck_teacher_class", { p_token: t, p_class: c }),
  teacherStudent: (t, id) => rpc("ck_teacher_student", { p_token: t, p_student: id }),
  resetPin: (t, id, pin) => rpc("ck_teacher_reset_pin", { p_token: t, p_student: id, p_pin: pin }),
  aiMark,
  aiLog: (t, c) => rpc("ck_teacher_ai_log", { p_token: t, p_class: c }),
  aiFlag: (t, id, on) => rpc("ck_teacher_ai_flag", { p_token: t, p_id: id, p_overruled: on }),
  addStudents: (t, c, names) => rpc("ck_teacher_add_students", { p_token: t, p_class: c, p_names: names }),
  newPins: (t, c) => rpc("ck_teacher_new_pins", { p_token: t, p_class: c }),
  removeStudent: (t, id) => rpc("ck_teacher_remove_student", { p_token: t, p_student: id }),
  deleteClass: (t, c) => rpc("ck_teacher_delete_class", { p_token: t, p_class: c }),
  setPassword: (t, o, n) => rpc("ck_set_password", { p_token: t, p_old: o, p_new: n }),
  teachers: t => rpc("ck_admin_teachers", { p_token: t }),
  addTeacher: (t, name, u) => rpc("ck_admin_add_teacher", { p_token: t, p_name: name, p_username: u }),
  resetTeacher: (t, id) => rpc("ck_admin_reset_teacher", { p_token: t, p_teacher: id }),
  removeTeacher: (t, id) => rpc("ck_admin_remove_teacher", { p_token: t, p_teacher: id }),
  moveClass: (t, c, id) => rpc("ck_admin_move_class", { p_token: t, p_class: c, p_teacher: id }),
  liveStart: (t, c, u) => rpc("ck_live_start", { p_token: t, p_class: c, p_unit: u }),
  liveControl: (t, code, action) => rpc("ck_live_control", { p_token: t, p_code: code, p_action: action }),
  liveBoard: (t, code) => rpc("ck_live_board", { p_token: t, p_code: code }),
  liveJoin: (t, code, team) => rpc("ck_live_join", { p_token: t, p_code: code, p_team: team }),
  liveProgress: (t, code, team, p) => rpc("ck_live_progress", { p_token: t, p_code: code, p_team: team, p_room: p.room, p_solved: p.solved, p_penalty: p.penalty, p_out: p.out }),
  liveFeed: (t, code) => rpc("ck_live_feed", { p_token: t, p_code: code })
};

// AI marking of a short answer by the "grade" Edge Function. Returns { ok, hits, feedback },
// or null on any problem (not deployed, no key, daily limit, slow), so the keyword result stands.
async function aiMark(t, q) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(`${CONFIG.supabaseUrl.replace(/\/$/, "")}/functions/v1/grade`, {
      method: "POST", signal: ctl.signal,
      headers: { "Content-Type": "application/json", apikey: CONFIG.supabaseAnonKey },
      body: JSON.stringify({ token: t, ...q })
    });
    const body = await res.json().catch(() => null);
    return res.ok && body && typeof body.ok === "boolean" ? body : null;
  } catch (e) { return null; } finally { clearTimeout(timer); }
}

/* ---------------- demo backend ---------------- */
const KEY = "ckpt-demo-db-v1";
const SKILLS = ["Main idea", "Detail", "Vocabulary in context", "Detail: two points", "Inference",
                "Cause and effect", "Writer's purpose", "Writer's view"];
const DEMO_NAMES = ["Mai", "Khoa", "Linh", "Bao", "Vy", "Minh", "An", "Huy"];   // fictional sample class

function weekStart(now = new Date()) {
  const d = new Date(now.getTime() + 7 * 3600e3), day = (d.getUTCDay() + 6) % 7;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day) - 7 * 3600e3);
}
function seed() {
  const db = { students: [], attempts: [], tokens: {} };
  let n = 0;
  const add = (username, name, role, pin, cls) => { const s = { id: "s" + (++n), username, display_name: name, role, pin, class_code: cls, level: null, xp_total: 0 }; db.students.push(s); return s; };
  add("demo", "Demo Sam", "student", "1234", "DEMO");
  add("teacher", "Teacher", "teacher", "demo", "TEACHER").is_admin = true;
  db.classes = [{ code: "DEMO", teacher_id: "s2" }];
  let r = 7;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  DEMO_NAMES.forEach((nm, i) => {
    const s = add("demo-" + (i + 1), nm + " (sample)", "student", "0000", "DEMO");
    const score = 3 + Math.floor(rnd() * 9), lvl = score <= 5 ? 0 : score <= 9 ? 1 : 2;
    const when = d => new Date(Date.now() - d * 86400e3).toISOString();
    const ans = (k, lv) => Array.from({ length: k }, (_, j) => ({ skill: SKILLS[j % 8], level: lv, first_try: rnd() < 0.35 + lv * 0.2, support: "none" }));
    db.attempts.push({ id: db.attempts.length + 1, student_id: s.id, mode: "baseline", text_id: "baseline", level_start: 0, level_end: lvl, score, max_score: 12, xp: score * 5 + 20, seconds: 700, answers: ans(12, lvl), created_at: when(12 + i) });
    const k = 1 + Math.floor(rnd() * 3);
    for (let j = 0; j < k; j++) {
      const xp = 60 + Math.floor(rnd() * 90);
      db.attempts.push({ id: db.attempts.length + 1, student_id: s.id, mode: "practice", text_id: "sleep", level_start: lvl, level_end: lvl, score: 4 + Math.floor(rnd() * 5), max_score: 8, xp, seconds: 900, answers: ans(8, lvl), created_at: when(j * 3 + rnd() * 2) });
    }
    s.level = lvl;
    s.xp_total = db.attempts.filter(a => a.student_id === s.id).reduce((t, a) => t + a.xp, 0);
  });
  return db;
}
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.students) { if (!d.classes) { const t = d.students.find(x => x.username === "teacher"); if (t) t.is_admin = true; d.classes = [{ code: "DEMO", teacher_id: t && t.id }]; } return d; } } catch (e) {}
  return seed();
}
function store(db) { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
function auth(db, t) { const id = db.tokens[t]; const s = db.students.find(x => x.id === id); if (!s) throw new Error("Please sign in again."); return s; }
function teacher(db, t) { const s = auth(db, t); if (s.role !== "teacher") throw new Error("Teacher sign-in needed."); return s; }
// The same rules as the database: the admin sees every class, other teachers only their own.
const canSee = (db, s, c) => s.is_admin || db.classes.some(x => x.code === c && x.teacher_id === s.id);
function ofClass(db, t, c) { const s = teacher(db, t); if (!canSee(db, s, c)) throw new Error("You can only see your own classes."); return s; }
function ofStudent(db, t, id) { const s = teacher(db, t), k = db.students.find(x => x.id === id && x.role === "student");
  if (!k || !canSee(db, s, k.class_code)) throw new Error("You can only see students in your own classes."); return s; }
function admin(db, t) { const s = teacher(db, t); if (!s.is_admin) throw new Error("Only the admin can manage teachers."); return s; }
const newPin = () => String(Math.floor(Math.random() * 10000)).padStart(4, "0");
const newPassword = () => Array.from({ length: 8 }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");
const numOf = u => +((/-(\d+)$/.exec(u) || [])[1] || 0);
const xpSince = (db, id, since) => db.attempts.filter(a => a.student_id === id && new Date(a.created_at) >= since).reduce((t, a) => t + a.xp, 0);
const hist = (db, id) => db.attempts.filter(a => a.student_id === id).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
const pc = a => a.max_score ? Math.floor(a.score * 100 / a.max_score) : 0; // percentage, like the database
const later = v => new Promise(res => setTimeout(() => res(JSON.parse(JSON.stringify(v))), 120));

const demo = {
  async login(u, p) {
    const db = load(), s = db.students.find(x => x.username === String(u).trim().toLowerCase());
    if (!s || s.pin !== String(p).trim()) throw new Error("Wrong username or PIN.");
    const t = "demo-" + Math.random().toString(36).slice(2); db.tokens[t] = s.id; store(db);
    return later({ token: t, role: s.role, name: s.display_name, class_code: s.class_code, level: s.level, must_change: !!s.must_change });
  },
  async logout(t) { const db = load(); delete db.tokens[t]; store(db); return null; },
  async me(t) {
    const db = load(), s = auth(db, t);
    return later({ id: s.id, name: s.display_name, username: s.username, class_code: s.class_code, role: s.role, level: s.level,
      is_admin: !!s.is_admin, must_change: !!s.must_change,
      xp_total: s.xp_total, xp_week: xpSince(db, s.id, weekStart()), baseline_done: db.attempts.some(a => a.student_id === s.id && a.mode === "baseline") });
  },
  async history(t) { const db = load(), s = auth(db, t); return later(hist(db, s.id)); },
  async save(t, a) {
    const db = load(), s = auth(db, t);
    const reading = a.mode === "baseline" || a.mode === "practice";
    const xp = Math.max(0, Math.min(400, a.xp | 0)), end = Math.max(0, Math.min(3, a.level_end | 0)),
      lvl = reading ? Math.max(0, Math.min(3, (a.next_level ?? a.level_end) | 0)) : s.level;
    const { next_level, ...row } = a;
    db.attempts.push({ ...row, xp, level_end: reading ? end : null, id: db.attempts.length + 1, student_id: s.id, created_at: new Date().toISOString() });
    s.xp_total += xp; s.level = lvl; store(db);
    return later({ xp_total: s.xp_total, level: s.level });
  },
  async leaderboard(t, c = null) {
    const db = load(), s = auth(db, t), cls = s.role === "teacher" && c ? c : s.class_code;
    if (s.role === "teacher" && !canSee(db, s, cls)) throw new Error("You can only see your own classes.");
    const kids = db.students.filter(x => x.class_code === cls && x.role === "student");
    const ws = weekStart();
    const sort = arr => arr.sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
    const improved = kids.map(k => { const b = hist(db, k.id).filter(a => a.mode === "baseline");
      return b.length >= 2 ? { name: k.display_name, me: k.id === s.id, gain: pc(b[b.length - 1]) - pc(b[0]) } : null; })
      .filter(Boolean).sort((a, b) => b.gain - a.gain);
    return later({ class_code: cls,
      week: sort(kids.map(k => ({ name: k.display_name, me: k.id === s.id, xp: xpSince(db, k.id, ws) }))),
      all: sort(kids.map(k => ({ name: k.display_name, me: k.id === s.id, xp: k.xp_total }))), improved });
  },
  async teacherClasses(t) {
    const db = load(), s = teacher(db, t);
    return later(db.classes.filter(c => s.is_admin || c.teacher_id === s.id).sort((a, b) => a.code.localeCompare(b.code)).map(c => {
      const o = db.students.find(x => x.id === c.teacher_id);
      return { code: c.code, mine: c.teacher_id === s.id, teacher: o ? o.display_name : null,
               students: db.students.filter(x => x.class_code === c.code && x.role === "student").length }; }));
  },
  async teacherClass(t, c) {
    const db = load(); ofClass(db, t, c); const ws = weekStart();
    return later(db.students.filter(s => s.class_code === c && s.role === "student").map(s => {
      const h = hist(db, s.id), b = h.filter(a => a.mode === "baseline"), skills = {};
      h.forEach(a => (a.answers || []).forEach(x => { const k = skills[x.skill] = skills[x.skill] || { right: 0, total: 0 }; k.total++; if (x.first_try) k.right++; }));
      const traps = {}; h.forEach(a => (a.answers || []).forEach(x => { if (x.skill !== "Listening" || !x.trap) return;
        const k = traps[x.trap] = traps[x.trap] || { caught: 0, total: 0 }; k.total++; if (!x.first_try) k.caught++; }));
      return { id: s.id, name: s.display_name, username: s.username, level: s.level, xp_total: s.xp_total, xp_week: xpSince(db, s.id, ws),
        texts_done: h.filter(a => a.mode === "practice").length, baseline_first: b[0] ? pc(b[0]) : null,
        baseline_latest: b.length ? pc(b[b.length - 1]) : null, last_active: h.length ? h[h.length - 1].created_at : null, skills, traps, lab: labOverview(h) };
    }));
  },
  async teacherStudent(t, id) {
    const db = load(); ofStudent(db, t, id); const s = db.students.find(x => x.id === id);
    return later({ student: { id: s.id, name: s.display_name, username: s.username, class_code: s.class_code, level: s.level, xp_total: s.xp_total }, history: hist(db, id) });
  },
  async resetPin(t, id, pin) {
    const db = load(); ofStudent(db, t, id);
    if (!/^[0-9]{4}$/.test(pin)) throw new Error("A PIN must be 4 digits.");
    const s = db.students.find(x => x.id === id); if (s) s.pin = pin; store(db); return null;
  },
  // No AI in demo mode: the keyword marker decides.
  async aiMark() { return null; },
  async aiLog(t, c) { ofClass(load(), t, c); return later([]); },
  async aiFlag() { return null; },
  async addStudents(t, c, names) {
    const db = load(), s = teacher(db, t), code = String(c || "").replace(/\s/g, "").toUpperCase();
    if (!/^[A-Z0-9]{2,10}$/.test(code)) throw new Error("A class code is 2 to 10 letters or numbers, for example 8B4.");
    const list = (names || []).map(n => String(n).trim().slice(0, 80)).filter(Boolean);
    if (!list.length) throw new Error("Add at least one name.");
    if (list.length > 60) throw new Error("Add up to 60 names at a time.");
    const cl = db.classes.find(x => x.code === code);
    if (!cl) db.classes.push({ code, teacher_id: s.id });
    else if (!canSee(db, s, code)) throw new Error(`Class ${code} belongs to another teacher. Choose a different code.`);
    let n = Math.max(0, ...db.students.filter(x => x.class_code === code && x.role === "student").map(x => numOf(x.username)));
    const out = list.map(name => { n++; const pin = newPin(), username = `${code.toLowerCase()}-${String(n).padStart(2, "0")}`;
      db.students.push({ id: "s" + Date.now().toString(36) + n, username, display_name: name, role: "student", pin, class_code: code, level: null, xp_total: 0 });
      return { no: n, name, username, pin }; });
    store(db); return later({ class_code: code, students: out });
  },
  async newPins(t, c) {
    const db = load(); ofClass(db, t, c);
    const out = db.students.filter(x => x.class_code === c && x.role === "student").sort((a, b) => a.username.localeCompare(b.username))
      .map(x => { x.pin = newPin(); Object.keys(db.tokens).forEach(k => { if (db.tokens[k] === x.id) delete db.tokens[k]; });
        return { no: numOf(x.username), name: x.display_name, username: x.username, pin: x.pin }; });
    store(db); return later({ class_code: c, students: out });
  },
  async removeStudent(t, id) { const db = load(); ofStudent(db, t, id);
    db.students = db.students.filter(x => x.id !== id); db.attempts = db.attempts.filter(a => a.student_id !== id); store(db); return null; },
  async deleteClass(t, c) { const db = load(); ofClass(db, t, c);
    const ids = new Set(db.students.filter(x => x.class_code === c && x.role === "student").map(x => x.id));
    db.students = db.students.filter(x => !ids.has(x.id)); db.attempts = db.attempts.filter(a => !ids.has(a.student_id));
    db.classes = db.classes.filter(x => x.code !== c); store(db); return null; },
  async setPassword(t, o, n) { const db = load(), s = teacher(db, t);
    if (s.pin !== String(o || "").trim()) throw new Error("Your current password is not right.");
    if (String(n || "").trim().length < 8) throw new Error("Choose a password of at least 8 characters.");
    s.pin = String(n).trim(); s.must_change = false; store(db); return null; },
  async teachers(t) { const db = load(), s = admin(db, t);
    return later(db.students.filter(x => x.role === "teacher").map(x => ({ id: x.id, name: x.display_name, username: x.username, is_admin: !!x.is_admin,
      must_change: !!x.must_change, me: x.id === s.id, classes: db.classes.filter(c => c.teacher_id === x.id).map(c => c.code).sort() }))
      .sort((a, b) => b.is_admin - a.is_admin || a.name.localeCompare(b.name))); },
  async addTeacher(t, name, u) { const db = load(); admin(db, t); const user = String(u || "").trim().toLowerCase(), pw = newPassword();
    if (String(name || "").trim().length < 2) throw new Error("Type the teacher's name.");
    if (!/^[a-z][a-z0-9.]{2,29}$/.test(user)) throw new Error("A username is 3 to 30 letters, numbers or dots, starting with a letter (for example ms.lan).");
    if (db.students.some(x => x.username === user)) throw new Error("That username is already taken.");
    db.students.push({ id: "t" + Date.now().toString(36), username: user, display_name: String(name).trim().slice(0, 80), role: "teacher", pin: pw, class_code: "TEACHER", must_change: true });
    store(db); return later({ username: user, password: pw }); },
  async resetTeacher(t, id) { const db = load(), s = admin(db, t), x = db.students.find(y => y.id === id && y.role === "teacher" && y.id !== s.id);
    if (!x) throw new Error("Teacher not found."); x.pin = newPassword(); x.must_change = true;
    Object.keys(db.tokens).forEach(k => { if (db.tokens[k] === id) delete db.tokens[k]; }); store(db); return later({ username: x.username, password: x.pin }); },
  async removeTeacher(t, id) { const db = load(), s = admin(db, t); if (id === s.id) throw new Error("You cannot remove your own account.");
    db.students = db.students.filter(x => !(x.id === id && x.role === "teacher")); db.classes.forEach(c => { if (c.teacher_id === id) c.teacher_id = null; }); store(db); return null; },
  async moveClass(t, c, id) { const db = load(); admin(db, t); if (!db.students.some(x => x.id === id && x.role === "teacher")) throw new Error("Teacher not found.");
    const cl = db.classes.find(x => x.code === c); if (cl) cl.teacher_id = id; store(db); return null; },
  // Live team escape room. In demo mode a teacher tab and team tabs in the same browser share the game.
  async liveStart(t, c, u) { const db = load(), s = ofClass(db, t, c); db.live = (db.live || []).map(l => l.teacher_id === s.id ? { ...l, status: "ended" } : l);
    const code = String(1000 + Math.floor(Math.random() * 9000));
    db.live.push({ code, class_code: c, unit: u, teacher_id: s.id, status: "waiting", seed: Math.floor(Math.random() * 2e9), started_at: null, teams: [] });
    store(db); return later({ code }); },
  async liveControl(t, code, action) { const db = load(), s = teacher(db, t), l = (db.live || []).find(x => x.code === code && x.teacher_id === s.id && x.status !== "ended");
    if (l && action === "start" && l.status === "waiting") { l.status = "playing"; l.started_at = Date.now(); }
    if (l && action === "end") l.status = "ended"; store(db); return null; },
  async liveBoard(t, code) { const db = load(), s = teacher(db, t), l = [...(db.live || [])].reverse().find(x => x.code === code && x.teacher_id === s.id);
    if (!l) throw new Error("Game not found.");
    const teams = l.teams.map(x => ({ ...x, device: (db.students.find(y => y.id === x.student_id) || {}).display_name }))
      .sort((a, b) => (!a.finished - !b.finished) || (a.seconds ?? 1e9) - (b.seconds ?? 1e9) || b.room - a.room || b.solved - a.solved);
    return later({ code: l.code, unit: l.unit, class_code: l.class_code, status: l.status, elapsed: l.started_at ? Math.round((Date.now() - l.started_at) / 1000) : 0, teams }); },
  async liveJoin(t, code, team) { const db = load(), s = auth(db, t), l = (db.live || []).find(x => x.code === String(code).trim() && x.status !== "ended");
    if (!l) throw new Error("No game with that code. Check the code on the board.");
    if (s.role === "student" && s.class_code !== l.class_code) throw new Error("That game is for another class.");
    const name = String(team || "").trim().slice(0, 24);
    if (name) { const x = l.teams.find(y => y.team === name);
      if (x && x.student_id !== s.id) throw new Error("Another device already uses that team name. Choose a different one.");
      if (!x) l.teams.push({ team: name, student_id: s.id, room: 0, solved: 0, penalty: 0, seconds: null, finished: null }); store(db); }
    return later({ code: l.code, unit: l.unit, seed: l.seed, status: l.status, elapsed: l.started_at ? (Date.now() - l.started_at) / 1000 : 0 }); },
  async liveProgress(t, code, team, p) { const db = load(), s = auth(db, t), l = (db.live || []).find(x => x.code === code && x.status === "playing");
    if (!l) return later({ status: "ended" });
    const secs = Math.round((Date.now() - l.started_at) / 1000) + Math.max(-90, p.penalty | 0), x = l.teams.find(y => y.team === team && y.student_id === s.id);
    if (x) { Object.assign(x, { room: p.room, solved: p.solved, penalty: p.penalty }); if (p.out && !x.finished) { x.finished = new Date().toISOString(); x.seconds = secs; } }
    store(db);
    return later({ status: l.status, seconds: secs, place: 1 + l.teams.filter(y => y.finished && x && y.seconds < x.seconds).length }); },
  async liveFeed(t, code) { const db = load(), s = auth(db, t), l = [...(db.live || [])].reverse().find(x => x.code === code);
    if (!l) throw new Error("Game not found.");
    if (s.role === "student" && s.class_code !== l.class_code) throw new Error("That game is for another class.");
    return later({ status: l.status, teams: l.teams.map(x => ({ team: x.team, room: x.room, solved: x.solved, out: !!x.finished })) }); },
  reset() { try { localStorage.removeItem(KEY); } catch (e) {} }
};

export const api = LIVE ? live : demo;
export const resetDemo = () => demo.reset();

/* ---------------- sign-in token kept on this device ---------------- */
const tokenKey = kind => (LIVE ? "ckpt-session-" : "ckpt-demo-session-") + kind;
export function getSession(kind = "student") { try { return JSON.parse(localStorage.getItem(tokenKey(kind))); } catch (e) { return null; } }
export function setSession(s, kind = "student") { try { s ? localStorage.setItem(tokenKey(kind), JSON.stringify(s)) : localStorage.removeItem(tokenKey(kind)); } catch (e) {} }
