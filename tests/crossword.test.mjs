import { test } from "node:test";
import assert from "node:assert/strict";
import { CROSS, crossPool, makeCrossword, cellsOf, answerOf, enumeration, fairClue, wordPoints, crossStars } from "../js/crossword.js";
import { gameAnswers, isGame } from "../js/games.js";

const valid = g => {
  const seen = {};
  for (const p of g.words) cellsOf(p).forEach(([x, y], i) => {
    assert.ok(x >= 0 && y >= 0 && x < g.w && y < g.h, `${p.w} inside the grid`);
    assert.equal(g.grid[y][x], p.a[i], `${p.w} letters agree where words cross`);
    const k = x + "," + y; seen[k] = (seen[k] || 0) + 1;
  });
  // Every run of 2+ letters in the grid is one of the words (no accidental words where words sit side by side).
  const runs = [];
  for (let y = 0; y < g.h; y++) for (const m of g.grid[y].map(c => c || " ").join("").matchAll(/[A-Z]{2,}/g)) runs.push(m[0]);
  for (let x = 0; x < g.w; x++) for (const m of g.grid.map(r => r[x] || " ").join("").matchAll(/[A-Z]{2,}/g)) runs.push(m[0]);
  assert.deepEqual(runs.sort(), g.words.map(p => p.a).sort());
};

test("every unit makes a Quick and a Big crossword that fit and are valid", () => {
  for (let u = 1; u <= 9; u++) for (const [size, c] of Object.entries(CROSS)) for (const tier of [0, 1, 2]) for (const seed of [1, 2, 3]) {
    const g = makeCrossword(crossPool(u, size, tier), c.words, c.max, seed * 977 + u);
    assert.ok(g.w <= c.max && g.h <= c.max, `unit ${u} ${size} fits ${c.max}×${c.max}`);
    assert.ok(g.words.length >= (size === "cross" ? 7 : 11), `unit ${u} ${size} has enough words (${g.words.length})`);
    valid(g);
    assert.equal(new Set(g.words.map(p => p.w)).size, g.words.length, "no word twice");
  }
});
test("clue numbers follow reading order", () => {
  const g = makeCrossword(crossPool(3, "crossl"), 14, 15, 5);
  const firsts = [...new Map(g.words.map(p => [p.n, p])).values()].sort((a, b) => a.n - b.n);
  firsts.forEach((p, i) => i && assert.ok(p.y * 100 + p.x > firsts[i - 1].y * 100 + firsts[i - 1].x));
});
test("answers, enumeration and fair clues", () => {
  assert.equal(answerOf("look up to"), "LOOKUPTO");
  assert.equal(enumeration("look up to"), "(4,2,2)");
  assert.equal(enumeration("first-aid"), "(5-3)");
  assert.equal(enumeration("campsite"), "(8)");
  assert.equal(fairClue({ w: "food waste", def: "food that is thrown away and not eaten" }), false);
  assert.equal(fairClue({ w: "a ban", def: "an official rule that stops something" }), false);
  for (let u = 1; u <= 9; u++) for (const x of crossPool(u, "crossl", 2)) assert.ok(x.ex.includes("___"), `${x.w} has an example sentence`);
});
test("points, stars and saving", () => {
  assert.equal(wordPoints({}), 100);
  assert.equal(wordPoints({}, 3), 140);
  assert.equal(wordPoints({ hints: 1, letters: 3 }), 10);
  const R = { points: 500, hits: 1, level: 2, seconds: 100, words: [{ w: "arch", hit: true, letters: 0 }, { w: "eco", hit: false, letters: 1 }] };
  assert.equal(crossStars(R), 2);
  assert.equal(crossStars({ ...R, words: [R.words[0]], seconds: 20 }), 3);
  assert.ok(isGame("cross-u3") && isGame("crossl-u3"));
  const a = gameAnswers("crossl", R, 3);
  assert.deepEqual(a.slice(1), [{ skill: "Word game", word: "arch", unit: 3, first_try: true }, { skill: "Word game", word: "eco", unit: 3, first_try: false }]);
});
test("the Big crossword adapts to the reader: Stretch words at B2, Stretch and Challenge at C1", () => {
  const extras = (u, t) => { let n1 = 0, n2 = 0; for (let s = 1; s <= 10; s++) for (const p of makeCrossword(crossPool(u, "crossl", t, s), 14, 15, s).words) { if (p.tier === 1) n1++; if (p.tier === 2) n2++; } return [n1 / 10, n2 / 10]; };
  assert.deepEqual(extras(3, 0), [0, 0]);
  const [a1, a2] = extras(3, 1); assert.ok(a1 >= 4 && a2 === 0, `B2: ${a1} Stretch`);
  const [b1, b2] = extras(3, 2); assert.ok(b1 >= 2 && b2 >= 2, `C1: ${b1} Stretch, ${b2} Challenge`);
  assert.notDeepEqual(crossPool(3, "crossl", 1, 1).slice(-5).map(x => x.w), crossPool(3, "crossl", 1, 2).slice(-5).map(x => x.w), "a different set each game");
  assert.ok(crossPool(3, "cross", 2).every(x => !x.tier), "the Quick crossword is unit words only");
});
