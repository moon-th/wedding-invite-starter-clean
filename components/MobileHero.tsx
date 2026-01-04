import dynamic from 'next/dynamic';
import { formatDate, resolveImageSrc, type InviteMeta } from '@/lib/utils';

// 꽃잎은 랜덤 값 때문에 SSR 불일치가 날 수 있어 클라이언트 전용으로 로드
const PetalEffect = dynamic(() => import('@/components/PetalEffect'), { ssr: false });

export default function MobileHero({ meta }: { meta: InviteMeta }) {
  const [leftName, rightName] = splitNames(meta.title);

  return (
    <section className="hero" style={{ position: 'relative' }}>
      <div
        className="hero-frame"
        style={{
          position: 'relative',
          overflow: 'hidden',
      
        }}
      >
        {/* 커버 이미지 */}
        <img
          className="photo"
          src="/src/image/top_back.png"
          alt=""
          loading="eager"
        />

        {/* 어둡게 오버레이 (z-index:0) */}
        <div
          className="overlay"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            
          }}
        />

        {/* 꽃잎 효과 (z-index:1). 이미지 경로는 public/src/image 아래 사용 */}
        <PetalEffect src="/src/image/petal.png" count={22} duration={[4, 7]} drift={-40} />

        {/* 상단 이름/일시 바 */}
        <div className="hero-topbar">
          <span className="hero-name">{leftName}</span>
          <span className="hero-date">
            {formatDate(meta.date)}{meta.time ? ` ${meta.time}` : ''}
          </span>
          <span className="hero-name">{rightName}</span>
        </div>

        {/* 레전드 카드 (z-index:2) */}
        <div className="legend">
          <div className="hero-main-title">Just Married</div>
          <div className="meta" style={{ fontSize: 14, opacity: 0.95 }}>
            {meta.place}
          </div>
        </div>
      </div>
    </section>
  );
}

function splitNames(title: string) {
  const parts = title.split(/&|·/).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts[1]];
  if (parts.length === 1) return [parts[0], parts[0]];
  return ['신랑', '신부'];
}
