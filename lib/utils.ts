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

export const driveSrc = (fileId: string) =>
  `https://drive.google.com/file/d/${fileId}/view?usp=drive_link`;
  
// lib/utils.ts
/** ID만 받는 직링크 */
export const driveViewFromId = (id: string) =>
  `https://drive.google.com/uc?export=view&id=${id}`;

/** 고해상도 썸네일(권장). w{size} 픽셀 너비 */
export const driveThumbFromId = (id: string, size = 2000) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;

/** URL이든 ID든 받아서 최종 <img src> 로 반환 (기본: 썸네일) */
export function resolveImageSrc(input: string, size = 2000) {
  if (!input) return '';
  const s = String(input).trim();

  // 전체 URL인 경우 (보기 링크면 ID 추출 → 변환)
  if (/^https?:\/\//i.test(s)) {
    const m = s.match(/\/d\/([A-Za-z0-9_-]{10,})/);
    if (m) return driveThumbFromId(m[1], size); // 보기링크 → 썸네일
    return s; // 그 외 외부 URL은 그대로
  }

  // ID로 보이면 썸네일로
  if (/^[A-Za-z0-9_-]{10,}$/.test(s)) return driveThumbFromId(s, size);

  // 폴백
  return '/demo/g1.jpg';
}


  // 날짜 + 요일 + (선택)시간 포맷
export function formatDateTime(iso: string, time?: string) {
  const d = new Date(iso + 'T00:00:00');
  const dow = '일월화수목금토'[d.getDay()];
  return `${formatDate(iso)} (${dow})${time ? ` ${time}` : ''}`;
}

export const isDemo = () => process.env.NEXT_PUBLIC_DEMO === '1';
export const isEditor = () => process.env.NEXT_PUBLIC_EDITOR === '1'; // 써도 안 써도 OK
