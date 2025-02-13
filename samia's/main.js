const scoreEl = document.querySelector("#score");
const gameContainer = document.querySelector(".game-container");
if (!scoreEl || !gameContainer) {
  console.error("Required DOM elements are missing.");
  throw new Error("Required DOM elements are missing.");
}
const player = {
  position: { x: 410, y: 630 },
  velocity: { x: 0 },
  width: 80,
  height: 60,
  imageSrc: "./image/space-invaders.png",
  element: null,
  lastShootFrame: 0,
  shootInterval: 20,
  lives: 3,
};
const projectiles = [];
const invaderProjectiles = [];
const grids = [];
const keys = { space: false };
let frames = 0;
let score = 0;
let gameStarted = false;
let gameActive = true;
let paused = false;
function createElement(tag, className, src) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (src) element.src = src;
  gameContainer.appendChild(element);
  return element;
}
function createPlayer() {
  player.element = createElement("img", "player", player.imageSrc);
  drawPlayer();
}
function drawPlayer() {
  player.element.style.left = `${player.position.x}px`;
  player.element.style.top = `${player.position.y}px`;
}
function shoot(currentFrame) {
  if (currentFrame - player.lastShootFrame >= player.shootInterval) {
    projectiles.push({
      position: {
        x: player.position.x + player.width / 2,
        y: player.position.y,
      },
      velocity: { x: 0, y: -5 },
      element: createElement("div", "projectile"),
    });
    player.lastShootFrame = currentFrame;
  }
}
function updateProjectile(projectile) {
  projectile.position.y += projectile.velocity.y;
  projectile.element.style.left = `${projectile.position.x}px`;
  projectile.element.style.top = `${projectile.position.y}px`;
}
function removeProjectile(projectile) {
  projectile.element.remove();
}
function createInvader(position) {
  const invader = {
    position: { ...position },
    velocity: { x: 0.5, y: 0 },
    width: 60,
    height: 40,
    element: createElement("img", "invader", "./image/invader.png"),
  };
  updateInvader(invader);
  return invader;
}
function updateInvader(invader, velocity = invader.velocity) {
  invader.position.x += velocity.x;
  invader.element.style.left = `${invader.position.x}px`;
  invader.element.style.top = `${invader.position.y}px`;
}
function shootInvader(invader) {
  invaderProjectiles.push({
    position: {
      x: invader.position.x + invader.width / 2,
      y: invader.position.y + invader.height,
    },
    velocity: { x: 0, y: 5 },
    element: createElement("div", "invader-projectile"),
  });
}
function createGrid() {
  const grid = {
    position: { x: 0, y: 0 },
    velocity: { x: 2, y: 0 },
    invaders: [],
  };
  const rows = 3;
  const cols = 6;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid.invaders.push(createInvader({ x: j * 70, y: i * 55 }));
    }
  }
  return grid;
}
function updateGrid(grid) {
  grid.position.x += grid.velocity.x;
  const leftmostInvader = Math.min(
    ...grid.invaders.map((inv) => inv.position.x)
  );
  const rightmostInvader = Math.max(
    ...grid.invaders.map((inv) => inv.position.x)
  );
  if (
    rightmostInvader + 60 > gameContainer.offsetWidth ||
    leftmostInvader < 0
  ) {
    grid.velocity.x *= -1;
  }
  grid.invaders.forEach((inv) => updateInvader(inv, grid.velocity));
}
function checkCollision(projectile, collided) {
  return (
    projectile.position.x >= collided.position.x &&
    projectile.position.x <= collided.position.x + collided.width &&
    projectile.position.y >= collided.position.y &&
    projectile.position.y <= collided.position.y + collided.height
  );
}
function showEndScreen() {
  const overlay = createElement("div", "popup-overlay");
  const popup = createElement("div", "popup");
  popup.innerHTML = `<h2>YOU WIN!</h2><p>Final Score: </p><p id="score">${score}</p><button onclick="restartGame()">Restart</button>`;
  overlay.appendChild(popup);
  player.velocity.x = 0;
  keys.space = false;
}
function animate() {
  if (!gameActive || !gameStarted || paused) return;
  if (keys.space) shoot(frames);
  movePlayer();
  projectiles.forEach((p, i) => {
    updateProjectile(p);
    if (p.position.y < 0) {
      removeProjectile(p);
      projectiles.splice(i, 1);
    }
  });
  grids.forEach((grid) => {
    updateGrid(grid);
    grid.invaders.forEach((invader, invIndex) => {
      projectiles.forEach((p, pIndex) => {
        if (checkCollision(p, invader)) {
          invader.element.remove();
          removeProjectile(p);
          score += 100;
          scoreEl.innerHTML = score;
          grid.invaders.splice(invIndex, 1);
          projectiles.splice(pIndex, 1);
        }
      });
    });
    if (Math.random() < 0.05 && grid.invaders.length > 0) {
      const randomInvader =
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)];
      if (randomInvader) shootInvader(randomInvader);
    }
  });
  invaderProjectiles.forEach((p, i) => {
    updateProjectile(p);
    if (p.position.y > 700) {
      removeProjectile(p);
      invaderProjectiles.splice(i, 1);
    }

    if (checkCollision(p, player)) {
      player.lives--;
      document.querySelector("#lives").innerHTML = `Lives: ${player.lives}`;
      removeProjectile(p);
      invaderProjectiles.splice(i, 1);
      if (player.lives <= 0) {
        gameActive = false;
        showGameOver();
      }
    }
  });
  if (frames === 0 && gameStarted) {
    grids.push(createGrid());
  }
  if (grids.every((grid) => grid.invaders.length === 0)) {
    gameActive = false;
    showEndScreen();
  }
  frames++;
  requestAnimationFrame(animate);
}

