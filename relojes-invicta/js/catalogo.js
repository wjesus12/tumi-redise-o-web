// ─────────────────────────────────────────────────────────────
//  CATÁLOGO — 30 modelos (24 deportivos · 6 formales)
//  Datos, fotos y precios tomados de invicta.com.pe (ver js/productos.js).
//  - precio: precio regular en soles
//  - bf: % de descuento automático de Black Friday
//  - imagen: URL de la foto oficial (si está vacía se dibuja el reloj en SVG)
// ─────────────────────────────────────────────────────────────

import { PRODUCTOS_OFICIALES } from './productos.js';

const MAT = { oro: 'acero con baño de oro', acero: 'acero inoxidable', negro: 'acero con IP negro', rosa: 'acero con baño oro rosa' };
const CORREA = { brazalete: 'Brazalete de acero', cuero: 'Cuero genuino', silicona: 'Silicona deportiva' };

function m(p) {
  const v = p.visual;
  return {
    imagen: '',
    imagenes: [],
    ref: '',
    stock: 5,
    etiquetas: [],
    ...p,
    specs: {
      Caja: `${v.tam} mm · ${MAT[v.caja]}`,
      Movimiento: p.movimiento === 'Automático' ? 'Automático (sin pila)' : (v.crono ? 'Cronógrafo de cuarzo' : 'Cuarzo japonés'),
      Cristal: p.cristal || 'Mineral Flame Fusion',
      'Resistencia al agua': p.agua || (v.bisel === 'buceo' ? '200 m' : '100 m'),
      Correa: v.correa === 'brazalete' && v.caja === 'oro' ? 'Brazalete con baño de oro' : CORREA[v.correa],
      ...(p.specsExtra || {}),
    },
  };
}

export const PRODUCTOS = PRODUCTOS_OFICIALES.map(m);

export const LINEAS = ['Pro Diver', 'Bolt', 'Speedway', 'Racing', 'Specialty', 'Vintage'];

// Precio final con Black Friday (si la campaña está activa)
export const precioFinal = (p, bfActivo) => bfActivo && p.bf ? Math.round(p.precio * (1 - p.bf / 100)) : p.precio;

// Cupones (acumulables con Black Friday). En Supabase se validan en el servidor.
export const CUPONES = [
  { codigo: 'BIENVENIDA10', porcentaje: 10, minimo: 0, descripcion: '10% extra en tu primera compra' },
  { codigo: 'TIEMPO15', porcentaje: 15, minimo: 600, descripcion: '15% extra desde S/ 600' },
  { codigo: 'LUJO20', porcentaje: 20, minimo: 1000, descripcion: '20% extra desde S/ 1,000' },
];

// Outfits del Probador
export const OUTFITS = [
  { id: 'formal', nombre: 'Formal', frase: 'Traje oscuro, decisiones grandes.', manga: '#1a1f2b', detalle: 'liso', puno: '#f6f6f4', gemelo: true, fondo: ['#0b0f18', '#1f2a40'], tip: 'Esferas limpias y cuero o brazalete dorado. Caja de 40–42 mm para que entre bajo el puño.' },
  { id: 'deportivo', nombre: 'Deportivo', frase: 'Rendimiento con actitud.', manga: '#121316', detalle: 'tecnico', puno: null, gemelo: false, fondo: ['#07090c', '#162536'], tip: 'Cronógrafos y silicona: resistentes, legibles y con carácter.' },
  { id: 'elegante', nombre: 'Elegante', frase: 'Cuando la noche te busca a ti.', manga: '#070707', detalle: 'satin', puno: '#ffffff', gemelo: true, fondo: ['#050505', '#2b2210'], tip: 'Oro sobre negro: el reloj se vuelve la joya principal del look.' },
  { id: 'semiformal', nombre: 'Semiformal', frase: 'Blazer, sin corbata, sin dudas.', manga: '#3a4256', detalle: 'tweed', puno: '#dfe6ee', gemelo: false, fondo: ['#0e1420', '#2a3550'], tip: 'Buceadores en acero o dos tonos: equilibran lo serio con lo relajado.' },
  { id: 'casual', nombre: 'Casual', frase: 'Fin de semana, estilo de semana completa.', manga: '#2c3e57', detalle: 'denim', puno: null, gemelo: false, fondo: ['#11161d', '#3a3f47'], tip: 'Esferas de color (azul, verde, rojo) sobre denim y algodón.' },
  { id: 'aventura', nombre: 'Aventura', frase: 'Sin señal, sin límites.', manga: '#4a4b33', detalle: 'tecnico', puno: null, gemelo: false, fondo: ['#0c120c', '#2f3a26'], tip: 'Buceadores automáticos y silicona: no necesitan pila ni cuidados.' },
];

// Tonos de piel (6)
export const TONOS_PIEL = [
  { id: 'muy-claro', nombre: 'Muy claro', base: '#f3d7c3', sombra: '#d9b199' },
  { id: 'claro', nombre: 'Claro', base: '#e8bf9f', sombra: '#c99777' },
  { id: 'medio', nombre: 'Medio', base: '#c99a72', sombra: '#a67652' },
  { id: 'trigueno', nombre: 'Trigueño', base: '#a8774f', sombra: '#835936' },
  { id: 'moreno', nombre: 'Moreno', base: '#7d5333', sombra: '#5e3b22' },
  { id: 'oscuro', nombre: 'Oscuro', base: '#4f3220', sombra: '#352015' },
];
