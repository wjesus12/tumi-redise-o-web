// Capa de datos: Supabase si está configurado; si no, MODO DEMO (localStorage).
import { CONFIG, modoDemo, estadoBlackFriday } from './config.js';
import { PRODUCTOS, CUPONES, precioFinal } from './catalogo.js';

let _sb = null;
export async function supabase() {
  if (modoDemo()) return null;
  if (_sb) return _sb;
  if (!window.supabase) {
    await new Promise((ok, mal) => {
      const s = document.createElement('script');
      s.src = new URL('./vendor/supabase.min.js', import.meta.url).href;
      s.onload = ok; s.onerror = mal;
      document.head.appendChild(s);
    });
  }
  _sb = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  return _sb;
}

// ── Almacenamiento local seguro ──
export const local = {
  leer(clave, defecto) { try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : defecto; } catch { return defecto; } },
  guardar(clave, valor) { try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* sin almacenamiento */ } },
};

// ── Productos ──
export async function obtenerProductos() {
  const sb = await supabase().catch(() => null);
  if (sb) {
    const { data, error } = await sb.from('productos').select('*').eq('activo', true).order('orden');
    if (!error && data?.length) {
      const base = Object.fromEntries(PRODUCTOS.map(p => [p.id, p]));
      return data.map(r => ({ ...(base[r.id] || {}), ...r, specs: r.specs || base[r.id]?.specs, visual: r.visual || base[r.id]?.visual }));
    }
    console.warn('Supabase: usando catálogo local', error?.message);
  }
  const ajustes = local.leer('at_productos_admin', {}); // cambios hechos desde el panel en modo demo
  return PRODUCTOS.map(p => ({ ...p, ...(ajustes[p.id] || {}) })).filter(p => p.activo !== false);
}

// ── Totales (misma lógica que la función SQL crear_pedido) ──
export function calcularTotales(lineas, cupon) {
  const bf = estadoBlackFriday().activo;
  let regular = 0, subtotal = 0;
  lineas.forEach(({ producto, cantidad }) => {
    regular += producto.precio * cantidad;
    subtotal += precioFinal(producto, bf) * cantidad;
  });
  const descuentoBF = regular - subtotal;
  let descuentoCupon = 0;
  if (cupon && subtotal >= (cupon.minimo || 0)) descuentoCupon = Math.round(subtotal * cupon.porcentaje / 100);
  const total = Math.max(0, subtotal - descuentoCupon);
  const adelanto = total > 0 ? Math.min(CONFIG.adelanto, total) : 0;
  return { regular, descuentoBF, subtotal, descuentoCupon, total, adelanto, saldo: total - adelanto, bf };
}

// ── Cupones ──
export async function validarCupon(codigo, subtotal) {
  codigo = String(codigo || '').trim().toUpperCase();
  if (!codigo) return { valido: false, mensaje: 'Ingresa un código.' };
  const sb = await supabase().catch(() => null);
  if (sb) {
    const { data, error } = await sb.rpc('validar_cupon', { p_codigo: codigo, p_subtotal: subtotal });
    if (!error && data) return data;
  }
  const cupones = local.leer('at_cupones_admin', null) || CUPONES.map(c => ({ ...c, activo: true }));
  const c = cupones.find(x => x.codigo === codigo);
  if (!c || c.activo === false) return { valido: false, mensaje: 'Este cupón no existe o ya no está vigente.' };
  if (subtotal < c.minimo) return { valido: false, mensaje: `Este cupón aplica desde ${CONFIG.moneda} ${c.minimo}. Te faltan ${CONFIG.moneda} ${c.minimo - subtotal}.`, cupon: c };
  return { valido: true, codigo: c.codigo, porcentaje: c.porcentaje, minimo: c.minimo, mensaje: `¡Listo! ${c.porcentaje}% extra aplicado.` };
}

// ── Pedidos ──
function codigoPedido() {
  const n = (local.leer('at_contador', 1000) + 1);
  local.guardar('at_contador', n);
  return `AT-${n}`;
}

/**
 * @param {{cliente:object, lineas:Array, cupon:object|null, entrega:object, notas:string}} p
 */
export async function crearPedido(p) {
  const items = p.lineas.map(l => ({ id: l.producto.id, cantidad: l.cantidad }));
  const sb = await supabase().catch(() => null);
  if (sb) {
    const { data, error } = await sb.rpc('crear_pedido', {
      p_cliente: p.cliente, p_items: items, p_cupon: p.cupon?.codigo || null, p_entrega: p.entrega, p_notas: p.notas || '',
    });
    if (error) throw new Error(error.message);
    return data; // { codigo, total, adelanto, saldo, ... }
  }
  // MODO DEMO
  const t = calcularTotales(p.lineas, p.cupon);
  const ahora = new Date().toISOString();
  const clientes = local.leer('at_clientes', []);
  let cli = clientes.find(c => c.telefono === p.cliente.telefono);
  if (!cli) { cli = { id: crypto.randomUUID?.() || String(Date.now()), creado: ahora, etiquetas: [], notas: '', ...p.cliente }; clientes.push(cli); }
  else Object.assign(cli, p.cliente);
  local.guardar('at_clientes', clientes);

  const pedido = {
    codigo: codigoPedido(), creado: ahora, estado: 'nuevo', cliente_id: cli.id,
    cliente: { nombre: p.cliente.nombre, telefono: p.cliente.telefono },
    items: p.lineas.map(l => ({ id: l.producto.id, nombre: l.producto.nombre, cantidad: l.cantidad, precio_unit: precioFinal(l.producto, t.bf) })),
    cupon: p.cupon?.codigo || null, entrega: p.entrega, notas: p.notas || '',
    regular: t.regular, descuento_bf: t.descuentoBF, subtotal: t.subtotal, descuento_cupon: t.descuentoCupon,
    total: t.total, adelanto: t.adelanto, saldo: t.saldo,
  };
  const pedidos = local.leer('at_pedidos', []);
  pedidos.unshift(pedido);
  local.guardar('at_pedidos', pedidos);
  return pedido;
}

export function mensajeWhatsApp(pedido, lineas) {
  const L = [];
  L.push(`Hola AURUM TEMPO 👋 Quiero separar mi pedido *${pedido.codigo}*`);
  L.push('');
  lineas.forEach(l => L.push(`• ${l.cantidad} × ${l.producto.nombre} (${l.producto.linea})`));
  L.push('');
  if (pedido.descuento_bf > 0) L.push(`Black Friday: -${CONFIG.moneda} ${pedido.descuento_bf}`);
  if (pedido.cupon) L.push(`Cupón ${pedido.cupon}: -${CONFIG.moneda} ${pedido.descuento_cupon}`);
  L.push(`*Total: ${CONFIG.moneda} ${pedido.total}*`);
  L.push(`Separo con: ${CONFIG.moneda} ${pedido.adelanto} · Saldo al recoger: ${CONFIG.moneda} ${pedido.saldo}`);
  L.push('');
  const e = pedido.entrega || {};
  L.push(`📦 Agencia: ${e.agencia || '-'} · ${e.sede || ''}`);
  L.push(`📍 ${[e.distrito, e.provincia, e.departamento].filter(Boolean).join(', ')}`);
  if (e.muneca) L.push(`⌚ Muñeca: ${e.muneca}`);
  if (pedido.notas) L.push(`📝 ${pedido.notas}`);
  L.push('');
  L.push('¿Me envían los datos para el adelanto por Yape/Plin?');
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(L.join('\n'))}`;
}
