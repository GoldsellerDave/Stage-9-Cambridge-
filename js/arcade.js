// Escape Arcade: the unit's escape room as a fast arcade game, drawn with the Phaser game engine.
// Three timed rooms (words fall from the ceiling, a magnifying torch over the leaflet, grammar notes on a conveyor belt),
// combo scoring and speed that adapts inside the game. The puzzles come from js/escape.js (makeEscape), so every unit
// with an escape room gets an arcade version. Phaser (about 1 MB) loads only when a student starts the game.
import { makeEscape, ESCAPES } from "./escape.js";

const PHASER_SRC = "assets/vendor/phaser-3.90.0.min.js";
let loading = null;
function loadFont() {
  if (!document.getElementById("arcade-font")) {
    const l = document.createElement("link"); l.id = "arcade-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;800&family=Playfair+Display:wght@700;900&display=swap"; document.head.appendChild(l);
  }
  const wait = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("800 30px Nunito"), document.fonts.load("900 30px 'Playfair Display'")]).catch(() => {}) : Promise.resolve();
  return Promise.race([wait, new Promise(r => setTimeout(r, 1500))]);
}
function loadPhaser() {
  if (window.Phaser) return Promise.resolve(window.Phaser);
  return loading = loading || new Promise((ok, fail) => {
    const s = document.createElement("script"); s.src = PHASER_SRC; s.async = true;
    s.onload = () => ok(window.Phaser); s.onerror = () => { loading = null; fail(new Error("The game engine didn't load. Check the internet connection and try again.")); };
    document.head.appendChild(s);
  });
}

export const hasArcade = unit => !!ESCAPES[unit];
export const ARCADE_ROOMS = { vocab: 6, reading: 3, grammar: 5 };

// The puzzles for one game: more words and grammar notes than one escape room has, so several rooms are merged.
export function arcadeContent(unit, tier = 0, rnd = Math.random) {
  const E = ESCAPES[unit]; if (!E) return null;
  const games = [0, 1, 2, 3].map(() => makeEscape(unit, tier, rnd));
  const uniq = (list, key) => list.filter((x, i) => list.findIndex(y => key(y) === key(x)) === i);
  const room = kind => games.flatMap(g => (g.rooms.find(r => r.kind === kind) || { puzzles: [] }).puzzles);
  return {
    title: E.title, story: E.story, escaped: E.escaped, doc: E.doc,
    vocab: uniq(room("vocab"), p => p.answer).slice(0, ARCADE_ROOMS.vocab),
    reading: room("reading").slice(0, ARCADE_ROOMS.reading),
    grammar: uniq(room("grammar"), p => p.text + p.answer).slice(0, ARCADE_ROOMS.grammar)
  };
}

// Start a game in a full-screen layer. opts: unit, wordTier, sound, name, onEnd(R), onQuit(). Returns a stop function.
export function playArcade(box, opts) {
  const layer = document.createElement("div");
  layer.className = "arcade";
  layer.innerHTML = `<div class="arcade-stage" id="arcade-stage"><p class="arcade-load">Loading the game…</p></div>
    <button class="arcade-quit" aria-label="Leave the game">✕</button>`;
  document.body.appendChild(layer); document.body.classList.add("arcade-on");
  let game = null, stopped = false;
  const stop = () => { if (stopped) return; stopped = true; try { game && game.destroy(true); } catch (e) {} layer.remove(); document.body.classList.remove("arcade-on"); };
  layer.querySelector(".arcade-quit").onclick = () => { stop(); opts.onQuit && opts.onQuit(); };
  const content = arcadeContent(opts.unit, opts.wordTier || 0);
  Promise.all([loadPhaser(), loadFont()]).then(([Phaser]) => {
    if (stopped) return;
    layer.querySelector(".arcade-load").remove();
    game = layer.game = startGame(Phaser, layer.querySelector("#arcade-stage"), content, opts, R => { stop(); opts.onEnd(R); });
  }).catch(err => { const p = layer.querySelector(".arcade-load"); if (p) p.textContent = err.message; });
  return stop;
}


