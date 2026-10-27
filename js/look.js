// How the site looks for each student: light or dark, colour theme, text size, easy-read font, paper background.
// Kept on this device for each student (like the sound setting) and applied as data- attributes on <html>.
let who = "";
const KEY = () => "ckpt-look-" + who;
export const DEFAULT_LOOK = { mode: "auto", theme: "ocean", size: "m", font: "normal", paper: "off" };

// Some themes unlock as rewards. `need` says how, for the lock message.
export const THEMES = [
  { id: "ocean", name: "Ocean", colors: ["#16324F", "#1E8C87"] },
  { id: "forest", name: "Forest", colors: ["#1E4632", "#2A7A4B"] },
  { id: "sunset", name: "Sunset", colors: ["#5B2333", "#BF4B28"] },
  { id: "berry", name: "Berry", colors: ["#3F1D52", "#8A3D8F"], need: "Earn 200 XP", ok: s => s.xp >= 200 },
  { id: "midnight", name: "Midnight", colors: ["#0F172A", "#4752C4"], need: "Win a unit badge", ok: s => s.missionBadges > 0 },
  { id: "gold", name: "Gold", colors: ["#3A2A08", "#C98A0B"], need: "Earn 500 XP", ok: s => s.xp >= 500 }
];
export const themeOpen = (t, stats) => !t.ok || t.ok(stats);

export function lookUser(username) { who = username || ""; }
export function getLook() {
  try { return { ...DEFAULT_LOOK, ...(JSON.parse(localStorage.getItem(KEY())) || {}) }; } catch (e) { return { ...DEFAULT_LOOK }; }
}
export function setLook(change) {
  const l = { ...getLook(), ...change };
  try { localStorage.setItem(KEY(), JSON.stringify(l)); } catch (e) {}
  applyLook(l);
  return l;
}
// A theme that is no longer open (for example on a different account) falls back to Ocean.
export function applyLook(l = getLook(), stats = null) {
  const root = document.documentElement, t = THEMES.find(x => x.id === l.theme);
  const theme = t && (!stats || themeOpen(t, stats)) ? t.id : "ocean";
  const set = (k, v, def) => v === def ? root.removeAttribute("data-" + k) : root.setAttribute("data-" + k, v);
  set("mode", l.mode, "auto"); set("theme", theme, "ocean"); set("size", l.size, "m"); set("font", l.font, "normal"); set("paper", l.paper, "off");
}
export function clearLook() { ["mode", "theme", "size", "font", "paper"].forEach(k => document.documentElement.removeAttribute("data-" + k)); }
