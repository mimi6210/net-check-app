// スコア（はいの数）、今の質問番号、はいと答えた質問の保存用リスト
let score = 0;
let currentQuestion = 0;
let picked = [];

// 質問の内容を配列にして管理
const questions = [
  "自撮りを投稿することがよくある",
  "位置情報をオンにしたまま投稿している",
  "パスワードをSNSに関連する言葉で設定している",
  "不審なリンクを開いてしまったことがある"
];

// 各質問に対する「危険な理由」をセット（後で表示する用）
const dangerReasons = {
  "自撮りを投稿することがよくある": "顔から個人情報が特定されるリスクがあり、SNSに出している場所・服装・背景から生活環境を知られてしまう可能性があります。",
  "位置情報をオンにしたまま投稿している": "自宅や学校、通勤経路などが特定され、ストーカーや空き巣などの犯罪に巻き込まれる危険性があります。",
  "パスワードをSNSに関連する言葉で設定している": "アカウント情報から連想しやすく、推測されて乗っ取られやすくなります。パスワードは他と被らない複雑なものが理想です。",
  "不審なリンクを開いてしまったことがある": "フィッシングサイトに誘導され、パスワードやクレカ情報を盗まれる危険があります。リンクを開く前にURLを必ず確認しましょう。"
};

// スタートボタンが押されたときに呼ばれる関数
function startApp() {
  score = 0; // スコア初期化
  currentQuestion = 0; // 質問番号リセット
  picked = []; // pickedリストも初期化
  showQuestion(); // 最初の質問を表示
}

// 今の質問を表示する関数
function showQuestion() {
  const questionArea = document.createElement("div"); // 新しいdiv作成
  questionArea.id = "questionArea"; // idをつける（今は使ってないけど後で使える）
  questionArea.innerHTML = `
    <p>${questions[currentQuestion]}</p> 
    <button onclick="answer(true)">はい</button> 
    <button onclick="answer(false)">いいえ</button>
  `; // 質問と2つのボタンを表示
  document.body.innerHTML = ""; // 画面をリセット
  document.body.appendChild(questionArea); // 表示する
  questionArea.innerHTML = `
  <p>${questions[currentQuestion]}</p>
  <button onclick="answer(true)">はい</button>
  <button onclick="answer(false)">いいえ</button>
  ${currentQuestion > 0 ? '<br><br><button onclick="goBack()">前の質問に戻る</button>' : ''}
`;

}

// 「はい」か「いいえ」が押されたときに呼ばれる関数
function answer(isYes) {
  if (isYes) {
    score++; // はいならスコア＋1
    picked.push(questions[currentQuestion]); // 質問内容をpickedに追加
  }

  currentQuestion++; // 次の質問へ進む
  if (currentQuestion < questions.length) {
    showQuestion(); // まだ質問があれば次へ
  } else {
    showResult(); // 質問が終わったら結果表示
  }
}

// 結果を表示する関数
function showResult() {
  let resultText = "";
  let advice = "";

  if (score === 0) {
    resultText = "あなたはとても注意深くSNSを使えているようです✨";
  } else if (score <= 2) {
    resultText = "少しだけ油断があるかも？⚠️";
  } else {
    resultText = "かなり危険な状態かもしれません…😨";
  }

  if (picked.length > 0) {
    advice = "<h3>気をつけた方がいい点：</h3><ul>";
    picked.forEach(q => {
      advice += `<li><strong>${q}</strong><br><span>${dangerReasons[q]}</span></li>`;
    });
    advice += "</ul>";
  }

  const resultArea = document.createElement("div"); // ← ここを先に！
  resultArea.innerHTML = `
    <h2>診断結果</h2>
    <p>${resultText}</p>
    <p>あなたの危険スコア：${score} / ${questions.length}</p>
    ${advice}
    <br><br>
    <button onclick="showHome()">トップに戻る</button>
  `;

  document.body.innerHTML = "";
  document.body.appendChild(resultArea);
}
  // 最後に結果ページを作って表示
  const resultArea = document.createElement("div");
  resultArea.innerHTML = `
    <h2>診断結果</h2>
    <p>${resultText}</p>
    <p>あなたの危険スコア：${score} / ${questions.length}</p>
    ${advice}
  `;

  document.body.innerHTML = "";
  document.body.appendChild(resultArea);

