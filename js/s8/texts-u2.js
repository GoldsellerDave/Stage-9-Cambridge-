// Stage 8 · Unit 2 · Design and architecture: four practice texts.
// Same format as js/texts-u2.js: three levels with the same paragraph letters, eight slots, first MCQ option correct.
const U = "Unit 2 · Design and architecture";

/* ---------- 1. Cool homes in a hot desert ---------- */
const DESERT_COOL = [
 {label:"thick walls", k:["thick","wall","mud","stone","heat in the day","store"]},
 {label:"small windows", k:["small window","few window","window","little light","sun out"]},
 {label:"courtyard / shade", k:["courtyard","shade","shady","garden","fountain","tree"]},
 {label:"wind tower", k:["wind tower","tower","catch","breeze","wind"]},
 {label:"light colours", k:["white","light colour","pale","reflect"]}];
const TOWER_HOW = {ask:"What does the tower catch at the top?", label:"catches the wind / breeze", k:["catch","wind","breeze","air at the top","cool air"]};
const TOWER_WHAT = {ask:"Where does the air go, and what happens to the hot air?", label:"sends cool air down / pushes hot air out", k:["down","into the house","room","push","hot air out","out of the house","rise","escape","up and out","goes up"]};

const DESERT_LEVELS = [
 { title:"Cool homes in a hot desert", paras:[
  ["A","In the desert, the sun is very strong. The average temperature in summer can be more than 40°C in the day. But at night, it can be very cold. For thousands of years, people have lived in deserts without air conditioning. How do their homes stay cool?"],
  ["B","First, look at the walls. Traditional desert houses have very thick walls made of mud or stone. The walls take in the heat slowly during the day, so the rooms stay cool. At night, the walls give the heat back, so the rooms are warm."],
  ["C","Second, the windows are small. Big windows let in a lot of hot sun, so desert houses only have a few small ones. Many houses are also painted white, because white does not get hot like dark colours."],
  ["D","Many houses are built around a courtyard. This is an open space in the middle of the house, with walls on every side. The courtyard is in the shade for most of the day. Families often put plants and a small fountain there. It is a cool place to sit and talk."],
  ["E","Some houses in Iran also have a wind tower. It is a tall tower on the roof. At the top, it catches the wind and sends cool air down into the house. The hot air goes up and out. It works like a fan, but it does not need electricity."],
  ["F","Today, many architects are learning from these old houses. Air conditioning uses a lot of energy. A house with thick walls and a wind tower is more practical, and it is better for the planet. Sometimes the best new ideas are very old ones."]],
  gloss:"courtyard: an open space with walls around it · fountain: water that shoots up into the air" },
 { title:"Cool homes in a hot desert", paras:[
  ["A","In the desert, the sun is fierce. In summer, the average temperature during the day can climb above 40°C, and yet at night it can drop close to freezing. People have lived in places like this for thousands of years without air conditioning, so how did they keep their homes comfortable?"],
  ["B","The first secret is in the walls. Traditional desert houses have extremely thick walls of mud brick or stone. These walls absorb the heat slowly during the day, which keeps the rooms inside cool. Then, at night, they release the stored heat, keeping the family warm."],
  ["C","The second secret is the windows, or rather the lack of them. Large windows would let in too much sunlight, so desert houses usually have just a few small ones, placed high on the walls. Many buildings are also painted white, because light colours reflect the sun instead of absorbing it."],
  ["D","Many homes are built around a courtyard: an open space in the centre of the house, surrounded by walls. Because the walls are high, the courtyard is in the shade for most of the day. Families often add trees and a small fountain, which cool the air even more. It becomes the heart of the home, a pleasant place to relax in the evening."],
  ["E","In parts of Iran, houses also have a wind tower, a tall chimney-like structure on the roof. Its openings at the top catch even a gentle breeze and send the cooler air down into the rooms below, while warm air rises and escapes. It works like a fan, but it uses no electricity at all."],
  ["F","Today, a growing number of architects are studying these traditional designs. Air conditioning uses huge amounts of energy, and that energy often comes from burning coal or gas. A home with thick walls, a courtyard and a wind tower is practical, cheap to run and kinder to the planet. Sometimes the best new ideas turn out to be very old ones."]],
  gloss:"absorb: take in · release: let something go · breeze: a light wind" },
 { title:"Lessons from the desert", paras:[
  ["A","Desert climates are among the most extreme on Earth. Average summer daytime temperatures can exceed 40°C, yet once the sun sets, the temperature may plunge almost to freezing. Remarkably, communities have flourished in such conditions for millennia without any form of mechanical cooling, which raises an obvious question: how did their homes remain habitable?"],
  ["B","Part of the answer lies in the walls. Traditional desert dwellings were built with walls of mud brick or stone up to a metre thick. Such walls absorb heat gradually throughout the day, keeping interiors cool, and then release that stored warmth during the night, precisely when it is needed most."],
  ["C","Windows tell a similar story. Because large windows would admit far too much sunlight, desert homes typically have only a handful of small openings, often set high in the walls. Exterior walls are frequently whitewashed, since pale surfaces reflect solar radiation rather than absorbing it."],
  ["D","Many houses are arranged around a central courtyard, an open-air space enclosed on all sides by the building itself. Thanks to the height of the surrounding walls, the courtyard remains in shade for much of the day, and the trees and fountains that families traditionally add there lower the temperature further. The courtyard thus becomes both a source of cool air and the social heart of the household."],
  ["E","In parts of Iran, the design goes a step further with the wind tower, or badgir, a tall structure rising from the roof. Openings at the top capture even the faintest breeze and channel the cooler air down into the living spaces, while warm air rises and is drawn out. In effect, it is a fan that requires no electricity whatsoever."],
  ["F","It is no coincidence that contemporary architects are now studying these structures closely. Air conditioning consumes vast quantities of energy, much of it still generated from fossil fuels. Buildings that borrow from desert traditions, with their thick walls, shaded courtyards and wind towers, are not merely practical and inexpensive to run; they offer a model of design that works with the climate rather than against it. The most innovative ideas, it seems, are sometimes the oldest."]],
  gloss:"millennia: thousands of years · habitable: good enough to live in · fossil fuels: coal, oil and gas" }
];