function startGame(Phaser, parent, D, opts, finish) {
  const W = 720, H = 1280;
  // A museum at night: oxblood walls, dark wood, gold frames, cream paper and marble floors.
  const M = {
    wall: 0x2e1a24, wallHi: 0x45283a, wood: 0x3f2717, woodHi: 0x6b4428, gold: 0xc9a24a, goldHi: 0xf1d58a, goldS: "#e9c46a",
    cream: 0xf4ead2, paper: 0xfbf3df, ink: "#2b1d14", inkSoft: "#6b5a48", marbleA: 0xdcd3c3, marbleB: 0xb9ad98,
    night: 0x0f1630, red: 0x8e2b35, redS: "#c0444f", green: 0x2f7a52, greenS: "#4fb27c", navy: 0x22365e, stone: 0xe6dcc6,
    steel: 0x3a3f48, steelHi: 0x6d7480, creamS: "#f4ead2", soft: "#d9c7a6", dim: "#9c8a6e"
  };
  const HEAD = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const BODY = "'Nunito', 'Trebuchet MS', system-ui, sans-serif";
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const t0 = Date.now();

  // One game's state. level 0-4 moves up after 3 right in a row and down after a mistake.
  const G = { score: 0, combo: 0, best: 0, level: clamp((opts.wordTier || 0) * 2, 0, 4), streak: 0, words: [],
              skills: { vocab: { c: 0, t: 0, rt: [] }, reading: { c: 0, t: 0, rt: [] }, grammar: { c: 0, t: 0, rt: [] } } };
  function record(skill, ok, ms) {
    const s = G.skills[skill]; s.t++; if (ok) { s.c++; s.rt.push(ms); }
    if (ok) { G.combo++; G.streak++; G.best = Math.max(G.best, G.combo); if (G.streak >= 3) { G.level = clamp(G.level + 1, 0, 4); G.streak = 0; } }
    else { G.combo = 0; G.streak = 0; G.level = clamp(G.level - 1, 0, 4); }
  }
  const mult = () => 1 + Math.min(4, Math.floor(G.combo / 3));   // x1 .. x5

  // Sounds are made by the browser, so there are no sound files. They follow the app's sound setting.
  const SFX = {
    ctx: null,
    init() { if (!opts.sound) return; try { this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)(); this.ctx.resume && this.ctx.resume(); } catch (e) { this.ctx = null; } },
    tone(f, d = 0.12, type = "sine", v = 0.18, slide = 0) {
      const c = this.ctx; if (!c) return;
      const o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
      o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + d);
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + 0.02);
    },
    good(n = 0) { const b = 523 * Math.pow(1.06, Math.min(n, 12)); this.tone(b, 0.1, "triangle"); setTimeout(() => this.tone(b * 1.5, 0.16, "triangle"), 70); },
    bad() { this.tone(180, 0.25, "sawtooth", 0.12, -90); },
    tick() { this.tone(900, 0.04, "square", 0.05); },
    open() { [392, 523, 659, 784].forEach((f, i) => setTimeout(() => this.tone(f, 0.22, "triangle", 0.16), i * 90)); },
    whoosh() { this.tone(300, 0.2, "sine", 0.08, 500); }
  };

  // ---------- drawing helpers ----------
  function txt(scene, x, y, s, size = 28, color = M.creamS, o = {}) {
    return scene.add.text(x, y, s, { fontFamily: o.head ? HEAD : BODY, fontSize: size + "px", color, fontStyle: o.bold === false ? "normal" : "bold",
      align: o.align || "center", wordWrap: o.wrap ? { width: o.wrap } : undefined, lineSpacing: o.ls || 4 }).setOrigin(o.ox ?? 0.5, o.oy ?? 0.5);
  }
  function rr(scene, x, y, w, h, r, fill, alpha = 1, stroke) {
    const g = scene.add.graphics(); g.fillStyle(fill, alpha); g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
    if (stroke) { g.lineStyle(stroke.w, stroke.c, stroke.a ?? 1); g.strokeRoundedRect(-w / 2, -h / 2, w, h, r); }
    g.x = x; g.y = y; return g;
  }
  // A gilded frame: dark outline, gold moulding, a thin inner line. Draws into g around the rectangle (x, y, w, h).
  function gilt(g, x, y, w, h, t = 14) {
    g.fillStyle(0x6e5320, 1); g.fillRect(x - t - 2, y - t - 2, w + 2 * t + 4, h + 2 * t + 4);
    g.fillStyle(M.gold, 1); g.fillRect(x - t, y - t, w + 2 * t, h + 2 * t);
    g.fillStyle(M.goldHi, 1); g.fillRect(x - t, y - t, w + 2 * t, 4); g.fillRect(x - t, y - t, 4, h + 2 * t);
    g.fillStyle(0x8a6a2a, 1); g.fillRect(x - t, y + h + t - 4, w + 2 * t, 4); g.fillRect(x + w + t - 4, y - t, 4, h + 2 * t);
    g.lineStyle(2, 0x6e5320, 1); g.strokeRect(x - 4, y - 4, w + 8, h + 8);
  }
  // Small paintings for the walls, all drawn with shapes (no image files).
  function painting(scene, x, y, w, h, kind, alpha = 1) {
    const g = scene.add.graphics().setAlpha(alpha);
    gilt(g, x - w / 2, y - h / 2, w, h, Math.max(8, Math.round(w / 14)));
    const L = x - w / 2, T = y - h / 2;
    if (kind === 0) {          // river landscape
      g.fillGradientStyle(0x8fb3c9, 0x8fb3c9, 0xf0d9a8, 0xf0d9a8, 1); g.fillRect(L, T, w, h);
      g.fillStyle(0xf6e7b0, 1); g.fillCircle(L + w * 0.72, T + h * 0.32, w * 0.09);
      g.fillStyle(0x5d7d4c, 1); g.fillTriangle(L, T + h * 0.75, L + w * 0.45, T + h * 0.42, L + w * 0.9, T + h * 0.75);
      g.fillStyle(0x3f5f3a, 1); g.fillRect(L, T + h * 0.72, w, h * 0.1);
      g.fillStyle(0x4f7fa0, 1); g.fillRect(L, T + h * 0.82, w, h * 0.18);
    } else if (kind === 1) {   // portrait
      g.fillStyle(0x2b2a22, 1); g.fillRect(L, T, w, h);
      g.fillStyle(0x6b3a2a, 1); g.fillEllipse(x, T + h * 0.92, w * 0.8, h * 0.5);
      g.fillStyle(0xd9b48f, 1); g.fillEllipse(x, T + h * 0.42, w * 0.34, h * 0.32);
      g.fillStyle(0x3a2418, 1); g.fillEllipse(x, T + h * 0.31, w * 0.38, h * 0.16);
    } else {                   // still life: a vase of flowers
      g.fillStyle(0x3d4a3a, 1); g.fillRect(L, T, w, h);
      g.fillStyle(0x6b4428, 1); g.fillRect(L, T + h * 0.8, w, h * 0.2);
      g.fillStyle(0x2f5f7a, 1); g.fillEllipse(x, T + h * 0.68, w * 0.3, h * 0.3);
      [[0.4, 0.35, 0xc9443f], [0.55, 0.28, 0xe9c46a], [0.62, 0.42, 0xf0e2d0], [0.45, 0.48, 0xd9774f]].forEach(([fx, fy, c]) => { g.fillStyle(c, 1); g.fillCircle(L + w * fx, T + h * fy, w * 0.07); });
    }
    return g;
  }
  // Oxblood wall with faint stripes, a picture rail, dark wood panelling and a marble floor.
  function room(scene, opts_ = {}) {
    const g = scene.add.graphics(), floorY = opts_.floor ?? 1100, panelTop = floorY - (opts_.panel ?? 200);
    g.fillGradientStyle(opts_.top ?? M.wallHi, opts_.top ?? M.wallHi, opts_.wall ?? M.wall, opts_.wall ?? M.wall, 1); g.fillRect(0, 0, W, floorY);
    for (let x = 0; x < W; x += 36) { g.fillStyle(0x000000, 0.06); g.fillRect(x, 0, 18, panelTop); }
    g.fillStyle(M.gold, 0.55); g.fillRect(0, 150, W, 4);                                  // picture rail
    g.fillStyle(M.wood, 1); g.fillRect(0, panelTop, W, floorY - panelTop);                 // panelling
    g.fillStyle(M.woodHi, 1); g.fillRect(0, panelTop, W, 10);
    for (let x = 24; x < W; x += 172) { g.lineStyle(3, 0x2a190e, 1); g.strokeRect(x, panelTop + 30, 148, floorY - panelTop - 60); g.lineStyle(2, M.woodHi, 0.6); g.strokeRect(x + 6, panelTop + 36, 136, floorY - panelTop - 72); }
    const tile = 80;                                                                      // marble floor
    for (let y = floorY, r = 0; y < H; y += tile, r++) for (let x = -tile / 2 * (r % 2), c = 0; x < W; x += tile, c++) {
      g.fillStyle((r + c) % 2 ? M.marbleA : M.marbleB, 1); g.fillRect(x, y, tile, tile);
      g.lineStyle(1, 0x8f8574, 0.5); g.lineBetween(x + 10, y + 20, x + 50, y + 60);
    }
    g.fillStyle(0x000000, 0.25); g.fillRect(0, floorY, W, 14);
    return g;
  }
  // A cone of warm light from a ceiling lamp.
  function spot(scene, x, y0, y1, w, alpha = 0.08) {
    const g = scene.add.graphics(); g.fillStyle(0xfff0c8, alpha); g.fillTriangle(x - 18, y0, x + 18, y0, x + w / 2, y1); g.fillTriangle(x - 18, y0, x - w / 2, y1, x + w / 2, y1);
    g.fillStyle(M.gold, 1); g.fillRect(x - 22, y0 - 8, 44, 10); return g;
  }
  // Buttons. style "plaque" = cream card with a gold edge; "brass" = round brass key; "dark" = oxblood with gold text.
  function button(scene, x, y, w, h, label, style, cb, size = 30) {
    const ct = scene.add.container(x, y);
    const shadow = rr(scene, 0, 6, w, h, style === "brass" ? h / 2 : 14, 0x000000, 0.35);
    const bg = scene.add.graphics();
    const label_ = txt(scene, 0, 0, label, size, style === "dark" ? M.goldS : M.ink, { wrap: w - 36, head: style === "dark" });
    ct.add([shadow, bg, label_]); Object.assign(ct, { bg, label: label_, w, h, style });
    paint(ct, style === "dark" ? M.red : style === "brass" ? M.gold : M.paper);
    ct.setSize(w, h).setInteractive({ useHandCursor: true });
    ct.on("pointerdown", () => { if (ct.locked) return; scene.tweens.add({ targets: ct, scale: 0.94, duration: 60, yoyo: true }); cb && cb(ct); });
    return ct;
  }
  function paint(b, fill) {
    const { w, h, style } = b, r = style === "brass" ? h / 2 : 14; b.bg.clear();
    b.bg.fillStyle(fill, 1); b.bg.fillRoundedRect(-w / 2, -h / 2, w, h, r);
    b.bg.lineStyle(style === "plaque" ? 3 : 4, style === "brass" ? 0x8a6a2a : M.gold, 1); b.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
    if (style === "brass") { b.bg.fillStyle(0xffffff, 0.25); b.bg.fillEllipse(0, -h * 0.22, w * 0.6, h * 0.25); }
    if (style === "plaque") { b.bg.lineStyle(1, M.gold, 0.6); b.bg.strokeRoundedRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12, 9); }
  }
  // A museum ticket: cream paper, a coloured stub with a dashed tear line.
  function ticket(scene, x, y, word, stub, cb) {
    const w = Math.min(300, Math.max(160, word.length * 17 + 74)), h = 74, ct = scene.add.container(x, y);
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 0.35); g.fillRoundedRect(-w / 2 + 4, -h / 2 + 6, w, h, 8);
    g.fillStyle(M.paper, 1); g.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    g.fillStyle(stub, 1); g.fillRoundedRect(-w / 2, -h / 2, 34, h, { tl: 8, bl: 8, tr: 0, br: 0 });
    for (let yy = -h / 2 + 6; yy < h / 2 - 4; yy += 10) { g.fillStyle(0x8a7a6a, 1); g.fillRect(-w / 2 + 38, yy, 2, 5); }
    g.fillStyle(M.wall, 1); g.fillCircle(-w / 2 + 39, -h / 2, 6); g.fillCircle(-w / 2 + 39, h / 2, 6);
    g.lineStyle(2, M.gold, 0.8); g.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    const t = txt(scene, 18, 0, word, 27, M.ink);
    ct.add([g, t]); Object.assign(ct, { g, word, w, h });
    ct.setSize(w, h).setInteractive({ useHandCursor: true });
    ct.on("pointerdown", () => { if (!ct.locked) cb(ct); });
    return ct;
  }
  function shake(scene, target) { const x0 = target.x; scene.tweens.add({ targets: target, x: x0 + 14, duration: 45, yoyo: true, repeat: 3, onComplete: () => target.x = x0 }); }
  function burst(scene, x, y, tint = M.gold, n = 18) {
    const p = scene.add.particles(x, y, "spark", { speed: { min: 140, max: 420 }, angle: { min: 0, max: 360 }, scale: { start: 1, end: 0 },
      lifespan: 650, gravityY: 500, tint: [tint, M.goldHi, 0xffffff], emitting: false });
    p.explode(n); scene.time.delayedCall(900, () => p.destroy());
  }
  function floatText(scene, x, y, s, color = M.goldS, size = 40) {
    const t = txt(scene, x, y, s, size, color, { head: true }).setStroke("#1a0e12", 8);
    scene.tweens.add({ targets: t, y: y - 90, alpha: 0, duration: 900, ease: "Cubic.easeOut", onComplete: () => t.destroy() });
  }
  function goTo(scene, key, delay = 1300) {
    scene.time.delayedCall(delay, () => { scene.cameras.main.fadeOut(350, 12, 6, 8); scene.cameras.main.once("camerafadeoutcomplete", () => scene.scene.start(key)); });
  }
  function banner(scene, y, s, color) {
    const b = rr(scene, W / 2, y, W - 80, 130, 18, 0x1a0e12, 0.85, { w: 4, c: M.gold });
    const t = txt(scene, W / 2, y, s, 56, color, { head: true, wrap: W - 120 });
    b.setScale(0.6); t.setScale(0.6); scene.tweens.add({ targets: [b, t], scale: 1, duration: 350, ease: "Back.easeOut" });
  }

  // The plaque across the top of every room: room name, score with combo, and the room's timer (a brass tube).
  class Hud {
    constructor(scene, title, seconds) {
      this.s = scene; this.total = seconds * 1000; this.left = this.total; this.running = false; this.lastSec = seconds;
      const g = scene.add.graphics(); g.fillStyle(M.wood, 1); g.fillRoundedRect(16, 14, W - 32, 100, 12);
      g.lineStyle(4, M.gold, 1); g.strokeRoundedRect(16, 14, W - 32, 100, 12); g.lineStyle(1, M.gold, 0.5); g.strokeRoundedRect(24, 22, W - 48, 84, 8);
      txt(scene, 42, 44, title.toUpperCase(), 18, M.goldS, { ox: 0 });
      this.scoreT = txt(scene, 42, 82, String(G.score), 36, M.creamS, { ox: 0, head: true });
      this.multT = txt(scene, W - 42, 64, "", 30, M.goldS, { ox: 1, head: true });
      this.bar = scene.add.graphics(); this.draw();
    }
    draw() {
      const f = clamp(this.left / this.total, 0, 1), x = 300, w = 250, y = 55;
      this.bar.clear(); this.bar.fillStyle(0x1a0e08, 1); this.bar.fillRoundedRect(x - 3, y - 3, w + 6, 24, 12);
      this.bar.fillStyle(f > 0.3 ? 0xe9b44c : 0xd0503f, 1); this.bar.fillRoundedRect(x, y, Math.max(18, w * f), 18, 9);
      this.bar.fillStyle(0xffffff, 0.3); this.bar.fillRoundedRect(x + 4, y + 3, Math.max(10, w * f - 8), 4, 2);
      this.multT.setText(mult() > 1 ? "×" + mult() : "");
    }
    add(points) {
      const from = G.score; G.score += points;
      this.s.tweens.addCounter({ from, to: G.score, duration: 450, onUpdate: tw => this.scoreT.setText(Math.round(tw.getValue())) });
      this.s.tweens.add({ targets: this.scoreT, scale: 1.18, duration: 90, yoyo: true });
      this.draw();
    }
    penalty(ms) { this.left = Math.max(0, this.left - ms); floatText(this.s, 425, 120, "-" + Math.round(ms / 1000) + "s", M.redS, 30); this.draw(); }
    update(dt) {
      if (!this.running) return false;
      this.left -= dt; this.draw();
      const sec = Math.ceil(this.left / 1000); if (sec !== this.lastSec && sec <= 5 && sec > 0) SFX.tick(); this.lastSec = sec;
      return this.left <= 0;
    }
  }
  // A framed museum placard before each room: what to do, then "Enter".
  function intro(scene, n, name, lines, onGo) {
    const ct = scene.add.container(0, 0).setDepth(50);
    const shade = scene.add.rectangle(W / 2, H / 2, W, H, 0x0c0608, 0.8).setInteractive();
    const card = scene.add.graphics(); gilt(card, W / 2 - 280, H / 2 - 320, 560, 640, 18);
    card.fillStyle(M.paper, 1); card.fillRect(W / 2 - 280, H / 2 - 320, 560, 640);
    card.lineStyle(2, M.gold, 1); card.strokeRect(W / 2 - 262, H / 2 - 302, 524, 604);
    const tag = txt(scene, W / 2, H / 2 - 250, "ROOM " + n + " OF 3", 22, M.inkSoft);
    const title = txt(scene, W / 2, H / 2 - 195, name, 50, "#7a2430", { head: true, wrap: 500 });
    const rule = scene.add.graphics(); rule.fillStyle(M.gold, 1); rule.fillRect(W / 2 - 60, H / 2 - 150, 120, 3);
    const body = txt(scene, W / 2, H / 2 - 10, lines, 28, M.ink, { wrap: 480, bold: false, ls: 10 });
    const go = button(scene, W / 2, H / 2 + 220, 300, 92, "Enter", "dark", () => { SFX.whoosh();
      scene.tweens.add({ targets: ct, alpha: 0, duration: 250, onComplete: () => { ct.destroy(); onGo(); } }); }, 36);
    ct.add([shade, card, tag, title, rule, body, go]);
    ct.setAlpha(0); scene.tweens.add({ targets: ct, alpha: 1, duration: 300 });
  }
  // The lock at the bottom of a room: a brass plate (padlock), a steel safe or the back-door keypad.
  class Lock {
    constructor(scene, x, y, n, kind, label) {
      this.s = scene; this.slots = []; this.i = 0; this.kind = kind; const gap = 74, w = n * gap + 50;
      const g = scene.add.graphics(), steel = kind !== "brass";
      g.fillStyle(0x000000, 0.4); g.fillRoundedRect(x - w / 2 + 4, y - 56, w, 120, 18);
      g.fillStyle(steel ? M.steel : 0xb08a3a, 1); g.fillRoundedRect(x - w / 2, y - 60, w, 120, 18);
      g.lineStyle(4, steel ? M.steelHi : M.goldHi, 1); g.strokeRoundedRect(x - w / 2, y - 60, w, 120, 18);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { g.fillStyle(steel ? 0x9aa0aa : 0x6e5320, 1); g.fillCircle(x + a * (w / 2 - 14), y + b * 46, 4); });
      if (label) txt(scene, x, y - 42, label, 14, steel ? "#c9ced6" : "#3a2810");
      for (let i = 0; i < n; i++) {
        const sx = x - (n - 1) * gap / 2 + i * gap, sg = scene.add.graphics();
        this.slots.push({ g: sg, t: txt(scene, sx, y + 8, "", 34, M.creamS, { head: true }), x: sx, y: y + 8 });
        this.draw(this.slots[i], null);
      }
    }
    draw(sl, ok) {
      sl.g.clear(); sl.g.fillStyle(ok === null ? 0x1a1410 : ok ? M.green : 0x5a4a40, 1); sl.g.fillRoundedRect(sl.x - 28, sl.y - 32, 56, 64, 10);
      sl.g.lineStyle(2, ok ? M.goldHi : 0x000000, ok ? 1 : 0.5); sl.g.strokeRoundedRect(sl.x - 28, sl.y - 32, 56, 64, 10);
    }
    fill(ch, ok) {
      const sl = this.slots[this.i++]; if (!sl) return;
      this.draw(sl, ok); sl.t.setText(ok ? ch : "–").setColor(ok ? M.creamS : M.soft).setScale(0);
      this.s.tweens.add({ targets: sl.t, scale: 1, duration: 300, ease: "Back.easeOut" });
      if (ok) burst(this.s, sl.x, sl.y, M.gold, 10);
    }
  }

  // ---------- scenes ----------
  // The museum at night, from the street.
  class Title extends Phaser.Scene {
    constructor() { super("title"); }
    create() {
      const g = this.add.graphics(), cx = W / 2;
      g.fillGradientStyle(0x0a1026, 0x0a1026, 0x2a2a4a, 0x2a2a4a, 1); g.fillRect(0, 0, W, H);
      for (let i = 0; i < 60; i++) { g.fillStyle(0xffffff, Math.random() * 0.6); g.fillCircle(Math.random() * W, Math.random() * 520, Math.random() * 1.8 + 0.4); }
      g.fillStyle(0xf5ecd0, 1); g.fillCircle(640, 400, 30); g.fillStyle(0x0a1026, 1); g.fillCircle(653, 392, 27);
      const top = 470, base = 960;
      g.fillStyle(0xcfc3a8, 1); g.fillTriangle(cx - 300, top, cx + 300, top, cx, top - 140);              // pediment
      g.fillStyle(M.stone, 1); g.fillTriangle(cx - 270, top - 8, cx + 270, top - 8, cx, top - 124);
      g.fillStyle(0xcfc3a8, 1); g.fillRect(cx - 300, top, 600, 64);                                         // frieze
      g.fillStyle(M.stone, 1); g.fillRect(cx - 290, top + 64, 580, base - top - 64);
      for (let i = 0; i < 6; i++) {                                                                          // columns
        const x = cx - 255 + i * 102;
        g.fillStyle(0xf3ecdc, 1); g.fillRect(x, top + 84, 38, base - top - 104);
        g.fillStyle(0xcfc3a8, 1); g.fillRect(x + 8, top + 84, 3, base - top - 104); g.fillRect(x + 20, top + 84, 3, base - top - 104); g.fillRect(x + 30, top + 84, 2, base - top - 104);
        g.fillStyle(0xd8ccb2, 1); g.fillRect(x - 6, top + 70, 50, 16); g.fillRect(x - 6, base - 24, 50, 14);
      }
      g.fillStyle(0x1a1012, 1); g.fillRoundedRect(cx - 60, base - 210, 120, 200, { tl: 60, tr: 60, bl: 0, br: 0 });  // the door
      g.fillStyle(0xe9b44c, 0.9); g.fillRoundedRect(cx - 48, base - 198, 96, 188, { tl: 48, tr: 48, bl: 0, br: 0 });
      g.fillStyle(0x7a4b1c, 1); g.fillRect(cx - 2, base - 198, 4, 188);
      [[cx - 200, 0x8e2b35], [cx + 200, 0x8e2b35]].forEach(([x, c]) => {                                   // banners
        g.fillStyle(c, 1); g.fillRect(x - 34, top + 100, 68, 210); g.fillTriangle(x - 34, top + 310, x + 34, top + 310, x, top + 284);
        g.fillStyle(M.gold, 1); g.fillRect(x - 34, top + 100, 68, 6); g.fillCircle(x, top + 190, 16);
      });
      for (let i = 0; i < 4; i++) { g.fillStyle([0xbdb19a, 0xcfc3a8, 0xbdb19a, 0xcfc3a8][i], 1); g.fillRect(cx - 320 - i * 14, base + i * 24, 640 + i * 28, 24); }   // steps
      g.fillStyle(0x15151f, 1); g.fillRect(0, base + 96, W, H - base - 96);
      txt(this, cx, top + 32, "RIVERSIDE HERITAGE MUSEUM", 24, "#5a4a32", { head: true });
      const glow = this.add.circle(cx, base - 110, 150, 0xffc96a, 0.14); this.tweens.add({ targets: glow, scale: 1.2, alpha: 0.05, duration: 1400, yoyo: true, repeat: -1 });
      [70, W - 70].forEach(x => { g.fillStyle(0x222, 1); g.fillRect(x - 4, base - 140, 8, 236); g.fillStyle(0xffd27a, 1); g.fillCircle(x, base - 150, 16);
        const l = this.add.circle(x, base - 150, 60, 0xffd27a, 0.12); this.tweens.add({ targets: l, alpha: 0.04, duration: 900 + x, yoyo: true, repeat: -1 }); });
      txt(this, cx, 150, "ESCAPE", 96, M.goldS, { head: true }).setStroke("#0a0610", 12);
      txt(this, cx, 246, "ARCADE", 64, M.creamS, { head: true }).setStroke("#0a0610", 10);
      txt(this, cx, 312, `Unit ${opts.unit} · ${D.title}`, 26, M.soft, { wrap: 640 });
      txt(this, cx, 1120, "3 rooms · about 4 minutes · build combos", 24, M.soft, { bold: false });
      const b = button(this, cx, 1196, 400, 96, "Enter the museum", "dark", () => { SFX.init(); SFX.open(); this.cameras.main.fadeOut(350, 12, 6, 8); }, 34);
      this.tweens.add({ targets: b, scale: 1.04, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.cameras.main.fadeIn(400, 12, 6, 8);
      this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("hall"));
    }
  }

  // Room 1: a meaning on the ticket-hall board; tickets fall from the ceiling. Tap the right one before it lands.
  class Hall extends Phaser.Scene {
    constructor() { super("hall"); }
    create() {
      room(this, { floor: 1090, panel: 190 });
      painting(this, 120, 560, 130, 170, 1, 0.75); painting(this, 360, 600, 200, 140, 0, 0.75); painting(this, 600, 560, 130, 170, 2, 0.75);
      [120, 360, 600].forEach(x => spot(this, x, 160, 700, 240, 0.05));
      this.hud = new Hud(this, "Room 1 · The ticket hall", 60);
      this.items = [...D.vocab]; this.N = this.items.length; this.done = 0; this.lock = new Lock(this, W / 2, 1190, this.N, "brass", "PADLOCK");
      const b = this.add.graphics(); gilt(b, 40, 170, W - 80, 170, 12); b.fillStyle(0x1b2a22, 1); b.fillRect(40, 170, W - 80, 170);   // the board
      txt(this, W / 2, 196, "WHICH WORD MEANS…", 18, M.goldS);
      this.signT = txt(this, W / 2, 268, "", 31, M.creamS, { wrap: W - 140 });
      this.tiles = [];
      intro(this, 1, "The ticket hall", "The board shows a meaning.\nTickets fall from the ceiling.\n\nTap the ticket with the word\nbefore it hits the floor.", () => { this.hud.running = true; this.next(); });
    }
    next() {
      this.tiles.forEach(t => t.destroy()); this.tiles = []; this.spawnEv && this.spawnEv.remove();
      if (this.done >= this.N) return this.finish();
      const p = this.items[this.done], n = G.level >= 2 ? 4 : 3;
      const words = shuffle([p.answer, ...shuffle(p.opts.filter(o => o !== p.answer)).slice(0, n - 1)]);
      this.p = p; this.t0 = this.time.now; this.answered = false;
      this.signT.setText(p.text).setAlpha(0); this.tweens.add({ targets: this.signT, alpha: 1, duration: 250 });
      this.fallMs = 4600 - G.level * 450;
      let k = 0; const lanes = shuffle([0, 1, 2, 3]);
      const spawn = () => { if (this.answered) return; this.drop(words[k % words.length], lanes[k % 4]); k++; };
      spawn(); this.spawnEv = this.time.addEvent({ delay: Math.max(520, 900 - G.level * 90), loop: true, callback: spawn });
    }
    drop(word, lane) {
      const t = ticket(this, 0, 390, word, [M.red, M.green, M.navy, 0xb07a2a][lane], tt => this.tap(tt));
      t.x = clamp(130 + lane * 153 + Phaser.Math.Between(-12, 12), t.w / 2 + 10, W - t.w / 2 - 10);
      t.setScale(0); t.angle = Phaser.Math.Between(-7, 7); this.tiles.push(t);
      this.tweens.add({ targets: t, scale: 1, duration: 200, ease: "Back.easeOut" });
      t.fall = this.tweens.add({ targets: t, y: 1050, angle: t.angle + Phaser.Math.Between(-10, 10), duration: this.fallMs, ease: "Sine.easeIn", onComplete: () => this.landed(t) });
    }
    tap(tile) {
      if (this.answered || !this.hud.running) return;
      if (tile.word === this.p.answer) {
        this.answered = true; const ms = this.time.now - this.t0; record("vocab", true, ms); G.words.push({ w: this.p.answer, def: this.p.text, hit: !this.p.missed });
        const pts = (100 + Math.max(0, Math.round(150 - ms / 40))) * mult();
        this.hud.add(pts); floatText(this, tile.x, tile.y - 40, "+" + pts); burst(this, tile.x, tile.y, M.gold, 26); SFX.good(G.combo);
        this.tiles.forEach(t => { t.locked = true; t.fall.stop(); if (t !== tile) this.tweens.add({ targets: t, alpha: 0, scale: 0.6, duration: 200 }); });
        this.tweens.add({ targets: tile, x: this.lock.slots[this.done].x, y: 1190, scale: 0.3, alpha: 0, angle: 0, duration: 380, ease: "Cubic.easeIn",
          onComplete: () => { this.lock.fill(this.p.answer[0].toUpperCase(), true); this.done++; this.time.delayedCall(250, () => this.next()); } });
      } else {
        tile.locked = true; tile.fall.stop(); SFX.bad(); this.hud.penalty(3000);
        if (!this.p.missed) { this.p.missed = true; record("vocab", false, 0); }
        tile.setAlpha(0.6); shake(this, tile); this.cameras.main.shake(120, 0.006);
        this.tweens.add({ targets: tile, alpha: 0, y: tile.y + 60, angle: tile.angle + 40, delay: 250, duration: 300 });
      }
    }
    landed(tile) {
      if (this.answered) return; tile.destroy(); this.tiles = this.tiles.filter(t => t !== tile);
      if (tile.word === this.p.answer) this.miss();
    }
    miss() {
      this.answered = true; if (!this.p.missed) record("vocab", false, 0); G.words.push({ w: this.p.answer, def: this.p.text, hit: false });
      SFX.bad(); this.cameras.main.flash(150, 140, 40, 50);
      floatText(this, W / 2, 420, this.p.answer, M.redS, 38); this.lock.fill("", false); this.done++;
      this.time.delayedCall(700, () => this.next());
    }
    finish() { this.hud.running = false; this.spawnEv && this.spawnEv.remove(); SFX.open(); banner(this, 640, "Padlock open!", M.goldS); goTo(this, "gallery"); }
    update(_, dt) {
      if (this.hud.update(dt)) {   // time up: the rest count as missed
        this.hud.running = false; this.answered = true; this.spawnEv && this.spawnEv.remove(); this.tiles.forEach(t => { t.fall.stop(); t.locked = true; });
        while (this.done < this.N) { const p = this.items[this.done]; if (!p.missed) record("vocab", false, 0); G.words.push({ w: p.answer, def: p.text, hit: false }); this.lock.fill("", false); this.done++; }
        banner(this, 640, "Time's up!", M.redS); goTo(this, "gallery", 1200);
      }
    }
  }

  // Room 2: the gallery in the dark. Drag the magnifying torch over the visitor leaflet to find the numbers for the safe.
  class Gallery extends Phaser.Scene {
    constructor() { super("gallery"); }
    create() {
      room(this, { floor: 1110, panel: 120, wall: 0x140b10, top: 0x1d1118 });
      this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.45);
      this.hud = new Hud(this, "Room 2 · The gallery", 80);
      const top = 150, left = 70, wrap = W - 120;
      const dim = this.add.container(0, 0), lit = this.add.container(0, 0);
      const ghost = this.add.graphics(); ghost.fillStyle(M.paper, 0.06); ghost.fillRect(20, 140, W - 40, 690); dim.add(ghost);
      const paper = this.add.graphics(); paper.fillStyle(M.paper, 1); paper.fillRect(20, 140, W - 40, 690);
      paper.fillStyle(M.red, 1); paper.fillRect(20, 140, W - 40, 58); paper.lineStyle(3, M.gold, 1); paper.strokeRect(28, 148, W - 56, 674); lit.add(paper);
      let y = top + 12;
      lit.add(txt(this, W / 2, y + 7, D.doc.title, 22, M.goldS, { wrap: W - 100, head: true }));
      dim.add(txt(this, W / 2, y + 7, D.doc.title, 22, "#ffffff", { wrap: W - 100, head: true }).setAlpha(0.1)); y += 54;
      const words = D.doc.paras.join(" ").split(/\s+/).length, size = words > 210 ? 18 : 19.5;   // long leaflets: a little smaller
      this.paraY = [];
      D.doc.paras.forEach((p, i) => {
        const n = txt(this, 38, y, String(i + 1), 20, "#8e2b35", { ox: 0, oy: 0, head: true });
        const t = txt(this, left, y, p, size, M.ink, { wrap, align: "left", ox: 0, oy: 0, bold: false, ls: 3 });
        lit.add([n, t]); dim.add(txt(this, left, y, p, size, "#ffffff", { wrap, align: "left", ox: 0, oy: 0, bold: false, ls: 3 }).setAlpha(0.07));
        this.paraY.push([y, t.height]); y += t.height + 14;
      });
      this.torch = this.add.graphics(); this.torch.fillStyle(0xffffff); this.torch.fillCircle(0, 0, 150); this.torch.setVisible(false);
      lit.setMask(this.torch.createGeometryMask()); this.lit = lit; this.MAG = 1.7;
      this.halo = this.add.circle(W / 2, 420, 156, 0xfff2b0, 0.1).setStrokeStyle(10, 0x6e5320, 1);
      this.handle = this.add.rectangle(W / 2, 420, 26, 110, 0x4a2e1c).setStrokeStyle(3, M.gold).setOrigin(0.5, 0);
      this.moveTorch(W / 2, 420);
      const drag = p => { if (p.y < 850 && p.y > 130) this.moveTorch(p.x, p.y); };
      this.input.on("pointermove", drag); this.input.on("pointerdown", drag);
      rr(this, W / 2, 905, W - 40, 110, 14, M.wood, 1, { w: 3, c: M.gold });
      this.qT = txt(this, W / 2, 905, "", 25, M.creamS, { wrap: W - 90 });
      this.pad = [];
      for (let i = 0; i < 9; i++) this.pad.push(button(this, 70 + i * 72.5, 1010, 64, 80, String(i + 1), "brass", b => this.answer(b), 32));
      this.qs = [...D.reading]; this.N = this.qs.length; this.done = 0; this.lock = new Lock(this, W / 2, 1172, this.N, "steel", "SAFE");
      intro(this, 2, "The gallery", "The power is off!\nDrag the magnifying torch over\nthe visitor leaflet to find each answer.\n\nTap the number to open the safe.\nWrong numbers drain the battery.",
        () => { this.hud.running = true; this.ask(); });
    }
    moveTorch(x, y) {
      this.torch.setPosition(x, y); this.halo.setPosition(x, y); this.handle.setPosition(x + 96, y + 96).setAngle(-45);
      this.lit.setScale(this.MAG).setPosition(x - x * this.MAG, y - y * this.MAG);
    }
    ask() {
      if (this.done >= this.N) return this.finish();
      this.q = this.qs[this.done]; this.t0 = this.time.now; this.tries = 0;
      this.qT.setText(this.q.text).setAlpha(0); this.tweens.add({ targets: this.qT, alpha: 1, duration: 250 });
      this.pad.forEach(b => { b.locked = false; paint(b, M.gold); });
    }
    answer(b) {
      if (!this.hud.running || !this.q) return;
      if (b.label.text === String(this.q.answer)) {
        const ms = this.time.now - this.t0, first = this.tries === 0; if (first) record("reading", true, ms);
        const pts = first ? (150 + Math.max(0, Math.round(150 - ms / 120))) * mult() : 40;
        paint(b, 0x7fc79a); burst(this, b.x, b.y, M.gold, 22); SFX.good(G.combo); this.hud.add(pts); floatText(this, b.x, b.y - 50, "+" + pts);
        this.lock.fill(b.label.text, true); this.done++; this.q = null;
        this.pad.forEach(p => p.locked = true); this.time.delayedCall(600, () => this.ask());
      } else {
        this.tries++; if (this.tries === 1) record("reading", false, 0);
        b.locked = true; paint(b, 0x6b5a48); shake(this, b); SFX.bad(); this.hud.penalty(6000);
        const [py, ph] = this.paraY[(this.q.para || 1) - 1] || this.paraY[0], from = { x: this.torch.x, y: this.torch.y };
        this.tweens.add({ targets: from, x: W / 2, y: py + ph / 2, duration: 450, ease: "Cubic.easeOut", onUpdate: () => this.moveTorch(from.x, from.y) });
        floatText(this, W / 2, 860, "Look at paragraph " + (this.q.para || 1), M.goldS, 28);
      }
    }
    finish() { this.hud.running = false; SFX.open(); banner(this, 500, "The safe is open!", M.goldS); goTo(this, "store"); }
    update(_, dt) {
      if (this.hud.update(dt)) {
        this.hud.running = false; this.pad.forEach(p => p.locked = true);
        while (this.done < this.N) { if (!(this.q && this.tries > 0)) record("reading", false, 0); this.q = null; this.lock.fill("", false); this.done++; }
        banner(this, 500, "Battery flat!", M.redS); goTo(this, "store", 1200);
      }
    }
  }

  // Room 3: the storeroom. Catalogue cards with mistakes ride a conveyor belt to the shredder. Fix them first.
  class Store extends Phaser.Scene {
    constructor() { super("store"); }
    create() {
      const g = this.add.graphics();
      g.fillStyle(0x3a2616, 1); g.fillRect(0, 0, W, H);
      for (let y = 0; y < H; y += 46) { g.fillStyle(y % 92 ? 0x412b19 : 0x36230f, 1); g.fillRect(0, y, W, 44); g.fillStyle(0x24170b, 1); g.fillRect(0, y + 44, W, 2); }
      // shelves with crates and wrapped exhibits
      [[150, 250], [300, 470]].forEach(([y]) => { g.fillStyle(0x5d3c22, 1); g.fillRect(0, y, W, 16); g.fillStyle(0x24170b, 1); g.fillRect(0, y + 16, W, 6); });
      [[60, 150, 90, 70], [190, 150, 60, 90], [520, 150, 110, 60]].forEach(([x, y, w, h]) => { g.fillStyle(0x9a7446, 1); g.fillRect(x, y - h, w, h); g.lineStyle(3, 0x5d3c22); g.strokeRect(x, y - h, w, h); g.lineBetween(x, y - h, x + w, y); });
      [[380, 150, 34, 74], [440, 150, 40, 56]].forEach(([x, y, w, h]) => { g.fillStyle(0xd8ccb2, 1); g.fillEllipse(x, y - h / 2, w, h); g.lineStyle(2, 0x9a8a6a); g.strokeEllipse(x, y - h / 2, w, h); });
      g.fillStyle(0x15151a, 1); g.fillRoundedRect(10, 470, W - 20, 40, 20);
      this.rollers = []; for (let i = 0; i < 12; i++) this.rollers.push(this.add.circle(40 + i * 58, 490, 13, M.steel).setStrokeStyle(3, M.steelHi));
      const sh = this.add.graphics(); sh.fillStyle(M.steel, 1); sh.fillRoundedRect(W - 76, 350, 66, 150, 10); sh.lineStyle(3, M.steelHi); sh.strokeRoundedRect(W - 76, 350, 66, 150, 10);
      sh.fillStyle(0x111111, 1); sh.fillRect(W - 70, 370, 54, 10); sh.fillStyle(0xd0503f, 1); sh.fillCircle(W - 43, 470, 8);
      txt(this, W - 43, 330, "SHREDDER", 13, "#d9c7a6");
      this.hud = new Hud(this, "Room 3 · The storeroom", 75);
      this.items = [...D.grammar]; this.N = this.items.length; this.done = 0; this.lock = new Lock(this, W / 2, 1190, this.N, "steel", "BACK DOOR KEYPAD");
      this.opts = [];
      intro(this, 3, "The storeroom", "Catalogue cards with mistakes are\nheading for the shredder!\n\nTap the right words to fix each card\nand get a number for the back door.", () => { this.hud.running = true; this.next(); });
    }
    next() {
      this.opts.forEach(o => o.destroy()); this.opts = []; this.note && this.note.destroy();
      if (this.done >= this.N) return this.finish();
      const p = this.items[this.done], whole = !p.text;
      this.p = p; this.t0 = this.time.now; this.answered = false; this.wrong = false;
      const ct = this.add.container(230, 405), card = this.add.graphics();
      card.fillStyle(0x000000, 0.35); card.fillRect(-206, -70, 420, 150);
      card.fillStyle(M.paper, 1); card.fillRect(-210, -75, 420, 150); card.fillStyle(M.red, 1); card.fillRect(-210, -75, 420, 8);
      card.lineStyle(1, 0x9ab0c8, 0.7); for (let yy = -40; yy < 70; yy += 26) card.lineBetween(-200, yy, 200, yy);
      card.fillStyle(0xffffff, 1); card.fillCircle(0, -52, 7); card.lineStyle(2, 0x9a8a6a); card.strokeCircle(0, -52, 7);
      card.angle = -2;
      this.noteText = txt(this, 0, 8, whole ? "Which sentence is right?" : p.text, whole ? 26 : 24, M.ink, { wrap: 370 });
      ct.add([card, this.noteText]); this.note = ct;
      this.slide = this.tweens.add({ targets: ct, x: W - 120, duration: 9000 - G.level * 900, onComplete: () => this.shredded() });
      shuffle(p.opts).forEach((o, i) => {
        const b = button(this, W / 2, 640 + i * 112, W - 80, whole ? 98 : 90, o, "plaque", bb => this.tap(bb, o), whole ? 22 : 30);
        b.setAlpha(0); this.tweens.add({ targets: b, alpha: 1, duration: 200, delay: i * 60 }); this.opts.push(b);
      });
    }
    tap(b, o) {
      if (this.answered || !this.hud.running) return;
      if (o === this.p.answer) {
        this.answered = true; this.slide.stop(); const ms = this.time.now - this.t0; if (!this.wrong) record("grammar", true, ms);
        const pts = this.wrong ? 40 : (120 + Math.max(0, Math.round(150 - ms / 60))) * mult();
        paint(b, 0xbfe3c9); burst(this, b.x, b.y, M.gold, 24); SFX.good(G.combo); this.hud.add(pts); floatText(this, b.x, b.y - 50, "+" + pts);
        if (this.p.text) this.noteText.setText(this.p.text.replace("___", o.toUpperCase())); else this.noteText.setText(o).setFontSize(20);
        this.tweens.add({ targets: this.note, y: 300, scale: 1.08, duration: 300, yoyo: true });
        this.lock.fill(String(Phaser.Math.Between(1, 9)), true); this.done++;
        this.opts.forEach(x => x.locked = true); this.time.delayedCall(950, () => this.next());
      } else {
        b.locked = true; paint(b, 0xb3a593); shake(this, b); SFX.bad(); this.hud.penalty(4000);
        if (!this.wrong) { this.wrong = true; record("grammar", false, 0); }
        this.slide.timeScale = Math.min(2.2, this.slide.timeScale + 0.35);   // a wrong answer speeds the belt up
      }
    }
    shredded() {
      if (this.answered) return; this.answered = true; SFX.bad(); if (!this.wrong) record("grammar", false, 0);
      this.cameras.main.shake(200, 0.01); this.tweens.add({ targets: this.note, y: 560, alpha: 0, angle: 30, duration: 300 });
      floatText(this, W / 2, 330, this.p.answer, M.redS, 30); this.lock.fill("", false); this.done++;
      this.opts.forEach(x => x.locked = true); this.time.delayedCall(900, () => this.next());
    }
    finish() { this.hud.running = false; SFX.open(); banner(this, 300, "You escaped!", M.goldS); goTo(this, "results", 1400); }
    update(_, dt) {
      if (this.hud.running) this.rollers.forEach(r => r.angle += dt * 0.4);
      if (this.hud.update(dt)) {
        this.hud.running = false; this.slide && this.slide.stop(); this.opts.forEach(x => x.locked = true);
        while (this.done < this.N) { if (!(this.items[this.done] === this.p && this.wrong)) record("grammar", false, 0); this.wrong = false; this.lock.fill("", false); this.done++; }
        banner(this, 300, "Caught by the guard!", M.redS); goTo(this, "results", 1400);
      }
    }
  }

  // A framed certificate; "Continue" hands the result to the app, which saves it and shows the XP.
  class Results extends Phaser.Scene {
    constructor() { super("results"); }
    create() {
      this.cameras.main.fadeIn(400, 12, 6, 8);
      room(this, { floor: 1180, panel: 120 });
      const s = G.skills, tc = s.vocab.c + s.reading.c + s.grammar.c, tt = s.vocab.t + s.reading.t + s.grammar.t;
      const acc = tt ? tc / tt : 0, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.4 ? 1 : 0;
      const g = this.add.graphics(); gilt(g, 46, 60, W - 92, 980, 20); g.fillStyle(M.paper, 1); g.fillRect(46, 60, W - 92, 980);
      g.lineStyle(2, M.gold, 1); g.strokeRect(62, 76, W - 124, 948);
      txt(this, W / 2, 130, "CERTIFICATE OF ESCAPE", 22, "#8e2b35");
      txt(this, W / 2, 176, opts.name ? `awarded to ${opts.name}` : "Riverside Heritage Museum", 30, M.ink, { head: true, wrap: 560 });
      const sc = txt(this, W / 2, 268, "0", 100, "#7a2430", { head: true });
      this.tweens.addCounter({ from: 0, to: G.score, duration: 1400, ease: "Cubic.easeOut", onUpdate: t => sc.setText(Math.round(t.getValue())) });
      txt(this, W / 2, 340, "points", 24, M.inkSoft);
      for (let i = 0; i < 3; i++) {
        const st = this.add.star(W / 2 - 110 + i * 110, 420, 5, 22, 48, i < stars ? M.gold : 0xe3d6b8).setStrokeStyle(3, 0x8a6a2a).setScale(0);
        this.tweens.add({ targets: st, scale: 1, angle: 360, duration: 500, delay: 900 + i * 250, ease: "Back.easeOut", onStart: () => i < stars && SFX.good(i * 3) });
      }
      [["Word speed", s.vocab, M.red], ["Search reading", s.reading, M.green], ["Grammar under pressure", s.grammar, M.navy]].forEach(([name, k, col], i) => {
        const y = 540 + i * 130, p = k.t ? k.c / k.t : 0, rt = k.rt.length ? (k.rt.reduce((a, b) => a + b, 0) / k.rt.length / 1000).toFixed(1) + " s avg" : "–";
        txt(this, 96, y - 26, name, 26, M.ink, { ox: 0 }); txt(this, W - 96, y - 26, `${k.c}/${k.t} · ${rt}`, 21, M.inkSoft, { ox: 1 });
        const gg = this.add.graphics(); gg.fillStyle(0xe3d6b8, 1); gg.fillRoundedRect(96, y + 12, W - 192, 22, 11);
        const bar = this.add.graphics(); this.tweens.addCounter({ from: 0, to: p, duration: 900, delay: 400 + i * 200, ease: "Cubic.easeOut",
          onUpdate: t => { bar.clear(); bar.fillStyle(col, 1); bar.fillRoundedRect(96, y + 12, Math.max(22, (W - 192) * t.getValue()), 22, 11); } });
      });
      txt(this, W / 2, 900, `Best combo: ${G.best} in a row · Level reached: ${G.level + 1} of 5`, 21, M.inkSoft);
      const seal = this.add.circle(W / 2, 975, 40, M.red).setStrokeStyle(4, M.gold); txt(this, W / 2, 975, "★", 32, M.goldS);
      this.tweens.add({ targets: seal, scale: 1.08, duration: 800, yoyo: true, repeat: -1 });
      button(this, W / 2, 1120, 380, 96, "Continue", "dark", () => {
        SFX.whoosh();
        const skill = k => ({ right: s[k].c, total: s[k].t, avg_ms: s[k].rt.length ? Math.round(s[k].rt.reduce((a, b) => a + b, 0) / s[k].rt.length) : null });
        finish({ points: G.score, hits: tc, total: tt, level: G.level + 1, stars, combo: G.best, seconds: Math.round((Date.now() - t0) / 1000),
                 words: G.words, skills: { vocab: skill("vocab"), reading: skill("reading"), grammar: skill("grammar") } });
      }, 36);
    }
  }

  return new Phaser.Game({
    type: Phaser.AUTO, parent, width: W, height: H, backgroundColor: "#140a0e",
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [class Boot extends Phaser.Scene {
      constructor() { super("boot"); }
      create() { const gr = this.make.graphics({ add: false }); gr.fillStyle(0xffffff); gr.fillCircle(8, 8, 8); gr.generateTexture("spark", 16, 16); this.scene.start("title"); }
    }, Title, Hall, Gallery, Store, Results]
  });
}
