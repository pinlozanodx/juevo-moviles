const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; // Tamaño de cada bloque
const canvasSize = 30; // 30x30 celdas

let snake = [{ x: 10 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * canvasSize) * box, y: Math.floor(Math.random() * canvasSize) * box };
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
let obstacles = [];
let direction = "RIGHT";
let gameInterval;

let gameSpeed = 100; // velocidad inicial
let backgroundColor = "#333"; // color inicial del fondo

// Generación aleatoria de obstáculos
function generateObstacles() {
    obstacles = [];
    for (let i = 0; i < 5; i++) {
        obstacles.push({
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        });
    }
}

// Dibuja los obstáculos
function drawObstacles() {
    ctx.fillStyle = "brown";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, box, box);
    });
}

// Comprobar colisión con obstáculos
function isCollisionWithObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        if (snake[0].x === obstacles[i].x && snake[0].y === obstacles[i].y) {
            return true;
        }
    }
    return false;
}

// Dibujar la serpiente
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "lime"; // La cabeza es de color verde
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

// Dibujar la comida
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

// Actualizar el puntaje
function updateScore() {
    document.getElementById("score").textContent = score;
    document.getElementById("high-score").textContent = highScore;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("high-score", highScore);
    }
}

// Mover la serpiente
function moveSnake() {
    let head = { ...snake[0] };
    
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;

    snake.unshift(head); // Añadir la cabeza

    // Verifica si come la comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
        generateObstacles();
        changeBackgroundColor();
    } else {
        snake.pop(); // Eliminar la última parte de la serpiente
    }

    // Verifica las colisiones
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || isCollisionWithObstacles()) {
        clearInterval(gameInterval);
        alert("Game Over!");
        updateScore();
        restartGame();
    }
}

// Generar comida aleatoria
function generateFood() {
    food = {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };
}

// Cambiar el color del fondo del tablero cada vez que se come la manzana
function changeBackgroundColor() {
    const colors = ["#333", "#444", "#555", "#666", "#777"];
    backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    canvas.style.backgroundColor = backgroundColor;
}

// Dibujar el juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawObstacles();
    moveSnake();
    updateScore();
}

// Cambiar dirección
document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    if (e.keyCode === 38 && direction !== "DOWN") direction = "UP";
    if (e.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    if (e.keyCode === 40 && direction !== "UP") direction = "DOWN";
});

// Reiniciar el juego
function restartGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    score = 0;
    generateObstacles();
    direction = "RIGHT";
    gameSpeed = 100;
    backgroundColor = "#333"; // reiniciar color de fondo
    generateFood();
    canvas.style.backgroundColor = backgroundColor;
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, gameSpeed);
}

// Cambiar tema visual
function toggleTheme() {
    document.body.classList.toggle("neon");
}

// Iniciar el juego
generateObstacles();
generateFood();
gameInterval = setInterval(draw, gameSpeed);
