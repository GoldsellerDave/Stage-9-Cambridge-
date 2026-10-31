// Stage 8 · Unit 4 · Advertising: four practice texts.
// Same format as js/texts-u2.js: three levels with the same paragraph letters, eight slots, first MCQ option correct.
const U = "Unit 4 · Advertising";

/* ---------- 1. The supermarket knows you ---------- */
const SHELF_TRICKS = [
 {label:"expensive brands at eye level", k:["eye level","expensive","brand"]},
 {label:"cheaper products on the bottom shelf", k:["bottom","cheap"]},
 {label:"sweets at children's eye level", k:["children","sweet","cereal","kids"]},
 {label:"slow music", k:["music","slow"]},
 {label:"smell of bread", k:["bread","smell","bake","hungry"]}];
const LC_SHOPPER = {ask:"What does the shopper get from a loyalty card?", label:"points / a discount", k:["point","discount","cheaper","money off","save"]};
const LC_SHOP = {ask:"What does the supermarket get?", label:"information about what you buy", k:["information","data","what you buy","what they buy","learn","know what","offer"]};

const SHOP_LEVELS = [
 { title:"The supermarket knows you", paras:[
  ["A","You go to the supermarket to buy some milk. Twenty minutes later, you come out with a full trolley and no money. Does this sound familiar? It isn't an accident. Supermarkets are carefully designed to tempt you to buy more."],
  ["B","Think about where the milk, bread and eggs are. They are usually at the back of the shop. These are essential things that everyone needs, so you have to walk past hundreds of other products to get them. On the way, you see things you didn't plan to buy."],
  ["C","The shelves are planned too. The most expensive brands are at eye level, where you look first. Cheaper products are on the bottom shelf. Sweets and colourful cereals are low down, at children's eye level. Some shops also play slow music, so you walk slowly and buy more. Many shops bake bread near the door, because the smell makes people hungry."],
  ["D","The checkout is the last trick. While you wait in the queue, you are tired and bored. Next to you there are chocolate bars, sweets and bottles of squash. It is hard to resist them, especially for children. Some signs even say, \"You deserve a treat!\""],
  ["E","Many supermarkets also have loyalty cards. Every time you shop, you get points, and later you get a discount. But the supermarket gets something too: information. It learns what you buy and when, and then it sends you special offers. This helps build brand loyalty, so you keep coming back."],
  ["F","So how can you resist? Make a shopping list and buy only what is on it. Don't go shopping when you are hungry. Take a basket, not a big trolley. Supermarkets are not bad places, but it is good to know their tricks. Then you can choose what you buy."]],
  gloss:"trolley: a big basket on wheels · aisle: a path between shelves · squash: a sweet fruit drink" },
 { title:"The supermarket knows you", paras:[
  ["A","You pop into the supermarket for a carton of milk. Twenty minutes later, you are pushing a full trolley to the checkout and wondering where all your money went. Sound familiar? It isn't bad luck. Supermarkets are carefully designed to tempt you into spending more than you planned."],
  ["B","Start with the layout. Essential items such as milk, bread and eggs are almost always at the back of the shop. Because everyone needs them, shoppers have to walk down several aisles to reach them, passing hundreds of other products on the way. Many of those products end up in the trolley."],
  ["C","Even the shelves follow a plan. The most expensive brands are placed at eye level, where shoppers look first, while cheaper ones are hidden on the bottom shelf. Sweets and brightly coloured cereals sit lower down, exactly at children's eye level. Some shops play slow music to make customers walk more slowly, and many bake bread near the entrance because the smell makes people feel hungry."],
  ["D","The final trick is waiting at the checkout. Standing in the queue, customers are often tired and bored, and they are surrounded by chocolate bars, sweets and bottles of squash. These small, cheap items are hard to resist, especially for children. A sign nearby might even say, \"Go on, you deserve a treat!\""],
  ["E","Loyalty cards are another tool. Every time you shop, you collect points that later give you a discount. In return, though, the supermarket collects something valuable: information about what you buy and when. It uses this to send you special offers, which builds brand loyalty and keeps you coming back."],
  ["F","How can shoppers fight back? The simplest method is to write a shopping list and stick to it. It also helps not to shop when you are hungry, and to pick up a basket instead of a trolley. Supermarkets are not villains, but knowing their tricks puts you back in control of what you buy."]],
  gloss:"layout: the way a place is arranged · villain: a bad person in a story" },
 { title:"Designed to tempt", paras:[
  ["A","You call in at the supermarket for a carton of milk and, twenty minutes later, find yourself steering a loaded trolley towards the checkout, wondering how your money disappeared. The experience is so common that it hardly seems worth mentioning, yet it is rarely an accident. Supermarkets are meticulously designed to tempt customers into spending more than they intended."],
  ["B","The layout itself is the first strategy. Essential items such as milk, bread and eggs are almost invariably located at the back of the store. Since virtually every customer needs them, reaching them involves a walk down several aisles, past hundreds of products that nobody had planned to buy. A surprising number of those products find their way into the trolley."],
  ["C","The shelves are arranged with equal care. The most expensive brands occupy eye level, where shoppers' gaze naturally falls, while cheaper alternatives are relegated to the bottom shelf. Sweets and brightly packaged cereals are positioned lower still, precisely at children's eye level. Some stores play slow music to reduce the pace at which customers walk, and many bake bread near the entrance, since the smell stimulates appetite."],
  ["D","The final temptation awaits at the checkout. Customers in the queue are frequently tired and bored, and they find themselves surrounded by chocolate bars, sweets and bottles of squash. Such small, inexpensive items are difficult to resist, particularly for children, and a nearby sign may reassure shoppers that they \"deserve a treat\"."],
  ["E","Loyalty cards represent a subtler tool. Shoppers accumulate points that eventually earn them a discount, but the supermarket gains something arguably more valuable in return: detailed information about what each customer buys, and when. This data allows it to target customers with personalised offers, building the brand loyalty that keeps them returning."],
  ["F","How, then, can consumers protect themselves? The most effective defence is also the simplest: write a shopping list and stick to it. Avoiding shopping on an empty stomach helps, as does choosing a basket rather than a trolley. None of this makes supermarkets villains; they are businesses doing what businesses do. But shoppers who understand the techniques are far better placed to decide for themselves what they buy."]],
  gloss:"meticulously: very carefully · relegated: moved to a less important place · on an empty stomach: when you are hungry" }
];

