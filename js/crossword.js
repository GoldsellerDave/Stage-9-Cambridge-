// Word Crossword: the unit's words in a crossword, with their meanings as clues. Two sizes for every unit: Quick (8 words)
// and Big (14 words). A new grid is made each game, so it can be played again. Strong readers get some of the unit's
// Stretch (and at C1, Challenge) words in the Big crossword.
// Typing a whole word checks it: a right word lights up with sparkles and a chime, a wrong one shakes.
// Help costs points: an example sentence (-25) or one letter (-40). A word solved without a letter shown counts as known;
// the others go into the word review, like Word Rain.
// The pure helpers at the top are tested; playCross draws the game into an element and calls onEnd with the result.
import { unitWords } from "./practice.js";
import { extraWords } from "./vocab-extra.js";
import { play } from "./sound.js";

export const CROSS = { cross: { words: 8, max: 11 }, crossl: { words: 14, max: 15 } };
export const CROSS_PTS = { word: 100, hint: 25, letter: 40, wrong: 10, combo: 20 };
const MIN_LEN = 3, MAX_LEN = 13;

/* ---------------- data ---------------- */
// The letters that go in the grid: "look up to" → LOOKUPTO. enumeration shows the parts: (4,2,2), (7-7).
export const answerOf = w => w.toUpperCase().replace(/[^A-Z]/g, "");
export const enumeration = w => /[ -]/.test(w) ? `(${w.split(/([ -])/).map(p => p === " " ? "," : p === "-" ? "-" : p.replace(/[^A-Za-z]/g, "").length).join("")})` : `(${answerOf(w).length})`;
// A clue must not give the answer away: no part of the answer (4+ letters) in the meaning, and no "a ban" or "to be…" entries.
export function fairClue(x) {
  if (/^(a|an|to) /i.test(x.w)) return false;
  const def = x.def.toLowerCase();
  return x.w.toLowerCase().split(/[ -]/).filter(p => p.length >= 4).every(p => !def.includes(p.slice(0, Math.max(4, p.length - 2))));
}
export function crossPool(unit, size = "cross", tier = 0) {
  const ok = x => { const n = answerOf(x.w).length; return n >= MIN_LEN && n <= MAX_LEN && fairClue(x); };
  const core = unitWords(unit).filter(ok).map(x => ({ w: x.w, def: x.def, ex: x.ex, unit }));
  if (size !== "crossl") return core;
  // The Big crossword needs enough words; strong readers always get some harder ones.
  const extra = extraWords(unit, Math.max(1, tier)).filter(ok).map(x => ({ w: x.w, def: x.def, ex: x.ex, unit, tier: x.tier }));
  const take = tier > 0 ? 4 : Math.max(0, CROSS.crossl.words + 4 - core.length);
  return [...core, ...extra.filter(x => tier >= 2 || x.tier === 1).slice(0, take)];
}

