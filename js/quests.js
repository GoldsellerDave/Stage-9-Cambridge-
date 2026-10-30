// Grammar Quests: the grammar engine (gengine.js) as a game. Each quest is a story with 3 levels, and each level is one
// brick of the tower, so a level is cleared when that brick is mastered (in a quest or in Grammar Builder, it's the
// same brick). Quests open in order; a student who already has the bricks finds the levels already cleared.
// Clearing a quest gives the hero a power to use in later levels. Gear (hats, capes...) unlocks with total XP.
// The hero is the student's own blocky avatar, the same style as Zip and Nova (scenes.js), all our own designs.
// Looks are kept on the device (like Look settings); progress comes from answers, so nothing new is saved.
import { GBLOCKS, isMastered, pOf, MASTERED } from "./gengine.js";

export const QXP = { level: 10, quest: 30 };

export const QUESTS = [
  { id: "q-time", name: "The Time Loop", icon: "⏳", sky: ["#2B1B5A", "#7B4FA8"],
    blurb: "Zip pressed the big red button. Now yesterday keeps happening! Tell the story of yesterday right to fix the Time Engine.",
    levels: [["past-simple", "Fix the first gear"], ["past-cont", "Fix the second gear"], ["ps-pc", "Restart the Time Engine"]],
    power: { id: "rewind", name: "Rewind", icon: "⏪", say: "Once a level, a mistake doesn't break your combo." } },
  { id: "q-robots", name: "Robot Mix-up", icon: "🤖", sky: ["#0F3B3A", "#2BA59E"],
    blurb: "Zip's robot helpers mixed up who does what. Now the pizza is chasing the robots! Find the doers and put the world the right way round.",
    levels: [["doer", "Find the doers"], ["active-passive", "Switch it round"], ["past-passive", "Stop the pizza"]],
    power: { id: "shield", name: "Switch Shield", icon: "🛡️", say: "Once a level, knock out one wrong answer (it counts as a hint)." } },
  { id: "q-museum", name: "Museum Night", icon: "🏛️", sky: ["#0B1426", "#2E4A7A"],
    blurb: "The golden mask vanished while the guards were sleeping. Nova needs your help to work out what was being done, and by whom.",
    levels: [["progress", "Search the halls"], ["by-agent", "Question the suspects"], ["past-cont-passive", "Solve the case"]],
    power: { id: "surge", name: "Power Surge", icon: "⚡", say: "Combo bonuses count double." } }
];
export const questOf = id => QUESTS.find(q => q.id === id) || null;

// Each quest's state from the student's mastery: levels cleared, the level to play, open or locked.
export function questState(st, qi) {
  const q = QUESTS[qi], done = q.levels.map(([b]) => isMastered(st, b));
  const open = qi === 0 || questState(st, qi - 1).cleared, cleared = done.every(Boolean);
  const at = cleared ? null : done.indexOf(false);
  return { q, done, open, cleared, at, built: q.levels.map(([b]) => Math.min(100, Math.round(100 * pOf(st, b) / MASTERED))) };
}
export const powersOf = st => QUESTS.filter((q, i) => questState(st, i).cleared).map(q => q.power);

// The hero's look. Gear unlocks with total XP; one item per slot.
export const SKINS = ["#F1C27D", "#E0AC69", "#C68642", "#8D5524", "#FFDBAC"];
export const HAIRS = ["short", "spiky", "long", "bun", "none"];
export const HAIR_COLS = ["#3B2A20", "#111111", "#C98A0B", "#B5482A", "#6B4FA8", "#2BA59E"];
export const SHIRTS = ["#2E6FB0", "#E2574C", "#2BA59E", "#7B4FA8", "#F2A93B", "#3A3A3A"];
export const GEAR = [
  { id: "cap", name: "Cap", icon: "🧢", slot: "head", xp: 0 },
  { id: "phones", name: "Headphones", icon: "🎧", slot: "head", xp: 150 },
  { id: "shades", name: "Shades", icon: "🕶️", slot: "face", xp: 300 },
  { id: "cape", name: "Cape", icon: "🦸", slot: "back", xp: 500 },
  { id: "jet", name: "Jetpack", icon: "🚀", slot: "back", xp: 800 },
  { id: "crown", name: "Crown", icon: "👑", slot: "head", xp: 1200 }
];
export const DEFAULT_HERO = { skin: 0, hair: "short", hairCol: 0, shirt: 0, gear: { head: null, face: null, back: null } };
export const gearOpen = (g, xp) => xp >= g.xp;
// A saved look, made safe: unknown values fall back, locked gear comes off.
export function cleanHero(h, xp = 0) {
  const o = { ...DEFAULT_HERO, ...(h && typeof h === "object" ? h : {}) }, idx = (v, a) => (Number.isInteger(v) && v >= 0 && v < a.length ? v : 0);
  const gear = {};
  for (const slot of ["head", "face", "back"]) { const g = GEAR.find(x => x.id === (o.gear || {})[slot]); gear[slot] = g && g.slot === slot && gearOpen(g, xp) ? g.id : null; }
  return { skin: idx(o.skin, SKINS), hair: HAIRS.includes(o.hair) ? o.hair : "short", hairCol: idx(o.hairCol, HAIR_COLS), shirt: idx(o.shirt, SHIRTS), gear };
}

