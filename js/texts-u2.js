// Unit 2 · Well-being: three more practice texts (the sleep text is in content.js).
// Same format: three levels with the same paragraph letters, eight slots, first MCQ option correct.
const U = "Unit 2 · Well-being";

/* ---------- 1. The two faces of malnutrition ---------- */
const FOOD_FIXES = [
 {label:"cheap healthy food", k:["cheap","price","afford","cost","less expensive"]},
 {label:"beans / lentils / vegetarian", k:["bean","lentil","vegetarian","vegetable","plant"]},
 {label:"less food waste", k:["waste","throw","leftover","bin"]},
 {label:"school meals / education", k:["school","lunch","meal","teach","learn","label"]},
 {label:"less junk food", k:["junk","fast food","fizzy","burger","sugar"]},
 {label:"give food to charities", k:["charit","donat","unsold","give away"]}];
const JUNK_CAUSE = {label:"junk food is cheap / filling", k:["cheap","price","cost","afford","money","poor","poverty","fill"]};
const JUNK_RESULT = {label:"too many calories, too few nutrients", k:["calorie","nutri","vitamin","fat","sugar","weight","obes","malnutrition","undernourish"]};

const FOOD_LEVELS = [
 { title:"Too much and not enough", paras:[
  ["A","When people hear the word malnutrition, they usually think of very thin, hungry children. That is part of the picture. But doctors say there is another side: people who eat too much of the wrong food. Both groups are not getting the nutrition their bodies need."],
  ["B","Hundreds of millions of people in the world do not have enough to eat. Most of them live in poverty. Children who are undernourished often grow more slowly, get ill more easily and find it hard to learn at school."],
  ["C","At the same time, more than a billion people are now living with obesity. Many of them eat a lot of fast food and junk food. This kind of food has lots of calories from fat and sugar, but very few vitamins. Obesity can lead to illnesses such as diabetes and heart disease."],
  ["D","Surprisingly, these two problems are often connected. In many cities, junk food is cheaper than fresh fruit and vegetables. So families with little money often buy food that fills them up but does not keep them healthy. A person can be overweight and still be malnourished."],
  ["E","There is also the problem of food waste. About one fifth of the food in shops and homes is thrown away. That food could feed many hungry people. Some supermarkets now give food that they cannot sell to charities."],
  ["F","So what can we do? Eating more beans and lentils is cheap and healthy, and you do not have to be vegetarian to enjoy them. We can try to consume less junk food and waste less. Good nutrition should not be a luxury. Everyone has the right to healthy food."]],
  gloss:"nutrition: the food your body needs to be healthy · charity: a group that helps people in need" },
 { title:"Too much and not enough", paras:[
  ["A","Say the word malnutrition and most people picture painfully thin, hungry children. That image is accurate, but it is only half the story. Doctors now use the word for anyone whose diet does not give them the nutrition they need, and that includes people who eat too much of the wrong kind of food."],
  ["B","Hundreds of millions of people around the world still do not have enough to eat, and most of them live in poverty. Undernourished children often grow more slowly than they should, catch infections more easily and struggle to concentrate at school, which can affect their whole future."],
  ["C","Meanwhile, more than a billion people are living with obesity. Diets based on fast food and junk food play a large part. These foods are packed with calories from fat and sugar but contain few vitamins or minerals. Over time, obesity increases the risk of serious illnesses, including diabetes and heart disease."],
  ["D","What surprises many people is that the two problems are often linked. In many cities, a burger and a fizzy drink cost less than a meal of fresh vegetables and fish. Families on low incomes therefore tend to buy food that fills them up cheaply but does not keep them healthy. As a result, a person can be overweight and malnourished at the same time."],
  ["E","Food waste makes the situation even more frustrating. Around a fifth of the food available in shops and homes is thrown away, much of it still safe to eat. Some countries now encourage supermarkets to donate unsold food to charities instead of putting it in the bin."],
  ["F","There are no simple solutions, but small changes help. Beans and lentils are cheap and nutritious, and you certainly do not have to be vegetarian to enjoy them. Consuming less junk food and wasting less are good places to start. In the end, healthy food should not be a luxury for the few, but something everyone can afford."]],
  gloss:"donate: give something to help others · nutritious: full of things your body needs" },
 { title:"The double burden", paras:[
  ["A","The word malnutrition tends to conjure up images of painfully thin children in times of famine. That image is accurate, but incomplete. Health experts now use the term for any diet that fails to provide the nutrition the body requires, a definition that embraces not only those who eat too little, but also those who eat too much of the wrong things."],
  ["B","Hundreds of millions of people worldwide still lack sufficient food, the overwhelming majority of them living in poverty. For children, the consequences can be lifelong: undernourished children are more likely to have stunted growth, to succumb to infections, and to fall behind at school."],
  ["C","At the other end of the scale, more than a billion people are now living with obesity. Diets dominated by fast food and junk food bear much of the responsibility. Such foods are dense in calories, largely from fat and sugar, yet poor in vitamins and minerals. Over time, obesity substantially raises the risk of chronic illnesses such as type 2 diabetes and heart disease."],
  ["D","Counter-intuitively, the two problems frequently coexist, sometimes within the same household. In many cities, a burger and a fizzy drink are cheaper than a meal of fresh vegetables and fish, so families on low incomes are pushed towards food that satisfies hunger cheaply while doing little for health. The result is a paradox: a person can be overweight and malnourished at the same time."],
  ["E","Food waste adds a further, frustrating dimension. Roughly a fifth of the food available to consumers in shops and homes is discarded, much of it perfectly edible. A growing number of countries now require or encourage supermarkets to donate unsold food to charities rather than sending it to landfill."],
  ["F","There is no single solution to what experts call the \"double burden\" of malnutrition, but modest changes add up. Beans and lentils are inexpensive and highly nutritious, and one need not be vegetarian to appreciate them. Consuming less junk food and wasting less are sensible starting points. Ultimately, however, good nutrition will remain out of reach for many until healthy food stops being a luxury and becomes something everyone can afford."]],
  gloss:"stunted: not grown to the normal size · paradox: something that seems impossible but is true" }
];

