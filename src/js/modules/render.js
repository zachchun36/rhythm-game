"use strict";

import * as GameState from "./gameState.js";

var canvas;
var context;
var columnWidth;
var noteScrollWindowHeight;
var secondsPassed;
var oldTimeStamp;
var fps;
var hitNoteCircles = [];
var hitNoteTexts = [];

var columnFadeoutProgress = [0, 0, 0, 0, 0, 0, 0];

var PULSE_DIRECTIONS = {
    INCREASING: 0.5,
    DECREASING: -0.5
};

var hitNotePulse = {
    height: 0,
    direction: PULSE_DIRECTIONS.DECREASING
};
var NOTE_HEIGHT = 7;
var COLUMN_WIDTH_RATIO = 1 / 10.0;
var NOTE_SCROLL_WINDOW_HEIGHT_RATIO = 2.0 / 3.0;

var GOOD_COLOR_RGB = "rgba(232, 196, 16, ";
var BAD_COLOR_RGB = "rgba(227, 91, 45, ";
var MISS_COLOR_RGB = "rgba(227, 227, 227, ";


const PROGRESS_BAR_WIDTH = 3;

let noteScrollWindowHeightPlusTimingBoxes;


let flairOpacity = 0;

const MAX_FLAIR_GLOW_OPACITY = 0.5;
const FLAIR_FADE_RATE = 1.0 / 50.0;
let recentlyInSmoothieTime = true;


function draw(timeStamp) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fps = Math.round(1 / secondsPassed);
    if (!isNaN(fps)) {
        context.font = "12px Arial";
        context.fillStyle = "white";
        context.fillText("FPS: " + fps, 5, 30);
    }
    context.clearRect(
        1.5 * columnWidth,
        0,
        7 * columnWidth - 1,
        noteScrollWindowHeight + columnWidth - 1
    );
    drawColumnsAndGradients();
    drawBeetJuiceBar();
    drawSongProgressBar();
    drawFlairGlowFade();
    drawSmoothieTimeGlow();
    drawHitTimingBoxes();
    drawNotes();
    drawFakeHeldNotes();
    drawTimingBarPulse();
    drawHitNoteTexts();
    drawHitNoteCircles();
}

function initialRender() {
    // Get a reference to the canvas
    console.log("hello");
    canvas = document.getElementById("canvas");
    fixDPI();
    columnWidth = canvas.width * COLUMN_WIDTH_RATIO;
    noteScrollWindowHeight = canvas.height * NOTE_SCROLL_WINDOW_HEIGHT_RATIO;
    noteScrollWindowHeightPlusTimingBoxes = noteScrollWindowHeight + columnWidth - 1
    context = canvas.getContext("2d");

    // Compute column x positions
    for (var i = 0; i < GameState.columns.length; i++) {
        GameState.columns[i].xPosition = 1.5 * columnWidth + columnWidth * i;
    }
}

function drawProgressBar(xPosition, progress, color) {
    let grd = context.createLinearGradient(
        xPosition,
        0,
        xPosition + PROGRESS_BAR_WIDTH,
        noteScrollWindowHeightPlusTimingBoxes
    );
    grd.addColorStop(0, "rgba(256, 256, 256, .3)");
    grd.addColorStop(1, "rgba(256, 256, 256, 1)");
    context.fillStyle = grd;
    context.fillRect(
        xPosition,
        0,
        PROGRESS_BAR_WIDTH,
        noteScrollWindowHeightPlusTimingBoxes
    );
    context.fillStyle = color;
    context.fillRect(
        xPosition,
        noteScrollWindowHeightPlusTimingBoxes - progress,
        PROGRESS_BAR_WIDTH,
        progress
    )
}

function drawSongProgressBar() {
    let completionProgress = noteScrollWindowHeightPlusTimingBoxes * GameState.song.currentTime / GameState.song.duration;
    drawProgressBar(GameState.columns[0].xPosition - PROGRESS_BAR_WIDTH,
        completionProgress,
        "#42a4f5"
    )
}

