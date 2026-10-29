// Shared rendering helpers for the student and teacher pages.
import { LEVELS, BANDS, readingBand, currentBand, steadyBand, textLevel, skillStats, badges, weeklyStreak, SKILL_BADGES, STEP_BADGES, STEADY_OF, SUPPORT_LABEL } from "./engine.js";
import { CHECKS } from "./checks.js";
import { PRACTICE_TEXTS } from "./content.js";
import { unitWords, wordPattern } from "./practice.js";
import { LISTENING } from "./listening.js";
import { trailStops, trailHere } from "./trail.js";
import { icon } from "./icons.js";
import { TRAPS, trapStats, weakestTrap, missionForTrap, labMission, isLabAttempt, labSummary, LAB_LEVELS } from "./lab.js";
import { RTRAPS, rTrapStats, weakestRTrap, rMissionForTrap, rlabMission } from "./rlab.js";
import { drillSkill } from "./drill.js";

export const SKILLS = ["Main idea", "Detail", "Vocabulary in context", "Detail: two points", "Inference",
                       "Cause and effect", "Writer's purpose", "Writer's view", "Reading Lab", "Vocabulary", "Grammar", "Listening"];

export function esc(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}
export function levelName(l) { return l == null ? "Not placed" : LEVELS[l]; }
// The CEFR step of the latest reading, or the text level if there is none yet.
export function bandName(history, level) { const b = currentBand(history); return b == null ? levelName(level) : BANDS[b]; }
export function fmtDate(d) { return d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "–"; }
export function fmtClock(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
export function fmtTime(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + " min " + (s % 60) + " s"; }
export function textTitle(id) {
  const t = PRACTICE_TEXTS.find(x => x.id === id); if (t) return t.topic;
  const l = LISTENING.find(x => x.id === id); if (l) return `Listening: ${l.topic}`;
  if (id === "baseline") return "Baseline";
  const lab = labMission(id); if (lab) return `Listening Lab: ${lab.title}`;
  const rlab = rlabMission(id); if (rlab) return `Reading Lab: ${rlab.title}`;
  const ds = drillSkill(id); if (ds) return `Skill drill: ${ds}`;
  const c = CHECKS.find(x => x.id === id); if (c) return c.title;
  if (id === "vocab-review") return "Word review";
  let m = /^vocab-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} vocabulary`;
  m = /^grammar-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} grammar quiz`;
  m = /^cards-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} word cards`;
  m = /^family-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} word families`;
  m = /^rain-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} Word Rain`;
  m = /^escape-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} escape room`;
  m = /^train-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} Word Train`;
  m = /^speed-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} Speed Read`;
  m = /^dodge-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} Trap Dodger`;
  m = /^boss-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} final challenge`;
  m = /^grammar-(\d\.\d)$/.exec(id); if (m) return `Grammar ${m[1]}`;
  return id;
}

