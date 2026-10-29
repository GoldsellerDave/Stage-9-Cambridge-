import test from "node:test";
import assert from "node:assert/strict";
import * as D from "../js/drill.js";
import * as W from "../js/workout.js";
import { PRACTICE_TEXTS } from "../js/content.js";

test("drill ids round-trip for every reading skill", () => {
  for (const s of D.DRILL_SKILLS) { assert.equal(D.drillSkill(D.drillId(s)), s); assert.ok(D.isDrill(D.drillId(s))); }
  assert.equal(D.drillId("Detail: two points"), "drill-detail-two-points");
  assert.ok(!D.isDrill("sleep"));
});

test("a drill: 4 questions on one skill, from different texts, unit first, never Challenge, without the text just read", () => {
  for (const skill of D.DRILL_SKILLS) for (const level of [0, 1, 2, 3]) {
    const items = D.drillItems(skill, { unit: 3, level, exclude: "active" });
    assert.equal(items.length, D.DRILL_LEN);
    assert.equal(new Set(items.map(i => i.text)).size, items.length);
    assert.ok(!items.some(i => i.text === "active"));
    assert.equal(PRACTICE_TEXTS.find(t => t.id === items[0].text).unitNo, 3);
    for (const it of items) {
      assert.ok(it.level <= Math.min(level, 2));
      const { q, skill: s, paras } = D.drillQuestion(it);
      assert.equal(s, skill);
      assert.ok(q.stem && q.hint);
      assert.ok(it.para.split("").every(L => paras.some(p => p[0] === L)), `${it.text} ${skill}: paragraph ${it.para}`);
    }
  }
  const a = D.drillItems("Inference", { unit: 2, seed: 0 }).map(i => i.text), b = D.drillItems("Inference", { unit: 2, seed: 1 }).map(i => i.text);
  assert.notDeepEqual(a, b, "a repeat drill uses different texts");
});

test("weak skills: weakest first, needs 2 answers, under 75%", () => {
  const h = [{ created_at: "2026-10-27T03:00:00Z", answers: [
    { skill: "Detail", first_try: false }, { skill: "Detail", first_try: false }, { skill: "Inference", first_try: true },
    { skill: "Inference", first_try: false }, { skill: "Main idea", first_try: true }, { skill: "Main idea", first_try: true },
    { skill: "Writer's view", first_try: false }] }];
  assert.deepEqual(D.weakSkills(h).map(s => s.skill), ["Detail", "Inference"]);
  assert.equal(D.drillXP([{ first_try: true, support: "none" }, { first_try: false, support: "hint" }, { first_try: false, support: "explained" }]), 10 + 5 + 10);
});

test("workout: a skill drill for the weakest skill once the unit's texts are read", () => {
  const read = PRACTICE_TEXTS.filter(t => t.unitNo === 3).map(t => ({ created_at: "2026-10-26T03:00:00Z", text_id: t.id, mode: "practice",
    answers: [{ skill: "Cause and effect", first_try: false }, { skill: "Detail", first_try: true },
      ...["Listening", "Vocabulary", "Grammar"].flatMap(skill => Array(3).fill({ skill, first_try: true, word: "x", unit: 9, point: "3.1" }))] }));
  const plan = W.workoutPlan(read, 3, { level: 1, now: new Date("2026-10-28T03:00:00Z") });
  const r = plan.find(i => i.area === "Reading");
  assert.ok(r, "reading is the weakest area"); { assert.equal(r.kind, "drill"); assert.equal(r.skill, "Cause and effect"); assert.equal(r.id, "drill-cause-and-effect"); }
});
