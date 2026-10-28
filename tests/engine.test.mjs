// Run with: npm test
import test from "node:test";
import assert from "node:assert/strict";
import * as E from "../js/engine.js";
import { PRACTICE_TEXTS, BASELINE, STRATEGY } from "../js/content.js";

const text = PRACTICE_TEXTS[0];

test("content: every slot has a question for each level, a strategy, and highlight text that exists", () => {
  for (const t of PRACTICE_TEXTS) {
    t.slots.forEach((s, i) => {
      assert.ok(STRATEGY[s.skill], `strategy for ${s.skill}`);
      assert.ok(t.levels.length >= 3 && t.levels.length <= 4);
      assert.equal(s.q.length, t.levels.length);
      t.levels.forEach(lv => assert.deepEqual(lv.paras.map(p => p[0]), t.levels[0].paras.map(p => p[0]), `paragraph letters in ${t.id}`));
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

test("Challenge: Units 2 and 3 have a fourth level, reached only inside a text after Harder", () => {
  const withC = PRACTICE_TEXTS.filter(t => t.levels.length === 4).map(t => t.unitNo);
  assert.equal(withC.length, 8);
  assert.ok(withC.every(u => u === 2 || u === 3));
  const t = PRACTICE_TEXTS.find(x => x.id === "camping");
  t.slots.forEach(s => { if (s.q[3].type === "short") assert.ok(s.q[3].groups.length >= s.q[2].groups.length && !("extra" in s.q[3])); });
  const r = E.newRun(t, 3);
  assert.equal(r.level, 2, "never starts on Challenge");
  for (let i = 0; i < 3; i++) { E.submit(t, r, true); E.advance(t, r); }
  assert.equal(r.level, 3);
  const u4 = PRACTICE_TEXTS.find(x => x.unitNo === 4), r4 = E.newRun(u4, 2);
  for (let i = 0; i < 3; i++) { E.submit(u4, r4, true); E.advance(u4, r4); }
  assert.equal(r4.level, 2, "Unit 4 texts stop at Harder");
});

test("reading bands: eight CEFR steps from the text level and the score", () => {
  const ans = (level, right, n = 8) => Array.from({ length: n }, (_, i) => ({ skill: "Detail", level, first_try: i < right }));
  assert.equal(E.BANDS.length, 8);
  assert.equal(E.readingBand({ mode: "practice", level_end: 1, answers: ans(1, 5) }), 2);        // B1
  assert.equal(E.readingBand({ mode: "practice", level_end: 1, answers: ans(1, 6) }), 3);        // B1+
  // the server stores Challenge as Harder (2); the answers show the student finished on Challenge
  const ch = { mode: "practice", level_end: 2, answers: [...ans(2, 3, 3), ...ans(3, 5, 5)] };
  assert.equal(E.textLevel(ch), 3);
  assert.equal(E.readingBand(ch), 7);                                                           // C1+
  assert.equal(E.readingBand({ mode: "baseline", level_end: 1, score: 8, answers: ans(2, 8, 12) }), 3);
  assert.equal(E.readingBand({ mode: "baseline", level_end: 0, score: 2 }), 0);
  assert.equal(E.currentBand([{ mode: "baseline", level_end: 2, score: 12 }, { mode: "vocab", level_end: null }]), 5);
  assert.equal(E.currentBand([]), null);
  assert.ok(E.badges([{ mode: "practice", created_at: "2026-10-28T02:00:00Z", ...ch }]).some(b => b.name === "Challenger"));
});
