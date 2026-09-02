// エンジェルナンバー一覧
// 新しい数字を増やしたいときは、この配列に追加するだけでOKです。
window.App = window.App || {};
window.App.angelNumbers = (function () {
  const ANGEL_NUMBERS = [
    "111", "222", "333", "444", "555", "666", "777", "888", "999",
    "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999",
    "11111", "22222", "33333", "44444", "55555", "66666", "77777", "88888", "99999",
    "111111", "222222", "333333", "444444", "555555", "666666", "777777", "888888", "999999",
  ];

  function isKnownAngelNumber(value) {
    return ANGEL_NUMBERS.includes(String(value).trim());
  }

  return { ANGEL_NUMBERS, isKnownAngelNumber };
})();