// Unit words in a reading text become buttons that show their meaning (opts.unit). Longer phrases are matched first.
const glossCache = {};
function glossRules(unit) {
  if (!glossCache[unit]) glossCache[unit] = unitWords(unit).sort((a, b) => b.w.length - a.w.length)
    .map(x => ({ key: `${x.unit}:${x.w}`, re: new RegExp(wordPattern(x.w).source, "gi") }));
  return glossCache[unit];
}
function gloss(html, unit, skip = "") {
  // Only text between tags is changed, and each word is marked once per paragraph.
  // Words named in `skip` (a question that tests them) are left plain.
  const seen = new Set(glossRules(unit).filter(r => { r.re.lastIndex = 0; return r.re.test(skip); }).map(r => r.key));
  return html.split(/(<[^>]+>)/).map(part => {
    if (part.startsWith("<")) return part;
    let pieces = [{ t: part }];
    glossRules(unit).forEach(r => {
      if (seen.has(r.key)) return;
      pieces = pieces.flatMap(p => {
        if (p.key) return [p];
        r.re.lastIndex = 0;
        const m = r.re.exec(p.t); if (!m || seen.has(r.key)) return [p];
        seen.add(r.key);
        return [{ t: p.t.slice(0, m.index) }, { t: m[0], key: r.key }, { t: p.t.slice(m.index + m[0].length) }];
      });
    });
    return pieces.map(p => p.key ? `<button type="button" class="gw" data-gw="${esc(p.key)}">${p.t}</button>` : p.t).join("");
  }).join("");
}
export function paraHTML(p, focus, here, unit) {
  let body = esc(p[1]);
  if (focus) { const f = esc(focus), i = body.indexOf(f); if (i >= 0) body = body.slice(0, i) + "<mark>" + f + "</mark>" + body.slice(i + f.length); }
  if (unit && typeof unit === "object") body = gloss(body, unit.no, unit.skip);
  else if (unit) body = gloss(body, unit);
  return `<div class="para${here ? " here" : ""}"><b class="lt">${p[0]}</b><p>${body}</p></div>`;
}
export function textHTML(t, opts = {}) {
  return `<div class="text"><h2>${esc(t.title)}</h2>${t.paras.map(p => paraHTML(p, opts.para === p[0] ? opts.focus : null, opts.para === p[0], opts.unit)).join("")}` +
         (opts.unit ? `<p class="note">Tap an underlined word to see what it means.</p>` : "") +
         (t.gloss ? `<div class="gloss">${esc(t.gloss)}</div>` : "") + "</div>";
}

function medalSVG(on) {
  return `<svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true"><path d="M9 2h4l2 7h-4zM15 2h4l-2 7h-4z" fill="${on ? "var(--teal)" : "var(--line)"}"/>` +
         `<circle cx="14" cy="17" r="8.5" fill="${on ? "var(--gold)" : "var(--line)"}"/><path d="M14 12.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" fill="var(--surface)"/></svg>`;
}

// Reading level after each baseline and practice text, on eight CEFR steps (A2 to C1+), drawn as a step line.
// Each CEFR band is a shaded strip; the dot's colour shows the text version it was read on.
const LEVEL_DOT = ["#8FA82B", "var(--teal)", "#2F6FB5", "#7B4FC4"];
export function levelChart(history) {
  const pts = history.filter(h => (h.mode === "practice" || h.mode === "baseline") && h.level_end != null).map(h => ({ h, b: readingBand(h), l: textLevel(h) }));
  if (pts.length < 1) return `<p class="note">Your level line appears after your first reading.</p>`;
  const W = 600, H = 270, L = 62, R = 14, T = 12, B = 34, n = pts.length, step = (H - T - B) / 8;
  const x = i => n === 1 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (n - 1);
  const y = b => T + (7.5 - b) * step;
  // The line is the steady level (middle of the last three readings); the dots are single readings.
  let d = "";
  pts.forEach((p, i) => { const s = steadyBand(pts.slice(0, i + 1).map(q => q.h)); d += i === 0 ? `M${x(i)},${y(s)}` : `H${x(i)}V${y(s)}`; });
  const strips = ["A2", "B1", "B2", "C1"].map((c, k) => `<rect x="${L}" y="${T + (3 - k) * 2 * step}" width="${W - L - R}" height="${2 * step}" fill="var(--teal)" opacity="${k % 2 ? 0.05 : 0.11}"/>`).join("");
  const grid = BANDS.map((name, b) => `<line x1="${L}" x2="${W - R}" y1="${y(b)}" y2="${y(b)}" stroke="var(--line)" stroke-dasharray="2 5"/><text x="${L - 8}" y="${y(b) + 4}" text-anchor="end"${b % 2 ? "" : ' font-weight="700"'}>${name}</text>`).join("");
  const dots = pts.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.b)}" r="${i === n - 1 ? 6.5 : 4.5}" fill="${p.h.mode === "baseline" ? "var(--orange)" : LEVEL_DOT[p.l]}" opacity="${i === n - 1 ? 1 : 0.85}" stroke="var(--surface)" stroke-width="2"><title>${esc(textTitle(p.h.text_id))}, ${fmtDate(p.h.created_at)}: ${BANDS[p.b]} (${p.h.mode === "baseline" ? (p.h.text_id === "baseline" ? "baseline" : "Checkpoint check") : LEVELS[p.l] + " text"}, ${p.h.score}/${p.h.max_score})</title></circle>`).join("");
  const first = `<text x="${x(0)}" y="${H - 8}" text-anchor="${n === 1 ? "middle" : "start"}">${fmtDate(pts[0].h.created_at)}</text>`;
  const last = n > 1 ? `<text x="${x(n - 1)}" y="${H - 8}" text-anchor="end">${fmtDate(pts[n - 1].h.created_at)}</text>` : "";
  const used = [...new Set(pts.filter(p => p.h.mode !== "baseline").map(p => p.l))].sort();
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Reading level over time, from A2 to C1+">${strips}${grid}<path d="${d}" fill="none" stroke="var(--teal)" stroke-width="2.5"/>${dots}${first}${last}</svg></div>
    <div class="legend"><span><i style="background:var(--teal);height:3px"></i>Steady level</span><span><i style="background:var(--orange);border-radius:50%"></i>Baseline or check</span>${used.map(l => `<span><i style="background:${LEVEL_DOT[l]};border-radius:50%"></i>${LEVELS[l]} text</span>`).join("")}</div>
    <p class="note">Each text version covers a lower and an upper step: Easier A2 to A2+, Core B1 to B1+, Harder B2 to B2+, Challenge C1 to C1+. About 75% right first time puts a reading on the upper step. The line shows your steady level: the middle step of your last ${STEADY_OF} readings, so one bad day does not pull it down.</p>
