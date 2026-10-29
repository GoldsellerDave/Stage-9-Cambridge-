// Unit 4 · Science: four practice texts. Same format as the sleep text in content.js:
// three levels with the same paragraph letters, eight slots, first MCQ option correct.
const U = "Unit 4 · Science";

/* ---------- 1. Saving the Arabian oryx ---------- */
const ORYX_HELP = [
 {label:"bred in zoos", k:["zoo","captiv","breed","bred","born","babies","baby"]},
 {label:"released / returned", k:["release","return","sent back","back to","reintroduc","set free","free"]},
 {label:"herders as rangers", k:["herder","ranger","guard","local","protect","watch"]},
 {label:"protected area", k:["law","sanctuary","protected area","reserve","banned","ban"]}];
const HUNT_CAUSE = {label:"hunters / poachers", k:["hunt","poach","shoot","shot","kill","gun"]};
const HUNT_HOW = {label:"cars and guns", k:["car","truck","vehicle","gun","rifle","jeep","drive","fast","easy"]};

const ORYX_LEVELS = [
 { title:"Back from the brink", paras:[
  ["A","The Arabian oryx is a beautiful white animal with long, straight horns. It lives in the hot desert, and it can go for weeks without drinking. But in 1972, hunters shot the last wild oryx in Oman. The animal was extinct in the wild."],
  ["B","Why did this happen? For hundreds of years, local people hunted a few oryx for food. But in the 20th century, hunters came with cars and guns. They could follow the animals across the desert very easily, and the oryx had nowhere to hide. To these hunters, the oryx was easy prey."],
  ["C","Luckily, a few oryx were already living in captivity. In 1962, scientists caught some of the last wild animals and took them to a zoo in the USA. There, they lived in a large enclosure, and they started to breed. Slowly, the small group grew into a herd of hundreds."],
  ["D","In 1982, some of the zoo animals went back to Oman. Local herders became rangers. They knew the desert well, and they watched the oryx every day. Despite the heat and the lack of water, the animals did well, and soon there were hundreds in the wild."],
  ["E","But then there was a new problem. Poachers started to catch the oryx and sell them. Soon, only about 65 were left in that part of Oman. Other countries, like Saudi Arabia, the UAE and Jordan, had also brought oryx back, so the animal did not disappear again."],
  ["F","Today, there are more than a thousand Arabian oryx in the wild. Experts say it is one of the greatest success stories in conservation. But the story of Oman shows that saving an animal is not a job you finish. People must keep protecting it."]],
  gloss:"herd: a group of animals · conservation: protecting nature and animals" },
 { title:"Back from the brink", paras:[
  ["A","The Arabian oryx is a striking white antelope with long, straight horns, perfectly adapted to life in the desert: it can survive for weeks without drinking, getting water from the plants it eats. But in 1972, hunters shot what were thought to be the last wild oryx in Oman. The species was officially extinct in the wild."],
  ["B","For centuries, local people had hunted a small number of oryx without harming the population. The change came in the 20th century, when hunters began using cars and modern rifles. They could chase the animals across open desert for hours, and the oryx, which rely on hiding and running, had no chance. To these hunters, the oryx was simply easy prey."],
  ["C","Fortunately, scientists had seen the danger coming. In 1962, they captured a few of the remaining wild animals and sent them to a zoo in Arizona, in the USA, where other zoos added the oryx they already had in captivity. Kept in a large enclosure that was similar to their desert home, the animals began to breed, and the small group slowly grew into a herd of several hundred."],
  ["D","In 1982, the first zoo-born oryx were flown back to Oman. Members of the local Harasis tribe, traditionally camel and goat herders, were employed as rangers to watch over them. Their knowledge of the desert proved essential. Despite years of drought, the herd grew to around 450 animals."],
  ["E","Then the story took a darker turn. From the late 1990s, poachers began capturing oryx to sell them abroad, and within ten years the population in Oman had fallen to about 65. Fortunately, other countries, including Saudi Arabia, the United Arab Emirates and Jordan, had their own programmes, and the species survived."],
  ["F","Today, more than a thousand Arabian oryx live in the wild, and the species is often described as one of conservation's great success stories. Yet the events in Oman are a warning. Saving an animal from extinction is not a single achievement; it is a responsibility that never really ends."]],
  gloss:"antelope: an animal like a deer · drought: a long time with no rain" },
 { title:"Back from the brink", paras:[
  ["A","With its brilliant white coat and long, straight horns, the Arabian oryx is superbly adapted to one of the harshest environments on Earth: it can go for weeks without drinking, drawing moisture from the plants it eats. Yet in 1972, hunters in Oman shot what were believed to be the last wild members of the species. The Arabian oryx had become extinct in the wild."],
  ["B","Hunting alone does not explain the collapse. For centuries, Bedouin hunters had taken a modest number of oryx without endangering the population. What changed in the 20th century was technology: armed with motor vehicles and modern rifles, hunting parties could pursue the animals across open desert until they were exhausted. An animal whose survival depended on distance and speed was suddenly easy prey."],
  ["C","Fortunately, the warning signs had not gone unnoticed. In 1962, a small team captured several of the remaining wild animals and transported them to a zoo in Arizona, where they joined a few oryx already held in captivity elsewhere. Housed in a spacious enclosure with a climate not unlike their own, the animals began to breed, and this tiny \"World Herd\" eventually numbered several hundred."],
  ["D","In 1982, the first captive-bred oryx were flown back to Oman. Crucially, members of the local Harasis tribe, traditionally camel and goat herders, were recruited as rangers, and their intimate knowledge of the desert proved invaluable. Despite a prolonged drought, the reintroduced herd had grown to around 450 animals by the mid-1990s."],
  ["E","The recovery, however, proved fragile. From the late 1990s, poachers began capturing oryx to supply a private trade in live animals, and within a decade Oman's population had collapsed to roughly 65. The species survived only because neighbouring countries, among them Saudi Arabia, the United Arab Emirates and Jordan, had established reintroduction programmes of their own."],
  ["F","Today, more than a thousand Arabian oryx roam the wild, and the species is routinely held up as one of conservation's great triumphs. The Omani experience, however, offers a sobering lesson: bringing an animal back from extinction is not a finish line but the beginning of a commitment that must be sustained indefinitely."]],
  gloss:"Bedouin: desert people of Arabia · sobering: making you think seriously" }
];

