// components/ThankYouSection.tsx
'use client';

import KakaoShareButton from './KakaoShareButton';

export default function ThankYouSection() {
  return (
    <section className="thankyou-section">
      <div className="thankyou-hero">
        <div className="thankyou-overlay" />

        <div className="thankyou-content">
          <p className="thankyou-eyebrow">Thank you</p>
          <p className="thankyou-message">
            저희의 새로운 시작을
            <br />함께 해주셔서 감사합니다.
          </p>
          <div className="thankyou-line" />
          <p className="thankyou-names">
            문태환 <span className="heart">♥</span> 노나리
          </p>
        </div>

        <div className="thankyou-share">
          <KakaoShareButton />
        </div>
      </div>
    </section>
  );
}
