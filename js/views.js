// ======================================================================
// VIEWS: the cover, the opening spread (about and contents), the project spreads,
// the hover previews, and the page turns between them
// ======================================================================
const $ = sel => document.querySelector(sel);
const coverEl = $('#cover'), aboutEl = $('#about'), homeEl = $('#home'), projectEl = $('#project'), turnEl = $('canvas.turn');
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

// ---------- graphite shading around a box (the Works menu, the hover previews) ----------
// Fine dots, densest right at the box's edge, fading out a little way beyond it and a short way inside it.
function drawEdgeGrain(cv, bw, bh, out, inn, soft = false) {
  const w = bw + out * 2, h = bh + out * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2), g = cv.getContext('2d');
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  g.fillStyle = css('--graphite');
  const tones = [[], [], []];
  for (let y = 0; y < h; y += 0.5) for (let x = 0; x < w; x += 0.5) {
    const dx = Math.max(out - x, x - (out + bw), 0), dy = Math.max(out - y, y - (out + bh), 0);
    const outside = Math.hypot(dx, dy), inside = Math.min(x - out, out + bw - x, y - out, out + bh - y);
    let d;
    if (outside > 0) d = outside < out ? (soft ? 0.38 * Math.pow(1 - outside / out, 1.5) : 0.55 * Math.pow(1 - outside / out, 2.2)) : 0;
    else d = inside < inn ? 0.4 * Math.pow(1 - inside / inn, 2) : 0.015;   // a little paper grain inside
    if (Math.random() < d * 0.25) tones[d > 0.35 ? 2 : d > 0.12 ? 1 : 0].push(x + Math.random() * 0.5, y + Math.random() * 0.5, 0.22 + 0.22 * Math.random());
  }
  [0.18, 0.32, 0.5].forEach((alpha, t) => {
    const b = tones[t];
    g.globalAlpha = alpha;
    g.beginPath();
    for (let j = 0; j < b.length; j += 3) { g.moveTo(b[j] + b[j + 2], b[j + 1]); g.arc(b[j], b[j + 1], b[j + 2], 0, TAU); }
    g.fill();
  });
  g.globalAlpha = 1;
}

// ---------- the Works menu on every page with navigation ----------
const menus = [...document.querySelectorAll('.menu')].map(m => ({ el: m, toggle: m.querySelector('.works-toggle'), list: m.querySelector('.works-menu') }));
function buildWorksMenu() {
  menus.forEach(({ list }) => PROJECTS.filter(p => p.group === 'Works').forEach(p => {
    const b = el('button');
    b.type = 'button'; b.dataset.id = p.id;
    b.append(el('span', 'no', p.no), el('span', 't', p.title));
    const li = el('li'); li.append(b);
    list.append(li);
  }));
}
const MENU_SHADE_OUT = 14, MENU_SHADE_IN = 7;
function drawMenuGrain(menu) {
  const cv = menu.el.querySelector('.menu-grain'), ul = menu.list, M = MENU_SHADE_OUT;
  const bw = ul.offsetWidth, bh = ul.offsetHeight;
  Object.assign(cv.style, { left: (ul.offsetLeft - M) + 'px', top: (ul.offsetTop - M) + 'px', width: (bw + M * 2) + 'px', height: (bh + M * 2) + 'px' });
  if (cv._size === bw + 'x' + bh) return;
  cv._size = bw + 'x' + bh;
  drawEdgeGrain(cv, bw, bh, M, MENU_SHADE_IN);
}
function setMenu(menu, open) {
  menu.list.hidden = !open;
  menu.el.querySelector('.menu-grain').hidden = !open;
  if (open) drawMenuGrain(menu);
  menu.toggle.setAttribute('aria-expanded', String(open));
  if (open) { const first = menu.list.querySelector('button:not([aria-current])'); if (first) first.focus({ preventScroll: true }); }
}
const closeMenus = () => menus.forEach(m => setMenu(m, false));
menus.forEach(m => {
  m.toggle.addEventListener('click', e => { e.stopPropagation(); const open = m.list.hidden; closeMenus(); setMenu(m, open); });
  m.list.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.getAttribute('aria-current') === 'page') return;
    closeMenus();
    goTo(b.dataset.id, turnDir(b.dataset.id));
  });
});
document.addEventListener('click', e => { if (!e.target.closest('.menu')) closeMenus(); });
document.addEventListener('keydown', e => {
  const open = menus.find(m => !m.list.hidden);
  if (e.key === 'Escape' && open) { setMenu(open, false); open.toggle.focus(); e.stopImmediatePropagation(); }
}, true);

// ---------- the contents page and the About page ----------
function buildContents() {
  const lists = { Works: $('#toc-works-list'), Creatives: $('#toc-creatives-list') };
  PROJECTS.forEach(p => {
    if (!lists[p.group]) return;
    const b = el('button', 'toc-entry ink-text');
    b.type = 'button'; b.dataset.open = p.id;
    b.append(el('span', 'no', p.no), el('span', 't', p.title), el('span', 'leader', '. '.repeat(160)), el('span', 'meta', p.type));
    const li = el('li'); li.append(b);
    lists[p.group].append(li);
  });
}
function buildAbout() {
  $('#about-title').textContent = ABOUT.title || 'About';
  $('#about-blurb').replaceChildren(...(ABOUT.paragraphs || []).map(t => el('p', 'ink-text', t)));
}

// ---------- highlighted terms and their previews ----------
// Every picture, gallery or live site in a write-up is reached through a highlighted term. Its media is kept here.
let refMedia = [];
function makeRef(text, media, tag = 'span') {
  const r = el(tag, 'ref', text);
  r.dataset.ref = refMedia.push(media) - 1;
  if (tag === 'span') r.tabIndex = 0;
  return r;
}
const mediaItem = g => ({ src: g.src, alt: g.alt || g.fig || '', cap: g.cap != null ? g.cap : (g.fig || '') });
// Defined terms (a project's `terms` in content.js): while its write-up is built, the first time each term
// appears in the text it is underlined, and hovering it shows the definition, like a Wikipedia link preview.
let termsLeft = null;
function linkTerms(node, text) {
  while (termsLeft && termsLeft.length && text) {
    let best = null;
    termsLeft.forEach(([term, def]) => {
      const m = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:s|es|ing|ed)?\\b', 'i').exec(text);
      if (m && (!best || m.index < best.m.index)) best = { m, term, def };
    });
    if (!best) break;
    if (best.m.index) node.append(document.createTextNode(text.slice(0, best.m.index)));
    const r = makeRef(best.m[0], { items: [], def: { term: best.term, text: best.def } }); r.classList.add('term'); node.append(r);
    termsLeft = termsLeft.filter(([t]) => t !== best.term);
    text = text.slice(best.m.index + best.m[0].length);
  }
  if (text) node.append(document.createTextNode(text));
}
// '{{phrase|images/file.jpg|Caption}}' inside a paragraph highlights the phrase and previews that picture
// Several pictures: separate their paths with commas, '{{phrase|a.png, b.png|Caption}}', and they preview together, uncropped.
// '**words**' sets the words in bold.
function boldText(node, text) {
  text.split(/\*\*(.+?)\*\*/).forEach((part, i) => {
    if (!part) return;
    if (i % 2) node.append(el('strong', null, part)); else linkTerms(node, part);
  });
}
function richText(node, text) {
  const re = /\{\{([^|}]+)\|([^|}]+)(?:\|([^}]*))?\}\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) boldText(node, text.slice(last, m.index));
    const cap = (m[3] || '').trim(), srcs = m[2].split(',').map(x => x.trim()).filter(Boolean);
    const items = srcs.map((src, i) => ({ src, alt: m[1] + (srcs.length > 1 ? ' ' + (i + 1) : ''), cap }));
    node.append(makeRef(m[1], srcs.length > 1 ? { items, grid: true, whole: true, cap } : { items }));
    last = re.lastIndex;
  }
  if (last < text.length) boldText(node, text.slice(last));
  return node;
}
function siteLink(url, label) {                         // a live site: opens in a new tab, previews on hover
  const a = makeRef(label + ' \u2197', { items: [{ embed: url, cap: label }] }, 'a');
  a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
  return a;
}

