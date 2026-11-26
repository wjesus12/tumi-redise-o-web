// Panel de administración: pedidos, CRM de clientes, productos y cupones.
import { CONFIG, modoDemo, soles } from './config.js';
import { PRODUCTOS, CUPONES } from './catalogo.js';
import { supabase, local } from './datos.js';

const $ = (s, c = document) => c.querySelector(s);
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fecha = (f) => f ? new Date(f).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';
const ESTADOS = { nuevo: 'Nuevo', separado: 'Separado (pagó S/ 20)', enviado: 'Enviado', en_agencia: 'En agencia', entregado: 'Entregado', cancelado: 'Cancelado' };
const ETIQUETAS = ['VIP', 'Recurrente', 'Interesado', 'Regalo', 'Provincia'];
let sb = null;
let datos = { pedidos: [], clientes: [], productos: [], cupones: [] };
let pestana = 'resumen';
let busqueda = '';

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('visible'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('visible'), 2200); }

// ═════════ Acceso ═════════
async function iniciar() {
  if (modoDemo()) { await cargar(); return pintar(); }
  sb = await supabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return pintarLogin();
  const { data: esAdmin } = await sb.rpc('es_admin');
  if (!esAdmin) { $('#app').innerHTML = `<div class="login"><h2 class="titulo" style="font-size:36px">Sin permiso</h2><p style="color:var(--gris)">Tu usuario (${esc(session.user.email)}) no está registrado como administrador. Agrega su ID en la tabla <code>admins</code> (ver README).</p><button class="btn btn-borde" id="salir2" style="margin-top:14px">Cerrar sesión</button></div>`; $('#salir2').onclick = salir; return; }
  $('#usuario').textContent = session.user.email;
  $('#btn-salir').hidden = false; $('#btn-salir').onclick = salir;
  await cargar();
  pintar();
}
async function salir() { await sb.auth.signOut(); location.reload(); }

function pintarLogin() {
  $('#app').innerHTML = `<form class="login" id="f-login">
    <span class="eyebrow">Acceso administrador</span><h2 class="titulo" style="font-size:42px;margin:8px 0 18px">Iniciar sesión</h2>
    <div class="campo"><label for="l-email">Correo</label><input id="l-email" type="email" required autocomplete="username"></div>
    <div class="campo"><label for="l-pass">Contraseña</label><input id="l-pass" type="password" required autocomplete="current-password"></div>
    <div class="msg error" id="l-error"></div>
    <button class="btn btn-oro btn-bloque">Entrar</button></form>`;
  $('#f-login').onsubmit = async (e) => {
    e.preventDefault();
    const { error } = await sb.auth.signInWithPassword({ email: $('#l-email').value, password: $('#l-pass').value });
    if (error) { $('#l-error').textContent = 'Correo o contraseña incorrectos.'; return; }
    location.reload();
  };
}

// ═════════ Datos ═════════
async function cargar() {
  if (sb) {
    const [p, c, pr, cu] = await Promise.all([
      sb.from('pedidos').select('*, clientes(nombre, telefono)').order('creado', { ascending: false }).limit(1000),
      sb.from('vista_clientes').select('*').order('ultimo_pedido', { ascending: false, nullsFirst: false }),
      sb.from('productos').select('*').order('orden'),
      sb.from('cupones').select('*').order('porcentaje'),
    ]);
    datos.pedidos = (p.data || []).map(x => ({ ...x, cliente: x.clientes }));
    datos.clientes = c.data || [];
    datos.productos = pr.data || [];
    datos.cupones = cu.data || [];
    return;
  }
  datos.pedidos = local.leer('at_pedidos', []);
  const clientes = local.leer('at_clientes', []);
  datos.clientes = clientes.map(c => {
    const ps = datos.pedidos.filter(p => p.cliente_id === c.id && p.estado !== 'cancelado');
    return { ...c, pedidos: ps.length, total_comprado: ps.reduce((a, p) => a + p.total, 0), ultimo_pedido: ps[0]?.creado };
  });
  const aj = local.leer('at_productos_admin', {});
  datos.productos = PRODUCTOS.map(p => ({ ...p, activo: true, ...(aj[p.id] || {}) }));
  datos.cupones = local.leer('at_cupones_admin', null) || CUPONES.map(c => ({ ...c, activo: true, usos: datos.pedidos.filter(p => p.cupon === c.codigo).length }));
}