const DESERT_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["How old desert houses stay cool without air conditioning","Why the desert is cold at night","How to build a wind tower in Iran","Why many people today want to move to the desert to live"],
   hint:"Read paragraph A again. The text asks a question. The other paragraphs answer it.", focus:"How do their homes stay cool?",
   explain:"The answer is \"How old desert houses stay cool without air conditioning\". Paragraph A asks how desert homes stay cool, and paragraphs B to E give the answers: walls, windows, courtyards and wind towers."},
  {stem:"What is the text mainly about?", opts:["The design ideas that keep traditional desert homes comfortable","The dangers of living in a hot desert climate without water","How air conditioning was invented","Life in modern cities in Iran"],
   hint:"Paragraph A ends with a question. What do the next paragraphs describe?", focus:"so how did they keep their homes comfortable?"},
  {stem:"Which statement best summarises the article?", opts:["Traditional desert buildings use simple design to control heat, and architects today are learning from them.","Air conditioning is now the only practical way to make desert homes comfortable, so the old designs are no longer needed.","Wind towers are the most important part of desert design.","Desert climates are the most extreme on Earth."],
   hint:"A good summary covers both the old designs (B to E) and the point in paragraph F.", focus:"how did their homes remain habitable?"}]},
 {skill:"Detail", para:"B", q:[
  {stem:"What are the walls of traditional desert houses made of?", opts:["Mud or stone","Wood from the trees in the desert","Glass","Metal"],
   hint:"Look in paragraph B. Find the word \"made\".", focus:"Traditional desert houses have very thick walls made of mud or stone.",
   explain:"The answer is \"mud or stone\". Paragraph B says the walls are \"made of mud or stone\"."},
  {stem:"According to paragraph B, what do the walls do at night?", opts:["They release the heat they stored during the day.","They absorb heat from the cold night air.","They let cool air in through small holes.","They stop the rooms from getting too warm when the sun goes down."],
   hint:"Find \"at night\" in paragraph B. What happens to the stored heat?", focus:"they release the stored heat, keeping the family warm"},
  {stem:"According to paragraph B, why are the thick walls useful at night?", opts:["They give back the warmth they took in during the day.","They keep the cold night air from absorbing any heat at all.","They let the house cool down quickly.","They reflect moonlight into the rooms."],
   hint:"Paragraph B: what do the walls do with the heat they absorbed? When is it \"needed most\"?", focus:"release that stored warmth during the night, precisely when it is needed most"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"shade\" means…", opts:["an area where the sun does not shine directly","a kind of plant","a very hot place","a small, dark room at the back of the house"],
   hint:"Find \"shade\" in paragraph D. The courtyard is a cool place. Why?", focus:"The courtyard is in the shade for most of the day.",
   explain:"The answer is \"an area where the sun does not shine directly\". The walls stop the sun, so the courtyard is \"in the shade\" and stays cool."},
  {stem:"In paragraph D, the courtyard is described as \"the heart of the home\". This means it is…", opts:["the most important place where the family spends time","the room in the exact middle of the house where the whole family sleeps","a room for sick people","the oldest part of the house"],
   hint:"Read the last sentence of paragraph D. What do families do there?", focus:"It becomes the heart of the home, a pleasant place to relax in the evening."},
  {stem:"In paragraph D, \"enclosed\" means…", opts:["surrounded","opened","decorated with plants","heated"],
   hint:"Find \"enclosed on all sides by the building\". If a building is on all sides of a space, what is the space?", focus:"an open-air space enclosed on all sides by the building itself"}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two things that keep desert houses cool.", groups:DESERT_COOL, need:2,
   hint:"Look in paragraphs B, C, D and E. Each paragraph gives one idea.", focus:"Big windows let in a lot of hot sun, so desert houses only have a few small ones.",
   explain:"Possible answers (any two): thick walls; small windows; a courtyard in the shade; a wind tower; white walls."},
  {type:"short", stem:"Give two features of desert houses that keep out the sun's heat.", groups:DESERT_COOL, need:2,
   hint:"Paragraph C has two ideas: one about windows and one about colour.", focus:"Many buildings are also painted white, because light colours reflect the sun instead of absorbing it."},
  {type:"short", stem:"Identify two design features that help desert homes control the heat.", groups:DESERT_COOL, need:2,
   hint:"Paragraphs B to E each describe a different feature.", focus:"Exterior walls are frequently whitewashed, since pale surfaces reflect solar radiation rather than absorbing it."}]},
 {skill:"Inference", para:"C", q:[
  {stem:"Why are desert houses often painted white?", opts:["White stays cooler in the sun than dark colours.","White paint is the cheapest colour.","White houses are easier to see at night.","People in the desert think that white is the most beautiful colour."],
   hint:"Look at the end of paragraph C. What does white not do?", focus:"white does not get hot like dark colours",
   explain:"The answer is \"White stays cooler in the sun than dark colours\". Paragraph C says \"white does not get hot like dark colours\"."},
  {stem:"Why are the windows placed high on the walls?", opts:["To keep direct sunlight away from the rooms.","So that people can see the stars at night.","Because the walls are too thick lower down.","So that thieves cannot climb in through the windows at night."],
   hint:"Paragraph C: what is the problem with large windows? Small, high windows let in less of what?", focus:"Large windows would let in too much sunlight"},
  {stem:"What can we infer about why desert homes need so few windows?", opts:["Light is less of a problem than heat in the desert.","Glass was unknown in the desert.","Families preferred to live in the dark.","Small windows were thought to look more beautiful than large ones."],
   hint:"Paragraph C: windows \"admit far too much sunlight\". In a desert, what does strong sunlight bring?", focus:"large windows would admit far too much sunlight"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"How does a wind tower cool a house? Write two steps.", groups:[TOWER_HOW,TOWER_WHAT], need:2,
   hint:"Look in paragraph E. What happens at the top of the tower, and where does the air go?", focus:"At the top, it catches the wind and sends cool air down into the house.",
   explain:"Possible answers: it catches the wind at the top; it sends the cool air down into the house; the hot air goes up and out."},
  {type:"short", stem:"Explain how a wind tower cools the rooms below it.", groups:[TOWER_HOW,TOWER_WHAT], need:2,
   hint:"Paragraph E: what do the openings at the top do, and where does the warm air go?", focus:"Its openings at the top catch even a gentle breeze and send the cooler air down into the rooms below"},
  {type:"short", stem:"Explain how the badgir lowers the temperature inside a house.", groups:[TOWER_HOW,TOWER_WHAT], need:2,
   hint:"Paragraph E: describe what happens to the cool air and to the warm air.", focus:"capture even the faintest breeze and channel the cooler air down into the living spaces"}]},
 {skill:"Writer's purpose", para:"F", q:[
  {stem:"Why does the writer talk about air conditioning in paragraph F?", opts:["To show that the old designs save energy.","To tell readers to buy air conditioning.","To explain how air conditioning was invented.","To show that deserts are too hot for people."],
   hint:"Paragraph F: what does air conditioning use a lot of? What is better about the old houses?", focus:"Air conditioning uses a lot of energy.",
   explain:"The answer is \"To show that the old designs save energy\". Air conditioning uses a lot of energy, but a house with thick walls and a wind tower doesn't need it."},
  {stem:"Why does the writer mention coal and gas in paragraph F?", opts:["To show that air conditioning can harm the planet.","To explain how desert houses were heated.","To compare the price of coal and gas.","To describe the building materials that are used in new houses today."],
   hint:"Paragraph F: where does the energy for air conditioning come from? Why is that a problem?", focus:"that energy often comes from burning coal or gas"},
  {stem:"What is the main function of paragraph F?", opts:["It links the traditional designs to a modern problem.","It describes one more traditional feature.","It argues that air conditioning should be banned in deserts.","It explains how wind towers were invented."],
   hint:"Paragraphs B to E describe the old designs. What does F add about today?", focus:"It is no coincidence that contemporary architects are now studying these structures closely."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about traditional desert houses?", opts:["They are a good example for architects today.","They are too old to be useful now.","They are too expensive to build.","They are less comfortable than modern houses."],
   hint:"Read the last sentence of paragraph F.", focus:"Sometimes the best new ideas are very old ones.",
   explain:"The answer is \"They are a good example for architects today\". The writer says \"Sometimes the best new ideas are very old ones.\""},
  {stem:"What is the writer's attitude to traditional desert design?", opts:["Admiring: it is clever and still useful.","Critical: it is out of date.","Neutral: it is neither good nor bad.","Worried: it is disappearing fast and will soon be forgotten."],
   hint:"Paragraph F: which positive words does the writer use about these homes?", focus:"is practical, cheap to run and kinder to the planet"},
  {stem:"Which statement best reflects the writer's view in paragraph F?", opts:["Old desert designs offer a model for building with the climate, not against it.","Modern buildings should copy every feature of desert homes exactly.","Air conditioning will soon disappear completely from desert cities.","Desert traditions are interesting to study but have no practical value for architects today."],
   hint:"Paragraph F: what kind of \"model of design\" do these buildings offer? Avoid answers that go too far.", focus:"they offer a model of design that works with the climate rather than against it"}]}
];