// ---------- a write-up's blocks ----------
function pictureLine(panel) {                          // a picture panel becomes a highlighted line in the text
  const p = el('p', 'ref-line');
  if (panel.figs) {
    const figs = panel.figs.filter(g => g.src || g.fig);
    if (figs.length > 3) {                              // a gallery: one line, previewing every picture as a contact sheet
      p.append(makeRef('View the photos', { grid: true, items: figs.filter(g => g.src).map(mediaItem) }));
      return p;
    }
    figs.forEach((g, i) => {
      if (i) p.append(document.createTextNode(i === figs.length - 1 ? ' and ' : ', '));
      p.append(makeRef(g.fig || 'Picture', { items: [mediaItem(g)] }));
    });
    const caps = figs.map(g => g.cap).filter(Boolean);
    if (caps.length === 1) p.append(el('span', 'ref-cap', caps[0]));
    return p;
  }
  p.append(makeRef(panel.fig || 'Picture', { items: [mediaItem(panel)] }));
  if (panel.cap) p.append(el('span', 'ref-cap', panel.cap));
  return p;
}
function sectionBody(b, panel) {                         // facts, paragraphs and bullets of a section
  if (panel.facts) {
    const dl = el('dl', 'spec');
    panel.facts.forEach(([k, v]) => dl.append(el('dt', null, k), richText(el('dd'), v)));
    b.append(dl);
  }
  const paras = panel.p || [];
  let k = 0;
  const facts = el('div', 'facts');
  while (k < paras.length && paras[k].length < 70 && !/[.!?]$/.test(paras[k])) facts.append(richText(el('p'), paras[k++]));
  if (facts.childNodes.length) b.append(facts);
  for (; k < paras.length; k++) b.append(richText(el('p'), paras[k]));
  if (panel.list) {
    // a bullet is text, or { t: 'Subject', items: [...] }: the subject in bold with its points as bullets beneath it
    let ul = null;
    panel.list.forEach(item => {
      if (typeof item === 'string') {
        if (!ul) { ul = el('ul', 'bullets'); b.append(ul); }
        ul.append(richText(el('li'), item));
      } else {
        ul = null;
        const subj = el('p', 'bullet-subject');
        subj.append(el('strong', null, item.t));
        const sub = el('ul', 'bullets sub');
        (item.items || []).forEach(s => sub.append(richText(el('li'), s)));
        b.append(subj, sub);
      }
    });
  }
  if (panel.embed) { const p = el('p', 'ref-line'); p.append(siteLink(panel.embed, panel.embedLabel || 'Open the ' + (panel.h || 'site').toLowerCase())); b.append(p); }
  if (panel.link) {                                      // link: { href, label }: an ordinary link that opens in a new tab (no preview)
    const p = el('p', 'ref-line'), a = el('a', 'ext-link', panel.link.label + ' ↗');
    a.href = panel.link.href; a.target = '_blank'; a.rel = 'noopener';
    p.append(a); b.append(p);
  }
}
// A photo grid shown right on the page (a group with grid: true). Click a photo to open it full size.
function photoGrid(figs, whole) {                         // whole: each picture uncropped, kept in order
  const grid = el('div', 'photo-grid' + (whole ? ' whole' : ''));
  figs.filter(g => g.src).forEach(g => {
    const a = el('a', 'photo-cell');
    a.href = g.src; a.target = '_blank'; a.rel = 'noopener';
    const im = el('img');
    im.src = g.src; im.alt = g.alt || g.fig || ''; im.loading = 'lazy'; im.decoding = 'async';
    im.addEventListener('error', () => im.replaceWith(el('span', 'photo-missing', 'Picture not found')));
    const shape = () => { if (!whole && im.naturalHeight > im.naturalWidth) a.classList.add('tall'); };   // a vertical photo
    if (im.complete && im.naturalWidth) shape(); else im.addEventListener('load', shape);
    a.append(im);
    grid.append(a);
  });
  return grid;
}

function blockFor(panel) {
  const b = el('div', 'block');
  if (panel.grid && panel.figs) { b.classList.add('pictures'); b.append(photoGrid(panel.figs, panel.grid === 'whole')); return b; }
  if (panel.fig || panel.figs) { b.classList.add('pictures'); b.append(pictureLine(panel)); return b; }
  if (panel.fold) return foldBlock(panel);
  if (panel.pdf) {                                       // pdf: 'path.pdf' shows the document in the page
    b.classList.add('pdf-block');
    const o = el('object', 'pdf-embed'); o.data = panel.pdf; o.type = 'application/pdf';
    o.append(Object.assign(el('a', 'ext-link', 'Open the PDF ↗'), { href: panel.pdf, target: '_blank', rel: 'noopener' }));
    const line = el('p', 'ref-line'); line.append(Object.assign(el('a', 'ext-link', (panel.pdfLabel || 'Open the paper') + ' ↗'), { href: panel.pdf, target: '_blank', rel: 'noopener' }));
    b.append(o, line);
    return b;
  }
  const h3 = el('h3', panel.sub ? 'sub' : 'grain-full');   // sub: true makes a subsection heading, in clean ink rather than dotted grain
  if (!panel.p && !panel.list && !panel.facts && !panel.embed && !panel.link) b.classList.add('head-only');   // a heading over subsections
  if (panel.src || panel.img) {                         // the heading itself previews the section's picture
    h3.append(makeRef(panel.h, { items: [{ src: panel.src || panel.img, alt: panel.alt || panel.h, cap: panel.cap || panel.h }] }));
  } else h3.textContent = panel.h;
  if (panel.h) b.append(h3);                             // a section without a heading just shows its contents
  sectionBody(b, panel);
  const listText = (panel.list || []).flatMap(x => typeof x === 'string' ? [x] : [x.t, ...(x.items || [])]);
  const words = [...(panel.p || []), ...listText].join(' ').split(/\s+/).length;
  if (words > 90 || (panel.list && panel.list.length > 3)) b.classList.add('dense');
  return b;
}
// A dropdown: the heading and its one-line summary always show; the sections inside open and close.
let foldCount = 0;
const SHOW_FOLD_BARS = false;   // true puts the music lines back above the dropdowns on the right page
function foldBlock(panel) {
  const b = el('div', 'block fold'), id = 'fold-' + (foldCount++), open = !!panel.open;
  if (panel.film) b.dataset.film = panel.film;
  const head = el('div', 'fold-head');
  const h3 = el('h3', 'grain-full fold-title', panel.h);
  const btn = el('button', 'brace literal fold-toggle');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-controls', id);
  btn.append(el('span', 'b', '{'), el('span', 'label', open ? 'Close' : 'Open'), el('span', 'caret', open ? '\u25B4' : '\u25BE'), el('span', 'b', '}'));
  head.append(h3, btn);
  if (panel.bar !== undefined && SHOW_FOLD_BARS) {       // bar: n puts a line of the music above the dropdown (off: all the music is on the left page)
    const cv = el('canvas', 'music-bar');
    cv.dataset.bar = panel.bar; cv.setAttribute('aria-hidden', 'true');
    b.append(cv);
  }
  b.append(head);
  (panel.p || []).forEach(t => b.append(richText(el('p', 'fold-summary'), t)));
  if (panel.link) {                                       // a dropdown can show a link under its summary, outside the closed part
    const p = el('p', 'ref-line'), a = el('a', 'ext-link', panel.link.label + ' ↗');
    a.href = panel.link.href; a.target = '_blank'; a.rel = 'noopener';
    p.append(a); b.append(p);
  }
  const body = el('div', 'fold-body');
  body.id = id; body.hidden = !open;
  (panel.panels || []).forEach(pn => body.append(blockFor(pn)));
  b.append(body);
  return b;
}

