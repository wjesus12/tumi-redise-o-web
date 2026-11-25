// Club El Tumi · interacción: scroll, contadores y gráficos con datos reales
(() => {
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => 'S/ ' + n.toFixed(2);
  const $ = s => document.querySelector(s);
  const tip = $('#tip');

  // ---------- Tooltip compartido ----------
  function muestra(e, html) {
    tip.innerHTML = html; tip.classList.add('on');
    const x = Math.min(Math.max(e.clientX, 130), innerWidth - 130);
    tip.style.left = x + 'px'; tip.style.top = e.clientY + 'px';
  }
  const oculta = () => tip.classList.remove('on');

  // ---------- Contadores ----------
  function cuenta(el) {
    if (el.dataset.hecho) return; el.dataset.hecho = 1;
    const fin = +el.dataset.cnt, dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '';
    if (reducido) { el.textContent = fin.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const paso = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (fin * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  // ---------- Títulos palabra por palabra ----------
  document.querySelectorAll('.palabras').forEach(h => {
    let n = 0;
    const parte = nodo => [...nodo.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.append(' '); return; }
          const o = document.createElement('span'); o.className = 'w';
          const i = document.createElement('span'); i.textContent = w; i.style.setProperty('--n', n++);
          o.append(i); frag.append(o);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') parte(c);
    });
    parte(h);
  });

  // ---------- Observador de entrada ----------
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in', 'vis');
    e.target.querySelectorAll?.('[data-cnt]').forEach(cuenta);
    io.unobserve(e.target);
  }), { threshold: .2 });
  document.querySelectorAll('.palabras').forEach(el => io.observe(el));

  // ---------- Vuelo: imagen que se expande ----------
  const vuelo = $('#vuelo');
  const hitos = [...document.querySelectorAll('.hito img')];
  let pend = false;
  function alScroll() {
    pend = false;
    if (vuelo) {
      const r = vuelo.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      vuelo.style.setProperty('--p', p.toFixed(4));
      if (p > .7) vuelo.querySelectorAll('[data-cnt]').forEach(cuenta);
    }
    hitos.forEach(img => {
      const r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `scale(1.12) translateY(${(k * -28).toFixed(1)}px)`;
    });
  }
  if (!reducido) {
    addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(alScroll); } }, { passive: true });
    alScroll();
  } else if (vuelo) { vuelo.style.setProperty('--p', 1); vuelo.querySelectorAll('[data-cnt]').forEach(cuenta); }

  // ---------- Interruptor de socio: cambia precios con animación ----------
  const juega = $('.juega'), tg = $('#tgSocio');
  if (tg) tg.onchange = () => {
    juega.classList.toggle('socio', tg.checked);
    juega.querySelectorAll('.pr[data-s] em').forEach(em => {
      const pr = em.closest('.pr'), v = tg.checked ? pr.dataset.s : pr.dataset.g;
      if (reducido) { em.textContent = v; return; }
      em.classList.add('salta');
      setTimeout(() => { em.textContent = v; em.classList.remove('salta'); }, 220);
    });
  };
  const ioT = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.tile').forEach(t => t.classList.add('in'));
    ioT.unobserve(e.target);
  }), { threshold: .08 });
  document.querySelectorAll('.tiles').forEach(el => ioT.observe(el));

  addEventListener('scroll', oculta, { passive: true });
})();
