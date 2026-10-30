// Unit 3 · Tourism: four practice texts. Same format as the sleep text in content.js:
// three levels with the same paragraph letters, eight slots, first MCQ option correct.
const U = "Unit 3 · Tourism";

/* ---------- 1. Overtourism at historic sites ---------- */
const VISITOR_DAMAGE = [
 {label:"feet / steps", k:["feet","foot","step","walk","wear"]},
 {label:"touching", k:["touch","hand"]},
 {label:"breath / humidity", k:["breath","humid","wet","water","heat","warm","air","moist"]}];
const NO_MONEY = {ask:"What do these places not get when tourists stay away?", label:"no money", k:["money","income","pay","fund","cash","afford","spend"]};
const DECAY = {ask:"What happens to the buildings then?", label:"neglect / damage", k:["neglect","look after","looked after","repair","fall","crumble","damage","leak","broken","break","ruin"]};

const CROWDS_LEVELS = [
 { title:"Too many tourists?", paras:[
  ["A","Every summer, thousands of tourists walk through the old streets of Venice in Italy. Many of them come on a day trip from a big cruise ship. They take photos, buy an ice cream and leave in the evening. For the people who live there, the streets are always full and noisy. Some families have moved away. \"Our city is turning into a museum,\" says one local woman."],
  ["B","This problem has a name: overtourism. It happens when too many visitors come to one place at the same time. Rome, Barcelona and Dubrovnik have this problem too. Sightseeing is fun, but big crowds are not fun for anyone, and prices go up for local people."],
  ["C","Old places are easy to damage. Millions of people visit the Colosseum in Rome every year. It is a huge amphitheatre with many stone arches, and it is almost 2,000 years old. Thousands of feet wear down its stone steps, and some visitors touch the walls. Inside old churches there are frescoes: paintings made on wet walls. Many are from medieval or Renaissance times. The breath and warm bodies of visitors make the air wet, and this slowly damages the paint."],
  ["D","Some cities are trying new ideas. Venice now asks day-trip visitors to pay a small fee on busy days. In Milan, people can only see Leonardo da Vinci's famous painting, The Last Supper, in small groups, and only for fifteen minutes. Many places now monitor visitor numbers, so they know when it is too busy."],
  ["E","But there is another problem. Famous places are too busy, but some other places get almost no visitors. Without money from tourists, old buildings there can suffer from neglect: nobody looks after them, and they slowly fall down. Tourism pays for a lot of conservation work, so we need visitors, just not all in one place."],
  ["F","So, should we stop visiting famous places? No. But we can travel at quiet times of the year, stay longer and visit smaller towns too. Then tourists and local people can share these special places. Experts call this coexistence."]],
  gloss:"fee: money you pay to do something · conservation: protecting old buildings or nature" },
 { title:"Too many tourists?", paras:[
  ["A","Every summer, the narrow streets of Venice fill with visitors. Many arrive on a day trip from a cruise ship: they take photos of the canals, buy a souvenir and are gone by the evening. For the people who live there, the crowds make daily life difficult, and rents have risen so much that thousands of residents have moved away. \"Our city is turning into a museum,\" says one local woman."],
  ["B","The problem even has a name: overtourism. It happens when a place receives more visitors than it can cope with. Venice is not alone; Rome, Barcelona and Dubrovnik have all struggled with the same issue. Sightseeing is one of the great pleasures of travel, but when too many people want to see the same thing at the same time, everyone loses, including the tourists."],
  ["C","Historic sites are especially fragile. Millions of people visit the Colosseum in Rome each year. This enormous amphitheatre, with its rows of stone arches, has stood for almost 2,000 years, but thousands of feet wear down its steps, and some visitors cannot resist touching the walls. Inside old churches, medieval and Renaissance frescoes face a different danger: the breath and body heat of large crowds raise the humidity of the air, which slowly damages the paint."],
  ["D","Some cities are fighting back. In 2024, Venice began charging day-trip visitors a small fee on its busiest days. In Milan, visitors to Leonardo da Vinci's The Last Supper enter in small groups and can stay for only fifteen minutes. Many sites now use ticket systems and cameras to monitor visitor numbers, so they can stop people entering when it gets too busy."],
  ["E","However, the opposite problem is just as serious. While famous places are overcrowded, thousands of smaller sites receive hardly any visitors at all. Without the money that tourists bring, they often suffer from neglect: roofs leak, walls crumble and nobody has the funds to repair them. Tourism pays for a great deal of conservation work, so the aim is not fewer visitors, but visitors who are spread out more evenly."],
  ["F","So should we stop visiting famous places? Not necessarily. Travelling outside the busiest months, staying longer instead of rushing through, and choosing a smaller town as well as a famous city can all make a difference. The goal, experts say, is coexistence: a balance in which local people and visitors can both enjoy these extraordinary places."]],
  gloss:"fragile: easily damaged · humidity: the amount of water in the air" },
 { title:"Loved to death", paras:[
  ["A","On a summer morning in Venice, the narrow streets near St Mark's Square can become so crowded that walking is reduced to shuffling. A large share of these visitors are day-trippers, many arriving from cruise ships, who photograph the canals, buy a souvenir and depart by nightfall. For residents, the experience is rather different. Soaring rents and crowded streets have driven tens of thousands of them out of the historic centre over recent decades. \"Our city is turning into a museum,\" one local woman remarks, and she does not mean it as a compliment."],
  ["B","The phenomenon now has a name: overtourism, the point at which visitor numbers exceed what a destination can reasonably absorb. Venice is far from unique; Rome, Barcelona and Dubrovnik have all wrestled with the same dilemma. Sightseeing may be one of travel's great pleasures, but when everyone wants to see the same thing at the same moment, the experience deteriorates for visitors and residents alike."],
  ["C","Historic sites are particularly vulnerable. The Colosseum, the vast amphitheatre whose tiers of stone arches have survived almost two millennia, now receives millions of visitors a year. The steady pressure of their footsteps wears away at its steps, and some visitors cannot resist touching ancient surfaces. Indoors, medieval and Renaissance frescoes face a subtler threat: the breath and body heat of dense crowds raise humidity levels, gradually degrading pigments that have lasted for centuries."],
  ["D","Authorities have begun to respond. In 2024, Venice introduced an entry fee for day-trippers on its busiest days. In Milan, visitors to Leonardo da Vinci's The Last Supper are admitted in small groups for just fifteen minutes. Increasingly, sites rely on timed tickets and sensors to monitor visitor numbers in real time, closing their doors before crowding becomes damaging."],
  ["E","Yet the opposite problem is arguably just as serious. While a handful of famous destinations are overwhelmed, countless lesser-known sites struggle to attract visitors at all. Deprived of tourist income, they are prone to neglect: leaking roofs go unrepaired and walls slowly crumble. Since tourism funds a considerable share of conservation work, the challenge is not to reduce the number of travellers but to distribute them more evenly."],
  ["F","None of this suggests that we should abandon famous places altogether. Travelling outside peak season, staying longer rather than racing through, and venturing beyond the obvious destinations are modest choices, but collectively they matter. The ultimate aim is coexistence: a balance in which those who live in remarkable places and those who come to admire them can both continue to do so."]],
  gloss:"pigment: the colour in paint · deprived of: without something you need" }
];

