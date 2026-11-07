import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell, Panel, Chip, Icon } from "../components/ui";
import { reveal, pop, enterStyle } from "../lib/anim";
import { T } from "../theme";
import type { Scene } from "../types";

export type SceneProps = { scene: Scene; durationInFrames: number };

const useTiming = (scene: Scene) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = scene.start + frame / fps;
  const active = scene.lines.filter((l) => l.start <= now + 0.02).length - 1;
  const at = (i: number) =>
    Math.max(0, (scene.lines[i]?.start ?? scene.start) - scene.start) * fps;
  return { frame, fps, now, active, at };
};

/* ----------------------------------------------------------------- 06 who */

export const WhoScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const items = [
    "消化性溃疡（不论有无症状）",
    "胃 MALT 淋巴瘤",
    "慢性胃炎伴消化不良",
    "胃癌家族史",
    "长期服用质子泵抑制剂",
    "长期阿司匹林 / 止痛药",
  ];

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", gap: 32, flex: 1 }}>
        <Panel
          style={{
            flex: 1.55,
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            ...enterStyle(reveal(frame, fps, at(1)), 20),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Icon name="check" size={30} color={T.teal} />
            <div style={{ fontSize: 27, fontWeight: 800, color: T.text }}>
              建议根除 <span style={{ color: T.muted, fontSize: 20, fontWeight: 400 }}>（大多数成年人）</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(3, 1fr)", gap: "14px 22px", flex: 1 }}>
            {items.map((it, i) => {
              const ip = reveal(frame, fps, at(3) + i * 5);
              return (
                <div
                  key={it}
                  style={{
                    ...enterStyle(ip, 14),
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "rgba(47,211,181,0.055)",
                    border: `1px solid rgba(47,211,181,0.16)`,
                    fontSize: 21,
                    color: T.text,
                    lineHeight: 1.45,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      background: T.teal,
                      color: "#05201F",
                      fontSize: 15,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    ✓
                  </div>
                  {it}
                </div>
              );
            })}
          </div>
          <div
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 28), 14),
              marginTop: 20,
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontSize: 20,
              color: T.muted,
            }}
          >
            <Icon name="alert" size={24} color={T.dim} />
            方案还要结合过敏史、既往用药和当地耐药情况。
          </div>
        </Panel>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          <Panel
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 12), 20),
              padding: "24px 26px",
              borderColor: `${T.male}44`,
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Icon name="baby" size={36} color={T.male} />
              <div style={{ fontSize: 26, fontWeight: 800, color: T.male }}>儿童</div>
            </div>
            <div style={{ fontSize: 20, color: T.text, lineHeight: 1.65, marginTop: 10 }}>
              个体化决策，<b>一般不常规筛查</b>；除非有明确指征，听儿科 / 消化科医生。
            </div>
          </Panel>
          <Panel
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 20), 20),
              padding: "24px 26px",
              borderColor: `${T.female}44`,
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Icon name="shield" size={36} color={T.female} />
              <div style={{ fontSize: 26, fontWeight: 800, color: T.female }}>高龄老人</div>
            </div>
            <div style={{ fontSize: 20, color: T.text, lineHeight: 1.65, marginTop: 10 }}>
              评估<b>获益与风险</b>，结合基础病和用药，不搞“一刀切”。
            </div>
          </Panel>
          <Panel
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 30), 20),
              flex: 1,
              padding: "24px 26px",
              background: T.tealDim,
              borderColor: `${T.teal}55`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 900, color: T.teal, lineHeight: 1.3 }}>
              多数该治，
              <br />
              但要分人。
            </div>
          </Panel>
        </div>
      </div>
    </SceneShell>
  );
};

/* --------------------------------------------------------------- 07 treat */

