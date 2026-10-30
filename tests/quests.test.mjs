import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import * as Q from "../js/quests.js";
import { GBLOCKS, mastery } from "../js/gengine.js";
import { CUTS } from "../js/scenes.js";
import { SCENE_AUDIO } from "../js/scene-audio.js";

const right = (blocks, t = 0) => blocks.map((block, i) => ({ created_at: new Date(Date.UTC(2026, 9, 1, 0, 0, t + i)).toISOString(),
  answers: Array.from({ length: 4 }, () => ({ skill: "Grammar", eng: 1, block, item: "x", first_try: true, support: "none" })) }));

test("every quest level is a real brick, with a power and a cutscene with voices", () => {
  const seen = new Set();
  for (const q of Q.QUESTS) {
    assert.equal(q.levels.length, 3, q.id);
    q.levels.forEach(([b]) => { assert.ok(GBLOCKS[b], b); assert.ok(!seen.has(b), `${b} in two quests`); seen.add(b); });
    assert.ok(q.power && q.power.id && q.power.icon, q.id);
    assert.ok(CUTS[q.id], q.id);
    CUTS[q.id].beats.forEach((b, k) => { assert.ok(["zip", "nova"].includes(b.who) && b.say && b.ms > 1000, q.id);
      assert.ok(SCENE_AUDIO[`${q.id}-${k}`] && existsSync(`audio/scenes/${q.id}-${k}.mp3`), `${q.id}-${k} voice`); });
    assert.ok(CUTS[q.id].stage.includes("%%ME%%"), `${q.id} has the hero`);
  }
});

test("quests open in order and a level is cleared by mastering its brick", () => {
  let st = mastery([]);
  assert.deepEqual(Q.QUESTS.map((q, i) => Q.questState(st, i).open), [true, false, false]);
  assert.equal(Q.questState(st, 0).at, 0);
  st = mastery(right(["past-simple"]));
  assert.deepEqual(Q.questState(st, 0).done, [true, false, false]);
  assert.equal(Q.questState(st, 0).at, 1);
  st = mastery(right(Q.QUESTS[0].levels.map(l => l[0])));
  assert.ok(Q.questState(st, 0).cleared && Q.questState(st, 1).open && !Q.questState(st, 2).open);
  assert.deepEqual(Q.powersOf(st).map(p => p.id), ["rewind"]);
});

test("hero looks are made safe and locked gear comes off", () => {
  assert.deepEqual(Q.cleanHero(null), Q.DEFAULT_HERO);
  const h = Q.cleanHero({ skin: 99, hair: "<x>", hairCol: -1, shirt: 2, gear: { head: "crown", face: "shades", back: "cape" } }, 400);
  assert.deepEqual(h, { skin: 0, hair: "short", hairCol: 0, shirt: 2, gear: { head: null, face: "shades", back: null } });
  assert.equal(Q.cleanHero({ gear: { head: "cape" } }, 9999).gear.head, null, "gear only fits its slot");
  assert.ok(Q.heroSVG(h, { powers: [{ id: "rewind" }] }).includes("hr-aura"));
});
