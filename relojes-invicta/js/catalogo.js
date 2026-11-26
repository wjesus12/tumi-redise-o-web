// Catálogo base. Se usa como respaldo (modo demo) y como semilla de Supabase.
// Precios y stock son DE EJEMPLO: reemplázalos por tu inventario real.
// "visual" controla cómo se dibuja el reloj (no se usan fotos de terceros).

export const PRODUCTOS = [
  {
    id: 'pro-diver-oro', nombre: 'Pro Diver Automático Gold', linea: 'Pro Diver', genero: 'Hombre',
    movimiento: 'Automático', precio: 690, precio_antes: 820, stock: 6, destacado: true,
    descripcion: 'El buceador que convirtió a Invicta en un ícono. Caja dorada, esfera negra y bisel giratorio: presencia absoluta en la muñeca.',
    specs: { Caja: '40 mm · acero con baño dorado', Cristal: 'Mineral Flame Fusion', Agua: '200 m', Movimiento: 'Automático japonés', Correa: 'Brazalete de eslabones' },
    estilos: ['ejecutivo', 'gala', 'urbano'],
    visual: { caja: 'oro', esfera: '#0d0d10', bisel: 'buceo', biselColor: '#111', indices: 'oro', correa: 'brazalete', crono: false, tam: 40 },
  },
  {
    id: 'pro-diver-azul', nombre: 'Pro Diver Ocean Blue', linea: 'Pro Diver', genero: 'Unisex',
    movimiento: 'Cuarzo', precio: 590, precio_antes: null, stock: 9, destacado: true,
    descripcion: 'Esfera azul profundo con efecto rayos de sol y caja de acero pulido. El reloj que combina con todo.',
    specs: { Caja: '40 mm · acero inoxidable', Cristal: 'Mineral Flame Fusion', Agua: '200 m', Movimiento: 'Cuarzo japonés', Correa: 'Brazalete de acero' },
    estilos: ['smart', 'urbano', 'deportivo'],
    visual: { caja: 'acero', esfera: '#123a7a', bisel: 'buceo', biselColor: '#0f2d63', indices: 'acero', correa: 'brazalete', crono: false, tam: 40 },
  },
  {
    id: 'speedway-negro', nombre: 'Speedway Cronógrafo Noir', linea: 'Speedway', genero: 'Hombre',
    movimiento: 'Cuarzo', precio: 750, precio_antes: 890, stock: 4, destacado: true,
    descripcion: 'Inspirado en las pistas: cronógrafo con taquímetro y subesferas. Para quien vive a otra velocidad.',
    specs: { Caja: '43 mm · acero inoxidable', Cristal: 'Mineral Flame Fusion', Agua: '100 m', Movimiento: 'Cronógrafo de cuarzo', Correa: 'Brazalete de acero' },
    estilos: ['deportivo', 'smart', 'urbano'],
    visual: { caja: 'acero', esfera: '#111114', bisel: 'taquimetro', biselColor: '#0b0b0d', indices: 'acero', correa: 'brazalete', crono: true, tam: 43 },
  },
  {
    id: 'bolt-dorado', nombre: 'Bolt Imperial Bicolor', linea: 'Bolt', genero: 'Hombre',
    movimiento: 'Cuarzo', precio: 890, precio_antes: null, stock: 3, destacado: false,
    descripcion: 'El emblemático cable trenzado de la línea Bolt sobre una caja dorada. Escultura de muñeca.',
    specs: { Caja: '46 mm · acero con baño dorado', Cristal: 'Mineral Flame Fusion', Agua: '100 m', Movimiento: 'Cronógrafo de cuarzo', Correa: 'Brazalete bicolor' },
    estilos: ['gala', 'ejecutivo'],
    visual: { caja: 'oro', esfera: '#e9e3d4', bisel: 'cable', biselColor: '#caa24a', indices: 'oro', correa: 'brazalete', crono: true, tam: 46 },
  },
  {
    id: 'reserve-subaqua', nombre: 'Reserve Subaqua Emerald', linea: 'Reserve', genero: 'Hombre',
    movimiento: 'Automático', precio: 1490, precio_antes: 1790, stock: 2, destacado: true,
    descripcion: 'Edición Reserve: caja masiva, esfera verde esmeralda y acabados de alta relojería. Pocas unidades.',
    specs: { Caja: '47 mm · acero inoxidable', Cristal: 'Zafiro', Agua: '500 m', Movimiento: 'Automático suizo', Correa: 'Brazalete de acero' },
    estilos: ['gala', 'ejecutivo', 'urbano'],
    visual: { caja: 'acero', esfera: '#0f4a35', bisel: 'buceo', biselColor: '#0b3b2a', indices: 'oro', correa: 'brazalete', crono: false, tam: 47 },
  },
  {
    id: 'venom-rojo', nombre: 'Venom Black Edition', linea: 'Venom', genero: 'Hombre',
    movimiento: 'Cuarzo', precio: 1290, precio_antes: null, stock: 3, destacado: false,
    descripcion: 'Caja negra de gran formato con acentos rojos. Agresivo, técnico, imposible de ignorar.',
    specs: { Caja: '52 mm · acero con IP negro', Cristal: 'Mineral Flame Fusion', Agua: '500 m', Movimiento: 'Cronógrafo de cuarzo', Correa: 'Silicona negra' },
    estilos: ['deportivo', 'urbano'],
    visual: { caja: 'negro', esfera: '#0a0a0a', bisel: 'buceo', biselColor: '#8e1220', indices: 'rojo', correa: 'silicona', correaColor: '#141414', crono: true, tam: 52 },
  },
  {
    id: 'angel-rosa', nombre: 'Angel Rose Nácar', linea: 'Angel', genero: 'Mujer',
    movimiento: 'Cuarzo', precio: 520, precio_antes: 610, stock: 7, destacado: true,
    descripcion: 'Oro rosa y esfera de nácar con cristales. Delicado, luminoso y femenino.',
    specs: { Caja: '38 mm · acero con baño oro rosa', Cristal: 'Mineral', Agua: '100 m', Movimiento: 'Cuarzo japonés', Correa: 'Brazalete oro rosa' },
    estilos: ['gala', 'smart', 'ejecutivo'],
    visual: { caja: 'rosa', esfera: '#f4ece6', bisel: 'cristales', biselColor: '#e8c8b8', indices: 'rosa', correa: 'brazalete', crono: false, tam: 36 },
  },
  {
    id: 'angel-plata', nombre: 'Angel Silver Crystal', linea: 'Angel', genero: 'Mujer',
    movimiento: 'Cuarzo', precio: 480, precio_antes: null, stock: 8, destacado: false,
    descripcion: 'Acero brillante y bisel con cristales. Un clásico para el día a día que brilla de noche.',
    specs: { Caja: '38 mm · acero inoxidable', Cristal: 'Mineral', Agua: '100 m', Movimiento: 'Cuarzo japonés', Correa: 'Brazalete de acero' },
    estilos: ['smart', 'gala'],
    visual: { caja: 'acero', esfera: '#dfe3e8', bisel: 'cristales', biselColor: '#f1f1f1', indices: 'acero', correa: 'brazalete', crono: false, tam: 36 },
  },
  {
    id: 'aviator-cuero', nombre: 'Aviator Pilot Leather', linea: 'Aviator', genero: 'Hombre',
    movimiento: 'Cuarzo', precio: 560, precio_antes: null, stock: 5, destacado: false,
    descripcion: 'Lectura de piloto, números grandes y correa de cuero marrón. Estilo vintage con actitud.',
    specs: { Caja: '45 mm · acero inoxidable', Cristal: 'Mineral Flame Fusion', Agua: '100 m', Movimiento: 'Cronógrafo de cuarzo', Correa: 'Cuero genuino marrón' },
    estilos: ['urbano', 'smart'],
    visual: { caja: 'acero', esfera: '#16181b', bisel: 'liso', biselColor: '#bfc3c8', indices: 'numeros', correa: 'cuero', correaColor: '#6b3f22', crono: true, tam: 45 },
  },
  {
    id: 'specialty-clasico', nombre: 'Specialty Classic Gold', linea: 'Specialty', genero: 'Hombre',
    movimiento: 'Cuarzo', precio: 450, precio_antes: 520, stock: 10, destacado: false,
    descripcion: 'Elegancia sobria: caja dorada delgada, esfera crema y correa de cuero negro. Para trajes y ocasiones.',
    specs: { Caja: '40 mm · acero con baño dorado', Cristal: 'Mineral', Agua: '50 m', Movimiento: 'Cuarzo japonés', Correa: 'Cuero negro' },
    estilos: ['ejecutivo', 'gala'],
    visual: { caja: 'oro', esfera: '#efe6cf', bisel: 'liso', biselColor: '#caa24a', indices: 'oro', correa: 'cuero', correaColor: '#141012', crono: false, tam: 40 },
  },
  {
    id: 'pro-diver-verde', nombre: 'Pro Diver Coin Edge Verde', linea: 'Pro Diver', genero: 'Unisex',
    movimiento: 'Automático', precio: 620, precio_antes: null, stock: 6, destacado: false,
    descripcion: 'Bisel tipo moneda y esfera verde oliva. La versión más moderna del buceador clásico.',
    specs: { Caja: '40 mm · acero inoxidable', Cristal: 'Mineral Flame Fusion', Agua: '200 m', Movimiento: 'Automático japonés', Correa: 'Brazalete de acero' },
    estilos: ['urbano', 'smart', 'deportivo'],
    visual: { caja: 'acero', esfera: '#2f4a2a', bisel: 'buceo', biselColor: '#253d22', indices: 'acero', correa: 'brazalete', crono: false, tam: 40 },
  },
  {
    id: 'lupah-dama', nombre: 'Lupah Elegance Dama', linea: 'Lupah', genero: 'Mujer',
    movimiento: 'Cuarzo', precio: 540, precio_antes: null, stock: 4, destacado: false,
    descripcion: 'Caja tonneau suave y correa de cuero borgoña. Sofisticación diaria con un toque de color.',
    specs: { Caja: '36 mm · acero con baño dorado', Cristal: 'Mineral', Agua: '50 m', Movimiento: 'Cuarzo japonés', Correa: 'Cuero borgoña' },
    estilos: ['smart', 'ejecutivo', 'gala'],
    visual: { caja: 'oro', esfera: '#faf6ee', bisel: 'liso', biselColor: '#caa24a', indices: 'oro', correa: 'cuero', correaColor: '#6d1a2a', crono: false, tam: 35 },
  },
];