`;
}

export function skillBars(history) {
  const st = skillStats(history);
  return `<div class="skills">${SKILLS.map(s => {
    const k = st[s]; const pct = k && k.total ? Math.round(100 * k.right / k.total) : null;
    return `<div class="skillrow"><span>${esc(s)}</span><div class="bar" aria-hidden="true"><i class="${pct != null && pct < 50 ? "low" : ""}" style="width:${pct || 0}%"></i></div><span>${pct == null ? "–" : pct + "%"}</span></div>`;
  }).join("")}</div><p class="note">Right first time, from the last 20 questions on each skill.</p>`;
}

// The Road to Checkpoint: a winding road down the left, with a label beside each stop.
const ROAD_GAP = { start: 74, unit: 78, gate: 66, check: 62, finish: 84 };
export function roadSVG(history, { links = true } = {}) {
  const stops = trailStops(history), here = trailHere(stops), W = 340;
  let y = 34; const pts = stops.map((s, i) => { if (i) y += ROAD_GAP[s.kind]; return { s, i, x: Math.round(52 + 22 * Math.sin(y / 70)), y }; });
  const H = y + 46;
  const seg = (a, b) => `C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y}`;
  const path = to => pts.slice(0, to + 1).map((p, k) => k ? seg(pts[k - 1], p) : `M${p.x},${p.y}`).join(" ");
  const ic = (name, cx, cy, sz, col) => icon(name, sz).replace("<svg ", `<svg x="${cx - sz / 2}" y="${cy - sz / 2}" style="color:${col}" `);
  const node = ({ s, x, y }) => {
    if (s.kind === "start") return `<circle cx="${x}" cy="${y}" r="19" fill="${s.done ? "var(--teal)" : "var(--surface)"}" stroke="var(--teal)" stroke-width="3"/>
      <text x="${x}" y="${y + 5}" text-anchor="middle" class="rd-go" fill="${s.done ? "#fff" : "var(--teal)"}">GO</text>`;
    if (s.kind === "unit") { const C = 2 * Math.PI * 21;
      return `<circle cx="${x}" cy="${y}" r="21" fill="${s.done ? "var(--teal)" : "var(--surface)"}" stroke="var(--line)" stroke-width="5"/>
        ${s.progress > 0 && !s.done ? `<circle cx="${x}" cy="${y}" r="21" fill="none" stroke="var(--teal)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C * s.progress).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${x} ${y})"/>` : ""}
        <text x="${x}" y="${y + 6}" text-anchor="middle" class="rd-num" fill="${s.done ? "#fff" : "var(--ink)"}">${s.unit}</text>`; }
    if (s.kind === "gate") return `<path d="M${x - 15},${y - 13} h30 v12 c0,9 -8,15 -15,18 c-7,-3 -15,-9 -15,-18z" fill="${s.done ? "var(--gold)" : "var(--card)"}" stroke="${s.done ? "var(--gold)" : "var(--line)"}" stroke-width="2"/>
      ${ic(s.done ? "check" : "lock", x, y + 1, 16, s.done ? "#1A1205" : "var(--muted)")}`;
    if (s.kind === "check") return `<path d="M${x - 8},${y + 14} V${y - 14}" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${x - 7},${y - 14} h17 l-4,6 4,6 h-17z" fill="${s.done ? "var(--orange)" : "var(--card)"}" stroke="var(--orange)" stroke-width="1.5"/>`;
    const sq = 7, cells = []; // finish post: a chequered flag on a pole, gold when reached
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if ((r + c) % 2 === 0) cells.push(`<rect x="${x - 10 + c * sq}" y="${y - 22 + r * sq}" width="${sq}" height="${sq}" fill="var(--ink)"/>`);
    return `<circle cx="${x}" cy="${y}" r="27" fill="${s.done ? "var(--gold)" : "var(--gold-bg)"}" stroke="var(--gold)" stroke-width="3"/>
      <path d="M${x - 11},${y + 18} V${y - 22}" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="${x - 10}" y="${y - 22}" width="${4 * sq}" height="${3 * sq}" fill="var(--surface)" stroke="var(--ink)" stroke-width="1"/>${cells.join("")}`;
  };
  const label = ({ s, i, x, y }) => {
    const lx = x + (s.kind === "finish" ? 40 : 34), you = i === here;
    return `${you ? `<text x="${lx}" y="${y - 21}" class="rd-you">YOU ARE HERE</text>` : ""}
      <text x="${lx}" y="${y - 2}" class="rd-t${s.done ? " done" : ""}">${esc(s.title)}</text><text x="${lx}" y="${y + 15}" class="rd-s">${esc(s.sub)}</text>`;
  };
  const href = s => !links ? null : s.unit ? `#unit-${s.unit}/mission` : s.kind === "start" || s.kind === "check" ? "#home" : null;
  const body = pts.map(p => { const h = href(p.s), g = `<g class="rd-stop${p.s.done ? " done" : ""}">${p.i === here ? `<circle cx="${p.x}" cy="${p.y}" r="31" class="rd-here"/>` : ""}${node(p)}${label(p)}</g>`;
    return h ? `<a href="${h}" aria-label="${esc(p.s.title + ". " + p.s.sub)}">${g}</a>` : g; }).join("");
  const reached = Math.max(0, here - (stops[here].done ? 0 : 1));
  return `<div class="road"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Road to Checkpoint: ${stops.filter(s => s.done).length} of ${stops.length} stops reached">
    <path d="${path(stops.length - 1)}" fill="none" stroke="var(--line)" stroke-width="16" stroke-linecap="round"/>
    <path d="${path(stops.length - 1)}" fill="none" stroke="var(--surface)" stroke-width="2" stroke-dasharray="6 8"/>
    ${reached > 0 ? `<path d="${path(reached)}" fill="none" stroke="var(--gold)" stroke-width="16" stroke-linecap="round" opacity=".85"/>` : ""}
    ${body}</svg></div>`;
}