const SHOP_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["How supermarkets make people buy more","How to cook cheap and healthy meals at home with your family","Why milk is expensive","The history of the first supermarkets"],
   hint:"Read the last sentence of paragraph A.", focus:"Supermarkets are carefully designed to tempt you to buy more.",
   explain:"The answer is \"How supermarkets make people buy more\". Paragraph A says supermarkets are designed to tempt you, and the rest of the text explains their tricks."},
  {stem:"What is the main idea of the text?", opts:["Supermarkets use many tricks to make customers spend more.","Supermarkets always sell food at the lowest possible prices in town.","Shoppers should never use loyalty cards.","Children spend too much money on sweets."],
   hint:"Paragraph A ends with the main idea. Paragraphs B to E give examples.", focus:"Supermarkets are carefully designed to tempt you into spending more than you planned."},
  {stem:"Which statement best summarises the article?", opts:["Supermarket design encourages extra spending, but informed shoppers can resist it.","Supermarkets trick customers dishonestly and should be closed down or punished by the government.","Loyalty cards are the most important tool supermarkets use.","Children are more easily tempted than adults in every situation."],
   hint:"The summary should cover the tricks and the advice in paragraph F.", focus:"Supermarkets are meticulously designed to tempt customers into spending more than they intended."}]},
 {skill:"Detail", para:"B", q:[
  {stem:"Where are milk, bread and eggs usually?", opts:["At the back of the shop","Next to the door, so that you can find them quickly","At the checkout","On the top shelf"],
   hint:"Look in paragraph B.", focus:"They are usually at the back of the shop.",
   explain:"The answer is \"At the back of the shop\". Paragraph B says they are usually at the back, so you walk past other products to get them."},
  {stem:"According to paragraph B, why are essential items at the back?", opts:["So that shoppers walk past many other products","So that they stay cold and fresh for a longer time in summer","Because there is more space there","Because they are the cheapest products"],
   hint:"Paragraph B: what do shoppers pass on the way?", focus:"shoppers have to walk down several aisles to reach them, passing hundreds of other products on the way"},
  {stem:"According to paragraph B, what is the effect of placing essential items at the back?", opts:["Customers pass, and often buy, products they hadn't planned to buy.","Customers find the things they need much more quickly than in other stores.","The store can keep essential items cold.","Fewer customers visit the store."],
   hint:"Paragraph B: read the last two sentences.", focus:"past hundreds of products that nobody had planned to buy"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"resist\" means…", opts:["stop yourself from taking or doing something","buy something very quickly before other people can take it","pay at the checkout","like very much"],
   hint:"Find \"resist\" in paragraph D. Why is it hard for children?", focus:"It is hard to resist them, especially for children.",
   explain:"The answer is \"stop yourself from taking or doing something\". The sweets are near you, and it is hard not to take them."},
  {stem:"In paragraph D, \"you deserve a treat\" means…", opts:["you have earned something nice","you must pay more money for the items in your trolley today","you have to wait in the queue","you have bought too much"],
   hint:"Find the sign in paragraph D. What does it want you to feel?", focus:"Go on, you deserve a treat!"},
  {stem:"In paragraph D, \"reassure\" suggests that the sign…", opts:["makes shoppers feel it is acceptable to buy the treat","warns shoppers that sweets are very bad for their teeth and health","tells shoppers the price of the items","asks shoppers to leave the queue"],
   hint:"\"Reassure\" means make someone feel less worried. What might shoppers worry about?", focus:"a nearby sign may reassure shoppers"}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two tricks that supermarkets use in paragraph C.", groups:SHELF_TRICKS, need:2,
   hint:"Look in paragraph C: the shelves, the music and the bread.", focus:"The most expensive brands are at eye level, where you look first.",
   explain:"Possible answers (any two): expensive brands are at eye level; sweets are at children's eye level; slow music; the smell of bread near the door."},
  {type:"short", stem:"Give two ways supermarkets use the shelves or the senses to make people buy more.", groups:SHELF_TRICKS, need:2,
   hint:"Paragraph C: think about what you see, hear and smell.", focus:"Some shops play slow music to make customers walk more slowly"},
  {type:"short", stem:"Identify two techniques described in paragraph C that influence what customers buy.", groups:SHELF_TRICKS, need:2,
   hint:"Paragraph C: shelf positions, music and smell.", focus:"The most expensive brands occupy eye level"}]},
 {skill:"Inference", para:"D", q:[
  {stem:"Why are sweets next to the checkout?", opts:["People are waiting and it is easy to want them.","Sweets are essential things that everyone needs to buy every week.","There is no space for them in the aisles.","The checkout is the coldest place in the shop."],
   hint:"Look in paragraph D. How do people feel in the queue?", focus:"While you wait in the queue, you are tired and bored.",
   explain:"The answer is \"People are waiting and it is easy to want them.\" Paragraph D says people in the queue are tired and bored, and the sweets are hard to resist."},
  {stem:"What can we infer about customers at the checkout?", opts:["They are more likely to buy small items without thinking.","They usually check their shopping list very carefully before they pay.","They want to leave without buying anything.","They prefer expensive brands."],
   hint:"Paragraph D: tired, bored, and surrounded by small, cheap items.", focus:"These small, cheap items are hard to resist"},
  {stem:"Why does the writer mention that customers are \"tired and bored\"?", opts:["It explains why they are less able to resist temptation.","It shows that supermarkets should employ more staff at the checkouts.","It criticises customers for shopping too late.","It suggests that queues are shorter than before."],
   hint:"Paragraph D: link the customers' feelings to the next sentence.", focus:"Customers in the queue are frequently tired and bored"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"What does a shopper get from a loyalty card, and what does the supermarket get?", groups:[LC_SHOPPER,LC_SHOP], need:2,
   hint:"Look in paragraph E. Find \"you get\" and \"the supermarket gets\".", focus:"Every time you shop, you get points, and later you get a discount.",
   explain:"Possible answers: the shopper gets points and a discount; the supermarket gets information about what you buy."},
  {type:"short", stem:"Explain what shoppers and supermarkets each gain from loyalty cards.", groups:[LC_SHOPPER,LC_SHOP], need:2,
   hint:"Paragraph E: \"In return, though\" introduces what the supermarket gets.", focus:"the supermarket collects something valuable: information about what you buy and when"},
  {type:"short", stem:"Explain the exchange that takes place when a customer uses a loyalty card.", groups:[LC_SHOPPER,LC_SHOP], need:2,
   hint:"Paragraph E: what does each side give and receive?", focus:"detailed information about what each customer buys, and when"}]},
 {skill:"Writer's purpose", para:"A", q:[
  {stem:"Why does the writer start with a story about buying milk?", opts:["To show something that happens to many people","To tell readers where to buy the cheapest milk in the town centre","To explain how milk is made","To describe the writer's family"],
   hint:"Read paragraph A. Find the question the writer asks.", focus:"Does this sound familiar?",
   explain:"The answer is \"To show something that happens to many people\". The writer asks \"Does this sound familiar?\" because most readers have done the same thing."},
  {stem:"Why does the writer ask \"Sound familiar?\" in paragraph A?", opts:["To make readers think of their own experience","To check that readers understand the instructions in the shopping list","To complain about the price of milk","To introduce a story about a famous shop"],
   hint:"Paragraph A: who is \"you\" in this paragraph?", focus:"Sound familiar?"},
  {stem:"What is the function of the opening scenario in paragraph A?", opts:["It draws readers in with a familiar experience before revealing its cause.","It gives statistics about how much the average family spends.","It criticises readers for buying too much.","It describes the long history of the modern supermarket and its early owners."],
   hint:"Paragraph A: \"so common\" … \"yet it is rarely an accident\".", focus:"The experience is so common that it hardly seems worth mentioning"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about supermarkets?", opts:["They are not bad, but shoppers should know their tricks.","They are bad places and nobody should ever go shopping in them again.","They are always cheaper than markets.","They should not sell sweets."],
   hint:"Read paragraph F. Find \"not bad places\".", focus:"Supermarkets are not bad places, but it is good to know their tricks.",
   explain:"The answer is \"They are not bad, but shoppers should know their tricks.\" The writer says supermarkets are not bad places, but it is good to know their tricks."},
  {stem:"What is the writer's main advice?", opts:["Plan what you need and stick to the plan.","Always shop at the busiest time of day, when the shop has the most offers.","Only buy expensive brands.","Never use a loyalty card."],
   hint:"Paragraph F: \"The simplest method is…\"", focus:"write a shopping list and stick to it"},
  {stem:"Which statement best reflects the writer's attitude to supermarkets?", opts:["They act like normal businesses, and understanding them helps shoppers.","They are dishonest and should be strictly controlled by new laws from the government.","They care more about children than about adults.","They have stopped using tricks because shoppers know them."],
   hint:"Paragraph F: \"None of this makes supermarkets villains\".", focus:"they are businesses doing what businesses do"}]}
];

