const { isKnownAngelNumber } = window.App.angelNumbers;
const { THEMES } = window.App.themes;
const { getReading } = window.App.messageEngine;
const { angelMascotSVG } = window.App.angelMascot;
const { sceneMarkup, themeDecorMarkup } = window.App.sceneBackgrounds;
const { recordNumberView, getTodayTop, createPost, getRecentPosts } = window.App.firebaseClient;

// モチーフごとに、カードの中の天使のポーズ・小物を決めます。
const MOTIF_STYLE = {
  star: { pose: "default", prop: "star" },
  moon: { pose: "sitting", prop: "star" },
  wing: { pose: "default", prop: "none" },
  flower: { pose: "default", prop: "leaf" },
  heart: { pose: "default", prop: "heart" },
  rainbow: { pose: "default", prop: "star" },
  crystal: { pose: "default", prop: "light" },
  light: { pose: "default", prop: "light" },
  cloud: { pose: "sitting", prop: "star" },
  book: { pose: "sitting", prop: "none" },
  candle: { pose: "sitting", prop: "light" },
  tree: { pose: "sitting", prop: "leaf" },
  bird: { pose: "default", prop: "none" },
  ocean: { pose: "default", prop: "light" },
};

// 全角数字（０-９）を半角数字に変換します。
function toHalfWidthDigits(str) {
  return str.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
}

// ---------------------------------------------------------------
// マイエンジェルナンバー（生年月日から算出する、自分自身の数字）
// ---------------------------------------------------------------
const MASTER_NUMBERS = [11, 22, 33, 44, 55, 66, 77, 88, 99];

function sumDigits(str) {
  return String(str)
    .split("")
    .reduce((sum, ch) => sum + (Number.isNaN(Number(ch)) ? 0 : Number(ch)), 0);
}

// 生年月日（YYYY-MM-DD）から、マイエンジェルナンバーを計算します。
// 1桁になるまで各桁を足し合わせますが、11・22・33…などのマスターナンバーが出たらそこで止めます。
function calcMyAngelNumber(dateStr) {
  const digitsOnly = dateStr.replace(/[^0-9]/g, "");
  let n = sumDigits(digitsOnly);
  while (n > 9 && !MASTER_NUMBERS.includes(n)) {
    n = sumDigits(String(n));
  }
  return n;
}

// マイエンジェルナンバーを、既存のカード診断エンジンで扱える形式に変換します。
// 例）5 → "555" / 11 → "1111"
function myNumberToLookupKey(n) {
  const s = String(n);
  return s.length >= 2 ? s.repeat(2) : s.repeat(3);
}

const app = document.getElementById("app");

const SUGGESTED_NUMBERS = ["111", "222", "333", "444", "555", "777", "888", "1111", "2222", "111111"];
const SITE_URL = "https://amomojapam.github.io/angel-number-app/";

const state = {
  step: "top", // top | theme | loading | result | postForm | feed | myNumberForm | myNumberResult
  number: "",
  selectedThemeId: null,
  inputError: "",
  reading: null,
  trending: null, // null=未取得 / []=0件 / [{number,count}, ...]
  postForm: { number: "", comment: "", imageDataUrl: null, submitting: false, error: "" },
  feedPosts: null, // null=未取得 / []=0件 / [{id,number,comment,imageDataUrl,createdAt}, ...]
  topPosts: null, // TOP画面に出す、みんなの投稿プレビュー（最大5件）
  myNumberForm: { themeId: null, birthdate: "", error: "" },
  myNumberReading: null, // { n, lookupNumber, reading } のセット
};

const MEDALS = ["🥇", "🥈", "🥉"];

function trendingBoxMarkup() {
  if (!state.trending || state.trending.length === 0) return "";
  return `
    <div class="panel trending-panel">
      <p class="section-title" style="margin-top:0;">✦ 今日、みんなが気になっているエンジェルナンバー</p>
      <ul class="trending-list">
        ${state.trending
          .map(
            (t, i) => `
          <li>
            <span class="trending-medal">${MEDALS[i] || "✦"}</span>
            <button type="button" class="trending-number" data-action="fill-number" data-value="${t.number}">${t.number}</button>
          </li>`
          )
          .join("")}
      </ul>
    </div>
  `;
}

