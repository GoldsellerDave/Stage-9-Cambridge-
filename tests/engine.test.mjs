// Run with: npm test
import test from "node:test";
import assert from "node:assert/strict";
import * as E from "../js/engine.js";
import { PRACTICE_TEXTS, BASELINE, STRATEGY } from "../js/content.js";

const text = PRACTICE_TEXTS[0];

test("content: every slot has three levels, a strategy, and highlight text that exists", () => {
  for (const t of PRACTICE_TEXTS) {
    t.slots.forEach((s, i) => {
      assert.ok(STRATEGY[s.skill], `strategy for ${s.skill}`);
      assert.equal(s.q.length, 3);
      s.q.forEach((q, l) => {
        const para = t.levels[l].paras.find(p => p[0] === (q.para || s.para));
        assert.ok(para && para[1].includes(q.focus), `focus for slot ${i + 1} level ${l}`);
        if (q.type !== "short") assert.equal(q.opts.length, 4);
      });
      assert.ok(s.q[0].explain, `Easier explanation for slot ${i + 1}`);
    });
  }
  assert.equal(BASELINE.flatMap(b => b.qs).length, 12);
});

test("short answers: keyword groups count different points", () => {
  const q = text.slots[3].q[1];
  assert.equal(E.mark(q, "They forget things and feel anxious").ok, true);
  assert.deepEqual(E.mark(q, "they can't concentrate").hits, ["concentration"]);
  assert.equal(E.mark(q, "they can't concentrate").ok, false);
  assert.equal(E.mark(q, "tired").tooShort, true);
  assert.equal(E.shortHits("they will still be fine", q.groups).length, 0);   // "ill" must be a whole word
});

test("wrong once gives a hint, again gives the reread, then the level drops", () => {
  const r = E.newRun(text, 1);
  assert.equal(E.submit(text, r, false).outcome, "hint");
  assert.equal(E.submit(text, r, false).outcome, "reread");
  assert.equal(E.submit(text, r, false).outcome, "down");
  assert.equal(r.level, 0);
  assert.equal(E.submit(text, r, true).outcome, "correct");
  assert.equal(r.results[0].support, "easier");
});

test("second question missed in a row goes straight to the reread", () => {
  const r = E.newRun(text, 1);
  E.submit(text, r, false); E.submit(text, r, true); E.advance(text, r);
  assert.equal(E.submit(text, r, false).outcome, "reread");
});

test("on Easier, still wrong after the reread is explained and unscored", () => {
  const r = E.newRun(text, 0);
  E.submit(text, r, false); E.submit(text, r, false);
  assert.equal(E.submit(text, r, false).outcome, "explained");
  assert.equal(E.answerXP(r.results[0]), 0);
});

test("three right first time in a row moves up, with XP for the level up", () => {
  const r = E.newRun(text, 0);
  for (let i = 0; i < 3; i++) { E.submit(text, r, true); assert.equal(E.advance(text, r), i < 2 ? "next" : "up"); }
  assert.equal(r.level, 1);
  for (let i = 3; i < 8; i++) { E.submit(text, r, true); E.advance(text, r); }
  assert.equal(r.done, true);
  assert.equal(r.level, 2);
  // 3 x 10 (Easier) + 3 x 15 (Core) + 2 x 20 (Harder) + 20 finish + 2 x 25 level up
  assert.equal(E.runXP(r), 30 + 45 + 40 + 20 + 50);
  assert.equal(E.runXP(r, { replay: true }), 93);
});

test("baseline placement bands", () => {
  assert.deepEqual([0, 5, 6, 9, 10, 12].map(E.placement), [0, 0, 1, 1, 2, 2]);
});

test("weekly streak counts weeks with 2+ practice texts", () => {
  const now = new Date("2026-10-28T05:00:00Z");   // Wednesday
  const p = d => ({ mode: "practice", created_at: d });
  const h = [p("2026-10-13T03:00:00Z"), p("2026-10-14T03:00:00Z"), p("2026-10-20T03:00:00Z"), p("2026-10-22T03:00:00Z"), p("2026-10-27T03:00:00Z")];
  assert.deepEqual(E.weeklyStreak(h, now), { streak: 2, thisWeek: 1 });
  assert.equal(E.streakBonus(h, now), E.XP.streakWeek);
  assert.equal(E.weekKey("2026-10-25T18:00:00Z"), "2026-10-26");   // Sunday 18:00 UTC is Monday 01:00 in Vietnam
});
