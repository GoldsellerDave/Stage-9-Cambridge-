// Escape rooms: one per unit, three rooms in a row. Each room hides three puzzles (the student taps an object to open one);
// every puzzle solved gives one letter or number of the room's lock code. Words, the reading and the grammar come from the unit.
// Nothing here draws the page: makeEscape builds a game from the unit content and the student's tier, and the
// helpers below mark answers, keep the time and work out the result. js/student.js draws it (solo play).
import { unitWords, unitGrammar, TIERS } from "./practice.js";
import { extraWords } from "./vocab-extra.js";
import { STAGE } from "./stage.js";
import { ESCAPES as ESCAPES8 } from "./s8/escape.js";

export const ESCAPE_PENALTY = { wrong: 15, hint: 30, code: 30, event: 30, torch: 20, final: 60 };   // seconds added to the escape time
export const ESCAPE_XP = { first: 3, escape: 10, firstEscape: 20, key: 5 };
// The guard comes back after 12 minutes (escape time, so penalties bring him closer). Caught students still finish,
// without the escape bonus. Stars for the time: 3 up to 6 minutes, 2 up to 9, 1 before the guard.
export const GUARD_SECONDS = 720, STAR_TIMES = [360, 540];
export const KEY_BONUS = 30, EVENT_SECONDS = 10, FINAL_SECONDS = 60, POWER_CUT_AT = 60, TORCH_SECONDS = 20;
export const escapeId = unit => `escape-u${unit}`;
export const isEscape = id => /^escape-u\d$/.test(id || "");

// Unit content. Each room: where it is, the three things to search, and the puzzle kind.
// Reading questions all have a one-digit answer, so the answers themselves are the safe code.
const ESCAPES9 = {
  3: {
    title: "Locked in the museum",
    story: "Your class visited the Riverside Heritage Museum. You stayed behind to finish your worksheet… and the guard locked up and went home! Find the codes to get out.",
    rooms: [
      { name: "The ticket hall", kind: "vocab", lock: "letters",
        scene: "The lights are off. The front door has a letter padlock. Search the three places: the code is the first letter of each word you find, in order (shop, box, desk).",
        objects: ["Souvenir shop", "Lost property box", "Guide's desk"], keyObject: "Something glints under the counter" },
      { name: "The gallery", kind: "reading", lock: "digits",
        scene: "A safe by the stairs has a number lock. Someone left a visitor leaflet on the bench. The answers to the questions will open the safe.",
        objects: ["Visitor leaflet: question 1", "Visitor leaflet: question 2", "Visitor leaflet: question 3"], keyObject: "Something glints behind a painting" },
      { name: "The storeroom", kind: "grammar", lock: "digits",
        scene: "The back door to the street! Its keypad is covered in notes with mistakes. Each note you fix shows one number of the code.",
        objects: ["Note on the shelf", "Label on a crate", "Message on the wall"], keyObject: "Something glints in an old crate" }
    ],
    doc: { title: "Riverside Heritage Museum: visitor information", paras: [
      "Welcome! The museum is in a merchant's house that was built in 1798. It has 3 floors. On the ground floor you will find the ticket hall and a small souvenir shop. The first floor has 4 galleries about the history of the old town, and on the second floor there is a rooftop café with a view of the river.",
      "We are open from Tuesday to Sunday, 8 a.m. to 5 p.m., and closed on Mondays. Last entry is at 4 p.m. Free guided tours leave the ticket hall every 2 hours, starting at 9 a.m. Each tour lasts about 45 minutes.",
      "Tickets cost 60,000 dong for adults. Students pay half price. Groups of 8 or more people get their own guide at no extra cost.",
      "Please be a responsible visitor. Do not touch the paintings, and do not eat or drink in the galleries. Flash photography is not allowed in Gallery 2, where our oldest silk paintings are kept, because bright light damages them. Large bags must be left in one of the 6 lockers by the entrance.",
      "Every ticket helps. The money pays for the preservation of old buildings in the town and for workshops with local craftspeople. The museum is looked after by a small team and 9 volunteers from the community."] },
    // tier: the lowest tier that gets the question (0 Core, 1 Stretch, 2 Challenge); para: where to look (1-based).
    reading: [
      { q: "How many floors does the museum have?", a: 3, para: 1, tier: 0 },
      { q: "How many galleries are there on the first floor?", a: 4, para: 1, tier: 0 },
      { q: "In which gallery can't visitors use a flash?", a: 2, para: 4, tier: 0 },
      { q: "How many lockers are there by the entrance?", a: 6, para: 4, tier: 0 },
      { q: "How many people does a group need to get its own guide?", a: 8, para: 3, tier: 0 },
      { q: "How many hours are there between the guided tours?", a: 2, para: 2, tier: 0 },
      { q: "How many volunteers help at the museum?", a: 9, para: 5, tier: 0 },
      { q: "Opening at 8 a.m., how many hours can visitors still get in before last entry?", a: 8, para: 2, tier: 1 },
      { q: "How many free guided tours start on an open day? (The first is at 9 a.m.)", a: 4, para: 2, tier: 1 },
      { q: "Which paragraph tells visitors how their money is used?", a: 5, para: 5, tier: 1 },
      { q: "Which paragraph gives a reason for one of the museum's rules?", a: 4, para: 4, tier: 2 },
      { q: "How many days a week is the museum open?", a: 6, para: 2, tier: 2 }
    ],
    escaped: "The back door clicks open and you step out into the warm evening. Across the river, your class is waiting at the bus. You made it!"
  }
};
// Each stage has its own rooms; the teacher page looks them up by the class's stage.
export const ESCAPES_BY_STAGE = { 9: ESCAPES9, 8: ESCAPES8 };
export const ESCAPES = STAGE === 8 ? ESCAPES8 : ESCAPES9;
export const escapeUnits = () => Object.keys(ESCAPES).map(Number);