export const TreatScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const drugs = [
    { name: "PPI", sub: "质子泵抑制剂", note: "各种“拉唑”", color: T.teal },
    { name: "铋剂", sub: "保护胃黏膜", note: "大便可能变黑", color: T.amber },
    { name: "抗生素 A", sub: "医生处方", note: "注意过敏史", color: T.male },
    { name: "抗生素 B", sub: "医生处方", note: "足量足疗程", color: T.female },
  ];

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div
            style={{
              ...enterStyle(reveal(frame, fps, at(1)), 18),
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              padding: "10px 30px",
              borderRadius: 18,
              background: T.tealDim,
              border: `1px solid ${T.teal}55`,
            }}
          >
            <div style={{ fontSize: 84, fontWeight: 900, color: T.teal, lineHeight: 1 }}>14</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: T.text }}>天</div>
          </div>
          <div style={{ ...enterStyle(reveal(frame, fps, at(1) + 8), 18) }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: T.text }}>铋剂四联方案</div>
            <div style={{ fontSize: 19, color: T.muted, marginTop: 4 }}>国内常用 · 需医生处方 · 不要自行配药</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          {drugs.map((d, i) => {
            const dp = reveal(frame, fps, at(1) + 10 + i * 6);
            return (
              <React.Fragment key={d.name}>
                {i > 0 && (
                  <div
                    style={{
                      fontSize: 34,
                      color: T.dim,
                      opacity: clamp(reveal(frame, fps, at(1) + 6 + i * 6)),
                      fontWeight: 300,
                    }}
                  >
                    +
                  </div>
                )}
                <Panel
                  accent={d.color}
                  style={{
                    ...enterStyle(dp, 22),
                    flex: 1,
                    padding: "20px 22px",
                    minHeight: 190,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 13,
                      background: `${d.color}18`,
                      border: `1px solid ${d.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={i === 1 ? "pill" : "capsule"} size={28} color={d.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: d.color }}>{d.name}</div>
                    <div style={{ fontSize: 19, color: T.text, marginTop: 4 }}>{d.sub}</div>
                    <div style={{ fontSize: 16, color: T.muted, marginTop: 6 }}>{d.note}</div>
                  </div>
                </Panel>
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 26), 16),
              flex: 1,
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "16px 20px",
              borderRadius: 13,
              background: T.amberDim,
              border: `1px solid ${T.amber}44`,
              fontSize: 21,
              color: T.text,
            }}
          >
            <Icon name="alert" size={28} color={T.amber} />
            中途停药 → 容易失败、增加耐药，下次更难治
          </div>
          <div
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 34), 16),
              flex: 1,
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "16px 20px",
              borderRadius: 13,
              background: T.redDim,
              border: `1px solid ${T.red}44`,
              fontSize: 21,
              color: T.text,
            }}
          >
            <Icon name="alert" size={28} color={T.red} />
            青霉素过敏，务必提前告诉医生
          </div>
        </div>

        <div
          style={{
            ...enterStyle(reveal(frame, fps, at(1) + 42), 14),
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 19,
            color: T.muted,
          }}
        >
          常见反应：
          {["大便变黑", "口苦 / 金属味", "恶心", "腹泻"].map((s) => (
            <Chip key={s} color={T.muted} style={{ fontSize: 18, padding: "7px 14px" }}>
              {s}
            </Chip>
          ))}
          <span style={{ marginLeft: "auto", color: T.red }}>皮疹 / 严重腹泻 → 及时联系医生</span>
        </div>
      </div>
    </SceneShell>
  );
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/* ------------------------------------------------------------- 08 recheck */

export const RecheckScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const steps = [
    { icon: "capsule" as const, title: "服药 14 天", sub: "铋剂四联，按时按量", color: T.teal },
    { icon: "clock" as const, title: "停药 4 周", sub: "PPI 需停 2 周", color: T.amber },
    { icon: "flask" as const, title: "呼气试验复查", sub: "确认是否根除成功", color: T.male },
  ];
  const lineP = reveal(frame, fps, at(1), 90, 20);

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "0 40px" }}>
          <div
            style={{
              position: "absolute",
              left: 110,
              right: 110,
              top: 66,
              height: 3,
              background: "rgba(147,180,178,0.18)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 66,
              height: 3,
              width: `${lineP * 84}%`,
              background: `linear-gradient(90deg, ${T.teal}, ${T.amber}, ${T.male})`,
              borderRadius: 2,
            }}
          />
          {steps.map((s, i) => {
            const sp = reveal(frame, fps, at(1) + i * 18);
            return (
              <div
                key={s.title}
                style={{
                  ...enterStyle(sp, 26),
                  width: 420,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: 132,
                    height: 132,
                    borderRadius: "50%",
                    background: "#08242B",
                    border: `2px solid ${s.color}`,
                    boxShadow: `0 0 40px ${s.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={s.icon} size={56} color={s.color} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: T.text, marginTop: 20 }}>{s.title}</div>
                <div style={{ fontSize: 20, color: T.muted, marginTop: 8 }}>{s.sub}</div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 17,
                    color: s.color,
                    border: `1px solid ${s.color}44`,
                    background: `${s.color}12`,
                    padding: "4px 12px",
                    borderRadius: 999,
                  }}
                >
                  STEP {i + 1}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 18, marginTop: 46 }}>
          <Panel
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 40), 18),
              flex: 1,
              padding: "20px 24px",
              background: T.redDim,
              borderColor: `${T.red}44`,
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <Icon name="alert" size={32} color={T.red} />
            <div>
              <div style={{ fontSize: 23, fontWeight: 800, color: T.red }}>查太早 = 假阴性</div>
              <div style={{ fontSize: 19, color: T.text, marginTop: 4 }}>细菌被抑制却没死绝，会让你误以为治好了。</div>
            </div>
          </Panel>
          <Panel
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 48), 18),
              flex: 1,
              padding: "20px 24px",
              borderColor: `${T.amber}44`,
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <Icon name="scope" size={32} color={T.amber} />
            <div>
              <div style={{ fontSize: 23, fontWeight: 800, color: T.amber }}>复查仍阳性</div>
              <div style={{ fontSize: 19, color: T.text, marginTop: 4 }}>找医生评估，别自己重复吃同一套药。</div>
            </div>
          </Panel>
        </div>
      </div>
    </SceneShell>
  );
};