const CROWDS_SLOTS = [
 {skill:"Main idea", para:"F", q:[
  {stem:"What is the text mainly about?", opts:["How too many tourists can harm famous places, and what can help","Why Venice is the best city in Europe","How painters made frescoes on the walls of old churches","Why tourists should stay at home instead of visiting famous places"],
   hint:"Read paragraph A and paragraph F again. Your answer must be true for the whole text, not one paragraph.", focus:"Then tourists and local people can share these special places.",
   explain:"The answer is \"How too many tourists can harm famous places, and what can help\". Paragraphs A to C describe the problem, and D to F give ideas that help. Frescoes are only one detail in paragraph C."},
  {stem:"What is the text mainly about?", opts:["The problems caused by overtourism, and some ways to reduce them","How to plan a cheap day trip to Venice","The history of the Colosseum in Rome","Why small towns are better places to visit than big, crowded cities"],
   hint:"Read paragraph A and paragraph F again. Your answer must be true for the whole text, not one paragraph.", focus:"a balance in which local people and visitors can both enjoy these extraordinary places"},
  {stem:"Which statement best summarises the article?", opts:["Overtourism harms both places and communities, but spreading visitors more evenly can protect them.","Tourism should be strictly limited at every historic site, however many or few visitors it receives.","Famous places should close to protect their frescoes.","Lesser-known sites are more interesting than famous ones."],
   hint:"Look at how the article begins (A) and how it ends (F). The summary must include the problem and the solution.", focus:"The ultimate aim is coexistence"}]},
 {skill:"Detail", para:"D", q:[
  {stem:"How long can visitors look at The Last Supper?", opts:["For fifteen minutes","For thirty minutes","For one hour","For as long as they like"],
   hint:"Look in paragraph D. Find \"The Last Supper\".", focus:"and only for fifteen minutes.",
   explain:"The answer is \"for fifteen minutes\". Paragraph D says people see it \"in small groups, and only for fifteen minutes\"."},
  {stem:"According to paragraph D, what did Venice start doing in 2024?", opts:["Charging day-trip visitors a fee on its busiest days","Stopping all cruise ships","Using cameras to count every visitor who arrives by boat","Closing St Mark's Square"],
   hint:"Find \"2024\" in paragraph D. Read that sentence carefully.", focus:"In 2024, Venice began charging day-trip visitors a small fee on its busiest days."},
  {stem:"According to paragraph D, why do some sites monitor visitor numbers in real time?", opts:["So they can close before crowding causes damage","To charge each visitor more money","To count how many tourists come from cruise ships","To plan conservation work for the following year"],
   hint:"Find \"monitor\" in paragraph D. Read to the end of the sentence.", focus:"closing their doors before crowding becomes damaging"}]},
 {skill:"Vocabulary in context", para:"E", q:[
  {stem:"In paragraph E, \"neglect\" means…", opts:["not being looked after","having too many visitors","being repaired by experts after damage","being painted again"],
   hint:"Find \"neglect\" in paragraph E. Read the words after the colon (:).", focus:"nobody looks after them",
   explain:"The answer is \"not being looked after\". After the colon, the text explains neglect: \"nobody looks after them, and they slowly fall down\"."},
  {stem:"In paragraph D, \"monitor\" means…", opts:["watch and check carefully","make bigger","stop something from happening completely","pay for"], para:"D",
   hint:"Find \"monitor\" in paragraph D. Why do the sites use tickets and cameras?", focus:"Many sites now use ticket systems and cameras to monitor visitor numbers"},
  {stem:"In paragraph E, \"prone to\" means…", opts:["likely to suffer from","protected from something by the government","famous for","responsible for"],
   hint:"Find \"prone to\" in paragraph E. Read what happens to these sites after the colon.", focus:"they are prone to neglect"}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two ways that visitors can damage old places.", groups:VISITOR_DAMAGE, need:2,
   hint:"Look in paragraph C. What do visitors' feet, hands and breath do?", focus:"Thousands of feet wear down its stone steps, and some visitors touch the walls.",
   explain:"Possible answers (any two): their feet wear down the stone steps; they touch the walls; their breath and warm bodies make the air wet, which damages the paint of frescoes."},
  {type:"short", stem:"Give two ways that crowds can damage historic sites.", groups:VISITOR_DAMAGE, need:2,
   hint:"Paragraph C has three ways: one about feet, one about hands, and one about the air inside churches.", focus:"thousands of feet wear down its steps, and some visitors cannot resist touching the walls"},
  {type:"short", stem:"Identify two ways in which large numbers of visitors harm historic sites.", groups:VISITOR_DAMAGE, need:2,
   hint:"Paragraph C: look at footsteps, touching, and what breath and body heat do to the air.", focus:"raise humidity levels, gradually degrading pigments that have lasted for centuries"}]},
 {skill:"Inference", para:"A", q:[
  {stem:"A local woman says, \"Our city is turning into a museum.\" What does she mean?", opts:["The city is for visitors to look at, not for people to live in.","The city is building a lot of new museums for all the tourists to visit.","She works in one of the many museums in the city.","The city is very old and beautiful."],
   hint:"Look in paragraph A. What has happened to some families?", focus:"Some families have moved away.",
   explain:"The answer is \"The city is for visitors to look at, not for people to live in\". Families are moving away and the streets are full of tourists, so the city is becoming a place to look at, like a museum."},
  {stem:"What can we infer about the local woman's feelings?", opts:["She is unhappy about how her city is changing.","She is proud that so many people from around the world visit.","She wants more museums in Venice.","She thinks tourists should stay longer and spend more money in the city."],
   hint:"Paragraph A: what has happened to rents and to many residents? How would you feel?", focus:"rents have risen so much that thousands of residents have moved away"},
  {stem:"What does \"she does not mean it as a compliment\" suggest?", opts:["She sees the change as a loss, not something to be proud of.","She is joking about the number of museums.","She believes museums are boring places.","She is praising the city's careful conservation of its old buildings and art."],
   hint:"A compliment is something nice you say. If she does not mean it nicely, how does she see the change?", focus:"she does not mean it as a compliment"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"Why is it a problem when a place gets almost no visitors? Write one reason.", groups:[NO_MONEY, DECAY], need:1,
   hint:"Look in paragraph E. Find \"Without money from tourists…\".", focus:"Without money from tourists, old buildings there can suffer from neglect",
   explain:"Possible answers: there is no money from tourists; nobody looks after the buildings, so they fall down."},
  {type:"short", stem:"Explain why too few visitors can harm a historic site. Give the cause and the result.", groups:[NO_MONEY, DECAY], need:2,
   hint:"Paragraph E: the cause is about money. The result comes after the colon (:).", focus:"Without the money that tourists bring, they often suffer from neglect"},
  {type:"short", stem:"Explain how a lack of visitors can lead to damage at lesser-known sites.", groups:[NO_MONEY, DECAY], need:2,
   hint:"Paragraph E: what are these sites \"deprived of\", and what happens to their roofs and walls?", focus:"Deprived of tourist income, they are prone to neglect"}]},
 {skill:"Writer's purpose", para:"D", q:[
  {stem:"Why does the writer talk about Venice's fee and The Last Supper?", opts:["To give examples of ways to control crowds.","To tell readers which places in Italy are worth visiting.","To show that visiting famous places in Italy is now very expensive.","To explain how The Last Supper was painted."],
   hint:"Look at the first sentence of paragraph D. The examples after it show what that sentence means.", focus:"Some cities are trying new ideas.",
   explain:"The answer is \"to give examples of ways to control crowds\". Paragraph D starts \"Some cities are trying new ideas\", and the fee and the small groups are those ideas."},
  {stem:"Why does the writer include the examples in paragraph D?", opts:["To show how some places are trying to manage crowds","To complain about the cost of visiting famous places in Italy","To compare Venice with Milan","To show that technology causes overtourism"],
   hint:"Paragraph D begins \"Some cities are fighting back.\" Fighting back against what?", focus:"Some cities are fighting back."},
  {stem:"What is the function of paragraph E in the article?", opts:["It introduces an opposite problem that shapes the writer's conclusion.","It gives more examples of crowd control.","It argues that famous sites should close to visitors until they have been repaired.","It describes the history of conservation."], para:"E",
   hint:"Paragraph E begins with \"Yet\". What does it add to the problem described in paragraphs A to D?", focus:"Yet the opposite problem is arguably just as serious."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think?", opts:["We should still travel, but in a smarter way.","Tourists should stop visiting famous places and stay at home.","Overtourism is not a real problem.","Only small groups should travel to famous places like Venice."],
   hint:"Read paragraph F. The writer asks a question and then answers it.", focus:"So, should we stop visiting famous places? No.",
   explain:"The answer is \"We should still travel, but in a smarter way\". The writer says \"No\" to stopping, then gives ideas: travel at quiet times, stay longer and visit smaller towns."},
  {stem:"What is the writer's attitude to visiting famous places?", opts:["Positive, as long as people travel thoughtfully","Negative: people should stay at home","Neutral: the writer gives no opinion","Worried that all famous places will soon have to close to visitors"],
   hint:"Paragraph F: the writer answers the question with \"Not necessarily\" and then gives advice.", focus:"So should we stop visiting famous places? Not necessarily."},
  {stem:"Which statement best reflects the writer's position?", opts:["Small changes in how people travel can, together, make a real difference.","Tourists are entirely to blame for damage to historic sites.","Only strict government limits on visitor numbers can solve the problem of overtourism.","Famous destinations should be avoided completely."],
   hint:"Paragraph F: find the word \"collectively\". Watch out for answers with \"entirely\", \"only\" or \"completely\".", focus:"are modest choices, but collectively they matter"}]}
];

