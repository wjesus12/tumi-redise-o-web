import { CONFIG, estadoBlackFriday, soles, modoDemo } from './config.js';
import { LINEAS, CUPONES } from './catalogo.js';
import { FAQ } from './conocimiento.js';
import { iniciarTicTac } from './reloj-svg.js';
import { obtenerProductos, calcularTotales, validarCupon, crearPedido, mensajeWhatsApp, local } from './datos.js';
import {
  estado, alCambiar, $, $$, esc, producto, media, preciosHTML, precio, agregar, cambiarCantidad, quitar, vaciar,
  lineasCarrito, cantidadCarrito, alternarFavorito, toast, abrir, cerrar, bfActivo,
} from './tienda.js';
import { iniciarProbador, probarReloj, puedeProbar } from './probador.js';
import { iniciarConcierge, abrirChat } from './concierge.js';
import { escena } from './escenas.js';
import { FOTOS_HERO } from './hero.js';
import { iniciarWow } from './wow.js';
import { iniciarBuscador, buscar } from './buscador.js';

const filtro = { linea: null, cat: 'todos', texto: '', orden: 'destacados', outfit: null, soloFavs: false };

// ═════════ Inicio ═════════
async function iniciar() {
  estado.productos = await obtenerProductos();
  if (modoDemo()) console.info('%cAURUM TEMPO · MODO DEMO (sin Supabase): los pedidos se guardan en este navegador.', 'color:#d4af37');

  $('#anio').textContent = new Date().getFullYear();
  const wsp = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hola AURUM TEMPO, quiero información sobre un reloj Invicta ⌚')}`;
  $('#flotante-wsp').href = wsp;
  $('#link-wsp-footer').href = wsp;
  $('#link-ig').href = CONFIG.instagram;
  $('#link-tt').href = CONFIG.tiktok;

  iniciarCuenta();
  iniciarHero();
  iniciarCinta();
  iniciarVida();
  pintarLineas();
  iniciarFiltros();
  pintarGrid();
  pintarFAQ();
  iniciarCarrito();
  iniciarProbador();
  iniciarConcierge();
  iniciarAparecer();
  iniciarTicTac();
  iniciarWow();
  iniciarTema();
  iniciarBuscador({
    verDetalle,
    filtrarCatalogo: (q) => { $('#buscar').value = q; filtro.texto = q; filtro.linea = null; filtro.outfit = null; pintarLineas(); pintarGrid(); $('#catalogo').scrollIntoView({ behavior: 'smooth' }); },
  });
  actualizarBurbujas();
  alCambiar(() => { actualizarBurbujas(); pintarCarrito(); });

  $('#btn-menu').addEventListener('click', () => $('#nav').classList.toggle('abierto'));
  $$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('abierto')));
  $('#velo').addEventListener('click', cerrar);
  $$('[data-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
  $$('[data-filtro-outfit]').forEach(a => a.addEventListener('click', () => { filtro.outfit = a.dataset.filtroOutfit; filtro.linea = null; pintarLineas(); pintarGrid(); }));
  $('#btn-favs').addEventListener('click', () => {
    filtro.soloFavs = !filtro.soloFavs;
    pintarGrid();
    $('#catalogo').scrollIntoView({ behavior: 'smooth' });
    toast(filtro.soloFavs ? '♥ Mostrando tus favoritos' : 'Mostrando todo el catálogo');
  });
}

