document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    let box;
    let canvasSize;
    let snake;
    let food;
    let score;
    let fruitScore;
    let highScore = localStorage.getItem("high-score") || 0;
    let obstacles;
    let direction;
    let gameInterval;
    let gameSpeed;
    let backgroundColor;

    function resizeCanvas() {
        canvas.width = Math.floor(window.innerWidth * 0.9);
        canvas.height = Math.floor(window.innerHeight * 0.7);
        box = Math.floor(Math.min(canvas.width, canvas.height) / 30);
        canvasSize = Math.floor(Math.min(canvas.width, canvas.height) / box);
        restartGame();
    }

    function restartGame() {
        snake = [{ x: 10 * box, y: 10 * box }];
        score = 0;
        fruitScore = 0;
        direction = "RIGHT";
        gameSpeed = 100;
        backgroundColor = "#333";
        food = generateFood();
        obstacles = [];
        canvas.style.backgroundColor = backgroundColor;
        clearInterval(gameInterval);
        gameInterval = setInterval(draw, gameSpeed);
    }

    function generateFood() {
        return {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    }

    function drawSnake() {
        ctx.fillStyle = "lime";
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? "green" : "lime";
            ctx.fillRect(segment.x, segment.y, box, box);
        });
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
            if (score % 3 === 0) {
                increaseGameSpeed();
            }
        } else {
            snake.pop();
        }

        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkSelfCollision()) {
            clearInterval(gameInterval);
            alert("¡Has perdido!");
            updateScore();
            restartGame();
        }
    }

    function checkSelfCollision() {
        return snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);
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
        moveSnake();
        updateScore();
    }

    document.addEventListener("keydown", (e) => {
        if (e.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
        if (e.keyCode === 38 && direction !== "DOWN") direction = "UP";
        if (e.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
        if (e.keyCode === 40 && direction !== "UP") direction = "DOWN";
    });

    document.getElementById("restart-btn").addEventListener("click", restartGame);
    document.getElementById("theme-toggle-btn").addEventListener("click", () => {
        document.body.classList.toggle("neon");
    });

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
});
