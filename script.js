const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const foodCountDisplay = document.getElementById("foodCount");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restart");
const maxScoreDisplay = document.getElementById("maxScore");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
let score = 0;
let foodCount = 0;
let gameInterval;
let timer = 0;
let timerInterval;
let gameOver = false;
let maxScore = 0;

document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", resetGame);

function changeDirection(event) {
    if (gameOver) return;
    const key = event.key;
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibuja la comida (manzana)
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Dibuja la serpiente
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lime";
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    let newHead = { x: snake[0].x, y: snake[0].y };

    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;

    if (newHead.x === food.x && newHead.y === food.y) {
        foodCount++;
        score++;
        foodCountDisplay.textContent = foodCount;
        food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
    } else {
        snake.pop();
    }

    if (isCollision(newHead) || newHead.x < 0 || newHead.y < 0 || newHead.x >= canvas.width || newHead.y >= canvas.height) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        gameOver = true;
        restartBtn.disabled = false;
        if (score > maxScore) {
            maxScore = score;
            maxScoreDisplay.textContent = maxScore;
        }
        alert("¡Game Over! 🐍");
        return;
    }

    snake.unshift(newHead);
}

function isCollision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function startGame() {
    score = 0;
    foodCount = 0;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
    timer = 0;
    gameOver = false;
    restartBtn.disabled = true;
    foodCountDisplay.textContent = foodCount;
    maxScoreDisplay.textContent = maxScore;
    timerDisplay.textContent = timer;
    gameInterval = setInterval(draw, 100);
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    startGame();
}

startGame();