async function guardar(tabla, clave, id, cambios) {
  if (sb) {
    const { error } = await sb.from(tabla).update(cambios).eq(clave, id);
    if (error) { toast('Error: ' + error.message); return false; }
    toast('Guardado ✓'); return true;
  }
  if (tabla === 'pedidos') { const ps = local.leer('at_pedidos', []); Object.assign(ps.find(p => p.codigo === id) || {}, cambios); local.guardar('at_pedidos', ps); }
  if (tabla === 'clientes') { const cs = local.leer('at_clientes', []); Object.assign(cs.find(c => c.id === id) || {}, cambios); local.guardar('at_clientes', cs); }
  if (tabla === 'productos') { const aj = local.leer('at_productos_admin', {}); aj[id] = { ...(aj[id] || {}), ...cambios }; local.guardar('at_productos_admin', aj); }
  if (tabla === 'cupones') { const cs = datos.cupones; Object.assign(cs.find(c => c.codigo === id) || {}, cambios); local.guardar('at_cupones_admin', cs); }
  toast('Guardado ✓'); return true;
}

// ═════════ Vistas ═════════
function pintar() {
  const tabs = { resumen: 'Resumen', pedidos: `Pedidos (${datos.pedidos.length})`, clientes: `Clientes (${datos.clientes.length})`, productos: 'Productos', cupones: 'Cupones' };
  $('#app').innerHTML = `
    ${modoDemo() ? '<div class="aviso">🧪 <b>Modo demo:</b> estás viendo los pedidos hechos desde este navegador. Conecta Supabase en <code>js/config.js</code> para tener pedidos reales y acceso con contraseña.</div>' : ''}
    <div class="adm-tabs">${Object.entries(tabs).map(([k, v]) => `<button data-tab="${k}" class="${k === pestana ? 'activo' : ''}">${v}</button>`).join('')}
      <button class="mini-btn" id="recargar" style="margin-left:auto">↻ Actualizar</button></div>
    <div id="vista"></div>`;
  $('.adm-tabs').onclick = async (e) => {
    const b = e.target.closest('[data-tab]');
    if (b) { pestana = b.dataset.tab; busqueda = ''; pintar(); }
    if (e.target.id === 'recargar') { await cargar(); pintar(); toast('Datos actualizados'); }
  };
  ({ resumen, pedidos, clientes, productos, cupones })[pestana]();
}

function resumen() {
  const validos = datos.pedidos.filter(p => p.estado !== 'cancelado');
  const ventas = validos.reduce((a, p) => a + +p.total, 0);
  const porCobrar = validos.filter(p => !['entregado'].includes(p.estado)).reduce((a, p) => a + +p.saldo, 0);
  const hoy = new Date().toDateString();
  const deHoy = datos.pedidos.filter(p => new Date(p.creado).toDateString() === hoy).length;
  const top = {};
  validos.forEach(p => (p.items || []).forEach(i => { top[i.nombre] = (top[i.nombre] || 0) + i.cantidad; }));
  const topArr = Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = topArr[0]?.[1] || 1;
  const est = {};
  datos.pedidos.forEach(p => { est[p.estado] = (est[p.estado] || 0) + 1; });
  const cupUso = {};
  validos.forEach(p => { if (p.cupon) cupUso[p.cupon] = (cupUso[p.cupon] || 0) + 1; });
  const regiones = {};
  validos.forEach(p => { const d = p.entrega?.departamento || '—'; regiones[d] = (regiones[d] || 0) + 1; });
  $('#vista').innerHTML = `
    <div class="kpis">
      <div class="kpi"><small>Ventas (sin cancelados)</small><b>${soles(ventas)}</b><span>${validos.length} pedidos</span></div>
      <div class="kpi"><small>Pedidos hoy</small><b>${deHoy}</b><span>${est.nuevo || 0} por confirmar</span></div>
      <div class="kpi"><small>Ticket promedio</small><b>${soles(validos.length ? Math.round(ventas / validos.length) : 0)}</b><span>por pedido</span></div>
      <div class="kpi"><small>Saldo por cobrar</small><b>${soles(porCobrar)}</b><span>al recoger en agencia</span></div>
      <div class="kpi"><small>Clientes</small><b>${datos.clientes.length}</b><span>${datos.clientes.filter(c => c.pedidos > 1).length} recurrentes</span></div>
    </div>
    <div class="dos">
      <div class="kpi"><small>Relojes más pedidos</small>${topArr.length ? topArr.map(([n, c]) => `<div class="barra-h"><span style="flex:0 0 46%">${esc(n)}</span><div class="b" style="width:${c / max * 45}%"></div><b>${c}</b></div>`).join('') : '<p class="sub" style="margin-top:8px">Aún no hay pedidos.</p>'}</div>
      <div class="kpi"><small>Pedidos por estado</small>${Object.entries(ESTADOS).map(([k, v]) => `<div class="barra-h"><span class="est est-${k}" style="flex:0 0 46%">${v}</span><b>${est[k] || 0}</b></div>`).join('')}</div>
      <div class="kpi"><small>Uso de cupones</small>${Object.keys(cupUso).length ? Object.entries(cupUso).map(([k, v]) => `<div class="barra-h"><span style="flex:0 0 46%">${esc(k)}</span><b>${v}</b></div>`).join('') : '<p class="sub" style="margin-top:8px">Sin cupones usados aún.</p>'}</div>
      <div class="kpi"><small>Pedidos por departamento</small>${Object.keys(regiones).length ? Object.entries(regiones).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="barra-h"><span style="flex:0 0 46%">${esc(k)}</span><b>${v}</b></div>`).join('') : '<p class="sub" style="margin-top:8px">Sin datos.</p>'}</div>
    </div>`;
}

function wspCliente(tel, texto) {
  const t = String(tel || '').replace(/\D/g, '');
  return `https://wa.me/${t.length === 9 ? '51' + t : t}?text=${encodeURIComponent(texto)}`;
}

