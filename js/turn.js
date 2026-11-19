// ======================================================================
// THE PAGE TRANSITION, in grain: a soft band of dark grey grain sweeps straight across the screen,
// left to right when going forward and right to left when going back. It is never a solid colour:
// every pixel has its own threshold and its own shade of charcoal, so the grain fills in speck by speck
// as the band passes, and even at its fullest some paper still shows between the specks.
// ======================================================================
const TURN_SECONDS = 0.6;    // each half of the transition: the grain sweeping in, then sweeping off (lower = quicker)
const TURN_SOFTNESS = 0.55;  // width of the soft front, as a share of the screen (wider = a gentler, more diffused edge)
const TURN_DENSITY = 0.72;   // how much of the screen the grain covers at its fullest (below 1, so it never turns solid)
const TURN_DARK = [120, 172]; // the range of greys the specks are drawn in (0 = black, 255 = white): a light pencil grey
const TURN_INK = [95, 85];   // how strongly each speck shows: a base, plus more as the band fills in (out of 255)
const TURN_RESOLUTION = 1;   // canvas pixels per screen pixel: one fine speck per pixel (higher is finer still, but slower to draw)
const tctx = document.querySelector('canvas.turn').getContext('2d');
let turnW = 0, turnH = 0, turnThresh = null, turnColor = null, turnImg = null, turnBuf = null, turnFull = null, turnCov = null;
let turnState = { phase: 'out', dir: 'ltr', p: 1 }, turnAnim = null, turning = false;
function sizeTurn() {
  const c = tctx.canvas, r = c.getBoundingClientRect(), dpr = TURN_RESOLUTION;
  turnW = Math.max(1, Math.round(r.width * dpr)); turnH = Math.max(1, Math.round(r.height * dpr));
  c.width = turnW; c.height = turnH;
  turnImg = tctx.createImageData(turnW, turnH);
  turnBuf = new Uint32Array(turnImg.data.buffer);
  turnThresh = new Float32Array(turnW * turnH);
  turnColor = new Uint32Array(turnW * turnH);
  for (let i = 0; i < turnW * turnH; i++) {
    turnThresh[i] = Math.random();
    const g = Math.round(TURN_DARK[0] + Math.random() * (TURN_DARK[1] - TURN_DARK[0]));
    turnColor[i] = (g << 16) | (g << 8) | g;
  }
  turnFull = new Uint32Array(turnW * turnH);              // the screen fully covered, worked out once
  for (let i = 0; i < turnW * turnH; i++) turnFull[i] = (speckAlpha(i, 1) << 24) | turnColor[i];
  turnCov = new Float32Array(turnW);
  drawTurn();
  buildTurnGrain();
}
const grainEl = document.querySelector('.turn-grain');
function buildTurnGrain() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3), n = 256;
  const c = document.createElement('canvas'); c.width = c.height = n;
  const g = c.getContext('2d'), img = g.createImageData(n, n);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() + Math.random() - 1) * 70;   // mid grey with soft variation: overlay leaves mid grey invisible
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  grainEl.style.backgroundImage = 'url(' + c.toDataURL() + ')';
  grainEl.style.backgroundSize = (n / dpr) + 'px ' + (n / dpr) + 'px';   // one speck per physical screen pixel
}
// phase 'in': the grain sweeps across the screen; phase 'out': it sweeps off the far side.
// dir 'ltr' sweeps left to right (going forward), 'rtl' right to left (going back).
// a speck shows once the band is dense enough for its threshold; the rest stay a faint haze
const speckAlpha = (i, cov) => turnThresh[i] < cov * TURN_DENSITY ? (TURN_INK[0] + cov * TURN_INK[1]) | 0 : (cov * 28) | 0;
function drawTurn() {
  if (!turnBuf) return;
  const { phase, dir, p } = turnState;
  if (phase === 'out' && p >= 1) { tctx.clearRect(0, 0, turnW, turnH); return; }
  const soft = turnW * TURN_SOFTNESS, front = p * (turnW + soft);
  for (let x = 0; x < turnW; x++) {                       // the band is straight, so its coverage only changes across the screen
    const dist = dir === 'rtl' ? turnW - 1 - x : x;
    let v = (front - dist) / soft;
    v = v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v);   // a soft ramp: no hard edge
    turnCov[x] = phase === 'in' ? v : 1 - v;
  }
  for (let y = 0; y < turnH; y++) {                       // fully covered and empty stretches are copied whole; only the soft edge is worked out
    const row = y * turnW;
    let x = 0;
    while (x < turnW) {
      const c = turnCov[x];
      if (c >= 1 || c <= 0) {
        let e = x + 1;
        while (e < turnW && (turnCov[e] >= 1) === (c >= 1) && (turnCov[e] <= 0) === (c <= 0)) e++;
        if (c >= 1) turnBuf.set(turnFull.subarray(row + x, row + e), row + x); else turnBuf.fill(0, row + x, row + e);
        x = e;
      } else { turnBuf[row + x] = (speckAlpha(row + x, c) << 24) | turnColor[row + x]; x++; }
    }
  }
  tctx.putImageData(turnImg, 0, 0);
}
// Each half follows the same eased path as always, but skips the stretch where nothing visibly changes:
// the end of the sweep in, once the whole screen already looks dark, and the start of the sweep out,
// before any of the page shows through. The moving parts keep exactly the same speed.
const COVERED_LOOK = 0.9;    // how dark counts as "fully dark" (lower trims more of the dark moment)
function animateTurn(phase, dir, done) {
  cancelAnimationFrame(turnAnim);
  const easeIn = t => 1 - Math.pow(1 - t, 2.2), easeOut = t => Math.pow(t, 1.8);
  const range = 1 + TURN_SOFTNESS;          // the shadow's travel, in page widths
  const pDark = Math.min(1, (1 + COVERED_LOOK * TURN_SOFTNESS) / range);   // every corner already dark
  const pShow = (1 - COVERED_LOOK + 0.18) * TURN_SOFTNESS / range;                     // the first corner starts to show
  const t0 = phase === 'in' ? 0 : Math.pow(pShow, 1 / 1.8);
  const t1 = phase === 'in' ? 1 - Math.pow(1 - pDark, 1 / 2.2) : 1;
  const start = performance.now(), dur = reduceMotion ? 0 : TURN_SECONDS * 1000 * (t1 - t0);
  const step = now => {
    const t = dur ? t0 + (t1 - t0) * clamp((now - start) / dur, 0, 1) : t1;
    turnState = { phase, dir, p: phase === 'in' ? easeIn(t) : easeOut(t) };
    drawTurn();
    if (t < t1) turnAnim = requestAnimationFrame(step);
    else { if (phase === 'out') { turnState = { phase, dir, p: 1 }; drawTurn(); } if (done) done(); }
  };
  turnAnim = requestAnimationFrame(step);
}
