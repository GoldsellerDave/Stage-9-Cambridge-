// Reading Lab: eight missions on Checkpoint ESL Paper 1 (Reading and Usage) and the traps in its options. Topics come from
// Unit 2 (Well-being) and Unit 3 (Tourism). Each mission: two teaching cards, then 6 adaptive questions (lab.js engine:
// Core, Stretch, Challenge; 2 right in a row up, 2 missed in a row a strategy rescue then down).
// An item: { level, id, paras: [[label, text]] or lines: [[who, text]], stem, opts, key, traps, hint }. Option 0 is right
// (shuffled on screen); a wrong option's "why" says why it is wrong without giving the answer. key and each trap are
// words in the passage: after the answer they light up green (the evidence) and orange (the trap). "___" is a gap.
// Saved as mode "vocab" (no schema change), text_id = mission id, answers { skill: "Reading Lab", trap, rlab: item id, level }.
// Don't rename mission or item ids: saved results are keyed by them.

export const RTRAPS = {
  scan: { name: "Finding it fast", tip: "Read the question first, pick a key word, then scan for it. Don't read every word." },
  paraphrase: { name: "Same words", tip: "The right answer says it in other words. An option that copies words from the text is often a trap." },
  tricky: { name: "Tricky options", tip: "Check every part of an option. Watch for all, never, only and always, and for options that are true but don't answer the question." },
  notice: { name: "Notices and messages", tip: "Ask who wrote it, to whom and why. The answer is the main message, not a small detail." },
  match: { name: "Matching", tip: "Underline everything the person needs. The right text matches all of it, not just one thing." },
  conv: { name: "Conversations", tip: "Read the line after the gap. The reply must answer the question and make sense with what comes next." },
  gap: { name: "Gap fills", tip: "Read the whole sentence. Is it a result, a reason or a contrast? Which word always goes with the next one?" },
  infer: { name: "Between the lines", tip: "The answer isn't written directly. Use clues about actions, feelings and the writer's purpose." }
};

// Options for "Which paragraph...?": the right one first, then the others with their whys.
const paraOpts = (right, whys) => [{ t: `Paragraph ${right}` }, ...Object.entries(whys).map(([k, why]) => ({ t: `Paragraph ${k}`, why }))];
// Options for matching: names of the texts, the right one first.
const pick = (set, right, whys) => [{ t: `${right}: ${set.names[right]}` }, ...Object.entries(whys).map(([k, why]) => ({ t: `${k}: ${set.names[k]}`, why }))];

/* ---------------- passages used by more than one question ---------------- */
const PARK = [["A", "Cuc Phuong was Vietnam's first national park. It opened in 1962 and is about 120 kilometres from Hanoi."],
  ["B", "Most visitors come to see the Endangered Primate Rescue Center, where you can see rare monkeys up close. Tours start every hour from 8 a.m."],
  ["C", "If you want to stay overnight, there are bungalows near the entrance, or you can camp beside Mac Lake. Bring insect repellent, because the mosquitoes are very hungry!"],
  ["D", "Tickets cost 60,000 dong for adults and 20,000 dong for students. The best time to visit is from November to February, when it is cool and dry."]];
const CANTEEN = [["A", "From Monday, our school canteen will serve a new menu. Head chef Mrs Lan says the changes will help students eat a more balanced diet."],
  ["B", "Fried chicken and chips will now be served only on Fridays. On other days, students can choose rice with fish, tofu or chicken, and there will always be fresh fruit."],
  ["C", "Fizzy drinks will no longer be sold. Instead, students can fill their bottles with free water from new machines near the library."],
  ["D", "Some students are not happy. \"I love chips,\" says Minh in Grade 8. \"But I know that eating them every day is not healthy.\""]];
const HOIAN = [["A", "Every evening, thousands of visitors crowd into Hoi An's Old Town to see the lanterns and float candles on the Thu Bon River."],
  ["B", "Local shop owners have mixed feelings. Business is good, but many say the narrow streets have become so overcrowded that their regular customers now stay away."],
  ["C", "To protect the ancient buildings, the town now charges an entrance fee of 120,000 dong. The money pays for repairs to roofs and wooden walls."],
  ["D", "Officials are also considering limiting the number of boats on the river after 7 p.m., because of complaints about noise and pollution."]];
const SLEEP = [["A", "Doctors recommend that teenagers sleep for eight to ten hours a night, but a recent survey found that most Grade 8 students sleep for less than seven."],
  ["B", "The main reason is screens. Two thirds of the students said they used their phones in bed, often until after midnight."],
  ["C", "Tiredness affects more than mood. Students who slept less than six hours were twice as likely to catch colds, because sleep helps the immune system fight infection."],
  ["D", "The survey's author, Dr Hoa, suggests a simple rule: phones should stay outside the bedroom. \"It sounds strict,\" she admits, \"but families who tried it noticed a difference within a week.\""]];
const MONKEYS = [["A", "When Japan's Jigokudani park first attracted foreign tourists, its famous snow monkeys, which bathe in natural hot springs, were rarely disturbed. Visitors watched quietly from a distance."],
  ["B", "Social media changed that. Photographs of the monkeys went viral, and visitor numbers rose sharply. Some visitors began feeding the animals in order to get closer pictures."],
  ["C", "Rangers warn that feeding is not harmless. Monkeys that rely on human food may stop searching for their own, and some have become aggressive towards people who arrive without snacks."],
  ["D", "The park has responded not by closing, but by educating. Signs in five languages now explain the rules, and guides at the entrance remind every group to keep two metres away."]];
const ANGER = [["A", "Most of us think of anger as a problem to be eliminated. Psychologists, however, argue that anger is a useful signal: it tells us that something feels unfair."],
  ["B", "The difficulty lies in what happens next. Within seconds, the body releases adrenaline, the heart beats faster and the part of the brain responsible for careful thinking becomes less active."],
  ["C", "This explains why people say things in anger that they later regret. Their self-control has not disappeared; it has simply been overpowered for a short time."],
  ["D", "Simple techniques can help. Counting slowly to ten gives the thinking brain time to catch up, and naming the feeling aloud, such as \"I'm annoyed\", has been shown to reduce its intensity."]];

const COURSES = { names: { A: "Splash Camp", B: "Art Attack", C: "Wild Ways", D: "Code Club" }, paras: [
  ["A", "Splash Camp: Swimming and windsurfing for beginners. Mornings only, 9–12. Lunch not included."],
  ["B", "Art Attack: Painting and pottery in the city centre. Full days, 9–4, lunch provided."],
  ["C", "Wild Ways: Camping in Cuc Phuong National Park. Three nights in tents with a guide."],
  ["D", "Code Club: Learn to build simple games. Afternoons, 1–4, at the library."]] };
const CAFES = { names: { A: "Green Bowl", B: "Pho 24/7", C: "Sweet Corner", D: "Family Rice" }, paras: [
  ["A", "Green Bowl: Salads and fresh juices. No meat on the menu. Open 7 a.m.–3 p.m."],
  ["B", "Pho 24/7: Noodle soup with beef or chicken. Open all night."],
  ["C", "Sweet Corner: Cakes, ice cream and milkshakes. Student discount on Mondays."],
  ["D", "Family Rice: Rice dishes with fish, tofu or chicken. Open 11 a.m.–9 p.m. Free fruit for children."]] };
const HOTELS = { names: { A: "Pine View", B: "City Star", C: "Lake House", D: "Backpack Base" }, paras: [
  ["A", "Pine View: Quiet rooms in the hills, 5 km from town. Free bike hire. No restaurant, but a kitchen guests can use."],
  ["B", "City Star: Right in the centre, next to the night market. Rooftop restaurant. Rooms can be noisy at weekends."],
  ["C", "Lake House: Family rooms by the lake. Breakfast included. Babysitting service available in the evenings."],
  ["D", "Backpack Base: Shared rooms from $8 a night. Walking tours every morning, and a lively common room where guests meet."]] };
const APPS = { names: { A: "SleepWell", B: "FoodFact", C: "CalmMind", D: "StepUp" }, paras: [
  ["A", "SleepWell: Tracks how long and how deeply you sleep and suggests a bedtime. Works offline. Free, with optional paid features."],
  ["B", "FoodFact: Scan a barcode to see the sugar, salt and fat in a product. Needs internet. Free."],
  ["C", "CalmMind: Short breathing exercises to help with stress and anger. Daily reminders. $2 a month after a 7-day free trial."],
  ["D", "StepUp: Counts your steps and sets weekly goals. Compete with friends on a leaderboard. Free."]] };