/* ---------- 2. Famous faces ---------- */
const CELEB_PROBLEMS = [
 {label:"very expensive", k:["expensive","million","cost","money","price","pay"]},
 {label:"the star may do something bad / scandal", k:["bad","scandal","behav","wrong","trouble"]},
 {label:"people may stop buying the product", k:["stop buying","turn against","stop","lose customers","ended"]}];
const INF_WHO = {ask:"How do companies choose an influencer?", label:"followers match the target audience", k:["follower","target audience","audience","young women","teenage","gamer"]};
const INF_WHY = {ask:"Why is this good for the company?", label:"reaches the right people / cheaper than TV", k:["cheap","cost","right people","reach","tv","television","commercial","less money"]};

const FAME_LEVELS = [
 { title:"Famous faces", paras:[
  ["A","Why do companies pay famous people to use their products? A football star wears new trainers, a singer drinks a new juice, and suddenly everyone wants them. This kind of advertising is called a celebrity campaign, and it is one of the oldest tricks in marketing."],
  ["B","It works because we trust and admire famous people. If our hero uses a product, we think it must be good. We also want to be a bit like them. In the 1930s, a French tennis champion wore a shirt with a small crocodile on it, and soon people wanted the same shirt. The shirt is still popular today."],
  ["C","But celebrity endorsements are very expensive. Some sports stars get millions of dollars to wear one brand of shoes. And there is a risk: if the star does something bad, people may stop buying the product too. Some companies have ended their campaigns quickly because of this."],
  ["D","Today, many companies use influencers instead. Influencers are people with lots of followers on social media. They are not as famous as film stars, but their followers feel they know them. Influencers talk to their digital audience almost every day, so their advice feels like advice from a friend."],
  ["E","Companies choose influencers carefully. A make-up brand looks for an influencer whose followers are mostly young women. A gaming company looks for a gamer with a teenage target audience. This is called digital marketing, and it is often cheaper than a TV advert."],
  ["F","But is it honest? Sometimes followers don't know that the influencer is paid. In many countries, influencers must now write \"ad\" on a post when a company pays them. I think this is fair. If someone is paid to say a product is good, we should know."]],
  gloss:"admire: think someone is great · influencer: a person with many followers online" },
 { title:"Famous faces", paras:[
  ["A","Why do companies pay famous people to use their products? When a football star laces up a new pair of trainers or a pop singer is seen with a new drink, sales often go through the roof. This is known as a celebrity campaign, and it is one of the oldest techniques in marketing."],
  ["B","The reason it works is simple: we trust and admire famous people. If our heroes use a product, we assume it must be good, and we would like to be a little more like them. In the 1930s, a French tennis champion began wearing a short-sleeved shirt with a small crocodile on it. Fans rushed to buy the same shirt, and it is still a best-seller today."],
  ["C","However, celebrity endorsements do not come cheap. Some sports stars are paid millions of dollars a year to wear one brand of shoes. There is also a risk: if the star behaves badly, customers may turn against the product as well. More than one company has ended a campaign overnight for this reason."],
  ["D","These days, many brands prefer to work with influencers. Influencers are people with large numbers of followers on social media. They may not be as famous as film stars, but their followers feel that they know them personally. Because influencers talk to their digital audience almost every day, their recommendations feel like advice from a friend."],
  ["E","Brands choose their influencers with great care. A make-up company might look for someone whose followers are mostly young women, while a gaming company wants a gamer with a teenage target audience. This kind of digital marketing can reach exactly the right people, and it is usually much cheaper than a TV commercial."],
  ["F","But is it honest? Followers do not always realise that an influencer has been paid. In many countries, influencers must now label sponsored posts with the word \"ad\". In my view, this is only fair. If someone is being paid to praise a product, we have a right to know."]],
  gloss:"go through the roof: rise very quickly · sponsored: paid for by a company" },
 { title:"The power of famous faces", paras:[
  ["A","Why are companies prepared to pay famous people to use their products? When a football star appears in a new pair of trainers, or a pop singer is photographed with a particular drink, sales frequently soar. The celebrity campaign, as this technique is known, is among the oldest in the history of marketing."],
  ["B","Its effectiveness rests on a simple principle: we trust and admire the famous. If our heroes use a product, we assume it must be good, and owning it allows us to feel a little closer to them. In the 1930s, a French tennis champion began wearing a short-sleeved shirt embroidered with a small crocodile; fans rushed to copy him, and the shirt remains a best-seller almost a century later."],
  ["C","Celebrity endorsements, however, come at a price. Some athletes earn millions of dollars a year for wearing a single brand of shoes. They also carry a risk: should the star's behaviour cause a scandal, customers may turn against the product too. More than one company has ended a campaign overnight for precisely this reason."],
  ["D","Increasingly, brands are turning instead to influencers, people who have built large followings on social media. Though rarely as famous as film stars, influencers enjoy a different kind of power: their followers feel they know them personally. Because they speak to their digital audience almost daily, their recommendations carry the weight of advice from a friend rather than a sales pitch."],
  ["E","Brands select influencers with considerable care. A cosmetics company might seek someone whose followers are predominantly young women, while a games developer looks for a gamer with a teenage target audience. Such digital marketing reaches precisely the intended consumers, and typically at a fraction of the cost of a television commercial."],
  ["F","The question is whether it is honest. Followers do not always realise that an influencer has been paid, which is why many countries now require sponsored posts to be clearly labelled \"ad\". In my view, this is the very least that should be expected. If someone is being paid to praise a product, audiences have a right to know."]],
  gloss:"soar: rise very quickly · scandal: something bad that shocks the public · predominantly: mostly" }
];

