// Reading content. Each practice text has three levels (Easier, Core, Harder), plus Challenge for Units 2–3, with the same
// paragraph letters, and eight question slots that test the same skill at every level.
// MCQ: the first option is the correct one (options are shuffled on screen).
// Short answer: groups of keyword stems; "need" = how many different groups the answer must hit.
// Texts for other units live in texts-u*.js and are added to PRACTICE_TEXTS below.
import { UNIT2_TEXTS } from "./texts-u2.js";
import { UNIT3_TEXTS } from "./texts-u3.js";
import { UNIT4_TEXTS } from "./texts-u4.js";
import { CHALLENGE } from "./texts-challenge.js";
import { STAGE } from "./stage.js";
import * as S8 from "./s8/content.js";      // Stage 8 (Grade 7) texts and baseline

export const STRATEGY = {
 "Main idea":{name:"Finding the main idea",steps:["Read the first paragraph and the last paragraph again.","Ask: what does almost every paragraph talk about?","Cross out answers that only match one paragraph or one detail.","Choose the answer that covers the whole text."]},
 "Detail":{name:"Scanning for detail",steps:["Underline the key words in the question (times, numbers, names).","Scan the paragraph for the same words or words with the same meaning.","Read the whole sentence, plus the one before and after.","Check every word of your answer matches the text, not only some words."]},
 "Vocabulary in context":{name:"Working out a word from context",steps:["Cover the word. What kind of word would fit in the gap?","Look at the words around it. Is the meaning positive or negative?","Put each option into the sentence in place of the word.","Choose the one that keeps the meaning of the sentence."]},
 "Detail: two points":{name:"Collecting points for a short answer",steps:["Find the paragraph the question points to.","List every separate point you can find, one per line.","Write two different points in your own short words.","Check they are two different ideas, not the same idea twice."]},
 "Inference":{name:"Reading between the lines",steps:["The answer is not written directly in the text.","Find the clue: what does the person say or do?","Clue + what you know = your idea.","Choose the answer the clues support, not one that is only true in real life."]},
 "Cause and effect":{name:"Explaining cause and effect",steps:["Look for linking words: so, because, as a result, also.","Find the cause and what it leads to (the effect). Many answers need both.","Write it as: X happens, so Y happens.","Use words from the text if you are not sure."]},
 "Writer's purpose":{name:"Working out why the writer includes something",steps:["Ask: what does this part do? Give evidence? Give an example? Solve a problem?","Look at what came before. Was it a problem or a solution?","Cross out answers about a different paragraph.","Choose the answer that says what the paragraph does, not only what it says."]},
 "Writer's view":{name:"Finding the writer's opinion",steps:["Look for opinion words: should, unfair, mistaken, usually not.","Ask: whose side is the writer on?","Watch for answers that are too strong (always, entirely, never).","Choose the answer that matches the writer's words in the last paragraph."]}
};


/* ---------- Practice text: teenage sleep (Unit 2 Well-being) ---------- */
const EFFECTS = [
 {label:"concentration",k:["concentrat","focus","attention","pay attention","think clearly"]},
 {label:"memory",k:["forget","remember","memor","retain","learn"]},
 {label:"mood",k:["angry","irritab","annoy","mood","sad","low","grumpy","upset","temper","emotion","unhappy"]},
 {label:"anxiety",k:["anxi","worr","stress","nervous","depress","mental"]},
 {label:"illness",k:["ill","sick","immun","infection","cold","disease"]}];
