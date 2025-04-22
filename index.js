const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let setIntervalId;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let gameOver = false;
let score = 0;

let foods = [];

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// генерация одной еды
const generateFood = () => {
    const x = Math.floor(Math.random() * 30) + 1;
    const y = Math.floor(Math.random() * 30) + 1;
    return { x, y };
};

// обновление количества еды в зависимости от очков
const updateFoodList = () => {
    const maxFood = Math.floor(score / 7) + 1;
    while (foods.length < maxFood) {
        foods.push(generateFood());
    }
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game over!");
    location.reload();
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

const initGame = () => {
    if (gameOver) return handleGameOver();

    updateFoodList();

    let html = "";
    // отрисовываем еду
    for (const food of foods) {
        html += `<div class="food" style="grid-area: ${food.y} / ${food.x}"></div>`;
    }

    // проверка, съел ли змей еду
    foods = foods.filter(food => {
        if (snakeX === food.x && snakeY === food.y) {
            score++;
            snakeBody.push([food.y, food.x]);
            highScore = Math.max(score, highScore);
            localStorage.setItem("high-score", highScore);
            scoreElement.innerText = `Score: ${score}`;
            highScoreElement.innerText = `High Score: ${highScore}`;
            return false; // удалить съеденную еду
        }
        return true;
    });

    snakeX += velocityX;
    snakeY += velocityY;

    // сдвигаем тело змеи
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeY, snakeX];

    // проверка столкновения со стеной
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // отрисовка змеи
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`;
        // проверка столкновения с собой
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = html;
};

setIntervalId = setInterval(initGame, 100);
document.addEventListener("keydown", changeDirection);

// === мобильные свайпы ===
let startX, startY;

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;
    let diffX = endX - startX;
    let diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && velocityX !== -1) changeDirection({ key: "ArrowRight" });
        else if (diffX < 0 && velocityX !== 1) changeDirection({ key: "ArrowLeft" });
    } else {
        if (diffY > 0 && velocityY !== -1) changeDirection({ key: "ArrowDown" });
        else if (diffY < 0 && velocityY !== 1) changeDirection({ key: "ArrowUp" });
    }
});
// gyvates pagreitis tam tikram lygi
const updateSpeed = () => {
    const baseSpeed = 100; // pradinis
    const speedIncrease = Math.floor(score / 5) * 10; // kas 5score
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, Math.max(baseSpeed - speedIncrease, 40)); // min greitis
};

// update greitis ant score
const originalUpdateFoodList = updateFoodList;
updateFoodList = () => {
    originalUpdateFoodList();
    updateSpeed();
};



