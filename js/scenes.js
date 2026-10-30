// Cartoon scenes for grammar lessons: the meaning acted out, then the classic mistake acted out (badly), then fixed.
// Two characters come back in every scene:
//   Zip  - an over-excited robot who makes the mistake everyone makes
//   Nova - a calm detective who spots it and explains
// A scene is one SVG stage plus beats. Each beat sets data-beat on the scene, so the CSS (style.css "Grammar scenes")
// moves the characters, shows who says what, and the sentence under the stage changes with it.
// Sentence: "text#kind | text#kind" (kinds as in anim.js: s doer, o receiver, v verb, bad, new).
// Keys are block ids (gengine.js / glab.js). Pilot: active-passive. Don't rename the keys.
import { play } from "./sound.js";

const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const ZIP = `<svg viewBox="0 0 40 40" class="av" aria-hidden="true"><path d="M20 3v5" stroke="#5C6B7A" stroke-width="2"/><circle cx="20" cy="3" r="2.5" fill="#F06292"/>
  <rect x="6" y="8" width="28" height="24" rx="7" fill="#2BA59E"/><rect x="10" y="12" width="20" height="14" rx="4" fill="#0F2A2A"/>
  <circle cx="15.5" cy="18" r="2.4" fill="#7CF5E8"/><circle cx="24.5" cy="18" r="2.4" fill="#7CF5E8"/><path d="M15 22.5q5 3 10 0" stroke="#7CF5E8" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <rect x="3" y="16" width="3" height="8" rx="1.5" fill="#5C6B7A"/><rect x="34" y="16" width="3" height="8" rx="1.5" fill="#5C6B7A"/><rect x="13" y="32" width="14" height="6" rx="2" fill="#1E8C87"/></svg>`;
export const NOVA = `<svg viewBox="0 0 40 40" class="av" aria-hidden="true"><path d="M8 22c0-10 5-15 12-15s12 5 12 15v10H8z" fill="#3B2A20"/>
  <circle cx="20" cy="21" r="10" fill="#F2C8A0"/><path d="M8 14c3-7 21-7 24 0l-3 1H11z" fill="#8A5A2B"/><rect x="6" y="13" width="28" height="3" rx="1.5" fill="#6B4320"/>
  <circle cx="16.5" cy="21" r="1.5" fill="#222"/><circle cx="23.5" cy="21" r="1.5" fill="#222"/><path d="M17 26q3 2 6 0" stroke="#A0522D" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <circle cx="33" cy="30" r="4.5" fill="none" stroke="#C98A0B" stroke-width="2"/><path d="M30 33l-4 5" stroke="#C98A0B" stroke-width="2.4" stroke-linecap="round"/><circle cx="33" cy="30" r="3" fill="#BFE8FF" opacity=".6"/></svg>`;

// A cleaner: feet at (0, 0). The mop swings from the hand; the noodle bowl only shows at lunch.
const cleaner = (cls, colour) => `<g class="cl ${cls}"><g transform="scale(1.35)"><g class="clbody">
  <path d="M-4 0V-12M4 0V-12" stroke="#2B3440" stroke-width="3.2" stroke-linecap="round"/>
  <rect x="-9" y="-35" width="18" height="25" rx="6" fill="${colour}"/><rect x="-5" y="-31" width="10" height="8" rx="2" fill="#fff" opacity=".35"/>
  <circle cy="-43" r="8" fill="#E8B58C"/><path d="M-8.5 -45a8.5 8.5 0 0 1 17 0z" fill="${colour}"/><rect x="2" y="-47" width="10" height="3" rx="1.5" fill="${colour}"/>
  <circle cx="-2.5" cy="-42" r="1.1" fill="#222"/><circle cx="3" cy="-42" r="1.1" fill="#222"/><path d="M-2 -38.5q2 1.6 4 0" stroke="#7A3B2A" stroke-width="1" fill="none"/>
  <g class="mop"><path d="M7 -27L24 -1" stroke="#8A5A2B" stroke-width="2.6" stroke-linecap="round"/><path d="M17 1h15l-2 -5h-11z" fill="#DDE6EE" stroke="#9AA8B5"/></g>
  <g class="bowl"><path d="M-12 -24h18a9 9 0 0 1 -18 0z" fill="#E2574C"/><path d="M-10 -24q4 -4 7 0q4 -4 7 0" stroke="#F4D06F" stroke-width="2" fill="none"/>
    <path d="M2 -33l10 -6M4 -31l10 -5" stroke="#8A5A2B" stroke-width="1.4"/>
    <path class="steam" d="M-7 -30q-3 -4 0 -8q3 -4 0 -8M-1 -30q-3 -4 0 -8q3 -4 0 -8" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/></g></g></g></g>`;