function drawGradientTimingBoxes(
    timingBoxIndex,
    gradientColor1,
    gradientColor2
) {
    // gradient dimensions is twice as big as the rectangle we draw since we dont wnat a full gradient to black / blue, we just want some partial shading
    var grd = context.createLinearGradient(
        0,
        noteScrollWindowHeight,
        0,
        (2.0 / 3.0) * canvas.height + 2 * (columnWidth - 1)
    );
    grd.addColorStop(0, gradientColor1);
    grd.addColorStop(1, gradientColor2);
    context.fillStyle = grd;
    // draw timing box
    context.fillRect(
        GameState.columns[timingBoxIndex].xPosition,
        noteScrollWindowHeight,
        columnWidth - 1,
        columnWidth - 1
    );
}

function drawGradientForNoteScrollWindowKeyHold(
    timingBoxIndex,
    gradientColor1,
    gradientColor2
) {
    // partial shading
    var grd = context.createLinearGradient(
        0,
        0,
        0,
        canvas.height + 2 * (columnWidth - 1)
    );
    grd.addColorStop(0, gradientColor1);
    grd.addColorStop(1, gradientColor2);
    context.fillStyle = grd;
    // width of full gradient effect
    context.fillRect(
        GameState.columns[timingBoxIndex].xPosition +
        0.5 * columnFadeoutProgress[timingBoxIndex],
        0,
        columnWidth - 1 * columnFadeoutProgress[timingBoxIndex] - 1,
        noteScrollWindowHeight
    );
}

function drawYellowGlow(opacity) {
    var grd = context.createLinearGradient(
        GameState.columns[0].xPosition,
        -200, // arbitrary gradient
        GameState.columns[0].xPosition,
        1.3 * noteScrollWindowHeight
    );
    grd.addColorStop(0, "rgba(0, 0, 0, 0)");
    grd.addColorStop(1, "rgba(214, 185, 11, " + opacity);
    context.fillStyle = grd;
    context.fillRect(
        GameState.columns[0].xPosition,
        0,
        columnWidth * GameState.columns.length - 1,
        noteScrollWindowHeight
    );
}

function drawFlairEffects() {
    if (!GameState.smoothieTime) {
        flairOpacity = MAX_FLAIR_GLOW_OPACITY;
    }
}

function drawFlairGlowFade() {
    if (flairOpacity >= 0) {
        drawYellowGlow(flairOpacity);
        flairOpacity -= MAX_FLAIR_GLOW_OPACITY * FLAIR_FADE_RATE;
    }

    // need to decrease flair opacity constantly
    // need to keep /calling this flairGlow function
    // call from the controller to trigger the opacity to be set to MAX_FLAIR_GLOW_OPACITY
}

function drawSmoothieTimeGlow() {
    if (GameState.smoothieTime) {
        drawYellowGlow(MAX_FLAIR_GLOW_OPACITY);
        recentlyInSmoothieTime = true;
    }
    if (recentlyInSmoothieTime) {
        recentlyInSmoothieTime = false;
        flairOpacity = MAX_FLAIR_GLOW_OPACITY;
    }
}

function drawBeetJuiceBar() {
    let endColumnsXPosition = GameState.columns.length * columnWidth + GameState.columns[0].xPosition - 1;
    let color;
    if (GameState.beetJuice >= GameState.SMOOTHIE_TIME_THRESHOlD && !GameState.smoothieTime) {
        color = "#ea3788"
    } else {
        color = "#9a294c";
    }
    let completionProgress = noteScrollWindowHeightPlusTimingBoxes * GameState.beetJuice / 100.0;
    drawProgressBar(endColumnsXPosition, completionProgress, color);
    let smoothieTimeThresholdYPosition = noteScrollWindowHeightPlusTimingBoxes - (noteScrollWindowHeightPlusTimingBoxes * GameState.SMOOTHIE_TIME_THRESHOlD / 100.0);
    context.fillStyle = "white";
    context.fillRect(
        endColumnsXPosition,
        smoothieTimeThresholdYPosition,
        PROGRESS_BAR_WIDTH,
        1
    )
}

function computeNoteYPosition(noteTime) {
    var currentTime = GameState.song.currentTime || 0.0;
    var timeLeft = noteTime - GameState.song.currentTime;
    // delete note / dont draw after its negative later
    return noteScrollWindowHeight - timeLeft * 300;
}

