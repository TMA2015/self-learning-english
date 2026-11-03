#!/usr/bin/env python3
"""Stage three transcript-matched Kokoro repairs staged outside public/.

Requires: pip install kokoro==0.9.4 soundfile numpy huggingface_hub
           ffmpeg on PATH; eSpeak NG for the Kokoro phonemizer fallback.
Run from sites-p0-phase-a-20260926:
  python scripts/generate-kokoro-legacy-replacements.py --dry-run
  python scripts/generate-kokoro-legacy-replacements.py

Default stages the 3 owner-flagged eSpeak lessons only. --ids allows older
reproducibility tasks. Outputs MP3, per-asset sidecar, and one upload ZIP.
Do not modify public/, manifest, curriculum, or rights before owner listening QA.
"""
import argparse
import hashlib
import importlib.metadata
import json
import re
import subprocess
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path

ASSETS = {
    # The three old eSpeak lessons flagged by the owner, NOT LIS-NEW-* aliases.
    "LIS-A1-01": {"Teacher": "bf_emma"},
    "LIS-A2-02": {"Emma": "bf_emma", "Ben": "bm_lewis"},
    "LIS-B1-02": {"Maya": "bf_emma", "Leo": "bm_lewis"},
    # Existing high-quality replacements selectable explicitly if needed.
    "LIS-A2-01": {"Woman": "bf_emma", "Man": "bm_lewis"},
    "LIS-B1-01": {"Host": "bf_emma", "Guest": "bm_lewis"},
}
DEFAULT_IDS = ("LIS-A1-01", "LIS-A2-02", "LIS-B1-02")
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
    """Recognise dialogue roles even when all turns share one text line.

    Do not read an entire Emma/Ben or Maya/Leo exchange in one voice.
    Stop instead of silently changing the transcript or inventing speakers.
    """
    if not isinstance(source, str) or not source.strip():
        raise ValueError("Missing original transcript")
    labels = "|".join(re.escape(role) for role in speakers)
    parts = re.split(r"(?<![A-Za-z0-9_])(" + labels + r"):\s*", source)
    if not parts or parts[0].strip() or len(parts) < 3 or len(parts) % 2 != 1:
        raise ValueError("Dialogue is not fully speaker-labelled")
    turns = []
    for i in range(1, len(parts), 2):
        role, phrase = parts[i], parts[i + 1].strip()
        if role not in speakers or not phrase:
            raise ValueError("Unmapped or empty dialogue turn: " + role)
        turns.append((role, phrase))
    return turns


def speech_text(text):
    # Speech-only pronunciation fix; academic transcript remains byte-identical.
    return re.sub(r"\bA3\b", "A three", text)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path("content/foundation-audio.json"))
    parser.add_argument("--output", type=Path, default=Path("../kokoro-legacy-replacements"))
    parser.add_argument("--ids", nargs="+", choices=sorted(ASSETS), default=list(DEFAULT_IDS))
    parser.add_argument("--dry-run", action="store_true", help="Check source IDs, text parity and voices; no model/download")
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    public = Path("public").resolve()
    output = args.output.resolve()
    if output == public or public in output.parents:
        parser.error("Staging output must NOT be inside public/")
    curriculum_path = args.manifest.parent / "curriculum-1.18.1-candidate.json"
    current = {}
    if curriculum_path.exists():
        data = json.loads(curriculum_path.read_text(encoding="utf-8"))
        current = {x["id"]: x for x in data["lessons"] if x["module"] == "listening"}
    for lesson_id in args.ids:
        if lesson_id not in manifest:
            raise ValueError("Missing canonical transcript: " + lesson_id)
        source = manifest[lesson_id]["source"]
        if lesson_id in current and source != current[lesson_id]["audio_asset"]["source_text"]:
            raise ValueError("Manifest/curriculum source mismatch: " + lesson_id)
        turns = turns_for(source, ASSETS[lesson_id])
        print("TRANSCRIPT_VERIFIED", lesson_id, "turns", len(turns),
              "voices", ",".join(ASSETS[lesson_id][role] for role, _ in turns),
              "sha256", hashlib.sha256(source.encode("utf-8")).hexdigest())
    if args.dry_run:
        print("DRY_RUN_PASS: text and speaker mapping; no MP3 generated")
        return

    output.mkdir(parents=True, exist_ok=True)
    import numpy as np
    import soundfile as sf

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

    generated = []
    for lesson_id in args.ids:
        speakers = ASSETS[lesson_id]
        source = manifest[lesson_id]["source"]
        turns = turns_for(source, speakers)
        pieces = []
        for index, (speaker, text) in enumerate(turns):
            if index:
                pieces.append(np.zeros(round(GAP_SECONDS * RATE), dtype=np.float32))
            sound = []
            for _, _, audio in pipeline(speech_text(text), voice=speakers[speaker], speed=1.0):
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
    package = output / "SLE_KOKORO_LEGACY3_REPAIR.zip"
    if package.exists():
        raise FileExistsError("Refusing to overwrite existing ZIP " + str(package))
    with zipfile.ZipFile(package, "w", zipfile.ZIP_DEFLATED) as bundle:
        for lesson_id in args.ids:
            for ending in ("-v2.mp3", "-v2.metadata.json"):
                file = output / (lesson_id + ending)
                bundle.write(file, file.name)
    print("STAGED_UPLOAD_ZIP", package)
    print("No curriculum, public audio or learner records modified.")

if __name__ == "__main__":
    main()