const HALL = `<svg viewBox="0 0 360 200" class="scnsvg" role="img" aria-label="A school hall, two cleaners, and the hall itself">
  <rect class="sc-wall" width="360" height="130"/><rect class="sc-floor" y="130" width="360" height="70"/>
  <path class="sc-board" d="M0 130H360" stroke-width="3"/>
  <rect class="sc-win" x="30" y="22" width="56" height="44" rx="4"/><rect class="sc-win" x="274" y="22" width="56" height="44" rx="4"/>
  <path class="sc-winx" d="M58 22V66M30 44H86M302 22V66M274 44H330"/>
  <rect class="sc-door" x="158" y="58" width="44" height="72" rx="3"/><circle cx="194" cy="96" r="2.5" fill="#C98A0B"/>
  <text class="sc-sign" x="180" y="48" text-anchor="middle">SCHOOL HALL</text>
  <g class="dirt"><ellipse cx="80" cy="165" rx="18" ry="5"/><ellipse cx="150" cy="182" rx="22" ry="6"/><ellipse cx="226" cy="160" rx="14" ry="4"/><ellipse cx="300" cy="180" rx="20" ry="5"/>
    <path d="M110 150l3 -4l3 4M250 186l3 -4l3 4" stroke="#7A5A3A" stroke-width="2" fill="none"/></g>
  <g class="spark"><path d="M80 160l2 -6l2 6l6 2l-6 2l-2 6l-2 -6l-6 -2z"/><path d="M226 152l2 -6l2 6l6 2l-6 2l-2 6l-2 -6l-6 -2z"/><path d="M300 172l2 -6l2 6l6 2l-6 2l-2 6l-2 -6l-6 -2z"/></g>
  <g class="hallface"><circle cx="128" cy="92" r="13" fill="#fff" stroke="#2B3440" stroke-width="2"/><circle cx="232" cy="92" r="13" fill="#fff" stroke="#2B3440" stroke-width="2"/>
    <circle class="pupil" cx="131" cy="95" r="5" fill="#222"/><circle class="pupil" cx="235" cy="95" r="5" fill="#222"/>
    <path d="M154 116q26 14 52 0" stroke="#2B3440" stroke-width="3" fill="#fff"/>
    <g class="harm l"><path d="M24 108q30 40 70 56" stroke="#C9B48A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M80 150l26 26" stroke="#8A5A2B" stroke-width="3"/><path d="M98 178h22l-3 -6h-16z" fill="#DDE6EE" stroke="#9AA8B5"/></g>
    <g class="harm r"><path d="M336 108q-30 40 -70 56" stroke="#C9B48A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M280 150l-26 26" stroke="#8A5A2B" stroke-width="3"/><path d="M240 178h22l-3 -6h-16z" fill="#DDE6EE" stroke="#9AA8B5"/></g>
    <text class="whee" x="180" y="30" text-anchor="middle">WHEEE!</text></g>
  <g class="bench"><rect x="230" y="150" width="114" height="8" rx="3" fill="#8A5A2B"/><path d="M238 158v14M336 158v14" stroke="#6B4320" stroke-width="4"/></g>
  <g transform="translate(0 178)">${cleaner("cA", "#2E6FB0")}${cleaner("cB", "#7B4FA8")}</g>
  <g class="rewind"><rect width="360" height="200" fill="#000" opacity=".25"/><text x="180" y="108" text-anchor="middle">◀◀ REWIND</text></g></svg>`;