const PHONE_LIGHT = {ask:"What does the light from the screen do?", label:"light / melatonin",k:["light","screen","bright","daytime","day time","melatonin","hormone","suppress"]};
const PHONE_ALERT = {ask:"What do messages and videos do to your brain?", label:"keeping the brain busy",k:["alert","awake","busy","active","notification","message","video","scroll","stimulat","hour","one more"]};
const SLEEP_LEVELS = [
 { title:"Why can't teenagers get up?", paras:[
  ["A","It is 6.30 on Monday morning. Maya's alarm rings for the third time. She is very tired. Last night she went to bed at ten o'clock, but she could not sleep until after midnight. Her parents think she is lazy. \"Go to sleep earlier!\" her dad says. But scientists say it is not so simple."],
  ["B","Everyone has a body clock. It tells us when to feel sleepy and when to feel awake. In the evening, the body makes a hormone called melatonin. This makes us sleepy. When children become teenagers, their body clock changes. Their bodies make melatonin about two hours later. So many teenagers do not feel sleepy until about 11 p.m., even if they go to bed early."],
  ["C","Teenagers need eight to ten hours of sleep every night. But most teenagers only get about seven hours. This is a problem. Tired students cannot concentrate well in class, and they forget things. They often feel angry, worried or sad. They also get ill more often."],
  ["D","Phones make the problem worse. The light from a screen tells your brain, \"It's still daytime!\" So your body makes even less melatonin. Messages and videos also keep your brain busy. One more video can easily become an hour."],
  ["E","Some schools want to help. In one study in the USA, schools started the day later, at about 8.45. The students slept about 30 minutes more, and their grades got better. You can help yourself at home too. Keep your phone out of your bedroom. Go outside in the morning light. Get up at the same time at weekends."],
  ["F","So, are sleepy teenagers lazy? Usually not. Their body clock is the problem. Teenagers cannot change their body clock, but adults can try to understand them, and good habits can make mornings easier."]],
  gloss:"hormone: a chemical that the body makes to control how it works · habits: things you do again and again" },
 { title:"Why can't teenagers get up?", paras:[
  ["A","It is 6.30 on a Monday morning and Maya's alarm is ringing for the third time. She pulls the blanket over her head. Last night she lay awake until after midnight, even though she went to bed at ten. Her parents think she is simply lazy. \"If you went to sleep earlier, you wouldn't be so tired,\" her dad says every morning. But scientists say the problem is not as simple as that."],
  ["B","Everyone has a body clock: an internal timer that tells us when to feel sleepy and when to feel awake. It works by releasing a hormone called melatonin in the evening. When teenagers reach puberty, this clock shifts. Their bodies begin to release melatonin up to two hours later than a child's or an adult's. As a result, many teenagers do not feel sleepy until around 11 p.m., however early they go to bed."],
  ["C","Teenagers need between eight and ten hours of sleep a night, but surveys suggest that most get around seven, and some get far less. The effects build up over time. Tired students find it harder to concentrate and to remember what they have learned. They are more likely to feel irritable, anxious or low, and they catch colds more easily because their immune system is weaker."],
  ["D","Phones make the situation worse. The blue light from screens tells the brain that it is still daytime, so even less melatonin is produced. Messages and videos also keep the brain alert, and \"just one more video\" can easily become an hour."],
  ["E","Some schools have decided to work with teenagers' body clocks instead of against them. When schools in one American city moved the start of the day later, to around 8.45, researchers found that students slept about half an hour longer, and their grades improved. Experts also suggest simple changes at home: keeping phones out of the bedroom, getting outside in morning daylight, and waking up at a similar time at weekends."],
  ["F","So the next time someone calls a sleepy teenager lazy, they should remember that biology, not laziness, is often to blame. Teenagers cannot change their body clocks, but with a little understanding from adults, and a few sensible habits, mornings could be a lot less painful."]],
  gloss:"puberty: the time when a child's body changes into an adult's" },
 { title:"The myth of the lazy teenager", paras:[
  ["A","At 6.30 on a Monday morning, Maya's alarm sounds for the third time, and for the third time she silences it. She had been in bed by ten the night before, yet she lay staring at the ceiling until well past midnight. To her parents, the explanation is obvious: she is lazy, and the cure is an earlier bedtime. It is a diagnosis repeated in households across the world, and, according to sleep scientists, it is largely mistaken."],
  ["B","The real culprit is the circadian rhythm, the internal clock that regulates when we feel drowsy and when we feel alert. It does so partly by triggering the release of melatonin, the hormone that prepares the body for sleep. During puberty, this rhythm undergoes a significant shift, and melatonin is released as much as two hours later than in children or adults. Consequently, a fifteen-year-old who is sent to bed at ten may simply be unable to fall asleep before eleven, however much they might want to."],
  ["C","The consequences of this mismatch are considerable. Although adolescents require between eight and ten hours of sleep, the majority manage around seven, and a substantial minority far fewer. Over weeks and months, this deficit accumulates. Sleep-deprived students struggle to concentrate and to retain what they have learned; they are more prone to irritability, anxiety and low mood; and their weakened immune systems leave them more vulnerable to infection."],
  ["D","Technology compounds the problem. The blue light emitted by screens suppresses melatonin still further, effectively persuading the brain that night has not yet fallen. Meanwhile, the constant stream of notifications keeps the mind in a state of alertness, and the promise of \"just one more video\" is rarely kept."],
  ["E","A growing number of schools have concluded that it makes more sense to accommodate adolescent biology than to fight it. When schools in one American city delayed their start time to around 8.45, researchers found that students gained roughly half an hour of sleep a night, while their grades improved. Specialists also recommend modest changes at home: banishing phones from the bedroom, seeking out morning daylight, which helps to reset the body clock, and resisting the temptation to sleep until noon at weekends."],
  ["F","None of this means that teenagers bear no responsibility for their habits. Yet the image of the lazy teenager, dragged out of bed by exasperated parents, says more about adults' assumptions than about adolescents' character. Teenagers cannot rewrite their biology; what the adults around them can do is stop mistaking it for a flaw."]],
  gloss:"circadian rhythm: the body's 24-hour clock · exasperated: very annoyed" }
];