// Every badge that is not on the road, grouped on shelves.
export function trophyCabinet(history) {
  const got = new Map(badges(history).map(b => [b.name, b.why]));
  const shelves = [
    ["Reading", [{ name: "Off the mark", why: "Finish a practice text" }, { name: "Bookworm", why: "Finish 5 practice texts" },
                 { name: "Top level", why: "Reach the Harder text" }, { name: "Challenger", why: "Reach a Challenge (C1) text" }]],
    ["Reading level", STEP_BADGES.map(b => ({ name: b.name, why: `Reach a steady ${BANDS[b.band]} level` }))],
    ["Skills", Object.entries(SKILL_BADGES).map(([sk, n]) => ({ name: n, why: "10 " + sk.toLowerCase() + " right first time" }))],
    ["Streaks", [{ name: "On a roll", why: "Keep a 3-week streak" }]]];
  return shelves.map(([title, list]) => { const n = list.filter(b => got.has(b.name)).length;
    return `<div class="shelf"><div class="shelf-h"><b>${title}</b><span>${n} of ${list.length}</span></div><div class="shelf-row">${list.map(b => { const on = got.has(b.name);
      return `<div class="trophy${on ? "" : " locked"}" title="${esc(on ? got.get(b.name) : b.why)}">${medalSVG(on)}<b>${esc(b.name)}</b><span>${esc(on ? got.get(b.name) : b.why)}</span></div>`; }).join("")}</div></div>`; }).join("");
}

