// components/Gallery.tsx
'use client';
import Image from 'next/image';
import { useState } from 'react';
import LightboxModal from './Lightbox';

export default function Gallery({ imageIds = [] }: { imageIds?: string[] }) {
  const items = Array.from({ length: 20 }, (_, i) => `/src/image_webp/${i + 1}.webp`);
  const images = items.map((src, i) => ({ src, alt: `gallery-${i + 1}` }));
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  return (
    <>
      <div className="fadeUpSlow gallery-horizontal">
        <div className="gallery-row">
          {items.map((src, i) => (
            <div className="gallery-cell" key={src}>
              <Image
                src={src}
                alt=""
                width={1100}
                height={1500}
                sizes="(max-width: 768px) 60vw, 360px"
                className="gallery-img-large"
                priority={i < 4}
                onClick={() => {
                  setIdx(i);
                  setOpen(true);
                }}
              />
            </div>
          ))}
        </div>
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