const sh = (x, y, w, h) => `<rect x="${x + w * 0.72}" y="${y}" width="${w * 0.28}" height="${h}" fill="#000" opacity=".16"/>`;
const blk = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="${fill}"/>${sh(x, y, w, h)}`;
const AURA = { rewind: "#B98CFF", shield: "#5EE6D8", surge: "#FFD54A" };
// The hero as SVG. inner: just the shapes (for a scene stage), else a whole <svg>. powers: a glow for each power.
export function heroSVG(h, { powers = [], inner = false, cls = "" } = {}) {
  const hero = cleanHero(h, Infinity), skin = SKINS[hero.skin], hair = HAIR_COLS[hero.hairCol], shirt = SHIRTS[hero.shirt], g = hero.gear;
  let s = powers.map((p, i) => `<rect class="hr-aura" x="${4 - i * 2}" y="${2 - i * 2}" width="${40 + i * 4}" height="${58 + i * 4}" rx="10" fill="none" stroke="${AURA[p.id] || "#fff"}" stroke-width="2" opacity=".75"/>`).join("");
  if (g.back === "cape") s += `<path d="M14 24H34L39 52H9Z" fill="#C0392B"/><path d="M30 24H34L39 52H33Z" fill="#000" opacity=".16"/>`;
  if (g.back === "jet") s += `${blk(8, 24, 6, 15, "#8795A1")}${blk(34, 24, 6, 15, "#8795A1")}<path class="hr-flame" d="M9 39h4l-2 7zM35 39h4l-2 7z" fill="#FF8A3D"/>`;
  s += `${blk(16, 44, 7, 14, "#2B3440")}${blk(25, 44, 7, 14, "#2B3440")}`;
  s += `${blk(14, 24, 20, 20, shirt)}<rect x="17" y="27" width="8" height="5" fill="#fff" opacity=".3"/>`;
  s += `${blk(9, 25, 5, 15, shirt)}${blk(9, 40, 5, 4, skin)}${blk(34, 25, 5, 15, shirt)}${blk(34, 40, 5, 4, skin)}`;
  if (hero.hair === "long") s += `${blk(13, 6, 3, 18, hair)}${blk(32, 6, 3, 18, hair)}`;
  s += `${blk(15, 6, 18, 18, skin)}<rect x="19" y="13" width="3" height="3" fill="#222"/><rect x="26" y="13" width="3" height="3" fill="#222"/><rect x="21" y="19" width="6" height="1.6" fill="#7A3B2A"/>`;
  if (hero.hair === "short" || hero.hair === "long" || hero.hair === "bun") s += blk(14, 4, 20, 5, hair);
  if (hero.hair === "bun") s += blk(20, 0, 8, 5, hair);
  if (hero.hair === "spiky") s += `<path d="M14 9V4l3 -3l3 3l3 -4l3 4l3 -3l3 3l2 -1V9Z" fill="${hair}"/>`;
  if (g.face === "shades") s += `<rect x="17" y="12" width="14" height="4.5" fill="#111"/><rect x="18" y="12.6" width="4" height="1.4" fill="#fff" opacity=".5"/>`;
  if (g.head === "cap") s += `${blk(14, 2, 20, 6, "#E2574C")}<rect x="26" y="6" width="12" height="2.6" fill="#B23A30"/>`;
  if (g.head === "phones") s += `<path d="M14 12V6h20v6" stroke="#222" stroke-width="2.4" fill="none"/>${blk(11, 10, 5, 8, "#E2574C")}${blk(32, 10, 5, 8, "#E2574C")}`;
  if (g.head === "crown") s += `<path d="M15 6V0l4 3l5 -3l5 3l4 -3V6Z" fill="#F2C230" stroke="#C98A0B" stroke-width="1"/><rect x="22.5" y="2.5" width="3" height="3" fill="#E2574C"/>`;
  return inner ? s : `<svg viewBox="0 0 48 60" class="qhero${cls ? " " + cls : ""}" aria-hidden="true">${s}</svg>`;
}

export const levelName = (q, k) => `${q.levels[k][1]}: ${GBLOCKS[q.levels[k][0]].name}`;
