// ─────────────────────────────────────────────────────────────
//  CATÁLOGO — 30 modelos (24 deportivos · 6 formales)
//  Precios, referencias y fotos son REFERENCIALES mientras se sincronizan
//  con la ficha oficial (ver README → "Sincronizar con invicta.com.pe").
//  - precio: precio regular en soles
//  - bf: % de descuento automático de Black Friday
//  - imagen: URL de la foto oficial (si está vacía se dibuja el reloj en SVG)
// ─────────────────────────────────────────────────────────────

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

export const PRODUCTOS = [
  // ── PRO DIVER (8) ──
  m({ id: 'pro-diver-gold-noir', nombre: 'Pro Diver Gold Noir', linea: 'Pro Diver', categoria: 'deportivo', movimiento: 'Automático', precio: 590, bf: 25, etiquetas: ['mas-vendido'],
      descripcion: 'El buceador que hizo leyenda. Oro y negro, bisel giratorio y presencia absoluta: el reloj que todos reconocen.',
      outfits: ['elegante', 'semiformal', 'casual'], visual: { caja: 'oro', esfera: '#0d0d10', bisel: 'buceo', biselColor: '#111', indices: 'oro', correa: 'brazalete', crono: false, tam: 40 } }),
  m({ id: 'pro-diver-ocean-blue', nombre: 'Pro Diver Ocean Blue', linea: 'Pro Diver', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 399, bf: 20, etiquetas: ['mas-vendido'],
      descripcion: 'Azul profundo con efecto rayos de sol sobre acero pulido. Combina con todo, del gimnasio a la oficina.',
      outfits: ['casual', 'deportivo', 'semiformal'], visual: { caja: 'acero', esfera: '#123a7a', bisel: 'buceo', biselColor: '#0f2d63', indices: 'acero', correa: 'brazalete', crono: false, tam: 40 } }),
  m({ id: 'pro-diver-jungle', nombre: 'Pro Diver Jungle Green', linea: 'Pro Diver', categoria: 'deportivo', movimiento: 'Automático', precio: 549, bf: 30,
      descripcion: 'Verde oliva y acero: el buceador para quien no sigue tendencias, las inicia.',
      outfits: ['aventura', 'casual', 'deportivo'], visual: { caja: 'acero', esfera: '#2f4a2a', bisel: 'buceo', biselColor: '#253d22', indices: 'acero', correa: 'brazalete', crono: false, tam: 40 } }),
  m({ id: 'pro-diver-steel-44', nombre: 'Pro Diver Steel 44', linea: 'Pro Diver', categoria: 'deportivo', movimiento: 'Automático', precio: 349, bf: 15,
      descripcion: 'Formato grande de 44 mm, esfera negra y lectura nítida. La puerta de entrada al mundo automático.',
      outfits: ['deportivo', 'casual', 'aventura'], visual: { caja: 'acero', esfera: '#111316', bisel: 'buceo', biselColor: '#15171a', indices: 'acero', correa: 'brazalete', crono: false, tam: 44 } }),
  m({ id: 'pro-diver-two-tone', nombre: 'Pro Diver Two-Tone Blue', linea: 'Pro Diver', categoria: 'deportivo', movimiento: 'Automático', precio: 629, bf: 25, etiquetas: ['ultimas'],
      descripcion: 'Oro y azul en equilibrio perfecto. Deportivo de día, protagonista de noche.',
      outfits: ['elegante', 'semiformal', 'casual'], visual: { caja: 'oro', esfera: '#16357a', bisel: 'buceo', biselColor: '#132c66', indices: 'oro', correa: 'brazalete', crono: false, tam: 40 } }),
  m({ id: 'pro-diver-red-shark', nombre: 'Pro Diver Red Shark', linea: 'Pro Diver', categoria: 'deportivo', movimiento: 'Automático', precio: 429, bf: 20,
      descripcion: 'Rojo intenso en esfera y bisel. Para el que llega y se nota.',
      outfits: ['casual', 'deportivo'], visual: { caja: 'acero', esfera: '#8b1520', bisel: 'buceo', biselColor: '#6d0f19', indices: 'acero', correa: 'brazalete', crono: false, tam: 43 } }),
  m({ id: 'pro-diver-chrono-navy', nombre: 'Pro Diver Chrono Navy', linea: 'Pro Diver', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 499, bf: 35,
      descripcion: 'Cronógrafo de buceo en azul navy con subesferas: precisión y carácter en 45 mm.',
      outfits: ['deportivo', 'casual', 'aventura'], visual: { caja: 'acero', esfera: '#0f2347', bisel: 'buceo', biselColor: '#0c1d3b', indices: 'acero', correa: 'brazalete', crono: true, tam: 45 } }),
  m({ id: 'pro-diver-stealth', nombre: 'Pro Diver Stealth Black', linea: 'Pro Diver', categoria: 'deportivo', movimiento: 'Automático', precio: 699, bf: 30,
      descripcion: 'Todo negro con índices dorados. Discreto, táctico y absolutamente premium.',
      outfits: ['elegante', 'casual', 'deportivo'], visual: { caja: 'negro', esfera: '#0a0a0b', bisel: 'buceo', biselColor: '#0a0a0b', indices: 'oro', correa: 'brazalete', crono: false, tam: 42 } }),

  // ── BOLT (5) ──
  m({ id: 'bolt-gold-chrono', nombre: 'Bolt Gold Chronograph', linea: 'Bolt', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 899, bf: 30, etiquetas: ['mas-vendido'],
      descripcion: 'El icónico cable trenzado de la línea Bolt sobre oro y negro. Una escultura en tu muñeca.',
      outfits: ['elegante', 'semiformal'], visual: { caja: 'oro', esfera: '#0e0e10', bisel: 'cable', biselColor: '#caa24a', indices: 'oro', correa: 'brazalete', crono: true, tam: 48 } }),
  m({ id: 'bolt-steel-blue', nombre: 'Bolt Steel Blue', linea: 'Bolt', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 749, bf: 25,
      descripcion: 'Acero y azul con el cable Bolt: fuerza industrial con acabado de joyería.',
      outfits: ['semiformal', 'casual'], visual: { caja: 'acero', esfera: '#163e86', bisel: 'cable', biselColor: '#c9ced4', indices: 'acero', correa: 'brazalete', crono: true, tam: 48 } }),
  m({ id: 'bolt-black-venom', nombre: 'Bolt Black Red', linea: 'Bolt', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 799, bf: 40, etiquetas: ['ultimas'],
      descripcion: 'Negro total con acentos rojos. Agresivo, técnico, imposible de ignorar.',
      outfits: ['deportivo', 'casual'], visual: { caja: 'negro', esfera: '#0b0b0c', bisel: 'cable', biselColor: '#26262a', indices: 'rojo', correa: 'brazalete', crono: true, tam: 46 } }),
  m({ id: 'bolt-sport-navy', nombre: 'Bolt Sport Navy', linea: 'Bolt', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 549, bf: 20,
      descripcion: 'Correa de silicona navy y cable Bolt en acero: el Bolt para entrenar y salir.',
      outfits: ['deportivo', 'aventura', 'casual'], visual: { caja: 'acero', esfera: '#0f2347', bisel: 'cable', biselColor: '#c9ced4', indices: 'acero', correa: 'silicona', correaColor: '#13254a', crono: true, tam: 46 } }),
  m({ id: 'bolt-bronze', nombre: 'Bolt Bronze Noir', linea: 'Bolt', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 849, bf: 25,
      descripcion: 'Tono bronce cálido con esfera negra. Madurez y estilo sin esfuerzo.',
      outfits: ['elegante', 'semiformal', 'casual'], visual: { caja: 'rosa', esfera: '#0e0e10', bisel: 'cable', biselColor: '#a8705c', indices: 'rosa', correa: 'brazalete', crono: true, tam: 47 } }),

  // ── SPEEDWAY (5) ──
  m({ id: 'speedway-noir', nombre: 'Speedway Noir', linea: 'Speedway', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 459, bf: 25, etiquetas: ['mas-vendido'],
      descripcion: 'Inspirado en las pistas: cronógrafo con taquímetro y subesferas. Para quien vive a otra velocidad.',
      outfits: ['deportivo', 'casual', 'semiformal'], visual: { caja: 'acero', esfera: '#111114', bisel: 'taquimetro', biselColor: '#0b0b0d', indices: 'acero', correa: 'brazalete', crono: true, tam: 44 } }),
  m({ id: 'speedway-gold', nombre: 'Speedway Gold Racer', linea: 'Speedway', categoria: 'deportivo', movimiento: 'Automático', precio: 559, bf: 30,
      descripcion: 'Taquímetro negro sobre oro: el cronógrafo de pista con alma de gala.',
      outfits: ['elegante', 'semiformal'], visual: { caja: 'oro', esfera: '#0e0e10', bisel: 'taquimetro', biselColor: '#0b0b0d', indices: 'oro', correa: 'brazalete', crono: true, tam: 44 } }),
  m({ id: 'speedway-blue', nombre: 'Speedway Blue Lap', linea: 'Speedway', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 459, bf: 20,
      descripcion: 'Azul eléctrico y acero, la combinación más versátil de la línea Speedway.',
      outfits: ['casual', 'semiformal', 'deportivo'], visual: { caja: 'acero', esfera: '#1a4fa8', bisel: 'taquimetro', biselColor: '#0d1f45', indices: 'acero', correa: 'brazalete', crono: true, tam: 44 } }),
  m({ id: 'speedway-silver', nombre: 'Speedway Silver', linea: 'Speedway', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 429, bf: 15,
      descripcion: 'Esfera plateada y subesferas negras estilo "panda": un clásico del automovilismo.',
      outfits: ['semiformal', 'casual'], visual: { caja: 'acero', esfera: '#d9dde2', bisel: 'taquimetro', biselColor: '#111', indices: 'acero', correa: 'brazalete', crono: true, tam: 44 } }),
  m({ id: 'speedway-black-ip', nombre: 'Speedway Black Fire', linea: 'Speedway', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 529, bf: 35, etiquetas: ['ultimas'],
      descripcion: 'Caja negra de 48 mm con detalles rojos: velocidad en estado puro.',
      outfits: ['deportivo', 'casual'], visual: { caja: 'negro', esfera: '#0a0a0b', bisel: 'taquimetro', biselColor: '#0a0a0b', indices: 'rojo', correa: 'brazalete', crono: true, tam: 48 } }),

  // ── RACING (3) ──
  m({ id: 'racing-red-line', nombre: 'Racing Red Line', linea: 'Racing', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 499, bf: 30,
      descripcion: 'Silicona roja, caja negra y cronógrafo: el espíritu del circuito en tu muñeca.',
      outfits: ['deportivo', 'casual'], visual: { caja: 'negro', esfera: '#111', bisel: 'taquimetro', biselColor: '#8e1220', indices: 'rojo', correa: 'silicona', correaColor: '#9b1422', crono: true, tam: 47 } }),
  m({ id: 'racing-carbon', nombre: 'Racing Carbon Grey', linea: 'Racing', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 449, bf: 20,
      descripcion: 'Gris grafito y negro mate. Liviano, resistente y hecho para el movimiento.',
      outfits: ['deportivo', 'aventura'], visual: { caja: 'negro', esfera: '#2b2e33', bisel: 'taquimetro', biselColor: '#16181b', indices: 'acero', correa: 'silicona', correaColor: '#16171a', crono: true, tam: 45 } }),
  m({ id: 'racing-navy-pit', nombre: 'Racing Navy Pit', linea: 'Racing', categoria: 'deportivo', movimiento: 'Cuarzo', precio: 469, bf: 25,
      descripcion: 'Azul navy con correa a juego: el racing más elegante de la colección.',
      outfits: ['deportivo', 'casual', 'aventura'], visual: { caja: 'acero', esfera: '#0f2347', bisel: 'taquimetro', biselColor: '#0c1d3b', indices: 'acero', correa: 'silicona', correaColor: '#13254a', crono: true, tam: 47 } }),

  // ── RESERVE (3) ──
  m({ id: 'reserve-subaqua-emerald', nombre: 'Reserve Subaqua Emerald', linea: 'Reserve', categoria: 'deportivo', movimiento: 'Automático', precio: 1490, bf: 30, etiquetas: ['ultimas'], cristal: 'Zafiro', agua: '500 m',
      descripcion: 'Edición Reserve: caja masiva, esfera esmeralda y acabados de alta relojería. Pocas unidades.',
      outfits: ['elegante', 'aventura', 'semiformal'], visual: { caja: 'acero', esfera: '#0f4a35', bisel: 'buceo', biselColor: '#0b3b2a', indices: 'oro', correa: 'brazalete', crono: false, tam: 47 } }),
  m({ id: 'reserve-grand-diver', nombre: 'Reserve Grand Diver Blue', linea: 'Reserve', categoria: 'deportivo', movimiento: 'Automático', precio: 1290, bf: 25, cristal: 'Zafiro', agua: '300 m',
      descripcion: 'Buceador automático de la línea Reserve, con zafiro y acabados de colección.',
      outfits: ['elegante', 'semiformal', 'aventura'], visual: { caja: 'acero', esfera: '#123a7a', bisel: 'buceo', biselColor: '#0b0b0d', indices: 'acero', correa: 'brazalete', crono: false, tam: 47 } }),
  m({ id: 'reserve-gold-chrono', nombre: 'Reserve Gold Chrono', linea: 'Reserve', categoria: 'deportivo', movimiento: 'Automático', precio: 1390, bf: 35, cristal: 'Zafiro', agua: '200 m',
      descripcion: 'Cronógrafo automático en oro y negro: estatus que se siente al ponértelo.',
      outfits: ['elegante', 'formal', 'semiformal'], visual: { caja: 'oro', esfera: '#0e0e10', bisel: 'taquimetro', biselColor: '#0b0b0d', indices: 'oro', correa: 'brazalete', crono: true, tam: 46 } }),

  // ── FORMALES (6) ──
  m({ id: 'specialty-classic-gold', nombre: 'Specialty Classic Gold', linea: 'Specialty', categoria: 'formal', movimiento: 'Cuarzo', precio: 349, bf: 15, agua: '50 m',
      descripcion: 'Elegancia sobria: caja dorada delgada, esfera crema y cuero negro. Para trajes y grandes ocasiones.',
      outfits: ['formal', 'elegante'], visual: { caja: 'oro', esfera: '#efe6cf', bisel: 'liso', biselColor: '#caa24a', indices: 'oro', correa: 'cuero', correaColor: '#141012', crono: false, tam: 40 } }),
  m({ id: 'specialty-chrono-leather', nombre: 'Specialty Chrono Leather', linea: 'Specialty', categoria: 'formal', movimiento: 'Cuarzo', precio: 429, bf: 20,
      descripcion: 'Cronógrafo de esfera blanca con correa de cuero marrón: el formal con espíritu deportivo.',
      outfits: ['semiformal', 'formal'], visual: { caja: 'acero', esfera: '#f1efe9', bisel: 'liso', biselColor: '#bfc3c8', indices: 'acero', correa: 'cuero', correaColor: '#6b3f22', crono: true, tam: 45 } }),
  m({ id: 'vintage-automatic-cream', nombre: 'Vintage Automatic Cream', linea: 'Vintage', categoria: 'formal', movimiento: 'Automático', precio: 599, bf: 25,
      descripcion: 'Inspiración de los años 60: esfera crema, cuero marrón y movimiento automático.',
      outfits: ['formal', 'semiformal', 'elegante'], visual: { caja: 'acero', esfera: '#eee3c9', bisel: 'liso', biselColor: '#bfc3c8', indices: 'oro', correa: 'cuero', correaColor: '#5a3219', crono: false, tam: 42 } }),
  m({ id: 'vintage-gold-black', nombre: 'Vintage Gold Black', linea: 'Vintage', categoria: 'formal', movimiento: 'Automático', precio: 649, bf: 20,
      descripcion: 'Oro y negro sobre cuero: el reloj del hombre que ya no tiene nada que demostrar.',
      outfits: ['formal', 'elegante'], visual: { caja: 'oro', esfera: '#0e0e10', bisel: 'liso', biselColor: '#caa24a', indices: 'oro', correa: 'cuero', correaColor: '#141012', crono: false, tam: 41 } }),
  m({ id: 'specialty-gold-bracelet', nombre: 'Specialty Champagne', linea: 'Specialty', categoria: 'formal', movimiento: 'Automático', precio: 499, bf: 25,
      descripcion: 'Esfera champaña y brazalete dorado: lujo clásico para eventos y celebraciones.',
      outfits: ['formal', 'elegante'], visual: { caja: 'oro', esfera: '#d9c48f', bisel: 'liso', biselColor: '#caa24a', indices: 'oro', correa: 'brazalete', crono: false, tam: 44 } }),
  m({ id: 'vintage-navy-dress', nombre: 'Vintage Navy Dress', linea: 'Vintage', categoria: 'formal', movimiento: 'Automático', precio: 399, bf: 15,
      descripcion: 'Azul navy y cuero azul noche: formalidad moderna con un guiño de color.',
      outfits: ['formal', 'semiformal'], visual: { caja: 'acero', esfera: '#0f2347', bisel: 'liso', biselColor: '#bfc3c8', indices: 'acero', correa: 'cuero', correaColor: '#16213d', crono: false, tam: 42 } }),
];

export const LINEAS = ['Pro Diver', 'Bolt', 'Speedway', 'Racing', 'Reserve', 'Specialty', 'Vintage'];

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
