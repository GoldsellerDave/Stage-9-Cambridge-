// Stage 8 unit mini tests, in the same format as js/minitests.js: a new short text, a new recording, and the unit's words
// and grammar. The first option is correct (shuffled on screen). Recordings: tools/make_listening_audio.py --google m8-...
const NARRATOR = "bm_george";

export const MINI_LISTENING = [
 { id: "m8-2-treehouse", unitNo: 2, topic: "A hotel in the trees",
   voices: { NARRATOR, PRESENTER: "bf_isabella", OWNER: "bm_daniel" },
   lines: [
   ["NARRATOR", "You will hear a radio interview with the owner of a tree house hotel. For each question, choose the correct answer."],
   ["PRESENTER", "This week on Amazing Places, I'm talking to Mr Khanh, who owns a hotel built in the trees. Mr Khanh, where did the idea come from?"],
   ["OWNER", "When I was a boy, my father built me a tree house in our garden. I spent every afternoon up there. So when I bought this land in the forest, I thought: if adults could stay in a tree house, they'd love it as much as I did."],
   ["PRESENTER", "How many rooms are there?"],
   ["OWNER", "There are eight tree houses now. We started with three, and we built five more last year. Each one is about six metres above the ground, and they're joined by wooden bridges."],
   ["PRESENTER", "Did you have to cut down any trees?"],
   ["OWNER", "Not a single one. That was my most important rule. The houses are built around the trunks, and we used wood from old fallen trees. The roofs are covered in leaves, so from the ground you can hardly see them."],
   ["PRESENTER", "Is it comfortable?"],
   ["OWNER", "Very. There's hot water and electricity from solar panels. The only thing we don't have is wifi. Some guests complain at first, but by the second day most of them say it's the best part of their holiday."]] },
 { id: "m8-3-market", unitNo: 3, topic: "Saving the night market",
   voices: { NARRATOR, REPORTER: "bf_emma", STUDENT: "af_heart" },
   lines: [
   ["NARRATOR", "You will hear a reporter talking to a student about a night market. For each question, choose the correct answer."],
   ["REPORTER", "I'm at the Saturday night market with Hanh, who is thirteen. Hanh, last year this market almost closed, didn't it?"],
   ["STUDENT", "Yes. Fewer people were coming, and the stall holders weren't earning enough money. Lots of families in our neighbourhood depend on it, so my class decided to do something."],
   ["REPORTER", "What did you do?"],
   ["STUDENT", "We made videos about the stall holders, like Mrs Lan, who has sold spring rolls here for thirty years, and we shared them online. We also asked the council to close the street to traffic on Saturday nights."],
   ["REPORTER", "And did it work?"],
   ["STUDENT", "Yes! The number of visitors has doubled. The street is car-free now, so families with small children feel safe here. A new playground is being built at the end of the street too."],
   ["REPORTER", "What have you learnt?"],
   ["STUDENT", "That young people can make a difference. Before, I thought only adults could change things. Now I know that if enough people care about something, it can be saved."]] },
 { id: "m8-4-slogan", unitNo: 4, topic: "The slogan competition",
   voices: { NARRATOR, TEACHER: "bm_daniel" },
   lines: [
   ["NARRATOR", "You will hear a teacher talking to students about a competition. For each question, choose the correct answer."],
   ["TEACHER", "Listen, everyone. The city's new water park is holding a competition for students. They want a slogan for their advertising campaign, and the winning slogan will be printed on posters all over the city."],
   ["TEACHER", "Your slogan must be no longer than eight words. It should be easy to remember, and it must not mention any other company. Last year's winner was only four words long, so short is good."],
   ["TEACHER", "You also need to draw a simple poster to go with it. You don't need to be a great artist. The judges are much more interested in the idea than in the drawing."],
   ["TEACHER", "Entries must be given to me by Friday, not sent to the water park, because I'll send them all together. The prize is a year's free entry to the park for the winner and their family."],
   ["TEACHER", "Oh, and one more thing. The park's target audience is families with young children, so think about what parents and little kids would like, not just people your age."]] }
];

