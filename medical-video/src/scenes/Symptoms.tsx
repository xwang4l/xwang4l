import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, glass} from '../theme';
import {beat} from '../timeline';
import {Beat} from '../components/Beat';
import {Chip, Kicker, SectionTitle} from '../components/Text';
import {Icon} from '../components/Icons';
import {Counter} from '../components/Charts';
import {GlowOrb} from '../components/Atmosphere';

const STAGES = [
  {n: '01', t: '早期', s: '慢性咳嗽、咳痰', c: C.cyan},
  {n: '02', t: '进展', s: '活动后气短', c: C.amber},
  {n: '03', t: '晚期', s: '静息也喘、发绀', c: C.pink},
];

export const SymptomsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const s1 = beat('symptoms', 's1');
  const s2 = beat('symptoms', 's2');
  const s3 = beat('symptoms', 's3');
  const s4 = beat('symptoms', 's4');
  const s5 = beat('symptoms', 's5');
  const s6 = beat('symptoms', 's6');
  const s7 = beat('symptoms', 's7');
  const s8 = beat('symptoms', 's8');
  const s9 = beat('symptoms', 's9');

  const stage = frame < s2 ? -1 : frame < s4 ? 0 : frame < s6 ? 1 : 2;
  const severity = interpolate(frame, [s2, s4, s6, s7], [18, 52, 86, 96], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <SectionTitle index="03" title="身体发出的三个信号" en="THREE STAGES OF DYSPNEA" delay={6} color={C.amber} />
      <GlowOrb x={1500} y={520} size={620} color={stage === 2 ? C.pink : C.amber} opacity={0.24} />

      {/* stage rail */}
      <div
        style={{
          position: 'absolute',
          left: 250,
          right: 250,
          top: 280,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{position: 'absolute', left: 0, right: 0, height: 2, background: 'rgba(120,180,220,0.18)'}} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            height: 2,
            width: `${((stage + 1) / 3) * 100}%`,
            background: `linear-gradient(90deg, ${C.cyan}, ${C.amber}, ${C.pink})`,
            boxShadow: `0 0 18px ${C.amber}88`,
            transition: 'none',
          }}
        />
        {STAGES.map((st, i) => {
          const active = i === stage;
          const passed = i < stage;
          return (
            <div
              key={st.n}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: i === 0 ? 'flex-start' : i === 2 ? 'flex-end' : 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: active ? 26 : 16,
                  height: active ? 26 : 16,
                  borderRadius: 20,
                  background: active || passed ? st.c : 'rgba(120,180,220,0.25)',
                  boxShadow: active ? `0 0 30px ${st.c}` : 'none',
                  border: '2px solid rgba(3,7,15,0.8)',
                }}
              />
              <div
                style={{
                  marginTop: 14,
                  fontFamily: FONT,
                  fontSize: 20,
                  letterSpacing: 3,
                  color: active ? st.c : C.dim,
                  fontWeight: active ? 800 : 500,
                }}
              >
                {st.n} · {st.t}
              </div>
            </div>
          );
        })}
      </div>

      {/* intro */}
      <Beat start={s1} end={s2}>
        <div style={{position: 'absolute', left: 150, top: 470, width: 1000}}>
          <Kicker color={C.amber}>但它不会突然出现</Kicker>
          <div style={{marginTop: 24, fontFamily: FONT, fontSize: 92, fontWeight: 900, color: C.white, lineHeight: 1.2}}>
            那身体，
            <br />
            会怎么<span style={{color: C.amber}}>提醒你</span>？
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 260,
            top: 470,
            fontFamily: FONT,
            fontSize: 190,
            fontWeight: 900,
            color: 'transparent',
            WebkitTextStroke: `2px ${C.amber}66`,
            opacity: 0.9,
          }}
        >
          ?
        </div>
      </Beat>

      {/* stage 1 */}
      <Beat start={s2} end={s4}>
        <div style={{position: 'absolute', left: 150, top: 420, width: 760}}>
          <div style={{fontFamily: FONT, fontSize: 130, fontWeight: 900, color: C.cyan, lineHeight: 0.9, opacity: 0.9}}>
            01
          </div>
          <div style={{marginTop: 18, fontFamily: FONT, fontSize: 74, fontWeight: 900, color: C.white}}>
            慢性咳嗽、咳痰
          </div>
          <div style={{marginTop: 22, fontFamily: FONT, fontSize: 28, color: C.text, lineHeight: 1.8}}>
            尤其早晨起床，总想清嗓子。
            <br />
            很多人以为“抽烟的人咳嗽很正常”——
            <br />
            于是错过了最好的<span style={{color: C.cyan, fontWeight: 800}}>干预窗口</span>。
          </div>
        </div>
        <div style={{position: 'absolute', right: 180, top: 430}}>
          <CoughGraphic />
        </div>
      </Beat>

      {/* stage 2 — stairs */}
      <Beat start={s4} end={s6}>
        <div style={{position: 'absolute', left: 150, top: 420, width: 720}}>
          <div style={{fontFamily: FONT, fontSize: 130, fontWeight: 900, color: C.amber, lineHeight: 0.9}}>
            02
          </div>
          <div style={{marginTop: 18, fontFamily: FONT, fontSize: 74, fontWeight: 900, color: C.white}}>
            活动后气短
          </div>
          <div style={{marginTop: 22, fontFamily: FONT, fontSize: 28, color: C.text, lineHeight: 1.8}}>
            以前爬五楼不费劲，
            <br />
            后来三楼要歇一歇，
            <br />
            再后来，走快一点都胸闷。
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 26}}>
            <Chip color={C.cyan} size={20}>5F 轻松</Chip>
            <Chip color={C.amber} size={20}>3F 要歇</Chip>
            <Chip color={C.pink} size={20}>1F 也胸闷</Chip>
          </div>
        </div>
        <div style={{position: 'absolute', right: 160, top: 400}}>
          <StairsGraphic frame={frame} start={s4} />
        </div>
      </Beat>

      {/* stage 3 — image */}
      <Beat start={s6} end={s7}>
        <AbsoluteFill>
          <Img
            src={staticFile('img/patient-oxygen_c.jpg')}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 1150,
              height: '100%',
              objectFit: 'cover',
              opacity: 0.55,
              maskImage: 'linear-gradient(90deg, transparent 0%, black 45%)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 45%)',
              filter: 'saturate(0.7) brightness(0.75)',
            }}
          />
          <div style={{position: 'absolute', left: 150, top: 410, width: 860}}>
            <div style={{fontFamily: FONT, fontSize: 130, fontWeight: 900, color: C.pink, lineHeight: 0.9}}>
              03
            </div>
            <div style={{marginTop: 18, fontFamily: FONT, fontSize: 70, fontWeight: 900, color: C.white, lineHeight: 1.2}}>
              安静时也喘
            </div>
            <div style={{marginTop: 20, fontFamily: FONT, fontSize: 27, color: C.text, lineHeight: 1.8}}>
              嘴唇发紫、体重下降，
              <br />
              甚至出现肺动脉高压、右心衰。
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 26,
                padding: '10px 20px',
                borderRadius: 10,
                background: 'rgba(255,61,110,0.15)',
                border: `1px solid ${C.pink}55`,
                fontFamily: FONT,
                fontSize: 22,
                color: C.pink,
              }}
            >
              <Icon name="warning" size={22} color={C.pink} /> 一次感冒，就可能急性加重
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 170,
              bottom: 260,
              padding: '18px 26px',
              borderRadius: 16,
              ...glass(0.55, 'rgba(255,61,110,0.3)'),
            }}
          >
            <div style={{fontFamily: FONT, fontSize: 18, letterSpacing: 3, color: C.dim}}>SpO₂</div>
            <Counter value={88} delay={s6 + 6} size={72} color={C.pink} suffix="%" />
          </div>
        </AbsoluteFill>
      </Beat>

      {/* s7 ER */}
      <Beat start={s7} end={s8}>
        <div style={{position: 'absolute', left: 150, top: 470, width: 1100}}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 30,
              letterSpacing: 8,
              color: C.pink,
              marginBottom: 18,
            }}
          >
            ACUTE EXACERBATION
          </div>
          <div style={{fontFamily: FONT, fontSize: 80, fontWeight: 900, color: C.white, lineHeight: 1.32}}>
            到这一步，一次普通感冒
            <br />
            都可能
            <span style={{color: C.pink, textShadow: `0 0 50px ${C.pink}88`}}>直接推进急诊室</span>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 220,
            top: 430,
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: `2px solid ${C.pink}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 90px ${C.pink}33, inset 0 0 60px ${C.pink}22`,
            transform: `scale(${1 + Math.sin(frame / 8) * 0.03})`,
          }}
        >
          <div style={{color: C.pink}}>
            <Icon name="warning" size={150} color={C.pink} strokeWidth={1.1} />
          </div>
        </div>
      </Beat>

      {/* closing */}
      <Beat start={s8} end={durationInFrames + 10} enter={14} exit={4}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(3,7,15,0.35), rgba(3,7,15,0.92))'}}>
          <div style={{position: 'absolute', left: 150, top: 400, width: 1650}}>
            <Kicker color={C.pink} delay={0}>记住这句话</Kicker>
            <div
              style={{
                marginTop: 26,
                fontFamily: FONT,
                fontSize: 88,
                fontWeight: 900,
                color: C.white,
                lineHeight: 1.32,
              }}
            >
              肺气肿不是突然发生的，
              <br />
              它是一点点，把呼吸
              <span style={{color: C.pink}}>偷走的</span>。
            </div>
            <div style={{marginTop: 30, fontFamily: FONT, fontSize: 30, color: C.dim}}>
              所以，别把长期咳嗽，当成理所当然。
            </div>
          </div>
        </AbsoluteFill>
      </Beat>

      {/* severity meter */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div style={{position: 'absolute', left: 150, right: 150, top: 800, opacity: stage >= 0 ? 1 : 0}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: FONT,
              fontSize: 18,
              letterSpacing: 3,
              color: C.dim,
              marginBottom: 8,
            }}
          >
            <span>气道受限程度</span>
            <span style={{color: stage === 2 ? C.pink : C.amber}}>{Math.round(severity)}%</span>
          </div>
          <div style={{height: 8, borderRadius: 6, background: 'rgba(120,180,220,0.14)', overflow: 'hidden'}}>
            <div
              style={{
                width: `${severity}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${C.teal}, ${C.amber}, ${C.pink})`,
                boxShadow: `0 0 16px ${C.pink}88`,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CoughGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={520} height={400} viewBox="0 0 520 400" style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="coughGlow">
          <stop offset="0%" stopColor={C.cyan} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="210" r="190" fill="url(#coughGlow)" />
      {[0, 1, 2, 3].map((i) => {
        const p = ((frame / 42 + i / 4) % 1);
        return (
          <circle
            key={i}
            cx={260}
            cy={210}
            r={40 + p * 150}
            fill="none"
            stroke={C.cyan}
            strokeWidth={2}
            opacity={(1 - p) * 0.5}
          />
        );
      })}
      <path
        d="M160 210 C 180 150, 210 150, 230 210 C 250 270, 280 270, 300 210 C 320 150, 350 150, 370 210"
        fill="none"
        stroke={C.cyan}
        strokeWidth={5}
        strokeLinecap="round"
        style={{filter: `drop-shadow(0 0 16px ${C.cyan})`}}
      />
      <text x="260" y="350" fill={C.dim} fontSize="21" textAnchor="middle" fontFamily={FONT} letterSpacing={4}>
        CHRONIC COUGH
      </text>
    </svg>
  );
};