let trendingRequested = false;
function loadTrendingIfNeeded() {
  if (trendingRequested) return;
  trendingRequested = true;
  getTodayTop(3).then((results) => {
    state.trending = results;
    const box = document.getElementById("trendingBox");
    if (box) box.innerHTML = trendingBoxMarkup();
  });
}

function topPostsBoxMarkup() {
  if (!state.topPosts || state.topPosts.length === 0) return "";
  return `
    <div class="top-posts-section">
      <p class="section-title" style="margin-top:0;">✦ みんなが見つけたエンジェルナンバー</p>
      ${state.topPosts.map(postCardMarkup).join("")}
      <button type="button" class="btn-text" data-action="go-feed">もっと見る →</button>
    </div>
  `;
}

let topPostsRequested = false;
function loadTopPostsIfNeeded() {
  if (topPostsRequested) return;
  topPostsRequested = true;
  getRecentPosts(5).then((posts) => {
    state.topPosts = posts;
    const box = document.getElementById("topPostsBox");
    if (box) box.innerHTML = topPostsBoxMarkup();
  });
}

// ---------------------------------------------------------------
// 星の背景演出
// ---------------------------------------------------------------
function initStarField() {
  const field = document.getElementById("star-field");
  const count = 30;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    const size = 2 + Math.random() * 3;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.animationDelay = `${Math.random() * 4.5}s`;
    s.style.animationDuration = `${3.5 + Math.random() * 3}s`;
    field.appendChild(s);
  }
}

