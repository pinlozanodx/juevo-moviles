const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const eatSound = document.getElementById("eatSound");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let food = getRandomFoodPosition();
let score = 0;
let highScore = 0;
let gameInterval;
let timer = 0;
let timerInterval;
let isPaused = false;

document.addEventListener("keydown", handleKeyPress);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

function handleKeyPress(event) {
    if (event.key === " ") {
        resetGame();
    } else if (event.key === "Escape") {
        togglePause();
    } else {
        changeDirection(event);
    }
}

function togglePause() {
    if (isPaused) {
        gameInterval = setInterval(draw, 100);
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = timer;
        }, 1000);
    } else {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
    }
    isPaused = !isPaused;
}

function changeDirection(event) {
    const key = event.key;
    if ((key === "ArrowUp" || key === "w") && direction !== "DOWN") nextDirection = "UP";
    if ((key === "ArrowDown" || key === "s") && direction !== "UP") nextDirection = "DOWN";
    if ((key === "ArrowLeft" || key === "a") && direction !== "RIGHT") nextDirection = "LEFT";
    if ((key === "ArrowRight" || key === "d") && direction !== "LEFT") nextDirection = "RIGHT";
}

function draw() {
    if (isPaused) return;
    direction = nextDirection;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lime";
        ctx.beginPath();
        ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    let newHead = { x: snake[0].x, y: snake[0].y };
    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;

    if (newHead.x === food.x && newHead.y === food.y) {
        eatSound.play();
        score++;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    if (isCollision(newHead)) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert("¡Game Over! 🐍");
        restartBtn.style.display = "block";
        return;
    }

    snake.unshift(newHead);
    scoreDisplay.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
}

function isCollision(head) {
    return (
        head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
        snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)
    );
}

function getRandomFoodPosition() {
    let newFood;
    do {
        newFood = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function startGame() {
    menu.style.display = "none";
    restartBtn.style.display = "none";
    score = 0;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    food = getRandomFoodPosition();
    timer = 0;
    timerDisplay.textContent = 0;
    isPaused = false;
    gameInterval = setInterval(draw, 100);
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    menu.style.display = "block";
    restartBtn.style.display = "none";
}

}
