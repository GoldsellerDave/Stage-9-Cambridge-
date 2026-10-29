import test from "node:test";
import assert from "node:assert/strict";
import * as G from "../js/games.js";
import * as P from "../js/practice.js";
import { VOCAB } from "../js/vocab.js";

test("Word Rain has enough words in every unit", () => {
  Object.keys(VOCAB).forEach(u => {
    const pool = G.rainPool(+u);
    assert.ok(pool.length >= 8, `unit ${u}`);
    assert.equal(new Set(pool.map(x => x.w)).size, pool.length, `no repeated words in unit ${u}`);
  });
});

test("Word Train words have one clear word class", () => {
  Object.keys(VOCAB).forEach(u => {
    const pool = G.trainPool(+u), st = G.trainStations(pool);
    assert.ok(pool.length >= 10, `unit ${u} has ${pool.length}`);
    assert.ok(st.length >= 3, `unit ${u} stations`);
    pool.forEach(x => {
      assert.ok(G.STATIONS.includes(x.pos), x.w);
      assert.ok(!/ing$/.test(x.w) && !["respect", "monitor", "permit", "challenge"].includes(x.w), x.w);
    });
  });
  const u1 = Object.fromEntries(G.trainPool(1).map(x => [x.w, x.pos]));
  assert.equal(u1.ambitiously, "adverb"); assert.equal(u1.psychologist, "noun"); assert.equal(u1.communicate, "verb");
});

test("game XP stops at the daily cap, and best scores come from saved points", () => {
  const now = new Date("2026-10-28T05:00:00Z");
  const h = (id, xp, points, at = "2026-10-28T02:00:00Z") => ({ text_id: id, xp, created_at: at, answers: [{ skill: "Game score", points }] });
  assert.equal(G.gameXP(12, [], now), 17);
  assert.equal(G.gameXP(12, [h("rain-u3", 20, 300)], now), 10);
  assert.equal(G.gameXP(12, [h("rain-u3", 20, 300), h("train-u3", 10, 100)], now), 0);
  assert.equal(G.gameXP(12, [h("rain-u3", 30, 300, "2026-10-27T02:00:00Z")], now), 17, "yesterday does not count");
  assert.equal(G.gameXP(40, [], now), G.GAME_XP_DAY);
  assert.equal(G.bestScore([h("rain-u3", 5, 120), h("rain-u3", 5, 340), h("train-u3", 5, 900)], "rain-u3"), 340);
});

test("missed rain words are saved for the word review", () => {
  const a = G.gameAnswers("rain", { points: 50, level: 2, words: [{ w: "ambition", hit: true }, { w: "stereotype", hit: false }] }, 1);
  assert.deepEqual(a[0], { skill: "Game score", game: "rain", points: 50, level: 2 });
  assert.deepEqual(a[2], { skill: "Word game", word: "stereotype", unit: 1, first_try: false });
  const due = P.wordsToReview([{ created_at: "2026-10-27T02:00:00Z", answers: a }], new Date("2026-10-27T05:00:00Z")).map(x => x.w);
  assert.deepEqual(due, ["stereotype"], "the missed word is due, the caught word is not");
  assert.equal(G.levelAfter(0), 1); assert.equal(G.levelAfter(5), 2); assert.equal(G.levelAfter(999), 8);
});

test("Speed Read has paragraph questions for every unit with texts", () => {
  [2, 3, 4].forEach(u => {
    const texts = G.speedTexts(u);
    [0, 1, 2].forEach(lv => {
      const items = G.speedItems(texts, lv);
      assert.ok(items.length >= G.SPEED_ROUND, `unit ${u} level ${lv}: ${items.length}`);
      items.forEach(x => {
        assert.ok(x.words.length > 20, `${x.text} ${x.para}`);
        assert.equal(x.q.opts.length, 4, `${x.text} ${x.skill}`);
        assert.ok(!["Main idea", "Writer's view"].includes(x.skill));
      });
    });
  });
  assert.equal(G.speedTexts(1).length, 0);
});

test("Speed Read speeds up after two right and slows down after a wrong answer", () => {
  assert.equal(G.nextSpeed(1, true, 1), 1);
  assert.equal(G.nextSpeed(1, true, 2), 2);
  assert.equal(G.nextSpeed(1, false, 0), 0);
  assert.equal(G.nextSpeed(0, false, 0), 0);
  assert.equal(G.nextSpeed(G.SPEEDS.length - 1, true, 5), G.SPEEDS.length - 1);
  assert.deepEqual(G.chunks("a b c d e f g".split(" ")), ["a b c", "d e f", "g"]);
  assert.equal(G.lastSpeed([], "speed-u2"), 130);
  assert.equal(G.lastSpeed([{ text_id: "speed-u2", created_at: "2026-10-27T01:00:00Z", answers: [{ skill: "Game score", wpm: 200 }] },
                            { text_id: "speed-u2", created_at: "2026-10-26T01:00:00Z", answers: [{ skill: "Game score", wpm: 100 }] }], "speed-u2"), 200);
  const a = G.gameAnswers("speed", { points: 40, level: 160, top: 160, words: [{ hit: true, skill: "Detail", text: "sleep", para: "C", wpm: 130 }] }, 2);
  assert.equal(a[0].wpm, 160); assert.deepEqual(a[1], { skill: "Speed reading", sub: "Detail", text: "sleep", para: "C", wpm: 130, first_try: true });
});

