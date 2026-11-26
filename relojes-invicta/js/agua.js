// Resistencia al agua: niveles, actividades e íconos (línea fina, estilo de la página)
export const ACTIVIDADES = [
  { id: 'lluvia', nombre: 'Salpicaduras', detalle: 'Lavarse las manos, lluvia, fregar',
    icono: '<path d="M4 13a8 8 0 0 1 16 0z"/><path d="M12 5v-2M12 13v6.5a2 2 0 0 1-4 0"/>' },
  { id: 'ducha', nombre: 'Ducha y natación', detalle: 'Ducha, piscina, nado en superficie',
    icono: '<path d="M5 21V7a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v1"/><path d="M10 11h8a4 4 0 0 0-8 0z"/><path d="M12 14v1.5M15 14v1.5M18 14v1.5M13.5 17.5v1.5M16.5 17.5v1.5"/>' },
  { id: 'deporte', nombre: 'Deportes acuáticos', detalle: 'Snorkel, surf, kayak, sin equipo',
    icono: '<circle cx="17.5" cy="6.5" r="2"/><path d="M4 12l5-3 3 3 4-2"/><path d="M2 16c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0"/><path d="M2 20c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0"/>' },
  { id: 'buceo', nombre: 'Buceo con tanque', detalle: 'Inmersiones con botella',
    icono: '<circle cx="17" cy="6" r="2"/><rect x="11" y="8" width="3.5" height="7" rx="1.5" transform="rotate(35 12.75 11.5)"/><path d="M15 9l-6 6-4 1M9 15l-1 4M13 13l2 3"/><path d="M19 13c.8 0 1.5.7 1.5 1.5M20 17c.6 0 1 .4 1 1"/>' },
];

export const NIVELES = [
  { metros: 30, atm: 3, apto: ['lluvia'] },
  { metros: 50, atm: 5, apto: ['lluvia', 'ducha'] },
  { metros: 100, atm: 10, apto: ['lluvia', 'ducha', 'deporte'] },
  { metros: 200, atm: 20, apto: ['lluvia', 'ducha', 'deporte', 'buceo'], mas: true },
];

export const metrosDe = (p) => parseInt(p?.agua || p?.specs?.['Resistencia al agua'] || '0', 10) || 0;
export function nivelDe(p) {
  const m = metrosDe(p);
  return [...NIVELES].reverse().find(n => m >= n.metros) || null;
}
export const icono = (a, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a.icono}</svg>`;
