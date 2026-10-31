// Stage 8 listening, mini tests, Reading Lab and Grammar Lab: the same checks as the Stage 9 tests, with the device on Stage 8.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
globalThis.localStorage = { getItem: k => (k === "ckpt-stage" ? "8" : null), setItem() {}, removeItem() {} };
const { STAGE } = await import("../js/stage.js");
const P = await import("../js/practice.js");
const Lab = await import("../js/lab.js");
const RL = await import("../js/rlab.js");
const LIVE = await import("../js/listening.js");
const MT = await import("../js/minitests.js");
// The scripts themselves; the app only shows the ones that have been recorded.
const { LISTENING } = await import("../js/s8/listening.js");
const { MINI, MINI_LISTENING } = await import("../js/s8/minitests.js");
const { TIMES } = await import("../js/listening-times.js");
const { VOCAB } = await import("../js/vocab.js");
const { GRAMMAR } = await import("../js/curriculum.js");
const { gateFor } = await import("../js/trail.js");
// Recordings are made separately (tools/make_listening_audio.py --google); a task or mini test shows once it has one.
const recorded = id => existsSync(new URL(`../audio/listening/${id}.mp3`, import.meta.url)) && !!TIMES[id];

test("Stage 8 listening: four tasks per unit, cues, answers, trap tags, timings once recorded", () => {
  assert.equal(STAGE, 8);
  for (const u of [2, 3, 4]) assert.equal(LISTENING.filter(t => t.unitNo === u).length, 4, `unit ${u}`);
  assert.equal(new Set(LISTENING.map(t => t.id)).size, LISTENING.length);
  LISTENING.forEach(t => {
    assert.ok(t.id.startsWith("l8-"), t.id);
    t.lines.forEach(([who]) => assert.ok(t.voices[who], `voice for ${who} in ${t.id}`));
    if (recorded(t.id)) assert.equal((TIMES[t.id] || []).length, t.lines.length, `timings for ${t.id}`);
    assert.equal(Lab.UNIT_TRAPS[t.id].length, t.qs.length, `trap tags for ${t.id}`);
    Lab.UNIT_TRAPS[t.id].forEach(tag => assert.ok(tag === null || Lab.TRAPS[tag], tag));
    t.qs.forEach((q, i) => {
      const [a, b] = P.cueLines(t, q);
      assert.ok(a >= 0 && b >= a, `cue for ${t.id} q${i + 1}`);
      assert.ok(q.hint && q.explain, `${t.id} q${i + 1} help`);
      if (q.type === "gap") { assert.equal(q.stem.split("___").length, 2); q.answers.forEach(x => assert.ok(P.listenCorrect(q, x))); }
      else if (t.statements) assert.ok(q.answer >= 0 && q.answer < t.statements.length);
      else { assert.equal(q.opts.length, 4); assert.equal(new Set(q.opts).size, 4, `${t.id} q${i + 1}`); }
    });
    if (t.statements) assert.equal(new Set(t.qs.map(q => q.answer)).size, t.qs.length, `each statement used once in ${t.id}`);
  });
  const mcq = LISTENING.flatMap(t => t.qs.filter(q => q.opts)), longest = mcq.filter(q => q.opts[0].length > Math.max(...q.opts.slice(1).map(o => o.length))).length;
  assert.ok(longest / mcq.length <= 0.5, `right option longest in ${longest} of ${mcq.length}`);
  assert.deepEqual(LIVE.LISTENING.map(t => t.id), LISTENING.filter(t => recorded(t.id)).map(t => t.id), "only recorded tasks show");
});