const FAME_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["How famous people and influencers help to sell products","How to become a famous football star when you are still at school","The history of tennis","Why trainers are expensive"],
   hint:"Read paragraph A. Then look quickly at the first sentence of paragraph D.", focus:"This kind of advertising is called a celebrity campaign",
   explain:"The answer is \"How famous people and influencers help to sell products\". The text is about celebrity campaigns (A to C) and influencers (D to F)."},
  {stem:"What is the main topic of the text?", opts:["Using famous people and influencers to advertise products","How influencers earn money from their videos and photos every month","Why fans copy the clothes of their heroes","The best TV commercials of all time"],
   hint:"Paragraphs A to C are about stars. What are D to F about?", focus:"This is known as a celebrity campaign"},
  {stem:"Which statement best summarises the article?", opts:["Famous faces sell products effectively, but this raises questions of cost, risk and honesty.","Influencers are more honest than celebrities, so companies should stop working with film and sports stars.","Celebrity campaigns no longer work in the age of social media.","Brands should only advertise on television."],
   hint:"The summary should cover why it works (B), the cost and risk (C) and honesty (F).", focus:"The celebrity campaign, as this technique is known, is among the oldest in the history of marketing."}]},
 {skill:"Detail", para:"B", q:[
  {stem:"What did people do in the 1930s?", opts:["They wanted the same shirt as the tennis player.","They stopped playing tennis because the shirts were far too expensive.","They drew crocodiles on their shirts.","They wrote letters to the tennis player."],
   hint:"Look in paragraph B. Find \"1930s\".", focus:"soon people wanted the same shirt",
   explain:"The answer is \"They wanted the same shirt as the tennis player.\" Paragraph B says people soon wanted the same shirt."},
  {stem:"According to paragraph B, why do we buy products that our heroes use?", opts:["We think the products are good and we want to be like them.","The products are always cheaper than other brands in the shops.","Our heroes give the products away.","We have to buy them to join fan clubs."],
   hint:"Paragraph B: find \"we assume\".", focus:"we assume it must be good, and we would like to be a little more like them"},
  {stem:"What does the example of the tennis shirt show?", opts:["A celebrity's influence on a product can last for decades.","Sports clothes are more popular than ordinary clothes with most teenagers.","French clothes are the best in the world.","Fans only copy tennis players."],
   hint:"Paragraph B: how long has the shirt been a best-seller?", focus:"the shirt remains a best-seller almost a century later"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"followers\" are…", opts:["people who see someone's posts on social media","people who walk behind a famous person in the street to take photos","people who work for a company","people who make adverts"],
   hint:"Find \"followers\" in paragraph D. Where are they?", focus:"Influencers are people with lots of followers on social media.",
   explain:"The answer is \"people who see someone's posts on social media\". Paragraph D says influencers have followers on social media."},
  {stem:"In paragraph D, \"digital audience\" means…", opts:["the people who watch or read someone online","the cameras and phones that influencers use to make their videos","a group of people at a concert","the company that pays an influencer"],
   hint:"\"Digital\" means online. Who do influencers talk to?", focus:"Because influencers talk to their digital audience almost every day"},
  {stem:"In paragraph D, \"a sales pitch\" means…", opts:["a speech made to persuade someone to buy something","a football field where companies sell products to fans at matches","a friendly conversation between neighbours","the price of a product"],
   hint:"The writer contrasts \"advice from a friend\" with \"a sales pitch\".", focus:"rather than a sales pitch"}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two problems with celebrity campaigns.", groups:CELEB_PROBLEMS, need:2,
   hint:"Look in paragraph C. Find \"expensive\" and \"risk\".", focus:"But celebrity endorsements are very expensive.",
   explain:"Possible answers (any two): they are very expensive; the star may do something bad; people may stop buying the product."},
  {type:"short", stem:"Give two disadvantages of celebrity endorsements mentioned in paragraph C.", groups:CELEB_PROBLEMS, need:2,
   hint:"Paragraph C: the cost, and the risk.", focus:"Some sports stars are paid millions of dollars a year to wear one brand of shoes."},
  {type:"short", stem:"Identify two drawbacks of celebrity endorsements described in paragraph C.", groups:CELEB_PROBLEMS, need:2,
   hint:"Paragraph C: \"come at a price\" and \"carry a risk\".", focus:"should the star's behaviour cause a scandal"}]},
 {skill:"Inference", para:"D", q:[
  {stem:"Why do followers listen to influencers?", opts:["They feel the influencer is like a friend.","Influencers are much more famous than film stars and football players.","Influencers give them free products.","Their parents tell them to."],
   hint:"Read the last sentence of paragraph D.", focus:"their advice feels like advice from a friend",
   explain:"The answer is \"They feel the influencer is like a friend.\" Paragraph D says influencers' advice feels like advice from a friend."},
  {stem:"What can we infer about influencers from paragraph D?", opts:["Their closeness to followers makes them persuasive.","They are more famous than film stars in most countries of the world.","They never accept money from brands.","They only post once a month."],
   hint:"Paragraph D: they are less famous, so why do brands use them?", focus:"their followers feel that they know them personally"},
  {stem:"What does the writer suggest is the source of influencers' power?", opts:["The personal relationship followers feel they have with them","The large amounts of money they earn from big international companies","Their appearances on television","Their expert knowledge of products"],
   hint:"Paragraph D: \"a different kind of power\". What comes after the colon?", focus:"influencers enjoy a different kind of power"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"How do companies choose influencers, and why is this good for them?", groups:[INF_WHO,INF_WHY], need:2,
   hint:"Look in paragraph E. Who are the followers? What is cheaper?", focus:"This is called digital marketing, and it is often cheaper than a TV advert.",
   explain:"Possible answers: they choose influencers whose followers are their target audience; it is cheaper than a TV advert."},
  {type:"short", stem:"Explain how brands choose influencers and one advantage of this kind of marketing.", groups:[INF_WHO,INF_WHY], need:2,
   hint:"Paragraph E: think about the followers, then the cost.", focus:"This kind of digital marketing can reach exactly the right people"},
  {type:"short", stem:"Explain how brands select influencers and why this approach benefits them.", groups:[INF_WHO,INF_WHY], need:2,
   hint:"Paragraph E: \"intended consumers\" and \"a fraction of the cost\".", focus:"at a fraction of the cost of a television commercial"}]},
 {skill:"Writer's purpose", para:"C", q:[
  {stem:"Why does the writer say some companies ended their campaigns quickly?", opts:["To show the risk of using a famous person","To show that companies don't have enough money to pay celebrities any more","To say that stars are always bad","To explain how to start a campaign"],
   hint:"Read paragraph C. Find \"risk\".", focus:"Some companies have ended their campaigns quickly because of this.",
   explain:"The answer is \"To show the risk of using a famous person\". If the star does something bad, the company may have to end the campaign."},
  {stem:"What is the purpose of paragraph C?", opts:["To show the costs and risks of celebrity endorsements","To explain how sports stars spend all the money they earn from brands","To describe the best celebrity campaigns","To persuade readers to buy trainers"],
   hint:"Paragraph C starts with \"However\". What changes?", focus:"However, celebrity endorsements do not come cheap."},
  {stem:"What is the function of the word \"however\" in paragraph C?", opts:["It introduces the disadvantages after the benefits in paragraph B.","It shows the writer has changed their mind completely about all advertising.","It introduces an example of a successful campaign.","It contrasts film stars with sports stars."],
   hint:"Paragraph B explains why celebrity campaigns work. What does paragraph C add?", focus:"Celebrity endorsements, however, come at a price."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about writing \"ad\" on posts?", opts:["It is fair, because people should know who is paid.","It is not necessary, because followers always know when an influencer is paid.","It makes posts boring.","It should only be used on TV."],
   hint:"Read paragraph F. Find \"I think\".", focus:"I think this is fair.",
   explain:"The answer is \"It is fair, because people should know who is paid.\" The writer says \"I think this is fair\" and \"we should know\"."},
  {stem:"What is the writer's opinion about sponsored posts?", opts:["They should be clearly labelled so followers know.","They should be banned completely in every country around the world.","They are more honest than TV commercials.","They are only a problem for young children."],
   hint:"Paragraph F: find \"In my view\".", focus:"In my view, this is only fair."},
  {stem:"Which statement best reflects the writer's view in paragraph F?", opts:["Labelling paid posts is a minimum requirement for honesty.","Influencers are always dishonest and their followers should stop listening to them.","Sponsored posts are more effective than celebrity campaigns.","Laws about advertising are too strict."],
   hint:"Paragraph F: \"the very least that should be expected\".", focus:"this is the very least that should be expected"}]}
];

/* ---------- 3. From painted walls to pop-ups ---------- */
const TV_GOOD = [
 {label:"moving pictures", k:["moving","picture","image","video"]},
 {label:"music / jingles", k:["music","jingle","song","sound"]},
 {label:"reached millions at once", k:["million","many people","same time","at once","same programme","families","simultaneous"]}];
