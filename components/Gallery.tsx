// components/Gallery.tsx
'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Gallery({ imageIds = [] }: { imageIds?: string[] }) {
  const items = Array.from({ length: 20 }, (_, i) => `/src/image_webp/${i + 1}.webp`);
  const total = items.length;
  const previewItems = items; // 20장 모두 보여줌

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
                  <div className="gallery-img-wrap">
                    <Image
                      src={src}
                      alt=""
                      width={900}
                      height={1200}
                      sizes="(max-width: 768px) 45vw, 300px"
                      className="gallery-img"
                      priority={i < 3}
                    />
                  </div>
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
                <div className="viewer-img-wrap">
                  <Image
                    src={items[viewerIdx]}
                    alt=""
                    width={1400}
                    height={2000}
                    sizes="100vw"
                    className="viewer-img"
                    priority
                  />
                </div>
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