// ---------------------------------------------------------------
// カードの HTML を組み立てる（天使キャラクター + シーンイラスト）
// ---------------------------------------------------------------
function cardFaceMarkup(card, themeId) {
  const style = MOTIF_STYLE[card.motif] || MOTIF_STYLE.star;
  return `
    <div class="card-face" style="--face-1:var(--card-${card.palette}-1); --face-2:var(--card-${card.palette}-2); --face-edge:var(--card-${card.palette}-edge);">
      <span class="card-corner tl"></span><span class="card-corner tr"></span>
      <span class="card-corner bl"></span><span class="card-corner br"></span>
      <div class="card-inner">
        <div class="card-scene-wrap">${sceneMarkup(card.motif)}</div>
        <div class="card-scene-wrap">${themeDecorMarkup(themeId)}</div>
        <div class="card-mascot-wrap">${angelMascotSVG({ pose: style.pose, prop: style.prop, size: 132 })}</div>
        <div class="card-number">No. ${String(card.id).padStart(2, "0")}</div>
        <div class="card-title">${card.title}</div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------
// 画面: TOP（数字入力）
// ---------------------------------------------------------------
function renderTop() {
  return `
    <div class="screen">
      <div class="mascot-wrap">${angelMascotSVG({ pose: "default", size: 148 })}</div>
      <p class="mascot-speech">「こんにちは。私はあなたのメッセージを届ける天使です。」</p>

      <p class="brand-eyebrow">ANGEL NUMBER MESSAGE</p>
      <h1 class="title-main">あなたに届いた<br />エンジェルナンバー</h1>
      <p class="lede">
        最近、なぜか気になる数字はありませんか？<br />
        何度も目にする数字には、あなたへのメッセージが込められているかもしれません。
      </p>

      <div class="panel">
        <label class="field-label" for="numberInput">気になる数字を入力してください（3〜6桁）</label>
        <input
          id="numberInput"
          class="number-input"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="6"
          placeholder="1111"
          value="${state.number}"
        />
        <p class="error-text">${state.inputError}</p>

        <div class="suggest-row">
          ${SUGGESTED_NUMBERS.map((n) => `<button type="button" class="suggest-chip" data-action="fill-number" data-value="${n}">${n}</button>`).join("")}
        </div>

        <button type="button" class="btn-primary" data-action="submit-number" ${state.number.trim() === "" ? "disabled" : ""}>
          メッセージを受け取る →
        </button>
      </div>

      <div id="trendingBox">${trendingBoxMarkup()}</div>

      <div class="community-links">
        <button type="button" class="btn-outline" data-action="go-mynumber">✧ マイエンジェルナンバーを調べる</button>
        <button type="button" class="btn-outline" data-action="go-post">✧ わたしが見つけたエンジェルナンバーを投稿する</button>
      </div>

      <div id="topPostsBox">${topPostsBoxMarkup()}</div>

      <p class="footer-note">
        <a href="guide.html" style="color:inherit;">✧ エンジェルナンバーの意味一覧を見る</a>
      </p>
      <p class="footer-note">
        <a href="contact.html" style="color:inherit;">✧ お問い合わせ</a>
      </p>
      <p class="footer-note">🕊 本アプリはエンターテインメントを目的としています。<br />医療・法律・投資などの専門的判断に代わるものではありません。</p>
    </div>
  `;
}

// ---------------------------------------------------------------
// 画面: テーマ選択
// ---------------------------------------------------------------
function renderTheme() {
  return `
    <div class="screen">
      <button type="button" class="step-back" data-action="back-to-top">← 数字を入力し直す</button>

      <div class="mascot-wrap">${angelMascotSVG({ pose: "default", size: 108 })}</div>
      <p class="mascot-speech">「あなたが知りたいことは、どれですか？」</p>
      <h1 class="title-main" style="font-size:20px;margin-top:6px;">ANGEL NUMBER<br />${state.number}</h1>

      <div class="theme-grid">
        ${THEMES.map((t) => `
          <button type="button" class="theme-card"
            style="--tint-bg:var(--theme-${t.accent}-bg); --tint-fg:var(--theme-${t.accent}-fg);"
            data-action="select-theme" data-id="${t.id}">
            <span class="icon">${t.icon}</span>
            <span>${t.label}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------
// 画面: ローディング（演出）
// ---------------------------------------------------------------
function renderLoading() {
  return `
    <div class="screen loading-screen">
      <div style="position:relative; display:flex; align-items:center; justify-content:center;">
        <div class="loading-glow"></div>
        ${angelMascotSVG({ pose: "praying", size: 128, className: "" })}
      </div>
      <div class="loading-card-ghost"></div>
      <p class="loading-text">天使があなたのメッセージを<br />選んでいます…</p>
      <p class="loading-sub">✧ もう少しだけお待ちくださいね ✧</p>
    </div>
  `;
}

// ---------------------------------------------------------------
// 画面: 結果
// ---------------------------------------------------------------
function renderResult() {
  const r = state.reading;
  const theme = r.theme;
  return `
    <div class="screen">
      <p class="result-ribbon">✧ ANGEL NUMBER ✧</p>
      <p class="result-number">${r.number}</p>
      <div class="result-theme-tag" style="--tint-bg:var(--theme-${theme.accent}-bg); --tint-fg:var(--theme-${theme.accent}-fg);">
        <span>${theme.icon}</span><span>${theme.label}</span>
      </div>

      <div class="card-stage">${cardFaceMarkup(r.card, r.theme.id)}</div>

      <h2 class="section-title">✦ 今のあなたへのメッセージ</h2>
      <div class="message-text">
        <p style="font-weight:600;">${r.summary}</p>
        ${r.message.map((p) => `<p>${p}</p>`).join("")}
      </div>

      <h2 class="section-title">✦ 天使からのアドバイス</h2>
      <ul class="advice-list">
        ${r.advice.map((a) => `<li><span class="star">★</span><span>${a}</span></li>`).join("")}
      </ul>

      <div class="today-word">
        <div class="section-title" style="justify-content:center;margin:0 0 6px;">✦ 今日のひとこと</div>
        「${r.todayWord}」
      </div>

      <div class="result-actions">
        <a class="btn-share-x" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `【${r.number}】のエンジェルナンバー診断\n「${r.card.title}」\n${r.summary}\n\n#エンジェルナンバー #天使からのメッセージ`
        )}&url=${encodeURIComponent(SITE_URL)}" target="_blank" rel="noopener noreferrer">𝕏 にシェアする</a>
        <a class="btn-share-line" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(
          `【${r.number}】のエンジェルナンバー診断「${r.card.title}」\n${r.summary}`
        )}" target="_blank" rel="noopener noreferrer">LINEでシェアする</a>
        <button type="button" class="btn-outline" data-action="replay">↻ もう一度見る</button>
        <button type="button" class="btn-primary" data-action="another-theme">別のテーマで見る →</button>
        <button type="button" class="btn-text" data-action="go-post" data-value="${r.number}">✧ この数字を見つけたことを投稿する</button>
      </div>

      <div class="result-mascot-row">
        ${angelMascotSVG({ pose: "default", size: 64 })}
        <p class="mascot-speech">あなたに必要なメッセージを<br />受け取ってくださいね。</p>
      </div>

      <p class="footer-note">✧ あなたの毎日が、愛と光に包まれますように ✧</p>
    </div>
  `;
}

// ---------------------------------------------------------------
// 画面: 投稿フォーム（私が見つけたエンジェルナンバー）
// ---------------------------------------------------------------
function renderPostForm() {
  const f = state.postForm;
  return `
    <div class="screen">
      <button type="button" class="step-back" data-action="back-to-top">← トップへ戻る</button>

      <div class="mascot-wrap">${angelMascotSVG({ pose: "default", size: 108 })}</div>
      <h1 class="title-main" style="font-size:22px;">わたしが見つけた<br />エンジェルナンバー</h1>
      <p class="lede">見つけた数字と、そのときの様子を教えてください。<br />みんなの投稿ページに載ります。</p>

      <div class="panel">
        <label class="field-label" for="postNumberInput">見つけた数字</label>
        <input
          id="postNumberInput"
          class="number-input"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="6"
          placeholder="1111"
          value="${f.number}"
        />
        <div class="suggest-row">
          ${SUGGESTED_NUMBERS.map((n) => `<button type="button" class="suggest-chip" data-action="post-fill-number" data-value="${n}">${n}</button>`).join("")}
        </div>

        <label class="field-label" for="postComment" style="margin-top:16px;">見つけたときの様子（任意）</label>
        <textarea
          id="postComment"
          class="post-textarea"
          maxlength="200"
          placeholder="例）駅の時計がぴったり11:11で、なんだか嬉しくなりました。"
        >${f.comment}</textarea>

        <label class="field-label" style="margin-top:16px;">写真を追加（任意）</label>
        <input id="postPhotoInput" type="file" accept="image/*" class="post-file-input" />
        <img id="postPhotoPreview" class="post-photo-preview" style="${f.imageDataUrl ? "" : "display:none;"}" src="${f.imageDataUrl || ""}" alt="プレビュー" />

        <p class="error-text">${f.error}</p>

        <button type="button" class="btn-primary" data-action="submit-post" ${f.submitting ? "disabled" : ""}>
          ${f.submitting ? "投稿しています…" : "投稿する →"}
        </button>
      </div>

      <p class="footer-note">🕊 公序良俗に反する内容・第三者が写り込む写真の投稿はご遠慮ください。<br />投稿内容はどなたでも閲覧できます。</p>
    </div>
  `;
}

// ---------------------------------------------------------------
// 画面: みんなの投稿
// ---------------------------------------------------------------
function postCardMarkup(post) {
  const reading = isKnownAngelNumber(post.number) ? getReading(post.number, "life") : null;
  const photo = post.imageDataUrl
    ? `<img class="post-feed-photo" src="${post.imageDataUrl}" alt="${post.number} の投稿画像" />`
    : "";
  const shareText = [
    `【${post.number}】のエンジェルナンバーを見つけました`,
    post.comment || "",
    reading ? `「${reading.card.title}」${reading.summary}` : "",
    "",
    "#エンジェルナンバー #天使からのメッセージ",
  ]
    .filter(Boolean)
    .join("\n");
  const shareHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL)}`;
  return `
    <div class="post-feed-card">
      ${photo}
      <div class="post-feed-body">
        <div class="post-feed-number">${post.number}</div>
        ${post.comment ? `<p class="post-feed-comment">${post.comment}</p>` : ""}
        ${
          reading
            ? `<div class="post-feed-reading">
                <span class="post-feed-reading-title">${reading.card.title}</span>
                <span class="post-feed-reading-text">${reading.summary}</span>
              </div>`
            : ""
        }
        <a class="btn-share-x post-feed-share" href="${shareHref}" target="_blank" rel="noopener noreferrer">𝕏 にシェアする</a>
      </div>
    </div>
  `;
}