const FOOD_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["Two kinds of malnutrition: not enough food and too much of the wrong food","How to cook beans and lentils","Why supermarkets throw food away","How children grow"],
   hint:"Read paragraph A and paragraph F again. What two groups of people does the text talk about?", focus:"Both groups are not getting the nutrition their bodies need.",
   explain:"The answer is \"Two kinds of malnutrition: not enough food and too much of the wrong food\". Paragraph B is about hungry people, C is about obesity, and D shows how they are connected."},
  {stem:"What is the text mainly about?", opts:["Why malnutrition includes both hunger and obesity, and how the two are linked","The dangers of fast food for teenagers","How charities help hungry children","The causes of heart disease"],
   hint:"Paragraph A says the usual image is \"only half the story\". What is the whole story?", focus:"That image is accurate, but it is only half the story."},
  {stem:"Which statement best summarises the article?", opts:["Malnutrition includes both undernourishment and obesity, problems often linked by poverty and the cost of healthy food.","Obesity is now a bigger problem than hunger in every country.","Food waste is the main cause of malnutrition.","Eating beans and lentils would end world hunger."],
   hint:"The summary needs both sides of the \"double burden\" and what links them (D). Watch out for answers that are too strong.", focus:"a definition that embraces not only those who eat too little"}]},
 {skill:"Detail", para:"E", q:[
  {stem:"How much of the food in shops and homes is thrown away?", opts:["About one fifth","About half","Almost all of it","About one tenth"],
   hint:"Look in paragraph E. Find \"thrown away\".", focus:"About one fifth of the food in shops and homes is thrown away.",
   explain:"The answer is \"about one fifth\". Paragraph E says \"About one fifth of the food in shops and homes is thrown away.\""},
  {stem:"According to paragraph E, what are some countries encouraging supermarkets to do?", opts:["Give unsold food to charities","Sell food more cheaply","Stop selling junk food","Grow their own vegetables"],
   hint:"Find \"supermarkets\" in paragraph E. Read to the end of the sentence.", focus:"donate unsold food to charities instead of putting it in the bin"},
  {stem:"According to paragraph E, what is frustrating about food waste?", opts:["Much of the food thrown away is still safe to eat.","Supermarkets refuse to give food to charities.","Most waste comes from restaurants.","Charities cannot store fresh food."],
   hint:"Paragraph E: find \"much of it\". What is true about the discarded food?", focus:"much of it perfectly edible"}]},
 {skill:"Vocabulary in context", para:"B", q:[
  {stem:"In paragraph B, \"undernourished\" children…", opts:["do not get enough food","eat too much","are very tall","do not go to school"],
   hint:"Find \"undernourished\" in paragraph B. The paragraph is about people who do not have enough to eat.", focus:"Children who are undernourished often grow more slowly",
   explain:"The answer is \"do not get enough food\". Paragraph B is about people who \"do not have enough to eat\", and undernourished children grow more slowly."},
  {stem:"In paragraph B, \"struggle to concentrate\" means…", opts:["find it hard to think carefully","refuse to think","think very quickly","enjoy thinking"],
   hint:"Find \"struggle\" in paragraph B. Is it easy or difficult for these children at school?", focus:"struggle to concentrate at school"},
  {stem:"In paragraph B, \"succumb to\" infections means…", opts:["be defeated by them","protect others from them","recover quickly from them","study them"],
   hint:"Find \"succumb to\" in paragraph B. It is in a list of bad consequences for undernourished children.", focus:"to succumb to infections"}]},
 {skill:"Detail: two points", para:"F", q:[
  {type:"short", stem:"Write two things we can do to help with the problems in the text.", groups:FOOD_FIXES, need:2,
   hint:"Look in paragraphs E and F. What can people and supermarkets do?", focus:"Eating more beans and lentils is cheap and healthy",
   explain:"Possible answers (any two): eat more beans and lentils; eat less junk food; waste less food; give unsold food to charities."},
  {type:"short", stem:"Give two small changes that could help, according to paragraph F.", groups:FOOD_FIXES, need:2,
   hint:"Paragraph F: find \"small changes help\". What are they?", focus:"Consuming less junk food and wasting less are good places to start."},
  {type:"short", stem:"Identify two modest changes that could help to address malnutrition.", groups:FOOD_FIXES, need:2,
   hint:"Paragraph F: look for what is \"inexpensive and highly nutritious\" and what the \"sensible starting points\" are.", focus:"Consuming less junk food and wasting less are sensible starting points."}]},
 {skill:"Inference", para:"D", q:[
  {stem:"Why do some families with little money buy junk food?", opts:["Because it is cheaper than healthy food","Because they do not like vegetables","Because doctors tell them to","Because there are no shops near them"],
   hint:"Look in paragraph D. Compare the price of junk food and fresh food.", focus:"junk food is cheaper than fresh fruit and vegetables",
   explain:"The answer is \"Because it is cheaper than healthy food\". Paragraph D says junk food is cheaper, so families with little money often buy it."},
  {stem:"What can we infer from paragraph D about families on low incomes?", opts:["They often have to choose food by price, not by health.","They do not care about their health.","They prefer fast food to home cooking.","They do not know which foods are healthy."],
   hint:"Paragraph D: what do these families \"tend to buy\", and why? Is it really a free choice?", focus:"Families on low incomes therefore tend to buy food that fills them up cheaply"},
  {stem:"What does the phrase \"are pushed towards\" suggest about low-income families' food choices?", opts:["Their choices are shaped by price more than by preference.","They are forced to buy food by supermarkets.","They choose junk food because they enjoy it most.","They have no interest in eating healthily."],
   hint:"Paragraph D: if you are \"pushed\" somewhere, did you choose to go there freely? What is doing the pushing?", focus:"families on low incomes are pushed towards food that satisfies hunger cheaply"}]},
 {skill:"Cause and effect", para:"D", q:[
  {type:"short", stem:"How can a person be overweight and malnourished at the same time? Write one reason.", groups:[JUNK_CAUSE, JUNK_RESULT], need:1,
   hint:"Look in paragraphs C and D. What does junk food have a lot of, and what does it have very little of?", focus:"So families with little money often buy food that fills them up but does not keep them healthy.",
   explain:"Possible answers: junk food is cheap, so people buy it; junk food has lots of calories but very few vitamins."},
  {type:"short", stem:"Explain how a person can be overweight and malnourished at the same time.", groups:[JUNK_CAUSE, JUNK_RESULT], need:2,
   hint:"Paragraph D gives the cause (money). Paragraph C tells you what junk food contains.", focus:"As a result, a person can be overweight and malnourished at the same time."},
  {type:"short", stem:"Explain the paradox described at the end of paragraph D.", groups:[JUNK_CAUSE, JUNK_RESULT], need:2,
   hint:"Paragraph D: why do families buy cheap food? Paragraph C: what is that food \"dense in\" and \"poor in\"?", focus:"The result is a paradox: a person can be overweight and malnourished at the same time."}]},
 {skill:"Writer's purpose", para:"A", q:[
  {stem:"Why does the writer begin with the picture of thin, hungry children?", opts:["To show what most people think before explaining the other side.","To ask readers to give money.","To describe a famous photo.","To show that only children are malnourished."],
   hint:"Look in paragraph A. After the picture, the writer says \"But…\".", focus:"But doctors say there is another side",
   explain:"The answer is \"To show what most people think before explaining the other side\". The writer starts with the usual picture, then says \"But doctors say there is another side\"."},
  {stem:"Why does the writer open the article with a common image of malnutrition?", opts:["To correct a common idea and introduce a wider definition","To make readers feel guilty","To show that the problem is only in poor countries","To introduce a story about one child"],
   hint:"Paragraph A: the image is \"only half the story\". What does the writer do next?", focus:"Doctors now use the word for anyone whose diet does not give them the nutrition they need"},
  {stem:"What is the function of the words \"accurate, but incomplete\" in paragraph A?", opts:["They accept the familiar view while signalling that the article will widen it.","They suggest that the familiar image is completely false.","They criticise doctors for using the wrong definition.","They show that the writer is uncertain about the facts."],
   hint:"Paragraph A: is the image wrong? What does \"incomplete\" tell you the rest of the article will do?", focus:"That image is accurate, but incomplete."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about healthy food?", opts:["Everyone should be able to have it.","Only rich people need it.","It is too expensive to buy.","Junk food is just as good."],
   hint:"Read the last two sentences of paragraph F.", focus:"Everyone has the right to healthy food.",
   explain:"The answer is \"Everyone should be able to have it\". The writer says healthy food \"should not be a luxury\" and \"Everyone has the right to healthy food\"."},
  {stem:"What is the writer's attitude in paragraph F?", opts:["Realistic: there are no easy answers, but small changes and fairer prices matter","Hopeless: nothing can be done","Angry with people who eat junk food","Certain that vegetarian diets are the only answer"],
   hint:"Paragraph F: \"There are no simple solutions, but…\". What comes after \"but\"?", focus:"There are no simple solutions, but small changes help."},
  {stem:"Which statement best reflects the writer's conclusion?", opts:["Individual choices help, but the deeper problem is the cost of healthy food.","Malnutrition will be solved if people simply eat more beans.","People who eat junk food are responsible for their own health.","Supermarkets are entirely to blame for the double burden."],
   hint:"Paragraph F: \"Ultimately, however…\". What must change for good nutrition to be within reach?", focus:"until healthy food stops being a luxury and becomes something everyone can afford"}]}
];

