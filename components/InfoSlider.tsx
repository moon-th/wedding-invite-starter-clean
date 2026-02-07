// components/InfoSlider.tsx
'use client';

import { useState } from 'react';

const slides = [
  {
    title: '셔틀버스 안내',
    lines: [
      '신도림역에서 왕복 셔틀버스를 이용하실 수 있습니다.',
      '서울 출발: 신도림역 0번 출구 앞',
      '정선 출발: 결혼식장 앞',
    ],
  },
  {
    title: '식사 안내',
    lines: [
      '결혼식 후 웨딩홀 2층에서 뷔페식으로 진행됩니다.',
      '한식 · 중식 · 양식 등 다양한 메뉴가 준비되어 있습니다.',
      '편안하게 즐겨주세요.',
    ],
  },
];

export default function InfoSlider() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((p) => (p + 1) % slides.length);
  const prev = () => setIdx((p) => (p - 1 + slides.length) % slides.length);
  const offset = -(100 / slides.length) * idx;

  return (
    <div className="info-slider">
      <div
        className="info-slider-rail"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(${offset}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div className="info-slide" key={i}>
            <div className="info-slide-card">
              <h4>{slide.title}</h4>
              <ul>
                {slide.lines.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="info-slider-nav">
        <button type="button" onClick={prev} aria-label="이전">‹</button>
        <div className="info-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === idx ? 'active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`${i}번째 슬라이드`}
            />
          ))}
        </div>
        <button type="button" onClick={next} aria-label="다음">›</button>
      </div>
    </div>
  );
}
