'use client';
import { useState } from 'react';

type AccountItem = { bank: string; no: string; name: string };
type AccountInput = AccountItem | AccountItem[];
type Props = {
  groom?: AccountInput;
  bride?: AccountInput;
};

export default function AccountAccordion({ groom, bride }: Props) {
  const groomList: AccountItem[] = groom ? (Array.isArray(groom) ? groom : [groom]) : [];
  const brideList: AccountItem[] = bride ? (Array.isArray(bride) ? bride : [bride]) : [];

  const [open, setOpen] = useState<{ groom: boolean; bride: boolean }>({
    groom: true,
    bride: true,
  });

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text.replace(/\s+/g, ''));
      alert('복사되었습니다.');
  } catch {}
  }

  if (!groomList.length && !brideList.length) return null;

  return (
    <section className="section anchor gift-section" id="gift">
      <div className="gift-header">
        <p className="eyebrow">Account</p>
        <h2 className="gift-title">마음 전하는 곳</h2>
        <p className="gift-desc">
          참석이 어려우신 분들을 위해
          <br />
          계좌번호를 안내해 드립니다.
          <br />
          너그러운 마음으로 양해 부탁드립니다.
        </p>
      </div>

      <div className="gift-accordion">
        {groomList.length > 0 && (
          <div className="gift-panel">
            <button
              className="gift-toggle"
              type="button"
              onClick={() => setOpen((v) => ({ ...v, groom: !v.groom }))}
            >
              <span>신랑측 계좌번호</span>
              <span className="gift-arrow">{open.groom ? '▴' : '▾'}</span>
            </button>
            {open.groom && (
              <div className="gift-list">
                {groomList.map((item) => (
                  <AccountRow key={`${item.name}-${item.no}`} item={item} onCopy={copy} />
                ))}
              </div>
            )}
          </div>
        )}

        {brideList.length > 0 && (
          <div className="gift-panel">
            <button
              className="gift-toggle"
              type="button"
              onClick={() => setOpen((v) => ({ ...v, bride: !v.bride }))}
            >
              <span>신부측 계좌번호</span>
              <span className="gift-arrow">{open.bride ? '▴' : '▾'}</span>
            </button>
            {open.bride && (
              <div className="gift-list">
                {brideList.map((item) => (
                  <AccountRow key={`${item.name}-${item.no}`} item={item} onCopy={copy} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function AccountRow({ item, onCopy }: { item: AccountItem; onCopy: (text: string) => void }) {
  return (
    <div className="gift-row">
      <div className="gift-name">{item.name}</div>
      <div className="gift-bank">
        {item.bank} {item.no}
      </div>
      <button className="gift-copy" onClick={() => onCopy(item.no)} aria-label="계좌번호 복사">
        📋
      </button>
    </div>
  );
}
