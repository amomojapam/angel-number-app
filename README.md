# 天使からのメッセージ - エンジェルナンバー診断アプリ

ビルド不要、依存パッケージ不要の Web アプリです（HTML / CSS / JavaScript のみ）。

## 起動方法

`app/index.html` をダブルクリックして、ブラウザで開くだけで動作します（インストール不要）。

もしサーバー経由で開きたい場合は、このフォルダ（`app`）内で以下を実行し、`http://localhost:8080` を開いてください。

```bash
python3 -m http.server 8080
```

## フォルダ構成

```text
app/
  index.html          最初に読み込まれるページ
  styles.css          全体のデザイン
  src/
    main.js           画面の切り替えと描画ロジック
    data/
      angelNumbers.js  対応するエンジェルナンバー一覧
      themes.js        7つの診断テーマ
      cards.js         36枚のメッセージカードの定義
      messageEngine.js 数字×テーマ → カード・メッセージを組み立てるロジック
    components/
      angelMascot.js   天使キャラクター（SVG）
      motifIcons.js    カード中央のモチーフアイコン
  public/
    cards/             本物のカード画像を置く場所（後述）
    angel/             天使キャラクターの画像を置く場所（今後の拡張用）
```

## エンジェルナンバーを追加したい

`src/data/angelNumbers.js` の配列に数字を追加するだけです。

## テーマを追加・編集したい

`src/data/themes.js` を編集してください。

## カードの内容（タイトル・意味・アドバイスなど）を編集したい

- カードの基本情報（タイトル・モチーフ・意味）は `src/data/cards.js`
- テーマごとの文章パーツ、アドバイス、今日のひとことは `src/data/messageEngine.js`
- 「この数字×このテーマは必ずこの内容にしたい」という組み合わせは、
  `messageEngine.js` の `READING_OVERRIDES` に追加すると、自動生成より優先されます。

## カードイラストの差し替え

`public/cards/card-01.png` 〜 `card-36.png` に、実際のカードイラストを配置済みです（いただいた画像から自動で切り出しました）。
画像を入れ替えたいときは、同じファイル名で上書きするだけで反映されます（コードの変更は不要です）。
万一ファイルが見つからないカードがあれば、パステル×金縁のデザインが自動生成されて表示されます。

## 天使キャラクターを本物のイラストに差し替えたい

現在は SVG で描かれた簡易版キャラクターを使用しています。
`src/components/angelMascot.js` の `angelMascotSVG()` の戻り値を、
`<img src="public/angel/angel-main.png" ...>` のようなタグに差し替えることで、
実イラストへ切り替えられます。

---

## 公開先

- GitHub Pages: https://amomojapam.github.io/angel-number-app/
  （`main` ブランチに push すると数分で自動反映されます）

## 検索対策・アクセス解析について（要Googleアカウント作業）

コード側は対応済みですが、以下はGoogleアカウントでの操作が必要なため、私の方では実施していません。

### 1. Googleに登録して検索結果に出やすくする（Search Console）
1. https://search.google.com/search-console にアクセスし、Googleアカウントでログイン
2. 「URLプレフィックス」に `https://amomojapam.github.io/angel-number-app/` を入力し追加
3. 所有権の確認は「HTMLタグ」方式が簡単です（表示されたmetaタグを教えてもらえれば、私が `index.html` に追加します）
4. 確認後、サイドメニュー「サイトマップ」から `sitemap.xml` を送信

これでGoogleに「このサイトが存在する」と伝わり、徐々にインデックス（検索結果への掲載）が進みます。
ただし新規サイトが検索上位に出るには、内容の充実や被リンクなど時間のかかる要素も影響するため、即効性はない点はご了承ください。

### 2. アクセス解析（誰が何人見たか）
`index.html` にGoogle Analytics 4のコードをコメントアウトで用意済みです。
1. https://analytics.google.com/ でプロパティを作成し、測定ID（`G-`から始まるID）を取得
2. その測定IDを教えてもらえれば、私が `index.html` のコメントを外して設定します

もっと手軽な代替案として、GitHubの「Insights → Traffic」でも、リポジトリ自体の閲覧数・クローン数は無料で確認できます（設定不要）。

### 3. 多くの人に見てもらう
- 結果画面の「𝕏にシェアする」ボタンから、診断結果をXに投稿できます
- SNSでシェアした際に表示されるカード画像（OGP画像）も設定済みです（`public/og-image.jpg`）
