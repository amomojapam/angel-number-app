const { isKnownAngelNumber } = window.App.angelNumbers;
const { THEMES } = window.App.themes;
const { getReading } = window.App.messageEngine;
const { angelMascotSVG } = window.App.angelMascot;
const { motifIconMarkup } = window.App.motifIcons;

const app = document.getElementById("app");

const SUGGESTED_NUMBERS = ["111", "222", "333", "444", "555", "777", "888", "1111", "2222"];
const SITE_URL = "https://amomojapam.github.io/angel-number-app/";

const state = {
  step: "top", // top | theme | loading | result
  number: "",
  selectedThemeId: null,
  inputError: "",
  reading: null,
};

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
// カードの HTML を組み立てる（実画像があればそちらを優先表示）
// ---------------------------------------------------------------
function cardFaceMarkup(card) {
  return `
    <div class="card-face" style="--face-1:var(--card-${card.palette}-1); --face-2:var(--card-${card.palette}-2); --face-edge:var(--card-${card.palette}-edge);">
      <span class="card-corner tl"></span><span class="card-corner tr"></span>
      <span class="card-corner bl"></span><span class="card-corner br"></span>
      <div class="card-inner">
        <div class="card-number">No. ${String(card.id).padStart(2, "0")}</div>
        <div class="card-motif"><svg viewBox="0 0 64 64">${motifIconMarkup(card.motif)}</svg></div>
        <div class="card-title">${card.title}</div>
      </div>
      <img class="card-real-img" alt="${card.title}"
           src="public/${card.image}"
           onload="this.style.display='block'; this.closest('.card-face').classList.add('has-photo');"
           onerror="this.remove()" />
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
        <label class="field-label" for="numberInput">気になる数字を入力してください</label>
        <input
          id="numberInput"
          class="number-input"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="5"
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

      <div class="card-stage">${cardFaceMarkup(r.card)}</div>

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
        <button type="button" class="btn-outline" data-action="replay">↻ もう一度見る</button>
        <button type="button" class="btn-primary" data-action="another-theme">別のテーマで見る →</button>
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
// 描画とイベント
// ---------------------------------------------------------------
function render() {
  if (state.step === "top") app.innerHTML = renderTop();
  else if (state.step === "theme") app.innerHTML = renderTheme();
  else if (state.step === "loading") app.innerHTML = renderLoading();
  else if (state.step === "result") app.innerHTML = renderResult();

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  const input = document.getElementById("numberInput");
  if (input) {
    input.addEventListener("input", () => {
      const digitsOnly = input.value.replace(/[^0-9]/g, "");
      input.value = digitsOnly;
      state.number = digitsOnly;
      state.inputError = "";
      const btn = document.querySelector('[data-action="submit-number"]');
      if (btn) btn.disabled = digitsOnly.trim() === "";
      const err = document.querySelector(".error-text");
      if (err) err.textContent = "";
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitNumber();
    });
  }
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
  }
});

initStarField();
render();
