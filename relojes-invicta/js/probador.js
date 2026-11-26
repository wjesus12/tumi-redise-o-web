// Probador virtual: tono de piel + outfit + muñeca + reloj, con 3 vistas.
import { OUTFITS, TONOS_PIEL } from './catalogo.js';
import { relojSVG } from './reloj-svg.js';
import { CONFIG, soles } from './config.js';
import { estado, $, $$, esc, producto, preciosHTML, precio, agregar, toast } from './tienda.js';

const pr = { tono: 'medio', outfit: 'deportivo', reloj: null, vista: 'look' };
const ESTANDAR = 17.5;

export function iniciarProbador() {
  const primero = estado.productos.find(p => p.outfits?.includes(pr.outfit)) || estado.productos[0];
  pr.reloj = primero?.id;

  $('#tonos').innerHTML = TONOS_PIEL.map(t => `<button class="tono ${t.id === pr.tono ? 'activo' : ''}" data-tono="${t.id}" style="background:radial-gradient(circle at 35% 30%, ${t.base}, ${t.sombra})" aria-label="Tono ${t.nombre}" title="${t.nombre}"></button>`).join('');
  $('#outfits').innerHTML = OUTFITS.map(o => `<button class="outfit ${o.id === pr.outfit ? 'activo' : ''}" data-outfit="${o.id}"><span class="muestra" style="background:linear-gradient(135deg, ${o.manga}, ${o.fondo[1]});${o.puno ? `box-shadow:inset -8px 0 0 ${o.puno}` : ''}"></span>${o.nombre}</button>`).join('');

  $('#tonos').addEventListener('click', e => { const b = e.target.closest('[data-tono]'); if (!b) return; pr.tono = b.dataset.tono; marcar('#tonos', b); pintar(); });
  $('#outfits').addEventListener('click', e => {
    const b = e.target.closest('[data-outfit]'); if (!b) return;
    pr.outfit = b.dataset.outfit; marcar('#outfits', b);
    const actual = producto(pr.reloj);
    if (!actual?.outfits?.includes(pr.outfit)) {
      const sug = estado.productos.find(p => p.outfits?.includes(pr.outfit));
      if (sug) { pr.reloj = sug.id; toast(`★ Para un look ${b.textContent.trim().toLowerCase()} te sugerimos el ${sug.nombre}`); }
    }
    pintarMinis(); pintar();
  });
  $('#seg-muneca').addEventListener('click', e => {
    const b = e.target.closest('[data-m]'); if (!b) return;
    marcar('#seg-muneca', b);
    estado.muneca.modo = b.dataset.m;
    const pers = b.dataset.m === 'personalizado';
    $('#medida').classList.toggle('visible', pers);
    estado.muneca.cm = pers ? +$('#rango-muneca').value : ESTANDAR;
    $('#ayuda-muneca').textContent = pers ? 'Mide tu muñeca con una cinta (o un hilo y una regla) justo debajo del hueso.' : `Estándar: ${ESTANDAR} cm (promedio masculino). Elige "Personalizado" para usar tu medida.`;
    pintar();
  });
  $('#rango-muneca').addEventListener('input', e => { estado.muneca.cm = +e.target.value; $('#valor-muneca').textContent = `${e.target.value} cm`; pintar(); });
  $('.escena-tabs').addEventListener('click', e => { const b = e.target.closest('[data-vista]'); if (!b) return; cambiarVista(b.dataset.vista); });
  $('#relojes-mini').addEventListener('click', e => { const b = e.target.closest('[data-id]'); if (!b) return; pr.reloj = b.dataset.id; pintarMinis(); pintar(); });
  $('#pr-agregar').addEventListener('click', () => pr.reloj && agregar(pr.reloj));
  $('#pr-compartir').addEventListener('click', compartir);
  iniciarCamara();
  pintarMinis();
  pintar();
}

export function probarReloj(id) {
  pr.reloj = id;
  const p = producto(id);
  if (p && !p.outfits?.includes(pr.outfit) && p.outfits?.length) {
    pr.outfit = p.outfits[0];
    marcar('#outfits', $(`#outfits [data-outfit="${pr.outfit}"]`));
  }
  pintarMinis(); pintar();
  $('#probador').scrollIntoView({ behavior: 'smooth' });
}

