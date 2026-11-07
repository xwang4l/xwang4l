import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, glass} from '../theme';
import {beat, sceneFrames} from '../timeline';
import {Beat} from '../components/Beat';
import {Lungs, AlveoliCluster, Diaphragm} from '../components/Lungs';
import {Counter} from '../components/Charts';
import {Chip, Kicker, SectionTitle} from '../components/Text';
import {Icon} from '../components/Icons';
import {GlowOrb} from '../components/Atmosphere';

export const NormalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const n1 = beat('normal', 'n1');
  const n2 = beat('normal', 'n2');
  const n3 = beat('normal', 'n3');
  const n4 = beat('normal', 'n4');
  const n5 = beat('normal', 'n5');
  const n6 = beat('normal', 'n6');

  const zoom = interpolate(frame, [n4, n4 + 30, n6, n6 + 26], [1, 1.16, 1.16, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <SectionTitle index="01" title="正常的肺，怎么工作" en="HOW A HEALTHY LUNG WORKS" delay={4} />
      <GlowOrb x={400} y={560} size={560} color={C.cyan} opacity={0.26} />
      <GlowOrb x={1400} y={560} size={520} color={C.teal} opacity={0.2} />

      {/* anatomy */}
      <div style={{position: 'absolute', left: 170, top: 300}}>
        <Lungs width={420} breath={0.55 + Math.sin(frame / 26) * 0.4} />
      </div>
      <div style={{position: 'absolute', left: 60, top: 790, opacity: 0.9}}>
        <Diaphragm amount={0.5 + Math.sin(frame / 26) * 0.45} />
      </div>

      {/* alveoli */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 250,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <AlveoliCluster width={560} breath={0.5 + Math.sin(frame / 26 + 0.4) * 0.4} damage={0} />
      </div>

      {/* beat 1 */}
      <Beat start={n1} end={n2} enter={14}>
        <div
          style={{
            position: 'absolute',
            left: 760,
            top: 380,
            width: 980,
            padding: '40px 48px',
            borderRadius: 24,
            ...glass(0.74),
          }}
        >
          <Kicker color={C.cyan}>先建立正确画面</Kicker>
          <div
            style={{
              marginTop: 20,
              fontFamily: FONT,
              fontSize: 66,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.25,
            }}
          >
            你的每一次呼吸，
            <br />
            都发生在<span style={{color: C.cyan}}>两亿个气囊</span>里。
          </div>
        </div>
      </Beat>

      {/* beat 2 — labels */}
      <Beat start={n2} end={n3}>
        <div style={{position: 'absolute', left: 620, top: 330, width: 520}}>
          {[
            ['气管 / TRACHEA', 0],
            ['支气管 / BRONCHI', 1],
            ['肺泡 / ALVEOLI', 2],
          ].map(([t, i], idx) => (
            <div
              key={t as string}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 22,
                opacity: interpolate(frame, [n2 + 6 + idx * 8, n2 + 18 + idx * 8], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 20,
                  background: [C.cyan, C.teal, C.amber][idx],
                  boxShadow: `0 0 18px ${[C.cyan, C.teal, C.amber][idx]}`,
                }}
              />
              <div style={{fontFamily: FONT, fontSize: 24, color: C.text, letterSpacing: 2}}>{t}</div>
            </div>
          ))}
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT,
              fontSize: 26,
              color: C.dim,
              lineHeight: 1.7,
              borderLeft: `2px solid ${C.cyan}44`,
              paddingLeft: 18,
            }}
          >
            吸进来的空气，最终要在这里
            <br />
            和血液完成氧气交换。
          </div>
        </div>
      </Beat>

      {/* beat 3 — inhale */}
      <Beat start={n3} end={n4}>
        <div style={{position: 'absolute', left: 760, top: 330, width: 1000}}>
          <Chip color={C.cyan} filled>
            <Icon name="arrow" size={22} color={C.cyan} /> 吸气 INHALE
          </Chip>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 62,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.28,
            }}
          >
            膈肌下沉，胸廓扩张
            <br />
            空气<span style={{color: C.cyan}}>顺着气道灌进肺泡</span>
          </div>
          <div style={{display: 'flex', gap: 18, marginTop: 30}}>
            <Chip color={C.dim} size={22}>膈肌 ↓</Chip>
            <Chip color={C.dim} size={22}>胸廓 ↑</Chip>
            <Chip color={C.dim} size={22}>肺泡 ↑</Chip>
          </div>
        </div>
      </Beat>

      {/* beat 4 — elastic fibres */}
      <Beat start={n4} end={n5}>
        <div style={{position: 'absolute', left: 760, top: 330, width: 1000}}>
          <Chip color={C.amber} filled>
            <Icon name="scale" size={22} color={C.amber} /> 关键结构
          </Chip>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 62,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.28,
            }}
          >
            肺泡壁上的
            <span style={{color: C.amber}}>弹性纤维</span>
            <br />
            就是肺的“橡皮筋”
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: FONT,
              fontSize: 28,
              color: C.dim,
              lineHeight: 1.7,
              maxWidth: 700,
            }}
          >
            呼气时靠它回弹，把废气挤出去。
            <br />
            没有它，肺就是一袋吹不瘪的破气球。
          </div>
        </div>
      </Beat>

      {/* beat 5 — 20000 times */}
      <Beat start={n5} end={n6}>
        <div
          style={{
            position: 'absolute',
            right: 150,
            top: 350,
            width: 640,
            padding: '34px 40px 40px',
            borderRadius: 26,
            ...glass(0.8, 'rgba(255,200,87,0.3)'),
            textAlign: 'center',
          }}
        >
          <div style={{fontFamily: FONT, fontSize: 22, letterSpacing: 5, color: C.dim}}>
            EVERY DAY
          </div>
          <Counter value={20000} delay={n5 + 6} duration={40} size={124} color={C.amber} />
          <div style={{fontFamily: FONT, fontSize: 28, color: C.text, marginTop: 10, letterSpacing: 2}}>
            次弹性回缩 / 每天
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT,
              fontSize: 22,
              color: C.dim,
              lineHeight: 1.6,
            }}
          >
            它们从不喊累，直到某一天，再也弹不回来。
          </div>
        </div>
      </Beat>

      {/* beat 6 */}
      <Beat start={n6} end={durationInFrames + 10} enter={12} exit={4}>
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(3,7,15,0.55), rgba(3,7,15,0.9))',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{textAlign: 'center', marginTop: -60}}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 34,
                letterSpacing: 8,
                color: C.pink,
                marginBottom: 22,
              }}
            >
              BUT THEN
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 86,
                fontWeight: 900,
                color: C.white,
                lineHeight: 1.3,
              }}
            >
              而肺气肿，就是这台换气机器
              <br />
              被<span style={{color: C.pink, textShadow: `0 0 50px ${C.pink}99`}}>一点点拆掉</span>的过程
            </div>
          </div>
        </AbsoluteFill>
      </Beat>
    </AbsoluteFill>
  );
};
