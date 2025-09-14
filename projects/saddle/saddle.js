// Your original simulator logic, wrapped and loaded with defer
(() => {
  // ----- World <-> Screen -----
  const W = 600, H = 600;
  const world = { xmin:-2, xmax:2, ymin:-2, ymax:2 };
  const xscale = x => (x - world.xmin) * W / (world.xmax - world.xmin);
  const yscale = y => H - (y - world.ymin) * H / (world.ymax - world.ymin);
  const ix = X => world.xmin + X * (world.xmax - world.xmin) / W;
  const iy = Y => world.ymin + (H - Y) * (world.ymax - world.ymin) / H;

  // ----- DOM -----
  const cv = document.getElementById('cv');
  const ctx = cv.getContext('2d');
  const methodSel = document.getElementById('method');
  const etaSlider = document.getElementById('eta');
  const speedSlider = document.getElementById('speed');
  const etaVal = document.getElementById('etaVal');
  const spdVal = document.getElementById('spdVal');
  const iterEl = document.getElementById('iter');
  const xyEl = document.getElementById('xy');
  const xy0El = document.getElementById('xy0');
  const distEl = document.getElementById('dist');

  // ----- State -----
  let method = methodSel.value;
  let eta = parseFloat(etaSlider.value);
  let speed = parseInt(speedSlider.value,10);
  let anim = null;

  let x0 = 1.0, y0 = -0.6;     // start
  let x = x0,  y = y0;         // current
  let path = [[x,y]];
  let iters = 0;

  function updateDisplays(){
    iterEl.textContent = iters;
    xyEl.textContent = `${x.toFixed(3)}, ${y.toFixed(3)}`;
    distEl.textContent = Number(Math.hypot(x,y)).toPrecision(3);
  }

  function setInit(xx, yy){
    x0 = xx; y0 = yy;
    xy0El.textContent = `${x0.toFixed(2)}, ${y0.toFixed(2)}`;
    reset();
  }

  // ----- Methods -----
  function step_naive(){
    const xn = x + eta * y;
    const yn = y - eta * x;
    x = xn; y = yn;
  }

  function step_extragradient(){
    // predictor
    const xp = x + eta * y;
    const yp = y - eta * x;
    // corrector using grad at predicted point
    const xn = x + eta * yp;   // y' in ∂f/∂x = y
    const yn = y - eta * xp;   // x' in ∂f/∂y = x
    x = xn; y = yn;
  }

  function step_lola(){
    // First-order LOLA (opponent-aware) for zero-sum f=xy
    // x <- x - η( y - η x ) ; y <- y - η( -x - η y )
    const xn = x + eta*( y - eta*x );
    const yn = y + eta*( -x + eta*y );
    x = xn; y = yn;
  }

  function step_conjectural(){
    // Player 1 follows ∇(-x^2) ; Player 2 follows ∇(-y^2)
    const xn = x - 2*eta*x;
    const yn = y - 2*eta*y;
    x = xn; y = yn;
  }

  function stepOnce(){
    switch(method){
      case 'naive': step_naive(); break;
      case 'extragradient': step_extragradient(); break;
      case 'lola': step_lola(); break;
      case 'conjectures': step_conjectural(); break;
    }
    path.push([x,y]);
    if (path.length > 6000) path.shift();
    iters++;
    updateDisplays();
  }

  // ----- Drawing -----
  function drawAxes(){
    ctx.save();
    ctx.strokeStyle = '#ccc';
    for (let gx = Math.ceil(world.xmin); gx <= Math.floor(world.xmax); gx++){
      const X = xscale(gx);
      ctx.beginPath(); ctx.moveTo(X,0); ctx.lineTo(X,H); ctx.stroke();
    }
    for (let gy = Math.ceil(world.ymin); gy <= Math.floor(world.ymax); gy++){
      const Y = yscale(gy);
      ctx.beginPath(); ctx.moveTo(0,Y); ctx.lineTo(W,Y); ctx.stroke();
    }
    ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, yscale(0)); ctx.lineTo(W, yscale(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xscale(0), 0); ctx.lineTo(xscale(0), H); ctx.stroke();
    ctx.restore();
  }

  function drawContours(){
    ctx.save();
    ctx.strokeStyle = '#eee';
    const cs = [-1.5,-1,-0.5,0.5,1,1.5];
    for (const c of cs){
      ctx.beginPath(); let first=true;
      for (let i=0;i<=600;i++){
        const xv = world.xmin + (i/600)*(world.xmax-world.xmin);
        if (Math.abs(xv)<0.05) continue;
        const yv = c/xv;
        if (yv<world.ymin||yv>world.ymax) continue;
        const X=xscale(xv),Y=yscale(yv);
        if (first){ctx.moveTo(X,Y);first=false;} else ctx.lineTo(X,Y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMarkers(){
    ctx.save();
    // NE at (0,0)
    const NX=xscale(0),NY=yscale(0);
    ctx.strokeStyle='red'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(NX-6,NY-6); ctx.lineTo(NX+6,NY+6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(NX-6,NY+6); ctx.lineTo(NX+6,NY-6); ctx.stroke();

    // Starting point
    const SX=xscale(x0),SY=yscale(y0);
    ctx.beginPath(); ctx.arc(SX,SY,5,0,2*Math.PI);
    ctx.fillStyle='rgba(0,0,255,0.2)'; ctx.fill();
    ctx.strokeStyle='blue'; ctx.lineWidth=2; ctx.stroke();

    // Current point
    const CX=xscale(x),CY=yscale(y);
    ctx.beginPath(); ctx.arc(CX,CY,4,0,2*Math.PI);
    ctx.fillStyle='black'; ctx.fill();
    ctx.restore();
  }

  function drawPath(){
    if (path.length<2) return;
    ctx.save();
    ctx.strokeStyle='#000';
    ctx.beginPath();
    for (let i=0;i<path.length;i++){
      const [px,py]=path[i];
      const X=xscale(px), Y=yscale(py);
      if (i===0) ctx.moveTo(X,Y); else ctx.lineTo(X,Y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function render(){
    ctx.clearRect(0,0,W,H);
    drawAxes();
    drawContours();
    drawPath();
    drawMarkers();
  }

  // ----- Animation -----
  function tick(){ for(let k=0;k<speed;k++) stepOnce(); render(); }
  function start(){ if(!anim) anim=setInterval(tick,16); }
  function pause(){ if(anim){clearInterval(anim);anim=null;} }
  function reset(){
    pause();
    x = x0; y = y0; path = [[x,y]];
    iters = 0;
    updateDisplays();
    render();
  }
  function stepManual(){ stepOnce(); render(); }

  // ----- Events -----
  methodSel.addEventListener('change', e => { method = e.target.value; });
  etaSlider.addEventListener('input', e => {
    eta = parseFloat(e.target.value);
    etaVal.textContent = Number(eta).toPrecision(3);
  });
  speedSlider.addEventListener('input', e => {
    speed = parseInt(e.target.value,10);
    spdVal.textContent = speed;
  });

  document.getElementById('start').onclick = start;
  document.getElementById('pause').onclick = pause;
  document.getElementById('reset').onclick = reset;
  document.getElementById('step').onclick  = stepManual;

  cv.addEventListener('mousedown', e => {
    const r = cv.getBoundingClientRect();
    setInit(ix(e.clientX - r.left), iy(e.clientY - r.top));
  });

  // Init
  etaVal.textContent = Number(eta).toPrecision(3);
  updateDisplays();
  render();
})();
