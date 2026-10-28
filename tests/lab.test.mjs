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