// ---------- the project's reference page (left) ----------
// The facts and the introduction live here, so they can be checked at any point while reading.
const FACT_LINE = /^([A-Z][\w’'&\/ ]{1,26}):\s*(.+)$/;
const FACT_ORDER = ['role', 'timing', 'team', 'skills', 'tools'];          // every project lists these first, in this order
const FACT_SHOW = ['role', 'timing', 'team', 'skills', 'tools', 'client', 'location'];   // the facts on a Work's left page; the rest are told in the write-up
const FACT_ALIAS = { 'built with': 'Tools', 'tools used': 'Tools' };
function orderFacts(facts, info) {
  const list = [];
  facts.forEach(([k, v]) => { const key = FACT_ALIAS[(k || '').toLowerCase()] || k; list.push([key, v]); });
  (info || []).forEach(([k, v]) => {                       // INFO adds a fact, or replaces one with the same label
    const i = list.findIndex(([lk]) => lk && lk.toLowerCase() === k.toLowerCase());
    if (i >= 0) list[i] = [list[i][0], v]; else list.push([k, v]);
  });
  const rank = ([k]) => { const i = FACT_ORDER.indexOf((k || '').toLowerCase()); return i < 0 ? (k ? 50 : 90) : i; };
  return list.map((f, n) => [f, n]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(([f]) => f);
}
function splitOverview(d, panels) {
  let facts = [];
  const out = panels.slice();
  const i = out.findIndex(pn => pn.h && /overview/i.test(pn.h) && !pn.fold);
  if (i >= 0) {
    const ov = Object.assign({}, out[i]);
    if (ov.facts) facts = facts.concat(ov.facts);
    delete ov.facts;
    const keep = [];
    (ov.p || []).forEach(t => {
      const m = FACT_LINE.exec(t);
      if (m && t.length < 160 && !/[.!?]$/.test(t)) facts.push([m[1], m[2]]);
      else if (t.length < 70 && !/[.!?]$/.test(t)) facts.push(['', t]);     // a short line like "Team of 5"
      else keep.push(t);
    });
    ov.p = keep;
    if (keep.length || (ov.list && ov.list.length) || ov.src || ov.img || ov.embed) out[i] = ov; else out.splice(i, 1);
  }
  facts = orderFacts(facts, d.info);
  const labels = new Set(facts.map(([k]) => k.toLowerCase()).filter(Boolean));
  const kept = out.filter(pn => !(pn.h && labels.has(pn.h.toLowerCase()) && !pn.fold && !(pn.p && pn.p.length > 1)));
  return { facts, panels: kept };
}

function fillProject(p) {
  const i = PROJECTS.indexOf(p), d = DETAILS[p.id] || {};
  refMedia = []; foldCount = 0;
  const all = d.panels || (p.group === 'Creatives' ? CREATIVE_PANELS : WORK_PANELS);
  const { facts, panels } = splitOverview(d, all);

  // left page: title, type, number, facts, introduction. Creative pieces show only the title and the introduction.
  projectEl.classList.toggle('is-work', p.group === 'Works');
  projectEl.classList.toggle('is-creative', p.group !== 'Works');
  projectEl.classList.toggle('is-viz', p.id === 'work-6');
  const h1 = $('#p-title');
  h1.replaceChildren();
  if (d.embed) {                                        // the title itself opens the live site (and previews it on hover)
    const a = makeRef(p.title, { items: [{ embed: d.embed, cap: 'The live site' }] }, 'a');
    a.classList.add('title-link'); a.href = d.embed; a.target = '_blank'; a.rel = 'noopener noreferrer';
    h1.append(a, el('span', 'title-arrow', ' \u2197'));
  } else h1.textContent = p.title;
  $('#p-sub').textContent = '(' + p.type + ')';
  $('#p-no').textContent = p.group === 'Works' ? p.no : p.group === 'Creatives' ? 'Creatives, ' + p.no : '';
  const dl = $('#p-facts');
  dl.replaceChildren();
  (p.group === 'Works' ? facts.filter(([k]) => FACT_SHOW.includes((k || '').toLowerCase())) : []).forEach(([k, v]) => {
    const dd = richText(el('dd', k ? (/^\[/.test(v) ? 'todo' : null) : 'solo'), v);   // [placeholders] are set in soft italics
    if (k) dl.append(el('dt', null, k), dd); else dl.append(dd);
  });
  const repeats = d.lede && all.some(pn => (pn.p || []).includes(d.lede));
  const intro = $('#p-intro');
  intro.replaceChildren();
  const lede = d.lede && !repeats ? d.lede : '';
  if (lede && !/[.!?]["”’]?$/.test(lede.trim())) {           // a short, title-like line: set it as a subtitle, then the summary
    intro.append(richText(el('p', 'p-tagline'), lede), richText(el('p'), p.summary));
  } else intro.append(richText(el('p'), lede || p.summary));
  buildFeature(p, d);                                   // a creative piece's own display under the title

  // right page: the write-up between one line of music at the top and one at the bottom
  $('#s-folio').textContent = String(3 + i);
  termsLeft = Object.entries(d.terms || {});            // underline each defined term the first time it appears
  $('#writeup').replaceChildren(...panels.map(blockFor));
  termsLeft = null;
  setupStage(p, panels);

  const first = i === 0, last = i === PROJECTS.length - 1;
  projectEl.querySelector('.prev .label').textContent = first ? 'Back: Contents' : 'Back';
  projectEl.querySelector('.next .label').textContent = last ? 'Next: Contents' : 'Next';
  $('#prev-title').textContent = first ? '' : PROJECTS[i - 1].title;
  $('#next-title').textContent = last ? '' : PROJECTS[i + 1].title;
  document.querySelectorAll('.works-menu button').forEach(b => {
    if (b.dataset.id === p.id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
}

// ---------- the frame on the right page (Works): pictures and live pieces follow the text being read ----------
// The frame is a grainy card at the top of the page that reshapes itself to fit what it shows. Each heading,
// and each picture under it, is an anchor in the text: when an anchor reaches the frame, its pictures appear.
// Only headings settle into place as you scroll; pictures under the same heading simply change in the frame.
// Anything without a picture (and the top of the page) shows the default: a dark, grainy, distorted collage.
// On the Data Visualization page only the project names count.
const STAGE_DEFAULT = 'images/frame-default.png';
const STAGE_MAX_H = () => Math.min(Math.max(window.innerHeight * 0.31, 170), 330);   // the tallest the frame grows
const stageEl = $('#stage'), stageCard = stageEl.querySelector('.stage-card'), stageFrame = stageEl.querySelector('.stage-frame'), stageView = stageEl.querySelector('.stage-view'), stageCap = $('#stage-cap');
let stageAnchors = [], stageSections = [], stageKey = null, stageTick = false;
function panelMedia(pn) {                               // what a panel has to show: pictures, or a live piece
  const out = [];
  if (pn.src) out.push({ src: pn.src, cap: pn.cap || pn.h || '', alt: pn.alt || '' });
  (pn.figs || []).forEach(g => g.src && out.push({ src: g.src, cap: g.cap || g.fig || '', alt: g.alt || g.fig || '' }));
  if (pn.embed && !/\.pdf$/i.test(pn.embed)) out.push({ site: pn.embed, cap: pn.embedLabel || pn.h || '' });
  return out;
}
// the anchors of a write-up, in reading order: headings (which snap) and pictures (which don't)
function mapAnchors(panels, blocks, list, onlyFolds) {
  panels.forEach((pn, i) => {
    const b = blocks[i];
    if (!b) return;
    if (pn.fold) {
      const inner = [], body = b.querySelector('.fold-body');
      mapAnchors(pn.panels || [], [...body.children], inner, false);
      const media = onlyFolds ? inner.flatMap(a => a.media) : (inner.find(a => a.media.length) || { media: [] }).media;
      list.push({ el: b, media, snap: true });
      if (!onlyFolds) list.push(...inner);
      return;
    }
    if (onlyFolds) return;
    const media = panelMedia(pn);
    if (pn.h) list.push({ el: b, media, snap: true });
    else if (media.length) list.push({ el: b, media, snap: false });
  });
  // a heading with no pictures of its own shows the first pictures beneath it, so they appear as the heading arrives
  list.forEach((a, k) => {
    if (!a.snap || a.media.length) return;
    for (let j = k + 1; j < list.length && !list[j].snap; j++) if (list[j].media.length) { a.media = list[j].media; break; }
  });
}
function stageItem(it) {                                 // one picture or live piece
  if (it.site) { const f = el('iframe'); f.src = it.site; f.title = it.cap || 'Live site'; f.loading = 'lazy'; f.setAttribute('tabindex', '-1'); return f; }
  const im = el('img'); im.src = it.src; im.alt = it.alt || ''; im.decoding = 'async';
  im.addEventListener('error', () => im.replaceWith(el('span', 'photo-missing', 'Picture not found')));
  return im;
}
// the card's new shape: as wide as the pictures need at the frame's height, never wider than the page
function fitStage(view, media) {
  const W = stageEl.clientWidth, Hmax = STAGE_MAX_H(), capH = stageCap.textContent ? 40 : 14, pad = 28, gap = 8;
  const size = aspect => { const h = Math.min(Hmax, (W - pad) / aspect); stageCard.style.width = Math.min(W, h * aspect + pad) + 'px'; stageCard.style.height = (h + pad + capH) + 'px'; };
  if (!media.length) return size(1024 / 576);
  if (media.some(m => m.site)) return size(16 / 10);
  const imgs = [...view.querySelectorAll('img')];
  const done = () => {
    const ratios = imgs.map(im => im.naturalWidth && im.naturalHeight ? im.naturalWidth / im.naturalHeight : 1.5);
    if (ratios.length > 3) { const rows = 2, per = Math.ceil(ratios.length / rows); size(Math.max(...ratios) * per / rows); }
    else size(ratios.reduce((a, r) => a + r, 0) + gap * (ratios.length - 1) / Hmax);
  };
  if (imgs.every(im => im.complete)) done(); else Promise.all(imgs.map(im => im.decode().catch(() => {}))).then(() => { if (view.isConnected) done(); });
}
function showStage(media) {
  const key = media.length ? media.map(m => m.src || m.site).join('|') : 'default';
  if (key === stageKey) return;
  stageKey = key;
  const view = el('div', 'stage-set' + (media.length > 3 ? ' many' : ''));
  stageFrame.classList.toggle('is-default', !media.length);
  if (media.length) media.forEach(m => view.append(stageItem(m)));
  else { const im = el('img'); im.src = STAGE_DEFAULT; im.alt = ''; view.append(im); }
  const old = [...stageView.children];
  stageView.append(view);
  const caps = media.map(m => m.cap).filter(Boolean);
  stageCap.textContent = caps.length ? [...new Set(caps)].join('  ·  ') : '';
  fitStage(view, media);
  requestAnimationFrame(() => { view.classList.add('in'); old.forEach(o => { o.classList.remove('in'); setTimeout(() => o.remove(), 700); }); });
}
function updateStage() {                                 // the last anchor to reach the frame is the one being read
  stageTick = false;
  if (!projectEl.classList.contains('is-work') || projectEl.hidden) return;
  const line = stageEl.getBoundingClientRect().top + STAGE_MAX_H() + window.innerHeight * 0.026 + 76 + 30, page = projectEl.querySelector('.page.right');
  const atEnd = page.scrollHeight > page.clientHeight && page.scrollTop + page.clientHeight >= page.scrollHeight - 4;
  let active = null;
  stageAnchors.forEach(a => {
    if (a.el.offsetParent === null) return;               // inside a closed dropdown
    const top = a.el.getBoundingClientRect().top;
    if (top <= line || (atEnd && top < window.innerHeight * 0.8)) active = a;   // at the very end, the last anchor on screen counts
  });
  showStage(active ? active.media : []);
}
function setupStage(p, panels) {
  stageAnchors = []; stageKey = null; stageView.replaceChildren(); stageCap.textContent = '';
  $('#writeup').querySelectorAll('.snap').forEach(b => b.classList.remove('snap'));
  if (p.group !== 'Works') return;
  mapAnchors(panels, [...$('#writeup').children], stageAnchors, p.id === 'work-6');
  stageSections = stageAnchors.filter(a => a.snap);
  stageSections.forEach((a, i) => { if (i) a.el.classList.add('snap'); });   // headings after the first settle gently into place
  showStage([]);
  requestAnimationFrame(updateStage);
}
const onStageScroll = () => { if (!stageTick) { stageTick = true; requestAnimationFrame(updateStage); } };
projectEl.querySelector('.page.right').addEventListener('scroll', onStageScroll, { passive: true });
window.addEventListener('scroll', onStageScroll, { passive: true });
window.addEventListener('resize', () => { if (stageKey !== null) { const k = stageKey; stageKey = null; updateStage(); if (stageKey === null) stageKey = k; } });
document.addEventListener('click', e => { if (e.target.closest('.fold-toggle, .fold-title')) setTimeout(updateStage, 60); });
(function drawStageGrain() {                             // a film of grain over the frame (heavier on the default picture)
  const cv = stageEl.querySelector('.stage-grain'), g = cv.getContext('2d');
  cv.width = 420; cv.height = 280;
  const img = g.createImageData(420, 280);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255 | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 70; }
  g.putImageData(img, 0, 0);
})();

// ---------- a creative piece's own display, under the title on the left page ----------
// Digital Fashion: its magazine PDF. Magazine Templates: a frame for template spreads. Film Analysis: the poster
// and details of the film whose paper is open on the right.
function buildFeature(p, d) {
  const box = $('#p-feature');
  box.replaceChildren(); box.hidden = true;
  projectEl.classList.remove('has-film');
  if (d.pdf) {
    const o = el('object', 'pdf-embed'); o.data = d.pdf; o.type = 'application/pdf';
    const fb = el('p', 'pdf-missing');
    fb.append('The PDF isn’t here yet. ', Object.assign(el('a', 'ext-link', 'Open it ↗'), { href: d.pdf, target: '_blank', rel: 'noopener' }));
    o.append(fb); box.append(o); box.hidden = false;
  } else if (d.spreads) {
    box.append(spreadViewer(d.spreads)); box.hidden = false;
  } else if (d.films) {
    projectEl.classList.add('has-film');
    box.hidden = false;
    showFilm(d.films[0].id);
  }
}
function spreadViewer(list) {                            // template spreads, one at a time, in a two-page frame
  const wrap = el('div', 'spreads'), frame = el('div', 'spread-frame'), bar = el('div', 'spread-bar');
  let i = 0;
  const show = () => {
    frame.replaceChildren();
    if (!list.length) { frame.append(el('p', 'spread-empty', '[Template spreads: add the pictures to DETAILS[\'creative-3\'].spreads in content.js]')); return; }
    const s = list[i], im = el('img'); im.src = s.src || s; im.alt = s.cap || 'Template spread ' + (i + 1);
    frame.append(im);
    bar.querySelector('.count').textContent = (s.cap ? s.cap + '  ·  ' : '') + (i + 1) + ' of ' + list.length;
  };
  const btn = (label, d) => { const b = el('button', 'brace literal'); b.type = 'button'; b.append(el('span', 'b', '{'), el('span', 'label', label), el('span', 'b', '}')); b.addEventListener('click', () => { i = (i + d + list.length) % list.length; show(); }); return b; };
  if (list.length > 1) bar.append(btn('Previous', -1), el('span', 'count'), btn('Next', 1)); else bar.append(el('span', 'count'));
  wrap.append(frame, bar); show();
  return wrap;
}
function showFilm(id) {                                  // the film's poster and details on the left page
  const d = DETAILS['creative-4'] || {}, f = (d.films || []).find(x => x.id === id);
  if (!f) return;
  const box = $('#p-feature'), card = el('div', 'film');
  const poster = el('div', 'poster');
  const im = el('img'); im.src = f.poster; im.alt = 'Poster for ' + f.title;
  im.addEventListener('error', () => { poster.classList.add('empty'); im.replaceWith(el('span', 'poster-title', f.title)); });
  poster.append(im);
  const info = el('div', 'film-info');
  info.append(el('p', 'film-title', f.title), el('p', 'film-meta', `Directed by ${f.director}  ·  ${f.year}`), el('p', 'film-blurb', f.blurb));
  card.append(poster, info);
  const old = box.firstChild;
  box.append(card);
  requestAnimationFrame(() => { card.classList.add('in'); if (old) { old.classList.remove('in'); setTimeout(() => old.remove(), 500); } });
}

// ---------- dropdowns opening and closing ----------
function toggleFold(btn) {
  const body = document.getElementById(btn.getAttribute('aria-controls'));
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(open));
  btn.querySelector('.label').textContent = open ? 'Close' : 'Open';
  btn.querySelector('.caret').textContent = open ? '\u25B4' : '\u25BE';
  body.hidden = !open;
  const film = btn.closest('.fold')?.dataset.film;
  if (open && film) showFilm(film);                      // the film's poster and details appear on the left page
  // dotted text is drawn where the browser put it, so the write-up is laid out again around the fold
  projectText.forEach(s => {
    if (!s.el.closest('.page.right')) return;
    const inside = body.contains(s.el);
    s.el.classList.remove('inked'); layoutText(s);
    if (inside && open) s.revealStart = null;             // the revealed sections ink themselves in
  });
  projectShades.forEach(layoutShade);
  updatePositions();
  checkEnd();
}
projectEl.addEventListener('click', e => {
  const t = e.target.closest('.fold-toggle');
  if (t) { toggleFold(t); return; }
  const h = e.target.closest('.fold-title, .music-bar');   // clicking a dropdown's heading (or its music) opens it too
  if (h) toggleFold(h.closest('.fold').querySelector('.fold-toggle'));
});

// ---------- the hover preview ----------
const card = $('#hovercard'), cardBody = card.querySelector('.hc-body'), cardGrain = card.querySelector('.hc-grain');
const CARD_SHADE_OUT = 30, CARD_SHADE_IN = 8;   // the preview's edge: wide and soft, so it reads as a shadow, not a torn edge
let cardRef = null, showTimer = null, hideTimer = null;
function cardFigure(it) {
  const f = el('figure', 'hc-fig');
  if (it.embed) {
    const fr = el('iframe');
    fr.title = 'Preview of ' + (it.cap || 'the site'); fr.loading = 'lazy'; fr.referrerPolicy = 'no-referrer';
    fr.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
    fr.src = it.embed; f.append(fr);
  } else if (it.src) {
    const im = el('img'); im.decoding = 'async'; im.alt = it.alt || ''; im.src = it.src;
    im.addEventListener('load', placeCard);
    im.addEventListener('error', () => { im.replaceWith(el('div', 'hc-missing', 'Picture not found: ' + it.src)); placeCard(); });
    f.append(im);
  } else f.append(el('div', 'hc-missing', 'Add a picture for this in content.js'));
  if (it.cap) f.append(el('figcaption', null, it.cap));
  return f;
}
function fillCard(media) {
  card.classList.toggle('def', !!media.def);
  if (media.def) {                                       // a definition: the term and what it means, like a Wikipedia preview
    card.classList.remove('grid', 'site');
    cardBody.replaceChildren(el('p', 'hc-def-term', media.def.term), el('p', 'hc-def-text', media.def.text));
    return;
  }
  card.classList.toggle('grid', !!media.grid);
  card.classList.toggle('whole', !!media.whole);
  card.classList.toggle('site', media.items.some(it => it.embed));
  if (media.grid) {
    const g = el('div', 'hc-grid');
    const cols = media.whole ? Math.min(3, media.items.length) : Math.min(6, Math.ceil(Math.sqrt(media.items.length * 1.4)));
    g.style.setProperty('--cols', cols);
    g.style.setProperty('--rows', Math.ceil(media.items.length / cols));
    media.items.forEach(it => {
      const im = el('img'); im.decoding = 'async'; im.alt = it.alt || ''; im.src = it.src;
      im.addEventListener('load', placeCard);
      g.append(im);
    });
    cardBody.replaceChildren(g, el('p', 'hc-count', media.cap || (media.items.length + ' photos')));
  } else cardBody.replaceChildren(...media.items.map(cardFigure));
}
// Where a preview goes: above or below the word, or beside it (over the other page), whichever gives the
// picture the most room. Pictures are sized to fill that space, so the preview is as large as it can be
// without ever covering the word.
const CARD_MAX_W = 1000;                                 // the widest a picture preview gets, in px
function placeCard() {
  if (!cardRef || card.hidden) return;
  const r = cardRef.getBoundingClientRect(), gap = 12, m = 10, vw = window.innerWidth, vh = window.innerHeight;
  const isDef = card.classList.contains('def'), isGrid = card.classList.contains('grid'), isSite = card.classList.contains('site');
  const maxW = Math.min(CARD_MAX_W, vw * (vw <= 900 ? 0.94 : isGrid ? 0.8 : 0.72)), extra = 20 + (cardBody.querySelector('figcaption, .hc-count') ? 52 : 0);
  const slots = [
    { k: 'above', w: Math.min(maxW, vw - 2 * m), h: r.top - gap - m },
    { k: 'below', w: Math.min(maxW, vw - 2 * m), h: vh - r.bottom - gap - m }
  ];
  if (!isDef) slots.push({ k: 'left', w: Math.min(maxW, r.left - gap - m), h: vh - 2 * m },
                         { k: 'right', w: Math.min(maxW, vw - r.right - gap - m), h: vh - 2 * m });
  const fit = s => { const pw = Math.min(s.w - 20, (s.h - extra) * 1.5); return pw > 0 ? pw * pw : 0; };   // room for a 3:2 picture
  const best = isDef ? (slots[0].h >= 160 || slots[0].h >= slots[1].h ? slots[0] : slots[1]) : slots.reduce((a, s) => fit(s) > fit(a) ? s : a);
  if (!isDef) {
    card.style.setProperty('--hc-w', Math.max(200, best.w) + 'px');
    card.style.setProperty('--hc-room', Math.max(120, best.h - extra) + 'px');
    card.style.width = (isGrid && !card.classList.contains('whole')) || isSite ? Math.max(200, best.w) + 'px' : '';
  } else card.style.width = '';
  if (card.classList.contains('whole')) {                // designs: every row fits both the height and the width available
    const imgs = [...cardBody.querySelectorAll('.hc-grid img')], gap = 4;
    const cols = +getComputedStyle(cardBody.querySelector('.hc-grid')).getPropertyValue('--cols') || 3;
    const rows = [];
    for (let i = 0; i < imgs.length; i += cols) rows.push(imgs.slice(i, i + cols));
    const ratio = im => im.naturalWidth && im.naturalHeight ? im.naturalWidth / im.naturalHeight : 0.75;
    const availW = Math.max(200, best.w) - 20, availH = Math.max(120, best.h - extra);
    let h = (availH - (rows.length - 1) * gap) / rows.length;
    rows.forEach(r => { h = Math.min(h, (availW - (r.length - 1) * gap) / r.reduce((a, im) => a + ratio(im), 0)); });
    imgs.forEach(im => { im.style.height = h + 'px'; im.style.width = h * ratio(im) + 'px'; });
    const rowW = Math.max(...rows.map(r => r.reduce((a, im) => a + h * ratio(im), 0) + (r.length - 1) * gap));
    card.style.width = Math.ceil(rowW + 20) + 'px';
  }
  const cw = card.offsetWidth, ch = card.offsetHeight;
  let left, top;
  if (best.k === 'above' || best.k === 'below') {
    left = clamp(r.left + r.width / 2 - cw / 2, m, vw - cw - m);
    top = best.k === 'above' ? r.top - ch - gap : r.bottom + gap;
  } else {
    left = best.k === 'left' ? r.left - gap - cw : r.right + gap;
    top = r.top + r.height / 2 - ch / 2;
  }
  top = clamp(top, m, Math.max(m, vh - ch - m));
  card.style.left = left + 'px'; card.style.top = top + 'px';
  const M = CARD_SHADE_OUT;
  Object.assign(cardGrain.style, { left: -M + 'px', top: -M + 'px', width: (cw + M * 2) + 'px', height: (ch + M * 2) + 'px' });
  if (cardGrain._size !== cw + 'x' + ch) { cardGrain._size = cw + 'x' + ch; drawEdgeGrain(cardGrain, cw, ch, M, CARD_SHADE_IN, true); }
}
function showCard(ref) {
  clearTimeout(hideTimer);
  if (cardRef === ref && !card.hidden) return;
  if (cardRef) cardRef.classList.remove('open');
  cardRef = ref; ref.classList.add('open');
  fillCard(refMedia[+ref.dataset.ref]);
  card.hidden = false;
  card.classList.remove('shown');
  placeCard();
  requestAnimationFrame(() => card.classList.add('shown'));
}
function hideCard() {
  clearTimeout(showTimer); clearTimeout(hideTimer);
  if (cardRef) cardRef.classList.remove('open');
  cardRef = null; card.hidden = true; card.classList.remove('shown');
  cardBody.replaceChildren();                           // stops any live site that was playing
}
const isTouch = e => e.pointerType === 'touch';
document.addEventListener('pointerover', e => {
  if (isTouch(e)) return;
  const ref = e.target.closest('.ref');
  if (ref) { clearTimeout(hideTimer); clearTimeout(showTimer); showTimer = setTimeout(() => showCard(ref), 120); return; }
  if (e.target.closest('#hovercard')) clearTimeout(hideTimer);
});
document.addEventListener('pointerout', e => {
  if (isTouch(e)) return;
  if (!e.target.closest('.ref, #hovercard')) return;
  const to = e.relatedTarget;
  if (to && to.closest && (to.closest('#hovercard') || (cardRef && to.closest('.ref') === cardRef))) return;
  clearTimeout(showTimer);
  hideTimer = setTimeout(hideCard, 220);                // a moment's grace to move onto the preview
});
document.addEventListener('focusin', e => { const ref = e.target.closest('.ref'); if (ref) showCard(ref); });
document.addEventListener('focusout', e => {
  if (e.target.closest('.ref') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#hovercard'))) hideTimer = setTimeout(hideCard, 150);
});
document.addEventListener('click', e => {                // touch screens: a tap shows the preview, another tap (or a tap elsewhere) hides it
  const ref = e.target.closest('.ref');
  if (ref && !matchMedia('(hover: hover)').matches) {
    if (ref.tagName !== 'A' || cardRef !== ref) { e.preventDefault(); if (cardRef === ref) hideCard(); else showCard(ref); return; }
  }
  if (!e.target.closest('#hovercard') && !ref) hideCard();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !card.hidden) { hideCard(); e.stopImmediatePropagation(); } }, true);
['scroll', 'resize'].forEach(ev => window.addEventListener(ev, () => { if (!card.hidden) placeCard(); }, { passive: true, capture: true }));

// ---------- Previous / Next appear once you've reached the end of the write-up ----------
function checkEnd() {
  if (view !== 'project') return;
  const sc = projectEl.querySelector('.page.right'), stacked = window.innerWidth <= 900;
  const atEnd = stacked
    ? window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12
    : sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 12;
  if (atEnd) projectEl.querySelector('.turn-page').classList.add('ready');
}
projectEl.querySelector('.page.right').addEventListener('scroll', checkEnd, { passive: true });
window.addEventListener('scroll', checkEnd, { passive: true });

// ---------- laying out each view ----------
const PROJECT_TEXT = '#project h1, #project .paren, #project .opus, #project .call-number > a, #project .works-toggle, ' +
                     '#project .p-facts dt, #project .p-facts dd, #project .p-intro p, #project .imprint p, ' +
                     '#project .turn-page a, #project .sheet-head > *, #project .tempo, #project #play, ' +
                     '#project .slot h3, #project .slot p, #project .slot dt, #project .slot dd, #project .slot li, #project .fold-toggle, ' +
                     '#project .page-foot > span';
let projectText = [], current = null, view = 'cover', lastTrigger = null, pendingGo = null, scoresWidth = 0;
function updatePositions() {
  surfaces.forEach(s => { const r = s.canvas.getBoundingClientRect(); s.px = r.left + window.scrollX; s.py = r.top + window.scrollY; });
}
let barSurfaces = [];
function layoutProject() {
  projectText.forEach(removeSurface);
  barSurfaces.forEach(removeSurface);                    // the music lines above dropdowns (the concert photos)
  barSurfaces = [...projectEl.querySelectorAll('canvas.music-bar')].map(c => surface(c, 'score', SCORE_REVEAL));
  barSurfaces.forEach(s => engraveBar(s, +s.canvas.dataset.bar || 0));
  const w = scoreSurfaces[0].canvas.parentElement.clientWidth;
  if (w !== scoresWidth) { layoutScores(); scoresWidth = w; }   // same width: the engraved music is reused
  projectText = [...document.querySelectorAll(PROJECT_TEXT)].map(e => inkSurface(e));
  projectText.forEach(layoutText);
  projectShades.forEach(layoutShade);
  layoutProjectOrnament(projOrnament);
  layoutRightOrnament(rightOrnament);
  updatePositions();
}
// Engrave the music ahead of time, while the cover or opening spread is showing, so the first piece opens quickly.
function preEngrave() {
  if (current || turning) return;
  const st = projectEl.style;
  st.position = 'fixed'; st.inset = '0'; st.visibility = 'hidden'; st.pointerEvents = 'none';
  projectEl.hidden = false;
  const w = scoreSurfaces[0].canvas.parentElement.clientWidth;
  if (w && w !== scoresWidth) { layoutScores(); scoresWidth = w; }
  projectEl.hidden = true;
  projectEl.removeAttribute('style');
}
function layoutHome() {
  homeText.forEach(s => { s.el.classList.remove('inked'); layoutText(s); });
  homeShades.forEach(layoutShade);
  updatePositions();
}
function layoutCover() {
  coverText.forEach(s => { s.el.classList.remove('inked'); layoutText(s); });
  coverShades.forEach(layoutShade);
  layoutCoverArt(ornament);
  updatePositions();
}
function layoutAbout() {                                // the title restated, in its filigree frame
  aboutText.forEach(s => { s.el.classList.remove('inked'); layoutText(s); });
  aboutShades.forEach(layoutShade);
  layoutCartouche(aboutOrnament);
  updatePositions();
}

// ---------- ornaments, drawn in stippled ink ----------
// inkPath: a stroke along a list of points, its width tapering from w0 to w1, made of dots scattered across the width
function inkPath(pts, w0, w1, alpha = 0.9) {
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], len = Math.hypot(bx - ax, by - ay) || 1;
    const nx = -(by - ay) / len, ny = (bx - ax) / len, n = Math.max(1, Math.ceil(len / 0.9));
    for (let k = 0; k < n; k++) {
      const t = (i - 1 + k / n) / (pts.length - 1), w = w0 + (w1 - w0) * t;
      const x = ax + (bx - ax) * k / n, y = ay + (by - ay) * k / n, m = Math.max(1, Math.round(w * 0.9));
      for (let j = 0; j < m; j++) {
        const o = (Math.random() - 0.5) * w;
        put(x + nx * o, y + ny * o, 0.42 + Math.random() * 0.16, alpha * (0.72 + Math.random() * 0.28));
      }
    }
  }
}
const bezier = (p0, p1, p2, p3, n = 70) => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n, u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
          u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
});
function ring(x, y, r, alpha = 0.9) {                   // a small open circle, like the ends of an engraver's flourish
  for (let t = 0; t < TAU; t += 0.25 / Math.max(1, r)) put(x + Math.cos(t) * r, y + Math.sin(t) * r, 0.48, alpha);
}
function relRect(el, c) { const r = el.getBoundingClientRect(), o = c.getBoundingClientRect(); return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height }; }

// ---------- the spirals: each ornament's curls are built from a classical spiral ----------
// Each function returns points in its own units, centred on the spiral's origin; place() scales, turns,
// mirrors and moves them onto the page.
const SPIRAL = {
  // Archimedean: r = a + bθ. Evenly spaced turns, like a coiled spring: the small curls.
  archimedean(a, b, t0, t1, step = 0.05) { return polarPts(t => a + b * t, t0, t1, step); },
  // logarithmic: r = a·e^(bθ). Each turn widens by the same ratio, like a nautilus: the volutes.
  logarithmic(a, b, t0, t1, step = 0.04) { return polarPts(t => a * Math.exp(b * t), t0, t1, step); },
  // Galilean: r = bθ² − a. A tight loop around the centre, then flung wide: the dramatic corner flourish.
  galilean(a, b, t0, t1, step = 0.02) { return polarPts(t => b * t * t - a, t0, t1, step); },
  // lituus: r = a / √θ. Closes in slowly like a violin scroll: the spine of each curling leaf.
  lituus(a, t0, t1, step = 0.03) { return polarPts(t => a / Math.sqrt(t), t0, t1, step); },
  // atom spiral: r = θ / (θ − 1). Winds in toward the unit circle without reaching it: an orbit around a volute.
  atom(t0, t1, step = 0.03) { return polarPts(t => t / (t - 1), t0, t1, step); },
  // Fermat (phyllotaxis): the nth point at r = c√n, turned by the golden angle: a seed head, used as lace.
  fermat(n, c) { const g = Math.PI * (3 - Math.sqrt(5)); return Array.from({ length: n }, (_, i) => [c * Math.sqrt(i + 0.5) * Math.cos(i * g), c * Math.sqrt(i + 0.5) * Math.sin(i * g)]); },
  // Cornu (Euler, clothoid): x = ∫cos(πs²/2), y = ∫sin(πs²/2). Curvature grows steadily, so a line curls smoothly into its tip.
  cornu(t1, step = 0.01) {
    const pts = [[0, 0]]; let x = 0, y = 0;
    for (let s = step; s <= t1; s += step) { const m = s - step / 2; x += Math.cos(Math.PI * m * m / 2) * step; y += Math.sin(Math.PI * m * m / 2) * step; pts.push([x, y]); }
    return pts;
  },
  // Nielsen: x = ci(t), y = si(t), the cosine and sine integrals. Like the Cornu spiral, but it settles to a point.
  nielsen(t0, t1, step = 0.01) {
    const pts = [[0, 0]]; let x = 0, y = 0;
    for (let t = t0 + step; t <= t1; t += step) { const m = t - step / 2; x += Math.cos(m) / m * step; y += Math.sin(m) / m * step; pts.push([x, y]); }
    return pts;
  }
};
function polarPts(rFn, t0, t1, step) { const out = []; for (let t = t0; t <= t1 + 1e-9; t += step) { const r = rFn(t); out.push([r * Math.cos(t), r * Math.sin(t)]); } return out; }
// put a spiral on the page: scale it, turn it by rot, mirror it (flip = -1), and move its origin to (x, y)
function place(pts, x, y, scale, rot = 0, flip = 1) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return pts.map(([px, py]) => { py *= flip; return [x + (px * c - py * s) * scale, y + (px * s + py * c) * scale]; });
}
// move a spiral so that its first point sits at (x, y) heading along angle ang (for curls growing out of a stroke)
function attach(pts, x, y, scale, ang, flip = 1) {
  const [x0, y0] = pts[0], [x1, y1] = pts[Math.min(3, pts.length - 1)], start = Math.atan2((y1 - y0) * flip, x1 - x0);
  return place(pts.map(([px, py]) => [px - x0, py - y0]), x, y, scale, ang - start, flip);
}