/* ---------- 2. Keeping your cool ---------- */
const CALM_TIPS = [
 {label:"breathe slowly", k:["breath","breathe"]},
 {label:"count / wait", k:["count","ten","wait","pause"]},
 {label:"name the feeling", k:["name","word","label","say how","say what","i feel"]},
 {label:"walk away", k:["away","leave","leaving"]},
 {label:"see the other side (empathy)", k:["empath","other person","their side","other side","their shoes","understand"]}];
const ANGER_BODY = {label:"body reacts: heart / adrenaline", k:["heart","adrenal","hormone","body","breath","fast","hot","muscle"]};
const ANGER_THINK = {label:"hard to think clearly", k:["think","brain","decision","control","clearly","sense","regret"]};

const ANGER_LEVELS = [
 { title:"Keeping your cool", paras:[
  ["A","It was the last minute of the football final. Khoa's team was losing 1–0. A player from the other team pushed him, and the referee did nothing. Khoa was so angry that he shouted at the referee. He got a red card, and his team finished the game with ten players. \"I felt terrible afterwards,\" he says. \"I let my team down.\""],
  ["B","Everyone feels angry sometimes. Anger is a normal emotion. It can even be useful, because it tells us that something is unfair. The problem is not anger itself. The problem is what we do when we are angry."],
  ["C","When you get angry, your body changes very quickly. Your heart beats faster and your body makes a hormone called adrenaline. Your muscles get ready to fight. At the same time, it becomes harder to think clearly. That is why people sometimes say or do things that they are sorry about later."],
  ["D","Experts say there are simple ways to keep self-control. First, breathe slowly. Next, count to ten before you speak. Another idea is to name the feeling: say to yourself, \"I feel angry.\" Studies show that putting a feeling into words can make it weaker. If you can, walk away for a few minutes."],
  ["E","Empathy can help too. Empathy means trying to understand how another person feels. When you are annoyed with someone, try to see their side. Maybe they are having a bad day. Being empathetic does not mean you agree with them, but it can stop a small annoyance from becoming a big fight."],
  ["F","Being competitive is good. It makes us work hard and try our best. But we also need self-control. A self-controlled player helps the team, but a badly behaved player can lose the game. Khoa now does breathing exercises before every match. \"I still get angry,\" he says. \"But now I am in charge, not my anger.\""]],
  gloss:"referee: the person who controls a football match · adrenaline: a hormone that prepares the body for danger" },
 { title:"Keeping your cool", paras:[
  ["A","It was the final minute of the school football final, and Khoa's team was 1–0 down. When an opponent pushed him off the ball and the referee waved play on, something snapped. Khoa ran over and shouted at the referee, and moments later he was walking off the pitch with a red card. \"I felt awful afterwards,\" he admits. \"I'd let the whole team down.\""],
  ["B","Everyone gets angry from time to time; anger is a normal human emotion. It can even be useful, because it warns us that something is unfair or wrong. Psychologists stress that the problem is not anger itself, but what we do while we are feeling it."],
  ["C","Anger changes the body in seconds. The heart starts to race, and the body releases adrenaline, a hormone that prepares the muscles for action. At the same time, the parts of the brain responsible for careful thinking become less active. This is why people often say or do things in anger that they later regret."],
  ["D","Fortunately, self-control can be learned. Experts suggest slow, deep breathing to calm the body, and counting to ten before responding. Another surprisingly effective technique is to name the emotion, silently telling yourself, \"I'm feeling angry.\" Research suggests that putting a feeling into words can reduce its strength. Walking away for a few minutes, where possible, also helps."],
  ["E","Empathy, the ability to understand how someone else feels, is another powerful tool. When you are annoyed with someone, it helps to ask what might be going on for them. They might be stressed or having a bad day. Being empathetic does not mean excusing bad behaviour, but it can stop a small annoyance from turning into a serious argument."],
  ["F","Being competitive is no bad thing; it pushes us to train hard and do our best. But competitiveness works best alongside self-control: a self-controlled player is worth far more to a team than a talented but badly behaved one. These days, Khoa does breathing exercises before every match. \"I still get angry,\" he says. \"The difference is that now I'm in charge, not my anger.\""]],
  gloss:"referee: the person who controls a football match · regret: feel sorry about something you did" },
 { title:"Mastering anger", paras:[
  ["A","With a minute left in the school football final and his team trailing 1–0, Khoa was shoved off the ball. When the referee waved play on, something in him snapped. He sprinted across and confronted the referee, and moments later he was trudging off the pitch, shown a red card. \"I felt awful,\" he admits. \"I'd let the whole team down at the worst possible moment.\""],
  ["B","Anger is a universal emotion, and not an inherently harmful one. At its best, it alerts us to injustice and gives us the energy to respond. Psychologists are clear that the difficulty lies not in experiencing anger, but in how we act while in its grip."],
  ["C","Physiologically, anger is remarkably fast. Within seconds, the heart rate climbs and the body floods with adrenaline, a hormone that primes the muscles for confrontation. Meanwhile, activity in the brain regions responsible for judgement and planning is dampened. Little wonder, then, that people so often say or do things in anger that they subsequently regret."],
  ["D","Self-control, however, is a skill rather than a fixed trait. Slow, deep breathing counteracts the body's alarm response, and counting to ten creates a valuable pause before reacting. A less obvious technique is to name the emotion, silently acknowledging, \"I'm feeling angry.\" Brain-imaging research suggests that putting a feeling into words can measurably reduce its intensity. Where possible, physically stepping away for a few minutes allows the body to settle."],
  ["E","Empathy, the capacity to recognise and share another person's feelings, offers a further defence. When someone's behaviour is annoying, asking what pressures they might be under can transform our response. Being empathetic is not the same as excusing bad behaviour, but it can prevent a minor annoyance from escalating into open conflict."],
  ["F","None of this means that competitiveness should be discouraged; the drive to win motivates effort and improvement. The point is that competitiveness is most valuable when paired with self-control; a self-controlled player is an asset, while a gifted but badly behaved one is a liability. Khoa now follows a breathing routine before every match. \"I still get angry,\" he says. \"The difference is that I'm in charge now, not my anger.\""]],
  gloss:"injustice: something that is not fair · escalate: become bigger or more serious" }
];

