// My Stats (a Checkpoint score for each area) and Today's workout (three activities chosen from the weakest areas).
// Pure functions: the student page draws them and starts the activities.
import { PRACTICE_TEXTS } from "./content.js";
import { listeningFor } from "./listening.js";
import { unitGrammar, grammarMastery, wordsToReview } from "./practice.js";
import { speedTexts } from "./games.js";
import { weakestTrap, missionForTrap } from "./lab.js";
import { weakSkills, drillId } from "./drill.js";

export const READING_SKILLS = ["Main idea", "Detail", "Vocabulary in context", "Detail: two points", "Inference",
  "Cause and effect", "Writer's purpose", "Writer's view"];
const AREA_SKILLS = { Reading: [...READING_SKILLS, "Reading Lab"], Listening: ["Listening"], Vocabulary: ["Vocabulary", "Word game", "Word family", "Word class"], Grammar: ["Grammar"] };
export const AREAS = ["Reading", "Listening", "Vocabulary", "Grammar", "Speed"];
export const SCORE_MAX = 1000, LAST = 30, MIN_ANSWERS = 3, TOP_WPM = 280;
const byDate = history => [...history].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

// Each area scores 0–1000 from the last 30 answers right first time. Reading is also scaled by reading level
// (Easier up to 700, Core 850, Harder 1000), so moving up a level raises the score. Speed counts the words a minute
// of Speed Read answers that were right. An area with fewer than 3 answers has no score yet.
export function areaScores(history, level = 1) {
  const answers = byDate(history).flatMap(h => h.answers || []);
  const areas = AREAS.map(name => {
    if (name === "Speed") {
      const r = answers.filter(a => a.skill === "Speed reading").slice(-12);
      if (r.length < MIN_ANSWERS) return { name, score: null, n: r.length };
      const avg = r.reduce((t, a) => t + (a.first_try ? a.wpm || 0 : 0), 0) / r.length;
      return { name, score: Math.min(SCORE_MAX, Math.round(SCORE_MAX * avg / TOP_WPM)), n: r.length, right: r.filter(a => a.first_try).length };
    }
    const r = answers.filter(a => AREA_SKILLS[name].includes(a.skill)).slice(-LAST);
    if (r.length < MIN_ANSWERS) return { name, score: null, n: r.length };
    const right = r.filter(a => a.first_try).length, f = name === "Reading" ? 0.7 + 0.15 * Math.min(Math.max(level ?? 1, 0), 2) : 1;
    return { name, score: Math.round(SCORE_MAX * f * right / r.length), n: r.length, right };
  });
  const got = areas.filter(a => a.score != null);
  return { overall: got.length ? Math.round(got.reduce((t, a) => t + a.score, 0) / got.length) : null, areas };
}

/* ---------------- today's workout ---------------- */
const dayNo = t => Math.floor((t + 7 * 3600e3) / 86400e3);        // school time zone (UTC+7)
const GAMES = ["rain", "train", "speed", "cross"];
// The plan is made from the history before today, so it does not change as activities are finished.
// 1) the baseline, or the word review if words are due; 2–3) the weakest areas with something to do in this unit; then a game.
export function workoutPlan(history, unit, { level = 1, baselineDone = true, now = new Date() } = {}) {
  const today = dayNo(now.getTime()), before = history.filter(h => dayNo(new Date(h.created_at).getTime()) < today);
  const doneIds = new Set(before.map(h => h.text_id));
  const items = [];
  if (!baselineDone) items.push({ kind: "baseline", id: "baseline", area: "Reading", label: "Baseline reading" });
  else { const due = wordsToReview(before, now).length; if (due) items.push({ kind: "review", id: "vocab-review", area: "Vocabulary", label: `Review ${Math.min(due, 10)} words` }); }
  const pick = {
    // A skill drill for the weakest reading skill on odd days, or every day once the unit's texts are all read;
    // otherwise the next unread text in the unit.
    Reading: () => { if (!baselineDone) return null; const ts = PRACTICE_TEXTS.filter(t => t.unitNo === unit);
      const unread = ts.find(x => !doneIds.has(x.id)), weak = weakSkills(before)[0];
      if (weak && (!unread || today % 2)) return { kind: "drill", id: drillId(weak.skill), skill: weak.skill, label: `Skill drill: ${weak.skill}` };
      if (!ts.length) return null;
      const t = unread || ts[today % ts.length]; return { kind: "text", id: t.id, label: `Read: ${t.topic}` }; },
    // The Listening Lab mission for the trap that catches the student most, if there is one; otherwise a unit task.
    Listening: () => { const wt = weakestTrap(before), lm = wt && missionForTrap(wt);
      if (lm) return { kind: "lab", id: lm.id, label: `Listening Lab: ${lm.title}` };
      const ts = listeningFor(unit); if (!ts.length) return null;
      const t = ts.find(x => !doneIds.has(x.id)) || ts[today % ts.length]; return { kind: "listen", id: t.id, label: `Listen: ${t.topic}` }; },
    Vocabulary: () => ({ kind: "vocab", id: `vocab-u${unit}`, label: `Practise 10 Unit ${unit} words` }),
    Grammar: () => { const gs = unitGrammar(unit); if (!gs.length) return null;
      const g = gs.map(x => ({ x, m: grammarMastery(x.id, before) })).sort((a, b) => (a.m ?? -1) - (b.m ?? -1))[0].x;
      return { kind: "grammar", id: `grammar-${g.id}`, point: g.id, label: `Grammar ${g.id}: ${g.title}` }; }
  };
  const sc = areaScores(before, level).areas.filter(a => a.name !== "Speed").sort((a, b) => (a.score ?? -1) - (b.score ?? -1));
  for (const a of sc) {
    if (items.length >= 2) break;
    if (items.some(i => i.area === a.name)) continue;
    const it = pick[a.name](); if (it) items.push({ ...it, area: a.name });
  }
  const gs = GAMES.filter(g => g !== "speed" || (baselineDone && speedTexts(unit).some(t => doneIds.has(t.id))));
  const g = gs[today % gs.length];
  items.push({ kind: "game", game: g, id: `${g}-u${unit}`, area: "Games", label: { rain: "Play Word Rain", train: "Play Word Train", speed: "Play Speed Read", cross: "Play Quick Crossword" }[g] });
  const doneToday = new Set(history.filter(h => dayNo(new Date(h.created_at).getTime()) === today).map(h => h.text_id));
  return items.slice(0, 3).map(i => ({ ...i, done: doneToday.has(i.id) }));
}
