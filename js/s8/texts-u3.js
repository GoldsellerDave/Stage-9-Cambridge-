// Stage 8 · Unit 3 · Our society: four practice texts.
// Same format as js/texts-u2.js: three levels with the same paragraph letters, eight slots, first MCQ option correct.
const U = "Unit 3 · Our society";

/* ---------- 1. The street without cars ---------- */
const CARFREE_GOOD = [
 {label:"children play outside", k:["children","kids","play","football","outside"]},
 {label:"cleaner air", k:["air","clean","pollution","fumes","breathe"]},
 {label:"quieter", k:["quiet","noise","peace","birds"]},
 {label:"neighbours meet / community spirit", k:["neighbour","meet","talk","know each other","community","friend"]},
 {label:"safer", k:["safe","accident","danger"]}];
const CF_PROBLEM = {ask:"What problem do people have with shopping or deliveries?", label:"carrying shopping / deliveries", k:["shopping","carry","heavy","deliver","bag","van","trolley","cart"]};
const CF_ANSWER = {ask:"How did the neighbourhood solve it?", label:"shared carts / bikes / car park outside", k:["cart","bike","bicycle","share","car park","edge","outside the neighbourhood","borrow"]};

const CARFREE_LEVELS = [
 { title:"The street without cars", paras:[
  ["A","In most cities, the streets belong to cars. They are full of traffic, noise and smoke. But in one neighbourhood in Germany, called Vauban, about 5,000 people live almost without cars. The streets are car-free, and children play in the middle of the road."],
  ["B","How does it work? The houses are close to a tram stop, shops and a school, so people can walk or cycle everywhere. There are no parking spaces outside the houses. If people want a car, they must buy a space in a car park at the edge of the neighbourhood, and it is very expensive. So most families do not have a car."],
  ["C","Life in Vauban is very different. The air is clean, and the streets are quiet. You can hear birds in the morning. Children walk to school alone, because the streets are safe. Parents say this is the best thing about living there."],
  ["D","The neighbourhood is also very lively. Without cars, the streets become a place to meet. Neighbours stop and talk, and they know each other's names. In summer, people eat dinner together at long tables in the street. There is a strong community spirit."],
  ["E","Of course, there are some problems. Carrying heavy shopping home is not easy without a car. To help, the neighbourhood has shared carts and cargo bikes that anyone can borrow. People who need a car sometimes can rent one for a few hours."],
  ["F","Could this work in a city like Hanoi or Ho Chi Minh City? It would not be easy, because the cities are big and buses are crowded. But some streets in Hanoi are already car-free at weekends, and they are full of families. Maybe this is a first step."]],
  gloss:"tram: a long electric vehicle that runs on rails in the street · cargo bike: a bicycle with a big box for carrying things" },
 { title:"The street without cars", paras:[
  ["A","In most cities, the streets belong to cars: they are full of traffic, noise and exhaust fumes. In Vauban, a neighbourhood in the south of Germany, things are different. Around 5,000 people live there almost without cars. The streets are car-free, and it is normal to see children playing football in the middle of the road."],
  ["B","The design makes this possible. Every home is within walking distance of a tram stop, shops and a school, so residents can easily get around on foot or by bike. There are no parking spaces outside the houses. Anyone who wants to own a car has to buy a space in a car park on the edge of the neighbourhood, which costs a lot of money. As a result, most families have decided to live without one."],
  ["C","The difference is easy to notice. The air is clean, the streets are quiet, and in the morning you can hear birds instead of engines. Because there is so little traffic, even young children walk to school on their own. Many parents say that this freedom is the main reason they moved to Vauban."],
  ["D","Without cars, the neighbourhood has also become more lively. The streets have turned into a place where people meet, chat and play. Neighbours know each other's names, and on summer evenings they often share dinner at long tables in the street. Residents describe a strong sense of community spirit."],
  ["E","Life without a car does have its difficulties, though. Bringing home heavy shopping, for example, can be a challenge. To solve this, the neighbourhood offers shared carts and cargo bikes that anyone can borrow, and residents who occasionally need a car can rent one by the hour."],
  ["F","Could the same idea work in Hanoi or Ho Chi Minh City? It would be much harder, because the cities are huge and public transport is still developing. But some streets in Hanoi already close to traffic at weekends, and they quickly fill with families. It may be a small step, but it shows what streets could be like."]],
  gloss:"exhaust fumes: the smoke that comes out of cars · rent: pay to use something for a short time" },
 { title:"Reclaiming the street", paras:[
  ["A","In most cities, the street has become the territory of the car, defined by traffic, noise and exhaust fumes. Vauban, a district in southern Germany, offers a striking contrast. Its 5,000 or so residents live almost entirely without cars, and the sight of children playing football in the middle of the road is entirely unremarkable."],
  ["B","This is no accident of history; it was designed that way. Every home lies within walking distance of a tram stop, shops and a school, making it easy to get around on foot or by bicycle. Crucially, there is no parking outside the houses. Residents who insist on owning a car must purchase a space in a car park on the edge of the district, at considerable cost, and the majority have concluded that it is simply not worth it."],
  ["C","The effects are immediately apparent. The air is clean, the streets are hushed, and the morning soundtrack is birdsong rather than engines. With so little traffic, even young children walk to school unaccompanied, a freedom that many parents cite as their main reason for moving to the district."],
  ["D","Perhaps less predictably, the absence of cars has made Vauban livelier rather than quieter in a social sense. Freed from traffic, the streets have become places to meet, talk and play. Neighbours know one another by name, and on summer evenings they frequently eat together at long tables set out in the road. Residents speak of a community spirit that they rarely found elsewhere."],
  ["E","That is not to say that car-free living is without its drawbacks. Transporting heavy shopping, for instance, can be a challenge. The district's answer is a scheme of shared carts and cargo bikes that anyone may borrow, while those who occasionally need a car can rent one by the hour."],
  ["F","Could such a model be transplanted to Hanoi or Ho Chi Minh City? The obstacles would be considerable: these are vast cities in which public transport is still developing. Yet the streets in Hanoi that close to traffic at weekends fill almost at once with families, which suggests that the appetite for car-free space already exists. It may be a modest beginning, but it offers a glimpse of what city streets might become."]],
  gloss:"territory: an area that belongs to someone · hushed: very quiet · transplant: move to a new place" }
];

