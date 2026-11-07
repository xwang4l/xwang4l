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
  const at = (i: number) => Math.max(0, (scene.lines[i]?.start ?? scene.start) - scene.start) * fps;
  return { frame, fps, now, active, at };
};

/* ---------------------------------------------------------------- 01 hook */

export const HookScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const a = reveal(frame, fps, 2);
  const b = reveal(frame, fps, at(1));
  const c = pop(frame, fps, at(3));

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", gap: 70, flex: 1 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ ...enterStyle(a, 20), fontSize: 30, color: T.muted, letterSpacing: 3 }}>
            体检查出
          </div>
          <div
            style={{
              ...enterStyle(a, 24),
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 1.12,
              marginTop: 18,
              letterSpacing: 1,
            }}
          >
            <span style={{ color: T.text }}>幽门螺杆菌</span>
            <span style={{ color: T.red }}>阳性</span>
          </div>
          <div
            style={{
              ...enterStyle(b, 18),
              fontSize: 66,
              fontWeight: 900,
              color: T.amber,
              marginTop: 8,
              letterSpacing: 2,
            }}
          >
            要不要治？
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 40,
              opacity: Math.min(1, reveal(frame, fps, at(1) + 30) * 1.4),
            }}
          >
            <Chip color={T.teal} bg={T.tealDim}>约一半成年人感染过</Chip>
            <Chip color={T.amber} bg={T.amberDim}>WHO I 类致癌物</Chip>
          </div>
        </div>

        <div
          style={{
            width: 620,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 600,
              padding: "34px 38px 40px",
              borderRadius: 20,
              background: "linear-gradient(165deg, #F7F4EC, #EAE4D6)",
              boxShadow: "0 30px 70px rgba(0,0,0,0.42)",
              transform: `rotate(${3 + Math.sin(frame / 60) * 0.4}deg) scale(${0.94 + a * 0.06})`,
              opacity: a,
              color: "#243038",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                borderBottom: "2px solid #B9B2A2",
                paddingBottom: 14,
              }}
            >
              <div>
                <div style={{ fontSize: 27, fontWeight: 900, letterSpacing: 2 }}>检验报告单</div>
                <div style={{ fontSize: 14, color: "#7A7364", letterSpacing: 1 }}>消化内科 · 门诊</div>
              </div>
              <div style={{ fontSize: 14, color: "#7A7364" }}>NO. 20261107</div>
            </div>
            {[
              ["姓名", "王女士"],
              ["年龄", "38 岁"],
              ["样本", "血清"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 20,
                  padding: "13px 0",
                  borderBottom: "1px dashed #C9C2B2",
                  color: "#4A545C",
                }}
              >
                <span>{k}</span>
                <span style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
            <div
              style={{
                marginTop: 18,
                padding: "16px 18px",
                borderRadius: 10,
                background: "rgba(255, 107, 107, 0.10)",
                border: "1px solid rgba(214, 91, 87, 0.35)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 19, color: "#5A6268" }}>幽门螺杆菌抗体</div>
                <div style={{ fontSize: 13, color: "#8A8274", marginTop: 4 }}>参考范围：阴性</div>
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#D2574F" }}>阳性 ＋</div>
            </div>
            <div
              style={{
                position: "absolute",
                right: 26,
                bottom: 20,
                padding: "6px 16px",
                border: "3px solid #D2574F",
                color: "#D2574F",
                fontWeight: 900,
                fontSize: 26,
                letterSpacing: 4,
                borderRadius: 6,
                transform: `rotate(-11deg) scale(${0.8 + c * 0.2})`,
                opacity: c,
              }}
            >
              建议复查
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

/* ---------------------------------------------------------------- 02 what */

const StomachArt: React.FC<{ frame: number; fps: number; at: (i: number) => number }> = ({
  frame,
  fps,
  at,
}) => {
  const pulse = 0.5 + Math.sin(frame / 14) * 0.5;
  const label2 = reveal(frame, fps, at(3));
  const label3 = reveal(frame, fps, at(4));

  return (
    <div style={{ position: "relative", width: 760, height: 540 }}>
      <svg width="760" height="540" viewBox="0 0 600 540">
        <defs>
          <linearGradient id="stomachFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#164C50" />
            <stop offset="100%" stopColor="#0C3038" />
          </linearGradient>
          <linearGradient id="mucusFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(47,211,181,0.42)" />
            <stop offset="100%" stopColor="rgba(47,211,181,0.05)" />
          </linearGradient>
        </defs>

        <path
          d="M300 24V92"
          stroke="#2F7E86"
          strokeWidth="30"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M310 82C310 128 258 126 228 152C192 184 182 238 205 278C229 319 278 338 326 330C380 321 426 288 438 244C449 204 425 174 392 172C362 170 342 191 347 217C351 239 377 248 390 233"
          fill="url(#stomachFill)"
          stroke="#2FD3B5"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M310 104C310 140 268 142 244 164C216 190 208 234 226 266C245 300 284 314 322 307C366 299 402 272 412 238C420 210 404 190 382 189C366 188 356 201 359 214"
          fill="none"
          stroke="rgba(47,211,181,0.55)"
          strokeWidth="3"
          strokeDasharray="10 9"
        />

        {[
          [262, 214],
          [286, 246],
          [252, 268],
          [318, 286],
          [352, 262],
          [300, 208],
          [336, 300],
          [370, 240],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3 + (i % 3)}
            fill="#FFC857"
            opacity={0.35 + pulse * 0.45}
          />
        ))}

        {[
          [250, 292, -18],
          [282, 306, 12],
          [318, 311, -8],
          [352, 300, 20],
          [378, 280, -14],
        ].map(([x, y, rot], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <rect x="-9" y="-4" width="18" height="8" rx="4" fill="#FF8A65" />
            <path d="M-9 0h-4M9 0h4" stroke="#FF8A65" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        ))}

        <g opacity={0.9}>
          <circle cx="486" cy="392" r="74" fill="#08222A" stroke="#2FD3B5" strokeWidth="2.5" />
          <circle cx="486" cy="392" r="66" fill="rgba(47,211,181,0.08)" />
          {[
            [466, 376, -20],
            [496, 392, 15],
            [474, 410, -5],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              <rect x="-11" y="-5" width="22" height="10" rx="5" fill="#FF8A65" />
            </g>
          ))}
          <path
            d="M452 436h68"
            stroke="#2FD3B5"
            strokeWidth="2"
            strokeDasharray="4 5"
            opacity="0.7"
          />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 26,
          top: 96,
          padding: "10px 16px",
          borderRadius: 10,
          fontSize: 20,
          color: T.amber,
          background: "rgba(255,200,87,0.10)",
          border: `1px solid ${T.amber}44`,
          opacity: label2,
        }}
      >
        胃酸 pH 1–2
      </div>
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 350,
          padding: "12px 16px",
          borderRadius: 10,
          fontSize: 20,
          color: T.teal,
          background: "rgba(47,211,181,0.09)",
          border: `1px solid ${T.teal}44`,
          opacity: label2,
          lineHeight: 1.5,
        }}
      >
        黏液层
        <div style={{ fontSize: 16, color: T.muted }}>细菌的藏身之处</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 396,
          top: 262,
          padding: "12px 16px",
          borderRadius: 10,
          fontSize: 20,
          color: T.text,
          background: "rgba(8,34,42,0.92)",
          border: `1px solid ${T.border}`,
          opacity: label3,
          lineHeight: 1.5,
        }}
      >
        尿素酶 → 氨
        <div style={{ fontSize: 16, color: T.muted }}>造出碱性防酸圈</div>
      </div>
    </div>
  );
};

