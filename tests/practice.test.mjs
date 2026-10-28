import test from "node:test";
import assert from "node:assert/strict";
import * as P from "../js/practice.js";
import { VOCAB } from "../js/vocab.js";
import { GRAMMAR, OBJECTIVES, SEQUENCE, UNITS } from "../js/curriculum.js";
import { FAMILIES } from "../js/families.js";
import { wrongNote } from "../js/feedback.js";
import { LISTENING } from "../js/listening.js";
import { TIMES } from "../js/listening-times.js";

test("every unit in the sequence has words and grammar", () => {
  SEQUENCE.filter(e => e.kind === "unit").forEach(e => {
    assert.ok(UNITS[e.unit] && VOCAB[e.unit], `unit ${e.unit}`);
    assert.ok(P.unitGrammar(e.unit).length >= 4, `grammar for unit ${e.unit}`);
  });
});

test("vocabulary entries have a definition and one gap", () => {
  P.allWords().forEach(x => {
    assert.ok(x.def.length > 3, x.w);
    assert.equal(x.ex.split("___").length, 2, `one gap in the example for ${x.w}`);
  });
  const words = P.allWords().map(x => x.w.toLowerCase() + x.unit);
  assert.equal(new Set(words).size, words.length, "no duplicate words within a unit");
});

test("grammar items have four different options and valid codes", () => {
  GRAMMAR.forEach(g => {
    assert.ok(g.code === null || OBJECTIVES[g.code], `code for ${g.id}`);
    assert.equal(g.items.length, 6, `${g.id} has 6 items`);
    g.items.forEach(it => {
      assert.equal(it.length, 5);
      assert.equal(new Set(it.slice(1)).size, 4, `unique options in ${g.id}: ${it[0]}`);
      // Two gaps are allowed when every option fills both ("have / discovered").
      if (it[0]) assert.equal(it[0].split("___").length - 1, it[1].includes(" / ") ? 2 : 1, `gaps in ${g.id}: ${it[0]}`);
    });
  });
});

test("vocabulary sets: unique options, unmastered words first, review of missed words", () => {
  const set = P.vocabSet({ unit: 2 });
  assert.equal(set[0].kind, "match", "a new set starts with matching");
  assert.equal(P.flatResults(set.map(q => q.kind === "match" ? { group: q.words } : q)).length, 10, "10 words in all");
  set.filter(q => q.kind === "vocab").forEach(q => assert.equal(new Set(q.opts).size, 4));
  const now = new Date("2026-10-20T08:00:00Z");
  const history = [{ created_at: "2026-10-20T00:00:00Z", answers: [
    { skill: "Vocabulary", word: "anger", unit: 2, first_try: false }, { skill: "Vocabulary", word: "obesity", unit: 2, first_try: true }] }];
  assert.deepEqual(P.wordsToReview(history, now).map(x => x.w), ["anger"]);
  assert.equal(P.vocabMastery(2, history).mastered, 1);
  const review = P.vocabSet({ review: true, history, now });
  assert.equal(review.length, 1);
  assert.equal(review[0].word, "anger");
});

test("spaced review: words come back after 1, 3, 7 and 14 days", () => {
  const at = d => new Date(Date.parse("2026-10-05T03:00:00Z") + d * 86400e3);
  const right = d => ({ created_at: at(d).toISOString(), answers: [{ skill: "Vocabulary", word: "obesity", unit: 2, first_try: true }] });
  const due = (h, d) => P.wordsToReview(h, at(d)).some(x => x.w === "obesity");
  let h = [right(0)];
  assert.equal(due(h, 0), false); assert.equal(due(h, 1), true);
  h = [right(0), right(1)];
  assert.equal(due(h, 3), false); assert.equal(due(h, 4), true);
  h = [right(0), right(1), right(4), right(11)];
  assert.equal(P.wordSchedule(h)["2:obesity"].box, 4);
  assert.equal(due(h, 24), false); assert.equal(due(h, 25), true);
  h.push({ created_at: at(25).toISOString(), answers: [{ skill: "Vocabulary", word: "obesity", unit: 2, first_try: false }] });
  assert.equal(P.wordSchedule(h)["2:obesity"].box, 0);
  assert.equal(due(h, 25), true);
});

