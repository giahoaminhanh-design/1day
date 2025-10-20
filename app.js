(function(){
  const app = document.getElementById('app');
  const BG = {swings:'assets/bg-swings.png', exterior:'assets/bg-exterior.png', corridor:'assets/bg-corridor.png'};

  // audio kick for mobile
  (function ensureAudio(){
    const a = document.getElementById('bgm'); if(!a) return;
    const kick = ()=>{a.muted=false; a.play().catch(()=>{}); window.removeEventListener('click',kick); window.removeEventListener('touchstart',kick);};
    a.play().catch(()=>{});
    window.addEventListener('click',kick,{once:true});
    window.addEventListener('touchstart',kick,{once:true});
  })();

  // simple sfx
  function sfx(){
    try{
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 860;
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t+0.18);
      o.start(t); o.stop(t+0.2);
    }catch{}
  }

  function withName(s, n){ return s.replaceAll('{name}', n || 'bạn'); }

  const SCENES = [
    {id:'guide', bg:'swings', time:'Hướng dẫn', render:(state)=>`
      <h1>Ngày của em</h1>
      <p><strong>Chào mừng bạn đến với ngày của em.</strong> Đây là một ngày học đường tương tác. Mỗi lựa chọn sẽ mở ra <em>trang kể diễn biến</em> theo tên của bạn, rồi nhấn <b>Tiếp tục</b> để đi tiếp.</p>
      <ul>
        <li>Nhạc nền phát ngay khi vào (điện thoại có thể cần chạm một cái).</li>
        <li>FOMO tăng khi bạn bị kéo bởi ánh nhìn người khác; giảm khi bạn hiện diện, chủ động.</li>
        <li>Cuối ngày có trang kết thúc: phân tích chỉ số + lời khuyên (Cẩm nang Bye FOMO / FOMO Buddy).</li>
      </ul>
      <div class="footer"><button class="btn" data-goto="name">Vào game</button></div>
    `},
    {id:'name', bg:'exterior', time:'5:30', render:(state)=>`
      <p>Cho mình biết tên để câu chuyện gọi đúng người nha:</p>
      <input id="nameInput" class="input" placeholder="Tên của bạn…" value="${state.name||''}"/>
      <div class="footer"><button class="btn" id="startBtn">Bắt đầu</button></div>
    `, onMount:(state, setState, goto)=>{
      const input = document.getElementById('nameInput');
      const btn = document.getElementById('startBtn');
      const enable = ()=>{ btn.disabled = !(input.value.trim().length>0); };
      enable(); input.addEventListener('input', enable);
      btn.addEventListener('click', ()=>{ setState({name:input.value.trim()}); goto('wake'); });
    }},
    {id:'wake', bg:'corridor', time:'5:30', text:(n)=>withName(`Sáng sớm. Chuông reo. Mẹ gọi: "Dậy ăn sáng nè {name}!"`,n),
      choices:(n)=>[
        {label:'Mở điện thoại xem thông báo', delta:+0.5, outcome:withName('Tiếng chuông vừa dứt, {name} đã với tay tìm lấy chiếc điện thoại.  
Ánh sáng xanh hắt lên khuôn mặt còn in dấu gối. Màn hình sáng như một phiên chợ sớm — nơi mọi người đã kịp kể cho nhau cả trăm mẩu chuyện.  
Một vài thông báo hiện ra, vô thưởng vô phạt, nhưng tim {name} vẫn đập nhanh hơn.  
Không biết là vì tò mò, hay vì sợ mình đang bỏ lỡ điều gì đó ngoài kia.',n)},
        {label:'Tắt chuông, duỗi người, hít sâu', delta:-0.2, outcome:withName('{name} úp điện thoại xuống, lưng duỗi nghe một tiếng "rắc" nho nhỏ...',n)},
        {label:"Nhắn bạn thân: 'Dậy chưa?'", delta:+0.1, outcome:withName('"{name}: Ê dậyyyy…" • "Bạn thân: Chưa… ngủ tiếp 5p :))" ...',n)},
        {label:'Ra bàn ăn ngay cho nóng', delta:-0.05, outcome:withName('{name} kéo ghế. Lòng đỏ trứng như mặt trời nằm trên đĩa...',n)}],
      next:'pickup' },
    {id:'pickup', bg:'exterior', time:'6:15', text:(n)=>withName('Xe đưa rước dừng trước cổng. {name} bước lên, vài bạn vẫy tay.',n),
      choices:(n)=>[
        {label:'Cắm tai nghe, lướt TikTok', delta:+0.3, outcome:withName('Chiếc xe chạy trôi như một đoạn reel...',n)},
        {label:'Chào bác tài, ngồi cạnh bạn nói chuyện', delta:-0.1, outcome:withName('"Hôm nay kiểm tra đúng không?" — "Ừ, chắc qua nổi á." ...',n)},
        {label:'Chụp trời đăng story', delta:+0.2, outcome:withName('Bầu trời căng xanh, caption tinh tế...',n)}],
      next:'class1' },
    {id:'class1', bg:'corridor', time:'7:00', text:(n)=>withName('Trong lớp. Cô giảng bài, tiếng phấn cọt kẹt...',n),
      choices:(n)=>[
        {label:'Lén xem group chat lớp khác', delta:+0.4, outcome:withName('"Bạn {name} ơi, em có nghe không?" — cô gọi...',n)},
        {label:'Ghi chép đều tay', delta:-0.2, outcome:withName('Mỗi dòng chữ như một sợi dây neo...',n)},
        {label:'Hỏi lại chỗ chưa hiểu', delta:-0.1, outcome:withName('{name} giơ tay hỏi. Vài bạn quay xuống, không phải để soi...',n)}],
      next:'break1' },
    {id:'break1', bg:'swings', time:'8:30', text:(n)=>withName('Ra chơi. Sân rợp bóng phượng...',n),
      choices:(n)=>[
        {label:'Xuống sân chơi thật', delta:-0.15, outcome:withName('{name} chạy vài vòng, mồ hôi rịn...',n)},
        {label:'Ở lại lớp, xem story người khác', delta:+0.25, outcome:withName('Ai đó đi biển, ai đó tập gym...',n)},
        {label:"Đăng story 'chán ghê' chờ ai đó nhắn", delta:+0.35, outcome:withName('Thông báo nhảy lên, tim {name} nhảy theo...',n)}],
      next:'lunch' },
    {id:'lunch', bg:'corridor', time:'10:45', text:(n)=>withName('Căn tin ồn mà ấm...',n),
      choices:(n)=>[
        {label:'Ngồi một mình + xem video', delta:+0.25, outcome:withName('Cơm nguội một nửa, video nóng hổi...',n)},
        {label:'Ngồi cùng nhóm bạn, kể chuyện nhỏ', delta:-0.1, outcome:withName('"Chiều có thể dục đó." — "Mai nhớ mang giày." ...',n)}],
      next:'nap' },
    {id:'nap', bg:'swings', time:'11:35', text:(n)=>withName('Giờ nghỉ trưa. Hành lang yên...',n),
      choices:(n)=>[
        {label:'Lướt tới khi ngủ gục', delta:+0.25, outcome:withName('Giấc ngủ chắp vá...',n)},
        {label:'Đặt điện thoại xa tầm tay', delta:-0.2, outcome:withName('{name} nhắm mắt thật sự...',n)},
        {label:'Nhắn cho crush rồi ngủ', delta:+0.15, outcome:withName('Tin nhắn gửi đi...',n)}],
      next:'class2' },
    {id:'class2', bg:'exterior', time:'14:00', text:(n)=>withName('Buổi chiều vào học...',n),
      choices:(n)=>[
        {label:'Phát biểu 1 lần', delta:-0.1, outcome:withName('"Ví dụ của {name} hay đấy." ...',n)},
        {label:'Ngồi im, mở chat nhóm', delta:+0.25, outcome:withName('Tin nhắn díp díp; bài giảng đi lướt qua...',n)},
        {label:'Gửi meme trong giờ', delta:+0.3, outcome:withName('Cả lớp cười; cô liếc...',n)}],
      next:'break2' },
    {id:'break2', bg:'swings', time:'15:30', text:(n)=>withName('Ra chơi chiều. Gió mát...',n),
      choices:(n)=>[
        {label:'Đá bóng/nhảy dây', delta:-0.15, outcome:withName('{name} vận động tới khi hơi thở nóng...',n)},
        {label:'Đứng xem người khác chơi rồi lên story', delta:+0.3, outcome:withName('{name} kể lại cuộc vui cho màn hình...',n)},
        {label:'Ngồi ghế, nghe nhạc cũ', delta:-0.05, outcome:withName('Giai điệu quen hạ nhiệt cả ngày dài...',n)}],
      next:'home' },
    {id:'home', bg:'exterior', time:'16:30', text:(n)=>withName('Tan học. Hoàng hôn phủ hàng cây; xe đưa rước chờ trước cổng.',n),
      choices:(n)=>[
        {label:'Mở mạng xem "ai làm gì hôm nay"', delta:+0.35, outcome:withName('Một cơn sóng trống rỗng dâng lên...',n)},
        {label:'Nhìn trời, nghe nhạc nhẹ', delta:-0.2, outcome:withName('Màu trời dịu lại...',n)},
        {label:'Nhắn xin bài tập nhóm khác', delta:+0.1, outcome:withName('{name} đỡ lo...',n)}],
      next:'ENDING' }
  ];

  const state = { idx:0, name:'', fomo:0, pending:null, ending:false };

  function setState(p){
    Object.assign(state, p||{});
    render();
  }

  function goto(id){
    const k = SCENES.findIndex(x=>x.id===id);
    if(k>=0){ setState({ idx:k, pending:null, ending:false }); }
  }

  function choose(opt){
    sfx();
    state.fomo = +(state.fomo + (opt.delta||0)).toFixed(2);
    state.pending = { text: opt.outcome, next: SCENES[state.idx].next };
    render();
  }

  function proceed(){
    const nxt = state.pending?.next;
    state.pending = null;
    if(nxt === 'ENDING'){
      state.ending = true;
      render();
    }else{
      goto(nxt);
    }
  }

  function levelFrom(f){
    if(f<=0) return "Không bị FOMO";
    if(f<1.0) return "FOMO rất nhẹ (~0.3–0.9)";
    if(f<2.2) return "FOMO nhẹ";
    if(f<3.0) return "FOMO trung bình";
    return "FOMO nặng";
  }

  function analysis(f, n){
    if(f<=0) return `${n} giữ được nhịp riêng cả ngày. Không tách mình khỏi thế giới, chỉ là chọn ở trong câu chuyện của chính mình.`;
    if(f<1.0) return `Đôi khi ${n} vẫn bị kéo bởi noti, nhưng nhận ra sớm và tự ghì nhịp lại. Những kết nối ngoài đời giúp ${n} đứng vững.`;
    if(f<2.2) return `${n} nhạy với ánh nhìn người khác: like, story đủ làm nhịp tim lệch. 1–2 neo hiện tại (ghi chép, vận động) là đủ kéo về.`;
    if(f<3.0) return `Sợ bỏ lỡ bắt đầu ảnh hưởng tập trung và tâm trạng của ${n}. Đôi lúc ${n} kể chuyện cho màn hình, còn bản thân thì mờ dần.`;
    return `${n} đo ngày của mình bằng ánh mắt người khác và thấy mình nhỏ dần. Ảnh hưởng cảm xúc, học tập và quan hệ.`;
  }

  function advice(f){
    if(f<=0) return "Duy trì 'cửa sổ yên' buổi sáng; khi so sánh trỗi dậy, thở sâu 3 nhịp và quay về cơ thể.";
    if(f<1.0) return "Chọn 2 khoảng 'không màn hình' (sáng sớm, trước ngủ). Đặt điện thoại xa tay 15–20 phút.";
    if(f<2.2) return "Đọc 'Cẩm nang Bye FOMO'; thử trò chuyện FOMO Buddy khi thấy lòng 'đói' được nhìn thấy.";
    if(f<3.0) return "Giới hạn mạng theo khung giờ; tăng 'thân thể học' (vận động ngắn, thở 4-7-8, 3 dòng nhật ký). Kèm Bye FOMO + FOMO Buddy.";
    return "Dựng lại thói quen: 'cửa sổ yên' đầu ngày, tắt push, chỉ mở mạng giờ cố định. Đọc Bye FOMO và trò chuyện FOMO Buddy.";
  }

  function render(){
    const scene = SCENES[state.idx];
    const bg = state.ending ? BG.exterior : (BG[scene.bg] || BG.exterior);
    app.style.backgroundImage = `url('${bg}')`;

    if(state.ending){
      app.innerHTML = `<div class="card ending">
        <h1>Ngày của em — Kết quả</h1>
        <p><strong>Chỉ số FOMO:</strong> ${state.fomo.toFixed(2)} &nbsp;•&nbsp; <strong>Mức độ:</strong> ${levelFrom(state.fomo)}</p>
        <p>${analysis(state.fomo, state.name||'bạn')}</p>
        <p><strong>Lời khuyên:</strong> ${advice(state.fomo)}</p>
        <p class="small">Để hiểu rõ hơn về FOMO và cách quay lại với chính mình, hãy đọc <em>Cẩm nang Bye FOMO</em> hoặc trò chuyện cùng <strong>FOMO Buddy</strong>.</p>
        <div class="footer"><button class="btn secondary" id="resetBtn">Chơi lại từ đầu</button></div>
      </div>`;
      document.getElementById('resetBtn').addEventListener('click', ()=>{
        setState({ idx:0, name:'', fomo:0, pending:null, ending:false });
      });
      return;
    }

    // normal scenes
    let content = '';
    if(scene.render){
      content = scene.render(state);
    }else if(state.pending){
      content = `<div class="outcome">
        <h2>Kết quả lựa chọn</h2>
        <p>${state.pending.text}</p>
        <div class="footer"><button class="btn" id="proceedBtn">Tiếp tục</button></div>
      </div>`;
    }else{
      const text = (typeof scene.text === 'function' ? scene.text(state.name) : (scene.text||''));
      const choices = (scene.choices? scene.choices(state.name):[]).map((c,i)=>`<button class="choice" data-idx="${i}">${c.label}</button>`).join('');
      content = `<h1>Ngày của em</h1><p>${text}</p><div class="choices">${choices}</div>`;
    }

    app.innerHTML = `<div class="card">
      <div class="topbar"><div class="badge">${scene.time}</div></div>
      ${content}
    </div>`;

    // wire events
    const guideBtn = app.querySelector('[data-goto="name"]');
    if(guideBtn){ guideBtn.addEventListener('click', ()=>goto('name')); }

    const choiceButtons = app.querySelectorAll('.choice');
    if(choiceButtons.length){
      const choices = scene.choices(state.name);
      choiceButtons.forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const idx = +btn.getAttribute('data-idx');
          choose(choices[idx]);
        });
      });
    }

    const proceedBtn = document.getElementById('proceedBtn');
    if(proceedBtn){ proceedBtn.addEventListener('click', proceed); }

    if(scene.onMount){ scene.onMount(state, setState, goto); }
  }

  // initial render
  render();
})();