const ANGER_SLOTS = [
 {skill:"Main idea", para:"B", q:[
  {stem:"What is the text mainly about?", opts:["How to control anger so it does not cause problems","How to win a football match","Why referees make mistakes","Why anger is always bad"],
   hint:"Read paragraph B and paragraph F. What is the problem, and what does Khoa learn?", focus:"The problem is what we do when we are angry.",
   explain:"The answer is \"How to control anger so it does not cause problems\". The text says anger is normal, explains what it does to the body, and gives ways to keep self-control."},
  {stem:"What is the text mainly about?", opts:["Why anger happens and how we can learn to manage it","Khoa's career as a football player","The rules of school football","How empathy makes people more competitive"],
   hint:"Khoa's story is an example. What do paragraphs B to E explain?", focus:"the problem is not anger itself, but what we do while we are feeling it"},
  {stem:"Which statement best summarises the article?", opts:["Anger is natural, but self-control and empathy can stop it from causing harm.","Competitive people should avoid sport to control their anger.","Anger is a dangerous emotion that should be suppressed.","Referees are responsible for players losing their temper."],
   hint:"The summary must include what anger is (B) and what helps (D and E). Watch out for answers that are too strong.", focus:"the difficulty lies not in experiencing anger, but in how we act while in its grip"}]},
 {skill:"Detail", para:"C", q:[
  {stem:"What does the body make when you get angry?", opts:["Adrenaline","Melatonin","Sugar","Vitamins"],
   hint:"Look in paragraph C. Find the name of a hormone.", focus:"your body makes a hormone called adrenaline",
   explain:"The answer is \"adrenaline\". Paragraph C says \"your body makes a hormone called adrenaline\". Melatonin is the sleep hormone from another text."},
  {stem:"According to paragraph C, what happens to the brain when we are angry?", opts:["The parts used for careful thinking become less active.","The brain stops working completely.","The brain makes more melatonin.","The brain becomes better at planning."],
   hint:"Find \"brain\" in paragraph C. Read the whole sentence.", focus:"the parts of the brain responsible for careful thinking become less active"},
  {stem:"According to paragraph C, what does adrenaline do?", opts:["It prepares the muscles for confrontation.","It slows down the heart.","It improves judgement and planning.","It makes people feel calm."],
   hint:"Find \"adrenaline\" in paragraph C. What does it \"prime\" the muscles for?", focus:"a hormone that primes the muscles for confrontation"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"self-control\" means…", opts:["being able to control how you act","being alone","feeling angry","being very good at sport"],
   hint:"Find \"self-control\" in paragraph D. The tips after it help you to stay calm and not shout.", focus:"Experts say there are simple ways to keep self-control.",
   explain:"The answer is \"being able to control how you act\". The tips in paragraph D (breathe, count, walk away) help you control what you do when you are angry."},
  {stem:"In paragraph D, a \"technique\" is…", opts:["a way of doing something","a type of feeling","a kind of hormone","a sports rule"],
   hint:"Find \"technique\" in paragraph D. What is the technique described?", focus:"Another surprisingly effective technique is to name the emotion"},
  {stem:"In paragraph D, \"counteracts\" means…", opts:["works against","makes stronger","is caused by","depends on"],
   hint:"Find \"counteracts\" in paragraph D. Does slow breathing increase or reduce the body's alarm?", focus:"Slow, deep breathing counteracts the body's alarm response"}]},
 {skill:"Detail: two points", para:"D", q:[
  {type:"short", stem:"Write two ways to stay calm when you are angry.", groups:CALM_TIPS, need:2,
   hint:"Look in paragraph D. There are four ideas: First… Next… Another idea… If you can…", focus:"First, breathe slowly. Next, count to ten before you speak.",
   explain:"Possible answers (any two): breathe slowly; count to ten; name the feeling (\"I feel angry\"); walk away for a few minutes; try to see the other person's side."},
  {type:"short", stem:"Give two techniques that can help people control their anger.", groups:CALM_TIPS, need:2,
   hint:"Paragraph D lists breathing, counting, naming and walking away.", focus:"Experts suggest slow, deep breathing to calm the body, and counting to ten before responding."},
  {type:"short", stem:"Identify two techniques described in paragraph D for managing anger.", groups:CALM_TIPS, need:2,
   hint:"Paragraph D: look at breathing, counting, naming the emotion and stepping away.", focus:"physically stepping away for a few minutes allows the body to settle"}]},
 {skill:"Inference", para:"A", q:[
  {stem:"Why did Khoa feel terrible after the match?", opts:["His red card made things harder for his team.","He was hurt in the game.","His team won without him.","The referee shouted at him."],
   hint:"Look in paragraph A. How many players did his team have after the red card?", focus:"his team finished the game with ten players",
   explain:"The answer is \"His red card made things harder for his team\". After his red card, his team had only ten players, so he felt he let them down."},
  {stem:"What does \"something snapped\" suggest about Khoa?", opts:["He suddenly lost control of his anger.","He broke his leg.","He decided to leave the team.","He started to feel tired."],
   hint:"Paragraph A: what did Khoa do right after \"something snapped\"?", focus:"something snapped"},
  {stem:"What can we infer from Khoa's comment \"at the worst possible moment\"?", opts:["He realises his reaction cost his team when they needed him most.","He thinks the referee chose a bad moment to give the card.","He believes his team would have lost anyway.","He is blaming the opponent who shoved him."],
   hint:"Paragraph A: what was happening in the match? Why would losing a player then be so bad?", focus:"I'd let the whole team down at the worst possible moment."}]},
 {skill:"Cause and effect", para:"C", q:[
  {type:"short", stem:"Why do people sometimes do things they are sorry about when they are angry?", groups:[ANGER_BODY, ANGER_THINK], need:1,
   hint:"Look in paragraph C. What happens to the body, and what becomes harder?", focus:"At the same time, it becomes harder to think clearly.",
   explain:"Possible answers: it is harder to think clearly; the body makes adrenaline and gets ready to fight."},
  {type:"short", stem:"Explain why people often say or do things in anger that they later regret.", groups:[ANGER_BODY, ANGER_THINK], need:2,
   hint:"Paragraph C: one change is in the body (heart, adrenaline). The other is in the brain.", focus:"This is why people often say or do things in anger that they later regret."},
  {type:"short", stem:"Explain the physical and mental changes that make angry people act in ways they regret.", groups:[ANGER_BODY, ANGER_THINK], need:2,
   hint:"Paragraph C: what happens to the heart and adrenaline, and what happens to \"judgement and planning\"?", focus:"activity in the brain regions responsible for judgement and planning is dampened"}]},
 {skill:"Writer's purpose", para:"A", q:[
  {stem:"Why does the writer tell Khoa's story at the start?", opts:["To give a real example of anger causing a problem.","To report the football score.","To show that referees are unfair.","To tell readers to play football."],
   hint:"Look in paragraph A. What happened because Khoa was angry?", focus:"He got a red card",
   explain:"The answer is \"To give a real example of anger causing a problem\". Khoa got angry and got a red card. This example helps us understand the rest of the text."},
  {stem:"Why does the writer return to Khoa in paragraph F?", opts:["To show how learning self-control has changed him","To report another red card","To criticise his team","To explain the rules of football"], para:"F",
   hint:"Paragraph F: what does Khoa do now before every match? How is he different from paragraph A?", focus:"These days, Khoa does breathing exercises before every match."},
  {stem:"What is the effect of beginning and ending the article with Khoa?", opts:["It frames the advice with a personal story that shows change is possible.","It suggests the article is mainly about football.","It shows that the advice did not work for Khoa.","It makes the scientific information seem less important."], para:"F",
   hint:"Compare Khoa in paragraph A and in paragraph F. What does this before-and-after show the reader?", focus:"Khoa now follows a breathing routine before every match."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about being competitive?", opts:["It is good, but you also need self-control.","It is always bad.","It causes all anger.","It is only important in football."],
   hint:"Read paragraph F. The writer says being competitive is good, \"But…\".", focus:"Being competitive is good. It makes us work hard and try our best. But we also need self-control.",
   explain:"The answer is \"It is good, but you also need self-control\". The writer says being competitive makes us work hard, but we also need self-control."},
  {stem:"What is the writer's attitude to competitiveness?", opts:["Positive, as long as it goes with self-control","Negative: it should be avoided","Neutral: the writer says nothing about it","Critical of competitive sport in schools"],
   hint:"Paragraph F: \"Being competitive is no bad thing… But…\".", focus:"But competitiveness works best alongside self-control"},
  {stem:"Which statement best reflects the writer's position in paragraph F?", opts:["Competitiveness is valuable, and it is most valuable when combined with self-control.","Competitiveness is the main cause of anger in young people.","Self-control matters more than winning in every situation.","Schools should discourage competitive sports."],
   hint:"Paragraph F: \"None of this means…\" and \"The point is…\". Watch out for answers that are too strong.", focus:"competitiveness is most valuable when paired with self-control"}]}
];