test("question types follow how well a word is known", () => {
  const at = "2026-10-01T00:00:00Z", ans = (w, ok) => ({ skill: "Vocabulary", word: w, unit: 3, first_try: ok });
  const h = [{ created_at: at, answers: [ans("eco", true), ans("arch", true)] }, { created_at: at, answers: [ans("eco", true)] }];
  const qs = P.vocabSet({ unit: 3, history: h, n: 25 });
  const typeOf = w => qs.find(q => q.word === w);
  assert.equal(typeOf("eco").type, "type");
  assert.equal(typeOf("arch").type, "context");
  assert.ok(P.markTyped({ answer: "first-aid" }, " First aid "));
  assert.ok(!P.markTyped({ answer: "arch" }, "arches"));
  assert.equal(P.letterBlanks("look up to"), "l___ __ __");
});

test("matching scores each word on its own", () => {
  const s = P.newSet(P.vocabSet({ unit: 4 }));
  assert.equal(s.qs[0].kind, "match");
  assert.equal(P.submitMatch(s, [true, false, true, false]), "hint");
  assert.equal(P.submitMatch(s, [true, true, true, false]), "reveal");
  assert.deepEqual(s.results[0].group.map(g => g.support), ["none", "hint", "none", "explained"]);
  assert.equal(P.smallXP(s.results), 2 * P.XP_SMALL.first + P.XP_SMALL.hint + P.XP_SMALL.finish);
});

test("word cards: unrated words first, then not sure", () => {
  const h = [{ created_at: "2026-10-01", answers: P.unitWords(3).slice(1).map(x => ({ skill: "Word card", word: x.w, unit: 3, known: x.w !== "arch" })) }];
  const cards = P.cardSet(3, h, 2);
  assert.deepEqual(cards.map(x => x.w), ["eco", "arch"]);
});

test("reading texts give example sentences for unit words", () => {
  const w = P.unitWords(3).find(x => x.w === "sightseeing");
  assert.match(P.textExample(w).sentence, /sightseeing/i);
  assert.ok(P.wordPattern("consume").test("People consumed more"));
  assert.ok(P.wordPattern("theme park").test("two theme parks"));
  assert.ok(!P.wordPattern("arch").test("research"));
});

test("every wrong grammar option has its own feedback", () => {
  GRAMMAR.forEach(g => g.items.forEach((it, i) => [1, 2, 3].forEach(k => {
    const note = wrongNote(g.id, i, k);
    assert.ok(note && note.length > 10, `note for ${g.id} item ${i + 1} option ${k}`);
  })));
});

test("grammar sets mix choose, tap the mistake and word tiles", () => {
  const qs = P.grammarSet({ point: "3.3" });
  assert.deepEqual(new Set(qs.map(q => q.variant)), new Set(["choose", "tap", "tiles"]));
  GRAMMAR.forEach(g => g.items.forEach((it, i) => {
    if (P.canTap(it)) {
      let r = 11; const q = P.grammarSet({ point: g.id, rnd: () => (r = (r * 9301 + 49297) % 233280) / 233280 }).find(x => x.item === i && x.variant === "tap");
      if (q) { assert.equal(q.chunks.filter(c => c.bad).length, 1); assert.ok(q.note); }
    }
  }));
  const tiles = qs.find(q => q.variant === "tiles");
  assert.ok(tiles.answer.length >= 2);
  assert.ok(tiles.answer.every(w => tiles.tiles.includes(w)));
  const n = P.noticeTask("3.3");
  assert.equal(n.examples.length, 3);
  assert.equal(n.opts.length, 3);
  assert.equal(new Set(n.opts).size, 3);
});

test("word families: four forms, all different", () => {
  Object.entries(FAMILIES).forEach(([u, items]) => {
    assert.equal(items.length, 6, `unit ${u}`);
    items.forEach(it => { assert.equal(new Set(it.slice(1, 5)).size, 4, it[0]); assert.equal(it[0].split("___").length, 2, it[0]); });
  });
});