function createHitNoteTextObject(text, index, colorRGB) {
    hitNoteTexts.push({
        colorRGB: colorRGB,
        text: text,
        columnIndex: index,
        yOffset: 0,
        opacity: 1.0
    });
}

function createHitNoteCircleObject(y, index) {
    hitNoteCircles.push({
        columnIndex: index,
        yHit: y,
        radius: 1
    });
}

function computeNoteTailXPosition(columnX) {
    return columnX + (columnWidth - 1) / 2.0 - NOTE_HEIGHT / 2.0;
}

function drawHitTimingBoxes() {
    for (var i = 0; i < GameState.columns.length; i++) {
        // hit timing boxes
        var gradientColor = GameState.columns[i].keyDown ? "yellow" : "black";
        drawGradientTimingBoxes(
            i,
            GameState.columns[i].color + " 1)",
            gradientColor
        );
    }
}

function drawFakeHeldNotes() {
    for (let i = 0; i < GameState.columns.length; i++) {
        // fake notes for correctly held down notes
        if (GameState.columns[i].holdingDownNote) {
            context.fillStyle = GameState.columns[i].color + " 1)";
            context.fillRect(
                GameState.columns[i].xPosition,
                noteScrollWindowHeight - NOTE_HEIGHT / 2.0,
                columnWidth - 1,
                NOTE_HEIGHT
            );
        }
    }
}

function drawHitNoteCircles() {
    for (var i = 0; i < hitNoteCircles.length; i++) {
        // x, y, r,
        context.strokeStyle =
            GameState.columns[hitNoteCircles[i].columnIndex].color + " 1)";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(
            GameState.columns[hitNoteCircles[i].columnIndex].xPosition +
            columnWidth / 2.0,
            hitNoteCircles[i].yHit,
            hitNoteCircles[i].radius,
            0,
            2 * Math.PI
        );
        context.stroke();
        hitNoteCircles[i].radius += 1;
        if (hitNoteCircles[i].radius > columnWidth / 2.0) {
            hitNoteCircles.splice(i, 1);
            i--;
        }
    }
}

function drawHitNoteTexts() {
    for (var i = 0; i < hitNoteTexts.length; i++) {
        var noteText = hitNoteTexts[i];
        context.fillStyle = noteText.colorRGB + hitNoteTexts[i].opacity + ")";
        context.font = "8pt Monaco";
        context.fillText(
            noteText.text,
            GameState.columns[noteText.columnIndex].xPosition,
            noteScrollWindowHeight - noteText.yOffset * 2
        );
        noteText.yOffset += 0.5;
        noteText.opacity -= 0.015;
        if (noteText.opacity <= 0) {
            hitNoteTexts.splice(i, 1);
            i--;
        }
    }
}

function drawNotes() {
    // notes, to look into optimization methods
    for (var i = 0; i < GameState.notes.length; i++) {
        let yPosition = computeNoteYPosition(GameState.notes[i].time);
        if (GameState.notes[i].hitY === -1) {
            if (yPosition >= 0 && yPosition <= noteScrollWindowHeight) {
                context.fillStyle =
                    GameState.columns[GameState.notes[i].column].color + " 1)";
                context.fillRect(
                    GameState.columns[GameState.notes[i].column].xPosition,
                    yPosition,
                    columnWidth - 1,
                    NOTE_HEIGHT
                );
            }
        }
        drawNoteTail(GameState.notes[i], yPosition);
        // TODO optimize to start loop later past old notes
    }
}

function drawColumnsAndGradients() {
    for (var i = 0; i < GameState.columns.length; i++) {
        context.fillStyle = "black";
        context.fillRect(
            GameState.columns[i].xPosition,
            0,
            columnWidth - 1,
            noteScrollWindowHeight
        );
        context.fillStyle = "rgba(128, 0, 0, 1)";
        context.fillRect(
            GameState.columns[i].xPosition,
            noteScrollWindowHeight - columnWidth / 25,
            columnWidth - 1,
            columnWidth / 25
        );
        // draw full gradient timing boxes
        // grdOpacity = speed of gradient transparency
        var grdOpacity = 1 - columnFadeoutProgress[i] * 0.05;
        var gradientColor =
            columnFadeoutProgress[i] < columnWidth / 2
                ? GameState.columns[i].color + grdOpacity
                : "rgba(0, 0, 0, " + grdOpacity;
        if (GameState.columns[i].keyDown) {
            columnFadeoutProgress[i] = 0;
        }
        drawGradientForNoteScrollWindowKeyHold(
            i,
            "rgba(0, 0, 0, " + grdOpacity,
            gradientColor
        );
        // speed
        if (columnFadeoutProgress[i] < columnWidth / 2) {
            columnFadeoutProgress[i]++;
        }
    }
}

