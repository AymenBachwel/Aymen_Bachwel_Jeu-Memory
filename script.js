const board = document.getElementById("game-board");

let firstCard = null;
let secondCard = null;
let lock = false;

let score = 0;
let time = 0;
let timerInterval;

//  images (emoji)
const emojis = ["🐶","🐱","🐸","🐵","🐼","🦁","🐷","🐙","🐰","🐯","🦊","🐻"];

//  démarrer jeu
function startGame(level) {

  board.innerHTML = "";
  score = 0;
  time = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = time;

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").textContent = time;
  }, 1000);

  //  définir taille du board selon niveau
  let rows, cols;

  if (level === "easy") {
    rows = 2;
    cols = 3;
  } else if (level === "medium") {
    rows = 4;
    cols = 4;
  } else {
    rows = 4;
    cols = 6;
  }

  let size = (rows * cols) / 2; // nombre de paires

  let selected = emojis.slice(0, size);
  let values = [...selected, ...selected];

  shuffle(values);

  //  changer la grille CSS dynamiquement
  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

  values.forEach(val => {
    let card = document.createElement("div");
    card.classList.add("card");

    card.dataset.value = val;
    card.textContent = "";

    card.addEventListener("click", flipCard);

    board.appendChild(card);
  });



//pour le bouton de mode devient attirant
document.querySelectorAll("#controls button").forEach(btn => {
  btn.classList.remove("active");
});

if (level === "easy") {
  document.querySelector("#controls button:nth-child(1)").classList.add("active");
} else if (level === "medium") {
  document.querySelector("#controls button:nth-child(2)").classList.add("active");
} else {
  document.querySelector("#controls button:nth-child(3)").classList.add("active");
}


}

//  shuffle correct (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//  retourner carte
function flipCard() {

  if (lock) return;
  if (this === firstCard) return;
  if (this.classList.contains("matched")) return;

  this.textContent = this.dataset.value;
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

//  vérifier correspondance
function checkMatch() {

  if (firstCard.dataset.value === secondCard.dataset.value) {

    score += 10;
    document.getElementById("score").textContent = score;

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    reset();
    checkWin();

  } else {

    lock = true;

    setTimeout(() => {
      firstCard.textContent = "";
      secondCard.textContent = "";

      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      reset();
    }, 800);
  }
}

//  reset sélection
function reset() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

//  vérifier victoire
function checkWin() {
  let allCards = document.querySelectorAll(".card");
  let matchedCards = document.querySelectorAll(".matched");

  if (allCards.length === matchedCards.length) {
    clearInterval(timerInterval);

    setTimeout(() => {
      alert("🎉 Bravo ! Score: " + score + " | Temps: " + time + "s");
    }, 300);
  }
}

startGame("easy");//pour le debut de jeu par mode facile