const ORYX_SLOTS = [
 {skill:"Main idea", para:"F", q:[
  {stem:"What is the text mainly about?", opts:["How people saved the Arabian oryx after it died out in the wild","How oryx live without water","Why zoos in the USA are good","How to become a park ranger"],
   hint:"Read paragraph A and paragraph F again. What happened to the oryx from the start to the end?", focus:"Experts say it is one of the greatest success stories in conservation.",
   explain:"The answer is \"How people saved the Arabian oryx after it died out in the wild\". The text starts with the oryx becoming extinct in the wild (A) and ends with more than a thousand back in the wild (F)."},
  {stem:"What is the text mainly about?", opts:["The extinction and return of the Arabian oryx, and the challenges of protecting it","The life of the Harasis people in Oman","How zoos in Arizona care for desert animals","Why hunting should be banned in all countries"],
   hint:"Your answer must cover the whole story, from paragraph A to paragraph F.", focus:"Saving an animal from extinction is not a single achievement"},
  {stem:"Which statement best summarises the article?", opts:["Captive breeding brought the oryx back, but its survival depends on continued protection.","The Arabian oryx was saved entirely by zoos in the USA.","Poaching has made the Arabian oryx extinct for a second time.","Traditional hunting was the main reason the oryx disappeared."],
   hint:"Look at how the article ends: \"not a finish line but…\". The summary must include the success and the warning.", focus:"bringing an animal back from extinction is not a finish line"}]},
 {skill:"Detail", para:"C", q:[
  {stem:"When did scientists catch some of the last wild oryx?", opts:["In 1962","In 1972","In 1982","In the 1990s"],
   hint:"Look in paragraph C. Find a year.", focus:"In 1962, scientists caught some of the last wild animals",
   explain:"The answer is \"in 1962\". 1972 is when the last wild oryx was shot (A), and 1982 is when oryx went back to Oman (D)."},
  {stem:"According to paragraph C, where did the captured oryx go?", opts:["To a zoo in Arizona, in the USA","To a desert park in Oman","To zoos in Jordan and Saudi Arabia","To a farm owned by herders"],
   hint:"Find \"1962\" in paragraph C. Where were the animals sent?", focus:"sent them to a zoo in Arizona, in the USA"},
  {stem:"According to paragraph C, what helped the oryx to breed in Arizona?", opts:["A spacious enclosure with a climate similar to their own","Food brought from the Arabian desert","Keeping them in small separate groups","The help of rangers from Oman"],
   hint:"Paragraph C: find \"Housed in…\". What was the enclosure like?", focus:"Housed in a spacious enclosure with a climate not unlike their own"}]},
 {skill:"Vocabulary in context", para:"C", q:[
  {stem:"In paragraph C, \"breed\" means…", opts:["have babies","eat food","run fast","fight"],
   hint:"Find \"breed\" in paragraph C. What happened to the size of the group after that?", focus:"they started to breed. Slowly, the small group grew",
   explain:"The answer is \"have babies\". After the oryx started to breed, the group \"grew into a herd of hundreds\"."},
  {stem:"In paragraph C, \"enclosure\" means…", opts:["an area with a fence around it","a desert","a kind of food","a team of scientists"],
   hint:"Find \"enclosure\" in paragraph C. Where would a zoo keep large animals?", focus:"Kept in a large enclosure that was similar to their desert home"},
  {stem:"In paragraph D, \"invaluable\" means…", opts:["extremely useful","not worth anything","impossible to measure","too expensive"], para:"D",
   hint:"Find \"invaluable\" in paragraph D. Did the rangers' knowledge help or not? The word \"Crucially\" is a clue.", focus:"their intimate knowledge of the desert proved invaluable"}]},
 {skill:"Detail: two points", para:"D", q:[
  {type:"short", stem:"Write two things people did to help the oryx.", groups:ORYX_HELP, need:2,
   hint:"Look in paragraphs C and D. What happened in the zoo, and what happened in Oman in 1982?", focus:"In 1982, some of the zoo animals went back to Oman. Local herders became rangers.",
   explain:"Possible answers (any two): they took oryx to a zoo and let them breed; they took zoo oryx back to Oman; local herders became rangers and watched them."},
  {type:"short", stem:"Give two ways in which people helped the oryx return to the wild.", groups:ORYX_HELP, need:2,
   hint:"Paragraph D: what happened to the zoo-born oryx, and who was employed?", focus:"the first zoo-born oryx were flown back to Oman"},
  {type:"short", stem:"Identify two measures that contributed to the oryx's return to the wild.", groups:ORYX_HELP, need:2,
   hint:"Paragraphs C and D: think about breeding, releasing and the people who were recruited.", focus:"members of the local Harasis tribe, traditionally camel and goat herders, were recruited as rangers"}]},
 {skill:"Inference", para:"D", q:[
  {stem:"Why did the herders make good rangers?", opts:["They already knew the desert very well.","They had worked in a zoo before.","They wanted to hunt the oryx.","They owned a lot of cars."],
   hint:"Look in paragraph D. What did the herders know?", focus:"They knew the desert well",
   explain:"The answer is \"They already knew the desert very well\". Herders spend their lives in the desert with their animals, so they knew where to look and what to watch for."},
  {stem:"What can we infer about why local herders were employed as rangers?", opts:["Their experience of desert life made them good at protecting the oryx.","They had been the hunters who caused the problem.","The zoo in Arizona trained them.","They were the only people who wanted the job."],
   hint:"Paragraph D: what was \"essential\"? What do herders do every day?", focus:"Their knowledge of the desert proved essential."},
  {stem:"What does the word \"Crucially\" at the start of the second sentence in paragraph D suggest?", opts:["The writer thinks involving local people was a key reason for success.","The writer thinks the rangers made a serious mistake.","The rangers were more important than the oryx.","Bringing the oryx back by plane was the most difficult part."],
   hint:"\"Crucially\" means \"very importantly\". What does the writer think was very important?", focus:"Crucially, members of the local Harasis tribe"}]},
 {skill:"Cause and effect", para:"B", q:[
  {type:"short", stem:"Why did the oryx become extinct in the wild?", groups:[HUNT_CAUSE, HUNT_HOW], need:1,
   hint:"Look in paragraph B. What did the hunters use in the 20th century?", focus:"But in the 20th century, hunters came with cars and guns.",
   explain:"Possible answers: hunters killed them; hunters had cars and guns, so they could follow the oryx easily."},
  {type:"short", stem:"Explain why the oryx population fell so quickly in the 20th century.", groups:[HUNT_CAUSE, HUNT_HOW], need:2,
   hint:"Paragraph B: who killed the oryx, and what new things did they use?", focus:"hunters began using cars and modern rifles"},
  {type:"short", stem:"Explain why hunting in the 20th century had a greater effect than hunting in earlier centuries.", groups:[HUNT_CAUSE, HUNT_HOW], need:2,
   hint:"Paragraph B: \"What changed in the 20th century was technology.\" What technology, and what did hunters do with it?", focus:"armed with motor vehicles and modern rifles, hunting parties could pursue the animals"}]},
 {skill:"Writer's purpose", para:"E", q:[
  {stem:"Why does the writer tell us about the poachers in paragraph E?", opts:["To show that the oryx was in danger again.","To explain how the oryx were caught in 1962.","To show that zoos are better than the desert.","To describe Jordan."],
   hint:"Look in paragraph E. It starts \"But then there was a new problem.\"", focus:"But then there was a new problem.",
   explain:"The answer is \"To show that the oryx was in danger again\". After the success in D, paragraph E shows a new danger: poachers caught and sold the oryx."},
  {stem:"What is the purpose of paragraph E?", opts:["To show that the success story nearly went wrong","To explain how poachers sell animals abroad","To compare Oman with other countries","To criticise the rangers"],
   hint:"Paragraph E begins \"Then the story took a darker turn.\" What does a darker turn mean?", focus:"Then the story took a darker turn."},
  {stem:"How does paragraph E prepare the reader for the writer's conclusion?", opts:["It shows that even a successful recovery can be reversed, supporting the idea that protection must continue.","It proves that reintroduction programmes always fail.","It suggests that Oman should give up protecting the oryx.","It explains why the oryx is no longer at risk."],
   hint:"Paragraph F says protection must be \"sustained indefinitely\". Which event in E supports that idea?", focus:"The recovery, however, proved fragile."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think?", opts:["People must keep protecting the oryx.","The oryx is now completely safe.","Zoos should keep all the oryx.","Poachers will win in the end."],
   hint:"Read the last two sentences of paragraph F.", focus:"People must keep protecting it.",
   explain:"The answer is \"People must keep protecting the oryx\". The writer says saving an animal \"is not a job you finish\"."},
  {stem:"What is the writer's view of the oryx story?", opts:["It is a success, but also a warning that protection must continue.","It is a failure because of the poachers.","It shows that conservation is easy.","It proves that zoos are the best place for wild animals."],
   hint:"Paragraph F: the writer calls it a success, then says \"Yet…\". What is the warning?", focus:"Yet the events in Oman are a warning."},
  {stem:"Which statement best reflects the writer's position in paragraph F?", opts:["Celebrating conservation successes is fine, as long as we remember they need long-term commitment.","The oryx's recovery has been exaggerated by conservation groups.","Once an animal is reintroduced, it can be left to survive on its own.","Oman's efforts were a complete failure."],
   hint:"Paragraph F: \"not a finish line but the beginning of a commitment\". Watch out for answers that are too strong.", focus:"the beginning of a commitment that must be sustained indefinitely"}]}
];