test("Stage 8 mini tests: 16 questions, real unit words and grammar points, a recording for each", () => {
  for (const u of [2, 3, 4]) {
    const m = MINI[u]; assert.equal(m.id, `mini8-u${u}`); const Q = [...m.reading.qs.map(q => ({ ...q, part: "reading" })), ...m.listening.qs.map(q => ({ ...q, part: "listening" })),
      ...m.vocab.map(q => ({ ...q, part: "vocab" })), ...m.grammar.map(q => ({ ...q, part: "grammar" }))];
    assert.equal(Q.length, 16);
    assert.deepEqual([...new Set(Q.map(q => q.part))], ["reading", "listening", "vocab", "grammar"]);
    Q.forEach(q => { assert.equal(q.opts.length, 4); assert.equal(new Set(q.opts).size, 4, q.stem); });
    const words = VOCAB[u].flat().map(x => x[0]);
    MINI[u].vocab.forEach(v => { assert.ok(words.includes(v.word), v.word); assert.equal(v.opts[0], v.word); assert.equal(v.stem.split("___").length, 2); });
    MINI[u].grammar.forEach(g => assert.ok(GRAMMAR.some(p => p.id === g.point && p.unit === u), g.point));
    const L = MINI_LISTENING.find(l => l.id === MINI[u].listening.id);
    assert.ok(L && L.id.startsWith("m8-"), `recording for unit ${u}`);
    L.lines.forEach(([who]) => assert.ok(L.voices[who]));
    if (recorded(L.id)) { assert.equal(TIMES[L.id].length, L.lines.length, "timings for " + L.id); assert.equal(MT.miniQuestions(u).length, 16); assert.equal(gateFor(u).id, `mini8-u${u}`); }
    else assert.ok(!MT.MINI[u] && gateFor(u).id !== `mini8-u${u}`, `no mini test until unit ${u} is recorded`);
  }
});

test("Stage 8 Reading Lab: 6 questions per mission per unit (2 at each level), evidence and traps in the text", () => {
  assert.deepEqual(RL.RLAB_UNITS, [2, 3, 4]);
  const ids = new Set();
  let all = 0, longest = 0;
  for (const m of RL.RLAB) {
    for (const u of RL.RLAB_UNITS) for (const l of [0, 1, 2]) assert.ok(m.items.filter(it => it.u === u && it.level === l).length >= 2, `${m.id} unit ${u} level ${l}`);
    for (const it of m.items) {
      assert.ok(!ids.has(it.id) && it.id.startsWith("r8-"), it.id); ids.add(it.id);
      const text = RL.passageText(it);
      assert.ok(text.includes(it.key), `${it.id}: key "${it.key}"`);
      for (const [t, label] of it.traps) { assert.ok(text.includes(t), `${it.id}: trap "${t}"`); assert.ok(label); }
      const opts = it.opts.map(o => o.t);
      assert.equal(new Set(opts).size, opts.length, `${it.id}: options`);
      assert.ok(opts.length >= 3 && opts.length <= 4, it.id);
      it.opts.slice(1).forEach(o => assert.ok(o.why, `${it.id}: why for "${o.t}"`));
      assert.ok(it.hint && it.stem, it.id);
      if (m.trap === "gap" || m.trap === "conv") assert.equal(text.split("___").length, 2, `${it.id}: one gap`);
      assert.equal(Lab.markLine(text, it.key, it.traps).filter(p => p.kind).length, 1 + it.traps.length, `${it.id}: marks`);
      if (!/^Paragraph |^[A-D]: /.test(opts[0])) { all++; if (opts.slice(1).every(o => o.length < opts[0].length)) longest++; }
    }
    // A unit's mission runs 6 questions from that unit only.
    for (const u of RL.RLAB_UNITS) {
      const um = RL.unitMission(m, u), used = [];
      for (let k = 0; k < 6; k++) { const it = Lab.nextLabItem(um, k % 3, used, new Set()); assert.equal(it.u, u); used.push(it.id); }
    }
  }
  assert.ok(longest / all <= 0.5, `right option longest in ${longest} of ${all}`);
  assert.equal(RL.rItemUnit("r8-scan-4-1"), 4);
});

