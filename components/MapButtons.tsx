import { type InviteMeta } from '@/lib/utils';

export default function MapButtons({ meta }: { meta: InviteMeta }) {
  const kakao = `https://map.kakao.com/?q=${encodeURIComponent(meta.place)}`;
  const naver = `nmap://search?query=${encodeURIComponent(meta.place)}`;
  const naverWeb = `https://map.naver.com/p/search/${encodeURIComponent(meta.place)}`;
  return (
    <div className="row" style={{marginTop:10}}>
      <a className="btn col" href={kakao} target="_blank" rel="noreferrer">카카오맵</a>
      <a className="btn col" href={naver} >네이버앱</a>
      <a className="btn col" href={naverWeb} target="_blank" rel="noreferrer">네이버지도</a>
    </div>
  );
}
