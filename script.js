document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const box = 20;
    let speed, obstacleCount, foodSpawnRate;
    
    let snake = [{ x: 10 * box, y: 10 * box }];
    let direction = "RIGHT";
    let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    let obstacles = [];
    let score = 0;

    function setDifficulty(level) {
        if (level === "Fácil") {
            speed = 150;
            obstacleCount = 3;
            foodSpawnRate = 1;
        } else if (level === "Normal") {
            speed = 100;
            obstacleCount = 5;
            foodSpawnRate = 1.5;
        } else {
            speed = 75;
            obstacleCount = 8;
            foodSpawnRate = 2;
        }
        generateObstacles();
        startGame();
    }

    function startGame() {
        document.getElementById("menu").style.display = "none";
        gameLoop = setInterval(updateGame, speed);
    }

    function generateObstacles() {
        obstacles = [];
        for (let i = 0; i < obstacleCount; i++) {
            obstacles.push({
                x: Math.floor(Math.random() * 20) * box,
                y: Math.floor(Math.random() * 20) * box,
            });
        }
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
        else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    });

    function updateGame() {
        let head = { x: snake[0].x, y: snake[0].y };
        if (direction === "UP") head.y -= box;
        else if (direction === "DOWN") head.y += box;
        else if (direction === "LEFT") head.x -= box;
        else if (direction === "RIGHT") head.x += box;

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
        } else {
            snake.pop();
        }

        for (let obs of obstacles) {
            if (head.x === obs.x && head.y === obs.y) {
                alert("Game Over");
                clearInterval(gameLoop);
                return;
            }
        }

        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            alert("Game Over");
            clearInterval(gameLoop);
            return;
        }

        snake.unshift(head);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);
        ctx.fillStyle = "green";
        snake.forEach(part => ctx.fillRect(part.x, part.y, box, box));
        ctx.fillStyle = "gray";
        obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, box, box));
    }

    document.getElementById("startEasy").addEventListener("click", () => setDifficulty("Fácil"));
    document.getElementById("startNormal").addEventListener("click", () => setDifficulty("Normal"));
    document.getElementById("startHard").addEventListener("click", () => setDifficulty("Difícil"));
});