/* ---------- 2. Houses that float ---------- */
const FLOAT_HOW = [
 {label:"the base is like a raft / floats", k:["raft","float","base","platform","plastic","barrel","empty","drum"]},
 {label:"poles keep it in place", k:["pole","post","guide","slide","stay in place","don't float away","float away"]},
 {label:"it rises with the water", k:["rise","rises","go up","goes up","lift","higher"]}];
const FLOAT_GOOD = [
 {label:"families stay at home / safe", k:["stay","safe","home","don't leave","not leave","sleep"]},
 {label:"cheap / local materials", k:["cheap","bamboo","local","cost","money","afford"]},
 {label:"things stay dry", k:["dry","rice","belongings","things","furniture","not damaged"]}];

const FLOAT_LEVELS = [
 { title:"Houses that float", paras:[
  ["A","Every year, in the rainy season, the Mekong River gets bigger. The water covers fields and roads. In some villages, it comes into people's homes. Families have to move their things and sometimes leave their houses for weeks."],
  ["B","Building a higher house is one answer. Many traditional houses in the Mekong Delta stand on tall wooden legs. But floods are getting worse, and sometimes the water is higher than the legs. So some architects have a new idea: houses that float."],
  ["C","A floating house looks like a normal house. It has a living room, a kitchen and a small balcony. But under the floor there is a big base, like a raft. It is made of empty plastic barrels. When the water is low, the house sits on the ground."],
  ["D","When the water comes, the house goes up with it. Four tall poles stand next to the house. The house can move up and down the poles, but it cannot float away. When the flood ends, the house comes down again."],
  ["E","The first floating houses in the Mekong Delta were built in 2019. They are made of bamboo and other local materials, so they are cheap. Families can stay at home during the flood, and their rice and furniture stay dry."],
  ["F","Floating houses are not the answer to every problem. Families still need boats to go to school and to the market. But the idea is simple and practical. In a world with more floods, more people may live in homes like these."]],
  gloss:"raft: a flat boat made of things tied together · barrel: a big round container" },
 { title:"Houses that float", paras:[
  ["A","Every rainy season, the Mekong River swells and spills over its banks. Fields and roads disappear under brown water, and in some villages it rises into people's living rooms. Families must carry their belongings to safety, and some have to leave their homes for weeks."],
  ["B","One traditional answer is to build higher. Many homes in the Mekong Delta stand on tall wooden stilts. However, floods are becoming more severe, and in some years the water climbs above the stilts. That is why a few architects are trying something different: houses that float."],
  ["C","From the outside, a floating house looks quite ordinary, with a living room, a kitchen and a small balcony. The clever part is hidden underneath. Below the floor is a large base that works like a raft, made of empty plastic barrels tied together. When the water is low, the house simply rests on the ground."],
  ["D","As the floodwater rises, the base lifts the whole house with it. Four tall poles stand at the corners of the house, and the house slides up and down them, so it can rise and fall without drifting away. When the flood is over, it settles gently back on the ground."],
  ["E","The first floating homes in the Mekong Delta were completed in 2019. Because they use bamboo and other local materials, they cost far less than a concrete house. During a flood, families can stay at home, and their rice, furniture and school books stay dry."],
  ["F","Of course, floating houses do not solve every problem: children still need a boat to get to school, and farmers still lose their crops. But the idea is simple, practical and affordable. As the climate changes and floods become more frequent, homes like these may become a familiar part of the landscape."]],
  gloss:"stilts: tall posts that hold a house above the ground · drift: move slowly on water" },
 { title:"Rising with the river", paras:[
  ["A","Each rainy season, the Mekong swells beyond its banks. Fields and roads vanish beneath the floodwater, which in low-lying villages can rise into homes themselves. Families are forced to move their belongings to safety, and some must abandon their houses for weeks at a time."],
  ["B","The conventional response has been to build upwards: many homes in the Mekong Delta stand on tall timber stilts. Yet floods are growing more severe, and in some years the water now overtops even these. This has prompted a handful of architects to explore a more radical alternative: houses that float."],
  ["C","Outwardly, a floating house is unremarkable, complete with a living room, a kitchen and a modest balcony. Its ingenuity lies beneath the floor, where a buoyant base of empty plastic barrels, lashed together like a raft, supports the entire structure. During the dry months, the house simply rests on the ground like any other."],
  ["D","When the floodwater arrives, however, the base lifts the house as the level rises. Four vertical poles, fixed at the corners, act as guides: the house slides up and down them, rising and falling with the water while being prevented from drifting away. Once the flood recedes, it settles back onto solid ground."],
  ["E","The first floating homes in the delta were completed in 2019. Constructed largely from bamboo and other locally sourced materials, they cost a fraction of a conventional concrete house. During a flood, families are able to remain at home, and their rice, furniture and school books stay dry."],
  ["F","Floating houses are no cure-all: children still require a boat to reach school, and farmers' crops remain at the mercy of the water. Nonetheless, the concept is simple, practical and, crucially, affordable. As a changing climate makes flooding more frequent, such homes may well become a familiar feature of the landscape."]],
  gloss:"ingenuity: clever, new thinking · buoyant: able to float · recede: go back down" }
];

