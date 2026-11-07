#!/usr/bin/env python3
"""Build the voice-over track + timeline for the H. pylori explainer.

Pipeline:
  script (below) -> per-line neural TTS (sherpa-onnx, offline)
  -> trimmed 44.1 kHz mono WAVs -> concatenated voiceover.wav
  -> src/data/timeline.json (used by Remotion) + out/subtitles.srt
"""

import json
import os
import subprocess
import wave

import numpy as np
import sherpa_onnx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, ".cache")
PUB = os.path.join(ROOT, "public")
AUDIO_DIR = os.path.join(PUB, "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(os.path.join(ROOT, "src", "data"), exist_ok=True)
os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)

FPS = 30
SR = 44100
LINE_GAP = 0.32
SCENE_GAP = 0.85
LEAD_IN = 0.7
TAIL = 1.4

SCENES = [
    {
        "id": "hook",
        "label": "01 · 开场",
        "title": "体检单上的“阳性”",
        "lines": [
            ("F", "体检报告上写着幽门螺杆菌阳性，你是不是立刻开始担心：我会不会得胃癌？"),
            ("M", "先别慌。这个细菌在中国确实很常见，大约一半成年人都感染过。"),
            ("F", "可常见，是不是就意味着可以不管它？"),
            ("M", "也不是。它被世界卫生组织列为一类致癌物，但感染不等于一定会得胃癌。"),
            ("F", "所以今天我们就把它说清楚：怎么查，谁要治，怎么治，治完又该怎么复查。"),
        ],
    },
    {
        "id": "what",
        "label": "02 · 认识它",
        "title": "能在胃酸里活下来的细菌",
        "lines": [
            ("F", "先说清楚，幽门螺杆菌到底是一种什么细菌？"),
            ("M", "它是一种螺旋形、微需氧的细菌，专门住在人的胃里，是目前已知少数能在胃酸中长期生存的微生物。"),
            ("F", "胃酸那么强，它是怎么活下来的？"),
            ("M", "它会钻到胃黏膜表面的黏液层下面，分泌尿素酶，把尿素分解成氨，在周围形成一层碱性的保护圈。"),
            ("F", "相当于给自己盖了一间防酸小屋。"),
            ("M", "对。但它的代谢产物会持续刺激胃黏膜，引起慢性炎症，时间长了，就可能出现萎缩、肠化生这些改变。"),
        ],
    },
    {
        "id": "spread",
        "label": "03 · 传播",
        "title": "它是怎么找上门的",
        "lines": [
            ("F", "那它是怎么跑到人胃里的？"),
            ("M", "主要是人与人传播，口口途径和粪口途径都可能。共用餐具、聚餐不用公筷、饭前便后不洗手，都会增加传播机会。"),
            ("F", "所以家里一个人查出来，其他人风险也高？"),
            ("M", "家庭内聚集很明显。一人阳性，建议同住的成年人都做一次呼气试验评估，尤其是伴侣和老人。"),
            ("F", "那接吻会不会传染？"),
            ("M", "有可能，但别把它当成唯一的来源。规律洗手、分餐、用公筷，比过度焦虑更有用。"),
        ],
    },
    {
        "id": "symptoms",
        "label": "04 · 表现",
        "title": "七成人没有感觉",
        "lines": [
            ("F", "感染以后，身体会有什么感觉？"),
            ("M", "麻烦就在这儿：大约七成感染者没有明显症状，所以很多人是体检才发现的。"),
            ("F", "那有症状的人，一般是什么表现？"),
            ("M", "可能会有腹胀、嗳气、上腹隐痛、早饱、反酸，但这些都不特异，不能靠感觉判断。"),
            ("F", "网上说口臭也是它引起的？"),
            ("M", "关系没有传得那么神。口臭的原因很多，牙周问题更常见，别只盯着这个菌。"),
        ],
    },
    {
        "id": "test",
        "label": "05 · 检测",
        "title": "吹口气，就知道",
        "lines": [
            ("F", "那到底该怎么查？体检套餐里的项目五花八门。"),
            ("M", "首选尿素呼气试验，碳十三或者碳十四，吹口气就行，准确率高，还能判断是不是现症感染。"),
            ("F", "做这个检查有什么讲究？"),
            ("M", "很重要：检查前要停质子泵抑制剂，也就是各种拉唑，至少两周；停抗生素和铋剂至少四周，否则容易出现假阴性。"),
            ("F", "还有其他方法吗？"),
            ("M", "胃镜可以取活检，做快速尿素酶试验或者病理检查，顺便看看胃黏膜的情况；粪便抗原检测也可以。"),
            ("F", "那抽血查抗体呢？"),
            ("M", "抗体阳性只能说明曾经接触过，不能证明现在还有菌。别拿着抗体报告直接去买药。"),
        ],
    },
    {
        "id": "who",
        "label": "06 · 决策",
        "title": "哪些人必须治",
        "lines": [
            ("F", "查出来阳性，是不是人人都要根除？"),
            ("M", "不是一刀切，但大多数成年人建议根除。特别是这几类人，优先级更高。"),
            ("F", "具体是哪些人？"),
            ("M", "消化性溃疡，不管有没有症状；胃黏膜相关淋巴组织淋巴瘤；慢性胃炎伴消化不良；有胃癌家族史；长期吃质子泵抑制剂；需要长期吃阿司匹林或者止痛药。"),
            ("F", "孩子和老人也一样吗？"),
            ("M", "儿童要个体化，一般不常规筛查，除非有明确指征；高龄老人要评估获益和风险，听专科医生的。"),
            ("F", "一句话总结：多数该治，但要分人。"),
            ("M", "对，治疗方案也要看过敏史、既往用药和当地耐药情况。"),
        ],
    },
    {
        "id": "treat",
        "label": "07 · 治疗",
        "title": "十四天，铋剂四联",
        "lines": [
            ("F", "确定要治，方案是什么？"),
            ("M", "国内常用铋剂四联，疗程十四天：一种质子泵抑制剂，加铋剂，再加两种抗生素。"),
            ("F", "十四天，一天都不能少吗？"),
            ("M", "尽量按时按量吃完。中途停药，容易失败，还会增加耐药，下次更难治。"),
            ("F", "副作用呢？有人说嘴里发苦、大便发黑。"),
            ("M", "铋剂会让大便变黑，嘴里可能有金属味，恶心、腹泻也常见。多数能耐受，但出现皮疹、严重腹泻要及时联系医生。"),
            ("F", "还有一点，青霉素过敏一定要提前说。"),
            ("M", "对，医生会换用别的抗生素。千万别自己上网买药配药。"),
        ],
    },
    {
        "id": "recheck",
        "label": "08 · 复查",
        "title": "治好没治好，要看这一步",
        "lines": [
            ("F", "吃完药，就算成功了吗？"),
            ("M", "必须复查。治疗结束至少四周，而且停质子泵抑制剂两周以后，再去做呼气试验。"),
            ("F", "为什么要等这么久？"),
            ("M", "太早复查，细菌只是被抑制、还没死绝，结果可能假阴性，让你误以为治好了。"),
            ("F", "如果复查还是阳性呢？"),
            ("M", "说明可能失败或者耐药，需要医生评估，必要时换方案，不要自己重复吃同一套药。"),
        ],
    },
    {
        "id": "prevent",
        "label": "09 · 预防",
        "title": "把传播链切断",
        "lines": [
            ("F", "没感染的人，怎么预防？"),
            ("M", "几件小事：聚餐用公筷，提倡分餐；餐具定期消毒；饭前便后洗手；不喝生水，少吃来源不明的不洁食物。"),
            ("F", "家里有孩子呢？"),
            ("M", "不要口对口喂饭，不要用嘴试奶温，不要把食物嚼碎了喂，这些老习惯真的该改。"),
            ("F", "听起来都是生活里的小事。"),
            ("M", "健康往往就是这些小事堆出来的。"),
        ],
    },
    {
        "id": "outro",
        "label": "10 · 总结",
        "title": "别恐慌，也别忽视",
        "lines": [
            ("F", "最后，用一句话总结今天的重点。"),
            ("M", "幽门螺杆菌很常见，但不是小事：规范检测，该治就治，足疗程，记得复查。"),
            ("F", "也别恐慌，更别自己吓自己。"),
            ("M", "把这条视频转给家里那位体检报告阳性的人，让他带着报告去消化科。"),
            ("F", "科学看待，规范处理。"),
            ("M", "我们下期见。"),
        ],
    },
]


