import { test } from "node:test";
import assert from "node:assert/strict";
import * as RL from "../js/rlab.js";
import * as Lab from "../js/lab.js";

test("every Reading Lab item: evidence and traps are in the text, options are distinct, wrong options say why", () => {
  assert.equal(RL.RLAB.length, 8);
  const ids = new Set();
  for (const m of RL.RLAB) {
    assert.ok(RL.RTRAPS[m.trap], m.id); assert.equal(m.teach.length, 2, m.id);
    for (const l of [0, 1, 2]) assert.ok(m.items.filter(it => it.level === l).length >= (l ? 4 : 5), `${m.id} level ${l}`);
    for (const it of m.items) {
      assert.ok(!ids.has(it.id) && it.id.startsWith("rlab-"), it.id); ids.add(it.id);
      const text = RL.passageText(it);
      assert.ok(text.includes(it.key), `${it.id}: key "${it.key}"`);
      for (const [t, label] of it.traps) { assert.ok(text.includes(t), `${it.id}: trap "${t}"`); assert.ok(label); }
      const opts = it.opts.map(o => o.t);
      assert.equal(new Set(opts).size, opts.length, `${it.id}: options`);
      assert.ok(opts.length >= 3 && opts.length <= 4, it.id);
      it.opts.slice(1).forEach(o => assert.ok(o.why, `${it.id}: why for "${o.t}"`));
      assert.ok(it.hint && it.stem, it.id);
      if (m.trap === "gap" || m.trap === "conv") assert.equal(text.split("___").length, 2, `${it.id}: one gap`);
      // The highlighted evidence and traps don't overlap, so every one of them shows.
      const marks = Lab.markLine(text, it.key, it.traps).filter(p => p.kind);
      assert.equal(marks.length, 1 + it.traps.length, `${it.id}: marks`);
    }
  }
});

test("the Lab engine picks Reading Lab items by id, new ones first", () => {
  const m = RL.rlabMission("rlab-scan");
  const a = Lab.nextLabItem(m, 1, [], new Set());
  assert.equal(a.level, 1);
  const b = Lab.nextLabItem(m, 1, [a.id], new Set());
  assert.notEqual(b.id, a.id);
  const seen = new Set(m.items.filter(x => x.level === 0).slice(0, 2).map(x => x.id));
  assert.ok(!seen.has(Lab.nextLabItem(m, 0, [], seen).id));
});

test("start level, seen items and the reading trap tracker come from saved answers", () => {
  const ans = (id, trap, level, first_try, extra = {}) => ({ skill: "Reading Lab", trap, rlab: id, level, first_try, ...extra });
  const history = [
    { mode: "vocab", text_id: "rlab-gaps", created_at: "2026-10-28", answers: [ans("rlab-gap-1", "gap", 0, false), ans("rlab-gap-2", "gap", 0, false, { next: 0 })] },
    { mode: "vocab", text_id: "rlab-scan", created_at: "2026-10-29", answers: [ans("rlab-scan-1", "scan", 0, true), ans("rlab-scan-s1", "scan", 1, true, { next: 2 })] },
    { mode: "vocab", text_id: "rain-u2", created_at: "2026-10-29", answers: [{ skill: "Vocabulary", word: "diet", first_try: true }] }];
  assert.equal(RL.rlabStartLevel([], 1), 1);
  assert.equal(RL.rlabStartLevel(history), 2);
  assert.deepEqual([...RL.seenRItems(history)].sort(), ["rlab-gap-1", "rlab-gap-2", "rlab-scan-1", "rlab-scan-s1"]);
  const st = Object.fromEntries(RL.rTrapStats(history).map(t => [t.trap, t]));
  assert.equal(st.gap.caught, 2); assert.equal(st.scan.caught, 0); assert.equal(st.scan.total, 2);
  assert.equal(RL.weakestRTrap(history), "gap");
  assert.equal(RL.rMissionForTrap("gap").id, "rlab-gaps");
  assert.equal(RL.rlabPeak(history[1].answers), 1);
  assert.ok(RL.isRLab("rlab-scan") && !RL.isRLab("lab-scan") && !Lab.isLab("rlab-scan"));
});