const FLOAT_SLOTS = [
 {skill:"Main idea", para:"B", q:[
  {stem:"What is the text mainly about?", opts:["A new kind of house that helps families during floods","Why the Mekong River is getting bigger","How to build a raft","Why families in the Mekong Delta leave their homes every year"],
   hint:"Read paragraphs B and F. What is the \"new idea\"?", focus:"So some architects have a new idea: houses that float.",
   explain:"The answer is \"A new kind of house that helps families during floods\". The text explains how floating houses work (C and D) and why they help (E)."},
  {stem:"What is the main topic of the text?", opts:["How floating houses could help people live with floods","The history of traditional houses on stilts","Why concrete houses are expensive","How the climate is changing in Viet Nam and the rest of Asia"],
   hint:"Paragraph B ends with an idea. The rest of the text explains it.", focus:"a few architects are trying something different: houses that float"},
  {stem:"Which statement best summarises the article?", opts:["Floating homes offer an affordable way to cope with worsening floods, though they don't solve every problem.","Floating homes will soon replace all traditional houses in the Mekong Delta, because they solve every problem that floods cause.","Traditional stilt houses are the best answer to flooding.","Plastic barrels are the most important invention for the delta."],
   hint:"A good summary includes what the houses do and the limits in paragraph F. Avoid answers that are too strong.", focus:"This has prompted a handful of architects to explore a more radical alternative"}]},
 {skill:"Detail", para:"E", q:[
  {stem:"When were the first floating houses in the Mekong Delta built?", opts:["In 2019","In 2009","Every rainy season","After the last flood"],
   hint:"Look in paragraph E. Find a year.", focus:"The first floating houses in the Mekong Delta were built in 2019.",
   explain:"The answer is \"in 2019\". Paragraph E says \"The first floating houses in the Mekong Delta were built in 2019.\""},
  {stem:"According to paragraph E, why are floating houses cheap?", opts:["They use bamboo and other local materials.","The government pays for them.","They are smaller than normal houses.","They are made of concrete, which is cheaper than wood."],
   hint:"Find \"cost\" in paragraph E. Read the start of that sentence.", focus:"Because they use bamboo and other local materials, they cost far less than a concrete house."},
  {stem:"According to paragraph E, how do floating homes compare with concrete houses?", opts:["They cost much less.","They last much longer.","They are much bigger.","They take longer to build."],
   hint:"Paragraph E: \"a fraction of\" means a small part of.", focus:"they cost a fraction of a conventional concrete house"}]},
 {skill:"Vocabulary in context", para:"F", q:[
  {stem:"In paragraph F, \"practical\" means…", opts:["useful in real life","very beautiful","very expensive","difficult to understand"],
   hint:"Find \"practical\" in paragraph F. The idea is simple. Does it work well?", focus:"But the idea is simple and practical.",
   explain:"The answer is \"useful in real life\". The writer says the idea is simple and works well for real families."},
  {stem:"In paragraph F, \"affordable\" means…", opts:["cheap enough for people to buy","easy to carry","safe in a storm","popular with tourists who visit the delta"],
   hint:"Find \"affordable\" in paragraph F. Look back at paragraph E: what did it say about the cost?", focus:"But the idea is simple, practical and affordable."},
  {stem:"In paragraph F, a \"cure-all\" is…", opts:["one solution to every problem","a kind of medicine for floods","a boat for children","a crop that survives floods"],
   hint:"Read the rest of the sentence after the colon. What problems are still left?", focus:"Floating houses are no cure-all"}]},
 {skill:"Detail: two points", para:"D", q:[
  {type:"short", stem:"Write two facts about how a floating house works.", groups:FLOAT_HOW, need:2,
   hint:"Look in paragraphs C and D. What is under the floor? What stands next to the house?", focus:"The house can move up and down the poles, but it cannot float away.",
   explain:"Possible answers (any two): the base is like a raft; the poles keep it in place; it goes up with the water."},
  {type:"short", stem:"Explain two ways the design keeps the house safe in a flood.", groups:FLOAT_HOW, need:2,
   hint:"Paragraph C describes the base. Paragraph D describes the poles.", focus:"the house slides up and down them, so it can rise and fall without drifting away"},
  {type:"short", stem:"Identify two features that allow the house to cope with rising water.", groups:FLOAT_HOW, need:2,
   hint:"Paragraphs C and D: the buoyant base and the vertical poles.", focus:"Four vertical poles, fixed at the corners, act as guides"}]},
 {skill:"Inference", para:"B", q:[
  {stem:"Why do some architects want houses that float?", opts:["Because the water is sometimes higher than the legs of old houses","Because floating houses are more beautiful","Because people want to live on boats","Because wood for the tall legs of houses is too expensive now"],
   hint:"Look in paragraph B. What is the problem with houses on legs?", focus:"sometimes the water is higher than the legs",
   explain:"The answer is \"Because the water is sometimes higher than the legs of old houses\". Floods are getting worse, so tall legs are not always enough."},
  {stem:"What can we infer about houses on stilts from paragraph B?", opts:["They are not always high enough any more.","They will float if the water rises.","They are a new invention.","They are only built in cities, not in the countryside."],
   hint:"Paragraph B: what happens \"in some years\"?", focus:"in some years the water climbs above the stilts"},
  {stem:"What does the phrase \"a more radical alternative\" suggest about floating houses?", opts:["They are a very different solution from the usual one.","They are more dangerous than stilt houses.","They are the oldest kind of house in the delta.","They have already replaced most of the stilt houses in the delta."],
   hint:"Paragraph B: what is the \"conventional response\"? How is a floating house different?", focus:"to explore a more radical alternative"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"Write two good things that happen for families during a flood.", groups:FLOAT_GOOD, need:2,
   hint:"Look at the end of paragraph E.", focus:"Families can stay at home during the flood, and their rice and furniture stay dry.",
   explain:"Possible answers (any two): families can stay at home; their rice and furniture stay dry; the houses are cheap."},
  {type:"short", stem:"Give two benefits of floating homes for families.", groups:FLOAT_GOOD, need:2,
   hint:"Paragraph E has a benefit about cost and two about what happens in a flood.", focus:"During a flood, families can stay at home, and their rice, furniture and school books stay dry."},
  {type:"short", stem:"Identify two advantages of floating homes mentioned in paragraph E.", groups:FLOAT_GOOD, need:2,
   hint:"Paragraph E: think about cost, and about what families can do during a flood.", focus:"they cost a fraction of a conventional concrete house"}]},
 {skill:"Writer's purpose", para:"F", q:[
  {stem:"Why does the writer say families still need boats?", opts:["To show that floating houses do not solve every problem","To tell readers to buy a boat","To explain how the houses float","To describe the market where families buy food in the rainy season"],
   hint:"Read the first two sentences of paragraph F.", focus:"Floating houses are not the answer to every problem.",
   explain:"The answer is \"To show that floating houses do not solve every problem\". The writer gives this as a problem that is still there."},
  {stem:"Why does the writer mention children's journeys to school in paragraph F?", opts:["To give an example of a problem that remains","To compare schools in the city and the countryside","To explain why children like boats","To show that schools close during floods"],
   hint:"Paragraph F begins with \"Of course\". What is the writer admitting?", focus:"children still need a boat to get to school"},
  {stem:"Why does the writer include the limitations in paragraph F?", opts:["To give a balanced view before stating the idea's strengths","To argue that the houses are a failure","To introduce a different solution","To explain why farmers dislike the houses and refuse to live in them"],
   hint:"Paragraph F: what comes after \"Nonetheless\"?", focus:"Nonetheless, the concept is simple, practical and, crucially, affordable."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about floating houses?", opts:["They are a good idea, and more people may live in them.","They are too expensive.","They are dangerous.","They will stop the floods from coming every year to the villages."],
   hint:"Read the last sentence of paragraph F.", focus:"In a world with more floods, more people may live in homes like these.",
   explain:"The answer is \"They are a good idea, and more people may live in them.\" The writer calls the idea simple and practical."},
  {stem:"What is the writer's opinion of floating houses?", opts:["Positive, but realistic about their limits","Very negative","Completely uncertain","Only interested in the history of the houses, not their future"],
   hint:"Paragraph F has a limitation and then three positive words.", focus:"But the idea is simple, practical and affordable."},
  {stem:"Which word best describes the writer's conclusion?", opts:["Cautiously hopeful","Strongly critical","Entirely uninterested","Openly amused"],
   hint:"Paragraph F: \"may well become a familiar feature\". Is that certain? Is it positive?", focus:"such homes may well become a familiar feature of the landscape"}]}
];

