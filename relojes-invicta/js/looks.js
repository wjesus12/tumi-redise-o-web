// Looks del probador: mangas (camisa, polo, chompa) y tatuaje, dibujados en SVG
// sobre la foto real de la muñeca (coordenadas de la foto: 1200 × 800).
import { MUNECA } from './probador-datos.js';

export const LOOKS = [
  { id: 'estandar', nombre: 'Estándar', estilo: 'deportivo' },
  { id: 'camisa', nombre: 'Formal · camisa', estilo: 'formal', colores: [
    ['Blanco', '#f4f4f1'], ['Celeste', '#bcd3ea'], ['Azul marino', '#1f2d4a'], ['Negro', '#16171a'], ['Rosa palo', '#e8c9c4'], ['Gris', '#8d9299']] },
  { id: 'polo', nombre: 'Casual · polo', estilo: 'casual', colores: [
    ['Negro', '#17181b'], ['Blanco', '#efefec'], ['Gris melange', '#9a9b9e'], ['Azul navy', '#1d2a44'], ['Verde oliva', '#5b5f3a'], ['Burdeos', '#5e1e2a']] },
  { id: 'chompa', nombre: 'Invierno · chompa', estilo: 'casual', colores: [
    ['Camel', '#b08a5e'], ['Gris', '#7c7f84'], ['Negro', '#1a1a1c'], ['Azul navy', '#22304d'], ['Verde botella', '#24402f'], ['Vino', '#5a1f2b']] },
  { id: 'tattoo', nombre: 'Tattoo', estilo: 'deportivo' },
];

const W = MUNECA.ancho, H = MUNECA.alto;
const P = MUNECA.perfil.filter(p => p[1] != null);
function borde(x, i) { // interpolación del contorno
  x = Math.max(P[0][0], Math.min(P[P.length - 1][0], x));
  for (let k = 1; k < P.length; k++) if (x <= P[k][0]) {
    const [x0, a0, b0] = P[k - 1], [x1, a1, b1] = P[k], t = (x - x0) / (x1 - x0 || 1);
    return i === 1 ? a0 + (a1 - a0) * t : b0 + (b1 - b0) * t;
  }
  return P[P.length - 1][i];
}
const arriba = (x) => borde(x, 1), abajo = (x) => borde(x, 2), centro = (x) => (arriba(x) + abajo(x)) / 2;
const f = (n) => Math.round(n * 10) / 10;
let uid = 0;

