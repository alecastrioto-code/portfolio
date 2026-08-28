const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const streakEl = document.getElementById("streak");
const multiplierEl = document.getElementById("multiplier");

const crowdMessage = document.getElementById("crowd-message");

const judgement = document.getElementById("judgement");

const finalScore = document.getElementById("final-score");
const rankTitle = document.getElementById("rank-title");
const rankCopy = document.getElementById("rank-copy");

const lanes = [...document.querySelectorAll(".lane")];



/* ----------------------------------
   CONFIG
---------------------------------- */

const GAME_DURATION = 30;

const keys = [
  { key: "d", lane: 0 },
  { key: "f", lane: 1 },
  { key: "j", lane: 2 },
  { key: "k", lane: 3 }
];

let gameRunning = false;

let score = 0;
let streak = 0;
let multiplier = 1;

let timeLeft = GAME_DURATION;

let notes = [];

let animationFrame;

let lastSpawn = 0;

let spawnInterval = 650;

let lastFrame = 0;



/* ----------------------------------
   SOUND
---------------------------------- */

let audioContext;

function startAudio() {

  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

}


function playTone(lane, success = true) {

  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  const frequencies = [
    110,
    146.83,
    196,
    246.94
  ];

  oscillator.type = success
    ? "sawtooth"
    : "square";

  oscillator.frequency.value = success
    ? frequencies[lane]
    : 65;

  gain.gain.setValueAtTime(
    success ? 0.05 : 0.025,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.12
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.13);

}

/* ----------------------------------
   PORTFOLIO EASTER EGG
---------------------------------- */

const PORTFOLIO_EGG_STORAGE_KEY =
  "ale-portfolio-easter-eggs";


function unlockRockGameEgg() {

  try {

    const stored =
      localStorage.getItem(
        PORTFOLIO_EGG_STORAGE_KEY
      );

    const progress =
      stored
        ? JSON.parse(stored)
        : {};


    if (progress["rock-game"]) {
      return;
    }


    progress["rock-game"] = {
      discoveredAt:
        new Date().toISOString()
    };


    localStorage.setItem(
      PORTFOLIO_EGG_STORAGE_KEY,
      JSON.stringify(progress)
    );


    console.log(
      "🥚 Easter egg unlocked: rock-game"
    );

  }

  catch (error) {

    console.warn(
      "Couldn't save rock game Easter egg:",
      error
    );

  }

}

/* ----------------------------------
   START GAME
---------------------------------- */

function startGame() {

  unlockRockGameEgg();
  startAudio();

  score = 0;
  streak = 0;
  multiplier = 1;

  timeLeft = GAME_DURATION;

  notes = [];

  lastSpawn = 0;
  lastFrame = performance.now();

  spawnInterval = 650;

  document
    .querySelectorAll(".note")
    .forEach(note => note.remove());

  updateScore();

  timerEl.textContent = timeLeft;

  crowdMessage.textContent =
    "DON'T EMBARRASS YOURSELF";

  startScreen.classList.remove("active");
  endScreen.classList.remove("active");
  gameScreen.classList.add("active");

  gameRunning = true;

  animationFrame =
    requestAnimationFrame(gameLoop);

  startTimer();

}



/* ----------------------------------
   NOTE SPAWNING
---------------------------------- */

function spawnNote() {

  const laneIndex =
    Math.floor(Math.random() * lanes.length);

  const note =
    document.createElement("div");

  note.classList.add("note");

  lanes[laneIndex].appendChild(note);

  notes.push({
    element: note,
    lane: laneIndex,
    y: -40,
    hit: false,
    missed: false
  });

}



/* ----------------------------------
   GAME LOOP
---------------------------------- */

function gameLoop(timestamp) {

  if (!gameRunning) return;

  const delta = timestamp - lastFrame;

  lastFrame = timestamp;

  if (timestamp - lastSpawn > spawnInterval) {

    spawnNote();

    lastSpawn = timestamp;

  }

  moveNotes(delta);

  animationFrame =
    requestAnimationFrame(gameLoop);

}



/* ----------------------------------
   MOVE NOTES
---------------------------------- */

function moveNotes(delta) {

  const gameArea =
    document.getElementById("game-area");

  const height =
    gameArea.clientHeight;

  const targetY =
    height - 100;

  const speed =
    Math.max(280, height * 0.62);

  notes.forEach(note => {

    if (note.hit || note.missed) return;

    note.y +=
      speed * (delta / 1000);

    note.element.style.top =
      `${note.y}px`;

    /*
      If note travels too far
      past the strike line:
    */

    if (note.y > targetY + 55) {

      note.missed = true;

      note.element.remove();

      missNote();

    }

  });


  notes = notes.filter(note =>
    !note.hit &&
    !note.missed
  );

}



/* ----------------------------------
   INPUT
---------------------------------- */

document.addEventListener(
  "keydown",
  event => {

    if (!gameRunning) return;

    if (event.repeat) return;

    const pressed =
      event.key.toLowerCase();

    const keyConfig =
      keys.find(k => k.key === pressed);

    if (!keyConfig) return;

    const lane =
      keyConfig.lane;

    flashLane(lane);

    attemptHit(lane);

  }
);



/* ----------------------------------
   HIT DETECTION
---------------------------------- */

