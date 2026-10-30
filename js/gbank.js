// Lessons and questions for the grammar engine's blocks (gengine.js). The Grammar Lab's 8 shared blocks
// (v123, pp, sing-plural, was-were, doer, active-passive, progress, past-cont) keep their lessons and checks in glab.js.
// Each block: say (the short lesson), ex (examples), items. An item: stem with ___ for a gap, opts with option 0 right
// (shuffled on screen), each wrong option's why (never the answer) and b = the block underneath that the mistake shows.
// kind: "meaning" (understand it: who did it, finished or not, which came first) or "form" (choose or fix the form).
// Keep the right option from usually being the longest (tests check). Don't rename block or item ids.
import { GBLOCKS } from "./gengine.js";
import { BLOCKS as LAB_BLOCKS } from "./glab.js";

const Q = (kind, stem, right, ...wrong) => ({ kind, stem, opts: [{ t: right }, ...wrong.map(([t, why, b]) => ({ t, why, ...(b ? { b } : {}) }))] });

export const BANK = {
  "ed-spell": { say: "Regular verbs add -ed for the past. Watch the spelling: stop → stopped (double the last letter after a short vowel), try → tried (y becomes i after a consonant), like → liked (just add -d after e), play → played (vowel + y: just add -ed).",
    ex: [["stop", "stopped"], ["try", "tried"], ["like", "liked"], ["play", "played"]],
    items: [
      Q("form", "Yesterday we ___ for the bus for twenty minutes.", "waited", ["waitted", "Only double the last letter after one short vowel, like stop → stopped."], ["waitd", "Add -ed, not just -d, unless the verb ends in e."]),
      Q("form", "The bus ___ suddenly.", "stopped", ["stoped", "stop has one short vowel + one consonant: double the p."], ["stopt", "Regular verbs add -ed."]),
      Q("form", "She ___ to open the window.", "tried", ["tryed", "Consonant + y: change y to i, then add -ed."], ["trys", "-s is the present. The past adds -ed."]),
      Q("form", "We ___ football after school.", "played", ["plaied", "Vowel + y (play): just add -ed."], ["plaid", "Vowel + y (play): just add -ed."]),
      Q("form", "The pitch was ___ in the sun. (dry)", "dried", ["dryed", "Consonant + y: change y to i, then add -ed."], ["dryied", "Change y to i, then add -ed: one i only."]),
      Q("form", "I ___ the film. (enjoy)", "enjoyed", ["enjoied", "Vowel + y (enjoy): just add -ed."], ["enjoy", "That's the present. Add -ed for the past."])] },
  v2: { say: "Irregular verbs don't add -ed in the past simple. Their V2 has to be learned: go → went, see → saw, take → took, buy → bought.",
    ex: [["go", "went"], ["see", "saw"], ["take", "took"], ["buy", "bought"], ["write", "wrote"]],
    items: [
      Q("form", "Last summer we ___ to Da Nang.", "went", ["goed", "go is irregular: it doesn't add -ed. Check the verb table.", "v123"], ["gone", "gone is V3. The past simple is V2.", "v123"]),
      Q("form", "I ___ a great film yesterday.", "saw", ["seen", "seen is V3. It needs have: I have seen.", "v123"], ["seed", "see is irregular.", "v123"]),
      Q("form", "She ___ a new phone last week.", "bought", ["buyed", "buy is irregular: it doesn't add -ed.", "v123"], ["brought", "brought is the past of bring, not buy.", "v123"]),
      Q("form", "He ___ his bag on the bus.", "left", ["leaved", "leave is irregular: it doesn't add -ed.", "v123"], ["leaving", "-ing is not the past simple.", "v123"]),
      Q("form", "We ___ a letter to the museum.", "wrote", ["written", "written is V3. The past simple is V2.", "v123"], ["writed", "write is irregular.", "v123"]),
      Q("form", "The thief ___ the painting.", "stole", ["stealed", "steal is irregular: it doesn't add -ed.", "v123"], ["stolen", "That's V3. The past simple needs V2.", "v123"])] },
  "past-simple": { say: "The past simple is for finished actions in the past. Positive: V2 (I visited, I went). Negative: didn't + V1 (I didn't go). Question: Did + subject + V1? (Did you go?).",
    ex: [["I went to the museum.", "positive: V2"], ["I didn't go.", "negative: didn't + V1"], ["Did you go?", "question: did + V1"]],
    items: [
      Q("form", "We ___ the museum on Monday.", "visited", ["visit", "Monday is finished: use the past.", "ed-spell"], ["visitted", "Only double after one short stressed vowel.", "ed-spell"]),
      Q("form", "I ___ the bus this morning.", "didn't catch", ["didn't caught", "After didn't, use V1: catch.", "v2"], ["not caught", "The negative needs didn't + V1."]),
      Q("form", "___ you see the new statue?", "Did", ["Do", "The question is about the past: Did."], ["Were", "With a verb like see, use Did + V1."]),
      Q("form", "Did she ___ her homework?", "finish", ["finished", "After Did, use V1.", "ed-spell"], ["finishing", "After Did, use V1."]),
      Q("meaning", "\"We went to Hoi An last year.\" Is the trip finished?", "Yes, it's finished", ["No, they're still there", "went is the past simple: a finished action."], ["It's a plan for the future", "went is the past, not the future."]),
      Q("form", "Which sentence is correct?", "They didn't see the thief.", ["They didn't saw the thief.", "After didn't, use V1: see.", "v2"], ["They not saw the thief.", "The negative needs didn't + V1."])] },
  "ps-pc": { say: "Use the past continuous (was / were + -ing) for the longer action in progress, and the past simple for the short action that interrupts it. while often goes with the longer action, when with the shorter one.",
    ex: [["I was walking home", "longer action, in progress"], ["when it started to rain.", "short action, interrupts"]],
    items: [
      Q("form", "I ___ TV when the phone rang.", "was watching", ["watched", "The watching was in progress. It was interrupted.", "past-cont"], ["was watch", "The past continuous needs was / were + -ing.", "past-cont"]),
      Q("form", "While we were eating, the lights ___ out.", "went", ["were going", "The lights going out is the short action that interrupts.", "past-simple"], ["was going", "Short action: past simple.", "past-simple"]),
      Q("meaning", "\"She was reading when he arrived.\" Which started first?", "The reading", ["His arrival", "Which action was already in progress when he arrived?", "past-cont"], ["Both at once", "was reading = already in progress at that moment.", "past-cont"]),
      Q("form", "They ___ football when it started to rain.", "were playing", ["was playing", "They: were.", "past-cont"], ["played", "It was in progress when the rain started: was / were + -ing.", "past-cont"]),
      Q("form", "When the teacher came in, we ___.", "were talking", ["talked", "The talking was in progress when she came in.", "past-cont"], ["are talking", "This is in the past.", "past-cont"]),
      Q("meaning", "\"When the bell rang, we left.\" What happened?", "The bell rang, then we left", ["We were leaving during the bell", "Two past simple verbs: one after the other.", "past-simple"], ["We left before the bell", "when + past simple: the bell first, then leaving.", "past-simple"])] },
  "pres-passive": { say: "Present simple passive: am / is / are + past participle (V3). Use it when the action matters more than who does it: English is spoken here. Rice is grown in the Mekong Delta.",
    ex: [["People grow rice here.", "Rice is grown here."], ["They make phones in this factory.", "Phones are made in this factory."]],
    items: [
      Q("form", "Rice ___ in the Mekong Delta.", "is grown", ["is grow", "After is, use V3: grown.", "pp"], ["grows", "Rice doesn't grow itself here: farmers grow it.", "active-passive"]),
      Q("form", "These phones ___ in Viet Nam.", "are made", ["is made", "phones is plural: are.", "was-were"], ["are make", "After are, use V3: made.", "pp"]),
      Q("form", "English ___ in many countries.", "is spoken", ["is speaking", "-ing is active: English doesn't speak anything.", "active-passive"], ["is spoke", "spoke is V2. Use V3: spoken.", "pp"]),
      Q("meaning", "\"The museum is cleaned every night.\" Who cleans it?", "We don't know", ["The museum does", "The museum receives the action.", "active-passive"], ["The visitors", "The sentence doesn't say who.", "active-passive"]),
      Q("form", "Which sentence is passive?", "The doors are opened at 8.", ["The guard opens the doors at 8.", "The guard does the action: active.", "active-passive"], ["The doors are opening now.", "-ing here is not the passive.", "active-passive"]),
      Q("form", "Tickets ___ at the door.", "are checked", ["are checking", "Tickets can't check anything: someone checks them.", "active-passive"], ["is checked", "Tickets is plural: are.", "was-were"])] },
  "past-passive": { say: "Past simple passive: was / were + past participle (V3). Use it for finished past actions when the action matters more than who did it: The painting was stolen last night. The statues were moved.",
    ex: [["Someone stole the painting.", "The painting was stolen."], ["Workers built the bridge in 2010.", "The bridge was built in 2010."]],
    items: [
      Q("form", "The painting ___ last night.", "was stolen", ["was stole", "stole is V2. After was, use V3: stolen.", "pp"], ["stole", "The painting didn't steal anything.", "active-passive"]),
      Q("form", "The bridges ___ in 2010.", "were built", ["was built", "bridges is plural: were.", "was-were"], ["were build", "After were, use V3: built.", "pp"]),
      Q("form", "The windows ___ yesterday.", "were cleaned", ["are cleaned", "yesterday: use the past.", "past-simple"], ["were cleaning", "The windows didn't clean anything.", "active-passive"]),
      Q("meaning", "\"The letter was written in 1890.\" Is the writing finished?", "Yes, long ago", ["No, it's still going on", "was written is the past simple passive: finished.", "past-simple"], ["It will happen in 1890", "was is the past.", "past-simple"]),
      Q("form", "My bike ___ last week.", "was taken", ["was took", "took is V2. After was, use V3: taken.", "pp"], ["were taken", "My bike is one thing: was.", "was-were"]),
      Q("form", "Which sentence is correct?", "The match was won by our team.", ["The match won by our team.", "The passive needs was / were + V3.", "active-passive"], ["The match was win by our team.", "After was, use V3: won.", "pp"])] },
  "modal-passive": { say: "Modal passive: modal + be + past participle (V3). It can be done. Phones must be switched off. The room should be cleaned.",
    ex: [["can + be + done", "It can be done."], ["must + be + switched off", "Phones must be switched off."]],
    items: [
      Q("form", "Phones must ___ off in class.", "be switched", ["switched", "After a modal, the passive needs be + V3.", "pres-passive"], ["be switch", "After be, use V3: switched.", "pres-passive"]),
      Q("form", "This problem can ___ easily.", "be solved", ["is solved", "After can, use be (not is).", "pres-passive"], ["be solving", "The problem doesn't solve anything.", "pres-passive"]),
      Q("form", "The tickets should ___ online.", "be bought", ["be buyed", "buy is irregular: bought.", "pres-passive"], ["been bought", "After should, use be.", "pres-passive"]),
      Q("meaning", "\"Food must not be eaten in the museum.\" What does it mean?", "Nobody may eat here", ["The food eats in the museum", "The food receives the action.", "pres-passive"], ["You must eat here", "must not = it isn't allowed.", "pres-passive"]),
      Q("form", "Which sentence is correct?", "The door can be opened.", ["The door can opened.", "Modal passive: can + be + V3.", "pres-passive"], ["The door can is opened.", "After can, use be.", "pres-passive"]),
      Q("form", "Homework ___ on time.", "must be handed in", ["must hand in", "Homework doesn't hand anything in: use the passive.", "pres-passive"], ["must be hand in", "After be, use V3: handed.", "pres-passive"])] },
  "by-agent": { say: "Add by + the doer only when it matters or is new information: The Mona Lisa was painted by Leonardo da Vinci. Leave it out when the doer is unknown, obvious or not important: My phone was stolen (by someone).",
    ex: [["was painted by Leonardo", "the doer matters"], ["My phone was stolen.", "unknown: no by"]],
    items: [
      Q("form", "Romeo and Juliet was written ___ Shakespeare.", "by", ["from", "The doer comes after by.", "past-passive"], ["with", "with is for a tool (with a pen). The doer comes after by.", "past-passive"]),
      Q("meaning", "Which sentence needs by + the doer?", "This song was written by my sister.", ["My bag was stolen by someone.", "by someone adds nothing: leave it out.", "pres-passive"], ["Rice is grown by farmers here.", "Farmers is obvious: leave it out.", "pres-passive"]),
      Q("meaning", "\"The bridge was designed by a 15-year-old.\" Why is by used?", "The doer is surprising news", ["The doer is unknown", "If unknown, there is no by.", "past-passive"], ["by is always needed", "by is only used when the doer matters.", "past-passive"]),
      Q("form", "The cake was cut ___ a knife.", "with", ["by", "by is for the doer. A knife is a tool, not a doer.", "past-passive"], ["from", "Which small word goes with a tool you use?", "past-passive"]),
      Q("meaning", "Which sentence is better English?", "The windows are cleaned every day.", ["The windows are cleaned every day by people.", "by people adds nothing.", "pres-passive"], ["The windows are cleaned every day by someone.", "by someone adds nothing.", "pres-passive"]),
      Q("form", "The match was won ___ the Blue Team.", "by", ["of", "The doer comes after by.", "past-passive"], ["from", "The doer comes after by.", "past-passive"])] },
  "passive-negq": { say: "Negative: wasn't / weren't + V3 (The thief wasn't seen). Question: Was / Were + subject + V3? (Was the painting found?). Present: isn't / aren't, Is / Are.",
    ex: [["The thief wasn't seen.", "negative"], ["Was the painting found?", "question"]],
    items: [
      Q("form", "The painting ___ found.", "wasn't", ["didn't", "The passive negative uses a form of be, not do.", "past-passive"], ["weren't", "The painting is one thing. Is that was or were?", "past-passive"]),
      Q("form", "___ the windows cleaned yesterday?", "Were", ["Did", "A passive question starts with a form of be.", "past-passive"], ["Was", "windows is plural. Which form of be goes with plural?", "past-passive"]),
      Q("form", "Was the thief ___?", "caught", ["catch", "After Was + subject, use V3.", "past-passive"], ["catched", "catch is irregular: it doesn't add -ed.", "past-passive"]),
      Q("form", "These rooms ___ used any more.", "aren't", ["don't", "The passive negative uses a form of be, not do.", "past-passive"], ["isn't", "rooms is plural. Which form of be goes with plural?", "past-passive"]),
      Q("form", "Which question is correct?", "Where was the phone found?", ["Where did the phone found?", "Passive question: was + subject + V3.", "past-passive"], ["Where the phone was found?", "In a question, was comes before the subject.", "past-passive"]),
      Q("meaning", "\"The doors weren't locked.\" Were the doors locked?", "No", ["Yes", "weren't = were not.", "past-passive"], ["We can't tell", "weren't locked tells us: no.", "past-passive"])] },
  "pres-cont-passive": { say: "Present continuous passive: am / is / are + being + past participle (V3). It's happening to something now or around now: The hall is being painted this week. My phone is being repaired.",
    ex: [["is + being + painted", "The hall is being painted."], ["are + being + built", "New homes are being built."]],
    items: [
      Q("form", "Sorry, the lift ___ at the moment.", "is being repaired", ["is repairing", "The lift doesn't repair anything.", "pres-passive"], ["is being repair", "After being, use V3: repaired.", "pres-passive"]),
      Q("form", "New homes ___ near our school.", "are being built", ["is being built", "homes is plural: are.", "pres-passive"], ["are building", "Homes don't build anything.", "pres-passive"]),
      Q("meaning", "\"The road is being repaired.\" Is the repair finished?", "No, it's happening now", ["Yes, it's finished", "being shows it's still in progress.", "progress"], ["It hasn't started", "is being repaired = in progress now.", "progress"]),
      Q("form", "Which sentence means it is happening now?", "The classroom is being painted.", ["The classroom is painted.", "is painted is a general fact or finished.", "progress"], ["The classroom was painted.", "was painted is finished, in the past.", "progress"]),
      Q("form", "My laptop ___ right now, so I can't send it.", "is being fixed", ["is fixed", "right now means in progress: is / are + being + V3.", "progress"], ["is been fixed", "In progress needs being after is.", "pres-passive"]),
      Q("form", "Our test papers ___ this week.", "are being marked", ["are marking", "Papers don't mark anything.", "pres-passive"], ["are being mark", "After being, use V3: marked.", "pres-passive"])] },
  "past-perfect": { say: "Past perfect: had + past participle (V3). Use it for the earlier of two past actions: When we arrived, the film had started (it started first). It is common in stories and reported speech.",
    ex: [["The film had started", "earlier action"], ["when we arrived.", "later action"]],
    items: [
      Q("form", "When we got to the station, the train ___.", "had left", ["has left", "Both actions are in the past: had.", "past-simple"], ["had leave", "After had, use V3: left.", "pp"]),
      Q("meaning", "\"When I arrived, Mai had gone home.\" Who left first?", "Mai left first", ["I arrived first", "had gone shows the earlier action.", "past-simple"], ["At the same time", "had gone = before I arrived.", "past-simple"]),
      Q("form", "She was tired because she ___ all night.", "had worked", ["worked had", "Word order: had + V3.", "pp"], ["has worked", "The story is in the past: had.", "past-simple"]),
      Q("form", "I couldn't get in. I ___ my key.", "had lost", ["had lose", "After had, use V3: lost.", "pp"], ["have lost", "The story is in the past: had.", "past-simple"]),
      Q("form", "He said he ___ the film before.", "had seen", ["had saw", "saw is V2. After had, use V3: seen.", "pp"], ["had see", "After had, use V3: seen.", "pp"]),
      Q("meaning", "\"By 9:00 the cleaners had finished.\" At 9:00, the cleaning was…", "already finished", ["still going on", "had finished = already done before 9:00.", "past-simple"], ["about to start", "had finished = done before 9:00.", "past-simple"])] },
  "future-passive": { say: "Future passive: will be + past participle (V3). The winners will be announced tomorrow. The new bridge will be opened in May.",
    ex: [["will + be + announced", "The winners will be announced."]],
    items: [
      Q("form", "The results ___ tomorrow.", "will be announced", ["will announced", "Future passive: will + be + V3.", "pres-passive"], ["will be announce", "After be, use V3: announced.", "pres-passive"]),
      Q("form", "The new museum ___ next year.", "will be opened", ["will open by people", "Leave out by people. Use will be + V3.", "pres-passive"], ["will been opened", "After will, use be.", "pres-passive"]),
      Q("meaning", "\"Cars will be driven by computers.\" Who will drive?", "Computers", ["The cars themselves", "Look for the word after by. That's the doer.", "pres-passive"], ["People", "The word after by tells you who does it.", "pres-passive"]),
      Q("form", "Your phone ___ in two days.", "will be repaired", ["will repair", "Your phone won't repair anything.", "pres-passive"], ["will is repaired", "After will, use be.", "pres-passive"]),
      Q("form", "Which sentence is correct?", "The match will be shown on TV.", ["The match will shown on TV.", "Future passive needs be.", "pres-passive"], ["The match will be show on TV.", "After be, use V3: shown.", "pres-passive"]),
      Q("form", "More trees ___ next spring.", "will be planted", ["will be plant", "After be, use V3: planted.", "pres-passive"], ["are going to plant", "Trees don't plant anything.", "pres-passive"])] },
  "pres-perf-passive": { say: "Present perfect passive: have / has been + past participle (V3). Something has happened, and the result matters now: A new species has been discovered. The windows have been cleaned (they look great).",
    ex: [["has + been + discovered", "A new species has been discovered."], ["have + been + cleaned", "The windows have been cleaned."]],
    items: [
      Q("form", "A new planet ___.", "has been discovered", ["has discovered", "The planet didn't discover anything.", "pres-passive"], ["has been discover", "After been, use V3: discovered.", "pres-passive"]),
      Q("form", "The windows ___. They look great!", "have been cleaned", ["has been cleaned", "windows is plural: have.", "pres-passive"], ["have cleaned", "The windows didn't clean anything.", "pres-passive"]),
      Q("meaning", "\"My bike has been stolen.\" What's the situation now?", "I don't have my bike", ["Someone is stealing it right now", "has been stolen = it happened, and the result is now.", "pres-passive"], ["It will be stolen later", "has been = already happened.", "pres-passive"]),
      Q("form", "The homework ___ yet.", "hasn't been marked", ["hasn't marked", "The homework doesn't mark anything.", "pres-passive"], ["didn't been marked", "Negative: hasn't + been + V3.", "pres-passive"]),
      Q("form", "___ the results been posted yet?", "Have", ["Did", "The present perfect question starts with Have or Has. Which one goes with plural?", "pres-passive"], ["Were", "been + V3 goes with Have or Has. Which one goes with plural?", "pres-passive"]),
      Q("form", "Over 1,000 trees ___ since January.", "have been planted", ["were planted since", "since January → present perfect.", "pres-passive"], ["have been plant", "After been, use V3: planted.", "pres-passive"])] },
  "past-perf-passive": { say: "Past perfect passive: had been + past participle (V3). Something had already happened to it before another past moment: When we arrived, the painting had been stolen.",
    ex: [["had + been + stolen", "The painting had been stolen."]],
    items: [
      Q("form", "When the guard checked, the painting ___.", "had been stolen", ["had stolen", "The painting didn't steal anything.", "past-passive"], ["had been stole", "stole is V2. Use V3: stolen.", "past-passive"]),
      Q("meaning", "\"When we arrived, the food had been eaten.\" When was it eaten?", "Before we arrived", ["After we arrived", "had been eaten = earlier.", "past-perfect"], ["While we were there", "had been eaten = already done.", "past-perfect"]),
      Q("form", "The door was open. It ___ by someone.", "had been forced", ["had forced", "The door didn't force anything.", "past-passive"], ["has been forced", "The story is in the past: had.", "past-perfect"]),
      Q("form", "By 2020, the old school ___.", "had been closed", ["had closed by", "The school didn't close anything here.", "past-passive"], ["had been close", "After been, use V3: closed.", "past-passive"]),
      Q("form", "We couldn't use the room because it ___.", "hadn't been cleaned", ["hadn't cleaned", "The room doesn't clean anything.", "past-passive"], ["didn't been cleaned", "Negative: hadn't + been + V3.", "past-perfect"]),
      Q("meaning", "\"The tickets had been sold before we got there.\" Could we buy tickets?", "No, they were gone", ["Yes, lots were left", "had been sold = already sold.", "past-perfect"], ["We were selling them", "had been sold = someone sold them earlier.", "past-perfect"])] },
  causative: { say: "Causative: have / get + object + past participle (V3). Someone else does a job for you: I had my phone repaired (a technician repaired it). I'm getting my hair cut tomorrow.",
    ex: [["I repaired my phone.", "I did it myself"], ["I had my phone repaired.", "someone did it for me"]],
    items: [
      Q("meaning", "\"I had my hair cut.\" Who cut the hair?", "A hairdresser", ["I did", "had + object + V3 = someone else did it.", "active-passive"], ["Nobody", "Someone cut it for me.", "active-passive"]),
      Q("form", "We ___ our house painted last year.", "had", ["were", "Causative: have / get + object + V3.", "active-passive"], ["did", "Causative: have / get + object + V3.", "active-passive"]),
      Q("form", "She had her phone ___.", "repaired", ["repair", "After the object, use V3.", "pp"], ["repairing", "After the object, use V3.", "pp"]),
      Q("form", "Which sentence is correct?", "I'm getting my eyes tested.", ["I'm getting tested my eyes.", "Word order: get + object + V3.", "active-passive"], ["I'm getting my eyes test.", "After the object, use V3: tested.", "pp"]),
      Q("meaning", "\"Lan fixed her bike. Minh had his bike fixed.\" Who fixed a bike themselves?", "Lan", ["Minh", "had his bike fixed = someone else did it.", "active-passive"], ["Both of them", "Only Lan did it herself.", "active-passive"]),
      Q("form", "You should get your car ___.", "checked", ["check", "After the object, use V3.", "pp"], ["to check", "After the object, use V3.", "pp"])] },
  "passive-inf": { say: "Some passive verbs are followed by to + infinitive: be allowed to, be supposed to, be expected to, be asked to, be made to. Students are not allowed to use phones in class.",
    ex: [["be allowed to", "We aren't allowed to run."], ["be supposed to", "You're supposed to wear a uniform."]],
    items: [
      Q("form", "Students are not allowed ___ phones in class.", "to use", ["use", "be allowed + to + infinitive.", "pres-passive"], ["using", "be allowed + to + infinitive.", "pres-passive"]),
      Q("form", "We ___ to wear a uniform.", "are supposed", ["supposed", "be supposed to needs a form of be before supposed.", "pres-passive"], ["are suppose", "be + V3: supposed.", "pres-passive"]),
      Q("meaning", "\"You aren't allowed to take photos.\" Can you take photos?", "No", ["Yes, if you like", "aren't allowed = it's not permitted.", "pres-passive"], ["Only of the paintings", "aren't allowed means no photos.", "pres-passive"]),
      Q("form", "Visitors are asked ___ quiet.", "to keep", ["keep", "be asked + to + infinitive.", "pres-passive"], ["keeping", "be asked + to + infinitive.", "pres-passive"]),
      Q("form", "We were made ___ the floor.", "to clean", ["clean", "In the passive, made is followed by to + V1.", "pres-passive"], ["cleaning", "be made + to + infinitive.", "pres-passive"]),
      Q("form", "The test is expected ___ difficult.", "to be", ["be", "be expected + to + infinitive.", "pres-passive"], ["being", "be expected + to + infinitive.", "pres-passive"])] },
  "past-cont-passive": { say: "The past continuous passive says something was in progress, and it was receiving the action: was / were + being + V3. Use it for a background action at a past moment when the doer isn't important.",
    ex: [["The statue was being cleaned", "in progress, receiving the action"], ["when the museum opened.", "the moment it was interrupted"]],
    items: [
      Q("form", "When we arrived, the paintings ___.", "were being moved", ["were moving", "The paintings didn't move themselves: they received the action.", "past-passive"], ["was being moved", "paintings is plural: were.", "past-cont"]),
      Q("form", "At 10 a.m. the gallery ___.", "was being painted", ["was painting", "The gallery didn't paint: someone painted it.", "past-passive"], ["was been painted", "In progress: was being + V3.", "progress"]),
      Q("meaning", "\"The vase was being repaired when the alarm rang.\" Was the repair finished?", "No, it was in progress", ["Yes, it was finished", "was being repaired: still in progress at that moment.", "progress"], ["It hadn't started yet", "was being repaired: it had started and was in progress.", "progress"]),
      Q("form", "The visitors ___ round the museum by a guide.", "were being shown", ["were being showed", "show → shown (V3).", "past-passive"], ["was being shown", "visitors is plural: were.", "past-cont"]),
      Q("meaning", "\"The thief was being followed by the guard.\" Who was following?", "The guard", ["The thief", "The thief received the action. by tells you the doer.", "past-passive"], ["We don't know", "The words after by tell you the doer.", "past-passive"]),
      Q("form", "While the road ___, we took another way.", "was being repaired", ["was repairing", "The road didn't repair itself: it received the action.", "past-passive"], ["was repaired", "while: in progress, so was being + V3.", "progress"])] },
  "choose-tense": { say: "Choose the passive by asking two questions. When? (now, past, before another past moment, future, result now) And in progress or finished? Then use the right form of be + V3.",
    ex: [["now, in progress", "is being cleaned"], ["past, in progress", "was being cleaned"], ["result now", "has been cleaned"], ["before another past moment", "had been cleaned"], ["future", "will be cleaned"]],
    items: [
      Q("form", "At 9:30 last night, the hall ___.", "was being cleaned", ["is being cleaned", "last night: use the past.", "past-cont-passive"], ["has been cleaned", "At 9:30 last night it was in progress.", "past-cont-passive"]),
      Q("form", "Look! The windows ___. They're shining.", "have been cleaned", ["were being cleaned", "The result is now: have been.", "pres-perf-passive"], ["will be cleaned", "They're already shining: it has happened.", "pres-perf-passive"]),
      Q("form", "When we arrived, the painting ___.", "had already been stolen", ["was being stolen already", "already: it happened before we arrived.", "past-perf-passive"], ["will be stolen", "This is about the past.", "past-perf-passive"]),
      Q("form", "The winners ___ next Friday.", "will be announced", ["were announced", "next Friday: future.", "future-passive"], ["are being announced", "next Friday: future passive.", "future-passive"]),
      Q("form", "Please wait. Your order ___ right now.", "is being prepared", ["was being prepared", "right now: present.", "pres-cont-passive"], ["has been prepared", "right now: still in progress.", "pres-cont-passive"]),
      Q("form", "The bridge ___ in 1998.", "was built", ["has been built", "in 1998 is a finished time: past simple."], ["was being built", "in 1998 is a finished time, not an action in progress."])] }
};
for (const [id, b] of Object.entries(BANK)) b.items.forEach((it, k) => { it.id = `${id}.${k}`; });

// One shape for every block, whether its lesson lives here or in the Grammar Lab: { name, say, ex, items }.
// Lab checks have no kind; they count as form questions.
export function blockLesson(id) {
  const g = GBLOCKS[id], lab = LAB_BLOCKS[id], bank = BANK[id];
  if (!g) return null;
  const src = bank || lab;
  return { id, name: g.name, say: src.say, ex: src.ex, items: bank ? bank.items : lab.checks.map(c => ({ kind: "form", ...c })) };
}