const CARFREE_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["A neighbourhood where people live almost without cars","How to ride a cargo bike safely through busy city streets","Why cars are expensive in Germany","The best way to get to school by tram"],
   hint:"Read paragraph A. What is special about Vauban?", focus:"about 5,000 people live almost without cars",
   explain:"The answer is \"A neighbourhood where people live almost without cars\". The whole text is about Vauban: how it works, what is good about it and what the problems are."},
  {stem:"What is the main topic of the text?", opts:["What life is like in a car-free neighbourhood","How German cities plan their tram lines and bus routes","Why children should walk to school on their own","The traffic problems of Hanoi and Ho Chi Minh City"],
   hint:"Paragraph A introduces the place. What do paragraphs B to E describe?", focus:"Around 5,000 people live there almost without cars."},
  {stem:"Which statement best summarises the article?", opts:["A car-free district shows benefits for health and community, and hints at what other cities could do.","Car-free living has no problems at all, so every city in the world should ban all private cars immediately.","German cities are cleaner than cities in Viet Nam.","Children in Vauban are more independent than their parents were."],
   hint:"The summary should cover how Vauban works, its benefits and the question in paragraph F.", focus:"offers a striking contrast"}]},
 {skill:"Detail", para:"B", q:[
  {stem:"Where must people in Vauban park their cars?", opts:["In a car park at the edge of the neighbourhood","Outside their own houses, right next to the front door","Near the school","At the tram stop"],
   hint:"Look in paragraph B. Find \"car park\".", focus:"they must buy a space in a car park at the edge of the neighbourhood",
   explain:"The answer is \"in a car park at the edge of the neighbourhood\". Paragraph B says there are no parking spaces outside the houses."},
  {stem:"According to paragraph B, why do most families not own a car?", opts:["A parking space costs a lot of money.","Cars are not allowed in the whole of Germany.","They cannot afford to buy petrol.","The tram is free for everyone who lives there."],
   hint:"Paragraph B: what does it cost to own a car in Vauban?", focus:"which costs a lot of money"},
  {stem:"According to paragraph B, what have most residents concluded?", opts:["That owning a car is not worth the cost","That trams are slower than cars","That parking should be free for families","That the district needs more car parks"],
   hint:"Paragraph B: read the last sentence.", focus:"the majority have concluded that it is simply not worth it"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"lively\" means…", opts:["full of people and activity","very dangerous, especially at night","quiet and empty","full of cars and buses"],
   hint:"Find \"lively\" in paragraph D. What do people do in the streets?", focus:"The neighbourhood is also very lively.",
   explain:"The answer is \"full of people and activity\". Paragraph D says people meet, talk and eat together in the streets."},
  {stem:"In paragraph D, \"community spirit\" means…", opts:["a feeling that people in an area belong together and help each other","a ghost that lives in the neighbourhood","a club that people pay to join","the written rules of the neighbourhood that every resident must follow"],
   hint:"Find \"community spirit\" in paragraph D. Read the sentences before it.", focus:"Residents describe a strong sense of community spirit."},
  {stem:"In paragraph D, \"less predictably\" suggests that the social effect…", opts:["is more surprising than the effects in paragraph C","was planned carefully by the architects from the start","is not true for most residents","happens only in summer"],
   hint:"Paragraph C describes clean air and quiet streets, which you might expect. What is unexpected in D?", focus:"Perhaps less predictably, the absence of cars has made Vauban livelier"}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two good things about living in Vauban.", groups:CARFREE_GOOD, need:2,
   hint:"Look in paragraphs C and D.", focus:"The air is clean, and the streets are quiet.",
   explain:"Possible answers (any two): the air is clean; the streets are quiet; children walk to school alone; neighbours know each other."},
  {type:"short", stem:"Give two benefits of living without cars, according to paragraph C.", groups:CARFREE_GOOD, need:2,
   hint:"Paragraph C: the air, the noise and the children.", focus:"Because there is so little traffic, even young children walk to school on their own."},
  {type:"short", stem:"Identify two effects of the absence of traffic described in paragraph C.", groups:CARFREE_GOOD, need:2,
   hint:"Paragraph C: think about the air, the sound and the children.", focus:"With so little traffic, even young children walk to school unaccompanied"}]},
 {skill:"Inference", para:"C", q:[
  {stem:"Why do parents think Vauban is a good place for children?", opts:["Their children can go to school alone safely.","Their children can drive cars at a young age.","There are more schools there than in other places.","Their children don't have to go to school every day."],
   hint:"Look in paragraph C. What can children do alone?", focus:"Children walk to school alone, because the streets are safe.",
   explain:"The answer is \"Their children can go to school alone safely.\" Paragraph C says the streets are safe, so children walk to school alone."},
  {stem:"What can we infer from paragraph C about children in other cities?", opts:["They often can't walk to school alone because of traffic.","They walk to school together with their friends every single day.","They prefer cycling to walking, even in the rain.","They don't like going to school."],
   hint:"Paragraph C: \"even young children walk to school on their own\". Why does the writer say \"even\"?", focus:"even young children walk to school on their own"},
  {stem:"What does the phrase \"a freedom that many parents cite\" suggest?", opts:["Parents value their children's independence highly.","Parents want more freedom for themselves.","Parents are worried about the dangers of walking to school.","Parents were made to move to Vauban."],
   hint:"Paragraph C: what freedom do the children have, and why do parents mention it?", focus:"a freedom that many parents cite as their main reason for moving to the district"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"What problem do people have without a car, and how does Vauban help?", groups:[CF_PROBLEM,CF_ANSWER], need:2,
   hint:"Look in paragraph E. Find the problem, then find \"To help\".", focus:"Carrying heavy shopping home is not easy without a car.",
   explain:"Possible answers: carrying heavy shopping home is hard; they can borrow shared carts and cargo bikes."},
  {type:"short", stem:"Explain one difficulty of life without a car and the neighbourhood's solution.", groups:[CF_PROBLEM,CF_ANSWER], need:2,
   hint:"Paragraph E: the difficulty is about shopping. The solution starts with \"To solve this\".", focus:"To solve this, the neighbourhood offers shared carts and cargo bikes that anyone can borrow"},
  {type:"short", stem:"Identify a drawback of car-free living and explain how the district responds to it.", groups:[CF_PROBLEM,CF_ANSWER], need:2,
   hint:"Paragraph E: \"for instance\" introduces the drawback; \"The district's answer\" introduces the response.", focus:"The district's answer is a scheme of shared carts and cargo bikes that anyone may borrow"}]},
 {skill:"Writer's purpose", para:"F", q:[
  {stem:"Why does the writer talk about Hanoi in paragraph F?", opts:["To ask if the idea could work in Viet Nam","To say that Hanoi has too many tourists in the summer","To compare German and Vietnamese food","To describe the trams in Hanoi"],
   hint:"Read the first question in paragraph F.", focus:"Could this work in a city like Hanoi or Ho Chi Minh City?",
   explain:"The answer is \"To ask if the idea could work in Viet Nam\". The writer asks the question and talks about car-free streets in Hanoi."},
  {stem:"Why does the writer mention streets in Hanoi that close at weekends?", opts:["To show that people in Viet Nam already enjoy car-free spaces","To complain that the streets are far too crowded with families at night","To explain why public transport is still developing","To give directions to visitors"],
   hint:"Paragraph F: what happens to these streets when they close to traffic?", focus:"they quickly fill with families"},
  {stem:"What is the function of the example of Hanoi in paragraph F?", opts:["It suggests there is already a demand for car-free spaces.","It proves that Vauban's model will definitely work in Viet Nam.","It shows that Hanoi has solved its traffic problems.","It introduces a criticism of the Vauban model."],
   hint:"Paragraph F: what does the example \"suggest\"? Avoid answers that are too strong.", focus:"which suggests that the appetite for car-free space already exists"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about car-free streets in Viet Nam?", opts:["It would be hard, but it could start with small steps.","It is impossible in Viet Nam because the cities are so big.","It is easy and should happen now in every city.","It is not a good idea for families with children."],
   hint:"Read paragraph F. Find \"not easy\" and \"a first step\".", focus:"Maybe this is a first step.",
   explain:"The answer is \"It would be hard, but it could start with small steps.\" The writer says it \"would not be easy\" but car-free weekend streets may be \"a first step\"."},
  {stem:"What is the writer's attitude to the idea of car-free streets in Viet Nam?", opts:["Hopeful but realistic","Completely against it","Sure that it will happen soon","Not interested in it at all"],
   hint:"Paragraph F: \"much harder\" but \"it shows what streets could be like\".", focus:"It may be a small step, but it shows what streets could be like."},
  {stem:"Which statement best reflects the writer's position in paragraph F?", opts:["The obstacles are real, but there are signs that change is possible.","Car-free districts can only work in small European towns.","Vietnamese cities should copy Vauban exactly, without making any changes at all.","The writer has no opinion and only reports facts."],
   hint:"Paragraph F: \"The obstacles would be considerable\" … \"Yet\". What comes after \"Yet\"?", focus:"it offers a glimpse of what city streets might become"}]}
];

