# Checkpoint Reading Trainer

Adaptive reading practice for Cambridge Lower Secondary Checkpoint English, Stage 9.

- **Baseline:** three short texts (Easier, Core, Harder), 12 questions, no hints. The score sets each student's starting level (0–5 Easier, 6–9 Core, 10–12 Harder).
- **Practice:** each text comes in three versions with the same paragraphs. Wrong answers get a hint, then a reread with a strategy card, then the easier text. Three right first time in a row moves a student up. Units 2 and 3 also have a Challenge (about C1) version in `js/texts-challenge.js`, which students reach only inside a text, after three right first time on Harder.
- **Reading level:** each baseline and practice text is placed on eight CEFR steps (A2, A2+, B1, B1+, B2, B2+, C1, C1+). The text version gives the band (Easier A2, Core B1, Harder B2, Challenge C1) and about 75% right first time gives the upper step. These are estimates, not an official calibration.
- **XP and streaks:** 10 / 15 / 20 XP for right first time on Easier / Core / Harder, less after support, bonuses for finishing, levelling up and keeping a weekly streak (2 texts a week).
- **Class leaderboard:** this week, all time, and most improved (first vs latest baseline).
- **Progress tracker:** skill bars, level over time, badges and history for each student.
- **Teacher dashboard** (`teacher.html`): class table, skills heat map, each student's tracker, leaderboard view, PIN resets.

Plain HTML, CSS and JavaScript modules: no build step. Data lives in Supabase.

## Set up

1. **Supabase:** create a project, open SQL Editor, paste `supabase/schema.sql` and run it. Then run the private `seed.sql` that holds the class accounts (made with `tools/make_seed.py`; never commit it, because it contains student names and PINs).
2. **Connect the site:** put the Project URL and the anon (publishable) key in `js/config.js`. Never put the service-role key anywhere in this repo.
3. **GitHub Pages:** Settings → Pages → Deploy from a branch → `main`, folder `/ (root)`.

Until `js/config.js` is filled in, the site runs in **demo mode**: a sample class saved in the browser only. Student login `demo` / `1234`, teacher login `teacher` / `demo`.

## Student accounts

```
python3 tools/make_seed.py OUT_DIR 8B3-roster.csv 8B4-roster.csv 8B5-roster.csv
```

Rosters are CSV files with `No,Name` columns. Usernames are class + register number (`8b3-07`), with random 4-digit PINs. The script writes `seed.sql` and `logins.csv` to `OUT_DIR`. Keep both private.

## Adding a text

Add an entry to `PRACTICE_TEXTS` in `js/content.js`: three levels with the same paragraph letters, and eight question slots. Each slot has a skill, a target paragraph and one question per level, with a hint, the sentence to highlight on reread, and an explanation for the Easier version. Short answers use keyword groups. Run `npm test` to check that every highlight sentence exists in its paragraph.

## How the data is protected

The website never reads tables directly. Every request goes through `ck_*` functions that check the sign-in token, so students only see their own history and their own class leaderboard. Five wrong PINs lock an account for 5 minutes.
