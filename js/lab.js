// Listening Lab: six short missions on the tricks examiners use in listening questions, and how to get ready for a question.
// Each mission: two teaching cards, then short clips with one question each. After every answer the transcript shows the
// words that give the answer (key) and the trap (traps). Option 0 is always the right one (shuffled on screen); a wrong
// option's "why" says why it is wrong without giving the answer. Clip audio: audio/listening/<clip id>.mp3, made by
// tools/make_listening_audio.py from LAB_CLIPS (same voices rules as js/listening.js: no blending, no pitch change).
// "Prime your brain" items also have keys (words to underline), the answer type and a prediction step.
// Don't rename mission or clip ids: saved results are keyed by them.

const T1 = "af_heart", T2 = "af_bella", T3 = "af_nicole", B1 = "am_puck", B2 = "am_liam";   // teenagers
const MUM = "af_sarah", DAD = "am_michael", MAN = "bm_daniel", WOMAN = "bf_emma", WOMAN2 = "bf_isabella";

export const TRAPS = {
  prime: { name: "Getting ready", tip: "Read the question first, underline the key words and predict the answer." },
  synonym: { name: "Synonyms", tip: "The recording uses different words with the same meaning. The same word as an option can be a trap." },
  distractor: { name: "Distractors", tip: "More than one option is mentioned. Listen for a change of mind: but, actually, instead, in the end." },
  herring: { name: "Red herrings", tip: "Check who the question is about and when: past, now or a plan that changed." },
  numbers: { name: "Numbers and spelling", tip: "Numbers that sound alike, corrections (sorry, I mean…), sums and spelt names." },
  opinion: { name: "Opinions", tip: "Listen to how people feel, not just what they say. The words after but usually matter most." }
};
export const ANSWER_TYPES = ["a time", "a place", "a number or price", "a person", "a reason", "a feeling", "a thing or activity"];