def build_tts(base: str, model_file: str) -> sherpa_onnx.OfflineTts:
    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                model=os.path.join(base, model_file),
                lexicon=os.path.join(base, "lexicon.txt"),
                tokens=os.path.join(base, "tokens.txt"),
            ),
            num_threads=2,
        ),
        rule_fsts=",".join(
            os.path.join(base, f) for f in ("phone.fst", "date.fst", "number.fst")
        ),
        max_num_sentences=1,
    )
    return sherpa_onnx.OfflineTts(cfg)


VOICES = {
    "F": build_tts(os.path.join(CACHE, "tts", "vits-melo-tts-zh_en"), "model.onnx"),
    "M": build_tts(os.path.join(CACHE, "tts", "vits-zh-hf-fanchen-wnj"), "vits-zh-hf-fanchen-wnj.onnx"),
}
SPEED = {"F": 1.02, "M": 1.0}


def synth(speaker: str, text: str, sid: int = 0) -> np.ndarray:
    audio = VOICES[speaker].generate(text, sid=sid, speed=SPEED[speaker])
    x = np.asarray(audio.samples, dtype=np.float32)
    sr = audio.sample_rate
    if sr != SR:
        n = int(round(len(x) * SR / sr))
        x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
    # trim leading/trailing near-silence, keep 60 ms padding
    thresh = 0.008
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx):
        pad = int(0.06 * SR)
        a = max(0, idx[0] - pad)
        b = min(len(x), idx[-1] + pad)
        x = x[a:b]
    peak = float(np.max(np.abs(x))) or 1.0
    if peak > 0.98:
        x = x / peak * 0.98
    return x.astype(np.float32)


