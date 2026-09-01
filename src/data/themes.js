// 診断テーマ一覧
// テーマを増やしたいときは、この配列にオブジェクトを追加してください。
window.App = window.App || {};
window.App.themes = (function () {
const THEMES = [
  {
    id: "work",
    label: "仕事・転職",
    icon: "💼",
    description: "仕事、転職、キャリア、職場の人間関係、働き方など",
    accent: "work",
  },
  {
    id: "love",
    label: "恋愛・結婚",
    icon: "💕",
    description: "恋愛、結婚、パートナー、ご縁、片思いなど",
    accent: "love",
  },
  {
    id: "money",
    label: "お金・金運",
    icon: "💰",
    description: "収入、貯蓄、豊かさの流れなど",
    accent: "money",
  },
  {
    id: "family",
    label: "家族・人間関係",
    icon: "🏠",
    description: "家族、友人、大切な人とのつながりなど",
    accent: "family",
  },
  {
    id: "life",
    label: "人生・未来",
    icon: "🌙",
    description: "人生の方向性、転機、これからの未来など",
    accent: "life",
  },
  {
    id: "health",
    label: "健康・心",
    icon: "🌿",
    description: "心身の状態、休息、自分を大切にすることなど",
    accent: "health",
  },
  {
    id: "study",
    label: "学び・挑戦",
    icon: "📖",
    description: "勉強、新しいことへの挑戦、資格、成長など",
    accent: "study",
  },
];

function getThemeById(id) {
  return THEMES.find((t) => t.id === id);
}

return { THEMES, getThemeById };
})();
