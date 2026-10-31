// Grammar engine: one map of building blocks for Stages 7, 8 and 9 (Cambridge 0876 is a spiral syllabus).
// A block's stage only says where it is first taught (David's pacing sheet: S7 = Grade 6, S8 = Grade 7, S9 = Grade 8).
// It is never a floor or a ceiling: every student moves through the map by their own mastery, strand by strand.
//   STRANDS: the blocks of each strand, in teaching order.
//   GBLOCKS: name, stage, units (first taught, taught again), pre (blocks it builds on). Lessons and questions for the
//            8 blocks the Grammar Lab already has come from glab.js BLOCKS; the rest live here.
//   mastery(history): each block's p (0 to 1) from every grammar answer, oldest first. Right first time raises p, a miss
//            lowers it, and a miss that points at a block underneath (b) lowers that block too. Mastered = p >= MASTERED.
//   nextBlock / dueReviews: the chooser. The lowest block in the strand whose blocks underneath are mastered and which is
//            not mastered itself; reviews come back 1, 7 and 30 days after a block is mastered.
// Answers save as { skill: "Grammar", eng: 1, block, item, first_try, support, b? }. Don't rename block ids.
import { BLOCKS as LAB_BLOCKS } from "./glab.js";

export const MASTERED = 0.85;
export const START_P = 0.3;
export const REVIEW_DAYS = [1, 7, 30];
// Grammar Builder XP: right first time, right after a hint or second try, a newly built brick, each placement question
// right, and finishing. Combos add their size (3, 5, 8) on top.
export const XP_GB = { right: 3, second: 1, brick: 15, place: 2, finish: 10 };

const B = (name, stage, first, again, pre) => ({ name, stage, first, again, pre });
export const GBLOCKS = {
  v123: B("Verb forms: V1, V2, V3", 7, ["S7 Remember"], ["S7 1.2"], []),
  "ed-spell": B("-ed spelling", 7, ["S7 1.2"], [], ["v123"]),
  v2: B("Irregular past simple (V2)", 7, ["S7 Remember", "S7 1.2"], [], ["v123"]),
  pp: B("Past participles (V3)", 7, ["S7 Remember"], ["S8 7.4", "S9 1.4"], ["v123"]),
  "sing-plural": B("One or more than one?", 7, ["S7 Remember"], ["S9 3.3"], []),
  "was-were": B("was or were?", 7, ["S7 Remember"], [], ["sing-plural"]),
  "past-simple": B("Past simple", 7, ["S7 Remember", "S7 1.2"], [], ["ed-spell", "v2"]),
  "past-cont": B("Past continuous: was / were + -ing", 7, ["S7 Remember", "S7 8.6"], ["S8 7.1", "S9 6.6"], ["was-were"]),
  "ps-pc": B("Past simple or past continuous?", 7, ["S7 8.6"], ["S8 7.1", "S9 6.6"], ["past-simple", "past-cont"]),
  doer: B("Find the doer", 7, ["S7 Remember"], [], []),
  "active-passive": B("Doing it or receiving it? (passive)", 7, ["S7 Remember"], ["S9 1.4"], ["doer"]),
  "pres-passive": B("Present simple passive", 7, ["S7 Remember"], ["S8 4.2", "S9 1.4", "S9 4.2"], ["pp", "was-were", "active-passive"]),
  "past-passive": B("Past simple passive", 7, ["S7 Remember", "S7 4.2"], ["S8 4.2"], ["pp", "was-were", "past-simple", "active-passive"]),
  "modal-passive": B("Passive with modals (can be done)", 7, ["S7 3.5"], [], ["pres-passive"]),
  "by-agent": B("by + the doer", 7, ["S7 4.2"], ["S8 4.2", "S9 1.4"], ["pres-passive", "past-passive"]),
  "passive-negq": B("Passive negatives and questions", 7, ["S7 4.2"], ["S8 4.2"], ["past-passive"]),
  progress: B("Still happening or finished?", 7, ["S7 8.6"], ["S8 3.6", "S9 3.3"], ["past-cont"]),
  "pres-cont-passive": B("Present continuous passive", 8, ["S8 3.6"], ["S9 1.6"], ["pres-passive", "progress"]),
  "past-perfect": B("Past perfect simple", 8, ["S8 7.4", "S8 7.6"], ["S9 7.1", "S9 7.4"], ["pp", "past-simple"]),
  "future-passive": B("Future passive", 8, ["S8 5.2"], ["S9 5.2"], ["pres-passive"]),
  "past-cont-passive": B("Past continuous passive", 9, ["S9 3.3"], [], ["past-cont", "past-passive", "progress"]),
  "pres-perf-passive": B("Present perfect passive", 9, ["S9 4.4"], [], ["pres-passive"]),
  "past-perf-passive": B("Past perfect passive", 9, ["S9 7.4"], [], ["past-passive", "past-perfect"]),
  causative: B("Causative: have / get something done", 9, ["S9 5.4"], [], ["pp", "active-passive"]),
  "passive-inf": B("Passive + infinitive (be allowed to)", 9, ["S9 6.1"], [], ["pres-passive"]),
  "choose-tense": B("Choose the passive", 9, ["S9 3.3"], ["S9 4.4", "S9 7.4"],
    ["past-cont-passive", "pres-perf-passive", "past-perf-passive", "future-passive", "pres-cont-passive"])
};
for (const [id, b] of Object.entries(GBLOCKS)) b.id = id;