function attemptHit(laneIndex) {

  const gameArea =
    document.getElementById("game-area");

  const height =
    gameArea.clientHeight;

  const targetY =
    height - 100;

  const laneNotes =
    notes
      .filter(note =>
        note.lane === laneIndex &&
        !note.hit &&
        !note.missed
      )
      .sort(
        (a, b) =>
          Math.abs(a.y - targetY) -
          Math.abs(b.y - targetY)
      );

  if (!laneNotes.length) {

    wrongHit(laneIndex);

    return;

  }

  const closest =
    laneNotes[0];

  const distance =
    Math.abs(closest.y - targetY);


  /* PERFECT */

  if (distance <= 25) {

    registerHit(
      closest,
      "PERFECT",
      100
    );

  }


  /* GOOD */

  else if (distance <= 60) {

    registerHit(
      closest,
      "GOOD",
      60
    );

  }


  /* too early */

  else {

    wrongHit(laneIndex);

  }

}



/* ----------------------------------
   SUCCESS
---------------------------------- */

function registerHit(
  note,
  rating,
  points
) {

  note.hit = true;

  streak++;

  updateMultiplier();

  score += points * multiplier;

  note.element.classList.add("hit");

  setTimeout(() => {
    note.element.remove();
  }, 120);

  playTone(note.lane, true);

  showJudgement(rating);

  updateScore();

  updateCrowd();

}



/* ----------------------------------
   MISS
---------------------------------- */

function missNote() {

  streak = 0;

  updateMultiplier();

  showJudgement("MISS");

  playTone(0, false);

  updateScore();

}



function wrongHit(lane) {

  streak = 0;

  updateMultiplier();

  playTone(lane, false);

  showJudgement("NOPE");

}



/* ----------------------------------
   MULTIPLIER
---------------------------------- */

function updateMultiplier() {

  if (streak >= 20) {
    multiplier = 4;
  }

  else if (streak >= 10) {
    multiplier = 3;
  }

  else if (streak >= 5) {
    multiplier = 2;
  }

  else {
    multiplier = 1;
  }

  streakEl.textContent =
    streak;

  multiplierEl.textContent =
    `×${multiplier}`;

}



/* ----------------------------------
   SCORE
---------------------------------- */

function updateScore() {

  scoreEl.textContent =
    String(score)
      .padStart(4, "0");

  streakEl.textContent =
    streak;

}



/* ----------------------------------
   FEEDBACK
---------------------------------- */

function showJudgement(text) {

  judgement.textContent = text;

  judgement.classList.remove("show");

  void judgement.offsetWidth;

  judgement.classList.add("show");

}



function flashLane(index) {

  lanes[index]
    .classList.add("active");

  setTimeout(() => {

    lanes[index]
      .classList.remove("active");

  }, 90);

}



/* ----------------------------------
   CROWD COMMENTARY
---------------------------------- */

function updateCrowd() {

  let message;

  if (streak >= 20) {

    message =
      "THE CEILING IS NO LONGER STRUCTURALLY SOUND";

  }

  else if (streak >= 12) {

    message =
      "SOMEONE JUST STARTED A MOSH PIT";

  }

  else if (streak >= 7) {

    message =
      "OKAY. THAT WAS ACTUALLY SICK.";

  }

  else if (streak >= 3) {

    message =
      "THE CROWD IS CAUTIOUSLY OPTIMISTIC";

  }

  else {

    message =
      "DON'T EMBARRASS YOURSELF";

  }

  crowdMessage.textContent =
    message;

}



/* ----------------------------------
   TIMER
---------------------------------- */

function startTimer() {

  const timerInterval =
    setInterval(() => {

      if (!gameRunning) {

        clearInterval(timerInterval);

        return;

      }

      timeLeft--;

      timerEl.textContent =
        timeLeft;

      /*
        Gets slightly faster
        throughout the game.
      */

      spawnInterval =
        Math.max(
          360,
          650 - (GAME_DURATION - timeLeft) * 7
        );

      if (timeLeft <= 0) {

        clearInterval(timerInterval);

        endGame();

      }

    }, 1000);

}



/* ----------------------------------
   END GAME
---------------------------------- */

function endGame() {

  gameRunning = false;

  cancelAnimationFrame(
    animationFrame
  );

  gameScreen.classList.remove(
    "active"
  );

  endScreen.classList.add(
    "active"
  );

  finalScore.textContent =
    String(score)
      .padStart(4, "0");

  setRank();

}



/* ----------------------------------
   RANKS
---------------------------------- */

function setRank() {

  let title;
  let copy;


  if (score < 800) {

    title =
      "LOCAL PUB<br>SUPPORT ACT";

    copy =
      "The bartender clapped. We think.";

  }

  else if (score < 1600) {

    title =
      "SUSPICIOUSLY GOOD<br>GARAGE BAND";

    copy =
      "Three people asked where they can buy the shirt.";

  }

  else if (score < 2600) {

    title =
      "YOU BROKE<br>THE VENUE";

    copy =
      "No deposit is being returned.";

  }

  else {

    title =
      "LEGALLY<br>TOO LOUD";

    copy =
      "Congratulations. You are now banned from six municipalities.";

  }


  rankTitle.innerHTML = title;

  rankCopy.textContent = copy;

}



/* ----------------------------------
   BUTTONS
---------------------------------- */

startBtn.addEventListener(
  "click",
  startGame
);

restartBtn.addEventListener(
  "click",
  startGame
);