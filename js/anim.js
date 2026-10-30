// Sentence animator for grammar lessons (Grammar Builder bricks and Grammar Lab building blocks).
// A lesson's example plays as a short film: word tiles slide to new places, change form, appear and fade, with a caption
// for each step and, for tenses, a timeline. Plays once on its own; students can replay, step back and forward, or tap.
// Frames are written as "id=text#kind | id=text#kind". A tile keeps its id from frame to frame, so it moves (and changes
// its words) instead of jumping. kind: s doer, o receiver, v verb, by "by", time, new (just changed), bad (wrong form).
// t (timeline, 0 = long ago, 1 = later): bars [[from, to, label]], dots [[at, label]], now (where "now" is).
// Don't rename the keys: they are block ids (gengine.js GBLOCKS, glab.js BLOCKS).

const F = (w, cap, t = null) => ({ w, cap, t });
export const ANIMS = {
  v123: [F("a=go#v", "Every verb has three forms. V1 is the base form: go."),
    F("a=go#v | b=went#new", "V2 is the past simple: went."),
    F("a=go#v | b=went#v | c=gone#new", "V3 is the past participle: gone."),
    F("d=I#s | b=went#v | e=home", "V2 works on its own: I went home."),
    F("d=I#s | f=have#new | c=gone#v | e=home", "V3 needs a helper (have or be) in front: I have gone home.")],
  "ed-spell": [F("a=stop#v", "stop: one short vowel, then one consonant."), F("a=stopped#new", "Double the last letter, then add -ed."),
    F("b=try#v", "try: a consonant, then y."), F("b=tried#new", "y changes to i, then add -ed."),
    F("c=play#v", "play: a vowel, then y."), F("c=played#new", "Just add -ed.")],
  v2: [F("s=We#s | v=go#v | t=to the beach", "Now: We go to the beach."),
    F("s=We#s | v=went#new | t=to the beach | y=yesterday#time", "The past: go changes to went. No -ed!"),
    F("s=She#s | v=buys#v | o=a phone", "She buys a phone."),
    F("s=She#s | v=bought#new | o=a phone | y=last week#time", "buy → bought. Irregular verbs have their own V2.")],
  pp: [F("s=Someone#s | v=took#v | o=it", "took is V2, the past simple."),
    F("s=Someone#s | m=might#new | h=have#new | v=took#bad | o=it", "After have, V2 doesn't work…"),
    F("s=Someone#s | m=might | h=have | v=taken#new | o=it", "…so use V3: might have taken."),
    F("o2=The window#o | w=was#v | bg=being#v | v2=cleaned#new", "After being, use V3 too: was being cleaned.")],
  "sing-plural": [F("a=statue#o", "One statue."), F("a=statues#new", "More than one: add -s."),
    F("b=The statue#o | c=is#v | d=old", "One thing → is / was."), F("b=The statues#new | c=are#new | d=old", "More than one → are / were.")],
  "was-were": [F("a=The camera#s | b=was#v | c=broken", "One thing → was."), F("a=The cameras#new | b=were#new | c=broken", "More than one → were."),
    F("d=I#s | b=was#v | c=late", "I, he, she, it → was."), F("d=They#new | b=were#new | c=late", "you, we, they → were.")],
  "past-simple": [F("s=I#s | v=visited#v | o=the museum", "Positive: V2. I visited the museum."),
    F("s=I#s | n=didn't#new | v=visit#new | o=the museum", "Negative: didn't + V1. visited goes back to visit."),
    F("q=Did#new | s=you#s | v=visit#v | o=the museum | qm=?", "Question: Did jumps to the front, then V1.")],
  "past-cont": [F("s=I#s | v=read#v | o=a book", "I read a book: it's finished.", { bars: [[0.15, 0.4, "read"]], now: 0.95 }),
    F("s=I#s | w=was#new | v=reading#new | o=a book", "I was reading: in progress at 9:30. It started before and finished after.", { bars: [[0.12, 0.82, "reading"]], dots: [[0.5, "9:30"]], now: 0.95 }),
    F("s=They#new | w=were#new | v=reading#v | o=a book", "More than one person → were + -ing.", { bars: [[0.12, 0.82, "reading"]], dots: [[0.5, "9:30"]], now: 0.95 })],
  "ps-pc": [F("s=I#s | w=was#v | v=walking#v | h=home", "The long action, in progress: was walking.", { bars: [[0.1, 0.85, "walking"]], now: 0.95 }),
    F("s=I#s | w=was#v | v=walking#v | h=home | wh=when#new | it=it | st=started#new | r=to rain", "A short action interrupts it: started (past simple).", { bars: [[0.1, 0.85, "walking"]], dots: [[0.5, "rain!"]], now: 0.95 })],
  doer: [F("s=The thief#s | v=stole#v | o=the painting#o", "Who did it? The thief. That's the doer."),
    F("o=The painting#o | w=was#new | v=stolen#new | by=by#by | s=the thief#s", "In the passive, the doer moves to the end, after by."),
    F("o=The painting#o | w=was | v=stolen#v", "Often we don't say the doer at all.")],
  "active-passive": [F("s=The cleaners#s | v=cleaned#v | o=the hall#o", "Active: the cleaners DO the action."),
    F("o=The hall#o | w=was#new | v=cleaned#v | by=by#by | s=the cleaners#s", "Passive: the hall moves to the front. It RECEIVES the action. Add was."),
    F("o=The hall#o | w=was | v=cleaned#v", "Who cleaned it isn't important, so the doer goes."),
    F("o=The hall#o | w=was | bg=being#new | v=cleaned#v", "Still in progress? Add being.")],
  "pres-passive": [F("s=People#s | v=speak#v | o=English#o | p=here", "Active: people speak English here."),
    F("o=English#o | w=is#new | v=spoken#new | p=here", "Present passive: is / are + V3."),
    F("o=Phones#o | w=are#new | v=made#new | p=in Korea", "More than one → are.")],
  "past-passive": [F("s=Someone#s | v=built#v | o=the bridge#o | y=in 1998#time", "Active, in the past."),
    F("o=The bridge#o | w=was#new | v=built#v | y=in 1998#time", "Past passive: was / were + V3."),
    F("o=The bridges#new | w=were#new | v=built#v | y=in 1998#time", "More than one → were.")],
  "modal-passive": [F("s=You#s | m=can#v | v=recycle#v | o=plastic#o", "Active: modal + V1."),
    F("o=Plastic#o | m=can#v | b=be#new | v=recycled#new", "Passive: modal + be + V3."),
    F("o=Phones#o | m=must#new | b=be#v | v=switched#new | off=off", "must be, should be, can be: always be + V3.")],
  "by-agent": [F("o=The book#o | w=was | v=written#v", "Who wrote it? We don't know yet."),
    F("o=The book#o | w=was | v=written#v | by=by#by | a=a famous author#s", "Add by + the doer when it's important."),
    F("o=The bread#o | w=was | v=cut#v | wi=with#new | k=a knife", "A knife is a tool, not a doer: use with.")],
  "passive-negq": [F("o=The painting#o | w=was#v | v=stolen#v", "Positive."),
    F("o=The painting#o | w=wasn't#new | v=stolen#v", "Negative: add not to the be verb. No did!"),
    F("w=Was#new | o=the painting#o | v=stolen#v | qm=?", "Question: the be verb jumps to the front.")],
  progress: [F("o=The hall#o | w=was | v=cleaned#v", "was cleaned: finished.", { bars: [[0.2, 0.45, "cleaned"]], now: 0.95 }),
    F("o=The hall#o | w=was | bg=being#new | v=cleaned#v", "was being cleaned: still happening at that moment.", { bars: [[0.2, 0.85, "cleaning"]], dots: [[0.55, "then"]], now: 0.95 })],
  "pres-cont-passive": [F("s=They#s | ar=are#v | v=building#v | o=a new school#o", "Active: it's happening now.", { bars: [[0.6, 1, "building"]], now: 0.8 }),
    F("o=A new school#o | ar=is#new | bg=being#new | v=built#new", "Passive, happening now: is / are + being + V3.", { bars: [[0.6, 1, "building"]], now: 0.8 })],
  "past-perfect": [F("s=The film#s | st=started#v", "First, the film started.", { dots: [[0.35, "film"]], now: 0.95 }),
    F("wn=When#new | we=we | ar=arrived#v | cm=, | s=the film#s | h=had#new | st=started#new", "Then we arrived. The earlier action: had + V3.", { dots: [[0.35, "film"], [0.7, "we arrive"]], now: 0.95 })],
  "future-passive": [F("s=They#s | wi=will#v | v=announce#v | o=the winners#o", "Active, in the future."),
    F("o=The winners#o | wi=will#v | b=be#new | v=announced#new", "Future passive: will be + V3.", { dots: [[0.8, "Friday"]], now: 0.4 })],
  "past-cont-passive": [F("s=Workers#s | w=were#v | v=painting#v | o=the gallery#o", "Active: in progress in the past.", { bars: [[0.1, 0.8, "painting"]], dots: [[0.45, "we arrived"]], now: 0.95 }),
    F("o=The gallery#o | w=was#new | bg=being#new | v=painted#new", "Passive, in progress: was / were + being + V3.", { bars: [[0.1, 0.8, "painting"]], dots: [[0.45, "we arrived"]], now: 0.95 })],
  "pres-perf-passive": [F("s=Someone#s | h=has#v | v=cleaned#v | o=the windows#o", "Active: has / have + V3."),
    F("o=The windows#o | h=have#new | bn=been#new | v=cleaned#v", "Passive: have / has + been + V3. The result matters now: they're shining!", { dots: [[0.5, "cleaned"]], now: 0.85 })],
  "past-perf-passive": [F("o=The painting#o | w=was#v | v=stolen#v", "First, the painting was stolen.", { dots: [[0.3, "stolen"]], now: 0.95 }),
    F("wn=When#new | po=the police | ar=arrived#v | cm=, | o=the painting#o | w=had#new | bn=been#new | v=stolen#v", "Before another past moment: had been + V3.", { dots: [[0.3, "stolen"], [0.65, "police"]], now: 0.95 })],
  causative: [F("s=I#s | c=cut#v | o=my hair#o", "I did it myself."),
    F("s=I#s | h=had#new | o=my hair#o | c=cut#v", "Someone else did it for me: have + the thing + V3."),
    F("s=I#s | h=got#new | o=my hair#o | c=cut#v", "get works the same way.")],
  "passive-inf": [F("s=Teachers#s | al=allow#v | st=students#o | to=to | u=use | p=phones", "Active."),
    F("st=Students#o | ar=are#new | al=allowed#new | to=to | u=use | p=phones", "Passive: be allowed + to + V1."),
    F("st=Students#o | ar=aren't#new | al=allowed | to=to | u=use | p=phones", "Negative: aren't allowed to.")],
  "choose-tense": [F("o=The hall#o | w=is#new | bg=being#new | v=cleaned#v", "Now, in progress: is being cleaned.", { bars: [[0.55, 0.95, ""]], now: 0.75 }),
    F("o=The hall#o | w=was#new | bg=being | v=cleaned#v", "In the past, in progress: was being cleaned.", { bars: [[0.1, 0.45, ""]], dots: [[0.3, "then"]], now: 0.75 }),
    F("o=The hall#o | w=has#new | bg=been#new | v=cleaned#v", "Finished, and the result is now: has been cleaned.", { dots: [[0.6, ""]], now: 0.75 }),
    F("o=The hall#o | w=will#new | bg=be#new | v=cleaned#v", "In the future: will be cleaned.", { dots: [[0.92, ""]], now: 0.75 })],
  // Grammar Lab blocks (2.4)
  "modal-have": [F("s=She#s | l=left#v | e=early", "A fact: she left early."),
    F("s=She#s | m=must#new | h=have#new | l=left#v | e=early", "A guess about the past: must + have + V3."),
    F("s=She#s | m=might#new | h=have | l=left#v | e=early", "Less sure: might have."),
    F("s=She#s | m=can't#new | h=have | l=left#v | e=early", "Sure it's NOT true: can't have.")],
  certainty: [F("c=Her coat is wet.#o", "The clue: her coat is wet."),
    F("it=It#s | m=must#new | b=be | r=raining", "A strong clue → sure: must."),
    F("it=It#s | m=might#new | b=be | r=raining", "No clear clue → maybe: might."),
    F("it=It#s | m=can't#new | b=be | r=raining", "The clue makes it impossible → can't.")],
  clues: [F("c=I can hear music.#o", "You can hear it: a strong clue."),
    F("h=He#s | m=must#new | b=be | ho=home", "Strong clue → sure: must."),
    F("c2=I don't know.#o", "No clue at all…"), F("h=He#s | m=might#new | b=be | ho=home", "…so just maybe: might.")]
};

