// components/Guestbook.tsx (전체 교체)
'use client';
import { useEffect, useMemo, useState } from 'react';
import type { InviteMeta } from '@/lib/utils';
import { isDemo } from '@/lib/utils';

type Entry = { name: string; message: string; time?: string };

export default function Guestbook({ meta }: { meta: InviteMeta }) {
  const gasUrl = meta.gasGuestbookUrl || process.env.NEXT_PUBLIC_GUESTBOOK_URL || '';
  const inactive = !gasUrl;
  const sample: Entry[] = useMemo(
    () => [
      {
        name: '한지은',
        message: '맑고 따뜻한 사랑이 언제나 이어지길 바랍니다. 앞으로도 행복하세요 🤍',
        time: '2025-04-24 20:38',
      },
      {
        name: '송하윤',
        message: '결혼 진심으로 축하해요💕 서로의 단짝 친구이자 사랑이 되길',
        time: '2025-04-24 20:38',
      },
      {
        name: '정해인',
        message: '영원히 서로의 든든한 버팀목이 되어주세요. 진심으로 축하드려요 🥂',
        time: '2025-04-24 20:38',
      },
    ],
    [],
  );

  const [entries, setEntries] = useState<Entry[]>(sample);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ name: '', message: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchEntries = async () => {
    if (inactive) return;
    setLoading(true);
    setError(null);
    try {
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
      setEntries(mapped.length ? mapped : sample);
    } catch {
      setError('방명록을 불러오지 못했습니다.');
      setEntries(sample);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inactive, gasUrl]);

  const visible = expanded ? entries : entries.slice(0, 3);
  const canExpand = !expanded && entries.length > visible.length;

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
      const res = await fetch(gasUrl, {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          message: form.message.trim(),
          password: form.password.trim(),
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      // 저장 직후 바로 리스트 다시 불러오기
      setForm({ name: '', message: '', password: '' });
      await fetchEntries();
    } catch (err) {
      setError('작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="guestbook">
      <div className="guestbook-header">
        <p className="eyebrow">Guestbook</p>
        <h2 className="guestbook-title">방명록</h2>
        {inactive && (
          <p className="guestbook-note">
            {isDemo() ? '데모 모드입니다. ' : ''}
            구글 시트 URL이 없어 예시만 표시됩니다.
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
          <input
            name="password"
            placeholder="비밀번호(삭제용, 선택)"
            value={form.password}
            onChange={onChange}
            disabled={submitting}
            className="guestbook-input"
            type="password"
            autoComplete="off"
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
            </div>
            <div className="guestbook-divider" />
            <p className="guestbook-message">{item.message}</p>
            {item.time && <div className="guestbook-time">{item.time}</div>}
          </article>
        ))}
      </div>

      {canExpand ? (
        <button className="guestbook-more" type="button" onClick={() => setExpanded(true)}>
          더보기 ▼
        </button>
      ) : (
        <div className="guestbook-more dimmed">모두 확인했습니다</div>
      )}
    </div>
  );
}
