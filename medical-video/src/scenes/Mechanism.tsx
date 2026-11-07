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
import {beat} from '../timeline';
import {Beat} from '../components/Beat';
import {AlveoliCluster} from '../components/Lungs';
import {Chip, Kicker, SectionTitle} from '../components/Text';
import {Icon, IconName} from '../components/Icons';
import {Counter} from '../components/Charts';
import {GlowOrb} from '../components/Atmosphere';

const RISKS: [IconName, string][] = [
  ['smoke', '吸烟'],
  ['dust', '粉尘'],
  ['smoke', '厨房油烟'],
  ['virus', '反复感染'],
];

export const MechanismScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const m1 = beat('mechanism', 'm1');
  const m2 = beat('mechanism', 'm2');
  const m3 = beat('mechanism', 'm3');
  const m4 = beat('mechanism', 'm4');
  const m5 = beat('mechanism', 'm5');
  const m6 = beat('mechanism', 'm6');
  const m7 = beat('mechanism', 'm7');
  const m8 = beat('mechanism', 'm8');

  const damage = interpolate(frame, [m4, m5, m6, m6 + 60], [0.08, 0.45, 0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: 0.28}}>
        <Loop durationInFrames={250}>
          <OffthreadVideo
            src={staticFile('video/alveoli-destroy_c.mp4')}
            muted
            playbackRate={0.6}
            style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(0.9)'}}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(3,7,15,0.9) 0%, rgba(3,7,15,0.72) 45%, rgba(3,7,15,0.94) 100%)',
        }}
      />

      <SectionTitle index="02" title="弹性纤维，被谁剪断" en="MECHANISM OF DESTRUCTION" delay={6} color={C.pink} />
      <GlowOrb x={430} y={600} size={620} color={damage > 0.5 ? C.pink : C.cyan} opacity={0.3} />

      {/* specimen */}
      <div style={{position: 'absolute', left: 105, top: 300}}>
        <AlveoliCluster width={560} damage={damage} breath={0.35} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 800,
          display: 'flex',
          gap: 14,
          fontFamily: FONT,
          fontSize: 20,
          letterSpacing: 3,
        }}
      >
        <div style={{padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.cyan}44`, color: C.cyan}}>
          HEALTHY
        </div>
        <div style={{color: C.dim, alignSelf: 'center'}}>→</div>
        <div style={{padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.pink}55`, color: C.pink}}>
          EMPHYSEMA
        </div>
      </div>

      {/* m1 */}
      <Beat start={m1} end={m2}>
        <div style={{position: 'absolute', left: 780, top: 360, width: 1020}}>
          <Kicker color={C.pink}>问题的起点</Kicker>
          <div
            style={{
              marginTop: 24,
              fontFamily: FONT,
              fontSize: 82,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.22,
            }}
          >
            肺气肿，坏就坏在
            <br />
            这层<span style={{color: C.amber}}>弹性纤维</span>上。
          </div>
          <div style={{marginTop: 30, fontFamily: FONT, fontSize: 28, color: C.dim}}>
            它一旦断裂，肺泡就再也收不回去了。
          </div>
        </div>
      </Beat>

      {/* m2 — risks */}
      <Beat start={m2} end={m3}>
        <div style={{position: 'absolute', left: 780, top: 330, width: 1040}}>
          <Chip color={C.pink} filled>
            <Icon name="warning" size={20} color={C.pink} /> 四大诱因
          </Chip>
          <div
            style={{
              marginTop: 30,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 18,
            }}
          >
            {RISKS.map(([icon, text], i) => (
              <div
                key={i}
                style={{
                  padding: '26px 12px 22px',
                  borderRadius: 18,
                  ...glass(0.6, 'rgba(255,100,130,0.24)'),
                  textAlign: 'center',
                  opacity: interpolate(frame, [m2 + 6 + i * 7, m2 + 18 + i * 7], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                  transform: `translateY(${interpolate(
                    frame,
                    [m2 + 6 + i * 7, m2 + 18 + i * 7],
                    [24, 0],
                    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
                  )}px)`,
                }}
              >
                <div style={{color: C.pink}}>
                  <Icon name={icon} size={46} color={C.pink} />
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 23,
                    color: C.white,
                    marginTop: 12,
                    letterSpacing: 1,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: FONT,
              fontSize: 30,
              color: C.text,
              lineHeight: 1.7,
            }}
          >
            它们让大量<span style={{color: C.pink, fontWeight: 800}}>炎症细胞</span>涌进肺里，
            <br />
            开始一场持续几十年的“拆迁”。
          </div>
        </div>
      </Beat>

      {/* m3 — protease */}
      <Beat start={m3} end={m4}>
        <div style={{position: 'absolute', left: 780, top: 340, width: 1000}}>
          <Chip color={C.amber} filled>
            <Icon name="scissors" size={20} color={C.amber} /> 失控的剪刀
          </Chip>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 68,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.28,
            }}
          >
            炎症细胞释放
            <span style={{color: C.amber}}>蛋白酶</span>
            <br />
            去分解被烟雾损伤的肺组织
          </div>
          <div style={{position: 'relative', marginTop: 34, height: 120}}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i * 210,
                  top: 0,
                  color: C.pink,
                  opacity: 0.9,
                  transform: `rotate(${Math.sin(frame / 8 + i) * 16}deg)`,
                }}
              >
                <Icon name="scissors" size={86} color={C.pink} strokeWidth={1.2} />
              </div>
            ))}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 44,
                height: 2,
                background: `repeating-linear-gradient(90deg, ${C.cyan}88 0 18px, transparent 18px 30px)`,
                opacity: 0.7,
              }}
            />
          </div>
        </div>
      </Beat>

      {/* m4 — imbalance */}
      <Beat start={m4} end={m5}>
        <div style={{position: 'absolute', left: 780, top: 320, width: 1020}}>
          <Kicker color={C.pink}>真正的转折点</Kicker>
          <div
            style={{
              marginTop: 20,
              fontFamily: FONT,
              fontSize: 64,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.3,
            }}
          >
            蛋白酶 与 抗蛋白酶
            <br />
            <span style={{color: C.pink}}>失去平衡</span>，这把剪刀彻底失控
          </div>
          <div
            style={{
              marginTop: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              transform: `rotate(${-8 - Math.min(1, (frame - m4) / 26) * 5}deg)`,
              transformOrigin: 'center',
            }}
          >
            {[
              ['蛋白酶', C.pink, 92],
              ['抗蛋白酶', C.cyan, 38],
            ].map(([label, color, h]) => (
              <div key={label as string} style={{textAlign: 'center', width: 300}}>
                <div
                  style={{
                    height: 220,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 96,
                      height: (h as number) * 2,
                      borderRadius: 12,
                      background: `linear-gradient(180deg, ${color}, ${color}33)`,
                      boxShadow: `0 0 30px ${color}66`,
                    }}
                  />
                </div>
                <div style={{fontFamily: FONT, fontSize: 24, color: color as string, marginTop: 12}}>
                  {label}
                </div>
              </div>
            ))}
            <div style={{flex: 1}}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: C.pink,
                  fontFamily: FONT,
                  fontSize: 28,
                }}
              >
                <Icon name="warning" size={34} color={C.pink} /> 拆迁速度 &gt; 修复速度
              </div>
            </div>
          </div>
        </div>
      </Beat>

      {/* m5 — merge */}
      <Beat start={m5} end={m6}>
        <div style={{position: 'absolute', left: 780, top: 330, width: 1030}}>
          <Chip color={C.pink} filled>
            <Icon name="lungs" size={20} color={C.pink} /> 结构崩坏
          </Chip>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 62,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.3,
            }}
          >
            肺泡壁被剪断、融合
            <br />
            两亿个小气球
            <span style={{color: C.pink}}>塌成破口袋</span>
          </div>
          <div style={{display: 'flex', gap: 34, marginTop: 40}}>
            <div>
              <Counter value={200000000} delay={m5 + 4} duration={30} size={64} color={C.cyan} />
              <div style={{fontFamily: FONT, fontSize: 22, color: C.dim, marginTop: 6}}>正常肺泡数量</div>
            </div>
            <div style={{fontFamily: FONT, fontSize: 48, color: C.dim, alignSelf: 'center'}}>→</div>
            <div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 64,
                  fontWeight: 900,
                  color: C.pink,
                  lineHeight: 1.1,
                }}
              >
                一个大空腔
              </div>
              <div style={{fontFamily: FONT, fontSize: 22, color: C.dim, marginTop: 6}}>有效换气面积骤减</div>
            </div>
          </div>
        </div>
      </Beat>

      {/* m6 — air trapping */}
      <Beat start={m6} end={m7}>
        <div style={{position: 'absolute', left: 780, top: 320, width: 1030}}>
          <Chip color={C.amber} filled>
            <Icon name="warning" size={20} color={C.amber} /> 空气只进不出
          </Chip>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 66,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.28,
            }}
          >
            呼气时小气道提前塌陷
            <br />
            空气<span style={{color: C.amber}}>进得去，却出不来</span>
          </div>
          <svg width={720} height={210} viewBox="0 0 720 210" style={{marginTop: 30, overflow: 'visible'}}>
            <path d="M20 105 H250" stroke={C.cyan} strokeWidth={16} strokeLinecap="round" opacity={0.55} />
            <path d="M20 105 H250" stroke={C.white} strokeWidth={3} strokeDasharray="10 14" strokeDashoffset={-frame * 2} />
            <ellipse cx="470" cy="105" rx="180" ry="88" fill={`${C.amber}14`} stroke={C.amber} strokeWidth={2.5} strokeDasharray="8 8" />
            {new Array(7).fill(0).map((_, i) => {
              const p = (frame / 45 + i / 7) % 1;
              return (
                <circle key={i} cx={80 + p * 170} cy={105 + Math.sin(i + frame / 9) * 6} r={5} fill={C.cyan} opacity={0.9} />
              );
            })}
            <path d="M340 78 L300 48" stroke={C.cyan} strokeWidth={3} />
            <text x="290" y="40" fill={C.cyan} fontSize="20" fontFamily={FONT} textAnchor="end">
              吸气 →
            </text>
            <g opacity={0.9}>
              <ellipse cx="286" cy="105" rx="16" ry="52" fill={C.pink} opacity={0.35} />
              <path d="M286 56 C 320 78, 320 132, 286 154" stroke={C.pink} strokeWidth={3} fill="none" />
              <text x="250" y="190" fill={C.pink} fontSize="20" fontFamily={FONT} textAnchor="middle">
                呼气受阻
              </text>
            </g>
          </svg>
        </div>
      </Beat>

      {/* m7 — residual air */}
      <Beat start={m7} end={m8}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{textAlign: 'center', marginTop: -80}}>
            <div style={{fontFamily: FONT, fontSize: 30, letterSpacing: 14, color: C.dim}}>
              THE CORE OF EMPHYSEMA
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 230,
                fontWeight: 900,
                color: C.white,
                letterSpacing: 20,
                lineHeight: 1.1,
                textShadow: `0 0 90px ${C.pink}77`,
              }}
            >
              残<span style={{color: C.pink}}>气</span>
            </div>
            <div style={{fontFamily: FONT, fontSize: 28, color: C.text, letterSpacing: 4}}>
              呼不出去的废气，把肺越撑越大
            </div>
          </div>
        </AbsoluteFill>
      </Beat>

      {/* m8 — barrel chest */}
      <Beat start={m8} end={durationInFrames + 10} enter={12} exit={4}>
        <div style={{position: 'absolute', left: 780, top: 340, width: 1000}}>
          <Kicker color={C.amber}>看得见的变化</Kicker>
          <div
            style={{
              marginTop: 22,
              fontFamily: FONT,
              fontSize: 64,
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.3,
            }}
          >
            肺越撑越大，胸廓被顶成
            <span style={{color: C.amber}}>桶状</span>
            <br />
            可真正能换气的表面积，越来越少
          </div>
          <div style={{display: 'flex', gap: 16, marginTop: 30}}>
            <Chip color={C.pink} size={22}>前后径增大</Chip>
            <Chip color={C.pink} size={22}>肋间隙增宽</Chip>
            <Chip color={C.pink} size={22}>膈肌低平</Chip>
          </div>
        </div>
        <div style={{position: 'absolute', right: 120, top: 300}}>
          <svg width={430} height={470} viewBox="0 0 430 470" style={{overflow: 'visible'}}>
            <defs>
              <linearGradient id="torso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.cyan} stopOpacity="0.28" />
                <stop offset="100%" stopColor={C.cyan} stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <path
              d="M215 28 C250 28 262 50 262 78 L262 96 C300 110 322 150 330 210 C338 272 338 330 330 380 C324 420 300 448 250 452 L180 452 C130 448 106 420 100 380 C92 330 92 272 100 210 C108 150 130 110 168 96 L168 78 C168 50 180 28 215 28 Z"
              fill="url(#torso)"
              stroke={C.cyan}
              strokeWidth={2}
            />
            <path d="M215 96 V450" stroke={C.cyan} strokeWidth={1.5} opacity={0.5} />
            {[150, 190, 230, 270, 310, 350].map((y, i) => (
              <path
                key={y}
                d={`M${110 - i * 1.4} ${y} Q215 ${y + 26} ${320 + i * 1.4} ${y}`}
                stroke={C.cyan}
                strokeWidth={1.4}
                fill="none"
                opacity={0.45}
              />
            ))}
            <path d="M100 210 H60 M330 210 H370" stroke={C.amber} strokeWidth={2} strokeDasharray="6 6" />
            <text x="215" y="486" fill={C.amber} fontSize="22" textAnchor="middle" fontFamily={FONT} letterSpacing={4}>
              BARREL CHEST · 桶状胸
            </text>
          </svg>
        </div>
      </Beat>
    </AbsoluteFill>
  );
};
