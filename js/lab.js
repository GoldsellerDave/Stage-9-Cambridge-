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

/* ---------------- Stretch (level 1) and Challenge (level 2) clips ----------------
   Stretch: longer clips, two or more traps, closer options. Challenge: Checkpoint level or above, answers implied,
   three speakers, subtle paraphrase, heard once (once more after a wrong answer). */
const HEAD = "bm_george";
const EXTRA = {
"lab-prime": [
  { level: 1, clip: "lab-prime-s1", stem: "What does Carlos need to bring on the first day of the course?", keys: ["What", "Carlos", "bring", "first day"], type: "a thing or activity",
    predict: [["a notebook", true], ["at nine", false], ["his passport", true], ["Room 4", false]],
    lines: [["TEACHER", "Welcome to the summer photography course, Carlos. You don't need a camera on the first day. We'll lend you one."], ["CARLOS", "Great. Should I bring my laptop?"],
            ["TEACHER", "Not until week two. On Monday just bring a notebook, because we'll be planning your first project."]],
    voices: { TEACHER: WOMAN, CARLOS: B2 },
    opts: [{ t: "a notebook" }, { t: "a camera", why: "They will lend him one." }, { t: "his laptop", why: "Not until week two." }, { t: "a packed lunch", why: "Lunch isn't mentioned." }],
    hint: "Three things are mentioned. Which one is for Monday, the first day?", key: "On Monday just bring a notebook", traps: [["You don't need a camera", "they lend him one"], ["Not until week two", "the laptop comes later"]] },
  { level: 1, clip: "lab-prime-s2", stem: "How long will the train journey take on Saturday?", keys: ["How long", "train", "journey", "Saturday"], type: "a time",
    predict: [["three hours", true], ["the station", false], ["ninety minutes", true], ["£12", false]],
    lines: [["GIRL", "How long does the train to the coast take? Two hours?"], ["MUM", "Usually it's about an hour and a half. But on Saturday there are engineering works, so we have to change at Bristol. The website says it'll take three hours in total."],
            ["GIRL", "Three hours? I'll download a film, then."]],
    voices: { GIRL: T1, MUM },
    opts: [{ t: "three hours" }, { t: "two hours", why: "That was the girl's guess." }, { t: "an hour and a half", why: "That's the usual time. Is Saturday usual?" }, { t: "four hours", why: "Four isn't said." }],
    hint: "The question says Saturday. What's different about Saturday?", key: "it'll take three hours in total", traps: [["Two hours?", "her guess"], ["about an hour and a half", "the usual time"]] },
  { level: 1, clip: "lab-prime-s3", stem: "Why has Ella stopped going to the gym?", keys: ["Why", "Ella", "stopped", "gym"], type: "a reason",
    predict: [["it's too expensive", true], ["on Mondays", false], ["she was injured", true], ["with her sister", false]],
    lines: [["ELLA", "People think I gave up the gym because of the price, but actually my membership was a birthday present, so it was free. The truth is, I hurt my knee playing basketball, and the doctor told me to rest it for a couple of months."]],
    voices: { ELLA: T3 },
    opts: [{ t: "She hurt her knee." }, { t: "It was too expensive.", why: "That's what people think, but it was free." }, { t: "She got bored.", why: "She doesn't say she was bored." }, { t: "She plays basketball instead.", why: "Basketball is how it happened, not why she stopped." }],
    hint: "Listen for \"The truth is\".", key: "I hurt my knee", traps: [["because of the price", "what people think"]] },
  { level: 1, clip: "lab-prime-s4", stem: "Who is going to cook dinner tonight?", keys: ["Who", "cook", "dinner", "tonight"], type: "a person",
    predict: [["Dad", true], ["pasta", false], ["the boy", true], ["at seven", false]],
    lines: [["SON", "Is Mum cooking tonight?"], ["DAD", "She was going to, but she's working late. I'd cook, but I've got a meeting at seven."], ["SON", "So who's making dinner?"],
            ["DAD", "You are! Grandma's recipe is on the fridge."]],
    voices: { SON: B1, DAD },
    opts: [{ t: "the boy" }, { t: "his mum", why: "She's working late." }, { t: "his dad", why: "He has a meeting." }, { t: "his grandma", why: "Only her recipe is there." }],
    hint: "Each person is ruled out. Who is left?", key: "You are!", traps: [["She was going to", "Mum is working late"], ["I'd cook", "Dad has a meeting"], ["Grandma's recipe", "only her recipe"]] },
  { level: 2, clip: "lab-prime-c1", stem: "What is the main reason Zara recommends the hostel?", keys: ["main reason", "Zara", "recommends", "hostel"], type: "a reason",
    predict: [["it's cheap", true], ["it's near the station", true], ["last summer", false], ["the manager", false]],
    lines: [["ZARA", "Look, the hostel isn't the cheapest in town, and it's a twenty-minute walk from the station, which is a pain with a suitcase. But the staff organise free walking tours every morning, and that's how I met most of the friends I travelled with afterwards. For me, that made it worth every penny."]],
    voices: { ZARA: T2 },
    opts: [{ t: "You can meet other travellers there." }, { t: "It is very cheap.", why: "She says it isn't the cheapest." }, { t: "It is close to the station.", why: "It's a twenty-minute walk: is that close?" }, { t: "The rooms are comfortable.", why: "The rooms aren't mentioned." }],
    hint: "She gives two bad points first. What made it \"worth every penny\"?", key: "that's how I met most of the friends I travelled with", traps: [["isn't the cheapest in town", "a bad point"], ["a twenty-minute walk from the station", "a bad point"]] },
  { level: 2, clip: "lab-prime-c2", stem: "What has the band decided to change for the next concert?", keys: ["band", "decided", "change", "next concert"], type: "a thing or activity",
    predict: [["the place", true], ["the start time", true], ["very angry", false], ["Mr Lee", false]],
    lines: [["DRUMMER", "Everyone complained the hall was too hot last time. Should we move to the sports centre?"], ["SINGER", "The sound in the sports centre is awful. I'd rather keep the hall and just start later, when it's cooler."],
            ["MANAGER", "Starting later won't work. The caretaker locks up at ten. Let's keep the hall and the time, but hire some big fans."], ["SINGER", "Fine. Fans it is."]],
    voices: { DRUMMER: T1, SINGER: B2, MANAGER: MAN },
    opts: [{ t: "They will bring fans to cool the hall." }, { t: "They will move to the sports centre.", why: "The sound there is awful." }, { t: "They will start later.", why: "The caretaker locks up at ten." }, { t: "They will play in a smaller hall.", why: "They keep the same hall." }],
    hint: "Two ideas are rejected. What does the manager suggest?", key: "hire some big fans", traps: [["move to the sports centre", "the sound is awful"], ["just start later", "the caretaker locks up"]] },
  { level: 2, clip: "lab-prime-c3", stem: "How does Jack feel about his exam results?", keys: ["How", "Jack", "feel", "exam results"], type: "a feeling",
    predict: [["relieved", true], ["proud", true], ["in July", false], ["maths", false]],
    lines: [["FRIEND", "So? Did you get the grades you needed?"], ["JACK", "Well, maths was lower than I wanted, to be honest. But I got exactly what I needed for the science course, so I can stop worrying now. I didn't sleep at all last night!"]],
    voices: { FRIEND: T2, JACK: B1 },
    opts: [{ t: "relieved" }, { t: "disappointed", why: "Only maths was lower. Did he get what he needed?" }, { t: "nervous", why: "He was nervous last night. And now?" }, { t: "surprised", why: "He doesn't sound surprised." }],
    hint: "\"I can stop worrying now.\" Which feeling is that?", key: "so I can stop worrying now", traps: [["maths was lower than I wanted", "one subject only"], ["I didn't sleep at all last night", "how he felt before"]] },
  { level: 2, clip: "lab-prime-c4", stem: "How much does the family spend at the boat trip ticket office altogether?", keys: ["How much", "family", "spend", "altogether"], type: "a number or price",
    predict: [["£48", true], ["£60", true], ["two hours", false], ["the harbour", false]],
    lines: [["DAD", "Two adults and two children for the boat trip, please."], ["WOMAN", "Adults are twenty pounds and children are ten. Oh, but there's a family ticket for fifty pounds that covers all four of you."],
            ["DAD", "Perfect, we'll take that. And two bottles of water, please."], ["WOMAN", "That's another two pounds for both. So fifty-two pounds altogether."]],
    voices: { DAD, WOMAN },
    opts: [{ t: "£52" }, { t: "£60", why: "That's four separate tickets. Did they buy those?" }, { t: "£50", why: "That's the ticket only. What else did he buy?" }, { t: "£54", why: "How much were both bottles of water?" }],
    hint: "Listen for the family ticket, then add the water.", key: "So fifty-two pounds altogether", traps: [["Adults are twenty pounds and children are ten", "separate tickets"], ["a family ticket for fifty pounds", "the ticket only"]] }],
"lab-synonym": [
  { level: 1, clip: "lab-syn-s1", stem: "Why does Omar prefer the new library?", lines: [["OMAR", "The old library had more books, I'll admit. But the new one stays open until nine, so I can study there after football practice."]], voices: { OMAR: B2 },
    opts: [{ t: "He can use it later in the evening." }, { t: "It has more books.", why: "The old library had more books." }, { t: "It's closer to the football pitch.", why: "Distance isn't mentioned." }, { t: "It's quieter.", why: "Noise isn't mentioned." }],
    hint: "\"Open until nine\": which option says that in other words?", key: "stays open until nine", traps: [["The old library had more books", "about the old library"]] },
  { level: 1, clip: "lab-syn-s2", stem: "What did Hana find difficult on the school exchange?", lines: [["HANA", "The family were lovely, and I got used to the food in a couple of days. What I struggled with was how quickly everyone spoke. I could read the signs, but I missed half of what people said to me."]], voices: { HANA: T1 },
    opts: [{ t: "understanding what people said" }, { t: "getting used to the food", why: "That only took a couple of days." }, { t: "living with the host family", why: "She says they were lovely." }, { t: "reading signs", why: "She could read the signs." }],
    hint: "\"Struggled with\" means found difficult. What comes after it?", key: "how quickly everyone spoke", traps: [["got used to the food", "not a problem"], ["I could read the signs", "not a problem"]] },
  { level: 1, clip: "lab-syn-s3", stem: "What does the radio presenter say about this year's festival?", lines: [["PRESENTER", "If you went to the festival last year, you'll remember the long queues for food. This year the organisers have doubled the number of stalls, so you shouldn't have to wait nearly as long. Tickets, however, cost the same as before."]], voices: { PRESENTER: MAN },
    opts: [{ t: "People won't wait as long for food." }, { t: "Tickets are more expensive.", why: "They cost the same as before." }, { t: "There are fewer food stalls.", why: "The number has doubled." }, { t: "The queues will be longer.", why: "Long queues were last year." }],
    hint: "Last year or this year? Listen for \"This year\".", key: "you shouldn't have to wait nearly as long", traps: [["the long queues for food", "last year"], ["cost the same as before", "the price hasn't changed"]] },
  { level: 1, clip: "lab-syn-s4", stem: "Why was the football match stopped?", lines: [["REPORTER", "The match was stopped in the second half. Despite reports on social media, nobody was hurt, and the heavy rain had finished by then. The referee simply couldn't see the far end of the pitch because of thick fog coming in from the river."]], voices: { REPORTER: WOMAN },
    opts: [{ t: "It was hard to see." }, { t: "A player was injured.", why: "Nobody was hurt." }, { t: "It was raining heavily.", why: "The rain had finished." }, { t: "The river flooded the pitch.", why: "Something came from the river, but was it water?" }],
    hint: "Two reasons are ruled out. What couldn't the referee do?", key: "couldn't see the far end of the pitch", traps: [["nobody was hurt", "ruled out"], ["the heavy rain had finished", "ruled out"]] },
  { level: 2, clip: "lab-syn-c1", stem: "What is Mr Patel's view of the new timetable?", lines: [["MR PATEL", "I wouldn't say the new timetable is perfect. Some lessons are now straight after lunch, when students are half asleep. But on balance, having longer lessons means we can finish experiments properly, which we could never do before."]], voices: { "MR PATEL": MAN },
    opts: [{ t: "Generally positive, despite some problems" }, { t: "Completely negative", why: "Listen to \"on balance\"." }, { t: "He has no opinion either way.", why: "He clearly has an opinion." }, { t: "Lessons should be shorter.", why: "He likes the longer lessons." }],
    hint: "\"On balance\" introduces his overall view.", key: "on balance, having longer lessons means we can finish experiments properly", traps: [["I wouldn't say the new timetable is perfect", "a small problem, not his overall view"]] },
  { level: 2, clip: "lab-syn-c2", stem: "What surprised Leila about the mountain village?", lines: [["LEILA", "Everyone said it would be freezing up there, and they were right. I needed three jumpers!"], ["GUIDE", "And what did you think of the people?"],
      ["LEILA", "Everyone was friendly, as I'd heard. The thing I really didn't see coming was that hardly anyone had a car. People walked everywhere, or rode horses."]], voices: { LEILA: T3, GUIDE: WOMAN2 },
    opts: [{ t: "how few people drove" }, { t: "how cold it was", why: "Everyone said it would be freezing, so she expected it." }, { t: "how friendly people were", why: "She'd heard that before, so she expected it." }, { t: "how many horses were for sale", why: "Nothing is for sale." }],
    hint: "\"Didn't see coming\" means surprised. What comes after it?", key: "hardly anyone had a car", traps: [["they were right", "expected, not a surprise"], ["as I'd heard", "expected, not a surprise"]] },
  { level: 2, clip: "lab-syn-c3", stem: "What does the scientist say about the new bridge?", lines: [["SCIENTIST", "Many people assume the bridge will damage the river, and frankly, that was my worry too at first. Having studied it for two years, though, I can tell you the fish population has, if anything, grown since it was built."]], voices: { SCIENTIST: WOMAN2 },
    opts: [{ t: "It hasn't harmed the wildlife in the river." }, { t: "It has damaged the river.", why: "That was the worry. What did she find?" }, { t: "There are fewer fish now.", why: "The fish population has grown." }, { t: "It took two years to build.", why: "Two years is how long she studied it." }],
    hint: "Listen for \"though\": what did her study show?", key: "the fish population has, if anything, grown", traps: [["will damage the river", "what people assume"], ["for two years", "how long she studied"]] },
  { level: 2, clip: "lab-syn-c4", stem: "Why is Sofia giving up her part-time job?", lines: [["SOFIA", "It's not that I don't like the café. The money's fine, and my boss is really flexible. It's just that with exams starting in May, I can't afford to lose three evenings a week."]], voices: { SOFIA: T2 },
    opts: [{ t: "She needs more time to study." }, { t: "She doesn't like the café.", why: "She says it's not that." }, { t: "She isn't paid enough.", why: "\"Can't afford\" here is about time, not money. The money's fine." }, { t: "Her boss isn't flexible.", why: "She says her boss is really flexible." }],
    hint: "\"It's just that…\" gives the real reason. What is starting in May?", key: "with exams starting in May", traps: [["The money's fine", "ruled out"], ["my boss is really flexible", "ruled out"]] }],
"lab-distractor": [
  { level: 1, clip: "lab-dist-s1", stem: "What will Tom buy for his sister's birthday?", lines: [["TOM", "It's my sister's birthday on Friday. I thought about a book, but she reads everything on her phone."], ["FRIEND", "What about concert tickets?"],
      ["TOM", "Too expensive. I was thinking of a scarf, but she's got loads."], ["FRIEND", "She loves cooking, doesn't she? A recipe book?"], ["TOM", "That's still a book! No, I'll get her a cooking class. She'll love it."]], voices: { TOM: B1, FRIEND: T1 },
    opts: [{ t: "a cooking class" }, { t: "a book", why: "She reads on her phone." }, { t: "concert tickets", why: "They're too expensive." }, { t: "a scarf", why: "She has loads." }],
    hint: "Four presents are mentioned. Which one does he decide on at the end?", key: "I'll get her a cooking class", traps: [["I thought about a book", "she reads on her phone"], ["concert tickets", "too expensive"], ["a scarf", "she has loads"]] },
  { level: 1, clip: "lab-dist-s2", stem: "What time will the friends see the film?", lines: [["MIA", "The film's at six, right?"], ["SAM", "It was, but they've added an earlier showing at half past four."], ["MIA", "I've got piano until five."],
      ["SAM", "OK, then let's stick with the original time. I'll book seats for six."]], voices: { MIA: T2, SAM: B2 },
    opts: [{ t: "6.00" }, { t: "4.30", why: "Mia has piano then." }, { t: "5.00", why: "That's when piano finishes." }, { t: "5.30", why: "Half past five isn't said." }],
    hint: "Listen for \"stick with the original time\". What was the original time?", key: "I'll book seats for six", traps: [["half past four", "the earlier showing"], ["piano until five", "her lesson"]] },
  { level: 1, clip: "lab-dist-s3", stem: "Where will the class go on their end-of-year trip?", lines: [["TEACHER", "Right, the results of the vote are in. The theme park got the most votes, but it's closed for repairs in June. The zoo came second, but we went there last year. So we'll go with the third choice, the beach, as long as the weather's good."]], voices: { TEACHER: MAN },
    opts: [{ t: "the beach" }, { t: "the theme park", why: "It's closed in June." }, { t: "the zoo", why: "They went there last year." }, { t: "the museum", why: "The museum isn't mentioned." }],
    hint: "The first two choices are ruled out. Listen for \"So\".", key: "the third choice, the beach", traps: [["The theme park got the most votes", "closed in June"], ["The zoo came second", "went last year"]] },
  { level: 1, clip: "lab-dist-s4", stem: "What will Anna do first after school?", lines: [["MUM", "Anna, homework first, then you can see your friends."], ["ANNA", "But they're only at the park until five! Can't I go now and do my homework later?"],
      ["MUM", "Hmm. Take the dog for a walk on the way, then, and you can go to the park. Homework at six."], ["ANNA", "Deal!"]], voices: { MUM, ANNA: T3 },
    opts: [{ t: "walk the dog" }, { t: "do her homework", why: "That was Mum's first plan. What did they agree?" }, { t: "go straight to the park", why: "What does she do on the way?" }, { t: "tidy her room", why: "Her room isn't mentioned." }],
    hint: "The plan changes. What does Anna do on the way to the park?", key: "Take the dog for a walk on the way", traps: [["homework first", "Mum's first plan"], ["Homework at six", "later"]] },
  { level: 2, clip: "lab-dist-c1", stem: "Which club does Max finally join?", lines: [["TEACHER", "Max, you've signed up for chess, drama and robotics. You can only choose one."], ["MAX", "Chess, then. I've played since I was six."],
      ["FRIEND", "But chess is on Thursdays, when we've got football training."], ["MAX", "Oh, right. Drama's on Thursdays too. I suppose that leaves robotics."], ["TEACHER", "Good choice. That's on Tuesdays."]], voices: { TEACHER: WOMAN, MAX: B2, FRIEND: B1 },
    opts: [{ t: "robotics" }, { t: "chess", why: "It clashes with football training." }, { t: "drama", why: "It's on Thursdays too." }, { t: "football", why: "Football isn't one of the clubs he signed up for." }],
    hint: "Two clubs clash with something. Which one is left?", key: "I suppose that leaves robotics", traps: [["Chess, then", "clashes with football"], ["Drama's on Thursdays too", "clashes too"]] },
  { level: 2, clip: "lab-dist-c2", stem: "What will the weather be like on Sunday afternoon?", lines: [["PRESENTER", "It'll be a wet start to the weekend, with heavy rain on Saturday. Sunday morning will be cloudy, and although some forecasts are showing showers, we think they'll stay out at sea. By the afternoon the cloud should clear, giving long sunny spells."]], voices: { PRESENTER: WOMAN2 },
    opts: [{ t: "mostly sunny" }, { t: "rainy", why: "Heavy rain is on Saturday." }, { t: "cloudy", why: "That's Sunday morning." }, { t: "showery", why: "The showers should stay out at sea." }],
    hint: "Listen for the day and the time of day together.", key: "giving long sunny spells", traps: [["heavy rain on Saturday", "Saturday"], ["Sunday morning will be cloudy", "the morning"], ["some forecasts are showing showers", "they'll stay at sea"]] },
  { level: 2, clip: "lab-dist-c3", stem: "What does Nina spend most of her time doing at the animal shelter now?", lines: [["NINA", "When I started at the shelter, I mostly cleaned the cages, which wasn't much fun. These days the younger volunteers do that. I sometimes help at the front desk when it's busy, but what I spend most of my time on now is training the dogs, so they're easier to rehome."]], voices: { NINA: T1 },
    opts: [{ t: "training dogs" }, { t: "cleaning cages", why: "That was when she started." }, { t: "working at the front desk", why: "Only sometimes, when it's busy." }, { t: "finding homes for the animals", why: "That's the reason for her work, not what she does." }],
    hint: "\"Most of my time\" and \"now\" are the key words.", key: "training the dogs", traps: [["cleaned the cages", "when she started"], ["help at the front desk", "only sometimes"], ["easier to rehome", "the reason"]] },
  { level: 2, clip: "lab-dist-c4", stem: "How will the boys get home after the match?", lines: [["LUKE", "Dad, can you pick us up after the match?"], ["DAD", "I'll be at work. Just get the bus."], ["JOE", "The last bus goes at half past nine, and the match finishes at ten."],
      ["DAD", "Ah. Then wait in the stadium café and I'll come for you after work. It's on my way."], ["LUKE", "Thanks, Dad!"]], voices: { LUKE: B1, JOE: B2, DAD },
    opts: [{ t: "Dad will collect them." }, { t: "by bus", why: "The last bus leaves before the match ends." }, { t: "They will walk.", why: "Walking isn't mentioned." }, { t: "by taxi", why: "A taxi isn't mentioned." }],
    hint: "Dad changes his answer. Why can't they get the bus?", key: "I'll come for you after work", traps: [["Just get the bus", "the last bus is too early"]] }],
"lab-herring": [
  { level: 1, clip: "lab-herr-s1", stem: "What did Jamal do last weekend?", lines: [["FRIEND", "Did you go to the climbing centre at the weekend?"], ["JAMAL", "That's next weekend. I was supposed to go to my cousin's wedding, but it was moved, so I ended up helping my dad paint the kitchen."], ["FRIEND", "Fun!"]], voices: { FRIEND: T2, JAMAL: B2 },
    opts: [{ t: "He painted a room." }, { t: "He went climbing.", why: "That's next weekend." }, { t: "He went to a wedding.", why: "The wedding was moved." }, { t: "He visited his cousin.", why: "Did the wedding happen?" }],
    hint: "Check when each thing happens. Listen for \"I ended up\".", key: "helping my dad paint the kitchen", traps: [["That's next weekend", "the future"], ["my cousin's wedding", "it was moved"]] },
  { level: 1, clip: "lab-herr-s2", stem: "What does Rosa's brother study at university?", lines: [["ROSA", "I'm hoping to study law, like my mum did. My brother was always told he should do medicine, but he chose history in the end, and now he wants to be a museum guide."]], voices: { ROSA: T1 },
    opts: [{ t: "history" }, { t: "law", why: "That's Rosa's plan, and her mum's subject." }, { t: "medicine", why: "That's what he was told to do." }, { t: "tourism", why: "He wants to be a guide, but what does he study?" }],
    hint: "The question is about the brother. Listen for \"in the end\".", key: "he chose history in the end", traps: [["study law", "Rosa's plan"], ["medicine", "what he was told"]] },
  { level: 1, clip: "lab-herr-s3", stem: "Where does the airport coach usually leave from?", lines: [["ANNOUNCER", "Please note that because of building work, tomorrow's coach to the airport will leave from the bus station on King Street. Normally, of course, it leaves from outside the town hall, and it will be back there from Monday."]], voices: { ANNOUNCER: WOMAN2 },
    opts: [{ t: "outside the town hall" }, { t: "the bus station", why: "That's only tomorrow." }, { t: "King Street", why: "That's where the bus station is, for tomorrow." }, { t: "the airport", why: "That's where the coach goes." }],
    hint: "The question says \"usually\". Listen for \"Normally\".", key: "it leaves from outside the town hall", traps: [["the bus station on King Street", "tomorrow only"]] },
  { level: 1, clip: "lab-herr-s4", stem: "Who taught Lily to swim?", lines: [["LILY", "My mum's a swimming teacher, so everyone assumes she taught me. Actually, she was too busy teaching other people's children! It was my grandad who took me to the pool every Sunday until I could swim."]], voices: { LILY: T3 },
    opts: [{ t: "her grandfather" }, { t: "her mum", why: "That's what everyone assumes." }, { t: "a teacher at school", why: "School isn't mentioned." }, { t: "her dad", why: "Her dad isn't mentioned." }],
    hint: "Listen for \"Actually\" and \"It was…\".", key: "It was my grandad", traps: [["My mum's a swimming teacher", "what everyone assumes"]] },
  { level: 2, clip: "lab-herr-c1", stem: "What will the woman do differently in her garden next year?", lines: [["GARDENER", "This year I grew tomatoes, beans and potatoes. The tomatoes were a disaster because of the cold spring, but I'll still plant them again. Next year, though, I won't bother with potatoes. They take up so much space, and they're cheap in the shops. I'll use that space for strawberries."]], voices: { GARDENER: WOMAN2 },
    opts: [{ t: "grow strawberries instead of potatoes" }, { t: "stop growing tomatoes", why: "She'll still plant them again." }, { t: "grow more beans", why: "Nothing changes for the beans." }, { t: "plant potatoes earlier", why: "Will she plant potatoes at all?" }],
    hint: "This year or next year? What does she stop, and what replaces it?", key: "I'll use that space for strawberries", traps: [["The tomatoes were a disaster", "she'll still plant them"]] },
  { level: 2, clip: "lab-herr-c2", stem: "Which part of the school trip did Ali enjoy most?", lines: [["TEACHER", "Ali, everyone's saying the castle was the best part."], ["ALI", "It was great, but the guide talked for ages. For me, it was the boat trip back. We saw seals!"],
      ["TEACHER", "I thought you'd say the picnic."], ["ALI", "That was good too, but nothing beats seals."]], voices: { TEACHER: MAN, ALI: B1 },
    opts: [{ t: "the boat trip" }, { t: "the castle", why: "That's everyone else's opinion." }, { t: "the picnic", why: "That's the teacher's guess." }, { t: "the guide's talk", why: "The guide talked for ages." }],
    hint: "Three people's views. Which one is Ali's?", key: "it was the boat trip back", traps: [["the castle was the best part", "everyone else"], ["the picnic", "the teacher's guess"]] },
  { level: 2, clip: "lab-herr-c3", stem: "Why did the restaurant close, according to the owner?", lines: [["OWNER", "The newspaper said we closed because we'd lost customers, and it's true that last winter was quiet. But by the summer we were full every night. No, the real reason is that the landlord wanted to double the rent, and no restaurant can survive that."]], voices: { OWNER: MAN },
    opts: [{ t: "The rent became too high." }, { t: "It lost its customers.", why: "That's the newspaper's reason. Is the owner's the same?" }, { t: "It was always quiet.", why: "Only last winter. In summer it was full." }, { t: "The owner wanted to retire.", why: "Retiring isn't mentioned." }],
    hint: "\"According to the owner\": listen for \"the real reason\".", key: "the landlord wanted to double the rent", traps: [["we'd lost customers", "the newspaper's claim"], ["last winter was quiet", "only last winter"]] },
  { level: 2, clip: "lab-herr-c4", stem: "What will Maria do when she leaves school?", lines: [["DAD", "Have you decided about university?"], ["MARIA", "I'm still going, but not straight away. Most of my friends are going travelling for a year, but I'd rather earn some money first, so I'm going to work at Aunt Sofia's hotel for a year."], ["DAD", "Sensible."]], voices: { DAD, MARIA: T2 },
    opts: [{ t: "work for a year" }, { t: "go straight to university", why: "She's going, but not straight away." }, { t: "go travelling", why: "That's her friends' plan." }, { t: "open a hotel", why: "She'll work at her aunt's hotel." }],
    hint: "The question is about leaving school, so what comes first?", key: "work at Aunt Sofia's hotel for a year", traps: [["not straight away", "university comes later"], ["Most of my friends are going travelling", "her friends"]] }],
"lab-numbers": [
  { level: 1, clip: "lab-num-s1", stem: "Which room is the Year 9 exam in?", lines: [["TEACHER", "The exam is in Room 213. Sorry, no, that's the room for Year 8. Year 9 are in Room 231, on the second floor."]], voices: { TEACHER: MAN },
    opts: [{ t: "231" }, { t: "213", why: "That's Year 8's room." }, { t: "23", why: "Listen to all three numbers." }, { t: "321", why: "Listen to the order of the numbers." }],
    hint: "Listen for \"Sorry, no\".", key: "Year 9 are in Room 231", traps: [["Room 213", "Year 8's room"]] },
  { level: 1, clip: "lab-num-s2", stem: "How many people came to the school concert?", lines: [["TEACHER", "We printed three hundred tickets and sold all of them, and then another fifty people paid at the door. So a record three hundred and fifty people came!"]], voices: { TEACHER: WOMAN2 },
    opts: [{ t: "350" }, { t: "300", why: "Those are the tickets sold before. Who else came?" }, { t: "50", why: "Those are only the people who paid at the door." }, { t: "315", why: "Fifteen or fifty?" }],
    hint: "Add the people who paid at the door.", key: "three hundred and fifty people came", traps: [["three hundred tickets", "before the concert"], ["another fifty", "extra only"]] },
  { level: 1, clip: "lab-num-s3", stem: "What is the name of the girl's street?", lines: [["GIRL", "We live at number fourteen, Thornley Road."], ["MAN", "How do you spell that?"], ["GIRL", "T, H, O, R, N, L, E, Y. Thornley."]], voices: { GIRL: T1, MAN },
    opts: [{ t: "Thornley" }, { t: "Thornly", why: "Count the letters at the end again." }, { t: "Thorneley", why: "Is there an E after the N?" }, { t: "Thornlee", why: "Listen to the last two letters again." }],
    hint: "Write each letter as she says it.", key: "T, H, O, R, N, L, E, Y", traps: [] },
  { level: 1, clip: "lab-num-s4", stem: "What time does the second half of the match start?", lines: [["COACH", "Kick-off is at half past two. Each half is forty-five minutes, and the break in the middle is fifteen minutes."]], voices: { COACH: MAN },
    opts: [{ t: "3.30" }, { t: "3.15", why: "That's when the first half ends. Add the break." }, { t: "2.45", why: "Forty-five minutes is a whole half." }, { t: "4.15", why: "That's when the match ends." }],
    hint: "Kick-off, plus one half, plus the break.", key: "the break in the middle is fifteen minutes", traps: [["Kick-off is at half past two", "the first half"]] },
  { level: 2, clip: "lab-num-c1", stem: "How old is Ben's sister?", lines: [["BEN", "I'm fourteen, and my brother's four years older than me. My sister is exactly half his age."]], voices: { BEN: B2 },
    opts: [{ t: "9" }, { t: "18", why: "That's the brother's age." }, { t: "7", why: "Half of Ben's age. Is she half Ben's age?" }, { t: "10", why: "Work out the brother's age first." }],
    hint: "Work out the brother's age first, then halve it.", key: "My sister is exactly half his age", traps: [["four years older than me", "the brother"]] },
  { level: 2, clip: "lab-num-c2", stem: "When is Sam's dentist appointment now?", lines: [["RECEPTIONIST", "Hello, this is Smile Dental calling for Sam Price. Your appointment on Tuesday the third at ten fifteen has had to be moved. The dentist can see you on Thursday the fifth instead, at the same time. If that's not convenient, please give us a call."]], voices: { RECEPTIONIST: WOMAN },
    opts: [{ t: "Thursday 5th at 10.15" }, { t: "Tuesday 3rd at 10.15", why: "That's the old appointment." }, { t: "Thursday 5th at 10.50", why: "\"The same time\": what was the time?" }, { t: "Tuesday 5th at 10.15", why: "Check the day again." }],
    hint: "The day changes. Does the time change?", key: "Thursday the fifth instead, at the same time", traps: [["Tuesday the third at ten fifteen", "the old appointment"]] },
  { level: 2, clip: "lab-num-c3", stem: "How much change does the boy get?", lines: [["BOY", "Two sandwiches and an orange juice, please."], ["MAN", "Sandwiches are three fifty each, and the juice is two pounds. That's nine pounds."], ["BOY", "Here's a twenty."],
      ["MAN", "Oh, wait, the juice is free with two sandwiches today. So that's seven pounds, and here's your change."]], voices: { BOY: B1, MAN },
    opts: [{ t: "£13" }, { t: "£11", why: "That's the change from nine pounds. Did the price change?" }, { t: "£7", why: "That's the price, not the change." }, { t: "£9", why: "That's the first price." }],
    hint: "Find the final price, then take it away from twenty.", key: "So that's seven pounds", traps: [["That's nine pounds", "before the free juice"]] },
  { level: 2, clip: "lab-num-c4", stem: "What is the email address for the photo competition?", lines: [["TEACHER", "Send your photos to m dot Hughes, that's H, U, G, H, E, S, at riverside school dot org. Riverside school is all one word."]], voices: { TEACHER: WOMAN2 },
    opts: [{ t: "m.hughes@riversideschool.org" }, { t: "m.huges@riversideschool.org", why: "Count the letters in the name again." }, { t: "mhughes@riversideschool.org", why: "Listen for \"dot\" after the m." }, { t: "m.hughes@riverside.school.org", why: "\"All one word\": is there a dot in the middle?" }],
    hint: "Listen for \"dot\", the spelling, and \"all one word\".", key: "H, U, G, H, E, S", traps: [] }],
"lab-opinion": [
  { level: 1, clip: "lab-op-s1", stem: "What does Kai think of the new rule about phones at lunch?", lines: [["KAI", "At first I thought banning phones at lunch was ridiculous. But honestly? People actually talk to each other now, and I've joined the chess club. I wouldn't want to go back."]], voices: { KAI: B1 },
    opts: [{ t: "He now supports it." }, { t: "He thinks it's ridiculous.", why: "That was at first. And now?" }, { t: "He wants phones back at lunch.", why: "He wouldn't want to go back." }, { t: "He doesn't care either way.", why: "He has a clear opinion." }],
    hint: "His opinion changes. Listen to the end.", key: "I wouldn't want to go back", traps: [["At first I thought banning phones at lunch was ridiculous", "his first opinion"]] },
  { level: 1, clip: "lab-op-s2", stem: "How does Mrs Green feel about the students' poster?", lines: [["MRS GREEN", "Well, the poster is very colourful, and I can see you've spent a lot of time on it. I'm just not sure where your information comes from, and some of the facts look a bit… surprising."]], voices: { "MRS GREEN": WOMAN },
    opts: [{ t: "She has doubts about the facts." }, { t: "She thinks it's excellent.", why: "Listen to what comes after the praise." }, { t: "She thinks it's too colourful.", why: "Colourful is a good point for her." }, { t: "She thinks they didn't work hard.", why: "She says they spent a lot of time on it." }],
    hint: "Teachers often praise first. Listen for \"I'm just not sure\".", key: "I'm just not sure where your information comes from", traps: [["the poster is very colourful", "polite praise first"]] },
  { level: 1, clip: "lab-op-s3", stem: "What do the two friends disagree about?", lines: [["AVA", "The ending was so sad! I cried."], ["LEO", "Same. I thought the middle was a bit slow, though."], ["AVA", "Really? I couldn't put it down."]], voices: { AVA: T3, LEO: B2 },
    opts: [{ t: "the middle of the book" }, { t: "the ending", why: "Leo says \"Same\": they agree." }, { t: "the main character", why: "Characters aren't mentioned." }, { t: "the length of the book", why: "Length isn't mentioned." }],
    hint: "\"Same\" means agree. \"Really?\" shows disagreement. What is it about?", key: "I thought the middle was a bit slow", traps: [["The ending was so sad", "they agree on this"]] },
  { level: 1, clip: "lab-op-s4", stem: "Why does the speaker talk about her grandmother?", lines: [["SPEAKER", "People say cooking takes too long. My grandmother fed a family of seven every day and still had time to run a shop. It's not about time. It's about planning."]], voices: { SPEAKER: WOMAN2 },
    opts: [{ t: "to show that busy people can still cook" }, { t: "to say her grandmother was a great cook", why: "That isn't her point." }, { t: "to complain about cooking", why: "She's defending cooking." }, { t: "to describe her big family", why: "The family is an example, not the point." }],
    hint: "What point does the example support? Listen to the last sentence.", key: "It's about planning", traps: [["fed a family of seven", "an example, not the point"]] },
  { level: 2, clip: "lab-op-c1", stem: "What is Daniel's opinion of the new sports stadium?", lines: [["DANIEL", "Nobody can deny it's an impressive building. But whether a town this size needed something so enormous, when the swimming pool has been closed for two years, is another question."]], voices: { DANIEL: MAN },
    opts: [{ t: "The money could have been better spent." }, { t: "He's proud of the impressive building.", why: "He admits it's impressive, but…" }, { t: "The town needed a bigger stadium.", why: "He questions whether it needed one so big." }, { t: "The swimming pool should stay closed.", why: "He's unhappy that it's closed." }],
    hint: "\"Is another question\" means he doubts it. What does he compare the stadium with?", key: "is another question", traps: [["Nobody can deny it's an impressive building", "he admits this, but…"]] },
  { level: 2, clip: "lab-op-c2", stem: "What is the girl's attitude to her brother's cooking?", lines: [["GIRL", "Oh, my brother's cooking is always an adventure. Last night he made pasta that was somehow burnt and raw at the same time. Still, at least he tries, which is more than I do!"]], voices: { GIRL: T1 },
    opts: [{ t: "She jokes about it, but she's glad he tries." }, { t: "She thinks he's a great cook.", why: "\"An adventure\" is a joke here: the pasta was burnt and raw." }, { t: "She refuses to eat it.", why: "She doesn't say that." }, { t: "She cooks better than him.", why: "She says she doesn't even try." }],
    hint: "Listen to \"Still, at least…\".", key: "at least he tries", traps: [["always an adventure", "a joke, not praise"]] },
  { level: 2, clip: "lab-op-c3", stem: "What does the head teacher think about the uniform survey?", lines: [["HEAD", "Seventy per cent of students voted to get rid of ties, and I take that seriously. Parents, however, were split down the middle. So rather than make a decision now, I'd like the student council to suggest a compromise."]], voices: { HEAD },
    opts: [{ t: "More discussion is needed before deciding." }, { t: "Ties should go straight away.", why: "He takes it seriously, but does he decide now?" }, { t: "Students' views don't matter.", why: "He says he takes them seriously." }, { t: "Parents agree with the students.", why: "Parents were split." }],
    hint: "Listen for \"rather than…\".", key: "rather than make a decision now", traps: [["I take that seriously", "he listens, but doesn't decide"], ["split down the middle", "not agreement"]] },
  { level: 2, clip: "lab-op-c4", stem: "How does Sara feel about moving to a new school?", lines: [["FRIEND", "Are you excited about the new school?"], ["SARA", "Everyone keeps asking me that. I mean, the art department is amazing, and it's much closer to home. I just… I've been with you lot since I was five, you know?"]], voices: { FRIEND: T3, SARA: T2 },
    opts: [{ t: "sad about leaving her friends" }, { t: "excited about the art department", why: "That's a good point, but listen to how she finishes." }, { t: "worried about the journey", why: "It's closer to home." }, { t: "angry with her parents", why: "Her parents aren't mentioned." }],
    hint: "Good points first, then \"I just…\". What is she really feeling?", key: "I've been with you lot since I was five", traps: [["the art department is amazing", "a good point, not her feeling"], ["much closer to home", "a good point"]] }]
};
for (const m of LAB) { m.items.forEach(it => { if (it.level == null) it.level = 0; }); m.items.push(...(EXTRA[m.id] || [])); }

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
// rate (for the bar and the weakest trap) counts a harder question right as more: Stretch 1.5, Challenge 2.
export function trapStats(history) {
  const out = Object.fromEntries(Object.keys(TRAPS).filter(k => k !== "prime").map(k => [k, { trap: k, total: 0, caught: 0, w: 0 }]));
  history.forEach(h => (h.answers || []).forEach(a => { const t = (a.skill === "Listening" || a.skill === "Trap game") && a.trap && out[a.trap]; if (!t) return;
    t.total++; if (!a.first_try) { t.caught++; t.w++; } else t.w += 1 + 0.5 * (a.level || 0); }));
  return Object.values(out).map(({ w, ...t }) => ({ ...t, rate: w ? t.caught / w : 0 }));
}
// The trap that catches this student most (at least 2 times caught and a third of answers), or null.
export function weakestTrap(history) {
  const s = trapStats(history).filter(t => t.caught >= 2 && t.rate >= 1 / 3).sort((a, b) => b.rate - a.rate || b.caught - a.caught);
  return s.length ? s[0].trap : null;
}
export const missionForTrap = trap => LAB.find(m => m.trap === trap);
export const XP_LAB = { first: [10, 15, 20], hint: 4, step: 2, finish: 10 };
export function labXP(results) {
  return results.reduce((t, r) => t + (r.skill === "Listening strategy" ? (r.first_try ? XP_LAB.step : 0) : r.support === "none" ? XP_LAB.first[r.level || 0] : r.support === "hint" ? XP_LAB.hint : 0), 0) + XP_LAB.finish;
}

