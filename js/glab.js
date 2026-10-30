// Grammar Lab: grammar missions that start with meaning, not drills. Each mission has four steps:
//   1. Spot it: a short scene with the grammar lit up. Sort example sentences, then choose the rule that explains them.
//   2. Get it: 4 meaning checks (a certainty meter, a timeline, "did it happen?" questions).
//   3. Use it: the mission's game (solve the case, finish the news report), then one sentence the student writes,
//      checked by the AI marker with keywords as the backup.
//   4. Prove it: 6 Checkpoint-style questions on the lab.js engine (Core, Stretch, Challenge; 2 right first time in a row
//      moves up, 2 missed in a row brings a rescue, then a level down).
// Options: option 0 is right (shuffled on screen); a wrong option's "why" says why without giving the answer.
// A "type" question is a one-word gap: `accept` lists the right words (lower case).
// Saved as mode "vocab" (no schema change), text_id = mission id. Prove it answers are { skill: "Grammar", point, glab: item id,
// level }, so they count in the Grammar area, grammar mastery and the teacher's skills; the other steps save as
// { skill: "Grammar Lab", step } and give XP but don't count in the area score. Don't rename mission or item ids.

export const GLAB_LEN = 6;
export const XP_GLAB = { step: 3, write: 10, first: [10, 15, 20], hint: 4, finish: 10 };