/* ---------- 2. How we see colour ---------- */
const COLOUR_FACTS = [
 {label:"red and green look similar", k:["red","green","similar","same","confus","mix"]},
 {label:"more common in men / boys", k:["men","man","boy","male","12"]},
 {label:"caused by genes", k:["gene","genetic","inherit","born","parent","family"]},
 {label:"a receptor doesn't work normally", k:["receptor","cone","work","retina"]}];
const GENE_X = {label:"gene on the X chromosome", k:["x chromosome","the x","one x","an x","chromosome","gene"]};
const TWO_COPIES = {label:"women have two copies", k:["two","second","both","backup","back-up","other copy","another"]};

const COLOUR_LEVELS = [
 { title:"How many colours can you see?", paras:[
  ["A","Look at a rainbow. You can see red, orange, yellow, green, blue and violet. But do all people see the same colours? Scientists say no. Some people see fewer colours, and a few people may see many more."],
  ["B","Light travels in waves. Each colour has a different wave length: red light has long waves, and blue light has short waves. At the back of your eye there is a thin layer called the retina. It has millions of cells that react to light."],
  ["C","Some of these cells are colour receptors. Most people have three types: one for red light, one for green and one for blue. Your brain puts the messages from all three together, and you see millions of colours. Dogs have only two types, so they see fewer colours than we do."],
  ["D","About 1 in 12 men and 1 in 200 women are colour blind. Most of them are not really \"blind\" to colour. Usually one type of receptor does not work normally, so red and green look very similar. The cause is in our genetics: colour blindness is passed from parents to children."],
  ["E","Why are more men colour blind? The gene for red and green receptors is on the X chromosome. Women have two X chromosomes, so if one has a problem, the other usually works. Men have only one X, so they have no second copy."],
  ["F","Some women may have four types of colour receptor. They are called tetrachromatic. In 2010, research found one woman who could see differences between colours that other people could not. Scientists are still learning about this. So the next time you look at a rainbow, remember: the person next to you may see it differently."]],
  gloss:"chromosome: a tiny part of a cell that carries genes · gene: information in our cells that comes from our parents" },
 { title:"How many colours can you see?", paras:[
  ["A","Look at a rainbow and you will probably name six or seven colours: red, orange, yellow, green, blue and violet. But do we all see the same rainbow? According to scientists, we do not. Some people see fewer colours than average, and a very small number may see far more."],
  ["B","Light travels in waves, and each colour has a different wave length. Red light has the longest waves that we can see, and violet has the shortest. When light enters the eye, it reaches the retina, a thin layer at the back of the eye that contains millions of light-sensitive cells."],
  ["C","Some of these cells, known as cones, are colour receptors. Most people have three types, each most sensitive to a different part of the spectrum: roughly red, green and blue. The brain compares the signals from all three, and this allows us to tell apart around a million different shades. Dogs, by contrast, have only two types of cone, so their world contains far fewer colours."],
  ["D","Around 1 in 12 men and 1 in 200 women are colour blind. Despite the name, very few of them see in black and white. In most cases, one type of cone does not work in the usual way, so reds and greens look confusingly similar. The condition is almost always caused by genetics, which means it is inherited from parents."],
  ["E","The reason men are affected more often lies in where the genes are found. The genes for the red and green receptors are carried on the X chromosome. Women have two X chromosomes, so if one carries a faulty gene, the second usually acts as a backup. Men have only one X chromosome, so they have no second copy to fall back on."],
  ["F","Surprisingly, the same genetics may give some women a fourth type of cone. Such people are described as tetrachromatic. In research published in 2010, scientists identified one woman who could distinguish shades that looked identical to everyone else. Most people with four cones, however, seem to see colours in the normal way, and researchers are still trying to understand why."]],
  gloss:"spectrum: all the colours of light · inherited: passed from parents to children" },
 { title:"Seeing the world differently", paras:[
  ["A","Ask most people to describe a rainbow and they will list six or seven colours, from red through to violet. The assumption that we all see the same rainbow, however, turns out to be mistaken. Some people perceive a narrower range of colours than average, while a tiny minority may perceive considerably more."],
  ["B","Light travels as waves, and what we experience as colour corresponds to differences in wave length: red light has the longest wavelengths visible to the human eye, and violet the shortest. Light entering the eye falls on the retina, a delicate layer of tissue at the back of the eye packed with millions of light-sensitive cells."],
  ["C","A subset of these cells, the cones, act as colour receptors. Most humans possess three types, each most responsive to a different region of the spectrum, roughly corresponding to red, green and blue. By comparing the relative strength of their signals, the brain can distinguish perhaps a million shades. Dogs, with only two cone types, inhabit a considerably less colourful world."],
  ["D","Approximately 1 in 12 men and 1 in 200 women are colour blind. Despite the term, very few of them see the world in black and white. More commonly, one type of cone responds abnormally, so that reds and greens become difficult to tell apart. The condition is overwhelmingly a matter of genetics, passed down through families."],
  ["E","The imbalance between the sexes is explained by the location of the relevant genes. The genes for the red and green receptors sit on the X chromosome. Since women inherit two X chromosomes, a faulty gene on one is usually compensated for by a working copy on the other. Men, who inherit only one X chromosome, have no such backup."],
  ["F","Intriguingly, the same genetic variation may equip some women with a fourth type of cone, making them potentially tetrachromatic. In research published in 2010, scientists identified one woman able to distinguish shades that appeared identical to other observers. Yet most women with four cone types appear to see colour much like everyone else, and having more receptors is clearly not the whole story: the mantis shrimp, which has over a dozen, is surprisingly poor at telling similar colours apart. Colour, it seems, depends as much on the brain as on the eye."]],
  gloss:"perceive: notice with your senses · compensate for: make up for something that is missing" }
];

