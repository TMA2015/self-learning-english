#!/usr/bin/env python3
"""Stage two replacement Kokoro MP3s without modifying any release asset.

Requires: pip install kokoro==0.9.4 soundfile numpy huggingface_hub
           ffmpeg on PATH; eSpeak NG for the Kokoro phonemizer fallback.
Run from sites-p0-phase-a-20260926:
  python scripts/generate-kokoro-legacy-replacements.py

Outputs ../kokoro-legacy-replacements/ by default (outside tracked app).
Do not copy into public/, change manifest, or clear rights before listening QA.
"""
import argparse
import hashlib
import importlib.metadata
import json
import re
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import soundfile as sf

ASSETS = {
    "LIS-A2-01": {"Woman": "bf_emma", "Man": "bm_lewis"},
    "LIS-B1-01": {"Host": "bf_emma", "Guest": "bm_lewis"},
}
MODEL_REPO = "hexgrad/Kokoro-82M"
MODEL_FILE = "kokoro-v1_0.pth"
MODEL_SHA256 = "496dba118d1a58f5f3db2efc88dbdc216e0483fc89fe6e47ee1f2c53f18ad1e4"
VOICE_PREFIXES = {"bf_emma": "d0a423de", "bm_lewis": "b5204750"}
RATE = 24000
GAP_SECONDS = 0.38

def digest(path):
    h = hashlib.sha256()
    with Path(path).open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def turns_for(source, speakers):
    turns = []
    for line in source.splitlines():
        if not line.strip():
            continue
        match = re.fullmatch(r"([A-Za-z]+):\s*(.+)", line.strip())
        if not match or match.group(1) not in speakers:
            raise ValueError("Cannot safely assign a voice to source line: " + line)
        turns.append((match.group(1), match.group(2)))
    if not turns:
        raise ValueError("Empty transcript")
    return turns

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path("content/foundation-audio.json"))
    parser.add_argument("--output", type=Path, default=Path("../kokoro-legacy-replacements"))
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    public = Path("public").resolve()
    output = args.output.resolve()
    if output == public or public in output.parents:
        parser.error("Staging output must NOT be inside public/")
    output.mkdir(parents=True, exist_ok=True)

    # A pinned package version and verified upstream model/voice bytes make the
    # new audio reproducible and independently traceable, unlike the old MP3s.
    from huggingface_hub import hf_hub_download
    from kokoro import KPipeline

    model_path = hf_hub_download(repo_id=MODEL_REPO, filename=MODEL_FILE)
    verified_model_sha = digest(model_path)
    if verified_model_sha != MODEL_SHA256:
        raise ValueError("Kokoro v1.0 model SHA mismatch: " + verified_model_sha)
    voice_hashes = {}
    for voice, prefix in VOICE_PREFIXES.items():
        voice_path = hf_hub_download(repo_id=MODEL_REPO, filename=f"voices/{voice}.pt")
        value = digest(voice_path)
        if not value.startswith(prefix):
            raise ValueError(f"Voice {voice} fingerprint differs from official VOICES.md")
        voice_hashes[voice] = value

    pipeline = KPipeline(lang_code="b")
    version = importlib.metadata.version("kokoro")
    ffmpeg_version = subprocess.check_output(["ffmpeg", "-version"], text=True).splitlines()[0]

    for lesson_id, speakers in ASSETS.items():
        source = manifest[lesson_id]["source"]
        turns = turns_for(source, speakers)
        pieces = []
        for index, (speaker, text) in enumerate(turns):
            if index:
                pieces.append(np.zeros(round(GAP_SECONDS * RATE), dtype=np.float32))
            sound = []
            for _, _, audio in pipeline(text, voice=speakers[speaker], speed=1.0):
                if audio is not None:
                    sound.append(np.asarray(audio, dtype=np.float32).reshape(-1))
            if not sound:
                raise RuntimeError(f"No Kokoro signal: {lesson_id} turn {index}")
            pieces.extend(sound)

        name = f"{lesson_id}-v2.mp3"
        target = output / name
        if target.exists():
            raise FileExistsError(f"Refusing to overwrite staged file: {target}")
        with tempfile.TemporaryDirectory() as temp:
            wav_path = Path(temp) / "source.wav"
            sf.write(wav_path, np.concatenate(pieces), RATE, subtype="PCM_16")
            subprocess.run(
                ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                 "-i", str(wav_path), "-ac", "1", "-ar", "44100",
                 "-codec:a", "libmp3lame", "-b:a", "64k", str(target)],
                check=True,
            )
        evidence = {
            "asset_id": lesson_id,
            "stage_only": True,
            "file": name,
            "mp3_sha256": digest(target),
            "mp3_size_bytes": target.stat().st_size,
            "transcript_source": "content/foundation-audio.json",
            "transcript_sha256": hashlib.sha256(source.encode("utf-8")).hexdigest(),
            "voices_by_speaker": speakers,
            "model_repo": MODEL_REPO,
            "model_file": MODEL_FILE,
            "verified_model_sha256": verified_model_sha,
            "verified_voice_sha256": voice_hashes,
            "kokoro_package_version": version,
            "ffmpeg_version": ffmpeg_version,
            "sample_rate_pcm": RATE,
            "output_sample_rate": 44100,
            "output_bitrate": "64k",
            "gap_seconds": GAP_SECONDS,
            "generated_utc": datetime.now(timezone.utc).isoformat(),
            "model_license": "Apache-2.0 (verify notices before release)",
            "rights_clearance": "PENDING",
            "listening_qa": "PENDING",
        }
        (output / f"{lesson_id}-v2.metadata.json").write_text(
            json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"STAGED {name} sha256={evidence['mp3_sha256']}")
    print("Both replacements are staged only. No release assets were modified.")

if __name__ == "__main__":
    main()