/* ---------- 2. City or country? ---------- */
const CITY_GOOD = [
 {label:"shopping centres / shops", k:["shop","shopping centre","mall","buy"]},
 {label:"good schools / university", k:["school","universit","class","education","study"]},
 {label:"hospitals / healthcare", k:["hospital","doctor","healthcare","health"]},
 {label:"lively / things to do", k:["lively","cinema","café","fun","things to do","something to do","cafe","activit","entertain"]}];
const COUNTRY_GOOD = [
 {label:"fresh air / nature", k:["air","fresh","nature","green","field","river","tree"]},
 {label:"quiet / peaceful", k:["quiet","peace","calm","noise"]},
 {label:"everyone knows each other", k:["know","neighbour","community","friend","help each other"]},
 {label:"safe / little crime", k:["safe","crime","door"]}];

const CITY_LEVELS = [
 { title:"City or country?", paras:[
  ["A","Mai lives in Ho Chi Minh City. Her cousin Tuan lives in a small village in the mountains in the north. They are both thirteen. Last summer, they spent a month together, two weeks in the city and two weeks in the village. We asked them about the good and bad things."],
  ["B","Mai loves the city. \"It's so lively,\" she says. \"There are shopping centres, cinemas and cafés everywhere, and there's always something to do.\" She also says there are good schools, and big hospitals with excellent healthcare. \"If you want to go to university, the city is the best place.\""],
  ["C","But the city has problems too. \"The traffic congestion is terrible,\" Mai says. \"It takes me forty minutes to get to school, and it's only five kilometres!\" The air is not very clean, and the streets are noisy. Some areas also have crime, so her parents don't let her go out alone at night."],
  ["D","Tuan loves his village. \"The air is fresh, and it's very quiet,\" he says. \"From my house, you can overlook the rice fields and the river.\" Everyone in the village knows each other. \"People help their neighbours. Nobody locks their door.\""],
  ["E","However, Tuan thinks life in the country can be hard. The nearest secondary school is twelve kilometres away, and he goes by bike on a narrow mountain road. There is only one small shop, and the nearest hospital is two hours away. Many young people leave the village to find work in the city, because incomes there are much higher."],
  ["F","So which is better? Mai and Tuan don't agree. \"I'd like to visit the village every summer,\" says Mai, \"but I couldn't live there.\" Tuan smiles. \"I want to study in the city,\" he says, \"but one day I want to come home.\""]],
  gloss:"cousin: the child of your aunt or uncle · lock: close with a key" },
 { title:"City or country?", paras:[
  ["A","Mai lives in Ho Chi Minh City, while her cousin Tuan lives in a small village in the mountains of northern Viet Nam. Both of them are thirteen. Last summer, they spent a month together: two weeks in the city and two weeks in the village. Afterwards, we asked them to compare the two places."],
  ["B","Mai is a big fan of city life. \"It's so lively,\" she says. \"There are shopping centres, cinemas and cafés on every street, so you never get bored.\" She also points out that the city has excellent schools and large hospitals offering good healthcare. \"If you want to go to university or get a good job, the city is where you have to be.\""],
  ["C","She admits, however, that the city has its problems. \"Traffic congestion is a nightmare,\" she says. \"My school is only five kilometres away, but it takes me forty minutes to get there.\" Pollution and noise are a daily part of life, and because some areas have a lot of crime, her parents won't let her go out alone after dark."],
  ["D","Tuan, on the other hand, can't imagine living anywhere but his village. \"The air is fresh, and it's so peaceful,\" he says. \"From my bedroom window, I overlook the rice fields and the river.\" In the village, everyone knows everyone else. \"People always help their neighbours. Nobody even locks their front door.\""],
  ["E","Even so, Tuan admits that country life can be tough. The nearest secondary school is twelve kilometres away, and he cycles there on a narrow mountain road, even in the rainy season. The village has just one small shop, and the nearest hospital is two hours away. Many young people leave to find work in the city, where incomes are much higher."],
  ["F","So which is better? The cousins can't agree. \"I'd love to visit the village every summer,\" says Mai, \"but I could never live there.\" Tuan laughs. \"I want to go to university in the city,\" he says, \"but I'm sure I'll come home one day.\""]],
  gloss:"nightmare: a very bad experience · tough: difficult" },
 { title:"Two cousins, two worlds", paras:[
  ["A","Mai has grown up in Ho Chi Minh City; her cousin Tuan, in a small village in the mountains of northern Viet Nam. Both are thirteen. Last summer, the pair spent a month together, dividing their time equally between the city and the village, and afterwards we asked them to weigh up the two ways of life."],
  ["B","Mai is an enthusiastic advocate of the city. \"It's so lively,\" she says. \"Shopping centres, cinemas, cafés: there's something on every corner, so you're never bored.\" She is also quick to point to the city's excellent schools and its large hospitals, with healthcare that rural areas cannot match. \"If you're serious about university or a good career,\" she insists, \"the city is the only option.\""],
  ["C","Yet she is candid about its shortcomings. \"Traffic congestion is a nightmare,\" she admits. \"My school is only five kilometres away, and it still takes me forty minutes.\" Pollution and noise are a constant backdrop, and because certain districts have a reputation for crime, her parents will not allow her out alone after dark."],
  ["D","Tuan, by contrast, cannot picture a life anywhere else. \"The air is clean and it's so peaceful,\" he says. \"From my bedroom I overlook the rice fields and the river.\" In a community this small, everyone knows everyone. \"People always help their neighbours. Nobody even bothers to lock their door.\""],
  ["E","Nonetheless, Tuan acknowledges that rural life has its hardships. The nearest secondary school is twelve kilometres away, a journey he makes by bicycle along a narrow mountain road, whatever the weather. The village has a single small shop, and the nearest hospital is two hours' drive away. Many young people leave in search of work in the city, where incomes are considerably higher."],
  ["F","Which way of life comes out on top, then? The cousins remain divided. \"I'd happily visit the village every summer,\" says Mai, \"but I could never actually live there.\" Tuan grins. \"I want to go to university in the city,\" he says, \"but I'm certain that one day I'll come home.\" Perhaps the real answer is that each place offers something the other lacks."]],
  gloss:"advocate: a person who supports an idea · candid: honest · backdrop: something that is always in the background" }
];

