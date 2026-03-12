'use client';

import { useEffect, useRef } from 'react';

type Props = {
  src?: string;
};

export default function BgmAutoplay({ src = '/src/bgm/bgm.m4a' }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio.play().catch(() => {
        // 모바일/브라우저 자동재생 정책으로 실패할 수 있음
      });
    };

    tryPlay();
    audio.addEventListener('loadeddata', tryPlay);
    audio.addEventListener('canplay', tryPlay);

    const unlock = () => {
      tryPlay();
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };

    document.addEventListener('touchstart', unlock, { passive: true });
    document.addEventListener('click', unlock);
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);

    return () => {
      audio.removeEventListener('loadeddata', tryPlay);
      audio.removeEventListener('canplay', tryPlay);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

  return (
    <audio ref={audioRef} autoPlay loop preload="auto" playsInline hidden>
      <source src={src} type="audio/mp4" />
      <source src="/src/bgm/bgm.m4a" type="audio/mp4" />
    </audio>
  );
}