test("missions: steps from history, final challenge unlocks, badge at 70%", () => {
  let m = P.mission(3, []);
  assert.deepEqual(m.steps.map(s => s.key), ["cards", "read", "listen", "vocab", "family", "grammar", "boss"]);
  assert.ok(m.steps.at(-1).locked);
  const h = [{ text_id: "cards-u3", created_at: "2026-10-22", answers: [] }, { mode: "practice", text_id: "crowds", created_at: "2026-10-22", answers: [] },
    { text_id: "family-u3", created_at: "2026-10-22", answers: [] }, { mode: "listening", text_id: "l3-ranger", created_at: "2026-10-22", answers: [] },
    { text_id: "vocab-u3", created_at: "2026-10-23", answers: P.unitWords(3).slice(0, 13).map(x => ({ skill: "Vocabulary", word: x.w, unit: 3, first_try: true })) },
    { text_id: "grammar-u3", created_at: "2026-10-23", answers: P.unitGrammar(3).map(g => ({ skill: "Grammar", point: g.id, first_try: true })) }];
  m = P.mission(3, h);
  assert.ok(m.steps.slice(0, 6).every(s => s.done));
  assert.equal(m.next.key, "boss");
  assert.equal(P.bossSet(3).length, 12);
  h.push({ text_id: "boss-u3", score: 9, max_score: 12, created_at: "2026-10-24", answers: [] });
  assert.ok(P.mission(3, h).complete);
  assert.deepEqual(P.missionBadges(h).map(b => b.name), ["Responsible traveller"]);
  assert.ok(!P.mission(5, []).steps.some(s => s.key === "read"), "no reading step without texts");
});

test("small sets: hint, then reveal; XP for first try and after a hint", () => {
  const s = P.newSet(P.grammarSet({ point: "2.4" }));
  assert.equal(P.submitSmall(s, false), "hint");
  assert.equal(P.submitSmall(s, true), "correct");
  P.nextSmall(s);
  assert.equal(P.submitSmall(s, false), "hint");
  assert.equal(P.submitSmall(s, false), "reveal");
  assert.deepEqual(s.results.map(r => r.support), ["hint", "explained"]);
  assert.equal(P.smallXP(s.results), P.XP_SMALL.hint + P.XP_SMALL.finish);
  assert.equal(s.results[0].code, "9Ug.14");
});

test("calendar: Tourism is the focus unit in late October 2026", () => {
  const d = new Date("2026-10-27T03:00:00Z");
  assert.equal(P.focusUnit(d), 3);
  assert.equal(P.unitStatus(2, d), "done");
  assert.equal(P.unitStatus(4, d), "upcoming");
  assert.equal(P.focusUnit(new Date("2026-12-20T03:00:00Z")), 6);   // narrative writing → next unit is 6
});

test("a word in two units keeps a separate state per unit", () => {
  const h = [{ created_at: "2026-10-01", answers: [{ skill: "Vocabulary", word: "encourage", unit: 1, first_try: false }] }];
  const review = P.wordsToReview(h).filter(x => x.w === "encourage");
  assert.deepEqual(review.map(x => x.unit), [1]);
  assert.equal(P.vocabMastery(6, [{ created_at: "2026-10-02", answers: [{ skill: "Vocabulary", word: "encourage", unit: 6, first_try: true }] }]).mastered, 1);
  assert.equal(P.vocabMastery(1, [{ created_at: "2026-10-02", answers: [{ skill: "Vocabulary", word: "encourage", unit: 6, first_try: true }] }]).mastered, 0);
});

test("listening tasks: cues, answers, audio timings", () => {
  assert.equal(LISTENING.filter(t => t.unitNo === 2).length, 4);
  assert.equal(LISTENING.filter(t => t.unitNo === 3).length, 4);
  LISTENING.forEach(t => {
    assert.equal(new Set(LISTENING.map(x => x.id)).size, LISTENING.length);
    t.lines.forEach(([who]) => assert.ok(t.voices[who], `voice for ${who} in ${t.id}`));
    assert.equal((TIMES[t.id] || []).length, t.lines.length, `timings for ${t.id}`);
    t.qs.forEach((q, i) => {
      const [a, b] = P.cueLines(t, q);
      assert.ok(a >= 0 && b >= a, `cue for ${t.id} q${i + 1}`);
      if (q.type === "gap") { assert.equal(q.stem.split("___").length, 2); q.answers.forEach(x => assert.ok(P.listenCorrect(q, x))); }
      else if (t.statements) assert.ok(q.answer >= 0 && q.answer < t.statements.length);
      else assert.equal(new Set(q.opts).size, q.opts.length);
    });
    if (t.statements) assert.equal(new Set(t.qs.map(q => q.answer)).size, t.qs.length, `each statement used once in ${t.id}`);
  });
  const gap = { type: "gap", answers: ["5.30", "half past five"] };
  assert.ok(P.listenCorrect(gap, "5:30"));
  assert.ok(P.listenCorrect(gap, "Half past five."));
  assert.equal(P.markGap({ answers: ["conservation"] }, "conservaton"), "spelling");
  assert.equal(P.markGap({ answers: ["paths"] }, "pats"), false);
  assert.ok(!P.listenCorrect(gap, "6"));
});

