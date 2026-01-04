// components/AboutUs.tsx
'use client';
import type { InviteMeta } from '@/lib/utils';

type Profile = {
  label: '신랑' | '신부';
  name: string;
  desc: string;
  birth: string;
  mbti: string;
  tags: string[];
  photo: string;
};

function parseNames(title: string) {
  if (!title) return ['신랑', '신부'];
  const parts = title.split(/&|·/).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts[1]];
  if (parts.length === 1) return [parts[0], '신부'];
  return ['신랑', '신부'];
}

export function AboutUs({ meta }: { meta: InviteMeta }) {
  const [groomName, brideName] = parseNames(meta.title);
  const profiles: Profile[] = [
    {
      label: '신랑',
      name: groomName,
      desc: '이아빠 · 박엄마의 아들',
      birth: '1990년 12월 10일',
      mbti: 'ISTP',
      tags: ['#캠핑', '#러닝'],
      photo: '/sample/about-groom.svg',
    },
    {
      label: '신부',
      name: brideName,
      desc: '이아빠 · 윤엄마의 딸',
      birth: '1993년 3월 14일',
      mbti: 'ESTJ',
      tags: ['#스노우보드', '#캠핑'],
      photo: '/sample/about-bride.svg',
    },
  ];

  return (
    <section className="section about-section">
      <p className="eyebrow">About Us</p>
      <h2 className="about-title">저희를 소개합니다</h2>

      <div className="about-grid">
        {profiles.map((p) => (
          <article className="about-card" key={p.label}>
            <div className="about-photo">
              <img src={p.photo} alt={`${p.label} ${p.name}`} loading="lazy" />
            </div>
            <div className="about-label">{p.label}</div>
            <div className="about-name">{p.name}</div>
            <div className="about-desc">{p.desc}</div>
            <div className="about-meta">{p.birth}</div>
            <div className="about-meta">{p.mbti}</div>
            <div className="about-tags">{p.tags.join(' ')}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