/* ---------------- grid maker ---------------- */
// A small seeded random generator, so tests can make the same grid twice.
export function rng(seed = Date.now()) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const shuffle = (a, r) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Place words one at a time where they cross the most letters already in the grid. Words may only touch where they cross.
function attempt(words, want, max, r) {
  const cells = new Map(), key = (x, y) => x + "," + y, placed = [];
  let box = { x0: 0, y0: 0, x1: -1, y1: -1 };
  const at = (x, y) => cells.get(key(x, y));
  const fits = (a, x, y, dx, dy) => {
    let cross = 0;
    if (at(x - dx, y - dy) || at(x + dx * a.length, y + dy * a.length)) return -1;
    for (let i = 0; i < a.length; i++) {
      const cx = x + dx * i, cy = y + dy * i, c = at(cx, cy);
      if (c) { if (c.ch !== a[i] || c[dx ? "h" : "v"]) return -1; cross++; continue; }
      if (at(cx + dy, cy + dx) || at(cx - dy, cy - dx)) return -1;             // a letter beside it would make a false word
    }
    const nx0 = Math.min(box.x0, x), ny0 = Math.min(box.y0, y), nx1 = Math.max(box.x1, x + dx * (a.length - 1)), ny1 = Math.max(box.y1, y + dy * (a.length - 1));
    if (nx1 - nx0 + 1 > max || ny1 - ny0 + 1 > max) return -1;
    return cross;
  };
  const put = (it, x, y, dx, dy) => {
    for (let i = 0; i < it.a.length; i++) {
      const k = key(x + dx * i, y + dy * i), c = cells.get(k) || { ch: it.a[i] };
      c[dx ? "h" : "v"] = true; cells.set(k, c);
    }
    box = placed.length ? { x0: Math.min(box.x0, x), y0: Math.min(box.y0, y), x1: Math.max(box.x1, x + dx * (it.a.length - 1)), y1: Math.max(box.y1, y + dy * (it.a.length - 1)) }
                        : { x0: x, y0: y, x1: x + dx * (it.a.length - 1), y1: y + dy * (it.a.length - 1) };
    placed.push({ ...it, x, y, dir: dx ? "across" : "down" });
  };
  const list = words.map(w => ({ ...w, a: answerOf(w.w) })).filter(w => w.a.length <= max);
  // Start with a long word, then try the rest longest first (shuffled within similar lengths).
  const order = shuffle(list, r).sort((p, q) => Math.round(q.a.length / 3) - Math.round(p.a.length / 3));
  put(order[0], 0, 0, 1, 0);
  let rest = order.slice(1), crosses = 0;
  for (let pass = 0; pass < 2 && placed.length < want; pass++) {
    const left = [];
    for (const it of rest) {
      if (placed.length >= want) break;
      let best = null;
      for (const p of placed) for (let i = 0; i < p.a.length; i++) for (let j = 0; j < it.a.length; j++) {
        if (p.a[i] !== it.a[j]) continue;
        const across = p.dir === "down", dx = across ? 1 : 0, dy = across ? 0 : 1;
        const x = (across ? p.x : p.x + i) - dx * j, y = (across ? p.y + i : p.y) - dy * j;
        const c = fits(it.a, x, y, dx, dy);
        if (c > 0 && (!best || c + r() * 0.5 > best.c)) best = { x, y, dx, dy, c };
      }
      if (best) { put(it, best.x, best.y, best.dx, best.dy); crosses += best.c; } else left.push(it);
    }
    rest = left;
  }
  return { placed, box, cross: crosses };
}

// A crossword with up to `want` words from the list, no bigger than max × max. Tries many layouts and keeps the one with
// the most words, then the most crossings, then the most square shape.
export function makeCrossword(words, want = 8, max = 11, seed) {
  const r = rng(seed ?? Math.floor(Math.random() * 1e9));
  let best = null;
  for (let t = 0; t < 150; t++) {
    const pick = shuffle(words, r).slice(0, Math.min(words.length, want + 8));
    const g = attempt(pick, want, max, r), w = g.box.x1 - g.box.x0 + 1, h = g.box.y1 - g.box.y0 + 1;
    const score = g.placed.length * 1000 + g.cross * 40 - Math.abs(w - h) * 10 - w * h * 2;
    if (!best || score > best.score) best = { ...g, score, w, h };
    if (best.placed.length >= want && t > 80) break;
  }
  // Move to (0, 0) and number the clues in reading order, as in a printed crossword.
  const words2 = best.placed.map(p => ({ ...p, x: p.x - best.box.x0, y: p.y - best.box.y0 }));
  const starts = [...new Set(words2.map(p => p.y * 100 + p.x))].sort((a, b) => a - b);
  words2.forEach(p => { p.n = starts.indexOf(p.y * 100 + p.x) + 1; p.id = p.n + (p.dir === "across" ? "a" : "d"); });
  words2.sort((a, b) => (a.dir === b.dir ? a.n - b.n : a.dir === "across" ? -1 : 1));
  const grid = Array.from({ length: best.h }, () => Array(best.w).fill(null));
  words2.forEach(p => { for (let i = 0; i < p.a.length; i++) { const x = p.x + (p.dir === "across" ? i : 0), y = p.y + (p.dir === "down" ? i : 0); grid[y][x] = p.a[i]; } });
  return { w: best.w, h: best.h, grid, words: words2 };
}
// The cells of a word, in order.
export const cellsOf = p => Array.from({ length: p.a.length }, (_, i) => [p.x + (p.dir === "across" ? i : 0), p.y + (p.dir === "down" ? i : 0)]);