function pedidos() {
  const q = busqueda.toLowerCase();
  const lista = datos.pedidos.filter(p => !q || [p.codigo, p.cliente?.nombre, p.cliente?.telefono, p.estado, p.entrega?.agencia].join(' ').toLowerCase().includes(q));
  $('#vista').innerHTML = `
    <div class="herr"><input class="inp" id="buscar" placeholder="Buscar por código, cliente, teléfono, agencia…" value="${esc(busqueda)}"><button class="mini-btn" id="csv">⬇ Exportar CSV</button></div>
    <div class="tabla-wrap"><table>
      <thead><tr><th>Pedido</th><th>Cliente</th><th>Relojes</th><th>Total</th><th>Entrega</th><th style="width:170px">Estado</th><th></th></tr></thead>
      <tbody>${lista.map(p => `<tr>
        <td><b>${esc(p.codigo)}</b><div class="sub">${fecha(p.creado)}</div></td>
        <td>${esc(p.cliente?.nombre)}<div class="sub">${esc(p.cliente?.telefono)}</div></td>
        <td>${(p.items || []).map(i => `${i.cantidad}× ${esc(i.nombre)}`).join('<br>')}${p.notas ? `<div class="sub">📝 ${esc(p.notas)}</div>` : ''}</td>
        <td><b>${soles(p.total)}</b><div class="sub">${p.cupon ? `Cupón ${esc(p.cupon)} · ` : ''}Adelanto ${soles(p.adelanto)} · Saldo ${soles(p.saldo)}</div></td>
        <td>${esc(p.entrega?.agencia)}<div class="sub">${esc([p.entrega?.sede, p.entrega?.distrito, p.entrega?.provincia, p.entrega?.departamento].filter(Boolean).join(', '))}${p.entrega?.muneca ? ` · ⌚ ${esc(p.entrega.muneca)}` : ''}</div></td>
        <td><select class="sel-estado" data-codigo="${esc(p.codigo)}" data-id="${esc(p.id || p.codigo)}">${Object.entries(ESTADOS).map(([k, v]) => `<option value="${k}" ${k === p.estado ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
        <td><a class="mini-btn wsp" target="_blank" rel="noopener" href="${wspCliente(p.cliente?.telefono, `Hola ${p.cliente?.nombre?.split(' ')[0] || ''}, te escribimos de ${CONFIG.tienda} por tu pedido ${p.codigo}. `)}">WhatsApp</a></td>
      </tr>`).join('') || '<tr><td colspan="7" class="sub" style="text-align:center;padding:30px">Sin pedidos todavía. Haz uno de prueba desde la tienda.</td></tr>'}</tbody>
    </table></div>`;
  $('#buscar').oninput = (e) => { busqueda = e.target.value; const pos = e.target.selectionStart; pedidos(); const i = $('#buscar'); i.focus(); i.setSelectionRange(pos, pos); };
  $('#vista').onchange = async (e) => {
    const s = e.target.closest('.sel-estado'); if (!s) return;
    const ok = sb ? await guardar('pedidos', 'id', s.dataset.id, { estado: s.value }) : await guardar('pedidos', 'codigo', s.dataset.codigo, { estado: s.value });
    if (ok) { const p = datos.pedidos.find(x => x.codigo === s.dataset.codigo); if (p) p.estado = s.value; }
  };
  $('#csv').onclick = () => csv('pedidos', ['codigo', 'fecha', 'cliente', 'telefono', 'relojes', 'cupon', 'total', 'adelanto', 'saldo', 'agencia', 'destino', 'estado'],
    lista.map(p => [p.codigo, p.creado, p.cliente?.nombre, p.cliente?.telefono, (p.items || []).map(i => `${i.cantidad}x ${i.nombre}`).join(' | '), p.cupon, p.total, p.adelanto, p.saldo, p.entrega?.agencia, [p.entrega?.distrito, p.entrega?.provincia, p.entrega?.departamento].filter(Boolean).join(', '), p.estado]));
}

function clientes() {
  const q = busqueda.toLowerCase();
  const lista = datos.clientes.filter(c => !q || [c.nombre, c.telefono, c.provincia, c.departamento, (c.etiquetas || []).join(' ')].join(' ').toLowerCase().includes(q));
  $('#vista').innerHTML = `
    <div class="herr"><input class="inp" id="buscar" placeholder="Buscar cliente, ciudad o etiqueta…" value="${esc(busqueda)}"><button class="mini-btn" id="csv">⬇ Exportar CSV</button></div>
    <div class="tabla-wrap"><table>
      <thead><tr><th>Cliente</th><th>Ubicación</th><th>Compras</th><th>Etiquetas</th><th style="width:26%">Notas</th><th></th></tr></thead>
      <tbody>${lista.map(c => `<tr data-id="${esc(c.id)}">
        <td><b>${esc(c.nombre)}</b><div class="sub">${esc(c.telefono)}${c.email ? ' · ' + esc(c.email) : ''}${c.dni ? ' · DNI ' + esc(c.dni) : ''}</div><div class="sub">Desde ${fecha(c.creado)}${c.acepta_marketing ? ' · ✉ acepta ofertas' : ''}</div></td>
        <td>${esc([c.distrito, c.provincia, c.departamento].filter(Boolean).join(', '))}</td>
        <td><b>${soles(c.total_comprado)}</b><div class="sub">${c.pedidos || 0} pedido(s) · último ${fecha(c.ultimo_pedido)}</div></td>
        <td>${ETIQUETAS.map(t => `<label style="display:inline-flex;gap:4px;align-items:center;margin:0 8px 4px 0;font-size:12px"><input type="checkbox" data-etq="${t}" ${(c.etiquetas || []).includes(t) ? 'checked' : ''}>${t}</label>`).join('')}</td>
        <td><textarea class="inp" rows="2" data-notas placeholder="Gustos, talla de muñeca, fechas especiales…">${esc(c.notas)}</textarea></td>
        <td><a class="mini-btn wsp" target="_blank" rel="noopener" href="${wspCliente(c.telefono, `Hola ${c.nombre?.split(' ')[0] || ''} 👋 te escribimos de ${CONFIG.tienda}. `)}">WhatsApp</a></td>
      </tr>`).join('') || '<tr><td colspan="6" class="sub" style="text-align:center;padding:30px">Aún no hay clientes.</td></tr>'}</tbody>
    </table></div>`;
  $('#buscar').oninput = (e) => { busqueda = e.target.value; const pos = e.target.selectionStart; clientes(); const i = $('#buscar'); i.focus(); i.setSelectionRange(pos, pos); };
  $('#vista').onchange = async (e) => {
    const fila = e.target.closest('tr[data-id]'); if (!fila) return;
    const c = datos.clientes.find(x => String(x.id) === fila.dataset.id);
    if (e.target.matches('[data-etq]')) {
      c.etiquetas = [...fila.querySelectorAll('[data-etq]:checked')].map(x => x.dataset.etq);
      await guardar('clientes', 'id', c.id, { etiquetas: c.etiquetas });
    }
    if (e.target.matches('[data-notas]')) { c.notas = e.target.value; await guardar('clientes', 'id', c.id, { notas: c.notas }); }
  };
  $('#csv').onclick = () => csv('clientes', ['nombre', 'telefono', 'email', 'dni', 'departamento', 'provincia', 'distrito', 'pedidos', 'total', 'etiquetas', 'acepta_ofertas', 'notas'],
    lista.map(c => [c.nombre, c.telefono, c.email, c.dni, c.departamento, c.provincia, c.distrito, c.pedidos, c.total_comprado, (c.etiquetas || []).join(' '), c.acepta_marketing ? 'sí' : 'no', c.notas]));
}

function productos() {
  $('#vista').innerHTML = `
    <p class="sub" style="color:var(--gris);margin-bottom:10px">Edita precio regular, % de Black Friday, URL de la foto oficial y visibilidad. ${modoDemo() ? 'En modo demo los cambios se guardan solo en este navegador.' : ''}</p>
    <div class="tabla-wrap"><table>
      <thead><tr><th>Reloj</th><th style="width:110px">Precio S/</th><th style="width:90px">BF %</th><th>Precio BF</th><th style="width:30%">URL foto oficial</th><th>Visible</th></tr></thead>
      <tbody>${datos.productos.map(p => `<tr data-id="${esc(p.id)}">
        <td><b>${esc(p.nombre)}</b><div class="sub">${esc(p.linea)} · ${esc(p.categoria)} · ${p.visual?.tam || ''} mm</div></td>
        <td><input class="inp" type="number" min="1" data-campo="precio" value="${p.precio}"></td>
        <td><input class="inp" type="number" min="0" max="90" data-campo="bf" value="${p.bf || 0}"></td>
        <td>${soles(Math.round(p.precio * (1 - (p.bf || 0) / 100)))}</td>
        <td><input class="inp" type="url" data-campo="imagen" placeholder="https://…" value="${esc(p.imagen || '')}"></td>
        <td><input type="checkbox" data-campo="activo" ${p.activo !== false ? 'checked' : ''}></td>
      </tr>`).join('')}</tbody></table></div>`;
  $('#vista').onchange = async (e) => {
    const fila = e.target.closest('tr[data-id]'); const campo = e.target.dataset.campo; if (!fila || !campo) return;
    const v = campo === 'activo' ? e.target.checked : (e.target.type === 'number' ? +e.target.value : e.target.value.trim());
    const p = datos.productos.find(x => x.id === fila.dataset.id); p[campo] = v;
    await guardar('productos', 'id', p.id, { [campo]: v });
    if (campo !== 'imagen') productos();
  };
}

function cupones() {
  $('#vista').innerHTML = `
    <div class="tabla-wrap" style="margin-bottom:16px"><table>
      <thead><tr><th>Código</th><th>Descuento</th><th>Compra mínima</th><th>Usos</th><th>Activo</th></tr></thead>
      <tbody>${datos.cupones.map(c => `<tr data-id="${esc(c.codigo)}"><td><b>${esc(c.codigo)}</b><div class="sub">${esc(c.descripcion)}</div></td><td>${c.porcentaje}% extra</td><td>${soles(c.minimo)}</td><td>${c.usos || 0}${c.max_usos ? ' / ' + c.max_usos : ''}</td><td><input type="checkbox" data-activo ${c.activo !== false ? 'checked' : ''}></td></tr>`).join('')}</tbody>
    </table></div>
    <form class="kpi" id="f-cupon" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;align-items:end">
      <small style="grid-column:1/-1">Nuevo cupón</small>
      <input class="inp" name="codigo" placeholder="CODIGO" required pattern="[A-Za-z0-9]{3,20}">
      <input class="inp" name="porcentaje" type="number" min="1" max="90" placeholder="% descuento" required>
      <input class="inp" name="minimo" type="number" min="0" placeholder="Compra mínima S/" value="0">
      <input class="inp" name="max_usos" type="number" min="1" placeholder="Máx. usos (opcional)">
      <button class="btn btn-oro" style="padding:10px">Crear</button>
    </form>`;
  $('#vista').onchange = async (e) => {
    const fila = e.target.closest('tr[data-id]'); if (!fila || !e.target.matches('[data-activo]')) return;
    const c = datos.cupones.find(x => x.codigo === fila.dataset.id); c.activo = e.target.checked;
    await guardar('cupones', 'codigo', c.codigo, { activo: c.activo });
  };
  $('#f-cupon').onsubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const nuevo = { codigo: d.codigo.toUpperCase(), porcentaje: +d.porcentaje, minimo: +d.minimo || 0, max_usos: d.max_usos ? +d.max_usos : null, descripcion: `${d.porcentaje}% extra`, activo: true, usos: 0 };
    if (sb) { const { error } = await sb.from('cupones').insert(nuevo); if (error) return toast('Error: ' + error.message); }
    else { datos.cupones.push(nuevo); local.guardar('at_cupones_admin', datos.cupones); }
    if (sb) await cargar();
    toast(`Cupón ${nuevo.codigo} creado`); cupones();
  };
}

function csv(nombre, cab, filas) {
  const c = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const texto = '﻿' + [cab, ...filas].map(f => f.map(c).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([texto], { type: 'text/csv;charset=utf-8' }));
  a.download = `${nombre}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

iniciar();
