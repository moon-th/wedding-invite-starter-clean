export default function TopImageSection() {
  return (
    <section className="top-image-section" aria-label="상단 이미지">
      <div className="top-image-frame">
        <img src="/src/image/top.png" alt="상단 안내 이미지" className="top-image-photo" loading="eager" />
      </div>
    </section>
  );
}
