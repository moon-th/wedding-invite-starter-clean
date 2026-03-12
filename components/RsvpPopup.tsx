// components/RsvpPopup.tsx
'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ensureAnonUid } from '@/lib/ensureAnon';

type Option = 'groom' | 'bride';
type Attendance = 'yes' | 'no';
type Bus = 'bus_yes' | 'bus_no';
type BusStop = 'sindorim' | 'sungui';

export default function RsvpPopup() {
  const [open, setOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(true);
  const [relation, setRelation] = useState<Option>('groom');
  const [attend, setAttend] = useState<Attendance>('yes');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companions, setCompanions] = useState('1'); // 1~10
  const [bus, setBus] = useState<Bus>('bus_no');
  const [busStop, setBusStop] = useState<BusStop>('sindorim');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFieldFocus = (e: React.FocusEvent<HTMLElement>) => {
    const target = e.currentTarget;
    window.setTimeout(() => {
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 250);
  };

  useEffect(() => {
    if (!open && !noticeOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open, noticeOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    const compNum = Number(companions);
    if (!name.trim() || !cleanPhone) {
      setError('성함과 연락처를 입력해 주세요.');
      return;
    }
    if (cleanPhone.length < 11) {
      setError('연락처는 11자리 이상 입력해 주세요.');
      return;
    }
    if (Number.isNaN(compNum) || compNum < 0 || compNum > 10) {
      setError('동행 인원은 0~10명 사이로 선택해 주세요.');
      return;
    }
    if (bus === 'bus_yes' && !busStop) {
      setError('셔틀버스 탑승 위치를 선택해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const uid = await ensureAnonUid();
      await addDoc(collection(db, 'rsvp'), {
        relation,
        attend,
        name: name.trim(),
        phone: cleanPhone,
        companions: compNum,
        bus,
        busStop: bus === 'bus_yes' ? busStop : '',
        authorUid: uid,
        createdAt: serverTimestamp(),
      });
      setOpen(false);
      setError(null);
      setSuccess(true);
    } catch (err) {
      console.error('RSVP submit error', err);
      alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="rsvp-cta">
        <button
          className="rsvp-btn"
          type="button"
          onClick={() => {
            setNoticeOpen(false);
            setOpen(true);
          }}
        >
          📝 참석 정보 전달
        </button>
      </div>

      {noticeOpen && (
        <div className="rsvp-overlay" onClick={() => setNoticeOpen(false)}>
          <div className="rsvp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rsvp-card rsvp-notice-card">
              <div className="rsvp-header">
                <h3>참석 정보 안내</h3>
                <button className="rsvp-close" type="button" onClick={() => setNoticeOpen(false)} aria-label="닫기">
                  ✕
                </button>
              </div>

              <div className="rsvp-notice-text">
                원활한 예식 준비를 위해
                <br />
                참석 여부와 셔틀버스 이용 정보를
                <br />
                미리 전달해 주시면 감사하겠습니다.
                <br />
                <br />
                바쁘시겠지만 잠시만 시간 내어
                <br />
                입력해 주시면 큰 도움이 됩니다.
              </div>

              <div className="rsvp-footer">
                <button type="button" className="rsvp-secondary" onClick={() => setNoticeOpen(false)}>
                  닫기
                </button>
                <button
                  type="button"
                  className="rsvp-primary"
                  onClick={() => {
                    setNoticeOpen(false);
                    setOpen(true);
                  }}
                >
                  입력
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="rsvp-overlay" onClick={() => setOpen(false)}>
          <div className="rsvp-modal" onClick={(e) => e.stopPropagation()}>
            <form className="rsvp-card" onSubmit={submit}>
              <div className="rsvp-header">
                <h3>참석 정보</h3>
                <button className="rsvp-close" type="button" onClick={() => setOpen(false)} aria-label="닫기">
                  ✕
                </button>
              </div>

              <div className="rsvp-group">
                <p className="rsvp-label">분류</p>
                <div className="rsvp-row">
                  <button
                    type="button"
                    className={`rsvp-pill ${relation === 'groom' ? 'active' : ''}`}
                    onClick={() => setRelation('groom')}
                  >
                    신랑 측
                  </button>
                  <button
                    type="button"
                    className={`rsvp-pill ${relation === 'bride' ? 'active' : ''}`}
                    onClick={() => setRelation('bride')}
                  >
                    신부 측
                  </button>
                </div>
              </div>

              <div className="rsvp-group">
                <p className="rsvp-label">참석</p>
                <div className="rsvp-row">
                  <button
                    type="button"
                    className={`rsvp-pill ${attend === 'yes' ? 'active' : ''}`}
                    onClick={() => setAttend('yes')}
                  >
                    참석
                  </button>
                  <button
                    type="button"
                    className={`rsvp-pill ${attend === 'no' ? 'active' : ''}`}
                    onClick={() => setAttend('no')}
                  >
                    불참
                  </button>
                </div>
              </div>

              <div className="rsvp-group">
                <p className="rsvp-label">참석인원(본인포함)</p>
                <select
                  className="rsvp-input"
                  value={companions}
                  onChange={(e) => setCompanions(e.target.value)}
                  onFocus={handleFieldFocus}
                >
                  {Array.from({ length: 10 }, (_, i) => String(i+1)).map((v) => (
                    <option key={v} value={v}>
                      {v}명
                    </option>
                  ))}
                </select>
              </div>

              <div className="rsvp-group">
                <p className="rsvp-label">셔틀버스</p>
                <div className="rsvp-row">
                  <button
                    type="button"
                    className={`rsvp-pill ${bus === 'bus_yes' ? 'active' : ''}`}
                    onClick={() => {
                      setBus('bus_yes');
                      setError(null);
                    }}
                  >
                    탑승
                  </button>
                  <button
                    type="button"
                    className={`rsvp-pill ${bus === 'bus_no' ? 'active' : ''}`}
                    onClick={() => {
                      setBus('bus_no');
                      setError(null);
                    }}
                  >
                    미탑승
                  </button>
                </div>
              </div>

              <div className="rsvp-group">
                <p className="rsvp-label">탑승 위치</p>
                <div className={`rsvp-row ${bus === 'bus_no' ? 'disabled' : ''}`}>
                  <button
                    type="button"
                    className={`rsvp-pill ${busStop === 'sindorim' ? 'active' : ''}`}
                    onClick={() => setBusStop('sindorim')}
                    disabled={bus === 'bus_no'}
                  >
                    신도림
                  </button>
                  <button
                    type="button"
                    className={`rsvp-pill ${busStop === 'sungui' ? 'active' : ''}`}
                    onClick={() => setBusStop('sungui')}
                    disabled={bus === 'bus_no'}
                  >
                    숭의교회
                  </button>
                </div>
              </div>

              <div className="rsvp-group">
                <p className="rsvp-label">성함</p>
                <input
                  className="rsvp-input"
                  placeholder="성함을 입력해 주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={handleFieldFocus}
                  required
                />
              </div>

              <div className="rsvp-group">
                <p className="rsvp-label">연락처</p>
                <input
                  className="rsvp-input"
                  placeholder="연락처를 입력해 주세요"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={handleFieldFocus}
                  required
                />
              </div>

              {error && <p className="rsvp-error">{error}</p>}

              <div className="rsvp-footer">
                <button type="button" className="rsvp-secondary" onClick={() => setOpen(false)}>
                  닫기
                </button>
                <button type="submit" className="rsvp-primary" disabled={submitting}>
                  {submitting ? '전송 중...' : '참석 정보 전달하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {success && (
        <div className="rsvp-toast" onAnimationEnd={() => setSuccess(false)}>
          참석 정보 감사합니다.
        </div>
      )}
    </>
  );
}
