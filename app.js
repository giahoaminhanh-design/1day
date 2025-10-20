const { useEffect, useState } = React;
const BG={sky:"assets/bg-sky.png",exterior:"assets/bg-exterior.png",corridor:"assets/bg-corridor.png",swings:"assets/bg-swings.png",field:"assets/bg-field.png"};
function useAudioAutoplay(){useEffect(()=>{const a=document.getElementById("bgm");if(!a)return;const t=()=>a.play().catch(()=>{});t();const k=()=>{a.muted=false;a.play().catch(()=>{});window.removeEventListener("click",k);window.removeEventListener("touchstart",k);};window.addEventListener("click",k,{once:true});window.addEventListener("touchstart",k,{once:true});},[]);}
function useSfx(){const play=(type="ping")=>{try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);const n=c.currentTime;let f=880;if(type==="bell")f=1320;if(type==="msg")f=1000;if(type==="tick")f=660;o.frequency.value=f;g.gain.setValueAtTime(0.0001,n);g.gain.exponentialRampToValueAtTime(0.4,n+0.01);g.gain.exponentialRampToValueAtTime(0.0001,n+0.20);o.start(n);o.stop(n+0.22);}catch{}};return play;}
const SCENES=[
 {id:"guide",bg:"sky",time:"Hướng dẫn",render:(s,ss,a)=>(<>
   <p><strong>Chào mừng đến với 1 Ngày.</strong> Đây là câu chuyện học đường tương tác. Mỗi khung giờ bạn sẽ lựa chọn, và cuối ngày nhận tóm tắt + chỉ số FOMO.</p>
   <ul className="rulelist"><li>Nhấn vào lựa chọn để phản hồi tình huống. Một số là <em>hội thoại</em>.</li><li>Nhạc nền là bản của bạn; game có vài hiệu ứng âm thanh nhỏ.</li><li>FOMO tăng khi bị kéo bởi ánh nhìn người khác; giảm khi bạn chủ động và hiện diện.</li></ul>
   <p className="note">Nếu chưa nghe nhạc, chạm màn hình để bật 🎵</p><div className="footer"><button className="btn" onClick={()=>a.goto("name")}>Tiếp tục</button></div></>)},
 {id:"name",bg:"sky",time:"5:30",render:(s,ss,a)=>(<>
   <p>Hãy cho mình biết tên để mọi người gọi cho dễ nha.</p><input className="input" placeholder="Tên của bạn…" value={s.name} onChange={e=>ss({...s,name:e.target.value})}/>
   <div className="footer"><button className="btn" onClick={()=>a.goto("wake")} disabled={!s.name?.trim()}>Bắt đầu</button></div></>)},
 {id:"wake",bg:"sky",time:"5:30",text:n=>`Buổi sáng. Chuông reo. Mẹ gọi: "Dậy ăn sáng nè ${n}!"`,choices:n=>[
   {label:"Mở điện thoại xem thông báo",delta:+0.5,sfx:"msg",say:[["Kể chuyện","Story nối story. Bình minh đi qua trước khi bạn kịp nhìn."]]},
   {label:"Tắt chuông, duỗi người, hít sâu",delta:-0.2,say:[["Kể chuyện","Thân người mở ra, hơi thở dịu xuống."]]},
   {label:"Nhắn bạn thân: 'Dậy chưa?'",delta:+0.1,sfx:"msg",say:[[n,"Ê dậyyyy"],["Bạn thân","Chưa... ngủ tiếp 5p :))"]]},
   {label:"Ra bàn ăn ngay cho nóng",delta:-0.05,say:[["Mẹ","Ăn từ tốn thôi con"],["Kể chuyện","Bạn mở ngày bằng một nhịp chậm."]]}],next:"pickup"},
 {id:"pickup",bg:"exterior",time:"6:15",text:n=>`Xe đưa rước dừng trước cổng nhà. ${n} bước lên.`,choices:n=>[
   {label:"Cắm tai nghe, lướt TikTok",delta:+0.3,sfx:"tick",say:[["Kể chuyện","Xe dừng mà đầu vẫn ở nơi khác."]]},
   {label:"Chào bác tài, ngồi cạnh bạn nói chuyện",delta:-0.1,say:[["Bạn cùng xe","Hôm nay kiểm tra đúng không?"],[n,"Ừm, chắc qua nổi á."],["Kể chuyện","Đoạn đường ngắn lại."]]},
   {label:"Chụp trời đăng story",delta:+0.2,sfx:"msg",say:[["Kể chuyện","Bạn hóa thành người kể chuyện cho màn hình."]]}],next:"class1"},
 {id:"class1",bg:"corridor",time:"7:00",text:n=>`Trong lớp. Cô đang giảng, điện thoại trong ngăn bàn.`,choices:n=>[
   {label:"Lén xem group chat lớp khác",delta:+0.4,sfx:"msg",say:[["Cô","Bạn "+n+" ơi, em có nghe không?"],[n,"Dạ có ạ!"],["Kể chuyện","Cả lớp khúc khích. Bạn rút tay khỏi ngăn bàn."]]},
   {label:"Ghi chép đều tay",delta:-0.2,say:[["Kể chuyện","Dòng chữ kéo bạn ở lại với hiện tại."]]},
   {label:"Hỏi lại chỗ chưa hiểu",delta:-0.1,say:[[n,"Cô ơi đoạn này dùng công thức nào ạ?"],["Cô","Thử hệ thức Viet xem."],["Kể chuyện","Bạn thấy mình chủ động."]]},
   {label:"Nhắn hỏi đáp án trên nhóm",delta:+0.2,sfx:"msg",say:[["Kể chuyện","Đáp án tới nhanh, nhưng niềm vui hiểu bài thì tắt sớm."]]}],next:"break1"},
 {id:"break1",bg:"corridor",time:"8:30",text:n=>`Ra chơi. Hành lang rực nắng, bạn bè rủ xuống sân.`,choices:n=>[
   {label:"Xuống sân chơi thật",delta:-0.15,say:[["Bạn A","Ra đá bóng không?"],[n,"Đi chứ!"],["Kể chuyện","Mồ hôi và nắng đều thật."]]},
   {label:"Ở lại lớp, xem story người khác",delta:+0.25,say:[["Kể chuyện","Bạn ngồi yên mà thấy mình trôi đi."]]},
   {label:"Đăng story 'chán ghê' chờ ai đó nhắn",delta:+0.35,sfx:"msg",say:[["Kể chuyện","Màn hình sáng, lòng trống. Chờ ai đó nhìn thấy mình."]]},
   {label:"Ngồi với bạn trầm tính, tám chuyện nhỏ",delta:-0.05,say:[["Bạn trầm","Hồi sáng tớ quên mang compa."],[n,"Mai tớ nhắc."],["Kể chuyện","Một cuộc nói chuyện không cần sân khấu."]]}],next:"lunch"},
 {id:"lunch",bg:"swings",time:"10:45",text:n=>`Căn tin ồn ào mà ấm. Khay cơm nóng.`,choices:n=>[
   {label:"Ngồi một mình + xem video",delta:+0.25,sfx:"msg",say:[["Kể chuyện","Bữa trưa trôi qua như một đoạn clip: sáng và rỗng."]]},
   {label:"Ngồi cùng nhóm bạn, kể chuyện nhỏ",delta:-0.1,say:[["Bạn B","Chiều có thể dục."],[n,"Mai nhớ mang giày."],["Kể chuyện","Món ăn có vị hơn."]]},
   {label:"Chụp khay cơm đăng review",delta:+0.1,sfx:"msg",say:[["Kể chuyện","Ảnh đẹp, nhưng bạn mệt vì nghĩ xem post có ai like không."]]}],next:"nap"},
 {id:"nap",bg:"swings",time:"11:35",text:n=>`Giờ nghỉ trưa. Phòng yên ắng, nắng phủ vàng.`,choices:n=>[
   {label:"Lướt tới khi ngủ gục",delta:+0.25,sfx:"tick",say:[["Kể chuyện","Giấc ngủ chắp vá. Đầu nặng như vừa lặn sâu."]]},
   {label:"Đặt điện thoại xa tầm tay",delta:-0.2,say:[["Kể chuyện","Giấc ngủ đến trọn vẹn, chậm và hiền."]]},
   {label:"Nhắn cho crush rồi ngủ",delta:+0.15,sfx:"msg",say:[["Kể chuyện","Bạn ngủ mà tay vẫn nhớ cảm giác chờ tin nhắn."]]}],next:"class2"},
 {id:"class2",bg:"exterior",time:"14:00",text:n=>`Buổi chiều vào học. Trời hạ bớt nắng.`,choices:n=>[
   {label:"Phát biểu 1 lần",delta:-0.1,say:[["Cô","Cảm ơn "+n+", ví dụ rất hay!"],["Kể chuyện","Bạn thấy mình 'ở trong' ngày học."]]},
   {label:"Ngồi im lặng, mở chat nhóm",delta:+0.25,sfx:"msg",say:[["Kể chuyện","Tin nhắn díp díp. Bài giảng đi lướt qua."]]},
   {label:"Gửi meme vào giờ học",delta:+0.3,sfx:"msg",say:[["Bạn C","Đỉnh quá :))"],["Kể chuyện","Cô liếc xuống cuối lớp. Tim chùng một nhịp."]]}],next:"break2"},
 {id:"break2",bg:"field",time:"15:30",text:n=>`Ra chơi chiều. Gió mát.`,choices:n=>[
   {label:"Đá bóng/nhảy dây cùng nhóm",delta:-0.15,say:[["Kể chuyện","Cười vang. Cơ thể cũng biết nói 'hạnh phúc'."]]},
   {label:"Đứng xem người khác chơi rồi lên story",delta:+0.3,sfx:"msg",say:[["Kể chuyện","Bạn kể lại cuộc vui cho màn hình."]]},
   {label:"Ngồi ghế đá, nghe nhạc cũ",delta:-0.05,say:[["Kể chuyện","Giai điệu quen hạ nhiệt cả ngày dài."]]}],next:"home"},
 {id:"home",bg:"field",time:"16:30",text:n=>`Tan học. Hoàng hôn phủ hàng cây. Trên xe về nhà.`,choices:n=>[
   {label:"Mở mạng xem 'ai làm gì hôm nay'",delta:+0.35,sfx:"msg",say:[["Kể chuyện","Một cơn sóng trống rỗng dâng lên. Bạn đo cuộc đời bằng ánh mắt người khác."]]},
   {label:"Nhìn trời, nghe nhạc nhẹ",delta:-0.2,say:[["Kể chuyện","Màu trời dịu lại. Bạn thấy mình đủ đầy theo cách nhỏ bé mà thật."]]},
   {label:"Nhắn xin bài tập nhóm khác",delta:+0.1,sfx:"msg",say:[["Kể chuyện","Đỡ lo, nhưng cũng thấy mình đang vay mượn nhịp học của ai đó."]]}],next:"ending"}
];
function App(){useAudioAutoplay();const sfx=useSfx();const [muted,setMuted]=useState(false);const [s,ss]=useState({name:""});const [i,si]=useState(0);const [f, sf]=useState(0);
 const scene=SCENES[i]; const progress=Math.round((i/(SCENES.length-1))*100); const bg=BG[scene.bg]||BG.sky;
 useEffect(()=>{const a=document.getElementById("bgm"); if(a){a.muted=muted;a.play().catch(()=>{});}},[muted]);
 const goto=id=>{const k=SCENES.findIndex(s=>s.id===id); if(k>=0) si(k);};
 const onChoose=opt=>{sf(v=>+(v+(opt.delta||0)).toFixed(2)); if(opt.sfx) sfx(opt.sfx); if(opt.say) alert(opt.say.map(([sp,tx])=> (sp?`${sp}: ${tx}`:tx)).join("\\n")); goto(scene.next||"ending");};
 const level=f<=0?"Không bị FOMO":f<1.6?"FOMO nhẹ":f<3?"FOMO trung bình":"FOMO nặng";
 const advice=f<=0?"Bạn vững vàng, biết tận hưởng khoảnh khắc. Giữ nhịp riêng nha!":f<1.6?"Đôi lúc so sánh nhưng vẫn tự chủ. Tránh lướt lúc mới dậy và trước khi ngủ.":f<3?"Bạn dễ bị kéo bởi câu chuyện của người khác. Giới hạn mạng xã hội và tăng hoạt động thật.":"FOMO ảnh hưởng mạnh đến cảm xúc và việc học. Đã đến lúc xây thói quen mới, đọc 'Cẩm nang Bye FOMO' và ghé FOMO Guard.";
 return (<div className="app" style={{backgroundImage:`url(${bg})`}}><div className="card">
   <div className="topbar"><div className="badge">{scene.time}</div><div className="right"><span className={"toggle"+(muted?" muted":"")} onClick={()=>setMuted(!muted)}>{muted?"🔇 Bật nhạc":"🔊 Tắt nhạc"}</span></div></div>
   <h1>1 Ngày</h1>
   {"render" in scene? scene.render(s,ss,{goto}) : <>
     <p>{typeof scene.text==="function"?scene.text(s.name):scene.text}</p>
     <div className="choices">{scene.choices(s.name).map((c,idx)=>(<button key={idx} className="choice" onClick={()=>onChoose(c)}>{c.label}</button>))}</div>
     <div className="progress"><div className="bar"><span style={{width:`${progress}%`}}/></div><span className="small">Tiến độ ngày • FOMO: {f>0?`+${f}`:f}</span></div>
   </>}
   {scene.id==="ending" && <><hr/><p><strong>Tóm tắt:</strong> {advice}</p><p><strong>Mức độ:</strong> {level} — Chỉ số FOMO hôm nay: <strong>{f>0?`+${f}`:f}</strong></p><div className="footer"><button className="btn secondary" onClick={()=>{si(0);sf(0);ss({name:""});}}>Chơi lại</button></div></>}
 </div></div>);}
const root=ReactDOM.createRoot(document.getElementById("root")); root.render(<App />);