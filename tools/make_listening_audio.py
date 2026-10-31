"""Make the listening MP3s and line timings from js/listening.js, js/minitests.js, js/lab.js (Listening Lab clips) and js/s8/ (Stage 8) with Kokoro TTS (kokoro-onnx).

Usage: python3 tools/make_listening_audio.py MODEL_DIR [task_id ...]
MODEL_DIR holds kokoro-v1.0.onnx and voices-v1.0.bin
(from github.com/thewh1teagle/kokoro-onnx/releases, model-files-v1.0).
Writes audio/listening/<id>.mp3 and js/listening-times.js (start and end second of every line).

Usage: python3 tools/make_listening_audio.py --google [task_id ...]
Uses Google Cloud Text-to-Speech Chirp 3 HD voices (much more natural), key from the GOOGLE_TTS_API_KEY environment
variable (never written to a file). The voices in the js files stay Kokoro names; GOOGLE maps each one to a Chirp 3 HD
voice with the same accent and a similar sound, so every speaker keeps their own voice.
"""
import base64, hashlib, io, json, os, subprocess, sys, tempfile, urllib.request
import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP, SECTION_GAP, SR = 0.55, 1.2, 24000

def tasks():
    # The unit listening tasks, the listening parts of the unit mini tests and the Listening Lab clips.
    # Stage 8 has its own unit tasks and mini tests in js/s8/ (node runs as Stage 9, so they are imported directly).
    js = ('Promise.all([import("./js/listening.js"), import("./js/minitests.js"), import("./js/lab.js"), import("./js/s8/listening.js"), import("./js/s8/minitests.js")])'
          '.then(([a, b, c, d, e]) => console.log(JSON.stringify([...a.LISTENING, ...b.MINI_LISTENING, ...c.LAB_CLIPS, ...d.LISTENING, ...e.MINI_LISTENING])))')
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))

def shift(audio, semitones):
    """Raise the pitch by a number of semitones, keeping the length (ffmpeg rubberband)."""
    src, dst = (os.path.join(tempfile.gettempdir(), n) for n in ("shift-in.wav", "shift-out.wav"))
    sf.write(src, audio, SR)
    # formant=preserved keeps the voice natural (without it, raised voices sound thin and warbly)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af",
                    f"rubberband=pitch={2 ** (semitones / 12):.4f}:formant=preserved:pitchq=quality", dst], check=True)
    out, _ = sf.read(dst, dtype="float32")
    return out

GOOGLE = {
    "bm_george": "en-GB-Chirp3-HD-Charon", "bm_daniel": "en-GB-Chirp3-HD-Iapetus",
    "bf_emma": "en-GB-Chirp3-HD-Achernar", "bf_isabella": "en-GB-Chirp3-HD-Vindemiatrix",
    "am_michael": "en-US-Chirp3-HD-Orus", "am_puck": "en-US-Chirp3-HD-Fenrir", "am_liam": "en-US-Chirp3-HD-Achird",
    "af_heart": "en-US-Chirp3-HD-Leda", "af_bella": "en-US-Chirp3-HD-Aoede", "af_sarah": "en-US-Chirp3-HD-Sulafat",
    "af_nicole": "en-US-Chirp3-HD-Zephyr", "af_jessica": "en-US-Chirp3-HD-Laomedeia",
}

def google(text, name, rate):
    body = {"input": {"text": text}, "voice": {"languageCode": "-".join(name.split("-")[:2]), "name": name},
            "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": SR, "speakingRate": rate}}
    req = urllib.request.Request("https://texttospeech.googleapis.com/v1/text:synthesize", json.dumps(body).encode(),
                                 {"Content-Type": "application/json", "X-Goog-Api-Key": os.environ["GOOGLE_TTS_API_KEY"]})
    for tries in range(4):
        try:
            data = base64.b64decode(json.load(urllib.request.urlopen(req, timeout=60))["audioContent"])
            break
        except Exception:
            if tries == 3: raise
    audio, sr = sf.read(io.BytesIO(data), dtype="float32")
    assert sr == SR
    return audio

def main():
    use_google = sys.argv[1] == "--google"
    model_dir, only = sys.argv[1], set(sys.argv[2:])
    if not use_google:
        from kokoro_onnx import Kokoro
        k = Kokoro(os.path.join(model_dir, "kokoro-v1.0.onnx"), os.path.join(model_dir, "voices-v1.0.bin"))
    times_path = os.path.join(ROOT, "js", "listening-times.js")
    times = {}
    if os.path.exists(times_path):
        times = json.loads(open(times_path).read().split("\n")[1].split("=", 1)[1].strip().rstrip(";"))
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
            if use_google:
                audio = google(text, GOOGLE[first], 0.95 if who != "NARRATOR" else 1.0)
            else:
                style = sum(k.get_voice_style(v) * w for v, w in spec["mix"])
                audio, sr = k.create(text, voice=style, speed=0.92 if who != "NARRATOR" else 0.95,
                                     lang="en-gb" if first[0] == "b" else "en-us")
                assert sr == SR
            if spec.get("pitch") and not use_google:
                audio = shift(audio, spec["pitch"])
            audio = audio * (0.08 / max(1e-6, float(np.sqrt(np.mean(audio ** 2)))))   # every speaker equally loud
            spans.append([round(pos, 2), round(pos + len(audio) / SR, 2)])
            parts.append(audio); pos += len(audio) / SR
            parts.append(np.zeros(int(SR * GAP))); pos += GAP
        wav = os.path.join(tempfile.gettempdir(), t["id"] + ".wav")
        sf.write(wav, np.clip(np.concatenate(parts), -1, 1), SR)
        out = os.path.join(ROOT, "audio", "listening", t["id"] + ".mp3")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11",
                        "-ar", str(SR), "-ac", "1", "-b:a", "96k", out], check=True)
        times[t["id"]] = spans
        print(t["id"], f"{pos:.0f} s")
    with open(times_path, "w") as f:
        f.write("// Made by tools/make_listening_audio.py: start and end second of each line of each recording.\n")
        f.write("export const TIMES = " + json.dumps(times, separators=(",", ":")) + ";\n")
        # A new version string whenever the recordings change, so browsers fetch the new MP3s instead of cached ones.
        f.write(f'export const AUDIO_V = "{hashlib.sha1(json.dumps(times).encode()).hexdigest()[:8]}";\n')

if __name__ == "__main__":
    main()
