// components/Gallery.tsx
'use client';
import Image from 'next/image';
import { useState } from 'react';
import LightboxModal from './Lightbox';

export default function Gallery({ imageIds = [] }: { imageIds?: string[] }) {
  const fallback = Array.from({ length: 5 }, (_, i) => `/src/image_webp/${i + 1}.webp`);
  const allItems = imageIds.length ? imageIds : fallback;
  const previewItems = allItems.slice(0, 9);
  const images = allItems.map((src, i) => ({ src, alt: `gallery-${i + 1}` }));
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  return (
    <>
      <div className="fadeUpSlow gallery">
        {previewItems.map((src, i) => (
          <figure className="gallery-card" key={src}>
            <button
              type="button"
              className="gallery-hit"
              onClick={() => {
                setIdx(i);
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
                  priority={i < 4}
                />
              </div>
            </button>
          </figure>
        ))}
      </div>

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
