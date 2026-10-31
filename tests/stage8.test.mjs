// Stage 8 (Grade 7) content: the same checks as the Stage 9 tests, run with this device set to Stage 8.
import test from "node:test";
import assert from "node:assert/strict";
globalThis.localStorage = { getItem: k => (k === "ckpt-stage" ? "8" : null), setItem() {}, removeItem() {} };
const { STAGE } = await import("../js/stage.js");
const E = await import("../js/engine.js");
const P = await import("../js/practice.js");
const { PRACTICE_TEXTS, BASELINE, STRATEGY } = await import("../js/content.js");
const { GRAMMAR, OBJECTIVES, SEQUENCE, UNITS } = await import("../js/curriculum.js");
const { VOCAB } = await import("../js/vocab.js");
const { EXTRA } = await import("../js/vocab-extra.js");
const { FAMILIES } = await import("../js/families.js");
const { wrongNote } = await import("../js/feedback.js");
const { CHECKS } = await import("../js/checks.js");

test("the device is on Stage 8 and every content module follows it", () => {
  assert.equal(STAGE, 8);
  assert.equal(UNITS[4].title, "Advertising");
  assert.ok(PRACTICE_TEXTS.every(t => t.id.startsWith("s8-")), "only Stage 8 texts");
  assert.ok(P.unitWords(4).some(x => x.w === "endorsement"));
});

test("every unit has words and grammar, and grammar items are well formed", () => {
  SEQUENCE.filter(e => e.kind === "unit").forEach(e => {
    assert.ok(UNITS[e.unit] && VOCAB[e.unit], `unit ${e.unit}`);
    assert.ok(P.unitGrammar(e.unit).length >= 4, `grammar for unit ${e.unit}`);
  });
  GRAMMAR.forEach(g => {
    assert.ok(g.code === null || OBJECTIVES[g.code], `code for ${g.id}`);
    assert.equal(g.items.length, 6, `${g.id} has 6 items`);
    g.items.forEach((it, i) => {
      assert.equal(it.length, 5);
      assert.equal(new Set(it.slice(1)).size, 4, `unique options in ${g.id}: ${it[0]}`);
      if (it[0]) assert.equal(it[0].split("___").length - 1, 1, `one gap in ${g.id}: ${it[0]}`);
      [1, 2, 3].forEach(k => assert.ok((wrongNote(g.id, i, k) || "").length > 10, `note for ${g.id} item ${i + 1} option ${k}`));
    });
  });
});

test("words: a definition, one gap, no repeats in a unit; families and extras are well formed", () => {
  P.allWords().forEach(x => { assert.ok(x.def.length > 3, x.w); assert.equal(x.ex.split("___").length, 2, `one gap for ${x.w}`); });
  const words = P.allWords().map(x => x.w.toLowerCase() + x.unit);
  assert.equal(new Set(words).size, words.length, "no duplicate words within a unit");
  Object.entries(FAMILIES).forEach(([u, list]) => list.forEach(f => {
    assert.equal(f.length, 6); assert.equal(f[0].split("___").length, 2, f[0]); assert.equal(new Set(f.slice(1, 5)).size, 4, f[0]);
  }));
  const seen = new Set();
  Object.entries(EXTRA).forEach(([u, e]) => {
    assert.equal(e.stretch.length, 12, `unit ${u} stretch`); assert.equal(e.challenge.length, 12, `unit ${u} challenge`);
    const syl = new Set(P.unitWords(+u).map(x => x.w.toLowerCase()));
    [...e.stretch, ...e.challenge].forEach(([w, d, ex]) => {
      assert.ok(!syl.has(w.toLowerCase()), `${w} is already a unit ${u} word`); assert.ok(!seen.has(w), `${w} repeats`); seen.add(w);
      assert.equal(ex.split("___").length, 2, `one gap for ${w}`);
    });
  });
});

test("texts: every slot has a question for each level, a strategy, and highlight text that exists", () => {
  assert.ok(PRACTICE_TEXTS.length > 0);
  for (const t of PRACTICE_TEXTS) {
    assert.equal(t.slots.length, 8, `${t.id} has 8 slots`);
    t.slots.forEach((s, i) => {
      assert.ok(STRATEGY[s.skill], `strategy for ${s.skill}`);
      assert.equal(s.q.length, t.levels.length, `${t.id} slot ${i + 1}`);
      t.levels.forEach(lv => assert.deepEqual(lv.paras.map(p => p[0]), t.levels[0].paras.map(p => p[0]), `paragraph letters in ${t.id}`));
      s.q.forEach((q, l) => {
        const para = t.levels[l].paras.find(p => p[0] === (q.para || s.para));
        assert.ok(para && para[1].includes(q.focus), `${t.id} focus for slot ${i + 1} level ${l}: ${q.focus}`);
        if (q.type !== "short") { assert.equal(q.opts.length, 4); assert.equal(new Set(q.opts).size, 4); }
        else assert.ok(q.groups && q.groups.length >= q.need, `${t.id} groups for slot ${i + 1} level ${l}`);
      });
      assert.ok(s.q[0].explain, `Easier explanation for ${t.id} slot ${i + 1}`);
    });
  }
});

test("texts: model answers are accepted, two-part answers can ask, the right option isn't usually the longest", () => {
  let mcq = 0, longest = 0;
  for (const t of PRACTICE_TEXTS) for (const s of t.slots) for (const q of s.q) {
    if (q.type === "short") {
      if (q.explain) q.explain.replace(/^[^:]*:\s*/, "").replace(/\.$/, "").split(/;/).map(x => x.trim()).filter(Boolean)
        .forEach(a => assert.ok(E.shortHits(a, q.groups).length, `${t.id}: "${a}"`));
      if (q.groups.length === q.need && q.need > 1) assert.ok(q.groups.every(g => g.ask), `${t.id}: ${q.stem}`);
    } else { mcq++; if (q.opts[0].length > Math.max(...q.opts.slice(1).map(o => o.length))) longest++; }
  }
  assert.ok(longest / mcq <= 0.3, `right option longest in ${longest} of ${mcq}`);
});

test("unit words appear in the unit's texts", () => {
  for (const u of [...new Set(PRACTICE_TEXTS.map(t => t.unitNo))]) {
    const found = P.unitWords(u).filter(w => P.textExample(w));
    assert.ok(found.length >= P.unitWords(u).length / 3, `unit ${u}: ${found.length} of ${P.unitWords(u).length} words used in texts`);
  }
});