/* ---------- 2. An eco-camping weekend in a national park ---------- */
const CAMP_RULES = [
 {label:"take rubbish home", k:["rubbish","litter","trash","garbage","waste","bin"]},
 {label:"fires only in the fire area", k:["fire","burn","cook","stove"]},
 {label:"no music after nine", k:["quiet","noise","loud","music"]},
 {label:"don't feed animals", k:["feed","food","animal","monkey"]}];
const BUG_CAUSE = {ask:"What came out near the river?", label:"mosquitoes / insects", k:["mosquito","insect","bug","bite","bitten"]};
const BUG_RESULT = {ask:"What did the family use?", label:"repellent", k:["repellent","spray","cream","sleeve","cover"]};

const CAMP_LEVELS = [
 { title:"Two nights without Wi-Fi", paras:[
  ["A","When my parents said we were going camping in a national park, I was not happy. My little brother, Bao, wanted to go to a theme park, and I wanted to stay at home with my phone. \"There is no Wi-Fi there,\" Mum said with a smile. I thought it was going to be the worst weekend of the year."],
  ["B","The park is two hours from our city. We stayed at an eco campsite. It has no shop and no plastic bottles. There are only twelve places for tents, so it is never crowded. A ranger met us at the gate and told us the rules: take all your rubbish home, only make fires in the fire area, keep music off after nine o'clock and never feed the animals."],
  ["C","On the first day we walked to a waterfall. Dad carried the picnic basket and I carried the first-aid kit. It was hot, but the forest was green and quiet. We saw two big birds and a group of monkeys in the trees. Bao was so excited that he forgot about the theme park."],
  ["D","In the evening, there were lots of mosquitoes near the river. Luckily, Mum had brought insect repellent. We put it on our arms and legs and wore long sleeves. Nobody got bitten that night, but the family in the next tent was not so lucky."],
  ["E","The best part was the hot spring on the second day. The water comes up warm from under the ground. We sat in it and watched the sun go down. The ranger told us, \"People come here to look at nature, but if they are careless, they destroy it. Eco tourism means you leave a place better than you found it.\""],
  ["F","I did not touch my phone for two whole days, and I did not miss it. Next year, I want to go back for a longer trip. A day trip to a theme park is fun, but a weekend in a national park is something you remember."]],
  gloss:"ranger: a person whose job is to look after a park · mosquito: a small flying insect that bites" },
 { title:"Two nights without Wi-Fi", paras:[
  ["A","When my parents announced that we were going camping in a national park, I was not exactly excited. My little brother, Bao, had been begging to go to a theme park, and I was planning a quiet weekend at home with my phone. \"Just so you know, there's no Wi-Fi,\" Mum said, smiling a little too much. I was sure it would be the longest weekend of my life."],
  ["B","The park is about two hours from our city, and we stayed at an eco campsite. There is no shop, no plastic bottles and only twelve spaces for tents, so it never feels crowded. A ranger met us at the gate and explained the rules: take every piece of rubbish home with you, only light fires in the marked area, no music after nine, and never, ever feed the animals."],
  ["C","On our first morning we hiked to a waterfall. Dad carried the picnic basket and I was in charge of the first-aid kit, which, fortunately, we did not need. It was hot, but under the trees the forest was cool and silent apart from the birds. Halfway up, we spotted a family of monkeys watching us from the branches. Bao was so excited that he did not mention the theme park once."],
  ["D","As it got dark, clouds of mosquitoes appeared near the river. Luckily, Mum had packed insect repellent, so we sprayed our arms and legs and changed into long sleeves. None of us got bitten, but judging by the noises from the next tent, our neighbours had not been so well prepared."],
  ["E","The highlight came on the second afternoon: a natural hot spring, where warm water bubbles up from deep underground. We sat in it as the sun went down behind the hills. The ranger, who had joined us, said something I still remember: \"People come here to enjoy nature, but if they're careless, they destroy the very thing they came to see. Eco tourism means leaving a place better than you found it.\""],
  ["F","I didn't touch my phone for two whole days, and to my surprise, I didn't miss it. I've already asked if we can go back next year for longer. A day trip to a theme park is fun while it lasts, but a weekend in a national park is something you actually remember."]],
  gloss:"ranger: a person whose job is to look after a park · highlight: the best part" },
 { title:"Two nights without Wi-Fi", paras:[
  ["A","When my parents announced that we would be spending the weekend camping in a national park, my enthusiasm was, to put it politely, limited. My younger brother, Bao, had spent weeks campaigning for a theme park, and I had been looking forward to a weekend at home with my phone. \"You do know there's no Wi-Fi,\" Mum added, with a smile that suggested she was enjoying this rather more than I was. I braced myself for the longest two days of my life."],
  ["B","The park lies about two hours from our city, and we stayed at what is described as an eco campsite: no shop, no plastic bottles, and a strict limit of twelve tents, which keeps it remarkably peaceful. A ranger greeted us at the gate and ran through the rules with the seriousness of someone who has seen them broken: every scrap of rubbish leaves with you, fires are lit only in the designated area, music stops at nine, and on no account do you feed the wildlife."],
  ["C","On the first morning we hiked to a waterfall, with Dad in charge of the picnic basket and me responsible for the first-aid kit, which, thankfully, stayed closed. Despite the heat, the forest was cool and almost silent beneath the canopy. Halfway up, we came across a troop of monkeys observing us from the branches with what looked like mild disapproval. Bao was so captivated that the theme park was never mentioned again."],
  ["D","At dusk, swarms of mosquitoes rose from the riverbank. Fortunately, Mum had packed insect repellent, so we applied it generously and changed into long sleeves. We escaped without a single bite, although the slapping and complaining from the neighbouring tent suggested that not everyone had prepared so thoroughly."],
  ["E","The real highlight came on the second afternoon, in a natural hot spring where water heated deep underground bubbles to the surface. We sat in it as the sun sank behind the hills. The ranger, who had joined us, made a remark that has stayed with me: \"People come here to enjoy nature, but if they're careless, they destroy the very thing they came to see. Eco tourism means leaving a place better than you found it.\""],
  ["F","I went two full days without touching my phone and, somewhat to my annoyance, did not miss it at all. I have already lobbied my parents for a longer trip next year. A day trip to a theme park is entertaining while it lasts; a weekend in a national park, it turns out, is something you carry home with you."]],
  gloss:"canopy: the top layer of branches in a forest · lobby: to try hard to persuade someone" }
];