function movePlayer() {
  player.position.x += player.velocity.x;
  player.position.x = Math.max(
    0,
    Math.min(player.position.x, gameContainer.offsetWidth - player.width)
  );
  drawPlayer();
}
function restartGame() {
  document.querySelector(".popup-overlay")?.remove();
  score = 0;
  scoreEl.innerHTML = score;
  frames = 0;
  gameActive = true;
  gameStarted = true;
  player.lives = 3;
  projectiles.forEach((p) => removeProjectile(p));
  projectiles.length = 0;
  invaderProjectiles.forEach((p) => removeProjectile(p));
  invaderProjectiles.length = 0;
  grids.forEach((grid) =>
    grid.invaders.forEach((invader) => invader.element.remove())
  );
  grids.length = 0;

  player.position = { x: 410, y: 630 };
  player.velocity = { x: 0 };
  player.lastShootFrame = 0;
  drawPlayer();
  animate();
}
function showGameOver() {
  const overlay = createElement("div", "popup-overlay");
  const popup = createElement("div", "popup");
  popup.innerHTML = `<h2>GAME OVER</h2><p>Final Score: </p><p id="score">${score}</p><button onclick="restartGame()">Restart</button>`;
  overlay.appendChild(popup);
  player.velocity.x = 0;
  keys.space = false;
}
function togglePause() {
  paused = !paused;
  if (!paused) {
    document.querySelector(".popup-overlay")?.remove();
    animate();
  } else {
    showPauseMenu();
  }
}
function showPauseMenu() {
  const overlay = createElement("div", "popup-overlay");
  const popup = createElement("div", "popup");
  popup.innerHTML = `<h2>PAUSED</h2><button onclick="togglePause()">Continue</button><button onclick="restartGame()">Restart</button>`;
  overlay.appendChild(popup);
}
document.getElementById("startButton").addEventListener("click", () => {
  document.querySelector(".start-screen").style.display = "none";
  gameStarted = true;
  gameActive = true;
  createPlayer();
  animate();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") player.velocity.x = -5;
  if (event.key === "ArrowRight") player.velocity.x = 5;
  if (event.key === " ") keys.space = true;
  if (event.key === "Escape") togglePause();
});
window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft")
    player.velocity.x = 0;
  if (event.key === " ") keys.space = false;
});

gameContainer.addEventListener("touchstart", (event) => {
  const touchX = event.touches[0].clientX;
  player.velocity.x = touchX < window.innerWidth / 2 ? -5 : 5;
});

gameContainer.addEventListener("touchend", () => {
  player.velocity.x = 0;
});
