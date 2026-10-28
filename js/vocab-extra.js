// Extra words for stronger readers, on each unit's theme. The syllabus lists in js/vocab.js stay the core for everyone;
// Stretch (B2) words join the vocabulary sets of students reading at B2 or above, Challenge (C1) words at C1.
// Each entry: [word, learner definition, example sentence with ___ where the word goes].
// They do not count towards the unit mission, so a student's mission progress is the same at every level.
export const EXTRA = {
 2: {
  stretch: [
   ["nutritious", "full of the things your body needs to be healthy", "Brown rice is more ___ than white bread."],
   ["balanced diet", "meals with the right amounts of different kinds of food", "A ___ includes fruit, vegetables, protein and grains."],
   ["frustration", "the feeling of being annoyed because you cannot do or change something", "He hit the table in ___ when the computer crashed."],
   ["resilient", "able to feel better quickly after something difficult happens", "___ students don't give up after one bad mark."],
   ["symptom", "a sign that you have an illness", "A high temperature is a common ___ of flu."],
   ["hygiene", "keeping yourself and things clean so that you don't get ill", "Good ___, like washing your hands, stops germs spreading."],
   ["sedentary", "sitting down a lot and not moving much", "A ___ lifestyle can lead to health problems."],
   ["well-being", "feeling healthy, happy and comfortable", "Exercise and sleep are important for your ___."]],
  challenge: [
   ["deficiency", "not having enough of something the body needs", "A vitamin D ___ can make your bones weak."],
   ["sustain", "to keep something going over a long time", "It is hard to ___ a healthy diet when you are very busy."],
   ["impulsive", "doing things suddenly, without thinking first", "___ people often say things they regret later."],
   ["composure", "the state of being calm and in control of your feelings", "She kept her ___ even when the crowd shouted at her."],
   ["susceptible", "easily affected or harmed by something", "Young children are more ___ to infections."],
   ["exacerbate", "to make a problem or a bad situation worse", "Looking at a screen late at night can ___ sleep problems."],
   ["pathogen", "a germ, such as a virus or bacterium, that causes disease", "Your immune system attacks any ___ that enters your body."],
   ["detrimental", "causing harm or damage", "Too much sugar is ___ to your teeth."]] },
 3: {
  stretch: [
   ["itinerary", "a plan of the places you will visit on a trip", "Our ___ includes two days in Hue and three in Hoi An."],
   ["destination", "the place you are travelling to", "Da Lat is a popular ___ for families."],
   ["accommodation", "a place to stay, such as a hotel or a campsite", "We booked cheap ___ near the beach."],
   ["landmark", "a famous building or place that is easy to recognise", "The Golden Bridge is a famous ___ in Da Nang."],
   ["heritage", "buildings, traditions and places that are important to a country's history", "Hoi An's old town is an important part of Vietnam's ___."],
   ["souvenir", "something you buy to help you remember a place", "I bought a small lantern as a ___."],
   ["overcrowded", "with too many people in one place", "The beach was so ___ that we couldn't find a place to sit."],
   ["off the beaten track", "far away from the places most tourists visit", "We stayed in a quiet village, far ___."]],
  challenge: [
   ["sustainable", "able to continue for a long time without harming the environment", "___ tourism protects nature and local communities."],
   ["carbon footprint", "the amount of carbon dioxide that your activities produce", "Taking the train instead of flying reduces your ___."],
   ["preservation", "keeping something safe from damage or change", "Ticket money pays for the ___ of the ancient temples."],
   ["indigenous", "belonging to a place from the very beginning", "The guide told us about the ___ people of the mountains."],
   ["exploit", "to use someone or something unfairly for your own advantage", "Some tour companies ___ local workers and pay them very little."],
   ["authentic", "real and true, not a copy or made for tourists", "We wanted an ___ experience, so we ate with a local family."],
   ["infrastructure", "the basic systems a place needs, such as roads, water and electricity", "The island's ___ cannot cope with so many visitors."],
   ["deteriorate", "to become worse over time", "The old frescoes began to ___ when visitors touched them."]] },
 4: {
  stretch: [
   ["endangered", "at risk of disappearing from the world completely", "The Arabian oryx was once a very ___ animal."],
   ["habitat", "the natural home of an animal or plant", "Cutting down forests destroys the ___ of many animals."],
   ["species", "a group of animals or plants of the same type", "Scientists discover new ___ of insects every year."],
   ["evolve", "to change slowly over a very long time", "Living things ___ slowly over millions of years."],
   ["transmit", "to pass something, such as a disease, from one person or animal to another", "Mosquitoes can ___ diseases such as malaria."],
   ["experiment", "a scientific test to find something out", "In the ___, the bats flew through a dark room full of wires."],
   ["hypothesis", "an idea that scientists test to see if it is true", "Her ___ was that the bats used sound to find their food."],
   ["vaccine", "a substance that protects people from a disease", "The new ___ protects children against measles."]],
  challenge: [
   ["biodiversity", "the variety of plants and animals in a place", "Rainforests have the highest ___ on Earth."],
   ["reintroduce", "to put an animal back into the wild where it used to live", "Scientists hope to ___ the oryx to other deserts."],
   ["perceive", "to notice or become aware of something with your senses", "Some birds can ___ colours that humans cannot see."],
   ["mutation", "a change in the genes of a living thing", "A ___ in one gene can cause colour blindness."],
   ["outbreak", "the sudden start of a disease in a place", "There was an ___ of flu at the school last winter."],
   ["eradicate", "to destroy something completely", "Doctors hope to ___ the disease within ten years."],
   ["frequency", "how high or low a sound is: the number of sound waves per second", "Bats make sounds at a very high ___."],
   ["empirical", "based on what you observe or test, not only on ideas", "Scientists need ___ evidence before they accept a theory."]] }
};

// Extra words as word objects, like unitWords(): tier 1 = Stretch, 2 = Challenge.
export function extraWords(unit, maxTier = 2) {
  const e = EXTRA[unit]; if (!e) return [];
  return [["stretch", 1], ["challenge", 2]].filter(([, t]) => t <= maxTier)
    .flatMap(([k, t]) => e[k].map(([w, def, ex]) => ({ w, def, ex, unit, list: k, tier: t, extra: true })));
}
export const allExtraWords = () => Object.keys(EXTRA).flatMap(u => extraWords(+u));
