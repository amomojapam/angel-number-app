// カードの背景シーン（月・星・木・海・空など）を、モチーフごとに描く SVG パーツ。
// 天使キャラクター（angelMascot.js）と重ねて、カードの絵として表示します。
window.App = window.App || {};
window.App.sceneBackgrounds = (function () {

function stars(list) {
  return list
    .map(([x, y, r]) => `<path transform="translate(${x},${y}) scale(${r})" d="M0-6L1.6-1.2 6 0 1.6 1.2 0 6-1.6 1.2-6 0-1.6-1.2Z" fill="#fff8e4" opacity="0.9"/>`)
    .join("");
}

const SCENES = {
  star: () => `
    ${stars([[36,54,0.9],[160,40,1.1],[52,110,0.6],[150,150,0.8],[24,170,0.7],[172,100,0.6],[100,30,0.7]])}
    <path d="M100 60 L180 130" stroke="#fff8e4" stroke-width="1.5" opacity="0.5" stroke-linecap="round" stroke-dasharray="1 7"/>
  `,

  moon: () => `
    <defs>
      <mask id="crescent-mask">
        <rect x="0" y="0" width="200" height="300" fill="#fff"/>
        <circle cx="122" cy="214" r="42" fill="#000"/>
      </mask>
    </defs>
    ${stars([[34,50,0.7],[150,44,0.6],[26,130,0.6],[168,110,0.5],[100,30,0.5]])}
    <circle cx="100" cy="230" r="50" fill="#fff2c4" opacity="0.35"/>
    <circle cx="100" cy="230" r="48" fill="#ffedb0" mask="url(#crescent-mask)"/>
  `,

  wing: () => `
    <path d="M40 70 C10 90 10 130 40 150 C34 118 40 92 66 74 Z" fill="#fffdf7" opacity="0.85" stroke="#f1dcae" stroke-width="1.5"/>
    <path d="M160 70 C190 90 190 130 160 150 C166 118 160 92 134 74 Z" fill="#fffdf7" opacity="0.85" stroke="#f1dcae" stroke-width="1.5"/>
    ${stars([[100,40,0.6],[70,150,0.5],[130,150,0.5]])}
    <circle cx="100" cy="90" r="46" fill="#fff6df" opacity="0.35"/>
  `,

  flower: () => `
    <path d="M0 300 Q100 250 200 300 Z" fill="#e7f4e1"/>
    ${["46,264","86,278","134,272","166,258"].map((p) => {
      const [x,y] = p.split(",").map(Number);
      return `<g transform="translate(${x},${y})">
        <circle cx="0" cy="-8" r="7" fill="#ffd4e2"/><circle cx="8" cy="0" r="7" fill="#ffd4e2"/>
        <circle cx="0" cy="8" r="7" fill="#ffd4e2"/><circle cx="-8" cy="0" r="7" fill="#ffd4e2"/>
        <circle cx="0" cy="0" r="5" fill="#ffedb0"/>
        <line x1="0" y1="12" x2="0" y2="30" stroke="#8fbf8a" stroke-width="2"/>
      </g>`;
    }).join("")}
    <path d="M40 100 C50 90 60 100 50 112 C60 102 68 112 56 120" fill="none" stroke="#f2a5bd" stroke-width="2" opacity="0.7"/>
    <path d="M150 70 C160 60 170 70 160 82 C170 72 178 82 166 90" fill="none" stroke="#b9a3e0" stroke-width="2" opacity="0.7"/>
  `,

  heart: () => `
    ${[[40,60,10,'0.55'],[164,50,7,'0.5'],[30,140,7,'0.5'],[170,150,9,'0.45'],[100,36,6,'0.4']].map(([x,y,s,o]) =>
      `<path transform="translate(${x},${y}) scale(${s/17})" d="M8 17C-2 10-2 3 4 1 7 0 8 3 8 5 8 3 9 0 12 1 18 3 18 10 8 17Z" fill="#f6b6c6" opacity="${o}"/>`
    ).join("")}
    <circle cx="100" cy="110" r="70" fill="#fff0f4" opacity="0.4"/>
  `,

  rainbow: () => `
    <path d="M10 190 A90 90 0 0 1 190 190" fill="none" stroke="#f2a5bd" stroke-width="7" opacity="0.55"/>
    <path d="M26 190 A74 74 0 0 1 174 190" fill="none" stroke="#ffd9a0" stroke-width="7" opacity="0.55"/>
    <path d="M42 190 A58 58 0 0 1 158 190" fill="none" stroke="#bfe3c8" stroke-width="7" opacity="0.55"/>
    <path d="M58 190 A42 42 0 0 1 142 190" fill="none" stroke="#a9c9f0" stroke-width="7" opacity="0.55"/>
    <ellipse cx="14" cy="196" rx="26" ry="14" fill="#fff" opacity="0.85"/>
    <ellipse cx="186" cy="196" rx="26" ry="14" fill="#fff" opacity="0.85"/>
  `,

  crystal: () => `
    ${[[54,250,26,'#d9c9f5'],[100,262,34,'#c7b3ef'],[146,250,24,'#e6d9fb']].map(([x,y,s,c]) =>
      `<path transform="translate(${x},${y})" d="M0 ${-s} L${s*0.6} ${-s*0.2} L${s*0.35} ${s*0.5} L${-s*0.35} ${s*0.5} L${-s*0.6} ${-s*0.2} Z" fill="${c}" opacity="0.85"/>`
    ).join("")}
    ${stars([[40,60,0.6],[160,50,0.7],[100,30,0.5],[170,120,0.5]])}
  `,

  light: () => `
    <g opacity="0.5">
      ${Array.from({length:10}).map((_,i)=>{
        const a = (i/10)*Math.PI*2;
        const x2 = 100+Math.cos(a)*90, y2 = 90+Math.sin(a)*90;
        return `<line x1="100" y1="90" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#ffe7ad" stroke-width="3" stroke-linecap="round"/>`;
      }).join("")}
    </g>
    <circle cx="100" cy="90" r="34" fill="#fff6df"/>
    <circle cx="100" cy="90" r="34" fill="#ffedb0" opacity="0.6"/>
  `,

  cloud: () => `
    ${stars([[36,46,0.5],[164,54,0.5]])}
    <g transform="translate(100,236)">
      <ellipse cx="0" cy="0" rx="76" ry="22" fill="#ffffff"/>
      <ellipse cx="-36" cy="-10" rx="30" ry="20" fill="#ffffff"/>
      <ellipse cx="34" cy="-12" rx="34" ry="22" fill="#ffffff"/>
      <ellipse cx="4" cy="-20" rx="28" ry="18" fill="#ffffff"/>
    </g>
    <g transform="translate(46,110)" opacity="0.8">
      <ellipse cx="0" cy="0" rx="26" ry="9" fill="#ffffff"/><ellipse cx="-10" cy="-5" rx="11" ry="8" fill="#ffffff"/>
    </g>
  `,

  book: () => `
    ${stars([[40,50,0.5],[160,60,0.5],[100,34,0.5]])}
    <g transform="translate(100,246)">
      <rect x="-58" y="6" width="116" height="14" rx="3" fill="#e7c98f"/>
      <rect x="-50" y="-8" width="100" height="14" rx="3" fill="#f2a5bd" opacity="0.85"/>
      <rect x="-42" y="-22" width="84" height="14" rx="3" fill="#a9c9f0" opacity="0.85"/>
    </g>
  `,

  candle: () => `
    ${stars([[42,54,0.5],[158,50,0.5]])}
    <g transform="translate(100,250)">
      <circle cx="0" cy="-58" r="30" fill="#ffedb0" opacity="0.5"/>
      <rect x="-10" y="-40" width="20" height="40" rx="4" fill="#fff6df"/>
      <path d="M0 -66 C-6 -56 6 -50 0 -40 C-6 -50 6 -56 0 -66 Z" fill="#f6b64a"/>
    </g>
  `,

  tree: () => `
    ${stars([[36,44,0.5],[164,50,0.5]])}
    <g transform="translate(150,190)">
      <rect x="-8" y="20" width="16" height="70" rx="4" fill="#c79a6b"/>
      <circle cx="0" cy="0" r="42" fill="#bfe3c8"/>
      <circle cx="-26" cy="16" r="26" fill="#bfe3c8"/>
      <circle cx="26" cy="16" r="26" fill="#bfe3c8"/>
    </g>
    <path d="M40 240 q6-10 14 0 M60 254 q6-10 14 0" stroke="#8fbf8a" stroke-width="2" fill="none" opacity="0.7"/>
  `,

  bird: () => `
    <path d="M30 60 Q40 52 50 60 Q60 52 70 60" stroke="#a9c9f0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M120 90 Q130 82 140 90 Q150 82 160 90" stroke="#a9c9f0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M70 130 Q80 122 90 130 Q100 122 110 130" stroke="#a9c9f0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <g transform="translate(150,210)" opacity="0.85">
      <ellipse cx="0" cy="0" rx="24" ry="9" fill="#ffffff"/>
    </g>
  `,

  ocean: () => `
    <circle cx="100" cy="80" r="30" fill="#fff2c4" opacity="0.6"/>
    <path d="M0 230 Q20 220 40 230 T80 230 T120 230 T160 230 T200 230 V300 H0 Z" fill="#bcdcf0"/>
    <path d="M0 254 Q20 244 40 254 T80 254 T120 254 T160 254 T200 254 V300 H0 Z" fill="#a9cfea"/>
    <path d="M0 276 Q20 266 40 276 T80 276 T120 276 T160 276 T200 276 V300 H0 Z" fill="#93c1e3"/>
  `,
};

function sceneMarkup(motif) {
  const fn = SCENES[motif] || SCENES.star;
  return `<svg class="card-scene" viewBox="0 0 200 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${fn()}</svg>`;
}