const CITY_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["Two cousins comparing life in the city and in the country","A long family holiday in the mountains of northern Viet Nam","How to get to school in Ho Chi Minh City","Why young people go to university"],
   hint:"Read paragraph A. What did the writer ask Mai and Tuan?", focus:"We asked them about the good and bad things.",
   explain:"The answer is \"Two cousins comparing life in the city and in the country\". Mai talks about the city (B, C) and Tuan talks about the village (D, E)."},
  {stem:"What is the main purpose of the text?", opts:["To compare city and village life through two young people's views","To persuade readers to move away from the city to the quiet countryside","To describe the schools in Ho Chi Minh City","To explain why traffic is bad in big cities"],
   hint:"Paragraph A: what did the writer ask the cousins to do?", focus:"Afterwards, we asked them to compare the two places."},
  {stem:"Which statement best summarises the article?", opts:["Two cousins describe the advantages and drawbacks of city and rural life, and neither place is clearly better.","Rural life is better in every way, but young people still prefer the city because it is more exciting.","The city offers better healthcare than the countryside.","Mai and Tuan both want to live in the city when they are older."],
   hint:"The summary needs both places and the ending in paragraph F.", focus:"we asked them to weigh up the two ways of life"}]},
 {skill:"Detail", para:"C", q:[
  {stem:"How long does it take Mai to get to school?", opts:["Forty minutes","Five minutes","Two hours","Twelve minutes"],
   hint:"Look in paragraph C. Find a time.", focus:"It takes me forty minutes to get to school",
   explain:"The answer is \"forty minutes\". Mai says \"It takes me forty minutes to get to school\". Five is the number of kilometres."},
  {stem:"According to paragraph C, why can't Mai go out alone after dark?", opts:["Some areas have a lot of crime.","The traffic is too heavy at night.","She has to do her homework every evening.","The buses stop at six o'clock."],
   hint:"Find \"after dark\" in paragraph C. Read the start of the sentence.", focus:"because some areas have a lot of crime, her parents won't let her go out alone after dark"},
  {stem:"According to paragraph C, what makes Mai's journey to school frustrating?", opts:["A short distance takes a long time because of traffic.","The route is long and dangerous.","Her school is far from the city centre.","She has to change buses three times on the way to school."],
   hint:"Paragraph C: compare the distance and the time. What causes the problem?", focus:"My school is only five kilometres away, and it still takes me forty minutes."}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"overlook\" means…", opts:["see from a higher place","forget about","walk across from one side to the other","clean"],
   hint:"Find \"overlook\" in paragraph D. What can Tuan see from his house?", focus:"you can overlook the rice fields and the river",
   explain:"The answer is \"see from a higher place\". Tuan's house is in the mountains, so he can look down at the fields and the river."},
  {stem:"In paragraph D, \"peaceful\" means…", opts:["calm and quiet","full of people","very crowded and noisy","far from the city"],
   hint:"Find \"peaceful\" in paragraph D. It comes after \"The air is fresh, and…\".", focus:"The air is fresh, and it's so peaceful"},
  {stem:"In paragraph D, \"Nobody even bothers to lock their door\" suggests that the village is…", opts:["very safe","very poor","very modern","very crowded"],
   hint:"Paragraph D: why would people not lock their doors? Compare paragraph C.", focus:"Nobody even bothers to lock their door."}]},
 {skill:"Detail: two points", para:"B", q:[
  {type:"short", stem:"Write two good things about the city, according to Mai.", groups:CITY_GOOD, need:2,
   hint:"Look in paragraph B.", focus:"There are shopping centres, cinemas and cafés everywhere, and there's always something to do.",
   explain:"Possible answers (any two): there are shopping centres and cafés; there are good schools; there are big hospitals; there is always something to do."},
  {type:"short", stem:"Give two advantages of city life that Mai mentions in paragraph B.", groups:CITY_GOOD, need:2,
   hint:"Paragraph B: things to do, schools and hospitals.", focus:"She also points out that the city has excellent schools and large hospitals offering good healthcare."},
  {type:"short", stem:"Identify two advantages of city life put forward by Mai.", groups:CITY_GOOD, need:2,
   hint:"Paragraph B: entertainment, education and health.", focus:"She is also quick to point to the city's excellent schools and its large hospitals"}]},
 {skill:"Inference", para:"E", q:[
  {stem:"Why do many young people leave the village?", opts:["They can earn more money in the city.","They don't like the mountains.","Their parents tell them to leave and live with their cousins.","The village school is closed."],
   hint:"Look at the end of paragraph E. Find \"incomes\".", focus:"incomes there are much higher",
   explain:"The answer is \"They can earn more money in the city.\" Paragraph E says they go \"to find work in the city, because incomes there are much higher\"."},
  {stem:"What can we infer about Tuan's journey to school?", opts:["It can be difficult and tiring.","It is quick and easy.","His parents drive him in their car.","He goes by bus with his friends."],
   hint:"Paragraph E: how far, how does he travel, on what kind of road, and in what weather?", focus:"he cycles there on a narrow mountain road, even in the rainy season"},
  {stem:"What can be inferred from \"whatever the weather\" in paragraph E?", opts:["Tuan cycles to school even when conditions are bad.","Tuan enjoys cycling in the rain more than in the sun.","The weather in the mountains is usually good.","Tuan only goes to school when it is sunny."],
   hint:"Paragraph E: \"whatever\" means it doesn't matter what. What does Tuan do anyway?", focus:"a journey he makes by bicycle along a narrow mountain road, whatever the weather"}]},
 {skill:"Cause and effect", para:"D", q:[
  {type:"short", stem:"Write two good things about the village, according to Tuan.", groups:COUNTRY_GOOD, need:2,
   hint:"Look in paragraph D.", focus:"The air is fresh, and it's very quiet",
   explain:"Possible answers (any two): the air is fresh; it's very quiet; everyone knows each other; nobody locks their door."},
  {type:"short", stem:"Give two reasons why Tuan loves his village.", groups:COUNTRY_GOOD, need:2,
   hint:"Paragraph D: the air, the noise and the people.", focus:"In the village, everyone knows everyone else."},
  {type:"short", stem:"Identify two features of village life that Tuan values.", groups:COUNTRY_GOOD, need:2,
   hint:"Paragraph D: his surroundings and his community.", focus:"In a community this small, everyone knows everyone."}]},
 {skill:"Writer's purpose", para:"A", q:[
  {stem:"Why does the writer use two young people in the text?", opts:["To show two different points of view","To tell a story about a family argument","To give advice about school","To describe a holiday in the mountains"],
   hint:"Paragraph A: where does each cousin live?", focus:"Her cousin Tuan lives in a small village in the mountains in the north.",
   explain:"The answer is \"To show two different points of view\". Mai lives in the city and Tuan in the village, so each one can talk about their own place."},
  {stem:"Why does the writer explain where each cousin lives at the start?", opts:["So that readers understand why their opinions are different","To give readers the exact address of their two houses","To show that they live near each other","To describe the weather in the north"],
   hint:"Paragraph A: one lives in the city, the other in a village. How does that affect what they say?", focus:"while her cousin Tuan lives in a small village in the mountains of northern Viet Nam"},
  {stem:"Why does the writer present the topic through two cousins rather than statistics?", opts:["To make the comparison personal and balanced","To prove that one way of life is better than the other","To criticise city life","To give readers precise data about incomes"],
   hint:"Paragraph A: the cousins spent equal time in each place and were asked to \"weigh up\" both.", focus:"dividing their time equally between the city and the village"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"How does the text end?", opts:["The cousins still have different opinions.","Mai finally decides to move to the village.","Tuan decides never to leave his village.","The writer says the city is better."],
   hint:"Read paragraph F. Do Mai and Tuan agree?", focus:"Mai and Tuan don't agree.",
   explain:"The answer is \"The cousins still have different opinions.\" Paragraph F says \"Mai and Tuan don't agree.\""},
  {stem:"What does Tuan's final comment show?", opts:["He feels strongly connected to his village.","He wants to move to the city and live there forever.","He doesn't want to go to university.","He is unhappy with his cousin."],
   hint:"Paragraph F: what does Tuan want to do \"one day\"?", focus:"I'm sure I'll come home one day."},
  {stem:"What conclusion does the writer suggest at the end of the article?", opts:["Each place has advantages the other does not have.","The city is clearly the better place to grow up.","Rural life will soon disappear completely in Viet Nam.","Young people should not leave their villages."],
   hint:"Read the last sentence of paragraph F.", focus:"Perhaps the real answer is that each place offers something the other lacks."}]}
];

