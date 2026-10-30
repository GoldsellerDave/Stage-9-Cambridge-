// Cartoon scenes for grammar lessons: the meaning acted out, then the classic mistake acted out (badly), then fixed.
// Two characters come back in every scene:
// Style: blocky game avatars (square heads, block bodies), all our own designs.
//   Zip  - an over-excited robot who makes the mistake everyone makes
//   Nova - a calm detective who spots it and explains
// A scene is one SVG stage plus beats. Each beat sets data-beat on the scene, so the CSS (style.css "Grammar scenes")
// moves the characters, shows who says what, and the sentence under the stage changes with it.
// Sentence: "text#kind | text#kind" (kinds as in anim.js: s doer, o receiver, v verb, bad, new).
// Keys are block ids (gengine.js / glab.js). Pilot: active-passive. Don't rename the keys.
import { play, soundOn } from "./sound.js";
import { SCENE_AUDIO } from "./scene-audio.js";

const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// Blocky game-avatar style (our own characters): square heads, block bodies, a darker strip on the right of each block
// for depth. sh(x, y, w, h) is that strip.
const sh = (x, y, w, h) => `<rect x="${x + w * 0.72}" y="${y}" width="${w * 0.28}" height="${h}" fill="#000" opacity=".16"/>`;
const blk = (x, y, w, h, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.2" fill="${fill}"${extra}/>${sh(x, y, w, h)}`;

export const ZIP = `<svg viewBox="0 0 40 40" class="av" aria-hidden="true">
  ${blk(18, 1, 4, 6, "#5C6B7A")}${blk(16, 0, 8, 3, "#F06292")}
  ${blk(7, 7, 26, 22, "#2BA59E")}<rect x="10" y="11" width="20" height="12" rx="1" fill="#0F2A2A"/>
  <rect x="13" y="14" width="5" height="5" fill="#7CF5E8"/><rect x="22" y="14" width="5" height="5" fill="#7CF5E8"/><rect x="15" y="25" width="10" height="2" fill="#0F2A2A"/>
  ${blk(4, 14, 3, 8, "#5C6B7A")}${blk(33, 14, 3, 8, "#5C6B7A")}${blk(12, 30, 16, 10, "#1E8C87")}</svg>`;
export const NOVA = `<svg viewBox="0 0 40 40" class="av" aria-hidden="true">
  ${blk(8, 10, 24, 22, "#3B2A20")}${blk(10, 12, 20, 20, "#F1C27D")}
  ${blk(9, 10, 22, 5, "#3B2A20")}${blk(5, 7, 30, 4, "#6B4320")}${blk(11, 0, 18, 8, "#8A5A2B")}
  <rect x="14" y="18" width="3.5" height="3.5" fill="#222"/><rect x="22.5" y="18" width="3.5" height="3.5" fill="#222"/><rect x="16.5" y="26" width="7" height="2" fill="#A0522D"/>
  ${blk(12, 32, 16, 8, "#2E6F6B")}
  <circle cx="33" cy="30" r="4.5" fill="#BFE8FF" fill-opacity=".6" stroke="#C98A0B" stroke-width="2"/><rect x="26" y="33" width="3" height="7" fill="#C98A0B" transform="rotate(40 27.5 36.5)"/></svg>`;

// A cleaner: feet at (0, 0). The right arm holds the mop and swings from the shoulder; the noodle bowl only shows at lunch.
const cleaner = (cls, colour, skin) => `<g class="cl ${cls}"><g transform="scale(1.35)"><g class="clbody">
  <g class="leg l">${blk(-9, -14, 8, 14, "#2B3440")}</g><g class="leg r">${blk(1, -14, 8, 14, "#2B3440")}</g>
  ${blk(-10, -32, 20, 18, colour)}<rect x="-6" y="-29" width="8" height="5" fill="#fff" opacity=".35"/>
  ${blk(-15, -31, 5, 14, colour)}${blk(-15, -17, 5, 4, skin)}
  ${blk(-8, -49, 16, 16, skin)}<rect x="-5" y="-43" width="3" height="3" fill="#222"/><rect x="2" y="-43" width="3" height="3" fill="#222"/><rect x="-3" y="-37.5" width="6" height="1.6" fill="#7A3B2A"/>
  ${blk(-9, -53, 18, 5, colour)}<rect x="1" y="-49" width="11" height="2.5" fill="${colour}"/>
  <g class="mop">${blk(10, -31, 5, 14, colour)}${blk(10, -17, 5, 4, skin)}<path d="M13 -15L26 -1" stroke="#8A5A2B" stroke-width="2.6" stroke-linecap="square"/>${blk(19, -2, 15, 5, "#DDE6EE")}</g>
  <g class="bowl">${blk(-13, -27, 15, 7, "#E2574C")}<path d="M-12 -27h13" stroke="#F4D06F" stroke-width="2.2"/>
    <path d="M0 -34l10 -6M2 -32l10 -5" stroke="#8A5A2B" stroke-width="1.6"/>
    <path class="steam" d="M-9 -30v-4h2v-4M-3 -30v-4h2v-4" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/></g></g></g></g>`;

const tiles = Array.from({ length: 17 }, (_, i) => `M${i * 22} 130V200`).join("") + "M0 153H360M0 176H360";
const HALL = `<svg viewBox="0 0 360 200" class="scnsvg" role="img" aria-label="A school hall, two cleaners, and the hall itself">
  <rect class="sc-wall" width="360" height="130"/><path class="sc-bricks" d="M0 32H360M0 64H360M0 96H360"/><rect class="sc-floor" y="130" width="360" height="70"/>
  <path class="sc-tiles" d="${tiles}"/><rect class="sc-board" y="126" width="360" height="6"/>
  <rect class="sc-win" x="30" y="22" width="56" height="44"/><rect class="sc-win" x="274" y="22" width="56" height="44"/>
  <path class="sc-winx" d="M58 22V66M30 44H86M302 22V66M274 44H330"/>
  <rect class="sc-door" x="158" y="58" width="44" height="72"/><rect x="190" y="92" width="5" height="5" fill="#C98A0B"/>
  <text class="sc-sign" x="180" y="48" text-anchor="middle">SCHOOL HALL</text>
  <g class="dirt"><rect x="62" y="160" width="36" height="9"/><rect x="128" y="178" width="44" height="10"/><rect x="212" y="156" width="28" height="8"/><rect x="280" y="176" width="40" height="9"/>
    <rect x="108" y="146" width="7" height="7"/><rect x="250" y="184" width="7" height="7"/></g>
  <g class="spark"><path d="M80 160l2 -6l2 6l6 2l-6 2l-2 6l-2 -6l-6 -2z"/><path d="M226 152l2 -6l2 6l6 2l-6 2l-2 6l-2 -6l-6 -2z"/><path d="M300 172l2 -6l2 6l6 2l-6 2l-2 6l-2 -6l-6 -2z"/></g>
  <g class="hallface"><rect x="112" y="76" width="30" height="30" fill="#fff" stroke="#2B3440" stroke-width="3"/><rect x="218" y="76" width="30" height="30" fill="#fff" stroke="#2B3440" stroke-width="3"/>
    <rect class="pupil" x="124" y="88" width="12" height="12" fill="#222"/><rect class="pupil" x="230" y="88" width="12" height="12" fill="#222"/>
    <rect x="150" y="112" width="60" height="12" fill="#fff" stroke="#2B3440" stroke-width="3"/>
    <g class="harm l"><path d="M20 104L60 150L92 166" stroke="#C9B48A" stroke-width="9" fill="none" stroke-linejoin="miter" stroke-linecap="square"/><path d="M84 160l24 22" stroke="#8A5A2B" stroke-width="3"/><rect x="98" y="178" width="24" height="6" fill="#DDE6EE" stroke="#9AA8B5"/></g>
    <g class="harm r"><path d="M340 104L300 150L268 166" stroke="#C9B48A" stroke-width="9" fill="none" stroke-linejoin="miter" stroke-linecap="square"/><path d="M276 160l-24 22" stroke="#8A5A2B" stroke-width="3"/><rect x="238" y="178" width="24" height="6" fill="#DDE6EE" stroke="#9AA8B5"/></g>
    <text class="whee" x="180" y="30" text-anchor="middle">WHEEE!</text></g>
  <g class="bench">${blk(230, 148, 114, 9, "#8A5A2B")}<rect x="236" y="157" width="6" height="15" fill="#6B4320"/><rect x="332" y="157" width="6" height="15" fill="#6B4320"/></g>
  <g transform="translate(0 178)">${cleaner("cA", "#2E6FB0", "#E0AC69")}${cleaner("cB", "#7B4FA8", "#8D5524")}</g>
  <g class="rewind"><rect width="360" height="200" fill="#000" opacity=".25"/><text x="180" y="108" text-anchor="middle">◀◀ REWIND</text></g></svg>`;

export const SCENES = {
  "active-passive": { stage: HALL, beats: [
    { who: "nova", say: "Watch the hall. Who's going to do the cleaning?", s: "", ms: 3000 },
    { who: "nova", say: "The cleaners do the cleaning. They're the doers.", s: "The cleaners#s | cleaned#v | the hall#o", ms: 5000, walk: true },
    { who: "nova", say: "Now put the hall first. It doesn't DO anything. It RECEIVES the action: it gets cleaned.", s: "The hall#o | was being cleaned#v | by the cleaners#s", ms: 5200 },
    { who: "zip", say: "Too long! I'll make it shorter: \"The hall was cleaning.\" Done! 😎", s: "The hall#o | was cleaning#bad", ms: 4000, sound: "tap" },
    { who: "zip", say: "Uh-oh… why is the HALL mopping itself?! And why are the cleaners eating noodles?! 😱", s: "The hall#o | was cleaning#bad", note: "was cleaning = the hall was DOING the cleaning. 🙃", ms: 5600, walk: true, sound: "bad" },
    { who: "nova", say: "Rewind! A hall can't clean anything. It GETS cleaned: was being + V3.", s: "The hall#o | was being cleaned#new | by the cleaners#s", ms: 5200, walk: true, sound: "ok" }] }
};
// Quest cutscenes (quests.js): the story at the start of each quest. Same player and cast; %%ME%% is the student's
// own hero (quests.js heroSVG), who walks on at the end. Keys are quest ids. Not lessons, so not in SCENES.
const cast = (svg, x, y, w) => svg.replace('<svg viewBox="0 0 40 40" class="av"', `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 40 40" class="av"`);
const ME = (x, y) => `<g transform="translate(${x} ${y}) scale(1.2)"><g class="qme">%%ME%%</g></g>`;
const gear = (x, y, r, cls) => `<g class="qgear ${cls}" style="transform-origin:${x}px ${y}px"><rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" fill="#C98A0B"/><rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" fill="#C98A0B" transform="rotate(45 ${x} ${y})"/><rect x="${x - r / 3}" y="${y - r / 3}" width="${r / 1.5}" height="${r / 1.5}" fill="#2B1B5A"/></g>`;
const LAB = `<svg viewBox="0 0 360 200" class="scnsvg" role="img" aria-label="A lab with a broken time machine">
  <rect width="360" height="150" fill="#2B1B5A"/><path d="M0 40H360M0 80H360M0 120H360" stroke="#000" stroke-opacity=".18"/>
  <rect y="150" width="360" height="50" fill="#3D2C70"/><path d="M0 172H360M40 150V200M100 150V200M160 150V200M220 150V200M280 150V200M340 150V200" stroke="#000" stroke-opacity=".18"/>
  ${gear(98, 56, 13, "g1")}${gear(266, 50, 10, "g2")}${gear(276, 84, 8, "g1")}
  ${blk(118, 30, 124, 120, "#5C6B7A")}${blk(142, 42, 76, 76, "#F4E9D8")}
  <rect x="177" y="46" width="6" height="8" fill="#2B3440"/><rect x="177" y="106" width="6" height="8" fill="#2B3440"/><rect x="146" y="77" width="8" height="6" fill="#2B3440"/><rect x="206" y="77" width="8" height="6" fill="#2B3440"/>
  <g class="qhand" style="transform-origin:180px 80px"><rect x="177.5" y="52" width="5" height="30" fill="#E2574C"/></g><rect x="175" y="75" width="10" height="10" fill="#2B3440"/>
  ${blk(158, 126, 44, 14, "#E2574C")}<text x="180" y="137" text-anchor="middle" class="qtxt" style="font-size:9px">DON'T</text>
  <g class="qspark"><path d="M110 120l4 -10l4 10l10 4l-10 4l-4 10l-4 -10l-10 -4z" fill="#FFD54A"/><path d="M250 120l3 -8l3 8l8 3l-8 3l-3 8l-3 -8l-8 -3z" fill="#FFD54A"/></g>
  <text class="qagain qtxt" x="180" y="22" text-anchor="middle">AGAIN! AGAIN! AGAIN!</text>
  ${cast(ZIP, 26, 98, 58)}${cast(NOVA, 300, 96, 56)}${ME(232, 84)}</svg>`;
const pizza = `<g class="qpizza"><path d="M0 0L64 0L32 52Z" fill="#F2C230"/><path d="M-3 -6H67V4H-3Z" fill="#C98A0B"/><rect x="14" y="10" width="7" height="7" fill="#E2574C"/><rect x="38" y="20" width="7" height="7" fill="#E2574C"/>
  <rect x="20" y="4" width="9" height="9" fill="#fff"/><rect x="36" y="4" width="9" height="9" fill="#fff"/><rect x="23" y="7" width="5" height="5" fill="#222"/><rect x="37" y="7" width="5" height="5" fill="#222"/>
  <path class="qjaw" d="M24 22h16v6h-16z" fill="#7A2A20"/></g>`;
const bot = (x, c) => `<g class="qbot" transform="translate(${x} 0)">${blk(0, 0, 22, 20, c)}<rect x="4" y="5" width="14" height="8" fill="#0F2A2A"/><rect x="6" y="7" width="4" height="4" fill="#7CF5E8"/><rect x="12" y="7" width="4" height="4" fill="#7CF5E8"/>${blk(4, 20, 14, 10, "#5C6B7A")}</g>`;
const KITCHEN = `<svg viewBox="0 0 360 200" class="scnsvg" role="img" aria-label="A robot pizza kitchen where a pizza is chasing the robots">
  <rect width="360" height="150" fill="#E6F4F1"/><path d="M0 30H360M0 60H360M0 90H360M0 120H360M30 0V150M90 0V150M150 0V150M210 0V150M270 0V150M330 0V150" stroke="#2BA59E" stroke-opacity=".2"/>
  <rect y="150" width="360" height="50" fill="#9AA8B5"/><path d="M0 172H360" stroke="#000" stroke-opacity=".15"/>
  ${blk(20, 18, 70, 46, "#5C6B7A")}<rect x="28" y="26" width="54" height="30" fill="#FF8A3D"/><text x="55" y="45" text-anchor="middle" class="qtxt" style="font-size:10px">OVEN</text>
  <g class="qbelt">${blk(110, 112, 180, 12, "#3A3A3A")}<path d="M120 112v12M140 112v12M160 112v12M180 112v12M200 112v12M220 112v12M240 112v12M260 112v12M280 112v12" stroke="#777"/></g>
  <g transform="translate(168 60)">${pizza}</g>
  <g transform="translate(120 120)"><g class="qbots">${bot(0, "#2BA59E")}${bot(34, "#F06292")}</g></g>
  <text class="qhelp qtxt" style="fill:#E2574C;font-size:20px" x="250" y="40" text-anchor="middle">HELP!</text>
  ${cast(ZIP, 20, 96, 58)}${cast(NOVA, 300, 96, 56)}${ME(230, 84)}</svg>`;
const MUSEUM = `<svg viewBox="0 0 360 200" class="scnsvg" role="img" aria-label="A dark museum at night with an empty stand where the golden mask was">
  <rect width="360" height="150" fill="#0B1426"/><path d="M0 50H360M0 100H360" stroke="#fff" stroke-opacity=".05"/>
  <rect y="150" width="360" height="50" fill="#1A2440"/><path d="M0 172H360M60 150V200M140 150V200M220 150V200M300 150V200" stroke="#fff" stroke-opacity=".06"/>
  ${blk(40, 30, 18, 120, "#2E3850")}${blk(302, 30, 18, 120, "#2E3850")}
  ${blk(150, 104, 60, 46, "#3A4566")}${blk(158, 50, 44, 54, "#24304D")}<rect x="164" y="56" width="32" height="42" fill="none" stroke="#C98A0B" stroke-width="2" stroke-dasharray="4 3"/><text x="180" y="82" text-anchor="middle" class="qtxt" style="font-size:16px">?</text>
  <g class="qguard">${blk(250, 116, 26, 34, "#2E4A7A")}${blk(252, 98, 20, 18, "#C68642")}<rect x="256" y="106" width="5" height="2" fill="#222"/><rect x="264" y="106" width="5" height="2" fill="#222"/>${blk(250, 94, 24, 6, "#1A2440")}<text class="qzzz qtxt" x="282" y="92">z z Z</text></g>
  <g class="qmask"><path d="M0 0h30v14l-6 10h-18l-6 -10z" fill="#F2C230" stroke="#C98A0B"/><rect x="6" y="5" width="6" height="5" fill="#0B1426"/><rect x="18" y="5" width="6" height="5" fill="#0B1426"/>
    <rect class="leg l" x="8" y="24" width="4" height="10" fill="#C98A0B"/><rect class="leg r" x="18" y="24" width="4" height="10" fill="#C98A0B"/>${blk(28, 8, 16, 16, "#6B4320")}</g>
  <path class="qbeam" d="M262 120L150 160L190 196Z" fill="#FFF3B0" opacity=".22"/>
  <g class="qprints" fill="#C9B48A" opacity=".5"><rect x="120" y="182" width="6" height="4"/><rect x="100" y="176" width="6" height="4"/><rect x="80" y="184" width="6" height="4"/></g>
  ${cast(ZIP, 20, 96, 58)}${cast(NOVA, 88, 96, 56)}${ME(176, 84)}</svg>`;

export const CUTS = {
  "q-time": { stage: LAB, beats: [
    { who: "nova", say: "Uh-oh. Zip, what did you do to the Time Engine?", s: "", ms: 3000 },
    { who: "zip", say: "I pressed the big red button! Now it's yesterday… again. And again. And again!", s: "", ms: 4500, sound: "bad" },
    { who: "nova", say: "To fix it, we need to tell the story of yesterday correctly. What happened, and what was happening.", s: "I#s | was eating#v | when it#s | exploded#v", ms: 5000 },
    { who: "zip", say: "Easy! Yesterday I was eat a sandwich when the machine explode. Fixed!", s: "I | was eat#bad | a sandwich when the machine | explode#bad", note: "was eat? explode? The gears just got worse! 🙃", ms: 5000, sound: "bad" },
    { who: "nova", say: "See? The gears won't turn with sentences like that. Every right answer fixes one gear.", s: "I | was eating#new | a sandwich when the machine | exploded#new", ms: 5000, sound: "ok" },
    { who: "nova", say: "Hero, you're up. Let's fix yesterday!", s: "", ms: 3000, walk: true, sound: "level" }] },
  "q-robots": { stage: KITCHEN, beats: [
    { who: "zip", say: "Welcome to my robot pizza kitchen! My robots make the pizzas.", s: "The robots#s | make#v | the pizzas#o", ms: 4000 },
    { who: "zip", say: "I made their instructions shorter. Now they're a bit… mixed up.", s: "", ms: 3800 },
    { who: "zip", say: "The pizza ate the robot! Help! It's hungry!", s: "The pizza#s | ate#v | the robot#o", note: "Who's doing the eating? The PIZZA! 🍕", ms: 4500, walk: true, sound: "bad" },
    { who: "nova", say: "Find the doer. Pizzas don't eat robots. Robots make pizzas. The pizza was made by the robots.", s: "The pizza#o | was made#new | by the robots#s", ms: 5500, sound: "ok" },
    { who: "nova", say: "Hero, find the doers and switch the sentences round, before that pizza gets hungry again.", s: "", ms: 4000, walk: true, sound: "level" }] },
  "q-museum": { stage: MUSEUM, beats: [
    { who: "nova", say: "Museum Night. Last night, the golden mask disappeared.", s: "", ms: 3500 },
    { who: "nova", say: "While the guards were sleeping, the mask was being stolen.", s: "The mask#o | was being stolen#v", ms: 4500 },
    { who: "zip", say: "So… the mask was stealing? Naughty mask! It stole itself and ran away!", s: "The mask#o | was stealing#bad", note: "was stealing = the mask did the stealing. 🙃", ms: 5000, walk: true, sound: "bad" },
    { who: "nova", say: "No, Zip. The mask didn't DO anything. Somebody stole it. The question is: by whom?", s: "The mask#o | was being stolen#new | by ???#s", ms: 5200, sound: "ok" },
    { who: "nova", say: "Hero, search the halls and question the suspects. Let's solve the case.", s: "", ms: 4000, walk: true, sound: "level" }] }
};
export const hasScene = id => !!SCENES[id];
const scene = id => SCENES[id] || CUTS[id] || null;

const sentence = s => s ? s.split("|").map(x => x.trim()).filter(Boolean).map(x => { const [t, k] = x.split("#"); return `<span class="at${k ? ` at-${k}` : ""}">${esc(t)}</span>`; }).join("") : `<span class="note">…</span>`;

export const sceneHTML = (id, { me = "" } = {}) => scene(id) ? `<div class="scn" id="gscn" data-scene="${esc(id)}" data-beat="0">
  <div class="scnstage">${scene(id).stage.replace("%%ME%%", me)}</div>
  <div class="scnsay"><span class="scnav"></span><p class="scnbub" aria-live="polite"></p></div>
  <div class="scnsent"></div><p class="scnnote"></p>
  <div class="anctl"><button type="button" class="anb" data-sc="prev" aria-label="Back">‹</button><span class="andots"></span>
  <button type="button" class="anb" data-sc="next" aria-label="Next">›</button><button type="button" class="btn small alt" data-sc="pause">⏸ Pause</button></div></div>` : "";

// Playing: each line is spoken (audio/scenes, made by tools/make_scene_audio.py), then the scene waits so students
// can read it before the next beat. With sound off, or if the voice can't play, it waits by the length of the line.
// Tap the stage or › to move on, ⏸ to pause.
let timer = null, voice = null, guard = null;
const READ_GAP = 1800;
const stopAll = () => { clearTimeout(timer); clearInterval(guard); if (voice) { voice.pause(); voice = null; } };
export function mountScene(root = typeof document !== "undefined" && document.getElementById("gscn")) {
  stopAll();
  if (!root || !scene(root.dataset.scene)) return;
  const sid = root.dataset.scene, beats = scene(sid).beats;
  let k = -1, paused = false;
  guard = setInterval(() => { if (!root.isConnected) stopAll(); }, 500);
  const after = (ms) => { clearTimeout(timer); if (!paused && k < beats.length - 1) timer = setTimeout(() => go(k + 1), ms); else if (k >= beats.length - 1) setPaused(true, true); };
  const setPaused = (p, end = false) => { paused = p; const b = root.querySelector('[data-sc="pause"]'); if (b) { b.textContent = p ? (end ? "↻ Again" : "▶ Play") : "⏸ Pause"; b.dataset.end = end ? 1 : ""; } };
  const say = b => {
    if (voice) { voice.pause(); voice = null; }
    const words = b.say.split(/\s+/).length, fallback = Math.max(b.ms || 0, 1500 + words * 380) + READ_GAP;
    if (!soundOn()) return after(fallback);
    const v = SCENE_AUDIO[`${sid}-${k}`];
    if (!v) return after(fallback);
    const a = voice = new Audio(`audio/scenes/${sid}-${k}.mp3?v=${v}`), t0 = Date.now();
    a.onended = () => { if (voice === a) after(Math.max(READ_GAP, (b.ms || 0) - (Date.now() - t0))); };
    setTimeout(() => { if (voice === a && root.isConnected) a.play().catch(() => after(fallback)); }, 450);
  };
  const show = (n, sound = false) => {
    clearTimeout(timer);
    const was = k; k = Math.max(0, Math.min(beats.length - 1, n)); const b = beats[k];
    root.dataset.beat = k; root.dataset.who = b.who;
    if (b.walk && was !== k) { root.classList.add("walking"); setTimeout(() => root.classList.remove("walking"), 1700); }
    root.querySelector(".scnav").innerHTML = b.who === "zip" ? ZIP : NOVA;
    const bub = root.querySelector(".scnbub"); bub.innerHTML = `<b>${b.who === "zip" ? "Zip" : "Nova"}:</b> ${esc(b.say)}`; bub.classList.remove("an-fade"); void bub.offsetWidth; bub.classList.add("an-fade");
    const sent = root.querySelector(".scnsent"); sent.innerHTML = sentence(b.s); sent.classList.remove("an-fade"); void sent.offsetWidth; sent.classList.add("an-fade");
    root.querySelector(".scnnote").textContent = b.note || "";
    root.querySelector(".andots").innerHTML = beats.map((_, j) => `<button type="button" class="andot${j === k ? " on" : ""}" data-sc="${j}" aria-label="Scene ${j + 1}"></button>`).join("");
    root.querySelectorAll(".andot").forEach(btn => btn.onclick = ev => { ev.stopPropagation(); go(+btn.dataset.sc); });
    if (sound && b.sound) setTimeout(() => play(b.sound), 200);
    say(b);
  };
  const go = n => { if (paused) setPaused(false); show(n, true); };
  root.querySelectorAll('.anctl > [data-sc]').forEach(btn => btn.onclick = ev => { ev.stopPropagation(); const a = btn.dataset.sc;
    if (a === "prev") go(k - 1); else if (a === "next") go(k + 1);
    else if (a === "pause") { if (btn.dataset.end) return go(0); if (paused) { setPaused(false); go(k); } else { setPaused(true); clearTimeout(timer); if (voice) voice.pause(); } } });
  root.querySelector(".scnstage").onclick = () => go(k + 1);
  if (reduced()) { paused = true; show(0); setPaused(true); } else go(0);
}
