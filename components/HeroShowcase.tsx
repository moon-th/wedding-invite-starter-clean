import { formatDateTime, type InviteMeta } from '@/lib/utils';

export default function HeroShowcase({ meta }: { meta: InviteMeta }) {
  return (
    <section style={{padding:'24px 0 8px', background:'#faf9f7'}}>
      <div style={{maxWidth:1040, margin:'0 auto', padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 520px 1fr', gap:16, alignItems:'center'}}>
        {/* 좌측 3박스 CTA */}
        <div style={{display:'grid', gap:12}}>
          {[
            { label:'모바일 청첩장 만들기', href:'#guestbook' },
            { label:'모바일 접속 문자 전송', href:'#info' },
            { label:'PC에서 바로보기', href:'#gallery' },
          ].map((it, i) => (
            <a key={i} href={it.href}
               style={{border:'1px solid #e5e1dc', borderRadius:12, padding:'16px 18px', background:'#fff'}}>
              <div style={{fontWeight:700, marginBottom:6}}>{it.label}</div>
              <div style={{fontStyle:'italic', color:'#9a968f'}}>click</div>
            </a>
          ))}
        </div>

        {/* 가운데 폰 목업 */}
        <div style={{display:'flex', justifyContent:'center'}}>
          <div style={{
            width: 330, height: 640, borderRadius: 36, background:'#fff',
            boxShadow:'0 20px 50px rgba(0,0,0,.08)', border:'1px solid #e9e4de',
            position:'relative', overflow:'hidden'
          }}>
            {/* 상단 테두리(스피커 자리 느낌) */}
            <div style={{position:'absolute', top:10, left:'50%', transform:'translateX(-50%)',
                         width:80, height:6, borderRadius:3, background:'#d8d5cf'}}/>
            {/* 카드 영역 */}
            <div style={{position:'absolute', inset:0, display:'grid', gridTemplateRows:'auto 1fr auto'}}>
              {/* 카드 상단 텍스트 */}
              <div style={{padding:'28px 22px 10px', textAlign:'center'}}>
                <div style={{letterSpacing:'.14em', fontSize:11, color:'#9b9b9b'}}>WEDDING INVITATION</div>
                <div style={{fontSize:20, fontWeight:800, marginTop:10}}>{meta.title}</div>
                <div style={{fontSize:13, color:'#6f6b66', marginTop:6}}>
                  {formatDateTime(meta.date, meta.time)}<br/>{meta.place}
                </div>
              </div>
              {/* 플로럴 디바이더 + 사진 */}
              <div style={{position:'relative'}}>
                {/* 플로럴 */}
                <svg viewBox="0 0 600 80" preserveAspectRatio="none"
                     style={{display:'block', width:'100%', height:80, color:'#aeb2b4'}}>
                  <path d="M0,40 C70,10 130,70 200,40 C270,10 330,70 400,40 C470,10 530,70 600,40 L600,80 L0,80 Z"
                        fill="currentColor" opacity="0.7"/>
                </svg>
                {/* 사진 */}
                <div style={{position:'absolute', top:40, left:0, right:0, bottom:0, overflow:'hidden'}}>
                  <img
                    src="/src/image/main.jpg"
                    alt="cover"
                    style={{width:'100%', height:'100%', objectFit:'cover'}}
                  />
                  <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.25), rgba(0,0,0,0) 55%)'}}/>
                </div>
              </div>
              {/* 하단 캡션 */}
              <div style={{padding:'10px 0 16px', textAlign:'center', color:'#8b8b8b', fontSize:11}}>
                wedding invitation
              </div>
            </div>
          </div>
        </div>

        {/* 우측 공간(빈 카드로 균형) */}
        <div style={{opacity:.0}}>.</div>
      </div>
    </section>
  );
}
