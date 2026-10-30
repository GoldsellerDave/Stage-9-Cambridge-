import test from "node:test";
import assert from "node:assert/strict";
import * as GL from "../js/glab.js";
import { GRAMMAR } from "../js/curriculum.js";
import { nextLabItem, labStep } from "../js/lab.js";

const choices = m => [...m.get, ...m.use.items, ...m.prove.filter(it => it.type !== "type"), { opts: m.spot.rules }, ...[...m.get, ...m.use.items].map(it => it.twin)];

test("every Grammar Lab mission is complete and points at a real grammar point", () => {
  const ids = new Set();
  for (const m of GL.GLAB) {
    assert.ok(GRAMMAR.some(g => g.id === m.point && g.unit === m.unit), m.id);
    assert.ok(m.scene.paras.some(p => /\[\[.+\]\]/.test(p)), `${m.id} scene lights up the grammar`);
    m.spot.sentences.forEach(x => assert.ok(x.bin >= 0 && x.bin < m.spot.bins.length, x.t));
    m.spot.bins.forEach((_, j) => assert.ok(m.spot.sentences.some(x => x.bin === j), `${m.id} bin ${j} used`));
    assert.equal(m.get.length, 4); assert.equal(m.use.items.length, 4);
    for (const lv of [0, 1, 2]) assert.equal(m.prove.filter(it => it.level === lv).length, lv ? 4 : 5, `${m.id} level ${lv}`);
    choices(m).forEach(q => { assert.ok(q.opts.length >= 3); q.opts.slice(1).forEach(o => assert.ok(o.why, `${m.id}: ${o.t} has a why`)); });
    m.prove.filter(it => it.type === "type").forEach(it => { assert.ok(it.accept.length && it.hint, it.id); assert.ok(it.stem.includes("___"), it.id); });
    assert.ok(m.rule, m.id);
    m.use.write.groups.forEach(g => assert.ok(g.ask && g.k.length, g.label));
    [...m.get, ...m.use.items, ...m.prove].forEach(it => { assert.ok(!ids.has(it.id), `unique ${it.id}`); ids.add(it.id); });
  }
});

test("every question has help: a hint, an explanation, and a question like it for Get it and Use it", () => {
  for (const m of GL.GLAB) {
    assert.ok(m.spot.hint && m.spot.explain, `${m.id} rule help`);
    assert.ok(m.use.write.frame.includes("___") && m.use.write.explain, `${m.id} sentence frame`);
    [...m.get, ...m.use.items, ...m.prove].forEach(it => { assert.ok(it.hint, `${it.id} hint`); assert.ok(it.explain, `${it.id} explain`); });
    [...m.get, ...m.use.items].forEach(it => { assert.ok(it.twin && it.twin.explain && it.twin.stem, `${it.id} twin`);
      assert.ok(!it.twin.opts.some(o => o.t === it.opts[0].t), `${it.id} twin is a new question`); });
  }
});

test("the right option is not usually the longest", () => {
  const qs = GL.GLAB.flatMap(choices), longest = qs.filter(q => q.opts.every((o, k) => !k || o.t.length < q.opts[0].t.length)).length;
  assert.ok(longest / qs.length <= 0.5, `${longest} of ${qs.length}`);
});

test("model sentences pass their own keyword check, and one-word answers are accepted", async () => {
  const E = await import("../js/engine.js");
  for (const m of GL.GLAB) {
    const w = m.use.write; assert.ok(E.mark({ type: "short", groups: w.groups, need: w.need }, w.model).ok, m.id);
    m.prove.filter(it => it.type === "type").forEach(it => { assert.ok(GL.typedOk(it, it.accept[0][0].toUpperCase() + it.accept[0].slice(1) + ".")); assert.ok(!GL.typedOk(it, "zzz")); });
  }
});

test("Prove it runs 6 questions on the Lab engine without repeats", () => {
  for (const m of GL.GLAB) for (const start of [0, 1, 2]) {
    let st = { level: start }, used = [];
    for (let i = 0; i < GL.GLAB_LEN; i++) { const it = nextLabItem({ items: m.prove }, st.level, used); assert.ok(it); used.push(it.id); st = labStep(st, i % 3 !== 2); }
    assert.equal(new Set(used).size, GL.GLAB_LEN);
  }
});

test("XP and start level", () => {
  assert.equal(GL.glabXP([]), GL.XP_GLAB.finish);
  const r = [{ skill: "Grammar Lab", step: "spot", first_try: true, support: "none" }, { skill: "Grammar Lab", step: "write", first_try: false, support: "hint" },
    { skill: "Grammar", glab: "p24-c1", level: 2, first_try: true, support: "none", next: 2 }];
  assert.equal(GL.glabXP(r), 3 + 10 + 20 + 10);
  assert.equal(GL.glabXP([{ skill: "Grammar Lab", step: "get", first_try: false, support: "twin" }, { skill: "Grammar Lab", step: "write", first_try: false, support: "frame" }]),
    GL.XP_GLAB.twin + GL.XP_GLAB.frame + GL.XP_GLAB.finish);
  assert.equal(GL.glabStartLevel([{ text_id: "glab-2.4", created_at: "2026-10-30", answers: r }], 0), 2);
  assert.equal(GL.glabStartLevel([], 1), 1);
});

test("grammar words in Lab text open an explanation, and every mission has a verb helper", () => {
  for (const m of GL.GLAB) {
    assert.ok(GL.VERBS[m.id] && GL.VERBS[m.id].length >= 6, m.id);
    const text = [m.rule, m.spot.hint, m.spot.explain, m.use.write.stem, ...[...m.get, ...m.use.items, ...m.prove].flatMap(it => [it.hint, it.explain, ...(it.opts || []).map(o => o.why || "")])].join(" ");
    for (const w of text.match(GL.TERM_RE) || []) assert.ok(GL.TERMS[GL.termKey(w)], w);
  }
});
