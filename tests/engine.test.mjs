// Run with: npm test
import test from "node:test";
import assert from "node:assert/strict";
import * as E from "../js/engine.js";
import { PRACTICE_TEXTS, BASELINE, STRATEGY } from "../js/content.js";

const text = PRACTICE_TEXTS[0];

test("content: every slot has a question for each level, a strategy, and highlight text that exists", () => {
  for (const t of PRACTICE_TEXTS) {
    t.slots.forEach((s, i) => {
      assert.ok(STRATEGY[s.skill], `strategy for ${s.skill}`);
      assert.ok(t.levels.length >= 3 && t.levels.length <= 4);
      assert.equal(s.q.length, t.levels.length);
      t.levels.forEach(lv => assert.deepEqual(lv.paras.map(p => p[0]), t.levels[0].paras.map(p => p[0]), `paragraph letters in ${t.id}`));
      s.q.forEach((q, l) => {
        const para = t.levels[l].paras.find(p => p[0] === (q.para || s.para));
        assert.ok(para && para[1].includes(q.focus), `focus for slot ${i + 1} level ${l}`);
        if (q.type !== "short") assert.equal(q.opts.length, 4);
      });
      assert.ok(s.q[0].explain, `Easier explanation for slot ${i + 1}`);
    });
  }
  assert.equal(BASELINE.flatMap(b => b.qs).length, 12);
});

test("short answers: keyword groups count different points", () => {
  const q = text.slots[3].q[1];
  assert.equal(E.mark(q, "They forget things and feel anxious").ok, true);
  assert.deepEqual(E.mark(q, "they can't concentrate").hits, ["concentration"]);
  assert.equal(E.mark(q, "they can't concentrate").ok, false);
  assert.equal(E.mark(q, "tired").tooShort, true);
  assert.equal(E.shortHits("they will still be fine", q.groups).length, 0);   // "ill" must be a whole word
});

test("wrong once gives a hint, again gives the reread, then the level drops", () => {
  const r = E.newRun(text, 1);
  assert.equal(E.submit(text, r, false).outcome, "hint");
  assert.equal(E.submit(text, r, false).outcome, "reread");
  assert.equal(E.submit(text, r, false).outcome, "down");
  assert.equal(r.level, 0);
  assert.equal(E.submit(text, r, true).outcome, "correct");
  assert.equal(r.results[0].support, "easier");
});

test("second question missed in a row goes straight to the reread", () => {
  const r = E.newRun(text, 1);
  E.submit(text, r, false); E.submit(text, r, true); E.advance(text, r);
  assert.equal(E.submit(text, r, false).outcome, "reread");
});

test("on Easier, still wrong after the reread is explained and unscored", () => {
  const r = E.newRun(text, 0);
  E.submit(text, r, false); E.submit(text, r, false);
  assert.equal(E.submit(text, r, false).outcome, "explained");
  assert.equal(E.answerXP(r.results[0]), 0);
});

test("three right first time in a row moves up, with XP for the level up", () => {
  const r = E.newRun(text, 0);
  for (let i = 0; i < 3; i++) { E.submit(text, r, true); assert.equal(E.advance(text, r), i < 2 ? "next" : "up"); }
  assert.equal(r.level, 1);
  for (let i = 3; i < 8; i++) { E.submit(text, r, true); E.advance(text, r); }
  assert.equal(r.done, true);
  assert.equal(r.level, 2);
  // 3 x 10 (Easier) + 3 x 15 (Core) + 2 x 20 (Harder) + 20 finish + 2 x 25 level up
  assert.equal(E.runXP(r), 30 + 45 + 40 + 20 + 50);
  assert.equal(E.runXP(r, { replay: true }), 93);
});

test("baseline placement bands", () => {
  assert.deepEqual([0, 5, 6, 9, 10, 12].map(E.placement), [0, 0, 1, 1, 2, 2]);
});

