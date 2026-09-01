// カードの中央に表示する、モチーフごとの小さなアイコン（SVG）。
// currentColor を使っているので、CSS 側の color 指定で色が変わります。
window.App = window.App || {};
window.App.motifIcons = (function () {
const ICONS = {
  star: `<path d="M32 6 L38 24 L57 24 L41.5 35 L47.5 54 L32 43 L16.5 54 L22.5 35 L7 24 L26 24 Z"/>`,
  moon: `<path d="M40 10 C25 10 14 22 14 36 C14 50 25 58 38 58 C27 55 20 46 20 34 C20 22 28 13 40 10 Z"/>`,
  wing: `<path d="M32 50 C24 40 10 34 8 16 C20 18 28 26 32 36 C36 26 44 18 56 16 C54 34 40 40 32 50 Z"/>`,
  flower: `<circle cx="32" cy="20" r="8"/><circle cx="32" cy="44" r="8"/><circle cx="20" cy="32" r="8"/><circle cx="44" cy="32" r="8"/><circle cx="32" cy="32" r="7"/>`,
  heart: `<path d="M32 54 C10 38 6 24 16 15 C24 8 32 14 32 22 C32 14 40 8 48 15 C58 24 54 38 32 54 Z"/>`,
  rainbow: `<path d="M8 46 A24 24 0 0 1 56 46" fill="none" stroke-width="5"/><path d="M16 46 A16 16 0 0 1 48 46" fill="none" stroke-width="5"/><path d="M24 46 A8 8 0 0 1 40 46" fill="none" stroke-width="5"/>`,
  crystal: `<path d="M32 6 L48 22 L40 56 L24 56 L16 22 Z"/><path d="M16 22 L48 22 M24 56 L32 22 L40 56" stroke-width="2" fill="none"/>`,
  light: `<path d="M32 6 L36 26 L56 30 L36 34 L32 54 L28 34 L8 30 L28 26 Z"/>`,
  cloud: `<path d="M18 40 C10 40 8 30 16 28 C16 18 32 16 36 26 C46 24 52 34 46 40 C50 46 44 50 38 48 L20 48 C12 50 10 42 18 40 Z"/>`,
  book: `<path d="M32 14 C26 10 16 10 10 14 V48 C16 44 26 44 32 48 C38 44 48 44 54 48 V14 C48 10 38 10 32 14 Z"/><line x1="32" y1="14" x2="32" y2="48" stroke-width="2"/>`,
  candle: `<path d="M26 58 H38 V26 H26 Z"/><path d="M32 20 C28 14 30 8 32 4 C34 8 36 14 32 20 Z"/>`,
  tree: `<path d="M32 6 L46 28 H38 L48 42 H36 V58 H28 V42 H16 L26 28 H18 Z"/>`,
  bird: `<path d="M10 34 C18 24 30 22 36 28 C44 22 54 24 56 30 C48 28 42 32 40 36 C46 38 50 44 48 50 C42 44 34 42 30 36 C24 42 14 42 10 36 C16 36 20 32 22 30 C16 30 12 32 10 34 Z"/>`,
};

function motifIconMarkup(motif) {
  return ICONS[motif] || ICONS.star;
}

return { motifIconMarkup };
})();
