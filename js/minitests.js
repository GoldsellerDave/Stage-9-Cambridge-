// Unit checkpoint mini tests: the gate at the end of each unit on the Road to Checkpoint.
// Four parts in Checkpoint style, 16 questions: reading (a new short text), listening (a new recording),
// vocabulary and grammar from the unit. No hints; the first option is correct and options are shuffled on screen.
// Pass mark 70%. A unit without a mini test keeps its final challenge as the gate (see js/trail.js).
// The listening scripts are recorded by tools/make_listening_audio.py, like the unit listening tasks.
import { STAGE } from "./stage.js";
import * as S8 from "./s8/minitests.js";
import { TIMES } from "./listening-times.js";
export const MINI_PASS = 0.7;
export const MINI_XP = { right: 5, firstPass: 40 };

const NARRATOR = "bm_george";
const MINI_LISTENING9 = [
 { id: "m2-water", unitNo: 2, topic: "Teenagers and water",
   voices: { NARRATOR, PRESENTER: "bf_isabella", DOCTOR: "bf_emma" },
   lines: [
   ["NARRATOR", "You will hear a radio interview with a doctor about teenagers and drinking water. For each question, choose the correct answer."],
   ["PRESENTER", "Today on Healthy Teens, I'm talking to Doctor Linh Tran. Doctor Tran, why are you worried about teenagers and water?"],
   ["DOCTOR", "Well, we did a survey at three schools in our city, and we found that more than half of the students drank less than one litre of water a day. That's about half of what most teenagers need."],
   ["PRESENTER", "Does that really matter?"],
   ["DOCTOR", "It does. Even a small lack of water can give you a headache and make it harder to concentrate. A lot of students told us they felt tired in the afternoon, and they thought it was because of sleep. But in many cases, it was simply because they weren't drinking enough."],
   ["PRESENTER", "So what should they drink? Fizzy drinks? Juice?"],
   ["DOCTOR", "Juice isn't terrible, but it contains a lot of sugar, so one small glass a day is enough. Fizzy drinks are the worst choice. Plain water is the best, and it's free."],
   ["PRESENTER", "Any tips for our listeners?"],
   ["DOCTOR", "Yes. Don't wait until you feel thirsty, because by then your body is already short of water. Carry a bottle with you and refill it at break time. One school in our survey put water fountains in every corridor, and the students there drank twice as much as anyone else."],
   ["PRESENTER", "Thank you, Doctor Tran."]] },
 { id: "m3-springs", unitNo: 3, topic: "A day at the hot springs",
   voices: { NARRATOR, GUIDE: "bm_daniel" },
   lines: [
   ["NARRATOR", "You will hear a tour guide talking to a group of students on a school trip. For each question, choose the correct answer."],
   ["GUIDE", "Right, everyone, welcome to the Thac Mo hot springs. We're staying here until three o'clock, so you have plenty of time. The bus leaves from this car park, so please be back here by quarter to three."],
   ["GUIDE", "Let me tell you a little about the springs. The water comes from deep underground, and it's around forty degrees, so it's like a hot bath. People have been coming here for hundreds of years, because they believe the water is good for tired muscles."],
   ["GUIDE", "Now, a few important things. You can swim in the two large pools, but the small pool at the top is far too hot for swimming, so please just look at it. And don't forget your sun cream: there isn't much shade near the pools."],
   ["GUIDE", "Lunch is at half past twelve in the restaurant next to the gift shop. If you've brought a picnic basket, that's fine too. You can eat on the grass by the river, but please take your rubbish with you."],
   ["GUIDE", "Oh, and one more thing. There are monkeys in the trees above the river. They're used to people, but they will try to take your food. So keep your bags closed, and never feed them."]] }
];

