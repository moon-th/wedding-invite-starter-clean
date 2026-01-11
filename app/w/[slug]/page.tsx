// app/w/[slug]/page.tsx
import path from 'node:path';
import fs from 'node:fs/promises';

import { formatDate, type InviteMeta } from '@/lib/utils';

import MobileHero from '@/components/MobileHero';
import { InvitationSection } from '@/components/InvitationSection';
import { WeddingCalendar } from '@/components/WeddingCalendar';
import Gallery from '@/components/Gallery';
import Guestbook from '@/components/Guestbook';
import { CopyButton } from '@/components/CopyButton';
import { AboutUs } from '@/components/AboutUs';
import KakaoMap from '@/components/KakaoMap';
import RsvpPopup from '@/components/RsvpPopup';

import AccountAccordion from '@/components/AccountAccordion';

// ───────────────────────────────────────────────────────────
// 정적 export용: 빌드 시 포함할 slug 목록 생성
export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'registry');
  const files = await fs.readdir(dir).catch(() => []);
  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ slug: f.replace(/\.json$/, '') }));
}

// 정적 export에서 빌드된 슬러그만 허용
export const dynamicParams = false;

// 레지스트리에서 메타 로드
async function loadMeta(slug: string): Promise<InviteMeta | null> {
  const file = path.join(process.cwd(), 'public', 'registry', `${slug}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as InviteMeta;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────
// 페이지
export default async function InvitePage({ params }: { params: { slug: string } }) {
  const meta = await loadMeta(params.slug);

  if (!meta) {
    return (
      <main className="container">
        <h1 className="title">존재하지 않는 초대장입니다.</h1>
        <p className="meta">public/registry/{params.slug}.json 파일을 확인해주세요.</p>
      </main>
    );
  }
  if (!meta.active) {
    return (
      <main className="container">
        <h1 className="title">비공개 또는 만료된 초대장입니다.</h1>
      </main>
    );
  }

  return (
    <>
      {/* 모바일 우선 히어로(폰 프레임 없이 바로 시작) */}
      <MobileHero meta={meta} />
      <div className="hero-fade" aria-hidden="true" />
   
      <main className="container">

      <InvitationSection />
      <AboutUs meta={meta} />
      <WeddingCalendar year={2026} month={5} weddingDay={9} />
      
      

        <div className="divider" />

        {/* 갤러리 */}
        <section className="section anchor" id="gallery">
          <div className="gallery-head">
            <p className="eyebrow">gallery</p>
            <h2 className="gallery-title">갤러리</h2>
          </div>
          <Gallery imageIds={meta.imageIds} />
        </section>

        <div className="divider" />

  {/* 예식 안내 */}
        <section className="section anchor" id="info">

          {/* 모바일: 세로, 데스크톱: 2열 */}
          <div className="location-card">
            <p className="eyebrow">Location</p>
            <h2 className="location-title">오시는 길</h2>

            <div className="location-lines">
              <div className="location-line">
                <span className="pill-value">
                  {formatDate(meta.date)} {meta.time}
                </span>
              </div>
              <div className="location-line">
                <span className="pill-value">{meta.place}</span>
              </div>
              <div className="location-line">
                <CopyButton text={meta.address} />
                <span className="pill-value">{meta.address}</span>
              </div>
            </div>

            <div className="location-map">
              <KakaoMap address={meta.address} place={meta.place} fallbackLat={33.450701} fallbackLng={126.570667} />
            </div>

            <div className="location-actions">
              <a
                className="btn ghost location-action"
                href={`https://map.naver.com/p/search/${encodeURIComponent(meta.place)}`}
                target="_blank"
                rel="noreferrer"
              >
                <img src="/icons/navermap.png" alt="" className="action-icon" aria-hidden="true" />
                네이버지도
              </a>
          
              <a
                className="btn ghost location-action"
                href={`https://map.kakao.com/?q=${encodeURIComponent(meta.place)}`}
                target="_blank"
                rel="noreferrer"
              >
                <img src="/icons/kakaomap.png" alt="" className="action-icon" aria-hidden="true" />
                카카오맵
              </a>
                  <a
                className="btn ghost location-action"
                href={`https://map.tmap.co.kr/search/${encodeURIComponent(meta.place)}`}
                target="_blank"
                rel="noreferrer"
              >
                <img src="/icons/tmap.jpeg" alt="" className="action-icon" aria-hidden="true" />
                티맵
              </a>
            </div>
          </div>
        </section>

        {/* 방명록 */}
        <section className="section anchor" id="guestbook">
          
          <Guestbook meta={meta} />
        </section>

        <div className="divider" />

        {/* (선택) 계좌 안내 – 필요 시 데이터 채워 사용 */}
        <AccountAccordion
          groom={{ bank: '국민', no: '123456-01-000000', name: '문태환' }}
          bride={{ bank: '신한', no: '110-000-000000', name: '노나리' }}
        />

        <section className="section info-guide">
          <p className="eyebrow">Information</p>
          <h2 className="info-title">안내사항</h2>

          <div className="info-card">
            <div className="info-image">
              <img src="/sample/info-placeholder.svg" alt="식사 안내 이미지" />
            </div>
            <h3 className="info-heading">연회 & 식사 안내</h3>
            <p className="info-body">
              식사는 결혼식 및 사진 촬영이 끝난 후
              <br />
              웨딩홀 2층에서 뷔페식으로 진행됩니다.
            </p>
            <p className="info-body">
              한식 · 중식 · 양식 · 일식 등
              <br />
              다채로운 메뉴가 마련되어 있으니,
              <br />
              편안하게 즐겨 주시기 바랍니다.
            </p>
          </div>
        </section>

        <RsvpPopup />

        {/* 하단 고정 CTA */}
        <footer>© {new Date().getFullYear()} Wedding Invite · Static export</footer>
      </main>
    </>
  );
}
