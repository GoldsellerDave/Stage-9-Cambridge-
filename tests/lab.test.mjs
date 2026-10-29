import { test } from "node:test";
import assert from "node:assert/strict";
import * as Lab from "../js/lab.js";
import { LISTENING } from "../js/listening.js";

test("every lab item: answer and trap words are in the script, options are distinct, prime steps are complete", () => {
  assert.equal(Lab.LAB.length, 6);
  const clips = new Set();
  for (const m of Lab.LAB) {
    assert.ok(Lab.TRAPS[m.trap]); assert.equal(m.teach.length, 2);
    for (const it of m.items) {
      assert.ok(!clips.has(it.clip), it.clip); clips.add(it.clip);
      const script = it.lines.map(l => l[1]).join(" ");
      it.lines.forEach(([who]) => assert.ok(it.voices[who], `${it.clip} voice ${who}`));
      assert.ok(script.includes(it.key), `${it.clip} key`);
      it.traps.forEach(([s]) => assert.ok(script.includes(s), `${it.clip} trap ${s}`));
      assert.equal(new Set(it.opts.map(o => o.t)).size, it.opts.length);
      it.opts.slice(1).forEach(o => assert.ok(o.why, `${it.clip} why`));
      assert.ok(it.hint);
      if (m.trap === "prime") {
        it.keys.forEach(k => assert.ok(it.stem.includes(k), `${it.clip} key word ${k}`));
        assert.ok(Lab.ANSWER_TYPES.includes(it.type));
        assert.ok(it.predict.some(p => p[1]) && it.predict.some(p => !p[1]));
      }
    }
    assert.equal(m.items.filter(it => it.final).length, m.trap === "prime" ? 0 : 1);
  }
});

test("unit trap tags line up with the unit listening questions", () => {
  for (const [id, tags] of Object.entries(Lab.UNIT_TRAPS)) {
    const t = LISTENING.find(x => x.id === id); assert.ok(t, id); assert.equal(tags.length, t.qs.length, id);
    tags.forEach(k => assert.ok(k == null || Lab.TRAPS[k]));
  }
});

test("trap tracker, weakest trap, XP and transcript marks", () => {
  const h = [{ answers: [{ skill: "Listening", trap: "distractor", first_try: false }, { skill: "Listening", trap: "distractor", first_try: false },
    { skill: "Listening", trap: "distractor", first_try: true }, { skill: "Listening", trap: "numbers", first_try: false }, { skill: "Detail", trap: "numbers", first_try: false }] }];
  const s = Object.fromEntries(Lab.trapStats(h).map(t => [t.trap, t]));
  assert.deepEqual([s.distractor.caught, s.distractor.total, s.numbers.caught, s.numbers.total], [2, 3, 1, 1]);
  assert.equal(Lab.weakestTrap(h), "distractor"); assert.equal(Lab.weakestTrap([]), null);
  assert.equal(Lab.missionForTrap("distractor").id, "lab-distractor");
  assert.equal(Lab.labXP([{ skill: "Listening", support: "none" }, { skill: "Listening", support: "hint" }, { skill: "Listening strategy", first_try: true }]), 10 + 4 + 2 + 10);
  const p = Lab.markLine("Last year it left at quarter past eight, but now at quarter to eight.", "at quarter to eight", [["quarter past eight", "old"]]);
  assert.deepEqual(p.map(x => x.kind || ""), ["", "trap", "", "key", ""]);
  assert.equal(p.map(x => x.t).join(""), "Last year it left at quarter past eight, but now at quarter to eight.");
});

test("adaptive lab: every mission has Core, Stretch and Challenge questions, and enough for a mission", () => {
  for (const m of Lab.LAB) {
    const n = [0, 1, 2].map(l => m.items.filter(it => it.level === l).length);
    assert.ok(n[0] >= 5 && n[1] >= 4 && n[2] >= 4, `${m.id} ${n}`);
  }
  assert.equal(Lab.LAB_CLIPS.length, Lab.LAB.reduce((t, m) => t + m.items.length, 0));
});

test("adaptive lab: level up, rescue, next question, start level, weighted traps and XP", () => {
  let st = { level: 0, rightRow: 0, wrongRow: 0 };
  st = Lab.labStep(st, true); assert.equal(st.up, false);
  st = Lab.labStep(st, true); assert.deepEqual([st.up, st.level], [true, 1]);
  st = Lab.labStep(Lab.labStep({ level: 2, rightRow: 0 }, true), true); assert.deepEqual([st.up, st.level], [false, 2]);
  st = Lab.labStep({ level: 1, rightRow: 1 }, false); assert.equal(st.rescue, false); assert.equal(st.rightRow, 0);
  st = Lab.labStep(st, false); assert.deepEqual([st.rescue, st.level, st.wrongRow], [true, 1, 0]);
  const m = Lab.labMission("lab-distractor");
  const a = Lab.nextLabItem(m, 2, []); assert.equal(a.level, 2);
  const challenge = m.items.filter(it => it.level === 2).map(it => it.clip);
  assert.equal(Lab.nextLabItem(m, 2, challenge).level, 1);
  assert.notEqual(Lab.nextLabItem(m, 2, [], new Set([challenge[0]])).clip, challenge[0]);
  assert.equal(Lab.labStartLevel([], 1), 1);
  const h = [{ mode: "listening", text_id: "lab-distractor", created_at: "2026-10-29T09:00", answers: [{ skill: "Listening", lab: "x", level: 1, next: 2 }] },
    { mode: "listening", text_id: "lab-numbers", created_at: "2026-10-28T09:00", answers: [{ skill: "Listening", lab: "y", level: 0, next: 0 }] }];
  assert.equal(Lab.labStartLevel(h, 0), 2);
  assert.equal(Lab.labPeak(h[0].answers), 1);
  // A Challenge question right counts double, so the same caught count looks less weak.
  const easy = Lab.trapStats([{ answers: [{ skill: "Listening", trap: "synonym", first_try: false }, { skill: "Listening", trap: "synonym", first_try: true }] }]).find(t => t.trap === "synonym");
  const hard = Lab.trapStats([{ answers: [{ skill: "Listening", trap: "synonym", first_try: false }, { skill: "Listening", trap: "synonym", first_try: true, level: 2 }] }]).find(t => t.trap === "synonym");
  assert.deepEqual([easy.total, hard.total, easy.caught], [2, 2, 1]); assert.ok(hard.rate < easy.rate);
  assert.equal(Lab.labXP([{ skill: "Listening", support: "none", level: 2 }, { skill: "Listening", support: "none", level: 1 }]), 20 + 15 + 10);
});