// テーマごとに、カード上部の余白に添える小さな飾り。
function miniFigure(x, y, scale, color) {
  return `<g transform="translate(${x},${y}) scale(${scale})" opacity="0.9">
    <circle cx="0" cy="0" r="8" fill="${color}"/>
    <path d="M-7 10 C-7 22 7 22 7 10 C7 4 -7 4 -7 10 Z" fill="${color}"/>
  </g>`;
}

const THEME_DECOR = {
  work: () => `
    <g transform="translate(150,64)">
      <rect x="-13" y="-6" width="26" height="20" rx="4" fill="#b48a5a"/>
      <path d="M-7 -6 V-11 a7 7 0 0 1 14 0 V-6" fill="none" stroke="#b48a5a" stroke-width="3"/>
    </g>
    ${stars([[34,56,0.55],[168,96,0.45]])}
  `,
  love: () => `
    <path transform="translate(32,58) scale(0.9)" d="M8 17C-2 10-2 3 4 1 7 0 8 3 8 5 8 3 9 0 12 1 18 3 18 10 8 17Z" fill="#f2a5bd"/>
    <path transform="translate(160,80) scale(0.6)" d="M8 17C-2 10-2 3 4 1 7 0 8 3 8 5 8 3 9 0 12 1 18 3 18 10 8 17Z" fill="#f2a5bd" opacity="0.8"/>
  `,
  money: () => `
    ${[
      [26,50,11,"¥"],[54,32,7,"¥"],[176,36,8,"¥"],[156,60,10,"¥"],[178,90,8,"¥"],
      [22,94,8,"¥"],[46,120,10,"1000"],[92,62,6,"¥"],[130,100,12,"5000"],
      [166,130,7,"¥"],[14,138,6,"¥"],[100,138,8,"¥"],[144,72,6,"¥"],
    ].map(([x,y,r,label]) => `
      <g transform="translate(${x},${y})">
        <circle r="${r}" fill="#f6d879" stroke="#e0b84a" stroke-width="1.4"/>
        <circle r="${r - 2.4}" fill="none" stroke="#fff2c4" stroke-width="1" opacity="0.8"/>
        <text y="${label.length > 1 ? r * 0.32 : r * 0.34}" font-size="${label.length > 1 ? r * 0.62 : r}" text-anchor="middle" fill="#c99433" font-family="Georgia, serif" font-weight="${label.length > 1 ? 700 : 400}">${label}</text>
      </g>
    `).join("")}
    ${stars([[100,20,0.4],[190,30,0.35],[10,60,0.35]])}
  `,
  family: () => `
    ${miniFigure(38, 78, 1.1, "#f2c9a3")}
    ${miniFigure(56, 88, 0.75, "#f6ddb8")}
    <path d="M46 78 L48 86" stroke="#e8b892" stroke-width="2" stroke-linecap="round"/>
  `,
  life: () => `
    <path d="M30 90 Q80 40 165 55" fill="none" stroke="#c9bdf0" stroke-width="1.5" stroke-dasharray="1 6" stroke-linecap="round" opacity="0.8"/>
    ${stars([[165,55,0.7],[36,90,0.5]])}
  `,
  health: () => `
    <path d="M28 70 C24 58 34 52 40 60 C46 52 56 58 52 70 C48 78 40 84 40 84 C40 84 32 78 28 70 Z" fill="#a9d6ad" opacity="0.9"/>
    <path d="M120 90 H136 L140 78 L146 100 L150 90 H166" fill="none" stroke="#8fbf8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  `,
  study: () => `
    <g transform="translate(38,70)">
      <path d="M-16 -8 C-8 -12 0 -12 0 -8 C0 -12 8 -12 16 -8 V8 C8 4 0 4 0 8 C0 4 -8 4 -16 8 Z" fill="#a9c9f0"/>
    </g>
    ${stars([[160,54,0.55],[150,92,0.4]])}
  `,
};

function themeDecorMarkup(themeId) {
  const fn = THEME_DECOR[themeId];
  if (!fn) return "";
  return `<svg class="card-theme-decor" viewBox="0 0 200 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${fn()}</svg>`;
}

return { sceneMarkup, themeDecorMarkup };
})();