def write_wav(path: str, samples: np.ndarray) -> float:
    pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(pcm.tobytes())
    return len(samples) / SR


def main() -> None:
    timeline = {"fps": FPS, "sampleRate": SR, "scenes": []}
    cursor = LEAD_IN
    total_chars = 0
    for scene in SCENES:
        s = dict(scene)
        s["start"] = round(cursor - 0.55, 3)
        s["lines"] = []
        for i, (speaker, text) in enumerate(scene["lines"]):
            total_chars += len(text)
            x = synth(speaker, text)
            fname = f"line_{scene['id']}_{i + 1:02d}.wav"
            dur = write_wav(os.path.join(AUDIO_DIR, fname), x)
            start = cursor
            s["lines"].append(
                {
                    "speaker": speaker,
                    "text": text,
                    "start": round(start, 3),
                    "end": round(start + dur, 3),
                    "audio": f"audio/{fname}",
                }
            )
            cursor += dur + (LINE_GAP if i < len(scene["lines"]) - 1 else 0)
        cursor += SCENE_GAP
        s["end"] = round(cursor - SCENE_GAP + 0.55, 3)
        timeline["scenes"].append(s)

    total_dur = cursor - SCENE_GAP + TAIL
    timeline["durationInSeconds"] = round(total_dur, 3)
    timeline["totalFrames"] = int(round(total_dur * FPS))
    timeline["voiceover"] = "audio/voiceover.wav"
    timeline["wordCount"] = total_chars

    # concatenate
    buf = np.zeros(int(round(total_dur * SR)), dtype=np.float32)
    for scene in timeline["scenes"]:
        for line in scene["lines"]:
            with wave.open(os.path.join(PUB, line["audio"]), "rb") as f:
                seg = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(np.float32) / 32768
            a = int(round(line["start"] * SR))
            buf[a : a + len(seg)] += seg
    write_wav(os.path.join(PUB, "audio", "voiceover_raw.wav"), buf)

    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error",
            "-i", os.path.join(PUB, "audio", "voiceover_raw.wav"),
            "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-ar", str(SR), "-ac", "1",
            os.path.join(PUB, "audio", "voiceover.wav"),
        ],
        check=True,
    )
    os.remove(os.path.join(PUB, "audio", "voiceover_raw.wav"))

    with open(os.path.join(ROOT, "src", "data", "timeline.json"), "w", encoding="utf-8") as f:
        json.dump(timeline, f, ensure_ascii=False, indent=2)

    # subtitles
    def ts(t: float) -> str:
        h, m, s = int(t // 3600), int(t % 3600 // 60), t % 60
        return f"{h:02d}:{m:02d}:{s:06.3f}".replace(".", ",")

    with open(os.path.join(ROOT, "out", "subtitles.srt"), "w", encoding="utf-8") as f:
        n = 0
        for scene in timeline["scenes"]:
            for line in scene["lines"]:
                n += 1
                name = "小林" if line["speaker"] == "F" else "阿哲"
                f.write(f"{n}\n{ts(line['start'])} --> {ts(line['end'])}\n{name}：{line['text']}\n\n")

    print(json.dumps({
        "duration_sec": timeline["durationInSeconds"],
        "frames": timeline["totalFrames"],
        "chars": total_chars,
        "scenes": len(timeline["scenes"]),
        "lines": sum(len(s["lines"]) for s in timeline["scenes"]),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
