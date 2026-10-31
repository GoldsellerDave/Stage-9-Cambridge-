// Which stage's content this device shows: 9 (Grade 8) or 8 (Grade 7). A class's stage is set by its teacher.
// Content modules choose their data when they load, so the stage is kept on the device: sign-in saves the
// class's stage here and reloads the page when it differs. The teacher page and tests use Stage 9 unless told.
const KEY = "ckpt-stage";
export const STAGES = [8, 9];
const read = () => { try { const v = +localStorage.getItem(KEY); return STAGES.includes(v) ? v : 9; } catch (e) { return 9; } };
export const STAGE = read();
// Save a class's stage. True when the page must reload to show that stage's content.
export function useStage(stage) {
  const s = STAGES.includes(+stage) ? +stage : 9;
  if (s === STAGE) return false;
  try { localStorage.setItem(KEY, String(s)); } catch (e) { return false; }
  return read() === s;
}
// Pick a stage's version of some data: byStage({ 9: x, 8: y }).
export const byStage = (m, stage = STAGE) => (stage in m ? m[stage] : m[9]);
