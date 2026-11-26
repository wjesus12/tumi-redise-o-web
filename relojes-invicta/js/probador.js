// Probador real: foto de muñeca según el tono de piel elegido + foto frontal real del reloj, a escala.
import { OUTFITS } from './catalogo.js';
import { MUNECA, TONOS, RELOJES_PROBADOR } from './probador-datos.js';
import { CONFIG, soles } from './config.js';
import { estado, $, $$, esc, producto, preciosHTML, precio, agregar, toast } from './tienda.js';

const pr = { tono: TONOS[4].id, outfit: 'deportivo', reloj: null, vista: 'muneca' };
const ESTANDAR = 17.5;
const fotoReloj = (id) => RELOJES_PROBADOR.find(r => r.id === id);
export const puedeProbar = (id) => !!fotoReloj(id);
const disponibles = () => RELOJES_PROBADOR.map(r => producto(r.id)).filter(Boolean);

export function iniciarProbador() {
  pr.reloj = (disponibles().find(p => p.outfits?.includes(pr.outfit)) || disponibles()[0])?.id;
  // precarga de fotos
  [...TONOS.map(t => t.foto), ...RELOJES_PROBADOR.map(r => r.foto), MUNECA.silueta].forEach(src => { const i = new Image(); i.src = src; });

  $('#tonos').innerHTML = TONOS.map((t, k) => `<button class="tono ${t.id === pr.tono ? 'activo' : ''}" data-tono="${t.id}" style="background:${t.color}" aria-label="Tono ${k + 1}: ${t.nombre}" title="${t.nombre}"></button>`).join('');
  $('#outfits').innerHTML = OUTFITS.map(o => `<button class="outfit ${o.id === pr.outfit ? 'activo' : ''}" data-outfit="${o.id}">${o.nombre}</button>`).join('');

  $('#tonos').addEventListener('click', e => { const b = e.target.closest('[data-tono]'); if (!b) return; pr.tono = b.dataset.tono; marcar('#tonos', b); pintar(); });
  $('#outfits').addEventListener('click', e => {
    const b = e.target.closest('[data-outfit]'); if (!b) return;
    pr.outfit = b.dataset.outfit; marcar('#outfits', b);
    const actual = producto(pr.reloj);
    if (!actual?.outfits?.includes(pr.outfit)) {
      const sug = disponibles().find(p => p.outfits?.includes(pr.outfit));
      if (sug) { pr.reloj = sug.id; toast(`★ Para un estilo ${b.textContent.trim().toLowerCase()} te sugerimos el ${sug.nombre}`); }
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
  $('.escena-tabs').addEventListener('click', e => { const b = e.target.closest('[data-vista]'); if (b) cambiarVista(b.dataset.vista); });
  $('#relojes-mini').addEventListener('click', e => { const b = e.target.closest('[data-id]'); if (!b) return; pr.reloj = b.dataset.id; pintarMinis(); pintar(); });
  $('#pr-agregar').addEventListener('click', () => pr.reloj && agregar(pr.reloj));
  $('#pr-compartir').addEventListener('click', compartir);

  const capa = $('#capa-reloj');
  capa.style.webkitMaskImage = capa.style.maskImage = `url(${MUNECA.silueta})`;
  iniciarCamara();
  pintarMinis();
  pintar();
}

export function probarReloj(id) {
  if (!puedeProbar(id)) { toast('Este modelo aún no está disponible en el probador'); return; }
  pr.reloj = id;
  pintarMinis(); pintar();
  $('#probador').scrollIntoView({ behavior: 'smooth' });
}

function marcar(cont, activo) { $$(`${cont} > *`).forEach(b => b.classList.toggle('activo', b === activo)); }

function pintarMinis() {
  const ps = disponibles().sort((a, b) => (b.outfits?.includes(pr.outfit) ? 1 : 0) - (a.outfits?.includes(pr.outfit) ? 1 : 0));
  $('#relojes-mini').innerHTML = ps.map(p => `<button class="reloj-mini ${p.id === pr.reloj ? 'activo' : ''}" data-id="${p.id}" title="${esc(p.nombre)}" aria-label="${esc(p.nombre)}"><img src="${fotoReloj(p.id).foto}" alt="">${p.outfits?.includes(pr.outfit) ? '<span class="rec">★</span>' : ''}</button>`).join('');
}

function cambiarVista(v) {
  pr.vista = v;
  $$('.escena-tabs button').forEach(b => b.classList.toggle('activo', b.dataset.vista === v));
  $$('.escena .vista').forEach(el => el.classList.toggle('activa', el.dataset.vista === v));
  $('#consejo').hidden = v === 'camara';
  if (v !== 'camara') detenerCamara();
}

function ajuste(tam, cm) {
  const ideal = cm * 2.55, min = cm * 2.2;
  if (tam <= ideal && tam >= min - 2) return { clase: 'ideal', texto: 'Ajuste ideal', det: `Un ${tam} mm queda proporcionado en una muñeca de ${cm} cm.` };
  if (tam < min - 2) return { clase: 'ideal', texto: 'Discreto', det: `${tam} mm se verá sobrio y elegante en tu muñeca de ${cm} cm.` };
  if (tam <= ideal + 5) return { clase: 'audaz', texto: 'Statement', det: `${tam} mm tendrá presencia fuerte en ${cm} cm: perfecto si buscas que se note.` };
  return { clase: 'grande', texto: 'Grande', det: `${tam} mm en una muñeca de ${cm} cm luce atrevido y sobresaliente: ideal si quieres un reloj que no pase desapercibido.` };
}

// Geometría del reloj sobre la foto (en px de la foto original)
function geometria(p, cm) {
  const r = fotoReloj(p.id);
  const pxPorMm = MUNECA.grosor / (cm * 10 * 0.331); // grosor visible ≈ 33 % del contorno
  const ancho = p.visual.tam * pxPorMm * r.ajuste;
  return { ancho, x: MUNECA.x, y: MUNECA.y, angulo: MUNECA.angulo, cx: r.cx ?? .5, cy: r.cy ?? .5 };
}

function pintar() {
  const p = producto(pr.reloj);
  if (!p) return;
  const tono = TONOS.find(t => t.id === pr.tono);
  const o = OUTFITS.find(x => x.id === pr.outfit);
  const cm = estado.muneca.cm;
  const g = geometria(p, cm);

  $('#foto-muneca').src = tono.foto;
  $('#nombre-tono').textContent = `Tono ${TONOS.indexOf(tono) + 1} de ${TONOS.length}: ${tono.nombre}`;
  const img = $('#reloj-en-muneca');
  img.src = fotoReloj(p.id).foto;
  img.alt = `${p.nombre} en la muñeca`;
  Object.assign(img.style, {
    width: `${g.ancho / MUNECA.ancho * 100}%`,
    left: `${g.x / MUNECA.ancho * 100}%`,
    top: `${g.y / MUNECA.alto * 100}%`,
    transformOrigin: `${g.cx * 100}% ${g.cy * 100}%`,
    transform: `translate(-${g.cx * 100}%, -${g.cy * 100}%) rotate(${g.angulo}deg) scaleY(.94)`,
  });

  const a = ajuste(p.visual.tam, cm);
  $('#consejo').innerHTML = `<span class="ajuste ${a.clase}">${a.texto}</span><span>${esc(a.det)} ${esc(o.tip)}</span>`;
  $('#overlay-img').src = fotoReloj(p.id).foto;
  $('#pr-linea').textContent = `${p.linea} · ${p.visual.tam} mm`;
  $('#pr-nombre').textContent = p.nombre;
  $('#pr-precios').innerHTML = preciosHTML(p);
}

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

  let arrastre = false;
  over.addEventListener('pointerdown', e => { arrastre = true; over.setPointerCapture(e.pointerId); });
  over.addEventListener('pointermove', e => {
    if (!arrastre) return;
    const r = $('#escena').getBoundingClientRect();
    ov.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    ov.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    posicionar();
  });
  over.addEventListener('pointerup', () => { arrastre = false; });
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

// ── Compartir imagen ──
const cargar = (src) => new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = src; });

async function generarImagen() {
  const p = producto(pr.reloj);
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const reloj = await cargar(fotoReloj(p.id).foto);
  if (pr.vista === 'camara' && !$('#overlay-reloj').hidden) {
    const escena = $('#escena').getBoundingClientRect();
    c.width = escena.width * 2; c.height = escena.height * 2;
    const fuente = !$('#video').hidden ? $('#video') : $('#foto-subida');
    const sw = fuente.videoWidth || fuente.width, sh = fuente.videoHeight || fuente.height;
    const k = Math.max(c.width / sw, c.height / sh);
    ctx.drawImage(fuente, (c.width - sw * k) / 2, (c.height - sh * k) / 2, sw * k, sh * k);
    const w = ov.tam * 2, h = w * reloj.height / reloj.width;
    ctx.save(); ctx.translate(ov.x * c.width, ov.y * c.height); ctx.rotate(ov.giro * Math.PI / 180);
    ctx.drawImage(reloj, -w / 2, -h / 2, w, h); ctx.restore();
  } else {
    const [base, sil] = await Promise.all([cargar(TONOS.find(t => t.id === pr.tono).foto), cargar(MUNECA.silueta)]);
    c.width = MUNECA.ancho; c.height = MUNECA.alto;
    ctx.drawImage(base, 0, 0, c.width, c.height);
    const capa = document.createElement('canvas'); capa.width = c.width; capa.height = c.height;
    const cx = capa.getContext('2d');
    const g = geometria(p, estado.muneca.cm);
    const h = g.ancho * reloj.height / reloj.width;
    cx.save(); cx.translate(g.x, g.y); cx.rotate(g.angulo * Math.PI / 180); cx.scale(1, .94);
    cx.shadowColor = 'rgba(0,0,0,.35)'; cx.shadowBlur = 18; cx.shadowOffsetY = 10;
    cx.drawImage(reloj, -g.ancho * g.cx, -h * g.cy, g.ancho, h); cx.restore();
    cx.globalCompositeOperation = 'destination-in';
    cx.drawImage(sil, 0, 0, c.width, c.height);
    ctx.drawImage(capa, 0, 0);
  }
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, c.height - 70, c.width, 70);
  ctx.fillStyle = '#d4af37'; ctx.font = '700 28px Manrope, sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(`${CONFIG.tienda} · ${p.nombre}`, 24, c.height - 26);
  ctx.textAlign = 'right'; ctx.fillStyle = '#fff';
  ctx.fillText(soles(precio(p)), c.width - 24, c.height - 26);
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
