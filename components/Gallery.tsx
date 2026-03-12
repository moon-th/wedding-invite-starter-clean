// components/Gallery.tsx
'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import LightboxModal from './Lightbox';

export default function Gallery({ imageIds = [] }: { imageIds?: string[] }) {
  const fallback = Array.from({ length: 5 }, (_, i) => `/src/image_webp/${i + 1}.webp`);
  const allItems = imageIds.length ? imageIds : fallback;
  const images = allItems.map((src, i) => ({ src, alt: `gallery-${i + 1}` }));
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [page, setPage] = useState(0);
  const pagesRef = useRef<HTMLDivElement | null>(null);

  const pagedItems: string[][] = [];
  for (let i = 0; i < allItems.length; i += 9) {
    pagedItems.push(allItems.slice(i, i + 9));
  }

  const handleScroll = () => {
    const node = pagesRef.current;
    if (!node) return;
    const nextPage = Math.round(node.scrollLeft / node.clientWidth);
    if (nextPage !== page) setPage(nextPage);
  };

  return (
    <>
      <div
        ref={pagesRef}
        className="fadeUpSlow gallery-pages"
        onScroll={handleScroll}
      >
        {pagedItems.map((pageItems, pageIndex) => (
          <div className="gallery-page" key={`page-${pageIndex}`}>
            <div className="gallery">
              {pageItems.map((src, itemIndex) => {
                const imageIndex = pageIndex * 9 + itemIndex;
                return (
                  <figure className="gallery-card" key={src}>
                    <button
                      type="button"
                      className="gallery-hit"
                      onClick={() => {
                        setIdx(imageIndex);
                        setOpen(true);
                      }}
                    >
                      <div className="gallery-img-wrap">
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 33vw, 320px"
                          className="gallery-img"
                          priority={imageIndex < 4}
                        />
                      </div>
                    </button>
                  </figure>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {pagedItems.length > 1 && (
        <div className="gallery-pagination" aria-label="갤러리 페이지">
          {pagedItems.map((_, pageIndex) => (
            <button
              key={`dot-${pageIndex}`}
              type="button"
              className={`gallery-page-dot ${page === pageIndex ? 'active' : ''}`}
              onClick={() => {
                const node = pagesRef.current;
                if (!node) return;
                node.scrollTo({
                  left: node.clientWidth * pageIndex,
                  behavior: 'smooth',
                });
              }}
              aria-label={`${pageIndex + 1}페이지 보기`}
            />
          ))}
        </div>
      )}

      <LightboxModal
        images={images}
        initialIndex={idx}
        isOpen={open}
        onClose={() => setOpen(false)}
        onIndexChange={(next) => setIdx(next)}
      />
    </>
  );
}
