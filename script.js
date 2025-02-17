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
let food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box };
let score = 0;
let highScore = 0;
let gameInterval;
let timer = 0;
let timerInterval;

document.addEventListener("keydown", changeDirection);
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

function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "lime";
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lime";
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Genera la nueva posición de la cabeza
    let newHead = { x: snake[0].x, y: snake[0].y };

    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;

    // Verifica si la serpiente ha comido la manzana
    if (newHead.x === food.x && newHead.y === food.y) {
        eatSound.play();
        score++;
        food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box };
        snake.unshift(newHead); // La serpiente crece al añadir un nuevo segmento al inicio
    } else {
        snake.unshift(newHead); // La serpiente avanza
        snake.pop(); // Elimina el último segmento para simular el movimiento
    }

    // Verifica colisiones con los bordes o con la propia serpiente
    if (isCollision(newHead)) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert("¡Perdedor lol! ");
        return;
    }

    scoreDisplay.textContent = score;

    // Actualiza el puntaje más alto
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
}

function isCollision(head) {
    return (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)
    );
}

function startGame() {
    score = 0;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box };
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
