#!/usr/bin/env python3
"""Generate Edge TTS audio per line + build a word-accurate timeline."""
import asyncio
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "public", "audio")
PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
CONCURRENCY = 3

SCENE_GAP = 0.55
LINE_GAP = 0.22
LEAD_IN = 1.1
TAIL = 3.0


def ffprobe_duration(path: str) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", path]
    )
    return float(out.strip())


async def synth(voice: str, rate: str, text: str, out_path: str):
    import edge_tts

    communicate = edge_tts.Communicate(
        text, voice, rate=rate, proxy=PROXY, boundary="WordBoundary"
    )
    words = []
    with open(out_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "text": chunk["text"],
                    "offset": chunk["offset"] / 1e7,
                    "duration": chunk["duration"] / 1e7,
                })
    return words


async def main():
    spec = json.load(open(os.path.join(ROOT, "scripts", "script.json"), encoding="utf-8"))
    os.makedirs(AUDIO_DIR, exist_ok=True)
    tasks = []
    for scene in spec["scenes"]:
        for line in scene["lines"]:
            tasks.append(line)

    sem = asyncio.Semaphore(CONCURRENCY)
    words_map = {}

    async def worker(line):
        async with sem:
            path = os.path.join(AUDIO_DIR, f"{line['id']}.mp3")
            for attempt in range(4):
                try:
                    words = await synth(
                        spec["voices"][line["speaker"]],
                        spec.get("rate", "+0%"),
                        line["text"],
                        path,
                    )
                    words_map[line["id"]] = words
                    print(f"ok  {line['id']}  {len(words)} words", flush=True)
                    return
                except Exception as exc:  # noqa: BLE001
                    print(f"retry {line['id']} ({attempt+1}/4): {exc}", flush=True)
                    await asyncio.sleep(1.5 + attempt)
            raise RuntimeError(f"TTS failed for {line['id']}")

    await asyncio.gather(*(worker(line) for line in tasks))

    # Build timeline
    cursor = LEAD_IN
    lines_out = []
    scenes_out = []
    for scene in spec["scenes"]:
        scene_start = cursor
        for idx, line in enumerate(scene["lines"]):
            path = os.path.join(AUDIO_DIR, f"{line['id']}.mp3")
            duration = ffprobe_duration(path)
            words = words_map[line["id"]]
            words_out = [{
                "text": w["text"],
                "start": cursor + w["offset"],
                "end": cursor + w["offset"] + w["duration"],
            } for w in words]
            lines_out.append({
                "id": line["id"],
                "scene": scene["id"],
                "speaker": line["speaker"],
                "text": line["text"],
                "emphasis": line.get("emphasis", []),
                "start": round(cursor, 3),
                "duration": round(duration, 3),
                "end": round(cursor + duration, 3),
                "words": [{"text": w["text"], "start": round(w["start"], 3), "end": round(w["end"], 3)} for w in words_out],
            })
            cursor += duration
            if idx != len(scene["lines"]) - 1:
                cursor += LINE_GAP
        cursor += SCENE_GAP
        scenes_out.append({
            "id": scene["id"],
            "name": scene["name"],
            "start": round(scene_start, 3),
            "end": round(cursor - SCENE_GAP, 3),
        })

    total = cursor - SCENE_GAP + TAIL
    fps = 30
    timeline = {
        "title": spec["title"],
        "subtitle": spec["subtitle"],
        "fps": fps,
        "width": 1920,
        "height": 1080,
        "totalDuration": round(total, 3),
        "durationInFrames": int(total * fps) + 1,
        "scenes": scenes_out,
        "lines": lines_out,
    }
    with open(os.path.join(ROOT, "src", "data", "timeline.json"), "w", encoding="utf-8") as f:
        json.dump(timeline, f, ensure_ascii=False, indent=1)

    print(f"\nTOTAL {total:.1f}s = {int(total//60)}m{total%60:04.1f}s, "
          f"{len(lines_out)} lines, {timeline['durationInFrames']} frames")


if __name__ == "__main__":
    asyncio.run(main())