/* ---------- 3. A forest in the sky ---------- */
const GREEN_GOOD = [
 {label:"cleaner air", k:["clean","air","dust","pollution","oxygen"]},
 {label:"cooler", k:["cool","shade","temperature","heat","hot"]},
 {label:"quieter", k:["quiet","noise","sound"]},
 {label:"birds / insects / wildlife", k:["bird","insect","butterfl","bee","wildlife","animal"]}];
const GREEN_COST = {ask:"Why is it expensive?", label:"expensive to look after", k:["expensive","cost","money","gardener","maintenance","look after","crane","care"]};
const GREEN_WEIGHT = {ask:"What problem do the trees cause for the building?", label:"heavy / strong building", k:["heavy","weight","strong","concrete","steel","wind"]};

const GREEN_LEVELS = [
 { title:"A forest in the sky", paras:[
  ["A","Imagine a tall apartment block in a big city. Now imagine trees on every balcony, from the first floor to the top. This is not a dream. Towers like this are now being built in cities in Europe and Asia."],
  ["B","The idea is simple. Cities are getting bigger, and there is not much space for parks. So why not put the park on the building? One tower can have more than 800 trees and thousands of plants. That is like a small forest, but it stands up instead of lying flat."],
  ["C","The plants help the people who live there in many ways. They clean the air, because they catch dust from the traffic. In summer, they give shade, so the flats stay cooler. They also make the flats quieter, because leaves stop some of the noise from the street."],
  ["D","The plants help nature too. Birds and insects come to live in the trees. In one tower, scientists found more than twenty kinds of birds. People in the flats say they can hear birds singing in the morning, in the middle of the city."],
  ["E","But these towers are not easy to build. Trees and soil are very heavy, so the building must be very strong. Gardeners must also look after the plants. They climb down the outside of the tower on ropes to cut the branches. All of this costs a lot of money."],
  ["F","So are green towers the future? Some people say they are too expensive, and only rich people can live in them. Others say they show respect for nature, and every new building should have some plants. What do you think?"]],
  gloss:"soil: the earth that plants grow in · branch: part of a tree that grows out from the trunk" },
 { title:"A forest in the sky", paras:[
  ["A","Picture a tall apartment block in the middle of a busy city. Now picture trees growing from every balcony, all the way from the first floor to the penthouse. This is no longer just an architect's dream: towers like this have already been built in several cities in Europe and Asia."],
  ["B","The thinking behind them is simple. As cities grow, there is less and less space for parks, so why not grow the park upwards instead of outwards? A single tower can hold more than 800 trees and thousands of smaller plants, the same amount of greenery as a small forest, only standing on its end."],
  ["C","For the people who live inside, the plants bring several benefits. They filter the air, catching dust and pollution from the traffic below. In summer, the leaves provide shade, which keeps the flats noticeably cooler. They also act as a barrier against noise, so the flats are quieter than ordinary city homes."],
  ["D","Nature benefits too. Birds, bees and butterflies soon move into the trees. In one tower, scientists counted more than twenty species of birds. Residents say they wake up to birdsong in the morning, even though they live in the centre of a large city."],
  ["E","However, these towers are not easy to build or to run. Trees and soil are extremely heavy, so the structure needs extra steel and concrete. The plants also need constant care. Specially trained gardeners abseil down the facade on ropes to prune the branches. All of this makes the flats expensive."],
  ["F","Are green towers the future of city life, then? Critics argue that they are simply luxury homes for the rich, painted green. Supporters reply that they show real respect for nature, and that even if not every building can be a forest, every new building could include more plants. The debate is likely to continue for some time."]],
  gloss:"filter: clean by catching dirt · abseil: go down a wall on a rope · prune: cut off parts of a plant" },
 { title:"Vertical forests", paras:[
  ["A","Picture a high-rise apartment block in the heart of a congested city, then picture trees sprouting from every balcony, from the first floor right up to the penthouse. Far from being a fantasy, such buildings now exist in several cities in Europe and Asia, and their architects describe them as \"vertical forests\"."],
  ["B","The rationale is straightforward. As urban populations expand, land for parks becomes ever scarcer; the vertical forest responds by growing greenery upwards rather than outwards. A single tower can support more than 800 trees and several thousand shrubs and plants, roughly the equivalent of a hectare of woodland stood on its end."],
  ["C","For residents, the advantages are considerable. The vegetation filters the air, trapping dust and particles from the traffic below. In summer, the canopy shades the facade and measurably lowers indoor temperatures, while the dense foliage serves as a buffer against street noise, making the flats markedly quieter than conventional city apartments."],
  ["D","The benefits extend beyond the human occupants. Birds, bees and butterflies colonise the planting with surprising speed: in one tower, researchers recorded more than twenty bird species. Residents report waking to birdsong despite living in the centre of a major city."],
  ["E","Such projects, however, are neither simple to build nor cheap to maintain. Trees and soil are extraordinarily heavy, demanding additional steel and reinforced concrete. The planting requires constant attention, and specialist gardeners must abseil down the facade to prune the branches. These costs are inevitably passed on, which makes the apartments expensive."],
  ["F","Do vertical forests, then, represent the future of urban living? Critics dismiss them as luxury flats for the wealthy, given a fashionable green coat of paint. Their defenders counter that the towers embody a genuine respect for nature, and that, while not every building can become a forest, every new one could incorporate far more greenery than it does. The argument shows little sign of being settled."]],
  gloss:"rationale: the reasons for something · canopy: the top layer of leaves · colonise: move in and live in a new place" }
];