const CAMP_SLOTS = [
 {skill:"Main idea", para:"F", q:[
  {stem:"What is the text mainly about?", opts:["A camping trip that the writer enjoyed much more than expected","How to build a tent in a national park","Why theme parks are better than national parks for a family holiday","A ranger's job in a national park and the rules that visitors must follow"],
   hint:"Read paragraph A (before the trip) and paragraph F (after the trip). How did the writer's feelings change?", focus:"I did not touch my phone for two whole days, and I did not miss it.",
   explain:"The answer is \"A camping trip that the writer enjoyed much more than expected\". In A the writer thinks it will be the worst weekend, but in F they want to go back."},
  {stem:"What is the text mainly about?", opts:["How a reluctant teenager came to love a weekend of eco camping","The rules of all national parks in the country","The dangers of mosquitoes near rivers","Why the writer's brother wanted to visit a theme park instead of a national park"],
   hint:"Compare the writer's feelings in paragraph A with paragraph F.", focus:"to my surprise, I didn't miss it"},
  {stem:"Which statement best summarises the text?", opts:["A weekend of eco camping changes the writer's expectations and leaves a lasting impression.","The writer argues that phones should be banned on all family holidays, even short weekends away.","The text explains how hot springs are formed.","The writer describes the problems of poorly managed campsites."],
   hint:"The text is a personal story. How does it begin, and what does the writer \"carry home\" at the end?", focus:"is something you carry home with you"}]},
 {skill:"Detail", para:"B", q:[
  {stem:"How many places for tents does the campsite have?", opts:["Twelve","Two","Nine","Twenty"],
   hint:"Look in paragraph B. Find a number about tents.", focus:"There are only twelve places for tents, so it is never crowded.",
   explain:"The answer is \"twelve\". Paragraph B says: \"There are only twelve places for tents.\" Two is the number of hours to the park, and nine o'clock is when the music stops."},
  {stem:"According to paragraph B, why does the campsite never feel crowded?", opts:["It only has space for twelve tents.","It is more than two hours' drive from the city.","It has no shop.","The ranger sends people away."],
   hint:"Look in paragraph B for the word \"crowded\". What comes just before it?", focus:"only twelve spaces for tents, so it never feels crowded"},
  {stem:"According to paragraph B, what keeps the campsite peaceful?", opts:["A strict limit on the number of tents","The ban on plastic bottles","The distance from the city","The ranger at the gate who checks every car"],
   hint:"Find \"peaceful\" in paragraph B. What \"keeps\" it that way?", focus:"a strict limit of twelve tents, which keeps it remarkably peaceful"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"insect repellent\" is…", opts:["something you put on your skin to keep insects away","a kind of mosquito","a long-sleeved shirt that stops mosquitoes from biting your arms","medicine you take after you have been bitten by insects"],
   hint:"Find \"repellent\" in paragraph D. What did the family do with it, and what happened after?", focus:"We put it on our arms and legs and wore long sleeves.",
   explain:"The answer is \"something you put on your skin to keep insects away\". They put it on their arms and legs, and nobody got bitten."},
  {stem:"In paragraph D, \"prepared\" means…", opts:["ready for something","tired after something","surprised by something","worried about something"],
   hint:"Find \"prepared\" in paragraph D. The neighbours got bitten. What did they not have?", focus:"our neighbours had not been so well prepared"},
  {stem:"In paragraph D, \"applied it generously\" means they…", opts:["put a lot of it on","shared it with neighbours","used it carefully and slowly","bought some more"],
   hint:"Find \"applied it generously\" in paragraph D. They escaped without a single bite. How much did they use?", focus:"we applied it generously and changed into long sleeves"}]},
 {skill:"Detail: two points", para:"B", q:[
  {type:"short", stem:"Write two rules at the campsite.", groups:CAMP_RULES, need:2,
   hint:"Look in paragraph B. The ranger told them the rules after the colon (:).", focus:"take all your rubbish home, only make fires in the fire area, keep music off after nine o'clock and never feed the animals",
   explain:"Possible answers (any two): take all your rubbish home; only make fires in the fire area; no music after nine o'clock; never feed the animals."},
  {type:"short", stem:"Give two of the rules the ranger explained.", groups:CAMP_RULES, need:2,
   hint:"Paragraph B: the rules come after \"explained the rules:\". There are four.", focus:"take every piece of rubbish home with you, only light fires in the marked area, no music after nine, and never, ever feed the animals"},
  {type:"short", stem:"Identify two rules that visitors to the campsite must follow.", groups:CAMP_RULES, need:2,
   hint:"Paragraph B: the ranger \"ran through the rules\". They are listed after the colon.", focus:"every scrap of rubbish leaves with you, fires are lit only in the designated area, music stops at nine, and on no account do you feed the wildlife"}]},
 {skill:"Inference", para:"A", q:[
  {stem:"Why did Mum smile when she said there was no Wi-Fi?", opts:["She knew the writer would not like it.","She was angry with the writer.","She wanted to go to a theme park instead of camping.","She had forgotten her phone, so she did not mind."],
   hint:"Look in paragraph A. How did the writer feel about the trip? What did the writer want to do at home?", focus:"I wanted to stay at home with my phone",
   explain:"The answer is \"She knew the writer would not like it\". The writer wanted to stay at home with a phone, so Mum knew the news about Wi-Fi would be a shock, and she found it a little funny."},
  {stem:"What does \"smiling a little too much\" suggest about Mum?", opts:["She was enjoying the writer's reaction.","She was nervous about the trip.","She was trying to hide that she was sad.","She did not know about the Wi-Fi until they arrived at the campsite."],
   hint:"Paragraph A: the writer was planning a weekend with a phone. Why might Mum find the news funny?", focus:"Mum said, smiling a little too much"},
  {stem:"What can we infer from Mum's smile in paragraph A?", opts:["She expected the trip to be good for the writer, whatever the writer thought.","She was secretly disappointed about the lack of Wi-Fi.","She had not wanted to go camping either.","She was trying to persuade Bao to choose the theme park instead of the national park."],
   hint:"Paragraph A: Mum was \"enjoying this rather more than I was\". Then think about how the trip turned out in paragraph F.", focus:"with a smile that suggested she was enjoying this rather more than I was"}]},
 {skill:"Cause and effect", para:"D", q:[
  {type:"short", stem:"Why did the family use insect repellent?", groups:[BUG_CAUSE, BUG_RESULT], need:1,
   hint:"Look in paragraph D. What was near the river in the evening?", focus:"In the evening, there were lots of mosquitoes near the river.",
   explain:"Possible answer: because there were lots of mosquitoes near the river, and they did not want to get bitten."},
  {type:"short", stem:"Explain what the family did about the mosquitoes, and why.", groups:[BUG_CAUSE, BUG_RESULT], need:2,
   hint:"Paragraph D: what appeared near the river, and what did Mum pack?", focus:"clouds of mosquitoes appeared near the river. Luckily, Mum had packed insect repellent"},
  {type:"short", stem:"Explain why the family escaped without a bite while their neighbours did not.", groups:[BUG_CAUSE, BUG_RESULT], need:2,
   hint:"Paragraph D: what rose from the riverbank, and what did the family apply?", focus:"Fortunately, Mum had packed insect repellent, so we applied it generously"}]},
 {skill:"Writer's purpose", para:"E", q:[
  {stem:"Why does the writer include what the ranger said?", opts:["To explain the main idea of eco tourism.","To show that the ranger was unfriendly.","To describe how hot springs work and why the water is warm.","To give the rules of the campsite again in a different way."],
   hint:"Look in paragraph E. What does the ranger say eco tourism means?", focus:"Eco tourism means you leave a place better than you found it.",
   explain:"The answer is \"To explain the main idea of eco tourism\". The ranger's words tell the reader what eco tourism means: leave a place better than you found it."},
  {stem:"Why does the writer quote the ranger in paragraph E?", opts:["To share an important message about caring for nature","To complain about other visitors","To show that the ranger was funny","To explain why the campsite has no shop and no plastic bottles"],
   hint:"Paragraph E: the writer says the ranger said \"something I still remember\". Why would it be memorable?", focus:"said something I still remember"},
  {stem:"What is the purpose of ending paragraph E with the ranger's words?", opts:["To give the reader a lasting message about responsible tourism","To criticise the writer's family for being careless with their rubbish at the hot spring","To introduce a new problem with the hot spring","To show that the ranger disliked tourists"],
   hint:"The writer says the remark \"has stayed with me\". What does the remark teach visitors?", focus:"made a remark that has stayed with me"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about national parks now?", opts:["A trip there is special and worth repeating.","They are boring without Wi-Fi.","They are only good for a short day trip, not a whole weekend.","Theme parks are much better for a family weekend away."],
   hint:"Read paragraph F. What does the writer want to do next year?", focus:"Next year, I want to go back for a longer trip.",
   explain:"The answer is \"A trip there is special and worth repeating\". The writer wants to go back next year for longer, and says a weekend there is something you remember."},
  {stem:"How does the writer compare theme parks with national parks?", opts:["Theme parks are fun, but a national park trip stays with you longer.","Theme parks are boring and a waste of money compared with national parks.","National parks are only good for families with young children.","They are equally memorable."],
   hint:"Paragraph F: find the last sentence. What is \"fun while it lasts\"?", focus:"A day trip to a theme park is fun while it lasts"},
  {stem:"Which phrase best describes the writer's tone in paragraph F?", opts:["Honest and slightly amused at having been proved wrong","Angry about the lack of Wi-Fi","Sad that the trip has ended","Critical of theme parks and of the people who choose to visit them"],
   hint:"Paragraph F: the writer did not miss the phone \"somewhat to my annoyance\". Why would that be annoying, and is it serious?", focus:"somewhat to my annoyance, did not miss it at all"}]}
];

