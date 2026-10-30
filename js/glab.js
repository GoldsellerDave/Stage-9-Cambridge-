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
export const XP_GLAB = { step: 3, twin: 2, write: 10, frame: 5, first: [10, 15, 20], hint: 4, finish: 10 };

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

// Help for every question, so a wrong answer leads to understanding, not just the answer.
//   hint: a nudge towards the clue or the rule (never the answer). Shown on "Need a hint?", after one wrong answer, and
//         straight away while support is on (see student.js).
//   explain: after two wrong answers, why the right answer is right.
//   twin: a question like it (Get it, Use it) to try straight after the explanation, so the student uses what they just saw.
// Keys are item ids; "r24" and "r33" are the rule questions. Merged into the missions below.
const HELP = {
  r24: { hint: "Look at your three groups: sure it happened, maybe, sure it didn't. Which rule fits all three?",
    explain: "Lan can see the open bag, so she's sure: must have fallen. Bao isn't sure: might have taken. The teacher knows about the photo on the bus, so he's sure it didn't happen: can't have left. They are all guesses about the past from clues: modal + have + past participle." },
  "g24-1": { hint: "100% sure. In your groups, which modal meant \"sure it happened\"?",
    explain: "100% sure that something happened = must have. might have is only maybe, and can't have is sure it did NOT happen.",
    twin: { visual: { kind: "meter", at: 0, who: "The teacher" }, stem: "The teacher is sure it did NOT happen. Which sentence does she say?",
      opts: [{ t: "Minh can't have lost it at school." }, { t: "Minh must have lost it at school.", why: "must have means she's sure it DID happen." },
        { t: "Minh might have lost it here at school.", why: "might have means maybe. She's sure it didn't happen." }],
      explain: "Sure it did NOT happen = can't have + past participle." } },
  "g24-2": { hint: "Lan's meter is in the middle. Which modal means maybe?",
    explain: "The middle of the meter means maybe, and maybe = might have (or could have). must have and can't have are both for when you're sure.",
    twin: { visual: { kind: "quote", t: "I'm not sure. Someone could have taken it from his bag." }, stem: "How sure is Bao?",
      opts: [{ t: "Not sure. It's possible." }, { t: "Completely sure it happened.", why: "could have means maybe, like might have. He also says \"I'm not sure\"." },
        { t: "Sure it didn't happen.", why: "That would be can't have." }],
      explain: "could have and might have both mean maybe. Bao even says \"I'm not sure\"." } },
  "g24-3": { hint: "Read the second sentence: \"He was with me all day.\" Could Bao take it?",
    explain: "can't have = I'm sure it did NOT happen. The speaker was with Bao all day, so the speaker is sure he didn't take it.",
    twin: { visual: { kind: "quote", t: "The phone must have fallen out. His bag was open." }, stem: "Did the phone fall out of the bag?",
      opts: [{ t: "Yes. The speaker is sure it did." }, { t: "No. The speaker is sure it didn't.", why: "That would be can't have. must have means sure it DID happen." },
        { t: "We have no idea. Nobody can guess.", why: "The open bag is a clue, and must have shows the speaker is sure." }],
      explain: "must have = sure it happened. The open bag is the clue that makes the speaker sure." } },
  "g24-4": { hint: "A guess about the past has three parts: modal + have + past participle. Which sentence has all three?",
    explain: "must have forgotten = modal (must) + have + past participle (forgotten), so it's a guess about the past. must forget is about now or a rule, and must be forget isn't a correct form.",
    twin: { stem: "Which sentence is a guess about the past?",
      opts: [{ t: "He might have missed the bus." }, { t: "He might miss the bus tomorrow.", why: "might + verb is about now or the future." },
        { t: "He might has missed the bus.", why: "After might, use have, not has." }],
      explain: "might have missed = modal + have + past participle, so it's a guess about the past." } },
  "u24-1": { hint: "Look at the 📸 clue. Where was the phone at 2:30?",
    explain: "He took a photo with it on the bus at 2:30, after the museum. So the detective is sure it did NOT happen: can't have left.",
    twin: { stem: "Lan's bag was closed all day, so the phone ___ into it by accident.",
      opts: [{ t: "can't have fallen" }, { t: "could have fallen", why: "could have means maybe. A closed bag makes it impossible." },
        { t: "must have fell", why: "The closed bag says it didn't happen. Also, after have use fallen, not fell." }],
      explain: "The bag was closed all day, so it's impossible: can't have fallen." } },
  "u24-2": { hint: "Look at the 😴 clue. What was Mai doing during the journey?",
    explain: "Mai was asleep for the whole journey, so it's impossible that she saw it: can't have seen. After couldn't, it's always have, never had.",
    twin: { stem: "Bao was at home sick that day, so he ___ it.",
      opts: [{ t: "can't have taken" }, { t: "must have taken away", why: "He wasn't even on the trip. Could he take it?" },
        { t: "can't have took", why: "took is the past simple. After have, use taken." }],
      explain: "Bao wasn't there, so it's impossible: can't have taken." } },
  "u24-3": { hint: "Look at the 📱 and 🎒 clues. Whose phone looks the same as Minh's?",
    explain: "Duc found two blue phones in his bag, and the phones look the same. So the detective is sure: Duc must have picked it up. After have, use the past participle (picked).",
    twin: { stem: "Lan has a red umbrella just like Mai's. Now Lan has two red umbrellas, so she ___ Mai's by mistake.",
      opts: [{ t: "must have taken" }, { t: "can't have taken", why: "Two umbrellas is a clue that it did happen." },
        { t: "must have take", why: "After have, use the past participle: taken." }],
      explain: "Two umbrellas make it certain: must have taken." } },
  "u24-4": { hint: "Look at the 🎒 clue. What did Duc do straight away?",
    explain: "He gave the phone back at once, so the detective is sure he didn't mean to take it: can't have taken it on purpose. took is the past simple, so it can't come after have.",
    twin: { stem: "Nam said sorry and paid for the broken window at once. He ___ it on purpose.",
      opts: [{ t: "can't have broken" }, { t: "must have wanted to break", why: "Saying sorry at once shows he didn't want to." },
        { t: "can't have broke", why: "broke is the past simple. After have, use broken." }],
      explain: "Saying sorry at once is the clue: he can't have broken it on purpose." } },
  "p24-c1": { hint: "Is 100% a clue that she did study, or that she didn't?", explain: "100% is a clue that she did study, and the speaker is sure: must have studied (modal + have + past participle)." },
  "p24-c2": { hint: "Read the first sentence again. Is the speaker sure?", explain: "\"I'm not sure\" means maybe: might have gone. Use the past participle gone, not went." },
  "p24-c3": { hint: "Is it possible to read 400 pages in an hour?", explain: "400 pages in an hour is impossible, so the speaker is sure it didn't happen: can't have read." },
  "p24-c4": { explain: "A guess about the past is must + have + past participle: must have left." },
  "p24-c5": { hint: "Check the verb after have.", explain: "might have + past participle: might have missed." },
  "p24-s1": { explain: "His phone was in another room, so it's impossible he heard it: can't (or couldn't) have heard." },
  "p24-s2": { hint: "The museum was closed. What does that tell you about the times you read?", explain: "The closed museum is a clue that you did read the wrong times. You're sure: must have read." },
  "p24-s3": { hint: "Maybe = not sure. Which modal means maybe?", explain: "may have, might have and could have all mean maybe." },
  "p24-s4": { explain: "\"I'm not sure\" means maybe: might, may or could have dropped." },
  "p24-x1": { hint: "He replied to it. What does that prove?", explain: "He replied, so he certainly got it: must have received." },
  "p24-x2": { hint: "Did someone send them to bed, or did they go themselves?", explain: "They went themselves, so it isn't passive: must have gone. The lights off and the quiet are the clues that make the speaker sure." },
  "p24-x3": { explain: "The speaker was in another city all day, so it's impossible: can't (or couldn't) have seen." },
  "p24-x4": { hint: "Who could know the code to the safe?", explain: "Knowing the code is a clue that it was someone who works there, so the speaker is sure: must have been." },
  w24: { frame: "Duc must have ___ Minh's phone by ___, because ___.",
    explain: "must have + past participle (picked up) says the detective is sure, and the clues (the same phone, two phones in Duc's bag) say why." },

  r33: { hint: "Compare \"was being cleaned\" with \"was cleaned\". Which one was still going on at 9:30?",
    explain: "At 9:30 the cleaning, the moving and the repairing were all still going on. Nobody says who was doing them, because that isn't important. So was / were + being + past participle = something was happening to a thing at that moment." },
  "g33-1": { hint: "Look at the bar and the ⚡. Was the cleaning still going on at 9:30?",
    explain: "The bar starts before 9:30 and goes on after it, so the cleaning was in progress: was being cleaned. After being, use the past participle.",
    twin: { visual: { kind: "timeline", from: "6:00", to: "8:00", span: "Cooking dinner", at: 0.5, point: "7:00 The phone rings" }, stem: "Which sentence matches the timeline?",
      opts: [{ t: "Dinner was being cooked when the phone rang." }, { t: "Dinner was cooked after the phone rang.", why: "Look at the bar. The cooking was still going on at 7:00." },
        { t: "Dinner was being cooking when the phone rang.", why: "After being, use the past participle: cooked." }],
      explain: "At 7:00 the cooking was still in progress: was being cooked." } },
  "g33-2": { hint: "Look at the word being. Does it mean finished, or still happening?",
    explain: "being shows the moving was still going on at 9:30, so the statues weren't in their new room yet.",
    twin: { visual: { kind: "quote", t: "The museum doors were being painted when we arrived." }, stem: "Could the visitors walk through the doors when they arrived?",
      opts: [{ t: "No. The painting wasn't finished." }, { t: "Yes. The doors were finished and dry.", why: "being shows the painting was still going on." },
        { t: "We can't tell anything about it.", why: "were being painted tells us the painting was happening at that moment." }],
      explain: "were being painted = the painting was in progress when they arrived, so the doors weren't ready." } },
  "g33-3": { hint: "Read the sentence again. Does it name a person?",
    explain: "The passive doesn't say who did the action. We use it when we don't know who, or it isn't important. Cameras can't repair themselves: they receive the action.",
    twin: { visual: { kind: "quote", t: "The tickets were being checked at the door." }, stem: "Who was checking the tickets?",
      opts: [{ t: "We don't know. It doesn't say." }, { t: "The tickets were checking themselves.", why: "Tickets can't check anything. Someone checked them." },
        { t: "The visitors were checking them all.", why: "The sentence doesn't say who. Who did it isn't important here." }],
      explain: "The sentence doesn't name a person. The passive puts the tickets first, not the person." } },
  "g33-4": { hint: "Find 10:00 on the timeline. Was the painting finished then?",
    explain: "The bar runs from 8:00 to 11:00, so at 10:00 the painting was still going on: was being painted. A sign can't paint, so it must be passive.",
    twin: { visual: { kind: "timeline", from: "1:00", to: "4:00", span: "Repairing the lift", at: 0.33, point: "2:00 Minh arrives" }, stem: "Minh arrived at 2:00. What did he see?",
      opts: [{ t: "The lift was being repaired." }, { t: "The lift was repaired last year.", why: "Look at the timeline. At 2:00 the repair was still going on." },
        { t: "The lift was repairing.", why: "A lift can't repair anything. Someone repaired it." }],
      explain: "At 2:00 the repair was in progress: was being repaired." } },
  "u33-1": { hint: "Look at the 🧹 clue. Did the hall clean something, or did people clean it?",
    explain: "The cleaners started at 9:00, so at 9:30 the cleaning was in progress. The hall received the action, and it's one thing: was being cleaned.",
    twin: { stem: "At 9:30, the floor ___ by the cleaners.",
      opts: [{ t: "was being washed" }, { t: "was washing", why: "The floor didn't wash anything. The cleaners washed it." },
        { t: "were being washed", why: "The floor is one thing: was." }],
      explain: "The floor received the action, it's one thing, and it was happening at 9:30: was being washed." } },
  "u33-2": { hint: "Look at the 🗿 clue. How many statues?",
    explain: "Two statues = plural = were. The moving was still going on: were being moved.",
    twin: { stem: "At 9:40, the visitors ___ out of the building.",
      opts: [{ t: "were being led" }, { t: "was being led", why: "visitors is plural: were." },
        { t: "were being leading", why: "After being, use the past participle: led." }],
      explain: "visitors is plural, so were being + led (the past participle of lead)." } },
  "u33-3": { hint: "When did the story happen? And can cameras repair things?",
    explain: "The story happened last night, so use the past: were. The cameras received the action: were being repaired.",
    twin: { stem: "We couldn't use the lift last night because it ___.",
      opts: [{ t: "was being fixed" }, { t: "is being fixed", why: "last night: use the past." },
        { t: "was fixing itself", why: "A lift can't fix anything. Someone fixed it." }],
      explain: "last night = past, the lift is one thing, and someone was fixing it: was being fixed." } },
  "u33-4": { hint: "Look at the 💡 clue. Who fixed the lights?",
    explain: "The electrician was fixing the lights, so the lights received the action: were being fixed. After being, use the past participle.",
    twin: { stem: "While the paintings ___, a guard noticed the open door.",
      opts: [{ t: "were being counted" }, { t: "were counting", why: "The paintings didn't count anything. Someone counted them." },
        { t: "were being counting", why: "After being, use the past participle: counted." }],
      explain: "paintings is plural, and someone was counting them: were being counted." } },
  "p33-c1": { hint: "Did the classroom paint something, or did people paint it?", explain: "People were painting the classroom when I arrived, so it's passive and in progress: was being painted." },
  "p33-c2": { hint: "roads: one or more than one?", explain: "roads is plural, so were being + repaired." },
  "p33-c3": { explain: "The repair was in progress: was being repaired." },
  "p33-c4": { hint: "Which word shows that something is still happening?", explain: "being shows the painting was still happening." },
  "p33-c5": { hint: "Does dinner serve something, or do people serve it?", explain: "People were serving dinner at 8 p.m., so it's passive and in progress: was being served." },
  "p33-s1": { explain: "tourists is plural: were being shown." },
  "p33-s2": { hint: "Was I following someone, or was someone following me?", explain: "Someone was following me, so it's passive. I goes with was: was being followed." },
  "p33-s3": { hint: "If the repair was finished, could you visit?", explain: "We couldn't visit, so the work was still going on: was being repaired." },
  "p33-s4": { explain: "After being, use the past participle: checked." },
  "p33-x1": { hint: "Lanterns aren't people. Which past participle of hang do we use for things?", explain: "For things, hang → hung. People were hanging the lanterns: were being hung." },
  "p33-x2": { hint: "boats: one or more? And did the boats prepare anything?", explain: "boats is plural (were), and people prepared them (being prepared)." },
  "p33-x3": { explain: "dry → dried (y changes to i): was being dried." },
  "p33-x4": { hint: "Who did the watching: the paintings or the guards?", explain: "The guards watched the paintings, so the paintings received the action: were being watched." },
  w33: { frame: "At 9:30, the ___ was being ___, so ___.",
    explain: "was / were being + past participle (cleaned, repaired) says what was happening at 9:30, and so says why nobody saw the thief." }
};
for (const m of GLAB) {
  const u = m.point.replace(".", "");
  Object.assign(m.spot, HELP[`r${u}`]); Object.assign(m.use.write, HELP[`w${u}`]);
  [...m.get, ...m.use.items, ...m.prove].forEach(it => Object.assign(it, HELP[it.id]));
}

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
  return results.reduce((t, r) => t + (r.skill === "Grammar Lab" ? (r.step === "write" ? (r.first_try || r.support === "hint" ? XP_GLAB.write : r.support === "frame" ? XP_GLAB.frame : 0)
    : r.first_try ? XP_GLAB.step : r.support === "twin" ? XP_GLAB.twin : 0)
    : r.support === "none" ? XP_GLAB.first[r.level || 0] : r.support === "hint" ? XP_GLAB.hint : 0), 0) + XP_GLAB.finish;
}