/* ------------------------------------------------------------- 09 prevent */

export const PreventScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const tiles = [
    { icon: "chopsticks" as const, title: "公筷 · 分餐", sub: "聚餐时最容易被忽略" },
    { icon: "flask" as const, title: "餐具定期消毒", sub: "高温或消毒柜" },
    { icon: "wash" as const, title: "饭前便后洗手", sub: "流水 + 皂液，别糊弄" },
    { icon: "water" as const, title: "不喝生水", sub: "少吃来源不明的不洁食物" },
    { icon: "baby" as const, title: "不口对口喂饭", sub: "不用嘴试奶温" },
    { icon: "ban" as const, title: "不嚼食喂孩子", sub: "老习惯，真的该改" },
  ];

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            flex: 1,
          }}
        >
          {tiles.map((t, i) => {
            const tp = reveal(frame, fps, at(1) + i * 5);
            return (
              <Panel
                key={t.title}
                style={{
                  ...enterStyle(tp, 22),
                  padding: "24px 26px",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 18,
                    background: T.tealDim,
                    border: `1px solid ${T.teal}3D`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={t.icon} size={38} color={T.teal} />
                </div>
                <div>
                  <div style={{ fontSize: 27, fontWeight: 800, color: T.text }}>{t.title}</div>
                  <div style={{ fontSize: 18, color: T.muted, marginTop: 5 }}>{t.sub}</div>
                </div>
              </Panel>
            );
          })}
        </div>
        <div
          style={{
            ...enterStyle(reveal(frame, fps, at(1) + 47), 14),
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 24px",
            borderRadius: 14,
            background: "rgba(8,32,38,0.75)",
            border: `1px solid ${T.border}`,
            fontSize: 21,
            color: T.muted,
          }}
        >
          <Icon name="shield" size={28} color={T.teal} />
          家庭内传播常见：一人阳性，建议同住成年人做一次呼气试验评估。
        </div>
      </div>
    </SceneShell>
  );
};

/* --------------------------------------------------------------- 10 outro */

export const OutroScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const keys = ["规范检测", "该治就治", "足疗程", "记得复查"];

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            ...enterStyle(reveal(frame, fps, at(1)), 20),
            fontSize: 44,
            fontWeight: 900,
            color: T.text,
            letterSpacing: 1,
          }}
        >
          记住这 <span style={{ color: T.teal }}>4</span> 件事
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {keys.map((k, i) => {
            const kp = pop(frame, fps, at(1) + 12 + i * 10);
            return (
              <div
                key={k}
                style={{
                  transform: `scale(${0.86 + kp * 0.14})`,
                  opacity: kp,
                  padding: "24px 34px",
                  borderRadius: 18,
                  background:
                    i % 2 === 0
                      ? "linear-gradient(160deg, rgba(47,211,181,0.20), rgba(47,211,181,0.06))"
                      : "linear-gradient(160deg, rgba(94,200,255,0.18), rgba(94,200,255,0.05))",
                  border: `1px solid ${i % 2 === 0 ? T.teal : T.male}55`,
                  fontSize: 34,
                  fontWeight: 800,
                  color: T.text,
                }}
              >
                {k}
              </div>
            );
          })}
        </div>
        <div
          style={{
            ...enterStyle(reveal(frame, fps, at(2)), 16),
            fontSize: 27,
            color: T.muted,
            letterSpacing: 2,
          }}
        >
          别恐慌，也别忽视。
        </div>
        <div
          style={{
            ...enterStyle(reveal(frame, fps, at(1) + 70), 16),
            marginTop: 30,
            width: 1180,
            padding: "18px 26px",
            borderRadius: 14,
            border: `1px solid rgba(147,180,178,0.22)`,
            background: "rgba(6,26,31,0.7)",
            fontSize: 18,
            color: T.muted,
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          本视频为医学科普，不能替代面诊；检测与用药请遵医嘱。
          <div style={{ fontSize: 15, color: T.dim, marginTop: 4 }}>
            参考：第六次全国幽门螺杆菌感染处理共识（2022）
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