// The same numbers from the same seed, so every team in a live game gets the same puzzles.
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const solvedCount = play => play.solved.flat().filter(Boolean).length;

function shuffle(a, rnd) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const firstSentence = t => (t.match(/^.*?[.!?](\s|$)/) || [t])[0].trim();

// Three words to find: Core for everyone, with harder words mixed in for Stretch (B2) and Challenge (C1) readers.
function vocabPuzzles(unit, tier, rnd) {
  const core = shuffle(unitWords(unit), rnd), st = shuffle(extraWords(unit, 1), rnd), ch = shuffle(extraWords(unit, 2).filter(w => w.tier === 2), rnd);
  const picks = tier >= 2 && st.length && ch.length ? [core[0], st[0], ch[0]] : tier >= 1 && st.length ? [core[0], core[1], st[0]] : core.slice(0, 3);
  return picks.map(w => {
    const pool = (w.extra ? [...st, ...ch] : core).filter(x => x.w !== w.w);
    const opts = shuffle([w.w, ...shuffle(pool, rnd).slice(0, 3).map(x => x.w)], rnd);
    return { kind: "vocab", word: w.w, unit, tier: w.tier || 0, prompt: "Tap the word that means…", text: w.def, opts, answer: w.w,
             hint: `It starts with "${w.w[0]}" and has ${w.w.replace(/[^a-z]/gi, "").length} letters.` };
  });
}
function readingPuzzles(E, tier, rnd) {
  const ok = E.reading.filter(r => r.tier <= tier), hard = ok.filter(r => r.tier === tier && tier > 0);
  const pick = hard.length ? [shuffle(hard, rnd)[0]] : [];
  shuffle(ok.filter(r => !pick.includes(r)), rnd).forEach(r => { if (pick.length < 3) pick.push(r); });
  return shuffle(pick, rnd).map(r => {
    const others = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== r.a), rnd).slice(0, 3);
    return { kind: "reading", prompt: "Read the leaflet, then tap the answer.", text: r.q, opts: shuffle([r.a, ...others], rnd).map(String), answer: String(r.a),
             hint: `Look at paragraph ${r.para}.`, para: r.para };
  });
}
function grammarPuzzles(unit, tier, rnd) {
  const pts = shuffle(unitGrammar(unit), rnd).slice(0, 3);
  return pts.map(g => {
    // Challenge readers get the "which sentence is right?" item where a point has one: it is the hardest kind.
    const whole = g.items.filter(i => i[0] === ""), gaps = g.items.filter(i => i[0] !== "");
    const it = shuffle(tier >= 2 && whole.length ? whole : gaps.length ? gaps : whole, rnd)[0];
    const [stem, right, ...wrong] = it;
    return { kind: "grammar", point: g.id, prompt: stem ? "Fix the note: tap the right words." : "Only one of these sentences is right. Tap it.",
             text: stem, opts: shuffle([right, ...wrong], rnd), answer: right, hint: firstSentence(g.rule) };
  });
}

