const { useEffect, useState } = React;

// Backgrounds (3 images)
const BG = { swings:"assets/bg-swings.png", exterior:"assets/bg-exterior.png", corridor:"assets/bg-corridor.png" };

function useAudioAutoplay(){
  useEffect(()=>{
    const a=document.getElementById("bgm"); if(!a) return;
    const kick=()=>{ a.muted=false; a.play().catch(()=>{});
      window.removeEventListener("click",kick); window.removeEventListener("touchstart",kick); };
    a.play().catch(()=>{});
    window.addEventListener("click",kick,{once:true});
    window.addEventListener("touchstart",kick,{once:true});
  },[]);
}
function useSfx(){
  const play=(type="msg")=>{ try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(); const g=ctx.createGain(); o.connect(g); g.connect(ctx.destination);
    const t=ctx.currentTime; let f=1000; if(type==="tick") f=660;
    o.frequency.value=f; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.35,t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.18); o.start(t); o.stop(t+0.2);
  }catch{} }; return play;
}

const SCENES=[
 {id:"guide",bg:"swings",time:"Hướng dẫn",render:(s,ss,a)=>(<>
   <h1>Ngày của em</h1>
   <p><strong>Chào mừng bạn đến với vùng đất âm thanh.</strong> Ở đây, bạn sẽ lắng nghe chính mình suốt một ngày học. Mỗi lựa chọn sẽ mở ra <em>một trang kể lại diễn biến</em>, rồi bạn tiếp tục đi tiếp.</p>
   <ul className="rulelist">
     <li>Nhạc nền phát ngay khi vào (điện thoại có thể cần chạm một cái).</li>
     <li>FOMO tăng khi bạn bị kéo bởi ánh nhìn người khác; giảm khi bạn hiện diện, chủ động.</li>
     <li>Cuối ngày có tóm tắt, chỉ số FOMO và lời gợi ý nhẹ nhàng.</li>
   </ul>
   <div className="footer"><button className="btn" onClick={()=>a.goto("name")}>Vào game</button></div>
 </>)},
 {id:"name",bg:"exterior",time:"5:30",render:(s,ss,a)=>(<>
   <p>Cho mình biết tên để mọi người gọi đúng: </p>
   <input className="input" placeholder="Tên của bạn…" value={s.name||""} onChange={e=>ss({...s,name:e.target.value})}/>
   <div className="footer"><button className="btn" disabled={!s.name?.trim()} onClick={()=>a.goto("wake")}>Bắt đầu</button></div>
 </>)},
 {id:"wake",bg:"corridor",time:"5:30",
  text:n=>`Sáng sớm. Chuông reo. Mẹ gọi: "Dậy ăn sáng nè ${n}!"`,
  choices:n=>[
    {label:"Mở điện thoại xem thông báo",delta:+0.5,outcome:`Màn hình sáng rực như một quán chợ online. Story, thông báo, tin nhắn — tất cả chen nhau lên tiếng. Ngón tay bạn lướt nhanh, sợ bỏ lỡ thứ gì đó quan trọng mà lại không gọi tên được. Bên ngoài, ánh nắng đầu ngày đang tràn qua khung cửa, tiếng chổi của cô lao công quét chầm chậm dưới sân. Bạn không nhìn thấy chúng. Khi mẹ gọi lần hai, bạn ngẩng lên chớp mắt — mặt trời đã cao hơn một chút, còn lòng bạn thì… như vừa ăn một bữa sáng nhiều đường, nhưng vẫn đói.`},
    {label:"Tắt chuông, duỗi người, hít sâu",delta:-0.2,outcome:`Bạn đặt điện thoại úp xuống. Cột sống duỗi ra một tiếng “rắc” nho nhỏ, hơi thở chảy đến tận bụng. Mùi cơm mới bốc lên từ bếp, nghe như tiếng nhạc dạo rất chậm. Bạn ngồi dậy, thấy đầu óc sáng thêm một nấc, và hôm nay — có vẻ — sẽ đủ thời gian cho những điều nhỏ mà thật.`},
    {label:"Nhắn bạn thân: 'Dậy chưa?'",delta:+0.1,outcome:`Bạn: “Ê dậyyyy.” • Bạn thân: “Chưa… ngủ nốt 5p :))”. Bạn bật cười, bỗng thấy mọi thứ gần gũi. Nhưng ngón tay đã mở sẵn cửa sổ chat, và cánh cửa của buổi sáng cũng mở theo hướng đó. Bạn nhìn gương mặt mình phản chiếu trên màn hình: hơi phì cười, một chút lơ đễnh, rất đáng yêu — và hơi lệ thuộc.`},
    {label:"Ra bàn ăn ngay cho nóng",delta:-0.05,outcome:`Bạn kéo ghế. Mẹ đặt trứng ốp la xuống, lòng đỏ như mặt trời nằm trên đĩa. Hai mẹ con nói vài câu linh tinh, chẳng có gì quan trọng, nhưng căn bếp bỗng dày dặn. Điện thoại nằm yên, và bạn thấy mình đang có mặt ở đây.`}
  ], next:"pickup"},
 {id:"pickup",bg:"exterior",time:"6:15",
  text:n=>`Xe đưa rước dừng trước cổng nhà. ${n} bước lên, vài bạn đã vẫy tay.`,
  choices:n=>[
    {label:"Cắm tai nghe, lướt TikTok",delta:+0.3,outcome:`Chiếc xe chạy mượt như một đoạn reel. Thế giới cuộn về phía trước bằng nhịp 15 giây một lần. Đến khi xe thắng trước cổng trường, bạn rút tai nghe ra mà vẫn nghe thấy nhạc trong đầu. Bầu trời thật lên màu chậm hơn bạn tưởng.`},
    {label:"Chào bác tài, ngồi cạnh bạn nói chuyện",delta:-0.1,outcome:`“Hôm nay kiểm tra đúng không?” — “Ừ, chắc qua nổi á.” Câu chuyện không có điểm nhấn, nhưng tiếng cười nhỏ của hai đứa khiến con đường ngắn lại. Bạn nhận ra, đôi khi điều mình cần không phải là tin tức mới, mà là một người ngồi cạnh và cùng nhìn qua cửa kính.`},
    {label:"Chụp trời đăng story",delta:+0.2,outcome:`Ảnh trời xanh căng, caption tinh tế, vài hiệu ứng lấp lánh. Bức ảnh đẹp thật — nhưng trong lúc chỉnh màu, bạn lỡ bỏ qua khoảnh khắc nắng sượt qua những tán lá, và gió mát lùa vào khoang xe. Bức ảnh ở lại, còn khoảnh khắc thì đã đi.`}
  ], next:"class1"},
 {id:"class1",bg:"corridor",time:"7:00",
  text:n=>`Trong lớp. Cô giảng bài, tiếng phấn kêu cọt kẹt nhẹ.`,
  choices:n=>[
    {label:"Lén xem group chat lớp khác",delta:+0.4,outcome:`Tin nhắn dồn dập như mưa đá. “Bạn ${n} ơi, em có nghe không?” — cô gọi. Cả lớp rộ lên tiếng cười. Bạn đỏ mặt, tim đập nhanh; bài giảng trên bảng bỗng xa như một thành phố khác. Bạn đặt điện thoại xuống, muộn màng nhận ra vừa làm mình bé lại vì một cuộc vui không dành cho mình.`},
    {label:"Ghi chép đều tay",delta:-0.2,outcome:`Nhịp bút kéo bạn về với hiện tại. Mỗi dòng chữ là một sợi dây neo. Bạn không chắc đã hiểu hết, nhưng cảm giác “đang ở đây” lặng lẽ làm bạn bình tĩnh hơn.`},
    {label:"Hỏi lại chỗ chưa hiểu",delta:-0.1,outcome:`Bạn giơ tay: “Cô ơi, chỗ này dùng công thức nào ạ?” • Cô mỉm cười: “Thử hệ thức Viet nhé.” Cả lớp quay xuống, không phải vì soi, mà vì tôn trọng. Bạn nhận ra: hóa ra đặt câu hỏi cũng là một kiểu can đảm.`}
  ], next:"break1"},
 {id:"break1",bg:"swings",time:"8:30",
  text:n=>`Ra chơi. Sân rợp bóng phượng, ghế xích đu kẽo kẹt khẽ.`,
  choices:n=>[
    {label:"Xuống sân chơi thật",delta:-0.15,outcome:`Bạn chạy vài vòng, mồ hôi rịn trên trán. Tiếng gọi bạn bè vang như chuông nhỏ. Bạn ngồi xuống ghế thở, bỗng thấy cơ thể mình biết nói “mình vui”.`},
    {label:"Ở lại lớp, xem story người khác",delta:+0.25,outcome:`Ai đó đi biển, ai đó mở quán, ai đó đăng ảnh tập gym. Mỗi story là một cuộc đời nhỏ, và cuộc đời bạn — trong khoảnh khắc — chỉ là một ngón tay kéo xuống.`},
    {label:"Đăng story 'chán ghê' chờ ai đó nhắn",delta:+0.35,outcome:`Thông báo nhảy lên. Tim bạn cũng nhảy theo. Nhưng mỗi lần tắt màn hình, cái trống rỗng lại trở về — như một vị khách không mời.`}
  ], next:"lunch"},
 {id:"lunch",bg:"corridor",time:"10:45",
  text:n=>`Căn tin ồn mà ấm. Mùi canh nóng bốc lên, bàn chân nhịp trên nền gạch.`,
  choices:n=>[
    {label:"Ngồi một mình + xem video",delta:+0.25,outcome:`Cơm nguội một nửa, video nóng hổi. Bạn cười một mình, rồi bỗng thấy mệt — giống như vừa nói chuyện lâu với một người không biết bạn là ai.`},
    {label:"Ngồi cùng nhóm bạn, kể chuyện nhỏ",delta:-0.1,outcome:`“Chiều có thể dục đó.” — “Ok mai nhớ mang giày.” Một câu chuyện ngắn ngủi đủ để bữa trưa có mùi của người thân.`}
  ], next:"ending"}
];

