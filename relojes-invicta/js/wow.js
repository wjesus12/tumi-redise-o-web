// Efecto "wow" para fotos de relojes: inclinación 3D que sigue al cursor,
// destello metálico al entrar y resplandor dorado detrás del reloj.
// Se aplica a cualquier elemento con el atributo [data-wow] (también a los creados después).
const MAX = 10; // grados de inclinación máxima

export function iniciarWow() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let actual = null;

  const entrar = (el) => {
    if (!el.querySelector(':scope > .wow-halo')) el.insertAdjacentHTML('afterbegin', '<span class="wow-halo" aria-hidden="true"></span>');
    el.classList.add('wow-activo');
    el.classList.remove('wow-brillo'); void el.offsetWidth; el.classList.add('wow-brillo');
  };
  const salir = (el) => {
    el.classList.remove('wow-activo');
    el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
  };

  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('[data-wow]');
    if (el !== actual) { if (actual) salir(actual); actual = el; if (el) entrar(el); }
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(x - .5) * MAX * 2}deg`);
    el.style.setProperty('--rx', `${(.5 - y) * MAX * 1.4}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    const halo = el.querySelector(':scope > .wow-halo');
    if (halo) { halo.style.left = `${x * 100 - 30}%`; halo.style.top = `${y * 100 - 30}%`; }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { if (actual) salir(actual); actual = null; });
  document.addEventListener('animationend', (e) => { if (e.animationName === 'destello') e.target.classList.remove('wow-brillo'); });
}
