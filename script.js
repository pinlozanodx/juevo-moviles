const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box;
let canvasSize;
resizeCanvas(); // Ajustar tamaño dinámico

let snake = [{ x: 10 * box, y: 10 * box }];
let food = generateFood();
let score = 0;
let fruitScore = 0;
let highScore = localStorage.getItem("high-score") || 0;
let obstacles = [];
let direction = "RIGHT";
let gameInterval;

let gameSpeed = 100;
let backgroundColor = "#333";

// Ajustar tamaño del canvas al cambiar la ventana
window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
    box = Math.min(canvas.width, canvas.height) / 30; // Ajusta el tamaño del box dinámicamente
    canvasSize = Math.floor(Math.min(canvas.width, canvas.height) / box);
    restartGame();
}

function generateObstacles() {
    obstacles = [];
    for (let i = 0; i < score + 5; i++) {
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

function isCollisionWithObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            snake[0].x < obstacles[i].x + box &&
            snake[0].x + box > obstacles[i].x &&
            snake[0].y < obstacles[i].y + box &&
            snake[0].y + box > obstacles[i].y
        ) {
            return true;
        }
    }
    return false;
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "lime";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

function updateScore() {
    document.getElementById("score").textContent = score;
    document.getElementById("fruit-score").textContent = fruitScore;
    document.getElementById("high-score").textContent = highScore;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("high-score", highScore);
    }
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
        food = generateFood();
        generateObstacles();
        changeBackgroundColor();
        if (score % 3 === 0) {
            increaseGameSpeed();
        }
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || isCollisionWithObstacles()) {
        clearInterval(gameInterval);
        alert("¡Perdedor lol!");
        updateScore();
        restartGame();
    }
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };
}

function changeBackgroundColor() {
    const colors = ["#333", "#444", "#555", "#666", "#777", "#888", "#462", "#999", "#891"];
    backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    canvas.style.backgroundColor = backgroundColor;
}

function increaseGameSpeed() {
    gameSpeed = Math.max(50, gameSpeed * 0.95);
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, gameSpeed);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawObstacles();
    moveSnake();
    updateScore();
}

document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    if (e.keyCode === 38 && direction !== "DOWN") direction = "UP";
    if (e.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    if (e.keyCode === 40 && direction !== "UP") direction = "DOWN";
});

function restartGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    score = 0;
    fruitScore = 0;
    generateObstacles();
    direction = "RIGHT";
    gameSpeed = 100;
    backgroundColor = "#333";
    food = generateFood();
    canvas.style.backgroundColor = backgroundColor;
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, gameSpeed);
}

function toggleTheme() {
    document.body.classList.toggle("neon");
}

gameInterval = setInterval(draw, gameSpeed);
