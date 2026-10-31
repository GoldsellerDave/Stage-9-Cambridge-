// Stage 9 (Grade 8) curriculum map for SY 2026-27.
// Unit order and dates follow the school's "Grade 8 - ESL - SY26-27" plan; grammar points follow the
// Grade 8 column of the "ESL LS Curriculum – Use of English" overview (lesson numbers as in the overview).
// Objective codes are from the Cambridge Lower Secondary ESL curriculum framework (0876).

import { STAGE } from "./stage.js";
import * as S8 from "./s8/curriculum.js";
export { STAGE };
// Stage 8 (Grade 7) has its own map in js/s8/curriculum.js; the exports at the end pick the device's stage.

// The school year in order. kind: "unit" has practice; "writing", "exam", "revision" are shown as markers.
const SEQUENCE9 = [
  { kind: "unit", unit: 1, start: "2026-08-13", weeks: "Weeks 1–3" },
  { kind: "writing", title: "Descriptive writing", start: "2026-09-03", weeks: "Weeks 4–6" },
  { kind: "unit", unit: 2, start: "2026-09-21", weeks: "Weeks 7–9" },
  { kind: "writing", title: "Discursive writing", start: "2026-10-05", weeks: "Weeks 10–11" },
  { kind: "unit", unit: 3, start: "2026-10-21", weeks: "Weeks 12–13" },
  { kind: "unit", unit: 4, start: "2026-11-02", weeks: "Weeks 14–16" },
  { kind: "exam", title: "Exam week", start: "2026-11-23", weeks: "Week 17" },
  { kind: "unit", unit: 5, start: "2026-11-30", weeks: "Weeks 18–20" },
  { kind: "writing", title: "Narrative writing", start: "2026-12-14", weeks: "Weeks 21–22" },
  { kind: "unit", unit: 6, start: "2027-01-11", weeks: "Weeks 23–25" },
  { kind: "unit", unit: 7, start: "2027-02-18", weeks: "Weeks 26–28" },
  { kind: "unit", unit: 8, start: "2027-03-08", weeks: "Weeks 29–30" },
  { kind: "unit", unit: 9, start: "2027-03-22", weeks: "Weeks 31–32" },
  { kind: "revision", title: "Revision and exams", start: "2027-04-05", weeks: "Weeks 33–37" }
];

const UNITS9 = {
  1: { title: "Views and voices", reading: ["9Rm.01", "9Rd.01", "9Rd.04", "9Ro.01", "9Ro.02"] },
  2: { title: "Well-being", reading: ["9Rm.01", "9Rd.01", "9Rd.02", "9Rd.04", "9Ro.01"] },
  3: { title: "Tourism", reading: ["9Rm.01", "9Rd.01", "9Rd.04", "9Ro.01"] },
  4: { title: "Science", reading: ["9Rm.01", "9Rd.01", "9Rd.02", "9Rd.04"] },
  5: { title: "Technology", reading: ["9Rm.01", "9Rm.02", "9Rd.01", "9Rd.04"] },
  6: { title: "Rules and laws", reading: ["9Rm.01", "9Rm.02", "9Rd.01", "9Rd.04"] },
  7: { title: "Competition", reading: ["9Rm.01", "9Rd.01", "9Rd.04", "9Ro.01"] },
  8: { title: "The environment", reading: ["9Rm.01", "9Rd.01", "9Rd.03", "9Ro.01"] },
  9: { title: "Achievements and ambitions", reading: ["9Rm.01", "9Rm.02", "9Rd.01", "9Ro.01"] }
};

const OBJECTIVES9 = {
  "9Rm.01": "Understand the main points of short and extended texts.",
  "9Rm.02": "Read a range of extended fiction and non-fiction texts with confidence and enjoyment.",
  "9Rd.01": "Understand specific information and detail in short and extended texts.",
  "9Rd.02": "Understand the detail of an argument in short and extended texts.",
  "9Rd.03": "Recognise, with support, inconsistencies in argument in short and extended texts.",
  "9Rd.04": "Deduce meaning from context and understand some implied meaning, with little or no support.",
  "9Ro.01": "Recognise the opinions of the writer(s) and draw relevant conclusions.",
  "9Ro.02": "Recognise the difference between fact and opinion [including bias].",
  "9Ug.01": "Use a wide range of present simple active forms and passive forms.",
  "9Ug.03": "Use a range of present continuous active forms and an increasing range of passive forms.",
  "9Ug.04": "Use a range of past continuous active forms and begin to use passive forms.",
  "9Ug.05": "Use a range of present perfect active forms and begin to use passive forms.",
  "9Ug.06": "Use present perfect continuous forms.",
  "9Ug.07": "Use a range of active and passive past perfect simple forms.",
  "9Ug.08": "Begin to use past perfect continuous forms.",
  "9Ug.09": "Use a range of future active and passive forms, and use future continuous forms.",
  "9Ug.10": "Begin to use if/if only clauses in third conditionals.",
  "9Ug.11": "Use a range of prepositional and phrasal verbs.",
  "9Ug.12": "Use a range of reported statements and question forms.",
  "9Ug.13": "Begin to use a range of causative forms (e.g. have/get something done).",
  "9Ug.14": "Use an increasing range of past modal forms (must have, can't have, might have) for speculation about the past.",
  "9Ug.15": "Use a range of compound and participle adjectives, comparative structures to indicate degree and intensifying adjectives.",
  "9Uv.01": "Use dependent prepositions following adjectives, nouns and verbs.",
  "9Uv.02": "Use comparative and superlative forms with regular and irregular adverbs and comparative adverb structures.",
  "9Uv.03": "Use a range of abstract nouns, compound nouns, complex noun phrases.",
  "9Us.01": "Use a range of connectives.",
  "9Us.02": "Use a range of relative clauses, including which to refer to the previous clause.",
  "9Us.03": "Use infinitive and gerund forms after a range of verbs, adjectives and prepositions."
};

