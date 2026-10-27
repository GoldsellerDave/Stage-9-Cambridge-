// Games: Word Rain (catch each meaning with its word), Word Train (send each word to its word-class station)
// and Speed Read (a paragraph flashes up a few words at a time, then one question).
// The pure helpers at the top are tested; playRain and playTrain draw the game into an element and call onEnd with the result.
import { unitWords } from "./practice.js";
import { FAMILIES } from "./families.js";
import { play } from "./sound.js";
import { PRACTICE_TEXTS } from "./content.js";

export const GAMES = {
  rain: { name: "Word Rain", blurb: "Meanings fall from the sky. Tap the word that matches before it lands." },
  train: { name: "Word Train", blurb: "Send each word to the right station: noun, verb, adjective or adverb." },
  speed: { name: "Speed Read", blurb: "A paragraph flashes past a few words at a time. Answer one question, then go faster." }
};
export const GAME_XP_DAY = 30;           // the most XP games can give in one school day
export const RAIN_LIVES = 3, RAIN_SECONDS = 120, TRAIN_COUNT = 20;
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
export const isGame = id => /^(rain|train|speed)-u\d$/.test(id || "");
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
function hud(lives) {
  return `<div class="ghud"><span>Level <b id="glv">1</b></span><span><b id="gpts">0</b> points</span>
    ${lives ? `<span class="glives" id="glives" aria-label="${lives} lives">${"<i></i>".repeat(lives)}</span>` : `<span id="gleft"></span>`}<span id="gtime"></span></div>`;
}
function banner(el, text, cls = "") {
  const b = el.querySelector(".gbanner"); if (!b) return;
  b.textContent = text; b.className = "gbanner show " + cls;
  clearTimeout(b._t); b._t = setTimeout(() => { b.className = "gbanner"; }, 1300);
}

/* ---------------- Word Rain ---------------- */
export function playRain(el, { unit, onEnd }) {
  const pool = rainPool(unit), cards = deck(pool);
  el.innerHTML = `<div class="game rain">${hud(RAIN_LIVES)}
    <div class="arena" id="arena"><div class="water" id="water"></div><div class="gbanner"></div></div>
    <div class="gbtns" id="gbtns">${[0, 1, 2, 3].map(i => `<button class="gbtn" data-i="${i}"><span class="gk">${i + 1}</span><span class="gword"></span></button>`).join("")}</div>
    <p class="note" id="gtell" aria-live="polite">Tap the word that matches the falling meaning. On a keyboard, press 1 to 4.</p></div>`;
  const arena = el.querySelector("#arena"), water = el.querySelector("#water"), btns = [...el.querySelectorAll(".gbtn")];
  let drops = [], slots = [null, null, null, null], t = 0, sinceSpawn = 99, points = 0, hits = 0, misses = 0, level = 1, over = false;
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
    const d = document.createElement("div"); d.className = "drop"; d.innerHTML = `<span>${esc(x.def)}</span>`;
    arena.appendChild(d);
    const left = Math.random() * Math.max(0, arena.clientWidth - d.offsetWidth);
    drops.push({ x, el: d, y: -d.offsetHeight, left }); setButtons(); sinceSpawn = 0;
  }
  function remove(d) { drops = drops.filter(o => o !== d); }
  function pop(d, k) {
    const ground = arena.clientHeight - waterH();
    const gain = 10 * level + Math.round(10 * Math.max(0, 1 - (d.y + d.el.offsetHeight) / ground));
    points += gain; hits++; words.push({ w: d.x.w, hit: true });
    d.el.classList.add("popped"); d.el.innerHTML += `<b class="gain">+${gain}</b>`;
    setTimeout(() => d.el.remove(), 450); remove(d);
    btns[k].classList.add("right"); setTimeout(() => btns[k].classList.remove("right"), 300);
    play("ok");
    const nl = levelAfter(hits); if (nl > level) { level = nl; play("level"); banner(el, `Level ${level}: faster!`); }
    swapOut(d.x.w);
  }
  // A word that has been answered leaves the buttons, so students read the next meaning instead of tapping the same place.
  function swapOut(w) {
    const k = slots.indexOf(w); if (k < 0 || drops.some(o => o.x.w === w)) return;
    const used = new Set(slots), d = shuffled(pool).find(x => !used.has(x.w)); slots[k] = d ? d.w : w; setButtons();
  }
  function land(d) {
    misses++; words.push({ w: d.x.w, hit: false }); cards.again(d.x);
    d.el.classList.add("splash"); setTimeout(() => d.el.remove(), 500); remove(d);
    el.querySelector("#gtell").innerHTML = `<b>${esc(d.x.w)}</b>: ${esc(d.x.def)}`;
    play("bad"); water.style.height = waterH() + "px";
    el.querySelectorAll("#glives i").forEach((i, k) => i.classList.toggle("lost", k >= RAIN_LIVES - misses));
    if (misses >= RAIN_LIVES) finish("The water is too high!"); else swapOut(d.x.w);
  }
  function tap(k) {
    if (over) return;
    const w = slots[k], hit = drops.filter(d => d.x.w === w).sort((a, b) => b.y - a.y)[0];
    if (hit) return pop(hit, k);
    points = Math.max(0, points - 5); play("bad");
    btns[k].classList.remove("shake"); void btns[k].offsetWidth; btns[k].classList.add("shake");
  }
  function finish(msg) {
    if (over) return; over = true; stop();
    // Meanings still falling when the time is up are not counted: the student had no chance to answer them.
    banner(el, msg, "big"); btns.forEach(b => b.disabled = true);
    setTimeout(() => { cleanup(); onEnd({ points, hits, misses, level, words, seconds: Math.round(t) }); }, 1500);
  }
  const stop = loop(dt => {
    t += dt; sinceSpawn += dt;
    const H = arena.clientHeight, ground = H - waterH(), speed = H / fallTime();
    if (drops.length < maxDrops() && (drops.length === 0 || sinceSpawn > fallTime() * 0.45)) spawn();
    drops.slice().forEach(d => { d.y += speed * dt; d.el.style.transform = `translate(${d.left}px,${d.y}px)`; if (d.y + d.el.offsetHeight >= ground) land(d); });
    el.querySelector("#gpts").textContent = points; el.querySelector("#glv").textContent = level;
    el.querySelector("#gtime").textContent = fmt(RAIN_SECONDS - t);
    if (t >= RAIN_SECONDS) finish("Time's up!");
  });
  btns.forEach((b, k) => b.onclick = () => tap(k));
  const key = ev => { const k = "1234".indexOf(ev.key); if (k >= 0) { ev.preventDefault(); tap(k); } };
  document.addEventListener("keydown", key);
  function cleanup() { stop(); document.removeEventListener("keydown", key); }
  water.style.height = waterH() + "px";
  return () => { over = true; cleanup(); };
}
const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

