// Vocabulary and grammar practice: building question sets and tracking mastery. Pure functions, no DOM.
import { VOCAB } from "./vocab.js";
import { extraWords, allExtraWords } from "./vocab-extra.js";
import { GRAMMAR, SEQUENCE, UNITS } from "./curriculum.js";
import { FAMILIES } from "./families.js";
import { wrongNote } from "./feedback.js";
import { PRACTICE_TEXTS } from "./content.js";
import { LISTENING } from "./listening.js";
import { shuffle, steadyBand } from "./engine.js";

export const XP_SMALL = { first: 5, hint: 2, reveal: 0, finish: 10, tier: 2 };

/* ---------------- vocabulary and grammar tiers ---------------- */
// The syllabus words and grammar points are the same for everyone; the tasks get harder for stronger readers.
// 0 Core (reading A2 to B1+, the floor), 1 Stretch (B2 to B2+), 2 Challenge (C1 to C1+).
// Inside a set: 3 right first time in a row moves the next questions up a tier, 2 missed in a row moves them down,
// never below Core.
export const TIERS = ["Core", "Stretch", "Challenge"];
export const TIER_UP = 3, TIER_DOWN = 2;
export function tierFor(history) { const b = steadyBand(history); return b == null ? 0 : b >= 6 ? 2 : b >= 4 ? 1 : 0; }

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
const byDate = history => [...history].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

// Latest result per word entry, keyed "unit:word" because a few words (encourage, consume) appear in two units.
// true = right first time on the latest try.
export const wordKey = x => `${x.unit}:${x.w}`;
export function wordState(history) {
  const st = {};
  byDate(history).forEach(h =>
    (h.answers || []).forEach(a => { if (a.skill === "Vocabulary" && a.word) st[`${a.unit}:${a.word}`] = a.first_try; }));
  return st;
}

// Spaced review. A word right first time moves up one box; a wrong answer sends it back to box 0.
// It comes back REVIEW_DAYS[box] school days after it was last practised (box 0: straight away).
export const REVIEW_DAYS = [0, 1, 3, 7, 14];
const dayNo = t => Math.floor((t + 7 * 3600e3) / 86400e3);        // days in the school time zone (UTC+7)
export function wordSchedule(history) {
  const sc = {};
  byDate(history).forEach(h => (h.answers || []).forEach(a => {
    // A word missed in a game (Word Rain) also comes back for review; a word caught in a game does not move it up.
    if (!a.word || !(a.skill === "Vocabulary" || (a.skill === "Word game" && !a.first_try))) return;
    const k = `${a.unit}:${a.word}`, prev = sc[k] ? sc[k].box : 0;
    sc[k] = { box: a.first_try ? Math.min(prev + 1, REVIEW_DAYS.length - 1) : 0, last: new Date(h.created_at).getTime() };
  }));
  return sc;
}
// Words due today: missed words first, then the ones waiting longest.
export function wordsToReview(history, now = new Date()) {
  const sc = wordSchedule(history), today = dayNo(now.getTime());
  const due = [...allWords(), ...allExtraWords()].filter(x => { const s = sc[wordKey(x)]; return s && dayNo(s.last) + REVIEW_DAYS[s.box] <= today; });
  return due.sort((a, b) => sc[wordKey(a)].box - sc[wordKey(b)].box || sc[wordKey(a)].last - sc[wordKey(b)].last);
}

// Word cards: the latest self-rating per word (true = "I know it", false = "Not sure yet").
export function cardState(history) {
  const st = {};
  byDate(history).forEach(h => (h.answers || []).forEach(a => { if (a.skill === "Word card" && a.word) st[`${a.unit}:${a.word}`] = a.known; }));
  return st;
}
// Cards to show: words never rated, then "not sure" words, then words not learned yet.
export function cardSet(unit, history = [], n = 10, rnd = Math.random) {
  const cs = cardState(history), st = wordState(history), ws = unitWords(unit);
  const rank = x => { const k = wordKey(x); return cs[k] === undefined ? 0 : cs[k] === false ? 1 : st[k] !== true ? 2 : 3; };
  return shuffle(ws.length, rnd).map(i => ws[i]).sort((a, b) => rank(a) - rank(b)).slice(0, n);
}