/* ---------- 3. Small actions, big difference ---------- */
const VOL_WHAT = [
 {label:"picked up rubbish / cleaned the canal", k:["rubbish","litter","clean","canal","plastic","bag"]},
 {label:"planted trees / garden", k:["plant","tree","flower","garden"]},
 {label:"painted / mural", k:["paint","mural","wall","picture"]},
 {label:"taught / homework club", k:["teach","taught","homework","lesson","read","younger"]}];
const VOL_WHY = [
 {label:"make friends / meet people", k:["friend","meet","people","neighbour"]},
 {label:"feel useful / proud / happy", k:["proud","useful","happy","feel good","good feeling","confiden"]},
 {label:"learn skills", k:["skill","learn","organis","lead"]}];
const GANG_BEFORE = {ask:"What was the problem before?", label:"gangs / violence / nothing to do", k:["gang","violence","fight","trouble","nothing to do","bored","crime"]};
const GANG_AFTER = {ask:"What changed after the club opened?", label:"less trouble / somewhere to go", k:["less","fewer","stopped","club","somewhere","place to go","football","safer","fell"]};

const VOL_LEVELS = [
 { title:"Small actions, big difference", paras:[
  ["A","Can a group of teenagers change their neighbourhood? In one district of Da Nang, the answer is yes. Three years ago, the canal near Linh's house was full of plastic bags and rubbish. \"It smelled terrible,\" she says. \"Nobody wanted to walk there.\""],
  ["B","Linh was fourteen. One Saturday, she and five friends took bags and gloves and started to clean the canal. It was hard work, and it took all day. But the next Saturday, twelve people came to help. A month later, there were more than fifty volunteers."],
  ["C","Now the group does much more. They planted trees along the canal, and they painted a big picture of fish and birds on an old grey wall. Some older students started a free homework club for younger children. \"Every week, we try something new,\" says Linh."],
  ["D","The volunteers also helped with a social problem. A few years ago, there were gangs of bored teenagers in the area, and there was some violence at night. Then the group started a football club in the evenings. \"Now the boys have somewhere to go,\" says a local shop owner. \"There is much less trouble.\""],
  ["E","Why do the volunteers do it? They are not paid. \"I've made so many new friends,\" says Minh, sixteen. \"And I feel proud when I walk past the canal.\" Others say they have learned new skills, like organising events and talking to adults."],
  ["F","Linh thinks anyone can make a difference. \"You don't need money or a big plan,\" she says. \"Just start with one small thing, and other people will join you.\" Today, the canal is clean, and families walk there every evening."]],
  gloss:"canal: a long, narrow waterway made by people · gloves: clothes for your hands" },
 { title:"Small actions, big difference", paras:[
  ["A","Can a group of teenagers really change their neighbourhood? In one district of Da Nang, the answer seems to be yes. Three years ago, the canal near Linh's home was blocked with plastic bags and rubbish. \"The smell was awful,\" she remembers. \"Nobody wanted to go near it.\""],
  ["B","Linh was fourteen at the time. One Saturday morning, she and five friends took rubbish bags and gloves and began to clear the canal. It was exhausting, and it took them the whole day. The following Saturday, though, twelve people turned up to help, and within a month the group had more than fifty volunteers."],
  ["C","Since then, the group has taken on much more. Its members have planted trees along the canal and turned an ugly grey wall into a colourful mural of fish and birds. Some of the older students have also set up a free homework club for younger children. \"We try something new every week,\" Linh explains."],
  ["D","The volunteers have even helped with a serious social problem. A few years ago, gangs of bored teenagers hung around the area, and there were occasional outbreaks of violence at night. When the group started an evening football club, things began to change. \"The boys finally have somewhere to go,\" says a local shop owner. \"There's far less trouble now.\""],
  ["E","None of the volunteers is paid, so why do they do it? \"I've made loads of new friends,\" says sixteen-year-old Minh, \"and I feel really proud every time I walk past the canal.\" Others say they have gained useful skills, such as organising events and speaking confidently to adults."],
  ["F","Linh is convinced that anyone can make a difference. \"You don't need money or a big plan,\" she says. \"Start with one small thing, and other people will join you.\" Today, the canal is clean, and every evening it is full of families out for a walk."]],
  gloss:"mural: a picture painted on a wall · outbreak: a sudden start of something bad" },
 { title:"The ripple effect", paras:[
  ["A","Can a handful of teenagers genuinely transform their neighbourhood? In one district of Da Nang, the evidence suggests they can. Three years ago, the canal near Linh's home was choked with plastic bags and rubbish. \"The stench was unbearable,\" she recalls. \"People would cross the road to avoid it.\""],
  ["B","Linh was fourteen at the time. One Saturday morning, armed with rubbish bags and gloves, she and five friends set about clearing the canal. The work was gruelling and took the entire day. The following weekend, however, twelve people appeared to help, and within a month the group could count on more than fifty volunteers."],
  ["C","The group's ambitions have since expanded considerably. Members have lined the canal with trees and transformed a drab grey wall into a vivid mural of fish and birds, while some of the older students have established a free homework club for younger children. \"Every week we take on something new,\" Linh says."],
  ["D","Perhaps most strikingly, the volunteers have made inroads into a deeper social problem. A few years ago, gangs of idle teenagers loitered in the area, and there were sporadic outbreaks of violence after dark. The launch of an evening football club marked a turning point. \"The boys finally have somewhere to go,\" observes a local shopkeeper. \"There's far less trouble than there used to be.\""],
  ["E","None of the volunteers is paid, which raises the question of what motivates them. \"I've made so many new friends,\" says sixteen-year-old Minh, \"and I feel genuinely proud every time I walk past the canal.\" Others point to the practical skills they have acquired, from organising events to addressing adults with confidence."],
  ["F","Linh is adamant that anyone can make a difference. \"You don't need money or a grand plan,\" she insists. \"Start with one small thing, and others will follow.\" The canal, once avoided, is now clean, and each evening it is crowded with families taking a stroll: a ripple effect that began with six teenagers and a few rubbish bags."]],
  gloss:"gruelling: very tiring · inroads: progress into something difficult · sporadic: happening sometimes, not regularly" }
];

