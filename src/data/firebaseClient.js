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

  return { recordNumberView, getTodayTop };
})();
