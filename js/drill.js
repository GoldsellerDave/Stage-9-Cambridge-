// Skill drills: four questions on one reading skill, each from a different practice text, at the student's level.
// They reuse the practice texts' questions, so they need no new content. Saved as mode "vocab" with text_id
// drill-<skill>, and each answer keeps its reading skill, so drills count in the Reading area and the skill stats.
import { PRACTICE_TEXTS } from "./content.js";

export const DRILL_LEN = 4;
export const DRILL_SKILLS = ["Main idea", "Detail", "Vocabulary in context", "Detail: two points", "Inference",
  "Cause and effect", "Writer's purpose", "Writer's view"];
export const DRILL_XP = { first: 10, hint: 5, finish: 10 };
export const drillId = skill => "drill-" + skill.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
export const drillSkill = id => DRILL_SKILLS.find(s => drillId(s) === id) || null;
export const isDrill = id => drillSkill(id) != null;

// Texts from the unit come first, then texts from other units; `seed` rotates each group so a repeat drill differs.
// The text just read is left out. Level is the student's reading level (Easier, Core or Harder: never Challenge).
export function drillItems(skill, { unit, level = 1, exclude = null, seed = 0 } = {}) {
  const lv = Math.min(Math.max(level ?? 1, 0), 2);
  const ts = PRACTICE_TEXTS.filter(t => t.id !== exclude && t.slots.some(s => s.skill === skill));
  const rot = a => { const k = a.length ? seed % a.length : 0; return [...a.slice(k), ...a.slice(0, k)]; };
  return [...rot(ts.filter(t => t.unitNo === unit)), ...rot(ts.filter(t => t.unitNo !== unit))].slice(0, DRILL_LEN).map(t => {
    const slot = t.slots.findIndex(s => s.skill === skill), l = Math.min(lv, t.levels.length - 1), q = t.slots[slot].q[l];
    return { text: t.id, slot, level: l, para: q.para || t.slots[slot].para };
  });
}
export function drillQuestion(item) {
  const t = PRACTICE_TEXTS.find(x => x.id === item.text), s = t.slots[item.slot];
  // Only some questions have their own explanation; short answers can borrow the model answers from the Easier one.
  const explain = s.q[item.level].explain || (s.q[item.level].type === "short" ? (s.q.find(x => x.explain && x.type === "short") || {}).explain : null);
  return { text: t, q: s.q[item.level], skill: s.skill, explain, paras: t.levels[item.level].paras };
}

// Reading skills from the most recent answers (texts, checks and drills), weakest first.
// A skill needs at least 2 answers, and counts as weak below 75% right first time.
export function weakSkills(history, recent = 40) {
  const answers = [...history].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .flatMap(h => h.answers || []).filter(a => DRILL_SKILLS.includes(a.skill)).slice(-recent);
  return DRILL_SKILLS.map(skill => { const r = answers.filter(a => a.skill === skill);
      return { skill, n: r.length, rate: r.length ? r.filter(a => a.first_try).length / r.length : null }; })
    .filter(s => s.n >= 2 && s.rate < 0.75).sort((a, b) => a.rate - b.rate || b.n - a.n);
}

export function drillXP(results) {
  const right = results.filter(r => r.support !== "explained");
  return results.reduce((t, r) => t + (r.first_try ? DRILL_XP.first : r.support === "hint" ? DRILL_XP.hint : 0), 0)
    + (right.length ? DRILL_XP.finish : 0);
}