function renderFeed() {
  return `
    <div class="screen">
      <button type="button" class="step-back" data-action="back-to-top">← トップへ戻る</button>

      <div class="mascot-wrap">${angelMascotSVG({ pose: "default", size: 108 })}</div>
      <h1 class="title-main" style="font-size:22px;">みんなが見つけた<br />エンジェルナンバー</h1>
      <p class="lede">みんなの投稿と、天使からのメッセージです。</p>

      <button type="button" class="btn-primary" style="margin-bottom:18px;" data-action="go-post">✧ わたしも投稿する</button>

      <div id="feedList">
        ${
          state.feedPosts === null
            ? `<p class="lede">読み込んでいます…</p>`
            : state.feedPosts.length === 0
              ? `<p class="lede">まだ投稿がありません。最初の投稿をしてみませんか？</p>`
              : state.feedPosts.map(postCardMarkup).join("")
        }
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------
// 画面: マイエンジェルナンバー診断（フォーム）
// ---------------------------------------------------------------
function renderMyNumberForm() {
  const f = state.myNumberForm;
  const canSubmit = !!f.themeId && !!f.birthdate;
  return `
    <div class="screen">
      <button type="button" class="step-back" data-action="back-to-top">← トップへ戻る</button>

      <div class="mascot-wrap">${angelMascotSVG({ pose: "praying", size: 108 })}</div>
      <h1 class="title-main" style="font-size:22px;">マイエンジェルナンバー<br />診断</h1>
      <p class="lede">生年月日から、あなただけのエンジェルナンバーを算出します。<br />予定を決めるときの日時・場所選びの参考にしてみてくださいね。</p>

      <div class="panel">
        <label class="field-label">知りたいテーマを選んでください</label>
        <div class="theme-grid">
          ${THEMES.map((t) => `
            <button type="button" class="theme-card ${f.themeId === t.id ? "selected" : ""}"
              style="--tint-bg:var(--theme-${t.accent}-bg); --tint-fg:var(--theme-${t.accent}-fg);"
              data-action="select-mynumber-theme" data-id="${t.id}">
              <span class="icon">${t.icon}</span>
              <span>${t.label}</span>
            </button>
          `).join("")}
        </div>

        <label class="field-label" for="myNumberBirthdate" style="margin-top:6px;">生年月日</label>
        <input
          id="myNumberBirthdate"
          class="number-input"
          type="date"
          value="${f.birthdate}"
          style="font-size:18px;"
        />
        <p class="error-text">${f.error}</p>

        <button type="button" class="btn-primary" data-action="submit-mynumber" ${canSubmit ? "" : "disabled"}>
          マイエンジェルナンバーを見る →
        </button>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------
// 画面: マイエンジェルナンバー診断（結果）
// ---------------------------------------------------------------
function renderMyNumberResult() {
  const mn = state.myNumberReading;
  const r = mn.reading;
  const theme = r.theme;
  return `
    <div class="screen">
      <button type="button" class="step-back" data-action="mynumber-back">← テーマ・生年月日を選び直す</button>

      <p class="result-ribbon">✧ MY ANGEL NUMBER ✧</p>
      <p class="result-number">${mn.n}</p>
      <div class="result-theme-tag" style="--tint-bg:var(--theme-${theme.accent}-bg); --tint-fg:var(--theme-${theme.accent}-fg);">
        <span>${theme.icon}</span><span>${theme.label}</span>
      </div>

      <div class="card-stage">${cardFaceMarkup(r.card, r.theme.id)}</div>

      <h2 class="section-title">✦ あなたへのメッセージ</h2>
      <div class="message-text">
        <p style="font-weight:600;">${r.summary}</p>
        ${r.message.map((p) => `<p>${p}</p>`).join("")}
      </div>

      <h2 class="section-title">✦ 天使からのアドバイス</h2>
      <ul class="advice-list">
        ${r.advice.map((a) => `<li><span class="star">★</span><span>${a}</span></li>`).join("")}
      </ul>

      <div class="today-word">
        <div class="section-title" style="justify-content:center;margin:0 0 6px;">✦ 予定を決めるときは</div>
        あなたのマイエンジェルナンバーは「${mn.n}」。<br />
        日にちや時間、場所に「${mn.n}」が含まれる瞬間は、<br />
        あなたにとって特別なタイミングかもしれません。<br />
        ${theme.label}に関する予定を決めるときの、ひとつの目安にしてみてくださいね。
      </div>

      <div class="result-actions">
        <a class="btn-share-x" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `私のマイエンジェルナンバーは【${mn.n}】でした\n「${r.card.title}」\n${r.summary}\n\n#エンジェルナンバー #天使からのメッセージ`
        )}&url=${encodeURIComponent(SITE_URL)}" target="_blank" rel="noopener noreferrer">𝕏 にシェアする</a>
        <button type="button" class="btn-outline" data-action="mynumber-back">↻ もう一度調べる</button>
        <button type="button" class="btn-text" data-action="back-to-top">トップへ戻る</button>
      </div>

      <div class="result-mascot-row">
        ${angelMascotSVG({ pose: "default", size: 64 })}
        <p class="mascot-speech">あなただけの数字を、<br />これからの毎日に役立ててくださいね。</p>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------
