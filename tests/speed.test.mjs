import { test } from "node:test";
import assert from "node:assert/strict";
const store = {}; globalThis.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
const SP = await import("../js/speed.js");

test("speed dial: normal by default, up to 30% slower, locked clips stay normal", () => {
  assert.equal(SP.getSpeed(), 1);
  assert.equal(Math.min(...SP.SPEEDS.map(s => s[0])), 0.7);
  SP.setSpeed(0.8);
  assert.equal(SP.getSpeed(), 0.8);
  assert.equal(SP.rateFor(true), 1);
  assert.deepEqual(SP.speedTag(), { speed: 0.8 });
  assert.deepEqual(SP.speedTag(true), {});
  const el = {}; SP.applySpeed(el); assert.equal(el.playbackRate, 0.8); assert.equal(el.preservesPitch, true);
  SP.applySpeed(el, true); assert.equal(el.playbackRate, 1);
  SP.setSpeed(5); assert.equal(SP.getSpeed(), 1, "unknown speeds fall back to normal");
});

test("3 right in a row at a slower speed suggests one step faster; a miss resets", () => {
  SP.setSpeed(0.8);
  SP.noteAnswer(true); SP.noteAnswer(true); assert.equal(SP.nudge(), null);
  SP.noteAnswer(false); SP.noteAnswer(true); SP.noteAnswer(true); assert.equal(SP.nudge(), null);
  SP.noteAnswer(true); assert.deepEqual(SP.nudge(), [0.85, "-15%"]);
  assert.ok(SP.speedHTML().includes("Ready to try"));
  SP.setSpeed(0.85); assert.equal(SP.nudge(), null);
  SP.setSpeed(1); [1, 2, 3].forEach(() => SP.noteAnswer(true)); assert.equal(SP.nudge(), null, "no nudge at normal speed");
});
