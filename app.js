const { useEffect, useState } = React;
const BG={swings:"assets/bg-swings.png", exterior:"assets/bg-exterior.png", corridor:"assets/bg-corridor.png"};
function useAudioAutoplay(){useEffect(()=>{const a=document.getElementById("bgm");if(!a)return;const kick=()=>{a.muted=false;a.play().catch(()=>{});window.removeEventListener('click',kick);window.removeEventListener('touchstart',kick);};a.play().catch(()=>{});window.addEventListener('click',kick,{once:true});window.addEventListener('touchstart',kick,{once:true});},[]);}
function useSfx(){const play=(type='msg')=>{try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);const t=c.currentTime;let f=1000;if(type==='tick')f=660;o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.35,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.18);o.start(t);o.stop(t+0.2);}catch{}};return play;}
const SCENES=[
 {id:'guide',bg:'swings',time:'Hướng dẫn',render:(s,ss,a)=>(<>
   <h1>Ngày của em</h1>
   <p><strong>Chào mừng bạn đến với ngày của em.</strong> Đây là một ngày học đường tương tác. Mỗi lựa chọn sẽ mở ra <em>trang kể diễn biến</em>, rồi bạn tiếp tục đi tiếp.</p>
   <ul className='rulelist'><li>Nhạc nền phát ngay khi vào (điện thoại có thể cần chạm một cái).</li><li>FOMO tăng khi bạn bị kéo bởi ánh nhìn người khác; giảm khi bạn hiện diện, chủ động.</li><li>Cuối ngày có tóm tắt, chỉ số FOMO và lời gợi ý.</li></ul>
   <div className='footer'><button className='btn' onClick={()=>a.goto('name')}>Vào game</button></div></>)},
 {id:'name',bg:'exterior',time:'5:30',render:(s,ss,a)=>(<>
   <p>Cho mình biết tên để mọi người gọi đúng:</p>
   <input className='input' placeholder='Tên của bạn…' value={s.name||''} onChange={e=>ss({...s,name:e.target.value})}/>
   <div className='footer'><button className='btn' disabled={!s.name?.trim()} onClick={()=>a.goto('wake')}>Bắt đầu</button></div></>)},
 {id:'wake',bg:'corridor',time:'5:30',text:n=>`Sáng sớm. Chuông reo. Mẹ gọi: "Dậy ăn sáng nè ${n}!"`,choices:n=>[
   {label:'Mở điện thoại xem thông báo',delta:+0.5,outcome:`Màn hình sáng rực như một quán chợ online. Story, thông báo, tin nhắn — tất cả chen nhau lên tiếng.`},
   {label:'Tắt chuông, duỗi người, hít sâu',delta:-0.2,outcome:`Bạn đặt điện thoại úp xuống. Cột sống duỗi ra, hơi thở chảy đến tận bụng.`},
   {label:`Nhắn bạn thân: 'Dậy chưa?'`,delta:+0.1,outcome:`Buổi sáng mở ra bằng một cuộc trò chuyện bé xíu — và chiếc màn hình.`},
   {label:'Ra bàn ăn ngay cho nóng',delta:-0.05,outcome:`Căn bếp bỗng dày dặn. Điện thoại nằm yên; bạn có mặt ở đây.`}
 ],next:'pickup'},
 {id:'pickup',bg:'exterior',time:'6:15',text:n=>`Xe đưa rước dừng trước cổng nhà. ${n} lên xe, vài bạn vẫy tay.`,choices:n=>[
   {label:'Cắm tai nghe, lướt TikTok',delta:+0.3,outcome:`Khi xe thắng trước cổng trường, bạn vẫn nghe nhạc trong đầu.`},
   {label:'Chào bác tài, ngồi cạnh bạn nói chuyện',delta:-0.1,outcome:`Câu chuyện không có điểm nhấn, nhưng con đường ngắn lại.`},
   {label:'Chụp trời đăng story',delta:+0.2,outcome:`Ảnh đẹp, caption xịn; gió mát thì đi qua.`}
 ],next:'class1'},
 {id:'class1',bg:'corridor',time:'7:00',text:n=>`Trong lớp. Cô giảng, tiếng phấn cọt kẹt.`,choices:n=>[
   {label:'Lén xem group chat lớp khác',delta:+0.4,outcome:`Cả lớp khúc khích; bạn đỏ mặt.`},
   {label:'Ghi chép đều tay',delta:-0.2,outcome:`Mỗi dòng chữ là một sợi dây neo.`},
   {label:'Hỏi lại chỗ chưa hiểu',delta:-0.1,outcome:`Hóa ra đặt câu hỏi cũng là một kiểu can đảm.`}
 ],next:'break1'},
 {id:'break1',bg:'swings',time:'8:30',text:n=>`Ra chơi. Sân rợp bóng phượng.`,choices:n=>[
   {label:'Xuống sân chơi thật',delta:-0.15,outcome:`Cơ thể nói “mình vui”.`},
   {label:'Ở lại lớp, xem story người khác',delta:+0.25,outcome:`Mỗi story là một cuộc đời nhỏ.`},
   {label:`Đăng story 'chán ghê' chờ ai đó nhắn`,delta:+0.35,outcome:`Thông báo nhảy lên — rồi trống rỗng quay về.`}
 ],next:'lunch'},
 {id:'lunch',bg:'corridor',time:'10:45',text:n=>`Căn tin ồn mà ấm.`,choices:n=>[
   {label:'Ngồi một mình + xem video',delta:+0.25,outcome:`Bạn cười một mình rồi mệt.`},
   {label:'Ngồi cùng nhóm bạn, kể chuyện nhỏ',delta:-0.1,outcome:`Một câu chuyện ngắn đủ để bữa trưa có mùi của người thân.`}
 ],next:'nap'},
 {id:'nap',bg:'swings',time:'11:35',text:n=>`Giờ nghỉ trưa.`,choices:n=>[
   {label:'Lướt tới khi ngủ gục',delta:+0.25,outcome:`Giấc ngủ chắp vá; đầu nặng.`},
   {label:'Đặt điện thoại xa tầm tay',delta:-0.2,outcome:`Bạn chợp mắt thật sự; tỉnh dậy đầu nhẹ hơn.`},
   {label:'Nhắn cho crush rồi ngủ',delta:+0.15,outcome:`Bạn ngủ nhưng tay vẫn nhớ cảm giác chờ noti.`}
 ],next:'class2'},
 {id:'class2',bg:'exterior',time:'14:00',text:n=>`Buổi chiều vào học.`,choices:n=>[
   {label:'Phát biểu 1 lần',delta:-0.1,outcome:`Bạn thấy mình “ở trong” ngày học.`},
   {label:'Ngồi im, mở chat nhóm',delta:+0.25,outcome:`Bài giảng đi lướt qua như gió.`},
   {label:'Gửi meme trong giờ',delta:+0.3,outcome:`Lớp cười; cô liếc. Vui mà không hẳn vui.`}
 ],next:'break2'},
 {id:'break2',bg:'swings',time:'15:30',text:n=>`Ra chơi chiều.`,choices:n=>[
   {label:'Đá bóng/nhảy dây',delta:-0.15,outcome:`Hơi thở nóng và tim đập rõ ràng.`},
   {label:'Đứng xem người khác chơi rồi lên story',delta:+0.3,outcome:`Bạn kể lại cuộc vui cho màn hình.`},
   {label:'Ngồi ghế, nghe nhạc cũ',delta:-0.05,outcome:`Giai điệu quen như mưa nhỏ.`}
 ],next:'home'},
 {id:'home',bg:'exterior',time:'16:30',text:n=>`Tan học. Hoàng hôn phủ hàng cây.`,choices:n=>[
   {label:`Mở mạng xem "ai làm gì hôm nay"`,delta:+0.35,outcome:`Một cơn sóng trống rỗng dâng lên.`},
   {label:'Nhìn trời, nghe nhạc nhẹ',delta:-0.2,outcome:`Màu trời dịu lại; bạn đủ đầy theo cách nhỏ bé.`},
   {label:'Nhắn xin bài tập nhóm khác',delta:+0.1,outcome:`Bạn đỡ lo nhưng hiểu mình vừa vay mượn nhịp học của ai đó.`}
 ],next:'ending'}
];
function App(){useAudioAutoplay();const sfx=useSfx();const [s,ss]=useState({name:''});const [i,si]=useState(0);const [f,setF]=useState(0);const [out,setOut]=useState(null);
 const scene=SCENES[i]; const bg=BG[scene.bg]||BG.exterior; const progress=Math.round((i/(SCENES.length-1))*100);
 const goto=id=>{const k=SCENES.findIndex(x=>x.id===id); if(k>=0) si(k);};
 const choose=o=>{sfx('msg'); setF(v=>+(v+(o.delta||0)).toFixed(2)); setOut({text:o.outcome,next:scene.next});};
 const proceed=()=>{const n=out?.next; setOut(null); if(n) goto(n);};
 const level=f<=0?'Không bị FOMO':f<1.6?'FOMO nhẹ':f<3?'FOMO trung bình':'FOMO nặng';
 const advice=f<=0?'Bạn vững vàng, biết tận hưởng khoảnh khắc. Giữ nhịp riêng nha!':f<1.6?'Đôi lúc so sánh nhưng vẫn tự chủ. Tránh lướt lúc mới dậy và trước khi ngủ.':f<3?'Bạn dễ bị kéo bởi câu chuyện của người khác. Giới hạn mạng xã hội, tăng hoạt động thật.':'FOMO ảnh hưởng mạnh. Dựng lại thói quen: “cửa sổ yên” buổi sáng, hoạt động thật giờ ra chơi; đọc “Cẩm nang Bye FOMO” và ghé FOMO Guard.';
 return (<div className='app' style={{backgroundImage:`url(${bg})`}}><div className='card'>
   <div className='topbar'><div className='badge'>{scene.time}</div><div className='small'>Tiến độ: {progress}% • FOMO: {f>0?`+${f}`:f}</div></div>
   {'render' in scene? scene.render(s,ss,{goto}) : out? (<div className='outcome'><h2>Kết quả lựa chọn</h2><p>{out.text}</p><div className='footer'><button className='btn' onClick={proceed}>Tiếp tục</button></div></div>) : (<><h1>Ngày của em</h1><p>{typeof scene.text==='function'?scene.text(s.name):scene.text}</p><div className='choices'>{scene.choices(s.name).map((c,idx)=>(<button key={idx} className='choice' onClick={()=>choose(c)}>{c.label}</button>))}</div></>)}
   {scene.id==='ending' && !out && (<><hr/><p><strong>Tóm tắt:</strong> {advice}</p><p><strong>Mức độ:</strong> {level} — Chỉ số FOMO hôm nay: <strong>{f>0?`+${f}`:f}</strong></p><div className='footer'><button className='btn secondary' onClick={()=>{si(0);setF(0);ss({name:''});}}>Chơi lại</button></div></>)}
 </div></div>);}
const root=ReactDOM.createRoot(document.getElementById('root')); root.render(<App />);