const MINI9 = {
 2: { id: "mini-u2", unit: 2, title: "Unit 2 checkpoint",
  reading: { title: "Lunch at Riverside School", paras: [
   ["A", "Two years ago, most students at Riverside School bought their lunch from a small shop by the school gate. The shop sold crisps, fizzy drinks and fried chicken, and it was always busy. But teachers noticed a problem: after lunch, many students were tired and found it hard to concentrate."],
   ["B", "So the school decided to act. Its kitchen now cooks fresh meals every day: rice, vegetables, fish or beans, and fruit. There is always a vegetarian dish. The price is kept low so that families with little money can afford it, and for some students lunch is free."],
   ["C", "Not everyone was happy at first. Many students complained that the new food was boring, and some still went to the shop. So the cooks asked students to help plan the menu, and a group of older students started a taste test every Friday. Within a term, the number of students eating school lunch had doubled."],
   ["D", "Today, fewer students fall asleep in afternoon lessons, and the school nurse says fewer students come to her with headaches. \"It isn't magic,\" says the head cook, Ms Hoa. \"Good nutrition simply gives young people the energy they need. The hardest part was getting them to try it.\""]],
   gloss: "concentrate: think carefully about what you are doing",
   qs: [
    { skill: "Main idea", stem: "What is the text mainly about?", opts: ["How a school improved the food its students ate", "Why a shop by the school gate closed", "How to cook cheap vegetarian meals", "Why teenagers fall asleep in class"] },
    { skill: "Detail", stem: "Why does the school keep the price of lunch low?", opts: ["So that families with little money can pay for it", "Because the food is not very good", "So that the shop by the gate closes", "Because students cook the food themselves"] },
    { skill: "Vocabulary in context", stem: "In paragraph C, \"complained\" is closest in meaning to…", opts: ["said they were unhappy", "asked politely", "agreed strongly", "forgot quickly"] },
    { skill: "Inference", stem: "What does Ms Hoa suggest in paragraph D?", opts: ["Changing students' habits was harder than cooking the food.", "The new food works like medicine.", "Students should cook their own lunch.", "The school does not need a nurse any more."] }] },
  listening: { id: "m2-water", qs: [
    { skill: "Listening", stem: "How much water did more than half of the students drink each day?", opts: ["Less than one litre", "About two litres", "Half a litre of juice", "More than they needed"] },
    { skill: "Listening", stem: "Why did many students feel tired in the afternoon, according to Dr Tran?", opts: ["They were not drinking enough water.", "They were not sleeping enough.", "They were eating too much sugar.", "They had too many lessons."] },
    { skill: "Listening", stem: "What does Dr Tran say about juice?", opts: ["It is fine in small amounts.", "It is the worst choice.", "It is better than water.", "Teenagers should never drink it."] },
    { skill: "Listening", stem: "What happened at the school with water fountains?", opts: ["Students drank twice as much water.", "Students stopped buying juice.", "Students had fewer headaches.", "Students brought their own bottles."] }] },
  vocab: [
    { word: "undernourished", stem: "Children who are ___ do not get enough food to stay healthy.", opts: ["undernourished", "vegetarian", "competitive", "empathetic"] },
    { word: "immune system", stem: "Your ___ protects your body by fighting bacteria and viruses.", opts: ["immune system", "calories", "food waste", "self-control"] },
    { word: "self-control", stem: "She showed great ___ when she stayed calm after losing the match.", opts: ["self-control", "annoyance", "obesity", "infection"] },
    { word: "empathetic", stem: "A good friend is ___: they understand how you feel.", opts: ["empathetic", "badly behaved", "annoying", "competitive"] }],
  grammar: [
    { point: "2.1", stem: "Her ___ helped her to win the speaking competition.", opts: ["confidence", "confident", "confidently", "confide"] },
    { point: "2.2", stem: "The new school menu is ___ than the old one.", opts: ["much healthier", "more healthier", "much healthy", "more health"] },
    { point: "2.4", stem: "He ___ eaten his breakfast. His plate is still full.", opts: ["can't have", "must have", "has to", "must be"] },
    { point: "2.5", stem: "The film was ___ terrifying. I couldn't sleep afterwards.", opts: ["absolutely", "very", "a bit", "fairly"] }] },
 3: { id: "mini-u3", unit: 3, title: "Unit 3 checkpoint",
  reading: { title: "A different kind of day trip", paras: [
   ["A", "Most visitors to the coast spend their day on crowded beaches or at the new theme park. But a small group of fishermen in the village of Bai Xanh have started offering something different: a day trip that shows visitors how their community really lives."],
   ["B", "The tour begins at six in the morning, when visitors join the fishermen on their boats. Later, they help to mend nets, learn to cook a simple fish soup and eat lunch with a local family. Groups are limited to eight people, and visitors are asked to leave plastic bottles at the harbour."],
   ["C", "The idea came from Mr Tuan, a fisherman whose income had fallen as fish became harder to find. \"Tourists were coming anyway,\" he explains, \"but the money went to big hotels in the city. Now families here earn money too, and young people don't have to leave the village to find work.\""],
   ["D", "Not everyone is convinced. Some villagers worry that more visitors will bring noise and litter. Mr Tuan agrees that the tours must stay small. \"If we have too many tourists, we will lose the thing they came to see,\" he says."]],
   gloss: "mend: repair something that is broken or torn",
   qs: [
    { skill: "Main idea", stem: "What is the text mainly about?", opts: ["A village tour that helps local people earn money", "How to catch fish with a net", "Why theme parks are popular", "A new hotel near the coast"] },
    { skill: "Detail", stem: "What are visitors asked to do?", opts: ["Leave plastic bottles at the harbour", "Bring their own lunch", "Arrive the night before", "Pay the fishermen in advance"] },
    { skill: "Cause and effect", stem: "Why did Mr Tuan start the tours?", opts: ["He was earning less from fishing.", "A hotel asked him to help.", "His family wanted to move to the city.", "Tourists complained about the beaches."] },
    { skill: "Writer's view", stem: "What does Mr Tuan mean in paragraph D?", opts: ["Too many visitors would spoil the village.", "The village needs many more tourists.", "Tourists should visit other places.", "The tours are too expensive."] }] },
  listening: { id: "m3-springs", qs: [
    { skill: "Listening", stem: "When must the students be back at the car park?", opts: ["At quarter to three", "At three o'clock", "At half past twelve", "At quarter past three"] },
    { skill: "Listening", stem: "Why do people believe the water is good for them?", opts: ["It helps tired muscles.", "It is very clean.", "It comes from the river.", "It keeps them cool."] },
    { skill: "Listening", stem: "What are the students not allowed to do?", opts: ["Swim in the small pool", "Swim in the large pools", "Eat lunch by the river", "Visit the gift shop"] },
    { skill: "Listening", stem: "What does the guide say about the monkeys?", opts: ["They will try to take food.", "They are dangerous to people.", "They live near the restaurant.", "They are afraid of people."] }] },
  vocab: [
    { word: "campsite", stem: "The ___ was full of tents and campfires.", opts: ["campsite", "court", "arch", "fresco"] },
    { word: "monitor", stem: "Rangers ___ the number of animals in the park every year.", opts: ["monitor", "neglect", "borrow", "celebrate"] },
    { word: "repellent", stem: "Don't forget your insect ___, or the mosquitoes will bite you.", opts: ["repellent", "conservation", "umbrella", "first-aid"] },
    { word: "medieval", stem: "The castle is ___: it was built about 700 years ago.", opts: ["medieval", "eco", "modern", "annual"] }],
  grammar: [
    { point: "3.1", stem: "Our plane took ___ two hours late because of the storm.", opts: ["off", "up", "out", "over"] },
    { point: "3.3", stem: "When we visited the museum, a new wing ___.", opts: ["was being built", "was building", "built", "was been built"] },
    { point: "3.4", stem: "It was a ___ walk to the waterfall, so we took plenty of water.", opts: ["three-hour", "three-hours", "three hour's", "hours-three"] },
    { point: "3.6", stem: "Everyone was ___ when the monkey stole the guide's hat.", opts: ["amused", "amusing", "amuse", "amusement"] }] }
};