// ---------- flourishes: calligraphic loops, baroque volutes and curling acanthus, in stippled ink ----------
// pen: a stroke drawn as if with a broad nib held at an angle: thick on the downstrokes, hairline across,
// tapering at both ends. Everything here is curved; nothing points straight in.
const PEN_ANGLE = -0.7;
function pen(pts, wmin, wmax, a = 0.82, taper = true) {
  const n = pts.length;
  for (let i = 1; i < n; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], th = Math.atan2(by - ay, bx - ax), t = i / n;
    let w = wmin + (wmax - wmin) * Math.abs(Math.sin(th - PEN_ANGLE));
    if (taper) w *= Math.min(1, t * 7, (1 - t) * 7) * 0.85 + 0.15;
    inkPath([[ax, ay], [bx, by]], w, w, a);
  }
}
// a chain of cubic curves: [p0, c1, c2, p1, c1, c2, p2, ...]
function chain(cp, steps = 40) {
  const out = [];
  for (let i = 0; i + 3 < cp.length; i += 3) bezier(cp[i], cp[i + 1], cp[i + 2], cp[i + 3], steps).forEach((p, k) => { if (k || !i) out.push(p); });
  return out;
}
const tangent = (pts, end) => { const n = pts.length, [a, b] = end ? [pts[n - 4], pts[n - 1]] : [pts[3], pts[0]]; return Math.atan2(b[1] - a[1], b[0] - a[0]); };
// a volute: a logarithmic spiral drawn with the pen, wide at its outer turn and fine at its eye,
// with a fine atom-spiral orbit winding in around it
function volute(cx, cy, r, turns, start, dir, a = 0.82, w = 2.6) {
  const b = Math.log(14) / (turns * TAU);               // r shrinks fourteen-fold over the turns
  const pts = SPIRAL.logarithmic(1, -b, 0, turns * TAU).map(([x, y]) => [x, y * dir]);
  pen(place(pts, cx, cy, r, start), 0.5, w, a);
  cluster(cx, cy, Math.max(1.3, r * 0.08), 1);
  inkPath(place(SPIRAL.atom(1.35, 1.35 + TAU * 1.2), cx, cy, r * 0.62, start + 1.1, dir), 0.55, 0.45, a * 0.55);
}
// a small curl (Archimedean): evenly spaced turns, from radius r in toward the middle, ending in a dot
function curl(cx, cy, r, turns, start = 0, dir = 1, w = 1.1, alpha = 0.9) {
  const T = turns * TAU, pts = SPIRAL.archimedean(1, -1 / (T * 1.15), 0, T, 0.08).map(([x, y]) => [x, y * dir]);
  inkPath(place(pts, cx, cy, r, start), w, w * 0.7, alpha);
  cluster(cx, cy, Math.max(1.2, r * 0.12), 1);
}
// a Cornu curl growing out of the end of a stroke at (x, y), heading along ang
function cornuEnd(x, y, ang, size, flip, a, w = 2.2) {
  pen(attach(SPIRAL.cornu(2.4), x, y, size, ang, flip), 0.45, w, a);
}
// a curling acanthus leaf: a filled band that follows a lituus (a violin-scroll curve) and tapers, with lobed edges
function acanthus(cx, cy, size, rot, flip, wid, a = 0.8) {
  const spine = place(SPIRAL.lituus(1, 0.35, 5.2), cx, cy, size, rot, flip), n = spine.length, outer = [];
  for (let i = 1; i < n; i++) {
    const [x0, y0] = spine[i - 1], [x1, y1] = spine[i], t = i / n, l = Math.hypot(x1 - x0, y1 - y0) || 1;
    const nx = -(y1 - y0) / l, ny = (x1 - x0) / l, hw = wid * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.7) * (1 - 0.6 * t);
    outer.push([x1 + nx * hw * flip, y1 + ny * hw * flip]);
    for (let k = 0; k < hw * 0.8; k++) { const o = Math.random() * hw; put(x1 + nx * o * flip, y1 + ny * o * flip, 0.42 + Math.random() * 0.16, a * (0.4 + Math.random() * 0.35)); }
  }
  inkPath(spine, 0.8, 0.3, a); inkPath(outer, 0.8, 0.25, a);
  for (let i = 1; i < 4; i++) { const [x, y] = outer[Math.floor(outer.length * i / 4.5)]; curl(x, y, wid * 0.45, 1.2, rot + i, flip, 0.7, a * 0.85); }
}
// a Fermat seed head: rings and dots set by the golden angle, as a small piece of lace
function seedHead(cx, cy, n, c, a) { SPIRAL.fermat(n, c).forEach(([x, y], i) => { if (i % 3) ring(cx + x, cy + y, 1.5, a * 0.8); else cluster(cx + x, cy + y, 0.9, 0.7); }); }