test("Trap Dodger has clips with audio times for every level", () => {
  [0, 1, 2].forEach(t => {
    const pool = G.dodgePool(t);
    assert.ok(pool.length >= 20, `tier ${t} has ${pool.length}`);
    pool.forEach(x => {
      assert.equal(x.level || 0, t);
      assert.ok(x.stem && x.key && x.trap, x.clip);
      assert.ok(x.opts.length >= 3 && x.opts.slice(1).every(o => o.why), `${x.clip}: every trap bubble says why`);
      assert.ok(G.clipSeconds(x.clip) > 1 && G.clipSeconds(x.clip) < 30, x.clip);
    });
  });
});

test("Trap Dodger levels, clips and points", () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(G.dodgeTier), [0, 0, 1, 1, 2, 2]);
  assert.deepEqual([0, 1, 2].map(G.dodgeLevelFor), [1, 3, 5]);
  assert.equal(G.dodgeLevel(1, 0), 1); assert.equal(G.dodgeLevel(1, 3), 2); assert.equal(G.dodgeLevel(5, 9), G.DODGE_MAX);
  const used = [];
  for (let i = 0; i < 40; i++) { const x = G.dodgeItem(2, used); assert.ok(!used.includes(x.clip) || used.length >= 83); used.push(x.clip); }
  assert.ok(used.slice(0, 24).every(c => G.dodgePool(2).some(x => x.clip === c)), "Challenge first, then easier clips");
  assert.ok(G.dodgeGain(0, 0, 1) > G.dodgeGain(0, 0.9, 1), "earlier pops score more");
  assert.ok(G.dodgeGain(2, 0.5, 1) > G.dodgeGain(0, 0.5, 1), "harder clips score more");
  assert.ok(G.isGame("dodge-u3"));
});

test("Trap Dodger answers feed the trap tracker", async () => {
  const Lab = await import("../js/lab.js");
  const R = { points: 50, level: 2, words: [{ clip: "lab-dist-1", trap: "distractor", tier: 0, hit: false, picked: "basketball" }, { clip: "lab-syn-1", trap: "synonym", tier: 0, hit: true }] };
  const answers = G.gameAnswers("dodge", R, 3);
  assert.equal(answers[0].skill, "Game score");
  assert.deepEqual(answers[1], { skill: "Trap game", clip: "lab-dist-1", trap: "distractor", level: 0, first_try: false, picked: "basketball" });
  const s = Object.fromEntries(Lab.trapStats([{ answers }]).map(t => [t.trap, t]));
  assert.equal(s.distractor.caught, 1); assert.equal(s.synonym.total, 1);
});

test("Trap Dodger plays clips the student hasn't heard before repeating any", () => {
  const h = (at, clips) => ({ created_at: at, answers: clips.map(clip => ({ skill: "Trap game", clip, trap: "distractor", first_try: true })) });
  const pool = G.dodgePool(0).map(x => x.clip);
  const history = [h("2026-10-28T02:00:00Z", pool.slice(0, 10)), h("2026-10-29T02:00:00Z", pool.slice(10, 20)),
    { created_at: "2026-10-29T03:00:00Z", answers: [{ skill: "Listening", lab: pool[20], trap: "synonym", first_try: true }] }];
  const seen = G.dodgeSeen(history);
  assert.equal(seen.size, 21);
  const used = [];
  for (let i = 0; i < 14; i++) used.push(G.dodgeItem(0, used, Math.random, seen).clip);
  assert.ok(used.every(c => !seen.has(c)), "the 14 never-heard Core clips come first");
  for (let i = 0; i < 10; i++) used.push(G.dodgeItem(0, used, Math.random, seen).clip);
  assert.deepEqual(new Set(used.slice(14)), new Set(pool.slice(0, 10)), "then the clips heard longest ago");
});

test("Trap Dodger brings missed clips back until they are right", () => {
  const pool = G.dodgePool(0).map(x => x.clip);
  const h = (at, list) => ({ created_at: at, answers: list.map(([clip, ok, picked]) => ({ skill: "Trap game", clip, trap: "synonym", first_try: ok, ...(picked ? { picked } : {}) })) });
  const history = [h("2026-10-28T02:00:00Z", [[pool[0], false, "x"], [pool[1], false], [pool[2], true]]), h("2026-10-29T02:00:00Z", [[pool[1], true]])];
  const log = G.dodgeLog(history);
  assert.equal(log.length, 3);
  const r1 = log.find(r => r.clip === pool[1]);
  assert.deepEqual([r1.tries, r1.right, r1.last], [2, 1, true]);
  assert.deepEqual(log.find(r => r.clip === pool[0]).picked, ["x"]);
  assert.deepEqual([...G.dodgeMissed(history)], [pool[0]]);
  assert.equal(G.dodgeItem(0, [], Math.random, G.dodgeSeen(history), G.dodgeMissed(history)).clip, pool[0], "the missed clip comes first");
});