function drawNoteTail(note, yPosition) {
    if (
        note.endTime &&
        (GameState.columns[note.column].holdingDownNote ||
            (note.hitY === -1 &&
                GameState.song.currentTime < note.time + 0.2))
    ) {
        context.fillStyle =
            GameState.columns[note.column].color + " 1)";
        let endYPosition = computeNoteYPosition(note.endTime);
        let tailHeight = yPosition - endYPosition;
        if (tailHeight + endYPosition >= noteScrollWindowHeight) {
            tailHeight = noteScrollWindowHeight - endYPosition;
        }
        if (
            endYPosition + tailHeight >= 0 &&
            endYPosition <= noteScrollWindowHeight
        ) {
            context.fillRect(
                computeNoteTailXPosition(
                    GameState.columns[note.column].xPosition
                ),
                endYPosition,
                NOTE_HEIGHT,
                tailHeight
            );
        }
    }
}

function drawTimingBarPulse() {
    if (hitNotePulse.height >= 0.4 * columnWidth) {
        hitNotePulse.direction = PULSE_DIRECTIONS.DECREASING;
    }
    if (hitNotePulse.height < 0) {
        hitNotePulse.height = 0;
    }
    // pulse speed
    var pulseDelta = hitNotePulse.direction * 2;
    hitNotePulse.height += pulseDelta;
    var grd = context.createLinearGradient(
        0,
        noteScrollWindowHeight - hitNotePulse.height,
        0,
        noteScrollWindowHeight
    );
    grd.addColorStop(0, "rgba(72, 209, 204, 0)");
    grd.addColorStop(1, "rgba(72, 209, 204, 0.8)");
    context.fillStyle = grd;
    context.fillRect(
        GameState.columns[0].xPosition,
        noteScrollWindowHeight - hitNotePulse.height,
        columnWidth * 7 - 1,
        hitNotePulse.height + 1
    );
}

function fixDPI() {
    var dpi = window.devicePixelRatio;
    console.log(dpi);
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    var styleHeight = +getComputedStyle(canvas)
        .getPropertyValue("height")
        .slice(0, -2);
    //get CSS width
    var styleWidth = +getComputedStyle(canvas)
        .getPropertyValue("width")
        .slice(0, -2);
    //scale the canvas
    console.log(canvas.height);
    canvas.setAttribute("height", styleHeight * dpi);
    canvas.setAttribute("width", styleWidth * dpi);
    console.log(canvas.height);
}

function drawNoteTimingEffects(noteTiming, hitY, index) {
    switch (noteTiming) {
        case GameState.NOTE_TIMINGS.PERFECT:
            createHitNoteTextObject("Perfect", index, GOOD_COLOR_RGB);
            createHitNoteCircleObject(hitY, index);
            hitNotePulse.direction = PULSE_DIRECTIONS.INCREASING;
            break;
        case GameState.NOTE_TIMINGS.GOOD:
            createHitNoteTextObject(" Good", index, GOOD_COLOR_RGB);
            createHitNoteCircleObject(hitY, index);
            hitNotePulse.direction = PULSE_DIRECTIONS.INCREASING;
            break;
        case GameState.NOTE_TIMINGS.BAD:
            createHitNoteTextObject("  Bad", index, BAD_COLOR_RGB);
            break;
        case GameState.NOTE_TIMINGS.MISS:
            createHitNoteTextObject(" Miss", index, MISS_COLOR_RGB);
    }
}

export { initialRender, draw, drawNoteTimingEffects, drawFlairEffects, computeNoteYPosition };
