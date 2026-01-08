"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type LightboxProps = {
  images: { src: string; alt?: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange?: (nextIndex: number) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * ✅ 요구사항:
 * - 오버레이 모달
 * - 백그라운드 스크롤 막기
 * - 이미지 확대(휠/버튼)
 * - 좌우 넘김(버튼/키보드/스와이프)
 * - 우상단 X 닫기 + ESC + 바깥 클릭 닫기
 */
export default function LightboxModal({
  images,
  initialIndex,
  isOpen,
  onClose,
  onIndexChange,
}: LightboxProps) {
  if (!images || images.length === 0) return null;

  const safeInitial = clamp(initialIndex, 0, images.length - 1);
  const [index, setIndex] = useState(safeInitial);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const draggingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  // 열릴 때 initialIndex 반영
  useEffect(() => {
    if (isOpen) {
      setIndex(clamp(initialIndex, 0, images.length - 1));
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex, images.length]);

  // ✅ body 스크롤 락 (스크롤바 깜빡임 방지용 padding-right 보정)
  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const sbw = getScrollbarWidth();
    body.style.overflow = "hidden";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  const current = images[index];

  const go = (next: number) => {
    if (images.length === 0) return;
    const nextIndex = (next + images.length) % images.length;
    setIndex(nextIndex);
    onIndexChange?.(nextIndex);

    // 페이지 넘기면 줌/이동 초기화 (원하면 유지로 바꿔도 됨)
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const close = () => {
    // “닫기 버튼 누르면 인생의 짐도 같이 닫혔으면…” 같은 마음으로 닫습니다.
    onClose();
  };

  // ✅ 키보드: ESC 닫기, 좌/우 넘김
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index]);

  // ✅ 휠 줌
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const delta = -e.deltaY; // 위로 = 확대
    const step = delta > 0 ? 0.15 : -0.15;
    setScale((s) => clamp(Number((s + step).toFixed(2)), 1, 4));
  };

  const zoomIn = () => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 1, 4));
  const zoomOut = () => {
    setScale((s) => {
      const next = clamp(Number((s - 0.2).toFixed(2)), 1, 4);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };
  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // ✅ 드래그로 이동(pan) — scale > 1 일 때만
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (scale <= 1) return;
    draggingRef.current = true;
    lastPointRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current || !lastPointRef.current) return;
    const dx = e.clientX - lastPointRef.current.x;
    const dy = e.clientY - lastPointRef.current.y;
    lastPointRef.current = { x: e.clientX, y: e.clientY };
    setOffset((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
    draggingRef.current = false;
    lastPointRef.current = null;
  };

  // ✅ 간단 스와이프(모바일): 좌우로 넘김
  const swipeRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const t = e.touches[0];
    swipeRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!swipeRef.current) return;
    const start = swipeRef.current;
    swipeRef.current = null;

    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const dt = Date.now() - start.t;

    // 줌 중이면 스와이프보다 패닝을 우선
    if (scale > 1) return;

    // 수평 스와이프 조건
    if (dt < 600 && Math.abs(dx) > 50 && Math.abs(dy) < 80) {
      if (dx > 0) go(index - 1);
      else go(index + 1);
    }
  };

  // 다음/이전 미리보기(선택): next/image priority는 1장만 추천
  const preload = useMemo(() => {
    if (!images || images.length === 0 || !isOpen) return { prev: undefined, next: undefined };
    const prev = images[(index - 1 + images.length) % images.length]?.src;
    const next = images[(index + 1) % images.length]?.src;
    return { prev, next };
  }, [images, index, isOpen]);

  // 오픈 중이 아니면 렌더 안 함 (hook 순서가 바뀌지 않도록 useMemo 이후에 위치)
  if (!isOpen) return null;
  if (!current) return null;

  // next/image fill 사용을 위해 부모에 relative
  const transform = `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;

  return (
    <div
      ref={overlayRef}
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="lightbox-topbar">
        <div className="lightbox-counter">
          {index + 1} / {images.length}
        </div>
        <div className="lightbox-actions">
          <button type="button" onClick={(e) => { e.stopPropagation(); close(); }} aria-label="Close" className="lightbox-btn">✕</button>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          go(index - 1);
        }}
        className="lightbox-nav left"
        aria-label="Previous image"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          go(index + 1);
        }}
        className="lightbox-nav right"
        aria-label="Next image"
      >
        ›
      </button>

      <div
        className="lightbox-canvas"
        onWheel={(e) => {
          e.stopPropagation();
          onWheel(e);
        }}
      >
        <div
          className="lightbox-frame"
          onPointerDown={(e) => {
            e.stopPropagation();
            onPointerDown(e);
          }}
          onPointerMove={(e) => {
            e.stopPropagation();
            onPointerMove(e);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            onPointerUp(e);
          }}
          onPointerCancel={(e) => {
            e.stopPropagation();
            onPointerUp(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onTouchStart(e);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            onTouchEnd(e);
          }}
          style={{ cursor: scale > 1 ? "grab" : "default" }}
        >
          <div
            className="lightbox-img-wrap"
            style={{
              transform,
              transition: draggingRef.current ? "none" : "transform 120ms ease-out",
            }}
          >
            <Image
              src={current.src}
              alt={current.alt ?? `image-${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="lightbox-img"
              priority
            />
          </div>
        </div>
      </div>

      {/* (선택) 프리로드 힌트: 브라우저 캐시용으로만 */}
      {preload.prev ? <link rel="preload" as="image" href={preload.prev} /> : null}
      {preload.next ? <link rel="preload" as="image" href={preload.next} /> : null}
    </div>
  );
}
