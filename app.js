const { useEffect, useState } = React;

// Backgrounds: only the 3 the user picked
const BG = {
  swings: "assets/bg-swings.png",     // sân ghế xích đu
  exterior: "assets/bg-exterior.png", // mặt tiền trường
  corridor: "assets/bg-corridor.png"  // hành lang
};

function useAudioAutoplay(){
  useEffect(()=>{
    const a=document.getElementById("bgm");
    if(!a) return;
    // kick autoplay for browsers
    const kick=()=>{ a.muted=false; a.play().catch(()=>{});
      window.removeEventListener("click",kick); window.removeEventListener("touchstart",kick); };
    a.play().catch(()=>{});
    window.addEventListener("click",kick,{once:true});
    window.addEventListener("touchstart",kick,{once:true});
  },[]);
}

// Tiny SFX for feedback (WebAudio)
function useSfx(){
  const play=(type="msg")=>{
    try{
      const ctx=new (window.AudioContext||window.webkitAudioContext)();
      const o=ctx.createOscillator(); const g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      const now=ctx.currentTime; let f=1000; if(type==="tick") f=660;
      o.frequency.value=f; g.gain.setValueAtTime(0.0001,now);
      g.gain.exponentialRampToValueAtTime(0.35, now+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now+0.18);
      o.start(now); o.stop(now+0.2);
    }catch{}
  };
  return play;
}

// Scenes with explicit bg from 3 images
const SCENES = [
  { id:"guide", bg:"swings", time:"Hướng dẫn",
    render:(state,setState,actions)=>(<>
      <h1>1 Ngày</h1>
      <p><strong>Chào mừng bạn đến với vùng đất âm thanh.</strong> Ở đây, bạn sẽ lắng nghe chính mình suốt một ngày học — mỗi lựa chọn sẽ có <em>trang kết quả riêng</em>, rồi mới tiếp tục tình huống kế tiếp.</p>
      <ul className="rulelist">
        <li>Nhấn vào lựa chọn để xem diễn biến/kết quả → sau đó bấm <em>Tiếp tục</em>.</li>
        <li>Nhạc nền khởi động ngay khi vào; có thể phải chạm 1 cái để bật trên di động.</li>
        <li>FOMO tăng nếu bạn bị kéo bởi ánh nhìn người khác; giảm khi bạn hiện diện và chủ động.</li>
      </ul>
      <div className="footer"><button className="btn" onClick={()=>actions.goto("name")}>Bắt đầu</button></div>
    </>)
  },
  { id:"name", bg:"exterior", time:"5:30",
    render:(state,setState,actions)=>(<>
      <p>Cho mình biết tên để mọi người gọi đúng: </p>
      <input className="input" placeholder="Tên của bạn…" value={state.name||""} onChange={e=>setState({...state,name:e.target.value})}/>
      <div className="footer"><button className="btn" disabled={!state.name?.trim()} onClick={()=>actions.goto("wake")}>Vào game</button></div>
    </>)
  },
  { id:"wake", bg:"corridor", time:"5:30",
    text:(n)=>`Sáng sớm. Chuông reo. Mẹ gọi: "Dậy ăn sáng nè ${n}!"`,
    choices:(n)=>[
      {label:"Mở điện thoại xem thông báo", delta:+0.5, outcome:`Điện thoại sáng rực. Story nối story. Bình minh ngoài cửa sổ đi qua trước khi bạn kịp nhìn.`},
      {label:"Tắt chuông, duỗi người, hít sâu", delta:-0.2, outcome:`Cơ thể mở ra, hơi thở dịu xuống. Bạn cảm được mùi cơm mới len vào phòng.`},
      {label:"Nhắn bạn thân: 'Dậy chưa?'", delta:+0.1, outcome:`Bạn: "Ê dậyyyy" • Bạn thân: "Chưa… ngủ tiếp 5p :))" • Bạn cười khẽ, nhưng đã khởi động ngày bằng… cái màn hình.`},
      {label:"Ra bàn ăn ngay cho nóng", delta:-0.05, outcome:`Bữa sáng đơn giản. Nhịp đầu ngày chậm lại, ổn định.`}
    ],
    next:"pickup"
  },
  { id:"pickup", bg:"exterior", time:"6:15",
    text:(n)=>`Xe đưa rước dừng trước cổng nhà. ${n} bước lên, vài bạn đã ngồi sẵn.`,
    choices:(n)=>[
      {label:"Cắm tai nghe, lướt TikTok", delta:+0.3, outcome:`Video nối video; khi xe dừng trước trường, đầu bạn vẫn ở một nơi khác.`},
      {label:"Chào bác tài, ngồi cạnh bạn nói chuyện", delta:-0.1, outcome:`Câu chuyện nhỏ về bài kiểm tra làm đoạn đường ngắn lại. Bạn thấy mình đang thật sự ở đây.`},
      {label:"Chụp trời đăng story", delta:+0.2, outcome:`Ảnh đẹp, caption xịn. Nhưng bạn thấy mình như người kể chuyện cho màn hình hơn là người đang sống khoảnh khắc.`}
    ],
    next:"class1"
  },
  { id:"class1", bg:"corridor", time:"7:00",
    text:(n)=>`Trong lớp. Cô đang giảng, gió lùa nhẹ qua cửa sổ.`,
    choices:(n)=>[
      {label:"Lén xem group chat lớp khác", delta:+0.4, outcome:`Cô: "Bạn ${n} ơi, em có nghe không?" • Cả lớp khúc khích. Bạn đỏ mặt, rút tay khỏi ngăn bàn.`},
      {label:"Ghi chép đều tay", delta:-0.2, outcome:`Dòng chữ kéo bạn ở lại với hiện tại. Hiểu bài theo cách chậm mà chắc.`},
      {label:"Hỏi lại chỗ chưa hiểu", delta:-0.1, outcome:`"${n}: Cô ơi đoạn này dùng công thức nào ạ?" • Cô: "Thử hệ thức Viet nhé." • Bạn cảm thấy mình chủ động.`}
    ],
    next:"break1"
  },
  { id:"break1", bg:"swings", time:"8:30",
    text:(n)=>`Ra chơi. Sân vắng gió, ghế xích đu kẽo kẹt nhẹ.`,
    choices:(n)=>[
      {label:"Xuống sân chơi thật", delta:-0.15, outcome:`Mồ hôi và nắng đều thật. Một tiếng cười to kéo bạn về lại thân thể của mình.`},
      {label:"Ở lại lớp, xem story người khác", delta:+0.25, outcome:`Mỗi story là một đời sống nhỏ. Bạn ngồi yên mà thấy mình trôi đi.`},
      {label:"Đăng story 'chán ghê' chờ ai đó nhắn", delta:+0.35, outcome:`Màn hình sáng rực, nhưng lòng trống rỗng. Bạn đợi cảm giác được nhìn thấy — nó không đến.`}
    ],
    next:"lunch"
  },
  { id:"lunch", bg:"corridor", time:"10:45",
    text:(n)=>`Căn tin ồn ào mà ấm. Khay cơm nóng trên tay.`,
    choices:(n)=>[
      {label:"Ngồi một mình + xem video", delta:+0.25, outcome:`Bữa trưa trôi qua như một đoạn clip: nhanh, sáng, và rỗng.`},
      {label:"Ngồi cùng nhóm bạn, kể chuyện nhỏ", delta:-0.1, outcome:`"Chiều có thể dục đó." "Ok mai nhớ mang giày." • Món ăn bỗng có vị.`}
    ],
    next:"ending"
  }
];

