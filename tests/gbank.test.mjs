import { test } from "node:test";
import assert from "node:assert/strict";
import { GBLOCKS } from "../js/gengine.js";
import { BANK, blockLesson } from "../js/gbank.js";

test("every engine block has a lesson and at least 5 questions", () => {
  for (const id of Object.keys(GBLOCKS)) {
    const b = blockLesson(id);
    assert.ok(b && b.say && b.ex.length, id);
    assert.ok(b.items.length >= 5, id);
    b.items.forEach(it => { assert.ok(it.id && it.stem, id); assert.equal(it.opts.length, 3, it.id);
      assert.equal(new Set(it.opts.map(o => o.t)).size, 3, it.id); it.opts.slice(1).forEach(o => assert.ok(o.why, it.id)); });
  }
});
test("a wrong option's block is one the block builds on", () => {
  for (const [id, b] of Object.entries(BANK)) b.items.forEach(it => it.opts.slice(1).forEach(o => {
    if (o.b) assert.ok(GBLOCKS[id].pre.includes(o.b), `${it.id}: ${o.b}`); }));
});
test("a wrong option's why never gives the right answer away word for word", () => {
  for (const b of Object.values(BANK)) b.items.forEach(it => it.opts.slice(1).forEach(o => {
    assert.ok(!o.why.toLowerCase().includes(`: ${it.opts[0].t.toLowerCase()}.`) || it.opts[0].t.length < 4, `${it.id}: ${o.why}`); }));
});
test("the right option is usually not the longest", () => {
  const all = Object.values(BANK).flatMap(b => b.items), longest = all.filter(it => it.opts[0].t.length > Math.max(...it.opts.slice(1).map(o => o.t.length)));
  assert.ok(longest.length / all.length <= 0.5, `${longest.length} of ${all.length}`);
});
