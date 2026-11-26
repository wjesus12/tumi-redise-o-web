// Escenas ilustradas (SVG) para estilo de vida y probador.
// Si existe una foto real en img/ con el mismo nombre (.jpg), se usa la foto.
let n = 0;
const azar = (s) => { let x = s; return () => (x = (x * 9301 + 49297) % 233280) / 233280; };

export function escena(tipo, W = 1200, H = 800) {
  const id = `sc${++n}`;
  const r = azar(tipo.length * 97 + W);
  const base = (fondo, cuerpo) => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%">
    <defs>${fondo}<filter id="${id}b"><feGaussianBlur stdDeviation="${W / 160}"/></filter><filter id="${id}bb"><feGaussianBlur stdDeviation="${W / 60}"/></filter></defs>${cuerpo}</svg>`;

  if (tipo === 'ciudad' || tipo === 'formal') {
    let edificios = '', ventanas = '';
    let x = -20;
    while (x < W) {
      const w = 50 + r() * 90, h = H * (.25 + r() * .5);
      edificios += `<rect x="${x}" y="${H - h}" width="${w}" height="${h}" fill="#0a0f1c"/>`;
      for (let wy = H - h + 14; wy < H - 20; wy += 18) for (let wx = x + 8; wx < x + w - 10; wx += 14) if (r() > .62) ventanas += `<rect x="${wx}" y="${wy}" width="6" height="9" fill="${r() > .8 ? '#f1d77f' : '#d4af37'}" opacity="${.35 + r() * .6}"/>`;
      x += w + 4;
    }
    return base(`<linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030712"/><stop offset=".6" stop-color="#0f2347"/><stop offset="1" stop-color="#1c3d78"/></linearGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#${id}c)"/>
       ${Array.from({ length: 60 }, () => `<circle cx="${r() * W}" cy="${r() * H * .5}" r="${r() * 1.4}" fill="#fff" opacity="${r() * .7}"/>`).join('')}
       <circle cx="${W * .78}" cy="${H * .2}" r="${W * .05}" fill="#f1d77f" opacity=".9"/><circle cx="${W * .78}" cy="${H * .2}" r="${W * .1}" fill="#d4af37" opacity=".15" filter="url(#${id}bb)"/>
       <g opacity=".55">${edificios.replace(/#0a0f1c/g, '#0d1730')}</g>
       <g transform="translate(${W * .03} ${H * .06}) scale(.95)">${edificios}${ventanas}</g>`);
  }
  if (tipo === 'montana' || tipo === 'aventura') {
    const cordillera = (y, alto, color, op) => {
      let d = `M0 ${H} L0 ${y}`;
      for (let x = 0; x <= W; x += W / 9) d += ` L${x + W / 18} ${y - alto * (.4 + r() * .6)} L${x + W / 9} ${y - alto * r() * .3}`;
      return `<path d="${d} L${W} ${H} Z" fill="${color}" opacity="${op}"/>`;
    };
    return base(`<linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1a33"/><stop offset=".45" stop-color="#7a3b1c"/><stop offset=".7" stop-color="#e0953a"/><stop offset="1" stop-color="#f1d77f"/></linearGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#${id}c)"/>
       <circle cx="${W * .3}" cy="${H * .62}" r="${W * .07}" fill="#fff3c4"/><circle cx="${W * .3}" cy="${H * .62}" r="${W * .16}" fill="#f1d77f" opacity=".35" filter="url(#${id}bb)"/>
       ${cordillera(H * .62, H * .3, '#3b2a2a', .7)}${cordillera(H * .75, H * .3, '#1d1a1f', .9)}${cordillera(H * .9, H * .25, '#08090b', 1)}
       <rect y="${H * .68}" width="${W}" height="${H * .06}" fill="#fff" opacity=".07" filter="url(#${id}b)"/>`);
  }
  if (tipo === 'neon' || tipo === 'casual') {
    const colores = ['#d0142c', '#d4af37', '#1c3d78', '#f1d77f', '#ff3b52', '#3a6fd8'];
    return base(`<linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#07080a"/><stop offset="1" stop-color="#1a0a12"/></linearGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#${id}c)"/>
       <g filter="url(#${id}b)">${Array.from({ length: 46 }, () => { const c = colores[Math.floor(r() * colores.length)]; return `<circle cx="${r() * W}" cy="${r() * H}" r="${W * (.012 + r() * .05)}" fill="${c}" opacity="${.25 + r() * .5}"/>`; }).join('')}</g>
       <g opacity=".5">${Array.from({ length: 8 }, (_, i) => `<line x1="${-W * .1 + i * W * .18}" y1="${H}" x2="${W * .5}" y2="${H * .45}" stroke="${i % 2 ? '#d0142c' : '#d4af37'}" stroke-width="2" filter="url(#${id}b)"/>`).join('')}</g>`);
  }
  if (tipo === 'salon' || tipo === 'elegante') {
    let libros = '';
    for (let fila = 0; fila < 6; fila++) {
      let x = 0; const y = H * .08 + fila * H * .15;
      while (x < W) { const w = 10 + r() * 22, h = H * (.09 + r() * .04); libros += `<rect x="${x}" y="${y + H * .13 - h}" width="${w}" height="${h}" fill="${['#3b1d12', '#2a1a10', '#4a2414', '#1d2a3b', '#5a3a12'][Math.floor(r() * 5)]}"/>`; x += w + 1.5; }
      libros += `<rect y="${y + H * .13}" width="${W}" height="6" fill="#1a0f08"/>`;
    }
    return base(`<radialGradient id="${id}c" cx=".7" cy=".35" r=".8"><stop offset="0" stop-color="#5a3a12"/><stop offset=".5" stop-color="#1a0f08"/><stop offset="1" stop-color="#050302"/></radialGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#${id}c)"/>
       <g opacity=".55" filter="url(#${id}b)">${libros}</g>
       <rect width="${W}" height="${H}" fill="#050302" opacity=".35"/>
       <circle cx="${W * .72}" cy="${H * .3}" r="${W * .14}" fill="#f1d77f" opacity=".25" filter="url(#${id}bb)"/>
       <path d="M${W * .66} ${H * .22} h${W * .12} l-${W * .02} ${H * .08} h-${W * .08} Z" fill="#d4af37" opacity=".85"/>`);
  }
  if (tipo === 'pista' || tipo === 'deportivo') {
    const carriles = Array.from({ length: 9 }, (_, i) => `<line x1="${W * .5 + (i - 4) * 18}" y1="${H * .42}" x2="${W * .5 + (i - 4) * W * .22}" y2="${H}" stroke="#fff" stroke-width="3" opacity=".55"/>`).join('');
    return base(`<linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020306"/><stop offset=".42" stop-color="#0f2347"/><stop offset=".43" stop-color="#7a0c18"/><stop offset="1" stop-color="#3a0509"/></linearGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#${id}c)"/>
       ${[.12, .32, .68, .88].map(x => `<g><rect x="${W * x - 40}" y="${H * .08}" width="80" height="26" rx="4" fill="#fff"/><path d="M${W * x - 40} ${H * .08 + 26} L${W * x - 240} ${H * .45} L${W * x + 240} ${H * .45} L${W * x + 40} ${H * .08 + 26} Z" fill="#fff" opacity=".06"/><circle cx="${W * x}" cy="${H * .08 + 13}" r="70" fill="#fff" opacity=".18" filter="url(#${id}bb)"/></g>`).join('')}
       <rect y="${H * .3}" width="${W}" height="${H * .12}" fill="#060a14" opacity=".9"/>
       ${Array.from({ length: 120 }, () => `<circle cx="${r() * W}" cy="${H * .31 + r() * H * .1}" r="${1 + r() * 2}" fill="${r() > .5 ? '#d4af37' : '#d0142c'}" opacity="${r() * .7}"/>`).join('')}
       ${carriles}`);
  }
  // terraza / semiformal
  return base(`<linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2347"/><stop offset=".5" stop-color="#6b2f3a"/><stop offset=".75" stop-color="#d07a3a"/><stop offset="1" stop-color="#f1d77f"/></linearGradient>`,
    `<rect width="${W}" height="${H}" fill="url(#${id}c)"/>
     <circle cx="${W * .55}" cy="${H * .72}" r="${W * .06}" fill="#fff3c4" opacity=".95"/>
     <path d="M0 ${H * .74} ${Array.from({ length: 26 }, (_, i) => `L${i * W / 25} ${H * (.62 + r() * .1)} L${i * W / 25 + W / 50} ${H * (.62 + r() * .1)}`).join(' ')} L${W} ${H * .74} L${W} ${H} L0 ${H} Z" fill="#14101a"/>
     <rect y="${H * .8}" width="${W}" height="${H * .2}" fill="#07080a"/>
     <g stroke="#d4af37" stroke-width="3" opacity=".8"><line x1="0" y1="${H * .8}" x2="${W}" y2="${H * .8}"/>${Array.from({ length: 30 }, (_, i) => `<line x1="${i * W / 29}" y1="${H * .8}" x2="${i * W / 29}" y2="${H}"/>`).join('')}</g>
     <g>${Array.from({ length: 14 }, (_, i) => `<circle cx="${i * W / 13}" cy="${H * .12 + Math.sin(i) * 12}" r="5" fill="#f1d77f"/><circle cx="${i * W / 13}" cy="${H * .12 + Math.sin(i) * 12}" r="16" fill="#f1d77f" opacity=".2"/>`).join('')}<path d="M0 ${H * .12} ${Array.from({ length: 14 }, (_, i) => `L${i * W / 13} ${H * .12 + Math.sin(i) * 12}`).join(' ')}" stroke="#2a2a2a" fill="none"/></g>`);
}
