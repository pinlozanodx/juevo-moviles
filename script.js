const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const canvasSize = 30;

let snake = [{ x: 10 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * canvasSize) * box, y: Math.floor(Math.random() * canvasSize) * box };
let score = 0;
let fruitScore = 0;
let highScore = localStorage.getItem("high-score") || 0;
let obstacles = [];
let direction = "RIGHT";
let gameInterval;

let gameSpeed;
let backgroundColor = "#333";
let difficulty = "Normal";

function setDifficulty(level) {
    difficulty = level;
    if (level === "Fácil") gameSpeed = 150;
    if (level === "Normal") gameSpeed = 100;
    if (level === "Difícil") gameSpeed = 70;
    restartGame();
}

document.getElementById("easy-btn").addEventListener("click", () => setDifficulty("Fácil"));
document.getElementById("normal-btn").addEventListener("click", () => setDifficulty("Normal"));
document.getElementById("hard-btn").addEventListener("click", () => setDifficulty("Difícil"));

function generateObstacles() {
    obstacles = [];
    let obstacleCount = difficulty === "Fácil" ? 3 : difficulty === "Normal" ? 7 : 12;
    for (let i = 0; i < obstacleCount; i++) {
        obstacles.push({
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        });
    }
}

function drawObstacles() {
    ctx.fillStyle = "blue";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, box, box);
    });
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        let gradient = ctx.createLinearGradient(snake[i].x, snake[i].y, snake[i].x + box, snake[i].y + box);
        gradient.addColorStop(0, "lime");
        gradient.addColorStop(1, "green");
        ctx.fillStyle = gradient;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
    ctx.shadowBlur = 15;
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 0;
}

function moveSnake() {
    let head = { ...snake[0] };
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        fruitScore++;
        generateFood();
        generateObstacles();
        if (score % 3 === 0) increaseGameSpeed();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || isCollisionWithObstacles()) {
        clearInterval(gameInterval);
        document.body.style.backgroundColor = "red";
        setTimeout(() => document.body.style.backgroundColor = "#111", 200);
        alert("¡Perdiste!");
        restartGame();
    }
}

function increaseGameSpeed() {
    gameSpeed = Math.max(50, gameSpeed * 0.95);
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, gameSpeed);
}

function restartGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    score = 0;
    fruitScore = 0;
    generateObstacles();
    direction = "RIGHT";
    backgroundColor = "#333";
    generateFood();
    canvas.style.backgroundColor = backgroundColor;
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, gameSpeed);
}

generateObstacles();
generateFood();
gameInterval = setInterval(draw, 100);