function luz(hex, k) { // aclara (k>0) u oscurece (k<0)
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const m = (c) => Math.max(0, Math.min(255, Math.round(k > 0 ? c + (255 - c) * k : c * (1 + k))));
  return `#${[m(r), m(g), m(b)].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

// Forma de la manga: sigue el brazo con holgura y termina en un puño curvo
function formaManga(c, holgura, curva) {
  const pts = [];
  for (let x = -10; x <= c; x += 20) pts.push([x, arriba(x) - holgura - (c - x) * 0.025]);
  const sup = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');
  const yb = (x) => abajo(x) + holgura * 1.15 + (c - x) * 0.03;
  const inf = [];
  for (let x = c; x >= -10; x -= 20) inf.push(`L${f(x)} ${f(yb(x))}`);
  const yt = arriba(c) - holgura, ym = centro(c);
  return `${sup} L${f(c)} ${f(yt)} Q${f(c + curva)} ${f(ym)} ${f(c)} ${f(yb(c))} ${inf.join(' ')} Z`;
}

function manga(tipo, color) {
  const id = `lk${++uid}`;
  const cfg = { camisa: { c: 300, holgura: 16, curva: 14, frec: '0.9 0.35', octavas: 2, puno: 78 },
                polo: { c: 292, holgura: 20, curva: 10, frec: '0.55 0.55', octavas: 3, puno: 58 },
                chompa: { c: 272, holgura: 30, curva: 18, frec: '0.09 0.32', octavas: 3, puno: 86 } }[tipo];
  const { c, puno } = cfg;
  const d = formaManga(c, cfg.holgura, cfg.curva);
  const dPuno = formaManga(c, cfg.holgura + 1, cfg.curva);
  const ini = c - puno;
  const yT = arriba(c) - cfg.holgura, yB = abajo(c) + cfg.holgura * 1.15;
  const oscuro = luz(color, -0.35), claro = luz(color, 0.18);

  // pliegues: volúmenes suaves de luz y sombra que siguen el brazo
  const pliegues = Array.from({ length: 6 }, (_, i) => {
    const x0 = 10 + i * (ini - 20) / 5, y0 = arriba(x0) + (abajo(x0) - arriba(x0)) * (0.25 + (i % 3) * 0.22);
    const tono = i % 2 ? '#000' : '#fff';
    return `<ellipse cx="${f(x0)}" cy="${f(y0)}" rx="${f(46 + (i % 3) * 14)}" ry="${f(tipo === 'chompa' ? 16 : 10)}" transform="rotate(${i % 2 ? 12 : -9} ${f(x0)} ${f(y0)})" fill="${tono}" opacity="${i % 2 ? .2 : .12}" filter="url(#${id}suave)"/>`;
  }).join('');
  const lum = (() => { const n = parseInt(color.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; })();
  const linea = lum < 0.3 ? luz(color, 0.28) : oscuro;

  let detalle = '';
  if (tipo === 'camisa') {
    const yBoton = yT + (yB - yT) * 0.66;
    detalle = `
      <g clip-path="url(#${id}clip)"><rect x="${ini}" y="${yT - 40}" width="${puno}" height="${yB - yT + 80}" fill="${claro}" opacity=".14"/>
      <rect x="${ini - 10}" y="${yT - 40}" width="12" height="${yB - yT + 80}" fill="#000" opacity=".16" filter="url(#${id}suave)"/>
      <path d="M${ini} ${yT - 40} V${yB + 40}" stroke="${linea}" stroke-width="1.6" opacity=".5"/>
      <path d="M${ini + 7} ${yT - 40} V${yB + 40} M${c - 7} ${yT - 40} V${yB + 40}" stroke="${linea}" stroke-width=".9" stroke-dasharray="4 3" opacity=".4"/></g>
      <g transform="translate(${ini + puno * 0.45} ${f(yBoton)})"><ellipse rx="10" ry="9" fill="${luz(color, color > '#888' ? -0.08 : 0.5)}" stroke="${oscuro}" stroke-width="1.2" opacity=".95"/>
        <circle cx="-3" cy="-3" r="1.4" fill="${oscuro}"/><circle cx="3" cy="-3" r="1.4" fill="${oscuro}"/><circle cx="-3" cy="3" r="1.4" fill="${oscuro}"/><circle cx="3" cy="3" r="1.4" fill="${oscuro}"/></g>`;
  }
  if (tipo === 'polo' || tipo === 'chompa') {
    const paso = tipo === 'polo' ? 5 : 9;
    detalle = `<pattern id="${id}rib" width="${paso}" height="10" patternUnits="userSpaceOnUse"><rect width="${paso}" height="10" fill="${color}"/><rect width="${paso * 0.42}" height="10" fill="${linea}" opacity="${lum < 0.3 ? .35 : .5}"/></pattern>
      <rect x="${ini}" y="${yT - 40}" width="${puno}" height="${yB - yT + 80}" fill="url(#${id}rib)" clip-path="url(#${id}clip)"/>
      <rect x="${ini - 14}" y="${yT - 40}" width="16" height="${yB - yT + 80}" fill="#000" opacity=".22" filter="url(#${id}suave)" clip-path="url(#${id}clip)"/>`;
  }
  const tejido = tipo === 'chompa'
    ? `<pattern id="${id}punto" width="22" height="16" patternUnits="userSpaceOnUse"><rect width="22" height="16" fill="none"/><path d="M0 0 L11 9 L22 0 M0 8 L11 17 L22 8" stroke="${linea}" stroke-width="3.4" fill="none" opacity=".55"/></pattern>
       <rect x="-10" y="0" width="${ini + 10}" height="${H}" fill="url(#${id}punto)" clip-path="url(#${id}clip)"/>`
    : '';

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <clipPath id="${id}clip"><path d="${d}"/></clipPath>
      <filter id="${id}tex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${cfg.frec}" numOctaves="${cfg.octavas}" seed="7"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 ${tipo === 'camisa' ? .18 : .32}"/></feComponentTransfer></filter>
      <filter id="${id}brillo" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${cfg.frec}" numOctaves="${cfg.octavas}" seed="19"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${lum < 0.3 ? .22 : .1} 0"/></filter>
      <filter id="${id}suave"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="${id}sombra" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
      ${tipo === 'chompa' ? `<filter id="${id}pelusa"><feTurbulence type="turbulence" baseFrequency=".6" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>` : ''}
      <linearGradient id="${id}vol" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".16" stop-color="#000" stop-opacity=".08"/>
        <stop offset=".36" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#000" stop-opacity="0"/>
        <stop offset=".88" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
      <linearGradient id="${id}caida" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
      <mask id="${id}brazo"><image href="${MUNECA.siluetaData || MUNECA.silueta}" width="${W}" height="${H}"/></mask>
    </defs>
    <!-- sombra de la manga sobre la piel -->
    <rect x="${c - 6}" y="0" width="70" height="${H}" fill="url(#${id}caida)" mask="url(#${id}brazo)" filter="url(#${id}sombra)" opacity=".9"/>
    <!-- sombra exterior -->
    <path d="${d}" fill="#000" opacity=".22" transform="translate(4 10)" filter="url(#${id}sombra)"/>
    <g ${tipo === 'chompa' ? `filter="url(#${id}pelusa)"` : ''}>
      <path d="${d}" fill="${color}"/>
      ${tejido}
      ${detalle}
      <g clip-path="url(#${id}clip)">${pliegues}</g>
      <rect x="-10" y="0" width="${c + 40}" height="${H}" filter="url(#${id}tex)" clip-path="url(#${id}clip)"/>
      <rect x="-10" y="0" width="${c + 40}" height="${H}" filter="url(#${id}brillo)" clip-path="url(#${id}clip)"/>
      <path d="${d}" fill="url(#${id}vol)"/>
      <path d="${dPuno}" fill="none" stroke="${oscuro}" stroke-width="1.4" opacity=".5"/>
    </g>
  </svg>`;
}