export const STRANDS = [
  { id: "passive", name: "Past forms and the passive", blocks: Object.keys(GBLOCKS) }
];
export const strandOf = id => STRANDS.find(s => s.blocks.includes(id)) || null;
// The Grammar Lab's own blocks and lessons (glab.js) keep their ids, so their results count here too.
export const labBlock = id => LAB_BLOCKS[id] || null;

// Old answers that already tell us about a block: Grammar Lab block results, and Prove it / practice answers by point.
const POINT_BLOCK = { "1.4": "pres-passive", "4.2": "pres-passive", "1.6": "pres-cont-passive", "3.3": "past-cont-passive",
  "4.4": "pres-perf-passive", "5.2": "future-passive", "5.4": "causative", "6.1": "passive-inf", "6.6": "ps-pc", "7.4": "past-perf-passive", "7.1": "past-perfect" };
export const pointBlock = point => POINT_BLOCK[point] || null;

const UP = 0.35, HINT_UP = 0.1, DOWN = 0.55, BELOW_DOWN = 0.7, PRE_UP = 0.15;
const day = 864e5;
// One answer's evidence: [block, right first time?, hinted?, block underneath that the mistake points at].
function evidence(a) {
  if (a.skill === "Grammar" && a.eng && a.place && GBLOCKS[a.block]) return [[a.block, !!a.first_try, false, null, true]];
  if (a.skill === "Grammar Block" && GBLOCKS[a.block]) return [[a.block, !!a.passed, false, null]];
  if (a.skill === "Grammar Lab" && a.step === "block" && GBLOCKS[a.block]) return [[a.block, !!a.first_try, a.support === "hint", null]];
  if (a.skill === "Grammar" && a.eng && GBLOCKS[a.block]) return [[a.block, !!a.first_try, a.support === "hint", a.b || null]];
  if (a.skill === "Grammar" && !a.stage && pointBlock(a.point)) return [[pointBlock(a.point), !!a.first_try, a.support === "hint", null]];
  return [];
}
// Each block's state: { p, n (answers), seen (ms), at (ms when mastered), reviews (reviews passed since) }.
export function mastery(history) {
  const st = {}, get = id => st[id] || (st[id] = { p: START_P, n: 0, seen: 0, at: null, reviews: 0 });
  [...history].sort((a, b) => String(a.created_at || "").localeCompare(String(b.created_at || ""))).forEach(h => {
    const t = Date.parse(h.created_at || "") || 0;
    (h.answers || []).forEach(a => evidence(a).forEach(([id, right, hinted, below, place]) => {
      // A placement answer: right = this block and everything it builds on count as mastered (first check after a
      // week, not the next day); wrong = this block and everything built on it start low.
      if (place) {
        (right ? underneath(id) : above(id)).forEach(q => { const u = get(q);
          if (right && u.p < MASTERED) { u.p = MASTERED; u.at = t; u.reviews = 1; } else if (!right) { u.p = Math.min(u.p, START_P); u.at = null; }
          u.seen = Math.max(u.seen, t); });
        get(id).n++; return;
      }
      const s = get(id), was = s.p >= MASTERED;
      if (right && !hinted) { s.p += (1 - s.p) * UP; GBLOCKS[id].pre.forEach(q => { const u = get(q); u.p += (1 - u.p) * PRE_UP; }); }
      else if (right) s.p += (1 - s.p) * HINT_UP;
      else { s.p *= DOWN; if (below && GBLOCKS[below]) get(below).p *= BELOW_DOWN; }
      s.n++; s.seen = t;
      if (!was && s.p >= MASTERED) { s.at = t; s.reviews = 0; }
      else if (was && s.p >= MASTERED && right && t - s.at >= reviewGap(s) * day) s.reviews++;
      else if (s.p < MASTERED) s.at = null;
    }));
  });
  return st;
}
const reviewGap = s => REVIEW_DAYS[Math.min(s.reviews, REVIEW_DAYS.length - 1)];
export const pOf = (st, id) => (st[id] ? st[id].p : START_P);
export const isMastered = (st, id) => pOf(st, id) >= MASTERED;
// Ready = every block underneath is mastered, and this one isn't.
export const isReady = (st, id) => !isMastered(st, id) && GBLOCKS[id].pre.every(q => isMastered(st, q));

