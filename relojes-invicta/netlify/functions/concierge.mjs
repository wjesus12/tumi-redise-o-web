// Concierge IA — Netlify Function (Node 18+)
// Requiere la variable de entorno ANTHROPIC_API_KEY en Netlify.
// Opcional: CONCIERGE_MODEL para cambiar el modelo.
import Anthropic from '@anthropic-ai/sdk';
import { FAQ, POLITICA_ASISTENTE } from '../../js/conocimiento.js';
import { PRODUCTOS, CUPONES, precioFinal } from '../../js/catalogo.js';
import { CONFIG, estadoBlackFriday } from '../../js/config.js';

const MODELO = process.env.CONCIERGE_MODEL || 'claude-opus-5-5';
const MAX_MENSAJES = 12;
const MAX_CARACTERES = 800;

// Límite básico por IP (memoria de la instancia; suficiente para frenar abusos simples)
const visitas = new Map();
function permitido(ip) {
  const ahora = Date.now();
  const lista = (visitas.get(ip) || []).filter(t => ahora - t < 60_000);
  lista.push(ahora);
  visitas.set(ip, lista);
  return lista.length <= 15;
}

function sistema() {
  const bf = estadoBlackFriday();
  const catalogo = PRODUCTOS.map(p => {
    const final = precioFinal(p, bf.activo);
    return `- ${p.nombre} | línea ${p.linea} | ${p.categoria} | ${p.visual.tam} mm | ${p.movimiento}${p.visual.crono ? ' | cronógrafo' : ''} | `
      + (final < p.precio ? `S/ ${final} (antes S/ ${p.precio}, -${p.bf}%)` : `S/ ${p.precio}`)
      + (p.etiquetas?.length ? ` | ${p.etiquetas.join(', ')}` : '')
      + ` | ideal para: ${(p.outfits || []).join(', ')}`;
  }).join('\n');
  const faq = FAQ.map(f => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n');
  const cupones = CUPONES.map(c => `${c.codigo}: ${c.descripcion}`).join('; ');
  return `${POLITICA_ASISTENTE}

DATOS DE LA TIENDA
- Tienda: ${CONFIG.tienda}. Público: hombres de 18 a 50 años.
- Compra: se separa con S/ ${CONFIG.adelanto} si es 1 reloj y con S/ ${CONFIG.adelantoMultiple} si son 2 relojes o más; el saldo se paga al recoger.
- Entrega: exclusivamente en la agencia Shalom más cercana al cliente. Envíos todos los días a las ${CONFIG.horaEnvio}; después el tiempo depende de Shalom. Se comparte el tracking para que lo recoja con su DNI.
- Black Friday: ${bf.activo ? `ACTIVO hasta el 30 de noviembre, 23:59 (hora de Lima). Los precios del catálogo ya incluyen el descuento.` : 'no activo en este momento.'}
- Cupones (acumulables con Black Friday, uno por pedido): ${cupones}.
- La web tiene un "Probador virtual" para ver el reloj con tu tono de piel, outfit y medida de muñeca.

PREGUNTAS FRECUENTES
${faq}

CATÁLOGO (${PRODUCTOS.length} modelos)
${catalogo}`;
}

function limpiar(mensajes) {
  if (!Array.isArray(mensajes)) return null;
  const ms = mensajes.slice(-MAX_MENSAJES)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CARACTERES) }));
  while (ms.length && ms[0].role !== 'user') ms.shift();
  // los roles deben alternar
  const alternados = [];
  for (const m of ms) {
    if (alternados.length && alternados.at(-1).role === m.role) alternados[alternados.length - 1] = m;
    else alternados.push(m);
  }
  return alternados.length && alternados.at(-1).role === 'user' ? alternados : null;
}

const json = (cuerpo, estado = 200) => new Response(JSON.stringify(cuerpo), {
  status: estado, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'IA no configurada' }, 501); // el navegador usa las FAQ locales
  if (!permitido(context?.ip || req.headers.get('x-nf-client-connection-ip') || 'anon')) {
    return json({ respuesta: 'Estás escribiendo muy rápido 😅. Espera unos segundos o escríbenos por WhatsApp.' });
  }

  let cuerpo;
  try { cuerpo = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
  const mensajes = limpiar(cuerpo?.mensajes);
  if (!mensajes) return json({ error: 'Conversación inválida' }, 400);

  const client = new Anthropic();
  try {
    const respuesta = await client.beta.messages.create({
      model: MODELO,
      max_tokens: 1500,
      // Respuestas cortas de atención al cliente: esfuerzo bajo = más rápido y económico
      output_config: { effort: 'low' },
      // Si el modelo declina, la API reintenta automáticamente con un modelo de respaldo
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [{ type: 'text', text: sistema(), cache_control: { type: 'ephemeral' } }],
      messages: mensajes,
    });

    if (respuesta.stop_reason === 'refusal') {
      return json({ respuesta: 'Prefiero que esa consulta la veas directamente con un asesor por WhatsApp 📲. ¿Te ayudo con algo sobre nuestros relojes?' });
    }
    const texto = respuesta.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
    return json({ respuesta: texto || 'Cuéntame un poco más para ayudarte mejor 🙂' });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Concierge: API key inválida');
      return json({ error: 'IA no configurada' }, 501);
    }
    if (error instanceof Anthropic.RateLimitError) {
      return json({ respuesta: 'Tengo muchas consultas en este momento. Inténtalo en un minuto o escríbenos por WhatsApp 📲.' });
    }
    if (error instanceof Anthropic.APIError) {
      console.error('Concierge: error de API', error.status, error.message);
      return json({ error: 'Servicio no disponible' }, 503);
    }
    console.error('Concierge: error inesperado', error);
    return json({ error: 'Servicio no disponible' }, 503);
  }
};