function marcar(cont, activo) { $$(`${cont} > *`).forEach(b => b.classList.toggle('activo', b === activo)); }

function pintarMinis() {
  const ps = estado.productos.slice().sort((a, b) => (b.outfits?.includes(pr.outfit) ? 1 : 0) - (a.outfits?.includes(pr.outfit) ? 1 : 0));
  $('#relojes-mini').innerHTML = ps.map(p => `<button class="reloj-mini ${p.id === pr.reloj ? 'activo' : ''}" data-id="${p.id}" title="${esc(p.nombre)}" aria-label="${esc(p.nombre)}">${relojSVG(p.visual, { mov: p.movimiento })}${p.outfits?.includes(pr.outfit) ? '<span class="rec">★</span>' : ''}</button>`).join('');
  const cont = $('#relojes-mini'), act = $('#relojes-mini .activo');
  if (act) cont.scrollTo({ left: act.offsetLeft - cont.clientWidth / 2 + act.clientWidth / 2, behavior: 'smooth' });
}

function cambiarVista(v) {
  pr.vista = v;
  $$('.escena-tabs button').forEach(b => b.classList.toggle('activo', b.dataset.vista === v));
  $$('.escena .vista').forEach(el => el.classList.toggle('activa', el.dataset.vista === v));
  if (v !== 'camara') detenerCamara();
}

// ── Evaluación de tamaño ──
function ajuste(tam, cm) {
  const ideal = cm * 2.55, min = cm * 2.2;
  if (tam <= ideal && tam >= min - 2) return { clase: 'ideal', texto: 'Ajuste ideal', det: `Un ${tam} mm queda proporcionado en una muñeca de ${cm} cm.` };
  if (tam < min - 2) return { clase: 'ideal', texto: 'Discreto', det: `${tam} mm se verá sobrio y elegante en tu muñeca de ${cm} cm.` };
  if (tam <= ideal + 5) return { clase: 'audaz', texto: 'Statement', det: `${tam} mm tendrá presencia fuerte en ${cm} cm: perfecto si buscas que se note.` };
  return { clase: 'grande', texto: 'Muy grande', det: `${tam} mm puede sobresalir en una muñeca de ${cm} cm. Mira opciones de ${Math.round(ideal - 3)}–${Math.round(ideal)} mm.` };
}

function pintar() {
  const p = producto(pr.reloj);
  if (!p) return;
  const o = OUTFITS.find(x => x.id === pr.outfit);
  const cm = estado.muneca.cm;
  const svg = escenaMuneca(p, o, TONOS_PIEL.find(t => t.id === pr.tono), cm);

  // Vista look
  const foto = $('#look-foto');
  const src = `img/look-${o.id}.jpg`;
  if (foto.getAttribute('src') !== src) {
    foto.hidden = false;
    foto.onerror = () => { foto.hidden = true; };
    foto.src = src;
    foto.alt = `Look ${o.nombre}`;
  }
  $('.vista-look').style.background = `linear-gradient(135deg, ${o.fondo[0]}, ${o.fondo[1]})`;
  $('#look-eyebrow').textContent = `Outfit ${o.nombre}`;
  $('#look-titulo').textContent = o.frase.replace(/\.$/, '');
  $('#look-frase').textContent = o.tip;
  $('#look-reloj').innerHTML = escenaMuneca(p, o, TONOS_PIEL.find(t => t.id === pr.tono), cm, true);

  // Vista muñeca
  $('#muneca-svg').innerHTML = svg;
  const a = ajuste(p.visual.tam, cm);
  $('#consejo').innerHTML = `<span class="ajuste ${a.clase}">${a.texto}</span><span>${esc(a.det)} ${esc(o.tip)}</span>`;

  // Overlay cámara
  $('#overlay-reloj').innerHTML = relojSVG(p.visual, { etiqueta: p.linea, mov: p.movimiento });

  // Resumen
  $('#pr-linea').textContent = `${p.linea} · ${p.visual.tam} mm`;
  $('#pr-nombre').textContent = p.nombre;
  $('#pr-precios').innerHTML = preciosHTML(p);
}