const GREEN_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["Tall city buildings that have trees on them","How to grow trees at home","Why birds like cities","How tall apartment blocks are built in big cities in Asia"],
   hint:"Read paragraph A. What do you imagine?", focus:"Now imagine trees on every balcony, from the first floor to the top.",
   explain:"The answer is \"Tall city buildings that have trees on them\". Every paragraph is about these green towers: why they are built, what is good about them and what the problems are."},
  {stem:"What is the main topic of the text?", opts:["Green towers in cities: their benefits and their problems","The life of birds in Europe and Asia","The work of gardeners who climb buildings","Why cities have fewer parks and gardens than they had before"],
   hint:"Look at C and D (good things) and E (problems). What do they all talk about?", focus:"towers like this have already been built in several cities in Europe and Asia"},
  {stem:"Which statement best summarises the article?", opts:["Vertical forests bring real benefits to people and wildlife, but their cost makes them controversial.","Vertical forests are a fashionable but useless idea.","Every new building will soon be a vertical forest.","Vertical forests are built mainly to give birds a safe place to live in cities, not for the people inside."],
   hint:"The summary needs the benefits (C, D), the problems (E) and the debate (F).", focus:"their architects describe them as \"vertical forests\""}]},
 {skill:"Detail", para:"B", q:[
  {stem:"How many trees can one tower have?", opts:["More than 800","About 20","Thousands","Exactly 100 trees"],
   hint:"Look in paragraph B. Find a number with \"trees\".", focus:"One tower can have more than 800 trees and thousands of plants.",
   explain:"The answer is \"more than 800\". Paragraph B says \"One tower can have more than 800 trees\". Thousands is the number of plants, not trees."},
  {stem:"According to paragraph B, why are these towers being built?", opts:["Cities have less space for parks.","People want to live higher up.","Trees are cheaper than walls.","Forests are disappearing in the countryside."],
   hint:"Find \"As cities grow\" in paragraph B.", focus:"As cities grow, there is less and less space for parks"},
  {stem:"According to paragraph B, what is the amount of greenery on one tower compared to?", opts:["About a hectare of woodland","A large city park","A single garden","Twenty small forests in the city"],
   hint:"Paragraph B: find \"equivalent of\".", focus:"roughly the equivalent of a hectare of woodland stood on its end"}]},
 {skill:"Vocabulary in context", para:"C", q:[
  {stem:"In paragraph C, \"shade\" means…", opts:["protection from the sun","a kind of tree","fresh air","a cold wind from the street"],
   hint:"Find \"shade\" in paragraph C. Why do the flats stay cooler?", focus:"In summer, they give shade, so the flats stay cooler.",
   explain:"The answer is \"protection from the sun\". The leaves stop the sun, so the flats stay cooler."},
  {stem:"In paragraph C, \"barrier\" means…", opts:["something that stops something else from passing","a kind of window","a loud sound","a place to sit outside on the balcony"],
   hint:"Find \"barrier against noise\". What happens to the noise?", focus:"They also act as a barrier against noise"},
  {stem:"In paragraph C, the foliage is \"a buffer against street noise\". A buffer…", opts:["reduces the effect of something","makes something louder","measures something","attracts something, such as birds or insects"],
   hint:"Read to the end of the sentence. Are the flats louder or quieter?", focus:"the dense foliage serves as a buffer against street noise"}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two ways the plants help the people in the flats.", groups:GREEN_GOOD, need:2,
   hint:"Look in paragraph C. There are three ways.", focus:"They clean the air, because they catch dust from the traffic.",
   explain:"Possible answers (any two): they clean the air; they keep the flats cooler; they make the flats quieter."},
  {type:"short", stem:"Give two benefits of the plants for the residents.", groups:GREEN_GOOD, need:2,
   hint:"Paragraph C lists the benefits for the people inside.", focus:"They filter the air, catching dust and pollution from the traffic below."},
  {type:"short", stem:"Identify two advantages of vertical forests for their residents.", groups:GREEN_GOOD, need:2,
   hint:"Paragraph C: air, temperature and noise.", focus:"The vegetation filters the air, trapping dust and particles from the traffic below."}]},
 {skill:"Inference", para:"D", q:[
  {stem:"Why are people surprised to hear birds in the morning?", opts:["Because they live in the middle of a big city","Because birds don't sing in the morning","Because they live on the first floor","Because the birds are very quiet and usually sing only at night"],
   hint:"Look at the end of paragraph D.", focus:"in the middle of the city",
   explain:"The answer is \"Because they live in the middle of a big city\". You don't usually hear many birds in a city centre."},
  {stem:"What can we infer from paragraph D?", opts:["The towers attract wildlife that is unusual in city centres.","Scientists brought the birds to the tower.","The birds make too much noise for residents.","Only one kind of bird lives in the tower, and it is very rare in Europe."],
   hint:"Paragraph D: \"even though they live in the centre of a large city\". What does \"even though\" tell you?", focus:"even though they live in the centre of a large city"},
  {stem:"What does \"with surprising speed\" suggest about the wildlife?", opts:["Animals quickly saw the tower as a good place to live.","The animals left the tower quickly.","Researchers expected more birds than they found.","The birds only visited the tower in winter, when it was warmer than the park."],
   hint:"Paragraph D: \"colonise\" means move in and live. If this happens fast, what does it show?", focus:"Birds, bees and butterflies colonise the planting with surprising speed"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"Write two problems with building a green tower.", groups:[GREEN_WEIGHT,GREEN_COST], need:2,
   hint:"Look in paragraph E. One problem is about weight. One is about money.", focus:"Trees and soil are very heavy, so the building must be very strong.",
   explain:"Possible answers: trees and soil are very heavy, so the building must be strong; the plants need gardeners, so it costs a lot of money."},
  {type:"short", stem:"Explain two reasons why green towers are difficult to build or run.", groups:[GREEN_WEIGHT,GREEN_COST], need:2,
   hint:"Paragraph E: what do the trees and soil need? What do the plants need?", focus:"Trees and soil are extremely heavy, so the structure needs extra steel and concrete."},
  {type:"short", stem:"Explain two challenges that vertical forests create.", groups:[GREEN_WEIGHT,GREEN_COST], need:2,
   hint:"Paragraph E: think about the weight and about the care the plants need.", focus:"Trees and soil are extraordinarily heavy, demanding additional steel and reinforced concrete."}]},
 {skill:"Writer's purpose", para:"E", q:[
  {stem:"Why does the writer talk about gardeners on ropes?", opts:["To show that the plants need a lot of work","To make the text funny","To tell readers to become gardeners","To show how tall trees can grow on a high building"],
   hint:"Look in paragraph E. Is this a good thing or a problem?", focus:"They climb down the outside of the tower on ropes to cut the branches.",
   explain:"The answer is \"To show that the plants need a lot of work\". Paragraph E is about the problems, and the gardeners are an example of the care the plants need."},
  {stem:"What is the purpose of paragraph E?", opts:["To describe the difficulties of green towers","To explain how to prune a tree","To give more benefits of the towers","To compare green towers with the parks in the city centre"],
   hint:"Paragraph E starts with \"However\". What does that tell you?", focus:"However, these towers are not easy to build or to run."},
  {stem:"How does paragraph E change the direction of the article?", opts:["It moves from the advantages to the practical drawbacks.","It introduces the history of the idea.","It gives scientific evidence about birds.","It presents the writer's final opinion about whether the towers are worth the cost."],
   hint:"Compare C and D with E. Look at the first word of E.", focus:"Such projects, however, are neither simple to build nor cheap to maintain."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer do at the end of the text?", opts:["Gives two opinions and asks the reader what they think","Says green towers are the best idea","Says green towers are a bad idea because they cost a lot of money","Tells the reader to plant a tree"],
   hint:"Read paragraph F. What do some people say? What do others say?", focus:"What do you think?",
   explain:"The answer is \"Gives two opinions and asks the reader what they think\". The writer gives both sides and ends with a question."},
  {stem:"How does the writer present the debate in paragraph F?", opts:["Fairly, giving both sides","Only from the critics' side","Only from the supporters' side","As a debate that is already finished"],
   hint:"Paragraph F: \"Critics argue…\" and \"Supporters reply…\". Does the writer choose?", focus:"The debate is likely to continue for some time."},
  {stem:"Which statement best describes the writer's stance in paragraph F?", opts:["Balanced: both sides are presented and the issue is left open.","Strongly in favour of vertical forests.","Dismissive of the critics.","Convinced that vertical forests are only luxury flats for the rich, as the critics say."],
   hint:"Look at the last sentence of F: is the argument settled?", focus:"The argument shows little sign of being settled."}]}
];

/* ---------- 4. Nature's favourite shapes ---------- */
const HEX_WHY = [
 {label:"uses little wax / material", k:["wax","less","little","material","save"]},
 {label:"no gaps / fit together", k:["gap","space","fit","together","no holes","tile"]},
 {label:"strong", k:["strong","strength"]}];
