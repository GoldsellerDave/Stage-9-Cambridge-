import { test } from "node:test";
import assert from "node:assert/strict";
import * as X from "../js/escape.js";

const seeded = (s = 1) => () => (s = (s * 9301 + 49297) % 233280) / 233280;

test("a Unit 3 game has three rooms of three puzzles, each with the answer among the options", () => {
  for (const tier of [0, 1, 2]) {
    const g = X.makeEscape(3, tier, seeded(tier + 3));
    assert.equal(g.rooms.length, 3);
    g.rooms.forEach(r => { assert.equal(r.puzzles.length, 3); assert.equal(r.code.length, 3);
      r.puzzles.forEach((p, i) => { assert.ok(p.opts.includes(p.answer)); assert.equal(new Set(p.opts).size, p.opts.length); assert.equal(p.gives, r.code[i]); }); });
    // the padlock is the first letters of the words; the safe opens with the reading answers
    assert.deepEqual(g.rooms[0].code, g.rooms[0].puzzles.map(p => p.answer[0].toUpperCase()));
    assert.deepEqual(g.rooms[1].code, g.rooms[1].puzzles.map(p => p.answer));
  }
});

test("Core games use only syllabus words; Challenge games add Stretch and Challenge words", () => {
  const core = X.makeEscape(3, 0, seeded(5)).rooms[0].puzzles;
  assert.ok(core.every(p => p.tier === 0));
  const ch = X.makeEscape(3, 2, seeded(5)).rooms[0].puzzles;
  assert.deepEqual(ch.map(p => p.tier).sort(), [0, 1, 2]);
});

test("reading answers match the leaflet", () => {
  const E = X.ESCAPES[3];
  E.reading.forEach(r => { assert.ok(r.a >= 1 && r.a <= 9); assert.ok(r.para >= 1 && r.para <= E.doc.paras.length); });
});

test("wrong answers, hints and wrong codes add time; the right codes get you out", () => {
  const g = X.makeEscape(3, 0, seeded(9)), pl = X.newPlay(g, 0);
  const wrong = g.rooms[0].puzzles[0].opts.find(o => o !== g.rooms[0].puzzles[0].answer);
  assert.equal(X.answerPuzzle(g, pl, 0, wrong), "wrong");
  assert.equal(X.answerPuzzle(g, pl, 0, g.rooms[0].puzzles[0].answer), "right");
  X.takeHint(pl, 1); X.takeHint(pl, 1);
  assert.equal(X.tryCode(g, pl, ["Z", "Z", "Z"]), g.rooms[0].code.join("") === "ZZZ");
  assert.equal(pl.penalty, X.ESCAPE_PENALTY.wrong + X.ESCAPE_PENALTY.hint + X.ESCAPE_PENALTY.code);
  for (const r of g.rooms) { r.puzzles.forEach((p, i) => { if (!pl.solved[pl.room][i]) X.answerPuzzle(g, pl, i, p.answer); }); assert.ok(X.tryCode(g, pl, r.code)); }
  assert.ok(pl.out);
  const res = X.escapeResult(g, pl, [], 100000);
  assert.equal(res.seconds, 100 + pl.penalty);
  assert.equal(res.total, 9); assert.equal(res.right, 7);         // one wrong, one hint
  assert.equal(res.xp, 7 * X.ESCAPE_XP.first + X.ESCAPE_XP.firstEscape);
  const hist = [{ text_id: "escape-u3", answers: res.answers }];
  assert.equal(X.bestEscape(hist, 3), res.seconds);
  assert.equal(X.escapeResult(g, pl, hist, 100000).xp, 7 * X.ESCAPE_XP.first + X.ESCAPE_XP.escape);
});
