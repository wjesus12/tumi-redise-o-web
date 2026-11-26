// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE LA TIENDA — edita solo este archivo
// ─────────────────────────────────────────────────────────────
export const CONFIG = {
  tienda: 'AURUM TEMPO',
  eslogan: 'Relojes Invicta para hombres que marcan el ritmo',

  // WhatsApp de ventas: código de país + número, sin "+" ni espacios.
  // ⚠️ NÚMERO DE PRUEBA — reemplázalo por el tuyo antes de publicar.
  whatsapp: '51987654321',

  moneda: 'S/',
  locale: 'es-PE',

  // Supabase (Project Settings → API). Vacío = MODO DEMO (pedidos en el navegador)
  supabaseUrl: '',
  supabaseAnonKey: '',

  // Asistente IA (función Netlify). Si no responde, el Concierge usa las FAQ locales.
  conciergeEndpoint: '/.netlify/functions/concierge',

  // Modalidad de compra: separas con S/ 20 y pagas el resto al recoger en agencia
  adelanto: 20,
  agencias: ['Shalom', 'Olva Courier', 'Marvisur', 'Flores', 'Cruz del Sur Cargo'],
  plazoEntrega: '24 a 72 horas',

  // Campaña Black Friday (hora de Lima, UTC-5)
  blackFriday: {
    inicio: '2026-11-26T00:00:00-05:00', // acceso anticipado desde hoy
    dia: '2026-11-27T00:00:00-05:00',
    fin: '2026-11-30T23:59:59-05:00',    // hasta Cyber Monday
  },

  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
};

export const modoDemo = () => !CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey;

export function estadoBlackFriday(ahora = new Date()) {
  const { inicio, dia, fin } = CONFIG.blackFriday;
  const t = ahora.getTime();
  if (t < Date.parse(inicio)) return { activo: false, fase: 'pronto', hasta: Date.parse(inicio) };
  if (t > Date.parse(fin)) return { activo: false, fase: 'terminado', hasta: null };
  return { activo: true, fase: t < Date.parse(dia) ? 'anticipado' : 'black', hasta: Date.parse(fin) };
}

export const soles = (n) =>
  `${CONFIG.moneda}\u00a0${Number(n || 0).toLocaleString(CONFIG.locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