const COLOUR_SLOTS = [
 {skill:"Main idea", para:"A", q:[
  {stem:"What is the text mainly about?", opts:["Why different people can see colours differently","How rainbows are made","Why dogs cannot see red","How to test your eyes"],
   hint:"Read paragraph A and paragraph F again. What question does the text ask at the start?", focus:"But do all people see the same colours? Scientists say no.",
   explain:"The answer is \"Why different people can see colours differently\". The text explains how we see colour, then why some people see fewer colours and some may see more."},
  {stem:"What is the text mainly about?", opts:["How the eye sees colour, and why some people see colour differently","The science of light waves","How colour blindness can be cured","The eyesight of dogs and other animals"],
   hint:"The text explains how we see colour (B and C) and then talks about differences (D to F). Which answer includes both?", focus:"According to scientists, we do not."},
  {stem:"Which statement best summarises the article?", opts:["Colour vision depends on receptors in the eye and on the brain, and it varies between people.","Women see more colours than men because they have more cones.","Most colour-blind people see the world in black and white.","Having more colour receptors always means seeing more colours."],
   hint:"Look at the last sentence of paragraph F. The summary must include the eye, the brain and differences between people.", focus:"Colour, it seems, depends as much on the brain as on the eye.", para:"F"}]},
 {skill:"Detail", para:"D", q:[
  {stem:"How many men are colour blind?", opts:["About 1 in 12","About 1 in 200","About 1 in 2","About 1 in 1,000"],
   hint:"Look in paragraph D. Find the numbers.", focus:"About 1 in 12 men and 1 in 200 women are colour blind.",
   explain:"The answer is \"about 1 in 12\". Paragraph D says \"About 1 in 12 men and 1 in 200 women are colour blind.\" 1 in 200 is for women."},
  {stem:"According to paragraph D, what happens in most cases of colour blindness?", opts:["One type of cone does not work in the usual way.","The person sees only in black and white.","The retina is damaged by bright light.","The brain cannot receive any colour signals."],
   hint:"Find \"In most cases\" in paragraph D. Read the rest of the sentence.", focus:"In most cases, one type of cone does not work in the usual way"},
  {stem:"According to paragraph D, which colours do colour-blind people most often find hard to tell apart?", opts:["Reds and greens","Blues and violets","Black and white","Yellows and oranges"],
   hint:"Paragraph D: find \"difficult to tell apart\".", focus:"reds and greens become difficult to tell apart"}]},
 {skill:"Vocabulary in context", para:"B", q:[
  {stem:"In paragraph B, the \"retina\" is…", opts:["a thin layer at the back of the eye","a kind of light","a colour","a part of the brain"],
   hint:"Find \"retina\" in paragraph B. The words just before it tell you where it is and what it is.", focus:"At the back of your eye there is a thin layer called the retina.",
   explain:"The answer is \"a thin layer at the back of the eye\". Paragraph B says: \"At the back of your eye there is a thin layer called the retina.\""},
  {stem:"In paragraph C, a \"receptor\" is a cell that…", opts:["receives a signal and reacts to it","sends light out of the eye","makes colours brighter","protects the eye from damage"], para:"C",
   hint:"Find \"receptors\" in paragraph C. What does each type do with light?", focus:"Some of these cells, known as cones, are colour receptors."},
  {stem:"In paragraph E, \"compensated for\" means…", opts:["made up for","made worse by","caused by","hidden from"], para:"E",
   hint:"Find \"compensated for\" in paragraph E. If one gene is faulty, what does the working copy do?", focus:"a faulty gene on one is usually compensated for by a working copy on the other"}]},
 {skill:"Detail: two points", para:"D", q:[
  {type:"short", stem:"Write two facts about colour blindness.", groups:COLOUR_FACTS, need:2,
   hint:"Look in paragraph D. Think about who has it, what they see and what causes it.", focus:"so red and green look very similar",
   explain:"Possible answers (any two): more men than women are colour blind; red and green look very similar; one type of receptor does not work normally; it is caused by genetics (passed from parents)."},
  {type:"short", stem:"Give two facts about colour blindness from paragraph D.", groups:COLOUR_FACTS, need:2,
   hint:"Paragraph D: who has it, what usually goes wrong, and what is the cause?", focus:"The condition is almost always caused by genetics"},
  {type:"short", stem:"Identify two facts about colour blindness given in paragraph D.", groups:COLOUR_FACTS, need:2,
   hint:"Paragraph D includes numbers, a description of what goes wrong, and a cause.", focus:"one type of cone responds abnormally"}]},
 {skill:"Inference", para:"F", q:[
  {stem:"What can we understand from \"Scientists are still learning about this\"?", opts:["Scientists do not fully understand tetrachromatic vision yet.","Scientists are students at a school.","Scientists think tetrachromatic people do not exist.","Scientists have finished their research."],
   hint:"Look in paragraph F. If scientists are \"still learning\", do they know everything?", focus:"Scientists are still learning about this.",
   explain:"The answer is \"Scientists do not fully understand tetrachromatic vision yet\". \"Still learning\" means the research is not finished."},
  {stem:"What can we infer from paragraph F about the woman identified in 2010?", opts:["She was unusual, even among women with four cones.","She was the only woman with four cones.","She could not see red or green.","She was a scientist herself."],
   hint:"Paragraph F: what can most people with four cones do? Was she the same or different?", focus:"Most people with four cones, however, seem to see colours in the normal way"},
  {stem:"What does the example of the mantis shrimp suggest?", opts:["The number of receptors alone does not decide how well an animal sees colour.","Mantis shrimp see more colours than any other animal.","Tetrachromatic women see as well as mantis shrimp.","Scientists have stopped researching colour vision."],
   hint:"Paragraph F: the shrimp has \"over a dozen\" receptors. Is it good at telling colours apart?", focus:"is surprisingly poor at telling similar colours apart"}]},
 {skill:"Cause and effect", para:"E", q:[
  {type:"short", stem:"Why are more men colour blind than women? Write one reason.", groups:[GENE_X, TWO_COPIES], need:1,
   hint:"Look in paragraph E. How many X chromosomes do women have? How many do men have?", focus:"Women have two X chromosomes, so if one has a problem, the other usually works.",
   explain:"Possible answers: the gene is on the X chromosome; women have two X chromosomes, so the other one usually works, but men have only one."},
  {type:"short", stem:"Explain why men are more likely than women to be colour blind.", groups:[GENE_X, TWO_COPIES], need:2,
   hint:"Paragraph E: where are the genes, and why does having two X chromosomes help women?", focus:"the second usually acts as a backup"},
  {type:"short", stem:"Explain the imbalance between men and women in rates of colour blindness.", groups:[GENE_X, TWO_COPIES], need:2,
   hint:"Paragraph E: the genes \"sit on the X chromosome\". Then compare what women and men inherit.", focus:"Since women inherit two X chromosomes"}]},
 {skill:"Writer's purpose", para:"C", q:[
  {stem:"Why does the writer talk about dogs in paragraph C?", opts:["To show what happens with fewer colour receptors.","To tell readers to buy a dog.","To show that dogs are colour blind like men.","To explain how dogs hear."],
   hint:"Look in paragraph C. How many types of receptor do dogs have, compared with people?", focus:"Dogs have only two types, so they see fewer colours than we do.",
   explain:"The answer is \"To show what happens with fewer colour receptors\". Dogs have two types, not three, so they see fewer colours. This helps us understand why receptors matter."},
  {stem:"Why does the writer mention dogs in paragraph C?", opts:["As a contrast that shows why the number of cone types matters","To give advice about pets","To show that dogs are colour blind in the same way as humans","To introduce the topic of tetrachromatic vision"],
   hint:"Paragraph C: \"Dogs, by contrast…\". What is being contrasted?", focus:"Dogs, by contrast, have only two types of cone"},
  {stem:"What is the function of the mantis shrimp example in paragraph F?", opts:["It challenges the idea that more receptors automatically mean better colour vision.","It shows that animals see better than humans.","It proves that tetrachromatic women do not exist.","It introduces a new topic about sea creatures."], para:"F",
   hint:"Paragraph F: \"having more receptors is clearly not the whole story\". How does the shrimp support this?", focus:"having more receptors is clearly not the whole story"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer want readers to remember?", opts:["Other people may see colours differently from them.","Rainbows have seven colours.","Everyone should test their eyes.","Women see better than men."],
   hint:"Read the last sentence of paragraph F.", focus:"the person next to you may see it differently",
   explain:"The answer is \"Other people may see colours differently from them\". The writer ends by saying the person next to you may see a rainbow differently."},
  {stem:"What is the writer's attitude towards research on tetrachromatic vision?", opts:["Interested, but careful not to claim more than is known","Doubtful that it is real","Certain that many women see more colours","Uninterested in the topic"],
   hint:"Paragraph F: the writer says \"Surprisingly\", but then \"however\" and \"still trying to understand\".", focus:"researchers are still trying to understand why"},
  {stem:"Which statement best reflects the writer's conclusion?", opts:["Seeing colour is not only about the eye; the brain plays an equal role.","Tetrachromatic people have the best colour vision of any living thing.","More research on colour vision is a waste of time.","The mantis shrimp's eyes should be copied in new technology."],
   hint:"Find the last sentence of paragraph F: \"Colour, it seems, depends…\".", focus:"depends as much on the brain as on the eye"}]}
];

/* ---------- 3. How diseases spread ---------- */
const STOP_SPREAD = [
 {label:"quarantine / keep apart", k:["quarantin","apart","isolat","stay away","staying away","keep away","keeping away","away from","stay at home","staying at home","stay home","staying home","at home","separate","distance","wait"]},
 {label:"clean water", k:["clean water","water","pump","drink"]},
 {label:"wash hands / hygiene", k:["wash","hand","soap","hygien"]},
 {label:"vaccines / immunity", k:["vaccin","immun","injection"]}];