const DOME_GOOD = [
 {label:"strong / no columns", k:["strong","column","pillar","support","no posts"]},
 {label:"less material", k:["material","less","few","cheap","light"]},
 {label:"resists wind / storms", k:["wind","storm","resist","snow","earthquake"]}];

const SHAPE_LEVELS = [
 { title:"Nature's favourite shapes", paras:[
  ["A","Look closely at a honeycomb. It is made of hundreds of small cells, and every cell has six sides. Bees are not mathematicians, but they build in hexagonal shapes. Why? And what can architects learn from them?"],
  ["B","Bees make their cells from wax, and wax is difficult to make. Bees must eat a lot of honey to make a little wax. So they need a shape that uses very little wax. Circles leave gaps between them. Hexagons fit together with no gaps, and they use less wax than squares or triangles."],
  ["C","Hexagons are also strong. When many hexagons are side by side, the weight spreads out over all of them. That is why engineers use hexagonal shapes inside aeroplane wings and in some kinds of strong, light building materials."],
  ["D","Another favourite shape in nature is the curved dome. Think of an egg or a turtle's shell. If you hold an egg in your hand and squeeze it from both ends, it is hard to break. The curved shape sends the force all around the shell."],
  ["E","Architects have used domes for thousands of years. A dome is half of a ball, called a hemisphere. Because it is strong, it can cover a big space without columns in the middle. Domes also use less material than flat roofs, and they are good in strong winds, because the wind moves around them."],
  ["F","So next time you see a beehive or an egg, look again. Nature has been testing designs for millions of years. The shapes that work best are often the simplest ones, and the best designers are the ones who notice them."]],
  gloss:"cell: one small space in a honeycomb · wax: the soft material bees make · squeeze: press hard" },
 { title:"Nature's favourite shapes", paras:[
  ["A","Take a close look at a honeycomb and you will see hundreds of tiny cells, each one with exactly six sides. Bees obviously know nothing about mathematics, and yet they build in perfect hexagonal patterns. Why do they do this, and what can human designers learn from them?"],
  ["B","Bees build their cells out of wax, which is costly for them to produce: a bee must eat several grams of honey to make just one gram of wax. They therefore need a shape that stores the most honey with the least wax. Circles leave wasted gaps between them, while hexagons fit together perfectly and use less wax than squares or triangles."],
  ["C","Hexagons are also remarkably strong. When they are joined side by side, any weight is spread across the whole structure. This is why engineers put hexagonal patterns inside aeroplane wings and in some building materials that need to be both strong and light."],
  ["D","Another shape that nature loves is the curve. Think of an egg or the shell of a turtle. If you hold an egg in your hand and squeeze it from both ends, it is surprisingly difficult to break, because the curved shell spreads the force all the way around."],
  ["E","Architects have been building domes for thousands of years. A dome is basically a hemisphere, half of a ball. Because of its strength, it can cover a huge space without columns in the middle. Domes also need less material than flat roofs, and they are good in storms, since the wind flows around them instead of pushing against a flat wall."],
  ["F","So the next time you see a beehive or crack an egg, take a second look. Nature has been testing designs for millions of years, and the shapes that survive are often the simplest and most efficient. Perhaps the best designers are simply the ones who pay attention."]],
  gloss:"costly: needing a lot of money or effort · force: power that pushes or pulls" },
 { title:"Borrowed from nature", paras:[
  ["A","Examine a honeycomb closely and you will find hundreds of tiny cells, each with precisely six sides. Bees, needless to say, have no grasp of geometry, yet they construct flawless hexagonal arrays. Why should this be, and what might human designers learn from it?"],
  ["B","The answer begins with the cost of materials. Bees build their cells from wax, which is expensive for them to produce: a bee must consume several grams of honey to secrete a single gram of wax. Evolution has therefore favoured a shape that encloses the greatest volume of honey for the least wax. Circles leave wasted gaps, whereas hexagons tessellate perfectly and require less wax than squares or triangles."],
  ["C","Hexagons are also exceptionally strong. When joined edge to edge, they distribute any load across the whole structure rather than concentrating it at a single point. It is for this reason that engineers embed hexagonal cores in aircraft wings and in building panels that must combine strength with lightness."],
  ["D","Nature has a second favourite: the curve. Consider an egg or a turtle's shell. An egg squeezed from end to end in the palm of a hand is remarkably hard to crush, because its curved shell disperses the force evenly around its whole surface."],
  ["E","Architects have exploited this principle for millennia in the dome, essentially a hemisphere. Its strength allows it to span vast interiors without supporting columns. A dome also uses less material than a flat roof of the same area, and it copes well with storms, as wind flows around its curved surface rather than battering a flat wall."],
  ["F","The next time you notice a beehive or crack an egg, then, it may be worth a second look. Nature has spent millions of years testing designs, and those that endure tend to be the simplest and the most efficient. The most successful designers, it could be argued, are not necessarily the most inventive, but the most observant."]],
  gloss:"tessellate: fit together with no gaps · disperse: spread out · span: stretch across" }
];

