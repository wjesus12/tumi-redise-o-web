// Buscador inteligente: reconoce modelo, línea o referencia aunque esté incompleto o mal escrito.
import { estado, $, esc } from './tienda.js';
import { CONFIG } from './config.js';

// Índice de todos los modelos Invicta conocidos (se carga al abrir el buscador)
let globales = null, cargando = null;
function cargarGlobales() {
  if (globales || cargando) return cargando;
  cargando = fetch(new URL('./modelos-invicta.json', import.meta.url))
    .then(r => r.json())
    .then(lista => {
      const enStock = new Set(estado.productos.map(p => String(p.ref).toUpperCase()));
      globales = lista.filter(m => !enStock.has(m.r.toUpperCase()))
        .map(m => ({ id: `g-${m.r}`, nombre: m.n, linea: m.l, ref: m.r, imagen: m.i, disponible: m.d, global: true }));
    })
    .catch(() => { globales = []; });
  return cargando;
}
const consultaWsp = (m) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hola tio Aurum, estoy interesado en adquirir el Invicta ${m.nombre}`)}`;

const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim();
const VACIAS = new Set(['reloj', 'relojes', 'relog', 'reloges', 'relojito', 'invicta', 'de', 'del', 'el', 'la', 'los', 'las', 'un', 'una', 'modelo', 'ref', 'referencia', 'para', 'hombre', 'con', 'y', 'quiero', 'busco']);
const SINONIMOS = { dorado: 'oro', gold: 'oro', plateado: 'acero', silver: 'acero', steel: 'acero', blue: 'azul', black: 'negro', green: 'verde', red: 'rojo', white: 'blanco', crono: 'cronografo', chrono: 'cronografo', automatico: 'automatico', automatic: 'automatico' };