// ── Escena de antebrazo en SVG ──
function escenaMuneca(p, o, piel, cm, recorte = false) {
  const W = 900, H = 560, cy = 300;
  const ppcm = 30;                         // píxeles por centímetro
  const anchoMuneca = cm * 0.33 * ppcm;    // vista superior del antebrazo
  const xm = 545;                          // posición del reloj
  const codo = anchoMuneca * 1.38;
  const t = piel;
  const d = `M -20 ${cy - codo / 2} C 200 ${cy - codo / 2}, 380 ${cy - anchoMuneca * .62}, ${xm} ${cy - anchoMuneca / 2}
    C 620 ${cy - anchoMuneca * .5}, 660 ${cy - anchoMuneca * .62}, 700 ${cy - anchoMuneca * .78}
    C 760 ${cy - anchoMuneca * .98}, 850 ${cy - anchoMuneca * .9}, 905 ${cy - anchoMuneca * .74}
    L 905 ${cy + anchoMuneca * .74}
    C 850 ${cy + anchoMuneca * .86}, 770 ${cy + anchoMuneca * .9}, 715 ${cy + anchoMuneca * .7}
    C 668 ${cy + anchoMuneca * .55}, 620 ${cy + anchoMuneca * .5}, ${xm} ${cy + anchoMuneca / 2}
    C 380 ${cy + anchoMuneca * .62}, 200 ${cy + codo / 2}, -20 ${cy + codo / 2} Z`;

  // Reloj a escala
  const v = p.visual;
  const R = 46 + (v.tam - 35) * 1.15;      // radio en unidades del SVG del reloj (viewBox 200×340)
  const escala = (v.tam / 10 * ppcm) / (2 * R);
  const wW = 200 * escala, wH = 340 * escala;
  const reloj = relojSVG(v, { etiqueta: p.linea, mov: p.movimiento })
    .replace('<svg class="reloj-svg"', `<svg x="${xm - wW / 2}" y="${cy - wH / 2}" width="${wW}" height="${wH}" class="reloj-svg"`);

  // Manga
  const xManga = 300;
  const patrones = {
    rayas: `<pattern id="pm" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${o.manga}"/><rect width="1.2" height="10" fill="#fff" opacity=".12"/></pattern>`,
    tweed: `<pattern id="pm" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${o.manga}"/><path d="M0 8 8 0M-2 2 2-2M6 10 10 6" stroke="#fff" stroke-opacity=".1"/><path d="M0 0 8 8" stroke="#000" stroke-opacity=".18"/></pattern>`,
    denim: `<pattern id="pm" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${o.manga}"/><path d="M0 6 6 0" stroke="#a9c1df" stroke-opacity=".18"/></pattern>`,
    tecnico: `<pattern id="pm" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="${o.manga}"/><path d="M0 7h14" stroke="#fff" stroke-opacity=".05"/></pattern>`,
    satin: `<linearGradient id="pm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a2a"/><stop offset=".45" stop-color="${o.manga}"/><stop offset="1" stop-color="#000"/></linearGradient>`,
    liso: `<pattern id="pm" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${o.manga}"/></pattern>`,
  };
  const ancho = codo * 1.35;
  const puno = o.puno ? `<rect x="${xManga - 34}" y="${cy - ancho * .44}" width="44" height="${ancho * .88}" rx="10" fill="${o.puno}"/>
      <rect x="${xManga - 34}" y="${cy - ancho * .44}" width="44" height="${ancho * .88}" rx="10" fill="url(#sombraV)" opacity=".5"/>
      ${o.gemelo ? `<circle cx="${xManga - 12}" cy="${cy - ancho * .1}" r="9" fill="url(#oroG)" stroke="#6e4f0e"/><circle cx="${xManga - 12}" cy="${cy - ancho * .1}" r="3" fill="#0f2347"/>` : ''}` : '';
  const elastico = !o.puno ? `<rect x="${xManga - 22}" y="${cy - ancho * .45}" width="28" height="${ancho * .9}" rx="12" fill="${o.manga}" stroke="#000" stroke-opacity=".3"/>
      ${[0, 1, 2, 3, 4].map(i => `<line x1="${xManga - 18 + i * 5}" y1="${cy - ancho * .42}" x2="${xManga - 18 + i * 5}" y2="${cy + ancho * .42}" stroke="#000" stroke-opacity=".25"/>`).join('')}` : '';

  const vb = recorte ? `${xm - 120} ${cy - 120} 240 240` : `0 0 ${W} ${H}`;
  const u = `e${++escenas}`;
  return unico(u, `<svg class="muneca" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(p.nombre)} en la muñeca con outfit ${esc(o.nombre)}">
    <defs>
      <linearGradient id="fondoG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${o.fondo[0]}"/><stop offset="1" stop-color="${o.fondo[1]}"/></linearGradient>
      <radialGradient id="luz" cx=".62" cy=".4" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="pielG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.sombra}"/><stop offset=".28" stop-color="${t.base}"/><stop offset=".62" stop-color="${t.base}"/><stop offset="1" stop-color="${t.sombra}"/></linearGradient>
      <linearGradient id="sombraV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
      <linearGradient id="oroG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c2"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      ${patrones[o.detalle] || patrones.liso}
      <clipPath id="brazoClip"><path d="${d}"/></clipPath>
      <clipPath id="correaClip"><path d="${d}" transform="translate(0 ${cy}) scale(1 1.07) translate(0 ${-cy})"/></clipPath>
      <filter id="sombraB" x="-10%" y="-30%" width="120%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#000" flood-opacity=".6"/></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#fondoG)"/>
    <rect width="${W}" height="${H}" fill="url(#luz)"/>
    <g opacity=".07">${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 70}" y1="0" x2="${i * 70 - 200}" y2="${H}" stroke="#fff"/>`).join('')}</g>
    <g filter="url(#sombraB)">
      <path d="${d}" fill="url(#pielG)"/>
      <path d="M ${xm + 170} ${cy - anchoMuneca * .2} q 30 4 60 2 M ${xm + 175} ${cy + anchoMuneca * .18} q 30 4 60 0" stroke="${t.sombra}" stroke-width="2" fill="none" opacity=".5"/>
      <g clip-path="url(#brazoClip)"><rect x="${xm - 40}" y="${cy - anchoMuneca}" width="80" height="${anchoMuneca * 2}" fill="#000" opacity=".12"/></g>
    </g>
    <g>
      <path d="M -20 ${cy - ancho / 2} L ${xManga} ${cy - ancho * .46} Q ${xManga + 14} ${cy} ${xManga} ${cy + ancho * .46} L -20 ${cy + ancho / 2} Z" fill="url(#pm)"/>
      <path d="M -20 ${cy - ancho / 2} L ${xManga} ${cy - ancho * .46} Q ${xManga + 14} ${cy} ${xManga} ${cy + ancho * .46} L -20 ${cy + ancho / 2} Z" fill="url(#sombraV)"/>
      ${elastico}${puno}
    </g>
    <g clip-path="url(#correaClip)">${reloj}</g>
  </svg>`);
}
let escenas = 0;
const unico = (u, svg) => svg.replace(/(id="|url\(#)(fondoG|luz|pielG|sombraV|oroG|pm|brazoClip|correaClip|sombraB)\b/g, `$1$2-${u}`);

// ── Cámara / foto propia ──
let stream = null;
const ov = { x: .5, y: .5, tam: 150, giro: 0 };

function iniciarCamara() {
  const over = $('#overlay-reloj');
  $('#btn-camara').addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      const v = $('#video');
      v.srcObject = stream; await v.play();
      v.hidden = false; $('#foto-subida').hidden = true;
      mostrarControles();
    } catch {
      toast('No pudimos abrir la cámara. Prueba subiendo una foto.');
    }
  });
  $('#subir-foto').addEventListener('change', e => {
    const f = e.target.files?.[0]; if (!f) return;
    const img = new Image();
    img.onload = () => {
      const c = $('#foto-subida');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      c.hidden = false; $('#video').hidden = true; detenerCamara();
      mostrarControles();
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(f);
  });
  $('#btn-reiniciar-cam').addEventListener('click', () => {
    detenerCamara();
    $('#foto-subida').hidden = true; $('#video').hidden = true;
    $('#camara-vacia').hidden = false; over.hidden = true;
    $('#camara-controles').classList.remove('visible');
    $('#subir-foto').value = '';
  });
  $('#ctrl-tam').addEventListener('input', e => { ov.tam = +e.target.value; posicionar(); });
  $('#ctrl-giro').addEventListener('input', e => { ov.giro = +e.target.value; posicionar(); });

  // Arrastrar
  let arrastre = null;
  over.addEventListener('pointerdown', e => { arrastre = { id: e.pointerId }; over.setPointerCapture(e.pointerId); });
  over.addEventListener('pointermove', e => {
    if (!arrastre) return;
    const r = $('#escena').getBoundingClientRect();
    ov.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    ov.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    posicionar();
  });
  over.addEventListener('pointerup', () => { arrastre = null; });
  $('#escena').addEventListener('wheel', e => {
    if (pr.vista !== 'camara' || over.hidden) return;
    e.preventDefault();
    ov.tam = Math.min(320, Math.max(60, ov.tam - e.deltaY * .2));
    $('#ctrl-tam').value = ov.tam; posicionar();
  }, { passive: false });
}
function mostrarControles() {
  $('#camara-vacia').hidden = true;
  $('#overlay-reloj').hidden = false;
  $('#camara-controles').classList.add('visible');
  posicionar();
}
function posicionar() {
  const o = $('#overlay-reloj');
  o.style.width = `${ov.tam}px`;
  o.style.left = `${ov.x * 100}%`;
  o.style.top = `${ov.y * 100}%`;
  o.style.transform = `translate(-50%, -50%) rotate(${ov.giro}deg)`;
}
function detenerCamara() { stream?.getTracks().forEach(t => t.stop()); stream = null; }

// ── Compartir imagen del probador ──
function svgAImagen(svgTexto) {
  return new Promise((ok, mal) => {
    let s = svgTexto;
    if (!/xmlns=/.test(s.slice(0, 200))) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = mal;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  });
}

async function generarImagen() {
  const p = producto(pr.reloj);
  const o = OUTFITS.find(x => x.id === pr.outfit);
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  if (pr.vista === 'camara' && !$('#overlay-reloj').hidden) {
    const escena = $('#escena').getBoundingClientRect();
    c.width = escena.width * 2; c.height = escena.height * 2;
    const fuente = !$('#video').hidden ? $('#video') : $('#foto-subida');
    const sw = fuente.videoWidth || fuente.width, sh = fuente.videoHeight || fuente.height;
    const k = Math.max(c.width / sw, c.height / sh);
    ctx.drawImage(fuente, (c.width - sw * k) / 2, (c.height - sh * k) / 2, sw * k, sh * k);
    const img = await svgAImagen($('#overlay-reloj').innerHTML);
    const w = ov.tam * 2, h = w * 340 / 200;
    ctx.save(); ctx.translate(ov.x * c.width, ov.y * c.height); ctx.rotate(ov.giro * Math.PI / 180);
    ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  } else {
    c.width = 1800; c.height = 1120;
    const svg = escenaMuneca(p, o, TONOS_PIEL.find(t => t.id === pr.tono), estado.muneca.cm);
    const img = await svgAImagen(svg.replace('preserveAspectRatio="xMidYMid slice"', 'width="1800" height="1120"'));
    ctx.drawImage(img, 0, 0, c.width, c.height);
  }
  // Marca de agua
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, c.height - 90, c.width, 90);
  ctx.fillStyle = '#d4af37'; ctx.font = '700 34px Manrope, sans-serif';
  ctx.fillText(`${CONFIG.tienda} · ${p.nombre}`, 30, c.height - 38);
  ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.font = '700 30px Manrope, sans-serif';
  ctx.fillText(soles(precio(p)), c.width - 30, c.height - 38);
  return new Promise(ok => c.toBlob(ok, 'image/jpeg', .9));
}

async function compartir() {
  const p = producto(pr.reloj);
  const texto = `Mira cómo me queda el ${p.nombre} 🔥 ¿Qué opinas? Lo vi en ${CONFIG.tienda}: ${location.origin}${location.pathname}#probador`;
  try {
    const blob = await generarImagen();
    const archivo = new File([blob], `probador-${p.id}.jpg`, { type: 'image/jpeg' });
    if (navigator.canShare?.({ files: [archivo] })) {
      await navigator.share({ files: [archivo], text: texto, title: p.nombre });
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = archivo.name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Imagen descargada. Adjúntala en WhatsApp 📲');
  } catch (e) {
    if (e?.name === 'AbortError') return;
    console.warn(e);
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
}
