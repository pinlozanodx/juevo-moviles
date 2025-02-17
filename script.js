const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restart");
const eatSound = document.getElementById("eatSound");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
let score = 0;
let highScore = 0;
let gameInterval;
let timer = 0;
let timerInterval;
let nextDirection = direction;

document.addEventListener("keydown", handleKeyPress);
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => changeDirection({ key: getKeyFromDirection(button.dataset.direction) }));
});
restartBtn.addEventListener("click", resetGame);

function getKeyFromDirection(direction) {
    return {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight"
    }[direction];
}

function handleKeyPress(event) {
    if (event.key === " ") {
        resetGame();
    } else {
        changeDirection(event);
    }
}

function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    if (key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
}

function draw() {
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
        food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
    } else {
        snake.pop();
    }

    if (isCollision(newHead) || newHead.x < 0 || newHead.y < 0 || newHead.x >= canvas.width || newHead.y >= canvas.height) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert("¡Game Over! 🐍");
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
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function startGame() {
    score = 0;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    food = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
    timer = 0;
    timerDisplay.textContent = 0;
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
