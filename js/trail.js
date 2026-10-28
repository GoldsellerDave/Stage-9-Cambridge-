// The "Road to Checkpoint": the badge trail on the Me page, from the baseline to the finish post.
// Stops, in order: start (baseline), then for each unit its mission and its checkpoint gate,
// the two half-term Checkpoint checks as flags, and the finish post after the last gate.
// The trail only shows progress: it never locks a unit, because the class follows the school calendar.
import { mission, MISSION_BADGES, BOSS_PASS } from "./practice.js";
import { UNITS } from "./curriculum.js";
import { CHECKS } from "./checks.js";
import { MINI, MINI_PASS } from "./minitests.js";

export const TRAIL_UNITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// Where the half-term checks stand on the road: after these units' gates.
export const CHECK_AFTER = { "check-1": 4, "check-2": 7 };
export const FINISH_BADGE = "Checkpoint ready";

// A unit's checkpoint gate: its mini test (js/minitests.js), or its final challenge (boss-u#) until one is written.
export function gateFor(unit) {
  return MINI[unit] ? { id: MINI[unit].id, pass: MINI_PASS, mini: true } : { id: `boss-u${unit}`, pass: BOSS_PASS, mini: false };
}
export function gateBest(unit, history) {
  const g = gateFor(unit), tries = history.filter(h => h.text_id === g.id && h.max_score > 0);
  return tries.length ? Math.max(...tries.map(h => h.score / h.max_score)) : null;
}

export function trailStops(history) {
  const stops = [{ kind: "start", done: history.some(h => h.mode === "baseline" && h.text_id === "baseline"),
                   title: "Start", sub: null }];
  stops[0].sub = stops[0].done ? "Baseline done: First steps badge" : "Take the baseline to set off";
  let gates = 0;
  TRAIL_UNITS.forEach(u => {
    const m = mission(u, history), steps = m.steps.filter(s => s.key !== "boss"), done = steps.filter(s => s.done).length;
    stops.push({ kind: "unit", unit: u, title: UNITS[u].title, done: done === steps.length,
                 progress: steps.length ? done / steps.length : 0, sub: `Unit ${u} mission: ${done} of ${steps.length} steps` });
    const g = gateFor(u), best = gateBest(u, history), passed = best != null && best >= g.pass;
    if (passed) gates++;
    stops.push({ kind: "gate", unit: u, title: `Unit ${u} checkpoint`, done: passed, mini: g.mini,
                 sub: passed ? `Passed with ${Math.round(best * 100)}%${g.mini ? "" : `: ${MISSION_BADGES[u]} badge`}`
                      : best != null ? `Best ${Math.round(best * 100)}%. Pass with ${g.pass * 100}%`
                      : `${g.mini ? "Mini test" : "Final challenge"}: ${g.pass * 100}% to pass` });
    CHECKS.filter(c => CHECK_AFTER[c.id] === u).forEach(c => {
      const a = history.filter(h => h.text_id === c.id).pop();
      stops.push({ kind: "check", id: c.id, title: `Half-term ${c.title.replace("Checkpoint check", "check")}`, done: !!a,
                   sub: a ? `Done: ${Math.round(100 * a.score / a.max_score)}%` : "Opens six weeks after your last check" });
    });
  });
  stops.push({ kind: "finish", title: FINISH_BADGE + "!", done: gates === TRAIL_UNITS.length,
               sub: `${gates} of ${TRAIL_UNITS.length} unit checkpoints passed` });
  return stops;
}

// Where the student stands: just after the furthest stop they have reached.
export function trailHere(stops) {
  let last = -1; stops.forEach((s, i) => { if (s.done) last = i; });
  return Math.min(last + 1, stops.length - 1);
}
