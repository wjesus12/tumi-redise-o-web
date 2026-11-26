// Base de conocimiento del Concierge (preguntas frecuentes y políticas).
// La usa el asistente de IA (función de Netlify) y el modo sin conexión.
// ⚠️ Revisa y ajusta cada respuesta a la realidad de TU negocio.

export const FAQ = [
  {
    tema: 'originalidad',
    claves: ['original', 'autentico', 'auténtico', 'replica', 'réplica', 'falso', 'garantia', 'garantía', 'certificado'],
    pregunta: '¿Los relojes son originales?',
    respuesta: 'Sí. Todos nuestros relojes Invicta son originales, nuevos y vienen con su caja, manual y tarjeta de garantía. Somos un distribuidor independiente (no somos la marca).',
  },
  {
    tema: 'garantia',
    claves: ['garantia', 'garantía', 'falla', 'reparacion', 'reparación', 'servicio tecnico', 'técnico'],
    pregunta: '¿Qué garantía tienen?',
    respuesta: 'Ofrecemos 12 meses de garantía de tienda por defectos de fabricación del movimiento. No cubre golpes, humedad por mal uso ni desgaste de la correa.',
  },
  {
    tema: 'envios',
    claves: ['envio', 'envío', 'delivery', 'llega', 'demora', 'provincia', 'lima', 'olva', 'shalom', 'despacho'],
    pregunta: '¿Hacen envíos? ¿Cuánto demora?',
    respuesta: 'Sí, a todo el Perú. Enviamos tu reloj en 24 a 72 horas a la agencia que elijas (Shalom, Olva Courier, Marvisur, Flores o Cruz del Sur Cargo). Lo recoges en la agencia más cercana con tu DNI.',
  },
  {
    tema: 'pagos',
    claves: ['pago', 'pagar', 'yape', 'plin', 'tarjeta', 'transferencia', 'contraentrega', 'efectivo', 'cuotas'],
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta: 'Separas tu reloj con solo S/ 20 (Yape, Plin o transferencia) y pagas el resto al recogerlo en la agencia. Al enviar tu pedido por WhatsApp te pasamos los datos para el adelanto.',
  },
  {
    tema: 'cambios',
    claves: ['cambio', 'devolucion', 'devolución', 'reembolso', 'no me gusta', 'talla', 'arrepent'],
    pregunta: '¿Puedo cambiar o devolver?',
    respuesta: 'Tienes 7 días desde la entrega para cambios, con el reloj sin uso, film protector y caja completa. Si llegó con algún defecto, lo cambiamos sin costo.',
  },
  {
    tema: 'ajuste',
    claves: ['ajuste', 'ajustar', 'eslabon', 'eslabón', 'muñeca', 'grande', 'pequeño', 'medida', 'correa'],
    pregunta: '¿Ajustan el brazalete?',
    respuesta: 'Sí, ajustamos el brazalete gratis antes del envío. Solo indícanos la medida de tu muñeca en centímetros (mídela con una cinta o un hilo).',
  },
  {
    tema: 'agua',
    claves: ['agua', 'sumergible', 'nadar', 'ducha', 'mar', 'piscina', 'bucear', 'resistencia'],
    pregunta: '¿Son sumergibles?',
    respuesta: '50 m: salpicaduras y lluvia. 100 m: natación ocasional. 200 m o más: natación y snorkel. Nunca presiones botones bajo el agua ni uses el reloj en sauna o con agua caliente.',
  },
  {
    tema: 'automatico',
    claves: ['automatico', 'automático', 'cuerda', 'pila', 'bateria', 'batería', 'cuarzo', 'se detiene', 'para'],
    pregunta: '¿Cuál es la diferencia entre automático y cuarzo?',
    respuesta: 'El cuarzo funciona con pila (dura 2–3 años) y es muy preciso. El automático se carga con el movimiento de tu muñeca, no usa pila y su segundero se desliza; si no lo usas 1–2 días se detiene y basta con agitarlo o darle cuerda.',
  },
  {
    tema: 'cupones',
    claves: ['cupon', 'cupón', 'descuento', 'codigo', 'código', 'promocion', 'promoción', 'oferta'],
    pregunta: '¿Tienen códigos de descuento?',
    respuesta: 'Sí. Por Black Friday (hasta el lunes 30 de noviembre) todos los relojes tienen entre 15% y 40% de descuento automático, sin cupón. Además puedes sumar un cupón: BIENVENIDA10 (10% extra), TIEMPO15 (15% extra desde S/ 600) o LUJO20 (20% extra desde S/ 1,000). Se aplica un cupón por pedido.',
  },
  {
    tema: 'blackfriday',
    claves: ['black', 'friday', 'cyber', 'oferta', 'rebaja', 'hasta cuando', 'hasta cuándo', 'precio'],
    pregunta: '¿Hasta cuándo es el Black Friday?',
    respuesta: 'Nuestro Black Friday va hasta el lunes 30 de noviembre a las 23:59 (hora de Lima). Los descuentos de 15% a 40% ya están aplicados en cada reloj y puedes sumar un cupón.',
  },
  {
    tema: 'adelanto',
    claves: ['separar', 'adelanto', '20 soles', 's/ 20', 'reservar', 'apartar', 'resto', 'saldo'],
    pregunta: '¿Cómo funciona separar con S/ 20?',
    respuesta: 'Pagas S/ 20 por Yape o Plin para separar tu reloj y lo enviamos a tu agencia en 24 a 72 horas. El saldo lo pagas al recogerlo. El adelanto se descuenta del total.',
  },
  {
    tema: 'pedido',
    claves: ['pedido', 'comprar', 'como compro', 'cómo compro', 'whatsapp', 'carrito', 'reservar'],
    pregunta: '¿Cómo hago mi pedido?',
    respuesta: 'Agrega tu reloj al carrito, aplica tu cupón, completa tus datos y elige tu agencia. Pulsa "Separar por WhatsApp": tu pedido queda registrado con un código, separas con S/ 20 y pagas el resto al recoger.',
  },
  {
    tema: 'regalo',
    claves: ['regalo', 'envolver', 'empaque', 'dedicatoria', 'sorpresa', 'aniversario', 'cumpleaños'],
    pregunta: '¿Envuelven para regalo?',
    respuesta: 'Sí, empaque de regalo premium sin costo y tarjeta con dedicatoria. Indícalo en las notas de tu pedido.',
  },
  {
    tema: 'tienda',
    claves: ['tienda fisica', 'tienda física', 'local', 'direccion', 'dirección', 'recojo', 'ver en persona', 'horario'],
    pregunta: '¿Tienen tienda física?',
    respuesta: 'Somos una tienda online: enviamos a la agencia que elijas. Horario de atención por WhatsApp: lunes a sábado de 9:00 a 20:00.',
  },
];

export const POLITICA_ASISTENTE = `Eres "Concierge", el asesor de AURUM TEMPO, boutique online peruana que vende relojes Invicta originales a hombres de 18 a 50 años.
Hablas en español neutro y cálido, con tono de boutique de lujo pero cercano. Respuestas breves (máximo 4–5 oraciones o una lista corta).
Reglas:
- Responde solo con la información de PREGUNTAS FRECUENTES y CATÁLOGO que se te entrega. Si algo no está ahí (p. ej. un modelo que no aparece, fechas exactas, stock futuro), dilo con honestidad y ofrece continuar por WhatsApp.
- La tienda es un distribuidor independiente: nunca digas que eres la marca Invicta ni hables en su nombre.
- Puedes recomendar relojes del catálogo según presupuesto, estilo, ocasión o tamaño de muñeca; menciona nombre y precio.
- Puedes informar los cupones vigentes. No inventes otros descuentos.
- Si el cliente quiere comprar, explícale que agregue el reloj al carrito y envíe el pedido por WhatsApp.
- No pidas datos de tarjeta ni contraseñas.`;
