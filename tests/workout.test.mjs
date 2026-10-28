import test from "node:test";
import assert from "node:assert/strict";
import * as W from "../js/workout.js";

const at = "2026-10-27T03:00:00Z", now = new Date("2026-10-28T03:00:00Z");
const ans = (skill, right, wrong, extra = {}) => [...Array(right).fill({ skill, first_try: true, ...extra }), ...Array(wrong).fill({ skill, first_try: false, ...extra })];

test("area scores: out of 1000, reading scaled by level, blank until 3 answers", () => {
  const h = [{ created_at: at, answers: [...ans("Detail", 8, 2), ...ans("Grammar", 3, 1), ...ans("Listening", 1, 1)] }];
  const s = W.areaScores(h, 2), get = n => s.areas.find(a => a.name === n);
  assert.equal(get("Reading").score, 800);
  assert.equal(W.areaScores(h, 0).areas[0].score, 560);
  assert.equal(get("Grammar").score, 750);
  assert.equal(get("Listening").score, null);
  assert.equal(get("Speed").score, null);
  assert.equal(s.overall, Math.round((800 + 750) / 2));
  const sp = W.areaScores([{ created_at: at, answers: ans("Speed reading", 3, 1, { wpm: 280 }) }]);
  assert.equal(sp.areas.find(a => a.name === "Speed").score, 750);
  assert.equal(W.areaScores([]).overall, null);
});

test("workout: three items, weakest area first, a game last, done when played today", () => {
  const h = [{ created_at: at, text_id: "grammar-3.1", answers: [...ans("Grammar", 1, 5, { point: "3.1" }), ...ans("Vocabulary", 6, 0, { word: "x", unit: 9 }), ...ans("Detail", 6, 0)] }];
  const plan = W.workoutPlan(h, 3, { level: 1, now });
  assert.equal(plan.length, 3);
  assert.equal(plan[plan.length - 1].kind, "game");
  assert.ok(plan.some(i => i.area === "Listening"), "listening has no score yet, so it counts as weakest");
  const g = plan.find(i => i.kind === "game");
  const later = W.workoutPlan([...h, { created_at: "2026-10-28T02:00:00Z", text_id: g.id, answers: [] }], 3, { level: 1, now });
  assert.deepEqual(later.map(i => i.id), plan.map(i => i.id), "the plan does not change during the day");
  assert.ok(later.find(i => i.kind === "game").done);
  const base = W.workoutPlan([], 3, { baselineDone: false, now });
  assert.equal(base[0].kind, "baseline");
  assert.ok(!base.some(i => i.kind === "text"));
});

test("a trap that keeps catching the student puts its Listening Lab mission in the workout", async () => {
  const { workoutPlan } = await import("../js/workout.js");
  const day = "2026-10-20T03:00:00Z", now = new Date("2026-10-28T03:00:00Z");
  const ans = (skill, n, ok, extra = {}) => Array.from({ length: n }, () => ({ skill, first_try: ok, ...extra }));
  const history = [{ mode: "practice", text_id: "x", created_at: day, answers: [...ans("Detail", 10, true), ...ans("Vocabulary", 10, true), ...ans("Grammar", 10, true),
    ...ans("Listening", 4, false, { trap: "distractor" }), ...ans("Listening", 1, true, { trap: "distractor" })] }];
  const plan = workoutPlan(history, 3, { now });
  assert.ok(plan.some(i => i.kind === "lab" && i.id === "lab-distractor"), JSON.stringify(plan));
});
