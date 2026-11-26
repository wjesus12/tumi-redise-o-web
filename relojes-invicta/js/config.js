// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE LA TIENDA — edita solo este archivo
// ─────────────────────────────────────────────────────────────
export const CONFIG = {
  // Nombre comercial de TU tienda (no uses el nombre de la marca como si fueras ella)
  tienda: 'AURUM TEMPO',
  eslogan: 'Boutique de relojes Invicta',

  // Número de WhatsApp con código de país, sin "+" ni espacios (Perú = 51)
  whatsapp: '51999999999',

  moneda: 'S/',
  locale: 'es-PE',

  // Supabase: pega aquí la URL y la "anon public key" de tu proyecto
  // (Project Settings → API). Si quedan vacías, la web funciona en MODO DEMO
  // guardando pedidos en el navegador.
  supabaseUrl: '',
  supabaseAnonKey: '',

  // Ruta de la función de IA (Netlify Functions). No cambiar si usas Netlify.
  conciergeEndpoint: '/.netlify/functions/concierge',

  envioGratisDesde: 400,
  costoEnvioLima: 15,
  costoEnvioProvincia: 25,

  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
};

export const modoDemo = () => !CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey;

export const soles = (n) =>
  `${CONFIG.moneda} ${Number(n || 0).toLocaleString(CONFIG.locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