// Tatuaje blackwork original: rosa de los vientos, puntillismo, ramas y banda geométrica
function tatuaje() {
  const id = `tt${++uid}`;
  const tinta = '#1b1d22';
  const cx = 205, cy = centro(205) + 6, R = 112;
  const puntos = 8;
  let estrella = '';
  for (let i = 0; i < puntos; i++) {
    const a = i * Math.PI / 4, largo = i % 2 ? R * 0.62 : R * 0.98, ancho = i % 2 ? 10 : 16;
    const px = Math.sin(a), py = -Math.cos(a), qx = -py, qy = px;
    estrella += `<path d="M${f(cx)} ${f(cy)} L${f(cx + qx * ancho)} ${f(cy + qy * ancho)} L${f(cx + px * largo)} ${f(cy + py * largo)} Z" fill="${tinta}"/>
      <path d="M${f(cx)} ${f(cy)} L${f(cx - qx * ancho)} ${f(cy - qy * ancho)} L${f(cx + px * largo)} ${f(cy + py * largo)} Z" fill="none" stroke="${tinta}" stroke-width="2"/>`;
  }
  let marcas = '';
  for (let i = 0; i < 72; i++) {
    const a = i * Math.PI / 36, r1 = R * 0.78, r2 = R * (i % 9 === 0 ? 0.7 : 0.74);
    marcas += `<line x1="${f(cx + Math.sin(a) * r1)}" y1="${f(cy - Math.cos(a) * r1)}" x2="${f(cx + Math.sin(a) * r2)}" y2="${f(cy - Math.cos(a) * r2)}" stroke="${tinta}" stroke-width="${i % 9 === 0 ? 2.4 : 1.2}"/>`;
  }
  // puntillismo (sombreado con puntos) alrededor
  let dots = '';
  let s = 11;
  const azar = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 700; i++) {
    const a = azar() * Math.PI * 2, r = R * (0.84 + Math.pow(azar(), 1.8) * 0.5);
    dots += `<circle cx="${f(cx + Math.cos(a) * r)}" cy="${f(cy + Math.sin(a) * r * 0.92)}" r="${f(0.9 + azar() * 1.3)}" fill="${tinta}" opacity="${f(0.35 + azar() * 0.5)}"/>`;
  }
  // banda geométrica alrededor de la muñeca (detrás del reloj)
  const bx = 560;
  let banda = '';
  for (const off of [-16, 16]) banda += `<path d="M${bx + off} ${f(arriba(bx) - 10)} V${f(abajo(bx) + 10)}" stroke="${tinta}" stroke-width="2.4"/>`;
  for (let y = arriba(bx) - 10; y < abajo(bx) + 10; y += 26) banda += `<path d="M${bx - 16} ${f(y)} L${bx} ${f(y + 13)} L${bx - 16} ${f(y + 26)}" stroke="${tinta}" stroke-width="1.4" fill="none"/><circle cx="${bx + 8}" cy="${f(y + 13)}" r="2.2" fill="${tinta}"/>`;
  // ramas de olivo que conectan
  let rama = '';
  const ramaY = (x) => centro(x) + Math.sin(x / 45) * 26;
  rama += `<path d="M${cx + R * 0.9} ${f(ramaY(cx + R * 0.9))} ${Array.from({ length: 12 }, (_, i) => { const x = cx + R * 0.9 + i * 18; return `L${f(x)} ${f(ramaY(x))}`; }).join(' ')}" stroke="${tinta}" stroke-width="3" fill="none"/>`;
  for (let i = 0; i < 9; i++) {
    const x = cx + R + i * 22, y = ramaY(x), lado = i % 2 ? 1 : -1;
    rama += `<path d="M${f(x)} ${f(y)} q${f(8)} ${f(lado * 26)} ${f(26)} ${f(lado * 30)} q${f(-14)} ${f(lado * -4)} ${f(-26)} ${f(lado * -30)} Z" fill="${tinta}" opacity=".9"/>`;
  }
  // líneas finas hacia el codo
  const lineas = [0.32, 0.5, 0.68].map(k => `<path d="M-10 ${f(arriba(0) + (abajo(0) - arriba(0)) * k)} L${cx - R - 8} ${f(arriba(cx - R) + (abajo(cx - R) - arriba(cx - R)) * k)}" stroke="${tinta}" stroke-width="1.6" opacity=".8"/>`).join('');

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <mask id="${id}m"><image href="${MUNECA.siluetaData || MUNECA.silueta}" width="${W}" height="${H}"/></mask>
      <filter id="${id}tinta" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/><feGaussianBlur stdDeviation=".7"/></filter>
      <linearGradient id="${id}cil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
    </defs>
    <g mask="url(#${id}m)" opacity=".8">
      <g filter="url(#${id}tinta)" transform="translate(0 ${f(cy)}) scale(1 .9) translate(0 ${f(-cy)})">
        ${dots}
        <circle cx="${cx}" cy="${f(cy)}" r="${R * 0.82}" fill="none" stroke="${tinta}" stroke-width="3"/>
        <circle cx="${cx}" cy="${f(cy)}" r="${R * 0.66}" fill="none" stroke="${tinta}" stroke-width="1.5"/>
        ${marcas}${estrella}
        <circle cx="${cx}" cy="${f(cy)}" r="7" fill="#f2efe9" stroke="${tinta}" stroke-width="3"/>
        <text x="${cx}" y="${f(cy - R * 1.02)}" font-family="Georgia,serif" font-size="22" font-weight="700" fill="${tinta}" text-anchor="middle">N</text>
        ${lineas}${rama}${banda}
      </g>
      <!-- la tinta se desvanece en los bordes del brazo (volumen) -->
      <rect x="-10" y="${arriba(0) - 20}" width="${W}" height="${abajo(0) - arriba(0) + 40}" fill="url(#${id}cil)" style="mix-blend-mode:screen" opacity=".55"/>
    </g>
  </svg>`;
}

export function capaLook(lookId, color) {
  if (lookId === 'tattoo') return { svg: tatuaje(), mezcla: 'multiply' };
  if (['camisa', 'polo', 'chompa'].includes(lookId)) return { svg: manga(lookId, color), mezcla: 'normal' };
  return { svg: '', mezcla: 'normal' };
}
