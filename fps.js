const FpsHolder = document.getElementById("FPS");

export const fpsMeter = () => {
  let prevTime = Date.now(),
    frames = 0;

  requestAnimationFrame(function loop() {
    const time = Date.now();
    frames++;
    if (time > prevTime + 100) {
      let fps = Math.round((frames * 1000) / (time - prevTime));
      prevTime = time;
      frames = 0;
      FpsHolder.innerHTML = fps;
    }

    requestAnimationFrame(loop);
  });
};