/* ---------- 3. Active holidays ---------- */
const ACTIVE_BENEFITS = [
 {label:"fitness / health", k:["fit","fitter","fitness","health","exercise","body","strong","active"]},
 {label:"confidence", k:["confiden","brave","believe","proud","self"]},
 {label:"friends", k:["friend","people","social","team","together"]},
 {label:"less screen time", k:["screen","phone","device","online"]}];
const RISK = {ask:"What often happens to people on active holidays?", label:"risk of injury", k:["injur","hurt","accident","fall","fell","danger","risk","wound","safe"]};
const TRAINED = {ask:"What can the staff do about it?", label:"trained staff / first aid", k:["first aid","first-aid","train","qualif","instructor","staff","coach","treat","look after","take care","nurse","doctor","medic"]};

const ACTIVE_LEVELS = [
 { title:"Holidays that keep you moving", paras:[
  ["A","Fourteen-year-old Minh stood on the water skis and held the rope. The boat started, and for three seconds he was flying across the lake. Then he fell into the water. Everyone on the boat cheered. \"I fell eleven times that day,\" he laughs. \"But on the twelfth time, I did it.\""],
  ["B","Minh was at a summer sports camp. More and more families now choose active holidays like this. Instead of lying on a beach or queuing at a theme park, people try new sports: windsurfing, waterskiing, climbing or even ice skating in summer at an indoor rink."],
  ["C","Why are these holidays so popular? Doctors say they are good for young people in many ways. They make you fitter, and learning a new skill makes you more confident. Because you are part of a group, you make new friends quickly. And you spend much less time looking at a screen."],
  ["D","At Minh's camp, there were sports all day. In the morning there was windsurfing on the lake. In the afternoon, campers played games on the tennis court or went roller skating in the park. In the evening, everybody was too tired to look at their phones."],
  ["E","Of course, active holidays have risks. People sometimes fall and hurt themselves. So good camps have staff with first-aid training, and they check the weather every day. On one stormy afternoon, the windsurfing was stopped, and everyone played table tennis inside instead."],
  ["F","Is an active holiday right for everyone? Probably not. Some people need a quiet rest. But if you want to try something new, it could be the best holiday you ever have. As Minh says, \"Falling eleven times is fine, if you get up twelve.\""]],
  gloss:"rink: a place for skating · confident: sure that you can do something" },
 { title:"Holidays that keep you moving", paras:[
  ["A","Fourteen-year-old Minh gripped the rope as the boat pulled away. For three glorious seconds he was skimming across the lake on water skis, and then he was underwater. A cheer went up from the boat. \"I fell eleven times that day,\" he says, laughing. \"But on the twelfth try, I stayed up all the way round.\""],
  ["B","Minh was at a summer sports camp, and he is far from the only one. Travel companies report that more and more families are choosing active holidays. Rather than lying by a pool or queuing for rides at a theme park, they spend their time trying something new: windsurfing, waterskiing, rock climbing, or even ice skating at an indoor rink in the middle of summer."],
  ["C","Part of the appeal is that these holidays are good for young people in more than one way. They improve fitness, of course, but experts point out that mastering a difficult skill also builds confidence. Because campers spend all day in groups, they make friends quickly, and they spend far less time staring at screens than they would at home."],
  ["D","At Minh's camp, the day was packed. Mornings meant windsurfing lessons on the lake; afternoons were spent on the tennis court or roller skating along the paths of the local park. By the evening, Minh says, \"everyone was too tired to even look at their phones.\""],
  ["E","Active holidays are not without risks. Falls and minor injuries are common, which is why well-run camps employ staff with first-aid training and check the weather forecast every morning. When a storm arrived one afternoon, the windsurfing was cancelled immediately, and the campers played table tennis indoors instead. \"Nobody complained,\" Minh admits, \"because the lake looked pretty scary.\""],
  ["F","Is an active holiday right for everyone? Probably not; some people genuinely need a quiet rest. But for anyone who wants to come home with a new skill and a few good stories, it is hard to beat. As Minh puts it, \"Falling eleven times is fine, as long as you get up twelve.\""]],
  gloss:"skim: move quickly over the top of water · master: learn to do something very well" },
 { title:"The rise of the active holiday", paras:[
  ["A","Fourteen-year-old Minh gripped the tow rope as the boat accelerated. For three exhilarating seconds he was skimming across the lake on water skis; then, abruptly, he was underwater. A cheer erupted from the boat. \"I fell eleven times that day,\" he recalls with a grin. \"But on the twelfth attempt, I made it all the way round.\""],
  ["B","Minh was spending a fortnight at a summer sports camp, and he is part of a growing trend. Travel companies report rising demand for active holidays, as families trade sunbeds and theme park queues for windsurfing, waterskiing, rock climbing or, improbably, ice skating at an indoor rink in the height of summer."],
  ["C","The appeal extends well beyond physical fitness. Psychologists note that mastering a demanding skill, particularly one that involves repeated failure, builds a kind of confidence that transfers to other areas of life. Since campers spend their days in groups, friendships form quickly, and screen time falls dramatically, almost without anyone noticing."],
  ["D","At Minh's camp, every hour was accounted for. Mornings were devoted to windsurfing on the lake; afternoons alternated between matches on the tennis court and roller skating through the local park. By evening, Minh says, \"everyone was too exhausted to even glance at their phones.\""],
  ["E","None of this is entirely without risk. Falls and minor injuries are an accepted part of learning, which is why reputable camps insist on staff with first-aid qualifications and review the weather forecast each morning. When a storm rolled in one afternoon, windsurfing was called off without hesitation and the campers were moved indoors for table tennis. \"Nobody argued,\" Minh concedes. \"The lake looked genuinely frightening.\""],
  ["F","Active holidays will not suit everyone; for some, a holiday is precisely an opportunity to do nothing at all, and there is nothing wrong with that. But for those willing to be a little uncomfortable, they offer something a sunbed rarely does: the satisfaction of coming home able to do something you could not do before. Or, in Minh's words, \"Falling eleven times is fine, as long as you get up twelve.\""]],
  gloss:"exhilarating: very exciting · reputable: known to be good and honest" }
];

