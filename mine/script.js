import { fpsMeter } from "./fps.js";
const FireRate = 200;
const player = document.getElementById("player");
const box = document.getElementsByClassName("the-all")[0];
const shotmove = (shot, boxPos) => {
  const interval = setInterval(() => {
    let shotPos = shot.getBoundingClientRect();
    if (shotPos.top > boxPos.top) {
      shot.style.top = shotPos.top - 10 + "px";
    } else {
      clearInterval(interval);
      shot.remove();
    }
  }, 10);
};

const keys = {
  right: false,
  left: false,
};

if (box && player) {
  const boxPos = box.getBoundingClientRect();
  let playerPos = player.getBoundingClientRect();

  player.style.top = boxPos.height - player.offsetHeight + "px";
  player.style.left = boxPos.left + boxPos.width / 4 + "px";

  const handleKeydown = (e) => {
    if (e.key === "ArrowRight" || e.key === "d") {
      keys.right = true;
    }
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "q") {
      keys.left = true;
    }
    if (e.key === " " && !keys.shooting) {
      e.preventDefault();
      keys.shooting = true;

      playerPos = player.getBoundingClientRect();
      const shot = document.createElement("div");
      shot.classList.add("bullet");
      shot.style.left = playerPos.left + playerPos.width / 2 + "px";
      shot.style.top = playerPos.top + "px";
      box.append(shot);
      shotmove(shot, boxPos);

      setTimeout(() => {
        keys.shooting = false;
      }, FireRate);
    }
  };

  const handleKeyup = (e) => {
    if (e.key === "ArrowRight" || e.key === "d") {
      keys.right = false;
    }
    if (e.key === "ArrowLeft" || e.key === "q") {
      keys.left = false;
    }
    if (e.key === " ") {
      keys.shooting = false;
    }
  };

  const gameLoop = () => {
    playerPos = player.getBoundingClientRect();
    let left = parseInt(player.style.left) || 0;

    if (keys.right && playerPos.right < boxPos.right) {
      player.style.left = left + 10 + "px";
    }
    if (keys.left && playerPos.left > boxPos.left) {
      player.style.left = left - 10 + "px";
    }
    requestAnimationFrame(gameLoop);
  };

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  requestAnimationFrame(gameLoop);
}

fpsMeter();
