const NAV_ITEMS = [
  { href: '#calendar', label: '일정' },
  { href: '#gallery', label: '갤러리' },
  { href: '#info', label: '오시는길' },
  { href: '#guestbook', label: '방명록' },
  { href: '#photo-upload', label: '사진업로드' },
  { href: '#gift', label: '마음전하기' },
];

export default function SectionNav() {
  return (
    <nav className="section-nav" aria-label="섹션 이동">
      <div className="section-nav-inner">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="section-nav-link">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
