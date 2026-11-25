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
  // Cada foto va dentro de un marco que recorta: el movimiento nunca tapa textos.
  hitos.forEach(img => {
    const marco = document.createElement('div');
    marco.style.cssText = 'overflow:hidden;position:relative;aspect-ratio:4/5;width:100%';
    img.replaceWith(marco); marco.append(img);
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
  });
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

  // ---------- Botón de WhatsApp arrastrable ----------
  const wa = $('.wa');
  if (wa) {
    const CLAVE = 'tumi-wa-pos';
    const limita = (x, y) => [
      Math.min(Math.max(8, x), innerWidth - wa.offsetWidth - 8),
      Math.min(Math.max(8, y), innerHeight - wa.offsetHeight - 8)
    ];
    const coloca = (x, y) => {
      [x, y] = limita(x, y);
      Object.assign(wa.style, { left: x + 'px', top: y + 'px', right: 'auto', bottom: 'auto' });
      return [x, y];
    };
    try { const g = JSON.parse(localStorage.getItem(CLAVE)); if (g) coloca(g[0] * innerWidth, g[1] * innerHeight); } catch (e) {}
    let ini = null, movio = false;
    wa.addEventListener('pointerdown', e => {
      const r = wa.getBoundingClientRect();
      ini = { dx: e.clientX - r.left, dy: e.clientY - r.top, x: e.clientX, y: e.clientY }; movio = false;
      wa.setPointerCapture(e.pointerId);
    });
    wa.addEventListener('pointermove', e => {
      if (!ini) return;
      if (!movio && Math.hypot(e.clientX - ini.x, e.clientY - ini.y) < 6) return;
      movio = true; wa.classList.add('arrastrando');
      coloca(e.clientX - ini.dx, e.clientY - ini.dy);
    });
    const suelta = () => {
      if (!ini) return; ini = null; wa.classList.remove('arrastrando');
      if (movio) { const r = wa.getBoundingClientRect(); try { localStorage.setItem(CLAVE, JSON.stringify([r.left / innerWidth, r.top / innerHeight])); } catch (e) {} }
    };
    wa.addEventListener('pointerup', suelta); wa.addEventListener('pointercancel', suelta);
    // Si se arrastró, no abrir WhatsApp; si fue un toque, sí.
    wa.addEventListener('click', e => { if (movio) { e.preventDefault(); movio = false; } });
    wa.addEventListener('dragstart', e => e.preventDefault());
    addEventListener('resize', () => { if (wa.style.left) { const r = wa.getBoundingClientRect(); coloca(r.left, r.top); } });
  }
})();