// ═════════ Cuenta regresiva Black Friday ═════════
function iniciarCuenta() {
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const bf = estadoBlackFriday();
    if (bf.fase === 'terminado') { $('#barra-bf').hidden = true; $('#cuenta-hero').hidden = true; $('#hero-fase').textContent = 'COLECCIÓN'; return; }
    const ms = Math.max(0, bf.hasta - Date.now());
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    $('#mini-cuenta').innerHTML = `<span>${pad(d)}d</span><span>${pad(h)}h</span><span>${pad(m)}m</span><span>${pad(s)}s</span>`;
    $$('#cuenta-hero b').forEach(b => { b.textContent = pad({ d, h, m, s }[b.dataset.u]); });
    const anticipado = bf.fase === 'anticipado';
    $('#bf-titulo').textContent = anticipado ? 'BLACK FRIDAY · ACCESO ANTICIPADO' : bf.fase === 'pronto' ? 'BLACK FRIDAY' : 'BLACK FRIDAY';
    $('#bf-texto').textContent = bf.fase === 'pronto' ? 'Empieza en' : 'Hasta 40% OFF + cupones acumulables · termina en';
    $('#cuenta-lbl').textContent = bf.fase === 'pronto' ? 'El Black Friday empieza en' : 'Black Friday termina en';
    $('#hero-fase').textContent = anticipado ? 'ACCESO ANTICIPADO' : 'BLACK FRIDAY';
  };
  tick();
  setInterval(tick, 1000);
}

// ═════════ Hero ═════════
function iniciarHero() {
  // Fotos reales de modelos que vendemos, en orden aleatorio
  const fotos = FOTOS_HERO.filter(f => producto(f.id)).sort(() => Math.random() - .5);
  let i = 0, timer;
  const sel = $('#hero-selector');
  sel.innerHTML = fotos.map((f, k) => `<button aria-label="Ver ${esc(producto(f.id).nombre)}" data-k="${k}"></button>`).join('');
  // precarga
  fotos.forEach(f => { const im = new Image(); im.src = f.src; });
  const mostrar = (k) => {
    i = k;
    const f = fotos[k], p = producto(f.id);
    const caja = $('#hero-reloj');
    caja.innerHTML = `<img src="${f.src}" alt="${esc(p.nombre)}, reloj Invicta original">`;
    caja.animate([{ opacity: 0, transform: 'translateY(18px) scale(.95)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' });
    const mas = p.etiquetas?.includes('mas-vendido') ? ' · Más vendido' : '';
    $('#hero-precio').innerHTML = `<small>${esc(p.linea)}${mas}</small><div class="nombre">${esc(p.nombre)}</div><div class="precios">${preciosHTML(p).replace(/<span class="ahorro">.*<\/span>/, '')}</div>
      <button class="btn btn-oro" style="padding:10px 16px;font-size:11px;margin-top:10px;width:100%" data-ver="${p.id}">Ver detalle</button>`;
    $('#hero-desc').textContent = bfActivo() && p.bf ? `-${p.bf}%` : 'NEW';
    $$('button', sel).forEach((b, n) => b.classList.toggle('activo', n === k));
  };
  sel.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { mostrar(+b.dataset.k); reiniciar(); } });
  $('#hero-precio').addEventListener('click', e => { const b = e.target.closest('[data-ver]'); if (b) verDetalle(b.dataset.ver); });
  const reiniciar = () => { clearInterval(timer); timer = setInterval(() => mostrar((i + 1) % fotos.length), 5000); };
  mostrar(0); reiniciar();
}

function iniciarVida() {
  $$('.vida-card[data-escena]').forEach(card => {
    const img = card.querySelector('img');
    const p = producto(card.dataset.reloj);
    if (p) card.querySelector('.txt').insertAdjacentHTML('beforeend', `<em class="vida-modelo">${esc(p.nombre)} · ${soles(precio(p))}</em>`);
    // si la foto no carga, queda una escena ilustrada de respaldo
    img.addEventListener('error', () => { img.hidden = true; card.insertAdjacentHTML('afterbegin', `<div class="vida-fallback">${escena(card.dataset.escena, 800, 1160)}</div>`); });
  });
}

function iniciarCinta() {
  const frases = ['Black Friday hasta 40% OFF', 'Separa desde S/ 20', 'Envíos diarios por Shalom', 'Relojes Invicta originales', 'Cupones acumulables', 'Pruébatelo en el probador virtual'];
  $('#cinta').innerHTML = [...frases, ...frases].map(f => `<span>${f}</span>`).join('');
}

