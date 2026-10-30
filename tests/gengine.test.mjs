import test from "node:test";
import assert from "node:assert/strict";
import * as G from "../js/gengine.js";
import { BLOCKS as LAB } from "../js/glab.js";

test("the block map is a proper map: known blocks underneath, no loops, taught before what builds on it", () => {
  for (const [id, b] of Object.entries(G.GBLOCKS)) {
    assert.ok(b.name && [7, 8, 9].includes(b.stage) && b.first.length, id);
    b.pre.forEach(q => { assert.ok(G.GBLOCKS[q], `${id} builds on ${q}`); assert.ok(G.GBLOCKS[q].stage <= b.stage, `${q} is taught no later than ${id}`); });
    assert.ok(!G.underneath(id).slice(0, -1).includes(id), `${id} has no loop`);
  }
  const order = G.STRANDS[0].blocks;
  order.forEach((id, k) => G.GBLOCKS[id].pre.forEach(q => assert.ok(order.indexOf(q) < k, `${q} comes before ${id}`)));
  for (const id of ["v123", "pp", "sing-plural", "was-were", "doer", "active-passive", "progress", "past-cont"]) assert.ok(G.GBLOCKS[id] && LAB[id], `Grammar Lab block ${id} is in the map`);
});

const at = (d, answers) => ({ created_at: `2026-10-${String(d).padStart(2, "0")}T08:00:00Z`, answers });
const ok = (block, extra = {}) => ({ skill: "Grammar", eng: 1, block, first_try: true, support: "none", ...extra });
const miss = (block, b) => ({ skill: "Grammar", eng: 1, block, first_try: false, support: "explained", ...(b ? { b } : {}) });

test("mastery goes up with right answers, down with misses, and a miss can point at the block underneath", () => {
  let st = G.mastery([at(1, [ok("v123"), ok("v123"), ok("v123"), ok("v123"), ok("v123")])]);
  assert.ok(G.isMastered(st, "v123"));
  st = G.mastery([at(1, [ok("pp"), miss("pp", "v123")])]);
  assert.ok(G.pOf(st, "pp") < G.START_P + 0.1 && G.pOf(st, "v123") < G.START_P, "both go down");
  st = G.mastery([at(1, [ok("pres-passive"), ok("pres-passive")])]);
  assert.ok(G.pOf(st, "pp") > G.START_P, "right answers lift the blocks underneath a little");
  st = G.mastery([at(1, [{ skill: "Grammar", point: "3.3", glab: "p33-c1", first_try: true, support: "none" }])]);
  assert.ok(G.pOf(st, "past-cont-passive") > G.START_P, "Grammar Lab Prove it answers count");
});

test("the chooser starts at the bottom, follows the map, and is never limited by the class stage", () => {
  const st0 = G.mastery([]);
  assert.equal(G.nextBlock(st0), "v123");
  const f = G.nextBlock(st0, "passive", "S9 3.3");
  assert.ok(G.underneath("past-cont-passive").includes(f) && !G.GBLOCKS[f].pre.length, `a Stage 9 focus still starts with a missing foundation (${f})`);
  const all = id => [ok(id), ok(id), ok(id), ok(id), ok(id)];
  const base = ["v123", "ed-spell", "v2", "pp", "sing-plural", "was-were", "past-simple", "past-cont", "doer", "active-passive", "progress", "past-passive"];
  const st = G.mastery([at(1, base.flatMap(all))]);
  assert.equal(G.nextBlock(st, "passive", "S9 3.3"), "past-cont-passive", "focus on 3.3 jumps to the block taught there once it is ready");
  assert.equal(G.nextBlock(st), "ps-pc", "without a focus, the lowest ready block");
  const all25 = G.STRANDS[0].blocks.flatMap(all);
  assert.equal(G.nextBlock(G.mastery([at(1, all25)])), null);
  assert.deepEqual(G.strandProgress(G.mastery([at(1, all25)])), { done: 26, total: 26, stage: 9 });
});

test("mastered blocks come back for review after 1, 7 and 30 days", () => {
  const five = id => Array.from({ length: 5 }, () => ok(id));
  const st = G.mastery([at(1, five("v123"))]);
  const t = d => Date.parse(`2026-10-${String(d).padStart(2, "0")}T09:00:00Z`);
  assert.deepEqual(G.dueReviews(st, t(1)), []);
  assert.deepEqual(G.dueReviews(st, t(2)), ["v123"]);
  const st2 = G.mastery([at(1, five("v123")), at(3, [ok("v123")])]);
  assert.deepEqual(G.dueReviews(st2, t(5)), [], "after one review, the next is a week later");
  assert.deepEqual(G.dueReviews(st2, t(11)), ["v123"]);
});

test("dropping down goes to the block the mistakes point at", () => {
  const st = G.mastery([]);
  assert.equal(G.dropTo(st, "past-cont-passive", ["progress", "was-were", "progress"]), "progress");
  assert.ok(G.GBLOCKS["past-cont-passive"].pre.includes(G.dropTo(st, "past-cont-passive")));
});

test("the foundation scan knows the whole strand within 8 questions", () => {
  for (const top of Object.keys(G.GBLOCKS)) {
    const truth = new Set(G.underneath(top)), known = {}; let n = 0, id;
    while (n < G.PLACE_MAX && (id = G.placeProbe(known))) { G.placeMark(known, id, truth.has(id)); n++; }
    for (const [q, v] of Object.entries(known)) assert.equal(v, truth.has(q), `${top}: ${q}`);
    assert.ok(Object.keys(known).length >= 18, `${top}: ${Object.keys(known).length}`);
  }
});
test("a placement answer marks the bricks underneath as built and the ones above as not yet", () => {
  const h = [{ created_at: "2026-10-30T08:00:00Z", answers: [
    { skill: "Grammar", eng: 1, place: 1, block: "past-passive", first_try: true },
    { skill: "Grammar", eng: 1, place: 1, block: "past-perfect", first_try: false }] }];
  const st = G.mastery(h);
  ["past-passive", "pp", "v123", "past-simple"].forEach(id => assert.ok(G.isMastered(st, id), id));
  ["past-perfect", "past-perf-passive", "choose-tense"].forEach(id => assert.ok(!G.isMastered(st, id), id));
  assert.ok(G.placed(h));
});
test("today's build plans a new brick, reviews first, and never a brick twice", () => {
  const st = G.mastery([]), plan = G.planSession(st);
  assert.ok(plan.learn && G.GBLOCKS[plan.learn].pre.length === 0);
  const all = [...plan.reviews, plan.learn, ...plan.mix];
  assert.equal(new Set(all).size, all.length);
});
test("the tower draws every brick once and a crane over the next one", async () => {
  const T = await import("../js/tower.js"), st = G.mastery([]), svg = T.towerSVG(st, { next: "v123" });
  assert.equal((svg.match(/data-gbk=/g) || []).length, Object.keys(G.GBLOCKS).length);
  assert.ok(svg.includes("tw-crane") && svg.includes("tw-next"));
  assert.equal(T.rankOf(0)[1], "Apprentice"); assert.equal(T.rankOf(26)[1], "Architect");
});