export const MINI_LISTENING = STAGE === 8 ? S8.MINI_LISTENING : MINI_LISTENING9;
// A Stage 8 mini test is the unit gate once its recording has been made; until then the final challenge stays the gate.
export const MINI = STAGE === 8 ? Object.fromEntries(Object.entries(S8.MINI).filter(([, m]) => TIMES[m.listening.id])) : MINI9;

export const PARTS = [["reading", "Reading"], ["listening", "Listening"], ["vocab", "Vocabulary"], ["grammar", "Grammar"]];
// All the questions of a mini test in order, each with its part and what to save in the answer.
export function miniQuestions(unit) {
  const m = MINI[unit]; if (!m) return [];
  return [
    ...m.reading.qs.map(q => ({ ...q, part: "reading" })),
    ...m.listening.qs.map(q => ({ ...q, part: "listening" })),
    ...m.vocab.map(q => ({ ...q, part: "vocab", skill: "Vocabulary", unit })),
    ...m.grammar.map(q => ({ ...q, part: "grammar", skill: "Grammar" }))];
}
export function miniBest(unit, history) {
  const m = MINI[unit]; if (!m) return null;
  const tries = history.filter(h => h.text_id === m.id && h.max_score > 0);
  return tries.length ? Math.max(...tries.map(h => h.score / h.max_score)) : null;
}
export function miniXP(score, max, history, unit) {
  const before = miniBest(unit, history), firstPass = score / max >= MINI_PASS && !(before != null && before >= MINI_PASS);
  return score * MINI_XP.right + (firstPass ? MINI_XP.firstPass : 0);
}