const WATER_SOURCE = {label:"contaminated water / pump", k:["water","pump","contaminat","dirty","drink"]};
const WATER_RESULT = {label:"people got ill", k:["ill","sick","cholera","disease","died","die","death"]};

const DISEASE_LEVELS = [
 { title:"How diseases spread", paras:[
  ["A","In the 1300s, a terrible disease called the plague killed millions of people in Europe. Nobody understood how it spread. But the port of Ragusa, now Dubrovnik in Croatia, had an idea. Ships from other places had to wait thirty days before anyone could come on land. Later, Venice made ships wait forty days: in Italian, quaranta giorni. This is where our word quarantine comes from."],
  ["B","Today we know that many diseases are caused by tiny living things like bacteria and viruses. They spread in different ways. Influenza, or flu, spreads through the air when people cough and sneeze. Tuberculosis, or TB, also spreads through the air. Other diseases spread through food or water."],
  ["C","In 1854, many people in one part of London became ill with cholera. A doctor called John Snow made a map. He marked the house of every person who was ill. Most of the houses were near one water pump. Snow asked the city to remove the pump handle. The water was contaminated, and when people stopped drinking it, fewer people became ill."],
  ["D","When a disease spreads quickly in one country or area, it is an epidemic. When it spreads around the world, it is a pandemic. In 1918, a flu pandemic infected about a third of all the people in the world, and tens of millions died."],
  ["E","Our bodies can fight back. When we catch some diseases, our immune system learns to recognise them. Next time, we have immunity, so we do not get ill again. Vaccines teach the body in the same way, but without the illness."],
  ["F","We have learned a lot since the plague. Simple things, like washing your hands, drinking clean water and staying at home when you are ill, still save many lives. TB still kills more than a million people every year, so the fight is not over."]],
  gloss:"cholera: a disease you get from dirty water · infect: give someone a disease" },
 { title:"How diseases spread", paras:[
  ["A","In the 1300s, a disease known as the plague swept across Europe, killing millions. Nobody knew what caused it, but the port city of Ragusa, now Dubrovnik in Croatia, tried something new: ships arriving from affected areas had to wait thirty days before anyone was allowed ashore. Venice later extended this to forty days, or quaranta giorni in Italian, which gave us the word quarantine."],
  ["B","Today we know that infectious diseases are caused by microscopic organisms such as bacteria and viruses, and that they travel in different ways. Influenza spreads through tiny droplets in the air when an infected person coughs or sneezes. Tuberculosis, a bacterial disease of the lungs, also spreads through the air, while others, such as cholera, are carried in contaminated food or water."],
  ["C","The importance of clean water was first shown by a London doctor, John Snow. During a cholera outbreak in 1854, he marked the home of every victim on a map of the area. Most of the cases were clustered around a single water pump. Snow persuaded local officials to remove the pump's handle, and the number of new cases fell. The well had been contaminated by sewage."],
  ["D","Scientists use different words for outbreaks of different sizes. An epidemic is a sudden rise in cases in one region; a pandemic is an epidemic that spreads across many countries or continents. The influenza pandemic of 1918 infected roughly a third of the world's population and killed tens of millions of people."],
  ["E","Fortunately, the human body has its own defences. After we recover from certain infections, our immune system remembers the germ, giving us immunity: if it attacks again, the body destroys it before we become ill. Vaccines work in the same way, training the immune system without the danger of the disease itself."],
  ["F","Medicine has changed beyond recognition since the plague. Yet the simplest measures, such as washing hands, drinking clean water and staying away from others when we are sick, still save millions of lives. With tuberculosis still killing more than a million people a year, the battle against infectious disease is far from won."]],
  gloss:"ashore: onto land from a ship · sewage: dirty water from toilets" },
 { title:"An invisible enemy", paras:[
  ["A","When the plague swept across Europe in the 14th century, killing millions, nobody understood what caused it. The port city of Ragusa, now Dubrovnik in Croatia, nonetheless devised a remarkably modern response: ships arriving from affected regions were required to wait thirty days before anyone could come ashore. Venice later extended the period to forty days, quaranta giorni, giving us the word quarantine. The measure was based on observation rather than science, but it worked."],
  ["B","We now know that infectious diseases are caused by microscopic organisms, chiefly bacteria and viruses, and that they exploit different routes of transmission. Influenza travels in airborne droplets expelled when an infected person coughs or sneezes, as does tuberculosis, a bacterial infection of the lungs. Others, cholera among them, are carried in contaminated food or water."],
  ["C","The critical role of clean water was first demonstrated by the London physician John Snow. During a cholera outbreak in 1854, he plotted the home of each victim on a street map and noticed that cases clustered around a single public water pump. At a time when most experts blamed \"bad air\", Snow persuaded local officials to remove the pump's handle, and new cases declined. The well, it later emerged, had been contaminated by a nearby cesspit."],
  ["D","Epidemiologists distinguish between outbreaks of different scales. An epidemic is a sudden increase in cases within a particular region, whereas a pandemic is an epidemic that has spread across several countries or continents. The influenza pandemic of 1918 is thought to have infected around a third of the world's population and killed tens of millions."],
  ["E","The body is not defenceless, however. Having recovered from certain infections, the immune system retains a memory of the pathogen, conferring immunity: should the same germ return, it is destroyed before symptoms develop. Vaccines exploit this mechanism, training the immune system without exposing the body to the disease itself."],
  ["F","Medicine has advanced beyond recognition since the days of the plague, yet some of the most effective defences remain strikingly simple: washing hands, ensuring access to clean water, and keeping away from others when unwell. With tuberculosis alone still claiming more than a million lives a year, it would be dangerously complacent to regard the battle against infectious disease as won."]],
  gloss:"pathogen: a germ that causes disease · complacent: too satisfied, so you stop being careful" }
];

