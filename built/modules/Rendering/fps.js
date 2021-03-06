import * as Init from "./init.js";
let secondsPassed;
let oldTimeStamp;
let fps;
function update(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fps = Math.round(1 / secondsPassed);
    if (!isNaN(fps)) {
        Init.context.font = "12px Arial";
        Init.context.fillStyle = "white";
        Init.context.fillText("FPS: " + fps, 5, 30);
    }
}
export { update };