const SEARCH_CAUSE = {ask:"What do you do online?", label:"search for something", k:["search","look for","look up","google"]};
const SEARCH_EFFECT = {ask:"What happens next?", label:"adverts for it appear everywhere", k:["advert","ads","everywhere","every website","follow","see"]};

const ADS_LEVELS = [
 { title:"From painted walls to pop-ups", paras:[
  ["A","Advertising is not new. Thousands of years ago, shop owners in ancient Rome painted messages on walls to tell people about their shops. Today, adverts are everywhere: on TV, on our phones, and even on buses. But how did we get from painted walls to pop-ups?"],
  ["B","For a long time, print media was the most important kind of advertising. In the 1800s, newspapers and magazines were full of adverts for soap, medicine and clothes. Some of these adverts made big promises. One medicine said it could cure every illness, which wasn't true."],
  ["C","Then came huge posters. Companies put them on hoardings beside busy roads, so thousands of people saw them every day. A good poster needed a short, catchy slogan, because drivers only had a few seconds to read it."],
  ["D","In the 1950s, television changed everything. Now companies could show moving pictures and play music. Families watched the same programmes every evening, so one TV advert could reach millions of people at the same time. Some jingles from those adverts are still famous today."],
  ["E","The internet brought the biggest change. Today, digital marketing lets companies show adverts to exactly the right people. If you search for football boots, you will soon see adverts for football boots on every website. Some people find this useful, but others think it is annoying, especially when a pop-up covers what they are reading."],
  ["F","What will advertising look like in the future? Nobody knows. But one thing is certain: as long as people buy things, companies will find new ways to tell us about them."]],
  gloss:"hoarding: a very big board for adverts beside a road · jingle: a short song in an advert" },
 { title:"From painted walls to pop-ups", paras:[
  ["A","Advertising is nothing new. Over two thousand years ago, shopkeepers in ancient Rome painted messages on walls to attract customers. Today, adverts surround us: on television, on our phones and even on the sides of buses. So how did we get from painted walls to pop-ups?"],
  ["B","For centuries, print media was the main way to advertise. By the 1800s, newspapers and magazines were packed with adverts for soap, medicine and clothes. Many of them made enormous promises. One famous medicine claimed it could cure almost every illness, which, of course, it could not."],
  ["C","Next came giant posters. Companies placed them on hoardings beside busy roads, where thousands of people would see them every day. A successful poster needed a short, catchy slogan, because people driving past had only a few seconds to read it."],
  ["D","In the 1950s, television changed everything. For the first time, companies could use moving pictures and music to sell their products. Since families watched the same programmes every evening, a single TV commercial could reach millions of people at once. Some jingles from that time are still remembered today."],
  ["E","The internet has brought the biggest change of all. Thanks to digital marketing, companies can now show adverts to exactly the people most likely to buy. Search for football boots once, and you will soon see adverts for them on almost every website you visit. Some people find this helpful, but others find it annoying, particularly when a pop-up appears in the middle of what they are reading."],
  ["F","What will advertising look like in the future? Nobody can be sure. One thing, however, seems certain: as long as people buy things, companies will keep finding new ways to tell us about them."]],
  gloss:"print media: newspapers and magazines · commercial: an advert on TV or radio" },
 { title:"A short history of selling", paras:[
  ["A","Advertising is far from a modern invention. More than two thousand years ago, shopkeepers in ancient Rome painted messages on walls to draw in customers. Today, adverts are inescapable, appearing on television, on our phones and even on the sides of buses. How, then, did we travel from painted walls to pop-ups?"],
  ["B","For centuries, print media dominated advertising. By the nineteenth century, newspapers and magazines were crammed with advertisements for soap, medicine and clothing, many of which made extravagant claims. One notorious medicine promised to cure virtually every illness, a claim that was, needless to say, entirely false."],
  ["C","The next development was the giant poster. Companies displayed them on hoardings alongside busy roads, where thousands of people would pass them every day. An effective poster depended on a short, catchy slogan, since passing drivers had only a few seconds in which to read it."],
  ["D","Television transformed the industry in the 1950s. For the first time, companies could combine moving images and music to promote their products. Because families tended to watch the same programmes every evening, a single commercial could reach millions of viewers simultaneously. Some jingles from that era remain instantly recognisable today."],
  ["E","The internet, however, has brought the most radical change of all. Digital marketing enables companies to target precisely those consumers most likely to buy. Search for football boots once, and adverts for them will follow you across almost every website you visit. Some users welcome this as convenient; others find it intrusive, especially when a pop-up interrupts what they are reading."],
  ["F","What the future holds for advertising is impossible to predict with confidence. One thing, though, seems certain: as long as people continue to buy things, companies will keep inventing new ways to tell us about them."]],
  gloss:"extravagant: much more than is reasonable · notorious: famous for something bad · intrusive: annoying because it enters your private space" }
];