const SHAPE_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["Shapes in nature that are also useful for designers","How bees make honey","How to cook eggs","The history of aeroplanes and how their wings are made"],
   hint:"Read paragraph A and paragraph F. What do the bees and the egg have in common?", focus:"The shapes that work best are often the simplest ones", para:"F",
   explain:"The answer is \"Shapes in nature that are also useful for designers\". The text looks at hexagons and domes in nature, and how people use them."},
  {stem:"What is the main topic of the text?", opts:["What designers can learn from shapes found in nature","Why bees are better builders than humans","The life of turtles","How to build a beehive in your garden at home"],
   hint:"Paragraph A asks two questions. The second one is the main topic.", focus:"what can human designers learn from them?"},
  {stem:"Which statement best summarises the article?", opts:["Natural shapes such as hexagons and curves are efficient and strong, which is why designers borrow them.","Bees understand geometry better than engineers do.","Domes are always better than flat roofs.","Eggs are the strongest objects in nature, so architects should build all roofs in the shape of an egg."],
   hint:"The summary needs both shapes (B–C and D–E) and the idea in F.", focus:"what might human designers learn from it?"}]},
 {skill:"Detail", para:"A", q:[
  {stem:"How many sides does every cell in a honeycomb have?", opts:["Six","Four","Three","Eight"],
   hint:"Look in paragraph A. Find the word \"sides\".", focus:"every cell has six sides",
   explain:"The answer is \"six\". Paragraph A says \"every cell has six sides\"."},
  {stem:"According to paragraph B, what must a bee eat to make one gram of wax?", opts:["Several grams of honey","One gram of honey","Some flowers","A little sugar and water"],
   hint:"Find \"one gram of wax\" in paragraph B.", focus:"a bee must eat several grams of honey to make just one gram of wax", para:"B"},
  {stem:"According to paragraph C, where do engineers use hexagonal cores?", opts:["In aircraft wings and in building panels","In car engines","In the walls of beehives","In domes and in the walls of beehives"],
   hint:"Paragraph C: find \"engineers\".", focus:"engineers embed hexagonal cores in aircraft wings and in building panels", para:"C"}]},
 {skill:"Vocabulary in context", para:"E", q:[
  {stem:"In paragraph E, a \"hemisphere\" is…", opts:["half of a ball","a kind of column","a flat roof","a very big room"],
   hint:"Find \"hemisphere\" in paragraph E. The text explains it with the next words.", focus:"A dome is half of a ball, called a hemisphere.",
   explain:"The answer is \"half of a ball\". Paragraph E says \"A dome is half of a ball, called a hemisphere.\""},
  {stem:"In paragraph E, \"columns\" are…", opts:["tall posts that hold up a roof","rooms in a building","windows in a dome","walls around a garden or a courtyard"],
   hint:"Find \"without columns in the middle\". What would hold up a roof in the middle of a big space?", focus:"it can cover a huge space without columns in the middle"},
  {stem:"In paragraph E, \"battering\" means…", opts:["hitting hard again and again","flowing gently around something","heating","cooling"],
   hint:"Compare \"flows around\" with \"battering a flat wall\". Which is more violent?", focus:"rather than battering a flat wall"}]},
 {skill:"Detail: two points", para:"B", q:[
  {type:"short", stem:"Write two reasons why bees build hexagons.", groups:HEX_WHY, need:2,
   hint:"Look in paragraphs B and C.", focus:"Hexagons fit together with no gaps, and they use less wax than squares or triangles.",
   explain:"Possible answers (any two): they use less wax; they fit together with no gaps; they are strong."},
  {type:"short", stem:"Give two advantages of hexagons, according to paragraphs B and C.", groups:HEX_WHY, need:2,
   hint:"Paragraph B: wax and gaps. Paragraph C: strength.", focus:"Circles leave wasted gaps between them, while hexagons fit together perfectly and use less wax than squares or triangles."},
  {type:"short", stem:"Identify two properties that make hexagons an efficient shape.", groups:HEX_WHY, need:2,
   hint:"Paragraph B explains the use of material; paragraph C explains the load.", focus:"Circles leave wasted gaps, whereas hexagons tessellate perfectly and require less wax than squares or triangles."}]},
 {skill:"Inference", para:"B", q:[
  {stem:"Why is wax \"difficult to make\" for bees?", opts:["They need to eat a lot of honey to make a little wax.","They can only make it in winter.","They need help from people.","It is made from flowers that are rare and difficult to find."],
   hint:"Read the second sentence of paragraph B.", focus:"Bees must eat a lot of honey to make a little wax.",
   explain:"The answer is \"They need to eat a lot of honey to make a little wax.\" Paragraph B says this, so wax is very costly for bees."},
  {stem:"What can we infer about circles from paragraph B?", opts:["A honeycomb of circles would waste space.","Circles are stronger than hexagons.","Bees cannot make circles.","Circles use more honey than hexagons, so bees can't afford them."],
   hint:"Paragraph B: what do circles leave between them?", focus:"Circles leave wasted gaps between them"},
  {stem:"What does the writer imply by saying evolution \"has favoured\" the hexagon?", opts:["Over a long time, bees that built hexagons did better than others.","Bees chose the hexagon because it looks beautiful.","Scientists taught bees to build hexagons.","Hexagons appeared in honeycombs by chance and give bees no real advantage."],
   hint:"Paragraph B: the hexagon gives the most honey for the least wax. Why would that shape win over millions of years?", focus:"Evolution has therefore favoured a shape"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"Write two reasons why domes are good for buildings.", groups:DOME_GOOD, need:2,
   hint:"Look in paragraph E. There are three reasons.", focus:"Domes also use less material than flat roofs, and they are good in strong winds",
   explain:"Possible answers (any two): they are strong, so they don't need columns; they use less material; they are good in strong winds."},
  {type:"short", stem:"Give two advantages of domes, according to paragraph E.", groups:DOME_GOOD, need:2,
   hint:"Paragraph E: think about strength, material and storms.", focus:"Domes also need less material than flat roofs, and they are good in storms"},
  {type:"short", stem:"Explain two benefits of the dome as a structure.", groups:DOME_GOOD, need:2,
   hint:"Paragraph E: what can it span without help, what does it save, and how does it cope with wind?", focus:"Its strength allows it to span vast interiors without supporting columns."}]},
 {skill:"Writer's purpose", para:"D", q:[
  {stem:"Why does the writer tell you to squeeze an egg?", opts:["To show that a curved shape is strong","To show how to cook an egg","To show that eggs break easily","To make the reader laugh before the serious part"],
   hint:"Look in paragraph D. What happens when you squeeze the egg?", focus:"If you hold an egg in your hand and squeeze it from both ends, it is hard to break.",
   explain:"The answer is \"To show that a curved shape is strong\". The egg is hard to break because of its curved shape."},
  {stem:"Why does the writer mention an egg and a turtle's shell in paragraph D?", opts:["To give everyday examples of strong curved shapes","To describe animals that live near beehives","To compare eggs and turtles as food","To explain how baby turtles are born and come out of their eggs"],
   hint:"Paragraph D starts by naming \"the curve\". What do eggs and shells have in common?", focus:"Think of an egg or the shell of a turtle."},
  {stem:"What is the function of paragraph D in the article?", opts:["It introduces a second natural shape before showing how architects use it.","It concludes the discussion of hexagons.","It argues that eggs are stronger than domes.","It explains why bees build curves as well as hexagons in their hives."],
   hint:"Paragraphs B and C are about hexagons. What does D begin, and what does E do with it?", focus:"Nature has a second favourite: the curve."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think good designers do?", opts:["They notice the shapes in nature.","They work with bees.","They use only hexagons.","They make very complicated shapes."],
   hint:"Read the last sentence of paragraph F.", focus:"the best designers are the ones who notice them",
   explain:"The answer is \"They notice the shapes in nature.\" The writer says the best designers \"are the ones who notice them\"."},
  {stem:"According to the writer, what kind of shapes survive in nature?", opts:["The simplest and most efficient","The most beautiful","The most complicated","The biggest and the most complicated"],
   hint:"Paragraph F: find \"the shapes that survive\".", focus:"the shapes that survive are often the simplest and most efficient"},
  {stem:"Which statement best reflects the writer's view in paragraph F?", opts:["Careful observation of nature can matter more than invention.","Designers should stop inventing new shapes.","Nature's designs are always better than human designs.","Only engineers, not architects, can really learn anything useful from nature."],
   hint:"Paragraph F contrasts \"the most inventive\" with \"the most observant\". Avoid answers with \"always\" or \"only\".", focus:"not necessarily the most inventive, but the most observant"}]}
];

export const UNIT2_TEXTS = [
  { id: "s8-desert", unitNo: 2, unit: U, topic: "Cool homes in the desert", blurb: "How did people keep cool in the desert before air conditioning?", levels: DESERT_LEVELS, slots: DESERT_SLOTS },
  { id: "s8-float", unitNo: 2, unit: U, topic: "Houses that float", blurb: "A clever idea for living with floods in the Mekong Delta.", levels: FLOAT_LEVELS, slots: FLOAT_SLOTS },
  { id: "s8-green", unitNo: 2, unit: U, topic: "A forest in the sky", blurb: "What happens when you put 800 trees on a tower block?", levels: GREEN_LEVELS, slots: GREEN_SLOTS },
  { id: "s8-shapes", unitNo: 2, unit: U, topic: "Nature's favourite shapes", blurb: "What can architects learn from bees and eggs?", levels: SHAPE_LEVELS, slots: SHAPE_SLOTS }
];