// Listening Lab levels for one mission: the start level, the highest level if higher, and any strategy rescues.
const labLevels = L => `<span class="lvchip lv${L.start}">${LAB_LEVELS[L.start]}</span>${L.peak > L.start ? ` → <span class="lvchip lv${L.peak}">${LAB_LEVELS[L.peak]}</span>` : ""}${
  L.rescues ? ` <span class="note">${L.rescues} strategy rescue${L.rescues > 1 ? "s" : ""}</span>` : ""}`;
export function historyTable(history) {
  if (!history.length) return `<p class="note">No readings yet.</p>`;
  return `<div class="tbl"><table><thead><tr><th>Date</th><th>Reading</th><th>Level</th><th class="num">Score</th><th class="num">XP</th></tr></thead><tbody>${
    [...history].reverse().map(h => `<tr><td>${fmtDate(h.created_at)}</td><td>${esc(textTitle(h.text_id))}</td><td>${isLabAttempt(h) && labSummary(h.answers) ? labLevels(labSummary(h.answers)) : h.mode !== "practice" && h.mode !== "baseline" ? "–" : `<span class="lvl">${h.level_start != null && h.level_start !== textLevel(h) && h.mode === "practice" ? levelName(h.level_start) + " → " : ""}${levelName(textLevel(h))} · ${BANDS[readingBand(h)]}</span>`}</td><td class="num">${h.score}/${h.max_score}</td><td class="num">${h.xp}</td></tr>`).join("")
  }</tbody></table></div>`;
}

export function trackerHTML(history, who, opts = {}) {
  const { streak, thisWeek } = weeklyStreak(history);
  const practice = history.filter(h => h.mode === "practice").length;
  return `<div class="stats">
      <div class="stat gold"><b>${who.xp_total}</b><span>XP in total</span></div>
      <div class="stat"><b>${bandName(history, who.level)}</b><span>reading level</span></div>
      <div class="stat"><b>${streak} wk</b><span>streak (${thisWeek}/2 this week)</span></div>
      <div class="stat"><b>${practice}</b><span>texts finished</span></div></div>
    <div class="panel"><h3>Skills</h3>${skillBars(history)}</div>
    <div class="panel"><h3>Reading level over time</h3>${levelChart(history)}</div>
    <div class="panel"><h3>Road to Checkpoint</h3><p class="note">Each unit ends with a checkpoint. Pass all nine to reach the finish post.</p>${roadSVG(history, opts)}</div>
    <div class="panel"><h3>Reading traps</h3>${rTrapsHTML(history, opts)}</div>
    <div class="panel"><h3>Listening traps</h3>${trapsHTML(history, opts)}</div>
    <div class="panel"><h3>Trophy cabinet</h3>${trophyCabinet(history)}</div>
    <div class="panel"><h3>History</h3>${historyTable(history)}</div>`;
}