const ADS_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["How advertising has changed over time","How to make a poster for your school's sports day","Why people in Rome painted walls","The best adverts on TV today"],
   hint:"Read the last question in paragraph A.", focus:"But how did we get from painted walls to pop-ups?",
   explain:"The answer is \"How advertising has changed over time\". The text goes from Rome to newspapers, posters, TV and the internet."},
  {stem:"What is the main purpose of the text?", opts:["To describe the history of advertising","To persuade readers to stop watching TV commercials and adverts online","To explain how to design a good slogan","To compare adverts in Rome and Viet Nam"],
   hint:"Look at the first words of paragraphs B to E: \"For centuries\", \"Next\", \"In the 1950s\"…", focus:"So how did we get from painted walls to pop-ups?"},
  {stem:"Which statement best summarises the article?", opts:["Advertising has developed with each new technology and will keep changing.","Advertising was more honest in the past than it is in the digital age today.","Television adverts are more effective than any other kind.","Print media will soon disappear completely."],
   hint:"Think about paragraphs B to E together, then paragraph F.", focus:"How, then, did we travel from painted walls to pop-ups?"}]},
 {skill:"Detail", para:"B", q:[
  {stem:"What did one medicine advert say?", opts:["It could cure every illness.","It was the cheapest medicine you could buy in any shop in the country.","It was made from soap.","It was only for children."],
   hint:"Look in paragraph B. Find \"medicine\".", focus:"One medicine said it could cure every illness, which wasn't true.",
   explain:"The answer is \"It could cure every illness.\" Paragraph B says this, and adds that it wasn't true."},
  {stem:"According to paragraph B, what was wrong with many early adverts?", opts:["They made promises that were not true.","They were printed in very small letters that people could not read easily.","They were too expensive for small shops.","They only advertised clothes."],
   hint:"Paragraph B: find \"enormous promises\".", focus:"Many of them made enormous promises."},
  {stem:"According to paragraph B, what characterised many nineteenth-century advertisements?", opts:["Exaggerated and sometimes false claims","Careful scientific evidence for every claim they made about products","A focus on food rather than other products","Very short, catchy slogans"],
   hint:"Paragraph B: \"extravagant claims\" and \"entirely false\".", focus:"many of which made extravagant claims"}]},
 {skill:"Vocabulary in context", para:"C", q:[
  {stem:"In paragraph C, \"catchy\" means…", opts:["easy to remember","written in very big letters so that people can see it from far away","difficult to understand","very long"],
   hint:"Find \"catchy\" in paragraph C. Drivers had only a few seconds.", focus:"A good poster needed a short, catchy slogan",
   explain:"The answer is \"easy to remember\". A catchy slogan is short and stays in your head."},
  {stem:"In paragraph C, \"hoardings\" are…", opts:["large boards for adverts","small shops beside busy roads where drivers can stop and buy things","cars that carry posters","newspapers sold at the roadside"],
   hint:"Find \"hoardings\" in paragraph C. What did companies put on them?", focus:"Companies placed them on hoardings beside busy roads"},
  {stem:"In paragraph C, \"depended on\" means…", opts:["needed in order to succeed","was paid for by the drivers who passed it on the road every day","was placed next to","was more important than"],
   hint:"What did an effective poster need?", focus:"An effective poster depended on a short, catchy slogan"}]},
 {skill:"Detail: two points", para:"D", q:[
  {type:"short", stem:"Write two things that made TV adverts powerful.", groups:TV_GOOD, need:2,
   hint:"Look in paragraph D.", focus:"Now companies could show moving pictures and play music.",
   explain:"Possible answers (any two): moving pictures; music; they reached millions of people at the same time."},
  {type:"short", stem:"Give two reasons why television changed advertising, according to paragraph D.", groups:TV_GOOD, need:2,
   hint:"Paragraph D: what could companies use, and how many people watched?", focus:"a single TV commercial could reach millions of people at once"},
  {type:"short", stem:"Identify two ways in which television transformed advertising.", groups:TV_GOOD, need:2,
   hint:"Paragraph D: what could companies combine, and how many viewers could they reach?", focus:"companies could combine moving images and music to promote their products"}]},
 {skill:"Inference", para:"C", q:[
  {stem:"Why did posters need short slogans?", opts:["Drivers could only read them quickly.","Companies had to pay for every letter they printed on the poster.","Short words are more polite.","Children made the posters."],
   hint:"Look in paragraph C. Find \"a few seconds\".", focus:"drivers only had a few seconds to read it",
   explain:"The answer is \"Drivers could only read them quickly.\" Paragraph C says drivers only had a few seconds."},
  {stem:"What can we infer about the people who saw the posters?", opts:["Many of them were moving past quickly.","Most of them were children who were walking home from school in groups.","They were all shopkeepers.","They read them very carefully."],
   hint:"Paragraph C: where were the posters, and who passed them?", focus:"people driving past had only a few seconds to read it"},
  {stem:"What does paragraph C suggest about effective advertising on hoardings?", opts:["The message must be understood almost instantly.","The poster must be as large and as colourful as the company can afford.","Drivers prefer long, detailed messages.","Hoardings work better in the countryside."],
   hint:"Paragraph C: how long do drivers have?", focus:"passing drivers had only a few seconds in which to read it"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"In paragraph E, what do you do online, and what happens next?", groups:[SEARCH_CAUSE,SEARCH_EFFECT], need:2,
   hint:"Look in paragraph E. Find \"If you…\".", focus:"If you search for football boots, you will soon see adverts for football boots on every website.",
   explain:"Possible answers: you search for football boots; you see adverts for them on every website."},
  {type:"short", stem:"Explain what action leads to targeted adverts in paragraph E, and what result it has.", groups:[SEARCH_CAUSE,SEARCH_EFFECT], need:2,
   hint:"Paragraph E: the football boots example.", focus:"Search for football boots once, and you will soon see adverts for them on almost every website you visit."},
  {type:"short", stem:"Explain the cause and effect described in the football boots example.", groups:[SEARCH_CAUSE,SEARCH_EFFECT], need:2,
   hint:"Paragraph E: what do you do, and what \"will follow you\"?", focus:"Search for football boots once, and adverts for them will follow you across almost every website you visit."}]},
 {skill:"Writer's purpose", para:"A", q:[
  {stem:"Why does the writer talk about ancient Rome?", opts:["To show that advertising is very old","To tell readers how to travel to Rome and see the old painted walls","To explain how to paint a wall","To describe Roman food"],
   hint:"Read the first sentence of paragraph A.", focus:"Advertising is not new.",
   explain:"The answer is \"To show that advertising is very old\". The writer says \"Advertising is not new\" and gives Rome as an example."},
  {stem:"Why does the writer mention shopkeepers in ancient Rome?", opts:["To show that advertising has a very long history","To compare the prices of products in Rome with the prices in Viet Nam today","To describe how Romans built their shops","To criticise Roman shopkeepers"],
   hint:"Paragraph A: what does the first sentence say?", focus:"Advertising is nothing new."},
  {stem:"What is the function of the reference to ancient Rome?", opts:["It establishes that advertising long predates modern media.","It proves that Roman adverts were more effective than modern digital marketing.","It introduces the writer's criticism of painted walls.","It explains the origin of the word \"advert\"."],
   hint:"Paragraph A: \"far from a modern invention\".", focus:"Advertising is far from a modern invention."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about the future of advertising?", opts:["Companies will always find new ways to advertise.","Advertising will stop soon because people are tired of seeing adverts everywhere.","All adverts will be on TV again.","Pop-ups will disappear next year."],
   hint:"Read the last sentence of paragraph F.", focus:"companies will find new ways to tell us about them",
   explain:"The answer is \"Companies will always find new ways to advertise.\" The writer says this is certain \"as long as people buy things\"."},
  {stem:"How certain is the writer about the future of advertising?", opts:["Unsure of the details, but sure it will continue","Completely sure about exactly what adverts will look like in ten years","Sure that it will end soon","Not interested in the future at all"],
   hint:"Paragraph F: \"Nobody can be sure\" … \"One thing, however, seems certain\".", focus:"Nobody can be sure."},
  {stem:"Which statement best reflects the writer's view in paragraph F?", opts:["The form of advertising will change, but advertising itself will continue.","Advertising will eventually disappear as consumers become more aware of it.","Predicting the future of advertising is easy.","Digital marketing is the final stage of advertising."],
   hint:"Paragraph F: what is \"impossible to predict\", and what \"seems certain\"?", focus:"companies will keep inventing new ways to tell us about them"}]}
];

/* ---------- 4. The fence (a retelling from Mark Twain's "The Adventures of Tom Sawyer", 1876) ---------- */
const TOM_GOT = [
 {label:"a kite", k:["kite"]},
 {label:"a dead rat", k:["rat"]},
 {label:"marbles", k:["marble"]},
 {label:"an apple", k:["apple"]},
 {label:"the fence was painted for him", k:["painted","paint the fence","coats","shade","didn't work","no work","rest"]}];
const TOM_DID = {ask:"What did Tom do when Ben asked to paint?", label:"said no / refused", k:["said no","refus","shook his head","wouldn't","didn't let","not let","only he","particular"]};
const BEN_DID = {ask:"What happened to Ben then?", label:"wanted it more / gave his apple", k:["want","apple","more","gave","paid","desire"]};