/* Adaptive missions. Every mission is 6 questions. 2 right first time in a row: up a level. 2 missed in a row: a strategy
   rescue (tips, guided replay of the missed clip), then down a level. Challenge clips are heard once (+1 after a wrong answer). */
export const LAB_LEVELS = ["Core", "Stretch", "Challenge"];
export const MISSION_LEN = 6;
export const LAB_PLAYS = [2, 2, 1];
export const isLabAttempt = h => h.mode === "listening" && isLab(h.text_id);
const labAnswers = h => (h.answers || []).filter(a => a.skill === "Listening" && a.lab);
// Start where the last Lab mission ended; otherwise at the student's usual level (tier).
export function labStartLevel(history, tier = 0) {
  const last = history.filter(isLabAttempt).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || ""))).map(labAnswers).find(a => a.length);
  if (!last) return tier;
  const a = last[last.length - 1];
  return Math.max(0, Math.min(2, a.next ?? a.level ?? 0));
}
export const seenClips = history => new Set(history.filter(isLabAttempt).flatMap(h => labAnswers(h).map(a => a.lab)));
// The next question: the wanted level first (then the nearest level), not used in this run, new clips before seen ones.
// Listening items are keyed by clip, Reading Lab items (rlab.js) by id.
export function nextLabItem(m, level, used = [], seen = new Set()) {
  for (const l of [level, level - 1, level + 1, level - 2, level + 2].filter(x => x >= 0 && x <= 2)) {
    const pool = m.items.filter(it => it.level === l && !used.includes(it.clip || it.id));
    if (pool.length) return pool.find(it => !seen.has(it.clip || it.id)) || pool[0];
  }
  return null;
}
// After an answer: { level, up, down, rescue, rightRow, wrongRow }.
export function labStep(state, firstTry) {
  let { level, rightRow = 0, wrongRow = 0 } = state, up = false, rescue = false;
  if (firstTry) { rightRow++; wrongRow = 0; if (rightRow >= 2 && level < 2) { level++; up = true; rightRow = 0; } }
  else { wrongRow++; rightRow = 0; if (wrongRow >= 2) { rescue = true; wrongRow = 0; } }
  return { level, up, rescue, rightRow, wrongRow };
}
export const labPeak = answers => answers.filter(a => a.skill === "Listening").reduce((p, a) => Math.max(p, a.level || 0), 0);
// One mission for the teacher: { start, peak, end, rescues }. Rescues are replayed from the answers (2 missed in a row,
// not on the last question). null if the attempt has no Lab answers.
export function labSummary(answers = []) {
  const a = answers.filter(x => x.skill === "Listening" && x.lab); if (!a.length) return null;
  let st = { level: a[0].level || 0 }, rescues = 0;
  a.forEach((x, k) => { st = labStep(st, x.first_try); if (st.rescue && k < a.length - 1) rescues++; });
  const last = a[a.length - 1];
  return { start: a[0].level || 0, peak: labPeak(a), end: last.next ?? last.level ?? 0, rescues };
}
// The class list: missions done, the highest level reached and the level the next mission starts on (ck_teacher_class.lab).
export function labOverview(history) {
  const h = history.filter(x => isLabAttempt(x) && labSummary(x.answers));
  if (!h.length) return null;
  return { missions: new Set(h.map(x => x.text_id)).size, peak: Math.max(...h.map(x => labSummary(x.answers).peak)), now: labStartLevel(h) };
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