/* ---------------- Word Train ---------------- */
const SVGNS = "http://www.w3.org/2000/svg";
// The track winds across the top (a long run-up to think), turns at the junction, and branches down to the stations on the left.
const VB = { w: 400, h: 400, jx: 215, jy: 140, sx: 84 };
const APPROACH = `M-60 45 H315 C372 45 372 ${VB.jy} 315 ${VB.jy} H${VB.jx}`;
export function playTrain(el, { unit, onEnd }) {
  const pool = trainPool(unit), st = trainStations(pool), cards = deck(pool);
  const ys = st.map((_, k) => Math.round(200 + k * 170 / (st.length - 1)));
  const fromJ = y => `M${VB.jx} ${VB.jy} C${VB.jx - 75} ${VB.jy} ${VB.jx - 75} ${y} ${VB.jx - 130} ${y} H${VB.sx}`;
  const branch = y => APPROACH + fromJ(y).replace(/^M[\d.]+ [\d.]+/, "");
  el.innerHTML = `<div class="game train">${hud(0)}
    <div class="arena tarena"><svg viewBox="0 0 ${VB.w} ${VB.h}" role="img" aria-label="Railway with ${st.length} stations: ${st.join(", ")}">
      <path class="rail" d="${APPROACH}"/><path id="tapp" d="${APPROACH}" fill="none" stroke="none"/>
      ${ys.map((y, k) => `<path class="rail" d="${fromJ(y)}"/><path id="tb${k}" d="${branch(y)}" fill="none" stroke="none"/>`).join("")}
      <path class="rail on" id="tsw" d="${fromJ(ys[0])}"/>
      <circle class="junction" cx="${VB.jx}" cy="${VB.jy}" r="7"/>
      ${st.map((s, k) => `<g class="station s-${s}" data-k="${k}" id="ts${k}"><rect x="4" y="${ys[k] - 20}" width="${VB.sx - 4}" height="40" rx="8"/>
        <text x="${(VB.sx + 4) / 2}" y="${ys[k] + 5}" text-anchor="middle">${s}</text></g>`).join("")}
      <g id="trains"></g></svg><div class="gbanner"></div></div>
    <div class="gbtns tbtns">${st.map((s, k) => `<button class="gbtn s-${s}" data-k="${k}"><span class="gk">${k + 1}</span><span class="gword">${s[0].toUpperCase() + s.slice(1)}</span></button>`).join("")}</div>
    <p class="note" id="gtell" aria-live="polite">Set the points before each train reaches the junction. Tap a station, or press 1 to ${st.length}.</p></div>`;
  const layer = el.querySelector("#trains"), sw = el.querySelector("#tsw");
  const paths = st.map((_, k) => el.querySelector("#tb" + k)), lens = paths.map(p => p.getTotalLength());
  const common = el.querySelector("#tapp").getTotalLength();
  const btns = [...el.querySelectorAll(".gbtn")];
  let trains = [], cur = 0, t = 0, sinceSpawn = 99, sent = 0, done = 0, points = 0, hits = 0, streak = 0, level = 1, over = false;
  const words = [];
  const speed = () => 30 + 6 * level;                              // svg units per second: about 17 s to the junction at level 1
  const gap = () => Math.max(3, 7.5 - 0.6 * level);                // seconds between trains

  function setSwitch(k) {
    if (over || k < 0 || k >= st.length) return;
    cur = k; sw.setAttribute("d", fromJ(ys[k])); play("tap");
    btns.forEach((b, i) => b.classList.toggle("sel", i === k));
    el.querySelectorAll(".station").forEach((g, i) => g.classList.toggle("sel", i === k));
  }
  function spawn() {
    const x = cards.next(trains.map(o => o.x.w)), g = document.createElementNS(SVGNS, "g");
    const len = Math.max(54, x.w.length * 7.4 + 18);
    g.setAttribute("class", "tcar");
    g.innerHTML = `<rect x="${-len}" y="-12" width="${len}" height="24" rx="7"/><rect class="nose" x="-7" y="-12" width="7" height="24" rx="3"/>
      <text x="${-len / 2}" y="0" dominant-baseline="central" text-anchor="middle">${esc(x.w)}</text>`;
    layer.appendChild(g);
    trains.push({ x, g, s: 0, k: null, len, flip: false, label: g.querySelector("text") }); sent++; sinceSpawn = 0;
  }
  function arrive(o) {
    trains = trains.filter(q => q !== o); done++;
    const ok = st[o.k] === o.x.pos, stn = el.querySelector("#ts" + o.k);
    words.push({ w: o.x.w, pos: o.x.pos, hit: ok });
    o.g.classList.add(ok ? "in" : "wrong"); setTimeout(() => o.g.remove(), 350);
    stn.classList.remove("good", "bad"); void stn.getBBox(); stn.classList.add(ok ? "good" : "bad");
    setTimeout(() => stn.classList.remove("good", "bad"), 500);
    if (ok) {
      hits++; streak++; const gain = 10 * level + (streak >= 3 ? 5 : 0); points += gain; play("ok");
      const nl = levelAfter(hits); if (nl > level) { level = nl; play("level"); banner(el, `Level ${level}: faster trains!`); }
    } else {
      streak = 0; play("bad");
      el.querySelector("#gtell").innerHTML = `<b>${esc(o.x.w)}</b> is ${o.x.pos === "adjective" || o.x.pos === "adverb" ? "an" : "a"} <b>${o.x.pos}</b>.${o.x.family ? ` Family: ${esc(o.x.family)}` : ""}`;
    }
    if (done >= TRAIN_COUNT) finish();
  }
  function finish() {
    over = true; stop(); banner(el, `${hits} of ${TRAIN_COUNT} trains on time!`, "big"); btns.forEach(b => b.disabled = true);
    setTimeout(() => { cleanup(); onEnd({ points, hits, misses: TRAIN_COUNT - hits, level, words, seconds: Math.round(t) }); }, 1500);
  }
  const stop = loop(dt => {
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
      if (flip !== o.flip) { o.flip = flip; o.label.setAttribute("transform", flip ? `rotate(180 ${-o.len / 2} 0)` : ""); }
    });
    el.querySelector("#gpts").textContent = points; el.querySelector("#glv").textContent = level;
    el.querySelector("#gleft").textContent = `Train ${Math.min(sent, TRAIN_COUNT)} of ${TRAIN_COUNT}`;
  });
  btns.forEach((b, k) => b.onclick = () => setSwitch(k));
  el.querySelectorAll(".station").forEach(g => g.addEventListener("click", () => setSwitch(+g.dataset.k)));
  const key = ev => { const k = "1234".indexOf(ev.key); if (k >= 0) { ev.preventDefault(); setSwitch(k); } };
  document.addEventListener("keydown", key);
  function cleanup() { stop(); document.removeEventListener("keydown", key); }
  setSwitch(0);
  return () => { over = true; cleanup(); };
}