export const WhatScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const items = [
    { n: "01", t: "螺旋形 · 微需氧", d: "少数能在强酸胃内长期定植的细菌" },
    { n: "02", t: "尿素酶造“防酸圈”", d: "钻进黏液层下，把尿素分解成氨" },
    { n: "03", t: "持续刺激胃黏膜", d: "慢性炎症 → 萎缩、肠化生（部分人）" },
  ];
  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", gap: 40, flex: 1, alignItems: "center" }}>
        <StomachArt frame={frame} fps={fps} at={at} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((it, i) => {
            const p = reveal(frame, fps, at(1) + i * 6);
            return (
              <Panel
                key={it.n}
                style={{ ...enterStyle(p, 22), padding: "22px 26px", display: "flex", gap: 20, alignItems: "center" }}
              >
                <div style={{ fontSize: 22, fontWeight: 900, color: T.teal, opacity: 0.8 }}>{it.n}</div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: T.text }}>{it.t}</div>
                  <div style={{ fontSize: 20, color: T.muted, marginTop: 6 }}>{it.d}</div>
                </div>
              </Panel>
            );
          })}
          <div
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 42), 14),
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              borderRadius: 12,
              background: T.amberDim,
              border: `1px solid ${T.amber}44`,
              color: T.amber,
              fontSize: 20,
            }}
          >
            <Icon name="alert" size={26} color={T.amber} />
            WHO 列为 I 类致癌物 · 但感染 ≠ 一定患癌
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