export const SCENES = {
  "active-passive": { stage: HALL, beats: [
    { who: "nova", say: "Watch the hall. Who's going to do the cleaning?", s: "", ms: 3000 },
    { who: "nova", say: "The cleaners do the cleaning. They're the doers.", s: "The cleaners#s | cleaned#v | the hall#o", ms: 4200 },
    { who: "nova", say: "Now put the hall first. It doesn't DO anything. It RECEIVES the action: it gets cleaned.", s: "The hall#o | was being cleaned#v | by the cleaners#s", ms: 5200 },
    { who: "zip", say: "Too long! I'll make it shorter: \"The hall was cleaning.\" Done! 😎", s: "The hall#o | was cleaning#bad", ms: 4000, sound: "tap" },
    { who: "zip", say: "Uh-oh… why is the HALL mopping itself?! And why are the cleaners eating noodles?! 😱", s: "The hall#o | was cleaning#bad", note: "was cleaning = the hall was DOING the cleaning. 🙃", ms: 5600, sound: "bad" },
    { who: "nova", say: "Rewind! A hall can't clean anything. It GETS cleaned: was being + V3.", s: "The hall#o | was being cleaned#new | by the cleaners#s", ms: 5200, sound: "ok" }] }
};
export const hasScene = id => !!SCENES[id];

const sentence = s => s ? s.split("|").map(x => x.trim()).filter(Boolean).map(x => { const [t, k] = x.split("#"); return `<span class="at${k ? ` at-${k}` : ""}">${esc(t)}</span>`; }).join("") : `<span class="note">…</span>`;

export const sceneHTML = id => SCENES[id] ? `<div class="scn" id="gscn" data-scene="${esc(id)}" data-beat="0">
  <div class="scnstage">${SCENES[id].stage}</div>
  <div class="scnsay"><span class="scnav"></span><p class="scnbub" aria-live="polite"></p></div>
  <div class="scnsent"></div><p class="scnnote"></p>
  <div class="anctl"><button type="button" class="anb" data-sc="prev" aria-label="Back">‹</button><span class="andots"></span>
  <button type="button" class="anb" data-sc="next" aria-label="Next">›</button><button type="button" class="btn small alt" data-sc="play">↻ Replay</button></div></div>` : "";

let timer = null;
export function mountScene(root = typeof document !== "undefined" && document.getElementById("gscn")) {
  clearTimeout(timer);
  if (!root || !SCENES[root.dataset.scene]) return;
  const beats = SCENES[root.dataset.scene].beats;
  let k = -1;
  const show = (n, sound = false) => {
    k = Math.max(0, Math.min(beats.length - 1, n)); const b = beats[k];
    root.dataset.beat = k; root.dataset.who = b.who;
    root.querySelector(".scnav").innerHTML = b.who === "zip" ? ZIP : NOVA;
    const bub = root.querySelector(".scnbub"); bub.innerHTML = `<b>${b.who === "zip" ? "Zip" : "Nova"}:</b> ${esc(b.say)}`; bub.classList.remove("an-fade"); void bub.offsetWidth; bub.classList.add("an-fade");
    const sent = root.querySelector(".scnsent"); sent.innerHTML = sentence(b.s); sent.classList.remove("an-fade"); void sent.offsetWidth; sent.classList.add("an-fade");
    root.querySelector(".scnnote").textContent = b.note || "";
    root.querySelector(".andots").innerHTML = beats.map((_, j) => `<button type="button" class="andot${j === k ? " on" : ""}" data-sc="${j}" aria-label="Scene ${j + 1}"></button>`).join("");
    root.querySelectorAll("[data-sc]").forEach(btn => btn.onclick = ev => { ev.stopPropagation(); clearTimeout(timer); const a = btn.dataset.sc;
      if (a === "play") run(0); else show(a === "prev" ? k - 1 : a === "next" ? k + 1 : +a, true); });
    if (sound && b.sound) play(b.sound);
  };
  const run = n => { show(n, true); if (k < beats.length - 1 && root.isConnected) timer = setTimeout(() => run(k + 1), beats[k].ms); };
  root.querySelector(".scnstage").onclick = () => { clearTimeout(timer); show(k + 1, true); };
  reduced() ? show(0) : run(0);
}