// The next block to learn in a strand. With a focus unit (e.g. "S9 3.3"), prefer the block taught there, or the
// lowest unmastered block it builds on. Never limited by the student's class stage.
export function nextBlock(st, strandId = "passive", focus = null) {
  const order = (STRANDS.find(s => s.id === strandId) || STRANDS[0]).blocks;
  if (focus) {
    const target = order.find(id => [...GBLOCKS[id].first, ...GBLOCKS[id].again].includes(focus) && !isMastered(st, id));
    if (target) { const path = underneath(target).filter(id => isReady(st, id)); if (path.length) return path[0]; }
  }
  return order.find(id => isReady(st, id)) || null;
}
// A block and everything it builds on, lowest first.
export function underneath(id, seen = new Set()) {
  if (seen.has(id)) return []; seen.add(id);
  return [...GBLOCKS[id].pre.flatMap(q => underneath(q, seen)), id];
}
// A block and every block built on it.
export function above(id) {
  return Object.keys(GBLOCKS).filter(q => q === id || underneath(q).includes(id));
}
// Layers for drawing the strand as a tower: foundations (no blocks underneath) are layer 0.
export function layers(strandId = "passive") {
  const order = (STRANDS.find(s => s.id === strandId) || STRANDS[0]).blocks, memo = {};
  const lv = id => memo[id] ?? (memo[id] = GBLOCKS[id].pre.length ? 1 + Math.max(...GBLOCKS[id].pre.map(lv)) : 0);
  const out = []; order.forEach(id => { (out[lv(id)] = out[lv(id)] || []).push(id); });
  return out;
}

// Placement check: about 8 questions. Each one asks about the unknown block that splits the rest most evenly: right
// marks it and everything underneath as known, wrong marks it and everything above as not yet.
export const PLACE_MAX = 8;
export function placeProbe(known, strandId = "passive") {
  const order = (STRANDS.find(s => s.id === strandId) || STRANDS[0]).blocks, open = order.filter(id => !(id in known));
  if (!open.length) return null;
  const score = id => { const dn = underneath(id).filter(q => open.includes(q)).length, up = above(id).filter(q => open.includes(q)).length; return Math.min(dn, up); };
  return open.reduce((best, id) => score(id) > score(best) ? id : best, open[0]);
}
export function placeMark(known, id, right) {
  (right ? underneath(id) : above(id)).forEach(q => { if (!(q in known)) known[q] = right; });
  return known;
}
export const placed = history => history.some(h => (h.answers || []).some(a => a.eng && a.place));

// Today's 5-minute build: up to 2 due reviews, the next block to learn (lesson + questions), and one mastered block
// mixed in so old blocks stay solid.
export function planSession(st, { strand = "passive", focus = null, now = Date.now() } = {}) {
  // Finish a brick already started before starting a new one.
  const order = (STRANDS.find(x => x.id === strand) || STRANDS[0]).blocks;
  const started = order.filter(id => isReady(st, id) && st[id] && st[id].n > 0).sort((a, b) => pOf(st, b) - pOf(st, a))[0];
  const reviews = dueReviews(st, now).slice(0, 2), learn = focus ? nextBlock(st, strand, focus) : started || nextBlock(st, strand);
  const done = Object.keys(GBLOCKS).filter(id => isMastered(st, id) && !reviews.includes(id) && id !== learn)
    .sort((a, b) => (st[a] ? st[a].seen : 0) - (st[b] ? st[b].seen : 0));
  return { reviews, learn, mix: done.slice(0, 1) };
}

// Mastered blocks whose next review is due, most overdue first.
export function dueReviews(st, now = Date.now()) {
  return Object.entries(st).filter(([id, s]) => GBLOCKS[id] && s.p >= MASTERED && s.at != null && s.reviews < REVIEW_DAYS.length
    && now - Math.max(s.at, s.seen) >= reviewGap(s) * day)
    .sort((a, b) => (a[1].seen - b[1].seen)).map(([id]) => id);
}
// The block to drop to when a block is going badly: the block underneath that the recent mistakes point at most,
// or else the weakest block underneath that isn't mastered.
export function dropTo(st, id, tags = []) {
  const pre = GBLOCKS[id].pre, by = q => tags.filter(t => t === q).length;
  const tagged = pre.filter(q => by(q)).sort((a, b) => by(b) - by(a))[0];
  if (tagged) return tagged;
  return pre.filter(q => !isMastered(st, q)).sort((a, b) => pOf(st, a) - pOf(st, b))[0] || null;
}
// Progress through a strand: how many blocks are mastered, and the student's highest stage reached in it.
export function strandProgress(st, strandId = "passive") {
  const order = (STRANDS.find(s => s.id === strandId) || STRANDS[0]).blocks, done = order.filter(id => isMastered(st, id));
  return { done: done.length, total: order.length, stage: done.reduce((m, id) => Math.max(m, GBLOCKS[id].stage), 0) };
}
