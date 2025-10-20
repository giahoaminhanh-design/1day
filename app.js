const { useEffect, useState } = React;

const BG={swings:"assets/bg-swings.png", exterior:"assets/bg-exterior.png", corridor:"assets/bg-corridor.png"};

function useAudioAutoplay(){useEffect(()=>{const a=document.getElementById("bgm");if(!a)return;const kick=()=>{a.muted=false;a.play().catch(()=>{});window.removeEventListener('click',kick);window.removeEventListener('touchstart',kick);};a.play().catch(()=>{});window.addEventListener('click',kick,{once:true});window.addEventListener('touchstart',kick,{once:true});},[]);}
function useSfx(){const play=(type="msg")=>{try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);const t=c.currentTime;let f=1000;if(type==="tick")f=660;o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.35,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.18);o.start(t);o.stop(t+0.2);}catch{}};return play;}
const withName=(s,n)=>s.replaceAll("{name}",n||"bạn");

const SCENES=[
 {id:"guide",bg:"swings",time:"Hướng dẫn",render:(s,ss,a)=>(<>
   <h1>Ngày của em</h1>
   <p><strong>Chào mừng bạn đến với ngày của em.</strong> Đây là một ngày học đường tương tác. Mỗi lựa chọn sẽ mở ra <em>trang kể diễn biến</em> theo tên của bạn, rồi nhấn <b>Tiếp tục</b> để đi tiếp.</p>
   <ul>
     <li>Nhạc nền phát ngay khi vào (điện thoại có thể cần chạm một cái).</li>
     <li>FOMO tăng khi {"{name}"} bị kéo bởi ánh nhìn người khác; giảm khi {"{name}"} hiện diện, chủ động.</li>
     <li>Cuối ngày có trang kết thúc: phân tích chỉ số + lời khuyên (Cẩm nang Bye FOMO / FOMO Buddy).</li>
   </ul>
   <div className="footer"><button className="btn" onClick={()=>a.goto("name")}>Vào game</button></div></>)},
 {id:"name",bg:"exterior",time:"5:30",render:(s,ss,a)=>(<>
   <p>Cho mình biết tên để câu chuyện gọi đúng người nha:</p>
   <input className="input" placeholder="Tên của bạn…" value={s.name||""} onChange={e=>ss({...s,name:e.target.value})}/>
   <div className="footer"><button className="btn" disabled={!s.name?.trim()} onClick={()=>a.goto("wake")}>Bắt đầu</button></div></>)},
 {id:"wake",bg:"corridor",time:"5:30",text:n=>withName(`Sáng sớm. Chuông reo. Mẹ gọi: "Dậy ăn sáng nè {name}!"`,n),choices:n=>[
   {label:"Mở điện thoại xem thông báo",delta:+0.5,outcome:withName(`{name} chạm vào màn hình, ánh sáng xanh bật lên như một phiên chợ sớm...`,n)},
   {label:"Tắt chuông, duỗi người, hít sâu",delta:-0.2,outcome:withName(`{name} úp điện thoại xuống, lưng duỗi nghe một tiếng "rắc" nho nhỏ...`,n)},
   {label:"Nhắn bạn thân: 'Dậy chưa?'",delta:+0.1,outcome:withName(`"{name}: Ê dậyyyy…" • "Bạn thân: Chưa… ngủ tiếp 5p :))" ...`,n)},
   {label:"Ra bàn ăn ngay cho nóng",delta:-0.05,outcome:withName(`{name} kéo ghế. Lòng đỏ trứng như mặt trời nằm trên đĩa...`,n)}],next:"pickup"},
 {id:"pickup",bg:"exterior",time:"6:15",text:n=>withName(`Xe đưa rước dừng trước cổng. {name} bước lên, vài bạn vẫy tay.`,n),choices:n=>[
   {label:"Cắm tai nghe, lướt TikTok",delta:+0.3,outcome:withName(`Chiếc xe chạy trôi như một đoạn reel...`,n)},
   {label:"Chào bác tài, ngồi cạnh bạn nói chuyện",delta:-0.1,outcome:withName(`"Hôm nay kiểm tra đúng không?" — "Ừ, chắc qua nổi á." ...`,n)},
   {label:"Chụp trời đăng story",delta:+0.2,outcome:withName(`Bầu trời căng xanh, caption tinh tế...`,n)}],next:"class1"},
 {id:"class1",bg:"corridor",time:"7:00",text:n=>withName(`Trong lớp. Cô giảng bài, tiếng phấn cọt kẹt...`,n),choices:n=>[
   {label:"Lén xem group chat lớp khác",delta:+0.4,outcome:withName(`"Bạn {name} ơi, em có nghe không?" — cô gọi...`,n)},
   {label:"Ghi chép đều tay",delta:-0.2,outcome:withName(`Mỗi dòng chữ như một sợi dây neo...`,n)},
   {label:"Hỏi lại chỗ chưa hiểu",delta:-0.1,outcome:withName(`{name} giơ tay hỏi. Vài bạn quay xuống, không phải để soi...`,n)}],next:"break1"},
 {id:"break1",bg:"swings",time:"8:30",text:n=>withName(`Ra chơi. Sân rợp bóng phượng...`,n),choices:n=>[
   {label:"Xuống sân chơi thật",delta:-0.15,outcome:withName(`{name} chạy vài vòng, mồ hôi rịn...`,n)},
   {label:"Ở lại lớp, xem story người khác",delta:+0.25,outcome:withName(`Ai đó đi biển, ai đó tập gym...`,n)},
   {label:`Đăng story 'chán ghê' chờ ai đó nhắn`,delta:+0.35,outcome:withName(`Thông báo nhảy lên, tim {name} nhảy theo...`,n)}],next:"lunch"},
 {id:"lunch",bg:"corridor",time:"10:45",text:n=>withName(`Căn tin ồn mà ấm...`,n),choices:n=>[
   {label:"Ngồi một mình + xem video",delta:+0.25,outcome:withName(`Cơm nguội một nửa, video nóng hổi...`,n)},
   {label:"Ngồi cùng nhóm bạn, kể chuyện nhỏ",delta:-0.1,outcome:withName(`"Chiều có thể dục đó." — "Mai nhớ mang giày." ...`,n)}],next:"nap"},
 {id:"nap",bg:"swings",time:"11:35",text:n=>withName(`Giờ nghỉ trưa. Hành lang yên...`,n),choices:n=>[
   {label:"Lướt tới khi ngủ gục",delta:+0.25,outcome:withName(`Giấc ngủ chắp vá...`,n)},
   {label:"Đặt điện thoại xa tầm tay",delta:-0.2,outcome:withName(`{name} nhắm mắt thật sự...`,n)},
   {label:"Nhắn cho crush rồi ngủ",delta:+0.15,outcome:withName(`Tin nhắn gửi đi...`,n)}],next:"class2"},
 {id:"class2",bg:"exterior",time:"14:00",text:n=>withName(`Buổi chiều vào học...`,n),choices:n=>[
   {label:"Phát biểu 1 lần",delta:-0.1,outcome:withName(`"Ví dụ của {name} hay đấy." ...`,n)},
   {label:"Ngồi im, mở chat nhóm",delta:+0.25,outcome:withName(`Tin nhắn díp díp; bài giảng đi lướt qua...`,n)},
   {label:"Gửi meme trong giờ",delta:+0.3,outcome:withName(`Cả lớp cười; cô liếc...`,n)}],next:"break2"},
 {id:"break2",bg:"swings",time:"15:30",text:n=>withName(`Ra chơi chiều. Gió mát...`,n),choices:n=>[
   {label:"Đá bóng/nhảy dây",delta:-0.15,outcome:withName(`{name} vận động tới khi hơi thở nóng...`,n)},
   {label:"Đứng xem người khác chơi rồi lên story",delta:+0.3,outcome:withName(`{name} kể lại cuộc vui cho màn hình...`,n)},
   {label:"Ngồi ghế, nghe nhạc cũ",delta:-0.05,outcome:withName(`Giai điệu quen hạ nhiệt cả ngày dài...`,n)}],next:"home"},
 {id:"home",bg:"exterior",time:"16:30",text:n=>withName(`Tan học. Hoàng hôn phủ hàng cây; xe đưa rước chờ trước cổng.`,n),choices:n=>[
   {label:`Mở mạng xem "ai làm gì hôm nay"`,delta:+0.35,outcome:withName(`Một cơn sóng trống rỗng dâng lên...`,n)},
   {label:"Nhìn trời, nghe nhạc nhẹ",delta:-0.2,outcome:withName(`Màu trời dịu lại...`,n)},
   {label:"Nhắn xin bài tập nhóm khác",delta:+0.1,outcome:withName(`{name} đỡ lo...`,n)}],next:"ENDING"} // explicit token
];

