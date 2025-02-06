const player = document.getElementById("player");
const box = document.getElementsByClassName("the-all")[0];
const boxPos = box.getBoundingClientRect();
let playerPos = player.getBoundingClientRect();

if (player) {
  player.style.top = boxPos.height - player.offsetHeight - 1 + "px";
  player.style.left = boxPos.left + "px";
  addEventListener("keydown", (e) => {
    playerPos = player.getBoundingClientRect();
    let left = parseInt(player.style.left) || 0;
    if (e.key == "ArrowRight" || e.key == "d") {
      if (playerPos.right < boxPos.right) {
        player.style.left = left + 10 + "px";
      }
    }
    if (e.key == "ArrowLeft" || e.key == "a") {
      if (playerPos.left > boxPos.left) {
        player.style.left = left - 10 + "px";
      }
    }
    if (e.key == " ") {
      const shot = document.createElement("div");
      const shotPos = shot.getBoundingClientRect();
      shot.classList.add("bullet");
      shot.style.left =
        playerPos.left + playerPos.width / 2 - shotPos.width / 2 + "px";
      shot.style.top = playerPos.top - playerPos.height + "px";
      box.append(shot);
      shotmove(shot);
    }
  });
}

const shotmove = (shot) => {
  const interval = setInterval(() => {
    let shotPos = shot.getBoundingClientRect();
    if (shotPos.top > 0) {
      shot.style.top = shot.offsetTop - 100 + "px";
    } else {
      clearInterval(interval);
      shot.remove();
    }
  }, 10);
};