const DISEASE_SLOTS = [
 {skill:"Main idea", para:"F", q:[
  {stem:"What is the text mainly about?", opts:["How diseases spread and how people have learned to stop them","The life of John Snow","Why Venice is a famous city","How to make a vaccine"],
   hint:"Read paragraph A and paragraph F. What has changed between the 1300s and today?", focus:"We have learned a lot since the plague.",
   explain:"The answer is \"How diseases spread and how people have learned to stop them\". The text goes from the plague to today, explaining how diseases spread and what protects us."},
  {stem:"What is the text mainly about?", opts:["How infectious diseases spread and the ways humans have learned to fight them","The history of medicine in Italy","The differences between bacteria and viruses","Why tuberculosis is the most dangerous disease"],
   hint:"Your answer must be true for paragraphs A to F, not only one of them.", focus:"Medicine has changed beyond recognition since the plague."},
  {stem:"Which statement best summarises the article?", opts:["Our understanding of disease has grown hugely, but simple precautions remain vital and the fight is not over.","Modern medicine has defeated infectious disease.","Quarantine is the only effective way to stop a pandemic.","John Snow's discovery was more important than vaccines."],
   hint:"Paragraph F has two ideas: progress, and a warning. The summary must include both.", focus:"it would be dangerously complacent to regard the battle against infectious disease as won"}]},
 {skill:"Detail", para:"A", q:[
  {stem:"How long did ships wait in Ragusa?", opts:["Thirty days","Forty days","Fourteen days","One year"],
   hint:"Look in paragraph A. Find \"Ragusa\". Be careful: there are two numbers.", focus:"Ships from other places had to wait thirty days before anyone could come on land.",
   explain:"The answer is \"thirty days\". Ragusa made ships wait thirty days. Forty days was later, in Venice."},
  {stem:"According to paragraph A, where does the word \"quarantine\" come from?", opts:["The Italian words for \"forty days\"","The name of a doctor in Ragusa","The Latin word for \"ship\"","The name of the plague in Croatian"],
   hint:"Find \"quaranta giorni\" in paragraph A.", focus:"Venice later extended this to forty days, or quaranta giorni in Italian, which gave us the word quarantine."},
  {stem:"According to paragraph A, what was unusual about Ragusa's response to the plague?", opts:["It worked, even though nobody understood the cause of the disease.","It was based on scientific research.","It was copied from Venice.","It closed the port completely."],
   hint:"Paragraph A: find the last sentence. What was the measure based on?", focus:"The measure was based on observation rather than science, but it worked."}]},
 {skill:"Vocabulary in context", para:"C", q:[
  {stem:"In paragraph C, \"contaminated\" water is…", opts:["dirty and dangerous to drink","very cold","from the sea","safe and clean"],
   hint:"Find \"contaminated\" in paragraph C. What happened when people stopped drinking it?", focus:"The water was contaminated, and when people stopped drinking it, fewer people became ill.",
   explain:"The answer is \"dirty and dangerous to drink\". When people stopped drinking the contaminated water, fewer people became ill."},
  {stem:"In paragraph C, \"clustered around\" means…", opts:["were grouped close to","were far away from","were hidden under","were moving towards"],
   hint:"Find \"clustered around\" in paragraph C. Most cases were near one pump. Were they close together or spread out?", focus:"Most of the cases were clustered around a single water pump."},
  {stem:"In paragraph E, \"conferring\" immunity means…", opts:["giving immunity","losing immunity","testing immunity","preventing immunity"], para:"E",
   hint:"Find \"conferring\" in paragraph E. After recovering, does the body have immunity or not?", focus:"retains a memory of the pathogen, conferring immunity"}]},
 {skill:"Detail: two points", para:"F", q:[
  {type:"short", stem:"Write two simple things that help stop diseases spreading.", groups:STOP_SPREAD, need:2,
   hint:"Look in paragraph F. Find \"Simple things, like…\".", focus:"Simple things, like washing your hands, drinking clean water and staying at home when you are ill, still save many lives.",
   explain:"Possible answers (any two): washing your hands; drinking clean water; staying at home when you are ill; vaccines; quarantine."},
  {type:"short", stem:"Give two simple measures that still save millions of lives.", groups:STOP_SPREAD, need:2,
   hint:"Paragraph F: find \"the simplest measures, such as…\".", focus:"such as washing hands, drinking clean water and staying away from others when we are sick"},
  {type:"short", stem:"Identify two simple defences against infectious disease mentioned in paragraph F.", groups:STOP_SPREAD, need:2,
   hint:"Paragraph F: the defences are \"strikingly simple\" and listed after the colon.", focus:"washing hands, ensuring access to clean water, and keeping away from others when unwell"}]},
 {skill:"Inference", para:"A", q:[
  {stem:"Why did Ragusa make ships wait?", opts:["So that sick people would show signs of illness before they came on land","Because the port was too busy","Because the ships were too big","So that people could rest after a long journey"],
   hint:"Look in paragraph A. What was killing people at the time? What could happen during the waiting days?", focus:"Nobody understood how it spread.",
   explain:"The answer is \"So that sick people would show signs of illness before they came on land\". If someone on the ship had the plague, it would show during the waiting time, so the disease would not reach the city."},
  {stem:"What can we infer about the people of Ragusa?", opts:["They noticed that the plague arrived with ships from other places.","They knew that bacteria caused the plague.","They wanted to stop trade with other cities.","They had already invented vaccines."],
   hint:"Paragraph A: ships \"from affected areas\" had to wait. What must people have noticed?", focus:"ships arriving from affected areas had to wait thirty days"},
  {stem:"What does \"At a time when most experts blamed 'bad air'\" suggest about John Snow?", opts:["His idea went against what most experts believed.","He agreed with most experts of his time.","He was not a real doctor.","He did not believe that cholera existed."],
   hint:"Paragraph C: did Snow blame the air or the water? Was that the usual view?", focus:"At a time when most experts blamed \"bad air\"", para:"C"}]},
 {skill:"Cause and effect", para:"C", q:[
  {type:"short", stem:"Why did so many people get ill with cholera in 1854?", groups:[WATER_SOURCE, WATER_RESULT], need:1,
   hint:"Look in paragraph C. What was wrong with the water from the pump?", focus:"The water was contaminated",
   explain:"Possible answer: because they drank contaminated water from one pump, so they got ill."},
  {type:"short", stem:"Explain what caused the cholera outbreak in 1854 and what happened as a result.", groups:[WATER_SOURCE, WATER_RESULT], need:2,
   hint:"Paragraph C: what was in the well, and what happened to the people who used the pump?", focus:"The well had been contaminated by sewage."},
  {type:"short", stem:"Explain why removing the pump handle reduced the number of cholera cases.", groups:[WATER_SOURCE, WATER_RESULT], need:2,
   hint:"Paragraph C: what had contaminated the well? What happened to new cases when people could not use it?", focus:"The well, it later emerged, had been contaminated by a nearby cesspit."}]},
 {skill:"Writer's purpose", para:"D", q:[
  {stem:"Why does the writer give the example of 1918?", opts:["To show how serious a pandemic can be.","To show that flu is not dangerous.","To explain how vaccines work.","To describe life in 1918."],
   hint:"Look in paragraph D. How many people were infected, and how many died?", focus:"In 1918, a flu pandemic infected about a third of all the people in the world",
   explain:"The answer is \"To show how serious a pandemic can be\". A third of the world was infected and tens of millions died."},
  {stem:"Why does the writer include the example of the 1918 pandemic?", opts:["To show the scale of harm a pandemic can cause","To explain the difference between flu and tuberculosis","To criticise doctors in 1918","To show that pandemics only happened in the past"],
   hint:"Paragraph D defines a pandemic, then gives an example. What does the example show?", focus:"The influenza pandemic of 1918 infected roughly a third of the world's population"},
  {stem:"What is the purpose of the final sentence of paragraph F?", opts:["To warn readers against thinking the problem of infectious disease is solved","To praise modern medicine for defeating tuberculosis","To introduce a new topic for another article","To blame governments for deaths from tuberculosis"], para:"F",
   hint:"Paragraph F: what does \"complacent\" mean (see the gloss)? Why would the writer use it?", focus:"it would be dangerously complacent"}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about the fight against disease?", opts:["It is not over yet.","It is finished.","It is impossible to win.","Only vaccines can help."],
   hint:"Read the last sentence of paragraph F.", focus:"so the fight is not over",
   explain:"The answer is \"It is not over yet\". The writer says TB still kills more than a million people every year, \"so the fight is not over\"."},
  {stem:"What is the writer's view of simple measures like hand washing?", opts:["They are still very important, despite modern medicine.","They are less useful than modern medicine.","They were only important in the past.","They are too simple to make a difference."],
   hint:"Paragraph F: medicine has changed, \"Yet\" what do simple measures still do?", focus:"still save millions of lives"},
  {stem:"Which statement best reflects the writer's position in paragraph F?", opts:["Medical progress is real, but simple precautions remain essential and complacency is dangerous.","Modern medicine has made simple precautions unnecessary.","Infectious disease will never be controlled.","Tuberculosis is now the only serious infectious disease."],
   hint:"Paragraph F has a \"yet\" and a warning. Watch out for answers with \"never\" or \"only\".", focus:"some of the most effective defences remain strikingly simple"}]}
];

/* ---------- 4. Seeing with sound ---------- */
const SAMI_SKILLS = [
 {label:"walk to school alone", k:["walk","school","alone","himself","own"]},
 {label:"find cars / objects", k:["car","object","wall","door","pole","post","tree","bush","obstacle"]},
 {label:"tell objects apart / size", k:["size","shape","how big","differ","tell","which","hard","soft","material"]},
 {label:"ride a bike / sport", k:["bike","bicycle","ball","cycle"]}];