// A new game. tier: 0 Core, 1 Stretch, 2 Challenge (practice.js tierFor).
export function makeEscape(unit, tier = 0, rnd = Math.random) {
  const E = ESCAPES[unit]; if (!E) return null;
  const rooms = E.rooms.map(r => {
    const ps = r.kind === "vocab" ? vocabPuzzles(unit, tier, rnd) : r.kind === "reading" ? readingPuzzles(E, tier, rnd) : grammarPuzzles(unit, tier, rnd);
    // Letter locks use the first letter of each word found; the reading safe uses the answers; grammar notes show a number.
    const code = r.kind === "reading" ? ps.map(p => p.answer) : r.lock === "letters" ? ps.map(p => p.answer[0].toUpperCase())
      : ps.map(() => String(1 + Math.floor(rnd() * 9)));
    return { name: r.name, scene: r.scene, kind: r.kind, lock: r.lock, keyObject: r.keyObject,
             puzzles: ps.map((p, i) => ({ ...p, object: r.objects[i], gives: code[i] })), code,
             key: goldenKey(unit, E, r.kind, ps, rnd),
             event: r.kind === "reading" ? { type: "powercut", at: POWER_CUT_AT } : { type: "footsteps", at: 25 + Math.floor(rnd() * 25) } };
  });
  const used = new Set(rooms.flatMap(r => r.puzzles.filter(p => p.kind === "vocab").map(p => p.word)));
  const quick = shuffle(unitWords(unit).filter(w => !used.has(w.w)), rnd);
  rooms.forEach((r, i) => { if (r.event.type === "footsteps") { const w = quick[i], others = shuffle(quick.filter(x => x.w !== w.w), rnd).slice(0, 2);
    Object.assign(r.event, { word: w.w, text: w.def, opts: shuffle([w.w, ...others.map(x => x.w)], rnd), answer: w.w }); } });
  // The exit door: unscramble one of the words found in the first room (letters only), in 60 seconds.
  const fw = rooms[0].puzzles.map(p => p.answer).filter(w => /^[a-z]{4,10}$/i.test(w)).sort((a, b) => b.length - a.length)[0]
    || unitWords(unit).map(w => w.w).filter(w => /^[a-z]{4,10}$/i.test(w))[0];
  let tiles = shuffle(fw.toUpperCase().split(""), rnd); if (tiles.join("") === fw.toUpperCase()) tiles = tiles.reverse();
  const final = { word: fw.toUpperCase(), tiles, clue: (unitWords(unit).concat(extraWords(unit)).find(w => w.w === fw) || {}).def || "" };
  return { unit, tier, tierName: TIERS[tier], title: E.title, rooms, final };
}