/* Grammar points. Each item: [sentence with ___ (or "" for "Which sentence is correct?"), correct, wrong, wrong, wrong]. */
const GRAMMAR9 = [
 /* ---------------- Unit 1: Views and voices ---------------- */
 { id: "1.1", unit: 1, title: "-ing forms", code: "9Us.03",
   rule: "Use the -ing form as the subject of a sentence (Reading helps me relax), after prepositions (good at listening) and after verbs such as enjoy, avoid, mind, finish and suggest.",
   items: [
    ["___ to music helps me concentrate.", "Listening", "Listen", "To listening", "Listened"],
    ["She is really good at ___ other people's points of view.", "understanding", "understand", "to understand", "understood"],
    ["Do you mind ___ the window? It's cold.", "closing", "to close", "close", "closed"],
    ["My brother avoids ___ in front of large groups.", "speaking", "to speak", "speak", "spoke"],
    ["Instead of ___ about the problem, try to solve it.", "complaining", "complain", "to complain", "complained"],
    ["", "I'm looking forward to meeting you.", "I'm looking forward to meet you.", "I'm looking forward meet you.", "I'm looking forward to met you."]] },
 { id: "1.3", unit: 1, title: "Present simple and present continuous", code: "9Ug.01",
   rule: "Present simple: habits, facts and routines (She walks to school). Present continuous: actions happening now or around now, and temporary situations (She is walking to school this week because the bus is broken). State verbs (know, believe, want) are rarely continuous.",
   items: [
    ["Teenagers usually ___ more sleep than adults.", "need", "are needing", "needing", "is needing"],
    ["Be quiet! The teacher ___ to the head of year.", "is talking", "talks", "talk", "talking"],
    ["I ___ what you mean, but I don't agree.", "understand", "am understanding", "understanding", "am understand"],
    ["This term we ___ a project about role models.", "are doing", "do", "does", "doing"],
    ["My cousin ___ in Da Nang, but she's staying with us this month.", "lives", "is living", "live", "living"],
    ["", "More and more young people are becoming vegetarian.", "More and more young people become vegetarian now at the moment.", "More and more young people is becoming vegetarian.", "More and more young people are become vegetarian."]] },
 { id: "1.4", unit: 1, title: "Present simple passive", code: "9Ug.01",
   rule: "Form: am / is / are + past participle. Use the passive when the action matters more than who does it (English is spoken in many countries). Add by + person only when it is important.",
   items: [
    ["Millions of messages ___ every minute.", "are sent", "are send", "sent", "is sent"],
    ["The school newspaper ___ by students in Grade 8.", "is written", "is write", "writes", "are written"],
    ["Many decisions ___ by our parents.", "are made", "are make", "make", "is made"],
    ["Vietnamese ___ in our homes, but English is used at school.", "is spoken", "speaks", "is speak", "are spoken"],
    ["Phones ___ to be switched off during exams.", "are expected", "expect", "are expecting", "is expected"],
    ["", "The results are published every Friday.", "The results are publish every Friday.", "The results publish by every Friday.", "The results is published every Friday."]] },
 { id: "1.6", unit: 1, title: "Present continuous passive", code: "9Ug.03",
   rule: "Form: am / is / are + being + past participle. Use it for actions happening now or around now when the action matters more than who does it (The hall is being painted this week).",
   items: [
    ["The old library ___ into a study centre at the moment.", "is being turned", "is turning", "is been turned", "being turned"],
    ["Students' opinions ___ more seriously these days.", "are being taken", "are taking", "are been taken", "is being taken"],
    ["Sorry, you can't use that computer. It ___.", "is being repaired", "is repairing", "repairs", "has being repaired"],
    ["New rules about phones ___ by the school council.", "are being discussed", "are discussing", "being discussed", "is being discuss"],
    ["Right now, the interview ___ live on the radio.", "is being broadcast", "is broadcasting being", "being broadcast", "are being broadcast"],
    ["", "A new sports hall is being built next to the canteen.", "A new sports hall is been built next to the canteen.", "A new sports hall is building by next to the canteen.", "A new sports hall being built next to the canteen."]] },

 /* ---------------- Unit 2: Well-being ---------------- */
 { id: "2.1", unit: 2, title: "Abstract nouns", code: "9Uv.03",
   rule: "Abstract nouns name ideas, feelings and qualities you can't touch: anger, empathy, happiness, self-control. Common endings: -ness (kindness), -ity (creativity), -ment (excitement), -ion (frustration), -ance/-ence (annoyance, patience).",
   items: [
    ["Her ___ with her little brother is amazing. She never shouts.", "patience", "patient", "patiently", "patients"],
    ["He couldn't hide his ___ when he lost the match.", "disappointment", "disappointed", "disappoint", "disappointing"],
    ["___ means understanding how another person feels.", "Empathy", "Empathetic", "Empathise", "Empathetically"],
    ["Regular exercise can reduce stress and improve ___.", "happiness", "happy", "happily", "happier"],
    ["The noise from the building site caused a lot of ___.", "annoyance", "annoyed", "annoying", "annoy"],
    ["Learning to manage your ___ is part of growing up.", "anger", "angry", "angrily", "angered"]] },
 { id: "2.2", unit: 2, title: "Comparative adjectives and adverbs", code: "9Uv.02",
   rule: "Comparatives: -er or more (calmer, more carefully). Irregular: good/well → better, bad/badly → worse, far → further. Make them stronger with much, far or a lot; weaker with a bit or slightly. Use the … the … for two changes together: the more you sleep, the better you feel.",
   items: [
    ["I feel ___ when I get eight hours of sleep.", "much better", "more better", "much good", "more well"],
    ["She speaks English ___ than her older sister.", "more fluently", "fluentlier", "more fluent", "most fluently"],
    ["The ___ you practise, the easier it gets.", "more", "most", "much", "many"],
    ["My cough is ___ today than yesterday.", "a bit worse", "a bit badder", "more bad", "a bit worst"],
    ["He finished the test ___ than anyone else.", "more quickly", "quicklier", "more quick", "most quickly"],
    ["", "Walking to school is far healthier than going by car.", "Walking to school is far more healthier than going by car.", "Walking to school is very healthier than going by car.", "Walking to school is far healthiest than going by car."]] },
 { id: "2.4", unit: 2, title: "Must have, might have, can't have", code: "9Ug.14",
   rule: "Use modal + have + past participle to guess about the past. must have = I'm sure it happened. might/may/could have = maybe it happened. can't/couldn't have = I'm sure it didn't happen.",
   items: [
    ["Her eyes are red. She ___ crying.", "must have been", "can't have been", "must has been", "might be have"],
    ["He ___ the message. He never replied. I'm not sure.", "might not have seen", "must not see", "can't have see", "might not seen"],
    ["You ___ the whole pizza in five minutes! That's impossible.", "can't have eaten", "must have eaten", "can't have eat", "mustn't eaten"],
    ["The ground is wet. It ___ in the night.", "must have rained", "can't have rained", "must rained", "might rain"],
    ["I can't find my keys. I'm not sure, but I ___ them at school.", "might have left", "must leave", "can't have left", "might left"],
    ["", "She can't have finished already: she only started ten minutes ago.", "She can't has finished already: she only started ten minutes ago.", "She mustn't have finish already: she only started ten minutes ago.", "She can't finished already: she only started ten minutes ago."]] },
 { id: "2.5", unit: 2, title: "Strong adjectives and intensifiers", code: "9Ug.15",
   rule: "Strong adjectives already mean 'very': furious (very angry), exhausted (very tired), delighted, terrified, starving. Use absolutely, totally or really with strong adjectives, and very, extremely or a bit with normal adjectives. Don't say 'very furious'.",
   items: [
    ["After the race I was absolutely ___.", "exhausted", "tired", "sleepy", "busy"],
    ["My mum was ___ angry when I came home late.", "extremely", "absolutely", "totally", "completely"],
    ["The film was ___ terrifying. I couldn't watch the ending.", "absolutely", "very", "a bit", "extremely"],
    ["We were ___ delighted with our exam results.", "really", "very", "a bit", "slightly"],
    ["I haven't eaten since breakfast. I'm ___!", "starving", "very starving", "a bit starving", "absolutely hungry"],
    ["", "The view from the top was absolutely amazing.", "The view from the top was very amazing.", "The view from the top was absolutely good.", "The view from the top was a bit amazing."]] },

 /* ---------------- Unit 3: Tourism ---------------- */
 { id: "3.1", unit: 3, title: "Compound nouns and multi-word verbs", code: "9Ug.11",
   rule: "Compound nouns join two words: theme park, day trip, campsite, sightseeing. Multi-word (phrasal) verbs have a verb + particle with a new meaning: set off (start a journey), check in, look forward to, put up (a tent), get away.",
   items: [
    ["We set ___ early to avoid the traffic.", "off", "up", "in", "on"],
    ["Don't forget to bring the ___ basket for lunch.", "picnic", "picnicking", "picnics", "picnicked"],
    ["It took us an hour to put ___ the tent in the rain.", "up", "off", "away", "on"],
    ["Our hotel was so full that we couldn't check ___ until 3 p.m.", "in", "out", "off", "up"],
    ["I'm really looking forward ___ the school trip.", "to", "for", "at", "on"],
    ["We spent the whole afternoon ___ in the old town.", "sightseeing", "sight seeing", "sightseeings", "sightsee"]] },
 { id: "3.3", unit: 3, title: "Past continuous passive", code: "9Ug.04",
   rule: "Form: was / were + being + past participle. Use it for an action in progress in the past when the action matters more than who did it (The road was being repaired when we arrived).",
   items: [
    ["When we arrived, our room ___.", "was still being cleaned", "was still cleaning", "still cleaned", "was still been cleaned"],
    ["The museum was closed because a new exhibition ___.", "was being set up", "was setting up", "is being set up", "were being set up"],
    ["While the tourists ___ around the palace, it started to rain.", "were being shown", "were showing", "was being shown", "were be shown"],
    ["I felt like I ___ the whole time I was in the market.", "was being watched", "was watching", "watched", "was been watched"],
    ["At 6 p.m. yesterday, the boats ___ for the evening tour.", "were being prepared", "were preparing", "was being prepared", "were being prepare"],
    ["", "The bridge was being repaired, so we took a different route.", "The bridge was repairing, so we took a different route.", "The bridge being repaired, so we took a different route.", "The bridge was been repaired, so we took a different route."]] },
 { id: "3.4", unit: 3, title: "Compound adjectives", code: "9Ug.15",
   rule: "Compound adjectives join two words with a hyphen before a noun: a five-star hotel, a two-week holiday, a well-known beach, a world-famous temple. Numbers stay singular: a ten-minute walk (not ten-minutes).",
   items: [
    ["We stayed in a ___ hotel near the beach.", "five-star", "five-stars", "five star's", "stars-five"],
    ["It's only a ___ walk to the old town.", "ten-minute", "ten-minutes", "ten minutes'", "minute-ten"],
    ["Ha Long Bay is a ___ tourist destination.", "world-famous", "famous-world", "world-famously", "world fame"],
    ["She bought a ___ ticket that lets her travel all week.", "seven-day", "seven-days", "day-seven", "seven-dayly"],
    ["The guide told us about a ___ writer who lived here.", "well-known", "good-known", "well-knowing", "known-well"],
    ["Pack ___ clothes: it gets cold at night in the mountains.", "warm, long-sleeved", "warm, long-sleeve's", "warm, sleeved-long", "warm, long-sleeving"]] },
 { id: "3.6", unit: 3, title: "Participle adjectives (-ed and -ing)", code: "9Ug.15",
   rule: "-ed adjectives describe how a person feels (I was bored). -ing adjectives describe the thing or person that causes the feeling (The tour was boring).",
   items: [
    ["The bus journey was so long and ___.", "tiring", "tired", "tire", "tiredly"],
    ["We were ___ by the size of the cathedral.", "amazed", "amazing", "amaze", "amazes"],
    ["I find visiting museums really ___.", "interesting", "interested", "interest", "interestedly"],
    ["The children were ___ when the show was cancelled.", "disappointed", "disappointing", "disappoint", "disappointment"],
    ["Getting lost in a new city can be quite ___.", "frightening", "frightened", "fright", "frighten"],
    ["", "I was confused by the map because it was confusing.", "I was confusing by the map because it was confused.", "I was confused by the map because it was confused.", "I was confusing by the map because it was confusing."]] },

 /* ---------------- Unit 4: Science ---------------- */
 { id: "4.1", unit: 4, title: "Conjunctions", code: "9Us.01",
   rule: "Conjunctions join ideas. Contrast: although, though, whereas, while. Reason: because, since, as. Result: so. Condition: unless (= if not), as long as. Despite and in spite of are followed by a noun or -ing form, not a full clause.",
   items: [
    ["___ zoos protect some species, many animals suffer in captivity.", "Although", "Despite", "Because", "Unless"],
    ["The disease will spread ___ people stay at home.", "unless", "although", "whereas", "despite"],
    ["Some people see many colours, ___ colour-blind people see fewer.", "whereas", "unless", "so", "because"],
    ["___ being extinct in the wild, the animal survives in zoos.", "Despite", "Although", "Whereas", "Unless"],
    ["We had to wear masks ___ the virus spreads through the air.", "because", "although", "unless", "despite"],
    ["", "Although it was raining, the scientists continued their research.", "Despite it was raining, the scientists continued their research.", "Although it was raining, but the scientists continued their research.", "Unless it was raining, the scientists continued their research."]] },
 { id: "4.2", unit: 4, title: "Present simple passive", code: "9Ug.01",
   rule: "Form: am / is / are + past participle. Science writing uses the passive a lot because the process matters more than the person: Light is detected by cells in the retina.",
   items: [
    ["Colours ___ by special cells in the eye called cones.", "are detected", "detect", "are detecting", "is detected"],
    ["Many animals ___ in captivity to protect them.", "are bred", "are breed", "breed", "is bred"],
    ["The samples ___ to the laboratory every morning.", "are sent", "send", "are sending", "is sent"],
    ["Influenza ___ from person to person through the air.", "is spread", "spreads by", "is spreading by", "are spread"],
    ["The results ___ carefully before they are published.", "are checked", "check", "are checking", "is checked"],
    ["", "Vaccines are given to millions of children every year.", "Vaccines are give to millions of children every year.", "Vaccines give to millions of children every year.", "Vaccines is given to millions of children every year."]] },
 { id: "4.3", unit: 4, title: "Present perfect continuous", code: "9Ug.06",
   rule: "Form: have / has been + -ing. Use it for an activity that started in the past and is still going on, or has just stopped with a result you can see. It often goes with for and since: Scientists have been studying this disease for ten years.",
   items: [
    ["Researchers ___ the animals since 2019.", "have been monitoring", "are monitoring", "monitor", "have monitoring"],
    ["Your eyes are red. ___ at a screen all day?", "Have you been looking", "Are you looking", "Did you looking", "Have you looking"],
    ["She ___ for the science fair for weeks.", "has been preparing", "is preparing", "has preparing", "have been preparing"],
    ["It ___ all morning, so the trip is cancelled.", "has been raining", "is raining since", "rains", "has rain"],
    ["How long ___ English?", "have you been learning", "are you learning", "you have been learning", "do you learn"],
    ["", "We have been waiting for the results for two hours.", "We are waiting for the results for two hours.", "We have been wait for the results for two hours.", "We have waiting for the results for two hours."]] },
 { id: "4.4", unit: 4, title: "Present perfect active and passive", code: "9Ug.05",
   rule: "Active: have / has + past participle (Scientists have discovered a new species). Passive: have / has been + past participle (A new species has been discovered). Use it for past actions with a result now, often with just, already, yet, ever.",
   items: [
    ["A cure for the disease ___ yet.", "hasn't been found", "hasn't found", "didn't been found", "hasn't been find"],
    ["Scientists ___ just ___ a new type of frog.", "have / discovered", "have been / discovered", "has / discover", "are / discovered"],
    ["More than 50 cases ___ this week.", "have been reported", "have reported", "has been reported", "are been reported"],
    ["The animals ___ to a larger enclosure.", "have been moved", "have moved them", "has been moved", "have been move"],
    ["___ you ever ___ a real skeleton?", "Have / seen", "Have / been seen", "Did / seen", "Has / seen"],
    ["", "The vaccine has already been tested on thousands of people.", "The vaccine has already tested on thousands of people.", "The vaccine has already been test on thousands of people.", "The vaccine have already been tested on thousands of people."]] },
 { id: "4.6", unit: 4, title: "Dependent prepositions after verbs", code: "9Uv.01",
   rule: "Many verbs are followed by a fixed preposition: depend on, suffer from, protect from, recover from, believe in, rely on, consist of, result in, apply for. Learn them as one unit.",
   items: [
    ["Many people suffer ___ hay fever in spring.", "from", "of", "with", "by"],
    ["Whether the animals survive depends ___ the weather.", "on", "of", "from", "in"],
    ["It took him three weeks to recover ___ the flu.", "from", "of", "on", "after"],
    ["The human eye consists ___ many different parts.", "of", "in", "from", "with"],
    ["Too much screen time can result ___ poor sleep.", "in", "to", "on", "from"],
    ["Plants rely ___ insects to carry their pollen.", "on", "at", "of", "for"]] },

 /* ---------------- Unit 5: Technology ---------------- */
 { id: "5.1", unit: 5, title: "Relative clauses", code: "9Us.02",
   rule: "Use who for people, which for things, whose for possession, where for places. Defining clauses have no commas. Non-defining clauses add extra information between commas, and which can refer to a whole previous clause: He fixed my laptop, which was really kind.",
   items: [
    ["The engineer ___ designed this robot is only 19.", "who", "which", "whose", "where"],
    ["This is the app ___ helps you learn new words.", "which", "who", "whose", "where"],
    ["She's the student ___ invention won the prize.", "whose", "who", "which", "that's"],
    ["That's the lab ___ the first prototype was built.", "where", "which", "who", "whose"],
    ["My phone stopped working, ___ was really annoying.", "which", "that", "what", "who"],
    ["", "Our teacher, who loves technology, set up a coding club.", "Our teacher who loves technology, set up a coding club.", "Our teacher, which loves technology, set up a coding club.", "Our teacher, that loves technology, set up a coding club."]] },
 { id: "5.2", unit: 5, title: "Expressing the future (including the future passive)", code: "9Ug.09",
   rule: "will for predictions and decisions (Robots will do many jobs). going to for plans and evidence (I'm going to study engineering). Present continuous for arrangements. Future passive: will be + past participle (Cars will be driven by computers).",
   items: [
    ["In 20 years, most cars ___ by computers.", "will be driven", "will drive", "will be drive", "are going to drive"],
    ["Look at those clouds. It ___ rain.", "is going to", "will be", "is raining to", "will going to"],
    ["I ___ my cousin at the airport at 6 p.m. tomorrow. It's arranged.", "am meeting", "meet", "will be meet", "am going meet"],
    ["The new phones ___ next month.", "will be released", "will release", "are releasing by", "will released"],
    ["I think computers ___ even smaller in the future.", "will get", "are getting", "will be got", "get"],
    ["", "The results will be announced on Friday.", "The results will announced on Friday.", "The results will be announce on Friday.", "The results are going to be announce on Friday."]] },
 { id: "5.4", unit: 5, title: "To have something done", code: "9Ug.13",
   rule: "Use have / get + object + past participle when someone else does a job for you: I had my phone repaired (a technician repaired it). It works in every tense: I'm having my hair cut tomorrow.",
   items: [
    ["My screen was broken, so I ___ it ___ at the shop.", "had / repaired", "had / repair", "repaired / had", "have / repairing"],
    ["We're ___ solar panels ___ on our roof next week.", "having / installed", "having / install", "installing / had", "have / installed"],
    ["You should ___ your eyes ___ if you get headaches.", "get / tested", "get / test", "test / got", "getting / tested"],
    ["She ___ her laptop ___ every year.", "has / serviced", "has / service", "services / had", "is / serviced"],
    ["Where did you ___ your photos ___?", "have / printed", "have / print", "print / had", "had / printed"],
    ["", "I'm going to have my old computer recycled.", "I'm going to have recycled my old computer by.", "I'm going to have my old computer recycle.", "I'm going to recycle my old computer had."]] },
 { id: "5.6", unit: 5, title: "Future continuous", code: "9Ug.09",
   rule: "Form: will be + -ing. Use it for an action in progress at a time in the future: This time next year, I'll be studying at high school.",
   items: [
    ["This time tomorrow, we ___ to Singapore.", "will be flying", "will fly", "are flying to be", "will be fly"],
    ["Don't call at 8 p.m. I ___ dinner.", "will be having", "will have been", "am have", "will be have"],
    ["In ten years, many people ___ from home.", "will be working", "will be work", "are going work", "will working"],
    ["___ you ___ the laptop this afternoon? Can I borrow it?", "Will / be using", "Will / use be", "Are / be using", "Will / using"],
    ["At midnight, the robot ___ the floors.", "will be cleaning", "will be cleaned it", "will cleaning", "will be clean"],
    ["", "This time next week, I'll be lying on a beach.", "This time next week, I'll lying on a beach.", "This time next week, I'll be lie on a beach.", "This time next week, I be lying on a beach."]] },

 /* ---------------- Unit 6: Rules and laws ---------------- */
 { id: "6.1", unit: 6, title: "Passive verbs followed by an infinitive", code: "9Us.03",
   rule: "Some passive verbs are followed by to + infinitive: be allowed to, be supposed to, be expected to, be required to, be made to, be asked to. Students are not allowed to use phones in class.",
   items: [
    ["Students are not allowed ___ their phones in exams.", "to use", "using", "use", "used"],
    ["We are supposed ___ our homework by Friday.", "to hand in", "handing in", "hand in", "handed in"],
    ["Visitors are asked ___ quiet in the library.", "to keep", "keeping", "keep", "kept"],
    ["He was made ___ the classroom after school.", "to tidy", "tidying", "tidy", "tidied"],
    ["All players are expected ___ on time.", "to arrive", "arriving", "arrive", "arrived"],
    ["", "Drivers are required to wear a seat belt.", "Drivers are required wearing a seat belt.", "Drivers are required wear a seat belt.", "Drivers required to wearing a seat belt."]] },
 { id: "6.3", unit: 6, title: "Reported questions and statements", code: "9Ug.12",
   rule: "In reported speech, move the tense back (am → was, will → would, have done → had done) and change pronouns. Reported questions use statement word order with no question mark: She asked where I lived. Yes/no questions use if or whether.",
   items: [
    ["\"I am tired.\" → She said she ___ tired.", "was", "is", "has been", "were"],
    ["\"Where do you live?\" → He asked me where ___.", "I lived", "did I live", "do I live", "I live?"],
    ["\"Will you help me?\" → She asked ___ help her.", "if I would", "will I", "would I", "if I will to"],
    ["\"We have finished.\" → They said they ___.", "had finished", "have finished", "finished had", "has finished"],
    ["\"Why are you late?\" → The teacher asked why I ___ late.", "was", "am", "were I", "was I"],
    ["", "He asked me whether I had seen the film.", "He asked me had I seen the film.", "He asked me whether had I seen the film?", "He asked me if I have saw the film."]] },
 { id: "6.4", unit: 6, title: "Third conditional", code: "9Ug.10",
   rule: "Form: If + past perfect, would have + past participle. Use it to imagine a different past: If I had studied, I would have passed. If only + past perfect shows regret: If only I had listened!",
   items: [
    ["If I ___ earlier, I wouldn't have missed the bus.", "had left", "left", "would leave", "have left"],
    ["She ___ the rules if someone had explained them.", "would have followed", "would follow", "had followed", "will have followed"],
    ["If they had asked permission, the teacher ___ yes.", "would have said", "would say", "had said", "would have say"],
    ["If only I ___ to my parents' advice!", "had listened", "listened", "would listen", "have listened"],
    ["We would have won if our best player ___ injured.", "hadn't been", "wasn't", "wouldn't have been", "hasn't been"],
    ["", "If he had told the truth, he wouldn't have got into trouble.", "If he told the truth, he wouldn't have got into trouble.", "If he had told the truth, he wouldn't got into trouble.", "If he would have told the truth, he wouldn't have got into trouble."]] },
 { id: "6.6", unit: 6, title: "Past continuous", code: "9Ug.04",
   rule: "Form: was / were + -ing. Use it for an action in progress in the past, often interrupted by a past simple action: I was doing my homework when the power went off. Use while with two long actions.",
   items: [
    ["I ___ my homework when my phone rang.", "was doing", "did", "were doing", "am doing"],
    ["While we ___ the rules, the head teacher walked in.", "were discussing", "discussed", "was discussing", "are discussing"],
    ["What ___ you ___ at 9 p.m. last night?", "were / doing", "did / doing", "was / do", "were / do"],
    ["They ___ when the teacher came back.", "were still talking", "still talked", "was still talking", "still talking"],
    ["The sun ___ and the birds were singing.", "was shining", "shone was", "were shining", "shining"],
    ["", "She was walking home when she saw the accident.", "She walked home when she was seeing the accident.", "She was walk home when she saw the accident.", "She were walking home when she saw the accident."]] },

 /* ---------------- Unit 7: Competition ---------------- */
 { id: "7.1", unit: 7, title: "Past perfect simple and past perfect continuous", code: "9Ug.07",
   rule: "Past perfect simple (had + past participle) shows an action finished before another past action: The match had started when we arrived. Past perfect continuous (had been + -ing) shows how long something went on before a past moment: She had been training for months.",
   items: [
    ["By the time we arrived, the race ___.", "had already started", "already started", "has already started", "was already start"],
    ["She was exhausted because she ___ all day.", "had been training", "has been training", "had trained been", "was trained"],
    ["He ___ never ___ a medal before that day.", "had / won", "has / won", "had / win", "was / won"],
    ["They ___ for two hours when the rain stopped play.", "had been playing", "have been playing", "had played been", "were play"],
    ["I didn't watch the final because I ___ the result.", "had already heard", "already hear", "have already heard", "had already hear"],
    ["", "The team had been practising for weeks before the competition.", "The team has been practising for weeks before the competition.", "The team had been practise for weeks before the competition.", "The team was been practising for weeks before the competition."]] },
 { id: "7.3", unit: 7, title: "Comparatives and superlatives", code: "9Uv.02",
   rule: "Comparatives compare two things (faster, more confident than). Superlatives pick one from a group (the fastest, the most confident). Irregular: good → better → the best; bad → worse → the worst. Use not as … as for a negative comparison.",
   items: [
    ["She is ___ player in the whole school.", "the best", "the better", "the most good", "best"],
    ["Our team played ___ than last week.", "worse", "worst", "more bad", "badder"],
    ["This is ___ race I've ever run.", "the hardest", "the harder", "the most hard", "hardest than"],
    ["He isn't ___ his brother.", "as fast as", "as faster as", "so fast than", "as fast than"],
    ["Who runs ___ in your class?", "the fastest", "the most fast", "fastest than", "more faster"],
    ["", "Swimming is one of the most popular sports in Vietnam.", "Swimming is one of the more popular sport in Vietnam.", "Swimming is one of the most popular sport in Vietnam.", "Swimming is one of the popularest sports in Vietnam."]] },
 { id: "7.4", unit: 7, title: "Past perfect simple, active and passive", code: "9Ug.07",
   rule: "Active: had + past participle (The judges had chosen the winner). Passive: had been + past participle (The winner had been chosen before the end). Use it for something completed before another past moment.",
   items: [
    ["When we got to the stadium, all the tickets ___.", "had been sold", "had sold", "were sold been", "have been sold"],
    ["The winner ___ before the last runner finished.", "had been announced", "had announced", "has been announced", "was announce"],
    ["He realised he ___ his trainers at home.", "had left", "had been left", "has left", "left had"],
    ["The match was cancelled because the pitch ___ by the storm.", "had been damaged", "had damaged", "has been damaged", "had been damage"],
    ["By 2010, the record ___ three times.", "had been broken", "had broken", "has been broken", "was broke"],
    ["", "The trophy had been polished before the ceremony.", "The trophy had polished before the ceremony.", "The trophy had been polish before the ceremony.", "The trophy has been polished before the ceremony yesterday."]] },
 { id: "7.6", unit: 7, title: "Connectives", code: "9Us.01",
   rule: "Connectives link ideas across sentences. Adding: moreover, furthermore, in addition. Contrast: however, on the other hand, nevertheless. Result: therefore, as a result, consequently. They usually come at the start of a sentence, followed by a comma.",
   items: [
    ["Competition can motivate students. ___, it can also cause stress.", "However", "Therefore", "Moreover", "As a result"],
    ["She trained every day. ___, she won the gold medal.", "As a result", "However", "Nevertheless", "On the other hand"],
    ["Sport keeps you fit. ___, it helps you make friends.", "Furthermore", "However", "Therefore", "Nevertheless"],
    ["The team lost every match. ___, they never gave up.", "Nevertheless", "Therefore", "Furthermore", "Consequently"],
    ["Some sports are expensive. ___, others need no equipment at all.", "On the other hand", "Therefore", "Moreover", "As a result"],
    ["", "He was injured; therefore, he could not play in the final.", "He was injured; however, he could not play in the final.", "He was injured; moreover, he could not play in the final, as a result.", "He was injured; nevertheless, he could not play in the final."]] },

 /* ---------------- Unit 8: The environment ---------------- */
 { id: "8.1", unit: 8, title: "Adverbs of frequency", code: null,
   rule: "Adverbs of frequency say how often: always, usually, frequently, often, sometimes, occasionally, rarely, never. They go before the main verb (We usually recycle) but after be (Heatwaves are rarely this long). Review from earlier stages.",
   items: [
    ["Wildfires ___ happen in the dry season.", "frequently", "frequent", "frequency", "frequented"],
    ["We ___ use plastic bags any more. We bring our own.", "rarely", "rare", "rarer", "rarity"],
    ["It is ___ cold enough for frost here.", "occasionally", "occasional", "occasion", "occasioned"],
    ["", "My family always switches off the lights when we go out.", "My family switches always off the lights when we go out.", "Always my family switches off the lights when we go out always.", "My family switches off always the lights when we go out."],
    ["", "Thunderstorms are usually short but heavy.", "Thunderstorms usually are short but heavy usually.", "Thunderstorms are short usually but heavy.", "Usually thunderstorms usually are short but heavy."],
    ["I ___ forget to turn off the tap. It's a good habit.", "never", "ever", "always don't", "not never"]] },
 { id: "8.3", unit: 8, title: "Multi-word verbs", code: "9Ug.11",
   rule: "Multi-word verbs combine a verb with one or two particles: cut down on (reduce), run out of (have none left), throw away, use up, give up, look after, come up with (think of an idea).",
   items: [
    ["We need to cut down ___ the amount of plastic we use.", "on", "off", "out", "up"],
    ["If we don't save water, we'll run out ___ it.", "of", "off", "from", "away"],
    ["Don't throw ___ food. Put it in the compost bin.", "away", "out of", "off", "up"],
    ["The class came up ___ a great idea to save energy.", "with", "on", "for", "to"],
    ["Who looks ___ the school garden in the holidays?", "after", "for", "up", "at"],
    ["We have used ___ all the paper. We need more.", "up", "off", "on", "away"]] },
 { id: "8.4", unit: 8, title: "Verbs followed by -ing", code: "9Us.03",
   rule: "Some verbs are followed by the -ing form: avoid, consider, enjoy, keep, mind, miss, practise, recommend, stop, suggest. We should avoid wasting water.",
   items: [
    ["We should avoid ___ single-use plastic.", "using", "to use", "use", "used"],
    ["Have you considered ___ to school by bike?", "cycling", "to cycle", "cycle", "cycled"],
    ["Scientists recommend ___ the air conditioning at 26°C.", "keeping", "to keep", "keep", "kept"],
    ["She suggested ___ a compost bin for the canteen.", "starting", "to start", "start", "started"],
    ["They kept ___ the river until it was clean.", "cleaning", "to clean", "clean", "cleaned"],
    ["", "I don't mind walking if it helps the planet.", "I don't mind to walk if it helps the planet.", "I don't mind walk if it helps the planet.", "I don't mind to walking if it helps the planet."]] },
 { id: "8.6", unit: 8, title: "Complex noun phrases", code: "9Uv.03",
   rule: "A complex noun phrase packs information around one noun: adjectives before it and a prepositional phrase or clause after it. the serious environmental problems facing coastal cities. The main noun (problems) decides the verb.",
   items: [
    ["The ___ of plastic waste is a global problem.", "growing amount", "amount growing", "grow amount", "amount grows"],
    ["The number of hurricanes in the region ___ increased.", "has", "have", "are", "were"],
    ["A ___ solution would be to plant more trees.", "simple but effective", "simple effective but", "but simple effective", "simply effective but"],
    ["People ___ near the coast are most at risk.", "living", "lives", "who living", "live"],
    ["We need a long-term plan ___ water use.", "for reducing", "reduce", "for reduce", "to reducing"],
    ["", "The rapid melting of Arctic ice worries scientists.", "The rapid melting of Arctic ice worry scientists.", "The melting rapid of Arctic ice worries scientists.", "The rapid melt of Arctic ice worrying scientists."]] },

 /* ---------------- Unit 9: Achievements and ambitions ---------------- */
 { id: "9.1", unit: 9, title: "Relative clauses", code: "9Us.02",
   rule: "who (people), which (things), whose (possession), where (places), when (times). Use which after a comma to comment on a whole clause: She won a scholarship, which surprised everyone.",
   items: [
    ["I want a job ___ I can help people.", "where", "which", "who", "whose"],
    ["She's the athlete ___ coach used to be my teacher.", "whose", "who", "which", "that"],
    ["2020 was the year ___ I started learning the guitar.", "when", "which", "where", "who"],
    ["He passed all his exams, ___ made his parents very proud.", "which", "that", "what", "who"],
    ["The people ___ succeed are often the ones who never give up.", "who", "which", "whose", "where"],
    ["", "My grandmother, who left school at 12, now runs her own business.", "My grandmother who left school at 12, now runs her own business.", "My grandmother, which left school at 12, now runs her own business.", "My grandmother, that left school at 12, now runs her own business."]] },
 { id: "9.2", unit: 9, title: "Connectives", code: "9Us.01",
   rule: "Use connectives to organise ideas: firstly, in addition, however, therefore, as a result, in conclusion. In contrast compares two things; even so means 'despite this'.",
   items: [
    ["___, I would like to thank my family for their support.", "Firstly", "However", "As a result", "Even so"],
    ["She wanted to be a doctor. ___, she failed her science exam twice.", "However", "Therefore", "In addition", "Firstly"],
    ["He practised every day. ___, he became a skilled pianist.", "As a result", "In contrast", "Even so", "However"],
    ["The course is expensive. ___, it is worth the money.", "Even so", "Therefore", "As a result", "Firstly"],
    ["___, hard work matters more than talent.", "In conclusion", "In contrast", "Even so", "For"],
    ["My sister loves maths. ___, I prefer languages.", "In contrast", "Therefore", "As a result", "In addition"]] },
 { id: "9.3", unit: 9, title: "Participle clauses", code: null,
   rule: "A participle clause shortens a sentence. -ing for an action at the same time or a reason (Feeling nervous, she walked on stage). Past participle for a passive meaning (Written in 1960, the book is still popular). Having + past participle for an earlier action (Having finished school, he joined the army). Extension point for Stage 9.",
   items: [
    ["___ hard for months, she finally passed the test.", "Having worked", "Worked", "Having work", "To work"],
    ["___ in 1990, the company now employs thousands.", "Founded", "Founding", "Having founding", "Found"],
    ["___ nervous, he forgot his speech.", "Feeling", "Felt", "Having feel", "To feel"],
    ["___ the race, she lifted her arms in the air.", "Having won", "Won", "Having win", "Winning had"],
    ["___ by his teacher, he applied to university.", "Encouraged", "Encouraging", "Having encourage", "Encourage"],
    ["", "Not knowing what to say, she smiled politely.", "Not knew what to say, she smiled politely.", "Knowing not what to say, she smiled politely by.", "Not to knowing what to say, she smiled politely."]] },
 { id: "9.4", unit: 9, title: "Reported speech: statements", code: "9Ug.12",
   rule: "Use say (with no object) or tell + person. Move the tense back: present → past, past → past perfect, will → would, can → could. Change time words: today → that day, tomorrow → the next day.",
   items: [
    ["\"I want to be an engineer.\" → He said he ___ to be an engineer.", "wanted", "wants", "has wanted", "is wanting"],
    ["She ___ me that she had won a scholarship.", "told", "said", "spoke", "talked"],
    ["\"I can play three instruments.\" → She said she ___ three instruments.", "could play", "can play", "could played", "can played"],
    ["\"We'll start tomorrow.\" → They said they would start ___.", "the next day", "tomorrow", "yesterday", "the day before"],
    ["\"I passed my driving test.\" → He said he ___ his driving test.", "had passed", "passed had", "has passed", "was pass"],
    ["", "My coach said that I was ready for the competition.", "My coach said me that I was ready for the competition.", "My coach told that I was ready for the competition.", "My coach said that I am ready for the competition yesterday."]] },
 { id: "9.6", unit: 9, title: "Dependent prepositions after adjectives", code: "9Uv.01",
   rule: "Many adjectives take a fixed preposition: proud of, good at, interested in, keen on, afraid of, responsible for, capable of, excited about, famous for.",
   items: [
    ["My parents are very proud ___ my results.", "of", "for", "about", "with"],
    ["She's really good ___ solving problems.", "at", "in", "on", "for"],
    ["Are you interested ___ studying abroad?", "in", "on", "at", "for"],
    ["He is responsible ___ organising the fundraiser.", "for", "of", "to", "about"],
    ["I'm really excited ___ starting high school.", "about", "for", "on", "with"],
    ["Hoi An is famous ___ its lanterns.", "for", "of", "with", "by"]] }
];

const S8_ON = STAGE === 8;
export const SEQUENCE = S8_ON ? S8.SEQUENCE : SEQUENCE9;
export const UNITS = S8_ON ? S8.UNITS : UNITS9;
export const OBJECTIVES = S8_ON ? S8.OBJECTIVES : OBJECTIVES9;
export const GRAMMAR = S8_ON ? S8.GRAMMAR : GRAMMAR9;