const GL = await import("../js/glab.js");
const E = await import("../js/engine.js");
const choices = m => [...m.get, ...m.use.items, ...m.prove.filter(it => it.type !== "type"), { opts: m.spot.rules }, ...[...m.get, ...m.use.items].map(it => it.twin)];
test("Stage 8 Grammar Lab: one complete mission per unit, with help, blocks and a verb helper", () => {
  assert.deepEqual(GL.GLAB.map(m => m.unit), [2, 3, 4]);
  const ids = new Set(), under = id => [id, ...GL.BLOCKS[id].kids.flatMap(under)];
  for (const m of GL.GLAB) {
    assert.ok(m.id.startsWith("glab-8-") && GL.isGLab(m.id), m.id);
    assert.ok(GRAMMAR.some(g => g.id === m.point && g.unit === m.unit), m.id);
    assert.ok(m.scene.paras.some(p => /\[\[.+\]\]/.test(p)), `${m.id} scene lights up the grammar`);
    m.spot.bins.forEach((_, j) => assert.ok(m.spot.sentences.some(x => x.bin === j), `${m.id} bin ${j} used`));
    assert.equal(m.get.length, 4); assert.equal(m.use.items.length, 4);
    for (const lv of [0, 1, 2]) assert.equal(m.prove.filter(it => it.level === lv).length, lv ? 4 : 5, `${m.id} level ${lv}`);
    choices(m).forEach(q => { assert.ok(q.opts.length >= 3); q.opts.slice(1).forEach(o => assert.ok(o.why, `${m.id}: ${o.t} has a why`)); });
    m.prove.filter(it => it.type === "type").forEach(it => { assert.ok(it.accept.length && it.hint && it.stem.includes("___"), it.id);
      assert.ok(GL.typedOk(it, it.accept[0][0].toUpperCase() + it.accept[0].slice(1) + ".")); });
    assert.ok(m.spot.hint && m.spot.explain, `${m.id} rule help`);
    const w = m.use.write; assert.ok(w.frame.includes("___") && w.explain, `${m.id} frame`);
    assert.ok(E.mark({ type: "short", groups: w.groups, need: w.need }, w.model).ok, `${m.id} model passes`);
    assert.ok(!E.mark({ type: "short", groups: w.groups, need: w.need }, "I like our school a lot.").ok, `${m.id} needs the grammar`);
    [...m.get, ...m.use.items, ...m.prove].forEach(it => { assert.ok(!ids.has(it.id), `unique ${it.id}`); ids.add(it.id); assert.ok(it.hint && it.explain, `${it.id} help`); });
    [...m.get, ...m.use.items].forEach(it => { assert.ok(it.twin && it.twin.explain, `${it.id} twin`); assert.ok(!it.twin.opts.some(o => o.t === it.opts[0].t), `${it.id} twin is new`); });
    assert.ok(GL.VERBS[m.id] && GL.VERBS[m.id].length >= 6, m.id);
    const text = [m.rule, m.spot.hint, m.spot.explain, w.stem, ...[...m.get, ...m.use.items, ...m.prove].flatMap(it => [it.hint, it.explain, ...(it.opts || []).map(o => o.why || "")])].join(" ");
    for (const t of text.match(GL.TERM_RE) || []) assert.ok(GL.TERMS[GL.termKey(t)], t);
    const tree = new Set(GL.MISSION_BLOCKS[m.id].flatMap(under));
    [...m.get, ...m.use.items, ...m.prove, ...[...m.get, ...m.use.items].map(it => it.twin)]
      .forEach(it => it.type === "type" ? assert.ok(tree.has(it.b), `${it.id} typed block`) : it.opts.slice(1).forEach(o => assert.ok(tree.has(o.b), `${m.id}: ${o.t} → ${o.b}`)));
    for (const start of [0, 1, 2]) { let st = { level: start }; const used = [];
      for (let i = 0; i < GL.GLAB_LEN; i++) { const it = Lab.nextLabItem({ items: m.prove }, st.level, used); used.push(it.id); st = Lab.labStep(st, i % 3 !== 2); }
      assert.equal(new Set(used).size, GL.GLAB_LEN); }
  }
  const qs = GL.GLAB.flatMap(choices), longest = qs.filter(q => q.opts.every((o, k) => !k || o.t.length < q.opts[0].t.length)).length;
  assert.ok(longest / qs.length <= 0.5, `right option longest in ${longest} of ${qs.length}`);
});
