// Adaptive reading engine: pure functions, no DOM. Shared by the student app and the tests.
import { PLACEMENT } from "./content.js";

export const LEVELS = ["Easier", "Core", "Harder", "Challenge"];
export const TOP_START = 2;            // Challenge is reached only inside a text, never as a starting level
export const UP_AFTER = 3;             // right first time in a row before moving up
export const MISSES_FOR_REREAD = 2;    // questions missed in a row before the reread appears
export const XP = { first: [10, 15, 20, 25], hint: 5, rescue: 3, easier: 3, explained: 0,
                    finish: 20, levelUp: 25, streakWeek: 10, replayFactor: 0.5 };
export const SUPPORT_LABEL = { none: "Right first time", hint: "After a hint", rescue: "After reread + strategy",
                               easier: "After easier text", explained: "Explained" };

/* ---------------- marking ---------------- */
function norm(t) { return " " + String(t).toLowerCase().replace(/[^a-z\s'-]/g, " ").replace(/\s+/g, " ") + " "; }
export function shortHits(answer, groups) {
  const a = norm(answer);
  return groups.filter(g => g.k.some(k => k.length <= 3
    ? new RegExp("\\b" + k + "(s|ed|ness)?\\b").test(a)
    : a.includes(k))).map(g => g.label);
}
export function mark(q, response) {
  if (q.type === "short") {
    const words = String(response || "").trim().split(/\s+/).filter(Boolean).length;
    if (words < 2) return { ok: false, tooShort: true, hits: [] };
    const hits = shortHits(response, q.groups);
    return { ok: hits.length >= q.need, hits };
  }
  return { ok: response === 0, hits: [] };
}

/* ---------------- practice run ---------------- */
export function newRun(text, startLevel) {
  startLevel = Math.max(0, Math.min(startLevel ?? 1, TOP_START, text.levels.length - 1));
  return { textId: text.id, level: startLevel, levelStart: startLevel, slot: 0, stage: 0,
           missedRow: 0, rightRow: 0, dropped: false, results: [], path: [{ level: startLevel, at: 0 }],
           levelUps: 0, done: false };
}
export function question(text, run) { return text.slots[run.slot].q[run.level]; }

// Returns { outcome: "correct" | "hint" | "reread" | "down" | "explained", firstTry? }
export function submit(text, run, correct) {
  if (correct) {
    const firstTry = run.stage === 0 && !run.dropped;
    run.results[run.slot] = { slot: run.slot, skill: text.slots[run.slot].skill, level: run.level, first_try: firstTry,
                              support: run.dropped ? "easier" : ["none", "hint", "rescue"][run.stage] };
    if (firstTry) { run.rightRow++; run.missedRow = 0; } else run.rightRow = 0;
    return { outcome: "correct", firstTry };
  }
  if (run.stage === 0) {
    run.missedRow++; run.rightRow = 0;
    run.stage = run.missedRow >= MISSES_FOR_REREAD ? 2 : 1;
  } else if (run.stage === 1) {
    run.stage = 2;
  } else if (run.level > 0) {
    run.level--; run.path.push({ level: run.level, at: run.slot });
    run.stage = 0; run.missedRow = 0; run.dropped = true;
    return { outcome: "down" };
  } else {
    run.results[run.slot] = { slot: run.slot, skill: text.slots[run.slot].skill, level: run.level,
                              first_try: false, support: "explained" };
    run.missedRow = 0;
    return { outcome: "explained" };
  }
  return { outcome: run.stage === 1 ? "hint" : "reread" };
}

// Move on after a correct or explained answer. Returns "next" | "up" | "done".
export function advance(text, run) {
  run.slot++; run.stage = 0; run.dropped = false;
  if (run.slot >= text.slots.length) { run.done = true; return "done"; }
  if (run.rightRow >= UP_AFTER && run.level < text.levels.length - 1) {
    run.level++; run.rightRow = 0; run.levelUps++; run.path.push({ level: run.level, at: run.slot });
    return "up";
  }
  return "next";
}

export function answerXP(r) {
  if (r.support === "none") return XP.first[r.level];
  return XP[r.support] || 0;
}
// XP for a finished run. replay = the student has finished this text before.
export function runXP(run, { replay = false } = {}) {
  let xp = run.results.reduce((s, r) => s + answerXP(r), 0) + XP.finish + run.levelUps * XP.levelUp;
  if (replay) xp = Math.round(xp * XP.replayFactor);
  return xp;
}

/* ---------------- baseline ---------------- */
export function placement(score) {
  const band = PLACEMENT.find(([lo, hi]) => score >= lo && score <= hi);
  return band ? band[2] : 0;
}
export function baselineXP(score) { return score * 5 + XP.finish; }

/* ---------------- history: streaks, skills, badges ---------------- */
const TZ_OFFSET_MIN = 7 * 60;   // school time zone (UTC+7), so weeks start on Monday 00:00 local time
export function weekKey(date) {
  const d = new Date(new Date(date).getTime() + TZ_OFFSET_MIN * 60000);
  const day = (d.getUTCDay() + 6) % 7;                      // Monday = 0
  const monday = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day);
  return new Date(monday).toISOString().slice(0, 10);
}
function prevWeek(key) { const d = new Date(key + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - 7); return d.toISOString().slice(0, 10); }

// Weeks in a row (ending this week, or last week if this week is not yet complete) with 2+ activities
// (reading texts, vocabulary or grammar sets; the baseline and the quick word cards do not count).
export function weeklyStreak(history, now = new Date()) {
  const counts = {};
  history.filter(h => h.mode !== "baseline" && !/^(cards|rain|train|speed)-/.test(h.text_id || "")).forEach(h => { const k = weekKey(h.created_at); counts[k] = (counts[k] || 0) + 1; });
  let k = weekKey(now), streak = 0;
  if ((counts[k] || 0) < 2) k = prevWeek(k);
  while ((counts[k] || 0) >= 2) { streak++; k = prevWeek(k); }
  return { streak, thisWeek: counts[weekKey(now)] || 0 };
}
// Bonus when this save is the 2nd activity of the week (the week counts towards the streak).
export function streakBonus(history, now = new Date()) {
  const { thisWeek } = weeklyStreak(history, now);
  if (thisWeek !== 1) return 0;
  return XP.streakWeek;
}

export function skillStats(history, last = 20) {
  const by = {};
  [...history].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach(h =>
    (h.answers || []).forEach(a => { (by[a.skill] = by[a.skill] || []).push(a.first_try ? 1 : 0); }));
  const out = {};
  Object.keys(by).forEach(s => { const r = by[s].slice(-last); out[s] = { right: r.reduce((x, y) => x + y, 0), total: r.length }; });
  return out;
}

export const SKILL_BADGES = {
  "Main idea": "Big picture", "Detail": "Detail detective", "Vocabulary in context": "Word wizard",
  "Detail: two points": "Point collector", "Inference": "Inference detective", "Cause and effect": "Cause and effect expert",
  "Writer's purpose": "Purpose spotter", "Writer's view": "Opinion reader", "Listening": "Sharp ears" };
export function badges(history) {
  const out = [];
  const practice = history.filter(h => h.mode === "practice");
  if (history.some(h => h.mode === "baseline")) out.push({ name: "First steps", why: "Finished the baseline" });
  if (practice.length >= 1) out.push({ name: "Off the mark", why: "Finished a practice text" });
  if (practice.length >= 5) out.push({ name: "Bookworm", why: "Finished 5 practice texts" });
  if (history.some(h => h.level_end === 2)) out.push({ name: "Top level", why: "Reached the Harder text" });
  if (practice.some(h => textLevel(h) === 3)) out.push({ name: "Challenger", why: "Reached a Challenge (C1) text" });
  if (weeklyStreak(history).streak >= 3) out.push({ name: "On a roll", why: "3-week reading streak" });
  const right = {};
  history.forEach(h => (h.answers || []).forEach(a => { if (a.first_try) right[a.skill] = (right[a.skill] || 0) + 1; }));
  Object.keys(SKILL_BADGES).forEach(s => { if ((right[s] || 0) >= 10) out.push({ name: SKILL_BADGES[s], why: "10 " + s.toLowerCase() + " questions right first time" }); });
  return out;
}

export function shuffle(n, rnd = Math.random) {
  const a = [...Array(n).keys()];
  do { for (let j = n - 1; j > 0; j--) { const r = Math.floor(rnd() * (j + 1)); [a[j], a[r]] = [a[r], a[j]]; } }
  while (n > 1 && a[0] === 0 && rnd() < 0.75);
  return a;
}
// Seconds before the questions open, based on the word count (about 6 words a second, 20 to 60 s).
export function minReadSeconds(paras) {
  const words = paras.map(p => p[1]).join(" ").split(/\s+/).length;
  return Math.max(20, Math.min(60, Math.round(words / 6)));
}

/* ---------------- reading level on the CEFR scale ---------------- */
// Eight steps: each text level covers a lower and an upper half of one CEFR band. These are our own estimates
// from the texts' length and language, not an official calibration.
export const BANDS = ["A2", "A2+", "B1", "B1+", "B2", "B2+", "C1", "C1+"];
const DEEP = ["Inference", "Writer's purpose", "Writer's view"];   // these count one and a half times
export const UPPER = 0.75;
// The text level a reading finished on. The server keeps level_end at most Harder, so Challenge is read from the answers.
export function textLevel(h) {
  if (h.level_end == null) return null;
  if (h.mode !== "practice") return h.level_end;
  const last = (h.answers || []).filter(a => a && a.level != null).pop();
  return last && last.level > h.level_end ? last.level : h.level_end;
}
// Upper half of the band when about 75% is right first time on the level the student finished on.
// The baseline uses its score: the same bands as placement, split in two.
export function readingBand(h) {
  const L = textLevel(h);
  if (L == null) return null;
  if (h.mode === "baseline") { const s = h.score | 0; return s >= 12 ? 5 : s >= 10 ? 4 : s >= 8 ? 3 : s >= 6 ? 2 : s >= 3 ? 1 : 0; }
  const all = (h.answers || []).filter(a => a && a.skill), here = all.filter(a => a.level === L), use = here.length >= 3 ? here : all;
  if (!use.length) return 2 * L;
  let got = 0, max = 0;
  use.forEach(a => { const w = DEEP.includes(a.skill) ? 1.5 : 1; max += w; if (a.first_try) got += w; });
  return 2 * L + (got / max >= UPPER ? 1 : 0);
}
export function currentBand(history) {
  const r = history.filter(h => h.mode === "practice" || h.mode === "baseline").filter(h => h.level_end != null);
  return r.length ? readingBand(r[r.length - 1]) : null;
}