const ACTIVE_SLOTS = [
 {skill:"Main idea", para:"B", q:[
  {stem:"What is the text mainly about?", opts:["Why many families choose sports holidays, and what they are like","How to learn waterskiing in one day at a summer sports camp","Why theme parks are too expensive","How to stay safe in a storm"],
   hint:"Read paragraph B and paragraph F. What kind of holiday does the whole text talk about?", focus:"More and more families now choose active holidays like this.",
   explain:"The answer is \"Why many families choose sports holidays, and what they are like\". Minh's camp is one example. The text explains why active holidays are popular, what happens, and the risks."},
  {stem:"What is the text mainly about?", opts:["The growing popularity of active holidays, their benefits and their risks","Minh's experience of learning to windsurf","The best sports camps for teenagers","Why some people prefer quiet holidays to sports camps and active trips"],
   hint:"Minh is an example. What do paragraphs B, C and E talk about in general?", focus:"more and more families are choosing active holidays"},
  {stem:"Which statement best summarises the article?", opts:["Active holidays are becoming popular because they offer real benefits, provided risks are managed.","Active holidays are dangerous and should be carefully avoided.","Every family should replace beach holidays with sports camps, because resting on holiday is a waste of time.","Failure is the most important part of any holiday."],
   hint:"Your summary must include the trend (B), the benefits (C) and the risks (E).", focus:"he is part of a growing trend"}]},
 {skill:"Detail", para:"D", q:[
  {stem:"What did campers do in the morning?", opts:["Windsurfing on the lake","Tennis","Roller skating in the park","Table tennis"],
   hint:"Look in paragraph D. Find \"In the morning\".", focus:"In the morning there was windsurfing on the lake.",
   explain:"The answer is \"windsurfing on the lake\". Tennis and roller skating were in the afternoon, and table tennis was only on the stormy day."},
  {stem:"According to paragraph D, where did campers go roller skating?", opts:["Along the paths of the local park","On the tennis court","Around the lake after windsurfing","At an indoor rink"],
   hint:"Find \"roller skating\" in paragraph D. Read to the end of the sentence.", focus:"roller skating along the paths of the local park"},
  {stem:"According to paragraph D, how were the afternoons organised?", opts:["Campers did tennis or roller skating on different afternoons.","Campers did windsurfing and then tennis.","Campers chose whether to rest in their rooms or play table tennis.","Campers went ice skating every afternoon."],
   hint:"Find \"afternoons alternated\" in paragraph D. \"Alternate\" means to change between two things.", focus:"afternoons alternated between matches on the tennis court and roller skating through the local park"}]},
 {skill:"Vocabulary in context", para:"C", q:[
  {stem:"In paragraph C, \"confident\" means…", opts:["sure that you can do things","very tired","worried about making mistakes in front of others","good at making friends with people you have just met"],
   hint:"Find \"confident\" in paragraph C. How do you feel after you learn a new skill?", focus:"learning a new skill makes you more confident",
   explain:"The answer is \"sure that you can do things\". When you learn a new skill, you start to believe you can do difficult things."},
  {stem:"In paragraph C, \"mastering\" a skill means…", opts:["learning to do it very well","teaching it to others","trying it for the first time","giving it up"],
   hint:"Find \"mastering\" in paragraph C. Minh fell eleven times, then succeeded. What did he do in the end?", focus:"mastering a difficult skill also builds confidence"},
  {stem:"In paragraph C, \"transfers to\" means…", opts:["also helps in","is moved away from","is less useful than","is caused by"],
   hint:"Find \"transfers to other areas of life\" in paragraph C. Does the confidence stay only in sport?", focus:"builds a kind of confidence that transfers to other areas of life"}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two ways that active holidays are good for young people.", groups:ACTIVE_BENEFITS, need:2,
   hint:"Look in paragraph C. There are four ways.", focus:"They make you fitter, and learning a new skill makes you more confident.",
   explain:"Possible answers (any two): they make you fitter; they make you more confident; you make new friends; you spend less time looking at a screen."},
  {type:"short", stem:"Give two benefits of active holidays for young people.", groups:ACTIVE_BENEFITS, need:2,
   hint:"Paragraph C lists benefits: fitness, a skill, groups and screens.", focus:"they make friends quickly, and they spend far less time staring at screens"},
  {type:"short", stem:"Identify two benefits of active holidays other than physical fitness.", groups:ACTIVE_BENEFITS.slice(1), need:2,
   hint:"Paragraph C: \"The appeal extends well beyond physical fitness.\" What else do campers gain?", focus:"friendships form quickly, and screen time falls dramatically"}]},
 {skill:"Inference", para:"A", q:[
  {stem:"Why did everyone on the boat cheer when Minh fell?", opts:["To encourage him to keep trying","Because they wanted him to stop and let someone else try","Because he was hurt","Because the boat was going too fast for him to hold on"],
   hint:"Look in paragraph A. What happened on Minh's twelfth try? Why would people cheer for someone who is learning?", focus:"Everyone on the boat cheered.",
   explain:"The answer is \"To encourage him to keep trying\". Falling is normal when you learn, and the cheers helped him try again until he succeeded."},
  {stem:"What can we infer about Minh from paragraph A?", opts:["He did not give up easily.","He was already good at waterskiing.","He was afraid of the water.","He did not enjoy the camp."],
   hint:"Paragraph A: how many times did Minh fall, and what happened in the end?", focus:"But on the twelfth try, I stayed up all the way round."},
  {stem:"What does Minh's grin in paragraph A suggest about his attitude to failure?", opts:["He sees falling as a normal and even enjoyable part of learning.","He is embarrassed about how many times he fell.","He believes he was unlucky that day.","He thinks the instructors should have helped him more on his first few tries."],
   hint:"Paragraph A: Minh \"recalls with a grin\" falling eleven times. Would an embarrassed person grin?", focus:"he recalls with a grin"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"Why do good camps have staff with first-aid training?", groups:[RISK, TRAINED], need:1,
   hint:"Look in paragraph E. What sometimes happens to people?", focus:"People sometimes fall and hurt themselves.",
   explain:"Possible answer: because people sometimes fall and hurt themselves, so staff need to help them."},
  {type:"short", stem:"Explain why well-run camps employ staff with first-aid training: what often happens, and how do the staff help?", groups:[RISK, TRAINED], need:2,
   hint:"Paragraph E: find \"which is why\". What comes before it?", focus:"Falls and minor injuries are common, which is why well-run camps employ staff with first-aid training"},
  {type:"short", stem:"Explain why reputable camps insist on first-aid qualifications: what is common, and what can qualified staff do?", groups:[RISK, TRAINED], need:2,
   hint:"Paragraph E: what is \"an accepted part of learning\"? Link it to the staff.", focus:"Falls and minor injuries are an accepted part of learning, which is why reputable camps insist on staff with first-aid qualifications"}]},
 {skill:"Writer's purpose", para:"E", q:[
  {stem:"Why does the writer tell the story about the storm?", opts:["To show that good camps keep people safe.","To show that the camp was boring.","To explain how storms start over lakes in the afternoon.","To show that table tennis is more popular than windsurfing."],
   hint:"Look in paragraph E. What did the camp do when the storm came?", focus:"On one stormy afternoon, the windsurfing was stopped",
   explain:"The answer is \"To show that good camps keep people safe\". The camp stopped the windsurfing because of the storm, which is an example of keeping campers safe."},
  {stem:"Why does the writer include the storm in paragraph E?", opts:["As an example of how a well-run camp manages risk","To show that the weather ruined Minh's holiday","To criticise the camp for cancelling activities whenever the weather changed","To compare windsurfing with table tennis"],
   hint:"Paragraph E first says camps check the weather every morning. What does the storm story then show?", focus:"the windsurfing was cancelled immediately"},
  {stem:"What is the function of Minh's comment at the end of paragraph E?", opts:["It shows that the safety decision was clearly sensible, even to the campers.","It suggests the campers were angry about the cancellation but too polite to complain to the instructors.","It shows that Minh was too frightened to windsurf.","It introduces a criticism of the camp's instructors."],
   hint:"\"Nobody argued… The lake looked genuinely frightening.\" What does this tell you about the decision to cancel?", focus:"\"Nobody argued,\" Minh concedes."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about active holidays?", opts:["They are great for many people, but not for everyone.","Everyone should go on one.","They are too dangerous.","They are only for sporty people who are already fit."],
   hint:"Read paragraph F. The writer asks a question and answers it.", focus:"Is an active holiday right for everyone? Probably not.",
   explain:"The answer is \"They are great for many people, but not for everyone\". The writer says some people need a quiet rest, but an active holiday \"could be the best holiday you ever have\"."},
  {stem:"What is the writer's attitude to active holidays?", opts:["Positive, while accepting that some people prefer to rest","Negative, because of the risk of injury","Neutral: the writer gives no opinion","Critical of people who prefer quiet holidays where they do nothing at all"],
   hint:"Paragraph F: the writer says \"Probably not\" and then \"But…\". What comes after \"But\"?", focus:"it is hard to beat"},
  {stem:"Which statement best reflects the writer's position in paragraph F?", opts:["Active holidays offer a special kind of satisfaction, though a restful holiday is equally valid.","Holidays where you do nothing are a waste of time.","Active holidays are only worthwhile if you master a skill.","Everyone should be willing to be uncomfortable on holiday, because that is the only way to feel real satisfaction."],
   hint:"Paragraph F: the writer says \"there is nothing wrong with\" doing nothing. Watch out for answers that are too strong.", focus:"and there is nothing wrong with that"}]}
];

/* ---------- 4. Japan's hot-spring monkeys ---------- */
const MONKEY_RULES = [
 {label:"don't feed", k:["feed","food","snack","eat"]},
 {label:"don't touch", k:["touch","hand"]},
 {label:"keep your distance", k:["distance","metre","meter","far","away","close","near","space"]},
 {label:"don't stare", k:["stare","eye","look"]}];
const WARM = {ask:"How do the baths help with the cold?", label:"cold winter", k:["cold","snow","winter","freez","temperature"]};
const CALM = {ask:"What do the baths do to the monkeys' stress?", label:"warm / less stress", k:["warm","heat","stress","relax","calm","hot"]};