// 描画とイベント
// ---------------------------------------------------------------
// 数字専用インプット欄に、IME変換中でも安全な半角数字フィルタを付けます。
function bindDigitInput(input, { onChange, onEnter }) {
  if (!input) return;
  let isComposing = false;
  const applyValue = () => {
    const digitsOnly = toHalfWidthDigits(input.value).replace(/[^0-9]/g, "");
    if (input.value !== digitsOnly) input.value = digitsOnly;
    onChange(digitsOnly);
  };
  input.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  input.addEventListener("compositionend", () => {
    isComposing = false;
    applyValue();
  });
  input.addEventListener("input", () => {
    if (isComposing) return;
    applyValue();
  });
  if (onEnter) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onEnter();
    });
  }
}

function render() {
  if (state.step === "top") app.innerHTML = renderTop();
  else if (state.step === "theme") app.innerHTML = renderTheme();
  else if (state.step === "loading") app.innerHTML = renderLoading();
  else if (state.step === "result") app.innerHTML = renderResult();
  else if (state.step === "postForm") app.innerHTML = renderPostForm();
  else if (state.step === "feed") app.innerHTML = renderFeed();
  else if (state.step === "myNumberForm") app.innerHTML = renderMyNumberForm();
  else if (state.step === "myNumberResult") app.innerHTML = renderMyNumberResult();

  if (state.step === "top") {
    loadTrendingIfNeeded();
    loadTopPostsIfNeeded();
  }
  if (state.step === "feed") loadFeedIfNeeded();

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  bindDigitInput(document.getElementById("numberInput"), {
    onChange: (digitsOnly) => {
      state.number = digitsOnly;
      state.inputError = "";
      const btn = document.querySelector('[data-action="submit-number"]');
      if (btn) btn.disabled = digitsOnly.trim() === "";
      const err = document.querySelector(".error-text");
      if (err) err.textContent = "";
    },
    onEnter: submitNumber,
  });

  bindDigitInput(document.getElementById("postNumberInput"), {
    onChange: (digitsOnly) => {
      state.postForm.number = digitsOnly;
      state.postForm.error = "";
    },
  });

  const commentInput = document.getElementById("postComment");
  if (commentInput) {
    commentInput.addEventListener("input", () => {
      state.postForm.comment = commentInput.value;
    });
  }

  const birthdateInput = document.getElementById("myNumberBirthdate");
  if (birthdateInput) {
    birthdateInput.addEventListener("change", () => {
      state.myNumberForm.birthdate = birthdateInput.value;
      state.myNumberForm.error = "";
      const btn = document.querySelector('[data-action="submit-mynumber"]');
      if (btn) btn.disabled = !(state.myNumberForm.themeId && state.myNumberForm.birthdate);
    });
  }

  const photoInput = document.getElementById("postPhotoInput");
  if (photoInput) {
    photoInput.addEventListener("change", () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        state.postForm.error = "画像ファイルを選択してください。";
        render();
        return;
      }
      resizeImageFile(file, 900, 0.7).then((dataUrl) => {
        state.postForm.imageDataUrl = dataUrl;
        const preview = document.getElementById("postPhotoPreview");
        if (preview) {
          preview.src = dataUrl;
          preview.style.display = "block";
        }
      });
    });
  }
}

