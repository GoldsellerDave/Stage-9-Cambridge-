// Data layer. Live mode calls the Supabase functions in supabase/schema.sql;
// demo mode imitates them in this browser's storage so the site can be tried before Supabase is set up.
import { CONFIG } from "./config.js";

export const LIVE = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);

async function rpc(fn, args) {
  let res;
  try {
    res = await fetch(`${CONFIG.supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: CONFIG.supabaseAnonKey,
                 Authorization: "Bearer " + CONFIG.supabaseAnonKey },
      body: JSON.stringify(args)
    });
  } catch (e) { throw new Error("No connection. Check your internet and try again."); }
  const body = await res.json().catch(() => null);
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
  resetPin: (t, id, pin) => rpc("ck_teacher_reset_pin", { p_token: t, p_student: id, p_pin: pin })
};

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
  add("teacher", "Teacher", "teacher", "demo", "TEACHER");
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
function load() { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.students) return d; } catch (e) {} return seed(); }
function store(db) { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
function auth(db, t) { const id = db.tokens[t]; const s = db.students.find(x => x.id === id); if (!s) throw new Error("Please sign in again."); return s; }
function teacher(db, t) { const s = auth(db, t); if (s.role !== "teacher") throw new Error("Teacher sign-in needed."); return s; }
const xpSince = (db, id, since) => db.attempts.filter(a => a.student_id === id && new Date(a.created_at) >= since).reduce((t, a) => t + a.xp, 0);
const hist = (db, id) => db.attempts.filter(a => a.student_id === id).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
const later = v => new Promise(res => setTimeout(() => res(JSON.parse(JSON.stringify(v))), 120));

const demo = {
  async login(u, p) {
    const db = load(), s = db.students.find(x => x.username === String(u).trim().toLowerCase());
    if (!s || s.pin !== String(p).trim()) throw new Error("Wrong username or PIN.");
    const t = "demo-" + Math.random().toString(36).slice(2); db.tokens[t] = s.id; store(db);
    return later({ token: t, role: s.role, name: s.display_name, class_code: s.class_code, level: s.level });
  },
  async logout(t) { const db = load(); delete db.tokens[t]; store(db); return null; },
  async me(t) {
    const db = load(), s = auth(db, t);
    return later({ id: s.id, name: s.display_name, username: s.username, class_code: s.class_code, role: s.role, level: s.level,
      xp_total: s.xp_total, xp_week: xpSince(db, s.id, weekStart()), baseline_done: db.attempts.some(a => a.student_id === s.id && a.mode === "baseline") });
  },
  async history(t) { const db = load(), s = auth(db, t); return later(hist(db, s.id)); },
  async save(t, a) {
    const db = load(), s = auth(db, t);
    const xp = Math.max(0, Math.min(400, a.xp | 0)), lvl = Math.max(0, Math.min(2, a.level_end | 0));
    db.attempts.push({ ...a, xp, level_end: lvl, id: db.attempts.length + 1, student_id: s.id, created_at: new Date().toISOString() });
    s.xp_total += xp; s.level = lvl; store(db);
    return later({ xp_total: s.xp_total, level: s.level });
  },
  async leaderboard(t, c = null) {
    const db = load(), s = auth(db, t), cls = s.role === "teacher" && c ? c : s.class_code;
    const kids = db.students.filter(x => x.class_code === cls && x.role === "student");
    const ws = weekStart();
    const sort = arr => arr.sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
    const improved = kids.map(k => { const b = hist(db, k.id).filter(a => a.mode === "baseline");
      return b.length >= 2 ? { name: k.display_name, me: k.id === s.id, gain: b[b.length - 1].score - b[0].score } : null; })
      .filter(Boolean).sort((a, b) => b.gain - a.gain);
    return later({ class_code: cls,
      week: sort(kids.map(k => ({ name: k.display_name, me: k.id === s.id, xp: xpSince(db, k.id, ws) }))),
      all: sort(kids.map(k => ({ name: k.display_name, me: k.id === s.id, xp: k.xp_total }))), improved });
  },
  async teacherClasses(t) { const db = load(); teacher(db, t); return later([...new Set(db.students.filter(s => s.role === "student").map(s => s.class_code))].sort()); },
  async teacherClass(t, c) {
    const db = load(); teacher(db, t); const ws = weekStart();
    return later(db.students.filter(s => s.class_code === c && s.role === "student").map(s => {
      const h = hist(db, s.id), b = h.filter(a => a.mode === "baseline"), skills = {};
      h.forEach(a => (a.answers || []).forEach(x => { const k = skills[x.skill] = skills[x.skill] || { right: 0, total: 0 }; k.total++; if (x.first_try) k.right++; }));
      return { id: s.id, name: s.display_name, username: s.username, level: s.level, xp_total: s.xp_total, xp_week: xpSince(db, s.id, ws),
        texts_done: h.filter(a => a.mode === "practice").length, baseline_first: b[0] ? b[0].score : null,
        baseline_latest: b.length ? b[b.length - 1].score : null, last_active: h.length ? h[h.length - 1].created_at : null, skills };
    }));
  },
  async teacherStudent(t, id) {
    const db = load(); teacher(db, t); const s = db.students.find(x => x.id === id);
    return later({ student: { id: s.id, name: s.display_name, username: s.username, class_code: s.class_code, level: s.level, xp_total: s.xp_total }, history: hist(db, id) });
  },
  async resetPin(t, id, pin) {
    const db = load(); teacher(db, t);
    if (!/^[0-9]{4}$/.test(pin)) throw new Error("A PIN must be 4 digits.");
    const s = db.students.find(x => x.id === id); if (s) s.pin = pin; store(db); return null;
  },
  reset() { try { localStorage.removeItem(KEY); } catch (e) {} }
};

export const api = LIVE ? live : demo;
export const resetDemo = () => demo.reset();

/* ---------------- sign-in token kept on this device ---------------- */
const tokenKey = kind => (LIVE ? "ckpt-session-" : "ckpt-demo-session-") + kind;
export function getSession(kind = "student") { try { return JSON.parse(localStorage.getItem(tokenKey(kind))); } catch (e) { return null; } }
export function setSession(s, kind = "student") { try { s ? localStorage.setItem(tokenKey(kind), JSON.stringify(s)) : localStorage.removeItem(tokenKey(kind)); } catch (e) {} }