// A corner flourish, from (ox, oy) inward (sx, sy = ±1), reaching about S px along each edge
function flourishCorner(ox, oy, sx, sy, S, a = 0.82, kx = 1, ky = 1) {
  const P = (u, v) => [ox + sx * u * S * kx, oy + sy * v * S * ky];
  const flip = sx * sy, dirA = Math.atan2(sy, sx);
  // the great swoop: in along the top edge, dipping into a loop at the corner, then away down the side
  const swoop = chain([P(1.25, 0.05), P(0.95, -0.02), P(0.6, 0.02), P(0.34, 0.12),
                       P(0.14, 0.2), P(0.1, 0.42), P(0.27, 0.42),
                       P(0.46, 0.42), P(0.44, 0.16), P(0.23, 0.17),
                       P(0.05, 0.19), P(0.02, 0.55), P(0.06, 0.92),
                       P(0.09, 1.08), P(0.04, 1.2), P(0.05, 1.27)], 50);
  pen(swoop, 0.7, 4.8, a);
  cornuEnd(...swoop[0], tangent(swoop, false), S * 0.12, -flip, a);            // each end curls off along a Cornu spiral
  cornuEnd(...swoop[swoop.length - 1], tangent(swoop, true), S * 0.12, flip, a);
  // a baroque volute inside the loop (logarithmic), wrapped by a curling acanthus leaf (lituus)
  const vc = P(0.36, 0.34);
  volute(vc[0], vc[1], S * 0.12, 2, dirA + Math.PI, flip, a, 4);
  acanthus(vc[0] + Math.cos(dirA) * S * 0.02, vc[1] + Math.sin(dirA) * S * 0.02, S * 0.2, dirA + Math.PI * 0.55, flip, S * 0.05, a);
  // a Galilean flourish: it loops tightly beside the volute, then flings out across the page
  const gal = place(SPIRAL.galilean(0.25, 0.04, 0, 3.4 * Math.PI, 0.02), ...P(0.62, 0.3), S * 0.14, dirA - 0.6, -flip);
  pen(gal, 0.4, 2.6, a * 0.9);
  // a cursive chain of loops running along each edge, shrinking as it goes
  const loopChain = (alongTop) => {
    const pts = [];
    for (let t = 0; t <= 1; t += 0.0015) {
      const k = t * TAU * 5, b = 0.055 * (1 - 0.72 * t), run = 0.5 + 0.78 * t;
      const along = run - b * Math.sin(k) * 1.1, across = 0.05 + b * (1 - Math.cos(k)) * 0.75;
      pts.push(alongTop ? P(along, across) : P(across, along));
    }
    pen(pts, 0.4, 1.8, a * 0.9);
  };
  loopChain(true); loopChain(false);
  // fine hairlines sweeping across the loop, each ending in a ringed dot
  const h1 = chain([P(0.0, 0.08), P(0.3, 0.02), P(0.6, 0.5), P(0.72, 0.62)], 60);
  const h2 = chain([P(0.08, 0.0), P(0.02, 0.3), P(0.5, 0.6), P(0.62, 0.72)], 60);
  inkPath(h1, 0.7, 0.4, a * 0.75); inkPath(h2, 0.7, 0.4, a * 0.75);
  [h1, h2].forEach(h => { const [x, y] = h[h.length - 1]; ring(x, y, 2.4, a); cluster(x, y, 1, 0.8); });
  // a Fermat seed head of lace beside the loop, and two curved thorns off the swoop
  seedHead(...P(0.2, 0.62), 22, S * 0.012, a);
  [[0.34, 0.12, 0.5, 0.0, 0.62, -0.02], [0.12, 0.34, 0.0, 0.5, -0.02, 0.62]].forEach(([u0, v0, u1, v1, u2, v2]) =>
    inkPath(bezier(P(u0, v0), P((u0 + u1) / 2, (v0 + v1) / 2 + 0.05), P(u1, v1), P(u2 + 0.04, v2 + 0.08)), 1.6, 0.25, a * 0.85));
}