// 画像ファイルを縮小・圧縮して dataURL にします（Firestore に軽量に保存するため）。
function resizeImageFile(file, maxDimension, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

let feedRequested = false;
function loadFeedIfNeeded() {
  if (feedRequested) return;
  feedRequested = true;
  getRecentPosts(20).then((posts) => {
    state.feedPosts = posts;
    const list = document.getElementById("feedList");
    if (list && state.step === "feed") render();
  });
}

function submitNumber() {
  const value = state.number.trim();
  if (value === "") {
    state.inputError = "気になる数字を入力してください。";
    render();
    return;
  }
  if (!isKnownAngelNumber(value)) {
    state.inputError = "この数字についてのメッセージは、現在準備中です。";
    render();
    return;
  }
  state.inputError = "";
  state.step = "theme";
  recordNumberView(value);
  render();
}

function submitPost() {
  const f = state.postForm;
  const value = f.number.trim();
  if (value === "") {
    f.error = "見つけた数字を入力してください。";
    render();
    return;
  }
  if (!isKnownAngelNumber(value)) {
    f.error = "その数字はまだ対応していません。";
    render();
    return;
  }
  f.error = "";
  f.submitting = true;
  render();
  createPost({ number: value, comment: f.comment.trim(), imageDataUrl: f.imageDataUrl })
    .then(() => {
      state.postForm = { number: "", comment: "", imageDataUrl: null, submitting: false, error: "" };
      state.feedPosts = null;
      feedRequested = false;
      state.topPosts = null;
      topPostsRequested = false;
      state.step = "feed";
      render();
    })
    .catch(() => {
      f.submitting = false;
      f.error = "投稿に失敗しました。もう一度お試しください。";
      render();
    });
}

function submitMyNumber() {
  const f = state.myNumberForm;
  if (!f.themeId) {
    f.error = "テーマを選んでください。";
    render();
    return;
  }
  if (!f.birthdate) {
    f.error = "生年月日を入力してください。";
    render();
    return;
  }
  f.error = "";
  const n = calcMyAngelNumber(f.birthdate);
  const lookupKey = myNumberToLookupKey(n);
  const reading = getReading(lookupKey, f.themeId);
  state.myNumberReading = { n, lookupKey, reading };
  state.step = "myNumberResult";
  render();
}

function revealMessage() {
  if (!state.selectedThemeId) return;
  state.reading = getReading(state.number, state.selectedThemeId);
  state.step = "loading";
  render();
  setTimeout(() => {
    state.step = "result";
    render();
  }, 1400);
}

app.addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "fill-number") {
    state.number = target.dataset.value;
    state.inputError = "";
    render();
  } else if (action === "submit-number") {
    submitNumber();
  } else if (action === "back-to-top") {
    state.step = "top";
    render();
  } else if (action === "select-theme") {
    state.selectedThemeId = target.dataset.id;
    revealMessage();
  } else if (action === "reveal") {
    revealMessage();
  } else if (action === "replay") {
    state.number = "";
    state.selectedThemeId = null;
    state.reading = null;
    state.inputError = "";
    state.step = "top";
    render();
  } else if (action === "another-theme") {
    state.selectedThemeId = null;
    state.step = "theme";
    render();
  } else if (action === "go-post") {
    if (target.dataset.value) state.postForm.number = target.dataset.value;
    state.postForm.error = "";
    state.step = "postForm";
    render();
  } else if (action === "go-feed") {
    state.step = "feed";
    render();
  } else if (action === "post-fill-number") {
    state.postForm.number = target.dataset.value;
    state.postForm.error = "";
    render();
  } else if (action === "submit-post") {
    submitPost();
  } else if (action === "go-mynumber") {
    state.step = "myNumberForm";
    render();
  } else if (action === "select-mynumber-theme") {
    state.myNumberForm.themeId = target.dataset.id;
    state.myNumberForm.error = "";
    render();
  } else if (action === "submit-mynumber") {
    submitMyNumber();
  } else if (action === "mynumber-back") {
    state.myNumberForm = { themeId: null, birthdate: "", error: "" };
    state.myNumberReading = null;
    state.step = "myNumberForm";
    render();
  }
});

// guide.html などから ?number=1111 で開かれたときは、入力欄にあらかじめ数字を入れておく
(function prefillFromQuery() {
  const params = new URLSearchParams(location.search);
  const n = params.get("number");
  if (n && isKnownAngelNumber(n)) {
    state.number = n;
  }
})();

initStarField();
render();
