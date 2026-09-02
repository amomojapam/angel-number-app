// Firebase(Firestore)への接続と、「今日みんなが見たエンジェルナンバー」集計。
// firebase-app-compat.js / firebase-firestore-compat.js の読み込み後に使います。
window.App = window.App || {};
window.App.firebaseClient = (function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAmC8v9OpHgIuRuaX1xj_cIbUJGWORTemY",
    authDomain: "angel-number-app-a7c01.firebaseapp.com",
    projectId: "angel-number-app-a7c01",
    storageBucket: "angel-number-app-a7c01.firebasestorage.app",
    messagingSenderId: "19840973896",
    appId: "1:19840973896:web:f48cfe04cd8ac339ebac7d",
  };

  let db = null;
  function getDb() {
    if (!window.firebase || !window.firebase.firestore) return null;
    if (!db) {
      if (!window.firebase.apps.length) window.firebase.initializeApp(firebaseConfig);
      db = window.firebase.firestore();
    }
    return db;
  }

  function todayStr() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  // 数字が診断されたことを、匿名でカウントします（失敗しても診断自体には影響しません）。
  function recordNumberView(number) {
    try {
      const database = getDb();
      if (!database) return;
      database
        .collection("counts")
        .doc(todayStr())
        .collection("numbers")
        .doc(number)
        .set(
          {
            number,
            count: window.firebase.firestore.FieldValue.increment(1),
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
        .catch(() => {});
    } catch (e) {
      /* 集計できなくても、診断は続けられるようにする */
    }
  }

  // 今日、気になった人が多い数字を上位から取得します。
  async function getTodayTop(limitCount = 3) {
    try {
      const database = getDb();
      if (!database) return [];
      const snap = await database
        .collection("counts")
        .doc(todayStr())
        .collection("numbers")
        .orderBy("count", "desc")
        .limit(limitCount)
        .get();
      return snap.docs.map((d) => d.data());
    } catch (e) {
      return [];
    }
  }

  // 「私が見つけたエンジェルナンバー」投稿を保存します。
  // 画像は事前にリサイズ・圧縮した dataURL 文字列で受け取り、Firestore にそのまま保存します
  // （Firebase Storage を使わないので、無料プランのままで運用できます）。
  function createPost({ number, comment, imageDataUrl }) {
    const database = getDb();
    if (!database) return Promise.reject(new Error("Firestore is not available"));
    return database.collection("posts").add({
      number,
      comment: (comment || "").slice(0, 200),
      imageDataUrl: imageDataUrl || null,
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  // 新着の投稿を取得します。
  async function getRecentPosts(limitCount = 20) {
    try {
      const database = getDb();
      if (!database) return [];
      const snap = await database
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(limitCount)
        .get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      return [];
    }
  }

  // お問い合わせフォームの内容を保存します（サイト運営者のみが確認する非公開データ）。
  function submitContact({ name, email, category, message }) {
    const database = getDb();
    if (!database) return Promise.reject(new Error("Firestore is not available"));
    return database.collection("contactMessages").add({
      name: (name || "").slice(0, 100),
      email: (email || "").slice(0, 200),
      category: category || "other",
      message: (message || "").slice(0, 2000),
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  return { recordNumberView, getTodayTop, createPost, getRecentPosts, submitContact };
})();
