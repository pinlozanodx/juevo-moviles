// Variables globales
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");

const box = 20; // Tamaño de cada cuadro de la serpiente
let snake = [{ x: 10 * box, y: 10 * box }]; // Posición inicial de la serpiente
let direction = "RIGHT"; // Dirección inicial
let nextDirection = "RIGHT"; // Siguiente dirección a la que debe moverse
let food = getRandomFoodPosition(); // Comida
let score = 0; // Puntaje
let gameInterval;
let timer = 0; // Temporizador

// Botones y eventos
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeyPress);

// Manejadores de los botones para controlar la dirección
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", (event) => {
        const direction = event.target.dataset.direction;
        changeDirection(direction);
    });
});

// Función que maneja las teclas de dirección
function handleKeyPress(event) {
    if (event.key === " ") {
        resetGame(); // Reinicia el juego al presionar "Espacio"
    } else if (event.key === "Escape") {
        togglePause(); // Pausar al presionar "Escape"
    } else {
        changeDirection(event.key);
    }
}

// Función para cambiar la dirección de la serpiente
function changeDirection(newDirection) {
    if (newDirection === "ArrowUp" || newDirection === "w") {
        if (direction !== "DOWN") nextDirection = "UP";
    } else if (newDirection === "ArrowDown" || newDirection === "s") {
        if (direction !== "UP") nextDirection = "DOWN";
    } else if (newDirection === "ArrowLeft" || newDirection === "a") {
        if (direction !== "RIGHT") nextDirection = "LEFT";
    } else if (newDirection === "ArrowRight" || newDirection === "d") {
        if (direction !== "LEFT") nextDirection = "RIGHT";
    }
}

// Función para pausar y reanudar el juego
function togglePause() {
    if (gameInterval) {
        clearInterval(gameInterval);
    } else {
        gameInterval = setInterval(draw, 100); // Reanudar el juego
    }
}

// Dibuja el juego en cada ciclo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    // Dibuja la comida
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    // Mueve la serpiente
    let newHead = { x: snake[0].x, y: snake[0].y };

    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;

    // Colisión con el borde o con su propio cuerpo
    if (isCollision(newHead)) {
        clearInterval(gameInterval);
        restartBtn.style.display = "block"; // Mostrar el botón de reiniciar
        return;
    }

    // Comer comida
    if (newHead.x === food.x && newHead.y === food.y) {
        score++; // Aumentar el puntaje
        food = getRandomFoodPosition(); // Nueva comida
    } else {
        snake.pop(); // Eliminar la última parte de la serpiente
    }

    snake.unshift(newHead); // Insertar nueva cabeza

    // Dibuja la serpiente
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lime"; // Color de la cabeza y cuerpo
        ctx.beginPath();
        ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Actualiza el puntaje
    scoreDisplay.textContent = score;
}

// Función que verifica si la serpiente colisiona
function isCollision(head) {
    return (
        head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
        snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)
    );
}

// Función para generar una nueva posición aleatoria de comida
function getRandomFoodPosition() {
    let newFood;
    do {
        newFood = { x: Math.floor(Math.random() * 30) * box, y: Math.floor(Math.random() * 30) * box };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

// Función que inicia el juego
function startGame() {
    menu.style.display = "none"; // Ocultar el menú
    document.querySelector(".game-container").style.display = "flex"; // Mostrar el juego
    restartBtn.style.display = "none"; // Ocultar el botón de reiniciar

    score = 0;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    food = getRandomFoodPosition();

    gameInterval = setInterval(draw, 100); // Iniciar el ciclo de dibujo
}

// Función que reinicia el juego
function resetGame() {
    clearInterval(gameInterval);
    menu.style.display = "block"; // Mostrar el menú
    document.querySelector(".game-container").style.display = "none"; // Ocultar el juego
    restartBtn.style.display = "none"; // Ocultar el botón de reiniciar
}
