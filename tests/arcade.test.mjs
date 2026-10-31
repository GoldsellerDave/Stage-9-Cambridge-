import { test } from "node:test";
import assert from "node:assert/strict";
import * as AR from "../js/arcade.js";
import * as G from "../js/games.js";

test("Escape Arcade gets a full set of different puzzles from the unit's escape room", () => {
  for (const tier of [0, 1, 2]) for (let k = 0; k < 20; k++) {
    const c = AR.arcadeContent(3, tier);
    assert.equal(c.vocab.length, AR.ARCADE_ROOMS.vocab);
    assert.equal(new Set(c.vocab.map(p => p.answer)).size, c.vocab.length);
    assert.equal(c.reading.length, AR.ARCADE_ROOMS.reading);
    assert.equal(c.grammar.length, AR.ARCADE_ROOMS.grammar);
    [...c.vocab, ...c.reading, ...c.grammar].forEach(p => assert.ok(p.opts.includes(p.answer)));
    // reading answers are one digit, so they fit the number pad, and they point at a paragraph of the leaflet
    c.reading.forEach(p => { assert.match(String(p.answer), /^[1-9]$/); assert.ok(p.para >= 1 && p.para <= c.doc.paras.length); });
  }
  assert.equal(AR.hasArcade(3), true);
  assert.equal(AR.arcadeContent(9), null);
});

test("Escape Arcade counts as a game for the daily game XP and saves its words for the word review", () => {
  assert.ok(G.isGame("arcade-u3"));
  const R = { points: 900, level: 3, skills: { vocab: { right: 1, total: 2 } }, words: [{ w: "arch", hit: true }, { w: "fresco", hit: false }] };
  const ans = G.gameAnswers("arcade", R, 3);
  assert.equal(ans[0].points, 900); assert.deepEqual(ans[0].skills, R.skills);
  assert.deepEqual(ans.slice(1).map(a => [a.word, a.first_try]), [["arch", true], ["fresco", false]]);
});

test("Stage 8 Unit 3 has an escape room whose leaflet answers fit the safe", async () => {
  const { ESCAPES } = await import("../js/s8/escape.js");
  const E = ESCAPES[3];
  assert.ok(E && E.museum && E.doc.paras.length >= 4);
  for (const r of E.reading) {
    assert.ok(r.a >= 1 && r.a <= 9 && r.para >= 1 && r.para <= E.doc.paras.length);
    assert.ok(E.doc.paras[r.para - 1].length > 0);
  }
  assert.deepEqual([...new Set(E.reading.map(r => r.tier))].sort(), [0, 1, 2]);
});