// Points for one word: 100, less help, plus a streak bonus for words in a row solved with no help or mistakes.
export function wordPoints({ hints = 0, letters = 0, wrong = 0 }, combo = 0) {
  return Math.max(10, CROSS_PTS.word - hints * CROSS_PTS.hint - letters * CROSS_PTS.letter - wrong * CROSS_PTS.wrong) + Math.max(0, combo - 1) * CROSS_PTS.combo;
}
// Stars at the end: 3 = no letters shown and quick, 2 = at most two letters shown, 1 = finished.
export function crossStars(R, size) {
  const n = R.words.length, shown = R.words.reduce((t, x) => t + x.letters, 0), quick = R.seconds <= n * 30;
  return shown === 0 && quick ? 3 : shown <= 2 ? 2 : 1;
}

/* ---------------- the game ---------------- */
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const SPARK = ["#FFD54A", "#4FC3F7", "#F06292", "#81C784", "#FF8A65", "#B388FF"];
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function playCross(el, { unit, size = "cross", wordTier = 0, onEnd }) {
  const conf = CROSS[size], pz = makeCrossword(crossPool(unit, size, wordTier), conf.words, conf.max);
  const W = pz.words, st = Object.fromEntries(W.map(p => [p.id, { hints: 0, letters: 0, wrong: 0, done: false, shown: new Set() }]));
  const fill = pz.grid.map(row => row.map(c => (c ? "" : null)));
  const owners = {}; W.forEach(p => cellsOf(p).forEach(([x, y]) => (owners[x + "," + y] = owners[x + "," + y] || []).push(p)));
  let cur = W[0], pos = 0, points = 0, combo = 0, bestCombo = 0, t0 = performance.now(), over = false, timer = 0;
  const numAt = {}; W.forEach(p => (numAt[p.x + "," + p.y] = p.n));

  el.innerHTML = `<div class="game cross"><div class="ghud"><span class="hchip pts"><b id="gpts">0</b> pts</span><span class="hchip combo" id="gcombo" hidden></span>
      <span class="hchip" id="gleft"></span><span class="hchip time" id="gtime">0:00</span></div>
    <div class="xstage" id="xstage"><div class="xsky" aria-hidden="true">${"ABCDEFGHIJ".split("").map((c, i) => `<i style="--i:${i}">${"WORDPLAYFUN"[i]}</i>`).join("")}</div>
      <div class="xgrid" id="xgrid" style="--cols:${pz.w};--rows:${pz.h}" role="grid" aria-label="Crossword, ${W.length} words">${pz.grid.map((row, y) => row.map((c, x) => c
        ? `<button class="xc" data-x="${x}" data-y="${y}" aria-label="Square">${numAt[x + "," + y] ? `<span class="xn">${numAt[x + "," + y]}</span>` : ""}<span class="xl"></span></button>`
        : `<i class="xe"></i>`).join("")).join("")}</div><div class="gbanner"></div></div>
    <div class="xclue" id="xclue"><button class="xnav" id="xprev" aria-label="Previous clue">‹</button><div class="xct" aria-live="polite"><b id="xcn"></b> <span id="xctext"></span><span class="xex" id="xex" hidden></span></div><button class="xnav" id="xnext" aria-label="Next clue">›</button></div>
    <div class="row xhelp"><button class="btn small alt" id="xhint" aria-label="Show an example sentence, minus ${CROSS_PTS.hint} points">💡 Example <span class="note">-${CROSS_PTS.hint}</span></button><button class="btn small alt" id="xletter" aria-label="Show a letter, minus ${CROSS_PTS.letter} points">🔍 Letter <span class="note">-${CROSS_PTS.letter}</span></button></div>
    <div class="xkeys" id="xkeys">${KEYS.map((r, i) => `<div class="xkr">${r.split("").map(k => `<button class="xk" data-k="${k}">${k}</button>`).join("")}${i === 2 ? `<button class="xk wide" data-k="DEL" aria-label="Delete">⌫</button>` : ""}</div>`).join("")}</div>
    <details class="xlist"><summary>All clues</summary><div class="xcols">${["across", "down"].map(d => `<div><b>${d === "across" ? "Across" : "Down"}</b><ol>${W.filter(p => p.dir === d).map(p =>
      `<li data-c="${p.id}"><span class="xln">${p.n}</span> ${esc(p.def)} ${enumeration(p.w)}</li>`).join("")}</ol></div>`).join("")}</div></details></div>`;

  const $ = s => el.querySelector(s), cellEl = (x, y) => el.querySelector(`.xc[data-x="${x}"][data-y="${y}"]`), stage = $("#xstage");
  const left = () => W.filter(p => !st[p.id].done).length;
  const setPts = () => { const b = $("#gpts"); b.textContent = points; const c = b.parentNode; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); };
  const setCombo = () => { const c = $("#gcombo"); c.hidden = combo < 2; c.textContent = `🔥 ×${combo}`; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); };
  const banner = (text, cls = "") => { const b = $(".gbanner"); b.textContent = text; b.className = "gbanner show " + cls; clearTimeout(b._t); b._t = setTimeout(() => { b.className = "gbanner"; }, 1300); };
  const centre = cells => { const r0 = stage.getBoundingClientRect(), a = cellEl(...cells[0]).getBoundingClientRect(), b = cellEl(...cells[cells.length - 1]).getBoundingClientRect();
    return [(a.left + b.right) / 2 - r0.left, (a.top + b.bottom) / 2 - r0.top]; };
  const floatText = (x, y, text, cls = "") => { const f = document.createElement("b"); f.className = "gfloat " + cls; f.textContent = text; f.style.left = x + "px"; f.style.top = y + "px"; stage.appendChild(f); setTimeout(() => f.remove(), 950); };
  const burst = (x, y, n = 16) => { if (reduced()) return; for (let i = 0; i < n; i++) {
    const p = document.createElement("i"); p.className = "gpart xspark"; const a = (i / n) * Math.PI * 2 + Math.random() * 0.4, d = 40 + Math.random() * 46;
    p.style.cssText = `left:${x}px;top:${y}px;--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;background:${SPARK[i % SPARK.length]}`;
    stage.appendChild(p); setTimeout(() => p.remove(), 800); } };

  function draw() {
    const mine = new Set(cellsOf(cur).map(([x, y]) => x + "," + y)), [px, py] = cellsOf(cur)[pos];
    el.querySelectorAll(".xc").forEach(b => {
      const x = +b.dataset.x, y = +b.dataset.y, k = x + "," + y, done = (owners[k] || []).some(p => st[p.id].done);
      b.querySelector(".xl").textContent = fill[y][x];
      b.classList.toggle("on", mine.has(k)); b.classList.toggle("cur", x === px && y === py); b.classList.toggle("ok", done);
      b.classList.toggle("given", (owners[k] || []).some(p => st[p.id].shown.has(k)));
    });
    $("#xcn").textContent = `${cur.n} ${cur.dir === "across" ? "Across" : "Down"}`;
    $("#xctext").textContent = `${cur.def} ${enumeration(cur.w)}`;
    const s = st[cur.id], ex = $("#xex"); ex.hidden = !s.hints; if (s.hints) ex.textContent = "“" + cur.ex.replace("___", "_____") + "”";
    $("#xhint").disabled = s.done || s.hints > 0; $("#xletter").disabled = s.done;
    $("#gleft").textContent = `${W.length - left()} of ${W.length} words`;
    el.querySelectorAll(".xlist li").forEach(li => { li.classList.toggle("done", st[li.dataset.c].done); li.classList.toggle("now", li.dataset.c === cur.id); });
  }
  function choose(p, i = null) {
    cur = p; const cs = cellsOf(p);
    pos = i ?? Math.max(0, cs.findIndex(([x, y]) => !fill[y][x])); if (pos < 0) pos = 0;
    const box = $("#xclue"); box.classList.remove("swap"); void box.offsetWidth; box.classList.add("swap");
    draw();
  }
  const nextOpen = (step = 1) => { const i = W.indexOf(cur); for (let k = 1; k <= W.length; k++) { const p = W[(i + step * k + W.length * 3) % W.length]; if (!st[p.id].done) return p; } return cur; };

  function solved(p) {
    const s = st[p.id], cs = cellsOf(p); s.done = true;
    const clean = !s.hints && !s.letters && !s.wrong; combo = clean ? combo + 1 : 0; bestCombo = Math.max(bestCombo, combo);
    const pts = wordPoints(s, combo); points += pts; setPts(); setCombo();
    cs.forEach(([x, y], i) => { const b = cellEl(x, y); b.style.setProperty("--d", i * 55 + "ms"); b.classList.remove("win"); void b.offsetWidth; b.classList.add("win"); });
    const [cx, cy] = centre(cs); burst(cx, cy, clean ? 20 : 10); floatText(cx, cy, "+" + pts);
    play("ok"); setTimeout(() => play(clean ? "glint" : "flip"), 180);
    const n = left();
    if (!n) return finish();
    if (combo >= 3) banner(`🔥 ${combo} in a row!`); else if (n === Math.floor(W.length / 2)) banner("Halfway there!", "big"); else if (n === 1) banner("Last word!", "big");
    choose(nextOpen());
  }
  function check(p) {
    const cs = cellsOf(p), word = cs.map(([x, y]) => fill[y][x]).join("");
    if (word.length < p.a.length || cs.some(([x, y]) => !fill[y][x])) return false;
    if (word === p.a) { solved(p); return true; }
    st[p.id].wrong++; combo = 0; setCombo(); play("bad");
    cs.forEach(([x, y]) => { const b = cellEl(x, y); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); });
    const [cx, cy] = centre(cs); floatText(cx, cy, "Not quite", "bad");
    return true;
  }
  function type(k) {
    if (over) return;
    if (st[cur.id].done) { choose(nextOpen()); if (k === "DEL" || st[cur.id].done) return; }
    const cs = cellsOf(cur);
    if (k === "DEL") {
      let [x, y] = cs[pos];
      if (!fill[y][x] || isLocked(x, y)) { if (pos > 0) pos--; [x, y] = cs[pos]; }
      if (!isLocked(x, y)) fill[y][x] = ""; play("tap"); return draw();
    }
    const [x, y] = cs[pos];
    if (!isLocked(x, y)) { fill[y][x] = k; const b = cellEl(x, y); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); play("tap"); }
    // Move on to the next empty square of this word.
    const nxt = cs.findIndex(([a, b], i) => i > pos && !fill[b][a]); pos = nxt >= 0 ? nxt : Math.min(pos + 1, cs.length - 1);
    draw();
    const crossing = (owners[x + "," + y] || []).filter(p => p !== cur && !st[p.id].done);
    check(cur); crossing.forEach(p => !over && check(p));
    draw();
  }
  const isLocked = (x, y) => (owners[x + "," + y] || []).some(p => st[p.id].done);

  el.querySelectorAll(".xc").forEach(b => b.onclick = () => {
    const x = +b.dataset.x, y = +b.dataset.y, os = owners[x + "," + y];
    const p = os.includes(cur) && os.length > 1 && cellsOf(cur)[pos][0] === x && cellsOf(cur)[pos][1] === y ? os.find(o => o !== cur) : os.includes(cur) ? cur : os[0];
    play("flip"); choose(p, cellsOf(p).findIndex(([a, c]) => a === x && c === y));
  });
  el.querySelectorAll(".xk").forEach(b => b.onclick = () => type(b.dataset.k));
  el.querySelectorAll(".xlist li").forEach(li => li.onclick = () => { play("flip"); choose(W.find(p => p.id === li.dataset.c)); });
  $("#xprev").onclick = () => { play("flip"); choose(nextOpen(-1)); };
  $("#xnext").onclick = () => { play("flip"); choose(nextOpen(1)); };
  $("#xhint").onclick = () => { const s = st[cur.id]; if (s.done || s.hints) return; s.hints++; combo = 0; setCombo(); play("info"); draw(); };
  $("#xletter").onclick = () => {
    const s = st[cur.id]; if (s.done) return;
    const cs = cellsOf(cur), i = cs.findIndex(([x, y]) => fill[y][x] !== pz.grid[y][x]); if (i < 0) return;
    const [x, y] = cs[i]; fill[y][x] = pz.grid[y][x]; s.letters++; s.shown.add(x + "," + y); combo = 0; setCombo();
    const b = cellEl(x, y); b.classList.remove("reveal"); void b.offsetWidth; b.classList.add("reveal"); play("glint");
    pos = Math.min(i + 1, cs.length - 1); draw(); check(cur); draw();
  };
  const onKey = ev => {
    if (over || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (/^[a-z]$/i.test(ev.key)) { ev.preventDefault(); type(ev.key.toUpperCase()); }
    else if (ev.key === "Backspace") { ev.preventDefault(); type("DEL"); }
    else if (ev.key === "Enter" || ev.key === "Tab") { ev.preventDefault(); play("flip"); choose(nextOpen(ev.shiftKey ? -1 : 1)); }
    else if (ev.key === "ArrowRight" || ev.key === "ArrowDown") { ev.preventDefault(); pos = Math.min(pos + 1, cur.a.length - 1); draw(); }
    else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") { ev.preventDefault(); pos = Math.max(pos - 1, 0); draw(); }
  };
  document.addEventListener("keydown", onKey);
  const fmt = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
  timer = setInterval(() => { const t = $("#gtime"); if (t) t.textContent = fmt((performance.now() - t0) / 1000); }, 500);

  function finish() {
    over = true; clearInterval(timer); document.removeEventListener("keydown", onKey);
    const seconds = Math.round((performance.now() - t0) / 1000);
    const words = W.map(p => ({ w: p.w, def: p.def, hit: st[p.id].letters === 0, letters: st[p.id].letters, hints: st[p.id].hints, wrong: st[p.id].wrong, ...(p.tier ? { tier: p.tier } : {}) }));
    const R = { points, hits: words.filter(x => x.hit).length, words, seconds, combo: bestCombo, size };
    R.level = crossStars(R, size);
    // The finale: a rainbow wave across the grid, fireworks and a fanfare, then the results.
    el.querySelectorAll(".xc").forEach(b => { b.style.setProperty("--d", (+b.dataset.x + +b.dataset.y) * 45 + "ms"); b.classList.add("wave"); });
    const r0 = stage.getBoundingClientRect();
    [[.25, .3], [.75, .35], [.5, .6], [.3, .75], [.7, .7]].forEach(([fx, fy], i) => setTimeout(() => burst(r0.width * fx, r0.height * fy, 22), i * 220));
    banner(`${"⭐".repeat(R.level)} Crossword complete!`, "big"); play("win");
    setTimeout(() => onEnd(R), reduced() ? 600 : 2400);
  }
  choose(W[0]);
  if (typeof matchMedia === "function" && matchMedia("(min-width:900px)").matches) $(".xlist").open = true;
  requestAnimationFrame(() => el.querySelector(".ghud").scrollIntoView({ block: "start", behavior: "smooth" }));
  return () => { over = true; clearInterval(timer); document.removeEventListener("keydown", onKey); };
}
