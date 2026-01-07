// lib/utils.ts
export type InviteMeta = {
  slug: string;
  title: string;
  date: string;      // YYYY-MM-DD
  time?: string;     // HH:mm
  place: string;
  address: string;
  coverId: string;
  imageIds: string[];
  gasGuestbookUrl?: string;
  theme?: string;
  active: boolean;
};

export function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

  // 날짜 + 요일 + (선택)시간 포맷
export function formatDateTime(iso: string, time?: string) {
  const d = new Date(iso + 'T00:00:00');
  const dow = '일월화수목금토'[d.getDay()];
  return `${formatDate(iso)} (${dow})${time ? ` ${time}` : ''}`;
}

export const isDemo = () => process.env.NEXT_PUBLIC_DEMO === '1';
export const isEditor = () => process.env.NEXT_PUBLIC_EDITOR === '1'; // 써도 안 써도 OK