/* ---------------- Speed Read ---------------- */
export function playSpeed(el, { unit, texts, level, wpm, onEnd }) {
  const items = speedItems(texts, level).slice(0, SPEED_ROUND);
  let i = 0, si = Math.max(0, SPEEDS.indexOf(wpm)), streak = 0, points = 0, hits = 0, top = SPEEDS[si], timer = null, over = false;
  const t0 = Date.now(), words = [];
  el.innerHTML = `<div class="game speed">${hud(0)}<div class="sbox" id="sbox"></div><p class="note" id="gtell" aria-live="polite"></p></div>`;
  const box = el.querySelector("#sbox");
  const head = () => {
    el.querySelector("#glv").textContent = SPEEDS[si] + " wpm"; el.querySelector("#gpts").textContent = points;
    el.querySelector("#gleft").textContent = `Question ${Math.min(i + 1, items.length)} of ${items.length}`;
  };
  el.querySelector(".ghud span").firstChild.textContent = "Speed ";
  function ready() {
    head();
    const x = items[i];
    box.innerHTML = `<p class="eyebrow">${esc(x.topic)} · paragraph ${x.para}</p><div class="sflash" aria-live="off"><span>Get ready…</span></div>
      <div class="sbar"><i id="sprog"></i></div>`;
    el.querySelector("#gtell").textContent = `${SPEEDS[si]} words a minute. Read every word: the question comes after.`;
    timer = setTimeout(() => flash(chunks(x.words), 0), 1200);
  }
  function flash(cs, k) {
    if (over) return;
    if (k >= cs.length) return ask();
    box.querySelector(".sflash span").textContent = cs[k];
    box.querySelector("#sprog").style.width = (100 * (k + 1) / cs.length) + "%";
    const n = cs[k].split(" ").length;
    timer = setTimeout(() => flash(cs, k + 1), n * 60000 / SPEEDS[si] + (/[.!?]["”]?$/.test(cs[k]) ? 150 : 0));
  }
  function ask() {
    const x = items[i], order = shuffled(x.q.opts.map((_, k) => k));
    box.innerHTML = `<p class="eyebrow">${esc(x.skill)}</p><p class="stem">${esc(x.q.stem)}</p>
      <div class="opts">${order.map((k, n) => `<button class="opt" data-o="${k}"><span class="k">${"ABCD"[n]}</span><span>${esc(x.q.opts[k])}</span></button>`).join("")}</div>`;
    el.querySelector("#gtell").textContent = "";
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.o));
  }
  function answer(o) {
    const x = items[i], right = o === 0, at = SPEEDS[si];
    words.push({ w: x.q.stem, answer: x.q.opts[0], hit: right, skill: x.skill, text: x.text, para: x.para, wpm: at, sentence: x.words.join(" "), focus: x.q.focus });
    if (right) { hits++; streak++; const gain = 10 + Math.round(at / 10); points += gain; play("ok"); }
    else { streak = 0; play("bad"); }
    const was = si; si = nextSpeed(si, right, streak); if (si > was) { streak = 0; play("level"); } top = Math.max(top, SPEEDS[si]);
    box.querySelectorAll(".opt").forEach(b => { b.disabled = true; const k = +b.dataset.o; if (k === 0) b.classList.add("right"); else if (k === o) b.classList.add("wrong"); });
    const para = esc(x.words.join(" ")), f = x.q.focus && para.includes(esc(x.q.focus)) ? para.replace(esc(x.q.focus), `<mark>${esc(x.q.focus)}</mark>`) : para;
    box.insertAdjacentHTML("beforeend", `<div class="fb ${right ? "ok" : "info"} pop"><p><strong>${right ? `Right! +${10 + Math.round(at / 10)} points.` : "Not this time."}</strong>
      ${si > was ? ` Speeding up to ${SPEEDS[si]} words a minute.` : si < was ? ` Slowing down to ${SPEEDS[si]} words a minute.` : ""}</p>
      ${right ? "" : `<p class="spara">${f}</p>`}</div>
      <div class="row"><button class="btn" id="snext">${i + 1 >= items.length ? "Finish" : "Next paragraph"}</button></div>`);
    box.querySelector("#snext").onclick = () => { i++; if (i >= items.length) finish(); else ready(); };
    head();
  }
  function finish() {
    over = true; clearTimeout(timer);
    onEnd({ points, hits, misses: items.length - hits, level: top, top, words, seconds: Math.round((Date.now() - t0) / 1000) });
  }
  ready();
  return () => { over = true; clearTimeout(timer); };
}
