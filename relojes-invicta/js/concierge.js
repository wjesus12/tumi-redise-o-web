// Concierge: chat con IA (función Netlify) y respaldo local con FAQ + recomendador.
import { CONFIG, soles } from './config.js';
import { FAQ } from './conocimiento.js';
import { estado, $, esc, precio, bfActivo } from './tienda.js';

const historial = []; // {role:'user'|'assistant', content}
let iaDisponible = true;

const SUGERENCIAS = ['¿Cómo separo mi reloj?', 'Deportivo hasta S/ 400', '¿Hasta cuándo es el Black Friday?', '¿Son originales?', 'Reloj para traje', '¿Automático o cuarzo?'];

export function iniciarConcierge() {
  $('#abrir-chat').addEventListener('click', () => alternar());
  $('#cerrar-chat').addEventListener('click', () => alternar(false));
  $('#chat-sug').innerHTML = SUGERENCIAS.map(s => `<button type="button">${esc(s)}</button>`).join('');
  $('#chat-sug').addEventListener('click', e => { const b = e.target.closest('button'); if (b) enviar(b.textContent); });
  $('#chat-form').addEventListener('submit', e => { e.preventDefault(); const i = $('#chat-input'); if (i.value.trim()) { enviar(i.value.trim()); i.value = ''; } });
  burbuja('bot', `¡Hola! Soy el Concierge de ${CONFIG.tienda} ⌚\n${bfActivo() ? 'Estamos en Black Friday: hasta 40% OFF y puedes sumar cupones. ' : ''}¿Buscas algo deportivo, formal o un regalo? Dime tu presupuesto y te recomiendo.`);
}

export function abrirChat(pregunta) {
  alternar(true);
  if (pregunta) enviar(pregunta);
}

function alternar(forzar) {
  const c = $('#chat');
  const abrir = forzar ?? !c.classList.contains('visible');
  c.classList.toggle('visible', abrir);
  if (abrir) setTimeout(() => $('#chat-input').focus(), 200);
}

function burbuja(quien, texto) {
  const d = document.createElement('div');
  d.className = `msj ${quien}`;
  // enlaces y negritas simples, con escape previo
  d.innerHTML = esc(texto).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<b>$1</b>');
  $('#chat-msgs').appendChild(d);
  $('#chat-msgs').scrollTop = 1e9;
  return d;
}

async function enviar(texto) {
  burbuja('yo', texto);
  historial.push({ role: 'user', content: texto });
  const escribiendo = burbuja('bot escribiendo', '');
  escribiendo.innerHTML = '<span></span><span></span><span></span>';
  let respuesta = null;
  if (iaDisponible) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 25000);
      const r = await fetch(CONFIG.conciergeEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal,
        body: JSON.stringify({ mensajes: historial.slice(-10), bf: bfActivo() }),
      });
      clearTimeout(t);
      if (r.ok) { const j = await r.json(); respuesta = j.respuesta; }
      else if (r.status === 404 || r.status === 501) iaDisponible = false;
    } catch { iaDisponible = false; }
  }
  if (!respuesta) respuesta = responderLocal(texto);
  escribiendo.remove();
  burbuja('bot', respuesta);
  historial.push({ role: 'assistant', content: respuesta });
}

// ── Respaldo sin IA ──
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function responderLocal(texto) {
  const q = norm(texto);
  if (/^(hola|buenas|buenos|hey|que tal)/.test(q)) return '¡Hola! 👋 Cuéntame qué buscas: ¿deportivo, formal o un regalo? Y si tienes un presupuesto, dímelo para recomendarte.';
  if (/gracias/.test(q)) return '¡Con gusto! Si quieres, te atendemos también por WhatsApp para separar tu reloj. ⌚';

  const reco = recomendar(q);
  let mejor = null, puntaje = 0;
  FAQ.forEach(f => {
    const pts = f.claves.reduce((a, c) => a + (q.includes(norm(c)) ? (c.length > 6 ? 2 : 1) : 0), 0);
    if (pts > puntaje) { puntaje = pts; mejor = f; }
  });
  if (reco && (puntaje < 2 || /recomien|busco|quiero|regalo|hasta|presupuesto|para |soles|s\//.test(q))) return reco;
  if (mejor) return mejor.respuesta;
  if (reco) return reco;
  return `No tengo esa respuesta exacta, pero un asesor te ayuda al toque por WhatsApp (botón verde 📲). También puedo recomendarte un reloj: dime tu presupuesto y estilo.`;
}

function recomendar(q) {
  let ps = estado.productos.slice();
  let filtro = false;
  const monto = q.match(/(\d{3,4})/);
  if (monto) { const m = +monto[1]; ps = ps.filter(p => precio(p) <= m); filtro = true; }
  const reglas = [
    [/deport|gym|entren|correr|aventura|playa|nadar|bucear|sport/, p => p.categoria === 'deportivo'],
    [/formal|traje|terno|oficina|boda|evento|elegan|cena/, p => p.categoria === 'formal' || p.outfits?.includes('elegante')],
    [/automatic/, p => p.movimiento === 'Automático'],
    [/crono/, p => p.visual?.crono],
    [/oro|dorad|gold/, p => p.visual?.caja === 'oro'],
    [/azul|navy|blue/, p => /#1[0-9a-f]{2}[3-9a-f]|#0f2|#16|#1a/.test(p.visual?.esfera || '')],
    [/negr|black/, p => ['negro'].includes(p.visual?.caja) || (p.visual?.esfera || '').startsWith('#0')],
    [/verde|green/, p => /^#(2f4|0f4)/.test(p.visual?.esfera || '')],
    [/pro ?diver|bolt|speedway|racing|reserve|vintage|specialty/, null],
  ];
  reglas.forEach(([re, fn]) => {
    const m = q.match(re);
    if (!m) return;
    filtro = true;
    if (fn) ps = ps.filter(fn);
    else ps = ps.filter(p => norm(p.linea).replace(' ', '').includes(m[0].replace(' ', '')));
  });
  if (/regalo/.test(q)) filtro = true;
  if (!filtro) return null;
  if (!ps.length) return 'Con esos criterios no tengo un modelo exacto 🤔. Prueba ampliar el presupuesto o escríbenos por WhatsApp y te conseguimos opciones.';
  ps.sort((a, b) => (b.etiquetas?.includes('mas-vendido') ? 1 : 0) - (a.etiquetas?.includes('mas-vendido') ? 1 : 0) || (b.bf || 0) - (a.bf || 0));
  const top = ps.slice(0, 3).map(p => `• *${p.nombre}* — ${soles(precio(p))}${bfActivo() && p.bf ? ` (-${p.bf}%)` : ''} · ${p.visual.tam} mm, ${p.movimiento.toLowerCase()}`);
  return `Te recomiendo:\n${top.join('\n')}\n\nPuedes probártelos en el *Probador* con tu outfit y separarlos desde ${soles(CONFIG.adelanto)}.`;
}
