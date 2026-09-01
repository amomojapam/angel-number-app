// オリジナル天使キャラクターの SVG（かわいいデフォルメ・簡易ベクター版）。
// 本物のイラスト（例: public/angel/angel-main.png）が用意できたら、
// index.html 側の <img> に差し替えるだけで自動的にそちらが優先されます。
//
// pose: "default"（微笑み・星を持つ）/ "praying"（目を閉じて祈る＝演出用）
window.App = window.App || {};
window.App.angelMascot = (function () {
const HAIR = "#c9a17a";
const HAIR_DARK = "#b6885f";
const SKIN = "#fff2e8";
const BLUSH = "#ffc9c9";
const DRESS = "#ffffff";
const DRESS_SHADE = "#f3e9f7";
const HALO = "#eec164";
const WING = "#fffdf7";
const WING_EDGE = "#f1dcae";

function eyes(pose) {
  if (pose === "praying") {
    return `
      <path d="M74 96 Q80 90 86 96" fill="none" stroke="#6b4a34" stroke-width="3" stroke-linecap="round"/>
      <path d="M114 96 Q120 90 126 96" fill="none" stroke="#6b4a34" stroke-width="3" stroke-linecap="round"/>
    `;
  }
  return `
    <ellipse cx="80" cy="98" rx="9" ry="11" fill="#5a3f2c"/>
    <ellipse cx="120" cy="98" rx="9" ry="11" fill="#5a3f2c"/>
    <circle cx="83" cy="93" r="2.6" fill="#fff"/>
    <circle cx="123" cy="93" r="2.6" fill="#fff"/>
    <path d="M72 88 Q80 83 88 88" fill="none" stroke="#6b4a34" stroke-width="2" stroke-linecap="round"/>
    <path d="M112 88 Q120 83 128 88" fill="none" stroke="#6b4a34" stroke-width="2" stroke-linecap="round"/>
  `;
}

function arms(pose) {
  if (pose === "praying") {
    return `<path d="M84 168 Q100 150 116 168 L112 182 Q100 172 88 182 Z" fill="${SKIN}"/>`;
  }
  return `
    <path d="M70 168 Q52 160 48 178 Q60 186 76 178 Z" fill="${SKIN}"/>
    <path d="M130 168 Q148 158 154 172 Q140 188 124 180 Z" fill="${SKIN}"/>
    <g transform="translate(150,158)">
      <path d="M8 0 L10 6 L16 7 L10.5 10.5 L12 17 L8 13.2 L4 17 L5.5 10.5 L0 7 L6 6 Z" fill="${HALO}"/>
    </g>
  `;
}

function angelMascotSVG({ pose = "default", size = 160, className = "" } = {}) {
  return `
  <svg class="angel-mascot ${className}" width="${size}" height="${size}" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="天使キャラクター">
    <ellipse cx="100" cy="205" rx="46" ry="8" fill="#f3e3ea" opacity="0.6"/>

    <!-- wings -->
    <path d="M100 130 C56 110 30 130 20 100 C46 96 66 112 100 150 Z" fill="${WING}" stroke="${WING_EDGE}" stroke-width="2"/>
    <path d="M100 130 C144 110 170 130 180 100 C154 96 134 112 100 150 Z" fill="${WING}" stroke="${WING_EDGE}" stroke-width="2"/>

    <!-- halo -->
    <ellipse cx="100" cy="46" rx="26" ry="8" fill="none" stroke="${HALO}" stroke-width="5"/>

    <!-- hair back -->
    <path d="M60 100 C54 60 74 34 100 34 C126 34 146 60 140 100 C138 118 130 100 128 92 C120 106 80 106 72 92 C70 100 62 118 60 100 Z" fill="${HAIR}"/>

    <!-- dress body -->
    <path d="M100 128 C74 128 60 150 58 182 C58 196 142 196 142 182 C140 150 126 128 100 128 Z" fill="${DRESS}"/>
    <path d="M100 128 C90 128 82 134 78 144 C88 150 112 150 122 144 C118 134 110 128 100 128 Z" fill="${DRESS_SHADE}"/>

    ${arms(pose)}

    <!-- head -->
    <circle cx="100" cy="96" r="52" fill="${SKIN}"/>

    <!-- hair front -->
    <path d="M48 92 C46 58 70 30 100 30 C130 30 154 58 152 92 C150 76 140 66 132 70 C126 58 112 52 100 52 C88 52 74 58 68 70 C60 66 50 76 48 92 Z" fill="${HAIR}"/>
    <path d="M64 78 C70 66 84 58 100 58 C116 58 130 66 136 78 C128 72 116 66 100 66 C84 66 72 72 64 78 Z" fill="${HAIR_DARK}" opacity="0.5"/>

    <!-- face -->
    ${eyes(pose)}
    <ellipse cx="66" cy="110" rx="9" ry="5.5" fill="${BLUSH}" opacity="0.7"/>
    <ellipse cx="134" cy="110" rx="9" ry="5.5" fill="${BLUSH}" opacity="0.7"/>
    <path d="M92 116 Q100 122 108 116" fill="none" stroke="#a9704e" stroke-width="2.4" stroke-linecap="round"/>

    <!-- star accessory -->
    <g transform="translate(60,54)">
      <path d="M6 0 L7.6 4.4 L12 4.4 L8.4 7.2 L9.8 11.6 L6 9 L2.2 11.6 L3.6 7.2 L0 4.4 L4.4 4.4 Z" fill="${HALO}"/>
    </g>
  </svg>`;
}

return { angelMascotSVG };
})();