export const MINI = {
 2: { id: "mini-u2", unit: 2, title: "Unit 2 checkpoint",
  reading: { title: "The school that keeps itself cool", paras: [
   ["A", "In many hot countries, schools rely on air conditioning to keep classrooms cool. But a new school in the south of the country has almost none, and its classrooms are some of the coolest in the city."],
   ["B", "The secret is the design. The building faces north, so the sun never shines straight into the classrooms. The walls are thick and made of local clay bricks, which stay cool during the day. Above each room, a curved roof lets hot air rise and escape."],
   ["C", "The architect, Ms Tran, spent a year studying traditional houses in the area before she drew a single plan. \"Our grandparents knew how to live without machines,\" she says. \"I simply borrowed their ideas and made them work for a modern building.\""],
   ["D", "The school uses about sixty per cent less electricity than other schools of the same size. Teachers say students are calmer in the afternoon. \"If every new school were built like this,\" says the head teacher, \"we would save a fortune.\""]],
   gloss: "rely on: need something in order to work",
   qs: [
    { skill: "Main idea", stem: "What is the text mainly about?", opts: ["A school designed to stay cool without machines", "Why air conditioning is bad for students", "How to make bricks from local clay", "The life of a famous architect"] },
    { skill: "Detail", stem: "Why does the sun never shine straight into the classrooms?", opts: ["The building faces north.", "The windows are very small.", "The roof is made of clay bricks.", "Trees grow around the school."] },
    { skill: "Detail", stem: "What did Ms Tran do before she drew the plans?", opts: ["She studied old houses in the area.", "She visited schools in other countries.", "She asked students for their ideas.", "She tested different air conditioners."] },
    { skill: "Inference", stem: "What does the head teacher suggest in paragraph D?", opts: ["Other new schools should follow this design.", "The school is too expensive to build.", "Students should stay at school in the afternoon.", "The school needs more electricity."] }] },
  listening: { id: "m8-2-treehouse", qs: [
    { skill: "Listening", stem: "Where did Mr Khanh get the idea for the hotel?", opts: ["From the tree house he had as a child", "From a hotel he stayed in abroad", "From a book about forests", "From his son's school project"] },
    { skill: "Listening", stem: "How many tree houses are there now?", opts: ["Eight", "Three", "Five", "Six"] },
    { skill: "Listening", stem: "What was Mr Khanh's most important rule?", opts: ["No trees could be cut down.", "Every house must have a bridge.", "All the wood had to be new.", "The houses had to be easy to see."] },
    { skill: "Listening", stem: "What do most guests think about having no wifi?", opts: ["They end up enjoying it.", "They complain all week.", "They leave early because of it.", "They don't notice it."] }] },
  vocab: [
    { word: "balcony", stem: "We sat on the ___ and looked down at the street below.", opts: ["balcony", "log", "hemisphere", "landscape"] },
    { word: "traditional", stem: "My grandparents live in a ___ wooden house that is over a hundred years old.", opts: ["traditional", "hexagonal", "practical", "resistant"] },
    { word: "curved", stem: "The bridge isn't straight. It's ___, like a rainbow.", opts: ["curved", "hilly", "handmade", "average"] },
    { word: "efficiency", stem: "The new windows improve the ___ of the building, so it uses less energy.", opts: ["efficiency", "facade", "tower", "penthouse"] }],
  grammar: [
    { point: "2.1", stem: "Could you give me a ___ of paper, please?", opts: ["sheet", "slice", "bar", "cup"] },
    { point: "2.2", stem: "If I ___ a garden, I would grow my own vegetables.", opts: ["had", "have", "will have", "would have"] },
    { point: "2.4", stem: "That's the architect with ___ my father works.", opts: ["whom", "who", "that", "which"] },
    { point: "2.6", stem: "In ___ city was the tower built?", opts: ["which", "who", "whom", "where"] }] },
 3: { id: "mini-u3", unit: 3, title: "Unit 3 checkpoint",
  reading: { title: "The walking bus", paras: [
   ["A", "Every morning at seven, a line of children in bright yellow jackets sets off from the corner of Lotus Street. This is the \"walking bus\": a group of children who walk to school together, with two parent volunteers at the front and back."],
   ["B", "The idea started two years ago, when traffic congestion outside the school gate became so bad that parents were afraid to let their children walk. Instead of driving them, a few families decided to walk together. Now more than forty children join the walking bus on four different routes."],
   ["C", "The results have surprised everyone. There are far fewer cars outside the school, the air is cleaner, and teachers say the children arrive awake and ready to learn. Older residents wave from their windows, and some have even started volunteering themselves."],
   ["D", "Not every family can take part. Some live too far away, and others have to drop younger children at a different school. But the organisers hope that if the city built more safe pavements, many more children could walk."]],
   gloss: "resident: a person who lives in a place",
   qs: [
    { skill: "Main idea", stem: "What is the text mainly about?", opts: ["A way for children to walk to school safely together", "A new bus service for a primary school", "Why parents drive their children to school", "How to volunteer in your neighbourhood"] },
    { skill: "Cause and effect", stem: "Why did the walking bus start?", opts: ["There was too much traffic outside the school.", "The school bus was too expensive.", "The children wanted more exercise.", "A teacher asked parents to help."] },
    { skill: "Detail", stem: "What have some older residents done?", opts: ["They have become volunteers.", "They have complained about noise.", "They have stopped driving.", "They have moved to Lotus Street."] },
    { skill: "Writer's view", stem: "What do the organisers think in paragraph D?", opts: ["Better pavements would help more children walk.", "The walking bus should stop soon.", "Every family must take part.", "Younger children should not walk."] }] },
  listening: { id: "m8-3-market", qs: [
    { skill: "Listening", stem: "Why did the night market almost close?", opts: ["Not enough people were coming.", "The council wanted to build a playground.", "The street was too dangerous.", "Mrs Lan retired."] },
    { skill: "Listening", stem: "What did Hanh's class do first?", opts: ["They made videos about the stall holders.", "They sold spring rolls at the market.", "They built a new playground.", "They wrote to a newspaper."] },
    { skill: "Listening", stem: "Why do families with small children feel safe at the market now?", opts: ["There are no cars in the street.", "There are more police officers.", "The market closes earlier.", "Parents work at the stalls."] },
    { skill: "Listening", stem: "What has Hanh learnt?", opts: ["Young people can change things.", "Only adults can solve problems.", "Markets are better than shops.", "Videos are easy to make."] }] },
  vocab: [
    { word: "neighbourhood", stem: "There's a small park and a market in our ___.", opts: ["neighbourhood", "income", "gang", "healthcare"] },
    { word: "volunteer", stem: "She works as a ___ at the hospital. She doesn't get paid.", opts: ["volunteer", "population", "crime", "wealth"] },
    { word: "lively", stem: "The square is quiet in the morning, but very ___ at night.", opts: ["lively", "narrow", "car-free", "per capita"] },
    { word: "community spirit", stem: "Everyone helped to clean the street. There's great ___ here.", opts: ["community spirit", "traffic congestion", "life expectancy", "social problem"] }],
  grammar: [
    { point: "3.1", stem: "Who did you go to the street party ___?", opts: ["with", "to", "at", "on"] },
    { point: "3.3", stem: "You won't get a seat ___ you arrive early.", opts: ["unless", "if", "when", "because"] },
    { point: "3.4", stem: "Thank you for ___ us plant the trees.", opts: ["helping", "help", "to help", "helped"] },
    { point: "3.6", stem: "A new bridge ___ across the river at the moment.", opts: ["is being built", "is building", "is been built", "being built"] }] },
 4: { id: "mini-u4", unit: 4, title: "Unit 4 checkpoint",
  reading: { title: "The juice that nobody wanted", paras: [
   ["A", "In 2019, a small company in Da Lat made a new strawberry juice. It tasted wonderful, and it was cheaper than other brands. But in its first year, almost nobody bought it."],
   ["B", "The problem was the bottle. It was plain and grey, and the name was printed in tiny letters. On a supermarket shelf next to bright, colourful brands, shoppers simply didn't see it."],
   ["C", "So the company asked a group of art students for help. The students designed a new bottle shaped like a strawberry, with a short slogan: \"Picked this morning.\" They also suggested selling the juice at the checkout, where shoppers have time to look around."],
   ["D", "Within six months, sales had increased five times. The juice itself was exactly the same. \"It taught us a lesson,\" says the company's owner. \"People don't just buy a product. They buy what they see.\""]],
   gloss: "plain: simple, without patterns or decoration",
   qs: [
    { skill: "Main idea", stem: "What is the text mainly about?", opts: ["How a new design helped a product to sell", "How strawberry juice is made in Da Lat", "Why supermarkets sell cheap juice", "How art students start their own companies"] },
    { skill: "Detail", stem: "Why didn't shoppers buy the juice at first?", opts: ["They didn't notice it on the shelf.", "It was more expensive than others.", "It didn't taste very good.", "Supermarkets didn't sell it."] },
    { skill: "Detail", stem: "Where did the students suggest selling the juice?", opts: ["At the checkout", "Next to the fruit", "On the top shelf", "Outside the supermarket"] },
    { skill: "Inference", stem: "What does the owner mean in paragraph D?", opts: ["The way a product looks is very important.", "The company should change the juice.", "Shoppers can't see very well.", "Art students are better than business people."] }] },
  listening: { id: "m8-4-slogan", qs: [
    { skill: "Listening", stem: "What will happen to the winning slogan?", opts: ["It will be printed on posters.", "It will be shown on TV.", "It will be used for a song.", "It will be written on tickets."] },
    { skill: "Listening", stem: "What is the longest a slogan can be?", opts: ["Eight words", "Four words", "Six words", "Ten words"] },
    { skill: "Listening", stem: "What are the judges most interested in?", opts: ["The idea", "The drawing", "The colours", "The handwriting"] },
    { skill: "Listening", stem: "Who is the water park's target audience?", opts: ["Families with young children", "Teenagers", "Older people", "Students' teachers"] }] },
  vocab: [
    { word: "slogan", stem: "\"Picked this morning\" is the ___ on the new juice bottle.", opts: ["slogan", "trolley", "aisle", "squash"] },
    { word: "checkout", stem: "We paid for our shopping at the ___.", opts: ["checkout", "hoarding", "endorsement", "marketing"] },
    { word: "target audience", stem: "The ___ for this toy is children aged three to five.", opts: ["target audience", "brand loyalty", "print media", "digital marketing"] },
    { word: "resist", stem: "The cakes looked so good that I couldn't ___ buying one.", opts: ["resist", "deserve", "tempt", "advertise"] }],
  grammar: [
    { point: "4.1", stem: "I saw the advert ___ TV last night.", opts: ["on", "in", "at", "by"] },
    { point: "4.2", stem: "This famous slogan ___ in 1988.", opts: ["was written", "is written", "wrote", "was write"] },
    { point: "4.4", stem: "We made the poster ___. Nobody helped us.", opts: ["ourselves", "ourself", "us", "our"] },
    { point: "4.6", stem: "It's a ___ brand. Everyone knows it.", opts: ["well-known", "well-knowing", "good-known", "well-knew"] }] }
};
