// 天使からのメッセージカード（36枚）
// カードを増やしたいときは、この配列に id:37, 38... を追加してください。
// image は public/cards/ 配下の画像ファイル名です。
// ファイルが用意されていない間は、motif / palette から自動でカードデザインを生成します。
// 実際のイラストを用意できたら、public/cards/card-01.png のように置くだけで自動的に差し替わります。
window.App = window.App || {};
window.App.cards = (function () {
const CARDS = [
  { id: 1, title: "新しい始まり", motif: "star", palette: "gold", coreMeaning: "新しい一歩を踏み出すのにふさわしいタイミングです。", image: "cards/card-01.png" },
  { id: 2, title: "扉の向こう", motif: "light", palette: "lavender", coreMeaning: "見えなかった扉が、そっと開かれようとしています。", image: "cards/card-02.png" },
  { id: 3, title: "愛のご縁", motif: "heart", palette: "pink", coreMeaning: "心を開くことで、あたたかなご縁が近づいてきます。", image: "cards/card-03.png" },
  { id: 4, title: "豊かさの流れ", motif: "crystal", palette: "gold", coreMeaning: "豊かさは、思っている以上にあなたの近くを流れています。", image: "cards/card-04.png" },
  { id: 5, title: "守られている", motif: "wing", palette: "cream", coreMeaning: "見えない存在が、いつもそばであなたを見守っています。", image: "cards/card-05.png" },
  { id: 6, title: "直感を信じて", motif: "star", palette: "blue", coreMeaning: "ふと感じたその直感は、あなたを導く小さなサインです。", image: "cards/card-06.png" },
  { id: 7, title: "願いが叶う時", motif: "light", palette: "gold", coreMeaning: "あなたの願いは、静かに宇宙へ届いています。", image: "cards/card-07.png" },
  { id: 8, title: "希望の光", motif: "rainbow", palette: "blue", coreMeaning: "曇り空の先にも、ちゃんと光は差し込んでいます。", image: "cards/card-08.png" },
  { id: 9, title: "手放しの時", motif: "cloud", palette: "lavender", coreMeaning: "手放すことで、新しい流れが入ってくる余白が生まれます。", image: "cards/card-09.png" },
  { id: 10, title: "安定の土台", motif: "tree", palette: "mint", coreMeaning: "焦らなくても、あなたの足元にはしっかりとした土台があります。", image: "cards/card-10.png" },
  { id: 11, title: "行動の力", motif: "star", palette: "gold", coreMeaning: "小さな一歩が、未来を静かに動かし始めます。", image: "cards/card-11.png" },
  { id: 12, title: "内なる光", motif: "light", palette: "lavender", coreMeaning: "あなたの中には、ちゃんと光が灯っています。", image: "cards/card-12.png" },
  { id: 13, title: "自己を育てる", motif: "flower", palette: "pink", coreMeaning: "自分を大切に育てることが、すべての始まりになります。", image: "cards/card-13.png" },
  { id: 14, title: "成功への道", motif: "crystal", palette: "gold", coreMeaning: "積み重ねてきた努力は、確かな形になろうとしています。", image: "cards/card-14.png" },
  { id: 15, title: "人生の目的", motif: "moon", palette: "lavender", coreMeaning: "あなたの魂は、静かに使命へと向かっています。", image: "cards/card-15.png" },
  { id: 16, title: "癒しの時間", motif: "cloud", palette: "mint", coreMeaning: "心と体を休ませてあげる時間も、大切な一歩です。", image: "cards/card-16.png" },
  { id: 17, title: "変化を楽しむ", motif: "bird", palette: "blue", coreMeaning: "変化は、成長のための優しいきっかけです。", image: "cards/card-17.png" },
  { id: 18, title: "感謝の気持ち", motif: "flower", palette: "pink", coreMeaning: "感謝の気持ちが、さらに温かい流れを引き寄せます。", image: "cards/card-18.png" },
  { id: 19, title: "つながりを大切に", motif: "heart", palette: "pink", coreMeaning: "大切な人とのつながりが、あなたをそっと支えています。", image: "cards/card-19.png" },
  { id: 20, title: "学びの時", motif: "book", palette: "blue", coreMeaning: "今学んでいることが、未来のあなたをきっと助けてくれます。", image: "cards/card-20.png" },
  { id: 21, title: "クリエイティブな力", motif: "candle", palette: "lavender", coreMeaning: "あなたの中の創造性が、輝きたがっています。", image: "cards/card-21.png" },
  { id: 22, title: "バランスをとる", motif: "moon", palette: "mint", coreMeaning: "心と体、仕事と休息のバランスを、少し見直してみましょう。", image: "cards/card-22.png" },
  { id: 23, title: "信頼する心", motif: "star", palette: "gold", coreMeaning: "すべてはうまくいく、と信じる心が道を照らします。", image: "cards/card-23.png" },
  { id: 24, title: "積み重ねの力", motif: "tree", palette: "mint", coreMeaning: "小さな積み重ねが、大きな未来をつくっています。", image: "cards/card-24.png" },
  { id: 25, title: "過去の癒し", motif: "cloud", palette: "lavender", coreMeaning: "過去を優しく癒すことで、未来がやわらかくなります。", image: "cards/card-25.png" },
  { id: 26, title: "素直な心", motif: "flower", palette: "pink", coreMeaning: "素直な心が、思いがけない幸運を引き寄せます。", image: "cards/card-26.png" },
  { id: 27, title: "夢を描く", motif: "star", palette: "gold", coreMeaning: "心に描いた夢は、ちゃんと未来への地図になります。", image: "cards/card-27.png" },
  { id: 28, title: "今を楽しむ", motif: "rainbow", palette: "blue", coreMeaning: "この瞬間を楽しむことも、大切な生き方のひとつです。", image: "cards/card-28.png" },
  { id: 29, title: "リセットの時", motif: "candle", palette: "lavender", coreMeaning: "心をリセットして、新しいスタートを切るタイミングです。", image: "cards/card-29.png" },
  { id: 30, title: "自分のペースで", motif: "cloud", palette: "mint", coreMeaning: "あなたのペースで進めば、それでもう十分です。", image: "cards/card-30.png" },
  { id: 31, title: "心の声を聞く", motif: "moon", palette: "lavender", coreMeaning: "心の声に耳を澄ませると、本当の望みが見えてきます。", image: "cards/card-31.png" },
  { id: 32, title: "光を放つ", motif: "light", palette: "gold", coreMeaning: "あなたの光が、まわりを明るく照らし始めています。", image: "cards/card-32.png" },
  { id: 33, title: "冒険心を持つ", motif: "bird", palette: "blue", coreMeaning: "新しいことに、ワクワクしながら挑戦してみましょう。", image: "cards/card-33.png" },
  { id: 34, title: "受け取る準備", motif: "crystal", palette: "gold", coreMeaning: "幸せやサポートを、素直に受け取る準備をしましょう。", image: "cards/card-34.png" },
  { id: 35, title: "無限の可能性", motif: "star", palette: "lavender", coreMeaning: "あなたには、まだ気づいていない可能性が眠っています。", image: "cards/card-35.png" },
  { id: 36, title: "平和な心", motif: "wing", palette: "cream", coreMeaning: "心の平和が、すべての土台になってくれます。", image: "cards/card-36.png" },
];

function getCardById(id) {
  return CARDS.find((c) => c.id === id);
}

return { CARDS, getCardById };
})();