const parse = w => w.split("|").map(x => x.trim()).filter(Boolean).map(x => {
  const [, id, text, kind] = /^([^=]+)=(.*?)(?:#(\w+))?$/.exec(x); return { id, text, kind: kind || "" }; });
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasAnim = id => !!ANIMS[id];
// The empty frame for a lesson page; mount() fills and plays it after the page is drawn.
export const animHTML = id => ANIMS[id] ? `<div class="gban" id="gban" data-anim="${esc(id)}">
  <div class="anst" role="img" aria-label="Animated example"></div><div class="antl"></div><p class="ancap" aria-live="polite"></p>
  <div class="anctl"><button type="button" class="anb" data-an="prev" aria-label="Back">‹</button><span class="andots"></span>
  <button type="button" class="anb" data-an="next" aria-label="Next">›</button><button type="button" class="btn small alt" data-an="play">↻ Replay</button></div>
  ${ANIMS[id].some(f => /#o\b/.test(f.w)) && ANIMS[id].some(f => /#s\b/.test(f.w)) ? `<p class="ankey"><span class="at at-s">doer</span> does the action · <span class="at at-o">receiver</span> receives it</p>` : ""}</div>` : "";

function timeline(t) {
  if (!t) return "";
  const X = x => 14 + x * 292;
  return `<svg viewBox="0 0 320 54" class="antlsvg" aria-hidden="true"><path class="an-axis" d="M8 30H312"/><path class="an-arrow" d="M306 25l7 5-7 5"/>
    ${t.now != null ? `<path class="an-now" d="M${X(t.now)} 14V44"/><text class="an-lbl" x="${X(t.now)}" y="53" text-anchor="middle">now</text>` : ""}
    ${(t.bars || []).map(([a, b, l]) => `<rect class="an-bar" x="${X(a)}" y="24" width="${X(b) - X(a)}" height="12" rx="6"/>${l ? `<text class="an-lbl" x="${(X(a) + X(b)) / 2}" y="18" text-anchor="middle">${esc(l)}</text>` : ""}`).join("")}
    ${(t.dots || []).map(([a, l]) => `<circle class="an-dot" cx="${X(a)}" cy="30" r="6"/>${l ? `<text class="an-lbl" x="${X(a)}" y="${(t.bars || []).length ? 52 : 18}" text-anchor="middle">${esc(l)}</text>` : ""}`).join("")}</svg>`;
}

let timer = null;
export function mount(root = typeof document !== "undefined" && document.getElementById("gban")) {
  clearTimeout(timer);
  if (!root || !ANIMS[root.dataset.anim]) return;
  const frames = ANIMS[root.dataset.anim].map(f => ({ ...f, w: parse(f.w) })), stage = root.querySelector(".anst");
  let k = -1;
  const show = n => {
    k = Math.max(0, Math.min(frames.length - 1, n));
    const f = frames[k], sr = stage.getBoundingClientRect(), old = new Map([...stage.querySelectorAll(".at:not(.at-out)")].map(e => [e.dataset.id, e]));
    const first = new Map([...old].map(([id, e]) => [id, e.getBoundingClientRect()]));
    const keep = f.w.map(t => {
      let e = old.get(t.id); const fresh = !e;
      if (fresh) { e = document.createElement("span"); e.dataset.id = t.id; }
      const changed = !fresh && e.textContent !== t.text, base = `at${t.kind ? ` at-${t.kind}` : ""}`;
      e.textContent = t.text; e.className = base; old.delete(t.id);
      if (fresh || changed) { void e.offsetWidth; e.className = `${base} ${fresh ? "at-in" : "at-morph"}`; }
      return e;
    });
    // Tiles that leave fade out where they were.
    old.forEach((e, id) => { const r = first.get(id); e.className += " at-out"; Object.assign(e.style, { position: "absolute", left: `${r.left - sr.left}px`, top: `${r.top - sr.top}px` }); setTimeout(() => e.remove(), 500); });
    keep.forEach(e => stage.appendChild(e));
    // Tiles that stay slide from their old place to the new one.
    if (!reduced()) keep.forEach(e => { const r0 = first.get(e.dataset.id); if (!r0) return; const r1 = e.getBoundingClientRect(), dx = r0.left - r1.left, dy = r0.top - r1.top;
      if (!dx && !dy) return; e.style.transition = "none"; e.style.transform = `translate(${dx}px,${dy}px)`;
      requestAnimationFrame(() => requestAnimationFrame(() => { e.style.transition = ""; e.style.transform = ""; })); });
    root.querySelector(".antl").innerHTML = timeline(f.t);
    const cap = root.querySelector(".ancap"); cap.textContent = f.cap; cap.classList.remove("an-fade"); void cap.offsetWidth; cap.classList.add("an-fade");
    root.querySelector(".andots").innerHTML = frames.map((_, j) => `<button type="button" class="andot${j === k ? " on" : ""}" data-an="${j}" aria-label="Step ${j + 1}"></button>`).join("");
    root.querySelectorAll("[data-an]").forEach(b => b.onclick = ev => { ev.stopPropagation(); clearTimeout(timer); const a = b.dataset.an;
      if (a === "play") { stage.innerHTML = ""; play(0); } else show(a === "prev" ? k - 1 : a === "next" ? k + 1 : +a); });
  };
  const play = n => { show(n); if (k < frames.length - 1 && root.isConnected) timer = setTimeout(() => play(k + 1), 900 + frames[k].cap.length * 45); };
  stage.onclick = () => { clearTimeout(timer); show(k + 1); };
  reduced() ? show(0) : play(0);
}

// "Your turn": the last frame's sentence, as tiles to tap into order. Tiles that changed form along the way (gone → went)
// come back as extra wrong tiles. Punctuation isn't a tile. Practice only: nothing is saved.
const PUNCT = /^[,.?!]$/;
// Bricks whose old forms would also make a correct sentence (had / got my hair cut, The bridge was built): no extra tiles.
const NO_EXTRA = ["causative", "modal-have", "certainty", "clues", "sing-plural", "past-passive", "passive-inf", "past-simple"];
export function buildTask(id) {
  const A = ANIMS[id]; if (!A) return null;
  const frames = A.map(f => parse(f.w)), goal = frames[frames.length - 1].filter(t => !PUNCT.test(t.text));
  if (goal.length < 3) return null;
  const extra = [];
  goal.forEach(t => frames.slice(0, -1).forEach(f => f.filter(u => u.id === t.id && u.text.toLowerCase() !== t.text.toLowerCase()
    && !goal.some(g => g.text.toLowerCase() === u.text.toLowerCase()) && !extra.includes(u.text)).forEach(u => extra.push(u.text))));
  return { goal: goal.map(t => t.text), extra: NO_EXTRA.includes(id) ? [] : extra.slice(-2), cap: A[A.length - 1].cap };
}
export const buildCheck = (goal, picked) => goal.length === picked.length && goal.every((g, i) => g.toLowerCase() === picked[i].toLowerCase());

export function buildHTML(id) {
  return buildTask(id) ? `<div class="gbuildit" id="gbuildit" data-anim="${esc(id)}"><p class="eyebrow">🧩 Your turn</p>
    <p class="note" style="margin:0 0 8px">Tap the tiles to build the last sentence. Hint: ${esc(buildTask(id).cap)}</p>
    <div class="bline" aria-label="Your sentence"></div><div class="bpool"></div><p class="bmsg" aria-live="polite"></p>
    <div class="row"><button type="button" class="btn small" data-bi="check">Check</button><button type="button" class="btn small alt" data-bi="clear">Start again</button></div></div>` : "";
}
export function mountBuild(root = typeof document !== "undefined" && document.getElementById("gbuildit"), onDone = () => {}) {
  const T = root && buildTask(root.dataset.anim); if (!T) return;
  const tiles = [...T.goal, ...T.extra].map((t, i) => ({ t, i, r: Math.random() })).sort((a, b) => a.r - b.r);
  let picked = [], done = false;
  const line = root.querySelector(".bline"), pool = root.querySelector(".bpool"), msg = root.querySelector(".bmsg");
  const draw = () => {
    line.innerHTML = picked.length ? picked.map(i => `<button type="button" class="at bt" data-bo="${i}">${esc(tiles.find(x => x.i === i).t)}</button>`).join("") : `<span class="note">Your sentence goes here.</span>`;
    pool.innerHTML = tiles.filter(x => !picked.includes(x.i)).map(x => `<button type="button" class="at bt" data-bp="${x.i}" ${done ? "disabled" : ""}>${esc(x.t)}</button>`).join("");
    line.querySelectorAll("[data-bo]").forEach(b => b.onclick = () => { if (done) return; picked = picked.filter(i => i !== +b.dataset.bo); msg.textContent = ""; draw(); });
    pool.querySelectorAll("[data-bp]").forEach(b => b.onclick = () => { picked.push(+b.dataset.bp); msg.textContent = ""; draw(); });
  };
  root.querySelector('[data-bi="clear"]').onclick = () => { if (done) return; picked = []; msg.textContent = ""; draw(); };
  root.querySelector('[data-bi="check"]').onclick = () => {
    if (done) return;
    const words = picked.map(i => tiles.find(x => x.i === i).t);
    if (buildCheck(T.goal, words)) { done = true; msg.innerHTML = "<b>✅ Built it!</b>"; root.classList.add("bok"); draw(); onDone(true); return; }
    const bad = words.findIndex((w, j) => !T.goal[j] || w.toLowerCase() !== T.goal[j].toLowerCase());
    msg.textContent = bad < 0 ? "Nearly! Something's missing." : `Not quite. Look at tile ${bad + 1}. Watch the animation again if you need to.`;
    line.classList.remove("bshake"); void line.offsetWidth; line.classList.add("bshake"); onDone(false);
  };
  draw();
}
