// components/RsvpPopup.tsx
'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ensureAnonUid } from '@/lib/ensureAnon';
import { getAuth } from 'firebase/auth';

type Option = 'groom' | 'bride';
type Attendance = 'yes' | 'no';

export default function RsvpPopup() {
  const [open, setOpen] = useState(false);
  const [relation, setRelation] = useState<Option>('groom');
  const [attend, setAttend] = useState<Attendance>('yes');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!name.trim() || !cleanPhone) {
      setError('성함과 연락처를 입력해 주세요.');
      return;
    }
    if (cleanPhone.length < 11) {
      setError('연락처는 11자리 이상 입력해 주세요.');
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
        <button className="rsvp-btn" type="button" onClick={() => setOpen(true)}>
          📝 참석 정보 전달
        </button>
      </div>

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
                <p className="rsvp-label">성함</p>
                <input
                  className="rsvp-input"
                  placeholder="성함을 입력해 주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
          참석 정보 전달 감사합니다.
        </div>
      )}
    </>
  );
}