export const LAB = [
{ id: "lab-prime", n: 1, trap: "prime", title: "Prime your brain", blurb: "Use the reading time: underline key words and predict the answer before you listen.",
  teach: [
    { h: "Use your reading time", p: "In the exam you get time to read the questions before the recording starts. Don't waste it! Underline the key words: the question word (What? When? Why? How much?) and the words that tell you the topic.",
      eg: { q: "What time does the school bus leave on Friday?", keys: ["What", "time", "bus", "leave", "Friday"] } },
    { h: "Predict before you listen", p: "Ask yourself: what type of answer do I need? A time, a place, a number, a feeling, a reason? Then think of words you might hear. Your brain will be ready to catch them.",
      eg: { q: "Why did the concert start late?", note: "A reason: listen for because, so, the problem was, that's why." } }],
  items: [
    { clip: "lab-prime-1", stem: "What time does the school trip bus leave?", keys: ["What", "time", "bus", "leave"], type: "a time",
      predict: [["7.45", true], ["the car park", false], ["8.15", true], ["Mr Hall", false]],
      lines: [["TEACHER", "Right, everyone, about Friday's trip to the science museum. Last year the bus left at quarter past eight, but the traffic was terrible, so this time we're leaving half an hour earlier, at quarter to eight. Please be in the car park by half past seven."]],
      voices: { TEACHER: MAN },
      opts: [{ t: "7.45" }, { t: "8.15", why: "That was last year's time." }, { t: "7.30", why: "That's when to be in the car park, not when the bus leaves." }, { t: "8.45", why: "Listen again for \"earlier\"." }],
      hint: "Three times are mentioned. Which one is about the bus leaving this year?", key: "at quarter to eight", traps: [["quarter past eight", "last year"], ["by half past seven", "when to arrive"]] },
    { clip: "lab-prime-2", stem: "Where did Lena lose her phone?", keys: ["Where", "Lena", "lose", "phone"], type: "a place",
      predict: [["on the bus", true], ["yesterday", false], ["at the cinema", true], ["her brother", false]],
      lines: [["LENA", "I thought I'd left my phone at the cinema, so I went back and asked, but they didn't have it."], ["TOM", "Did you check the bus?"],
              ["LENA", "I called the bus company too. In the end, my mum found it in the café where we had lunch. It had fallen under the table."]],
      voices: { LENA: T1, TOM: B1 },
      opts: [{ t: "in a café" }, { t: "at the cinema", why: "She thought so, but they didn't have it." }, { t: "on the bus", why: "Tom asked about the bus. Was it there?" }, { t: "at home", why: "Home isn't mentioned." }],
      hint: "She checks three places. Listen for \"in the end\".", key: "in the café where we had lunch", traps: [["at the cinema", "she only thought so"], ["the bus", "she checked, it wasn't there"]] },
    { clip: "lab-prime-3", stem: "How does Sam feel about the new sports centre?", keys: ["How", "Sam", "feel", "sports centre"], type: "a feeling",
      predict: [["disappointed", true], ["excited", true], ["on Saturday", false], ["the pool", false]],
      lines: [["SAM", "Everyone said the new sports centre would be amazing, and the pool really is huge. But it's so expensive that I can only afford to go once a month, which is a real shame."]],
      voices: { SAM: B2 },
      opts: [{ t: "disappointed" }, { t: "amazed", why: "\"Amazing\" is what everyone else said." }, { t: "bored", why: "Nothing is boring for Sam. What is his problem?" }, { t: "scared", why: "Nothing frightens him." }],
      hint: "Listen to what comes after \"But\".", key: "which is a real shame", traps: [["amazing", "other people's opinion"]] },
    { clip: "lab-prime-4", stem: "Why did the concert in the park start late?", keys: ["Why", "concert", "start", "late"], type: "a reason",
      predict: [["because of the rain", true], ["the singer was ill", true], ["at nine o'clock", false], ["in the park", false]],
      lines: [["PRESENTER", "Last night's concert in the park started an hour late. Some people thought it was because of the rain, but in fact the rain had stopped by six. The real problem was that the band's van broke down on the motorway."]],
      voices: { PRESENTER: WOMAN },
      opts: [{ t: "The band's van broke down." }, { t: "It was raining.", why: "Some people thought so, but the rain had stopped." }, { t: "The singer was ill.", why: "Nobody was ill." }, { t: "The park was closed.", why: "The park isn't the problem." }],
      hint: "Listen for \"the real problem\".", key: "the band's van broke down", traps: [["because of the rain", "what some people thought"]] },
    { clip: "lab-prime-5", stem: "How much does Mia pay for her exhibition ticket?", keys: ["How much", "Mia", "pay", "ticket"], type: "a number or price",
      predict: [["£6", true], ["Saturday", false], ["£4.50", true], ["online", false]],
      lines: [["MIA", "How much is a ticket for the exhibition?"], ["MAN", "Adults are nine pounds, and it's six for students. Oh, but on Tuesdays everything's half price."],
              ["MIA", "It's Saturday today, isn't it? So six pounds for me, then."]],
      voices: { MIA: T2, MAN },
      opts: [{ t: "£6" }, { t: "£9", why: "That's the adult price." }, { t: "£3", why: "Half price is only on Tuesdays." }, { t: "£4.50", why: "Half of nine, but which day is it?" }],
      hint: "Is Mia an adult or a student? What day is it?", key: "So six pounds for me", traps: [["nine pounds", "adult price"], ["half price", "only on Tuesdays"]] }] },

{ id: "lab-synonym", n: 2, trap: "synonym", title: "Synonyms and paraphrase", blurb: "Same meaning, different words, and why hearing the same word can be a trap.",
  teach: [
    { h: "Same meaning, different words", p: "The recording almost never uses the words in the question or the options. Listen for the same meaning said in another way.",
      eg: { opt: "It was close to the sea.", said: "You could walk to the beach in two minutes." } },
    { h: "Same word? Be careful!", p: "If you hear the exact word from an option, check it carefully. Examiners often put it there as a trap, for example with not in front of it.",
      eg: { opt: "The hotel was special.", said: "The hotel itself wasn't anything special.", note: "Same word, opposite meaning." } }],
  items: [
    { clip: "lab-syn-1", stem: "What does Maya say about the hotel?", lines: [["MAYA", "The hotel itself wasn't anything special, but you could walk to the beach in two minutes."]], voices: { MAYA: T1 },
      opts: [{ t: "It was close to the sea." }, { t: "It was very special.", why: "Same word, but she said it \"wasn't anything special\"." }, { t: "It was far from the beach.", why: "How long did it take to walk to the beach?" }, { t: "It was expensive.", why: "She doesn't talk about the price." }],
      hint: "Which option means the same as the second half of what she says?", key: "you could walk to the beach in two minutes", traps: [["wasn't anything special", "same word, opposite meaning"]] },
    { clip: "lab-syn-2", stem: "Why didn't Jake enjoy the end of the hike?", lines: [["JAKE", "The views were great, honestly. It's just that by the end my legs were aching and I couldn't wait to sit down."]], voices: { JAKE: B1 },
      opts: [{ t: "He was exhausted." }, { t: "The views were poor.", why: "He said the views were great." }, { t: "It was too short.", why: "Does he want more walking?" }, { t: "He got lost.", why: "He doesn't get lost." }],
      hint: "How did his legs feel? What did he want to do?", key: "my legs were aching and I couldn't wait to sit down", traps: [["The views were great", "true, but not the problem"]] },
    { clip: "lab-syn-3", stem: "What time does the museum close on Sundays?", lines: [["MESSAGE", "Thank you for calling the City Museum. We are open from ten a.m. every day. On weekdays we close at six, and at weekends we close two hours earlier."]], voices: { MESSAGE: WOMAN },
      opts: [{ t: "4 pm" }, { t: "6 pm", why: "That's on weekdays. Is Sunday a weekday?" }, { t: "10 am", why: "That's when it opens." }, { t: "8 pm", why: "Earlier or later?" }],
      hint: "Sunday isn't said. Which word means Saturday and Sunday?", key: "at weekends we close two hours earlier", traps: [["On weekdays we close at six", "weekdays only"], ["from ten a.m.", "opening time"]] },
    { clip: "lab-syn-4", stem: "What was the problem at the restaurant?", lines: [["MAN", "The food was fine, but we waited forty-five minutes before anyone even took our order."]], voices: { MAN },
      opts: [{ t: "The service was slow." }, { t: "The food was terrible.", why: "He said the food was fine." }, { t: "They couldn't get a table.", why: "They were sitting down, waiting." }, { t: "The waiters were rude.", why: "He doesn't say they were rude." }],
      hint: "Forty-five minutes of waiting: which option says that in other words?", key: "we waited forty-five minutes before anyone even took our order", traps: [["The food was fine", "not the problem"]] },
    { clip: "lab-syn-5", stem: "How did Priya get to the festival?", lines: [["PRIYA", "Dad offered to drive us, but parking there is a nightmare, so in the end we cycled. It only took twenty minutes."]], voices: { PRIYA: T2 },
      opts: [{ t: "by bike" }, { t: "by car", why: "Dad offered, but did they go with him?" }, { t: "on foot", why: "Walking isn't mentioned." }, { t: "by bus", why: "There's no bus." }],
      hint: "Listen for \"in the end\". Which option means the same as that verb?", key: "in the end we cycled", traps: [["Dad offered to drive us", "an offer, not what happened"]] },
    { clip: "lab-syn-6", final: true, stem: "What is the girl's main problem with her new phone?", lines: [["GIRL", "I love the camera on my new phone, and the screen is brilliant. The only thing is, I have to charge it twice a day, which is really annoying when I'm out."]], voices: { GIRL: T3 },
      opts: [{ t: "The battery doesn't last long." }, { t: "The camera is poor.", why: "She loves the camera." }, { t: "The screen is too small.", why: "She says the screen is brilliant." }, { t: "It was too expensive.", why: "The price isn't mentioned." }],
      hint: "Listen for \"the only thing is\". What does she have to do twice a day?", key: "I have to charge it twice a day", traps: [["the screen is brilliant", "she likes it"]] }] },

{ id: "lab-distractor", n: 3, trap: "distractor", title: "Distractors", blurb: "Every option is mentioned, but only one is the answer. Listen for the change of mind.",
  teach: [
    { h: "They mention every option", p: "In a Checkpoint question you will often hear most of the options. Only one is the answer. The others are distractors, put there to catch you if you choose the first thing you hear.",
      eg: { said: "Shall we get pizza? … What about burgers? … Let's just get noodles.", note: "Three foods, one answer." } },
    { h: "Listen for the change of mind", p: "Signal words tell you a plan is changing: but, actually, instead, in the end, no wait, so we, then. The answer usually comes after them.",
      eg: { said: "I was going to choose basketball, but… Actually, I'll start with swimming.", note: "The answer comes after \"actually\"." } }],
  items: [
    { clip: "lab-dist-1", stem: "Which sport will Leo try first?", lines: [["COACH", "So, Leo, this term you can try basketball, swimming or tennis."], ["LEO", "I was going to choose basketball, but my friend says the swimming club is really fun. Actually, I'll start with swimming, and maybe try tennis after Christmas."]], voices: { COACH: MAN, LEO: B2 },
      opts: [{ t: "swimming" }, { t: "basketball", why: "That was his first plan. Did he keep it?" }, { t: "tennis", why: "Tennis is for later, after Christmas." }, { t: "football", why: "Football isn't one of the choices." }],
      hint: "Listen for \"Actually\".", key: "Actually, I'll start with swimming", traps: [["I was going to choose basketball", "changed his mind"], ["maybe try tennis after Christmas", "later, not first"]] },
    { clip: "lab-dist-2", stem: "What are the girls going to eat?", lines: [["AMY", "Shall we get pizza?"], ["ZOE", "We had pizza yesterday. What about burgers?"], ["AMY", "The burger place is closed on Mondays. Let's just get noodles from the market."], ["ZOE", "Fine, noodles it is."]], voices: { AMY: T1, ZOE: T2 },
      opts: [{ t: "noodles" }, { t: "pizza", why: "They had pizza yesterday." }, { t: "burgers", why: "The burger place is closed." }, { t: "sandwiches", why: "Sandwiches aren't mentioned." }],
      hint: "Three foods are mentioned. What do they agree on at the end?", key: "Fine, noodles it is", traps: [["Shall we get pizza?", "rejected"], ["What about burgers?", "closed on Mondays"]] },
    { clip: "lab-dist-3", stem: "Which day is Grandma's party?", lines: [["BOY", "Is Grandma's party still on Saturday?"], ["MUM", "It was going to be, but Uncle Tom can't come on Saturday, so we've moved it to Sunday afternoon."], ["BOY", "Not Friday, then?"], ["MUM", "No, Friday's when we're doing the shopping for it."]], voices: { BOY: B1, MUM },
      opts: [{ t: "Sunday" }, { t: "Saturday", why: "It was going to be Saturday. What changed?" }, { t: "Friday", why: "Friday is for something else." }, { t: "Monday", why: "Monday isn't mentioned." }],
      hint: "Listen for \"so we've moved it\".", key: "so we've moved it to Sunday afternoon", traps: [["still on Saturday", "the old plan"], ["Friday's when we're doing the shopping", "a different job"]] },
    { clip: "lab-dist-4", stem: "Where are the friends going to meet?", lines: [["JOE", "Let's meet outside the cinema at three."], ["KATE", "It's always so crowded there. How about the bus station?"], ["JOE", "Hmm, that's too far for me. The library is in the middle. Let's meet there instead."], ["KATE", "Perfect."]], voices: { JOE: B2, KATE: T3 },
      opts: [{ t: "at the library" }, { t: "outside the cinema", why: "Kate says it's too crowded." }, { t: "at the bus station", why: "Joe says it's too far." }, { t: "in the park", why: "The park isn't mentioned." }],
      hint: "Listen for \"instead\".", key: "Let's meet there instead", traps: [["outside the cinema", "too crowded"], ["the bus station", "too far"]] },
    { clip: "lab-dist-5", stem: "What did the man buy?", lines: [["MAN", "I went into town to get a new jacket. I tried on a black one, but it was too small, and the blue one was far too expensive. So I came home with a pair of trainers instead. They were in the sale."]], voices: { MAN },
      opts: [{ t: "some trainers" }, { t: "a black jacket", why: "It was too small." }, { t: "a blue jacket", why: "It was too expensive." }, { t: "a shirt", why: "A shirt isn't mentioned." }],
      hint: "He went for one thing but came home with another. Listen for \"instead\".", key: "a pair of trainers instead", traps: [["a black one", "too small"], ["the blue one", "too expensive"]] },
    { clip: "lab-dist-6", final: true, stem: "Why is Thursday's school trip cancelled?", lines: [["TEACHER", "I'm sorry to say that Thursday's trip to the river is cancelled. It isn't because of the weather. The forecast is actually fine, and we did have enough students. Unfortunately, the coach company has no drivers available that day."]], voices: { TEACHER: WOMAN },
      opts: [{ t: "There is no driver for the coach." }, { t: "The weather will be bad.", why: "She says the forecast is fine." }, { t: "Not enough students signed up.", why: "She says they had enough students." }, { t: "The river is closed.", why: "Nothing says the river is closed." }],
      hint: "She rules out two reasons first. Listen for \"Unfortunately\".", key: "the coach company has no drivers available", traps: [["It isn't because of the weather", "ruled out"], ["we did have enough students", "ruled out"]] }] },

{ id: "lab-herring", n: 4, trap: "herring", title: "Red herrings", blurb: "True facts about the wrong person or the wrong time. Check who and when.",
  teach: [
    { h: "Who? When?", p: "Check who the question is about, and when: the past, now or the future. A true fact about the wrong person, or about the wrong time, is a trap.",
      eg: { said: "When I was younger I played the piano… These days I'm into photography.", note: "What does she do now? Photography, not the piano." } },
    { h: "Plans and what really happened", p: "People often talk about a plan and then what really happened. Signal words: we'd planned to, I was going to, usually, but today.",
      eg: { said: "We'd planned to take the train… but we drove all the way.", note: "How did they travel? By car." } }],
  items: [
    { clip: "lab-herr-1", stem: "What does the boy want to do at the weekend?", lines: [["GIRL", "I really want to go to the beach this weekend."], ["BOY", "Not me. I'd rather stay in town and go to the climbing wall."], ["GIRL", "Well, Mum wants us to visit Grandad anyway."]], voices: { GIRL: T1, BOY: B1 },
      opts: [{ t: "go climbing" }, { t: "go to the beach", why: "That's what the girl wants." }, { t: "visit his grandfather", why: "That's what Mum wants." }, { t: "stay at home", why: "He wants to stay in town, but at home?" }],
      hint: "Three people want three different things. Which one is the boy's?", key: "I'd rather stay in town and go to the climbing wall", traps: [["go to the beach", "the girl's wish"], ["visit Grandad", "Mum's wish"]] },
    { clip: "lab-herr-2", stem: "What does Ana do in her free time now?", lines: [["ANA", "When I was younger, I spent every weekend playing the piano. I gave that up two years ago, and these days I'm really into photography. I take my camera everywhere."]], voices: { ANA: T2 },
      opts: [{ t: "She takes photos." }, { t: "She plays the piano.", why: "That was when she was younger." }, { t: "She plays tennis.", why: "Tennis isn't mentioned." }, { t: "She reads.", why: "Reading isn't mentioned." }],
      hint: "The question says \"now\". Listen for \"these days\".", key: "these days I'm really into photography", traps: [["playing the piano", "the past"]] },
    { clip: "lab-herr-3", stem: "How did the family travel to Scotland?", lines: [["DAD", "We'd planned to take the train, and I'd even looked up the tickets. But then my brother lent us his car, so we drove all the way. It took nine hours!"]], voices: { DAD },
      opts: [{ t: "by car" }, { t: "by train", why: "That was the plan. What really happened?" }, { t: "by plane", why: "Flying isn't mentioned." }, { t: "by coach", why: "A coach isn't mentioned." }],
      hint: "Listen for \"But then\".", key: "so we drove all the way", traps: [["We'd planned to take the train", "the plan"]] },
    { clip: "lab-herr-4", stem: "What job does Mark's sister do?", lines: [["MARK", "My dad's a doctor and my mum teaches maths, so everyone thought my sister would do something similar. But she's a pilot. She flies all over the world."]], voices: { MARK: B2 },
      opts: [{ t: "She's a pilot." }, { t: "She's a doctor.", why: "That's Mark's dad." }, { t: "She's a teacher.", why: "That's Mark's mum." }, { t: "She's a flight attendant.", why: "She works on planes, but what exactly does she do?" }],
      hint: "Three jobs, three people. Which one is the sister's?", key: "But she's a pilot", traps: [["My dad's a doctor", "the dad"], ["my mum teaches maths", "the mum"]] },
    { clip: "lab-herr-5", stem: "Where is the drama club meeting today?", lines: [["ANNOUNCER", "Good morning. The drama club usually meets in Room 12, but today Room 12 is being painted, so we'll be in the hall. Next week we'll be back in Room 12 as normal."]], voices: { ANNOUNCER: WOMAN2 },
      opts: [{ t: "in the hall" }, { t: "in Room 12", why: "That's where they usually meet." }, { t: "in Room 20", why: "Room 20 isn't mentioned." }, { t: "in the library", why: "The library isn't mentioned." }],
      hint: "The question says \"today\". Listen for \"but today\".", key: "so we'll be in the hall", traps: [["usually meets in Room 12", "usually, not today"], ["Next week we'll be back in Room 12", "next week"]] },
    { clip: "lab-herr-6", final: true, stem: "What does Ben's mum think he should study?", lines: [["BEN", "I really want to study art at university."], ["MUM", "Art's lovely, Ben, but you're so good at science. I think medicine would be perfect for you."], ["BEN", "Dad thinks I should do engineering."]], voices: { BEN: B1, MUM },
      opts: [{ t: "medicine" }, { t: "art", why: "That's what Ben wants." }, { t: "engineering", why: "That's Dad's idea." }, { t: "science teaching", why: "She says he's good at science, but what should he study?" }],
      hint: "The question is about Mum. What does she say after \"I think\"?", key: "I think medicine would be perfect for you", traps: [["study art", "Ben's wish"], ["engineering", "Dad's idea"]] }] },

{ id: "lab-numbers", n: 5, trap: "numbers", title: "Numbers, spelling and corrections", blurb: "Fifteen or fifty? Sorry, I mean… Sums, dates and names spelt out.",
  teach: [
    { h: "Numbers that sound alike", p: "Fifteen and fifty, thirteen and thirty sound alike. Listen to the stress: fifTEEN, FIFty. Also listen for corrections: sorry, I mean…, no wait, actually.",
      eg: { said: "We've got thirty students… sorry, forty.", note: "The answer is the correction: forty." } },
    { h: "Do the maths and spell it out", p: "Sometimes you need to add or take away: a price, a total, a new date. Names are often spelt letter by letter, so write each letter as you hear it.",
      eg: { said: "The T-shirt was twelve pounds and the cap was eight, but I had five pounds off.", note: "12 + 8 − 5 = 15" } }],
  items: [
    { clip: "lab-num-1", stem: "How many students are going on the trip?", lines: [["TEACHER", "Good news about the trip. We've got thirty students on the list. Sorry, forty. Ten more signed up this morning."]], voices: { TEACHER: MAN },
      opts: [{ t: "40" }, { t: "30", why: "He corrects himself straight away." }, { t: "10", why: "That's how many more signed up." }, { t: "14", why: "Fourteen isn't said." }],
      hint: "Listen for \"Sorry\".", key: "Sorry, forty", traps: [["thirty students", "corrected"], ["Ten more", "only the new ones"]] },
    { clip: "lab-num-2", stem: "What is the guide's surname?", lines: [["GUIDE", "Hello, everyone. I'm your guide today. My name is Mrs Pearce. That's P, E, A, R, C, E."]], voices: { GUIDE: WOMAN },
      opts: [{ t: "Pearce" }, { t: "Pierce", why: "Listen to the second and third letters again." }, { t: "Pearse", why: "Listen to the fifth letter again." }, { t: "Peirce", why: "Listen to the second and third letters again." }],
      hint: "Write down each letter as she says it.", key: "P, E, A, R, C, E", traps: [] },
    { clip: "lab-num-3", stem: "How long is the route everyone is cycling today?", lines: [["LEADER", "The full route is fifty kilometres, but don't worry. There's a shorter route of fifteen kilometres for younger riders. Today, though, we're all doing the full route."]], voices: { LEADER: MAN },
      opts: [{ t: "50 km" }, { t: "15 km", why: "That's the shorter route. Which one are they doing today?" }, { t: "35 km", why: "That's the difference, but it isn't a route." }, { t: "5 km", why: "Five isn't said." }],
      hint: "Fifteen or fifty? Listen to the stress, and to \"Today, though\".", key: "we're all doing the full route", traps: [["fifteen kilometres", "the shorter route"]] },
    { clip: "lab-num-4", stem: "What date is the exam now?", lines: [["TEACHER", "The exam was going to be on the twelfth of May, but it's been moved back a week, to the nineteenth."]], voices: { TEACHER: WOMAN2 },
      opts: [{ t: "19 May" }, { t: "12 May", why: "That was the old date." }, { t: "5 May", why: "Moved back means later, not earlier." }, { t: "9 May", why: "Nine isn't said." }],
      hint: "Listen for the new date after \"moved back a week\".", key: "to the nineteenth", traps: [["the twelfth of May", "the old date"]] },
    { clip: "lab-num-5", stem: "How much did the girl pay in total?", lines: [["GIRL", "The T-shirt was twelve pounds and the cap was eight. But I had a voucher for five pounds off, so it wasn't too bad."]], voices: { GIRL: T1 },
      opts: [{ t: "£15" }, { t: "£20", why: "You forgot the voucher." }, { t: "£12", why: "That's only the T-shirt." }, { t: "£25", why: "Add the two prices, then take away the voucher." }],
      hint: "Add the two prices, then take away the voucher.", key: "a voucher for five pounds off", traps: [["twelve pounds", "one price only"]] },
    { clip: "lab-num-6", final: true, stem: "What is the phone number for the youth club?", lines: [["WOMAN", "If you'd like to join the youth club, give us a call on oh seven seven, double four, five eight nine. That's oh seven seven, double four, five eight nine."]], voices: { WOMAN },
      opts: [{ t: "077 44 589" }, { t: "077 45 589", why: "Double four means two fours." }, { t: "077 44 598", why: "Listen to the last three numbers again." }, { t: "070 44 589", why: "Listen to the first three numbers again." }],
      hint: "\"Oh\" means zero and \"double four\" means 44.", key: "oh seven seven, double four, five eight nine", traps: [] }] },

{ id: "lab-opinion", n: 6, trap: "opinion", title: "Opinions and attitude", blurb: "What do they really think? Listen to the words after but, and to how they say it.",
  teach: [
    { h: "What do they really think?", p: "Speakers rarely say \"I think it's bad\". Listen for softer words: I suppose, it's OK, but…, not really worth it, the only thing is. They show what the speaker really feels.",
      eg: { said: "The cakes are nice, but I'm not sure it's worth the prices.", note: "She thinks it's too expensive." } },
    { h: "The words after but matter most", p: "The good thing often comes first, and the real opinion comes after but, however or the only thing is.",
      eg: { said: "The special effects were impressive, I suppose. But two and a half hours? I nearly fell asleep.", note: "Her opinion: it was too long." } }],
  items: [
    { clip: "lab-op-1", stem: "What does Lucy think of the film?", lines: [["LUCY", "Well, the special effects were impressive, I suppose. But two and a half hours? I nearly fell asleep."]], voices: { LUCY: T3 },
      opts: [{ t: "It was too long." }, { t: "It was exciting all the way through.", why: "Did she stay awake?" }, { t: "The special effects were poor.", why: "She says they were impressive." }, { t: "It was too short.", why: "Two and a half hours: short or long?" }],
      hint: "Listen to what comes after \"But\".", key: "But two and a half hours? I nearly fell asleep", traps: [["the special effects were impressive", "true, but not her main point"]] },
    { clip: "lab-op-2", stem: "Do the two friends agree about the new café?", lines: [["EVA", "The new café is brilliant, isn't it?"], ["NINA", "Hmm. The cakes are nice, but I'm not sure it's worth the prices."]], voices: { EVA: T1, NINA: T2 },
      opts: [{ t: "No. Nina thinks it's too expensive." }, { t: "Yes, they both love it.", why: "Listen to how Nina answers: \"Hmm…\"." }, { t: "Yes, they both think it's too expensive.", why: "Eva says it's brilliant." }, { t: "No. Nina doesn't like the cakes.", why: "She says the cakes are nice." }],
      hint: "Nina says something good, then \"but…\".", key: "I'm not sure it's worth the prices", traps: [["The cakes are nice", "true, but not her main point"]] },
    { clip: "lab-op-3", stem: "How does the man feel about moving to the city?", lines: [["MAN", "Everyone keeps telling me I'll love it. Maybe they're right, but I'll really miss the peace and quiet, and my garden."]], voices: { MAN: DAD },
      opts: [{ t: "He isn't sure it's a good idea." }, { t: "He's really excited about it.", why: "\"I'll love it\" is what everyone else says." }, { t: "He's angry about it.", why: "He doesn't sound angry." }, { t: "He can't wait to go.", why: "What will he miss?" }],
      hint: "\"Maybe they're right, but…\" Is he sure?", key: "Maybe they're right, but I'll really miss the peace and quiet", traps: [["I'll love it", "other people's opinion"]] },
    { clip: "lab-op-4", stem: "What is Tom's opinion of homework?", lines: [["TOM", "I know homework helps us practise, and I don't mind doing some. I just think one hour a night would be enough, instead of three."]], voices: { TOM: B2 },
      opts: [{ t: "There is too much of it." }, { t: "It is useless.", why: "He says it helps them practise." }, { t: "Students should get more.", why: "One hour instead of three: more or less?" }, { t: "He never does it.", why: "He doesn't mind doing some." }],
      hint: "Listen to \"I just think…\".", key: "one hour a night would be enough, instead of three", traps: [["homework helps us practise", "he agrees with this part"]] },
    { clip: "lab-op-5", stem: "Why does the coach talk about last season?", lines: [["COACH", "Last season we lost almost every match. This year we've won six out of eight. That shows what hard work can do."]], voices: { COACH: MAN },
      opts: [{ t: "to show how much the team has improved" }, { t: "to complain about the team", why: "Is he unhappy with them now?" }, { t: "to explain why they lost", why: "He doesn't give a reason for losing." }, { t: "to remember a favourite match", why: "No single match is described." }],
      hint: "Compare last season and this year. What does it show?", key: "That shows what hard work can do", traps: [["we lost almost every match", "the past, used for contrast"]] },
    { clip: "lab-op-6", final: true, stem: "What is the woman's opinion of online shopping?", lines: [["WOMAN", "It's convenient, of course. You can buy anything at midnight. But I like to touch things before I buy them, so for clothes I'd still rather go to a real shop."]], voices: { WOMAN: WOMAN2 },
      opts: [{ t: "It's good for some things, but not for clothes." }, { t: "It's always better than real shops.", why: "Is that true for clothes?" }, { t: "It's never useful.", why: "She says it's convenient." }, { t: "It's too expensive.", why: "Price isn't mentioned." }],
      hint: "She gives one good point, then \"But…\". What about clothes?", key: "for clothes I'd still rather go to a real shop", traps: [["It's convenient, of course", "true, but not the whole opinion"]] }] }
];

