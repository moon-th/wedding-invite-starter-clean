export default function NavBar() {
    const items = [
      { id: 'info', label: '예식 안내' },
      { id: 'gallery', label: '사진 갤러리' },
      { id: 'guestbook', label: '방명록' },
    ];
    return (
      <nav className="nav">
        <div className="inner">
          {items.map(it => (
            <a key={it.id} href={`#${it.id}`}>{it.label}</a>
          ))}
        </div>
      </nav>
    );
  }
  