const MONKEY_LEVELS = [
 { title:"The monkeys who love hot baths", paras:[
  ["A","High in the mountains of Japan, it is minus ten degrees. Snow covers the trees. But in a pool of steaming water, a group of monkeys is sitting with their eyes closed. Snow falls on their heads, but they do not move. They look very relaxed."],
  ["B","These are Japanese macaques, also called snow monkeys. They live in the Jigokudani valley, where hot water comes up from under the ground. Japan has thousands of these hot springs, and people love bathing in them. But these monkeys are the only ones in the world that are famous for having hot baths."],
  ["C","How did it start? In the 1960s, a young monkey jumped into a hot spring near a hotel to get some food. Other young monkeys copied her. Soon the whole group was bathing in winter. A park opened in 1964, and the workers made a special pool for the monkeys."],
  ["D","Why do they do it? In 2018, scientists looked at the monkeys' stress. They found that bathing helps the monkeys stay warm in the cold winter. It also makes them less stressed. So the hot baths are not just fun. They help the monkeys to survive the winter."],
  ["E","Today, many people come to see the monkeys. Sightseeing buses arrive every day, and some people come on a day trip from Tokyo. On snowy days, the path to the pool is full of people with umbrellas. The park has rules for visitors: do not feed the monkeys, do not touch them and stay a few metres away. Visitors also must not stare into the monkeys' eyes, because the monkeys see this as a threat."],
  ["F","Some scientists worry about the crowds, and they monitor the monkeys carefully. But for now, the park shows that coexistence is possible. If visitors follow the rules, people and wild animals can share this special place."]],
  gloss:"macaque: a kind of monkey · threat: something that may be dangerous" },
 { title:"The monkeys who love hot baths", paras:[
  ["A","In the mountains of central Japan, the temperature has dropped to minus ten degrees and the trees are heavy with snow. Yet in a pool of steaming water, a group of monkeys sits perfectly still, eyes half closed, as snowflakes settle on their heads. They look like guests at an expensive spa."],
  ["B","These are Japanese macaques, often called snow monkeys, and they live in the Jigokudani valley, where naturally heated water rises from deep underground. Japan has thousands of these hot springs, and bathing in them is a much-loved tradition. But these macaques are the only monkeys in the world known for taking regular hot baths."],
  ["C","The habit seems to have begun in the 1960s, when a young female climbed into a hot spring near a local hotel to collect some food that had fallen in. Other young monkeys copied her, and within a few years bathing had spread through the group. When a park opened in 1964, staff built a separate pool just for the monkeys, partly to keep them out of the hotel's baths."],
  ["D","For a long time, nobody knew exactly why they did it. Then, in 2018, a team of scientists measured the level of a stress hormone in the monkeys' droppings. They found that bathing not only helped the monkeys to keep warm during the bitterly cold winter, but also lowered their stress. The baths, it seems, are not a luxury but a way of surviving the winter."],
  ["E","Today, the monkeys are a major tourist attraction. Sightseeing coaches arrive every day, and many visitors come on a day trip from Tokyo; on snowy days, the path to the pool becomes a slow river of umbrellas. The park has strict rules: no feeding, no touching, and visitors must keep a distance of a few metres. They are also asked not to stare into the animals' eyes, because the monkeys may see this as a challenge."],
  ["F","Some researchers are concerned that the growing crowds could change the monkeys' behaviour, and they monitor the group closely. For now, however, the valley is a rare example of coexistence. As long as visitors respect the rules, people and wild animals can share it."]],
  gloss:"spa: a place where people relax in warm water · droppings: animal waste" },
 { title:"Bathing in the snow", paras:[
  ["A","Deep in the mountains of central Japan, the temperature has fallen to minus ten degrees and the forest lies buried under snow. Yet in a pool of steaming water, a troop of monkeys sits motionless, eyes half closed, apparently indifferent to the snowflakes gathering on their heads. They could easily be mistaken for guests at a luxury spa."],
  ["B","These are Japanese macaques, popularly known as snow monkeys, and they inhabit the Jigokudani valley, where geothermally heated water rises to the surface. Japan has thousands of such hot springs, and bathing in them is a cherished part of the country's culture. These macaques, however, are the only monkeys in the world known to bathe in them habitually."],
  ["C","The behaviour appears to have originated in the 1960s, when a young female ventured into a hot spring beside a local inn to retrieve food that had fallen into the water. Her younger companions imitated her, and within a few years the practice had spread through the troop, a striking example of how new habits can pass between animals. When a park was established in 1964, staff constructed a separate pool for the monkeys, not least to keep them out of the inn's own baths."],
  ["D","For decades, the reason for the habit was largely a matter of speculation. In 2018, however, researchers measured levels of a stress hormone in the monkeys' droppings and found that, during the harshest winter months, bathing females had noticeably lower levels than those that stayed out. The baths, it seems, are less an indulgence than a survival strategy, helping the animals to conserve body heat and cope with the strain of winter."],
  ["E","Today, the monkeys draw visitors from all over the world. Sightseeing coaches arrive daily, and many tourists make a day trip from Tokyo, trudging up the snowy path beneath a sea of umbrellas. The park enforces strict rules: feeding and touching the animals are forbidden, a distance of a few metres must be maintained, and visitors are advised not to stare into the monkeys' eyes, which the animals may interpret as a challenge."],
  ["F","Some researchers fear that ever-larger crowds could gradually alter the monkeys' natural behaviour, and they monitor the troop closely. For the time being, though, the valley offers a rare and fragile model of coexistence, one that depends entirely on visitors accepting that they are guests in the monkeys' home, and not the other way round."]],
  gloss:"geothermal: heat from inside the Earth · indulgence: something nice you do that you do not need" }
];