// The baseline gives no support, so a wrong baseline answer is saved as support "none" with first_try false.
function resultChip(r) {
  return r.support === "none" && !r.first_try ? `<span class="chip explained">Wrong</span>` : `<span class="chip ${r.support}">${SUPPORT_LABEL[r.support]}</span>`;
}
export function resultRows(slots, results) {
  return `<div class="tbl"><table><thead><tr><th>#</th><th>Skill</th><th>Text</th><th>Result</th></tr></thead><tbody>${
    results.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.skill)}</td><td>${LEVELS[r.level]}</td><td>${resultChip(r)}</td></tr>`).join("")
  }</tbody></table></div>`;
}

export function boardTable(rows, unit) {
  if (!rows.length) return `<p class="note">${unit === "gain" ? "This board fills up when students take their first Checkpoint check." : "No one here yet."}</p>`;
  return `<div class="tbl"><table><thead><tr><th>#</th><th>Name</th><th class="num">${unit === "gain" ? "% points gained" : "XP"}</th></tr></thead><tbody>${
    rows.map((r, i) => `<tr class="${r.me ? "me" : ""}"><td class="rank">${i < 3 && (r.xp || r.gain) > 0 ? `<span class="medal m${i + 1}">${i + 1}</span>` : i + 1}</td><td>${esc(r.name)}${r.me ? " (you)" : ""}</td><td class="num">${unit === "gain" ? (r.gain > 0 ? "+" : "") + r.gain : r.xp}</td></tr>`).join("")
  }</tbody></table></div>`;
}

// The reading trap tracker: Reading Lab answers per kind of question, the same way as the listening one.
export function rTrapsHTML(history, { links = true } = {}) {
  const stats = rTrapStats(history), weak = weakestRTrap(history);
  if (!stats.some(t => t.total)) return `<p class="note">No Reading Lab questions yet. ${links ? "Open the Reading Lab from the Reading tab of Unit 2 or 3." : ""}</p>`;
  return `<div class="traps">${stats.map(t => { const p = t.total ? Math.round(100 * t.rate) : null, m = rMissionForTrap(t.trap);
    return `<div class="trap${t.trap === weak ? " weak" : ""}"><span class="tname">${esc(RTRAPS[t.trap].name)}</span>
      <span class="sbar"><i style="width:${p ?? 0}%"></i></span>
      <span class="note">${t.total ? `Caught ${t.caught} of ${t.total}` : "Not met yet"}</span>
      ${links && m ? `<button class="btn small alt" data-rlab="${m.id}">${t.trap === weak ? "Practise this" : "Mission"}</button>` : ""}</div>`; }).join("")}</div>
    ${weak ? `<p class="note">${esc(RTRAPS[weak].name)} catch ${links ? "you" : "this student"} most often. ${esc(RTRAPS[weak].tip)}</p>` : ""}`;
}

// The trap tracker: how often each examiner's trick caught the student (listening answers not right first time).
export function trapsHTML(history, { links = true } = {}) {
  const stats = trapStats(history), weak = weakestTrap(history);
  if (!stats.some(t => t.total)) return `<p class="note">No listening questions with traps yet. Try the Listening Lab or a unit listening task.</p>`;
  return `<div class="traps">${stats.map(t => { const p = t.total ? Math.round(100 * t.rate) : null, m = missionForTrap(t.trap);
    return `<div class="trap${t.trap === weak ? " weak" : ""}"><span class="tname">${esc(TRAPS[t.trap].name)}</span>
      <span class="sbar"><i style="width:${p ?? 0}%"></i></span>
      <span class="note">${t.total ? `Caught ${t.caught} of ${t.total}` : "Not met yet"}</span>
      ${links && m ? `<button class="btn small alt" data-lab="${m.id}">${t.trap === weak ? "Practise this" : "Mission"}</button>` : ""}</div>`; }).join("")}</div>
    ${weak ? `<p class="note">${esc(TRAPS[weak].name)} catch ${links ? "you" : "this student"} most often. ${esc(TRAPS[weak].tip)}</p>` : ""}`;
}
