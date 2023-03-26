// https://www.youtube.com/watch?v=o4a_xL9w3f0
{
  // ランダムな文章のAPI
  const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
  // 出題されたテキスト
  const $typeDisplay = document.getElementById("js-typeDisplay");
  // 入力したテキスト
  const $typeInput = document.getElementById("js-typeInput");
  // タイマー
  const $timer = document.getElementById("js-timer");
  // タイプ音を取得
  const typeSound = new Audio("./audio/sound_type.mp3");
  // 不正解音
  const incorrectSound = new Audio("./audio/sound_incorrect.mp3");
  // 正解音
  const correctSound = new Audio("./audio/sound_correct.mp3");

  // 入力したテキストの合否判定
  $typeInput.addEventListener("input", () => {
    // タイプ音を再生
    typeSound.play();
    typeSound.currentTime = 0;
    // 出題されたテキストを分解した配列
    const sentence = $typeDisplay.querySelectorAll("span");
    // 入力したテキストを分解した配列
    const arrayValue = $typeInput.value.split("");
    // 入力する度にcorrectを初期化(true)
    let correct = true;
    sentence.forEach((characterSpan, index) => {
      // 未入力の文字は黒文字にする
      if (arrayValue[index] == null) {
        characterSpan.classList.remove("correct");
        characterSpan.classList.remove("incorrect");
        // 未入力の文字が残っている場合correctをfalse
        correct = false;
      }
      // 出題されたテキストの各文字が、入力された文字が一致する場合
      else if (characterSpan.innerText == arrayValue[index]) {
        characterSpan.classList.add("correct");
        characterSpan.classList.remove("incorrect");
      }
      // 出題されたテキストの各文字が、入力された文字が一致しない場合
      else {
        characterSpan.classList.add("incorrect");
        characterSpan.classList.remove("correct");
        // タイピングミスの音
        incorrectSound.volume = 0.1;
        incorrectSound.play();
        incorrectSound.currentTime = 0;
        // 不正解が残っている場合correctをfalse
        correct = false;
      }
    });
    // correctがtrueであれば次の出題
    if (correct == true) {
      correctSound.volume = 0.1;
      correctSound.play();
      correctSound.currentTime = 0;
      renderNextSentence();
    }
  });

  // 非同期でランダムな文章を取得する
  const getRandomSentence = () => {
    return fetch(RANDOM_SENTENCE_URL_API)
      .then((response) => response.json())
      .then((data) => data.content);
  };

  // 取得したランダムな文章を表示する
  const renderNextSentence = async () => {
    const sentence = await getRandomSentence();

    // 出題されたテキストを初期化
    $typeDisplay.innerText = null;

    // 文章を1文字ずつ分解して、それぞれをspanタグで括る
    let oneText = sentence.split("");
    oneText.forEach((character) => {
      const characterSpan = document.createElement("span");
      characterSpan.textContent = character;
      $typeDisplay.appendChild(characterSpan);
    });

    // 入力した文章をリセット
    $typeInput.value = null;

    startTimer();
  };

  // 制限時間(分)
  let originTime = 50;
  let startTime;
  const startTimer = () => {
    // 残り時間の初期値
    $timer.innerText = originTime;
    // 開始時刻
    startTime = new Date();
    // 1秒おきに残り時間を表示
    setInterval(() => {
      // 残り時間 = 開始時刻 - 経過時間
      $timer.innerText = originTime - getTimerTime();
      // 残り時間が0になった場合
      if ($timer.innerText <= 0) timeUp();
    }, 1000);
  };

  // 経過時間(1s)を取得
  const getTimerTime = () => {
    // 現在時刻 - 1秒前の時刻 = 1s
    return Math.floor((new Date() - startTime) / 1000);
  };

  // タイムアップ時の処理
  const timeUp = () => {
    incorrectSound.volume = 0.1;
    incorrectSound.play();
    incorrectSound.currentTime = 0;
    // 次の出題へ
    renderNextSentence();
  };

  renderNextSentence();
}