const VOL_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["Teenagers who made their neighbourhood better","How to clean a canal in one day without help","A football club in Da Nang for the best players","Why canals smell bad in the summer"],
   hint:"Read paragraph A. What question does the writer ask?", focus:"Can a group of teenagers change their neighbourhood?",
   explain:"The answer is \"Teenagers who made their neighbourhood better\". The text shows how the volunteers cleaned the canal, planted trees, started clubs and helped with gangs."},
  {stem:"What is the main topic of the text?", opts:["How a small group of young volunteers changed their area","The problem of plastic waste in the oceans of the world","Why teenagers in Da Nang are bored","How to start a homework club at your school"],
   hint:"Paragraph A asks a question. The rest of the text answers it.", focus:"In one district of Da Nang, the answer seems to be yes."},
  {stem:"Which statement best summarises the article?", opts:["A small volunteer effort grew into a wider movement that improved the neighbourhood in several ways.","Teenagers are responsible for most of the problems in their neighbourhoods, so they must fix them.","The canal in Da Nang is now the cleanest in Viet Nam.","Volunteers should be paid for their work."],
   hint:"Think about how the group started (B) and everything it achieved (C, D, F).", focus:"In one district of Da Nang, the evidence suggests they can."}]},
 {skill:"Detail", para:"B", q:[
  {stem:"How many volunteers were there after a month?", opts:["More than fifty","Six","Twelve","Five"],
   hint:"Look at the end of paragraph B. Find \"a month\".", focus:"A month later, there were more than fifty volunteers.",
   explain:"The answer is \"more than fifty\". Paragraph B says \"A month later, there were more than fifty volunteers.\" Twelve came on the second Saturday."},
  {stem:"According to paragraph B, what happened the following Saturday?", opts:["Twelve people came to help.","Linh worked alone all day.","The canal was already clean.","More than fifty people came."],
   hint:"Find \"The following Saturday\" in paragraph B.", focus:"twelve people turned up to help"},
  {stem:"According to paragraph B, how did the group change in the first month?", opts:["It grew from six people to more than fifty.","It got smaller because the work was too hard.","It received money from the city council.","It moved to a different canal."],
   hint:"Paragraph B: count Linh and her friends, then look at the last sentence.", focus:"within a month the group could count on more than fifty volunteers"}]},
 {skill:"Vocabulary in context", para:"B", q:[
  {stem:"In paragraph B, \"volunteers\" are people who…", opts:["work without pay to help others","are paid by the city to clean the streets","live near the canal","teach at a school"],
   hint:"Find \"volunteers\" in paragraph B. Then look at paragraph E: are they paid?", focus:"there were more than fifty volunteers",
   explain:"The answer is \"work without pay to help others\". Paragraph E says \"They are not paid.\""},
  {stem:"In paragraph B, \"exhausting\" means…", opts:["very tiring","very boring","very quick","very dangerous"],
   hint:"Find \"exhausting\" in paragraph B. How long did the work take?", focus:"It was exhausting, and it took them the whole day."},
  {stem:"In paragraph B, \"gruelling\" means…", opts:["extremely tiring","very dirty","badly organised","surprisingly easy"],
   hint:"Find \"gruelling\" in paragraph B. The work \"took the entire day\".", focus:"The work was gruelling and took the entire day."}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two things the volunteers did to help the neighbourhood.", groups:VOL_WHAT, need:2,
   hint:"Look in paragraphs B and C.", focus:"They planted trees along the canal",
   explain:"Possible answers (any two): they cleaned the canal; they planted trees; they painted a picture on a wall; they started a homework club."},
  {type:"short", stem:"Give two projects the group has taken on since cleaning the canal.", groups:VOL_WHAT, need:2,
   hint:"Paragraph C: trees, a wall and a club.", focus:"Its members have planted trees along the canal and turned an ugly grey wall into a colourful mural of fish and birds."},
  {type:"short", stem:"Identify two ways in which the group's ambitions have expanded.", groups:VOL_WHAT, need:2,
   hint:"Paragraph C lists the new projects.", focus:"Members have lined the canal with trees and transformed a drab grey wall into a vivid mural of fish and birds"}]},
 {skill:"Inference", para:"F", q:[
  {stem:"What does Linh want readers to understand?", opts:["Anybody can start to help their neighbourhood.","Only rich people can help their neighbourhood.","You need a big plan before you start.","Cleaning canals is the most important job."],
   hint:"Read what Linh says in paragraph F.", focus:"Linh thinks anyone can make a difference.",
   explain:"The answer is \"Anybody can start to help their neighbourhood.\" Linh says you don't need money or a big plan."},
  {stem:"What can we infer from the last sentence of paragraph F?", opts:["Local people now enjoy using the canal area.","Families now clean the canal themselves every evening.","The canal is now closed to visitors.","Linh's family lives next to the canal."],
   hint:"Compare paragraph A (nobody wanted to go near it) with the last sentence of F.", focus:"every evening it is full of families out for a walk"},
  {stem:"What does the phrase \"a ripple effect\" suggest about the volunteers' work?", opts:["A small start led to wider and wider changes.","The project was mainly about water.","The changes were only temporary.","The volunteers copied another group's project."],
   hint:"When you drop a stone in water, small waves spread out. How does that match the story?", focus:"a ripple effect that began with six teenagers and a few rubbish bags"}]},
 {skill:"Cause and effect", para:"D", q:[
  {type:"short", stem:"What was the problem with the bored teenagers, and what changed after the football club started?", groups:[GANG_BEFORE,GANG_AFTER], need:2,
   hint:"Look in paragraph D. Find the problem, then read what the shop owner says.", focus:"\"Now the boys have somewhere to go,\" says a local shop owner. \"There is much less trouble.\"",
   explain:"Possible answers: there were gangs and some violence at night; now there is much less trouble."},
  {type:"short", stem:"Explain the problem in paragraph D and the effect of the football club.", groups:[GANG_BEFORE,GANG_AFTER], need:2,
   hint:"Paragraph D: what was happening at night, and what does the shop owner say now?", focus:"gangs of bored teenagers hung around the area, and there were occasional outbreaks of violence at night"},
  {type:"short", stem:"Describe the social problem in paragraph D and how the football club affected it.", groups:[GANG_BEFORE,GANG_AFTER], need:2,
   hint:"Paragraph D: \"A few years ago…\" and \"marked a turning point\".", focus:"The launch of an evening football club marked a turning point."}]},
 {skill:"Writer's purpose", para:"E", q:[
  {stem:"Why does the writer include what Minh says?", opts:["To show why the volunteers like helping","To show that Minh is the leader of the group","To explain how to clean a canal","To show that the volunteers are paid"],
   hint:"Look in paragraph E. The paragraph starts with a question.", focus:"Why do the volunteers do it?",
   explain:"The answer is \"To show why the volunteers like helping\". Minh gives his reasons: new friends and feeling proud."},
  {stem:"What is the purpose of paragraph E?", opts:["To explain what the volunteers get from their work","To describe the next project the group is planning","To show that the work is too hard for teenagers","To list the people who pay for the project"],
   hint:"Paragraph E begins with a question. What does it answer?", focus:"None of the volunteers is paid, so why do they do it?"},
  {stem:"What role do the quotations in paragraph E play?", opts:["They answer the question of what motivates unpaid volunteers.","They show that the volunteers strongly disagree about the whole project.","They criticise people who don't volunteer.","They introduce the shopkeeper's opinion."],
   hint:"Paragraph E raises a question in its first sentence. What do Minh's and others' words do?", focus:"which raises the question of what motivates them"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"How does the writer feel about the volunteers?", opts:["Positive: they have done something good","Negative: they are too young","Worried: the work is too dangerous for them","Bored: it is not interesting"],
   hint:"Read paragraph F. What is the canal like now?", focus:"Today, the canal is clean, and families walk there every evening.",
   explain:"The answer is \"Positive: they have done something good\". The writer ends by showing the clean canal full of families."},
  {stem:"What is the writer's attitude to the group's work?", opts:["Admiring","Critical","Uncertain","Amused"],
   hint:"Paragraph F: how does the writer describe the canal today compared with paragraph A?", focus:"Today, the canal is clean, and every evening it is full of families out for a walk."},
  {stem:"How does the writer's final sentence support Linh's view?", opts:["It shows how much grew from a very small beginning.","It suggests her view is too optimistic.","It shows that only large groups can succeed.","It questions whether the changes will really last for long."],
   hint:"Linh says to \"start with one small thing\". What does the final sentence say began with six teenagers?", focus:"a ripple effect that began with six teenagers and a few rubbish bags"}]}
];

/* ---------- 4. Can money buy happiness? ---------- */
const HAPPY_THINGS = [
 {label:"friends and family / relationships", k:["friend","family","relationship","people","support"]},
 {label:"health / healthcare", k:["health","healthy","healthcare","life expectancy","doctor"]},
 {label:"trust / honest government", k:["trust","honest","corrupt","government"]},
 {label:"free time / freedom", k:["free time","freedom","choice","choose","time"]},
 {label:"nature", k:["nature","forest","outside","green"]}];