// ═════════ Líneas / filtros / grid ═════════
function pintarLineas() {
  const cont = $('#lineas');
  cont.innerHTML = LINEAS.map(l => {
    const ps = estado.productos.filter(p => p.linea === l);
    if (!ps.length) return '';
    const desde = Math.min(...ps.map(precio));
    return `<button class="linea-card ${filtro.linea === l ? 'activa' : ''}" data-linea="${esc(l)}" role="tab" aria-selected="${filtro.linea === l}">
      <div class="mini">${media(ps[0])}</div>
      <b>${esc(l)}</b><span>${ps.length} modelos · desde ${soles(desde)}</span></button>`;
  }).join('');
  cont.onclick = (e) => {
    const b = e.target.closest('[data-linea]');
    if (!b) return;
    filtro.linea = filtro.linea === b.dataset.linea ? null : b.dataset.linea;
    filtro.outfit = null;
    pintarLineas(); pintarGrid();
  };
}

function iniciarFiltros() {
  $('#chips-cat').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    filtro.cat = b.dataset.cat;
    $$('#chips-cat .chip').forEach(c => c.classList.toggle('activo', c === b));
    pintarGrid();
  });
  let t;
  $('#buscar').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { filtro.texto = e.target.value.trim().toLowerCase(); pintarGrid(); }, 150); });
  $('#orden').addEventListener('change', e => { filtro.orden = e.target.value; pintarGrid(); });
}

const normal = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const COLORES = { azul: ['#12', '#16', '#1a', '#0f2'], negro: ['#0', '#11', '#2b'], verde: ['#2f4', '#0f4'], rojo: ['#8b'], dorado: [], oro: [] };

function filtrados() {
  let ps = estado.productos.slice();
  if (filtro.soloFavs) ps = ps.filter(p => estado.favoritos.includes(p.id));
  if (filtro.linea) ps = ps.filter(p => p.linea === filtro.linea);
  if (filtro.outfit) ps = ps.filter(p => p.outfits?.includes(filtro.outfit));
  if (filtro.cat === 'deportivo' || filtro.cat === 'formal') ps = ps.filter(p => p.categoria === filtro.cat);
  if (filtro.cat === 'Automático') ps = ps.filter(p => p.movimiento === 'Automático');
  if (filtro.cat === 'ofertas') ps = ps.filter(p => bfActivo() && p.bf >= 30);
  if (filtro.texto) {
    const orden = buscar(filtro.texto, ps).map(p => p.id);
    ps = orden.map(id => ps.find(p => p.id === id));
  }
  const o = filtro.orden;
  if (o === 'precio-asc') ps.sort((a, b) => precio(a) - precio(b));
  if (o === 'precio-desc') ps.sort((a, b) => precio(b) - precio(a));
  if (o === 'descuento') ps.sort((a, b) => (b.bf || 0) - (a.bf || 0));
  if (o === 'tam') ps.sort((a, b) => b.visual.tam - a.visual.tam);
  if (o === 'destacados' && !filtro.texto) ps.sort((a, b) => (b.etiquetas?.includes('mas-vendido') ? 1 : 0) - (a.etiquetas?.includes('mas-vendido') ? 1 : 0));
  return ps;
}

