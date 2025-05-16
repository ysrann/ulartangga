const board = document.getElementById('board');
const diceResult = document.getElementById('dice-result');
const currentPlayerText = document.getElementById('current-player');
const player1PosText = document.getElementById('player1-pos');
const player2PosText = document.getElementById('player2-pos');
const questionModal = document.getElementById('question-modal');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');

const audioRoll = new Audio('sounds/dice.mp3');
const audioCorrect = new Audio('sounds/correct.mp3');
const audioWrong = new Audio('sounds/wrong.mp3');
const bgMusic = new Audio('sounds/bg-music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.play();

let playerPositions = [1, 1];
let currentPlayer = 0;

const ladders = {
  3: 22, 5: 8, 11: 26, 20: 29, 27: 84,
  36: 44, 51: 67, 71: 91, 80: 100
};

const snakes = {
  17: 4, 19: 7, 21: 9, 27: 1, 54: 34,
  62: 18, 64: 60, 87: 24, 93: 73, 95: 75, 98: 79
};

const questionPoints = [10, 15, 23, 30, 40, 50, 63, 72, 81, 90];
let answeredQuestions = {};

const questions = [
  {
    question: "Apa ibukota Indonesia?",
    options: ["Jakarta", "Bandung", "Surabaya"],
    answer: 0
  },
  {
    question: "Siapa presiden pertama Indonesia?",
    options: ["Soekarno", "Jokowi", "Soeharto"],
    answer: 0
  },
  {
    question: "Apa pulau terbesar di Indonesia?",
    options: ["Sumatera", "Jawa", "Kalimantan"],
    answer: 2
  },
  {
    question: "Berapa jumlah provinsi di Indonesia?",
    options: ["34", "33", "32"],
    answer: 0
  }
];

function createBoard() {
  for (let i = 100; i >= 1; i--) {
    const cell = document.createElement('div');
    cell.innerText = i;
    board.appendChild(cell);
  }
}

function rollDice() {
  audioRoll.play();
  const roll = Math.floor(Math.random() * 6) + 1;
  diceResult.innerHTML = `🎲 <strong>${roll}</strong>`;

  let pos = playerPositions[currentPlayer] + roll;
  if (pos > 100) pos = 100;

  if (ladders[pos]) pos = ladders[pos];
  else if (snakes[pos]) pos = snakes[pos];

  if (questionPoints.includes(pos) && !answeredQuestions[pos]) {
    askQuestion(pos, () => {
      movePlayer(pos);
    });
  } else {
    movePlayer(pos);
  }
}

function askQuestion(position, callback) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  questionText.innerText = q.question;
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.onclick = () => {
      if (index === q.answer) {
        audioCorrect.play();
        answeredQuestions[position] = true;
        questionModal.classList.add('hidden');
        callback();
      } else {
        audioWrong.play();
        let fallback = playerPositions[currentPlayer] - 3;
        if (fallback < 1) fallback = 1;
        movePlayer(fallback);
        questionModal.classList.add('hidden');
      }
    };
    optionsContainer.appendChild(btn);
  });

  questionModal.classList.remove('hidden');
}

function movePlayer(position) {
  playerPositions[currentPlayer] = position;
  updateBoard();
  if (position === 100) {
    alert(`Pemain ${currentPlayer + 1} menang!`);
    return;
  }
  currentPlayer = (currentPlayer + 1) % 2;
  currentPlayerText.innerText = `Pemain ${currentPlayer + 1}`;
}

function updateBoard() {
  const pion1 = document.querySelector('.p1') || document.createElement('div');
  const pion2 = document.querySelector('.p2') || document.createElement('div');
  pion1.className = 'pion p1';
  pion2.className = 'pion p2';

  const cells = board.querySelectorAll('div');
  cells.forEach(cell => {
    cell.querySelectorAll('.pion').forEach(p => p.remove());
  });

  const index1 = 100 - playerPositions[0];
  const index2 = 100 - playerPositions[1];
  cells[index1].appendChild(pion1);
  cells[index2].appendChild(pion2);

  player1PosText.innerText = playerPositions[0];
  player2PosText.innerText = playerPositions[1];
}

createBoard();
updateBoard();
