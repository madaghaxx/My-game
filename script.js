let player = document.getElementById("player");
let box = document.getElementsByClassName("the-all")[0];
let boxPos = box.getBoundingClientRect();
if (player) {
  player.style.left = player.style.left || "0px";
  player.style.top = player.style.top || "0px";

  addEventListener("keydown", (e) => {
    let left = parseInt(player.style.left) || 0;
    let top = parseInt(player.style.top) || 0;

    switch (e.key) {
      case "ArrowRight" || "d":
        player.style.left = left + 1 + "%";
        break;
      case "ArrowLeft" || "q":
        player.style.left = left - 1 + "%";
        break;
      case "ArrowUp" || "z":
        player.style.top = top - 1 + "%";
        break;
      case "ArrowDown" || "s":
        player.style.top = top + 1 + "%";
        break;
    }
  });
}