/* -------------------------------------------------------------- 03 spread */

export const SpreadScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const routes = [
    {
      icon: "chopsticks" as const,
      title: "口 — 口",
      lines: ["共用餐具、水杯", "聚餐不用公筷", "接吻也可能传播"],
      color: T.teal,
    },
    {
      icon: "wash" as const,
      title: "粪 — 口",
      lines: ["饭前便后不洗手", "不洁饮水与食物", "卫生条件差的环境"],
      color: T.male,
    },
    {
      icon: "family" as const,
      title: "家庭聚集",
      lines: ["一人阳性，同住者风险更高", "伴侣、老人尤其注意", "建议做呼气试验评估"],
      color: T.female,
    },
  ];

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", gap: 26, flex: 1 }}>
          {routes.map((r, i) => {
            const p = reveal(frame, fps, at(1) + i * 8);
            return (
              <Panel
                key={r.title}
                accent={r.color}
                style={{
                  ...enterStyle(p, 28),
                  flex: 1,
                  padding: "30px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: -30,
                    top: -30,
                    width: 170,
                    height: 170,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${r.color}22, transparent 70%)`,
                  }}
                />
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${r.color}16`,
                    border: `1px solid ${r.color}44`,
                  }}
                >
                  <Icon name={r.icon} size={44} color={r.color} />
                </div>
                <div style={{ fontSize: 40, fontWeight: 900, color: r.color, marginTop: 22, letterSpacing: 2 }}>
                  {r.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
                  {r.lines.map((l) => (
                    <div key={l} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 22, color: T.text, lineHeight: 1.45 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: r.color, marginTop: 12 }} />
                      {l}
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}
        </div>
        <div
          style={{
            ...enterStyle(reveal(frame, fps, at(5)), 16),
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 24px",
            borderRadius: 14,
            background: "rgba(8, 32, 38, 0.8)",
            border: `1px solid ${T.border}`,
            fontSize: 22,
            color: T.muted,
          }}
        >
          <Icon name="shield" size={28} color={T.teal} />
          分餐、公筷、洗手，比过度焦虑更有用；“接吻”不是唯一来源。
        </div>
      </div>
    </SceneShell>
  );
};

/* ------------------------------------------------------------ 04 symptoms */

export const SymptomsScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const p = reveal(frame, fps, at(1));
  const pct = interpolate(p, [0, 1], [0, 0.7]);
  const chips = ["腹胀", "嗳气", "上腹隐痛", "早饱", "反酸"];
  const R = 128;
  const C = 2 * Math.PI * R;

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", gap: 60, flex: 1, alignItems: "center" }}>
        <div style={{ width: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: 340, height: 340 }}>
            <svg width="340" height="340" viewBox="0 0 340 340">
              <circle cx="170" cy="170" r={R} fill="none" stroke="rgba(147,180,178,0.14)" strokeWidth="30" />
              <circle
                cx="170"
                cy="170"
                r={R}
                fill="none"
                stroke={T.amber}
                strokeWidth="30"
                strokeLinecap="round"
                strokeDasharray={`${C * pct} ${C}`}
                transform="rotate(-90 170 170)"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 76, fontWeight: 900, color: T.text, lineHeight: 1 }}>
                70<span style={{ fontSize: 40, color: T.amber }}>%</span>
              </div>
              <div style={{ fontSize: 22, color: T.muted, marginTop: 8 }}>没有明显症状</div>
            </div>
          </div>
          <div style={{ fontSize: 20, color: T.dim, marginTop: 10 }}>多数人靠体检才发现</div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
            {chips.map((c, i) => {
              const cp = reveal(frame, fps, at(1) + 12 + i * 5);
              return (
                <Chip
                  key={c}
                  color={T.text}
                  style={{
                    ...enterStyle(cp, 16),
                    fontSize: 30,
                    padding: "16px 28px",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  {c}
                </Chip>
              );
            })}
          </div>
          <div
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 38), 18),
              marginTop: 30,
              fontSize: 22,
              color: T.muted,
              lineHeight: 1.7,
              borderLeft: `3px solid ${T.dim}`,
              paddingLeft: 18,
            }}
          >
            这些表现都不特异，不能靠“感觉”判断是否感染。
          </div>
          <Panel
            style={{
              ...enterStyle(reveal(frame, fps, at(1) + 46), 18),
              marginTop: 26,
              padding: "20px 24px",
              borderColor: `${T.amber}55`,
              background: T.amberDim,
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <Icon name="ban" size={34} color={T.amber} />
            <div style={{ fontSize: 22, color: T.text, lineHeight: 1.55 }}>
              <b style={{ color: T.amber }}>口臭 ≠ 一定是它。</b>
              牙周问题更常见，别只盯着这个菌。
            </div>
          </Panel>
        </div>
      </div>
    </SceneShell>
  );
};