function App(){
  useAudioAutoplay();
  const sfx=useSfx();
  const [s,ss]=useState({name:""});
  const [i,si]=useState(0);
  const [fomo,setFomo]=useState(0);
  const [out,setOut]=useState(null); // outcome page

  const scene=SCENES[i];
  const bg=BG[scene.bg]||BG.exterior;
  const progress=Math.round((i/(SCENES.length-1))*100);

  const goto=id=>{const k=SCENES.findIndex(x=>x.id===id); if(k>=0) si(k);};
  const choose=o=>{ sfx("msg"); setFomo(v=>+(v+(o.delta||0)).toFixed(2)); setOut({text:o.outcome,next:scene.next}); };
  const proceed=()=>{ if(!setOut) return; const nxt=out?.next; setOut(null); if(nxt) goto(nxt); };

  const level = fomo<=0? "Không bị FOMO" : fomo<1.6? "FOMO nhẹ" : fomo<3? "FOMO trung bình" : "FOMO nặng";
  const advice = fomo<=0? "Bạn vững vàng, biết tận hưởng khoảnh khắc. Giữ nhịp riêng nha!"
   : fomo<1.6? "Đôi lúc so sánh nhưng vẫn tự chủ. Tránh lướt lúc mới dậy và trước khi ngủ."
   : fomo<3? "Bạn dễ bị kéo bởi câu chuyện của người khác. Giới hạn mạng xã hội, tăng hoạt động thật."
   : "FOMO ảnh hưởng mạnh. Hãy dựng lại thói quen: 'cửa sổ yên' cho buổi sáng, hoạt động thật cho giờ ra chơi, và đọc 'Cẩm nang Bye FOMO'.";

  return (<div className="app" style={{backgroundImage:`url(${bg})`}}>
    <div className="card">
      <div className="topbar">
        <div className="badge">{scene.time}</div>
        <div className="small">Tiến độ: {progress}% • FOMO: {fomo>0?`+${fomo}`:fomo}</div>
      </div>

      {"render" in scene ? scene.render(s,ss,{goto})
        : out ? (<div className="outcome">
            <h2>Kết quả lựa chọn</h2>
            <p>{out.text}</p>
            <div className="footer"><button className="btn" onClick={proceed}>Tiếp tục</button></div>
          </div>)
        : (<>
            <h1>Ngày của em</h1>
            <p>{typeof scene.text==="function"?scene.text(s.name):scene.text}</p>
            <div className="choices">
              {scene.choices(s.name).map((c,idx)=>(<button key={idx} className="choice" onClick={()=>choose(c)}>{c.label}</button>))}
            </div>
          </>)
      }

      {scene.id==="ending" && !out && (<>
        <hr/>
        <p><strong>Tóm tắt:</strong> {advice}</p>
        <p><strong>Mức độ:</strong> {level} — Chỉ số FOMO hôm nay: <strong>{fomo>0?`+${fomo}`:fomo}</strong></p>
        <div className="footer"><button className="btn secondary" onClick={()=>{ si(0); setFomo(0); ss({name:""}); }}>Chơi lại</button></div>
      </>)}
    </div>
  </div>);
}

const root=ReactDOM.createRoot(document.getElementById("root")); root.render(<App />);