// Cupones de lanzamiento (en Supabase se validan del lado del servidor)
export const CUPONES = [
  { codigo: 'BIENVENIDA10', porcentaje: 10, minimo: 0, descripcion: '10% en tu primera compra' },
  { codigo: 'TIEMPO15', porcentaje: 15, minimo: 600, descripcion: '15% en compras desde S/ 600' },
  { codigo: 'LUJO20', porcentaje: 20, minimo: 1000, descripcion: '20% en compras desde S/ 1,000' },
];

// Estilos del Armario Digital
export const ESTILOS = [
  {
    id: 'ejecutivo', nombre: 'Ejecutivo', frase: 'Reuniones que se ganan antes de hablar.',
    manga: '#1c2333', mangaDetalle: 'rayas', puno: '#f4f4f2', gemelo: true,
    fondo: ['#0e1420', '#26324a'], tip: 'Esfera limpia y brazalete metálico: la combinación más segura con traje azul o gris.',
  },
  {
    id: 'smart', nombre: 'Smart Casual', frase: 'Relajado, pero nunca descuidado.',
    manga: '#b9a88a', mangaDetalle: 'punto', puno: '#e9e4da', gemelo: false,
    fondo: ['#2a2318', '#5a4a32'], tip: 'Juega con esferas de color (azul, verde) sobre tonos tierra y camisas abiertas.',
  },
  {
    id: 'deportivo', nombre: 'Deportivo', frase: 'Rendimiento con actitud.',
    manga: '#121316', mangaDetalle: 'tecnico', puno: null, gemelo: false,
    fondo: ['#07090c', '#1b2a33'], tip: 'Cronógrafos y correas de silicona: resistentes, legibles y con carácter.',
  },
  {
    id: 'gala', nombre: 'Gala / Noche', frase: 'Cuando la luz te busca a ti.',
    manga: '#060606', mangaDetalle: 'satin', puno: '#ffffff', gemelo: true,
    fondo: ['#050505', '#2b2210'], tip: 'Oro o cristales sobre negro: el reloj se vuelve la joya principal.',
  },
  {
    id: 'urbano', nombre: 'Urbano', frase: 'La ciudad es tu pasarela.',
    manga: '#2c3e57', mangaDetalle: 'denim', puno: null, gemelo: false,
    fondo: ['#11161d', '#3a3f47'], tip: 'Relojes grandes y buceadores combinan con denim, cuero y sneakers.',
  },
];