test("weekly streak counts weeks with 2+ practice texts", () => {
  const now = new Date("2026-10-28T05:00:00Z");   // Wednesday
  const p = d => ({ mode: "practice", created_at: d });
  const h = [p("2026-10-13T03:00:00Z"), p("2026-10-14T03:00:00Z"), p("2026-10-20T03:00:00Z"), p("2026-10-22T03:00:00Z"), p("2026-10-27T03:00:00Z")];
  assert.deepEqual(E.weeklyStreak(h, now), { streak: 2, thisWeek: 1 });
  assert.equal(E.streakBonus(h, now), E.XP.streakWeek);
  assert.equal(E.weekKey("2026-10-25T18:00:00Z"), "2026-10-26");   // Sunday 18:00 UTC is Monday 01:00 in Vietnam
});

test("Challenge: Units 2 and 3 have a fourth level, reached after Harder or earned as a steady level", () => {
  const withC = PRACTICE_TEXTS.filter(t => t.levels.length === 4).map(t => t.unitNo);
  assert.equal(withC.length, 8);
  assert.ok(withC.every(u => u === 2 || u === 3));
  const t = PRACTICE_TEXTS.find(x => x.id === "camping");
  t.slots.forEach(s => { if (s.q[3].type === "short") assert.ok(s.q[3].groups.length >= s.q[2].groups.length && !("extra" in s.q[3])); });
  assert.equal(E.newRun(t, 3).level, 3, "a student with a steady C1 level starts on Challenge");
  const r = E.newRun(t, 2);
  for (let i = 0; i < 3; i++) { E.submit(t, r, true); E.advance(t, r); }
  assert.equal(r.level, 3);
  const u4 = PRACTICE_TEXTS.find(x => x.unitNo === 4);
  assert.equal(E.newRun(u4, 3).level, 2, "Unit 4 has no Challenge text");
  const r4 = E.newRun(u4, 2);
  for (let i = 0; i < 3; i++) { E.submit(u4, r4, true); E.advance(u4, r4); }
  assert.equal(r4.level, 2, "Unit 4 texts stop at Harder");
});

test("reading bands: eight CEFR steps from the text level and the score", () => {
  const ans = (level, right, n = 8) => Array.from({ length: n }, (_, i) => ({ skill: "Detail", level, first_try: i < right }));
  assert.equal(E.BANDS.length, 8);
  assert.equal(E.readingBand({ mode: "practice", level_end: 1, answers: ans(1, 5) }), 2);        // B1
  assert.equal(E.readingBand({ mode: "practice", level_end: 1, answers: ans(1, 6) }), 3);        // B1+
  // the server stores Challenge as Harder (2); the answers show the student finished on Challenge
  const ch = { mode: "practice", level_end: 2, answers: [...ans(2, 3, 3), ...ans(3, 5, 5)] };
  assert.equal(E.textLevel(ch), 3);
  assert.equal(E.readingBand(ch), 7);                                                           // C1+
  assert.equal(E.readingBand({ mode: "baseline", level_end: 1, score: 8, answers: ans(2, 8, 12) }), 3);
  assert.equal(E.readingBand({ mode: "baseline", level_end: 0, score: 2 }), 0);
  assert.equal(E.currentBand([{ mode: "baseline", level_end: 2, score: 12 }, { mode: "vocab", level_end: null }]), 5);
  assert.equal(E.currentBand([]), null);
  assert.ok(E.badges([{ mode: "practice", created_at: "2026-10-28T02:00:00Z", ...ch }]).some(b => b.name === "Challenger"));
});

import { CHECKS, checkDue, daysToCheck, CHECK_GAP_DAYS } from "../js/checks.js";
const day = n => new Date(Date.UTC(2026, 8, 1) + n * 86400e3).toISOString();
const prac = (lv, score, d, ans) => ({ mode: "practice", text_id: "sleep", level_end: lv, score, max_score: 8, created_at: day(d),
  answers: ans || Array.from({ length: 8 }, (_, i) => ({ skill: "Detail", level: lv, first_try: i < score })) });