function App(){
  useAudioAutoplay();
  const sfx = useSfx();
  const [state,setState] = useState({ name:"" });
  const [sceneIdx,setSceneIdx] = useState(0);
  const [fomo,setFomo] = useState(0);
  const [outcome,setOutcome] = useState(null); // { text, nextSceneId }

  const scene = SCENES[sceneIdx];
  const bg = BG[scene.bg] || BG.exterior;
  const progress = Math.round((sceneIdx/(SCENES.length-1))*100);

  const goto = id => {
    const i = SCENES.findIndex(s=>s.id===id);
    if (i>=0) setSceneIdx(i);
  };

  const choose = opt => {
    sfx("msg");
    setFomo(v => +(v + (opt.delta||0)).toFixed(2));
    setOutcome({ text: opt.outcome, next: scene.next });
  };

  const proceed = () => {
    if (!outcome) return;
    setOutcome(null);
    if (scene.next) goto(scene.next);
  };

  const level = fomo<=0? "Không bị FOMO" : fomo<1.6? "FOMO nhẹ" : fomo<3? "FOMO trung bình" : "FOMO nặng";
  const advice = fomo<=0? "Bạn vững vàng và biết tận hưởng khoảnh khắc." :
                 fomo<1.6? "Đôi lúc so sánh nhưng vẫn tự chủ. Tránh lướt lúc mới dậy và trước khi ngủ." :
                 fomo<3? "Bạn dễ bị kéo bởi câu chuyện của người khác. Giới hạn mạng xã hội, tăng hoạt động thật." :
                          "FOMO đang ảnh hưởng mạnh. Đã đến lúc dựng lại thói quen, đọc 'Cẩm nang Bye FOMO' và ghé FOMO Guard.";

  return (<div className="app" style={{backgroundImage:`url(${bg})`}}>
    <div className="card">
      <div className="topbar">
        <div className="badge">{scene.time}</div>
        <div className="small">Tiến độ: {progress}% • FOMO: {fomo>0?`+${fomo}`:fomo}</div>
      </div>

      {"render" in scene
        ? scene.render(state,setState,{goto})
        : outcome
          ? (<div className="outcome">
               <h2>Kết quả lựa chọn</h2>
               <p>{outcome.text}</p>
               <div className="footer"><button className="btn" onClick={proceed}>Tiếp tục</button></div>
             </div>)
          : (<>
               <h1>1 Ngày</h1>
               <p>{typeof scene.text==="function" ? scene.text(state.name) : scene.text}</p>
               <div className="choices">
                 {scene.choices(state.name).map((c,i)=>(
                   <button key={i} className="choice" onClick={()=>choose(c)}>{c.label}</button>
                 ))}
               </div>
             </>)
      }

      {scene.id==="ending" && !outcome && (<>
        <hr/>
        <p><strong>Tóm tắt:</strong> {advice}</p>
        <p><strong>Mức độ:</strong> {level} — Chỉ số FOMO hôm nay: <strong>{fomo>0?`+${fomo}`:fomo}</strong></p>
        <div className="footer"><button className="btn secondary" onClick={()=>{ setSceneIdx(0); setFomo(0); setState({name:""}); }}>Chơi lại</button></div>
      </>)}
    </div>
  </div>);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