// A flourish sweeping along an edge and over the spine: waves and loops that grow smaller as they travel,
// ending in a Nielsen spiral that settles to a point
function flourishRun(x0, x1, y, sy, a = 0.8) {
  const L = x1 - x0, amp = Math.min(66, L * 0.11), pts = [];
  for (let t = 0; t <= 1; t += 0.0025) {
    const decay = 1 - 0.75 * t, x = x0 + L * t, wave = Math.sin(t * TAU * 2.2) * amp * decay;
    pts.push([x, y + sy * (amp * 0.9 + wave)]);
  }
  pen(pts, 0.6, 4.2, a);
  [[0.18, 1], [0.42, 0.68], [0.64, 0.46], [0.82, 0.3]].forEach(([t, k]) => {   // loops riding the wave, each smaller
    const i = Math.round(t / 0.0025), [cx, cy] = pts[Math.min(i, pts.length - 1)], r = amp * 0.62 * k, lp = [];
    for (let q = 0; q <= TAU * 1.05; q += 0.07) lp.push([cx + Math.cos(q) * r * 1.4 - r * 0.2, cy + sy * (Math.sin(q) * r * 0.8 - r * 0.5)]);
    pen(lp, 0.4, 2, a * 0.9, false);
  });
  const hair = []; for (let t = 0; t <= 1; t += 0.004) hair.push([x0 + L * 0.05 + L * 0.85 * t, y + sy * (amp * 0.9 - Math.sin(t * TAU * 1.1) * amp * 0.8 * (1 - 0.6 * t))]);
  inkPath(hair, 0.7, 0.35, a * 0.7);
  hair.filter((_, i) => i % 18 === 0).forEach(([x, y]) => ring(x, y, 1.6, a * 0.8));
  // the run's end: it carries on into a Nielsen spiral, with a lituus leaf curling off it
  const [ex, ey] = pts[pts.length - 1];
  pen(attach(SPIRAL.nielsen(0.6, 40), ex, ey, amp * 0.55, tangent(pts, true), sy), 0.4, 2.8, a);
  acanthus(ex - amp * 0.2, ey + sy * amp * 0.1, amp * 0.5, sy > 0 ? Math.PI * 0.8 : -Math.PI * 0.8, -sy, amp * 0.16, a * 0.9);
}