/* ---------- 3. Your body's defence force ---------- */
const DEFENCES = [
 {label:"skin", k:["skin"]},
 {label:"mucus / nose", k:["mucus","nose","sticky"]},
 {label:"stomach acid", k:["stomach","acid"]},
 {label:"white blood cells", k:["white","blood cell","cell"]},
 {label:"fever", k:["fever","temperature","hot"]}];
const ANTI_CAUSE = {label:"colds are viruses", k:["virus","viral"]};
const ANTI_RESULT = {label:"antibiotics only kill bacteria", k:["bacteri","only work","don't work","do not work","doesn't work","does not work","can't","cannot","no effect","useless"]};

const GERM_LEVELS = [
 { title:"Your body's defence force", paras:[
  ["A","You have a sore throat, a runny nose and you feel tired. You have caught a cold. But while you are lying in bed, a battle is happening inside your body. Your immune system is fighting the infection, and in a few days, it will probably win."],
  ["B","Germs are tiny living things that can make us ill. The two main types are bacteria and viruses. Bacteria are very small cells. A virus is even smaller. It cannot live alone; it has to get inside one of your cells to make copies of itself. Colds and flu are caused by viruses."],
  ["C","Your body has many ways to stop germs. Your skin is like a wall. Sticky mucus in your nose catches germs, and acid in your stomach kills many of them. If germs still get in, white blood cells attack them. You may also get a fever. A higher temperature helps your body fight the infection."],
  ["D","Many people think that antibiotics can cure a cold. This is not true. Antibiotics kill bacteria, but they do not work on viruses. If people take antibiotics when they do not need them, bacteria can change and become resistant. Then the medicine does not work when we really need it."],
  ["E","Not all bacteria are bad. Your body is home to trillions of bacteria, and most of them are harmless. Many bacteria in your stomach and gut help you to digest food. Some even help your immune system to work well."],
  ["F","So what helps recovery from a cold? Rest, sleep and drinking lots of water. Wash your hands often so you do not give the virus to other people. Your body knows how to fight. Sometimes the best thing you can do is give it time."]],
  gloss:"germ: a very small living thing that causes illness · resistant: not affected by something" },
 { title:"Your body's defence force", paras:[
  ["A","Your throat is sore, your nose is running and all you want to do is sleep. You've caught a cold. But while you lie in bed feeling sorry for yourself, a battle is taking place inside you. Your immune system is fighting the infection, and within a week or so, it will almost certainly win."],
  ["B","Most infections are caused by two kinds of germs: bacteria and viruses. Bacteria are single cells, so small that thousands could fit on a full stop. Viruses are smaller still, and they cannot survive for long on their own; to reproduce, a virus must get inside one of your cells and force it to make copies. Colds and flu are caused by viruses."],
  ["C","Your body has several lines of defence. The skin acts as a barrier, sticky mucus in the nose traps germs before they go further, and acid in the stomach destroys many of the germs we swallow. Any invaders that get past these defences are attacked by white blood cells. A fever is part of the fight too: a raised temperature makes it harder for many germs to multiply."],
  ["D","A common mistake is to ask the doctor for antibiotics for a cold. Antibiotics kill bacteria, but they have no effect on viruses, so they cannot cure a cold. Worse, using them when they are not needed helps bacteria to become resistant, which means that the medicine may not work when someone really needs it."],
  ["E","It is easy to think of all bacteria as enemies, but most are harmless, and many are helpful. Your body is home to trillions of them, roughly as many as your own cells. Bacteria in your gut help you to digest food, and some even train your immune system to respond to real threats."],
  ["F","So what actually helps recovery? Rest, plenty of sleep and lots of fluids. Washing your hands regularly protects the people around you. Your immune system has been doing this job for millions of years. Usually, the best medicine is simply to give it time."]],
  gloss:"reproduce: make copies or babies · gut: the long tube that food goes through after the stomach" },
 { title:"The battle within", paras:[
  ["A","Your throat is raw, your nose is streaming and every muscle aches. You have caught a cold. Yet while you lie in bed feeling sorry for yourself, an elaborate battle is unfolding inside you. Your immune system is mounting a coordinated response to the infection, and within a week or so, it will almost certainly prevail."],
  ["B","Most infections are caused by one of two kinds of microorganism: bacteria or viruses. Bacteria are single living cells, so minute that thousands would fit on a full stop. Viruses are smaller still and, strictly speaking, cannot reproduce on their own; to multiply, a virus must invade one of your cells and hijack its machinery to manufacture copies of itself. The common cold and flu are both viral."],
  ["C","The body's defences are layered. The skin forms a physical barrier, mucus in the nose traps invaders before they penetrate further, and stomach acid destroys many of the germs we swallow. Those that breach these outer defences are hunted down by white blood cells. Even the fever we find so unpleasant is part of the counter-attack, since a raised temperature makes it harder for many pathogens to multiply."],
  ["D","One persistent misconception is that antibiotics can cure a cold. Antibiotics target bacteria and are entirely ineffective against viruses. Prescribing them unnecessarily is worse than pointless: it accelerates antibiotic resistance, as surviving bacteria adapt, with the result that these medicines may fail precisely when they are most needed."],
  ["E","Nor should bacteria be regarded simply as enemies. The human body hosts trillions of them, roughly matching the number of human cells, and the vast majority are harmless or actively beneficial. Gut bacteria help to digest food, and some appear to help calibrate the immune system, teaching it to distinguish genuine threats from harmless substances."],
  ["F","What, then, aids recovery? Rest, adequate sleep and plenty of fluids. Regular hand-washing protects those around you. The immune system has been refined over millions of years of evolution; more often than not, the most effective treatment is simply to give it time to do its job."]],
  gloss:"pathogen: a germ that causes disease · calibrate: adjust something so it works correctly" }
];

