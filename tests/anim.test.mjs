import { test } from "node:test";
import assert from "node:assert/strict";
import { ANIMS, buildTask, buildCheck } from "../js/anim.js";
import { GBLOCKS } from "../js/gengine.js";
import { BLOCKS } from "../js/glab.js";

test("every brick and Lab block has an animation with a caption per step", () => {
  for (const id of [...Object.keys(GBLOCKS), ...Object.keys(BLOCKS)]) {
    assert.ok(ANIMS[id] && ANIMS[id].length >= 2, id);
    ANIMS[id].forEach(f => { assert.ok(f.cap, id); f.w.split("|").forEach(x => assert.match(x.trim(), /^[\w-]+=[^=#]+(#(s|o|v|by|time|new|bad))?$/, `${id}: ${x}`)); });
  }
});
test("a tile id appears once per frame, so tiles can move", () => {
  for (const [id, A] of Object.entries(ANIMS)) A.forEach(f => { const ids = f.w.split("|").map(x => x.trim().split("=")[0]); assert.equal(new Set(ids).size, ids.length, id); });
});
test("Your turn: the goal sentence checks right, and no extra tile is also a goal tile", () => {
  for (const id of Object.keys(ANIMS)) { const t = buildTask(id); if (!t) continue;
    assert.ok(buildCheck(t.goal, t.goal), id); assert.ok(!buildCheck(t.goal, [...t.goal].reverse()) || t.goal.length < 2, id);
    t.extra.forEach(x => assert.ok(!t.goal.map(g => g.toLowerCase()).includes(x.toLowerCase()), `${id}: ${x}`)); }
});
test("scenes: every beat has a speaker from the cast and a line", async () => {
  const { SCENES } = await import("../js/scenes.js");
  for (const [id, sc] of Object.entries(SCENES)) { assert.ok(ANIMS[id], id); sc.beats.forEach(b => { assert.ok(["zip", "nova"].includes(b.who) && b.say && b.ms > 1000, id); }); }
});
