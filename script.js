const canvas = document.getElementById("flappyBirdCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  gravity: 0.5, // Reduced gravity for slower falling speed
  lift: -10, // Adjusted for a smoother lift
  velocity: 0,
};

const pipes = [];
const pipeWidth = 100;
const pipeGap = 200;
let pipeSpeed = 2;
let score = 0;
let isGameOver = false;

function createPipe() {
  const pipeHeight = Math.random() * (canvas.height / 2);
  pipes.push({
    x: canvas.width,
    y: pipeHeight,
    width: pipeWidth,
    height: pipeHeight,
  });
}

function drawBird() {
  ctx.fillStyle = "#3d591a";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "#523419";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.height);
    ctx.fillRect(
      pipe.x,
      pipe.height + pipeGap,
      pipe.width,
      canvas.height - pipe.height - pipeGap
    );
  });
}

function updatePipes() {
  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed;

    if (pipe.x + pipe.width < 0) {
      pipes.shift();
      score++;
    }

    if (
      (bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipe.width &&
        (bird.y < pipe.height ||
          bird.y + bird.height > pipe.height + pipeGap)) ||
      bird.y + bird.height > canvas.height
    ) {
      gameOver();
    }
  });
}

function gameOver() {
  isGameOver = true;
  document.getElementById("gameOverMessage").style.display = "block";
}

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  isGameOver = false;
  document.getElementById("gameOverMessage").style.display = "none";
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 50);
}

function gameLoop() {
  if (!isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird gravity and movement
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0) {
      bird.y = 0;
    }

    drawBird();
    drawPipes();
    drawScore();

    updatePipes();

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
      createPipe();
    }
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (isGameOver) {
      resetGame();
    } else {
      bird.velocity = bird.lift;
    }
  }
});

gameLoop();