const GERM_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["How the body fights germs and what helps us get better","How to make a cold go away with medicine","Why bacteria are always bad","How doctors work"],
   hint:"Read paragraph A and paragraph F again. What is happening inside your body when you have a cold?", focus:"Your immune system is fighting the infection",
   explain:"The answer is \"How the body fights germs and what helps us get better\". The text explains germs, the body's defences, and what helps recovery."},
  {stem:"What is the text mainly about?", opts:["How the immune system fights infections, and how we can support recovery","The history of antibiotics","The differences between colds and flu","Why bacteria help us digest food"],
   hint:"Your answer must be true for paragraphs A to F, not only one paragraph.", focus:"Your immune system is fighting the infection, and within a week or so, it will almost certainly win."},
  {stem:"Which statement best summarises the article?", opts:["The body has layered defences against germs, and recovery usually depends more on time than on medicine.","Antibiotics are the most effective treatment for common infections.","All bacteria and viruses are dangerous enemies of the body.","Fever is a harmful side effect that should always be stopped."],
   hint:"Look at how the article ends (F). The summary should include the defences and the advice about recovery.", focus:"Your immune system is mounting a coordinated response to the infection"}]},
 {skill:"Detail", para:"B", q:[
  {stem:"What causes colds and flu?", opts:["Viruses","Bacteria","Cold weather","Antibiotics"],
   hint:"Look at the last sentence of paragraph B.", focus:"Colds and flu are caused by viruses.",
   explain:"The answer is \"viruses\". Paragraph B says \"Colds and flu are caused by viruses.\""},
  {stem:"According to paragraph B, what must a virus do to reproduce?", opts:["Get inside one of your cells","Find some bacteria","Stay outside the body","Grow on your skin"],
   hint:"Find \"to reproduce\" in paragraph B. Read the rest of the sentence.", focus:"to reproduce, a virus must get inside one of your cells"},
  {stem:"According to paragraph B, how does a virus multiply?", opts:["It takes over one of your cells to make copies of itself.","It divides in two, like bacteria.","It feeds on the food in your stomach.","It releases chemicals into the blood."],
   hint:"Paragraph B: find \"hijack\". What does the virus make the cell do?", focus:"hijack its machinery to manufacture copies of itself"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"resistant\" bacteria are bacteria that…", opts:["are not killed by the medicine","are very small","help us digest food","cause colds"],
   hint:"Find \"resistant\" in paragraph D. What happens to the medicine after that?", focus:"Then the medicine does not work when we really need it.",
   explain:"The answer is \"are not killed by the medicine\". After bacteria become resistant, \"the medicine does not work\"."},
  {stem:"In paragraph C, a \"barrier\" is…", opts:["something that stops things getting through","a kind of germ","a type of medicine","a hot temperature"], para:"C",
   hint:"Find \"barrier\" in paragraph C. The skin is the barrier. What does it do to germs?", focus:"The skin acts as a barrier"},
  {stem:"In paragraph D, a \"misconception\" is…", opts:["a wrong idea that many people have","a scientific discovery","a type of medicine","a rule for doctors"],
   hint:"Find \"misconception\" in paragraph D. Is the idea that antibiotics cure a cold true or false?", focus:"One persistent misconception is that antibiotics can cure a cold."}]},
 {skill:"Detail: two points", para:"C", q:[
  {type:"short", stem:"Write two ways your body stops germs.", groups:DEFENCES, need:2,
   hint:"Look in paragraph C. Think about your skin, nose, stomach and blood.", focus:"Your skin is like a wall. Sticky mucus in your nose catches germs",
   explain:"Possible answers (any two): skin is like a wall; mucus in your nose catches germs; stomach acid kills germs; white blood cells attack germs; a fever helps fight the infection."},
  {type:"short", stem:"Give two of the body's defences against germs.", groups:DEFENCES, need:2,
   hint:"Paragraph C describes several \"lines of defence\". Name two.", focus:"Any invaders that get past these defences are attacked by white blood cells."},
  {type:"short", stem:"Identify two layers of the body's defence against infection.", groups:DEFENCES, need:2,
   hint:"Paragraph C: the defences are \"layered\". Think about the outer defences and what happens to germs that \"breach\" them.", focus:"Those that breach these outer defences are hunted down by white blood cells."}]},
 {skill:"Inference", para:"F", q:[
  {stem:"\"Sometimes the best thing you can do is give it time.\" What does the writer mean?", opts:["Your body will usually fight the cold by itself.","You should wait a long time before seeing a doctor.","You should never take any medicine.","Colds last for many months."],
   hint:"Look in paragraph F. What does the writer say about your body before this sentence?", focus:"Your body knows how to fight.",
   explain:"The answer is \"Your body will usually fight the cold by itself\". The writer says \"Your body knows how to fight\", so resting and waiting is often enough."},
  {stem:"What can we infer from \"Your immune system has been doing this job for millions of years\"?", opts:["The immune system is very experienced and usually reliable.","The immune system gets weaker as we get older.","Humans did not catch colds in the past.","Modern medicine has made the immune system unnecessary."],
   hint:"Paragraph F: if someone has done a job for a very long time, what are they probably like at it?", focus:"Your immune system has been doing this job for millions of years."},
  {stem:"What does the writer suggest by describing fever as \"part of the counter-attack\"?", opts:["Something we see as a problem is actually helping the body.","Fever is the most dangerous symptom of a cold.","Doctors should always try to raise a patient's temperature.","Fever is caused by antibiotics."], para:"C",
   hint:"Paragraph C: we \"find so unpleasant\" the fever, \"Even\"… What is the writer's surprising point?", focus:"Even the fever we find so unpleasant is part of the counter-attack"}]},
 {skill:"Cause and effect", para:"D", q:[
  {type:"short", stem:"Why can't antibiotics cure a cold?", groups:[ANTI_CAUSE, ANTI_RESULT], need:1,
   hint:"Look in paragraph D. What do antibiotics kill? What causes a cold (paragraph B)?", focus:"Antibiotics kill bacteria, but they do not work on viruses.",
   explain:"Possible answers: a cold is caused by a virus; antibiotics only kill bacteria, not viruses."},
  {type:"short", stem:"Explain why antibiotics cannot cure a cold.", groups:[ANTI_CAUSE, ANTI_RESULT], need:2,
   hint:"Paragraph D: what do antibiotics kill, and what causes colds?", focus:"Antibiotics kill bacteria, but they have no effect on viruses, so they cannot cure a cold."},
  {type:"short", stem:"Explain why prescribing antibiotics for a cold is \"worse than pointless\".", groups:[ANTI_CAUSE, ANTI_RESULT], need:2,
   hint:"Paragraph D: why is it pointless (what causes colds, and what do antibiotics target)? Mention why it is worse, too.", focus:"Antibiotics target bacteria and are entirely ineffective against viruses."}]},
 {skill:"Writer's purpose", para:"E", q:[
  {stem:"Why does the writer include paragraph E?", opts:["To show that many bacteria are good for us.","To tell readers to eat more bacteria.","To explain how to cure a cold.","To show that bacteria cause most illnesses."],
   hint:"Look at the first sentence of paragraph E.", focus:"Not all bacteria are bad.",
   explain:"The answer is \"To show that many bacteria are good for us\". Paragraph E starts \"Not all bacteria are bad\" and explains how they help."},
  {stem:"Why does the writer include paragraph E?", opts:["To correct the idea that all bacteria are harmful","To explain why antibiotics do not work","To describe how viruses reproduce","To give advice about recovery"],
   hint:"Paragraph E begins \"It is easy to think of all bacteria as enemies, but…\".", focus:"It is easy to think of all bacteria as enemies"},
  {stem:"How does paragraph E connect to the argument in paragraph D?", opts:["It gives a further reason not to treat all bacteria as enemies to be destroyed.","It explains how bacteria become resistant.","It contradicts the warning about antibiotics.","It introduces a new disease caused by gut bacteria."],
   hint:"Paragraph D warns against using antibiotics unnecessarily. Paragraph E begins \"Nor should bacteria be regarded simply as enemies\". How do they fit together?", focus:"Nor should bacteria be regarded simply as enemies."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think we should do when we have a cold?", opts:["Rest, sleep, drink water and give the body time.","Take antibiotics straight away.","Go to school as normal.","Stay away from water."],
   hint:"Read paragraph F.", focus:"Rest, sleep and drinking lots of water.",
   explain:"The answer is \"Rest, sleep, drink water and give the body time\". The writer lists rest, sleep and water, and says the best thing is to give the body time."},
  {stem:"What is the writer's attitude towards the immune system?", opts:["Confident that it can usually deal with a cold","Worried that it often fails","Doubtful about how it works","Critical of people who rely on it"],
   hint:"Paragraph F: the immune system has done this job \"for millions of years\". What does \"Usually, the best medicine…\" suggest?", focus:"Usually, the best medicine is simply to give it time."},
  {stem:"Which statement best reflects the writer's view in paragraph F?", opts:["For common infections, supporting the body's own defences is usually more useful than medicine.","Medicine is never necessary for any infection.","The immune system can defeat every disease without help.","Hand-washing is more important than rest and sleep."],
   hint:"Paragraph F: \"more often than not\". Watch out for answers with \"never\" or \"every\".", focus:"more often than not, the most effective treatment is simply to give it time to do its job"}]}
];

export const UNIT2_TEXTS = [
  { id: "food", unitNo: 2, unit: U, topic: "Too much and not enough", blurb: "How can someone be overweight and malnourished at the same time?", levels: FOOD_LEVELS, slots: FOOD_SLOTS },
  { id: "anger", unitNo: 2, unit: U, topic: "Keeping your cool", blurb: "Anger is normal. What you do with it is what matters.", levels: ANGER_LEVELS, slots: ANGER_SLOTS },
  { id: "germs", unitNo: 2, unit: U, topic: "Your body's defence force", blurb: "What really happens inside you when you catch a cold?", levels: GERM_LEVELS, slots: GERM_SLOTS }
];