const SOUND_OUT = {label:"sends out a click / sound", k:["click","sound","noise","call","ping","tongue","squeak"]};
const ECHO_BACK = {label:"listens to the echo", k:["echo","bounce","come back","comes back","return","reflect"]};

const ECHO_LEVELS = [
 { title:"Seeing with sound", paras:[
  ["A","Sami is fifteen and he has been blind since he was born. Every morning he walks to school alone. As he walks, he makes a quick clicking sound with his tongue. Click, click. \"That's a parked car,\" he says. \"And that's a tree.\" Sami is using echolocation."],
  ["B","Echolocation means finding things with sound. You make a sound, and it hits an object and comes back to you. This is called an echo. From the echo, your brain can work out where the object is, how big it is and even what it is made of."],
  ["C","Bats are famous for echolocation. They fly at night and make very high sounds. Most of these sounds are too high for people to hear. Bats listen to the echoes, and they can find tiny insects in the dark. Dolphins use clicks in the same way under the sea. Ships use the same idea too: they send out a ping and listen for it to come back."],
  ["D","When Sami started clicking at the age of ten, some children at school jeered at him. \"They thought it was a strange noise,\" he says. Despite this, he kept practising. Now his classmates ask him to show them how it works. Sami never boasts, but he is proud of what he can do. He can tell a lamp post from a person, and he can find an open door."],
  ["E","Scientists are very interested in human echolocation. In 2011, research in Canada looked at the brains of blind people who use clicks. When they listened to echoes, a part of the brain that usually helps us see became active. In a later study, both blind and sighted people learned to echolocate in just ten weeks."],
  ["F","Echolocation is not the same as seeing, and it does not work for everyone in every place. But for people like Sami, it means freedom. \"My cane tells me what is next to my feet,\" he says. \"Clicking tells me about the whole street.\""]],
  gloss:"blind: not able to see · cane: a long stick that blind people use when they walk" },
 { title:"Seeing with sound", paras:[
  ["A","Sami is fifteen and has been blind since birth, yet every morning he walks to school on his own. As he goes, he makes short, sharp clicks with his tongue. Click. Click. \"Parked car on the left,\" he says, without slowing down. \"Tree coming up.\" Sami is using a skill called echolocation."],
  ["B","Echolocation means using sound to find things. When a sound hits an object, part of it bounces back as an echo. By listening carefully to that echo, the brain can work out where the object is, how far away it is, how big it is, and even whether it is hard, like a wall, or soft, like a bush."],
  ["C","The best-known echolocators are bats. As they hunt at night, they produce calls that are mostly too high for humans to hear, and from the returning echoes they can locate an insect smaller than a fingernail. Dolphins use rapid clicks in the same way underwater, and ships borrowed the idea for sonar, which sends out a ping and measures how long it takes to return."],
  ["D","When Sami first started clicking, at the age of ten, a few children at school jeered at him for making \"weird noises\". Despite this, he kept practising every day. Now his classmates queue up to try it themselves. Sami is not one to boast, but he admits he can tell a lamp post from a person and find an open doorway from several metres away."],
  ["E","Human echolocation has attracted growing interest from scientists. In 2011, researchers in Canada scanned the brains of blind people who use clicks and found that, when they listened to echoes, an area of the brain normally used for vision became active. A later study showed that both blind and sighted adults could learn the basics in only ten weeks."],
  ["F","Echolocation is not the same as sight, and it works less well in noisy places. But for Sami, it has made a huge difference. \"My cane tells me what's right in front of my feet,\" he explains. \"Clicking tells me about the whole street.\""]],
  gloss:"sonar: a system that uses sound to find things under water · cane: a long stick that blind people use when they walk" },
 { title:"Seeing with sound", paras:[
  ["A","Sami is fifteen and has been blind since birth, yet he walks to school unaccompanied every morning. As he goes, he produces short, sharp clicks with his tongue, his head turning slightly with each one. \"Parked car on the left,\" he remarks, without breaking stride. \"Tree coming up.\" What Sami is doing has a name: echolocation."],
  ["B","The principle is straightforward. When a sound strikes an object, part of it is reflected back as an echo. By analysing that echo, the brain can determine not only an object's position and distance, but also its size and even its texture: a hard surface such as a wall returns a sharper echo than a soft one such as a hedge."],
  ["C","The most accomplished echolocators are bats. Hunting at night, they emit calls largely above the range of human hearing and, from the returning echoes, can pinpoint an insect smaller than a fingernail. Dolphins rely on rapid underwater clicks in much the same way, and engineers borrowed the principle for sonar, which emits a ping and measures the time it takes to return."],
  ["D","When Sami took up clicking at the age of ten, some children at school jeered at what they called his \"weird noises\". Despite this, he persevered, practising daily. These days, his classmates line up to have a go themselves. Sami is not one to boast, though he concedes that he can distinguish a lamp post from a person and locate an open doorway from several metres away."],
  ["E","Human echolocation has attracted increasing scientific attention. In 2011, researchers in Canada scanned the brains of blind people who echolocate and discovered that, when they listened to echoes, a region of the brain ordinarily devoted to vision became active, as though the brain were \"seeing\" with sound. A subsequent study found that both blind and sighted adults could acquire the basics in as little as ten weeks, suggesting that the ability is far more widely available than once assumed."],
  ["F","Echolocation is not a substitute for sight, and it becomes far less reliable in noisy environments. For Sami, however, its value is difficult to overstate. \"My cane tells me what's directly in front of my feet,\" he explains. \"Clicking tells me about the whole street.\""]],
  gloss:"texture: how the surface of something feels · persevere: keep trying when something is difficult" }
];

