// Stage 8 escape rooms, in the same format as js/escape.js.
// Unit 3 "Our Society": a museum of town life. Reading answers are all one digit, so they open the safe.
export const ESCAPES = {
  3: {
    title: "Locked in the town museum",
    museum: "MILLBROOK MUSEUM OF TOWN LIFE",
    story: "Your class visited the Millbrook Museum of Town Life. You stayed behind to finish your notes… and the caretaker locked up and went home! Find the codes to get out.",
    rooms: [
      { name: "The ticket hall", kind: "vocab", lock: "letters",
        scene: "The lights are off. The front door has a letter padlock. Search the three places: the code is the first letter of each word you find, in order (shop, box, desk).",
        objects: ["Gift shop", "Lost property box", "Volunteers' desk"], keyObject: "Something glints under the counter" },
      { name: "The gallery", kind: "reading", lock: "digits",
        scene: "A safe by the stairs has a number lock. Someone left a visitor leaflet on the bench. The answers to the questions will open the safe.",
        objects: ["Visitor leaflet: question 1", "Visitor leaflet: question 2", "Visitor leaflet: question 3"], keyObject: "Something glints behind an old map" },
      { name: "The storeroom", kind: "grammar", lock: "digits",
        scene: "The back door to the street! Its keypad is covered in notes with mistakes. Each note you fix shows one number of the code.",
        objects: ["Note on the shelf", "Label on a box", "Message on the wall"], keyObject: "Something glints in an old box" }
    ],
    doc: { title: "Millbrook Museum of Town Life: visitor information", paras: [
      "Welcome to the Millbrook Museum of Town Life! The museum is in the old town hall, which was built in 1885. It has 2 floors and a roof garden. On the ground floor, 5 galleries show how life in Millbrook has changed, from narrow streets full of carts to today's lively, car-free town centre.",
      "Gallery 3 is about the neighbourhood. You can walk down a street from 1950, look inside 4 homes and listen to residents talking about community spirit. Gallery 5 looks at social problems in the town today, such as traffic congestion, and at how people are solving them.",
      "We are open from Wednesday to Sunday, 9 a.m. to 4 p.m. Entry is free for everyone under 18. School groups must book at least 7 days before their visit.",
      "Please do not run on the stairs, because the old wooden steps are narrow and easy to slip on. Bags must be left in one of the 8 lockers near the entrance. You can take photos everywhere except Gallery 1, where very old maps of the town are kept.",
      "The museum is run by the town council with the help of 6 volunteers. Every Saturday, they hold free workshops where young people learn about local history. The roof garden, a green space that overlooks the river, was planted by residents over 2 weekends."] },
    // tier: the lowest tier that gets the question (0 Core, 1 Stretch, 2 Challenge); para: where to look (1-based).
    reading: [
      { q: "How many floors does the museum have?", a: 2, para: 1, tier: 0 },
      { q: "How many galleries are there on the ground floor?", a: 5, para: 1, tier: 0 },
      { q: "Which gallery is about the neighbourhood?", a: 3, para: 2, tier: 0 },
      { q: "How many homes can visitors look inside in Gallery 3?", a: 4, para: 2, tier: 0 },
      { q: "In which gallery can't visitors take photos?", a: 1, para: 4, tier: 0 },
      { q: "How many lockers are there near the entrance?", a: 8, para: 4, tier: 0 },
      { q: "How many volunteers help at the museum?", a: 6, para: 5, tier: 0 },
      { q: "How many days before a visit must a school group book?", a: 7, para: 3, tier: 0 },
      { q: "How many days a week is the museum open?", a: 5, para: 3, tier: 1 },
      { q: "How many hours is the museum open each day?", a: 7, para: 3, tier: 1 },
      { q: "Which paragraph tells you who runs the museum?", a: 5, para: 5, tier: 1 },
      { q: "Which paragraph gives a reason for one of the museum's rules?", a: 4, para: 4, tier: 2 }
    ],
    escaped: "The back door clicks open and you step out into the market square. The street lights are on, and your class is waiting by the bus stop. You made it!"
  }
};
