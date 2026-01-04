import { formatDate, type InviteMeta } from '@/lib/utils';

export default function Info({ meta }: { meta: InviteMeta }) {
  return (
    <section className="section anchor" id="info">
      <h2>예식 안내</h2>
      <div className="grid">
        <div className="kv">
          <div className="k">일시</div>
          <div className="v">{formatDate(meta.date)}</div>
        </div>
        <div className="kv">
          <div className="k">장소</div>
          <div className="v">{meta.place}</div>
        </div>
      </div>
      <div className="card" style={{marginTop:10}}>
        <p className="meta">아래 버튼으로 길찾기를 열 수 있어요.</p>
        <a className="btn" href={`https://map.kakao.com/?q=${encodeURIComponent(meta.place)}`} target="_blank" rel="noreferrer">카카오맵 열기</a>
      </div>
    </section>
  );
}