const StairsGraphic: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const p = Math.min(1, Math.max(0, (frame - start) / 40));
  const steps = [0, 1, 2, 3, 4, 5];
  return (
    <svg width={620} height={420} viewBox="0 0 620 420" style={{overflow: 'visible'}}>
      {steps.map((i) => {
        const h = 34 + i * 46;
        const x = 40 + i * 88;
        return (
          <g key={i}>
            <rect
              x={x}
              y={340 - h}
              width={84}
              height={h}
              fill={`${i > 2 ? C.pink : C.cyan}18`}
              stroke={i > 2 ? C.pink : C.cyan}
              strokeWidth={1.6}
              strokeOpacity={0.55}
            />
            <text x={x + 42} y={330} fill={C.dim} fontSize="16" textAnchor="middle" fontFamily={FONT}>
              {6 - i}F
            </text>
          </g>
        );
      })}
      <circle
        cx={82 + p * 440}
        cy={300 - Math.min(5, Math.floor(p * 5)) * 46 - Math.sin(p * 15) * 6}
        r={11}
        fill={C.amber}
        style={{filter: `drop-shadow(0 0 14px ${C.amber})`}}
      />
      <path d="M30 370 H590" stroke={C.dim} strokeWidth={1.5} opacity={0.4} />
    </svg>
  );
};
