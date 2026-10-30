// Listening speed dial: slow a recording down by up to 30% (the voices keep their pitch). Practice only: unit mini tests
// and Challenge clips always play at normal speed, like the Checkpoint exam. The choice is kept on this device.
// Answers given at a slower speed save speed (0.9, 0.85, 0.8 or 0.7). After 3 right in a row at a slower speed, the dial
// suggests one step faster.
export const SPEEDS = [[1, "Normal"], [0.9, "-10%"], [0.85, "-15%"], [0.8, "-20%"], [0.7, "-30%"]];
const KEY = "listen-speed", NUDGE = 3;
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const write = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };

export function getSpeed() { const r = read().rate; return SPEEDS.some(([v]) => v === r) ? r : 1; }
export function setSpeed(rate) { write({ rate, row: 0 }); }
// The speed a clip actually plays at: normal when the clip is locked to exam speed.
export const rateFor = (locked = false) => (locked ? 1 : getSpeed());
export function applySpeed(el, locked = false) {
  if (!el) return;
  el.preservesPitch = true; el.mozPreservesPitch = true; el.webkitPreservesPitch = true;
  el.playbackRate = el.defaultPlaybackRate = rateFor(locked);
}
// Extra fields for an answer: { speed } when it was given at a slower speed.
export const speedTag = (locked = false) => (rateFor(locked) < 1 ? { speed: rateFor(locked) } : {});
// Count right answers at a slower speed; a miss or normal speed resets the count.
export function noteAnswer(right, locked = false) {
  const s = read(), rate = rateFor(locked);
  s.row = right && rate < 1 && !locked ? (s.row || 0) + 1 : 0; write({ ...s, rate: getSpeed() });
}
export function nudge() {
  const s = read(), i = SPEEDS.findIndex(([v]) => v === getSpeed());
  return i > 0 && (s.row || 0) >= NUDGE ? SPEEDS[i - 1] : null;
}

export function speedHTML(locked = false) {
  if (locked) return `<div class="spd locked" role="note"><span class="note">🔒 Normal speed, like the exam</span></div>`;
  const cur = getSpeed(), up = nudge();
  return `<div class="spd" role="group" aria-label="Playback speed"><span class="spdl" aria-hidden="true">🐢</span>
    ${SPEEDS.map(([v, l]) => `<button type="button" class="spdb${v === cur ? " on" : ""}" data-spd="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}
    ${up ? `<p class="spdn">⭐ ${NUDGE} right in a row at ${SPEEDS.find(([v]) => v === cur)[1]}! Ready to try <button type="button" class="spdb on" data-spd="${up[0]}">${up[1]}</button>?</p>` : ""}</div>`;
}
// Wire the buttons in root. getEl: the audio element(s) to change now; then onChange to redraw.
export function bindSpeed(root, getEls = () => [], onChange = () => {}) {
  if (!root) return;
  root.querySelectorAll("[data-spd]").forEach(b => b.onclick = () => {
    setSpeed(+b.dataset.spd);
    getEls().filter(Boolean).forEach(el => applySpeed(el));
    onChange();
  });
}
