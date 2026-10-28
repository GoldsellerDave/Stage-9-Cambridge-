"""Stamp a version on every script and the stylesheet, so phones and tablets load an update at once.

GitHub Pages lets browsers keep files for 10 minutes, so after an update a device could mix old and new
modules. This writes an import map into index.html and teacher.html that adds ?v=<content hash> to each
js/ module, and the same to the entry script and stylesheet. Run it before every commit that changes
js/ or assets/style.css:  python3 tools/stamp.py
"""
import hashlib, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
h = lambda p: hashlib.sha1(p.read_bytes()).hexdigest()[:8]
mods = sorted((ROOT / "js").glob("*.js"))
imap = {f"./js/{p.name}": f"./js/{p.name}?v={h(p)}" for p in mods}
css = f"assets/style.css?v={h(ROOT / 'assets/style.css')}"
block = ('<script type="importmap" id="stamp">' + json.dumps({"imports": imap}, separators=(",", ":")) + "</script>")

for page, entry in (("index.html", "student.js"), ("teacher.html", "teacher.js")):
    f = ROOT / page
    s = f.read_text()
    s = re.sub(r'<script type="importmap" id="stamp">.*?</script>\n?', "", s, flags=re.S)
    s = re.sub(r'href="assets/style\.css(\?v=\w+)?"', f'href="{css}"', s)
    s = re.sub(r'<script type="module" src="js/' + entry + r'(\?v=\w+)?"></script>', f'<script type="module" src="js/{entry}?v={h(ROOT / "js" / entry)}"></script>', s)
    s = s.replace("</head>", block + "\n</head>", 1)
    f.write_text(s)
print(f"Stamped {len(mods)} modules and the stylesheet.")
