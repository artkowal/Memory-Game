const cardColors = ["red", "red", "green", "green", "blue", "blue", "magenta", "magenta", "yellow", "yellow", "bisque", "bisque", "brown", "brown", "cyan", "cyan", "orange", "orange"];


let elements = document.querySelectorAll('.card');

elements = [...elements];

let gamesLeft = cardColors.length / 2;
let activeCard = '';
const activeCards = [];

let randomFlippingInterval;
let gameStarted = false;

let startTime;
let moveCount = 0;

const randomFlip = function() {
    const randomIndex = Math.floor(Math.random() * elements.length);
    const card = elements[randomIndex];

    if(!card.classList.contains('hidden')) return;

    card.classList.remove('hidden');
    setTimeout(() => {
        if (!gameStarted) card.classList.add('hidden');
    }, 1000);
};

const startGame = function() {
    clearInterval(randomFlippingInterval);
    gameStarted = true;
    startTime = Date.now();

    shuffleCards();

    elements.forEach(card => card.classList.remove('hidden'));

    setTimeout(() => {
        elements.forEach(card => card.classList.add('hidden'));
        elements.forEach(card => card.addEventListener('click', clickCard));
    }, 2000);

};

const resetGame = function() {
    location.reload();
};

const shuffleCards = function () {
    const availableColors = [...cardColors]; 
    elements.forEach(card => {
        card.className = 'card'; 
        const position = Math.floor(Math.random() * availableColors.length);
        card.classList.add(availableColors[position]); 
        availableColors.splice(position, 1); 
    });
};

const clickCard = function () {
    if (!gameStarted) return;

    activeCard = this;
    console.log(activeCard);

    activeCard.classList.remove('hidden');

    if (activeCard === activeCards[0]) {
        return;
    }

    if (activeCards.length === 0) {
        activeCards[0] = activeCard;
        return;
    } else {
        elements.forEach(card => card.removeEventListener("click", clickCard));
        activeCards[1] = activeCard;
        moveCount++;

    
        setTimeout(function () {
            if (activeCards[0].className === activeCards[1].className) {
                activeCards.forEach(card => card.classList.add("off"))
                elements = elements.filter(card => !card.classList.contains("off"));
                gamesLeft--;
        } else {
            activeCards.forEach(card => card.classList.add("hidden"))
        }

        activeCard = "";
        activeCards.length = 0;
        elements.forEach(card => card.addEventListener("click", clickCard));

        if(gamesLeft === 0) {
            endGame();
            }
        }, 300)
    }
};

const endGame = function() {

    triggerConfetti();

    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);

    document.querySelector("#gameTime").textContent = totalTime;
    document.querySelector("#gameMoves").textContent = moveCount;

    const resultOverlay = document.querySelector(".resultOverlay");
    resultOverlay.classList.remove("hidden");

    document.querySelector(".restartButton").addEventListener("click", () => {
    location.reload();
    });
};

const triggerConfetti = function() {
    let duration = 15 * 1000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    let interval = setInterval(function() {
    let timeLeft = animationEnd - Date.now();
    
    if (timeLeft <= 0) {
        return clearInterval(interval);
    }
    
      let particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
};


const init = function () {

    shuffleCards();

    elements.forEach(card => card.classList.add('hidden'));

    randomFlippingInterval = setInterval(randomFlip, 800);

    const startButton = document.querySelector('.startButton');
    startButton.addEventListener('click', startGame);

};

init();