const SLEEP_SLOTS = [
 {skill:"Main idea", para:"F", q:[
  {stem:"What is the text mainly about?", opts:["Why teenagers find it hard to sleep early and get up early","How to use your phone less at night so that you can fall asleep sooner","Why Maya's dad is angry with her","How schools in the USA are different from schools in other countries"],
   hint:"Read paragraph A and paragraph F again. Your answer must be true for the whole text, not one paragraph.", focus:"Their body clock is the problem.",
   explain:"The answer is \"Why teenagers find it hard to sleep early and get up early\". Every paragraph is about teenagers and sleep. Phones (D) and schools (E) are only one part of the text."},
  {stem:"What is the text mainly about?", opts:["Why many teenagers struggle with sleep, and what can help","The dangers of using phones at night","How parents can make teenagers go to bed earlier on school nights","A study about school start times in the USA"],
   hint:"Read paragraph A and paragraph F again. Your answer must be true for the whole text, not one paragraph.", focus:"biology, not laziness, is often to blame"},
  {stem:"Which statement best summarises the writer's main argument?", opts:["Teenagers' sleep problems are mainly biological, so adults should respond with understanding rather than blame.","Teenagers should take full responsibility for getting enough sleep, because good habits are simply a matter of choice.","Schools around the world must start the day later.","Phones are the main reason teenagers are tired in the morning."],
   hint:"Look at how the article begins (A) and how it ends (F). The main argument links them.", focus:"stop mistaking it for a flaw"}]},
 {skill:"Detail", para:"B", q:[
  {stem:"When do many teenagers start to feel sleepy?", opts:["At about 11 p.m.","At about 10 p.m.","After midnight","Two hours after dinner"],
   hint:"Look in paragraph B. Find a time in the text.", focus:"So many teenagers do not feel sleepy until about 11 p.m., even if they go to bed early.",
   explain:"The answer is \"at about 11 p.m.\". Paragraph B says: \"many teenagers do not feel sleepy until about 11 p.m.\" Midnight is when Maya fell asleep, and 10 o'clock is when she went to bed."},
  {stem:"According to paragraph B, what happens to the body clock during puberty?", opts:["It releases melatonin up to two hours later.","It stops releasing melatonin in the evening altogether.","It releases melatonin two hours earlier than before.","It makes teenagers sleepy at 10 p.m."],
   hint:"Look in paragraph B for the word \"puberty\". Read the next sentence carefully: earlier or later?", focus:"Their bodies begin to release melatonin up to two hours later than a child's or an adult's."},
  {stem:"What does paragraph B tell us about a fifteen-year-old who is sent to bed at ten?", opts:["They may not be able to fall asleep for about an hour.","They will fall asleep quickly because they are tired after a long school day.","They need more melatonin than an adult.","They are choosing to stay awake."],
   hint:"Find \"fifteen-year-old\" in paragraph B. What does \"unable\" tell you?", focus:"may simply be unable to fall asleep before eleven, however much they might want to"}]},
 {skill:"Vocabulary in context", para:"C", q:[
  {stem:"In paragraph C, \"concentrate\" means…", opts:["think carefully about one thing","sleep in class","talk to friends quietly during the lesson","remember things that happened in the past"],
   hint:"Find \"concentrate\" in paragraph C. What do tired students find hard to do in class?", focus:"Tired students cannot concentrate well in class",
   explain:"The answer is \"think carefully about one thing\". Tired students \"cannot concentrate well in class\": they find it hard to keep their mind on the lesson."},
  {stem:"In paragraph C, \"irritable\" means…", opts:["easily annoyed","very sleepy","easily frightened","unable to remember"],
   hint:"Find \"irritable\" in paragraph C. It is in a list with \"anxious\" and \"low\". What kind of words are they?", focus:"They are more likely to feel irritable, anxious or low"},
  {stem:"In paragraph D, \"Technology compounds the problem.\" \"Compounds\" means…", opts:["makes it worse","explains it","solves it","causes it for the first time"],
   hint:"Read the two sentences after \"compounds\" in paragraph D. Do they make the sleep problem bigger or smaller?", focus:"Technology compounds the problem.", para:"D"}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two problems that tired students have.", groups:EFFECTS, need:2,
   hint:"Look in paragraph C. Find the sentences that begin \"Tired students…\" and \"They…\".", focus:"Tired students cannot concentrate well in class, and they forget things. They often feel angry, worried or sad. They also get ill more often.",
   explain:"Possible answers (any two): they cannot concentrate; they forget things; they feel angry, worried or sad; they get ill more often."},
  {type:"short", stem:"Give two effects of not getting enough sleep.", groups:EFFECTS, need:2,
   hint:"Look in paragraph C, from \"The effects build up over time\" to the end.", focus:"Tired students find it harder to concentrate and to remember what they have learned. They are more likely to feel irritable, anxious or low, and they catch colds more easily because their immune system is weaker."},
  {type:"short", stem:"Identify two consequences of sleep deprivation mentioned in paragraph C.", groups:EFFECTS, need:2,
   hint:"In paragraph C, the consequences come after \"Sleep-deprived students…\". They are separated by semicolons.", focus:"Sleep-deprived students struggle to concentrate and to retain what they have learned; they are more prone to irritability, anxiety and low mood; and their weakened immune systems leave them more vulnerable to infection."}]},
 {skill:"Inference", para:"A", q:[
  {stem:"Maya's dad says, \"Go to sleep earlier!\" What does he think?", opts:["Maya can sleep earlier if she wants to.","Maya has a problem with her body clock and cannot help it.","Maya needs a new alarm that is louder than her old one.","Maya is ill."],
   hint:"Look in paragraph A. What do her parents think about Maya?", focus:"Her parents think she is lazy.",
   explain:"The answer is \"Maya can sleep earlier if she wants to\". Her parents think she is lazy, so her dad believes sleeping earlier is her choice. The body clock idea comes from the scientists, not from her dad."},
  {stem:"What can we infer about Maya from paragraph A?", opts:["She tried to sleep but couldn't.","She stayed up late using her phone.","She went to bed after midnight because she was watching videos.","She doesn't care about school."],
   hint:"Paragraph A: what time did Maya go to bed, and what happened after that?", focus:"Last night she lay awake until after midnight, even though she went to bed at ten."},
  {stem:"Why does the writer say the explanation is \"obvious\" to Maya's parents?", opts:["To show it seems clear to them, although the writer goes on to disagree.","Because the writer agrees that Maya is lazy.","Because scientists have proved that Maya is lazy.","To show that Maya's parents are experts on sleep and know what they are talking about."],
   hint:"Read to the end of paragraph A. What do sleep scientists say about the parents' \"diagnosis\"?", focus:"according to sleep scientists, it is largely mistaken"}]},
 {skill:"Cause and effect", para:"D", q:[
  {type:"short", stem:"Write one way that phones make the sleep problem worse.", groups:[PHONE_LIGHT,PHONE_ALERT], need:1,
   hint:"Look in paragraph D. There are two ways. You only need one.", focus:"The light from a screen tells your brain, \"It's still daytime!\" So your body makes even less melatonin. Messages and videos also keep your brain busy.",
   explain:"Possible answers: the light from the screen makes the body produce less melatonin; messages and videos keep your brain busy."},
  {type:"short", stem:"Explain two ways phones make the situation worse.", groups:[PHONE_LIGHT,PHONE_ALERT], need:2,
   hint:"Paragraph D has two ways. One is about light. The other starts with \"Messages and videos also…\".", focus:"The blue light from screens tells the brain that it is still daytime, so even less melatonin is produced. Messages and videos also keep the brain alert"},
  {type:"short", stem:"Explain two ways in which technology makes teenagers' sleep problems worse.", groups:[PHONE_LIGHT,PHONE_ALERT], need:2,
   hint:"Paragraph D: one way is linked to blue light, the other comes after \"Meanwhile\".", focus:"The blue light emitted by screens suppresses melatonin still further, effectively persuading the brain that night has not yet fallen. Meanwhile, the constant stream of notifications keeps the mind in a state of alertness"}]},
 {skill:"Writer's purpose", para:"E", q:[
  {stem:"Why does the writer talk about schools in the USA?", opts:["To show that starting school later can help students.","To tell readers to study in the USA.","To show that American students are lazier than students in other countries.","To describe a normal school day for teenagers in the USA."],
   hint:"Look in paragraph E. What happened to the students when school started later?", focus:"The students slept about 30 minutes more, and their grades got better.",
   explain:"The answer is \"to show that starting school later can help students\". The students slept more and their grades got better, so the study is evidence that a later start helps."},
  {stem:"Why does the writer include the study in paragraph E?", opts:["To give evidence that a later start can help students.","To prove that phones are bad for sleep.","To compare American schools with schools in other parts of the world.","To show that most schools start too late."],
   hint:"Paragraph E: what did the researchers find? Why would a writer want to report that?", focus:"researchers found that students slept about half an hour longer, and their grades improved"},
  {stem:"What is the function of paragraph E in the article as a whole?", opts:["It moves from explaining the problem to presenting possible solutions, supported by evidence.","It introduces a counter-argument about school start times that the writer then rejects as unrealistic.","It gives a further cause of teenagers' tiredness.","It summarises the writer's conclusion."],
   hint:"Paragraphs B to D explain the problem. What does paragraph E start to do instead?", focus:"it makes more sense to accommodate adolescent biology than to fight it"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about sleepy teenagers?", opts:["It is usually not their fault.","They are lazy.","They should use their phones more.","They do not need much sleep at their age."],
   hint:"Read paragraph F. The writer asks a question and then answers it.", focus:"So, are sleepy teenagers lazy? Usually not.",
   explain:"The answer is \"it is usually not their fault\". The writer asks \"are sleepy teenagers lazy?\" and answers \"Usually not. Their body clock is the problem.\""},
  {stem:"What is the writer's attitude towards teenagers who struggle to get up?", opts:["Sympathetic: biology is often to blame.","Critical: they should go to bed earlier.","Amused: it is a funny teenage habit.","Worried: they will probably fail at school."],
   hint:"Paragraph F: what does the writer say is \"often to blame\"? Is that kind or unkind to teenagers?", focus:"biology, not laziness, is often to blame"},
  {stem:"Which statement best describes the writer's position in paragraph F?", opts:["Teenagers should build good habits, but adults are wrong to see their tiredness as a flaw in character.","Teenagers are entirely to blame for their poor sleep.","Adults are entirely responsible for teenagers' sleep problems.","Biology makes it impossible for teenagers to improve their sleep, so there is no point in trying to change their habits."],
   hint:"Paragraph F has two parts: what the writer admits first, and then the word \"Yet\". Watch out for answers with \"entirely\" or \"impossible\".", focus:"Teenagers cannot rewrite their biology; what the adults around them can do is stop mistaking it for a flaw."}]}
];