const GDP_PROBLEM = [
 {label:"doesn't show if people are happy", k:["happy","happiness","feel","well-being"]},
 {label:"doesn't show how money is shared / inequality", k:["share","shared","rich","poor","inequality","equal","few people"]},
 {label:"counts bad things too (pollution, accidents)", k:["pollution","accident","bad","damage","forest","cut down"]}];

const HAPPY_LEVELS = [
 { title:"Can money buy happiness?", paras:[
  ["A","How do we know if a country is doing well? For a long time, people looked at one number: GDP. GDP shows the value of everything a country makes and sells in a year. If GDP goes up, people say the country is getting richer. But does more money mean that people are happier?"],
  ["B","GDP has some problems. It does not tell us how the money is shared. In some countries, a few people have most of the wealth, and many people are poor. GDP also counts some bad things. For example, if a company cuts down a forest and sells the wood, GDP goes up."],
  ["C","Every year, a big survey called the World Happiness Report asks people in more than 140 countries how happy they are. The happiest countries are not always the richest ones. For years, Finland has been at the top. It is a rich country, but other countries have a higher income per capita."],
  ["D","So why are Finns so happy? Experts say it is not only about money. People in Finland trust each other and their government. Healthcare and education are free, and life expectancy is high. People also have a lot of free time, and they love spending it in nature, in the forests and by the lakes."],
  ["E","The small country of Bhutan, in the Himalayas, has a different idea. It measures \"Gross National Happiness\". The government asks people about their health, their free time, their community and the environment. It uses the answers to make decisions."],
  ["F","Money is important. People need enough income for food, a home and healthcare. But after that, more money does not make people much happier. Friends, family, health and trust matter more. Maybe every country should ask its people: \"Are you happy?\""]],
  gloss:"survey: a set of questions that many people answer · trust: believe that someone is honest" },
 { title:"Can money buy happiness?", paras:[
  ["A","How can we tell whether a country is doing well? For decades, the answer has been a single number: GDP, the total value of all the goods and services a country produces in a year. When GDP rises, we say the economy is growing and the country is getting richer. But does a richer country mean happier people?"],
  ["B","GDP has some serious weaknesses. For one thing, it says nothing about how wealth is shared. In some countries, a small group of people own most of the wealth, while millions remain poor. GDP can also rise because of harmful activities. If a forest is cut down and the wood is sold, for example, GDP goes up, even though something valuable has been lost."],
  ["C","Each year, the World Happiness Report asks people in more than 140 countries how satisfied they are with their lives. Interestingly, the happiest nations are not always the richest. Finland has topped the list for several years in a row, yet several countries have a higher income per capita."],
  ["D","So what is Finland's secret? According to researchers, it is not simply money. Finns tend to trust one another and their government. Healthcare and education are free, and life expectancy is high. People also enjoy a good balance between work and free time, much of which they spend in nature, among the country's forests and lakes."],
  ["E","Bhutan, a small kingdom in the Himalayas, has gone even further. Instead of focusing only on GDP, it measures \"Gross National Happiness\". Government surveys ask citizens about their health, their free time, their community and the environment, and the results help shape government decisions."],
  ["F","None of this means that money doesn't matter. People need a sufficient income for food, housing and healthcare. However, once those needs are met, extra money seems to add surprisingly little to happiness. Relationships, health and trust appear to matter far more. Perhaps every government should regularly ask its people a simple question: \"Are you happy?\""]],
  gloss:"goods and services: things people make and work they do for money · citizen: a person who belongs to a country" },
 { title:"Measuring what matters", paras:[
  ["A","How should we judge whether a nation is flourishing? For decades, the default answer has been a single figure: gross domestic product, or GDP, the total value of goods and services an economy produces in a year. A rising GDP is routinely equated with progress and prosperity. Yet it is far from obvious that a wealthier nation is a happier one."],
  ["B","As a measure of well-being, GDP has well-known blind spots. It reveals nothing about how wealth is distributed; a country may post impressive growth while most of the gains flow to a small elite. Nor does it distinguish between beneficial and harmful activity: felling a forest and selling the timber adds to GDP, even though something irreplaceable has been destroyed."],
  ["C","The annual World Happiness Report takes a different approach, asking people in more than 140 countries how satisfied they are with their lives. Its findings are striking: the happiest nations are not necessarily the wealthiest. Finland has headed the rankings for several consecutive years, although a number of countries outstrip it in income per capita."],
  ["D","Researchers attribute Finland's success to factors that money alone cannot buy. Levels of trust, both between citizens and in public institutions, are high. Healthcare and education are free at the point of use, and life expectancy is long. Finns also enjoy a healthy balance between work and leisure, much of it spent in the forests and lakes that cover the country."],
  ["E","Bhutan, a small Himalayan kingdom, has taken the idea further still, officially measuring \"Gross National Happiness\" alongside GDP. Its surveys ask citizens about their health, use of time, community life and environment, and the findings are intended to inform government policy."],
  ["F","None of this implies that income is irrelevant. People need sufficient means to secure food, shelter and healthcare, and poverty undoubtedly causes misery. Beyond that threshold, however, additional wealth appears to yield diminishing returns, while relationships, health and trust matter far more. There is a case, then, for governments to measure not only what their citizens earn, but how their lives are actually going."]],
  gloss:"elite: a small, powerful group · consecutive: one after another · diminishing returns: smaller and smaller benefits" }
];

