// Games: Word Rain (catch each meaning with its word), Word Train (send each word to its word-class station),
// Speed Read (a paragraph flashes up a few words at a time, then one question) and Trap Dodger (hear a Listening Lab
// clip, pop the bubble with the answer; the other bubbles are the examiner's traps).
// The pure helpers at the top are tested; the play* functions draw the game into an element and call onEnd with the result.
import { unitWords } from "./practice.js";
import { FAMILIES } from "./families.js";
import { play } from "./sound.js";
import { PRACTICE_TEXTS } from "./content.js";
import { LAB, TRAPS, LAB_LEVELS, LAB_PLAYS, markLine } from "./lab.js";
import { TIMES, AUDIO_V } from "./listening-times.js";

export const GAMES = {
  rain: { name: "Word Rain", blurb: "Meanings fall from the sky. Tap the word that matches before it lands." },
  train: { name: "Word Train", blurb: "Send each word to the right station: noun, verb, adjective or adverb." },
  speed: { name: "Speed Read", blurb: "A paragraph flashes past a few words at a time. Answer one question, then go faster." },
  dodge: { name: "Trap Dodger", blurb: "Listen and pop the bubble with the answer. The other bubbles are traps!" }
};
export const GAME_XP_DAY = 30;           // the most XP games can give in one school day
export const RAIN_LIVES = 3, RAIN_SECONDS = 120, TRAIN_COUNT = 20;
export const TICK_FROM = 5, TICK_EVERY = 0.5;            // Word Rain: a clock ticks in the last 5 seconds, two ticks a second
const LEVEL_EVERY = 5;                   // right answers per level
export const levelAfter = hits => Math.min(1 + Math.floor(hits / LEVEL_EVERY), 8);

/* ---------------- data ---------------- */
export function rainPool(unit) { return unitWords(unit).map(x => ({ w: x.w, def: x.def, unit })); }

// Word Train uses the word families. Words that can be two classes (respect, monitor, permit, -ing and -ed forms) are left out,
// because a word alone, without a sentence, would not tell the student which class is meant.
const TAG = { n: "noun", v: "verb", adj: "adjective", adv: "adverb", person: "noun", "the subject": "noun", "the person": "noun",
              "the science": "noun", machine: "noun", "event or person": "noun" };
const SKIP = new Set(["monitor", "permit", "produce", "breed", "anger"]);
const EXTRA = { 3: [["ecologically", "adverb"]], 4: [["genetically", "adverb"]], 5: [["analytically", "adverb"], ["innovatively", "adverb"]],
                7: [["sociable", "adjective"]], 8: [["emissions", "noun"]], 9: [["illegal", "adjective"]] };
export const STATIONS = ["noun", "verb", "adjective", "adverb"];
export function trainPool(unit) {
  const out = [];
  (FAMILIES[unit] || []).forEach(f => f[5].split(" · ").forEach(part => {
    const m = /^(.+?) \((.+)\)$/.exec(part.trim()), pos = m && TAG[m[2]];
    if (!pos) return;
    m[1].split(" / ").map(w => w.trim()).forEach(w => {
      if (SKIP.has(w) || /ing$/.test(w) || (/ed$/.test(w) && pos === "adjective")) return;
      if (!out.some(x => x.w === w)) out.push({ w, pos, family: f[5], unit });
    });
  }));
  (EXTRA[unit] || []).forEach(([w, pos]) => out.push({ w, pos, family: (FAMILIES[unit].find(f => f.slice(1, 5).includes(w)) || [])[5] || "", unit }));
  return out;
}
export const trainStations = pool => STATIONS.filter(s => pool.some(x => x.pos === s));

/* ---------------- scores and XP ---------------- */
const dayNo = t => Math.floor((t + 7 * 3600e3) / 86400e3);        // school time zone (UTC+7)
export const isGame = id => /^(rain|train|speed|dodge)-u\d$/.test(id || "");
export const gameId = (game, unit) => `${game}-u${unit}`;
export function gamePoints(h) { const a = (h.answers || []).find(x => x.skill === "Game score"); return a ? a.points : 0; }
export function bestScore(history, id) { return history.filter(h => h.text_id === id).reduce((b, h) => Math.max(b, gamePoints(h)), 0); }
export function gameXPToday(history, now = new Date()) {
  const today = dayNo(now.getTime());
  return history.filter(h => isGame(h.text_id) && dayNo(new Date(h.created_at).getTime()) === today).reduce((t, h) => t + (h.xp || 0), 0);
}
// 1 XP for each right answer and 5 for finishing, until the day's game XP reaches GAME_XP_DAY.
export function gameXP(hits, history, now = new Date()) {
  return Math.max(0, Math.min(hits + 5, GAME_XP_DAY - gameXPToday(history, now)));
}
// What is saved. Words missed in Word Rain come back in the word review (see wordSchedule in practice.js).
export function gameAnswers(game, R, unit) {
  const ans = [{ skill: "Game score", game, points: R.points, level: R.level }];
  if (game === "rain") R.words.forEach(x => ans.push({ skill: "Word game", word: x.w, unit, first_try: x.hit }));
  else if (game === "train") R.words.forEach(x => ans.push({ skill: "Word class", word: x.w, unit, pos: x.pos, first_try: x.hit }));
  // Trap Dodger answers count in the trap tracker (see trapStats in lab.js). picked is the trap bubble popped, if any.
  else if (game === "dodge") R.words.forEach(x => ans.push({ skill: "Trap game", clip: x.clip, trap: x.trap, level: x.tier, first_try: x.hit, ...(x.picked ? { picked: x.picked } : {}) }));
  else { ans[0].wpm = R.top; R.words.forEach(x => ans.push({ skill: "Speed reading", sub: x.skill, text: x.text, para: x.para, wpm: x.wpm, first_try: x.hit })); }
  return ans;
}

