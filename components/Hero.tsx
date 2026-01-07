import { formatDate, type InviteMeta } from '@/lib/utils';

export default function Hero({ meta }: { meta: InviteMeta }) {
  return (
    <section className="section">
      <div className="cover">
        <img src="/src/image/main.jpg" alt="커버 이미지" />
      </div>
      <h1 className="title">{meta.title}</h1>
      <div className="subtitle">{formatDate(meta.date)} · {meta.place}</div>
      <div className="card">
        <p>소중한 분들을 모시고 함께하는 시간을 가지려 합니다.</p>
        <p>바쁘시더라도 참석하시어 축복해 주시면 감사하겠습니다.</p>
      </div>
    </section>
  );
}