export const LAB_CLIPS = LAB.flatMap(m => m.items.map(it => ({ id: it.clip, lines: it.lines, voices: it.voices })));
export const labMission = id => LAB.find(m => m.id === id);
export const isLab = id => /^lab-/.test(id || "") && !!labMission(id);

// Trap tags for the unit listening questions, by task id and question number (null: no particular trap).
export const UNIT_TRAPS = {
  "l3-short": ["distractor", "distractor", "distractor", "distractor", "opinion"],
  "l3-ranger": ["numbers", null, null, "herring", "numbers", null, "synonym"],
  "l3-guide": ["synonym", "herring", "opinion", "distractor", "opinion", "synonym"],
  "l3-match": ["synonym", "synonym", "synonym", "synonym", "synonym"],
  "l2-short": ["distractor", "distractor", "numbers", "numbers", "opinion"],
  "l2-nurse": ["herring", "numbers", "numbers", "numbers", null, "numbers", null],
  "l2-food": ["synonym", "synonym", "distractor", "synonym", "opinion", "opinion"],
  "l2-match": ["synonym", "synonym", "synonym", "synonym", "synonym"]
};
export const unitTrap = (taskId, k) => (UNIT_TRAPS[taskId] || [])[k] || null;

// The trap tracker: listening answers with a trap tag, counted per trap. caught = not right first time.
export function trapStats(history) {
  const out = Object.fromEntries(Object.keys(TRAPS).filter(k => k !== "prime").map(k => [k, { trap: k, total: 0, caught: 0 }]));
  history.forEach(h => (h.answers || []).forEach(a => { if (a.skill === "Listening" && a.trap && out[a.trap]) { out[a.trap].total++; if (!a.first_try) out[a.trap].caught++; } }));
  return Object.values(out);
}
// The trap that catches this student most (at least 2 times caught and a third of answers), or null.
export function weakestTrap(history) {
  const s = trapStats(history).filter(t => t.caught >= 2 && t.caught / t.total >= 1 / 3).sort((a, b) => b.caught / b.total - a.caught / a.total || b.caught - a.caught);
  return s.length ? s[0].trap : null;
}
export const missionForTrap = trap => LAB.find(m => m.trap === trap);
export const XP_LAB = { first: 10, hint: 4, step: 2, finish: 10 };
export function labXP(results) {
  return results.reduce((t, r) => t + (r.skill === "Listening strategy" ? (r.first_try ? XP_LAB.step : 0) : r.support === "none" ? XP_LAB.first : r.support === "hint" ? XP_LAB.hint : 0), 0) + XP_LAB.finish;
}
// Splits a line of the transcript into plain, key and trap parts for highlighting.
export function markLine(text, key, traps = []) {
  const marks = [];
  const add = (s, kind, label) => { if (!s) return; const i = text.indexOf(s); if (i >= 0 && !marks.some(m => i < m.end && i + s.length > m.start)) marks.push({ start: i, end: i + s.length, kind, label }); };
  add(key, "key"); traps.forEach(([s, label]) => add(s, "trap", label));
  marks.sort((a, b) => a.start - b.start);
  const parts = []; let at = 0;
  marks.forEach(m => { if (m.start > at) parts.push({ t: text.slice(at, m.start) }); parts.push({ t: text.slice(m.start, m.end), kind: m.kind, label: m.label }); at = m.end; });
  if (at < text.length) parts.push({ t: text.slice(at) });
  return parts;
}