function tarjeta(p) {
  const fav = estado.favoritos.includes(p.id);
  const badges = [];
  if (bfActivo() && p.bf) badges.push(`<span class="badge badge-bf">-${p.bf}% Black Friday</span>`);
  if (p.etiquetas?.includes('mas-vendido')) badges.push('<span class="badge badge-oro">Más vendido</span>');
  if (p.etiquetas?.includes('ultimas')) badges.push('<span class="badge badge-ultimas">Últimas unidades</span>');
  if (p.categoria === 'formal') badges.push('<span class="badge badge-navy">Formal</span>');
  return `<article class="card" data-id="${p.id}">
    <div class="card-badges">${badges.join('')}</div>
    <button class="card-fav ${fav ? 'activo' : ''}" data-fav aria-label="${fav ? 'Quitar de' : 'Agregar a'} favoritos" aria-pressed="${fav}"><svg><use href="#i-corazon"/></svg></button>
    <div class="card-media" data-ver data-wow>${media(p)}</div>
    <div class="card-cuerpo">
      <span class="card-linea">${esc(p.linea)}</span>
      <h3 class="card-nombre">${esc(p.nombre)}</h3>
      <span class="card-meta">${p.visual.tam} mm · ${esc(p.movimiento)}${p.visual.crono ? ' · Cronógrafo' : ''}</span>
      <div class="precios">${preciosHTML(p)}</div>
      <div class="card-acciones">
        <button class="btn btn-oro" data-agregar><svg><use href="#i-bolsa"/></svg>Agregar</button>
        ${puedeProbar(p.id) ? `<button class="btn-probar" data-probar aria-label="Probar ${esc(p.nombre)}" title="Probar en el probador"><svg><use href="#i-espejo"/></svg></button>` : ''}
      </div>
    </div>
  </article>`;
}

function pintarGrid() {
  const ps = filtrados();
  const g = $('#grid-productos');
  g.innerHTML = ps.length ? ps.map(tarjeta).join('') : `<div class="vacio">${filtro.soloFavs ? 'Aún no guardas favoritos. Toca el ♥ de un reloj.' : 'No encontramos relojes con ese filtro.'}<br><button class="btn btn-borde" style="margin-top:16px" id="limpiar">Ver todos</button></div>`;
  const partes = [];
  if (filtro.linea) partes.push(filtro.linea);
  if (filtro.outfit) partes.push(`ideales para look ${filtro.outfit}`);
  if (filtro.soloFavs) partes.push('favoritos');
  $('#resultados-info').innerHTML = `${ps.length} reloj${ps.length === 1 ? '' : 'es'}${partes.length ? ' · ' + esc(partes.join(' · ')) + ' · <a href="#catalogo" id="quitar-filtros" style="color:var(--oro)">quitar filtros</a>' : ''}`;
  $('#limpiar')?.addEventListener('click', limpiarFiltros);
  $('#quitar-filtros')?.addEventListener('click', limpiarFiltros);
}
function limpiarFiltros() {
  Object.assign(filtro, { linea: null, cat: 'todos', texto: '', outfit: null, soloFavs: false });
  $('#buscar').value = '';
  $$('#chips-cat .chip').forEach((c, i) => c.classList.toggle('activo', i === 0));
  pintarLineas(); pintarGrid();
}

$('#grid-productos').addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const id = card.dataset.id;
  if (e.target.closest('[data-agregar]')) return agregar(id);
  if (e.target.closest('[data-probar]')) return probarReloj(id);
  if (e.target.closest('[data-fav]')) { alternarFavorito(id); return pintarGrid(); }
  if (e.target.closest('[data-ver]')) verDetalle(id);
});