test("steady level: the middle step of the last three readings", () => {
  assert.equal(E.steadyBand([]), null);
  const h = [prac(1, 8, 0), prac(1, 2, 1), prac(2, 8, 2)]; // B1+, B1, B2+
  assert.equal(E.steadyBand(h), 3, "middle of B1, B1+, B2+ is B1+");
  const good = [prac(2, 8, 0), prac(2, 8, 1), prac(2, 8, 2)]; // B2+ three times
  assert.equal(E.steadyBand([...good, prac(0, 1, 3)]), 5, "one bad day does not pull it down");
  assert.equal(E.steadyLevel(h), 1);
  assert.equal(E.steadyLevel([], 2), 2, "falls back before any reading");
  const vocab = { mode: "vocab", text_id: "vocab-u2", level_end: null, score: 5, max_score: 5, created_at: day(4), answers: [] };
  assert.equal(E.steadyBand([...h, vocab]), 3, "only reading counts");
});

test("level up: only when the steady level passes the best so far", () => {
  const h = [prac(1, 8, 0), prac(1, 8, 1), prac(1, 8, 2)]; // steady B1+
  assert.equal(E.levelUpAfter([], prac(1, 8, 0)), null, "no level up on the first reading");
  assert.equal(E.levelUpAfter(h, prac(2, 8, 3)), null, "one good Harder reading is not enough");
  const h2 = [...h, prac(2, 8, 3)];
  assert.deepEqual(E.levelUpAfter(h2, prac(2, 8, 4)), { from: 3, to: 5 });
  const back = [...h2, prac(2, 8, 4), prac(0, 0, 5), prac(0, 0, 6)]; // dropped down
  assert.equal(E.levelUpAfter(back, prac(1, 8, 7)), null, "climbing back to an old level is not a new level up");
  const names = E.badges([...h2, prac(2, 8, 4)]).map(b => b.name);
  assert.ok(names.includes("B1 reader") && names.includes("B2 reader") && !names.includes("C1 reader"));
});

test("Checkpoint checks: two new 16-question tests, due six weeks after the last one", () => {
  assert.equal(CHECKS.length, 2);
  CHECKS.forEach(c => {
    assert.deepEqual(c.passages.map(p => p.level), [0, 1, 2, 3]);
    c.passages.forEach(p => { assert.equal(p.qs.length, 4); p.qs.forEach(q => assert.equal(q.opts.length, 4)); });
  });
  const base = { mode: "baseline", text_id: "baseline", level_end: 1, score: 7, max_score: 12, created_at: day(0), answers: [] };
  assert.equal(checkDue([], new Date(day(100))), null, "needs the baseline first");
  assert.equal(checkDue([base], new Date(day(CHECK_GAP_DAYS - 1))), null);
  assert.equal(daysToCheck([base], new Date(day(CHECK_GAP_DAYS - 3))), 3);
  assert.equal(checkDue([base], new Date(day(CHECK_GAP_DAYS))).id, "check-1");
  const c1 = { ...base, text_id: "check-1", score: 12, max_score: 16, created_at: day(CHECK_GAP_DAYS) };
  assert.equal(checkDue([base, c1], new Date(day(CHECK_GAP_DAYS + 1))), null);
  assert.equal(checkDue([base, c1], new Date(day(2 * CHECK_GAP_DAYS))).id, "check-2");
  assert.equal(E.testBand("check-1", 16), 7);
  assert.equal(E.testBand("check-1", 12), 5);
  assert.equal(E.testBand("baseline", 12), 5);
  assert.equal(E.readingBand(c1), 5);
});

