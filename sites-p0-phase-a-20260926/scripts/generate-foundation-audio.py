#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

def run(*args):
    subprocess.run([str(x) for x in args], check=True)

def output(*args):
    return subprocess.check_output([str(x) for x in args], text=True).strip()

def speech_text(text):
    # Keep academic source text immutable; only make a few pronunciation-friendly
    # substitutions in the synthesized signal.
    return text.replace("A3", "A three")

def split_turns(source, roles):
    if not roles:
        return [("speaker", source)]
    pattern = r"(?<!\w)(" + "|".join(re.escape(r) for r in roles) + r"):\s*"
    parts = re.split(pattern, source)
    turns = []
    if parts and parts[0].strip():
        turns.append((roles[0], parts[0].strip()))
    for i in range(1, len(parts), 2):
        role = parts[i]
        text = parts[i + 1].strip() if i + 1 < len(parts) else ""
        if text:
            turns.append((role, text))
    return turns or [(roles[0], source)]

def voice_for(role, roles):
    index = roles.index(role) if role in roles else 0
    return "en+f3" if index % 2 == 0 else "en+m3"

def speed_for(level):
    return {"A1": 145, "A2": 148, "B1": 155}.get(level, 150)

def generate_lesson(lesson, out_dir):
    audio = lesson.get("audio_asset") or {}
    source = audio.get("source_text", "")
    roles = audio.get("roles") or []
    if not source:
        raise SystemExit(f"{lesson['id']}: missing audio source text")
    lesson_id = lesson["id"]
    target = out_dir / f"{lesson_id}-v1.mp3"
    speed = speed_for(lesson.get("cefr_target"))
    with tempfile.TemporaryDirectory(prefix=f"{lesson_id}-") as tmp_name:
        tmp = Path(tmp_name)
        silence = tmp / "silence.wav"
        run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono", "-t", "0.38", silence)
        concat = []
        turns = split_turns(source, roles)
        for index, (role, text) in enumerate(turns):
            wav = tmp / f"turn-{index:02d}.wav"
            run("espeak", "-v", voice_for(role, roles), "-s", str(speed),
                "-p", "48", "-a", "175", "-w", wav, speech_text(text))
            concat.append(wav)
            if index != len(turns) - 1:
                concat.append(silence)
        list_file = tmp / "concat.txt"
        list_file.write_text("".join(f"file '{p.as_posix()}'\n" for p in concat), encoding="utf-8")
        joined = tmp / "joined.wav"
        run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-f", "concat", "-safe", "0", "-i", list_file, "-c:a", "pcm_s16le", joined)
        run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", joined, "-ac", "1", "-ar", "44100", "-codec:a", "libmp3lame",
            "-b:a", "64k", target)
    duration = float(output("ffprobe", "-v", "error", "-show_entries",
                            "format=duration", "-of", "default=nw=1:nk=1", target))
    digest = hashlib.sha256(target.read_bytes()).hexdigest()
    return {
        "source": source,
        "url": f"/foundation-audio/{target.name}",
        "duration": round(duration, 3),
    }, digest, target.stat().st_size

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--curriculum", default="content/curriculum-1.11.0-candidate.json")
    parser.add_argument("--manifest", default="content/foundation-audio.json")
    parser.add_argument("--out", default="public/foundation-audio")
    parser.add_argument("--ids", nargs="+", required=True)
    args = parser.parse_args()

    curriculum = json.loads(Path(args.curriculum).read_text(encoding="utf-8"))
    lessons = {lesson["id"]: lesson for lesson in curriculum["lessons"]}
    manifest_path = Path(args.manifest)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    for lesson_id in args.ids:
        lesson = lessons.get(lesson_id)
        if not lesson:
            raise SystemExit(f"Lesson not found: {lesson_id}")
        if lesson.get("module") != "listening":
            raise SystemExit(f"Not a Listening lesson: {lesson_id}")
        entry, digest, size = generate_lesson(lesson, out_dir)
        manifest[lesson_id] = entry
        print(f"{lesson_id}: duration={entry['duration']:.3f}s bytes={size} sha256={digest}")

    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