// The golden key: one harder, optional question per room. Right takes 30 s off; wrong loses the key (one try only).
function goldenKey(unit, E, kind, used, rnd) {
  if (kind === "vocab") {
    const ch = extraWords(unit, 2).filter(w => w.tier === 2 && !used.some(p => p.word === w.w)), pool = ch.length >= 4 ? ch : unitWords(unit).filter(w => !used.some(p => p.word === w.w));
    const w = shuffle(pool, rnd)[0];
    return { kind: "vocab", word: w.w, unit, prompt: "Challenge: tap the word that means…", text: w.def, answer: w.w,
             opts: shuffle([w.w, ...shuffle(pool.filter(x => x.w !== w.w), rnd).slice(0, 3).map(x => x.w)], rnd) };
  }
  if (kind === "reading") {
    const rest = E.reading.filter(r => !used.some(p => p.text === r.q)), hard = rest.filter(r => r.tier === 2), r = shuffle(hard.length ? hard : rest, rnd)[0];
    return { kind: "reading", prompt: "Challenge: read the leaflet, then tap the answer.", text: r.q, answer: String(r.a),
             opts: shuffle([r.a, ...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== r.a), rnd).slice(0, 3)], rnd).map(String) };
  }
  // a "which sentence is right?" item if one is left, otherwise another gap item
  const all = unitGrammar(unit).flatMap(g => g.items.map(i => ({ g, i }))).filter(x => !used.some(p => p.answer === x.i[1] && p.text === x.i[0]));
  const whole = all.filter(x => x.i[0] === ""), { g, i } = shuffle(whole.length ? whole : all, rnd)[0], [stem, right, ...wrong] = i;
  return { kind: "grammar", point: g.id, prompt: stem ? "Challenge: tap the right words." : "Challenge: only one of these sentences is right. Tap it.",
           text: stem, answer: right, opts: shuffle([right, ...wrong], rnd) };
}

/* ---------------- play state ---------------- */
export function newPlay(game, now = Date.now()) {
  return { room: 0, t0: now, penalty: 0, solved: game.rooms.map(r => r.puzzles.map(() => false)),
           tries: game.rooms.map(r => r.puzzles.map(() => 0)), hints: game.rooms.map(r => r.puzzles.map(() => false)),
           wrongCodes: 0, dial: null, open: null, out: false, roomStart: game.rooms.map((r, i) => (i ? null : now)),
           keys: game.rooms.map(() => null), events: game.rooms.map(() => null), torchUntil: 0, final: null, caught: false };
}
// The golden key: true found, false lost (one try).
export function answerKey(game, play, opt) {
  if (play.keys[play.room] != null) return play.keys[play.room];
  const ok = opt === game.rooms[play.room].key.answer;
  play.keys[play.room] = ok; if (ok) play.penalty -= KEY_BONUS; return ok;
}
// A footsteps event: answer in time or the guard hears you.
export function answerEvent(play, ok) { if (play.events[play.room] == null) { play.events[play.room] = ok ? "ok" : "missed"; if (!ok) play.penalty += ESCAPE_PENALTY.event; } }
export const roomSeconds = (play, now = Date.now()) => Math.max(0, (now - (play.roomStart[play.room] ?? now)) / 1000);
export function useTorch(play, now = Date.now()) { play.penalty += ESCAPE_PENALTY.torch; play.torchUntil = now + TORCH_SECONDS * 1000; }
export const leafletDark = (game, play, now = Date.now()) => game.rooms[play.room].event.type === "powercut" && roomSeconds(play, now) >= POWER_CUT_AT && now > play.torchUntil;
export const guardLeft = (play, now = Date.now()) => GUARD_SECONDS - escapeSeconds(play, now);
export function startFinal(play, now = Date.now()) { if (!play.final) play.final = { t0: now, done: false }; }
export const finalLeft = (play, now = Date.now()) => (play.final ? FINAL_SECONDS - (now - play.final.t0) / 1000 : FINAL_SECONDS);
// The exit door: ok = unscrambled in time. Too slow costs a minute, but the door still opens.
export function finishFinal(play, ok) { if (play.final && !play.final.done) { play.final.done = true; play.final.ok = ok; if (!ok) play.penalty += ESCAPE_PENALTY.final; play.out = true; } }
export function stars(seconds) { return seconds > GUARD_SECONDS ? 0 : seconds <= STAR_TIMES[0] ? 3 : seconds <= STAR_TIMES[1] ? 2 : 1; }
// Returns "right" or "wrong". A wrong answer adds time; the student can try again.
export function answerPuzzle(game, play, i, opt) {
  const p = game.rooms[play.room].puzzles[i];
  play.tries[play.room][i]++;
  if (opt === p.answer) { play.solved[play.room][i] = true; return "right"; }
  play.penalty += ESCAPE_PENALTY.wrong; return "wrong";
}
export function takeHint(play, i) { if (!play.hints[play.room][i]) { play.hints[play.room][i] = true; play.penalty += ESCAPE_PENALTY.hint; } }
export const roomFound = (game, play) => game.rooms[play.room].puzzles.map((p, i) => (play.solved[play.room][i] ? p.gives : null));
// The lock: all three puzzles need not be solved first. A clever guess works too, but a wrong code adds time.
export function tryCode(game, play, code) {
  if (code.join("") === game.rooms[play.room].code.join("")) {
    if (play.room === game.rooms.length - 1) startFinal(play); else { play.room++; play.open = null; play.dial = null; play.roomStart[play.room] = Date.now(); }
    return true;
  }
  play.wrongCodes++; play.penalty += ESCAPE_PENALTY.code; return false;
}
export const escapeSeconds = (play, now = Date.now()) => Math.round((now - play.t0) / 1000) + play.penalty;

