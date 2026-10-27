// Vocabulary and grammar practice: building question sets and tracking mastery. Pure functions, no DOM.
import { VOCAB } from "./vocab.js";
import { GRAMMAR, SEQUENCE, UNITS } from "./curriculum.js";
import { shuffle } from "./engine.js";

export const XP_SMALL = { first: 5, hint: 2, reveal: 0, finish: 10 };

/* ---------------- school calendar ---------------- */
// The sequence entry running on a date (the last one that has started).
export function currentEntry(now = new Date()) {
  let cur = SEQUENCE[0];
  SEQUENCE.forEach(e => { if (new Date(e.start + "T00:00:00+07:00") <= now) cur = e; });
  return cur;
}
// The unit to show first: the one running now, or the next one after a writing block or exam week.
export function focusUnit(now = new Date()) {
  const cur = currentEntry(now);
  if (cur.kind === "unit") return cur.unit;
  const i = SEQUENCE.indexOf(cur), next = SEQUENCE.slice(i + 1).find(e => e.kind === "unit");
  return next ? next.unit : SEQUENCE.filter(e => e.kind === "unit").pop().unit;
}
export function unitStatus(unit, now = new Date()) {
  const e = SEQUENCE.find(x => x.kind === "unit" && x.unit === unit), i = SEQUENCE.indexOf(e);
  const next = SEQUENCE[i + 1];
  if (now < new Date(e.start + "T00:00:00+07:00")) return "upcoming";
  if (next && now >= new Date(next.start + "T00:00:00+07:00")) return "done";
  return "now";
}
export function unitTitle(u) { return `Unit ${u}: ${UNITS[u].title}`; }

/* ---------------- vocabulary ---------------- */
export function unitWords(unit) {
  return VOCAB[unit].flatMap((list, li) => list.map(([w, def, ex]) => ({ w, def, ex, unit, list: li + 1 })));
}
export function allWords() { return Object.keys(VOCAB).flatMap(u => unitWords(+u)); }

// Latest result per word: true = right first time on the latest try.
export function wordState(history) {
  const st = {};
  [...history].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach(h =>
    (h.answers || []).forEach(a => { if (a.skill === "Vocabulary" && a.word) st[a.word] = a.first_try; }));
  return st;
}
export function wordsToReview(history) {
  const st = wordState(history);
  return allWords().filter(x => st[x.w] === false);
}

function pickDistractors(pool, correct, key, n, rnd) {
  const others = pool.filter(x => x[key] !== correct[key]);
  return shuffle(others.length, rnd).slice(0, n).map(i => others[i]);
}
// One vocabulary question. type "meaning": word → definition. type "context": sentence → word.
function vocabQuestion(word, pool, type, rnd) {
  const d = pickDistractors(pool, word, "w", 3, rnd);
  if (type === "meaning") return { kind: "vocab", type, word: word.w, unit: word.unit,
    stem: `What does "${word.w}" mean?`, opts: [word.def, ...d.map(x => x.def)], hint: word.ex.replace("___", word.w), explain: `"${word.w}" means ${word.def}.` };
  return { kind: "vocab", type, word: word.w, unit: word.unit,
    stem: word.ex, opts: [word.w, ...d.map(x => x.w)], hint: `The missing word means: ${word.def}.`, explain: word.ex.replace("___", word.w) };
}
// A set of up to n questions. Words not yet mastered come first; each word appears once.
export function vocabSet({ unit = null, review = false, history = [], n = 10, rnd = Math.random } = {}) {
  const st = wordState(history);
  const pool = unit ? unitWords(unit) : allWords();
  let words = review ? wordsToReview(history) : pool;
  const order = shuffle(words.length, rnd).map(i => words[i]);
  order.sort((a, b) => (st[a.w] === true) - (st[b.w] === true));
  // Meaning questions take wrong definitions from the same unit. Gap-fill questions take wrong words from
  // other units, so near-synonyms from the same list (annoyed / angry) never compete for one gap.
  return order.slice(0, n).map((w, i) => i % 2
    ? vocabQuestion(w, allWords().filter(x => x.unit !== w.unit || x.w === w.w), "context", rnd)
    : vocabQuestion(w, unitWords(w.unit), "meaning", rnd));
}
export function vocabMastery(unit, history) {
  const st = wordState(history), ws = unitWords(unit);
  return { mastered: ws.filter(x => st[x.w] === true).length, total: ws.length };
}

/* ---------------- grammar ---------------- */
export function unitGrammar(unit) { return GRAMMAR.filter(g => g.unit === unit); }
export function grammarPoint(id) { return GRAMMAR.find(g => g.id === id); }
function grammarQuestion(g, item) {
  const [stem, ...opts] = item;
  return { kind: "grammar", point: g.id, code: g.code, unit: g.unit,
    stem: stem || "Which sentence is correct?", opts, hint: g.rule, explain: g.rule };
}
// One point: all its items. A whole unit: two items from each point.
export function grammarSet({ point = null, unit = null, rnd = Math.random } = {}) {
  if (point) { const g = grammarPoint(point); return shuffle(g.items.length, rnd).map(i => grammarQuestion(g, g.items[i])); }
  const qs = unitGrammar(unit).flatMap(g => shuffle(g.items.length, rnd).slice(0, 2).map(i => grammarQuestion(g, g.items[i])));
  return shuffle(qs.length, rnd).map(i => qs[i]);
}
// Right first time over the last 6 answers for a grammar point (null if never tried).
export function grammarMastery(id, history) {
  const r = [];
  [...history].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach(h =>
    (h.answers || []).forEach(a => { if (a.skill === "Grammar" && a.point === id) r.push(a.first_try ? 1 : 0); }));
  const last = r.slice(-6);
  return last.length ? Math.round(100 * last.reduce((x, y) => x + y, 0) / last.length) : null;
}

/* ---------------- a run through a set ---------------- */
export function newSet(questions) { return { qs: questions, i: 0, stage: 0, results: [] }; }
// Returns "correct" | "hint" | "reveal".
export function submitSmall(set, correct) {
  const q = set.qs[set.i];
  const rec = support => { set.results[set.i] = {
    skill: q.kind === "vocab" ? "Vocabulary" : "Grammar", first_try: support === "none", support,
    ...(q.kind === "vocab" ? { word: q.word, unit: q.unit } : { point: q.point, code: q.code, unit: q.unit }) }; };
  if (correct) { rec(set.stage === 0 ? "none" : "hint"); return "correct"; }
  if (set.stage === 0) { set.stage = 1; return "hint"; }
  rec("explained"); return "reveal";
}
export function nextSmall(set) { set.i++; set.stage = 0; return set.i >= set.qs.length ? "done" : "next"; }
export function smallXP(results) {
  return results.reduce((t, r) => t + (r.support === "none" ? XP_SMALL.first : r.support === "hint" ? XP_SMALL.hint : 0), 0) + XP_SMALL.finish;
}
