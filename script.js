// Obtener el canvas y el contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaño de cada celda en la cuadrícula
const box = 20;

// Configurar el tamaño del canvas
canvas.width = 400;
canvas.height = 400;

// Variables del juego
let snake = [{ x: 10 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;
let direction = "RIGHT";

// Función para cambiar la dirección
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// Función para dibujar en el canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Mover el cuerpo de la serpiente
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    const newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    // Comprobar si la serpiente come la comida
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } else {
        snake.pop(); // Elimina la última parte de la serpiente
    }

    // Dibujar la serpiente
    ctx.fillStyle = "lime";
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lime";
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Verificar colisiones
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(snakeX, snakeY)) {
        return gameOver();
    }
}

// Función para verificar si la serpiente se choca consigo misma
function collision(x, y) {
    return snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
}

// Función de fin de juego
function gameOver() {
    clearInterval(game);
    alert("¡Juego terminado! Puntuación final: " + score);
}

// Iniciar el juego
const game = setInterval(draw, 100);