export const GLAB = [
{ id: "glab-2.4", point: "2.4", unit: 2, n: 1, title: "The Case of the Missing Phone", short: "must have, might have, can't have",
  blurb: "Minh's phone has vanished after a class trip. Use the clues to work out what happened.",
  rule: "Use modal + have + past participle to guess about the past from clues. must have = I'm sure it happened. might have / could have = maybe it happened. can't have = I'm sure it didn't happen.",
  scene: { title: "Case file: the missing phone", paras: [
    "Minh's new phone has disappeared after the class trip to the science museum. Detective Hoa is asking questions.",
    "\"The phone [[must have fallen]] out of his bag,\" says Lan. \"Look, his bag is open.\"",
    "\"Or someone [[might have taken]] it,\" says Bao.",
    "\"Minh [[can't have left]] it at the museum,\" says the teacher. \"He took a photo of us on the bus.\""] },
  spot: { bins: ["Sure it happened", "Maybe it happened", "Sure it didn't happen"], sentences: [
    { t: "The phone must have fallen out of his bag.", bin: 0 },
    { t: "Someone might have taken it.", bin: 1 },
    { t: "He can't have left it at the museum.", bin: 2 },
    { t: "It could have slipped under a seat.", bin: 1 },
    { t: "Minh must have been very worried.", bin: 0 },
    { t: "Mai can't have seen it. She was asleep.", bin: 2 }],
    rules: [
      { t: "must have = I'm sure it happened. might / could have = maybe. can't have = I'm sure it didn't. Then a past participle." },
      { t: "must have = it was necessary for someone to do it in the past. can't have = it wasn't allowed in the past, like a rule.", why: "Look at \"Minh must have been very worried.\" Nobody made him worry. The speaker is guessing from the clues." },
      { t: "These sentences are about the future: they say what is going to happen to Minh's phone after the trip.", why: "Look at the verbs: fallen, taken, left. They are past participles, so these are guesses about the past." }] },
  get: [
    { id: "g24-1", visual: { kind: "meter", at: 100, who: "Detective Hoa" }, stem: "Detective Hoa is 100% sure. Which sentence does she say?",
      opts: [{ t: "The thief must have known the bus." }, { t: "The thief might have known the bus.", why: "might have means maybe. She is 100% sure." },
        { t: "The thief can't have known the bus.", why: "can't have means she's sure it did NOT happen." }] },
    { id: "g24-2", visual: { kind: "meter", at: 50, who: "Lan" }, stem: "Lan isn't sure. Which sentence does she say?",
      opts: [{ t: "It might have dropped on the floor." }, { t: "It must have dropped on the floor.", why: "must have means she's sure. Lan isn't." },
        { t: "It can't have dropped on the floor.", why: "can't have means she's sure it didn't happen." }] },
    { id: "g24-3", visual: { kind: "quote", t: "Bao can't have taken it. He was with me all day." }, stem: "Did Bao take the phone?",
      opts: [{ t: "No. The speaker is sure he didn't." }, { t: "Yes. The speaker is completely sure he did.", why: "can't have works the other way: sure it did NOT happen." },
        { t: "Maybe. The speaker doesn't know.", why: "That would be might have. \"He was with me all day\" makes the speaker sure." }] },
    { id: "g24-4", stem: "Which sentence is a guess about the past?",
      opts: [{ t: "She must have forgotten her bag." }, { t: "She must forget her bag every day.", why: "must + verb is about now or a rule. A guess about the past needs must have + past participle." },
        { t: "She must be forget her bag.", why: "This isn't a correct form. Use must have + past participle: must have forgotten." }] }],
  use: { h: "Solve the case", intro: "Read the clues. Then finish Detective Hoa's notes.", clues: [
      "📸 2:30 p.m. Minh took a class photo on the bus with his phone.",
      "🚌 The driver: \"Everyone got off the bus at 3:00. Nobody stayed behind.\"",
      "📱 Duc has the same phone as Minh, in the same blue case.",
      "😴 Mai sat behind Minh, but she slept for the whole journey.",
      "🎒 At 3:10, Duc found two blue phones in his bag. He gave one back straight away."],
    items: [
      { id: "u24-1", stem: "Minh ___ the phone at the museum. He used it on the bus at 2:30.",
        opts: [{ t: "can't have left" }, { t: "must have left", why: "Look at the photo clue. He had the phone on the bus." }, { t: "might have left", why: "The photo clue leaves no doubt. Is the detective sure?" }] },
      { id: "u24-2", stem: "Mai ___ who took it. She was asleep.",
        opts: [{ t: "can't have seen" }, { t: "must have seen", why: "She slept the whole time. Could she see anything?" }, { t: "couldn't had seen", why: "After couldn't, use have, not had." }] },
      { id: "u24-3", stem: "The phones look the same, so Duc ___ Minh's phone by mistake.",
        opts: [{ t: "must have picked up" }, { t: "can't have picked up", why: "Duc found two phones in his bag. The clues say it did happen." }, { t: "must have pick up", why: "After have, use the past participle: picked." }] },
      { id: "u24-4", stem: "Duc ___ the phone on purpose. He gave it back straight away.",
        opts: [{ t: "can't have taken" }, { t: "must have taken", why: "Would he give it back at once if he took it on purpose?" }, { t: "couldn't have took", why: "took is the past simple. After have, use taken." }] }],
    write: { stem: "Case closed! Write one sentence for the detective's report: what happened to Minh's phone? Use must have.",
      model: "Duc must have picked up Minh's phone by mistake, because they have the same phone.",
      need: 2, groups: [
        { label: "says who has the phone (Duc)", k: ["duc"], ask: "Who has the phone now?" },
        { label: "uses must have + past participle", k: ["must have taken", "must have picked", "must have put", "must have mixed", "must have got", "must have grabbed", "must have accidentally",
          "must have mistaken", "must have confused", "must have thought", "must have packed", "must have carried", "must have brought", "must have swapped", "must've"],
          ask: "Use must have + a past participle, for example must have picked up." }] } },
  prove: [
    { level: 0, id: "p24-c1", stem: "Linh got 100% in the test. She ___ really hard.", opts: [{ t: "must have studied" }, { t: "can't have studied", why: "100% is a clue that she did study." }, { t: "must studied", why: "You need have: must have + past participle." }] },
    { level: 0, id: "p24-c2", stem: "I'm not sure where Nam is. He ___ home early.", opts: [{ t: "might have gone" }, { t: "must have gone", why: "The speaker says \"I'm not sure\"." }, { t: "might have went", why: "went is the past simple. After have, use gone." }] },
    { level: 0, id: "p24-c3", stem: "You ___ the whole book in an hour. It has 400 pages!", opts: [{ t: "can't have read" }, { t: "must have read", why: "400 pages in an hour? The speaker thinks it's impossible." }, { t: "can't have readed", why: "read is irregular: read, read, read." }] },
    { level: 0, id: "p24-c4", type: "type", stem: "The door is open. Someone must ___ left it open.", accept: ["have"], hint: "must + ___ + past participle." },
    { level: 0, id: "p24-c5", stem: "Which sentence is correct?", opts: [{ t: "They might have missed the bus." }, { t: "They might have miss the bus.", why: "After have, use the past participle: missed." }, { t: "They might have been miss the bus.", why: "This isn't a correct form. After might have, use the past participle: missed." }] },
    { level: 1, id: "p24-s1", type: "type", stem: "Tom isn't answering. His phone is in his bag in another room, so he ___ have heard it.", accept: ["can't", "cannot", "couldn't", "cant", "couldnt"], hint: "The speaker is sure he did NOT hear it. Which modal means that?" },
    { level: 1, id: "p24-s2", stem: "The museum was closed when we arrived. We ___ the wrong opening times.", opts: [{ t: "must have read" }, { t: "can't have read", why: "Arriving at a closed museum is a clue that you did read the wrong times." }, { t: "might read", why: "might read is about now or the future, not a guess about the past." }] },
    { level: 1, id: "p24-s3", stem: "Which sentence means \"Maybe she forgot\"?", opts: [{ t: "She may have forgotten." }, { t: "She must have forgotten.", why: "must have means the speaker is sure." }, { t: "She can't have forgotten.", why: "can't have means the speaker is sure she didn't." }] },
    { level: 1, id: "p24-s4", type: "type", stem: "I can't find my wallet. I ___ have dropped it in the taxi, but I'm not sure.", accept: ["might", "may", "could"], hint: "The speaker is not sure. Which modal means maybe?" },
    { level: 2, id: "p24-x1", stem: "Phong ___ the email. He replied to it an hour ago.", opts: [{ t: "must have received" }, { t: "might not have received", why: "He replied, so it's certain he got it." }, { t: "can't have received", why: "The reply proves the opposite." }] },
    { level: 2, id: "p24-x2", stem: "The lights are off and it's quiet. They ___ to bed already.", opts: [{ t: "must have gone" }, { t: "must have been gone", why: "That's a passive form. Nobody sent them: they went themselves." }, { t: "can't have gone", why: "The lights being off is a clue that they did." }] },
    { level: 2, id: "p24-x3", type: "type", stem: "You ___ have seen me at the market yesterday. I was in Da Nang all day!", accept: ["can't", "cannot", "couldn't", "cant", "couldnt"], hint: "The speaker was in another city. Is it possible?" },
    { level: 2, id: "p24-x4", stem: "The thief knew the code to the safe, so it ___ someone who works here.", opts: [{ t: "must have been" }, { t: "can't have been", why: "Knowing the code is a clue that it was someone inside." }, { t: "must be have", why: "This isn't a correct form. Use must have + past participle." }] }] },

{ id: "glab-3.3", point: "3.3", unit: 3, n: 2, title: "Breaking News: Museum Night", short: "past continuous passive",
  blurb: "The lights went out at the museum, and a painting vanished. Help the reporter write the story.",
  rule: "was / were + being + past participle: something was happening to a person or thing at a moment in the past, and it wasn't finished. Use it when the action matters more than who did it (The cameras were being repaired, so they weren't recording).",
  scene: { title: "Breaking news: the City History Museum", paras: [
    "Last night at 9:30, the lights went out at the City History Museum. When they came back on, a famous painting had gone. Reporter Thao is writing the story.",
    "At 9:30, the main hall [[was being cleaned]].",
    "Two old statues [[were being moved]] to a new room.",
    "The security cameras [[were being repaired]], so they weren't recording."] },
  spot: { bins: ["Still happening at that moment", "Finished"], sentences: [
    { t: "The main hall was being cleaned.", bin: 0 },
    { t: "The main hall was cleaned.", bin: 1 },
    { t: "The statues were being moved.", bin: 0 },
    { t: "The statues were moved.", bin: 1 },
    { t: "The cameras were being repaired at 9:30.", bin: 0 },
    { t: "The cameras were repaired on Monday.", bin: 1 }],
    rules: [
      { t: "was / were + being + past participle = it was happening to something at that moment. Not finished. Who did it isn't important." },
      { t: "was / were + being + past participle = the action was already finished before that moment, so it happened earlier than 9:30.", why: "Compare \"was cleaned\" and \"was being cleaned\". Which one was still going on when the lights went out?" },
      { t: "was / were + being + past participle = the thing did the action itself, for example the hall cleaned itself.", why: "Did the hall clean itself? Someone cleaned it. The hall received the action." }] },
  get: [
    { id: "g33-1", visual: { kind: "timeline", from: "9:00", to: "10:00", span: "Cleaning the hall", at: 0.5, point: "9:30 Lights out" },
      stem: "Which sentence matches the timeline?",
      opts: [{ t: "The hall was being cleaned when the lights went out." }, { t: "The hall was cleaned after the lights went out.", why: "Look at the bar. The cleaning started before 9:30 and was still going on." },
        { t: "The hall was being cleaning when the lights went out.", why: "After being, use the past participle: cleaned." }] },
    { id: "g33-2", visual: { kind: "quote", t: "The statues were being moved at 9:30." }, stem: "Were the statues in their new room at 9:30?",
      opts: [{ t: "No. The moving wasn't finished." }, { t: "Yes. The moving was finished.", why: "being tells you it was still in progress." },
        { t: "We can't tell anything about 9:30.", why: "9:30 is a moment in the middle of the moving." }] },
    { id: "g33-3", visual: { kind: "quote", t: "The cameras were being repaired." }, stem: "Who was repairing the cameras?",
      opts: [{ t: "We don't know. The sentence doesn't say." }, { t: "The cameras repaired themselves.", why: "Cameras can't repair themselves. They received the action." },
        { t: "The thief was repairing them before the robbery.", why: "The sentence doesn't say who. We use the passive when who did it isn't known or isn't important." }] },
    { id: "g33-4", visual: { kind: "timeline", from: "8:00", to: "11:00", span: "Painting the new sign", at: 0.67, point: "10:00 Thao arrives" },
      stem: "Thao arrived at 10:00. What did she see?",
      opts: [{ t: "The new sign was being painted." }, { t: "The new sign was painted last week.", why: "Look at the timeline. At 10:00 the painting was still going on." },
        { t: "The new sign was painting.", why: "Signs don't paint. People painted it, so use was being painted." }] }],
  use: { h: "Write the story", intro: "Read the security log. Then finish Thao's news report.", clues: [
      "🧹 9:00 Cleaners start work in the main hall.",
      "🗿 9:15 Workers start moving two statues to a new room.",
      "📷 9:20 An engineer starts repairing the security cameras.",
      "💡 9:30 The lights go out. 9:32 An electrician starts fixing them.",
      "🖼️ 9:35 The lights come back on. The painting has gone, and the back door is open."],
    items: [
      { id: "u33-1", stem: "At 9:30, the main hall ___.",
        opts: [{ t: "was being cleaned" }, { t: "was cleaning", why: "The hall didn't clean anything. People cleaned it." }, { t: "were being cleaned", why: "The hall is one thing: was." }] },
      { id: "u33-2", stem: "At the same time, two statues ___ to a new room.",
        opts: [{ t: "were being moved" }, { t: "was being moved", why: "Two statues: were." }, { t: "were being moving", why: "After being, use the past participle: moved." }] },
      { id: "u33-3", stem: "The cameras weren't recording because they ___.",
        opts: [{ t: "were being repaired" }, { t: "were repairing themselves", why: "Cameras can't repair anything. Someone repaired them." }, { t: "are being repaired", why: "The story happened last night: use the past." }] },
      { id: "u33-4", stem: "While the lights ___, the thief escaped through the back door.",
        opts: [{ t: "were being fixed" }, { t: "were fixing", why: "The lights didn't fix anything. The electrician fixed them." }, { t: "were being fixing", why: "After being, use the past participle: fixed." }] }],
    write: { stem: "Write the first sentence of Thao's report: what was happening at the museum at 9:30? Use was being or were being + a past participle.",
      model: "At 9:30 the main hall was being cleaned and the cameras were being repaired, so nobody saw the thief.",
      need: 2, groups: [
        { label: "uses was being or were being", k: ["was being", "were being"], ask: "Use was being or were being." },
        { label: "adds a past participle", k: ["cleaned", "moved", "repaired", "fixed", "painted", "checked", "tested", "guarded", "watched", "carried", "taken", "shown", "prepared", "opened", "closed"],
          ask: "Add a past participle, such as cleaned, moved or repaired." }] } },
  prove: [
    { level: 0, id: "p33-c1", stem: "When I got to school, the classroom ___.", opts: [{ t: "was being painted" }, { t: "was painting", why: "The classroom didn't paint anything. People painted it." }, { t: "was being painting", why: "After being, use the past participle: painted." }] },
    { level: 0, id: "p33-c2", stem: "The roads ___, so the traffic was terrible.", opts: [{ t: "were being repaired" }, { t: "was being repaired", why: "roads is plural: were." }, { t: "were being repairing", why: "After being, use the past participle: repaired." }] },
    { level: 0, id: "p33-c3", type: "type", stem: "The bridge was ___ repaired, so we took the ferry.", accept: ["being"], hint: "was + ___ + past participle." },
    { level: 0, id: "p33-c4", stem: "Which sentence means the work was still happening?", opts: [{ t: "The walls were being painted." }, { t: "The walls were painted.", why: "This sounds finished." }, { t: "The walls had been painted before.", why: "had been painted means it was already finished." }] },
    { level: 0, id: "p33-c5", stem: "At 8 p.m., dinner ___ in the hotel restaurant.", opts: [{ t: "was being served" }, { t: "was serving", why: "Dinner doesn't serve anything. People serve it." }, { t: "was being serving", why: "After being, use the past participle: served." }] },
    { level: 1, id: "p33-s1", type: "type", stem: "The tourists ___ being shown around the palace when it started to rain.", accept: ["were"], hint: "tourists is plural. Which past form of be?" },
    { level: 1, id: "p33-s2", stem: "I felt that I ___ by someone in the market.", opts: [{ t: "was being followed" }, { t: "was following", why: "You weren't following anyone. Someone was following you." }, { t: "were being followed", why: "I goes with was." }] },
    { level: 1, id: "p33-s3", stem: "We couldn't visit the temple because the roof ___.", opts: [{ t: "was being repaired" }, { t: "had already been repaired", why: "If the repair was finished, you could visit!" }, { t: "was repairing", why: "The roof didn't repair anything." }] },
    { level: 1, id: "p33-s4", type: "type", stem: "Our bags were being ___ (check) when our flight was called.", accept: ["checked"], hint: "After being, use the past participle." },
    { level: 2, id: "p33-x1", stem: "The old town looked different: lanterns ___ everywhere for the festival.", opts: [{ t: "were being hung" }, { t: "were being hanged", why: "hanged is only for people, as a punishment. Lanterns are hung." }, { t: "were hanging up", why: "The lanterns didn't hang anything up. People hung them up." }] },
    { level: 2, id: "p33-x2", stem: "Which sentence is correct?", opts: [{ t: "While the boats were being prepared, we had breakfast." }, { t: "While the boats were preparing, we had breakfast.", why: "Boats don't prepare anything. People prepared them." }, { t: "While the boats was being prepared, we had our breakfast.", why: "boats is plural: were." }] },
    { level: 2, id: "p33-x3", type: "type", stem: "The match couldn't start because the pitch was still being ___ (dry).", accept: ["dried"], hint: "dry + -ed: watch the spelling (y changes to i)." },
    { level: 2, id: "p33-x4", stem: "At 9:30 last night, the paintings ___ by two guards, but one of them fell asleep.", opts: [{ t: "were being watched" }, { t: "were watching", why: "The paintings didn't watch anything. The guards watched them." }, { t: "were being watching", why: "After being, use the past participle: watched." }] }] }
];