import { trailStops, trailHere, TRAIL_UNITS } from "../js/trail.js";
test("Road to Checkpoint: start, a stop and gate per unit, two check flags, finish", () => {
  const empty = trailStops([]);
  assert.equal(empty.length, 1 + 2 * TRAIL_UNITS.length + 2 + 1);
  assert.equal(empty[0].kind, "start"); assert.equal(empty.at(-1).kind, "finish");
  assert.equal(trailHere(empty), 0, "starts at the start");
  const h = [{ mode: "baseline", text_id: "baseline", score: 6, max_score: 12, answers: [] },
             { mode: "vocab", text_id: "mini-u2", score: 12, max_score: 16, answers: [] },
             { mode: "vocab", text_id: "boss-u1", score: 5, max_score: 12, answers: [] }];
  const s = trailStops(h), g1 = s.find(x => x.kind === "gate" && x.unit === 1), g2 = s.find(x => x.kind === "gate" && x.unit === 2);
  assert.ok(!g1.done && /Best 42%/.test(g1.sub), "below 70% is not passed");
  assert.ok(g2.done, "75% passes the gate");
  assert.equal(trailHere(s), s.indexOf(g2) + 1, "stands just after the furthest stop reached");
  assert.ok(!s.at(-1).done);
});

import { MINI, MINI_LISTENING, miniQuestions, miniBest, miniXP, MINI_PASS } from "../js/minitests.js";
import { VOCAB } from "../js/vocab.js";
import { GRAMMAR } from "../js/curriculum.js";
import { TIMES } from "../js/listening-times.js";
import { gateFor } from "../js/trail.js";
import { existsSync } from "node:fs";
test("unit mini tests: 16 questions in 4 parts, real unit words and grammar points, recorded audio", () => {
  for (const u of [2, 3]) {
    const Q = miniQuestions(u);
    assert.equal(Q.length, 16);
    assert.deepEqual([...new Set(Q.map(q => q.part))], ["reading", "listening", "vocab", "grammar"]);
    Q.forEach(q => { assert.equal(q.opts.length, 4); assert.equal(new Set(q.opts).size, 4, q.stem); });
    const words = VOCAB[u].flat().map(x => x[0]);
    MINI[u].vocab.forEach(v => { assert.ok(words.includes(v.word), v.word); assert.equal(v.opts[0], v.word); assert.equal(v.stem.split("___").length, 2); });
    MINI[u].grammar.forEach(g => assert.ok(GRAMMAR.some(p => p.id === g.point && p.unit === u), g.point));
    const L = MINI_LISTENING.find(l => l.id === MINI[u].listening.id);
    L.lines.forEach(([who]) => assert.ok(L.voices[who]));
    assert.equal((TIMES[L.id] || []).length, L.lines.length, "timings for " + L.id);
    assert.ok(existsSync(new URL(`../audio/listening/${L.id}.mp3`, import.meta.url)));
    assert.equal(gateFor(u).id, `mini-u${u}`);
  }
  assert.equal(gateFor(4).id, "boss-u4", "units without a mini test keep the final challenge");
  const h = [{ text_id: "mini-u2", score: 10, max_score: 16 }];
  assert.equal(miniBest(2, h), 10 / 16);
  assert.equal(miniXP(12, 16, h, 2), 12 * 5 + 40, "first pass bonus");
  assert.equal(miniXP(13, 16, [...h, { text_id: "mini-u2", score: 12, max_score: 16 }], 2), 13 * 5, "no bonus after passing");
  assert.ok(11 / 16 < MINI_PASS && 12 / 16 >= MINI_PASS);
});

test("every model answer in a short-answer explanation is accepted", () => {
  for (const t of PRACTICE_TEXTS) for (const s of t.slots) for (const q of s.q) {
    if (q.type !== "short" || !q.explain) continue;
    const list = q.explain.replace(/^[^:]*:\s*/, "").replace(/\.$/, "").split(/;/).map(x => x.trim()).filter(Boolean);
    for (const a of list) assert.ok(E.shortHits(a, q.groups).length, `${t.id}: "${a}"`);
  }
});

test("one point can't count twice when two groups share a label", () => {
  const groups = [{ label: "name the feeling", k: ["name"] }, { label: "name the feeling", k: ["label"] }];
  assert.deepEqual(E.shortHits("name and label the feeling", groups), ["name the feeling"]);
  assert.equal(E.mark({ type: "short", groups, need: 2 }, "name and label the feeling").ok, false);
});
