import test from "node:test";
import assert from "node:assert/strict";
import * as P from "../js/practice.js";
import { VOCAB } from "../js/vocab.js";
import { GRAMMAR, OBJECTIVES, SEQUENCE, UNITS } from "../js/curriculum.js";

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
  assert.equal(set.length, 10);
  set.forEach(q => assert.equal(new Set(q.opts).size, 4));
  const history = [{ created_at: "2026-10-20T00:00:00Z", answers: [
    { skill: "Vocabulary", word: "anger", first_try: false }, { skill: "Vocabulary", word: "obesity", first_try: true }] }];
  assert.deepEqual(P.wordsToReview(history).map(x => x.w), ["anger"]);
  assert.equal(P.vocabMastery(2, history).mastered, 1);
  const review = P.vocabSet({ review: true, history });
  assert.equal(review.length, 1);
  assert.equal(review[0].word, "anger");
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
