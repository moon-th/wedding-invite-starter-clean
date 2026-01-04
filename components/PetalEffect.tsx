'use client';

import { useMemo } from 'react';

type Props = {
  /** 꽃잎 이미지 경로 (public/src/image/...) */
  src?: string;
  /** 생성 개수 */
  count?: number;
  /** 낙하 시간 [최소, 최대] (초) */
  duration?: [number, number];
  /** 가로 드리프트 (vw, 음수면 왼쪽으로 흐름) */
  drift?: number;
};

export default function PetalEffect({
  src = '/src/image/petal.png', // ← public/src/image/petal.png
  count = 22,
  duration = [4, 7],
  drift = -40,
}: Props) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100, // vw
        delay: Math.random() * 5, // s
        dur: duration[0] + Math.random() * (duration[1] - duration[0]), // s
        rotate: Math.round(Math.random() * 360),
        scale: 0.8 + Math.random() * 0.6,
      })),
    [count, duration]
  );
 
  return (
    <>
      <div className="petal-container" aria-hidden>
        {items.map((it, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: `${it.left}vw`,
              animationDelay: `${it.delay}s`,
              animationDuration: `${it.dur}s`,
              transform: `translate(0, -10vh) rotate(${it.rotate}deg) scale(${it.scale})`,
              backgroundImage: `url(${src})`,
              // CSS 변수로 드리프트 전달 (키프레임에서 사용)
              '--drift': `${drift}vw`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 컴포넌트 로컬 스타일 (styled-jsx) */}
      <style jsx>{`
        .petal-container {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }
        .petal {
          position: absolute;
          top: 0;
          width: 30px;
          height: 24px;
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.9;
          animation-name: petal-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes petal-fall {
          0% {
            transform: translate(0, -10vh) rotate(0deg);
          }
          100% {
            transform: translate(var(--drift, -40vw), 120vh) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