const TEXTS9 = [
  { id: "sleep", unitNo: 2, unit: "Unit 2 · Well-being", topic: "Teenagers and sleep",
    blurb: "Why do teenagers find it so hard to get up in the morning?",
    levels: SLEEP_LEVELS, slots: SLEEP_SLOTS },
  ...UNIT2_TEXTS,
  ...UNIT3_TEXTS,
  ...UNIT4_TEXTS
];
export const PRACTICE_TEXTS = STAGE === 8 ? S8.PRACTICE_TEXTS : TEXTS9;
// Texts with a Challenge version get it as a fourth level, and each slot gets its Challenge question.
for (const t of PRACTICE_TEXTS) {
  const c = (STAGE === 8 ? S8.CHALLENGE : CHALLENGE)[t.id];
  if (!c) continue;
  t.levels = [...t.levels, c.level];
  t.slots = t.slots.map((s, i) => {
    const { extra = [], ...q } = c.q[i];
    if (q.type === "short" && !q.groups) q.groups = [...s.q[2].groups, ...extra];
    return { ...s, q: [...s.q, q] };
  });
}

/* ---------- Baseline: three short passages, Easier to Harder, 4 MCQs each, no hints ---------- */
const BASELINE9 = [
 { level: 0, title: "The walk to school", paras: [
  ["A","Last year, Tom's mum drove him to school every day. The journey took ten minutes, and Tom usually looked at his phone in the car. Then his mum started a new job, and she could not drive him any more. Tom was not happy. Now he had to walk for twenty-five minutes."],
  ["B","After a few weeks, Tom noticed something strange. He felt better in the morning. He walked with two friends from his street, and they talked and laughed all the way. He also slept better at night."],
  ["C","Scientists say this is not a surprise. Exercise helps our mood, and being outside in daylight helps our body clock. Talking to friends is good for us too. Now Tom walks to school even when it rains."]],
  gloss: "mood: how you feel (happy, sad, angry…)",
  qs: [
   {skill:"Main idea", stem:"What is the text mainly about?", opts:["How walking to school changed Tom's life for the better","Why Tom's mum got a new job","How to walk safely to school","Why Tom's mum had to stop driving him to school every day"]},
   {skill:"Detail", stem:"How long does Tom's walk to school take?", opts:["Twenty-five minutes","Ten minutes","Two hours","Fifteen minutes"]},
   {skill:"Inference", stem:"How did Tom feel when he first had to walk?", opts:["Unhappy about it","Excited about it","Worried about his mum","Bored with his friends"]},
   {skill:"Writer's view", stem:"What does the writer think about walking to school?", opts:["It is good for you in several ways.","It is a waste of time.","It is only good when the weather is nice.","It is better to go by car."]}]},
 { level: 1, title: "Friends with benefits", paras: [
  ["A","When Lena moved to a new city at fourteen, she expected the hardest part to be her new school. In fact, it was being alone at break time. \"I had hundreds of followers online,\" she says, \"but nobody to sit with.\""],
  ["B","Psychologists who study teenagers say that close friendships protect our mental health. Teenagers who have at least one friend they can trust are less likely to feel anxious or depressed, and they cope better with stress, such as exams or problems at home. As the old saying goes, a problem shared is a problem halved."],
  ["C","Interestingly, the number of friends seems to matter much less than the quality. A few friends who listen and support you are worth more than a long list of online contacts. Face-to-face time is important too: laughing together in person reduces stress hormones in a way that messages cannot."],
  ["D","Lena's story has a happy ending. She joined the school drama club, where she met two girls who are now her closest friends. \"I still use social media,\" she says, \"but now I know what a real friend is.\""]],
  gloss: "cope with: deal with a difficult situation successfully",
  qs: [
   {skill:"Detail", stem:"What was the hardest part of moving for Lena?", opts:["Having nobody to spend time with at school","Studying in a new school","Leaving her online followers","Finding her way around a city she did not know"]},
   {skill:"Vocabulary in context", stem:"In paragraph C, \"quality\" means…", opts:["how good something is","how many there are","how old something is","how expensive something is"]},
   {skill:"Writer's purpose", stem:"Why does the writer include the saying \"a problem shared is a problem halved\"?", opts:["To support the idea that talking to friends helps with stress","To show that Lena had many problems","To explain why teenagers have more problems than adults","To give advice about exams"]},
   {skill:"Inference", stem:"What can we infer from Lena's last words in paragraph D?", opts:["She now values real friendships more than online followers.","She has stopped using social media.","She wants more followers online.","She still feels lonely at school."]}]},
 { level: 2, title: "In defence of boredom", paras: [
  ["A","Boredom has a poor reputation. Parents treat it as a problem to be solved, schools as a sign that a lesson has failed, and teenagers as something to be avoided at all costs, usually by reaching for a phone. Yet a growing body of research suggests that a little boredom may be exactly what our minds need."],
  ["B","In one experiment, participants were first given a deliberately tedious task, such as copying numbers from a phone directory. Afterwards, they were asked to think of as many uses as possible for an everyday object. Those who had been bored produced noticeably more creative ideas than those who had not. The researchers concluded that boredom drives the mind to wander, and a wandering mind makes unexpected connections."],
  ["C","The difficulty is that genuine boredom is becoming rare. With a screen always within reach, every empty moment, whether a bus journey or a queue, is instantly filled. We are rarely bored for long enough to discover what our minds might do with the space."],
  ["D","None of this means that teachers should set out to bore their students. But the next time you feel the familiar urge to fill a quiet moment, it might be worth resisting it. You may find that your most interesting ideas were simply waiting for some room."]],
  gloss: "directory: a book with a list of names and phone numbers",
  qs: [
   {skill:"Main idea", stem:"Which statement best summarises the writer's argument?", opts:["Boredom can be useful, but phones mean we rarely experience it.","Boredom is a serious problem that schools must solve.","Teenagers are bored more often than adults, so they use phones more.","Phones make people more creative."]},
   {skill:"Vocabulary in context", stem:"In paragraph B, \"tedious\" means…", opts:["boring and repetitive","difficult and stressful","short and simple","creative and unusual"]},
   {skill:"Detail", stem:"According to paragraph B, what did the bored participants do better?", opts:["They thought of more creative uses for an object.","They copied numbers more accurately.","They remembered more phone numbers.","They finished the copying task more quickly than the others."]},
   {skill:"Writer's view", stem:"What is the writer's attitude in paragraph D?", opts:["Gently encouraging readers to allow themselves some boredom","Strongly criticising teachers for boring lessons","Worried that boredom harms creativity","Uncertain whether the research is reliable"]}]}
];
export const BASELINE = STAGE === 8 ? S8.BASELINE : BASELINE9;
// Placement from the baseline score (out of 12): 0–5 Easier, 6–9 Core, 10–12 Harder.
export const PLACEMENT = [[0, 5, 0], [6, 9, 1], [10, 12, 2]];