/* ---------------------------------------------------------------- 05 test */

export const TestScene: React.FC<SceneProps> = ({ scene, durationInFrames }) => {
  const { frame, fps, at } = useTiming(scene);
  const cards = [
    {
      icon: "flask" as const,
      title: "尿素呼气试验",
      tag: "首选",
      color: T.teal,
      lines: ["碳 13 / 碳 14", "吹口气 · 无创", "判断现症感染"],
    },
    {
      icon: "scope" as const,
      title: "胃镜 + 活检",
      tag: "看黏膜",
      color: T.male,
      lines: ["快速尿素酶试验", "病理检查", "顺带评估胃黏膜"],
    },
    {
      icon: "tube" as const,
      title: "粪便抗原",
      tag: "备选",
      color: T.female,
      lines: ["无创", "适合部分人群", "也可用于复查"],
    },
  ];

  return (
    <SceneShell scene={scene} durationInFrames={durationInFrames}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
        <div style={{ display: "flex", gap: 22, flex: 1 }}>
          {cards.map((c, i) => {
            const cp = reveal(frame, fps, at(1) + i * 6);
            return (
              <Panel
                key={c.title}
                accent={c.color}
                style={{
                  ...enterStyle(cp, 24),
                  flex: 1,
                  padding: "24px 26px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 16,
                      background: `${c.color}16`,
                      border: `1px solid ${c.color}3D`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={c.icon} size={36} color={c.color} />
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      color: c.color,
                      border: `1px solid ${c.color}55`,
                      padding: "5px 12px",
                      borderRadius: 999,
                      background: `${c.color}12`,
                    }}
                  >
                    {c.tag}
                  </div>
                </div>
                <div style={{ fontSize: 31, fontWeight: 800, color: T.text, marginTop: 16 }}>{c.title}</div>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
                  {c.lines.map((l) => (
                    <div key={l} style={{ fontSize: 19, color: T.muted }}>
                      · {l}
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}
        </div>

        <div
          style={{
            ...enterStyle(reveal(frame, fps, at(3)), 16),
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 22px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.035)",
            border: `1px dashed rgba(147,180,178,0.28)`,
            color: T.muted,
            fontSize: 21,
          }}
        >
          <Icon name="ban" size={26} color={T.dim} />
          抽血查抗体：只代表曾经接触过，
          <span style={{ color: T.text, fontWeight: 700 }}>不能判断现在是否感染</span>。
        </div>

        <div
          style={{
            ...enterStyle(reveal(frame, fps, at(4)), 16),
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "18px 24px",
            borderRadius: 14,
            background: T.amberDim,
            border: `1px solid ${T.amber}55`,
          }}
        >
          <Icon name="alert" size={32} color={T.amber} />
          <div style={{ fontSize: 23, color: T.text }}>
            <b style={{ color: T.amber }}>查前停药：</b>
            PPI（拉唑类）≥ 2 周　·　抗生素 / 铋剂 ≥ 4 周
          </div>
          <div style={{ marginLeft: "auto", fontSize: 20, color: T.amber }}>否则容易假阴性</div>
        </div>
      </div>
    </SceneShell>
  );
};