export const RLAB = [
{ id: "rlab-scan", n: 1, trap: "scan", part: "Parts 5 and 6", title: "Find it fast", blurb: "Skim and scan: find the right part of the text quickly, without reading every word.",
  teach: [
    { h: "Question first, then the text", p: "Read the question before the text. Choose one key word, a name, a number or a topic, and look only for that. Your eyes can jump over everything else.",
      eg: { text: "Which paragraph tells you how much a ticket costs?", note: "Scan for numbers and money words: dong, $, price, cost, free." } },
    { h: "Same idea, different words", p: "The paragraph may not use the word in the question. \"Where can you sleep?\" might be answered by stay overnight, bungalows or camp. Think of other words before you scan.",
      eg: { text: "If you want to stay overnight, there are bungalows near the entrance.", note: "No word sleep, but this is the answer." } }],
  items: [
    { level: 0, id: "rlab-scan-1", paras: PARK, stem: "Which paragraph tells you where you can sleep?", opts: paraOpts("C", { A: "This is about when the park opened and where it is.", B: "This is about the monkeys and the tours.", D: "This is about prices and the best time to go." }),
      hint: "Sleep might not be in the text. Look for other words: stay, night, camp.", key: "If you want to stay overnight", traps: [] },
    { level: 0, id: "rlab-scan-2", paras: PARK, stem: "Which paragraph tells you how much you pay as a student?", opts: paraOpts("D", { A: "There's a number here, but it's a year and a distance.", B: "Tours are mentioned, but not prices.", C: "No prices here." }),
      hint: "Scan for money words: dong, cost, price.", key: "20,000 dong for students", traps: [["120 kilometres", "a number, but not a price"]] },
    { level: 0, id: "rlab-scan-3", paras: PARK, stem: "Which paragraph tells you when the tours begin?", opts: paraOpts("B", { A: "1962 is when the park opened.", C: "No times here.", D: "These months are the best time to visit, not tour times." }),
      hint: "Scan for the word tours, then look for a time.", key: "Tours start every hour from 8 a.m.", traps: [["It opened in 1962", "a time, but not for tours"], ["from November to February", "the best season"]] },
    { level: 0, id: "rlab-scan-4", paras: CANTEEN, stem: "Which paragraph tells you what students can drink?", opts: paraOpts("C", { A: "This is about the new menu in general.", B: "This is about food, not drinks.", D: "This is a student's opinion about chips." }),
      hint: "Look for drink words: water, juice, bottle.", key: "students can fill their bottles with free water", traps: [] },
    { level: 0, id: "rlab-scan-5", paras: CANTEEN, stem: "Which paragraph gives a student's opinion?", opts: paraOpts("D", { A: "This is the chef's opinion, not a student's.", B: "These are facts about the menu.", C: "These are facts about drinks." }),
      hint: "Look for speech marks and the name of a student.", key: "\"I love chips,\" says Minh", traps: [["Head chef Mrs Lan says", "an opinion, but not a student's"]] },
    { level: 1, id: "rlab-scan-s1", paras: HOIAN, stem: "Which paragraph explains what happens to the money visitors pay?", opts: paraOpts("C", { A: "This describes what visitors do in the evening.", B: "Business and money are mentioned, but not the visitors' fee.", D: "This is about boats and noise." }),
      hint: "Scan for money words: fee, dong, pays.", key: "The money pays for repairs", traps: [["Business is good", "money for shops, not the fee"]] },
    { level: 1, id: "rlab-scan-s2", paras: HOIAN, stem: "Which paragraph describes a plan that has not happened yet?", opts: paraOpts("D", { A: "This happens every evening already.", B: "This describes how things are now.", C: "The fee is charged now, so it has already happened." }),
      hint: "Look for words about the future: considering, plan, might, will.", key: "are also considering limiting", traps: [["now charges an entrance fee", "already happening"]] },
    { level: 1, id: "rlab-scan-s3", paras: SLEEP, stem: "Which paragraph tells you how a lack of sleep affects your health?", opts: paraOpts("C", { A: "This says how much students sleep, not what it does to them.", B: "This gives the reason they sleep less.", D: "This gives a solution." }),
      hint: "Health words: ill, colds, immune system, infection.", key: "twice as likely to catch colds", traps: [["sleep for less than seven", "how much, not the effect"]] },
    { level: 1, id: "rlab-scan-s4", paras: SLEEP, stem: "Which paragraph says how to solve the problem?", opts: paraOpts("D", { A: "Doctors recommend how much to sleep, but not how to sleep more.", B: "This is the cause of the problem.", C: "This is about the effects." }),
      hint: "A solution often comes at the end. Look for a rule, an idea or should.", key: "phones should stay outside the bedroom", traps: [["Doctors recommend that teenagers sleep", "a recommendation, but not a solution"]] },
    { level: 2, id: "rlab-scan-c1", paras: MONKEYS, stem: "In which paragraph does the writer explain why visitors began to behave differently?", opts: paraOpts("B", { A: "This describes how visitors behaved at first.", C: "This describes the results of their behaviour.", D: "This is about the park's response." }),
      hint: "Find the paragraph with a cause: something that changed things.", key: "Photographs of the monkeys went viral", traps: [["were rarely disturbed", "before the change"]] },
    { level: 2, id: "rlab-scan-c2", paras: MONKEYS, stem: "Which paragraph describes the consequences of a visitor habit?", opts: paraOpts("C", { A: "Visitors watched quietly; there were no problems yet.", B: "This describes the habit itself, not what it led to.", D: "This is about the park's response." }),
      hint: "Consequences are results. Look for may, become, so.", key: "Monkeys that rely on human food may stop searching for their own", traps: [["began feeding the animals", "the habit, not its result"]] },
    { level: 2, id: "rlab-scan-c3", paras: ANGER, stem: "Which paragraph challenges a common belief?", opts: paraOpts("A", { B: "This explains what happens in the body.", C: "This explains why we regret things.", D: "This gives techniques." }),
      hint: "Look for most of us think followed by however.", key: "Psychologists, however, argue that anger is a useful signal", traps: [["Simple techniques can help", "advice, not a challenge"]] },
    { level: 2, id: "rlab-scan-c4", paras: ANGER, stem: "Which paragraph describes what happens physically when we get angry?", opts: paraOpts("B", { A: "This is about what anger means, not the body.", C: "This is about what we say, not the body.", D: "Counting and naming are techniques, not physical reactions." }),
      hint: "Physically means in the body: heart, brain, adrenaline.", key: "the body releases adrenaline", traps: [["people say things in anger that they later regret", "behaviour, not the body"]] }]
},
{ id: "rlab-paraphrase", n: 2, trap: "paraphrase", part: "Parts 4 and 6", title: "Same words, different meaning", blurb: "The right answer uses different words. The option that copies the text is often the trap.",
  teach: [
    { h: "Examiners change the words", p: "The right option almost never copies the text. It says the same thing in other words: breakfast is included becomes a morning meal at no extra cost.",
      eg: { text: "Breakfast is included in the price.", opt: "a morning meal at no extra cost", note: "Different words, same meaning: this is the right answer." } },
    { h: "Copied words are a warning sign", p: "When an option uses exactly the same words as the text, slow down. Often the words are there, but the meaning is different or opposite.",
      eg: { text: "Our hostel is a ten-minute walk from the beach.", opt: "a room on the beach", note: "The word beach is copied, but the meaning is wrong." } }],
  items: [
    { level: 0, id: "rlab-para-1", paras: [["", "Our hostel is a ten-minute walk from the beach, and breakfast is included in the price. Please note that the kitchen closes at 10 p.m."]], stem: "What does the hostel offer?",
      opts: [{ t: "a morning meal at no extra cost" }, { t: "a kitchen that is open all night", why: "The kitchen closes at 10 p.m." }, { t: "rooms on the beach", why: "The word beach is copied, but the hostel is a walk away." }],
      hint: "Which option says the same as one sentence, in different words?", key: "breakfast is included in the price", traps: [["a ten-minute walk from the beach", "same word, beach"]] },
    { level: 0, id: "rlab-para-2", paras: [["", "Doctors say that children who eat too much junk food often feel tired, because their bodies are not getting the vitamins they need."]], stem: "Why do some children feel tired?",
      opts: [{ t: "Their diet lacks important nutrients." }, { t: "They eat too much food.", why: "The text says too much junk food, not too much food." }, { t: "Doctors give them too many vitamins.", why: "Vitamins is copied, but the text says they don't get enough." }],
      hint: "Look after because. Which option says that in other words?", key: "their bodies are not getting the vitamins they need", traps: [["eat too much junk food", "junk food, not all food"]] },
    { level: 0, id: "rlab-para-3", paras: [["", "The museum is free on Sundays, but visitors must book a ticket online at least a day before."]], stem: "What must Sunday visitors do?",
      opts: [{ t: "reserve a place in advance" }, { t: "pay at the door", why: "It's free on Sundays." }, { t: "visit on a different day", why: "Sunday is fine if you book." }],
      hint: "Book ... a day before. What's another way of saying that?", key: "must book a ticket online at least a day before", traps: [["free on Sundays", "free doesn't mean no booking"]] },
    { level: 0, id: "rlab-para-4", paras: [["", "Mai was so angry that she couldn't speak. She took a deep breath, walked out of the room and only came back when she felt calm."]], stem: "How did Mai deal with her anger?",
      opts: [{ t: "She left until she had calmed down." }, { t: "She shouted at everyone.", why: "She couldn't speak." }, { t: "She stayed in the room and breathed deeply.", why: "She took a deep breath, but did she stay?" }],
      hint: "What did she do after the deep breath?", key: "walked out of the room and only came back when she felt calm", traps: [["She took a deep breath", "true, but only part of it"]] },
    { level: 0, id: "rlab-para-5", paras: [["", "Wash your hands before eating. Germs from door handles and phones can easily get into your mouth."]], stem: "Why should you wash your hands?",
      opts: [{ t: "to stop bacteria entering your body" }, { t: "to keep your phone clean and free of germs", why: "Phones are where germs come from, not what you clean." }, { t: "to clean the door handles you touch", why: "Door handles are copied, but you wash your hands, not the handles." }],
      hint: "Germs = bacteria. Get into your mouth = enter your body.", key: "can easily get into your mouth", traps: [["door handles and phones", "where germs come from"]] },
    { level: 1, id: "rlab-para-s1", paras: [["", "Although the campsite has no electricity, solar lamps are provided in every tent, and there is a charging station for phones at reception."]], stem: "What does the text say about power at the campsite?",
      opts: [{ t: "You can charge your phone at the main office." }, { t: "There is electricity in every tent.", why: "Every tent has a solar lamp, but the site has no electricity." }, { t: "You cannot use your phone anywhere on the site.", why: "Read to the end of the sentence." }, { t: "Every tent has a solar panel for charging.", why: "The text says lamps, not panels." }],
      hint: "Reception = the main office.", key: "there is a charging station for phones at reception", traps: [["solar lamps are provided in every tent", "lamps, not electricity"]] },
    { level: 1, id: "rlab-para-s2", paras: [["", "Nutritionists warn that skipping breakfast does not help you lose weight. People who miss it tend to snack more later in the day, often on sugary food."]], stem: "What is the main point?",
      opts: [{ t: "Missing breakfast can lead to unhealthy eating later." }, { t: "Eating breakfast helps you lose weight quickly.", why: "The text says skipping it doesn't help. That's not the same." }, { t: "Sugary snacks are the best choice in the afternoon.", why: "Sugary food is mentioned as a problem." }, { t: "Nutritionists never eat breakfast.", why: "Nothing about their own habits." }],
      hint: "Skip = miss. What happens to people who miss it?", key: "People who miss it tend to snack more later in the day", traps: [["does not help you lose weight", "same words, different idea"]] },
    { level: 1, id: "rlab-para-s3", paras: [["", "Visitors hoping to see the famous amphitheatre should be aware that it is currently closed for repairs. The nearby medieval castle, however, remains open as usual."]], stem: "What can visitors do at the moment?",
      opts: [{ t: "look around the castle" }, { t: "watch a show in the amphitheatre", why: "It is closed for repairs." }, { t: "help with the repairs", why: "Repairs are mentioned, but not by visitors." }, { t: "visit the amphitheatre in the evening", why: "No times are given; it is closed." }],
      hint: "However shows a contrast. What is still open?", key: "remains open as usual", traps: [["the famous amphitheatre", "famous, but closed"]] },
    { level: 1, id: "rlab-para-s4", paras: [["", "Empathy is not the same as agreeing with someone. It means understanding how they feel, even when you think they are wrong."]], stem: "According to the text, empathy means...",
      opts: [{ t: "recognising another person's feelings" }, { t: "agreeing with what someone says", why: "The text says empathy is not this." }, { t: "telling people they are wrong", why: "You may think it, but empathy is about feelings." }, { t: "feeling the same as everyone else", why: "Understanding a feeling is not having the same feeling." }],
      hint: "Find It means... and say it another way.", key: "understanding how they feel", traps: [["the same as agreeing with someone", "the opposite"]] },
    { level: 2, id: "rlab-para-c1", paras: [["", "Far from being a modern invention, the idea of the \"staycation\" dates back decades; what has changed is that it is now marketed as a choice rather than a sign that a family cannot afford to travel."]], stem: "What has changed about holidays at home?",
      opts: [{ t: "People now see them as something they decide to do." }, { t: "They have only just been invented by travel companies.", why: "Far from being a modern invention means they are old." }, { t: "Families can no longer afford to travel.", why: "That was how people saw them before." }, { t: "They now cost more than holidays abroad.", why: "Price isn't compared." }],
      hint: "Find what has changed is...", key: "it is now marketed as a choice", traps: [["a modern invention", "far from = not at all"], ["cannot afford to travel", "the old view"]] },
    { level: 2, id: "rlab-para-c2", paras: [["", "The vaccine does not prevent infection entirely, but those who catch the virus after vaccination usually experience far milder symptoms and recover more quickly."]], stem: "What is true about the vaccine?",
      opts: [{ t: "It reduces how ill people become." }, { t: "It stops people catching the virus.", why: "Does not prevent infection entirely: some people still catch it." }, { t: "It makes recovery slower.", why: "The text says more quickly." }, { t: "It only works when symptoms are mild.", why: "Milder symptoms are the result, not a condition." }],
      hint: "Milder symptoms = less ill.", key: "usually experience far milder symptoms", traps: [["prevent infection", "part of does not prevent"]] },
    { level: 2, id: "rlab-para-c3", paras: [["", "Rather than banning tourists from the fragile coral reef, the island's authorities have chosen to limit daily visitor numbers and require every diver to complete a short conservation briefing."]], stem: "How are the authorities protecting the reef?",
      opts: [{ t: "by controlling numbers and educating divers" }, { t: "by banning tourists", why: "Rather than banning means they did not ban." }, { t: "by closing the island to all divers for a year", why: "Divers can still go, after a briefing." }, { t: "by moving the coral to a safer part of the sea", why: "Not mentioned." }],
      hint: "Rather than = instead of. What did they choose to do?", key: "limit daily visitor numbers and require every diver to complete a short conservation briefing", traps: [["banning tourists", "what they did not do"]] },
    { level: 2, id: "rlab-para-c4", paras: [["", "Few experts would dispute that obesity rates have risen; the disagreement concerns whether the main cause is diet or a decline in physical activity."]], stem: "What do experts disagree about?",
      opts: [{ t: "the main reason for the increase" }, { t: "whether obesity rates have risen", why: "Few would dispute means most agree about this." }, { t: "whether diet matters at all", why: "Diet is one of the possible causes." }, { t: "how to measure physical activity", why: "Not mentioned." }],
      hint: "Find the word disagreement.", key: "the disagreement concerns whether the main cause is diet or a decline in physical activity", traps: [["Few experts would dispute that obesity rates have risen", "they agree on this"]] }]
},
{ id: "rlab-tricky", n: 3, trap: "tricky", part: "Parts 4, 5 and 6", title: "Tricky options", blurb: "True but not the answer, too strong, or only half right: spot the options built to trick you.",
  teach: [
    { h: "Too strong to be true", p: "Words like all, every, never, only and always make an option very strong. If the text says some, most, often or can, the strong option is wrong.",
      eg: { text: "Some fruits, like oranges and kiwis, are high in vitamin C.", opt: "All fruits are high in vitamin C.", note: "Some is not all." } },
    { h: "True, but not the answer", p: "An option can be true in the text and still be wrong: it answers a different question, or only half of it is right. Check every part of the option against the question.",
      eg: { text: "Lan enjoys swimming, but she doesn't like windsurfing because she finds it hard to balance.", opt: "Why doesn't Lan like windsurfing? \"She enjoys swimming.\"", note: "True, but it isn't the reason." } }],
  items: [
    { level: 0, id: "rlab-trick-1", paras: [["", "Some fruits, like oranges and kiwis, are high in vitamin C, which helps the immune system. Bananas are a good source of energy."]], stem: "Which statement is true?",
      opts: [{ t: "Oranges contain a lot of vitamin C." }, { t: "All fruits are high in vitamin C.", why: "Some fruits, not all. Watch for all." }, { t: "Bananas help the immune system.", why: "Bananas give energy; the vitamin C fruits help the immune system." }, { t: "Kiwis are never eaten for energy.", why: "Never is too strong, and the text doesn't say this." }],
      hint: "Check each word, especially all and never.", key: "oranges and kiwis, are high in vitamin C", traps: [["Some fruits", "some, not all"]] },
    { level: 0, id: "rlab-trick-2", paras: [["", "The theme park is open every day from 9 a.m. to 6 p.m. in summer. In winter, it closes on Mondays."]], stem: "When can you visit the theme park?",
      opts: [{ t: "any day in summer" }, { t: "every day of the year", why: "In winter it closes on Mondays." }, { t: "only in summer", why: "Only is too strong: it's open in winter too." }, { t: "on Mondays in winter", why: "That's when it's closed." }],
      hint: "Read both sentences. Watch for only and every.", key: "open every day from 9 a.m. to 6 p.m. in summer", traps: [["closes on Mondays", "winter only"]] },
    { level: 0, id: "rlab-trick-3", paras: [["", "Lan enjoys swimming, but she doesn't like windsurfing because she finds it hard to balance."]], stem: "Why doesn't Lan like windsurfing?",
      opts: [{ t: "She finds balancing difficult." }, { t: "She prefers swimming.", why: "True, but it isn't the reason." }, { t: "She can't swim.", why: "She enjoys swimming." }, { t: "She never does water sports.", why: "Swimming is a water sport." }],
      hint: "The question asks why. Look after because.", key: "she finds it hard to balance", traps: [["Lan enjoys swimming", "true, but not the reason"]] },
    { level: 0, id: "rlab-trick-4", paras: [["", "Eating fast food occasionally is fine, but eating it every day can lead to obesity and diabetes."]], stem: "What does the text say about fast food?",
      opts: [{ t: "It is unhealthy if you eat it daily." }, { t: "You should never eat it.", why: "Occasionally is fine, so never is too strong." }, { t: "It always causes diabetes.", why: "Can lead to is not always." }, { t: "It is fine to eat it every day.", why: "Half right: fine sometimes, not every day." }],
      hint: "Occasionally means sometimes. Watch for never and always.", key: "eating it every day can lead to obesity and diabetes", traps: [["occasionally is fine", "only sometimes"]] },
    { level: 0, id: "rlab-trick-5", paras: [["", "Our class trip to the national park was great. We saw monkeys and birds, but it rained all afternoon, so we couldn't have our picnic."]], stem: "What happened on the trip?",
      opts: [{ t: "The weather spoiled one of their plans." }, { t: "They had a picnic and saw monkeys.", why: "Half right: they saw monkeys, but there was no picnic." }, { t: "It rained all day.", why: "All afternoon, not all day." }, { t: "They didn't see any animals.", why: "They saw monkeys and birds." }],
      hint: "Check both halves of each option.", key: "it rained all afternoon, so we couldn't have our picnic", traps: [["We saw monkeys and birds", "half of a wrong option"]] },
    { level: 1, id: "rlab-trick-s1", paras: [["", "The Old Quarter has many cheap hotels, though most of them are noisy. Travellers who want quiet often choose the guesthouses near West Lake, which cost a little more."]], stem: "Which is true according to the text?",
      opts: [{ t: "Quieter places to stay are slightly more expensive." }, { t: "All the hotels in the Old Quarter are noisy.", why: "Most, not all." }, { t: "The West Lake guesthouses are cheap and noisy.", why: "Half wrong: they are quieter and cost more." }, { t: "Travellers never stay in the Old Quarter.", why: "Never is too strong: there are many hotels there." }],
      hint: "Most is not all, and a little more is not cheap.", key: "which cost a little more", traps: [["most of them are noisy", "most, not all"]] },
    { level: 1, id: "rlab-trick-s2", paras: [["", "Studies suggest that people who keep a food diary tend to eat more healthily, perhaps because writing things down makes them more aware of their choices."]], stem: "What do the studies suggest?",
      opts: [{ t: "Recording what you eat may improve your diet." }, { t: "Food diaries always make people healthy.", why: "Suggest and tend to are not always." }, { t: "People who write a lot are healthier.", why: "It's about food diaries, not writing in general." }, { t: "Food diaries make people eat more.", why: "More healthily, not more." }],
      hint: "Tend to = usually, not always.", key: "people who keep a food diary tend to eat more healthily", traps: [["writing things down", "not writing in general"]] },
    { level: 1, id: "rlab-trick-s3", paras: [["", "Although the hot spring is popular with tourists, local people prefer to visit early in the morning, when the water is quieter and the entrance is free."]], stem: "Why do local people go in the morning?",
      opts: [{ t: "It is less crowded and costs nothing." }, { t: "The hot spring is popular with tourists.", why: "True, but it doesn't explain the morning." }, { t: "The water is hotter then.", why: "Temperature isn't mentioned." }, { t: "Entry is free all day.", why: "Only in the morning." }],
      hint: "The question asks why. Look for when...", key: "when the water is quieter and the entrance is free", traps: [["popular with tourists", "true, but not the reason"]] },
    { level: 1, id: "rlab-trick-s4", paras: [["", "Self-control is not something you either have or don't have. Like a muscle, it can be trained, although it may get tired if you use it too much in one day."]], stem: "Which statement matches the text?",
      opts: [{ t: "Self-control can be developed with practice." }, { t: "Some people are born without self-control.", why: "The text says it's not something you have or don't have." }, { t: "Self-control never gets tired.", why: "It may get tired." }, { t: "Using self-control makes your muscles stronger.", why: "A muscle is a comparison, not real muscles." }],
      hint: "Trained = developed with practice.", key: "it can be trained", traps: [["Like a muscle", "a comparison"]] },
    { level: 2, id: "rlab-trick-c1", paras: [["", "While eco-tourism can fund conservation, critics point out that it only benefits wildlife when the money actually reaches local projects, which is by no means guaranteed."]], stem: "What do critics say about eco-tourism?",
      opts: [{ t: "Its benefits depend on where the money goes." }, { t: "It never helps conservation.", why: "Too strong: it can fund conservation." }, { t: "The money always reaches local projects.", why: "By no means guaranteed means not always." }, { t: "It is the best way to fund conservation.", why: "No comparison with other ways." }],
      hint: "The question is about the critics. Find critics point out...", key: "it only benefits wildlife when the money actually reaches local projects", traps: [["eco-tourism can fund conservation", "true, but not the critics' point"]] },
    { level: 2, id: "rlab-trick-c2", paras: [["", "Contrary to popular belief, antibiotics are useless against viruses such as the common cold; they work only on infections caused by bacteria."]], stem: "What does the text say about antibiotics?",
      opts: [{ t: "They treat bacterial infections only." }, { t: "They cure the common cold.", why: "This is the popular belief the writer says is wrong." }, { t: "They are useless against every illness.", why: "Too strong: useless against viruses, but they work on bacteria." }, { t: "They can cause viral infections like colds.", why: "Not stated." }],
      hint: "Contrary to popular belief: what people think is wrong.", key: "they work only on infections caused by bacteria", traps: [["Contrary to popular belief", "what people wrongly think"], ["useless against viruses", "only half the story"]] },
    { level: 2, id: "rlab-trick-c3", paras: [["", "The guidebook describes the medieval town as \"unspoilt\", yet in summer its single main street is lined with souvenir stalls and tour coaches arrive every few minutes."]], stem: "What does the writer suggest about the guidebook's description?",
      opts: [{ t: "It is not accurate in summer." }, { t: "No tourists ever visit the town.", why: "Too strong, and coaches arrive every few minutes." }, { t: "It is accurate all year round.", why: "Yet introduces a contrast with the guidebook." }, { t: "The town has many main streets.", why: "It has a single main street." }],
      hint: "Yet shows the writer disagrees with something.", key: "yet in summer its single main street is lined with souvenir stalls", traps: [["\"unspoilt\"", "the guidebook's word, which the writer doubts"]] },
    { level: 2, id: "rlab-trick-c4", paras: [["", "Teenagers who sleep less than seven hours are not necessarily lazy or badly behaved; changes in their body clock make it genuinely difficult for them to fall asleep early."]], stem: "What is the writer's view of teenagers who go to sleep late?",
      opts: [{ t: "Their late nights have a biological cause." }, { t: "They are lazy and badly behaved.", why: "Not necessarily rejects this." }, { t: "They never fall asleep before midnight.", why: "Too strong: difficult, not impossible." }, { t: "They sleep more than seven hours.", why: "The text is about those who sleep less." }],
      hint: "Body clock = something biological.", key: "changes in their body clock make it genuinely difficult", traps: [["lazy or badly behaved", "what the writer rejects"]] }]
},
{ id: "rlab-notices", n: 4, trap: "notice", part: "Part 4", title: "Notices and messages", blurb: "Short signs, emails and texts: who wrote it, to whom, and why?",
  teach: [
    { h: "Who, to whom, and why?", p: "In Part 4 you read ten short texts: notices, emails and phone messages. Before the options, ask: who wrote this, who to, and why? Most questions test the main message.",
      eg: { text: "Hi Nam, I can't come to football practice today. Can you tell Coach? Duc", note: "Why did Duc write? To ask Nam to pass on a message." } },
    { h: "Don't fall for the detail", p: "Short texts are full of times, dates and places. An option that repeats one of these details may be true but not the main point, or it may mix two details up.",
      eg: { text: "Books must be returned by Friday 15th.", opt: "The library closes on Friday 15th.", note: "The date is copied, but it's the return date." } }],
  items: [
    { level: 0, id: "rlab-note-1", paras: [["", "SCHOOL LIBRARY: Books must be returned by Friday 15th. Students with late books will not be able to borrow more until they return them."]], stem: "What does the notice say?",
      opts: [{ t: "You can't take out new books if yours are late." }, { t: "The library will be closed all day on Friday 15th.", why: "Friday 15th is the return date, not a closing day." }, { t: "You have to pay a fine for every late book.", why: "No payment is mentioned." }],
      hint: "What happens to students with late books?", key: "will not be able to borrow more until they return them", traps: [["Friday 15th", "a date, but for what?"]] },
    { level: 0, id: "rlab-note-2", paras: [["", "Hi Nam, I can't come to football practice today – I've got a dentist appointment at 4. Can you tell Coach? See you tomorrow. Duc"]], stem: "Why did Duc write to Nam?",
      opts: [{ t: "to ask him to pass on a message" }, { t: "to invite him to the dentist", why: "Duc is going to the dentist himself." }, { t: "to change the time of practice", why: "Practice is still on; Duc just can't go." }],
      hint: "Look for the question Duc asks Nam.", key: "Can you tell Coach?", traps: [["dentist appointment at 4", "the reason, not the purpose"]] },
    { level: 0, id: "rlab-note-3", paras: [["", "CAMPSITE RULES: Quiet after 10 p.m. Fires only in the marked areas. Keep food in closed boxes – monkeys are active here!"]], stem: "Why should campers keep food in boxes?",
      opts: [{ t: "Animals might take it." }, { t: "Fires are not allowed.", why: "Fires are allowed in the marked areas, and that's a different rule." }, { t: "Campers must be quiet at night.", why: "That's a different rule." }],
      hint: "Read what comes after the dash.", key: "monkeys are active here", traps: [["Fires only in the marked areas", "another rule"]] },
    { level: 0, id: "rlab-note-4", paras: [["", "Mum – I've taken the bus to Lan's house to study for the science test. Her mum will drive me home at 7. Don't worry about dinner, I'll eat there! Mai"]], stem: "What will Mai do this evening?",
      opts: [{ t: "have dinner at her friend's house" }, { t: "take the bus home at 7", why: "Lan's mum will drive her home." }, { t: "cook dinner for her mum when she gets home", why: "Don't worry about dinner means Mum doesn't need to cook for her." }],
      hint: "Find the word dinner.", key: "I'll eat there", traps: [["taken the bus", "how she went, not how she'll get home"]] },
    { level: 0, id: "rlab-note-5", paras: [["", "SPECIAL OFFER! Theme park tickets half price for students this weekend. Show your student card at the gate. Not valid online."]], stem: "How can students get the cheaper ticket?",
      opts: [{ t: "by showing their card when they arrive" }, { t: "by buying it online", why: "Not valid online." }, { t: "by going any weekend this month", why: "Only this weekend." }],
      hint: "At the gate = when they arrive.", key: "Show your student card at the gate", traps: [["Not valid online", "the opposite"]] },
    { level: 1, id: "rlab-note-s1", paras: [["", "Dear parents, Because of the heat warning, Friday's sports day will now take place indoors in the sports hall. Students should still wear PE kit and bring a water bottle. Ms Ha"]], stem: "What has changed about sports day?",
      opts: [{ t: "where it happens" }, { t: "what students wear", why: "Should still wear PE kit: no change." }, { t: "which day it happens", why: "It's still Friday." }],
      hint: "Look for the word now.", key: "will now take place indoors in the sports hall", traps: [["Students should still wear PE kit", "still = no change"]] },
    { level: 1, id: "rlab-note-s2", paras: [["", "Tour group B: Our boat to Ha Long Bay leaves at 8.15, not 8.45 as printed in your itinerary. Breakfast will be served from 7. Please don't be late – the boat cannot wait."]], stem: "What is the main purpose of this message?",
      opts: [{ t: "to correct a departure time" }, { t: "to tell the group about breakfast", why: "Breakfast is a detail, not the main point." }, { t: "to say the boat trip is cancelled", why: "The boat still leaves." }],
      hint: "Not ... as printed: something was wrong.", key: "leaves at 8.15, not 8.45 as printed", traps: [["Breakfast will be served from 7", "a detail"]] },
    { level: 1, id: "rlab-note-s3", paras: [["", "Feeling stressed about exams? Drop in to Room 12 any lunchtime this week. No appointment needed. Our school counsellor, Mr Tuan, is there to listen – everything you say stays private."]], stem: "What does the notice tell students?",
      opts: [{ t: "They can talk to someone without booking." }, { t: "They must book a time with Mr Tuan.", why: "No appointment needed." }, { t: "Mr Tuan will tell their parents what they say.", why: "Everything stays private." }],
      hint: "Drop in = just come, without booking.", key: "No appointment needed", traps: [["any lunchtime this week", "when, not the main point"]] },
    { level: 1, id: "rlab-note-s4", paras: [["", "Hey! Thanks for the photos from the trip. The one of us at the hot spring is brilliant – can I use it for my project? I'll put your name under it. Khoa"]], stem: "What does Khoa want?",
      opts: [{ t: "permission to use a photo" }, { t: "more photos of the trip", why: "He thanks his friend for the photos he already has." }, { t: "his friend's name for a list", why: "He'll add the name to give credit." }],
      hint: "Find the question Khoa asks.", key: "can I use it for my project?", traps: [["Thanks for the photos", "thanks, not the request"]] },
    { level: 2, id: "rlab-note-c1", paras: [["", "NOTICE TO VISITORS: Due to the rise in visitor numbers, entry to the cave is now by timed ticket only. Tickets not used within 15 minutes of the time shown will not be refunded. Groups of more than 10 must book 48 hours in advance."]], stem: "What does the notice say about tickets?",
      opts: [{ t: "Arriving late may mean losing your money." }, { t: "Small groups must book two days early.", why: "That rule is for groups of more than 10." }, { t: "Visitors can go in at any time.", why: "Entry is by timed ticket only." }],
      hint: "Not refunded = you don't get your money back.", key: "not used within 15 minutes of the time shown will not be refunded", traps: [["Groups of more than 10", "only big groups"]] },
    { level: 2, id: "rlab-note-c2", paras: [["", "To all Grade 8 students: The canteen survey closes on Friday. So far, only 40 students have replied. If we don't get at least 100 responses, the school will not be able to change the menu as planned. It takes two minutes!"]], stem: "What is the writer trying to do?",
      opts: [{ t: "persuade more students to take part" }, { t: "tell students the menu has changed", why: "It can only change if more students reply." }, { t: "complain that the survey is too long", why: "It takes two minutes says it's short." }],
      hint: "Only 40 ... at least 100 ... two minutes. What does the writer want?", key: "If we don't get at least 100 responses", traps: [["the school will not be able to change the menu", "a reason to reply, not the purpose"]] },
    { level: 2, id: "rlab-note-c3", paras: [["", "Hi Ms Linh, I'm sorry, but I won't be able to hand in my essay tomorrow, as I was off sick on Tuesday and missed the instructions. Would it be possible to have until Monday? I've already started the research. Bao"]], stem: "What is Bao asking for?",
      opts: [{ t: "more time to finish his work" }, { t: "a copy of the essay instructions", why: "He missed them, but he doesn't ask for them." }, { t: "permission to stay at home", why: "He was off sick before; he isn't asking to stay home now." }],
      hint: "Would it be possible...? is the request.", key: "Would it be possible to have until Monday?", traps: [["missed the instructions", "the reason"]] },
    { level: 2, id: "rlab-note-c4", paras: [["", "Eco Lodge guests: To reduce plastic waste, we no longer provide bottled water in rooms. Refill stations are on every floor, and reusable bottles can be bought at reception for a small charge, which goes to our tree-planting project."]], stem: "What does the lodge say about water?",
      opts: [{ t: "Guests are expected to fill their own bottles." }, { t: "Bottled water is sold at reception.", why: "Reusable bottles are sold there, not bottled water." }, { t: "Guests pay for water, and the money plants trees.", why: "The bottles cost money, not the water." }],
      hint: "Refill stations: who fills the bottles?", key: "Refill stations are on every floor", traps: [["reusable bottles can be bought at reception", "bottles, not water"]] }]
},
{ id: "rlab-matching", n: 5, trap: "match", part: "Part 5", title: "Match the people", blurb: "Five people, eight texts: find the one text that matches everything a person needs.",
  teach: [
    { h: "List what each person needs", p: "Each person has two or three needs. Underline every one: what they like, when they are free, how much they can pay, who they are with. The right text matches all of them.",
      eg: { text: "Huy wants to learn a water sport but has piano lessons every afternoon.", note: "Two needs: a water sport AND mornings." } },
    { h: "One match is not enough", p: "Most texts match one need. That's the trap! A swimming course in the afternoon is wrong for Huy. Check every need, and cross out texts that fail one.",
      eg: { text: "Code Club: Learn to build simple games. Afternoons, 1–4.", note: "Afternoons: wrong for Huy, even before you think about sport." } }],
  items: [
    { level: 0, id: "rlab-match-1", paras: COURSES.paras, stem: "Huy wants to learn a water sport, but he has piano lessons every afternoon.",
      opts: pick(COURSES, "A", { B: "Huy wants a water sport.", C: "This isn't a water sport.", D: "It's in the afternoons, when he has piano." }),
      hint: "Two needs: a water sport and a morning course.", key: "Swimming and windsurfing for beginners. Mornings only", traps: [["Afternoons, 1–4", "clashes with piano"]] },
    { level: 0, id: "rlab-match-2", paras: COURSES.paras, stem: "Thu loves being outdoors and wants to sleep away from home.",
      opts: pick(COURSES, "C", { A: "Outdoors, but she goes home every day.", B: "Indoors, and she goes home every day.", D: "Indoors at the library." }),
      hint: "Which course has nights away?", key: "Three nights in tents", traps: [["Swimming and windsurfing", "outdoors, but home each day"]] },
    { level: 0, id: "rlab-match-3", paras: COURSES.paras, stem: "Long is creative, and his parents want him to have a hot meal at the course.",
      opts: pick(COURSES, "B", { A: "Lunch is not included.", C: "Not a creative course.", D: "Games can be creative, but no lunch is mentioned." }),
      hint: "Creative AND a meal.", key: "lunch provided", traps: [["Lunch not included", "no meal"]] },
    { level: 0, id: "rlab-match-4", paras: CAFES.paras, stem: "Minh is a vegetarian and wants breakfast before school.",
      opts: pick(CAFES, "A", { B: "Beef or chicken: not for a vegetarian.", C: "Cakes and ice cream aren't breakfast, and no times are given.", D: "There's tofu, but it opens at 11 a.m." }),
      hint: "Vegetarian AND open early.", key: "No meat on the menu. Open 7 a.m.", traps: [["Open 11 a.m.–9 p.m.", "too late for breakfast"]] },
    { level: 0, id: "rlab-match-5", paras: CAFES.paras, stem: "Hoa's family want a healthy lunch with their two young children.",
      opts: pick(CAFES, "D", { A: "Healthy, but nothing for children is mentioned.", B: "Open all night, but nothing about children.", C: "Cakes and milkshakes aren't a healthy lunch." }),
      hint: "Healthy, lunch AND children.", key: "Free fruit for children", traps: [["Cakes, ice cream and milkshakes", "not a healthy meal"]] },
    { level: 1, id: "rlab-match-s1", paras: HOTELS.paras, stem: "Mr and Mrs Tran have a baby and would like to go out for dinner alone one evening.",
      opts: pick(HOTELS, "C", { A: "No restaurant and no help with the baby.", B: "A restaurant, but who looks after the baby?", D: "Shared rooms and a lively common room: not good for a baby." }),
      hint: "Alone means someone else looks after the baby.", key: "Babysitting service available in the evenings", traps: [["Rooftop restaurant", "dinner, but who looks after the baby?"]] },
    { level: 1, id: "rlab-match-s2", paras: HOTELS.paras, stem: "Linh wants somewhere peaceful, and she likes to cook her own meals.",
      opts: pick(HOTELS, "A", { B: "It can be noisy at weekends.", C: "Breakfast is included, but there's no kitchen.", D: "A lively common room isn't peaceful." }),
      hint: "Peaceful AND a kitchen.", key: "No restaurant, but a kitchen guests can use", traps: [["Rooms can be noisy at weekends", "not peaceful"]] },
    { level: 1, id: "rlab-match-s3", paras: HOTELS.paras, stem: "Duc is travelling alone on a small budget and wants to meet other travellers.",
      opts: pick(HOTELS, "D", { A: "Free bikes, but quiet and far from people.", B: "Central, but no low prices or a place to meet people.", C: "Family rooms are not for one cheap traveller." }),
      hint: "Cheap AND a way to meet people.", key: "Shared rooms from $8 a night", traps: [["Free bike hire", "free, but not cheap rooms"]] },
    { level: 1, id: "rlab-match-s4", paras: HOTELS.paras, stem: "Mai wants to explore the town on foot after dark, without taking a taxi.",
      opts: pick(HOTELS, "B", { A: "It's 5 km from town.", C: "By the lake, but nothing says it's in town.", D: "Walking tours are in the morning, not after dark." }),
      hint: "On foot after dark: she needs to be in the centre.", key: "Right in the centre, next to the night market", traps: [["5 km from town", "too far to walk"], ["Walking tours every morning", "walking, but in the morning"]] },
    { level: 2, id: "rlab-match-c1", paras: APPS.paras, stem: "Nam often loses his temper and would like regular reminders to practise staying calm.",
      opts: pick(APPS, "C", { A: "It suggests a bedtime, but nothing about anger.", B: "Food, not feelings.", D: "Goals, but for steps." }),
      hint: "Anger AND reminders.", key: "Short breathing exercises to help with stress and anger. Daily reminders", traps: [["suggests a bedtime", "a suggestion, but about sleep"]] },
    { level: 2, id: "rlab-match-c2", paras: APPS.paras, stem: "Vy wants to improve her sleep, but her phone has no internet at night.",
      opts: pick(APPS, "A", { B: "It needs internet, and it's about food.", C: "Calm can help sleep, but nothing says it works offline.", D: "Steps, not sleep." }),
      hint: "Sleep AND no internet.", key: "Works offline", traps: [["Needs internet", "won't work for her"]] },
    { level: 2, id: "rlab-match-c3", paras: APPS.paras, stem: "Long is competitive and wants to become more active, but he doesn't want to spend any money.",
      opts: pick(APPS, "D", { A: "Free, but about sleep.", B: "Free, but about food.", C: "It costs money after the trial." }),
      hint: "Competitive, active AND free.", key: "Compete with friends on a leaderboard", traps: [["$2 a month after a 7-day free trial", "free only at first"]] },
    { level: 2, id: "rlab-match-c4", paras: APPS.paras, stem: "Thao checks food labels to avoid salty snacks. She uses the app in the supermarket, which always has free wifi.",
      opts: pick(APPS, "B", { A: "Sleep, not food.", C: "Calm, not food.", D: "Steps, not food." }),
      hint: "Needs internet looks like a problem. Is it, for Thao?", key: "Scan a barcode to see the sugar, salt and fat", traps: [["Needs internet", "fine here: the shop has wifi"]] }]
},
{ id: "rlab-conversation", n: 6, trap: "conv", part: "Part 3", title: "Complete the conversation", blurb: "Choose the reply that fits the gap. The line after the gap is your best clue.",
  teach: [
    { h: "Look after the gap", p: "Most students only read the line before the gap. The line after is often the best clue: it reacts to the missing reply. \"That's a shame\" means the reply was bad news.",
      eg: { text: "Do you want to go to the theme park? ___ Oh, that's a shame.", note: "So the reply must be no." } },
    { h: "Does it answer the question?", p: "If the line before is a question, the reply must answer it. A yes/no question needs yes or no (or a polite way of saying it). A where question needs a place.",
      eg: { text: "Is this your first visit?", note: "Yes, it is. / No, I came here two years ago." } }],
  items: [
    { level: 0, id: "rlab-conv-1", lines: [["Lan", "Do you want to go to the theme park on Saturday?"], ["Minh", "___"], ["Lan", "Oh, that's a shame. Maybe next weekend then?"]], stem: "Choose Minh's reply.",
      opts: [{ t: "I'd love to, but I'm visiting my grandparents." }, { t: "Yes, let's go at ten! I'll bring snacks.", why: "Then Lan wouldn't say that's a shame." }, { t: "I went there last year with my class.", why: "It doesn't answer the question or fit that's a shame." }, { t: "It's open until six, so let's go early.", why: "That means yes, so Lan wouldn't say that's a shame." }],
      hint: "Read Lan's second line. Was the reply good or bad news?", key: "Oh, that's a shame", traps: [] },
    { level: 0, id: "rlab-conv-2", lines: [["Khoa", "I've got a terrible headache."], ["Mai", "___"], ["Khoa", "No, I've had plenty. I think I just need some sleep."]], stem: "Choose Mai's reply.",
      opts: [{ t: "Have you drunk enough water?" }, { t: "Why don't you go to bed?", why: "Khoa says No, I've had plenty. You can't have plenty of bed." }, { t: "Me too. I'm so tired after school.", why: "No, I've had plenty doesn't fit." }, { t: "Really? I feel great today.", why: "It doesn't fit No, I've had plenty." }],
      hint: "Had plenty of what? Read the line after the gap.", key: "No, I've had plenty", traps: [["I just need some sleep", "tempts you to choose the bed reply"]] },
    { level: 0, id: "rlab-conv-3", lines: [["Guide", "Welcome to the museum! Is this your first visit?"], ["Tourist", "___"], ["Guide", "Then you'll notice we've added a new room since then."]], stem: "Choose the tourist's reply.",
      opts: [{ t: "No, I came here two years ago." }, { t: "Yes, it's my first time.", why: "Then the guide couldn't say since then." }, { t: "Where can I buy a guidebook?", why: "It doesn't answer the question." }, { t: "Two tickets for the new room, please.", why: "It doesn't fit since then." }],
      hint: "Since then: since when?", key: "since then", traps: [] },
    { level: 0, id: "rlab-conv-4", lines: [["Mum", "Why are you so annoyed?"], ["Duc", "___"], ["Mum", "Well, ask him to give it back, then."]], stem: "Choose Duc's reply.",
      opts: [{ t: "Nam borrowed my charger and didn't return it." }, { t: "I failed my maths test this morning.", why: "You can't give back a test." }, { t: "I'm not annoyed. I'm absolutely fine, Mum.", why: "Then Mum wouldn't give advice." }, { t: "My sister ate my sandwich at lunch.", why: "Him is a boy, and an eaten sandwich can't be given back." }],
      hint: "Him and give it back: who has what?", key: "ask him to give it back", traps: [] },
    { level: 0, id: "rlab-conv-5", lines: [["Waiter", "Are you ready to order?"], ["Thu", "___"], ["Waiter", "Of course. I'll come back in a few minutes."]], stem: "Choose Thu's reply.",
      opts: [{ t: "Could we have a little more time, please?" }, { t: "Yes, I'll have the fish, please.", why: "Then the waiter would take the order, not come back later." }, { t: "Can we have the bill now, please?", why: "They haven't eaten yet." }, { t: "It was delicious, thank you very much.", why: "They haven't ordered yet." }],
      hint: "Why will the waiter come back later?", key: "I'll come back in a few minutes", traps: [] },
    { level: 1, id: "rlab-conv-s1", lines: [["Hoa", "How was the eco-camping trip?"], ["Bao", "___"], ["Hoa", "Really? I thought you hated insects!"], ["Bao", "I did, but the guide showed us how interesting they are."]], stem: "Choose Bao's reply.",
      opts: [{ t: "Amazing! The best part was the insect walk at night." }, { t: "Terrible. There were insects everywhere.", why: "Then why would Hoa be surprised (Really?)?" }, { t: "I didn't go in the end. I stayed at home.", why: "Bao then talks about the guide on the trip." }, { t: "It was quite expensive, but the food was good.", why: "It doesn't fit Hoa's reply about insects." }],
      hint: "Hoa is surprised. What would surprise her?", key: "Really? I thought you hated insects!", traps: [["I did", "he used to hate them"]] },
    { level: 1, id: "rlab-conv-s2", lines: [["Teacher", "You look exhausted, Minh."], ["Minh", "___"], ["Teacher", "That's far too late. Try putting your phone in another room tonight."]], stem: "Choose Minh's reply.",
      opts: [{ t: "I was messaging my friends until after midnight." }, { t: "I went to bed at nine, but I couldn't sleep.", why: "Nine isn't far too late." }, { t: "I had a big breakfast but no lunch today.", why: "Nothing about a time or a phone." }, { t: "I was doing homework all evening.", why: "Close, but the advice is about his phone." }],
      hint: "Two clues: far too late and the phone.", key: "That's far too late", traps: [] },
    { level: 1, id: "rlab-conv-s3", lines: [["Receptionist", "Good evening. Do you have a reservation?"], ["Guest", "___"], ["Receptionist", "I'm sorry, but we're fully booked tonight. There's a guesthouse across the road."]], stem: "Choose the guest's reply.",
      opts: [{ t: "No, I'm afraid not. Do you have a room for one night?" }, { t: "Yes, I booked online under the name Nguyen.", why: "With a reservation there would be a room." }, { t: "Where is the swimming pool, and is it open?", why: "It doesn't answer the question." }, { t: "Can I pay by card when I check out?", why: "It doesn't fit fully booked." }],
      hint: "Why does the receptionist send the guest across the road?", key: "we're fully booked tonight", traps: [] },
    { level: 1, id: "rlab-conv-s4", lines: [["Lan", "I can't decide whether to join the debate club or the basketball team."], ["Vy", "___"], ["Lan", "True. And I'm not very tall anyway!"]], stem: "Choose Vy's reply.",
      opts: [{ t: "Well, you're really good at arguing your point." }, { t: "Basketball is more fun, I think. Join the team!", why: "True + not very tall means Lan is choosing debate." }, { t: "Why don't you do both? You've got time.", why: "True doesn't answer a question." }, { t: "I've joined the chess club this year.", why: "Lan's True agrees with something about her." }],
      hint: "True agrees with a statement. Which club is Lan choosing?", key: "True. And I'm not very tall anyway!", traps: [] },
    { level: 2, id: "rlab-conv-c1", lines: [["Journalist", "Some people say tourism is ruining the island. Would you agree?"], ["Hotel owner", "___"], ["Journalist", "So you think the problem is how visitors are managed, not tourism itself?"]], stem: "Choose the hotel owner's reply.",
      opts: [{ t: "Not entirely. Visitors aren't the problem; the lack of planning is." }, { t: "Yes, completely. Tourism has ruined it, and we should stop it now.", why: "The journalist sums up: not tourism itself." }, { t: "No. Tourism has no effect at all on the island or its people.", why: "Then the journalist wouldn't talk about how visitors are managed." }, { t: "I've owned this hotel for twenty years, so I know the island well.", why: "It doesn't answer whether he agrees." }],
      hint: "The journalist's So... sums up what the owner said.", key: "the problem is how visitors are managed, not tourism itself", traps: [] },
    { level: 2, id: "rlab-conv-c2", lines: [["Doctor", "So, how long have you had this cough?"], ["Patient", "___"], ["Doctor", "And it hasn't got any better since then, even with the medicine?"]], stem: "Choose the patient's reply.",
      opts: [{ t: "About two weeks. I started taking cough syrup last Monday." }, { t: "It's much better now, thank you, but I still feel tired.", why: "The doctor asks if it hasn't got better." }, { t: "Since I was a child, but it comes and goes.", why: "Then the medicine has nothing to link to." }, { t: "I don't take any medicine for it at the moment.", why: "The doctor mentions the medicine." }],
      hint: "The doctor mentions the medicine. Where did it come from?", key: "even with the medicine", traps: [] },
    { level: 2, id: "rlab-conv-c3", lines: [["Vy", "Did you enjoy the food tour in Hanoi?"], ["Tom", "___"], ["Vy", "That's a pity. Still, at least you tried something new!"]], stem: "Choose Tom's reply.",
      opts: [{ t: "To be honest, most of it was too spicy for me." }, { t: "It was the highlight of my whole trip to Asia!", why: "Then Vy wouldn't say that's a pity." }, { t: "I didn't go in the end. I was ill all weekend.", why: "At least you tried something new means he went." }, { t: "I'd love to go again next year with my family.", why: "It doesn't fit that's a pity." }],
      hint: "Two clues: that's a pity AND you tried something new.", key: "That's a pity. Still, at least you tried something new!", traps: [] },
    { level: 2, id: "rlab-conv-c4", lines: [["Coach", "You played brilliantly today, but you seemed frustrated at half-time."], ["Player", "___"], ["Coach", "I understand, but shouting at the referee won't change his decision."]], stem: "Choose the player's reply.",
      opts: [{ t: "I was. I really didn't think that was a foul." }, { t: "Not at all. I was completely calm the whole time.", why: "The coach says I understand, so the player admitted it." }, { t: "Thanks. I've been training hard every morning.", why: "It doesn't reply to frustrated." }, { t: "My teammates didn't pass the ball to me enough.", why: "The coach's answer is about the referee." }],
      hint: "Who was the player frustrated with?", key: "shouting at the referee won't change his decision", traps: [] }]
},
{ id: "rlab-gaps", n: 7, trap: "gap", part: "Parts 1 and 2", title: "Fill the gap", blurb: "Linking words, prepositions and word partners: read the whole sentence before you choose.",
  teach: [
    { h: "Read the whole sentence", p: "Don't just look at the word before the gap. Read to the end. Is the second part a result (so), a reason (because) or a contrast (but, although)?",
      eg: { text: "Many teenagers don't get enough sleep, ___ they often feel tired at school.", note: "Feeling tired is a result: so." } },
    { h: "Words that go together", p: "Some words always go together: catch a cold, take control, arrive at, despite + noun. If two options mean the same, the words around the gap decide.",
      eg: { text: "If you wash your hands often, you are less likely to ___ a cold.", note: "We catch a cold, never take or hold a cold." } }],
  items: [
    { level: 0, id: "rlab-gap-1", paras: [["", "Many teenagers don't get enough sleep, ___ they often feel tired at school."]], stem: "Choose the word for the gap.",
      opts: [{ t: "so" }, { t: "because", why: "Because gives a reason, but feeling tired is a result." }, { t: "but", why: "There's no contrast here." }, { t: "although", why: "There's no contrast here." }],
      hint: "Is feeling tired a reason, a result or a contrast?", key: "they often feel tired", traps: [] },
    { level: 0, id: "rlab-gap-2", paras: [["", "It was late in the evening when we arrived ___ the campsite."]], stem: "Choose the word for the gap.",
      opts: [{ t: "at" }, { t: "to", why: "We say arrive at a place, never arrive to." }, { t: "in", why: "Arrive in is for cities and countries." }, { t: "on", why: "On doesn't go with arrive and a place." }],
      hint: "Arrive + a building or small place.", key: "arrived", traps: [] },
    { level: 0, id: "rlab-gap-3", paras: [["", "Fast food is cheap and quick, ___ it is often high in fat and salt."]], stem: "Choose the word for the gap.",
      opts: [{ t: "but" }, { t: "so", why: "High in fat isn't a result of being cheap." }, { t: "because", why: "It isn't the reason it's cheap." }, { t: "or", why: "Or gives a choice." }],
      hint: "Good things, then a bad thing: what links them?", key: "cheap and quick", traps: [] },
    { level: 0, id: "rlab-gap-4", paras: [["", "If you wash your hands often, you are less likely to ___ a cold."]], stem: "Choose the word for the gap.",
      opts: [{ t: "catch" }, { t: "take", why: "We say catch a cold, not take a cold." }, { t: "hold", why: "We say catch a cold, not hold a cold." }, { t: "make", why: "We say catch a cold, not make a cold." }],
      hint: "Which verb goes with a cold?", key: "a cold", traps: [] },
    { level: 0, id: "rlab-gap-5", paras: [["", "The hotel was full, so we had ___ stay in a guesthouse."]], stem: "Choose the word for the gap.",
      opts: [{ t: "to" }, { t: "for", why: "Have to + verb means must." }, { t: "at", why: "Have to + verb means must." }, { t: "and", why: "Have to + verb means must." }],
      hint: "Have ___ + verb = must.", key: "had", traps: [] },
    { level: 1, id: "rlab-gap-s1", paras: [["", "___ the bad weather, thousands of tourists visited the festival."]], stem: "Choose the word for the gap.",
      opts: [{ t: "Despite" }, { t: "Although", why: "Although needs a subject and a verb after it." }, { t: "Because", why: "Bad weather isn't a reason to visit." }, { t: "However", why: "However starts a sentence and is followed by a comma." }],
      hint: "A contrast + a noun (the bad weather).", key: "the bad weather", traps: [] },
    { level: 1, id: "rlab-gap-s2", paras: [["", "Breathing slowly can help you ___ control of your anger."]], stem: "Choose the word for the gap.",
      opts: [{ t: "take" }, { t: "make", why: "We say take control, not make control." }, { t: "do", why: "We say take control, not do control." }, { t: "give", why: "We say take control, not give control." }],
      hint: "Which verb goes with control?", key: "control", traps: [] },
    { level: 1, id: "rlab-gap-s3", paras: [["", "The guide, ___ had lived in the village all her life, knew every family."]], stem: "Choose the word for the gap.",
      opts: [{ t: "who" }, { t: "which", why: "Which is for things, not people." }, { t: "where", why: "Where is for places." }, { t: "whose", why: "Whose needs a noun after it." }],
      hint: "The gap is about the guide: a person.", key: "The guide", traps: [] },
    { level: 1, id: "rlab-gap-s4", paras: [["", "Most people recover from flu within a week. ___, older people may need longer."]], stem: "Choose the word for the gap.",
      opts: [{ t: "However" }, { t: "Therefore", why: "Therefore shows a result; this is a contrast." }, { t: "Because", why: "Because can't start a sentence and then a comma like this." }, { t: "Despite", why: "Despite needs a noun after it." }],
      hint: "A week ... longer: a contrast.", key: "older people may need longer", traps: [] },
    { level: 2, id: "rlab-gap-c1", paras: [["", "The island's coral reef has been badly damaged, ___ is why diving is now limited."]], stem: "Choose the word for the gap.",
      opts: [{ t: "which" }, { t: "that", why: "After a comma, use which to talk about the whole idea." }, { t: "what", why: "What can't refer back to the first part." }, { t: "this", why: "This would need a new sentence." }],
      hint: "The gap refers back to the whole first part of the sentence.", key: "is why diving is now limited", traps: [] },
    { level: 2, id: "rlab-gap-c2", paras: [["", "Scientists have ___ evidence of a link between poor sleep and a weaker immune system."]], stem: "Choose the word for the gap.",
      opts: [{ t: "found" }, { t: "made", why: "We find evidence; we don't make it." }, { t: "done", why: "We find evidence; we don't do it." }, { t: "taken", why: "We find evidence; we don't take it." }],
      hint: "Which verb goes with evidence?", key: "evidence", traps: [] },
    { level: 2, id: "rlab-gap-c3", paras: [["", "Hardly ___ the tour begun when it started to rain."]], stem: "Choose the word for the gap.",
      opts: [{ t: "had" }, { t: "was", why: "Begun needs had (the past perfect)." }, { t: "did", why: "Begun needs had (the past perfect)." }, { t: "has", why: "The story is in the past." }],
      hint: "Hardly + ___ + subject + past participle (begun).", key: "begun", traps: [] },
    { level: 2, id: "rlab-gap-c4", paras: [["", "Not only is the hostel cheap, ___ it is also close to the beach."]], stem: "Choose the word for the gap.",
      opts: [{ t: "but" }, { t: "and", why: "Not only ... but also is a fixed pair." }, { t: "so", why: "Not only ... but also is a fixed pair." }, { t: "or", why: "Not only ... but also is a fixed pair." }],
      hint: "Not only ... ___ also.", key: "Not only", traps: [] }]
},
{ id: "rlab-inference", n: 8, trap: "infer", part: "Part 6", title: "Read between the lines", blurb: "Feelings, purpose and opinion: what the writer means but doesn't say.",
  teach: [
    { h: "Actions show feelings", p: "Writers often show a feeling instead of naming it. Slamming a door, smiling, sighing, checking a watch: these are clues. Ask: what would make someone do this?",
      eg: { text: "\"It's fine,\" said Hoa, slamming her bedroom door behind her.", note: "She says fine, but slamming the door shows she's upset." } },
    { h: "Why did the writer write this?", p: "Purpose questions ask why: to persuade, to warn, to complain, to advise, to describe. Look at the whole text, especially the beginning and the end, not one detail.",
      eg: { text: "Why not try a vegetarian dish once a week? You might find a new favourite!", note: "Why not...? and You might... are persuading." } }],
  items: [
    { level: 0, id: "rlab-infer-1", paras: [["", "When Lan opened her exam results, she screamed and ran to hug her mum. Then she called her grandparents to tell them the news."]], stem: "How did Lan feel?",
      opts: [{ t: "delighted" }, { t: "worried", why: "Would a worried person phone everyone with the news?" }, { t: "angry", why: "Screaming can be angry, but hugging and phoning family?" }, { t: "disappointed", why: "People don't usually share disappointing news so quickly." }],
      hint: "Look at all three actions together.", key: "ran to hug her mum", traps: [["she screamed", "could be many feelings: read on"]] },
    { level: 0, id: "rlab-infer-2", paras: [["", "Everyone in the queue for the cable car had been waiting for over an hour. Some people were checking their watches; others had given up and gone back to the car park."]], stem: "What can we guess about the queue?",
      opts: [{ t: "It was moving very slowly." }, { t: "It was very short.", why: "Over an hour isn't short." }, { t: "People were enjoying it.", why: "Checking watches and giving up don't sound like fun." }, { t: "The cable car was free.", why: "The price isn't mentioned." }],
      hint: "What do checking watches and giving up tell you?", key: "waiting for over an hour", traps: [] },
    { level: 0, id: "rlab-infer-3", paras: [["", "Why not try a vegetarian dish once a week? It's good for your health, cheaper than meat and better for the planet. You might find a new favourite!"]], stem: "Why did the writer write this?",
      opts: [{ t: "to encourage readers to eat less meat" }, { t: "to tell readers to stop eating meat", why: "Once a week, not stop completely." }, { t: "to describe a restaurant", why: "No restaurant is mentioned." }, { t: "to explain how to cook vegetables", why: "No cooking instructions." }],
      hint: "Why not...? is a suggestion.", key: "Why not try a vegetarian dish once a week?", traps: [["better for the planet", "a reason, not the purpose"]] },
    { level: 0, id: "rlab-infer-4", paras: [["", "Minh looked at the empty fridge, then at the clock: 9.30 p.m. The shop on the corner closed at nine. He sighed and made himself another cup of instant noodles."]], stem: "What can we understand about Minh?",
      opts: [{ t: "He couldn't buy the food he wanted." }, { t: "He loves instant noodles.", why: "He sighed, so noodles weren't his first choice." }, { t: "The shop was still open.", why: "It closed at nine, and it's 9.30." }, { t: "He had just eaten a big dinner.", why: "Nothing suggests this." }],
      hint: "Why does the writer tell us the time and when the shop closed?", key: "The shop on the corner closed at nine", traps: [["made himself another cup of instant noodles", "what he did, not what he wanted"]] },
    { level: 0, id: "rlab-infer-5", paras: [["", "The hotel advert promised \"stunning sea views\". From our room, if you stood on the bed and looked between two buildings, you could just see a small blue line."]], stem: "What does the writer think?",
      opts: [{ t: "The advert was misleading." }, { t: "The view was wonderful.", why: "Standing on the bed to see a small line?" }, { t: "The buildings were beautiful.", why: "The buildings are in the way." }, { t: "The bed was uncomfortable.", why: "The bed is only where he stood." }],
      hint: "Compare what the advert promised with what he saw.", key: "if you stood on the bed and looked between two buildings", traps: [["\"stunning sea views\"", "the advert's words, not his"]] },
    { level: 1, id: "rlab-infer-s1", paras: [["", "I used to think camping was for people who enjoyed being uncomfortable. Then my cousin persuaded me to spend a weekend in Bach Ma National Park. I've already booked my next trip."]], stem: "What has happened to the writer's opinion?",
      opts: [{ t: "It has completely changed." }, { t: "It has stayed the same.", why: "Used to think signals a change." }, { t: "She is now angry with her cousin.", why: "Nothing suggests this." }, { t: "She still thinks camping is uncomfortable.", why: "She's booked another trip!" }],
      hint: "Used to think ... and then what did she do?", key: "I've already booked my next trip", traps: [["camping was for people who enjoyed being uncomfortable", "her old opinion"]] },
    { level: 1, id: "rlab-infer-s2", paras: [["", "Dr An's research shows that students who eat breakfast score higher in morning tests. Yet in the school she studied, nearly half of the students arrive without having eaten. She hopes the school will open its canteen earlier."]], stem: "What is the purpose of the last sentence?",
      opts: [{ t: "to suggest a possible solution" }, { t: "to explain why students skip breakfast", why: "No reason is given." }, { t: "to criticise the students", why: "She doesn't blame them." }, { t: "to describe her research", why: "That's the first sentence." }],
      hint: "She hopes... what would that change?", key: "She hopes the school will open its canteen earlier", traps: [["nearly half of the students arrive without having eaten", "the problem, not the solution"]] },
    { level: 1, id: "rlab-infer-s3", paras: [["", "The guidebook told us the walk to the waterfall was \"moderate\". Three hours later, soaked in sweat and covered in mud, we decided the writer must have been an Olympic athlete."]], stem: "What does the writer mean?",
      opts: [{ t: "The walk was much harder than described." }, { t: "The guidebook writer really was an athlete.", why: "This is a joke, not a fact." }, { t: "The walk was easy.", why: "Soaked and muddy after three hours?" }, { t: "They never reached the waterfall.", why: "We aren't told." }],
      hint: "Is the last part serious or a joke?", key: "soaked in sweat and covered in mud", traps: [["must have been an Olympic athlete", "a joke"]] },
    { level: 1, id: "rlab-infer-s4", paras: [["", "\"It's fine,\" said Hoa, slamming her bedroom door behind her."]], stem: "How does Hoa really feel?",
      opts: [{ t: "upset" }, { t: "relaxed", why: "Slamming a door isn't relaxed." }, { t: "fine", why: "Her words say fine; her actions don't." }, { t: "sleepy", why: "Nothing suggests this." }],
      hint: "Trust her actions more than her words.", key: "slamming her bedroom door", traps: [["\"It's fine,\"", "what she says, not how she feels"]] },
    { level: 2, id: "rlab-infer-c1", paras: [["", "Visitors flock to the \"traditional\" village to watch craftspeople weave baskets. Few notice that the baskets in the gift shop carry labels from a factory three hundred kilometres away."]], stem: "What is the writer suggesting?",
      opts: [{ t: "The village is less authentic than it appears." }, { t: "The baskets are made in the village.", why: "The labels say a factory far away." }, { t: "Visitors should not buy baskets in the gift shop.", why: "The writer doesn't give advice." }, { t: "The craftspeople are too slow to make enough.", why: "Not suggested." }],
      hint: "Why is \"traditional\" in quotation marks?", key: "carry labels from a factory three hundred kilometres away", traps: [] },
    { level: 2, id: "rlab-infer-c2", paras: [["", "Some argue that banning phones in schools is an overreaction. Yet teachers in schools that introduced bans report calmer corridors, longer conversations at lunch and, crucially, fewer students arriving at lessons already upset by something online."]], stem: "What is the writer's view of phone bans?",
      opts: [{ t: "They seem to have clear benefits." }, { t: "They are an overreaction.", why: "That's what some argue. Yet introduces the writer's view." }, { t: "Teachers dislike them.", why: "Teachers report good results." }, { t: "They have made lessons longer.", why: "Conversations at lunch are longer, not lessons." }],
      hint: "Some argue... Yet... Whose view comes after yet?", key: "crucially, fewer students arriving at lessons already upset", traps: [["an overreaction", "other people's view"]] },
    { level: 2, id: "rlab-infer-c3", paras: [["", "Grandma insists that her generation never needed sports drinks or energy bars. \"We had water and a banana,\" she says, \"and we climbed mountains.\" She has a point, although she rarely mentions that the mountains were usually the small hills behind the village."]], stem: "What is the writer's attitude towards Grandma?",
      opts: [{ t: "fond but slightly amused" }, { t: "completely critical", why: "She has a point shows some agreement." }, { t: "totally convinced", why: "The joke about small hills shows some doubt." }, { t: "angry", why: "The tone is gentle." }],
      hint: "She has a point, although... agrees and teases at the same time.", key: "She has a point, although", traps: [["we climbed mountains", "her claim, which the writer gently questions"]] },
    { level: 2, id: "rlab-infer-c4", paras: [["", "The new resort describes itself as \"eco-friendly\" because guests reuse their towels. Its golf course, however, uses more water each day than the whole village nearby."]], stem: "Why does the writer mention the golf course?",
      opts: [{ t: "to question the resort's green claims" }, { t: "to recommend the golf course", why: "Using lots of water isn't a recommendation." }, { t: "to show that the village needs more water", why: "The point is about the resort." }, { t: "to explain how towels are reused", why: "That's the first sentence." }],
      hint: "Compare the towels with the golf course.", key: "uses more water each day than the whole village nearby", traps: [["because guests reuse their towels", "the resort's small reason"]] }]
}];

