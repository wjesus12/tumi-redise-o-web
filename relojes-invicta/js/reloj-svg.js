// Dibuja relojes en SVG a partir de parámetros y los mantiene en hora real.
let uid = 0;

const METALES = {
  oro: ['#fff1c2', '#e2bd55', '#a47b1f', '#6e4f0e'],
  acero: ['#ffffff', '#c9ced4', '#7d848c', '#41464c'],
  negro: ['#5a5a60', '#26262a', '#0d0d0f', '#000'],
  rosa: ['#ffe6da', '#e3a894', '#a8705c', '#6b4134'],
};
const TINTA = { oro: '#ecc65e', acero: '#eef0f2', rosa: '#f0bba6', rojo: '#e0313f', numeros: '#f3f0e8' };

function luminancia(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
const pol = (cx, cy, r, ang) => {
  const a = (ang - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
const f = (n) => n.toFixed(2);

/**
 * @param {object} v  visual del producto
 * @param {object} o  { conCorrea: true, etiqueta: 'PRO DIVER', vivo: true }
 */
export function relojSVG(v, o = {}) {
  const id = `r${++uid}`;
  const conCorrea = o.conCorrea !== false;
  const metal = METALES[v.caja] || METALES.acero;
  const claro = luminancia(v.esfera) > 0.6;
  let tinta = TINTA[v.indices] || TINTA.acero;
  if (claro && (v.indices === 'acero' || v.indices === 'numeros')) tinta = '#2c3036';
  const manecilla = claro ? (v.caja === 'acero' ? '#2c3036' : metal[2]) : (v.indices === 'oro' || v.caja === 'oro' ? '#f1d27a' : '#f4f5f6');

  const cx = 100, cy = 170;
  const R = 46 + (v.tam - 35) * 1.15; // radio de la caja
  const rb = R - 3;                    // bisel exterior
  const rd = v.bisel === 'liso' ? R - 9 : R - 15; // esfera
  const ancho = R * 0.92;              // ancho de correa

  const defs = `
  <defs>
    <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${metal[0]}"/><stop offset=".35" stop-color="${metal[1]}"/>
      <stop offset=".7" stop-color="${metal[2]}"/><stop offset="1" stop-color="${metal[3]}"/>
    </linearGradient>
    <linearGradient id="${id}mh" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${metal[3]}"/><stop offset=".22" stop-color="${metal[1]}"/>
      <stop offset=".5" stop-color="${metal[0]}"/><stop offset=".78" stop-color="${metal[1]}"/><stop offset="1" stop-color="${metal[3]}"/>
    </linearGradient>
    <radialGradient id="${id}d" cx=".42" cy=".36" r=".75">
      <stop offset="0" stop-color="${v.esfera}" stop-opacity="1"/>
      <stop offset=".55" stop-color="${v.esfera}"/>
      <stop offset="1" stop-color="#000" stop-opacity=".55"/>
    </radialGradient>
    <radialGradient id="${id}g" cx=".35" cy=".25" r=".7">
      <stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity=".55"/></filter>
  </defs>`;

  // ── Correa ──
  let correa = '';
  if (conCorrea) {
    const x = cx - ancho / 2;
    const top = 0, bottom = 340;
    if (v.correa === 'brazalete') {
      let esl = '';
      for (let y = top; y < cy - R + 6; y += 14) esl += eslabones(x, y, ancho, id);
      for (let y = cy + R - 8; y < bottom; y += 14) esl += eslabones(x, y, ancho, id);
      correa = esl;
    } else {
      const c = v.correaColor || '#222';
      const costura = v.correa === 'cuero'
        ? `<path d="M${x + 5} ${top} V${cy - R} M${x + ancho - 5} ${top} V${cy - R} M${x + 5} ${cy + R} V${bottom} M${x + ancho - 5} ${cy + R} V${bottom}" stroke="${v.correa === 'cuero' ? '#d9c6a5' : '#333'}" stroke-width="1" stroke-dasharray="3 3" opacity=".55"/>`
        : Array.from({ length: 9 }, (_, i) => `<rect x="${x + 6}" y="${12 + i * 13}" width="${ancho - 12}" height="3" rx="1.5" fill="#000" opacity=".35"/><rect x="${x + 6}" y="${cy + R + 12 + i * 13}" width="${ancho - 12}" height="3" rx="1.5" fill="#000" opacity=".35"/>`).join('');
      correa = `
        <rect x="${x}" y="${top}" width="${ancho}" height="${cy - R + 10}" rx="6" fill="${c}"/>
        <rect x="${x}" y="${cy + R - 10}" width="${ancho}" height="${bottom - cy - R + 10}" rx="6" fill="${c}"/>
        <rect x="${x}" y="${top}" width="${ancho}" height="${bottom}" fill="url(#${id}g)" opacity=".5"/>
        ${costura}`;
    }
  }

  // ── Asas, corona, pulsadores ──
  const asas = `
    <path d="M${cx - ancho / 2 - 4} ${cy - R * 0.55} L${cx - ancho / 2 - 2} ${cy - R - 14} L${cx - ancho / 2 + 10} ${cy - R - 14} L${cx - ancho / 2 + 14} ${cy - R * 0.6} Z" fill="url(#${id}m)"/>
    <path d="M${cx + ancho / 2 + 4} ${cy - R * 0.55} L${cx + ancho / 2 + 2} ${cy - R - 14} L${cx + ancho / 2 - 10} ${cy - R - 14} L${cx + ancho / 2 - 14} ${cy - R * 0.6} Z" fill="url(#${id}m)"/>
    <path d="M${cx - ancho / 2 - 4} ${cy + R * 0.55} L${cx - ancho / 2 - 2} ${cy + R + 14} L${cx - ancho / 2 + 10} ${cy + R + 14} L${cx - ancho / 2 + 14} ${cy + R * 0.6} Z" fill="url(#${id}m)"/>
    <path d="M${cx + ancho / 2 + 4} ${cy + R * 0.55} L${cx + ancho / 2 + 2} ${cy + R + 14} L${cx + ancho / 2 - 10} ${cy + R + 14} L${cx + ancho / 2 - 14} ${cy + R * 0.6} Z" fill="url(#${id}m)"/>`;
  const corona = `<rect x="${cx + R - 2}" y="${cy - 8}" width="11" height="16" rx="3" fill="url(#${id}mh)"/>
    <g stroke="${metal[3]}" stroke-width=".8" opacity=".6">${[0, 1, 2, 3, 4].map(i => `<line x1="${cx + R + 1 + i * 2}" y1="${cy - 7}" x2="${cx + R + 1 + i * 2}" y2="${cy + 7}"/>`).join('')}</g>`;
  const pulsadores = v.crono ? [-38, 38].map(a => {
    const [px, py] = pol(cx, cy, R + 3, 90 + a);
    return `<rect x="${f(px - 4)}" y="${f(py - 6)}" width="9" height="12" rx="2.5" fill="url(#${id}mh)" transform="rotate(${a} ${f(px)} ${f(py)})"/>`;
  }).join('') : '';

  // ── Bisel ──
  let bisel = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id}m)"/>`;
  if (v.bisel === 'buceo' || v.bisel === 'taquimetro') {
    const ri = rd + 1;
    bisel += `<circle cx="${cx}" cy="${cy}" r="${(rb + ri) / 2}" fill="none" stroke="${v.biselColor}" stroke-width="${rb - ri}"/>`;
    let marcas = '';
    for (let i = 0; i < 60; i++) {
      const largo = i % 5 === 0 ? 4.5 : 2;
      if (v.bisel === 'buceo' && i > 15 && i % 5) continue;
      const [x1, y1] = pol(cx, cy, rb - 1.5, i * 6), [x2, y2] = pol(cx, cy, rb - 1.5 - largo, i * 6);
      marcas += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${tinta}" stroke-width="${i % 5 ? .7 : 1.2}" opacity=".9"/>`;
    }
    const nums = v.bisel === 'buceo' ? [[15, 90], [30, 180], [45, 270]] : [[60, 60], [100, 150], [200, 240], [400, 320]];
    nums.forEach(([n, a]) => {
      const [x, y] = pol(cx, cy, (rb + ri) / 2 - 1, a);
      marcas += `<text x="${f(x)}" y="${f(y)}" font-size="${(rb - ri) * .5}" fill="${tinta}" font-family="Inter,Arial" font-weight="700" text-anchor="middle" dominant-baseline="central" transform="rotate(${a} ${f(x)} ${f(y)})">${n}</text>`;
    });
    if (v.bisel === 'buceo') {
      const [x, y] = pol(cx, cy, (rb + ri) / 2, 0);
      marcas += `<path d="M${f(x - 4.5)} ${f(y - 3.5)} L${f(x + 4.5)} ${f(y - 3.5)} L${f(x)} ${f(y + 4)} Z" fill="${tinta}"/><circle cx="${f(x)}" cy="${f(y)}" r="1.3" fill="#9ef7c9"/>`;
    }
    bisel += marcas;
  } else if (v.bisel === 'cable') {
    bisel += `<circle cx="${cx}" cy="${cy}" r="${rb - 4}" fill="none" stroke="${metal[3]}" stroke-width="7"/>
      <circle cx="${cx}" cy="${cy}" r="${rb - 4}" fill="none" stroke="url(#${id}mh)" stroke-width="6" stroke-dasharray="3.2 2.2"/>
      <circle cx="${cx}" cy="${cy}" r="${rd + 2}" fill="none" stroke="${metal[1]}" stroke-width="2"/>`;
  } else if (v.bisel === 'cristales') {
    const n = 36, rr = (rb + rd) / 2;
    bisel += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${metal[2]}" stroke-width="${rb - rd}"/>`;
    for (let i = 0; i < n; i++) {
      const [x, y] = pol(cx, cy, rr, i * 360 / n);
      bisel += `<circle cx="${f(x)}" cy="${f(y)}" r="${(rb - rd) * .36}" fill="#fff" opacity=".95"/><circle cx="${f(x - .6)}" cy="${f(y - .6)}" r="${(rb - rd) * .14}" fill="${v.biselColor}"/>`;
    }
  } else {
    bisel += `<circle cx="${cx}" cy="${cy}" r="${rd + 3}" fill="none" stroke="${metal[3]}" stroke-width="1.2" opacity=".6"/>`;
  }

  // ── Esfera ──
  let esfera = `<circle cx="${cx}" cy="${cy}" r="${rd}" fill="url(#${id}d)"/>`;
  // textura rayos de sol
  esfera += `<g opacity=".07">${Array.from({ length: 48 }, (_, i) => { const [x, y] = pol(cx, cy, rd, i * 7.5); return `<line x1="${cx}" y1="${cy}" x2="${f(x)}" y2="${f(y)}" stroke="#fff" stroke-width=".6"/>`; }).join('')}</g>`;
  // minutero
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) continue;
    const [x1, y1] = pol(cx, cy, rd - 2, i * 6), [x2, y2] = pol(cx, cy, rd - 4.5, i * 6);
    esfera += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${tinta}" stroke-width=".6" opacity=".7"/>`;
  }
  // índices
  for (let h = 0; h < 12; h++) {
    const a = h * 30;
    if (v.crono && (h === 3 || h === 6 || h === 9)) continue;
    if (!v.crono && h === 3) continue; // ventana de fecha
    if (v.indices === 'numeros') {
      const [x, y] = pol(cx, cy, rd - 13, a);
      esfera += `<text x="${f(x)}" y="${f(y)}" font-size="${rd * .2}" font-family="Inter,Arial" font-weight="700" fill="${tinta}" text-anchor="middle" dominant-baseline="central">${h === 0 ? 12 : h}</text>`;
    } else if (h === 0) {
      const [x1, y1] = pol(cx, cy, rd - 5, a);
      esfera += `<path d="M${f(x1 - 5)} ${f(y1)} L${f(x1 + 5)} ${f(y1)} L${f(x1)} ${f(y1 + 11)} Z" fill="${tinta}" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>`;
    } else {
      const [x, y] = pol(cx, cy, rd - 11, a);
      const largo = (h % 3 === 0) ? 13 : 9;
      esfera += `<rect x="${f(x - 2.4)}" y="${f(y - largo / 2)}" width="4.8" height="${largo}" rx="1.2" fill="${tinta}" stroke="#000" stroke-opacity=".25" stroke-width=".5" transform="rotate(${a} ${f(x)} ${f(y)})"/>
        <rect x="${f(x - 1.1)}" y="${f(y - largo / 2 + 1.5)}" width="2.2" height="${largo - 3}" rx=".8" fill="#eafff3" opacity="${claro ? .0 : .55}" transform="rotate(${a} ${f(x)} ${f(y)})"/>`;
    }
  }
  // subesferas o fecha
  if (v.crono) {
    [[90, ''], [180, ''], [270, '']].forEach(([a], i) => {
      const [x, y] = pol(cx, cy, rd * .48, a);
      const rs = rd * .2;
      esfera += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rs)}" fill="#000" opacity=".35"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(rs)}" fill="none" stroke="${tinta}" stroke-width=".8" opacity=".8"/>`;
      for (let k = 0; k < 12; k++) { const [a1, b1] = pol(x, y, rs - 1, k * 30), [a2, b2] = pol(x, y, rs - 3, k * 30); esfera += `<line x1="${f(a1)}" y1="${f(b1)}" x2="${f(a2)}" y2="${f(b2)}" stroke="${tinta}" stroke-width=".5"/>`; }
      esfera += `<g class="sub" data-i="${i}" data-x="${f(x)}" data-y="${f(y)}"><line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y - rs + 2)}" stroke="${v.indices === 'rojo' ? TINTA.rojo : manecilla}" stroke-width="1"/></g><circle cx="${f(x)}" cy="${f(y)}" r="1.3" fill="${manecilla}"/>`;
    });
  } else {
    const [x, y] = pol(cx, cy, rd - 13, 90);
    esfera += `<rect x="${f(x - 7)}" y="${f(y - 5.5)}" width="13" height="11" rx="1" fill="#fbfaf6" stroke="${metal[2]}" stroke-width="1"/>
      <text class="fecha" x="${f(x - .5)}" y="${f(y + .4)}" font-size="7.5" font-family="Inter,Arial" font-weight="700" fill="#111" text-anchor="middle" dominant-baseline="central">${new Date().getDate()}</text>`;
  }
  // rótulos (sin logotipos de terceros)
  const etiqueta = (o.etiqueta || '').toUpperCase();
  if (etiqueta) {
    esfera += `<text x="${cx}" y="${cy - rd * .36}" font-size="${rd * .105}" letter-spacing="1.4" font-family="Cormorant Garamond,Georgia,serif" font-weight="700" fill="${tinta}" text-anchor="middle">${etiqueta}</text>`;
  }
  esfera += `<text x="${cx}" y="${cy + rd * (v.crono ? .74 : .42)}" font-size="${rd * .075}" letter-spacing="1" font-family="Inter,Arial" fill="${tinta}" opacity=".8" text-anchor="middle">${v.crono ? 'CHRONOGRAPH' : (o.mov === 'Automático' ? 'AUTOMATIC' : 'WATER RESIST')}</text>`;

  // ── Manecillas ──
  const hm = (len, w, cola) => `M${cx - w / 2} ${cy + cola} L${cx - w / 2} ${cy - len + w} L${cx} ${cy - len} L${cx + w / 2} ${cy - len + w} L${cx + w / 2} ${cy + cola} Z`;
  const segColor = v.indices === 'rojo' ? TINTA.rojo : (claro ? '#a1121f' : '#e0b84a');
  const manecillas = `
    <g class="hora"><path d="${hm(rd * .55, 6, 8)}" fill="${manecilla}" stroke="#000" stroke-opacity=".3" stroke-width=".6"/><path d="${hm(rd * .5, 2.4, -6)}" fill="#eafff3" opacity="${claro ? 0 : .55}"/></g>
    <g class="min"><path d="${hm(rd * .82, 4.6, 10)}" fill="${manecilla}" stroke="#000" stroke-opacity=".3" stroke-width=".6"/><path d="${hm(rd * .77, 1.8, -6)}" fill="#eafff3" opacity="${claro ? 0 : .55}"/></g>
    <g class="seg"><line x1="${cx}" y1="${cy + 16}" x2="${cx}" y2="${cy - rd + 4}" stroke="${segColor}" stroke-width="1.2"/><circle cx="${cx}" cy="${cy - rd * .62}" r="2.6" fill="none" stroke="${segColor}" stroke-width="1"/></g>
    <circle cx="${cx}" cy="${cy}" r="3.6" fill="${manecilla}"/><circle cx="${cx}" cy="${cy}" r="1.4" fill="${segColor}"/>`;

  const cristal = `<circle cx="${cx}" cy="${cy}" r="${rd}" fill="url(#${id}g)" pointer-events="none"/>
    <path d="M${f(pol(cx, cy, rd - 3, -60)[0])} ${f(pol(cx, cy, rd - 3, -60)[1])} A${rd - 3} ${rd - 3} 0 0 1 ${f(pol(cx, cy, rd - 3, 20)[0])} ${f(pol(cx, cy, rd - 3, 20)[1])}" stroke="#fff" stroke-opacity=".18" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  return `<svg class="reloj-svg" data-auto="${o.mov === 'Automático' ? 1 : 0}" viewBox="0 ${conCorrea ? 0 : cy - R - 20} 200 ${conCorrea ? 340 : 2 * R + 40}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.alt || 'Reloj'}">
    ${defs}
    <g filter="url(#${id}s)">${correa}${asas}${pulsadores}${corona}${bisel}</g>
    ${esfera}${manecillas}${cristal}
  </svg>`;
}

function eslabones(x, y, w, id) {
  const c = w * 0.3;
  return `<g>
    <rect x="${x}" y="${y}" width="${c}" height="13" rx="2" fill="url(#${id}m)"/>
    <rect x="${x + c + 1}" y="${y}" width="${w - 2 * c - 2}" height="13" rx="2" fill="url(#${id}mh)"/>
    <rect x="${x + w - c}" y="${y}" width="${c}" height="13" rx="2" fill="url(#${id}m)"/>
  </g>`;
}

// ── Mantiene todos los relojes en hora ──
function rotar(el, ang, x = 100, y = 170) { if (el) el.setAttribute('transform', `rotate(${ang} ${x} ${y})`); }

export function iniciarTicTac() {
  const tick = () => {
    const d = new Date();
    const ms = d.getMilliseconds(), s = d.getSeconds(), m = d.getMinutes(), h = d.getHours() % 12;
    document.querySelectorAll('svg.reloj-svg').forEach(svg => {
      const auto = svg.dataset.auto === '1';
      const seg = auto ? (s + ms / 1000) * 6 : s * 6;
      rotar(svg.querySelector('.seg'), seg);
      rotar(svg.querySelector('.min'), (m + s / 60) * 6);
      rotar(svg.querySelector('.hora'), (h + m / 60) * 30);
      svg.querySelectorAll('.sub').forEach(g => {
        const i = +g.dataset.i;
        const ang = i === 0 ? s * 6 : i === 1 ? (h + m / 60) * 30 : m * 6;
        rotar(g, ang, g.dataset.x, g.dataset.y);
      });
    });
  };
  tick();
  let ultimo = 0;
  const bucle = (t) => { if (t - ultimo > 120) { tick(); ultimo = t; } requestAnimationFrame(bucle); };
  requestAnimationFrame(bucle);
}