/* ---------------- Speed Read data ---------------- */
// Speed Read reuses the reading texts' questions about one paragraph (not main idea or writer's view, which need the whole text).
// Only texts the student has already finished in practice are used, so the practice questions are never seen first here.
export const SPEEDS = [100, 130, 160, 200, 240, 280, 330];          // words per minute
export const SPEED_ROUND = 6, CHUNK = 3;                            // questions per game, words per flash
const SPEED_SKILLS = ["Detail", "Vocabulary in context", "Inference", "Writer's purpose"];
export const speedTexts = unit => PRACTICE_TEXTS.filter(t => t.unitNo === unit);
export function speedItems(texts, level = 1, rnd = Math.random) {
  const lv = Math.min(Math.max(level ?? 1, 0), 2);
  return texts.flatMap(t => t.slots.filter(sl => SPEED_SKILLS.includes(sl.skill) && sl.q[lv].opts).map(sl => {
    const para = t.levels[lv].paras.find(p => p[0] === sl.para);
    return { text: t.id, topic: t.topic, para: sl.para, words: para[1].split(/\s+/), skill: sl.skill, q: sl.q[lv] };
  })).map(x => [rnd(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
}
// Two right in a row → one step faster; a wrong answer → one step slower.
export function nextSpeed(i, right, streak) { return right ? (streak >= 2 ? Math.min(i + 1, SPEEDS.length - 1) : i) : Math.max(i - 1, 0); }
export function lastSpeed(history, id) {
  const h = [...history].filter(x => x.text_id === id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  const a = h && (h.answers || []).find(x => x.skill === "Game score");
  return a && a.wpm ? a.wpm : 130;
}
export function chunks(words, n = CHUNK) { const out = []; for (let i = 0; i < words.length; i += n) out.push(words.slice(i, i + n).join(" ")); return out; }

/* ---------------- Trap Dodger data ---------------- */
// Trap Dodger reuses the Listening Lab clips. Option 0 is the answer; the other options are the traps, and their "why" says why.
// Every 2 right answers is one level; levels 1-2 use Core clips, 3-4 Stretch and 5-6 Challenge, and the bubbles rise faster.
const CLIP_SHARE = 0.6;                                                                    // how far up the bubbles get while the clip plays
const AUTO_NEXT = 2500;                                                                   // ms before the next clip after a right answer
export const DODGE_LIVES = 3, DODGE_ROUNDS = 10, DODGE_MAX = 6;
export const dodgeTier = level => level <= 2 ? 0 : level <= 4 ? 1 : 2;
export const dodgeLevelFor = tier => 1 + 2 * Math.min(Math.max(tier || 0, 0), 2);         // the first level of a tier
export const dodgeLevel = (start, hits) => Math.min(start + Math.floor(hits / 2), DODGE_MAX);
export const dodgeThink = level => Math.max(3, 9 - level);                                // seconds after the clip ends
export const clipSeconds = clip => { const t = TIMES[clip]; return t && t.length ? t[t.length - 1][1] : 10; };
export function dodgePool(tier) {
  return LAB.flatMap(m => m.items.filter(it => (it.level || 0) === tier && it.opts && it.opts.length >= 3)
    .map(it => ({ ...it, mission: m.id, trap: m.trap })));
}
// When the student last heard each clip, in Trap Dodger or in the Listening Lab: clip id → a number that grows
// with time (oldest first). Clips never heard are not in the map.
export function dodgeSeen(history) {
  const seen = new Map(); let n = 0;
  [...history].sort((a, b) => String(a.created_at || "").localeCompare(String(b.created_at || "")))
    .forEach(h => (h.answers || []).forEach(a => { const c = a.skill === "Trap game" ? a.clip : a.skill === "Listening" && a.lab; if (c) seen.set(c, ++n); }));
  return seen;
}
// Every Trap Dodger clip the student has played, oldest answer first: how often, how often right, the trap bubbles
// popped, and whether the last try was right. Missed clips (last try wrong) are still to learn.
export function dodgeLog(history) {
  const by = new Map(), items = new Map(dodgePool(0).concat(dodgePool(1), dodgePool(2)).map(x => [x.clip, x]));
  [...history].sort((a, b) => String(a.created_at || "").localeCompare(String(b.created_at || ""))).forEach(h => (h.answers || []).forEach(a => {
    if (a.skill !== "Trap game" || !items.has(a.clip)) return;
    const it = items.get(a.clip), r = by.get(a.clip) || { clip: a.clip, stem: it.stem, answer: it.opts[0].t, trap: it.trap, tier: it.level || 0, tries: 0, right: 0, picked: [] };
    r.tries++; if (a.first_try) r.right++; if (a.picked && !r.picked.includes(a.picked)) r.picked.push(a.picked);
    r.last = !!a.first_try; r.at = h.created_at; by.set(a.clip, r);
  }));
  return [...by.values()];
}
export const dodgeMissed = history => new Set(dodgeLog(history).filter(r => !r.last).map(r => r.clip));
export const DODGE_REVIEW = 3;                                   // missed clips that come back in one game, at most
// The next clip: one not used in this game, from the tier, or from an easier tier when the tier has run out.
// Clips missed last time come back first (when missed is given), then clips never heard, then the ones heard longest ago.
export function dodgeItem(tier, used = [], rnd = Math.random, seen = new Map(), missed = new Set()) {
  for (let t = tier; t >= 0; t--) {
    const left = dodgePool(t).filter(x => !used.includes(x.clip));
    if (left.length) return left.map(x => [missed.has(x.clip) ? -1 - rnd() : (seen.get(x.clip) ?? 0) + rnd() * 0.5, x]).sort((a, b) => a[0] - b[0])[0][1];
  }
  return dodgePool(0)[Math.floor(rnd() * dodgePool(0).length)];
}
// Points for a popped answer: more for harder clips, for popping it low down (early), and for a streak.
export const dodgeGain = (tier, progress, streak) => 10 + 10 * tier + Math.round(10 * Math.max(0, 1 - progress)) + (streak >= 3 ? 5 : 0);

/* ---------------- shared ---------------- */
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function shuffled(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// Draws words in a shuffled order, then reshuffles; a missed word can be put back near the front.
function deck(pool) {
  let q = [];
  return { next(avoid = []) { if (!q.length) q = shuffled(pool); const i = q.findIndex(x => !avoid.includes(x.w)); return q.splice(i < 0 ? 0 : i, 1)[0]; },
           again(x) { q.splice(Math.min(2, q.length), 0, x); } };
}
// requestAnimationFrame loop with a capped step, so a hidden tab or a slow phone does not make things jump.
function loop(step) {
  let last = performance.now(), id = 0, on = true;
  const f = now => { if (!on) return; const dt = Math.min(0.1, (now - last) / 1000); last = now; step(dt); if (on) id = requestAnimationFrame(f); };
  id = requestAnimationFrame(f);
  return () => { on = false; cancelAnimationFrame(id); };
}
const STAR = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z" fill="currentColor"/></svg>`;
function hud(lives) {
  return `<div class="ghud"><span class="hchip lv">${STAR}<span class="hl">Level</span> <b id="glv">1</b></span><span class="hchip pts"><b id="gpts">0</b> pts</span>
    <span class="hchip combo" id="gcombo" hidden></span>
    ${lives ? `<span class="glives" id="glives" aria-label="${lives} lives">${"<i></i>".repeat(lives)}</span>` : `<span class="hchip" id="gleft"></span>`}<span class="hchip time" id="gtime" hidden></span></div>`;
}
// Score that bumps when it changes, and a streak chip (×2, ×3…) that appears after two in a row.
function setPoints(el, n) { const b = el.querySelector("#gpts"); if (!b || b.textContent === String(n)) return; b.textContent = n; const c = b.parentNode; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
function setCombo(el, n) { const c = el.querySelector("#gcombo"); if (!c) return; c.hidden = n < 2; c.textContent = `🔥 ×${n}`; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
// "3, 2, 1, Go!" over the play area, then start.
function countdown(box, go) {
  const o = document.createElement("div"); o.className = "gcount"; box.appendChild(o);
  let n = 3;
  const step = () => {
    o.innerHTML = `<span>${n || "Go!"}</span>`;
    play(n ? "tap" : "level");
    if (n-- > 0) setTimeout(step, 650); else setTimeout(() => { o.remove(); go(); }, 500);
  };
  step();
}
// Floating "+20" text and a burst of particles at (x, y) in the box's pixels.
function floatText(box, x, y, text, cls = "") {
  const f = document.createElement("b"); f.className = "gfloat " + cls; f.textContent = text;
  f.style.left = x + "px"; f.style.top = y + "px"; box.appendChild(f); setTimeout(() => f.remove(), 950);
}
function burst(box, x, y, colors, n = 12) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i"); p.className = "gpart";
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.4, d = 34 + Math.random() * 30;
    p.style.cssText = `left:${x}px;top:${y}px;--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;background:${colors[i % colors.length]}`;
    box.appendChild(p); setTimeout(() => p.remove(), 700);
  }
}
const CONFETTI = ["#F6C94A", "#4FC3F7", "#F06292", "#81C784", "#FF8A65"];
function banner(el, text, cls = "") {
  const b = el.querySelector(".gbanner"); if (!b) return;
  b.textContent = text; b.className = "gbanner show " + cls;
  clearTimeout(b._t); b._t = setTimeout(() => { b.className = "gbanner"; }, 1300);
}

/* ---------------- Word Rain ---------------- */
export function playRain(el, { unit, onEnd }) {
  const pool = rainPool(unit), cards = deck(pool);
  el.innerHTML = `<div class="game rain">${hud(RAIN_LIVES)}
    <div class="arena" id="arena"><div class="sky" aria-hidden="true"><i class="sun"></i><i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i><i class="rainfx"></i></div>
      <div class="water" id="water"><i class="wave w1"></i><i class="wave w2"></i></div><div class="gbanner"></div></div>
    <div class="gbtns" id="gbtns">${[0, 1, 2, 3].map(i => `<button class="gbtn" data-i="${i}"><span class="gk">${i + 1}</span><span class="gword"></span></button>`).join("")}</div>
    <p class="note" id="gtell" aria-live="polite">Tap the word that matches the falling meaning. On a keyboard, press 1 to 4.</p></div>`;
  const arena = el.querySelector("#arena"), water = el.querySelector("#water"), btns = [...el.querySelectorAll(".gbtn")];
  let drops = [], slots = [null, null, null, null], t = 0, sinceSpawn = 99, points = 0, hits = 0, misses = 0, level = 1, over = false, streak = 0, ticks = 0, stop = () => {};
  const words = [];
  const fallTime = () => Math.max(5, 12 - level);                 // seconds from top to water
  const maxDrops = () => level >= 3 ? 2 : 1;
  const waterH = () => 18 + misses * 30;

  // Each falling word must be on a button; it goes in a random place that is free or holds a word not falling now.
  function setButtons() {
    const need = drops.map(d => d.x.w);
    need.forEach(w => {
      if (slots.includes(w)) return;
      const free = slots.map((s, k) => k).filter(k => !slots[k] || !need.includes(slots[k]));
      slots[free[Math.floor(Math.random() * free.length)]] = w;
    });
    const used = new Set(slots.filter(Boolean));
    slots.forEach((s, k) => { if (!s) { const d = shuffled(pool).find(x => !used.has(x.w)); slots[k] = d.w; used.add(d.w); } });
    btns.forEach((b, k) => { b.querySelector(".gword").textContent = slots[k]; });
  }
  function spawn() {
    const x = cards.next(drops.map(d => d.x.w));
    const d = document.createElement("div"); d.className = "drop"; d.innerHTML = `<i class="dtail"></i><span>${esc(x.def)}</span>`;
    arena.appendChild(d);
    const left = Math.random() * Math.max(0, arena.clientWidth - d.offsetWidth);
    drops.push({ x, el: d, y: -d.offsetHeight, left }); setButtons(); sinceSpawn = 0;
  }
  function remove(d) { drops = drops.filter(o => o !== d); }
  function pop(d, k) {
    const ground = arena.clientHeight - waterH();
    const gain = 10 * level + Math.round(10 * Math.max(0, 1 - (d.y + d.el.offsetHeight) / ground));
    points += gain; hits++; streak++; words.push({ w: d.x.w, hit: true });
    const cx = d.left + d.el.offsetWidth / 2, cy = d.y + d.el.offsetHeight / 2;
    d.el.classList.add("popped"); setTimeout(() => d.el.remove(), 450); remove(d);
    burst(arena, cx, cy, ["#BFE9FF", "#7FD3FF", "#FFFFFF", "#F6C94A"], 14); floatText(arena, cx, cy - 10, `+${gain}`);
    setPoints(el, points); setCombo(el, streak);
    btns[k].classList.add("right"); setTimeout(() => btns[k].classList.remove("right"), 300);
    play("ok");
    const nl = levelAfter(hits); if (nl > level) { level = nl; play("level"); banner(el, `Level ${level}: faster!`); arena.classList.remove("flash"); void arena.offsetWidth; arena.classList.add("flash"); }
    swapOut(d.x.w);
  }
  // A word that has been answered leaves the buttons, so students read the next meaning instead of tapping the same place.
  function swapOut(w) {
    const k = slots.indexOf(w); if (k < 0 || drops.some(o => o.x.w === w)) return;
    const used = new Set(slots), d = shuffled(pool).find(x => !used.has(x.w)); slots[k] = d ? d.w : w; setButtons();
  }
  function land(d) {
    misses++; streak = 0; setCombo(el, 0); words.push({ w: d.x.w, hit: false }); cards.again(d.x);
    d.el.classList.add("splash"); setTimeout(() => d.el.remove(), 500); remove(d);
    const sp = document.createElement("i"); sp.className = "ripple"; sp.style.left = (d.left + d.el.offsetWidth / 2) + "px"; sp.style.bottom = waterH() + "px";
    arena.appendChild(sp); setTimeout(() => sp.remove(), 800); arena.classList.remove("hurt"); void arena.offsetWidth; arena.classList.add("hurt");
    el.querySelector("#gtell").innerHTML = `<b>${esc(d.x.w)}</b>: ${esc(d.x.def)}`;
    play("bad"); water.style.height = waterH() + "px";
    el.querySelectorAll("#glives i").forEach((i, k) => i.classList.toggle("lost", k >= RAIN_LIVES - misses));
    if (misses >= RAIN_LIVES) finish("The water is too high!"); else swapOut(d.x.w);
  }
  function tap(k) {
    if (over) return;
    const w = slots[k], hit = drops.filter(d => d.x.w === w).sort((a, b) => b.y - a.y)[0];
    if (hit) return pop(hit, k);
    points = Math.max(0, points - 5); streak = 0; setCombo(el, 0); setPoints(el, points); play("bad");
    btns[k].classList.remove("shake"); void btns[k].offsetWidth; btns[k].classList.add("shake");
  }
  function finish(msg) {
    if (over) return; over = true; stop(); arena.classList.remove("ticking");
    // Meanings still falling when the time is up are not counted: the student had no chance to answer them.
    banner(el, msg, "big"); btns.forEach(b => b.disabled = true);
    setTimeout(() => { cleanup(); onEnd({ points, hits, misses, level, words, seconds: Math.round(t) }); }, 1500);
  }
  const run = () => loop(dt => {
    t += dt; sinceSpawn += dt;
    const H = arena.clientHeight, ground = H - waterH(), speed = H / fallTime();
    if (drops.length < maxDrops() && (drops.length === 0 || sinceSpawn > fallTime() * 0.45)) spawn();
    drops.slice().forEach(d => { d.y += speed * dt; d.el.style.transform = `translate(${d.left}px,${d.y}px)`; if (d.y + d.el.offsetHeight >= ground) land(d); });
    el.querySelector("#glv").textContent = level;
    const tm = el.querySelector("#gtime"); tm.hidden = false; tm.textContent = "⏱ " + fmt(RAIN_SECONDS - t); tm.classList.toggle("low", RAIN_SECONDS - t < 15);
    const due = Math.floor((TICK_FROM - (RAIN_SECONDS - t)) / TICK_EVERY) + 1;
    if (due > ticks && t < RAIN_SECONDS) { ticks = due; play(ticks % 2 ? "tick" : "tock"); arena.classList.add("ticking"); }
    if (t >= RAIN_SECONDS) finish("Time's up!");
  });
  btns.forEach((b, k) => b.onclick = () => tap(k));
  const key = ev => { const k = "1234".indexOf(ev.key); if (k >= 0) { ev.preventDefault(); tap(k); } };
  document.addEventListener("keydown", key);
  function cleanup() { stop(); document.removeEventListener("keydown", key); }
  water.style.height = waterH() + "px";
  setButtons(); countdown(arena, () => { if (!over) stop = run(); });
  return () => { over = true; cleanup(); };
}
const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

/* ---------------- Word Train ---------------- */
const SVGNS = "http://www.w3.org/2000/svg";
// The track winds across the top (a long run-up to think), turns at the junction, and branches down to the stations on the left.
const VB = { w: 400, h: 400, jx: 215, jy: 140, sx: 84 };
const APPROACH = `M-60 45 H315 C372 45 372 ${VB.jy} 315 ${VB.jy} H${VB.jx}`;
// The countryside seen from above: grass, a lake, a farmhouse, trees and drifting cloud shadows. All of it stays clear of the track.
const tree = ([x, y, r]) => `<g class="tree"><circle class="tsh" cx="${x + 3}" cy="${y + 4}" r="${r}"/><circle class="t1" cx="${x}" cy="${y}" r="${r}"/><circle class="t2" cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .55}"/></g>`;
const TREES = [[25, 95, 14], [72, 78, 10], [132, 100, 13], [182, 82, 9], [100, 14, 8], [250, 14, 9], [385, 20, 10], [388, 96, 10],
  [250, 200, 12], [385, 205, 13], [230, 378, 12], [395, 388, 14], [190, 320, 10], [205, 388, 9], [262, 250, 7]];
const FLOWERS = [[60, 120], [160, 125], [290, 70], [340, 100], [240, 300], [372, 260], [280, 380], [175, 240], [355, 380], [120, 30]];
const SCENE = `<defs><radialGradient id="tlake" cx=".4" cy=".35" r=".75"><stop offset="0" class="lk0"/><stop offset="1" class="lk1"/></radialGradient>
    <pattern id="tgrass" width="26" height="26" patternUnits="userSpaceOnUse"><path class="blade" d="M4 10l2-5 2 5M16 22l2-5 2 5"/></pattern></defs>
  <rect class="grass" width="400" height="400"/><rect width="400" height="400" fill="url(#tgrass)"/>
  <ellipse class="meadow" cx="310" cy="320" rx="105" ry="78"/><ellipse class="meadow" cx="120" cy="60" rx="90" ry="40"/>
  <ellipse class="shore" cx="318" cy="316" rx="68" ry="41"/><ellipse cx="318" cy="314" rx="62" ry="36" fill="url(#tlake)"/>
  <path class="lkshine" d="M286 306q14-6 28 0M318 326q12-5 24 0M300 296q8-4 16 0"/>
  <g class="duck"><ellipse cx="0" cy="0" rx="5" ry="3.5"/><circle cx="4" cy="-1.5" r="2.2"/></g>
  <g class="house"><rect class="hsh" x="253" y="82" width="40" height="30" rx="2"/><rect class="roofa" x="250" y="78" width="40" height="15"/><rect class="roofb" x="250" y="93" width="40" height="15"/>
    <rect class="chim" x="279" y="82" width="5" height="6"/></g>
  ${FLOWERS.map(([x, y], k) => `<circle class="fl f${k % 3}" cx="${x}" cy="${y}" r="2.6"/>`).join("")}
  ${TREES.map(tree).join("")}`;
export function playTrain(el, { unit, onEnd }) {
  const pool = trainPool(unit), st = trainStations(pool), cards = deck(pool);
  const ys = st.map((_, k) => Math.round(200 + k * 170 / (st.length - 1)));
  const fromJ = y => `M${VB.jx} ${VB.jy} C${VB.jx - 75} ${VB.jy} ${VB.jx - 75} ${y} ${VB.jx - 130} ${y} H${VB.sx}`;
  const branch = y => APPROACH + fromJ(y).replace(/^M[\d.]+ [\d.]+/, "");
  const all = [APPROACH, ...ys.map(fromJ)], track = cls => all.map(d => `<path class="${cls}" d="${d}"/>`).join("");
  el.innerHTML = `<div class="game train">${hud(0)}
    <div class="arena tarena"><svg viewBox="0 0 ${VB.w} ${VB.h}" role="img" aria-label="Railway with ${st.length} stations: ${st.join(", ")}">
      ${SCENE}
      ${track("ties")}<path class="rglow" id="tswg" d="${fromJ(ys[0])}"/>${track("rail")}${track("railin")}
      <path id="tapp" d="${APPROACH}" fill="none" stroke="none"/>${ys.map((y, k) => `<path id="tb${k}" d="${branch(y)}" fill="none" stroke="none"/>`).join("")}
      <path class="rflow" id="tsw" d="${fromJ(ys[0])}"/>
      <g class="junction"><circle class="jring" cx="${VB.jx}" cy="${VB.jy}" r="9"/><circle class="jdot" cx="${VB.jx}" cy="${VB.jy}" r="6"/></g>
      ${st.map((s, k) => `<g class="station s-${s}" data-k="${k}" id="ts${k}"><rect class="plat" x="0" y="${ys[k] - 23}" width="${VB.sx + 4}" height="46" rx="6"/>
        <rect class="roof" x="4" y="${ys[k] - 18}" width="74" height="36" rx="5"/>
        <text x="41" y="${ys[k] + 4.5}" text-anchor="middle">${s}</text></g>`).join("")}
      <g id="trains"></g><g id="smoke"></g></svg><div class="gbanner"></div></div>
    <div class="gbtns tbtns">${st.map((s, k) => `<button class="gbtn s-${s}" data-k="${k}"><span class="gk">${k + 1}</span><span class="gword">${s[0].toUpperCase() + s.slice(1)}</span></button>`).join("")}</div>
    <p class="note" id="gtell" aria-live="polite">Set the points before each train reaches the junction. Tap a station, or press 1 to ${st.length}.</p></div>`;
  const arena = el.querySelector(".tarena"), svg = arena.querySelector("svg"), layer = el.querySelector("#trains"), smoke = el.querySelector("#smoke");
  const sw = el.querySelector("#tsw"), swg = el.querySelector("#tswg");
  const paths = st.map((_, k) => el.querySelector("#tb" + k)), lens = paths.map(p => p.getTotalLength());
  const common = el.querySelector("#tapp").getTotalLength();
  const btns = [...el.querySelectorAll(".gbtn")];
  let trains = [], cur = 0, t = 0, sinceSpawn = 99, sent = 0, done = 0, points = 0, hits = 0, streak = 0, level = 1, over = false, stop = () => {};
  const words = [];
  const speed = () => 30 + 6 * level;                              // svg units per second: about 17 s to the junction at level 1
  const gap = () => Math.max(3, 7.5 - 0.6 * level);                // seconds between trains

  function setSwitch(k) {
    if (over || k < 0 || k >= st.length) return;
    cur = k; sw.setAttribute("d", fromJ(ys[k])); swg.setAttribute("d", fromJ(ys[k])); play("tap");
    btns.forEach((b, i) => b.classList.toggle("sel", i === k));
    el.querySelectorAll(".station").forEach((g, i) => g.classList.toggle("sel", i === k));
  }
  // A steam engine pulling one wagon with the word on it, drawn from above and pointing along +x.
  function spawn() {
    const x = cards.next(trains.map(o => o.x.w)), g = document.createElementNS(SVGNS, "g");
    const len = Math.max(54, x.w.length * 7.4 + 18), back = -24 - len;
    g.setAttribute("class", "tcar");
    g.innerHTML = `<rect class="csh" x="${back + 2}" y="-9" width="${len + 26}" height="24" rx="7"/>
      <rect class="wagon" x="${back}" y="-12" width="${len}" height="24" rx="6"/><rect class="wtop" x="${back + 3}" y="-9" width="${len - 6}" height="7" rx="3"/>
      <rect class="coupler" x="-26" y="-2" width="4" height="4"/>
      <rect class="cab" x="-23" y="-11" width="10" height="22" rx="3"/><rect class="boiler" x="-14" y="-8.5" width="16" height="17" rx="8"/>
      <circle class="chimney" cx="-4" cy="0" r="3.6"/><rect class="buffer" x="1.5" y="-7" width="2.5" height="14" rx="1"/>
      <text x="${back + len / 2}" y="1" dominant-baseline="central" text-anchor="middle">${esc(x.w)}</text>`;
    layer.appendChild(g);
    trains.push({ x, g, s: 0, k: null, len: len + 24, mid: back + len / 2, flip: false, puff: 0, label: g.querySelector("text") }); sent++; sinceSpawn = 0;
  }
  function puff(p) {
    const c = document.createElementNS(SVGNS, "circle");
    c.setAttribute("class", "puff"); c.setAttribute("cx", p.x.toFixed(1)); c.setAttribute("cy", p.y.toFixed(1)); c.setAttribute("r", "4");
    smoke.appendChild(c); setTimeout(() => c.remove(), 1000);
  }
  function arrive(o) {
    trains = trains.filter(q => q !== o); done++;
    const ok = st[o.k] === o.x.pos, stn = el.querySelector("#ts" + o.k);
    words.push({ w: o.x.w, pos: o.x.pos, hit: ok });
    o.g.classList.add(ok ? "in" : "wrong"); setTimeout(() => o.g.remove(), 350);
    stn.classList.remove("good", "bad"); void stn.getBBox(); stn.classList.add(ok ? "good" : "bad");
    setTimeout(() => stn.classList.remove("good", "bad"), 600);
    const sc = svg.clientWidth / VB.w, px = 44 * sc, py = ys[o.k] * sc;
    if (ok) {
      hits++; streak++; const gain = 10 * level + (streak >= 3 ? 5 : 0); points += gain; play("ok");
      burst(arena, px, py, CONFETTI, 16); floatText(arena, px + 30, py - 18, `+${gain}`);
      const nl = levelAfter(hits); if (nl > level) { level = nl; play("level"); banner(el, `Level ${level}: faster trains!`); arena.classList.remove("flash"); void arena.offsetWidth; arena.classList.add("flash"); }
    } else {
      streak = 0; play("bad");
      burst(arena, px, py, ["#9AA4AE", "#C7CDD3", "#E05252"], 10); floatText(arena, px + 30, py - 18, "✗", "bad");
      arena.classList.remove("hurt"); void arena.offsetWidth; arena.classList.add("hurt");
      el.querySelector("#gtell").innerHTML = `<b>${esc(o.x.w)}</b> is ${o.x.pos === "adjective" || o.x.pos === "adverb" ? "an" : "a"} <b>${o.x.pos}</b>.${o.x.family ? ` Family: ${esc(o.x.family)}` : ""}`;
    }
    setPoints(el, points); setCombo(el, streak);
    if (done >= TRAIN_COUNT) finish();
  }
  function finish() {
    over = true; stop(); banner(el, `${hits} of ${TRAIN_COUNT} trains on time!`, "big"); btns.forEach(b => b.disabled = true);
    if (hits >= TRAIN_COUNT * 0.75) burst(arena, arena.clientWidth / 2, arena.clientHeight * 0.38, CONFETTI, 28);
    setTimeout(() => { cleanup(); onEnd({ points, hits, misses: TRAIN_COUNT - hits, level, words, seconds: Math.round(t) }); }, 1500);
  }
  const run = () => loop(dt => {
    t += dt; sinceSpawn += dt;
    if (sent < TRAIN_COUNT && sinceSpawn > gap() && !trains.some(o => o.s < 140)) spawn();
    trains.slice().forEach(o => {
      o.s += speed() * dt;
      if (o.k == null && o.s >= common) o.k = cur;      // at the junction the train takes the points as they are set now
      const k = o.k == null ? cur : o.k, L = lens[k];
      if (o.s >= L) return arrive(o);
      const a = paths[k].getPointAtLength(o.s), b = paths[k].getPointAtLength(Math.max(0, o.s - 4));
      const ang = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI, flip = Math.abs(ang) > 95;
      o.g.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
      // keep the word the right way up when the train runs right to left
      if (flip !== o.flip) { o.flip = flip; o.label.setAttribute("transform", flip ? `rotate(180 ${o.mid} 1)` : ""); }
      o.puff -= dt; if (o.puff <= 0 && b.x > 0) { o.puff = 0.22; puff(b); }
    });
    el.querySelector("#glv").textContent = level;
    el.querySelector("#gleft").textContent = `🚂 ${Math.min(sent, TRAIN_COUNT)} / ${TRAIN_COUNT}`;
  });
  btns.forEach((b, k) => b.onclick = () => setSwitch(k));
  el.querySelectorAll(".station").forEach(g => g.addEventListener("click", () => setSwitch(+g.dataset.k)));
  const key = ev => { const k = "1234".indexOf(ev.key); if (k >= 0) { ev.preventDefault(); setSwitch(k); } };
  document.addEventListener("keydown", key);
  function cleanup() { stop(); document.removeEventListener("keydown", key); }
  setSwitch(0); el.querySelector("#gleft").textContent = `🚂 0 / ${TRAIN_COUNT}`;
  countdown(arena, () => { if (!over) stop = run(); });
  return () => { over = true; cleanup(); };
}

/* ---------------- Speed Read ---------------- */
// A speedometer: one coloured band for each speed, lit up to the current one, with a needle that swings.
function gauge() {
  const n = SPEEDS.length, r = 46, pt = a => `${(60 + r * Math.cos(a)).toFixed(1)} ${(58 - r * Math.sin(a)).toFixed(1)}`;
  const bands = SPEEDS.map((_, k) => { const a0 = Math.PI * (1 - k / n) - 0.03, a1 = Math.PI * (1 - (k + 1) / n) + 0.03;
    return `<path class="gb" data-k="${k}" style="--h:${130 - k * 20}" d="M${pt(a0)} A${r} ${r} 0 0 1 ${pt(a1)}"/>`; }).join("");
  return `<svg viewBox="0 0 120 66" aria-hidden="true">${bands}<g class="needle" id="gneedle"><path d="M57.5 58 L60 18 L62.5 58z"/></g><circle class="hub" cx="60" cy="58" r="6"/></svg>`;
}
export function playSpeed(el, { unit, texts, level, wpm, onEnd }) {
  const items = speedItems(texts, level).slice(0, SPEED_ROUND);
  let i = 0, si = Math.max(0, SPEEDS.indexOf(wpm)), streak = 0, run = 0, points = 0, hits = 0, top = SPEEDS[si], timer = null, over = false;
  const t0 = Date.now(), words = [];
  el.innerHTML = `<div class="game speed">${hud(0)}<div class="sstage"><div class="sgauge">${gauge()}<b id="gwpm"></b><span>words a minute</span></div>
    <div class="sbox" id="sbox"></div><div class="gbanner"></div></div><p class="note" id="gtell" aria-live="polite"></p></div>`;
  const box = el.querySelector("#sbox"), stage = el.querySelector(".sstage");
  const head = () => {
    el.querySelector("#glv").textContent = SPEEDS[si] + " wpm"; setPoints(el, points);
    el.querySelector("#gleft").textContent = `📖 ${Math.min(i + 1, items.length)} / ${items.length}`;
    el.querySelector("#gwpm").textContent = SPEEDS[si];
    el.querySelector("#gneedle").style.transform = `rotate(${(-90 + 180 * (si + 0.5) / SPEEDS.length).toFixed(1)}deg)`;
    el.querySelectorAll(".gb").forEach(b => b.classList.toggle("on", +b.dataset.k <= si));
  };
  el.querySelector(".hl").textContent = "Speed";
  function ready() {
    head();
    const x = items[i];
    box.innerHTML = `<p class="eyebrow">${esc(x.topic)} · paragraph ${x.para}</p><div class="sflash" aria-live="off"><span></span></div>
      <div class="spbar"><i id="sprog"></i></div>`;
    el.querySelector("#gtell").textContent = `${SPEEDS[si]} words a minute. Read every word: the question comes after.`;
    countdown(box.querySelector(".sflash"), () => flash(chunks(x.words), 0));
  }
  function flash(cs, k) {
    if (over) return;
    if (k >= cs.length) return ask();
    const sp = box.querySelector(".sflash span");
    sp.textContent = cs[k]; sp.classList.remove("in"); void sp.offsetWidth; sp.classList.add("in");
    box.querySelector("#sprog").style.width = (100 * (k + 1) / cs.length) + "%";
    const n = cs[k].split(" ").length;
    timer = setTimeout(() => flash(cs, k + 1), n * 60000 / SPEEDS[si] + (/[.!?]["”]?$/.test(cs[k]) ? 150 : 0));
  }
  function ask() {
    const x = items[i], order = shuffled(x.q.opts.map((_, k) => k));
    box.innerHTML = `<p class="eyebrow">${esc(x.skill)}</p><p class="stem">${esc(x.q.stem)}</p>
      <div class="opts">${order.map((k, n) => `<button class="opt" data-o="${k}"><span class="k">${"ABCD"[n]}</span><span>${esc(x.q.opts[k])}</span></button>`).join("")}</div>`;
    el.querySelector("#gtell").textContent = "";
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.o, b));
  }
  function answer(o, btn) {
    const x = items[i], right = o === 0, at = SPEEDS[si];
    words.push({ w: x.q.stem, answer: x.q.opts[0], hit: right, skill: x.skill, text: x.text, para: x.para, wpm: at, sentence: x.words.join(" "), focus: x.q.focus });
    const gain = 10 + Math.round(at / 10);
    const sr = stage.getBoundingClientRect(), br = btn.getBoundingClientRect(), bx = br.left - sr.left + br.width / 2, by = br.top - sr.top + br.height / 2;
    if (right) { hits++; streak++; run++; points += gain; play("ok"); burst(stage, bx, by, CONFETTI, 16); floatText(stage, bx, by - 14, `+${gain}`); }
    else { streak = 0; run = 0; play("bad"); }
    setCombo(el, run);
    const was = si; si = nextSpeed(si, right, streak); if (si > was) { streak = 0; play("level"); } top = Math.max(top, SPEEDS[si]);
    box.querySelectorAll(".opt").forEach(b => { b.disabled = true; const k = +b.dataset.o; if (k === 0) b.classList.add("right"); else if (k === o) b.classList.add("wrong"); });
    const para = esc(x.words.join(" ")), f = x.q.focus && para.includes(esc(x.q.focus)) ? para.replace(esc(x.q.focus), `<mark>${esc(x.q.focus)}</mark>`) : para;
    box.insertAdjacentHTML("beforeend", `<div class="fb ${right ? "ok" : "info"} pop"><p><strong>${right ? `Right! +${gain} points.` : "Not this time."}</strong>
      ${si > was ? ` Speeding up to ${SPEEDS[si]} words a minute.` : si < was ? ` Slowing down to ${SPEEDS[si]} words a minute.` : ""}</p>
      ${right ? "" : `<p class="spara">${f}</p>`}</div>
      <div class="row"><button class="btn" id="snext">${i + 1 >= items.length ? "Finish" : "Next paragraph"}</button></div>`);
    box.querySelector("#snext").onclick = () => { i++; if (i >= items.length) finish(); else ready(); };
    head();
    if (si > was) banner(el, `Faster! ${SPEEDS[si]} wpm`);
  }
  function finish() {
    over = true; clearTimeout(timer);
    onEnd({ points, hits, misses: items.length - hits, level: top, top, words, seconds: Math.round((Date.now() - t0) / 1000) });
  }
  ready();
  return () => { over = true; clearTimeout(timer); };
}

/* ---------------- Trap Dodger ---------------- */
// Under the sea (fixed colours in both themes). The four options are bubbles that rise while the clip plays.
// Pop the answer before it escapes at the top. Popping a trap, or letting the answer escape, loses a life.
const SEA = `<div class="sea" aria-hidden="true"><i class="ray r1"></i><i class="ray r2"></i><i class="ray r3"></i>
  <i class="fizz f1"></i><i class="fizz f2"></i><i class="fizz f3"></i><i class="fizz f4"></i><i class="fizz f5"></i>
  <svg class="weed" viewBox="0 0 400 70" preserveAspectRatio="none"><path class="wd1" d="M0 70V38q12-16 24 0t24 0 24-6 20 8V70zM300 70V30q14-18 28 0t28-4 22 6 22 2V70z"/>
  <path class="wd2" d="M30 70q-8-26 4-48M44 70q10-30-2-56M352 70q-10-28 2-50M368 70q8-24-4-44M180 70q-6-18 6-30M196 70q8-22-4-36"/>
  <ellipse class="rock" cx="120" cy="66" rx="40" ry="12"/><ellipse class="rock" cx="250" cy="68" rx="30" ry="9"/></svg></div>`;
export function playDodge(el, { tier = 0, seen = new Map(), missed = new Set(), onEnd }) {
  const start = dodgeLevelFor(tier);
  el.innerHTML = `<div class="game dodge">${hud(DODGE_LIVES)}
    <div class="dq" id="dq"><p class="eyebrow" id="dqn"></p><p class="dstem" id="dstem"></p><i class="dread"></i></div>
    <div class="arena darena" id="arena">${SEA}<div class="dwave" id="dwave" aria-hidden="true">${"<i></i>".repeat(7)}</div><div class="gbanner"></div></div>
    <div class="row dctl"><button class="btn small alt" id="dreplay" disabled>🔁 Replay</button><span class="note" id="dplays"></span></div>
    <div id="dfb" aria-live="polite"></div>
    <p class="note" id="gtell" aria-live="polite"></p></div>`;
  const arena = el.querySelector("#arena"), wave = el.querySelector("#dwave"), fb = el.querySelector("#dfb"), rep = el.querySelector("#dreplay");
  const dq = el.querySelector("#dq"), tell = t => { el.querySelector("#gtell").textContent = t; };
  const audio = new Audio(); audio.preload = "auto";
  let level = start, points = 0, hits = 0, misses = 0, streak = 0, round = 0, over = false, stop = () => {}, timer = null;
  let cur = null, bubs = [], p = 0, D = 400, tt = 0, plays = 0, heard = false, phase = "read";
  const words = [], used = [], t0 = Date.now();
  const maxPlays = () => LAB_PLAYS[cur.tier];
  function setPlays() {
    const left = Math.max(0, maxPlays() - plays);
    el.querySelector("#dplays").textContent = phase === "end" ? "" : left ? `${left} replay${left > 1 ? "s" : ""} left. The bubbles wait while it plays.` : "No replays left.";
  }
  function listen() {
    plays++; audio.currentTime = 0;
    audio.play().then(() => wave.classList.add("on")).catch(failed);
    rep.disabled = true; setPlays();
  }
  audio.onended = () => { wave.classList.remove("on"); heard = true; rep.disabled = phase === "play" && plays >= maxPlays(); };
  // A clip that doesn't start or load does not use up a play, and Replay is ready to try again.
  function failed() { if (phase !== "play") return; plays = Math.max(0, plays - 1); rep.disabled = false; setPlays(); tell("The clip didn't start. Tap Replay to try again."); }
  audio.onerror = () => { if (cur) failed(); };
  rep.onclick = () => {
    if (over || !cur) return;
    if (phase === "play") { if (plays >= maxPlays()) return; listen(); }
    else if (phase === "end") { audio.currentTime = 0; audio.play().then(() => wave.classList.add("on")).catch(() => {}); }
    play("tap");
  };

  function next() {
    if (over) return;
    if (misses >= DODGE_LIVES) return finish("Out of lives!");
    if (round >= DODGE_ROUNDS) return finish(`${hits} of ${DODGE_ROUNDS} traps dodged!`);
    round++; const review = words.filter(w => w.again).length < DODGE_REVIEW ? missed : new Set();
    cur = dodgeItem(dodgeTier(level), used, Math.random, seen, review); cur.again = review.has(cur.clip); cur.tier = cur.level || 0; used.push(cur.clip);
    fb.innerHTML = ""; bubs.forEach(o => o.el.remove()); bubs = []; p = 0; plays = 0; heard = false; phase = "read";
    el.querySelector("#dqn").textContent = `Clip ${round} of ${DODGE_ROUNDS} · ${LAB_LEVELS[cur.tier]}${cur.again ? " · 🔁 you missed this one before" : ""}`;
    el.querySelector("#dstem").textContent = cur.stem;
    el.querySelector("#glv").textContent = level;
    el.querySelector("#gleft") && (el.querySelector("#gleft").textContent = "");
    audio.src = `audio/listening/${cur.clip}.mp3?v=${AUDIO_V}`; audio.load();
    makeBubbles();
    rep.disabled = true; rep.textContent = "🔁 Replay"; setPlays();
    tell("Read the question and the bubbles. What kind of answer do you need?");
    dq.classList.remove("reading"); void dq.offsetWidth; dq.classList.add("reading");
    timer = setTimeout(() => {
      if (over) return; phase = "play"; dq.classList.remove("reading");
      tell("Listen! Pop the bubble with the answer. On a keyboard, press 1 to 4.");
      listen(); stop = run();
    }, 4000);
  }
  function makeBubbles() {
    shuffled(cur.opts.map((_, k) => k)).forEach((k, n) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "bub";
      b.innerHTML = `<span class="gk">${n + 1}</span><span>${esc(cur.opts[k].t)}</span>`;
      arena.appendChild(b);
      const o = { k, n, el: b, x: 0, y0: 0, h: 0, ph: Math.random() * 6.28, done: false };
      b.onclick = () => tap(o); bubs.push(o);
    });
    layout(); draw();
  }
  // Two columns, two rows, staggered. All bubbles rise together; time is up when the highest one is half out of the top.
  function layout() {
    const W = arena.clientWidth, H = arena.clientHeight, lane = W / 2;
    const rowH = Math.max(...bubs.map(o => o.el.offsetHeight)) + 14;
    bubs.forEach(o => {
      const col = o.n % 2, row = Math.floor(o.n / 2), w = o.el.offsetWidth;
      o.h = o.el.offsetHeight;
      o.x = Math.min(Math.max(6, col * lane + (lane - w) / 2), W - w - 6);
      o.y0 = H - 20 - o.h - (1 - row) * rowH - (col ? 18 : 0);
    });
    D = Math.min(...bubs.map(o => o.y0 + o.h / 2));
  }
  function draw() {
    bubs.forEach(o => {
      if (o.done) return;
      const y = o.y0 - p * D, x = o.x + Math.sin(tt * 1.6 + o.ph) * 6;
      o.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
    });
  }
  // The bubbles follow the recording: while it plays they rise only CLIP_SHARE of the way up (and wait while it loads
  // or is replayed). After it ends they take the thinking time to reach the top.
  function rise(dt) {
    if (!audio.paused && !audio.ended) {
      const d = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : clipSeconds(cur.clip);
      p = Math.max(p, CLIP_SHARE * Math.min(1, audio.currentTime / d));
    } else if (heard) p = Math.min(1, Math.max(p, CLIP_SHARE) + (1 - CLIP_SHARE) * dt / dodgeThink(level));
  }
  const run = () => loop(dt => {
    tt += dt; rise(dt); draw();
    if (p >= 1) escaped();
  });

  function endRound() { phase = "end"; stop(); clearTimeout(timer); audio.pause(); wave.classList.remove("on"); bubs.forEach(o => { o.done = true; o.el.disabled = true; }); }
  function centre(o) { const r = o.el.getBoundingClientRect(), a = arena.getBoundingClientRect(); return [r.left - a.left + r.width / 2, r.top - a.top + r.height / 2]; }
  function hurt() {
    arena.classList.remove("hurt"); void arena.offsetWidth; arena.classList.add("hurt");
    el.querySelectorAll("#glives i").forEach((i, k) => i.classList.toggle("lost", k >= DODGE_LIVES - misses));
  }
  function tap(o) {
    if (over || phase !== "play" || o.done) return;
    endRound();
    const [cx, cy] = centre(o), ans = bubs.find(b => b.k === 0);
    if (o.k === 0) {
      hits++; streak++; const gain = dodgeGain(cur.tier, p, streak); points += gain;
      o.el.classList.add("popped"); burst(arena, cx, cy, ["#BFE9FF", "#7FD3FF", "#FFFFFF", "#F6C94A"], 16); floatText(arena, cx, cy - 10, `+${gain}`); play("ok");
      words.push({ clip: cur.clip, stem: cur.stem, answer: cur.opts[0].t, trap: cur.trap, tier: cur.tier, again: cur.again, hit: true });
      const nl = dodgeLevel(start, hits);
      if (nl > level) {
        const up = dodgeTier(nl) > dodgeTier(level); level = nl; play("level");
        banner(el, up ? `Level ${level}: ${LAB_LEVELS[dodgeTier(level)]} clips!` : `Level ${level}: faster bubbles!`);
        arena.classList.remove("flash"); void arena.offsetWidth; arena.classList.add("flash");
      }
      reveal("hit", gain);
    } else {
      misses++; streak = 0; play("bad");
      o.el.classList.add("trapped"); ans.el.classList.add("answer");
      burst(arena, cx, cy, ["#FF8A3D", "#FFC07A", "#9AA4AE"], 12); floatText(arena, cx, cy - 10, "🪤", "bad"); hurt();
      words.push({ clip: cur.clip, stem: cur.stem, answer: cur.opts[0].t, trap: cur.trap, tier: cur.tier, again: cur.again, hit: false, picked: cur.opts[o.k].t });
      reveal("trap", o.k);
    }
    setPoints(el, points); setCombo(el, streak);
  }
  function escaped() {
    if (phase !== "play") return;
    endRound(); misses++; streak = 0; play("bad"); hurt(); setCombo(el, 0);
    const ans = bubs.find(b => b.k === 0); ans.el.classList.add("answer", "back");
    ans.el.style.transform = `translate(${ans.x.toFixed(1)}px,${Math.max(8, ans.y0 * 0.35).toFixed(1)}px)`;
    words.push({ clip: cur.clip, stem: cur.stem, answer: cur.opts[0].t, trap: cur.trap, tier: cur.tier, again: cur.again, hit: false });
    reveal("escape");
  }
  function transcript(it) {
    return it.lines.map(([who, text]) => `<p><b>${esc(who.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()))}:</b> ${markLine(text, it.key, it.traps || []).map(q =>
      q.kind === "key" ? `<mark class="lkey">${esc(q.t)}</mark>` : q.kind === "trap" ? `<mark class="ltrap" title="${esc(q.label)}">${esc(q.t)}</mark>` : esc(q.t)).join("")}</p>`).join("");
  }
  // A right answer moves on by itself after a short pause. A trap or an escape explains why and waits for "Next clip".
  function reveal(kind, x) {
    rep.disabled = kind === "hit"; rep.textContent = "🔁 Hear it again"; setPlays();
    const ans = cur.opts[0].t, last = misses >= DODGE_LIVES || round >= DODGE_ROUNDS, trap = TRAPS[cur.trap], tname = cur.trap !== "prime" ? ` ${trap.name}.` : "";
    const head = kind === "hit" ? `<p><strong>Popped! +${x} points.</strong> ${cur.again ? "You got the one you missed before!" : "You dodged the traps."}</p>`
      : kind === "trap" ? `<p><strong>🪤 Trapped!${tname}</strong> “${esc(cur.opts[x].t)}”: ${esc(cur.opts[x].why || "")}</p><p>The answer was <b>${esc(ans)}</b>${/[.!?]$/.test(ans) ? "" : "."}</p>`
      : `<p><strong>It got away!</strong> The answer was <b>${esc(ans)}</b>${/[.!?]$/.test(ans) ? "" : "."} Look at the transcript to see where you could hear it.</p>`;
    fb.innerHTML = `<div class="fb ${kind === "hit" ? "ok" : "info"} pop">${head}
      ${kind === "hit" ? `<p>The words that gave you the answer: <mark class="lkey">${esc(cur.key)}</mark></p>`
        : `<div class="dtrans">${transcript(cur)}</div><p class="note legend"><mark class="lkey">green</mark> gives the answer${(cur.traps || []).length ? ` · <mark class="ltrap">orange</mark> is the trap` : ""}</p>
           <p class="note">💡 ${esc(trap.tip)}</p>`}</div>
      ${kind === "hit" ? `<div class="dauto"><i style="animation-duration:${AUTO_NEXT}ms"></i></div><p class="note">${last ? "Adding up your score…" : "Next clip coming…"}</p>`
        : `<div class="row"><button class="btn" id="dnext">${last ? "See your score" : "Next clip"}</button></div>`}`;
    tell(misses >= DODGE_LIVES ? "That was your last life." : "");
    if (kind === "hit") { timer = setTimeout(next, AUTO_NEXT); return; }
    const nb = fb.querySelector("#dnext"); nb.onclick = () => { play("tap"); next(); };
    if (kind !== "hit" && misses >= DODGE_LIVES) banner(el, "Out of lives!", "big");
    nb.focus({ preventScroll: true });
  }
  function finish(msg) {
    if (over) return; over = true; cleanup();
    fb.innerHTML = ""; banner(el, msg, "big"); rep.disabled = true;
    if (hits >= DODGE_ROUNDS * 0.7) burst(arena, arena.clientWidth / 2, arena.clientHeight * 0.4, CONFETTI, 28);
    setTimeout(() => onEnd({ points, hits, misses: words.length - hits, level, words, seconds: Math.round((Date.now() - t0) / 1000) }), 1500);
  }
  const key = ev => {
    if (phase !== "play") return;
    const n = "1234".indexOf(ev.key), o = bubs.find(b => b.n === n);
    if (o) { ev.preventDefault(); tap(o); }
  };
  document.addEventListener("keydown", key);
  function cleanup() { stop(); clearTimeout(timer); document.removeEventListener("keydown", key); audio.pause(); wave.classList.remove("on"); }
  countdown(arena, () => { if (!over) next(); });
  return () => { over = true; cleanup(); audio.removeAttribute("src"); };
}
