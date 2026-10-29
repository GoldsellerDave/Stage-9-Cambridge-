// Half-term "Checkpoint checks": like the baseline (no hints, first option correct, shuffled on screen),
// but with four passages, Easier to Challenge, and 16 questions, so a fresh test can place students from A2 to C1+.
// A check opens six weeks after the student's last baseline or check. Add a new set at the end to offer one more.
export const CHECK_GAP_DAYS = 42;
export const CHECKS = [
 { id: "check-1", title: "Checkpoint check 1", passages: [
  { level: 0, title: "The class garden", paras: [
   ["A", "Last spring, Class 7B started a garden behind their school. At first, there was only grass and a few old bottles. The students cleaned the area and planted tomatoes, beans and flowers."],
   ["B", "Every morning before lessons, two students watered the plants. When it was hot, they watered them again after school. One weekend nobody came, and some of the beans died. The class learned that a garden needs care every day."],
   ["C", "In June, the students picked their first tomatoes. They used them to make a salad for the whole school. \"Food tastes better when you grow it yourself,\" said their teacher, Mr Linh. Now other classes want a garden too."]],
   gloss: "plant: put a seed or a young plant in the ground",
   qs: [
    { skill: "Main idea", stem: "What is the text mainly about?", opts: ["How a class made and looked after a garden", "How to make a tomato salad", "Why Mr Linh likes flowers", "Why some beans died in the garden one weekend"] },
    { skill: "Detail", stem: "When did the students water the plants on hot days?", opts: ["Before lessons and after school", "Only at the weekend", "Only after school", "Once a week"] },
    { skill: "Cause and effect", stem: "Why did some of the beans die?", opts: ["Nobody watered them one weekend.", "It rained too much.", "The students picked them too early.", "Other classes took them."] },
    { skill: "Inference", stem: "What can we infer about the other classes?", opts: ["They liked the idea of the garden.", "They did not like tomatoes.", "They wanted to stop the garden.", "They already had their own gardens."] }] },
  { level: 1, title: "Learning by listening", paras: [
   ["A", "When Duc decided to improve his English, he did not buy a new textbook. Instead, he downloaded a podcast for learners and listened to one short episode every day on the bus to school. \"At first I understood almost nothing,\" he admits. \"But I kept going.\""],
   ["B", "Language teachers say that regular listening is one of the best ways to improve. Fifteen minutes every day is more useful than two hours once a week, because the brain needs time and repetition to get used to new sounds and words."],
   ["C", "Podcasts have another advantage: they are flexible. You can listen while you walk, cook or travel, so they fit into a busy timetable. Many learner podcasts also publish transcripts, so listeners can check words they did not catch."],
   ["D", "After six months, Duc noticed a big difference. He could follow films without subtitles, and his test scores improved. \"The secret is not talent,\" he says. \"It's just doing a little bit, every single day.\""]],
   gloss: "transcript: the words of a recording, written down",
   qs: [
    { skill: "Detail", stem: "According to paragraph B, why is listening every day better than once a week?", opts: ["The brain needs time and repetition to get used to new sounds.", "Podcasts are only published once a day.", "Teachers check students every day.", "Long listening sessions once a week are too tiring for the brain."] },
    { skill: "Vocabulary in context", stem: "In paragraph C, \"flexible\" means…", opts: ["easy to fit around other activities", "very difficult to understand", "free to download", "only useful for advanced learners of English"] },
    { skill: "Writer's purpose", stem: "Why does the writer mention transcripts in paragraph C?", opts: ["To show another way podcasts can help learners", "To explain how podcasts are made", "To say that listening is not useful", "To tell readers they should stop watching films with subtitles"] },
    { skill: "Inference", stem: "What does Duc's last comment suggest?", opts: ["Anyone can improve if they practise regularly.", "He is naturally good at languages.", "You need a natural talent for languages to improve quickly.", "He will stop listening to podcasts now."] }] },
  { level: 2, title: "Why songs get stuck in your head", paras: [
   ["A", "Almost everyone has experienced it: a few seconds of a song you heard in a shop replay in your mind for hours, long after you have stopped wanting to hear it. Psychologists call these \"earworms\", and research suggests that more than ninety per cent of people have at least one a week."],
   ["B", "Earworms are not random. Studies have found that the songs most likely to become stuck tend to share certain features: a fairly fast tempo, a simple, easily remembered melody, and a pattern that is familiar but contains an unexpected jump or repetition. In other words, they are predictable enough to remember but surprising enough to hold our attention."],
   ["C", "Our situation matters too. Earworms are more common when we are tired, stressed or doing tasks that require little concentration, such as walking or washing up. In these moments, the mind is free to wander, and a recently heard tune can easily fill the gap."],
   ["D", "Fortunately, there are ways to get rid of an unwanted earworm. One surprisingly effective method is to listen to the whole song, since an unfinished tune seems to bother the brain more than a complete one. Another is to give the mind a moderately challenging task, such as a puzzle, which uses the mental space the song was occupying. Chewing gum, oddly enough, also appears to help, perhaps because it interferes with the \"inner voice\" we use to replay music."]],
   gloss: "tempo: the speed of a piece of music",
   qs: [
    { skill: "Main idea", stem: "Which statement best summarises the text?", opts: ["Earworms are common, have identifiable causes, and can be reduced.", "Fast songs are bad for concentration.", "Most people dislike the music played in shops.", "Chewing gum is the only reliable way to stop a song replaying in your head."] },
    { skill: "Detail", stem: "According to paragraph C, when are earworms more common?", opts: ["When we are tired or doing simple tasks", "When we are concentrating hard", "When we have just listened to the whole song", "When we are chewing gum"] },
    { skill: "Cause and effect", stem: "According to paragraph D, why might listening to the whole song help?", opts: ["The brain is more bothered by an unfinished tune.", "It makes the song less predictable.", "It uses up the inner voice we use to replay music.", "It makes us more tired."] },
    { skill: "Vocabulary in context", stem: "In paragraph D, \"interferes with\" means…", opts: ["gets in the way of", "improves", "depends on", "copies"] }] },
  { level: 3, title: "Bringing back the mammoth?", paras: [
   ["A", "For most of history, extinction has been regarded as the one truly irreversible event in nature. That assumption is now being questioned. Advances in genetic engineering have led several research teams to propose what is known as de-extinction: recreating vanished species, or close approximations of them, by editing the DNA of their living relatives. The woolly mammoth, which disappeared around four thousand years ago, has become the project's unofficial mascot."],
   ["B", "Supporters put forward more than one argument. Some claim that restored species could repair damaged ecosystems; herds of mammoth-like elephants, for instance, might trample snow and knock down trees in the Arctic, helping to keep the frozen ground beneath from thawing. Others argue, more simply, that humanity has a moral obligation to undo the harm it has caused."],
   ["C", "Critics are far from persuaded. An animal engineered in a laboratory, they point out, would at best be a hybrid, not a genuine mammoth, and it would have no parents to teach it how to behave in the wild. More fundamentally, they fear that the promise of de-extinction could weaken the urgency of conservation. If extinction can be reversed, why go to the trouble and expense of protecting species that are still alive?"],
   ["D", "There is also the question of cost. The sums required to resurrect a single species could, conservationists argue, fund the protection of dozens of endangered ones. Seen in that light, de-extinction looks less like a scientific breakthrough than an expensive distraction."],
   ["E", "Perhaps the most reasonable position lies between enthusiasm and outright rejection. The genetic tools being developed may well prove valuable, for example in helping endangered populations resist disease. But they should be treated as a supplement to conservation, not a substitute for it. Preventing extinction will always be cheaper, and more certain, than attempting to reverse it."]],
   gloss: "hybrid: a mix of two different kinds of animal or plant · resurrect: bring back to life",
   qs: [
    { skill: "Writer's view", stem: "Which statement best reflects the writer's overall position?", opts: ["Genetic tools may help, but protecting living species must remain the priority.", "De-extinction should be banned because it is unnatural.", "Bringing back the mammoth is the best way to stop the frozen ground in the Arctic from thawing.", "Conservation has failed, so de-extinction is now necessary."] },
    { skill: "Inference", stem: "What does the critics' question at the end of paragraph C suggest?", opts: ["People might become less willing to protect species that still exist.", "Protecting living species is already too expensive.", "Scientists will soon be able to bring back every species that has ever disappeared.", "Critics want more money to be spent on mammoths."] },
    { skill: "Writer's purpose", stem: "What is the function of paragraph D?", opts: ["It adds a financial argument to the case against de-extinction.", "It explains how de-extinction would work in practice.", "It supports the claim that mammoths could protect the Arctic.", "It summarises both sides of the debate."] },
    { skill: "Vocabulary in context", stem: "In paragraph E, the tools should be \"a supplement to conservation, not a substitute for it\". This means they should…", opts: ["be added to conservation work, not replace it", "replace older conservation methods", "be used only when conservation fails", "be kept completely separate from conservation work"] }] }] },

 { id: "check-2", title: "Checkpoint check 2", passages: [
  { level: 0, title: "The new library", paras: [
   ["A", "Our town opened a new library in September. The old library was small and dark, and it only had books. The new one is big and bright, with large windows and comfortable chairs."],
   ["B", "There is a quiet room for studying and a room with computers. On Saturdays, there is a story club for young children. Teenagers can borrow games as well as books."],
   ["C", "On the first day, more than five hundred people visited. My grandmother went too. She said, \"I didn't think I would like it, but I'm coming back next week.\""]],
   gloss: "borrow: take something and give it back later",
   qs: [
    { skill: "Main idea", stem: "What is the text mainly about?", opts: ["A new library and what it offers", "How to borrow a book", "Why the old library closed", "A story club for young children on Saturdays"] },
    { skill: "Detail", stem: "What can teenagers borrow at the new library?", opts: ["Games and books", "Only books", "Computers", "Chairs"] },
    { skill: "Detail", stem: "What happens on Saturdays?", opts: ["There is a story club for young children.", "The library is closed.", "Teenagers play computer games.", "The grandmother visits."] },
    { skill: "Inference", stem: "What can we infer about the grandmother?", opts: ["She was surprised that she liked the library.", "She did not like the new library.", "She works at the library.", "She prefers the old library because it was quieter."] }] },
  { level: 1, title: "Night markets", paras: [
   ["A", "As the sun goes down in many Asian cities, empty car parks and quiet streets are transformed. Stalls appear, lights are switched on, and within an hour the air is full of the smell of grilled meat, noodles and sweet pancakes. Welcome to the night market."],
   ["B", "Night markets are popular for several reasons. Prices are usually lower than in restaurants, and visitors can try many different dishes in one evening. In hot countries, the cooler evening air also makes shopping and eating outside much more pleasant."],
   ["C", "For stall owners, the markets can be an important source of income. Many are small family businesses that could not afford to rent a shop. Recipes are often passed down from parents to children, and some stalls have been run by the same family for decades."],
   ["D", "However, night markets also face challenges. Some residents complain about noise and rubbish, and in a few cities, markets have been moved or closed. Supporters argue that, with better organisation, these problems can be solved without losing an important part of local culture."]],
   gloss: "stall: a table or small shop in a market",
   qs: [
    { skill: "Detail", stem: "According to paragraph B, why do night markets suit hot countries?", opts: ["The evening air is cooler.", "Restaurants close in the evening.", "Food is cheaper when it is hot.", "Car parks are empty in the heat."] },
    { skill: "Vocabulary in context", stem: "In paragraph A, \"transformed\" means…", opts: ["changed completely", "cleaned carefully", "closed for the night", "made quieter"] },
    { skill: "Inference", stem: "What does paragraph C suggest about family stalls?", opts: ["Cooking traditions are kept alive through families.", "Families would prefer to work in shops.", "Children do not want to learn their parents' recipes any more.", "Stalls change owners every year."] },
    { skill: "Writer's view", stem: "What is the writer's attitude in paragraph D?", opts: ["The problems are real but can be managed.", "All night markets should be closed.", "Residents' complaints are not important.", "Night markets have no problems at all."] }] },
  { level: 2, title: "Why we enjoy being scared", paras: [
   ["A", "Every year, millions of people pay to be frightened. They queue for roller coasters, watch horror films through their fingers and visit haunted houses at theme parks. At first glance, this seems strange: fear is an unpleasant emotion designed to warn us of danger. Why would anyone choose to feel it?"],
   ["B", "Part of the answer lies in the body's reaction. When we are frightened, we release adrenaline, which raises the heart rate and sharpens the senses. Once the danger is over, this is often followed by a rush of relief and even happiness. The key is that the danger is not real: our brain knows we are safe, so we can enjoy the physical excitement without the actual risk."],
   ["C", "Researchers have also found that shared fear can bring people closer. Friends who scream together on a ride or jump at the same moment in a film often report feeling more connected afterwards. Some psychologists suggest that facing a controlled fear can even build confidence, as people prove to themselves that they can cope."],
   ["D", "Not everyone enjoys the experience, however. For some people, frightening films cause anxiety that lasts long after the credits have rolled. As with many pleasures, the enjoyment of fear seems to depend on the right amount, and on knowing that you can stop whenever you want."]],
   gloss: "adrenaline: a chemical the body makes when you are frightened or excited",
   qs: [
    { skill: "Main idea", stem: "Which statement best summarises the text?", opts: ["People can enjoy fear when they feel safe, though it does not suit everyone.", "Horror films are dangerous for young people.", "Roller coasters are more frightening than horror films because the danger is real.", "Fear always builds confidence."] },
    { skill: "Cause and effect", stem: "According to paragraph B, why can people enjoy frightening experiences?", opts: ["They know they are not really in danger.", "Adrenaline makes the danger disappear.", "They cannot feel their heart rate.", "Their bodies do not release adrenaline."] },
    { skill: "Writer's purpose", stem: "Why does the writer ask a question at the end of paragraph A?", opts: ["To introduce the puzzle that the rest of the text explains", "To show that the writer cannot understand why people like horror films", "To tell readers to avoid theme parks", "To give the final answer"] },
    { skill: "Inference", stem: "What does \"long after the credits have rolled\" suggest?", opts: ["The anxiety continues after the film has ended.", "Some people leave the cinema before the end of the film.", "The films are very long.", "People enjoy reading the credits."] }] },
  { level: 3, title: "Does handwriting still matter?", paras: [
   ["A", "In many classrooms, the pen is quietly giving way to the keyboard. Notes are typed, essays are submitted online, and some education systems have stopped teaching joined-up writing altogether. To many, this seems a sensible adjustment to the realities of modern life. Yet a growing body of research suggests that something may be lost in the transition."],
   ["B", "Several studies have compared students who take notes by hand with those who type them. Typists, unsurprisingly, record more words, often transcribing lectures almost verbatim. Those writing by hand, by contrast, cannot keep up, and are therefore forced to summarise, selecting and rephrasing the key ideas as they go. It is precisely this extra mental effort, researchers argue, that helps them understand and remember the material more effectively."],
   ["C", "Brain-imaging studies point in the same direction. Forming letters by hand appears to activate a wider network of brain regions than pressing keys, particularly in young children who are still learning to read. Some scientists suspect that the physical act of shaping each letter helps to fix its form in memory."],
   ["D", "None of this amounts to a case for abandoning technology. Typing is faster, more legible and indispensable in most workplaces, and for students with certain disabilities it can be transformative. The point, rather, is that the two methods serve different purposes, and that the convenience of one should not lead us to discard the mental benefits of the other."]],
   gloss: "legible: clear enough to read · indispensable: impossible to manage without",
   qs: [
    { skill: "Writer's view", stem: "Which statement best captures the writer's argument?", opts: ["Handwriting has learning benefits worth keeping, even though typing is also valuable.", "Schools should stop using computers in lessons.", "Typing is better than handwriting in every situation, so schools should stop teaching it.", "Handwriting only matters for young children."] },
    { skill: "Cause and effect", stem: "According to paragraph B, why do students who write by hand remember more?", opts: ["They have to summarise and rephrase ideas as they write.", "They write down every word of the lecture, so their notes are complete.", "They write more words than typists.", "Their notes are easier to read."] },
    { skill: "Vocabulary in context", stem: "In paragraph B, \"verbatim\" means…", opts: ["word for word", "in summary", "very slowly", "in their own words"] },
    { skill: "Writer's purpose", stem: "What is the function of paragraph D?", opts: ["It accepts the value of typing while restating the case for handwriting.", "It argues that technology is harmful to students.", "It introduces new research on brain imaging.", "It suggests that handwriting is no longer necessary."] }] }] }
];

const DAY = 86400e3;
// The next check a student can take now, or null: after the baseline, six weeks after their last baseline or check.
export function checkDue(history, now = new Date()) {
  const tests = history.filter(h => h.mode === "baseline");
  if (!tests.length) return null;
  const last = Math.max(...tests.map(h => new Date(h.created_at).getTime()));
  if (now.getTime() - last < CHECK_GAP_DAYS * DAY) return null;
  const done = new Set(tests.map(h => h.text_id));
  return CHECKS.find(c => !done.has(c.id)) || null;
}
// Days until the next check opens, or null when there is no check left to take.
export function daysToCheck(history, now = new Date()) {
  const tests = history.filter(h => h.mode === "baseline");
  const done = new Set(tests.map(h => h.text_id));
  if (!tests.length || !CHECKS.some(c => !done.has(c.id))) return null;
  const last = Math.max(...tests.map(h => new Date(h.created_at).getTime()));
  return Math.max(0, Math.ceil((last + CHECK_GAP_DAYS * DAY - now.getTime()) / DAY));
}
