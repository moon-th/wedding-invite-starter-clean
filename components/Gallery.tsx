// components/Gallery.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { driveSrc } from '@/lib/utils';

export default function Gallery({ imageIds = [] }: { imageIds?: string[] }) {
  const validIds = Array.isArray(imageIds)
    ? imageIds.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    : [];
  const sampleImages = [
    '/sample/doll-1.svg',
    '/sample/doll-2.svg',
    '/sample/doll-3.svg',
    '/sample/doll-4.svg',
    '/sample/doll-5.svg',
    '/sample/doll-6.svg',
  ];

  const toSrc = (id: string) => {
    // 이미 완전한 URL 또는 로컬 경로면 그대로 사용, 아니면 구글 드라이브 링크로 변환
    const safe = (id || '').toString();
    if (!safe) return '';
    if (/^https?:\/\//.test(safe) || safe.startsWith('/')) return safe;
    return driveSrc(safe);
  };

  const items = sampleImages;
  const total = items.length;
  const previewItems = items.slice(0, 6); // 기본 그리드: 3 x 2

  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const openViewer = (i = 0) => setViewerIdx(i);
  const closeViewer = () => setViewerIdx(null);
  const next = () => setViewerIdx((prev) => (prev === null ? 0 : (prev + 1) % total));
  const prev = () => setViewerIdx((prev) => (prev === null ? 0 : (prev - 1 + total) % total));

  useEffect(() => {
    if (viewerIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerIdx, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) prev();
    else if (delta < -40) next();
    touchStartX.current = null;
  };

  const inViewer = viewerIdx !== null;

  return (
    <div className="fadeUpSlow">
      {!inViewer && (
        <>
          <div className="gallery">
            {previewItems.map((src, i) => (
              <figure className="gallery-card" key={`${i}-${src}`}>
                <button
                  className="gallery-hit"
                  aria-label="이미지 크게 보기"
                  onClick={() => openViewer(i)}
                  type="button"
                >
                  <img src={src} alt="" className="gallery-img" loading="lazy" />
                </button>
              </figure>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button className="guestbook-btn" onClick={() => openViewer(0)}>
              전체 화면 보기
            </button>
          </div>
        </>
      )}

      {inViewer && viewerIdx !== null && (
        <div className="gallery-backdrop" onClick={closeViewer}>
          <div className="gallery-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="viewer-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <button className="viewer-nav left" onClick={prev} aria-label="이전 이미지">
                ‹
              </button>
              <div className="viewer-slide">
                <img src={items[viewerIdx]} alt="" className="viewer-img" />
              </div>
              <button className="viewer-nav right" onClick={next} aria-label="다음 이미지">
                ›
              </button>
            </div>
            <div className="viewer-dots">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  className={`viewer-dot ${idx === viewerIdx ? 'active' : ''}`}
                  onClick={() => setViewerIdx(idx)}
                  aria-label={`${idx + 1}번째 사진 보기`}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button className="guestbook-btn" onClick={closeViewer}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
