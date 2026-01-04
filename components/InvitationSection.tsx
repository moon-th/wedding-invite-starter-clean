// components/InvitationSection.tsx
import React from 'react';

export function InvitationSection() {
  return (
    <section className="invitation-section" id="invitation">
      <div className="invitation-frame">
        {/* 위에 꽃 그림 들어갈 자리 (원하면 나중에 이미지 넣기) */}
        {/* <img src="/path/to/flower.svg" alt="" className="invitation-flower" /> */}

        <p className="eyebrow">Invitation</p>
        <p className="invitation-title section-title">초대합니다</p>

     

        {/* 본문 블럭 */}
        <div className="invitation-text invitation-body">
          <p>
            저희의 작은 만남이 사랑으로 자라
            <br />
            오늘 결혼이라는 약속으로 이어졌습니다.
          </p>

          <p>
            산골소년과 바다소녀,
            <br />
            서로 다른 풍경에서 자라온 두 사람이
            <br />
            이제 같은 계절을 걸어가려 합니다.
          </p>

          <p>
            평생 서로를 귀히 여기며
            <br />
            처음의 마음을 잃지 않고
            <br />
            존중과 배려로 함께하겠습니다.
          </p>

          <p>
            함께해 주시는 축복을
            <br />
            큰 기쁨으로 간직하겠습니다.
          </p>

          <p>
           - 태환&middot;나리 드림 -
          </p>
        </div>
      </div>
    </section>
  );
}