const MONKEY_SLOTS = [
 {skill:"Main idea", para:"F", q:[
  {stem:"What is the text mainly about?", opts:["Monkeys in Japan that bathe in hot springs, and the tourists who visit them","How to get to Japan from Tokyo","Why Japanese people like hot springs","How scientists study stress in people who live in cold places"],
   hint:"Read paragraph A and paragraph F again. What does the whole text describe?", focus:"people and wild animals can share this special place",
   explain:"The answer is \"Monkeys in Japan that bathe in hot springs, and the tourists who visit them\". Paragraphs A to D are about the monkeys' baths, and E to F are about visitors."},
  {stem:"What is the text mainly about?", opts:["Why snow monkeys bathe in hot springs, and how people visit them responsibly","The history of hot-spring bathing in Japanese culture","A scientific study about stress hormones","The dangers of tourism for wild animals everywhere, and why some parks should close"],
   hint:"The text covers the monkeys' habit, the reasons for it and the visitors. Which answer includes all of these?", focus:"the valley is a rare example of coexistence"},
  {stem:"Which statement best summarises the article?", opts:["A learned bathing habit helps snow monkeys survive winter and draws tourists, which must be carefully managed.","Tourism is destroying the natural behaviour of Japan's snow monkeys.","Scientists have proved that hot springs reduce stress in all animals, not just in the monkeys of this valley.","Japanese macaques are the most intelligent monkeys in the world."],
   hint:"Your summary needs the habit (C), the reason (D) and the visitors (E to F). Watch out for answers that are too strong.", focus:"offers a rare and fragile model of coexistence"}]},
 {skill:"Detail", para:"C", q:[
  {stem:"When did the park open?", opts:["In 1964","In 1960","In 2018","In 1946"],
   hint:"Look in paragraph C. Find a year.", focus:"A park opened in 1964",
   explain:"The answer is \"in 1964\". Paragraph C says: \"A park opened in 1964.\" 2018 is the year of the science study in paragraph D."},
  {stem:"According to paragraph C, why did the first monkey climb into the hot spring?", opts:["To collect some food that had fallen in","To get warm in the snow","To copy the hotel guests","Because the park staff had built a special pool for the monkeys"],
   hint:"Find \"a young female\" in paragraph C. Read to the end of the sentence.", focus:"to collect some food that had fallen in"},
  {stem:"According to paragraph C, why did staff build a separate pool?", opts:["Partly to keep the monkeys out of the inn's baths","To attract more tourists to the park","To help scientists study the monkeys more closely in winter","Because the hot spring became too crowded"],
   hint:"Find \"separate pool\" in paragraph C. What does \"not least\" introduce?", focus:"not least to keep them out of the inn's own baths"}]},
 {skill:"Vocabulary in context", para:"E", q:[
  {stem:"In paragraph E, a \"threat\" is…", opts:["something that may be dangerous","a kind of food","a friendly sign that an animal wants to play","a park rule that visitors must follow"],
   hint:"Find \"threat\" in paragraph E. Why must visitors not stare at the monkeys?", focus:"because the monkeys see this as a threat",
   explain:"The answer is \"something that may be dangerous\". The monkeys think staring is dangerous, so visitors must not do it."},
  {stem:"In paragraph E, \"strict\" rules are rules that…", opts:["must be followed carefully","are easy to forget","are only for children and school groups","change every day"],
   hint:"Find \"strict\" in paragraph E. Look at the rules after the colon. Are they \"no\" rules or suggestions?", focus:"The park has strict rules: no feeding, no touching"},
  {stem:"In paragraph E, \"enforces\" means…", opts:["makes sure people obey","writes down for the first time","suggests politely","removes"],
   hint:"Find \"enforces\" in paragraph E. The rules include things that \"are forbidden\" and \"must be\" done.", focus:"The park enforces strict rules"}]},
 {skill:"Detail: two points", para:"E", q:[
  {type:"short", stem:"Write two rules for visitors to the park.", groups:MONKEY_RULES, need:2,
   hint:"Look in paragraph E. The rules come after the colon (:).", focus:"do not feed the monkeys, do not touch them and stay a few metres away",
   explain:"Possible answers (any two): do not feed the monkeys; do not touch them; stay a few metres away; do not stare into their eyes."},
  {type:"short", stem:"Give two of the park's rules for visitors.", groups:MONKEY_RULES, need:2,
   hint:"Paragraph E has four rules. Three come after the colon, and one is in the last sentence.", focus:"no feeding, no touching, and visitors must keep a distance of a few metres"},
  {type:"short", stem:"Identify two rules that visitors to the park must follow.", groups:MONKEY_RULES, need:2,
   hint:"Paragraph E: find what is \"forbidden\", what \"must be maintained\" and what visitors are \"advised not to\" do.", focus:"feeding and touching the animals are forbidden, a distance of a few metres must be maintained"}]},
 {skill:"Inference", para:"C", q:[
  {stem:"Why did other young monkeys start bathing?", opts:["They learned it by watching the first monkey.","The park workers taught them how to do it.","They were born knowing how to do it.","The tourists asked them to."],
   hint:"Look in paragraph C. What did the other young monkeys do after the first monkey jumped in?", focus:"Other young monkeys copied her.",
   explain:"The answer is \"They learned it by watching the first monkey\". The text says the other young monkeys \"copied her\", so they learned by watching."},
  {stem:"What can we infer from the way the bathing habit spread?", opts:["Monkeys can learn new habits from each other.","Only young monkeys like hot water.","The hotel wanted monkeys in its baths to attract more guests.","The monkeys in the valley had always bathed in hot springs."],
   hint:"Paragraph C: one monkey did it first, then others copied, then the whole group. What does this tell you about monkeys?", focus:"within a few years bathing had spread through the group"},
  {stem:"What does the phrase \"not least to keep them out of the inn's own baths\" suggest?", opts:["The monkeys had been using the inn's baths, which the inn did not want.","The inn wanted to attract monkeys to its baths.","The monkeys were afraid of the inn's baths.","Visitors complained that the monkeys' pool was too small for so many animals."],
   hint:"Why would anyone need to keep monkeys \"out of\" a bath? Think about what the monkeys had probably been doing.", focus:"not least to keep them out of the inn's own baths"}]},
 {skill:"Cause and effect", para:"D", q:[
  {type:"short", stem:"How do the hot baths help the monkeys? Write one way.", groups:[WARM, CALM], need:1,
   hint:"Look in paragraph D. Find what the scientists found.", focus:"They found that bathing helps the monkeys stay warm in the cold winter. It also makes them less stressed.",
   explain:"Possible answers: the baths keep them warm in the cold winter; the baths make them less stressed."},
  {type:"short", stem:"Explain why the hot baths help the monkeys survive the winter.", groups:[WARM, CALM], need:2,
   hint:"Paragraph D: the scientists found two things. One is about the cold winter and one is about stress.", focus:"bathing not only helped the monkeys to keep warm during the bitterly cold winter, but also lowered their stress"},
  {type:"short", stem:"Explain why the writer calls the baths \"a survival strategy\".", groups:[WARM, CALM], need:2,
   hint:"Paragraph D: what did the bathing females have less of, and what do the baths help them conserve?", focus:"helping the animals to conserve body heat and cope with the strain of winter"}]},
 {skill:"Writer's purpose", para:"A", q:[
  {stem:"Why does the writer start with the monkeys sitting in hot water in the snow?", opts:["To make the reader interested and want to read more.","To explain how hot springs are made.","To tell readers to visit Japan in winter when there is snow.","To show that monkeys do not feel the cold, even when it snows."],
   hint:"Look in paragraph A. Is this a fact list, or a picture the writer paints for the reader?", focus:"They look very relaxed.",
   explain:"The answer is \"To make the reader interested and want to read more\". Monkeys relaxing in hot water while snow falls is a surprising picture, so it makes readers want to know more."},
  {stem:"Why does the writer compare the monkeys to \"guests at an expensive spa\"?", opts:["To create a funny, memorable picture that catches the reader's attention","To suggest that the park is expensive to visit","To explain that the monkeys live in a hotel and use its expensive spa","To criticise tourists who visit spas"],
   hint:"Paragraph A: a spa is a place where people relax. Why compare monkeys to people?", focus:"They look like guests at an expensive spa."},
  {stem:"What is the effect of the comparison at the end of paragraph A?", opts:["It makes the scene surprising and amusing, drawing the reader into the article.","It shows the writer's disapproval of luxury tourism.","It suggests the monkeys are kept in captivity.","It introduces the main argument of the article, which is about overcrowding at the park."],
   hint:"Paragraph A: \"They could easily be mistaken for guests at a luxury spa.\" How does this make a reader feel?", focus:"They could easily be mistaken for guests at a luxury spa."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about people visiting the monkeys?", opts:["It is fine if visitors follow the rules.","Visitors should stop coming.","The monkeys enjoy meeting people and being photographed by them.","Scientists should close the park to protect the monkeys."],
   hint:"Read paragraph F. Find \"If visitors…\".", focus:"If visitors follow the rules, people and wild animals can share this special place.",
   explain:"The answer is \"It is fine if visitors follow the rules\". The writer says coexistence is possible \"if visitors follow the rules\"."},
  {stem:"What is the writer's attitude in paragraph F?", opts:["Cautiously positive: visitors and monkeys can share the valley if rules are respected","Very worried: the monkeys will soon leave the valley because of all the visitors","Critical of the scientists who study the monkeys","Uninterested in the effect of tourism"],
   hint:"Paragraph F has a worry (\"concerned\") and then \"For now, however…\". Which side does the writer end on?", focus:"As long as visitors respect the rules, people and wild animals can share it."},
  {stem:"Which statement best reflects the writer's view in paragraph F?", opts:["Coexistence is possible but fragile, and depends on visitors respecting the animals.","Tourism will inevitably destroy the monkeys' natural behaviour.","The monkeys should be moved somewhere without visitors, where they can live without being watched.","Visitors have every right to interact with the monkeys."],
   hint:"Paragraph F: find \"fragile\" and \"depends entirely on\". Watch out for answers that are too strong.", focus:"one that depends entirely on visitors accepting that they are guests in the monkeys' home"}]}
];

export const UNIT3_TEXTS = [
  { id: "crowds", unitNo: 3, unit: U, topic: "Too many tourists?", blurb: "When does a popular place become too popular?", levels: CROWDS_LEVELS, slots: CROWDS_SLOTS },
  { id: "camping", unitNo: 3, unit: U, topic: "Eco camping weekend", blurb: "Two nights in a national park, without Wi-Fi.", levels: CAMP_LEVELS, slots: CAMP_SLOTS },
  { id: "active", unitNo: 3, unit: U, topic: "Active holidays", blurb: "Why are more families swapping the beach for a sports camp?", levels: ACTIVE_LEVELS, slots: ACTIVE_SLOTS },
  { id: "monkeys", unitNo: 3, unit: U, topic: "Japan's hot-spring monkeys", blurb: "Why do snow monkeys take hot baths, and who comes to watch?", levels: MONKEY_LEVELS, slots: MONKEY_SLOTS }
];