const ECHO_SLOTS = [
 {skill:"Main idea", para:"B", q:[
  {stem:"What is the text mainly about?", opts:["How some people and animals use sound to find things","How bats catch insects","Why some children jeer at others","How ships find fish"],
   hint:"Read paragraph A and paragraph B. What is Sami using? The whole text is about this.", focus:"Echolocation means finding things with sound.",
   explain:"The answer is \"How some people and animals use sound to find things\". The text explains echolocation and how Sami, bats and dolphins use it."},
  {stem:"What is the text mainly about?", opts:["Echolocation: how it works, who uses it and what it means for a blind teenager","The life of bats and dolphins","How sonar was invented","Why blind people use canes"],
   hint:"Sami's story is the frame. What does every paragraph explain or show?", focus:"Echolocation means using sound to find things."},
  {stem:"Which statement best summarises the article?", opts:["Echolocation, used by animals and some humans, offers blind people like Sami real independence.","Echolocation can replace sight completely for blind people.","Bats are the only animals that can truly echolocate.","Scientists have proved that blind people see with their ears."],
   hint:"The summary should include the skill, who uses it, and why it matters to Sami. Watch out for answers that are too strong.", focus:"For Sami, however, its value is difficult to overstate.", para:"F"}]},
 {skill:"Detail", para:"E", q:[
  {stem:"How long did it take people to learn echolocation in the later study?", opts:["Ten weeks","Ten years","One day","Two years"],
   hint:"Look at the end of paragraph E.", focus:"both blind and sighted people learned to echolocate in just ten weeks",
   explain:"The answer is \"ten weeks\". Paragraph E says people \"learned to echolocate in just ten weeks\". Ten is also Sami's age when he started, so read carefully."},
  {stem:"According to paragraph E, what did the 2011 brain scans show?", opts:["A part of the brain normally used for seeing was active.","Blind people have larger brains.","The ears of blind people work better.","Clicking makes the brain tired."],
   hint:"Find \"2011\" in paragraph E. What happened when people listened to echoes?", focus:"an area of the brain normally used for vision became active"},
  {stem:"According to paragraph E, what did the later study suggest?", opts:["Echolocation may be a skill that many people could learn.","Only people who are blind from birth can echolocate.","Echolocation takes many years to learn.","Sighted people learn faster than blind people."],
   hint:"Paragraph E: find \"suggesting that\". What was \"once assumed\"?", focus:"suggesting that the ability is far more widely available than once assumed"}]},
 {skill:"Vocabulary in context", para:"D", q:[
  {stem:"In paragraph D, \"jeered at\" means…", opts:["laughed at in an unkind way","helped","listened to carefully","copied"],
   hint:"Find \"jeered at\" in paragraph D. What did the children think of the noise?", focus:"some children at school jeered at him",
   explain:"The answer is \"laughed at in an unkind way\". The children thought it was a strange noise, and they jeered at him."},
  {stem:"In paragraph D, \"boast\" means…", opts:["talk proudly about yourself","feel shy","make a noise","tell a lie"],
   hint:"Find \"boast\" in paragraph D. Sami \"is not one to boast\", but he \"admits\" what he can do.", focus:"Sami is not one to boast"},
  {stem:"In paragraph D, \"concedes\" means…", opts:["admits, a little unwillingly","proudly announces","completely denies","quietly forgets"],
   hint:"Find \"concedes\" in paragraph D. Sami does not like to boast, so how does he tell people what he can do?", focus:"though he concedes that he can distinguish a lamp post from a person"}]},
 {skill:"Detail: two points", para:"D", q:[
  {type:"short", stem:"Write two things Sami can do because of echolocation.", groups:SAMI_SKILLS, need:2,
   hint:"Look in paragraphs A and D. What does Sami do every morning, and what can he tell apart?", focus:"He can tell a lamp post from a person, and he can find an open door.",
   explain:"Possible answers (any two): walk to school alone; find parked cars and trees; tell a lamp post from a person; find an open door."},
  {type:"short", stem:"Give two things that echolocation allows Sami to do.", groups:SAMI_SKILLS, need:2,
   hint:"Paragraph A tells you how he gets to school. Paragraph D says what he \"admits\" he can do.", focus:"he can tell a lamp post from a person and find an open doorway from several metres away"},
  {type:"short", stem:"Identify two abilities that echolocation gives Sami.", groups:SAMI_SKILLS, need:2,
   hint:"Paragraphs A and D: think about getting to school and what he can \"distinguish\" and \"locate\".", focus:"locate an open doorway from several metres away"}]},
 {skill:"Inference", para:"D", q:[
  {stem:"Why do Sami's classmates ask him to show them now?", opts:["They think his skill is interesting and want to learn.","They want to jeer at him again.","Their teacher told them to.","They are blind too."],
   hint:"Look in paragraph D. How did the children feel at first, and how do they feel now?", focus:"Now his classmates ask him to show them how it works.",
   explain:"The answer is \"They think his skill is interesting and want to learn\". At first they thought it was strange, but now they want to know how it works."},
  {stem:"What can we infer about how Sami's classmates have changed?", opts:["They have gone from mocking his skill to admiring it.","They have always admired his skill.","They still think his clicking is weird.","They have stopped talking to him."],
   hint:"Paragraph D: compare what the children did at first with what they do now.", focus:"Now his classmates queue up to try it themselves."},
  {stem:"What does \"he persevered, practising daily\" suggest about Sami's character?", opts:["He is determined and does not let other people's reactions stop him.","He enjoys being laughed at.","He practised because his teachers made him.","He found echolocation very easy to learn."],
   hint:"Paragraph D: what happened just before he \"persevered\"? What kind of person keeps going after that?", focus:"Despite this, he persevered, practising daily."}]},
 {skill:"Cause and effect", para:"B", q:[
  {type:"short", stem:"How does echolocation work? Write one step.", groups:[SOUND_OUT, ECHO_BACK], need:1,
   hint:"Look in paragraph B. What do you make first, and what comes back?", focus:"You make a sound, and it hits an object and comes back to you.",
   explain:"Possible answers: you make a sound (a click); the sound hits an object and comes back as an echo; your brain listens to the echo."},
  {type:"short", stem:"Explain how echolocation helps someone find an object.", groups:[SOUND_OUT, ECHO_BACK], need:2,
   hint:"Paragraph B: what hits the object, what bounces back, and what does the brain do?", focus:"part of it bounces back as an echo"},
  {type:"short", stem:"Explain the process by which echolocation allows the brain to locate an object.", groups:[SOUND_OUT, ECHO_BACK], need:2,
   hint:"Paragraph B: \"When a sound strikes an object…\". Describe what happens to the sound and what the brain does.", focus:"When a sound strikes an object, part of it is reflected back as an echo."}]},
 {skill:"Writer's purpose", para:"C", q:[
  {stem:"Why does the writer talk about bats and dolphins?", opts:["To show other examples of echolocation.","To tell readers about bats' food.","To show that animals are cleverer than people.","To explain why Sami likes the sea."],
   hint:"Look in paragraph C. What do bats and dolphins do with sound?", focus:"Bats are famous for echolocation.",
   explain:"The answer is \"To show other examples of echolocation\". Bats and dolphins use sound to find things, just like Sami."},
  {stem:"Why does the writer include paragraph C?", opts:["To show that echolocation is used by animals and technology too","To explain how bats hunt insects","To compare bats with dolphins","To show that humans are the best echolocators"],
   hint:"Paragraph C mentions bats, dolphins and ships. What do they all have in common?", focus:"ships borrowed the idea for sonar"},
  {stem:"Why does the writer begin the article with Sami walking to school?", opts:["To present the science through a real, engaging human example","To argue that blind people should not walk alone","To show that Sami is better than other blind people","To introduce the history of sonar"], para:"A",
   hint:"Paragraph A shows Sami clicking, then names the skill. Why start with a person rather than a definition?", focus:"What Sami is doing has a name: echolocation."}]},
 {skill:"Writer's view", para:"F", q:[
  {stem:"What does the writer think about echolocation?", opts:["It does not replace seeing, but it helps people like Sami a lot.","It is better than seeing.","It does not really work.","Everyone should learn it."],
   hint:"Read paragraph F. The writer says what echolocation is not, then \"But…\".", focus:"But for people like Sami, it means freedom.",
   explain:"The answer is \"It does not replace seeing, but it helps people like Sami a lot\". The writer says it is not the same as seeing, but it means freedom for Sami."},
  {stem:"What is the writer's attitude towards echolocation in paragraph F?", opts:["Balanced: it has limits, but it makes a huge difference to Sami","Very doubtful about whether it works","Certain that it will replace canes","Critical of people who use it"],
   hint:"Paragraph F: find one limit and one benefit.", focus:"it works less well in noisy places"},
  {stem:"Which statement best reflects the writer's view?", opts:["Echolocation has real limits, but its value to someone like Sami is enormous.","Echolocation is a complete substitute for sight.","Echolocation is too unreliable to be useful.","Every blind person should give up their cane."],
   hint:"Paragraph F: \"not a substitute for sight\" and \"difficult to overstate\". Watch out for answers that are too strong.", focus:"Echolocation is not a substitute for sight"}]}
];

export const UNIT4_TEXTS = [
  { id: "oryx", unitNo: 4, unit: U, topic: "Saving the Arabian oryx", blurb: "How did an animal that was extinct in the wild come back?", levels: ORYX_LEVELS, slots: ORYX_SLOTS },
  { id: "colour", unitNo: 4, unit: U, topic: "How we see colour", blurb: "Do we all see the same rainbow?", levels: COLOUR_LEVELS, slots: COLOUR_SLOTS },
  { id: "disease", unitNo: 4, unit: U, topic: "How diseases spread", blurb: "From the plague to vaccines: how we learned to fight germs.", levels: DISEASE_LEVELS, slots: DISEASE_SLOTS },
  { id: "echo", unitNo: 4, unit: U, topic: "Seeing with sound", blurb: "How a blind teenager finds his way with clicks.", levels: ECHO_LEVELS, slots: ECHO_SLOTS }
];