// Points for the best-score list: faster is better, and every first-time answer counts.
export function escapeResult(game, play, history = [], now = Date.now()) {
  const seconds = escapeSeconds(play, now), id = escapeId(game.unit);
  const first = game.rooms.flatMap((r, ri) => r.puzzles.map((p, i) => play.solved[ri][i] && play.tries[ri][i] === 1 && !play.hints[ri][i]));
  const right = first.filter(Boolean).length, before = history.some(h => h.text_id === id && (h.answers || []).some(a => a.skill === "Game score" && a.escaped && !a.caught));
  const caught = seconds > GUARD_SECONDS, keys = play.keys.filter(k => k === true).length;
  const xp = right * ESCAPE_XP.first + keys * ESCAPE_XP.key + (caught ? 0 : before ? ESCAPE_XP.escape : ESCAPE_XP.firstEscape);
  const points = Math.max(100, 3000 - seconds * 2 + right * 50);
  const answers = [{ skill: "Game score", game: "escape", points, seconds, escaped: true, caught, stars: stars(seconds), keys, tier: game.tier }];
  game.rooms.forEach((r, ri) => { if (r.event.type === "footsteps" && play.events[ri])
    answers.push({ skill: "Vocabulary", word: r.event.word, unit: game.unit, first_try: play.events[ri] === "ok", support: "none", game: "escape" }); });
  game.rooms.forEach((r, ri) => r.puzzles.forEach((p, i) => {
    const ok = play.solved[ri][i] && play.tries[ri][i] === 1 && !play.hints[ri][i], hint = play.hints[ri][i];
    if (p.kind === "vocab") answers.push({ skill: "Vocabulary", word: p.word, unit: p.unit, first_try: ok, support: hint ? "hint" : "none", game: "escape" });
    else if (p.kind === "grammar") answers.push({ skill: "Grammar", point: p.point, unit: game.unit, first_try: ok, support: hint ? "hint" : "none", game: "escape" });
    else answers.push({ skill: "Detail", first_try: ok, support: hint ? "hint" : "none", game: "escape" });
  }));
  return { seconds, right, total: first.length, xp, points, answers, caught, keys, stars: stars(seconds), finalOk: !!(play.final && play.final.ok) };
}
export function bestEscape(history, unit) {
  const t = history.filter(h => h.text_id === escapeId(unit)).flatMap(h => (h.answers || []).filter(a => a.skill === "Game score" && a.escaped).map(a => a.seconds));
  return t.length ? Math.min(...t) : null;
}