// The units whose Reading tab shows the Reading Lab (its texts are on their topics).
export const RLAB_UNITS = [2, 3];
export const rlabMission = id => RLAB.find(m => m.id === id);
export const isRLab = id => /^rlab-/.test(id || "") && !!rlabMission(id);
export const isRLabAttempt = h => isRLab(h.text_id);
const rAnswers = h => (h.answers || []).filter(a => a.skill === "Reading Lab");
// The passage as one string (for checks and highlighting).
export const passageText = it => (it.paras || it.lines).map(p => p[1]).join(" ");

// Start where the last Reading Lab mission ended; otherwise at the student's reading tier.
export function rlabStartLevel(history, tier = 0) {
  const last = history.filter(isRLabAttempt).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || ""))).map(rAnswers).find(a => a.length);
  if (!last) return tier;
  const a = last[last.length - 1];
  return Math.max(0, Math.min(2, a.next ?? a.level ?? 0));
}
export const seenRItems = history => new Set(history.filter(isRLabAttempt).flatMap(h => rAnswers(h).map(a => a.rlab)));
export const rlabPeak = answers => answers.filter(a => a.skill === "Reading Lab").reduce((p, a) => Math.max(p, a.level || 0), 0);

// The reading trap tracker: Reading Lab answers per trap. caught = not right first time; rate counts a harder question
// answered right as more (Stretch 1.5, Challenge 2), like the listening tracker.
export function rTrapStats(history) {
  const out = Object.fromEntries(Object.keys(RTRAPS).map(k => [k, { trap: k, total: 0, caught: 0, w: 0 }]));
  history.forEach(h => rAnswers(h).forEach(a => { const t = out[a.trap]; if (!t) return;
    t.total++; if (!a.first_try) { t.caught++; t.w++; } else t.w += 1 + 0.5 * (a.level || 0); }));
  return Object.values(out).map(({ w, ...t }) => ({ ...t, rate: w ? t.caught / w : 0 }));
}
export function weakestRTrap(history) {
  const s = rTrapStats(history).filter(t => t.caught >= 2 && t.rate >= 1 / 3).sort((a, b) => b.rate - a.rate || b.caught - a.caught);
  return s.length ? s[0].trap : null;
}
export const rMissionForTrap = trap => RLAB.find(m => m.trap === trap);