function showPasswordCheck() {
  const passwordArea = document.createElement("div");
  passwordArea.innerHTML = `
    <h2>パスワード強度チェック</h2>
    <p>あなたのパスワードを入力してください（※実際のパスワードじゃなくてもOK）</p>
    <input type="text" id="passwordInput" placeholder="パスワードを入力">
    <br><br>
    <button onclick="checkPassword()">診断する</button>
    <div id="passwordResult"></div>
    <br>
    <button onclick="showHome()">トップに戻る</button>
  `;
  document.body.innerHTML = "";
  document.body.appendChild(passwordArea);
}

function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  const result = document.getElementById("passwordResult");
  let strength = 0;
  let message = "";

  if (input.trim() === "") {
    result.innerHTML = `<p>パスワードを入力してください😅</p>`;
    return;
  }

  if (input.length >= 8) strength++;
  if (/[0-9]/.test(input) && /[a-zA-Z]/.test(input)) strength++;
  if (/[^a-zA-Z0-9]/.test(input)) strength++;

  if (strength === 0) {
    message = "とても危険です。すぐに変更しましょう！😨";
  } else if (strength === 1) {
    message = "やや弱めです。文字数や記号を増やすとより安全です⚠️";
  } else if (strength === 2) {
    message = "まあまあ安全ですが、記号も含めるともっと強くなります！😊";
  } else {
    message = "とても安全なパスワードです！素晴らしい✨";
  }

  result.innerHTML = `<p><strong>${message}</strong></p>`;
}

  // 結果表示＋トップに戻るボタン
  result.innerHTML = `
    <p><strong>${message}</strong></p>
    <button onclick="showHome()">トップに戻る</button>
  `;

function showPhishingTips() {
  const tipArea = document.createElement("div");
  tipArea.innerHTML = `
    <h2>フィッシング対策の基本</h2>
    <p>フィッシングとは、偽のメールやWebサイトを使ってパスワードやクレジットカード番号を盗み取る詐欺手法です。</p>
    
    <h3>よくある手口</h3>
    <ul>
      <li>「アカウントに異常が検出されました」とメールで不安をあおる</li>
      <li>本物そっくりなURLで偽サイトへ誘導する</li>
      <li>LINEやInstagramのDMから不審なリンクが届く</li>
    </ul>

    <h3>対策のポイント</h3>
    <ul>
      <li>リンクを開く前にURLを確認</li>
      <li>公式アプリやブックマークからアクセスする</li>
      <li>怪しいと感じたら絶対に個人情報を入力しない</li>
    </ul>

    <p>少しの注意が、大きな被害を防ぎます！😌</p>
    <br>
<button onclick="showHome()">トップに戻る</button>

  `;
  document.body.innerHTML = "";
  document.body.appendChild(tipArea);
}
function showHome() {
  const homeArea = document.createElement("div");
  homeArea.innerHTML = `
    <h1>ネット危険度診断アプリ</h1>
    <p>あなたのセキュリティ意識、試してみませんか？</p>
    <button onclick="startApp()">SNS危険度診断</button>
    <button onclick="showPasswordCheck()">パスワード診断</button>
    <button onclick="showPhishingTips()">フィッシング対策を見る</button>
  `;
  document.body.innerHTML = "";
  document.body.appendChild(homeArea);
}
function goBack() {
  // 今の質問が1問目じゃなければ
  if (currentQuestion > 0) {
    currentQuestion--; // 質問番号を戻す

    // 直前の回答が「はい」だった場合、pickedとscoreを調整（消す）
    const lastQuestion = questions[currentQuestion];
    const lastIndex = picked.indexOf(lastQuestion);
    if (lastIndex !== -1) {
      picked.splice(lastIndex, 1);
      score--;
    }

    showQuestion(); // 質問を再表示
  }
}
