// Shared rendering helpers for the student and teacher pages.
import { LEVELS, skillStats, badges, weeklyStreak, SKILL_BADGES, SUPPORT_LABEL } from "./engine.js";
import { PRACTICE_TEXTS } from "./content.js";

export const SKILLS = ["Main idea", "Detail", "Vocabulary in context", "Detail: two points", "Inference",
                       "Cause and effect", "Writer's purpose", "Writer's view", "Vocabulary", "Grammar"];

export function esc(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}
export function levelName(l) { return l == null ? "Not placed" : LEVELS[l]; }
export function fmtDate(d) { return d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "–"; }
export function fmtTime(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + " min " + (s % 60) + " s"; }
export function textTitle(id) {
  const t = PRACTICE_TEXTS.find(x => x.id === id); if (t) return t.topic;
  if (id === "baseline") return "Baseline";
  if (id === "vocab-review") return "Word review";
  let m = /^vocab-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} vocabulary`;
  m = /^grammar-u(\d)$/.exec(id); if (m) return `Unit ${m[1]} grammar quiz`;
  m = /^grammar-(\d\.\d)$/.exec(id); if (m) return `Grammar ${m[1]}`;
  return id;
}

export function paraHTML(p, focus, here) {
  let body = esc(p[1]);
  if (focus) { const f = esc(focus), i = body.indexOf(f); if (i >= 0) body = body.slice(0, i) + "<mark>" + f + "</mark>" + body.slice(i + f.length); }
  return `<div class="para${here ? " here" : ""}"><b class="lt">${p[0]}</b><p>${body}</p></div>`;
}
export function textHTML(t, opts = {}) {
  return `<div class="text"><h2>${esc(t.title)}</h2>${t.paras.map(p => paraHTML(p, opts.para === p[0] ? opts.focus : null, opts.para === p[0])).join("")}` +
         (t.gloss ? `<div class="gloss">${esc(t.gloss)}</div>` : "") + "</div>";
}

function medalSVG(on) {
  return `<svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true"><path d="M9 2h4l2 7h-4zM15 2h4l-2 7h-4z" fill="${on ? "var(--teal)" : "var(--line)"}"/>` +
         `<circle cx="14" cy="17" r="8.5" fill="${on ? "var(--gold)" : "var(--line)"}"/><path d="M14 12.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" fill="var(--surface)"/></svg>`;
}