function distancia(a, b) { // Levenshtein
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function indice(p) {
  const v = p.visual || {};
  const texto = norm([p.nombre, p.linea, p.ref, p.categoria, p.movimiento, v.crono ? 'cronografo' : '', v.caja === 'oro' ? 'oro dorado' : '', v.caja === 'negro' ? 'negro' : '', v.correa === 'cuero' ? 'cuero' : v.correa === 'silicona' ? 'silicona caucho' : 'brazalete metal', p.specs?.Esfera].join(' '));
  const base = texto.split(/\s+/).filter(Boolean);
  return { palabras: [...new Set([...base, ...base.map(w => SINONIMOS[w]).filter(Boolean)])], junto: texto.replace(/\s+/g, ''), ref: norm(p.ref).replace(/\s+/g, ''), nombre: norm(p.nombre) };
}

export function buscar(consulta, productos = estado.productos) {
  const q = norm(consulta);
  if (!q) return [];
  let tokens = q.split(/\s+/).filter(t => !VACIAS.has(t)).map(t => SINONIMOS[t] || t);
  if (!tokens.length) return [];
  const digitos = q.replace(/\D/g, '');
  return productos.map(p => {
    const ix = indice(p);
    let puntos = 0, encontrados = 0;
    if (digitos.length >= 2 && ix.ref.includes(digitos)) { puntos += 100 + (ix.ref.startsWith(digitos) ? 30 : 0) + (ix.ref === digitos ? 50 : 0); }
    const pegado = tokens.join('');
    if (pegado.length >= 4 && ix.junto.includes(pegado)) { puntos += 40; encontrados = tokens.length; } // "prodiver" → "pro diver"
    for (const t of tokens) {
      let mejor = 0;
      for (const w of ix.palabras) {
        if (w === t) mejor = Math.max(mejor, 35);
        else if (w.startsWith(t)) mejor = Math.max(mejor, 28);
        else if (t.length >= 3 && w.includes(t)) mejor = Math.max(mejor, 18);
        else if (t.length >= 4 && distancia(t, w) <= (t.length >= 7 ? 2 : 1)) mejor = Math.max(mejor, 14);
      }
      if (!mejor && /^\d+$/.test(t) && ix.ref.includes(t)) mejor = 30;
      if (mejor) { encontrados++; puntos += mejor; }
    }
    // exige que la mayoría de palabras coincidan (o una coincidencia fuerte de referencia)
    const ok = puntos >= 100 || encontrados >= Math.max(1, Math.ceil(tokens.length * 0.5));
    return { p, puntos: ok ? puntos : 0 };
  }).filter(r => r.puntos > 0).sort((a, b) => b.puntos - a.puntos).map(r => r.p);
}

// ── Interfaz: panel con resultados en vivo ──
export function iniciarBuscador({ verDetalle, filtrarCatalogo }) {
  const panel = $('#buscador'), input = $('#buscador-input'), lista = $('#buscador-resultados');
  let sel = -1, resultados = [];
  const abrirB = () => { cargarGlobales()?.then(() => panel.classList.contains('visible') && pintar()); panel.classList.add('visible'); panel.setAttribute('aria-hidden', 'false'); setTimeout(() => input.focus(), 60); pintar(); };
  const cerrarB = () => { panel.classList.remove('visible'); panel.setAttribute('aria-hidden', 'true'); };
  $('#btn-buscar').addEventListener('click', abrirB);
  $('#buscador-cerrar').addEventListener('click', cerrarB);
  panel.addEventListener('click', e => { if (e.target === panel) cerrarB(); });
  document.addEventListener('keydown', e => {
    if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/input|textarea/i.test(document.activeElement?.tagName)) { e.preventDefault(); abrirB(); }
    if (e.key === 'Escape' && panel.classList.contains('visible')) cerrarB();
  });

  function pintar() {
    const q = input.value.trim();
    resultados = q ? buscar(q) : [];
    sel = resultados.length ? 0 : -1;
    if (!q) {
      const sug = ['Pro Diver', 'Bolt', 'Speedway', 'Racing', 'Specialty', '44716', 'dorado', 'cronógrafo'];
      lista.innerHTML = `<p class="buscador-ayuda">Escribe un modelo, línea o referencia. Prueba con:</p><div class="buscador-sug">${sug.map(s => `<button type="button">${s}</button>`).join('')}</div>`;
      return;
    }
    const otros = globales ? buscar(q, globales).slice(0, 6) : [];
    if (!resultados.length && !otros.length) { lista.innerHTML = `<p class="buscador-ayuda">${globales ? `No encontramos "${esc(q)}". Prueba con otra palabra o con el número de referencia.` : 'Buscando…'}</p>`; return; }
    const bloqueOtros = otros.length ? `<p class="buscador-seccion">Otros modelos Invicta · bajo pedido</p>` + otros.map(m => `<a class="buscador-item buscador-global" href="${consultaWsp(m)}" target="_blank" rel="noopener">
        <span class="buscador-foto">${m.imagen ? `<img src="${esc(m.imagen)}" alt="" loading="lazy">` : ''}</span>
        <span class="buscador-txt"><small>${esc(m.linea)} · Ref. ${esc(m.ref)}</small><b>${resaltar(m.nombre, q)}</b><em>Consultar disponibilidad por WhatsApp</em></span>
        <span class="buscador-flecha" aria-hidden="true"><svg width="18" height="18"><use href="#i-wsp"/></svg></span></a>`).join('') : '';
    if (!resultados.length) { lista.innerHTML = `<p class="buscador-ayuda">"${esc(q)}" no está en nuestra colección actual, pero podemos conseguirlo:</p>` + bloqueOtros; return; }
    lista.innerHTML = `<p class="buscador-seccion">En nuestra colección</p>` + resultados.slice(0, 8).map((p, i) => `<button type="button" class="buscador-item ${i === sel ? 'activo' : ''}" data-id="${p.id}" role="option">
        <span class="buscador-foto">${p.imagen ? `<img src="${esc(p.imagen)}" alt="">` : ''}</span>
        <span class="buscador-txt"><small>${esc(p.linea)} · Ref. ${esc(p.ref)}</small><b>${resaltar(p.nombre, q)}</b></span>
        <span class="buscador-flecha" aria-hidden="true">→</span></button>`).join('')
      + (resultados.length > 8 ? `<button type="button" class="buscador-todos">Ver los ${resultados.length} resultados en el catálogo →</button>` : `<button type="button" class="buscador-todos">Ver en el catálogo →</button>`)
      + bloqueOtros;
  }
  function resaltar(texto, q) {
    let t = esc(texto);
    norm(q).split(/\s+/).filter(w => w.length >= 2).forEach(w => {
      t = t.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
    });
    return t;
  }
  const mover = (d) => {
    const items = [...lista.querySelectorAll('.buscador-item')];
    if (!items.length) return;
    sel = (sel + d + items.length) % items.length;
    items.forEach((b, i) => b.classList.toggle('activo', i === sel));
    items[sel].scrollIntoView({ block: 'nearest' });
  };
  input.addEventListener('input', pintar);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); mover(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); mover(-1); }
    if (e.key === 'Enter') { e.preventDefault(); const b = lista.querySelectorAll('.buscador-item')[sel]; if (b) { cerrarB(); verDetalle(b.dataset.id); } }
  });
  lista.addEventListener('click', e => {
    const s = e.target.closest('.buscador-sug button'); if (s) { input.value = s.textContent; pintar(); input.focus(); return; }
    const b = e.target.closest('.buscador-item'); if (b) { cerrarB(); verDetalle(b.dataset.id); return; }
    if (e.target.closest('.buscador-todos')) { cerrarB(); filtrarCatalogo(input.value.trim()); }
  });
}