// ---------- the cover: the script title in the middle like a poster; flourishes from the corners, carried over the spine ----------
const COVER_ORNAMENT = 0.36;   // how far the corner flourishes reach, as a share of the page (higher = larger corners)
const COVER_BLEED = 0.42;      // how far they carry onto the right page, as a share of that page
function layoutCoverArt(s) {
  const c = s.canvas, w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  const page = relRect(coverEl.querySelector('.cover-page'), c), right = relRect(coverEl.querySelector('.cover-bleed'), c);
  begin(w);
  const stacked = right.y > page.y + page.h / 2;
  const S = Math.min(page.w, page.h) * COVER_ORNAMENT;
  flourishCorner(page.x + 6, page.y + 6, 1, 1, S);                                  // top left
  flourishCorner(page.x + page.w - 6, page.y + page.h - 6, -1, -1, S * 0.95);         // bottom right
  flourishCorner(page.x + 6, page.y + page.h - 6, 1, -1, S * 0.48, 0.72);             // bottom left, smaller
  if (stacked) flourishCorner(page.x + page.w - 6, page.y + 6, -1, 1, S * 0.48, 0.72);
  else {                                                                              // over the spine, top and bottom
    flourishRun(page.x + page.w * 0.5, right.x + right.w * COVER_BLEED, page.y + 10, 1);
    flourishRun(page.x + page.w * 0.72, right.x + right.w * COVER_BLEED * 0.7, page.y + page.h - 10, -1, 0.74);
  }
  finish(s, w, h);
}
// the project pages: on the left page, a flourish rising from the bottom-left corner (it stops short of the
// contacts) and a small frame around the live-site link; on the right page, one at the top-right corner
const PROJECT_CORNER = 0.34;   // the bottom-left flourish's size, as a share of the page's width
function layoutProjectOrnament(s) {                    // the left page has no flourish: the line of music is its ornament
  const c = s.canvas, box = c.parentElement, w = box.clientWidth;
  c.style.height = '0px';
  if (!w) return;
  begin(w); finish(s, w, 1);
}
function layoutRightOrnament(s) {
  const c = s.canvas, w = c.parentElement.clientWidth, S = Math.min(w * 0.2, 130), h = Math.ceil(S * 1.7);
  c.style.height = h + 'px';
  if (!w) return;
  begin(w);
  flourishCorner(w - 6, 6, -1, 1, S, 0.55);
  finish(s, w, h);
}
// a small engraved frame: wavering rules, Archimedean curls at the corners, a dot at each side
function miniFrame(r, a) {
  const pad = 10, x0 = r.x - pad, y0 = r.y - pad * 0.6, x1 = r.x + r.w + pad, y1 = r.y + r.h + pad * 0.6;
  const rule = (ax, ay, bx, by) => { const pts = [], L = Math.hypot(bx - ax, by - ay); for (let d = 0; d <= L; d += 2) { const t = d / L; pts.push([ax + (bx - ax) * t, ay + (by - ay) * t + Math.sin(t * TAU * Math.max(2, L / 40)) * (ay === by ? 1.6 : 0)]); } inkPath(pts, 0.9, 0.9, a); };
  rule(x0 + 12, y0, x1 - 12, y0); rule(x0 + 12, y1, x1 - 12, y1);
  rule(x0, y0 + 10, x0, y1 - 10); rule(x1, y0 + 10, x1, y1 - 10);
  [[x0, y0, 1], [x1, y0, -1], [x0, y1, -1], [x1, y1, 1]].forEach(([x, y, d]) => curl(x, y, 7, 1.5, d > 0 ? 0 : Math.PI, d, 1, a));
  [[x0 - 10, (y0 + y1) / 2], [x1 + 10, (y0 + y1) / 2]].forEach(([x, y]) => { ring(x, y, 2.2, a); cluster(x, y, 1, 0.8); });
}

