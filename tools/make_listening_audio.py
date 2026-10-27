"""Make the listening MP3s and line timings from js/listening.js with Kokoro TTS (kokoro-onnx).

Usage: python3 tools/make_listening_audio.py MODEL_DIR [task_id ...]
MODEL_DIR holds kokoro-v1.0.onnx and voices-v1.0.bin
(from github.com/thewh1teagle/kokoro-onnx/releases, model-files-v1.0).
Writes audio/listening/<id>.mp3 and js/listening-times.js (start and end second of every line).
"""
import json, os, subprocess, sys, tempfile
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP, SECTION_GAP, SR = 0.55, 1.2, 24000

def tasks():
    js = 'import("./js/listening.js").then(m => console.log(JSON.stringify(m.LISTENING)))'
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))

def shift(audio, semitones):
    """Raise the pitch by a number of semitones, keeping the length (ffmpeg rubberband)."""
    src, dst = (os.path.join(tempfile.gettempdir(), n) for n in ("shift-in.wav", "shift-out.wav"))
    sf.write(src, audio, SR)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", f"rubberband=pitch={2 ** (semitones / 12):.4f}", dst], check=True)
    out, _ = sf.read(dst, dtype="float32")
    return out

def main():
    model_dir, only = sys.argv[1], set(sys.argv[2:])
    k = Kokoro(os.path.join(model_dir, "kokoro-v1.0.onnx"), os.path.join(model_dir, "voices-v1.0.bin"))
    times_path = os.path.join(ROOT, "js", "listening-times.js")
    times = {}
    if os.path.exists(times_path):
        times = json.loads(open(times_path).read().split("=", 1)[1].strip().rstrip(";"))
    for t in tasks():
        if only and t["id"] not in only:
            continue
        parts, spans, pos = [np.zeros(int(SR * 0.4))], [], 0.4
        for n, (who, text) in enumerate(t["lines"]):
            if n and who == "NARRATOR":
                parts.append(np.zeros(int(SR * SECTION_GAP))); pos += SECTION_GAP
            spec = t["voices"][who]
            if isinstance(spec, str):
                spec = {"mix": [[spec, 1]], "pitch": 0}
            first = spec["mix"][0][0]
            style = sum(k.get_voice_style(v) * w for v, w in spec["mix"])
            audio, sr = k.create(text, voice=style, speed=0.92 if who != "NARRATOR" else 0.95,
                                 lang="en-gb" if first[0] == "b" else "en-us")
            assert sr == SR
            if spec.get("pitch"):
                audio = shift(audio, spec["pitch"])
            spans.append([round(pos, 2), round(pos + len(audio) / SR, 2)])
            parts.append(audio); pos += len(audio) / SR
            parts.append(np.zeros(int(SR * GAP))); pos += GAP
        wav = os.path.join(tempfile.gettempdir(), t["id"] + ".wav")
        sf.write(wav, np.concatenate(parts), SR)
        out = os.path.join(ROOT, "audio", "listening", t["id"] + ".mp3")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", "64k", out], check=True)
        times[t["id"]] = spans
        print(t["id"], f"{pos:.0f} s")
    with open(times_path, "w") as f:
        f.write("// Made by tools/make_listening_audio.py: start and end second of each line of each recording.\n")
        f.write("export const TIMES = " + json.dumps(times, separators=(",", ":")) + ";\n")

if __name__ == "__main__":
    main()
