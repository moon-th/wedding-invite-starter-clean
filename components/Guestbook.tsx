// components/Guestbook.tsx (전체 교체)
'use client';
import { useEffect, useState } from 'react';
import type { InviteMeta } from '@/lib/utils';
import { isDemo } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { ensureAnonUid } from '@/lib/ensureAnon';
import { auth } from '@/lib/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

type Entry = { id?: string; name: string; message: string; time?: string; authorUid?: string };

export default function Guestbook({ meta }: { meta: InviteMeta }) {
  const useFirestore = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const gasUrl = meta.gasGuestbookUrl || process.env.NEXT_PUBLIC_GUESTBOOK_URL || '';
  const inactive = !gasUrl && !useFirestore;

  const MAX_FETCH = 30; // 불러오는 개수 제한
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [form, setForm] = useState({ name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchEntries = async () => {
    if (inactive) return;
    setLoading(true);
    setError(null);
    try {
      if (useFirestore) {
        const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(MAX_FETCH));
        const snap = await getDocs(q);
        const mapped = snap.docs.map((d) => {
          const data = d.data() as any;
          const ts: Timestamp | undefined = data.createdAt;
          return {
            id: d.id,
            name: data.name ?? '익명',
            message: data.message ?? '',
            time: ts ? ts.toDate().toISOString().replace('T', ' ').slice(0, 16) : '',
            authorUid: data.authorUid,
          };
        });
        setEntries(mapped);
      } else {
        const url = new URL(gasUrl);
        if (!url.searchParams.has('method')) url.searchParams.set('method', 'list');
        url.searchParams.set('_ts', String(Date.now()));

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.list)
          ? data.list
          : Array.isArray(data?.rows)
            ? data.rows
            : null;
        if (!Array.isArray(list)) return;

        const mapped = list.map((it: any) => ({
          name: it?.name ?? '익명',
          message: it?.message ?? '',
          time: String(it?.timestamp ?? it?.created_at ?? it?.time ?? ''),
        }));
        setEntries(mapped);
      }
    } catch (err) {
      setError('방명록을 불러오지 못했습니다.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inactive, gasUrl]);

  const visible = entries.slice(0, visibleCount);
  const canExpand = entries.length > visible.length;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inactive) return;
    if (!form.name.trim() || !form.message.trim()) {
      setError('이름과 메시지를 입력해주세요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (useFirestore) {
        const uid = await ensureAnonUid();
        await addDoc(collection(db, 'guestbook'), {
          name: form.name.trim(),
          message: form.message.trim(),
          authorUid: uid,
          createdAt: serverTimestamp(),
        });
      } else {
        const res = await fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify({
            name: form.name.trim(),
            message: form.message.trim(),
          }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
      }
      // 저장 직후 바로 리스트 다시 불러오기
      setForm({ name: '', message: '' });
      await fetchEntries();
    } catch (err) {
      setError('작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (entry: Entry) => {
    if (!useFirestore || !entry.id || !entry.authorUid) return;
    const uid = await ensureAnonUid();
    if (uid !== entry.authorUid) return;
    const confirmed = typeof window !== 'undefined' ? window.confirm('삭제하시겠습니까?') : false;
    if (!confirmed) return;
    await deleteDoc(doc(db, 'guestbook', entry.id));
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
  };

  return (
    <div className="guestbook">
      <div className="guestbook-header">
        <p className="eyebrow">Guestbook</p>
        <h2 className="guestbook-title">방명록</h2>
        {inactive && (
          <p className="guestbook-note">
            {isDemo() ? '데모 모드입니다. ' : ''}
            방명록 설정이 없어 작성/조회가 비활성화되었습니다.
          </p>
        )}
      </div>

      {!inactive && (
        <form className="guestbook-form" onSubmit={onSubmit}>
          <input
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={onChange}
            disabled={submitting}
            className="guestbook-input"
          />
          <textarea
            name="message"
            placeholder="축하 메시지를 남겨주세요"
            value={form.message}
            onChange={onChange}
            disabled={submitting}
            className="guestbook-textarea"
            rows={3}
          />
          <button className="guestbook-btn" type="submit" disabled={submitting}>
            {submitting ? '작성 중...' : '작성하기'}
          </button>
        </form>
      )}
      {error && <p className="guestbook-note" style={{ color: '#d45b5b' }}>{error}</p>}
      {loading && <p className="guestbook-note">불러오는 중...</p>}

      <div className="guestbook-list">
        {visible.map((item, idx) => (
          <article className="guestbook-card" key={idx}>
            <div className="guestbook-meta">
              <span className="guestbook-from">from. {item.name}</span>
              {useFirestore && item.authorUid === auth.currentUser?.uid && item.id && (
                <button
                  type="button"
                  aria-label="삭제"
                  className="guestbook-delete text"
                  onClick={() => onDelete(item)}
                >
                  삭제
                </button>
              )}
            </div>
            <div className="guestbook-divider" />
            <p className="guestbook-message">{item.message}</p>
            {item.time && <div className="guestbook-time">{item.time}</div>}
          </article>
        ))}
      </div>

      {canExpand ? (
        <button className="guestbook-more" type="button" onClick={() => setVisibleCount((v) => v + 5)}>
          더보기 ▼
        </button>
      ) : (
        <div className="guestbook-more dimmed">모두 확인했습니다</div>
      )}
    </div>
  );
}
