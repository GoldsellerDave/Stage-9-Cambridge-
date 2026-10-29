// Short sound effects made with Web Audio (no sound files), and words read aloud with the browser's speech voice.
// Sound can be turned off with the speaker button in the top bar; the choice is kept on this device for each student.
let ctx = null, who = "";
const KEY = () => "ckpt-sound-" + who;

export function soundUser(username) { who = username || ""; }
export function soundOn() { try { return localStorage.getItem(KEY()) !== "off"; } catch (e) { return true; } }
export function setSound(on) { try { localStorage.setItem(KEY(), on ? "on" : "off"); } catch (e) {} }

function audio() {
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  if (!ctx) ctx = new C();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
// [frequency Hz, start s, length s, wave, volume]
const SOUNDS = {
  tap:   [[880, 0, 0.04, "triangle", 0.05]],
  flip:  [[520, 0, 0.06, "triangle", 0.06], [780, 0.05, 0.06, "triangle", 0.05]],
  ok:    [[660, 0, 0.1, "sine", 0.16], [990, 0.09, 0.18, "sine", 0.16]],
  bad:   [[300, 0, 0.12, "triangle", 0.12], [220, 0.11, 0.2, "triangle", 0.12]],
  info:  [[440, 0, 0.12, "sine", 0.1], [392, 0.12, 0.16, "sine", 0.1]],
  level: [[523, 0, 0.1, "square", 0.06], [659, 0.1, 0.1, "square", 0.06], [784, 0.2, 0.1, "square", 0.06], [1047, 0.3, 0.25, "square", 0.07]],
  done:  [[523, 0, 0.12, "sine", 0.14], [659, 0.12, 0.12, "sine", 0.14], [784, 0.24, 0.3, "sine", 0.16]],
  win:   [[392, 0, 0.12, "square", 0.06], [523, 0.12, 0.12, "square", 0.06], [659, 0.24, 0.12, "square", 0.06], [784, 0.36, 0.14, "square", 0.07],
          [659, 0.52, 0.1, "square", 0.06], [784, 0.62, 0.4, "square", 0.08], [1047, 0.62, 0.4, "sine", 0.1]],
  // escape room
  tick:  [[1200, 0, 0.03, "square", 0.03]],
  tock:  [[800, 0, 0.03, "square", 0.035]],
  heart: [[70, 0, 0.12, "sine", 0.35], [62, 0.18, 0.16, "sine", 0.3]],
  steps: [[110, 0, 0.09, "triangle", 0.2], [100, 0.45, 0.09, "triangle", 0.2], [110, 0.9, 0.09, "triangle", 0.22]],
  alarm: [[880, 0, 0.18, "sawtooth", 0.06], [660, 0.2, 0.18, "sawtooth", 0.06], [880, 0.4, 0.18, "sawtooth", 0.06], [660, 0.6, 0.25, "sawtooth", 0.06]],
  click: [[1800, 0, 0.02, "square", 0.08], [900, 0.03, 0.05, "square", 0.06]],
  creak: [[140, 0, 0.5, "sawtooth", 0.05], [190, 0.15, 0.45, "sawtooth", 0.04]],
  glint: [[1568, 0, 0.08, "sine", 0.08], [2093, 0.07, 0.18, "sine", 0.08]],
  dark:  [[220, 0, 0.3, "sawtooth", 0.06], [110, 0.2, 0.4, "sawtooth", 0.06]]
};
export function play(name) {
  if (!soundOn() || !SOUNDS[name]) return;
  const c = audio(); if (!c) return;
  const t0 = c.currentTime + 0.01;
  SOUNDS[name].forEach(([f, start, len, type, vol]) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0 + start);
    g.gain.exponentialRampToValueAtTime(vol, t0 + start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + len);
    o.connect(g).connect(c.destination);
    o.start(t0 + start); o.stop(t0 + start + len + 0.05);
  });
}

export const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
// Read a word or sentence aloud with an English voice (British if the device has one).
export function say(text) {
  if (!canSpeak) return;
  const s = window.speechSynthesis, u = new SpeechSynthesisUtterance(text), voices = s.getVoices();
  u.voice = voices.find(v => v.lang === "en-GB") || voices.find(v => /^en/.test(v.lang)) || null;
  u.lang = u.voice ? u.voice.lang : "en-GB"; u.rate = 0.9;
  s.cancel(); s.speak(u);
}
