// Grammar Builder visuals: a strand drawn as a tower the student builds, one brick per grammar block (gengine.js).
// Foundations at the bottom, each layer built on the one below. A crane hangs over the next brick to build.
//   mastered: a solid gold brick (cracked when its review is due)   building: part-filled, by mastery
//   next: glowing outline under the crane                              not yet: a faint scaffold outline
// Ranks name how far up the student has built. Pure strings, so the teacher page and tests can use it too.
import { GBLOCKS, MASTERED, START_P, layers, isMastered, pOf } from "./gengine.js";

export const RANKS = [[0, "Apprentice", "🪨"], [5, "Bricklayer", "🧱"], [10, "Builder", "🏗️"], [16, "Engineer", "⚙️"], [22, "Architect", "🏛️"]];
export const rankOf = n => RANKS.filter(r => n >= r[0]).pop();
export const nextRank = n => RANKS.find(r => r[0] > n) || null;

export function brickState(st, id, { next = null, due = [] } = {}) {
  if (isMastered(st, id)) return due.includes(id) ? "due" : "done";
  if (id === next) return "next";
  return pOf(st, id) > START_P + 0.01 ? "build" : "todo";
}

// The tower as inline SVG. fresh: ids to drop in with an animation (newly mastered since the last visit).
export function towerSVG(st, { strand = "passive", next = null, due = [], fresh = [], small = false } = {}) {
  const L = layers(strand), W = 360, rowH = small ? 26 : 34, gap = 5, top = small ? 40 : 70, groundH = 22;
  const H = top + L.length * rowH + groundH;
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let bricks = "", hookX = null, hookY = null;
  L.forEach((row, li) => {
    const n = row.length, bw = Math.min(small ? 46 : 60, (W - (small ? 30 : 64) - gap * (n - 1)) / n), rowW = n * bw + gap * (n - 1);
    const y = H - groundH - (li + 1) * rowH + 3, x0 = (W - (small ? 0 : 26) - rowW) / 2, h = rowH - 6;
    row.forEach((id, k) => {
      const x = x0 + k * (bw + gap), s = brickState(st, id, { next, due }), b = GBLOCKS[id], fill = Math.min(1, pOf(st, id) / MASTERED);
      const label = `${b.name}: ${{ done: "built", due: "built, needs a quick check", next: "next to build", build: "being built", todo: "not built yet" }[s]}`;
      const delay = fresh.includes(id) ? ` style="animation-delay:${(0.15 + fresh.indexOf(id) * Math.min(0.25, 2.5 / fresh.length)).toFixed(2)}s"` : "";
      bricks += `<g class="tw-b tw-${s}${fresh.includes(id) ? " tw-drop" : ""}" data-gbk="${id}" role="button" tabindex="0" aria-label="${esc(label)}"${delay}>
        <title>${esc(label)}</title><rect class="tw-shell" x="${x}" y="${y}" width="${bw}" height="${h}" rx="5"/>`;
      if (s === "build") bricks += `<rect class="tw-fill" x="${x + 2}" y="${y + h - 2 - (h - 4) * fill}" width="${bw - 4}" height="${(h - 4) * fill}" rx="3"/>`;
      if (s === "done" || s === "due") bricks += `<path class="tw-shine" d="M${x + 5} ${y + 5}H${x + bw - 5}"/>`;
      if (s === "due") bricks += `<path class="tw-crack" d="M${x + bw * 0.45} ${y + 1}l4 ${h * 0.3}l-6 ${h * 0.2}l5 ${h * 0.3}"/>`;
      if (s === "next") { hookX = x + bw / 2; hookY = y; }
      bricks += `</g>`;
    });
  });
  // Crane: mast on the right, jib across the top, hook down to the next brick.
  let crane = "";
  if (hookX != null && !small) {
    const mx = W - 18, jy = 22;
    crane = `<g class="tw-crane" aria-hidden="true"><path d="M${mx} ${H - groundH}V${jy - 8}M${mx - 6} ${H - groundH}L${mx} ${jy}M${mx + 6} ${H - groundH}L${mx} ${jy}"/>
      <path d="M${Math.min(hookX - 20, 20)} ${jy}H${mx + 10}M${mx} ${jy - 8}L${Math.min(hookX - 20, 20)} ${jy}"/>
      <rect class="tw-cab" x="${mx - 9}" y="${jy + 2}" width="16" height="12" rx="2"/>
      <g class="tw-hook"><path d="M${hookX} ${jy}V${hookY - 14}"/><path class="tw-hookend" d="M${hookX - 5} ${hookY - 14}h10l-5 7z"/></g></g>`;
  }
  return `<svg class="tower${small ? " small" : ""}" viewBox="0 0 ${W} ${H}" role="group" aria-label="Your grammar tower">
    <rect class="tw-sky" x="0" y="0" width="${W}" height="${H - groundH}" rx="12"/>
    ${small ? "" : `<circle class="tw-sun" cx="40" cy="34" r="14"/><path class="tw-cloud" d="M120 40a10 10 0 0 1 18-6a12 12 0 0 1 22 4a8 8 0 0 1 0 16h-38a8 8 0 0 1-2-14z"/>`}
    <rect class="tw-ground" x="0" y="${H - groundH}" width="${W}" height="${groundH}" rx="6"/>
    ${crane}${bricks}</svg>`;
}
