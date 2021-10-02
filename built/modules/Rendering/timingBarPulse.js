import * as Init from "./init.js";
const PULSE_DIRECTIONS = {
    INCREASING: 0.5,
    DECREASING: -0.5
};
const hitNotePulse = {
    height: 0,
    direction: PULSE_DIRECTIONS.DECREASING
};
function drawTimingBarPulse() {
    if (hitNotePulse.height >= 0.4 * Init.columnWidth) {
        hitNotePulse.direction = PULSE_DIRECTIONS.DECREASING;
    }
    if (hitNotePulse.height < 0) {
        hitNotePulse.height = 0;
    }
    // pulse speed
    let pulseDelta = hitNotePulse.direction * 2;
    hitNotePulse.height += pulseDelta;
    let grd = Init.context.createLinearGradient(0, Init.noteScrollWindowHeight - hitNotePulse.height, 0, Init.noteScrollWindowHeight);
    grd.addColorStop(0, "rgba(72, 209, 204, 0)");
    grd.addColorStop(1, "rgba(72, 209, 204, 0.8)");
    Init.context.fillStyle = grd;
    Init.context.fillRect(Init.columns[0].xPosition, Init.noteScrollWindowHeight - hitNotePulse.height, Init.columnWidth * 7 - 1, hitNotePulse.height + 1);
}
function startPulse() {
    hitNotePulse.direction = PULSE_DIRECTIONS.INCREASING;
}
export { startPulse, drawTimingBarPulse };