// ═════════ Detalle ═════════
export function verDetalle(id) {
  const p = producto(id);
  if (!p) return;
  const specs = Object.entries(p.specs || {}).map(([k, v]) => `<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('');
  const consulta = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hola tio Aurum, estoy interesado en adquirir el Invicta ${p.nombre}`)}`;
  $('#detalle-contenido').innerHTML = `<div class="detalle">
    <div class="detalle-media" data-wow>${media(p)}<span class="hora-real">${p.imagen ? 'Foto oficial del modelo' : 'Marcando la hora real de Lima'}</span></div>
    <div class="detalle-info">
      <span class="card-linea">${esc(p.linea)} · ${p.categoria === 'formal' ? 'Formal' : 'Deportivo'}</span>
      <h2 class="card-nombre">${esc(p.nombre)}</h2>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${bfActivo() && p.bf ? `<span class="badge badge-bf">-${p.bf}% Black Friday</span>` : ''}${p.etiquetas?.includes('ultimas') ? '<span class="badge badge-ultimas">Últimas unidades</span>' : ''}${p.etiquetas?.includes('mas-vendido') ? '<span class="badge badge-oro">Más vendido</span>' : ''}</div>
      <div class="precios" style="margin-top:14px">${preciosHTML(p)}</div>
      <p class="desc">${esc(p.descripcion)}</p>
      <div class="specs">${specs}</div>
      <div class="detalle-acciones">
        <button class="btn btn-oro" data-agregar><svg><use href="#i-bolsa"/></svg>Agregar al carrito</button>
        ${puedeProbar(p.id) ? '<button class="btn btn-borde" data-probar><svg><use href="#i-espejo"/></svg>Probármelo</button>' : ''}
        <a class="btn btn-wsp" href="${consulta}" target="_blank" rel="noopener"><svg><use href="#i-wsp"/></svg>Consultar por WhatsApp</a>
      </div>
      <div class="nota-envio"><svg><use href="#i-camion"/></svg><span>Sepáralo con <b>${soles(CONFIG.adelanto)}</b> (S/ ${CONFIG.adelantoMultiple} desde 2 relojes). Enviamos todos los días a las ${CONFIG.horaEnvio} a tu agencia Shalom más cercana y te compartimos el tracking. Pagas el saldo al recoger.</span></div>
    </div></div>`;
  const c = $('#detalle-contenido');
  c.querySelector('[data-agregar]').onclick = () => { agregar(id); cerrar(); setTimeout(() => abrir($('#carrito')), 250); };
  const bp = c.querySelector('[data-probar]'); if (bp) bp.onclick = () => { cerrar(); probarReloj(id); };
  abrir($('#modal-detalle'));
}

// ═════════ Carrito y checkout ═════════
function actualizarBurbujas() {
  const n = cantidadCarrito();
  const b = $('#burbuja-carrito');
  b.textContent = n; b.classList.toggle('visible', n > 0);
  const f = $('#burbuja-favs');
  f.textContent = estado.favoritos.length; f.classList.toggle('visible', estado.favoritos.length > 0);
}

function iniciarCarrito() {
  $('#btn-carrito').addEventListener('click', () => { pintarCarrito(); abrir($('#carrito')); });
  $('#carrito-items').addEventListener('click', e => {
    const fila = e.target.closest('[data-id]');
    if (!fila) return;
    const id = fila.dataset.id;
    if (e.target.closest('[data-mas]')) cambiarCantidad(id, 1);
    if (e.target.closest('[data-menos]')) cambiarCantidad(id, -1);
    if (e.target.closest('[data-quitar]')) quitar(id);
  });
  $('#btn-cupon').addEventListener('click', aplicarCupon);
  $('#cupon-input').addEventListener('keydown', e => { if (e.key === 'Enter') aplicarCupon(); });
  $('#btn-checkout').addEventListener('click', abrirCheckout);
  pintarCarrito();
}

async function aplicarCupon() {
  const codigo = $('#cupon-input').value;
  const msg = $('#cupon-msg');
  const t = calcularTotales(lineasCarrito(), null);
  msg.className = 'msg'; msg.textContent = 'Validando…';
  const r = await validarCupon(codigo, t.subtotal);
  if (r.valido) { estado.cupon = { codigo: r.codigo, porcentaje: r.porcentaje, minimo: r.minimo }; msg.className = 'msg ok'; }
  else { estado.cupon = null; msg.className = 'msg error'; }
  msg.textContent = r.mensaje;
  pintarTotales();
}

function pintarCarrito() {
  const ls = lineasCarrito();
  const cont = $('#carrito-items');
  $('#carrito-pie').hidden = !ls.length;
  if (!ls.length) {
    cont.innerHTML = `<div class="carrito-vacio"><svg><use href="#i-bolsa"/></svg><p>Tu carrito está vacío.</p><a href="#catalogo" class="btn btn-borde" style="margin-top:18px" onclick="document.getElementById('velo').click()">Ver relojes</a></div>`;
    return;
  }
  cont.innerHTML = ls.map(({ producto: p, cantidad }) => `<div class="item-carrito" data-id="${p.id}">
      <div class="mini">${media(p)}</div>
      <div><b>${esc(p.nombre)}</b><small>${esc(p.linea)} · ${p.visual.tam} mm</small>
        <div class="cantidad"><button data-menos aria-label="Quitar uno">−</button><span>${cantidad}</span><button data-mas aria-label="Agregar uno">+</button></div></div>
      <div style="text-align:right"><div class="precio" style="font-size:22px">${soles(precio(p) * cantidad)}</div>${precio(p) < p.precio ? `<div class="precio-antes" style="font-size:12px">${soles(p.precio * cantidad)}</div>` : ''}<button class="quitar" data-quitar>Quitar</button></div>
    </div>`).join('');
  // re-validar cupón si cambió el subtotal
  if (estado.cupon) {
    const t = calcularTotales(ls, null);
    if (t.subtotal < estado.cupon.minimo) { $('#cupon-msg').className = 'msg error'; $('#cupon-msg').textContent = `El cupón ${estado.cupon.codigo} requiere ${soles(estado.cupon.minimo)}.`; }
  }
  pintarTotales();
}

function pintarTotales() {
  const t = calcularTotales(lineasCarrito(), estado.cupon);
  const falta = CUPONES.find(c => c.minimo > t.subtotal && (!estado.cupon || c.porcentaje > estado.cupon.porcentaje));
  $('#totales').innerHTML = `
    <div><span>Precio regular</span><span>${soles(t.regular)}</span></div>
    ${t.descuentoBF ? `<div class="bf"><span>Black Friday</span><span>-${soles(t.descuentoBF)}</span></div>` : ''}
    ${t.descuentoCupon ? `<div class="cup"><span>Cupón ${esc(estado.cupon.codigo)} (${estado.cupon.porcentaje}%)</span><span>-${soles(t.descuentoCupon)}</span></div>` : ''}
    <div><span>Envío a agencia</span><span>Lo pagas al recoger</span></div>
    <div class="total"><span>Total</span><span>${soles(t.total)}</span></div>
    <div class="adelanto"><b>Hoy solo separas con ${soles(t.adelanto)}</b>${t.unidades >= 2 ? ' (2 relojes o más)' : ''}<br>Saldo al recoger en Shalom: ${soles(t.saldo)}</div>
    ${falta ? `<div style="font-size:12px;color:var(--gris)">💡 Te faltan ${soles(falta.minimo - t.subtotal)} para usar <b style="color:var(--oro)">${falta.codigo}</b> (${falta.porcentaje}% extra).</div>` : ''}`;
}

function abrirCheckout() {
  const ls = lineasCarrito();
  if (!ls.length) return;
  const t = calcularTotales(ls, estado.cupon);
  const guardado = local.leer('at_cliente', {});
  const muneca = estado.muneca.modo === 'personalizado' ? `${estado.muneca.cm} cm` : '';
  $('#checkout-contenido').innerHTML = `<div class="checkout">
    <span class="eyebrow">Último paso</span>
    <h2 class="titulo">Separa tu reloj</h2>
    <p style="color:var(--gris)">Registramos tu pedido y te llevamos a WhatsApp para separarlo con ${soles(t.adelanto)}.</p>
    <div class="checkout-grid">
      <form id="form-pedido" class="form-grid" novalidate>
        <div class="campo full"><label for="f-nombre">Nombre y apellido *</label><input id="f-nombre" name="nombre" required minlength="3" placeholder="Ej. Carlos Mendoza" value="${esc(guardado.nombre || '')}" autocomplete="name"></div>
        <div class="campo"><label for="f-tel">Celular (WhatsApp) *</label><input id="f-tel" name="telefono" required inputmode="tel" pattern="[0-9 +]{9,15}" placeholder="987 654 321" value="${esc(guardado.telefono || '')}" autocomplete="tel"></div>
        <div class="campo"><label for="f-dni">DNI (para recoger) *</label><input id="f-dni" name="dni" required inputmode="numeric" pattern="[0-9]{8}" maxlength="8" placeholder="8 dígitos" value="${esc(guardado.dni || '')}"></div>
        <div class="campo"><label for="f-dep">Departamento *</label><select id="f-dep" name="departamento" required>${DEPARTAMENTOS.map(d => `<option ${d === (guardado.departamento || 'Lima') ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
        <div class="campo"><label for="f-prov">Provincia / ciudad *</label><input id="f-prov" name="provincia" required placeholder="Ej. Arequipa" value="${esc(guardado.provincia || '')}"></div>
        <div class="campo"><label for="f-dist">Distrito *</label><input id="f-dist" name="distrito" required placeholder="Ej. Cayma" value="${esc(guardado.distrito || '')}"></div>
        <input type="hidden" name="agencia" value="Shalom">
        <div class="campo"><label>Agencia</label><input value="Shalom (exclusivo)" disabled></div>
        <div class="campo full"><label for="f-sede">Agencia Shalom más cercana *</label><input id="f-sede" name="sede" required placeholder="Ej. Shalom Av. Ejército 123, Arequipa" value="${esc(guardado.sede || '')}"></div>
        <div class="campo"><label for="f-email">Correo (opcional)</label><input id="f-email" name="email" type="email" placeholder="tu@correo.com" value="${esc(guardado.email || '')}" autocomplete="email"></div>
        <div class="campo"><label for="f-muneca">Medida de muñeca</label><input id="f-muneca" name="muneca" placeholder="Ej. 18 cm (para ajustar)" value="${esc(muneca)}"></div>
        <div class="campo full"><label for="f-notas">Notas</label><textarea id="f-notas" name="notas" rows="2" placeholder="¿Es para regalo? ¿Alguna indicación?"></textarea></div>
        <label class="check"><input type="checkbox" name="marketing" ${guardado.marketing !== false ? 'checked' : ''}> Quiero recibir ofertas exclusivas por WhatsApp.</label>
        <label class="check"><input type="checkbox" name="acepto" required> Acepto que se registren mis datos para gestionar mi pedido.</label>
        <div class="msg error full" id="form-error" style="grid-column:1/-1"></div>
        <button class="btn btn-wsp btn-bloque" style="grid-column:1/-1" id="btn-enviar"><svg><use href="#i-wsp"/></svg>Registrar y separar por WhatsApp</button>
      </form>
      <aside class="resumen-pedido">
        <h4>Tu pedido</h4>
        ${ls.map(l => `<div class="linea-resumen"><span>${l.cantidad} × ${esc(l.producto.nombre)}</span><b>${soles(precio(l.producto) * l.cantidad)}</b></div>`).join('')}
        <div class="totales" style="margin-top:12px">
          ${t.descuentoBF ? `<div class="bf"><span>Ahorro Black Friday</span><span>-${soles(t.descuentoBF)}</span></div>` : ''}
          ${t.descuentoCupon ? `<div class="cup"><span>Cupón ${esc(estado.cupon.codigo)}</span><span>-${soles(t.descuentoCupon)}</span></div>` : ''}
          <div class="total"><span>Total</span><span>${soles(t.total)}</span></div>
          <div class="adelanto"><b>Separas hoy: ${soles(t.adelanto)}</b><br>Pagas al recoger: ${soles(t.saldo)}</div>
        </div>
        <p class="ayuda">📦 Enviamos todos los días a las ${CONFIG.horaEnvio} a tu agencia Shalom más cercana. El tiempo de llegada depende de Shalom y te compartimos el tracking para que lo recojas con tu DNI. El costo del envío se paga al recoger.</p>
      </aside>
    </div></div>`;
  $('#form-pedido').addEventListener('submit', enviarPedido);
  abrir($('#modal-checkout'));
}

async function enviarPedido(e) {
  e.preventDefault();
  const f = e.target;
  const err = $('#form-error');
  if (!f.checkValidity()) {
    const malo = f.querySelector(':invalid');
    err.textContent = malo?.name === 'acepto' ? 'Necesitamos tu autorización para registrar el pedido.' : `Revisa el campo "${malo?.closest('.campo')?.querySelector('label')?.textContent.replace(' *', '') || 'obligatorio'}".`;
    malo?.focus();
    return;
  }
  const d = Object.fromEntries(new FormData(f));
  const telefono = d.telefono.replace(/\D/g, '').replace(/^51(?=9\d{8}$)/, '');
  const cliente = { nombre: d.nombre.trim(), telefono, dni: d.dni, email: d.email || null, departamento: d.departamento, provincia: d.provincia, distrito: d.distrito, acepta_marketing: !!d.marketing };
  local.guardar('at_cliente', { ...cliente, agencia: d.agencia, sede: d.sede, marketing: !!d.marketing });
  const btn = $('#btn-enviar');
  btn.disabled = true; btn.textContent = 'Registrando pedido…';
  const lineas = lineasCarrito();
  try {
    const pedido = await crearPedido({
      cliente, lineas, cupon: estado.cupon,
      entrega: { agencia: d.agencia, sede: d.sede, departamento: d.departamento, provincia: d.provincia, distrito: d.distrito, muneca: d.muneca },
      notas: d.notas,
    });
    const url = mensajeWhatsApp(pedido, lineas);
    vaciar();
    $('#cupon-input').value = ''; $('#cupon-msg').textContent = '';
    $('#checkout-contenido').innerHTML = `<div class="exito">
      <div class="check-oro"><svg width="44" height="44"><use href="#i-check"/></svg></div>
      <span class="eyebrow">Pedido registrado</span>
      <h2 class="titulo">¡Ya casi es tuyo!</h2>
      <div class="codigo">${esc(pedido.codigo)}</div>
      <p>Envíanos el mensaje por WhatsApp para separar tu reloj con <b>${soles(pedido.adelanto)}</b>. Lo enviamos a las ${CONFIG.horaEnvio} a <b>Shalom ${esc(d.sede)}</b> y te compartimos el tracking. Saldo al recoger: <b>${soles(pedido.saldo)}</b>.</p>
      <a class="btn btn-wsp" href="${url}" target="_blank" rel="noopener" id="ir-wsp"><svg><use href="#i-wsp"/></svg>Enviar pedido por WhatsApp</a>
      ${modoDemo() ? '<p class="ayuda" style="margin-top:16px">Modo demo: este pedido quedó guardado en tu navegador. Míralo en <a href="admin.html" style="color:var(--oro)">el panel de administración</a>.</p>' : ''}
    </div>`;
  } catch (ex) {
    console.error(ex);
    err.textContent = 'No pudimos registrar el pedido. Inténtalo de nuevo o escríbenos por WhatsApp.';
    btn.disabled = false; btn.innerHTML = '<svg><use href="#i-wsp"/></svg>Registrar y separar por WhatsApp';
  }
}

const DEPARTAMENTOS = ['Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'];

// ═════════ FAQ ═════════
function pintarFAQ() {
  $('#faq-lista').innerHTML = FAQ.map((f, i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(f.pregunta)}</summary><p>${esc(f.respuesta)}</p></details>`).join('');
  $('#abrir-chat-2').addEventListener('click', () => abrirChat());
  $('#sugerencias-faq').addEventListener('click', e => { const b = e.target.closest('button'); if (b) abrirChat(b.textContent); });
}

// ═════════ Animación de aparición ═════════
function iniciarAparecer() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.aparecer').forEach(el => io.observe(el));
}

function iniciarTema() {
  const b = $('#btn-tema');
  const aplicar = (t) => {
    if (t === 'dark') document.documentElement.dataset.theme = 'dark'; else delete document.documentElement.dataset.theme;
    b.setAttribute('aria-label', t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    document.querySelector('meta[name=theme-color]').content = t === 'dark' ? '#0a0a0b' : '#ffffff';
  };
  aplicar(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  b.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    aplicar(t); local.guardar('at_tema', t);
    try { localStorage.setItem('at_tema', t); } catch { /* sin almacenamiento */ }
  });
}

window.__abrirCheckout = abrirCheckout;
export { abrirCheckout };
iniciar();
