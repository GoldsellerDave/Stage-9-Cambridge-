"""Make student logins from class rosters.

Usage: python3 tools/make_seed.py OUT_DIR ROSTER.csv [ROSTER.csv ...]

Each roster is a CSV with columns No,Name, named after its class (for example 8B3-roster.csv).
Writes, into OUT_DIR (keep it private, never commit it):
  seed.sql    paste into Supabase > SQL Editor after schema.sql, to create the accounts
  logins.csv  class, register number, name, username, PIN (for the teacher only)
Usernames look like 8b3-07. PINs are random 4-digit numbers. Running it again makes new PINs,
and running the new seed.sql resets those PINs (accounts and progress are kept).
"""
import csv
import os
import re
import secrets
import sys


def sql_str(s):
    return "'" + s.replace("'", "''") + "'"


def main(out_dir, rosters):
    os.makedirs(out_dir, exist_ok=True)
    rows = []
    for path in rosters:
        cls = re.match(r"([0-9]+[A-Za-z][0-9]*)", os.path.basename(path)).group(1).upper()
        with open(path, encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                if not r.get("Name", "").strip():
                    continue
                no = int(r["No"])
                rows.append({"class": cls, "no": no, "name": r["Name"].strip(),
                             "username": f"{cls.lower()}-{no:02d}", "pin": f"{secrets.randbelow(10000):04d}"})
    teacher_pw = secrets.token_hex(4)
    lines = ["-- Student accounts. Run after schema.sql. Re-running resets PINs but keeps progress.",
             "insert into ck_students (class_code, username, display_name, pin_hash, role) values"]
    vals = [f"  ({sql_str(r['class'])}, {sql_str(r['username'])}, {sql_str(r['name'])}, "
            f"crypt({sql_str(r['pin'])}, gen_salt('bf')), 'student')" for r in rows]
    vals.append(f"  ('TEACHER', 'teacher', 'Teacher', crypt({sql_str(teacher_pw)}, gen_salt('bf')), 'teacher')")
    lines.append(",\n".join(vals))
    lines.append("on conflict (username) do update set display_name = excluded.display_name,\n"
                 "  class_code = excluded.class_code, pin_hash = excluded.pin_hash, failed_logins = 0, locked_until = null;")
    with open(os.path.join(out_dir, "seed.sql"), "w", encoding="utf-8") as f:
        f.write("set search_path = public, extensions;\n" + "\n".join(lines) + "\n")
    with open(os.path.join(out_dir, "logins.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["Class", "No", "Name", "Username", "PIN"])
        for r in rows:
            w.writerow([r["class"], r["no"], r["name"], r["username"], r["pin"]])
        w.writerow(["TEACHER", "", "Teacher", "teacher", teacher_pw])
    print(f"{len(rows)} students; files in {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2:])