const FENCE_LEVELS = [
 { title:"The fence", paras:[
  ["A","It was a beautiful Saturday morning, and Tom Sawyer was not happy. His Aunt Polly had given him a job: he had to paint the long wooden fence in front of the house. It was thirty metres long and three metres high. All his friends were going to play by the river, and Tom had to work."],
  ["B","Tom started painting, but after a few minutes he stopped. He looked at the fence. He had painted only a tiny part. He thought about giving his friends his toys if they helped him, but he only had a few marbles and a piece of string. That wasn't enough."],
  ["C","Then Tom had a brilliant idea. When his friend Ben walked past, eating an apple, Tom didn't look up. He painted very carefully, like an artist. \"Hi, Tom! You have to work, poor you!\" said Ben. \"Work?\" said Tom. \"This isn't work. Does a boy get the chance to paint a fence every day?\""],
  ["D","Ben stopped eating his apple. He watched Tom. Suddenly, painting the fence looked interesting. \"Can I try?\" he asked. \"No,\" said Tom. \"Aunt Polly is very particular about this fence. Only I can do it properly.\" Now Ben really wanted to paint. In the end, he gave Tom his apple for the chance to paint."],
  ["E","Soon more boys came. Each one laughed at Tom, and each one ended up paying to paint the fence. By the afternoon, Tom had a kite, a dead rat on a string, twelve marbles and lots of other treasures. The fence had three coats of paint, and Tom hadn't done any work at all."],
  ["F","Tom had learned an important lesson: if you want people to want something, make it difficult to get. Advertisers today still use the same trick. When a product is \"limited edition\" or \"only for members\", we want it more."]],
  gloss:"fence: a wooden wall around a garden · marbles: small glass balls that children play with · coat of paint: one layer of paint" },
 { title:"The fence", paras:[
  ["A","It was a bright Saturday morning, but Tom Sawyer was miserable. His Aunt Polly had given him a job: to paint the long wooden fence in front of the house. It was thirty metres long and three metres high. While his friends spent the day playing by the river, Tom would be stuck with a brush and a bucket."],
  ["B","Tom painted a few strokes and stopped. Compared with the enormous fence, the painted part looked tiny. He thought about paying his friends to help, but when he emptied his pockets he found only a few marbles and a piece of string. It was not nearly enough to buy even half an hour of help."],
  ["C","Then a brilliant idea came to him. When his friend Ben came along, eating a juicy apple, Tom didn't even look up. He painted slowly and carefully, stepping back now and then to admire his work like an artist. \"Hi, Tom! Got to work, huh?\" Ben laughed. Tom looked surprised. \"Work? This isn't work. How often does a boy get the chance to paint a fence?\""],
  ["D","Ben stopped chewing. Suddenly, the job looked quite different. \"Let me try a bit,\" he said. Tom shook his head. \"Aunt Polly is very particular about this fence. Not one boy in a thousand could do it properly.\" The more Tom refused, the more Ben wanted to paint. In the end, Ben handed over his apple just for the chance."],
  ["E","Throughout the day, more boys came to laugh, and every one of them stayed to paint. Each paid Tom for the privilege. By the afternoon, Tom owned a kite, a dead rat on a string, twelve marbles and a pile of other treasures. The fence had three coats of paint, and Tom had spent most of the day sitting in the shade."],
  ["F","Without realising it, Tom had discovered a great law of human behaviour: to make people want something, you only need to make it hard to get. Advertisers still rely on the same idea today. When a product is described as a \"limited edition\" or \"for members only\", it suddenly seems far more desirable."]],
  gloss:"miserable: very unhappy · privilege: a special chance that not everyone gets · desirable: something people want" },
 { title:"The fence that painted itself", paras:[
  ["A","It was a glorious Saturday morning, yet Tom Sawyer was in despair. His Aunt Polly had assigned him a task: painting the long wooden fence in front of the house, all thirty metres of it, three metres high. While his friends spent the day by the river, Tom faced the prospect of hours with nothing but a brush and a bucket for company."],
  ["B","After a few half-hearted strokes, Tom paused to survey his progress. Against the vast expanse of the fence, the painted section looked pitiful. He considered bribing his friends to help, but an inventory of his pockets revealed only a few marbles and a length of string, hardly enough to purchase even half an hour of labour."],
  ["C","It was then that inspiration struck. When his friend Ben strolled by, munching an apple, Tom did not so much as glance up. He painted with deliberate care, occasionally stepping back to admire the effect, like an artist absorbed in a masterpiece. \"Got to work, huh?\" Ben teased. Tom feigned surprise. \"Work? This isn't work. How often does a boy get the chance to paint a fence?\""],
  ["D","Ben stopped chewing. In an instant, the task had been transformed. \"Let me have a go,\" he said. Tom shook his head. \"Aunt Polly is very particular about this fence. Not one boy in a thousand could do it properly.\" Each refusal only sharpened Ben's desire, until at last he surrendered his apple simply for the privilege of being allowed to paint."],
  ["E","As the day wore on, boy after boy arrived intending to mock, and boy after boy stayed to paint, each paying Tom for the honour. By the afternoon, Tom had amassed a kite, a dead rat on a string, twelve marbles and a heap of other treasures. The fence boasted three coats of paint, and Tom had spent most of the day relaxing in the shade."],
  ["F","Without realising it, Tom had stumbled upon a fundamental law of human behaviour: in order to make people desire something, it is only necessary to make it difficult to obtain. Advertisers continue to exploit the same principle. Label a product a \"limited edition\" or reserve it \"for members only\", and it instantly becomes more desirable."]],
  gloss:"bribe: offer something so that someone does what you want · feign: pretend · amass: collect a lot of something" }
];

