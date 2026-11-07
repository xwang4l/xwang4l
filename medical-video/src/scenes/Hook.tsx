import React from 'react';
import {
  AbsoluteFill,
  Loop,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT, glass} from '../theme';
import {beat, linesOf} from '../timeline';
import {Beat} from '../components/Beat';
import {Lungs} from '../components/Lungs';
import {Counter, RingStat, BarRow} from '../components/Charts';
import {Chip, Kicker} from '../components/Text';
import {Icon} from '../components/Icons';
import {GlowOrb, Particles} from '../components/Atmosphere';

const beats = (id: string) => beat('hook', id);

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const ids = linesOf('hook').map((l) => l.id);
  const b = Object.fromEntries(ids.map((id) => [id, beats(id)])) as Record<string, number>;
  const ends = Object.fromEntries(
    ids.map((id, i) => [id, i === ids.length - 1 ? durationInFrames : beats(ids[i + 1])]),
  ) as Record<string, number>;

  const glitch = Math.sin(frame / 3) * 6;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {/* background footage */}
      <AbsoluteFill style={{opacity: 0.46}}>
        <Loop durationInFrames={260}>
          <OffthreadVideo
            src={staticFile('video/hook-smoke_c.mp4')}
            muted
            playbackRate={0.55}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.12 + Math.sin(frame / 220) * 0.03})`,
              filter: 'saturate(0.9) brightness(0.8)',
            }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(3,7,15,0.95) 0%, rgba(3,7,15,0.78) 42%, rgba(3,7,15,0.25) 100%)',
        }}
      />
      <Particles count={24} seed={5} opacity={0.5} />

      {/* h1 — stair climb */}
      <Beat start={b.h1} end={ends.h1} rise={50}>
        <div style={{position: 'absolute', left: 128, top: 250, width: 1000}}>
          <Kicker color={C.cyan}>先问你一个扎心的问题</Kicker>
          <div
            style={{
              marginTop: 34,
              fontFamily: FONT,
              fontSize: 104,
              fontWeight: 900,
              color: C.white,
              letterSpacing: -2,
              lineHeight: 1.12,
            }}
          >
            爬
            <span
              style={{
                fontSize: 190,
                color: C.cyan,
                textShadow: `0 0 60px ${C.cyan}88`,
                margin: '0 8px',
                verticalAlign: '-12px',
              }}
            >
              3
            </span>
            层楼
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: FONT,
              fontSize: 74,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.2,
            }}
          >
            你就喘得像
            <span style={{color: C.amber, textShadow: `0 0 40px ${C.amber}66`}}>跑完 800 米</span>？
          </div>
          <div
            style={{
              marginTop: 34,
              fontFamily: FONT,
              fontSize: 30,
              color: C.dim,
              letterSpacing: 2,
            }}
          >
            这不是体力差 —— 可能是你的肺，在报警。
          </div>
        </div>

        <div style={{position: 'absolute', left: 1180, top: 150, opacity: 0.95}}>
          <Lungs width={620} breath={0.85} draw={1} />
        </div>
        <GlowOrb x={1460} y={470} size={520} color={C.cyan} opacity={0.36} />
      </Beat>

      {/* h2 — leaking lung */}
      <Beat start={b.h2} end={ends.h2}>
        <div style={{position: 'absolute', left: 128, top: 300, width: 980}}>
          <Kicker color={C.pink}>但真正的问题，不是体力</Kicker>
          <div
            style={{
              marginTop: 40,
              fontFamily: FONT,
              fontSize: 150,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.06,
              letterSpacing: -3,
            }}
          >
            你的肺
            <br />
            正在
            <span
              style={{
                color: C.pink,
                textShadow: `0 0 70px ${C.pink}99`,
                display: 'inline-block',
                transform: `rotate(${interpolate(frame % 120, [0, 60, 120], [-1.5, 1.5, -1.5])}deg)`,
              }}
            >
              漏气
            </span>
          </div>
          <div
            style={{
              marginTop: 40,
              padding: '18px 26px',
              borderLeft: `3px solid ${C.pink}`,
              background: 'rgba(255,61,110,0.08)',
              fontFamily: FONT,
              fontSize: 30,
              color: C.text,
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            两个多亿的肺泡，正在融合、塌陷，
            <br />
            空气只进不出。
          </div>
        </div>

        <div style={{position: 'absolute', left: 1230, top: 170}}>
          <Lungs width={560} breath={0.4} damage={0.45} draw={1} leak={1} />
        </div>
      </Beat>

      {/* h3 — title slam */}
      <Beat start={b.h3} end={ends.h3} enter={8}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'relative', textAlign: 'center', marginTop: -40}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: FONT,
                fontSize: 270,
                fontWeight: 900,
                color: C.cyan,
                opacity: 0.5,
                transform: `translate(${glitch}px, ${-glitch * 0.4}px)`,
                filter: 'blur(1px)',
              }}
            >
              肺气肿
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: FONT,
                fontSize: 270,
                fontWeight: 900,
                color: C.pink,
                opacity: 0.42,
                transform: `translate(${-glitch}px, ${glitch * 0.3}px)`,
                filter: 'blur(1px)',
              }}
            >
              肺气肿
            </div>
            <div
              style={{
                position: 'relative',
                fontFamily: FONT,
                fontSize: 270,
                fontWeight: 900,
                color: C.white,
                letterSpacing: 18,
                lineHeight: 1,
                textShadow: `0 0 120px ${C.cyan}66`,
              }}
            >
              肺气肿
            </div>
            <div
              style={{
                marginTop: 26,
                fontFamily: FONT,
                fontSize: 30,
                letterSpacing: 22,
                color: C.cyan,
                fontWeight: 600,
              }}
            >
              E M P H Y S E M A
            </div>
            <div
              style={{
                marginTop: 20,
                fontFamily: FONT,
                fontSize: 26,
                letterSpacing: 4,
                color: C.dim,
              }}
            >
              一种不可逆的肺泡结构破坏
            </div>
          </div>
        </AbsoluteFill>
      </Beat>

      {/* h4 — 13.7% */}
      <Beat start={b.h4} end={ends.h4}>
        <div style={{position: 'absolute', left: 128, top: 240, width: 900}}>
          <Kicker color={C.violet}>这不是罕见病</Kicker>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 18}}>
            <Counter value={13.7} decimals={1} suffix="%" delay={b.h4 + 4} size={210} color={C.cyan} />
            <div
              style={{
                fontFamily: FONT,
                fontSize: 30,
                color: C.text,
                paddingBottom: 34,
                lineHeight: 1.5,
              }}
            >
              我国 40 岁以上人群
              <br />
              慢阻肺患病率
            </div>
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 30,
              color: C.dim,
              letterSpacing: 1,
            }}
          >
            也就是说，每 7 位 40 岁以上成人里，
            <span style={{color: C.pink, fontWeight: 800}}> 约 1 位 </span>
            肺功能已经不达标。
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 120,
            top: 250,
            width: 720,
            padding: '38px 42px',
            borderRadius: 24,
            ...glass(0.72),
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 22,
              color: C.dim,
              letterSpacing: 4,
              marginBottom: 24,
            }}
          >
            COPD PREVALENCE · 40+
          </div>
          <BarRow label="中国 40 岁以上人群" value={13.7} max={20} suffix="%" delay={b.h4 + 12} color={C.cyan} />
          <div style={{height: 18}} />
          <BarRow label="全球 40 岁以上人群" value={10.3} max={20} suffix="%" delay={b.h4 + 20} color={C.violet} />
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 30,
              flexWrap: 'wrap',
            }}
          >
            {new Array(14).fill(0).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: i === 0 ? C.pink : 'rgba(120,180,220,0.16)',
                  boxShadow: i === 0 ? `0 0 22px ${C.pink}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: i === 0 ? '#fff' : C.dim,
                  fontFamily: FONT,
                  fontSize: 18,
                }}
              >
                {i === 0 ? '!' : ''}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: FONT,
              fontSize: 16,
              color: C.dim,
              opacity: 0.7,
            }}
          >
            数据来源：中国成人肺部健康研究（2018）
          </div>
        </div>
      </Beat>

      {/* h5 — half lung function gone */}
      <Beat start={b.h5} end={ends.h5}>
        <div style={{position: 'absolute', left: 128, top: 250, width: 900}}>
          <Kicker color={C.amber}>最扎心的地方</Kicker>
          <div
            style={{
              marginTop: 28,
              fontFamily: FONT,
              fontSize: 92,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.2,
            }}
          >
            很多人第一次确诊，
            <br />
            肺功能已经
            <span
              style={{
                color: C.amber,
                textShadow: `0 0 50px ${C.amber}88`,
              }}
            >
              丢掉一半
            </span>
            。
          </div>
          <div
            style={{
              marginTop: 34,
              fontFamily: FONT,
              fontSize: 28,
              color: C.dim,
              letterSpacing: 2,
            }}
          >
            肺没有痛觉，等你感觉到喘，损伤往往已经不可逆。
          </div>
        </div>

        <div style={{position: 'absolute', left: 1230, top: 210}}>
          <RingStat progress={0.5} size={340} stroke={18} color={C.amber} delay={b.h5 + 10}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 84,
                fontWeight: 900,
                color: C.white,
                lineHeight: 1,
              }}
            >
              −50%
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 20,
                color: C.dim,
                letterSpacing: 3,
                marginTop: 10,
              }}
            >
              肺功能残存
            </div>
          </RingStat>
        </div>
      </Beat>

      {/* h6 — retention hook */}
      <Beat start={b.h6} end={ends.h6}>
        <div style={{position: 'absolute', left: 128, top: 230, width: 1200}}>
          <Chip color={C.pink} filled>
            <span style={{fontSize: 20}}>▼</span> 先别划走
          </Chip>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 110,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            接下来 5 分钟
            <br />
            把肺气肿讲透
          </div>
          <div style={{display: 'flex', gap: 16, marginTop: 44}}>
            {[
              ['01', '它是怎么来的', C.cyan],
              ['02', '身体发出的 3 个信号', C.amber],
              ['03', '真正有效的治疗', C.teal],
            ].map(([n, t, col], i) => (
              <div
                key={n}
                style={{
                  padding: '18px 24px',
                  borderRadius: 14,
                  border: `1px solid ${col}55`,
                  background: `${col}12`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: interpolate(frame, [b.h6 + 14 + i * 10, b.h6 + 26 + i * 10], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                <span style={{fontFamily: FONT, fontSize: 30, fontWeight: 900, color: col as string}}>{n}</span>
                <span style={{fontFamily: FONT, fontSize: 24, color: C.text}}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 180,
            top: 420,
            color: C.cyan,
            opacity: 0.8,
            transform: `translateX(${Math.sin(frame / 12) * 14}px)`,
          }}
        >
          <Icon name="arrow" size={150} color={C.cyan} strokeWidth={1.1} />
        </div>
      </Beat>
    </AbsoluteFill>
  );
};