// Level after each attempt, drawn as a step line (0 Easier, 1 Core, 2 Harder).
export function levelChart(history) {
  const pts = history.filter(h => h.level_end != null);
  if (pts.length < 1) return `<p class="note">Your level line appears after your first reading.</p>`;
  const W = 600, H = 170, L = 64, R = 14, T = 12, B = 28, n = pts.length;
  const x = i => n === 1 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (n - 1);
  const y = l => T + (2 - l) * (H - T - B) / 2;
  let d = "";
  pts.forEach((p, i) => { d += i === 0 ? `M${x(i)},${y(p.level_end)}` : `H${x(i)}V${y(p.level_end)}`; });
  const grid = [0, 1, 2].map(l => `<line x1="${L}" x2="${W - R}" y1="${y(l)}" y2="${y(l)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L - 8}" y="${y(l) + 4}" text-anchor="end">${LEVELS[l]}</text>`).join("");
  const dots = pts.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.level_end)}" r="${i === n - 1 ? 6 : 4}" fill="${p.mode === "baseline" ? "var(--orange)" : "var(--teal)"}" stroke="var(--surface)" stroke-width="2"><title>${esc(textTitle(p.text_id))}, ${fmtDate(p.created_at)}: ${LEVELS[p.level_end]}</title></circle>`).join("");
  const first = `<text x="${x(0)}" y="${H - 8}" text-anchor="${n === 1 ? "middle" : "start"}">${fmtDate(pts[0].created_at)}</text>`;
  const last = n > 1 ? `<text x="${x(n - 1)}" y="${H - 8}" text-anchor="end">${fmtDate(pts[n - 1].created_at)}</text>` : "";
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Reading level over time">${grid}<path d="${d}" fill="none" stroke="var(--teal)" stroke-width="2.5"/>${dots}${first}${last}</svg></div>
    <div class="legend"><span><i style="background:var(--orange);border-radius:50%"></i>Baseline</span><span><i style="background:var(--teal);border-radius:50%"></i>Practice text</span></div>`;
}

export function skillBars(history) {
  const st = skillStats(history);
  return `<div class="skills">${SKILLS.map(s => {
    const k = st[s]; const pct = k && k.total ? Math.round(100 * k.right / k.total) : null;
    return `<div class="skillrow"><span>${esc(s)}</span><div class="bar" aria-hidden="true"><i class="${pct != null && pct < 50 ? "low" : ""}" style="width:${pct || 0}%"></i></div><span>${pct == null ? "–" : pct + "%"}</span></div>`;
  }).join("")}</div><p class="note">Right first time, from the last 20 questions on each skill.</p>`;
}

export function badgeShelf(history) {
  const got = badges(history), names = new Set(got.map(b => b.name));
  const all = [{ name: "First steps", why: "Finish the baseline" }, { name: "Off the mark", why: "Finish a practice text" },
               { name: "Bookworm", why: "Finish 5 practice texts" }, { name: "Top level", why: "Reach the Harder text" },
               { name: "On a roll", why: "Keep a 3-week streak" },
               ...Object.entries(SKILL_BADGES).map(([s, n]) => ({ name: n, why: "10 " + s.toLowerCase() + " questions right first time" }))];
  return `<div class="badges">${all.map(b => { const on = names.has(b.name); const why = on ? got.find(g => g.name === b.name).why : b.why;
    return `<div class="badge${on ? "" : " locked"}">${medalSVG(on)}<div><b>${esc(b.name)}</b>${esc(why)}</div></div>`; }).join("")}</div>`;
}

export function historyTable(history) {
  if (!history.length) return `<p class="note">No readings yet.</p>`;
  return `<div class="tbl"><table><thead><tr><th>Date</th><th>Reading</th><th>Level</th><th class="num">Score</th><th class="num">XP</th></tr></thead><tbody>${
    [...history].reverse().map(h => `<tr><td>${fmtDate(h.created_at)}</td><td>${esc(textTitle(h.text_id))}</td><td>${h.mode === "vocab" || h.mode === "grammar" ? "–" : `<span class="lvl">${h.level_start != null && h.level_start !== h.level_end && h.mode === "practice" ? levelName(h.level_start) + " → " : ""}${levelName(h.level_end)}</span>`}</td><td class="num">${h.score}/${h.max_score}</td><td class="num">${h.xp}</td></tr>`).join("")
  }</tbody></table></div>`;
}

export function trackerHTML(history, who) {
  const { streak, thisWeek } = weeklyStreak(history);
  const practice = history.filter(h => h.mode === "practice").length;
  return `<div class="stats">
      <div class="stat gold"><b>${who.xp_total}</b><span>XP in total</span></div>
      <div class="stat"><b>${levelName(who.level)}</b><span>reading level</span></div>
      <div class="stat"><b>${streak} wk</b><span>streak (${thisWeek}/2 this week)</span></div>
      <div class="stat"><b>${practice}</b><span>texts finished</span></div></div>
    <div class="panel"><h3>Skills</h3>${skillBars(history)}</div>
    <div class="panel"><h3>Reading level over time</h3>${levelChart(history)}</div>
    <div class="panel"><h3>Badges</h3>${badgeShelf(history)}</div>
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
  if (!rows.length) return `<p class="note">${unit === "gain" ? "This board fills up when students take the baseline a second time." : "No one here yet."}</p>`;
  return `<div class="tbl"><table><thead><tr><th>#</th><th>Name</th><th class="num">${unit === "gain" ? "Points gained" : "XP"}</th></tr></thead><tbody>${
    rows.map((r, i) => `<tr class="${r.me ? "me" : ""}"><td class="rank">${i < 3 && (r.xp || r.gain) > 0 ? `<span class="medal m${i + 1}">${i + 1}</span>` : i + 1}</td><td>${esc(r.name)}${r.me ? " (you)" : ""}</td><td class="num">${unit === "gain" ? (r.gain > 0 ? "+" : "") + r.gain : r.xp}</td></tr>`).join("")
  }</tbody></table></div>`;
}