export const glabMission = id => GLAB.find(m => m.id === id);
export const glabForPoint = point => GLAB.find(m => m.point === point) || null;
export const isGLab = id => /^glab-/.test(id || "") && !!glabMission(id);
export const isGLabAttempt = h => isGLab(h.text_id);
const proveAnswers = h => (h.answers || []).filter(a => a.skill === "Grammar" && a.glab);
// A scene paragraph split into plain text and the lit-up grammar: [[...]] marks the form.
export const sceneParts = t => t.split(/(\[\[[^\]]+\]\])/).filter(Boolean).map(s => /^\[\[/.test(s) ? { t: s.slice(2, -2), hi: true } : { t: s });
// A one-word answer: lower case, curly apostrophes made straight, no full stop.
export const typedOk = (q, v) => q.accept.includes(String(v || "").trim().toLowerCase().replace(/[’‘]/g, "'").replace(/[.!?]+$/, ""));

// Start Prove it where the last Grammar Lab mission ended; otherwise at the student's usual level (tier).
export function glabStartLevel(history, tier = 0) {
  const last = history.filter(isGLabAttempt).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || ""))).map(proveAnswers).find(a => a.length);
  if (!last) return Math.max(0, Math.min(2, tier));
  const a = last[last.length - 1];
  return Math.max(0, Math.min(2, a.next ?? a.level ?? 0));
}
export const seenGItems = history => new Set(history.filter(isGLabAttempt).flatMap(h => proveAnswers(h).map(a => a.glab)));
export const glabPeak = answers => answers.filter(a => a.skill === "Grammar" && a.glab).reduce((p, a) => Math.max(p, a.level || 0), 0);
export function glabXP(results) {
  return results.reduce((t, r) => t + (r.skill === "Grammar Lab" ? (r.step === "write" ? (r.first_try || r.support === "hint" ? XP_GLAB.write : 0) : r.first_try ? XP_GLAB.step : 0)
    : r.support === "none" ? XP_GLAB.first[r.level || 0] : r.support === "hint" ? XP_GLAB.hint : 0), 0) + XP_GLAB.finish;
}