// Finds a word or phrase with common endings (consume → consumes, consumed, consuming; theme park → theme parks).
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function wordPattern(w) {
  const parts = w.split(/[\s-]+/).map(reEsc), head = parts[0];
  let h;
  if (parts.length > 1) h = head + "(?:s|es|ed|d|ing)?";
  else if (/e$/i.test(head)) h = head.slice(0, -1) + "(?:e|es|ed|ing|er|ers)";
  else if (/[^aeiou]y$/i.test(head)) h = head.slice(0, -1) + "(?:y|ies|ied|ying)";
  else h = head + "(?:s|es|ed|ing|er|ers)?";
  const rest = parts.slice(1).join("[\\s-]+");
  return new RegExp(`\\b${h}${rest ? "[\\s-]+" + rest + "(?:s|es)?" : ""}\\b`, "i");
}
// A sentence from one of the unit's reading texts that uses the word (Core text first), or null.
export function textExample(word) {
  const re = wordPattern(word.w);
  for (const t of PRACTICE_TEXTS.filter(x => x.unitNo === word.unit)) for (const lv of [1, 0, 2]) for (const p of t.levels[lv].paras) {
    const s = (p[1].match(/[^.!?]+[.!?]+["”’']?/g) || [p[1]]).find(x => re.test(x));
    if (s) return { sentence: s.trim(), topic: t.topic };
  }
  return null;
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
const contextPool = w => allWords().filter(x => x.unit !== w.unit || x.w === w.w);
// Type the word: the sentence with a gap, the meaning and the first letter.
// letters: "full" shows every letter as a blank, "first" only the first letter, "none" no letter clue at all.
function typeQuestion(word, letters = "full") {
  return { kind: "vocab", type: "type", word: word.w, unit: word.unit, stem: word.ex, clue: word.def, answer: word.w, opts: [word.w], letters,
    hint: `It starts with "${word.w.slice(0, Math.ceil(word.w.length / 2))}".`, explain: word.ex.replace("___", word.w) };
}
// Paraphrase: the meaning sits in the sentence; choose the word that could replace it. Distractors from the same unit.
function paraphraseQuestion(word, rnd) {
  const d = pickDistractors(unitWords(word.unit), word, "w", 3, rnd);
  return { kind: "vocab", type: "paraphrase", word: word.w, unit: word.unit,
    stem: `Which word could replace the words in brackets? ${word.ex.replace("___", `[${word.def}]`)}`, opts: [word.w, ...d.map(x => x.w)],
    hint: "Try each word in the sentence. Which one has exactly this meaning?", explain: word.ex.replace("___", word.w) };
}
// The question for one word at a tier, given how well the word is known (its review box).
function tierQuestion(w, b, tier, i, rnd) {
  if (tier === 0) return b >= 2 ? typeQuestion(w) : b === 1 || i % 2 ? vocabQuestion(w, contextPool(w), "context", rnd) : vocabQuestion(w, unitWords(w.unit), "meaning", rnd);
  if (tier === 1) return b >= 2 ? typeQuestion(w, "first") : b === 1 ? paraphraseQuestion(w, rnd) : vocabQuestion(w, unitWords(w.unit), "context", rnd);
  return b >= 2 ? typeQuestion(w, "none") : b === 1 ? typeQuestion(w, "first") : paraphraseQuestion(w, rnd);
}
const norm = s => String(s).toLowerCase().replace(/[-‐–—_]/g, " ").replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
export function markTyped(q, text) { return norm(text) === norm(q.answer); }
// The letters as blanks, keeping the first letter and the spaces: "l___ __ __".
export function letterBlanks(w) { return w[0] + w.slice(1).replace(/[a-z]/gi, "_"); }
// Match four words to their meanings. One question; each word is saved as its own answer.
function matchQuestion(words, rnd) {
  return { kind: "match", stem: "Match each word to its meaning.", words: words.map(x => ({ w: x.w, def: x.def, unit: x.unit })), order: shuffle(words.length, rnd) };
}

// A set of up to n words. Words missed last time come first, then "not sure" cards, then new words.
// The question type follows how well the word is known: a new or missed word is matched or chosen from meanings,
// a word right once fills a gap from a word bank, and a word right twice in a row is typed.
export function vocabSet({ unit = null, review = false, history = [], n = 10, rnd = Math.random, now = new Date(), tier = 0 } = {}) {
  const st = wordState(history), sc = wordSchedule(history), cs = cardState(history);
  const words = review ? wordsToReview(history, now) : unit ? unitWords(unit) : allWords();
  let order = review ? words.slice() : shuffle(words.length, rnd).map(i => words[i]);
  if (!review) {
    const rank = x => { const k = wordKey(x); return st[k] === false ? 0 : st[k] === undefined && cs[k] === false ? 1 : st[k] === undefined ? 2 : 3; };
    order.sort((a, b) => rank(a) - rank(b));
  }
  order = order.slice(0, n);
  // Stronger readers also meet the unit's extra words: 3 Stretch words, or 4 Stretch and Challenge words.
  if (unit && !review && tier > 0) {
    const ex = extraWords(unit, tier), rank = x => { const k = wordKey(x); return st[k] === false ? 0 : st[k] === undefined ? 1 : 2; };
    const pick = shuffle(ex.length, rnd).map(i => ex[i]).sort((a, b) => rank(a) - rank(b)).slice(0, tier === 1 ? 3 : 4);
    order = [...order.slice(0, n - pick.length), ...pick];
    order = shuffle(order.length, rnd).map(i => order[i]);
  }
  const box = x => (sc[wordKey(x)] || { box: 0 }).box;
  const qs = [], alts = [];
  let rest = order;
  const low = order.filter(x => box(x) === 0).slice(0, 4);
  if (tier === 0 && order.length >= 6 && low.length === 4) { qs.push(matchQuestion(low, rnd)); alts.push(null); rest = order.filter(x => !low.includes(x)); }
  rest.forEach((w, i) => {
    const v = TIERS.map((_, t) => ({ ...tierQuestion(w, box(w), t, i, rnd), tier: t, ...(w.extra ? { extra: w.tier } : {}) }));
    qs.push(v[tier]); alts.push(v);
  });
  return withTiers(qs, alts, tier);
}
// A set remembers every question at every tier, so it can move up or down as the student answers.
function withTiers(qs, alts, tier) { qs.alts = alts; qs.tier = tier; return qs; }
export function vocabMastery(unit, history) {
  const st = wordState(history), ws = unitWords(unit);
  return { mastered: ws.filter(x => st[wordKey(x)] === true).length, total: ws.length };
}

/* ---------------- word families ---------------- */
function familyQuestion(unit, i) {
  const [stem, a, b, c, d, family] = FAMILIES[unit][i];
  return { kind: "family", unit, item: i, stem, opts: [a, b, c, d], family,
    hint: `The family: ${family}. Does the gap need a noun, a verb, an adjective or an adverb?`, explain: stem.replace("___", a) };
}
export function familySet(unit, rnd = Math.random) {
  const n = (FAMILIES[unit] || []).length;
  return shuffle(n, rnd).map(i => familyQuestion(unit, i));
}

/* ---------------- grammar ---------------- */
export function unitGrammar(unit) { return GRAMMAR.filter(g => g.unit === unit); }
export function grammarPoint(id) { return GRAMMAR.find(g => g.id === id); }
const oneGap = it => !!it[0] && it[0].split("___").length === 2;
export const canTap = it => oneGap(it);
export const canTiles = it => oneGap(it) && it[1].trim().split(/\s+/).length >= 2;
// The sentence with an option in the gap(s), as pieces: [{ t, hi }] where hi marks the filled words.
export function fillParts(stem, opt) {
  const gaps = stem.split("___"), fills = gaps.length > 2 ? opt.split(" / ") : [opt], out = [];
  gaps.forEach((s, k) => { if (s) out.push({ t: s }); if (k < gaps.length - 1) out.push({ t: fills[k] || opt, hi: true }); });
  return out;
}
const words = s => s.trim() ? s.trim().split(/\s+/) : [];
// variant "choose": pick the right option. "tap": tap the mistake in a sentence. "tiles": put the words of the answer in order.
function grammarQuestion(g, i, variant = "choose", rnd = Math.random) {
  const item = g.items[i], [stem, ...opts] = item;
  const base = { kind: "grammar", variant: "choose", point: g.id, code: g.code, unit: g.unit, item: i,
    stem: stem || "Which sentence is correct?", opts, hint: g.rule, explain: g.rule, notes: [null, 1, 2, 3].map(k => k && wrongNote(g.id, i, k)) };
  if (variant === "tiles" && !canTiles(item)) variant = "tap";
  if (variant === "tap" && canTap(item)) {
    const wrong = 1 + Math.floor(rnd() * 3), [a, b] = stem.split("___");
    const glue = (b.match(/^[^\s]+/) || [""])[0];                       // punctuation straight after the gap stays with it
    const chunks = [...words(a).map(t => ({ t })), { t: opts[wrong] + glue, bad: true }, ...words(b.slice(glue.length)).map(t => ({ t }))];
    return { ...base, variant: "tap", stem: "Tap the mistake in this sentence.", chunks, wrong, fixed: opts[0], note: base.notes[wrong],
      hint: `One part of this sentence is wrong. ${g.rule}`, explain: stem.replace("___", opts[0]) };
  }
  if (variant === "tiles" || (variant === "tap" && canTiles(item))) {
    const answer = words(opts[0]), lower = answer.map(x => x.toLowerCase());
    const extra = opts.slice(1).flatMap(words).find(x => !lower.includes(x.toLowerCase()) && /^[a-z']+$/i.test(x));
    const tiles = extra ? [...answer, extra] : answer.slice();
    let ord = shuffle(tiles.length, rnd);
    if (ord.every((x, k) => x === k)) ord = ord.reverse();
    return { ...base, variant: "tiles", tiles: ord.map(k => tiles[k]), answer,
      hint: `Look at the words around the gap. ${g.rule}`, explain: stem.replace("___", opts[0]) };
  }
  if ((variant === "type" || variant === "fix") && oneGap(item) && opts[0].length <= 30) {
    const wrong = 1 + Math.floor(rnd() * 3), fix = variant === "fix";
    return { ...base, variant, type: "type", answer: opts[0], letters: fix ? "none" : "first",
      clueLabel: fix ? "Correct this" : null, clue: fix ? `Someone wrote "${opts[wrong]}" in the gap. What should it be?` : null,
      hint: g.rule, explain: stem.replace("___", opts[0]) };
  }
  if (variant === "type" || variant === "fix") return grammarQuestion(g, i, "tap", rnd);
  return base;
}
// Core mixes choose, tap and tiles; Stretch adds typing the form; Challenge corrects a wrong form by typing.
const VARIANTS = [["choose", "tap", "tiles"], ["tap", "type", "tiles"], ["fix", "type", "tap"]];
const mix = (pairs, rnd, tier) => {
  const alts = pairs.map(([g, i], k) => VARIANTS.map((vs, t) => ({ ...grammarQuestion(g, i, vs[k % 3], rnd), tier: t })));
  return withTiers(alts.map(v => v[tier]), alts, tier);
};
// One point: all its items. A whole unit: two items from each point.
export function grammarSet({ point = null, unit = null, rnd = Math.random, tier = 0 } = {}) {
  if (point) { const g = grammarPoint(point); return mix(shuffle(g.items.length, rnd).map(i => [g, i]), rnd, tier); }
  const pairs = unitGrammar(unit).flatMap(g => shuffle(g.items.length, rnd).slice(0, 2).map(i => [g, i]));
  return mix(shuffle(pairs.length, rnd).map(i => pairs[i]), rnd, tier);
}
// Before practising one point: three examples with the form highlighted, then "which rule explains them?"
// The options are the first sentence of this point's rule and of two other points in the same unit.
const firstSentence = r => (r.match(/^.*?[.!?](?=\s|$)/) || [r])[0];
export function noticeTask(pointId, rnd = Math.random) {
  const g = grammarPoint(pointId), withStem = g.items.filter(it => it[0]);
  const examples = shuffle(withStem.length, rnd).slice(0, 3).map(k => fillParts(withStem[k][0], withStem[k][1]));
  const others = unitGrammar(g.unit).filter(x => x.id !== g.id && firstSentence(x.rule) !== firstSentence(g.rule));
  const pick = shuffle(others.length, rnd).slice(0, 2).map(k => firstSentence(others[k].rule));
  return { point: g.id, examples, opts: [firstSentence(g.rule), ...pick], rule: g.rule };
}
// Right first time over the last 6 answers for a grammar point (null if never tried).
export function grammarMastery(id, history) {
  const r = [];
  byDate(history).forEach(h =>
    (h.answers || []).forEach(a => { if (a.skill === "Grammar" && a.point === id) r.push(a.first_try ? 1 : 0); }));
  const last = r.slice(-6);
  return last.length ? Math.round(100 * last.reduce((x, y) => x + y, 0) / last.length) : null;
}

/* ---------------- unit missions ---------------- */
export const BOSS_PASS = 0.7;
export const BOSS_BONUS = 50;
export const MISSION_BADGES = { 1: "Voice of reason", 2: "Well-being hero", 3: "Responsible traveller", 4: "Science explorer",
  5: "Tech innovator", 6: "Rule master", 7: "True competitor", 8: "Planet protector", 9: "High achiever" };
// The final challenge: 5 words (3 typed), 2 word families and 5 grammar questions from the unit.
export function bossSet(unit, rnd = Math.random) {
  const ws = unitWords(unit), pick = shuffle(ws.length, rnd).slice(0, 5).map(i => ws[i]);
  const vq = pick.map((w, i) => i < 3 ? typeQuestion(w) : vocabQuestion(w, contextPool(w), "context", rnd));
  const gs = unitGrammar(unit), pairs = gs.map(g => [g, Math.floor(rnd() * g.items.length)]);
  while (pairs.length < 5) { const g = gs[Math.floor(rnd() * gs.length)], i = Math.floor(rnd() * g.items.length); if (!pairs.some(p => p[0] === g && p[1] === i)) pairs.push([g, i]); }
  const all = [...vq, ...familySet(unit, rnd).slice(0, 2), ...mix(pairs.slice(0, 5), rnd, 0)];
  return shuffle(all.length, rnd).map(i => all[i]);
}
const passed = (h, unit) => h.text_id === `boss-u${unit}` && h.max_score > 0 && h.score / h.max_score >= BOSS_PASS;
export function missionBadges(history) {
  return Object.keys(MISSION_BADGES).map(Number).filter(u => history.some(h => passed(h, u)))
    .map(u => ({ name: MISSION_BADGES[u], why: `Completed the Unit ${u} mission`, unit: u }));
}
// The steps of a unit's mission, read from the history. The final challenge opens when the other steps are done.
export function mission(unit, history) {
  const ids = new Set(history.map(h => h.text_id));
  const texts = PRACTICE_TEXTS.filter(t => t.unitNo === unit), vm = vocabMastery(unit, history);
  const gp = unitGrammar(unit), tried = gp.filter(g => grammarMastery(g.id, history) != null).length;
  const steps = [{ key: "cards", label: "Meet the words", detail: "Look at the word cards and listen to them.", done: ids.has(`cards-u${unit}`) }];
  if (texts.length) steps.push({ key: "read", label: "Read a text", detail: `${texts.length} texts for this unit`, done: history.some(h => h.mode === "practice" && texts.some(t => t.id === h.text_id)) });
  const lm = listeningMastery(unit, history);
  if (lm.total) steps.push({ key: "listen", label: "Do a listening task", detail: `${lm.done} of ${lm.total} done`, done: lm.done > 0 });
  steps.push({ key: "vocab", label: "Learn half the words", detail: `${vm.mastered} of ${vm.total} learned`, done: vm.mastered * 2 >= vm.total });
  steps.push({ key: "family", label: "Word families", detail: "Choose the right form of the word.", done: ids.has(`family-u${unit}`) });
  steps.push({ key: "grammar", label: "Try every grammar point", detail: `${tried} of ${gp.length} tried`, done: tried === gp.length });
  const ready = steps.every(s => s.done), tries = history.filter(h => h.text_id === `boss-u${unit}` && h.max_score > 0);
  const best = tries.length ? Math.max(...tries.map(h => h.score / h.max_score)) : null, won = best != null && best >= BOSS_PASS;
  steps.push({ key: "boss", label: "Final challenge", locked: !ready && !won, done: won,
    detail: won ? `Passed with ${Math.round(best * 100)}%` : !ready ? "Opens when the other steps are done." : best != null ? `Best so far ${Math.round(best * 100)}%. You need ${BOSS_PASS * 100}%.` : `Score ${BOSS_PASS * 100}% or more to win the badge.` });
  return { unit, steps, badge: MISSION_BADGES[unit], complete: won, next: steps.find(s => !s.done && !s.locked) || null };
}

/* ---------------- a run through a set ---------------- */
export function newSet(questions) {
  const set = { qs: questions.slice(), i: 0, stage: 0, results: [] };
  if (questions.alts) Object.assign(set, { alts: questions.alts, tier: questions.tier, row: 0, miss: 0, moved: null });
  return set;
}
// After each answer in a tiered set: move the tier for the questions still to come.
function moveTier(set, firstTry) {
  if (!set.alts) return;
  if (firstTry) { set.row++; set.miss = 0; } else { set.miss++; set.row = 0; }
  const was = set.tier;
  if (set.row >= TIER_UP && set.tier < TIERS.length - 1) set.tier++;
  else if (set.miss >= TIER_DOWN && set.tier > 0) set.tier--;
  if (set.tier !== was) { set.row = 0; set.miss = 0; set.moved = { at: set.i + 1, up: set.tier > was, tier: set.tier }; }
}
function answerOf(q) {
  if (q.kind === "vocab") return { skill: "Vocabulary", word: q.word, unit: q.unit };
  if (q.kind === "family") return { skill: "Word family", word: q.opts[0], unit: q.unit };
  return { skill: "Grammar", point: q.point, code: q.code, unit: q.unit, variant: q.variant };
}
// Returns "correct" | "hint" | "reveal".
export function submitSmall(set, correct) {
  const q = set.qs[set.i];
  const rec = support => { set.results[set.i] = { ...answerOf(q), first_try: support === "none", support, ...(q.tier ? { tier: q.tier } : {}) }; moveTier(set, support === "none"); };
  if (correct) { rec(set.stage === 0 ? "none" : "hint"); return "correct"; }
  if (set.stage === 0) { set.stage = 1; return "hint"; }
  rec("explained"); return "reveal";
}
// Matching: `right` says which pairs are right. Each word is scored on its own; the question as a whole too.
export function submitMatch(set, right) {
  const q = set.qs[set.i];
  if (set.stage === 0) set.first = right.slice();
  const all = right.every(Boolean);
  if (!all && set.stage === 0) { set.stage = 1; return "hint"; }
  const group = q.words.map((w, k) => ({ skill: "Vocabulary", word: w.w, unit: w.unit, first_try: set.first[k],
    support: set.first[k] ? "none" : right[k] ? "hint" : "explained" }));
  const worst = ["explained", "hint", "none"].find(s => group.some(g => g.support === s));
  set.results[set.i] = { skill: "Vocabulary", kind: "match", first_try: group.every(g => g.first_try), support: worst, group };
  delete set.first;
  return all ? "correct" : "reveal";
}
export function nextSmall(set) {
  set.i++; set.stage = 0;
  if (set.alts && set.alts[set.i]) set.qs[set.i] = set.alts[set.i][set.tier];
  return set.i >= set.qs.length ? "done" : "next";
}
// Results with each matched word as its own answer: what is saved and scored.
export const flatResults = results => results.flatMap(r => r.group || [r]);
export function smallXP(results) {
  return flatResults(results).reduce((t, r) => t + (r.support === "none" ? XP_SMALL.first + XP_SMALL.tier * (r.tier || 0)
    : r.support === "hint" ? XP_SMALL.hint + (r.tier || 0) : 0), 0) + XP_SMALL.finish;
}

/* ---------------- listening ---------------- */
export const XP_LISTEN = { first: 10, hint: 4, finish: 10 };
const gapNorm = s => String(s).toLowerCase().replace(/:/g, ".").replace(/[^a-z0-9. -]/g, "").replace(/\s+/g, " ").replace(/\.$/, "").trim();
function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
// A gap answer: "ok", "spelling" (one letter out in a word of 6+ letters: accepted, with a spelling note) or false.
export function markGap(q, text) {
  const v = gapNorm(text);
  if (!v) return false;
  if (q.answers.some(a => gapNorm(a) === v)) return "ok";
  return q.answers.some(a => /[a-z]{6,}/.test(a) && editDistance(v, gapNorm(a)) <= 1) ? "spelling" : false;
}
// resp: the typed text (gap), the statement index (matching) or the option index (MCQ, 0 = correct).
export function listenCorrect(q, resp) {
  if (resp == null || resp === "") return false;
  if (q.type === "gap") return !!markGap(q, resp);
  return q.answer != null ? resp === q.answer : resp === 0;
}
// The lines replayed as support for a question: from the line with q.cue to the line with q.cueEnd.
export function cueLines(task, q) {
  const find = s => task.lines.findIndex(l => l[1].includes(s));
  const a = find(q.cue), b = q.cueEnd ? find(q.cueEnd) : a;
  return [a, Math.max(a, b)];
}
export function listenXP(results) {
  return results.reduce((t, r) => t + (r.support === "none" ? XP_LISTEN.first : r.support === "hint" ? XP_LISTEN.hint : 0), 0) + XP_LISTEN.finish;
}
export function listeningMastery(unit, history) {
  const ids = new Set(LISTENING.filter(t => t.unitNo === unit).map(t => t.id));
  return { done: new Set(history.filter(h => h.mode === "listening" && ids.has(h.text_id)).map(h => h.text_id)).size, total: ids.size };
}
