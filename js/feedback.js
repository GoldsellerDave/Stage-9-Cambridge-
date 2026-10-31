// Feedback for each wrong option of each grammar item in curriculum.js, in the same order:
// FEEDBACK[point][item] = [note for wrong option 1, 2, 3]. "prep" builds the note from the word before the gap.
// If an item in curriculum.js changes, change its notes here too (tests/practice.test.mjs checks that every wrong option has one).
import { GRAMMAR, STAGE } from "./curriculum.js";
import { FEEDBACK as FEEDBACK8 } from "./s8/feedback.js";

const FEEDBACK9 = {
 "1.1": [
  ["Listen is the base form. As the subject of a sentence, use the -ing form: Listening.", "Don't add to. The -ing form on its own is the subject: Listening helps me…", "Listened is a past form. The subject of the sentence needs the -ing form: Listening."],
  ["After a preposition (good at), use the -ing form, not the base form.", "After a preposition (good at), use -ing, not to + verb.", "Understood is a past form. After at, use the -ing form: understanding."],
  ["Mind is followed by the -ing form, not to + verb: Do you mind closing…?", "Mind is followed by the -ing form: closing.", "Closed is a past form. After mind, use -ing: closing."],
  ["Avoid is followed by -ing, not to + verb: avoids speaking.", "Avoid is followed by the -ing form: speaking.", "Spoke is the past simple. After avoid, use -ing: speaking."],
  ["Instead of ends with a preposition, so it is followed by -ing: complaining.", "After the preposition of, use -ing, not to + verb.", "Complained is a past form. After instead of, use -ing."],
  ["In look forward to, to is a preposition, so it needs -ing: to meeting.", "Look forward always needs to, then the -ing form: looking forward to meeting.", "Met is a past form. After look forward to, use -ing: meeting."]],
 "1.3": [
  ["Usually shows a general fact, so use the present simple. Need is a state verb too.", "Needing on its own is not a full verb. A general fact needs the present simple: need.", "Teenagers is plural, and a general fact needs the present simple: need."],
  ["Be quiet! shows it is happening right now, so use the present continuous: is talking.", "It is happening now, and the teacher is singular: is talking.", "Talking on its own is not a full verb. You need is + -ing: is talking."],
  ["Understand is a state verb, so we don't normally use it in the continuous.", "Understanding on its own is not a full verb. State verbs use the present simple: I understand.", "After am you would need -ing, but understand is a state verb. Use the present simple: I understand."],
  ["This term is a temporary situation around now, so use the present continuous: are doing.", "Does is for he, she or it. This term is temporary: we are doing.", "Doing on its own is not a full verb. You need are + -ing: are doing."],
  ["Da Nang is her permanent home, so use the present simple. The temporary part is she's staying with us.", "My cousin is she, so the present simple needs -s: lives.", "Living on its own is not a full verb. Her permanent home needs the present simple: lives."],
  ["Now and at the moment are not needed together, and a change happening around now uses the present continuous: are becoming.", "Young people is plural, so use are: are becoming.", "After are, use the -ing form: are becoming."]],
 "1.4": [
  ["The passive needs the past participle: sent, not send.", "Sent on its own is not enough. The passive needs are + past participle: are sent.", "Messages is plural, so use are: are sent."],
  ["The passive needs the past participle: is written, not is write.", "The newspaper doesn't write anything. It is written by students, so use the passive.", "The newspaper is singular, so use is: is written."],
  ["The passive needs the past participle: are made.", "Decisions don't make anything. They are made by our parents, so use the passive.", "Decisions is plural, so use are: are made."],
  ["A language doesn't speak. It is spoken by people, so use the passive: is spoken.", "The passive needs the past participle: is spoken.", "Vietnamese (the language) is singular, so use is: is spoken."],
  ["Phones don't expect anything. People expect it, so use the passive: are expected.", "Are expecting is active (the phones are doing the expecting). You need the passive: are expected.", "Phones is plural, so use are: are expected."],
  ["The passive needs the past participle: are published.", "Results don't publish anything. Use the passive (are published). By is only for the doer.", "Results is plural, so use are: are published."]],
 "1.6": [
  ["Is turning is active, but the library is not doing the turning. Use is being + past participle.", "Been is for perfect tenses. The present continuous passive uses being: is being turned.", "You need is before being: is being turned."],
  ["Opinions don't take anything. People take them seriously, so use the passive: are being taken.", "Use being, not been: are being taken.", "Opinions is plural, so use are: are being taken."],
  ["The computer isn't repairing anything. Someone is repairing it: is being repaired.", "Repairs is active and present simple. It's happening now, to the computer: is being repaired.", "Has goes with been, not being. For now, use is being repaired."],
  ["The rules aren't discussing anything. They are being discussed by the council.", "You need are before being: are being discussed.", "The passive needs the past participle (discussed), and rules is plural (are)."],
  ["The order is wrong. The form is is being + past participle: is being broadcast.", "You need is before being: is being broadcast.", "The interview is singular, so use is: is being broadcast."],
  ["Use being, not been: is being built.", "The hall isn't building anything. It is being built (passive).", "You need is before being: is being built."]],

 "2.1": [
  ["Patient is an adjective. After her, you need a noun: patience.", "Patiently is an adverb. After her, you need a noun: patience.", "Patients are people in hospital. The quality is patience."],
  ["Disappointed is an adjective. After his, you need a noun: disappointment.", "Disappoint is a verb. After his, you need a noun: disappointment.", "Disappointing is an adjective. After his, you need a noun: disappointment."],
  ["Empathetic is an adjective. The subject of the sentence needs a noun: Empathy.", "Empathise is a verb. The subject needs a noun: Empathy.", "Empathetically is an adverb. The subject needs a noun: Empathy."],
  ["Happy is an adjective. Improve what? You need a noun: happiness.", "Happily is an adverb. Improve what? You need a noun: happiness.", "Happier is a comparative adjective. You need a noun: happiness."],
  ["Annoyed is an adjective. After a lot of, you need a noun: annoyance.", "Annoying is an adjective. After a lot of, you need a noun: annoyance.", "Annoy is a verb. After a lot of, you need a noun: annoyance."],
  ["Angry is an adjective. After your, you need a noun: anger.", "Angrily is an adverb. After your, you need a noun: anger.", "Angered is a verb form. After your, you need a noun: anger."]],
 "2.2": [
  ["Better is already a comparative, so don't add more. Use much to make it stronger.", "Good is not a comparative. Use better, made stronger with much: much better.", "Well becomes better in the comparative, not more well."],
  ["Long adverbs ending in -ly use more: more fluently.", "Fluent is an adjective. To describe how she speaks, use the adverb: more fluently.", "Most is for superlatives. With than, use the comparative: more fluently."],
  ["The pattern is the more …, the …er. Use more, not most.", "The pattern is the more …, the easier. Use more, not much.", "The pattern is the more …, the easier. Use more, not many."],
  ["Bad is irregular: bad → worse. There is no word badder.", "Bad is irregular: the comparative is worse, not more bad.", "Worst is the superlative. With than, use the comparative: worse."],
  ["Adverbs ending in -ly use more: more quickly.", "Quick is an adjective. To describe how he finished, use the adverb: more quickly.", "Most is for superlatives. With than, use the comparative: more quickly."],
  ["Healthier is already a comparative, so don't add more.", "Very doesn't go with comparatives. Use far, much or a lot: far healthier.", "Healthiest is the superlative. With than, use the comparative: healthier."]],
 "2.4": [
  ["Red eyes are evidence that she was crying, so you are sure: must have been.", "Must be is about now. To guess about the past, use must have + past participle.", "The order is modal + have + past participle: might have been."],
  ["You're not sure and it's about the past: might not have seen.", "After have you need the past participle (seen), and you're not sure, so use might not have.", "You need have between the modal and the past participle: might not have seen."],
  ["That's impossible! shows you're sure it didn't happen: can't have eaten.", "After have, use the past participle: eaten.", "Use can't have + past participle for something you're sure didn't happen."],
  ["The wet ground is evidence that it did rain, so use must have rained.", "You need have between must and the past participle: must have rained.", "Might rain is about the future. To guess about the past, use must have rained."],
  ["Must leave is about now or the future. To guess about the past, use might have left.", "You don't know where they are, so it's possible you left them there: might have left.", "You need have between might and the past participle: might have left."],
  ["After a modal, always use have, never has: can't have finished.", "Use can't have for something you're sure didn't happen, with the past participle: finished.", "You need have between can't and the past participle: can't have finished."]],
 "2.5": [
  ["Absolutely goes with strong adjectives. Tired is a normal adjective: absolutely exhausted.", "Absolutely goes with strong adjectives. Sleepy is a normal adjective.", "Absolutely goes with strong adjectives, and busy doesn't fit after a race."],
  ["Angry is a normal adjective, so use very or extremely, not absolutely.", "Angry is a normal adjective, so use very or extremely, not totally.", "Angry is a normal adjective, so use very or extremely, not completely."],
  ["Terrifying is a strong adjective (very scary), so use absolutely, not very.", "Terrifying is a strong adjective, so a bit doesn't fit. Use absolutely.", "Terrifying is a strong adjective, so use absolutely, not extremely."],
  ["Delighted is a strong adjective (very happy), so use really or absolutely, not very.", "Delighted is a strong adjective, so a bit doesn't fit. Use really.", "Delighted is a strong adjective, so slightly doesn't fit. Use really."],
  ["Starving already means very hungry, so don't add very.", "Starving already means very hungry, so a bit doesn't fit.", "Hungry is a normal adjective, so absolutely doesn't fit. Say starving."],
  ["Amazing is a strong adjective, so use absolutely, not very.", "Good is a normal adjective, so absolutely doesn't fit. Say absolutely amazing or very good.", "Amazing is a strong adjective, so a bit doesn't fit."]],

 "3.1": [
  ["Set off means start a journey. Set up means start or build something, like a business.", "Set off means start a journey. We don't say set in for a journey.", "Set off means start a journey. Set on doesn't fit here."],
  ["In a compound noun the first noun stays in its basic form: picnic basket.", "The first noun in a compound noun is usually singular: picnic basket.", "Picnicked is a verb. A compound noun joins two nouns: picnic basket."],
  ["Put off means delay. To build a tent, you put it up.", "Put away means tidy. To build a tent, you put it up.", "Put on is for clothes. To build a tent, you put it up."],
  ["Check out is when you leave a hotel. When you arrive, you check in.", "We don't say check off for a hotel. You arrive and check in.", "Check up means look at something carefully. At a hotel you check in."],
  ["The verb is look forward to, not look forward for.", "The verb is look forward to, not look forward at.", "The verb is look forward to, not look forward on."],
  ["Sightseeing is written as one word.", "We use the compound noun sightseeing, not seeing sights.", "After spent the afternoon, use the -ing form: sightseeing."]],
 "3.3": [
  ["The room wasn't cleaning anything. Someone was cleaning it: was being cleaned.", "You need was + being + past participle for an action in progress.", "Use being, not been: was still being cleaned."],
  ["The exhibition wasn't setting anything up. Use the passive: was being set up.", "The story is in the past (was closed), so use was, not is.", "An exhibition is singular, so use was: was being set up."],
  ["The tourists weren't showing anything. Someone was showing them: were being shown.", "Tourists is plural, so use were: were being shown.", "You need being after were: were being shown."],
  ["You weren't watching. Other people were watching you: was being watched.", "Watched is active past simple. Someone was watching you: was being watched.", "Use being, not been: was being watched."],
  ["The boats weren't preparing anything. People were preparing them: were being prepared.", "Boats is plural, so use were: were being prepared.", "The passive needs the past participle: prepared."],
  ["The bridge wasn't repairing anything. Use the passive: was being repaired.", "You need was before being: was being repaired.", "Use being, not been: was being repaired."]],
 "3.4": [
  ["In a compound adjective, the noun after the number stays singular: five-star.", "No apostrophe. Join the words with a hyphen: five-star.", "The number comes first: five-star."],
  ["Numbers in compound adjectives stay singular: a ten-minute walk.", "Before a noun, join the words with a hyphen and keep minute singular: ten-minute.", "The number comes first: ten-minute."],
  ["The order is world-famous (famous in the world).", "Before the noun destination you need an adjective, not an adverb: world-famous.", "Fame is a noun. You need the adjective with a hyphen: world-famous."],
  ["Numbers in compound adjectives stay singular: a seven-day ticket.", "The number comes first: seven-day.", "There is no word dayly. Use seven-day."],
  ["Use well, not good, in this compound adjective: well-known.", "Use the past participle known: well-known (known by many people).", "The order is well-known."],
  ["No apostrophe. The compound adjective is long-sleeved.", "The order is long-sleeved.", "Use the -ed form: long-sleeved (having long sleeves)."]],
 "3.6": [
  ["Tired describes how a person feels. The journey causes the feeling, so use tiring.", "Tire is a verb. After was, you need an adjective: tiring.", "Tiredly is an adverb. After was, you need an adjective: tiring."],
  ["We are the people who felt it, so use the -ed form: amazed.", "After were … by, you need the -ed adjective: amazed.", "Amazes is a verb. After were, use the -ed adjective: amazed."],
  ["Interested describes how a person feels. Museums cause the feeling: interesting.", "Interest is a noun or a verb. You need an adjective: interesting.", "Interestedly is an adverb. You need an adjective that describes museums: interesting."],
  ["The children are describing how they felt: disappointed.", "Disappoint is a verb. After were, you need an adjective: disappointed.", "Disappointment is a noun. After were, you need an adjective: disappointed."],
  ["Getting lost is the thing that causes the feeling, so use -ing: frightening.", "Fright is a noun. After be, you need an adjective: frightening.", "Frighten is a verb. After be, you need an adjective: frightening."],
  ["Both are the wrong way round. I felt confused (-ed), and the map caused it, so it was confusing (-ing).", "The map causes the feeling, so the map was confusing, not confused.", "I am the person who feels it, so I was confused, not confusing."]],

 "4.1": [
  ["Despite is followed by a noun or -ing, not a full clause. Use although for contrast.", "The two ideas contrast (zoos protect animals, but animals suffer), so because doesn't fit.", "Unless means if not, which doesn't make sense here. The ideas contrast: although."],
  ["This is a condition: the disease spreads if people don't stay home. Use unless.", "Whereas compares two different things. Here you need a condition: unless (= if not).", "Despite needs a noun or -ing, and this is a condition: unless."],
  ["The sentence compares two groups of people, so use whereas.", "So shows a result. Here two groups are compared: whereas.", "Because gives a reason. Here two groups are compared: whereas."],
  ["Although needs a full clause (although it is extinct). Before -ing, use despite.", "Whereas needs a full clause and compares two things. Before -ing, use despite.", "Unless means if not, and it needs a clause. Before -ing for contrast, use despite."],
  ["The second part gives the reason we wore masks, so use because.", "Unless means if not. Here you need a reason: because.", "Despite shows contrast and needs a noun or -ing. Here you need a reason: because."],
  ["Despite can't be followed by a full clause. Use although (or despite the rain).", "Don't use although and but together in one sentence. One is enough.", "Unless means if not, which doesn't make sense here. Use although for contrast."]],
 "4.2": [
  ["Colours don't detect anything. They are detected by cells, so use the passive: are detected.", "Are detecting is active. The colours are detected, so use are + past participle.", "Colours is plural, so use are: are detected."],
  ["The passive needs the past participle. Breed → bred: are bred.", "The animals are bred by people, so use the passive: are bred.", "Animals is plural, so use are: are bred."],
  ["Samples don't send anything. They are sent, so use the passive.", "Are sending is active. The samples are sent: are + past participle.", "Samples is plural, so use are: are sent."],
  ["Spreads by doesn't work here. Use the passive: is spread (from person to person).", "Is spreading is active. For a general fact use the present simple passive: is spread.", "Influenza is singular, so use is: is spread."],
  ["Results don't check anything. They are checked by scientists: are checked.", "Are checking is active. The results are checked: are + past participle.", "Results is plural, so use are: are checked."],
  ["The passive needs the past participle: are given.", "Vaccines don't give anything. They are given to children: are given.", "Vaccines is plural, so use are: are given."]],
 "4.3": [
  ["Since 2019 shows it started in the past and is still going on: have been monitoring.", "With since, use the present perfect continuous: have been monitoring.", "You need been between have and the -ing form: have been monitoring."],
  ["All day and the result you can see (red eyes) need the present perfect continuous: Have you been looking.", "Did is followed by the base form, and here you need Have you been looking.", "You need been: Have you been looking."],
  ["For weeks shows how long it has gone on: has been preparing.", "You need been: has been preparing.", "She takes has, not have: has been preparing."],
  ["All morning shows an activity that has gone on until now: has been raining.", "Rains is the present simple for habits. Here you need has been raining.", "The form is has been + -ing: has been raining."],
  ["How long asks about the time up to now, so use the present perfect continuous: have you been learning.", "In a question, have comes before you: have you been learning.", "How long up to now needs the present perfect continuous: have you been learning."],
  ["For two hours, up to now, needs the present perfect continuous: have been waiting.", "After been, use the -ing form: have been waiting.", "You need been: have been waiting."]],
 "4.4": [
  ["A cure doesn't find anything. It is found, so use the passive: hasn't been found.", "Yet goes with the present perfect, and did doesn't go with been: hasn't been found.", "The passive needs the past participle: found."],
  ["Scientists are doing the discovering, so use the active: have discovered.", "Scientists is plural (have), and you need the past participle: discovered.", "Just here needs the present perfect: have just discovered."],
  ["Cases don't report anything. They are reported, so use the passive: have been reported.", "Cases is plural, so use have: have been reported.", "The present perfect passive is have been + past participle, not are been."],
  ["The animals didn't move anything. Someone moved them: have been moved.", "Animals is plural, so use have: have been moved.", "The passive needs the past participle: moved."],
  ["You are doing the seeing, so use the active: Have you ever seen.", "Did is followed by the base form, and ever (in your life) uses the present perfect: Have you ever seen.", "You takes have, not has."],
  ["The vaccine didn't test anything. It was tested: has been tested (passive).", "The passive needs the past participle: tested.", "The vaccine is singular, so use has."]],
 "4.6": "prep",

 "5.1": [
  ["The engineer is a person, so use who.", "Whose shows possession (whose robot). For a person doing something, use who.", "Where is for places. The engineer is a person: who."],
  ["An app is a thing, so use which (or that).", "Whose shows possession. The app is a thing: which.", "Where is for places. The app is a thing: which."],
  ["The invention belongs to the student, so you need whose (her invention).", "The invention belongs to the student, so use whose.", "That's means that is. Possession needs whose."],
  ["The lab is the place where something happened, so use where.", "Who is for people. For a place, use where.", "Whose shows possession. For a place, use where."],
  ["After a comma, use which to refer to the whole previous clause, not that.", "What doesn't refer back to a clause. Use which after the comma.", "Who is for people. Use which to talk about the whole situation."],
  ["Extra information needs a comma at both ends: Our teacher, who loves technology, …", "The teacher is a person, so use who, not which.", "Don't use that in a clause between commas. Use who."]],
 "5.2": [
  ["Cars won't be doing the driving. They will be driven by computers: future passive.", "The future passive needs the past participle: will be driven.", "This is active, but cars aren't the drivers. Use will be driven."],
  ["You can see evidence (the clouds), so use going to: is going to rain.", "Is raining to isn't a verb form. Use is going to rain.", "Don't use will and going to together. Use is going to."],
  ["It's an arrangement for tomorrow, so use the present continuous: am meeting.", "Will be needs -ing. For an arrangement, use am meeting.", "Going needs to (am going to meet). For a fixed arrangement, am meeting is best."],
  ["The phones don't release anything. They will be released: future passive.", "Are releasing is active. Use the passive: will be released.", "You need be: will be released."],
  ["With I think for a prediction, use will: will get.", "Get smaller is active here: will get.", "Get is the present. For a prediction about the future, use will get."],
  ["You need be in the future passive: will be announced.", "The passive needs the past participle: announced.", "The passive needs the past participle: going to be announced."]],
 "5.4": [
  ["After the object, use the past participle: had it repaired.", "The order is had + object + past participle: had it repaired.", "It's in the past (was broken), and you need the past participle: had it repaired."],
  ["After the object, use the past participle: installed.", "You aren't installing them yourselves. Use having + object + past participle.", "After We're, you need -ing: We're having them installed."],
  ["After the object, use the past participle: get your eyes tested.", "The order is get + object + past participle: get your eyes tested.", "After should, use the base form: get."],
  ["After the object, use the past participle: serviced.", "The order is has + object + past participle: has her laptop serviced.", "Is serviced is passive. To say someone does it for her: has her laptop serviced."],
  ["After the object, use the past participle: printed.", "The order is have + object + past participle.", "After did, use the base form: have, not had."],
  ["The object comes before the past participle: have my old computer recycled.", "Use the past participle: recycled.", "The order is have + object + past participle: have my old computer recycled."]],
 "5.6": [
  ["This time tomorrow is an action in progress at a future time: will be flying.", "That form doesn't exist. Use will be + -ing: will be flying.", "After will be, use -ing: will be flying."],
  ["At 8 p.m. you will be in the middle of dinner: will be having.", "Am have isn't a verb form. Use will be having.", "After will be, use -ing: will be having."],
  ["After will be, use -ing: will be working.", "Going needs to, and here you want will be working.", "You need be: will be working."],
  ["The order is will + subject + be + -ing: Will you be using.", "Use will, not are: Will you be using.", "You need be: Will you be using."],
  ["The robot is doing the cleaning, so it's active: will be cleaning.", "You need be: will be cleaning.", "After will be, use -ing: will be cleaning."],
  ["You need be: I'll be lying.", "After be, use -ing: lying.", "You need will ('ll): I'll be lying."]],

 "6.1": [
  ["Be allowed is followed by to + infinitive: allowed to use.", "You need to: allowed to use.", "Used is a past form. Use to + infinitive: to use."],
  ["Be supposed is followed by to + infinitive: supposed to hand in.", "You need to: supposed to hand in.", "Use to + infinitive: to hand in."],
  ["Be asked is followed by to + infinitive: asked to keep.", "You need to: asked to keep.", "Use to + infinitive: to keep."],
  ["Be made is followed by to + infinitive: made to tidy.", "In the active you say made him tidy, but the passive needs to: was made to tidy.", "Use to + infinitive: to tidy."],
  ["Be expected is followed by to + infinitive: expected to arrive.", "You need to: expected to arrive.", "Use to + infinitive: to arrive."],
  ["Be required is followed by to + infinitive: required to wear.", "You need to: required to wear.", "You need are (passive) and to + infinitive: are required to wear."]],
 "6.3": [
  ["In reported speech, move the tense back: am → was.", "Am becomes was, not has been.", "She takes was, not were."],
  ["Reported questions use statement word order, with no did: where I lived.", "Use statement order and move the tense back: where I lived.", "Move the tense back (lived) and don't use a question mark."],
  ["A yes/no question is reported with if or whether, and will becomes would.", "Use if and statement order: if I would help her.", "Will becomes would, and there is no to: if I would."],
  ["Move the tense back: have finished → had finished.", "The order is had + past participle: had finished.", "Move the tense back to had finished."],
  ["Move the tense back: am → was.", "Use statement word order (I was), and I takes was.", "Use statement word order: why I was late."],
  ["Reported questions use statement word order and need if or whether.", "Use statement order (I had seen) and no question mark.", "Move the tense back to had seen. Saw is not a past participle."]],
 "6.4": [
  ["The if part of the third conditional uses the past perfect: had left.", "Don't use would in the if part. Use had left.", "Use the past perfect: had left."],
  ["It's about the past, so use would have + past participle: would have followed.", "The result part uses would have: would have followed.", "Use would, not will: would have followed."],
  ["It's about the past: would have said.", "The result part uses would have + past participle.", "After would have, use the past participle: said."],
  ["If only for regret about the past takes the past perfect: had listened.", "Don't use would after if only for past regret: had listened.", "Use the past perfect: had listened."],
  ["The if part of a third conditional uses the past perfect: hadn't been.", "Don't use would in the if part: hadn't been.", "Use the past perfect: hadn't been."],
  ["The if part needs the past perfect: If he had told.", "The result part needs would have + past participle: wouldn't have got.", "Don't use would in the if part: If he had told."]],
 "6.6": [
  ["The homework was in progress when the phone rang, so use was doing.", "I takes was: was doing.", "The story is in the past: was doing."],
  ["While shows a longer action in progress: were discussing.", "We takes were: were discussing.", "It's in the past (walked in): were discussing."],
  ["Use were + -ing for an action in progress: What were you doing?", "You takes were, and you need -ing: were you doing.", "You need the -ing form: doing."],
  ["They were in the middle of talking when the teacher came back: were still talking.", "They takes were: were still talking.", "You need were before -ing: were still talking."],
  ["Use was + -ing for the background: was shining.", "The sun is singular: was shining.", "You need was before -ing: was shining."],
  ["The longer action uses the past continuous and the short one the past simple: was walking when she saw.", "After was, use -ing: was walking.", "She takes was: was walking."]],

 "7.1": [
  ["By the time we arrived shows it happened before another past moment: had already started.", "Use the past perfect (had), not the present perfect: had already started.", "Use had + past participle: had already started."],
  ["It's about a past moment (she was exhausted): had been training.", "The order is had been + -ing: had been training.", "Was trained is passive, but she did the training: had been training."],
  ["That day is in the past, so use had: had never won.", "After had, use the past participle: won.", "Use had + past participle: had never won."],
  ["It's about a past moment (when the rain stopped play): had been playing.", "The order is had been + -ing.", "Use had been + -ing to say how long: had been playing."],
  ["Use the past perfect for the earlier past action: had already heard.", "Use had (past), not have: had already heard.", "After had, use the past participle: heard."],
  ["Before the competition is in the past, so use had: had been practising.", "After been, use -ing: practising.", "Use had been, not was been."]],
 "7.3": [
  ["In the whole school picks one from a group, so use the superlative: the best.", "Good is irregular: good → better → the best.", "You need the before a superlative: the best."],
  ["With than, use the comparative: worse.", "Bad is irregular: bad → worse.", "There is no word badder. Bad → worse."],
  ["I've ever run picks one from all of them, so use the superlative: the hardest.", "Short adjectives add -est: the hardest.", "Use the + superlative, without than: the hardest."],
  ["Use the basic adjective in as … as: as fast as.", "The pattern is not as … as: as fast as.", "Use as … as, not as … than."],
  ["Short words add -est: the fastest.", "Use the + superlative, without than.", "Don't use more with -er. Here you need the superlative: the fastest."],
  ["One of the needs the superlative and a plural noun: the most popular sports.", "One of the is followed by a plural noun: sports.", "Long adjectives use most: the most popular."]],
 "7.4": [
  ["The tickets didn't sell anything. They had been sold (passive).", "The order is had been + past participle.", "It happened before a past moment, so use had: had been sold."],
  ["The winner didn't announce anything. Use the passive: had been announced.", "Before a past moment, use had, not has: had been announced.", "Use had been + past participle: had been announced."],
  ["He did the leaving, so use the active: had left.", "It happened before he realised (past), so use had left.", "The order is had + past participle: had left."],
  ["The pitch didn't damage anything. It had been damaged by the storm.", "Before a past event, use had: had been damaged.", "Use the past participle: damaged."],
  ["The record didn't break anything. It had been broken (passive).", "By 2010 is in the past, so use had: had been broken.", "Use had been + past participle: broken, not broke."],
  ["The trophy didn't polish anything. It had been polished.", "Use the past participle: polished.", "Before the ceremony (past) needs had, and has been doesn't go with yesterday."]],
 "7.6": [
  ["The second idea contrasts with the first (motivation, but stress), so use however.", "Moreover adds a similar idea. Here the ideas contrast: however.", "As a result shows a result. Here the ideas contrast: however."],
  ["Winning is the result of training, so use as a result.", "Nevertheless shows contrast. Here it's a result: as a result.", "On the other hand shows contrast. Here it's a result: as a result."],
  ["Both ideas are good points about sport, so add with furthermore.", "Therefore shows a result. Here you add another point: furthermore.", "Nevertheless shows contrast. Here you add another point: furthermore."],
  ["Never giving up is surprising after losing, so use nevertheless (= despite this).", "Furthermore adds a similar point. Here there is a contrast: nevertheless.", "Consequently shows a result. Here there is a contrast: nevertheless."],
  ["Some are expensive and others aren't: a contrast, so use on the other hand.", "Moreover adds a similar idea. Here there is a contrast: on the other hand.", "As a result shows a result. Here there is a contrast: on the other hand."],
  ["Not playing is a result of the injury, so use therefore, not however.", "Moreover adds an idea, and don't use two connectives for one link.", "Nevertheless shows contrast. Not playing is a result: therefore."]],

 "8.1": [
  ["Frequent is an adjective. Before the verb happen, you need the adverb: frequently.", "Frequency is a noun. You need the adverb: frequently.", "Frequented is a verb. You need the adverb: frequently."],
  ["Rare is an adjective. Before the verb use, you need the adverb: rarely.", "Rarer is a comparative adjective. You need the adverb: rarely.", "Rarity is a noun. You need the adverb: rarely."],
  ["Occasional is an adjective. You need the adverb: occasionally.", "Occasion is a noun. You need the adverb: occasionally.", "Occasioned is a verb. You need the adverb: occasionally."],
  ["Adverbs of frequency go before the main verb: always switches.", "Use always once, before the main verb.", "Adverbs of frequency go before the main verb, not after it."],
  ["With be, the adverb goes after be, and only once: are usually short.", "The adverb goes straight after be: are usually short.", "Use usually once, after be: are usually short."],
  ["Ever is for questions and negatives. Here you need never.", "Don't say always don't. Use never.", "Don't use two negatives. Never is already negative."]],
 "8.3": [
  ["We say cut down on (reduce). Cut off means stop the supply.", "We say cut down on, not cut down out.", "We say cut down on, not cut down up."],
  ["We say run out of (have none left), not run out off.", "We say run out of, not run out from.", "We say run out of, not run out away."],
  ["Throw out of needs a place after it. To put something in the bin, throw it away.", "Throw off means remove quickly, like a coat. Use throw away.", "Throw up means be sick! Use throw away."],
  ["We say come up with (think of an idea), not come up on.", "We say come up with, not come up for.", "We say come up with, not come up to."],
  ["Look for means search. To take care of something is look after.", "Look up means find information. To take care of something is look after.", "Look at means watch. To take care of something is look after."],
  ["We say use up (use all of something), not use off.", "We say use up, not use on.", "We say use up, not use away."]],
 "8.4": [
  ["Avoid is followed by the -ing form, not to + verb: avoid using.", "Avoid is followed by -ing: using.", "Used is a past form. After avoid, use -ing: using."],
  ["Consider is followed by the -ing form, not to + verb: considered cycling.", "Consider is followed by -ing: cycling.", "Cycled is a past form. After consider, use -ing: cycling."],
  ["Recommend is followed by the -ing form, not to + verb: recommend keeping.", "Recommend is followed by -ing: keeping.", "Kept is a past form. After recommend, use -ing: keeping."],
  ["Suggest is followed by the -ing form, not to + verb: suggested starting.", "Suggest is followed by -ing: starting.", "Started is a past form. After suggest, use -ing: starting."],
  ["Keep (meaning continue) is followed by the -ing form: kept cleaning.", "Keep is followed by -ing: cleaning.", "Cleaned is a past form. After keep, use -ing: cleaning."],
  ["Mind is followed by the -ing form, not to + verb: mind walking.", "Mind is followed by -ing: walking.", "Don't use to before the -ing form: mind walking."]],
 "8.6": [
  ["The adjective goes before the noun: the growing amount.", "Grow is a verb. Before the noun, use the -ing adjective: growing.", "Amount grows is a clause. You need a noun phrase: the growing amount."],
  ["The main noun is number (singular), so use has.", "The main noun is number, and the verb is has increased.", "The main noun is number (singular), and increased here needs has."],
  ["The pattern is adjective + but + adjective: simple but effective.", "But goes between the two adjectives: simple but effective.", "Use two adjectives with but in the middle: simple but effective."],
  ["Lives would make a second main verb. Use living: people living near the coast.", "Use who live or just living, not who living.", "Live would make a second main verb. Use living: people living near the coast."],
  ["After the noun plan, use for + -ing: for reducing.", "After for, use -ing: for reducing.", "Use for + -ing: for reducing."],
  ["The main noun is melting (singular), so the verb is worries.", "The adjective goes before the noun: the rapid melting.", "The sentence needs a full verb: worries, not worrying."]],

 "9.1": [
  ["A job here is a place or situation, so use where (I can help people there).", "Who is for people. Use where for a place or situation.", "Whose shows possession. Use where."],
  ["The coach belongs to the athlete (her coach), so use whose.", "Which is for things. Possession needs whose.", "That doesn't show possession. Use whose."],
  ["2020 is a time, so use when.", "Where is for places. For a time, use when.", "Who is for people. For a time, use when."],
  ["After a comma, use which to refer to the whole previous clause, not that.", "What doesn't refer back to a clause. Use which after the comma.", "Who is for people. Use which to talk about the whole situation."],
  ["People needs who, not which.", "Whose shows possession. People needs who.", "Where is for places. People needs who."],
  ["Extra information needs a comma at both ends: My grandmother, who left school at 12, …", "Your grandmother is a person, so use who, not which.", "Don't use that in a clause between commas. Use who."]],
 "9.2": [
  ["Firstly starts the first point. However shows contrast with something before.", "As a result needs an earlier cause. This is the first point: Firstly.", "Even so means despite this, but nothing has come before. Use Firstly."],
  ["Failing contrasts with wanting to be a doctor, so use however.", "In addition adds a similar idea. Here there is a contrast: however.", "Firstly starts a list. Here there is a contrast: however."],
  ["Becoming skilled is the result of practice: as a result.", "Even so shows contrast. Here it's a result: as a result.", "However shows contrast. Here it's a result: as a result."],
  ["It's worth the money despite being expensive: even so.", "As a result shows a result. Here you mean despite this: even so.", "Firstly starts a list. You need even so (despite this)."],
  ["In contrast compares two things. To sum up at the end, use in conclusion.", "Even so means despite this. To sum up at the end, use in conclusion.", "For is not a connective here. Use In conclusion."],
  ["The sentences compare two people, so use in contrast, not therefore.", "As a result shows a result. Here two people are compared: in contrast.", "In addition adds a similar idea. Here two people are compared: in contrast."]],
 "9.3": [
  ["The working happened first, so use having + past participle: Having worked.", "After having, use the past participle: worked.", "To work shows purpose. For an earlier action, use Having worked."],
  ["The company was founded (passive), so use the past participle: Founded.", "Use the past participle on its own for a passive meaning: Founded.", "Found is a different verb (find). Use Founded."],
  ["He was feeling nervous at the same time, so use -ing: Feeling.", "For something at the same time, use the -ing form: Feeling.", "To feel shows purpose. Use Feeling for a reason at the same time."],
  ["Winning came first, so use having + past participle: Having won.", "After having, use the past participle: won.", "The form is Having won."],
  ["He was encouraged (passive), so use the past participle: Encouraged.", "Use the past participle on its own for a passive meaning: Encouraged.", "Encourage is the base form. Use the past participle: Encouraged."],
  ["Use the -ing form after not: Not knowing.", "Not goes before the -ing form: Not knowing.", "Use Not + -ing, without to: Not knowing."]],
 "9.4": [
  ["Move the tense back: want → wanted.", "Present simple moves back to past simple: wanted.", "Want is a state verb, and the tense moves back: wanted."],
  ["Say has no person after it. With me, use told.", "Use tell + person: told me.", "Use tell + person to report what someone said: told me."],
  ["Move the tense back: can → could.", "After could, use the base form: could play.", "Can becomes could, and use the base form: could play."],
  ["Time words change in reported speech: tomorrow → the next day.", "Yesterday is the wrong time. Tomorrow becomes the next day.", "The day before means yesterday. Tomorrow becomes the next day."],
  ["The order is had + past participle: had passed.", "Past simple moves back to past perfect: had passed.", "Use had passed."],
  ["Say has no person after it. Use said that or told me that.", "Tell needs a person: told me that.", "Move the tense back (am → was)."]],
 "9.6": "prep"
};

const FEEDBACK = STAGE === 8 ? FEEDBACK8 : FEEDBACK9;

// The note for wrong option `opt` (1–3, as in the curriculum item) of item `item` of a grammar point.
export function wrongNote(pointId, item, opt) {
  const f = FEEDBACK[pointId], g = GRAMMAR.find(x => x.id === pointId);
  if (f === "prep") {
    const it = g.items[item], before = it[0].split("___")[0].trim().split(" ").pop();
    return `We say "${before} ${it[1]}", not "${before} ${it[opt + 1]}". Learn it as one unit.`;
  }
  return f && f[item] ? f[item][opt - 1] : null;
}
