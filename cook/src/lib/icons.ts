// Iconos de lucide como SVG inline, para usarlos desde scripts cliente
// (botones creados dinámicamente). En las plantillas .astro se usa el
// componente <Icon name="lucide:..."> de astro-icon.

function svg(inner: string, size = 20): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export const icons = {
  pause: svg('<rect x="14" y="3" width="4" height="18" rx="1"/><rect x="6" y="3" width="4" height="18" rx="1"/>'),
  play: svg('<polygon points="6 3 20 12 6 21 6 3"/>'),
  x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  timer: svg('<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>', 16),
};
