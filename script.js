// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [{x: 10 * box, y: 10 * box}];
let direction = "right";
let food = {
    x: Math.floor(Math.random() * 30) * box,
    y: Math.floor(Math.random() * 30) * box
};
let speed = 200;
let gameInterval;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").textContent = highScore;

function draw() {
    ctx.fillStyle = "#6ab04c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "blue";
    snake.forEach((part, index) => {
        ctx.beginPath();
        ctx.arc(part.x + box / 2, part.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
        if (index === 0) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(part.x + box / 3, part.y + box / 3, box / 6, 0, Math.PI * 2);
            ctx.arc(part.x + 2 * box / 3, part.y + box / 3, box / 6, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        changeDirection(button.getAttribute("data-direction"));
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp") changeDirection("up");
    if (event.key === "ArrowDown") changeDirection("down");
    if (event.key === "ArrowLeft") changeDirection("left");
    if (event.key === "ArrowRight") changeDirection("right");
});

function changeDirection(newDirection) {
    if ((newDirection === "up" && direction !== "down") ||
        (newDirection === "down" && direction !== "up") ||
        (newDirection === "left" && direction !== "right") ||
        (newDirection === "right" && direction !== "left")) {
        direction = newDirection;
    }
}

function update() {
    move();
}

function move() {
    let head = {...snake[0]};
    if (direction === "up") head.y -= box;
    if (direction === "down") head.y += box;
    if (direction === "left") head.x -= box;
    if (direction === "right") head.x += box;
    
    if (head.x === food.x && head.y === food.y) {
        food.x = Math.floor(Math.random() * 30) * box;
        food.y = Math.floor(Math.random() * 30) * box;
        score += 10;
        document.getElementById("score").textContent = score;
        speed = Math.max(100, speed * 0.95);
        snake.push({...snake[snake.length - 1]});
    } else {
        snake.pop();
    }
    
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || 
        snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)) {
        resetGame();
        return;
    }
    
    snake.unshift(head);
    draw();
}

function restartGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(update, speed);
}

function resetGame() {
    snake = [{x: 10 * box, y: 10 * box}];
    direction = "right";
    speed = 200;
    score = 0;
    document.getElementById("score").textContent = score;
    restartGame();
}

restartGame();