const HAPPY_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["Whether being rich makes a country happy","How to become rich and famous quickly","The history of money in Europe and Asia","How to travel to Finland and Bhutan"],
   hint:"Read the question at the end of paragraph A.", focus:"But does more money mean that people are happier?",
   explain:"The answer is \"Whether being rich makes a country happy\". The text asks this question in A and answers it in F."},
  {stem:"What question does the text try to answer?", opts:["Does a richer country mean happier people?","How is GDP calculated each year?","Which country has the most forests and lakes?","Why do people in Bhutan work so hard?"],
   hint:"Paragraph A ends with the main question.", focus:"But does a richer country mean happier people?"},
  {stem:"Which statement best summarises the article?", opts:["GDP is a limited measure of progress, and happiness depends on more than income.","GDP is completely useless and should never be measured again by any government in the world.","Finland is the richest country in the world.","Bhutan's economy grows faster than Finland's."],
   hint:"The summary needs the problem with GDP (A–B), the examples (C–E) and the conclusion (F).", focus:"Yet it is far from obvious that a wealthier nation is a happier one."}]},
 {skill:"Detail", para:"C", q:[
  {stem:"Which country has been at the top of the World Happiness Report for years?", opts:["Finland","Bhutan","Viet Nam","The country with the highest GDP"],
   hint:"Look in paragraph C. Find \"at the top\".", focus:"For years, Finland has been at the top.",
   explain:"The answer is \"Finland\". Paragraph C says \"For years, Finland has been at the top.\""},
  {stem:"According to paragraph C, what does the World Happiness Report ask people?", opts:["How satisfied they are with their lives","How much money they earn","How many hours they work each week","Which country they would like to live in"],
   hint:"Find \"asks people\" in paragraph C.", focus:"asks people in more than 140 countries how satisfied they are with their lives"},
  {stem:"According to paragraph C, what is \"striking\" about the report's findings?", opts:["The happiest countries are not necessarily the richest.","Finland is the richest country in the world.","People in rich countries are always less happy than people in poor ones.","Fewer countries take part every year."],
   hint:"Paragraph C: read the sentence after \"Its findings are striking\".", focus:"the happiest nations are not necessarily the wealthiest"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"life expectancy\" means…", opts:["how long people usually live","how much money people earn","how happy people are","how many people live in a country"],
   hint:"Find \"life expectancy\" in paragraph D. It is \"high\". Think about healthcare.", focus:"life expectancy is high",
   explain:"The answer is \"how long people usually live\". With free healthcare, people in Finland live a long time, so life expectancy is high."},
  {stem:"In paragraph D, \"trust\" means…", opts:["believe that others are honest and reliable","be afraid of other people","pay money to the government","work for a long time without stopping for a rest"],
   hint:"Find \"trust\" in paragraph D. Is it a positive or negative thing in Finland?", focus:"Finns tend to trust one another and their government."},
  {stem:"In paragraph D, \"leisure\" means…", opts:["free time","hard work","health","money"],
   hint:"Find \"a healthy balance between work and leisure\". What is the opposite of work?", focus:"a healthy balance between work and leisure"}]},
 {skill:"Detail: two points", para:"D", q:[
  {type:"short", stem:"Write two reasons why people in Finland are happy.", groups:HAPPY_THINGS, need:2,
   hint:"Look in paragraph D.", focus:"People in Finland trust each other and their government.",
   explain:"Possible answers (any two): they trust each other; healthcare is free; they have a lot of free time; they spend time in nature."},
  {type:"short", stem:"Give two reasons for Finland's happiness, according to paragraph D.", groups:HAPPY_THINGS, need:2,
   hint:"Paragraph D: trust, free services, and how people spend their time.", focus:"Healthcare and education are free, and life expectancy is high."},
  {type:"short", stem:"Identify two factors that researchers link to Finland's high happiness.", groups:HAPPY_THINGS, need:2,
   hint:"Paragraph D lists factors \"that money alone cannot buy\".", focus:"Levels of trust, both between citizens and in public institutions, are high."}]},
 {skill:"Inference", para:"C", q:[
  {stem:"What does paragraph C tell us about money and happiness?", opts:["The richest countries are not always the happiest.","Rich countries are always happy.","Poor countries are always happy.","Finland is the richest country in the world."],
   hint:"Look in paragraph C. Is Finland the richest country?", focus:"The happiest countries are not always the richest ones.",
   explain:"The answer is \"The richest countries are not always the happiest.\" Finland is the happiest, but other countries have a higher income per capita."},
  {stem:"What can we infer from the fact that Finland tops the list?", opts:["Things other than income affect how happy people are.","Finland's GDP is now the highest of any country in the world.","Finns work longer hours than other people.","Other countries did not take part in the report."],
   hint:"Paragraph C: Finland is happiest, \"yet\" what about its income?", focus:"yet several countries have a higher income per capita"},
  {stem:"What does the word \"outstrip\" imply about Finland in paragraph C?", opts:["Some countries are richer than Finland but less happy.","Finland is richer than every other country in the whole world.","Finland is less happy than its neighbours.","Finland's income is falling."],
   hint:"Paragraph C: a number of countries \"outstrip it in income per capita\". Are they also at the top for happiness?", focus:"a number of countries outstrip it in income per capita"}]},
 {skill:"Cause and effect", para:"B", q:[
  {type:"short", stem:"Write two problems with using GDP to measure a country.", groups:GDP_PROBLEM, need:2,
   hint:"Look in paragraphs A and B.", focus:"It does not tell us how the money is shared.",
   explain:"Possible answers (any two): it doesn't show how the money is shared; it counts bad things like cutting down forests; it doesn't show if people are happy."},
  {type:"short", stem:"Give two weaknesses of GDP mentioned in paragraph B.", groups:GDP_PROBLEM, need:2,
   hint:"Paragraph B: \"For one thing…\" and \"GDP can also rise…\".", focus:"For one thing, it says nothing about how wealth is shared."},
  {type:"short", stem:"Identify two \"blind spots\" of GDP as a measure of well-being.", groups:GDP_PROBLEM, need:2,
   hint:"Paragraph B: one is about distribution, the other is about harmful activity.", focus:"It reveals nothing about how wealth is distributed"}]},
 {skill:"Writer's purpose", para:"E", q:[
  {stem:"Why does the writer talk about Bhutan?", opts:["To give an example of a country that measures happiness","To tell readers to visit the Himalayas on holiday","To show that Bhutan has become a very rich country in Asia","To explain how to climb mountains safely"],
   hint:"Look in paragraph E. What does Bhutan measure?", focus:"It measures \"Gross National Happiness\".",
   explain:"The answer is \"To give an example of a country that measures happiness\". Bhutan measures \"Gross National Happiness\", not only GDP."},
  {stem:"Why does the writer include the example of Bhutan in paragraph E?", opts:["To show a government that uses happiness to guide decisions","To compare the size of Bhutan and Finland","To criticise Bhutan's government for many of its recent decisions","To describe the history of the Himalayas"],
   hint:"Paragraph E: what do the survey results help to do?", focus:"the results help shape government decisions"},
  {stem:"How does paragraph E develop the argument of the article?", opts:["It shows a country that has turned the idea of measuring happiness into policy.","It provides evidence that GDP is the best measure.","It explains why Finland is happier than Bhutan.","It introduces the writer's main criticism of all the international happiness surveys."],
   hint:"Paragraph E: Bhutan \"has taken the idea further still\". What does it do with the findings?", focus:"the findings are intended to inform government policy"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about money?", opts:["It is important, but other things matter more for happiness.","It is the most important thing in life for everyone, everywhere.","It is not important at all for anyone.","It always makes people unhappy."],
   hint:"Read paragraph F. Find \"Money is important\" and \"But\".", focus:"Friends, family, health and trust matter more.",
   explain:"The answer is \"It is important, but other things matter more for happiness.\" The writer says people need enough money, but after that friends, family, health and trust matter more."},
  {stem:"What does the writer suggest governments should do?", opts:["Ask people regularly whether they are happy","Stop measuring GDP completely and forever, starting next year","Give everyone more money every year","Copy everything that Finland does"],
   hint:"Read the last sentence of paragraph F.", focus:"Perhaps every government should regularly ask its people a simple question"},
  {stem:"Which statement best reflects the writer's conclusion?", opts:["Governments should measure well-being as well as income.","Governments should ignore income completely.","Poverty is not a real problem in rich countries.","Happiness surveys are more reliable than GDP in every way."],
   hint:"Paragraph F: \"not only what their citizens earn, but…\". Avoid answers with \"completely\" or \"every way\".", focus:"There is a case, then, for governments to measure not only what their citizens earn"}]}
];

export const UNIT3_TEXTS = [
  { id: "s8-carfree", unitNo: 3, unit: U, topic: "The street without cars", blurb: "What happens when a whole neighbourhood decides to live without cars?", levels: CARFREE_LEVELS, slots: CARFREE_SLOTS },
  { id: "s8-city", unitNo: 3, unit: U, topic: "City or country?", blurb: "Two cousins, one from the city and one from a village, compare their lives.", levels: CITY_LEVELS, slots: CITY_SLOTS },
  { id: "s8-volunteers", unitNo: 3, unit: U, topic: "Small actions, big difference", blurb: "How six teenagers with rubbish bags changed their neighbourhood.", levels: VOL_LEVELS, slots: VOL_SLOTS },
  { id: "s8-happy", unitNo: 3, unit: U, topic: "Can money buy happiness?", blurb: "Is the richest country always the happiest one?", levels: HAPPY_LEVELS, slots: HAPPY_SLOTS }
];