// ---------- the restated title: an engraver's filigree frame around the title block only (like an old book cover) ----------
const FRAME_PAD = 34;        // the room between the title block and its frame, in px
function layoutCartouche(s) {
  const c = s.canvas, w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  const blk = relRect(aboutEl.querySelector('.halftitle-block'), c);
  begin(w);
  const x0 = blk.x - FRAME_PAD, y0 = blk.y - FRAME_PAD, x1 = blk.x + blk.w + FRAME_PAD, y1 = blk.y + blk.h + FRAME_PAD;
  const wave = (ax, ay, bx, by, amp, per) => {           // a wavering rule along one side, with little curls off it
    const len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len, nx = -uy, ny = ux, pts = [];
    for (let d = 0; d <= len; d += 2) { const o = Math.sin(d / per * TAU) * amp; pts.push([ax + ux * d + nx * o, ay + uy * d + ny * o]); }
    inkPath(pts, 1.1, 1.1, 0.9);
    for (let d = per; d < len - per * 0.5; d += per) {
      const side = (Math.round(d / per) % 2) ? 1 : -1, px = ax + ux * d, py = ay + uy * d;
      curl(px + nx * side * 9, py + ny * side * 9, 5.5, 1.3, Math.atan2(ny * -side, nx * -side), side, 0.9, 0.85);
    }
  };
  const per = 30;
  wave(x0 + 26, y0, x1 - 26, y0, 3, per); wave(x0 + 26, y1, x1 - 26, y1, 3, per);
  wave(x0, y0 + 26, x0, y1 - 26, 3, per); wave(x1, y0 + 26, x1, y1 - 26, 3, per);
  // corners: a rosette of four curls, crossed lines running past the corner, each ending in a small ring
  [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(([x, y, sx, sy]) => {
    for (let k = 0; k < 4; k++) curl(x + sx * 10 * Math.cos(k * TAU / 4 + 0.8), y + sy * 10 * Math.sin(k * TAU / 4 + 0.8), 8, 1.5, k * TAU / 4, k % 2 ? 1 : -1, 1, 0.9);
    const L = 30;
    inkPath([[x - sx * L, y], [x + sx * 26, y]], 1, 1, 0.9); ring(x - sx * L - sx * 3, y, 2.6);
    inkPath([[x, y - sy * L], [x, y + sy * 26]], 1, 1, 0.9); ring(x, y - sy * L - sy * 3, 2.6);
    inkPath([[x - sx * L * 0.75, y - sy * L * 0.75], [x, y]], 0.9, 0.9, 0.85); ring(x - sx * L * 0.75 - sx * 2.5, y - sy * L * 0.75 - sy * 2.5, 2.3);
  });
  // the middle of each side: a pair of facing scrolls and a dot
  const pair = (x, y, horiz, out) => {
    const d = 14;
    if (horiz) { curl(x - d, y + out * 8, 9, 1.6, -Math.PI / 2 * out, 1, 1.1); curl(x + d, y + out * 8, 9, 1.6, -Math.PI / 2 * out, -1, 1.1); cluster(x, y + out * 20, 2.2, 1); }
    else { curl(x + out * 8, y - d, 9, 1.6, 0, out, 1.1); curl(x + out * 8, y + d, 9, 1.6, 0, -out, 1.1); cluster(x + out * 20, y, 2.2, 1); }
  };
  pair((x0 + x1) / 2, y0, true, -1); pair((x0 + x1) / 2, y1, true, 1); pair(x0, (y0 + y1) / 2, false, -1); pair(x1, (y0 + y1) / 2, false, 1);
  finish(s, w, h);
}

// ---------- showing a view ----------
function setView(v) {
  view = v;
  coverEl.hidden = v !== 'cover'; aboutEl.hidden = v !== 'about'; homeEl.hidden = v !== 'home'; projectEl.hidden = v !== 'project';
  closeMenus(); hideCard();
  window.scrollTo(0, 0);
}
function showCover() { current = null; setView('cover'); layoutCover(); }
function showAbout() { current = null; setView('about'); layoutAbout(); }
function showHome() {
  current = null; setView('home');
  document.querySelectorAll('.works-menu button').forEach(b => b.removeAttribute('aria-current'));
  layoutHome();
}
function showProject(id) {
  current = PROJECTS.find(p => p.id === id);
  setView('project');
  projectEl.querySelector('.turn-page').classList.remove('ready');
  fillProject(current);
  projectEl.querySelector('.page.right').scrollTop = 0;
  projectEl.querySelector('.left-inner').scrollTop = 0;
  layoutProject();
  scoreSurfaces.forEach(s => { s.revealStart = null; });   // the music inks itself in again for each piece
  checkEnd();
}
// which way the page turns: toward the back of the book (cover, then about, then the pieces) turns forward
const ORDER = id => id === 'cover' ? -3 : id === 'about' ? -2 : id === 'home' ? -1 : PROJECTS.findIndex(p => p.id === id);
const here = () => view === 'project' && current ? current.id : view;
const turnDir = target => ORDER(target) > ORDER(here()) ? 'ltr' : 'rtl';   // forward: the grain sweeps left to right; back: right to left

// The turn: a dark, curved shadow sweeps across the whole screen. While everything is dark,
// the next view is swapped in underneath, then the shadow passes off the other side.
function goTo(target, dir) {
  if (turning) { pendingGo = [target, dir]; return; }
  if (target === here()) return;
  dir = dir || turnDir(target);
  if (audio.playing) togglePlay();
  turning = true;
  turnEl.classList.add('on'); grainEl.classList.add('on');
  animateTurn('in', dir, () => {
    if (target === 'cover') showCover(); else if (target === 'about') showAbout(); else if (target === 'home') showHome(); else showProject(target);
    animateTurn('out', dir, () => {
      turning = false;
      turnEl.classList.remove('on'); grainEl.classList.remove('on');
      if (pendingGo) { const [t, d] = pendingGo; pendingGo = null; goTo(t, d); return; }
      const focus = view === 'cover' ? coverEl.querySelector('[data-go="about"]')
                  : view === 'about' ? aboutEl.querySelector('[data-go="contents"]')
                  : view === 'home' ? (lastTrigger && homeEl.contains(lastTrigger) ? lastTrigger : homeEl.querySelector('.toc-entry'))
                  : projectEl.querySelector('[data-go="home"]');
      if (focus) focus.focus({ preventScroll: true });
    });
  });
}
document.addEventListener('click', e => {
  const open = e.target.closest('[data-open]');
  if (open) { e.preventDefault(); lastTrigger = open; goTo(open.dataset.open); return; }
  const go = e.target.closest('[data-go]');
  if (!go) return;
  e.preventDefault();
  const where = go.dataset.go, i = current ? PROJECTS.indexOf(current) : -1;
  if (where === 'home') goTo('cover', 'rtl');           // the landing: the cover, with navigation beside it
  else if (where === 'about') goTo('about');
  else if (where === 'contents') goTo('home');
  else if (where === 'prev') goTo(i > 0 ? PROJECTS[i - 1].id : 'home', 'rtl');
  else if (where === 'next') goTo(i < PROJECTS.length - 1 ? PROJECTS[i + 1].id : 'home', i < PROJECTS.length - 1 ? 'ltr' : 'rtl');
});
// clicking anywhere on the cover (not a link) opens the book
coverEl.querySelector('.cover-page').addEventListener('click', e => { if (!e.target.closest('a, button')) goTo('about', 'ltr'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && view === 'project') goTo('home', 'rtl'); });
