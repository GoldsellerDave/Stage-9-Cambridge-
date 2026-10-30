"""Make the voices for the grammar cartoon scenes (js/scenes.js) with Kokoro TTS (kokoro-onnx).

Usage: python3 tools/make_scene_audio.py MODEL_DIR
MODEL_DIR holds kokoro-v1.0.onnx and voices-v1.0.bin (github.com/thewh1teagle/kokoro-onnx/releases, model-files-v1.0).
One voice per character, never blended or pitch-shifted: Zip = am_puck (American), Nova = bf_emma (British).
Writes audio/scenes/<scene>-<beat>.mp3 and js/scene-audio.js (a version per line, for cache busting).
"""
import hashlib, json, os, re, subprocess, sys, tempfile
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = {"zip": ("am_puck", 1.0), "nova": ("bf_emma", 0.92)}

def scenes():
    js = 'import("./js/scenes.js").then(m => console.log(JSON.stringify(Object.fromEntries(Object.entries(m.SCENES).map(([k, v]) => [k, v.beats.map(b => ({ who: b.who, say: b.say }))])))))'
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))

def spoken(t):
    # No emoji; capitals used for stress are read as normal words; V3 is read as "V three".
    t = t.replace("…", ", ")
    t = re.sub(r"[^\w\s.,!?'\"+:;()-]", "", t)
    t = re.sub(r"\b([A-Z]{2,})\b", lambda m: m.group(1).lower() if m.group(1) not in ("V",) else m.group(1), t)
    return t.replace("V3", "V three").replace("+", "plus").strip()

def main():
    k = Kokoro(os.path.join(sys.argv[1], "kokoro-v1.0.onnx"), os.path.join(sys.argv[1], "voices-v1.0.bin"))
    out_dir = os.path.join(ROOT, "audio", "scenes"); os.makedirs(out_dir, exist_ok=True)
    vers = {}
    for sid, beats in scenes().items():
        for i, b in enumerate(beats):
            voice, speed = VOICES[b["who"]]
            text = spoken(b["say"])
            audio, sr = k.create(text, voice=voice, speed=speed, lang="en-gb" if b["who"] == "nova" else "en-us")
            wav = os.path.join(tempfile.gettempdir(), "scene.wav"); sf.write(wav, audio, sr)
            mp3 = os.path.join(out_dir, f"{sid}-{i}.mp3")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11",
                            "-ac", "1", "-b:a", "64k", mp3], check=True)
            vers[f"{sid}-{i}"] = hashlib.sha1(f"{voice}{speed}{text}".encode()).hexdigest()[:8]
            print(sid, i, b["who"], round(len(audio) / sr, 1), "s:", text)
    with open(os.path.join(ROOT, "js", "scene-audio.js"), "w") as f:
        f.write("// Made by tools/make_scene_audio.py: a version per cartoon line (audio/scenes/<scene>-<beat>.mp3).\n")
        f.write("export const SCENE_AUDIO = " + json.dumps(vers) + ";\n")

main()
