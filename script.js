let player = document.getElementById("player");
let box = document.getElementsByClassName("the-all")[0];
let boxPos = box.getBoundingClientRect();
if (player) {
  player.style.top = boxPos.height - player.offsetHeight - 1 + "px";
  player.style.left = player.style.left || "0px";
  addEventListener("keydown", (e) => {
    let left = parseInt(player.style.left) || 0;
    if (e.key == "ArrowRight") {
      if (
        !(parseInt(player.style.left) + player.offsetWidth >= boxPos.right - 10)
      ) {
        player.style.left = left + 10 + "px";
      }
    }
    if (e.key == "ArrowLeft") {
      if (!(parseInt(player.style.left) <= boxPos.left + 10)) {
        player.style.left = left - 10 + "px";
      }
    }
  });
}