const FENCE_SLOTS = [
 {skill:"Main idea", para:"C", q:[
  {stem:"What is the story mainly about?", opts:["How Tom gets his friends to do his work","How to paint a wooden fence so that it looks beautiful for many years","Why Tom's aunt is angry","A day by the river with friends"],
   hint:"Read paragraph C. What is Tom's \"brilliant idea\"?", focus:"Then Tom had a brilliant idea.",
   explain:"The answer is \"How Tom gets his friends to do his work\". Tom makes painting look fun, and his friends pay to do it."},
  {stem:"What is the main idea of the story?", opts:["Tom cleverly turns a boring job into something others want to do.","Tom learns that hard work always brings rewards in the end, so he paints the whole fence himself.","Ben is a better painter than Tom.","Aunt Polly is unfair to Tom."],
   hint:"Paragraph C: Tom's idea. Paragraph E: what happens in the end?", focus:"Then a brilliant idea came to him."},
  {stem:"Which statement best summarises the story?", opts:["By presenting a chore as a privilege, Tom persuades others to do it for him.","Tom's friends feel sorry for him and decide to help him finish the fence for free.","Tom pays his friends with marbles to paint the fence.","Tom refuses to paint the fence and runs away to the river."],
   hint:"Paragraph C: \"inspiration struck\". What does Tom pretend, and what is the result?", focus:"It was then that inspiration struck."}]},
 {skill:"Detail", para:"B", q:[
  {stem:"Why couldn't Tom pay his friends to help?", opts:["He didn't have enough things to give them.","His friends didn't want toys, because they were too old to play with them.","Aunt Polly said no.","His friends were at school."],
   hint:"Look in paragraph B. What did Tom have?", focus:"That wasn't enough.",
   explain:"The answer is \"He didn't have enough things to give them.\" Tom only had a few marbles and a piece of string."},
  {stem:"According to paragraph B, what did Tom find in his pockets?", opts:["Only a few marbles and a piece of string","An apple, a kite and a dead rat on a string that he had found by the river","Enough money to pay his friends","A letter from Aunt Polly"],
   hint:"Paragraph B: find \"emptied his pockets\".", focus:"he found only a few marbles and a piece of string"},
  {stem:"According to paragraph B, why did Tom abandon the idea of bribing his friends?", opts:["His possessions were worth too little.","His friends had already left for the river and could not hear him calling.","He thought bribery was wrong.","Aunt Polly was watching him."],
   hint:"Paragraph B: \"hardly enough\".", focus:"hardly enough to purchase even half an hour of labour"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"particular about\" means…", opts:["careful and wants it done exactly right","happy for anyone to do it, as long as they finish the job quickly","angry with","not interested in"],
   hint:"Read the next sentence: \"Only I can do it properly.\"", focus:"Aunt Polly is very particular about this fence.",
   explain:"The answer is \"careful and wants it done exactly right\". Tom says only he can do it properly."},
  {stem:"In paragraph D, \"refused\" means…", opts:["said no","asked a question about something he did not understand","laughed loudly","painted again"],
   hint:"What did Tom do when Ben asked to try?", focus:"The more Tom refused, the more Ben wanted to paint."},
  {stem:"In paragraph D, \"surrendered\" means…", opts:["gave up something he had","ate the rest of his apple very slowly while he watched Tom paint","asked politely for","threw away angrily"],
   hint:"What did Ben do with his apple in the end?", focus:"he surrendered his apple simply for the privilege"}]},
 {skill:"Detail: two points", para:"E", q:[
  {type:"short", stem:"Write two things Tom got from the boys.", groups:TOM_GOT, need:2,
   hint:"Look in paragraph E. Find \"By the afternoon\".", focus:"Tom had a kite, a dead rat on a string, twelve marbles and lots of other treasures.",
   explain:"Possible answers (any two): a kite; a dead rat on a string; twelve marbles; Ben's apple."},
  {type:"short", stem:"Give two things Tom gained by the afternoon.", groups:TOM_GOT, need:2,
   hint:"Paragraph E: what did Tom own by the afternoon?", focus:"By the afternoon, Tom owned a kite, a dead rat on a string, twelve marbles and a pile of other treasures."},
  {type:"short", stem:"Identify two things Tom had gained by the end of the day.", groups:TOM_GOT, need:2,
   hint:"Paragraph E: \"Tom had amassed…\"", focus:"Tom had amassed a kite, a dead rat on a string, twelve marbles and a heap of other treasures"}]},
 {skill:"Inference", para:"C", q:[
  {stem:"Why did Tom paint very carefully when Ben came?", opts:["He wanted the job to look interesting.","He was afraid that Aunt Polly was watching him from the window of the house.","He was tired.","He didn't see Ben."],
   hint:"Look in paragraph C. Tom paints \"like an artist\". Why?", focus:"He painted very carefully, like an artist.",
   explain:"The answer is \"He wanted the job to look interesting.\" Tom wants Ben to think painting is fun, not work."},
  {stem:"Why did Tom pretend to admire his work?", opts:["To make Ben think painting was enjoyable","To show Aunt Polly that he had finished the whole fence before lunch","Because he was really proud of it","Because he wanted Ben to go away"],
   hint:"Paragraph C: what does Tom say to Ben after this?", focus:"stepping back now and then to admire his work like an artist"},
  {stem:"What does Tom's behaviour in paragraph C suggest about him?", opts:["He is a skilled performer who understands other people.","He is a lazy boy who never thinks about other people's feelings at all.","He genuinely enjoys painting fences.","He is afraid of his friend Ben."],
   hint:"Paragraph C: \"feigned\" means pretended.", focus:"Tom feigned surprise."}]},
 {skill:"Cause and effect", para:"D", q:[
  {type:"short", stem:"What did Tom say when Ben asked to try, and what did Ben do then?", groups:[TOM_DID,BEN_DID], need:2,
   hint:"Look in paragraph D. Find \"No,\" and \"In the end\".", focus:"In the end, he gave Tom his apple for the chance to paint.",
   explain:"Possible answers: Tom said no; Ben wanted to paint more and gave Tom his apple."},
  {type:"short", stem:"Explain how Tom's answer to Ben affected Ben.", groups:[TOM_DID,BEN_DID], need:2,
   hint:"Paragraph D: \"The more…, the more…\"", focus:"The more Tom refused, the more Ben wanted to paint."},
  {type:"short", stem:"Explain the effect of Tom's refusals on Ben.", groups:[TOM_DID,BEN_DID], need:2,
   hint:"Paragraph D: what did each refusal \"sharpen\"?", focus:"Each refusal only sharpened Ben's desire"}]},
 {skill:"Writer's purpose", para:"F", q:[
  {stem:"Why does the writer talk about advertisers in paragraph F?", opts:["To show that they use the same trick as Tom","To tell readers which products are limited edition in the shops this year","To say that Tom became an advertiser","To explain how to paint a fence"],
   hint:"Read paragraph F. Find \"the same trick\".", focus:"Advertisers today still use the same trick.",
   explain:"The answer is \"To show that they use the same trick as Tom\". Adverts make products seem hard to get, so we want them more."},
  {stem:"Why does the writer mention \"limited edition\" products?", opts:["To give a modern example of Tom's idea","To advise readers to buy limited edition products before they sell out","To show that Tom's story is not true","To describe Tom's treasures"],
   hint:"Paragraph F: \"the same idea today\".", focus:"Advertisers still rely on the same idea today."},
  {stem:"What is the function of paragraph F?", opts:["It links the story to a principle that advertisers use.","It summarises the events of the story in the order they happened that day.","It criticises Tom for tricking his friends.","It describes what happened to Tom later."],
   hint:"Paragraph F moves from Tom to the modern world.", focus:"Advertisers continue to exploit the same principle."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What lesson does the writer take from the story?", opts:["People want things more when they are hard to get.","Hard work is always better than playing by the river with your friends.","Never trust your friends.","Painting is easy if you are careful."],
   hint:"Read the first sentence of paragraph F.", focus:"if you want people to want something, make it difficult to get",
   explain:"The answer is \"People want things more when they are hard to get.\" The writer says this is Tom's lesson, and advertisers still use it."},
  {stem:"What does the writer think Tom discovered?", opts:["A rule about how people behave","A new way to paint fences faster and with less paint than before","That his friends were unkind","That work is always fun"],
   hint:"Paragraph F: \"a great law of…\"", focus:"Tom had discovered a great law of human behaviour"},
  {stem:"Which statement best reflects the writer's view in paragraph F?", opts:["Scarcity makes things seem more valuable, and advertisers know it.","Tom's trick was dishonest, so advertisers should never use the same method again.","Children understand advertising better than adults.","Limited edition products are always better quality."],
   hint:"Paragraph F: \"make it difficult to obtain\". Then, who uses this idea?", focus:"in order to make people desire something, it is only necessary to make it difficult to obtain"}]}
];

export const UNIT4_TEXTS = [
  { id: "s8-supermarket", unitNo: 4, unit: U, topic: "The supermarket knows you", blurb: "Why do you always leave the supermarket with more than you planned?", levels: SHOP_LEVELS, slots: SHOP_SLOTS },
  { id: "s8-famous", unitNo: 4, unit: U, topic: "Famous faces", blurb: "Why do companies pay stars and influencers to use their products?", levels: FAME_LEVELS, slots: FAME_SLOTS },
  { id: "s8-adverts", unitNo: 4, unit: U, topic: "From painted walls to pop-ups", blurb: "A short history of advertising, from ancient Rome to your phone.", levels: ADS_LEVELS, slots: ADS_SLOTS },
  { id: "s8-fence", unitNo: 4, unit: U, topic: "The fence", blurb: "How Tom Sawyer got his friends to pay him to do his work.", levels: FENCE_LEVELS, slots: FENCE_SLOTS }
];