function App(){
  useAudioAutoplay();
  const sfx=useSfx();
  const [s,ss]=useState({name:""});
  const [i,si]=useState(0);
  const [f,setF]=useState(0);
  const [out,setOut]=useState(null);
  const [ready,setReady]=useState(false);
  const [ending,setEnding]=useState(false);

  useEffect(()=>{const t=setTimeout(()=>setReady(true),40);return()=>clearTimeout(t);},[i,ending]);

  const scene=SCENES[i];
  const bg=ending? BG.exterior : (BG[scene.bg]||BG.exterior); // ending dùng mặt tiền trường
  const progress=Math.round((i/(SCENES.length-1))*100);

  const goto=id=>{const k=SCENES.findIndex(x=>x.id===id); if(k>=0){setReady(False); si(k);} };

  const choose=o=>{sfx("msg"); setF(v=>+(v+(o.delta||0)).toFixed(2)); setOut({text:o.outcome,next:scene.next});};
  const proceed=()=>{const nxt=out?.next; setOut(null); if(nxt==="ENDING"){ setEnding(True); } else { const k=SCENES.findIndex(x=>x.id===nxt); if(k>=0){ setReady(False); si(k);} }};

  const level=f<=0? "Không bị FOMO" : f<1.0? "FOMO rất nhẹ (~0.3–0.9)" : f<2.2? "FOMO nhẹ" : f<3? "FOMO trung bình" : "FOMO nặng";
  const analysis=(()=>{const n=s.name||"bạn";const v=f;
    if(v<=0)return `${n} giữ được nhịp riêng cả ngày. Không tách mình khỏi thế giới, chỉ là chọn ở trong câu chuyện của chính mình.`;
    if(v<1.0)return `Đôi khi ${n} vẫn bị kéo bởi noti, nhưng nhận ra sớm và tự ghì nhịp lại. Những kết nối ngoài đời giúp ${n} đứng vững.`;
    if(v<2.2)return `${n} nhạy với ánh nhìn người khác: like, story đủ làm nhịp tim lệch. 1–2 neo hiện tại (ghi chép, vận động) là đủ kéo về.`;
    if(v<3)return `Sợ bỏ lỡ bắt đầu ảnh hưởng tập trung và tâm trạng của ${n}. Đôi lúc ${n} kể chuyện cho màn hình, còn bản thân thì mờ dần.`;
    return `${n} đo ngày của mình bằng ánh mắt người khác và thấy mình nhỏ dần. Ảnh hưởng cảm xúc, học tập và quan hệ.`;})();
  const advice=(()=>{const v=f;
    if(v<=0)return "Duy trì 'cửa sổ yên' buổi sáng; khi so sánh trỗi dậy, thở sâu 3 nhịp và quay về cơ thể.";
    if(v<1.0)return "Chọn 2 khoảng 'không màn hình' (sáng sớm, trước ngủ). Đặt điện thoại xa tay 15–20 phút.";
    if(v<2.2)return "Đọc 'Cẩm nang Bye FOMO'; thử trò chuyện FOMO Buddy khi thấy lòng 'đói' được nhìn thấy.";
    if(v<3)return "Giới hạn mạng theo khung giờ; tăng 'thân thể học' (vận động ngắn, thở 4-7-8, 3 dòng nhật ký). Kèm Bye FOMO + FOMO Buddy.";
    return "Dựng lại thói quen: 'cửa sổ yên' đầu ngày, tắt push, chỉ mở mạng giờ cố định. Đọc Bye FOMO và trò chuyện FOMO Buddy.";})();

  return (<div className={"app "+(ready?"ready":"")} style={{backgroundImage:`url(${bg})`}}>
    <div className="card">
      {ending ? (
        <div className="ending">
          <h1>Ngày của em — Kết quả</h1>
          <p><strong>Chỉ số FOMO:</strong> {f.toFixed(2)} &nbsp;•&nbsp; <strong>Mức độ:</strong> {level}</p>
          <p>{analysis}</p>
          <p><strong>Lời khuyên:</strong> {advice}</p>
          <p className="small">Để hiểu rõ hơn về FOMO và cách quay lại với chính mình, hãy đọc <em>Cẩm nang Bye FOMO</em> hoặc trò chuyện cùng <strong>FOMO Buddy</strong>.</p>
          <div className="footer"><button className="btn secondary" onClick={()=>{setEnding(False); si(0); setF(0); ss({name:""});}}>Chơi lại từ đầu</button></div>
        </div>
      ) : (
        <>
          <div className="topbar"><div className="badge">{scene.time}</div></div>
          {"render" in scene? scene.render(s,ss,{goto:(id)=>{setEnding(False); si(SCENES.findIndex(x=>x.id===id));}})
           : (out? (<div className="outcome"><h2>Kết quả lựa chọn</h2><p>{out.text}</p><div className="footer"><button className="btn" onClick={proceed}>Tiếp tục</button></div></div>)
                   : (<><h1>Ngày của em</h1><p>{typeof scene.text==="function"?scene.text(s.name):scene.text}</p><div className="choices">{scene.choices(s.name).map((c,idx)=>(<button key={idx} className="choice" onClick={()=>{ setF(v=>+(v+(c.delta||0)).toFixed(2)); setOut({text:c.outcome,next:scene.next}); }}>{c.label}</button>))}</div></>))}
        </>
      )}
    </div>
  </div>);
}
const root=ReactDOM.createRoot(document.getElementById("root")); root.render(<App />);