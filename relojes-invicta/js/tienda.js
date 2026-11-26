// Estado compartido de la tienda: productos, carrito, favoritos y utilidades de UI.
import { relojSVG } from './reloj-svg.js';
import { local } from './datos.js';
import { estadoBlackFriday, soles } from './config.js';
import { precioFinal } from './catalogo.js';

export const estado = {
  productos: [],
  carrito: local.leer('at_carrito', []), // [{id, cantidad}]
  favoritos: local.leer('at_favs', []),
  cupon: null,
  muneca: { modo: 'estandar', cm: 17.5 },
};

const oyentes = new Set();
export const alCambiar = (fn) => oyentes.add(fn);
const avisar = () => { local.guardar('at_carrito', estado.carrito); local.guardar('at_favs', estado.favoritos); oyentes.forEach(fn => fn()); };

export const $ = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => [...c.querySelectorAll(s)];
export const esc = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const producto = (id) => estado.productos.find(p => p.id === id);
export const bfActivo = () => estadoBlackFriday().activo;
export const precio = (p) => precioFinal(p, bfActivo());

// Foto oficial si existe; si no, reloj dibujado en SVG (siempre en hora real)
export function media(p, o = {}) {
  if (p.imagen && !o.forzarSVG) {
    return `<img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:window.__svgReloj('${esc(p.id)}')}).firstChild)">`;
  }
  return relojSVG(p.visual, { etiqueta: p.linea, mov: p.movimiento, alt: p.nombre, conCorrea: o.conCorrea });
}
window.__svgReloj = (id) => { const p = producto(id); return p ? relojSVG(p.visual, { etiqueta: p.linea, mov: p.movimiento, alt: p.nombre }) : ''; };

export function preciosHTML(p) {
  const final = precio(p);
  const hay = final < p.precio;
  return `<span class="precio">${soles(final)}</span>${hay ? `<span class="precio-antes">${soles(p.precio)}</span><span class="ahorro">Ahorras ${soles(p.precio - final)}</span>` : ''}`;
}

// ── Carrito ──
export function agregar(id, cantidad = 1) {
  const l = estado.carrito.find(x => x.id === id);
  if (l) l.cantidad = Math.min(5, l.cantidad + cantidad); else estado.carrito.push({ id, cantidad });
  avisar();
  const p = producto(id);
  toast(`✓ ${p?.nombre || 'Reloj'} agregado al carrito`);
}
export function cambiarCantidad(id, delta) {
  const l = estado.carrito.find(x => x.id === id);
  if (!l) return;
  l.cantidad += delta;
  if (l.cantidad <= 0) estado.carrito = estado.carrito.filter(x => x.id !== id);
  avisar();
}
export function quitar(id) { estado.carrito = estado.carrito.filter(x => x.id !== id); avisar(); }
export function vaciar() { estado.carrito = []; estado.cupon = null; avisar(); }
export const lineasCarrito = () => estado.carrito.map(l => ({ producto: producto(l.id), cantidad: l.cantidad })).filter(l => l.producto);
export const cantidadCarrito = () => estado.carrito.reduce((a, l) => a + l.cantidad, 0);

export function alternarFavorito(id) {
  const i = estado.favoritos.indexOf(id);
  if (i >= 0) estado.favoritos.splice(i, 1); else { estado.favoritos.push(id); toast('♥ Guardado en favoritos'); }
  avisar();
}
export const refrescar = avisar;

// ── Toast ──
let tt;
export function toast(texto) {
  const t = $('#toast');
  t.textContent = texto;
  t.classList.add('visible');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('visible'), 2600);
}

// ── Paneles / modales ──
let abierto = null;
export function abrir(el) {
  cerrar();
  abierto = el;
  el.classList.add('visible');
  el.setAttribute('aria-hidden', 'false');
  $('#velo').classList.add('visible');
  document.body.classList.add('bloqueado');
  setTimeout(() => el.querySelector('[data-cerrar], input, button')?.focus(), 50);
}
export function cerrar() {
  if (!abierto) return;
  abierto.classList.remove('visible');
  abierto.setAttribute('aria-hidden', 'true');
  abierto = null;
  $('#velo').classList.remove('visible');
  document.body.classList.remove('bloqueado');
}