test("vocab and grammar tiers: Core floor, harder tasks for B2 and C1, moving inside a set", () => {
  const prac = (lv, n) => ({ mode: "practice", text_id: "sleep", level_end: lv, score: n, max_score: 8, created_at: "2026-10-01T00:00:00Z",
    answers: Array.from({ length: 8 }, (_, i) => ({ skill: "Detail", level: lv, first_try: i < n })) });
  assert.equal(P.tierFor([]), 0);
  assert.equal(P.tierFor([prac(0, 1), prac(0, 1), prac(0, 1)]), 0, "lower A2 stays on Core");
  assert.equal(P.tierFor([prac(2, 8), prac(2, 8), prac(2, 8)]), 1, "B2+ is Stretch");
  assert.equal(P.tierFor([prac(3, 8), prac(3, 8), prac(3, 8)]), 2, "C1+ is Challenge");
  let k = 0; const rnd = () => ((k = (k * 9301 + 49297) % 233280) / 233280);
  const core = P.vocabSet({ unit: 2, n: 10, rnd, tier: 0 }), ch = P.vocabSet({ unit: 2, n: 10, rnd, tier: 2 });
  assert.equal(core[0].kind, "match", "Core starts with matching for new words");
  assert.ok(ch.every(q => q.kind === "vocab" && q.tier === 2 && (q.type === "paraphrase" || q.type === "type")), "Challenge: no matching, harder types");
  ch.filter(q => q.type === "paraphrase").forEach(q => { assert.equal(new Set(q.opts).size, 4); assert.ok(q.stem.includes("[")); });
  // Moving inside a set
  const set = P.newSet(P.vocabSet({ unit: 2, n: 10, rnd, tier: 1 }));
  assert.equal(set.tier, 1);
  P.submitSmall(set, false); P.submitSmall(set, false); P.nextSmall(set);
  P.submitSmall(set, false); P.submitSmall(set, false);
  assert.equal(set.tier, 0, "two missed in a row moves down");
  P.nextSmall(set); assert.equal(set.qs[set.i].tier, 0);
  P.submitSmall(set, false); P.submitSmall(set, false); P.nextSmall(set); P.submitSmall(set, false); P.submitSmall(set, false);
  assert.equal(set.tier, 0, "never below Core");
  for (let j = 0; j < 3; j++) { P.nextSmall(set); P.submitSmall(set, true); }
  assert.equal(set.tier, 1, "three right first time moves up");
  assert.ok(P.smallXP([{ support: "none", tier: 2 }]) > P.smallXP([{ support: "none" }]), "more XP on harder tiers");
  // Grammar
  const g = P.grammarSet({ unit: 3, rnd, tier: 2 });
  assert.ok(g.some(q => q.variant === "fix" || q.variant === "type"));
  g.filter(q => q.type === "type").forEach(q => { assert.ok(P.markTyped(q, q.answer)); assert.ok(q.stem.includes("___")); });
  assert.ok(P.bossSet(2, rnd).every(q => !q.tier), "final challenge stays Core");
});

import { EXTRA, extraWords } from "../js/vocab-extra.js";
import { VOCAB as CORE } from "../js/vocab.js";
test("extra Stretch and Challenge words: on the unit theme lists, 8 + 8, one gap, not already core", () => {
  for (const u of [2, 3, 4]) {
    assert.equal(EXTRA[u].stretch.length, 8); assert.equal(EXTRA[u].challenge.length, 8);
    const core = new Set(CORE[u].flat().map(x => x[0]));
    [...EXTRA[u].stretch, ...EXTRA[u].challenge].forEach(([w, d, ex]) => { assert.ok(!core.has(w), w); assert.equal(ex.split("___").length, 2, w); assert.ok(d.length > 5); });
    let k = 1; const rnd = () => ((k = (k * 9301 + 49297) % 233280) / 233280);
    assert.equal(P.vocabSet({ unit: u, n: 10, rnd, tier: 0 }).filter(q => q.extra).length, 0, "Core has no extra words");
    assert.equal(P.vocabSet({ unit: u, n: 10, rnd, tier: 1 }).filter(q => q.extra).length, 3);
    const ch = P.vocabSet({ unit: u, n: 10, rnd, tier: 2 });
    assert.equal(ch.filter(q => q.extra).length, 4); assert.equal(ch.length, 10);
  }
  assert.equal(extraWords(2, 1).length, 8);
});
