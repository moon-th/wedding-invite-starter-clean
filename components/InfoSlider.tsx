// components/InfoSlider.tsx
'use client';

import { useState } from 'react';

const slides = [
  {
    kind: 'location',
    title: '셔틀버스 안내',
    intro: '신도림역에서 왕복 셔틀버스를 이용하실 수 있습니다.',
    sections: [
      {
        label: '서울 출발',
        place: '신도림역 1번 출구 인근 버스정류장',
        time: '오전 8시 30분',
      },
      {
        label: '예식장 출발',
        place: '결혼식장 앞',
        time: '오후 4시 30분',
      },
    ],
    buttonLabel: '탑승위치보기',
    href: 'https://kko.to/3XykbuLDIn',
  },
  {
    kind: 'text',
    title: '식사 안내',
    lines: [
      '연회장 이동 없이 앉은 자리에서', 
      '식사하시면 됩니다.',
      '식사는 홀 좌우에 세팅된 뷔페',
      '이용하시면 됩니다.',
      '편안하게 즐겨주세요.',
    ],
  },
];

export default function InfoSlider() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((p) => (p + 1) % slides.length);
  const prev = () => setIdx((p) => (p - 1 + slides.length) % slides.length);
  const offset = -100 * idx;

  return (
    <div className="info-slider">
      <div
        className="info-slider-rail"
        style={{
          transform: `translateX(${offset}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div className="info-slide" key={i}>
            <div className="info-slide-card">
        
              <h4>{slide.title}</h4>
              {slide.kind === 'location' ? (
                <div className="info-location-body">
                  <p className="info-location-intro">{slide.intro}</p>
                  <div className="info-location-sections">
                    {slide.sections.map((section) => (
                      <div className="info-location-section" key={section.label}>
                        <div className="info-location-label">{section.label}</div>
                        <div className="info-location-place">{section.place}</div>
                        <div className="info-location-time">{section.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ul className="info-text-list">
                  {slide.lines.map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              )}
              {slide.kind === 'location' && slide.href && (
                <a
                  className="info-location-btn"
                  href={slide.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {slide.buttonLabel}
                </a>
              )}
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
