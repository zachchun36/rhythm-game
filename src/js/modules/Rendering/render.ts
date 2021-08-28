"use strict";

import * as GameState from "../gameState.js";
import * as NoteTypes from "../Types/Note.js";
import * as Init from "./init.js"
import * as HitNoteEffects from "./hitNoteEffects.js"

let secondsPassed;
let oldTimeStamp: number;
let fps;

const columnFadeoutProgress = [0, 0, 0, 0, 0, 0, 0];

const PULSE_DIRECTIONS = {
    INCREASING: 0.5,
    DECREASING: -0.5
};

const hitNotePulse = {
    height: 0,
    direction: PULSE_DIRECTIONS.DECREASING
};
const NOTE_HEIGHT = 7;

const GOOD_COLOR_RGB = "rgba(232, 196, 16, ";
const BAD_COLOR_RGB = "rgba(227, 91, 45, ";
const MISS_COLOR_RGB = "rgba(227, 227, 227, ";


const PROGRESS_BAR_WIDTH = 3;


let flairOpacity = 0;

const MAX_FLAIR_GLOW_OPACITY = 0.5;
const FLAIR_FADE_RATE = 1.0 / 50.0;
let recentlyInSmoothieTime = true;


function draw(timeStamp: number) {
    Init.context.clearRect(0, 0, Init.canvas.width, Init.canvas.height);
    Init.context.fillStyle = "black";
    Init.context.fillRect(0, 0, Init.canvas.width, Init.canvas.height);
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fps = Math.round(1 / secondsPassed);
    if (!isNaN(fps)) {
        Init.context.font = "12px Arial";
        Init.context.fillStyle = "white";
        Init.context.fillText("FPS: " + fps, 5, 30);
    }
    Init.context.clearRect(
        1.5 * Init.columnWidth,
        0,
        7 * Init.columnWidth - 1,
        Init.noteScrollWindowHeight + Init.columnWidth - 1
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
    HitNoteEffects.drawHitNoteTexts();
    HitNoteEffects.drawHitNoteCircles();
    drawStatusBox();
}

function drawProgressBar(xPosition: number, progress: number, color: string) {
    let grd = Init.context.createLinearGradient(
        xPosition,
        0,
        xPosition + PROGRESS_BAR_WIDTH,
        Init.noteScrollWindowHeightPlusTimingBoxes
    );
    grd.addColorStop(0, "rgba(256, 256, 256, .3)");
    grd.addColorStop(1, "rgba(256, 256, 256, 1)");
    Init.context.fillStyle = grd;
    Init.context.fillRect(
        xPosition,
        0,
        PROGRESS_BAR_WIDTH,
        Init.noteScrollWindowHeightPlusTimingBoxes
    );
    Init.context.fillStyle = color;
    Init.context.fillRect(
        xPosition,
        Init.noteScrollWindowHeightPlusTimingBoxes - progress,
        PROGRESS_BAR_WIDTH,
        progress
    )
}

function drawSongProgressBar() {
    let completionProgress = Init.noteScrollWindowHeightPlusTimingBoxes * GameState.song.currentTime / GameState.song.duration;
    drawProgressBar(Init.columns[0].xPosition - PROGRESS_BAR_WIDTH,
        completionProgress,
        "#42a4f5"
    )
}

function drawGradientTimingBoxes(
    timingBoxIndex: number,
    gradientColor1: string,
    gradientColor2: string
) {
    // gradient dimensions is twice as big as the rectangle we draw since we dont wnat a full gradient to black / blue, we just want some partial shading
    let grd = Init.context.createLinearGradient(
        0,
        Init.noteScrollWindowHeight,
        0,
        (2.0 / 3.0) * Init.canvas.height + 2 * (Init.columnWidth - 1)
    );
    grd.addColorStop(0, gradientColor1);
    grd.addColorStop(1, gradientColor2);
    Init.context.fillStyle = grd;
    // draw timing box
    Init.context.fillRect(
        Init.columns[timingBoxIndex].xPosition,
        Init.noteScrollWindowHeight,
        Init.columnWidth - 1,
        Init.columnWidth - 1
    );
}

function drawGradientForNoteScrollWindowKeyHold(
    timingBoxIndex: number,
    gradientColor1: string,
    gradientColor2: string
) {
    // partial shading
    let grd = Init.context.createLinearGradient(
        0,
        0,
        0,
        Init.canvas.height + 2 * (Init.columnWidth - 1)
    );
    grd.addColorStop(0, gradientColor1);
    grd.addColorStop(1, gradientColor2);
    Init.context.fillStyle = grd;
    // width of full gradient effect
    Init.context.fillRect(
        Init.columns[timingBoxIndex].xPosition +
        0.5 * columnFadeoutProgress[timingBoxIndex],
        0,
        Init.columnWidth - 1 * columnFadeoutProgress[timingBoxIndex] - 1,
        Init.noteScrollWindowHeight
    );
}

function drawStatusBox() {

    let grd = Init.context.createLinearGradient(
        Init.columns[0].xPosition - PROGRESS_BAR_WIDTH,
        Init.noteScrollWindowHeightPlusTimingBoxes,
        Init.columns[0].xPosition - PROGRESS_BAR_WIDTH,
        Init.canvas.height
    );
    grd.addColorStop(0, "rgba(100, 100, 100, 0.5)");
    grd.addColorStop(1, "rgba(0, 0, 0, 1");
    Init.context.fillStyle = grd;
    Init.context.fillRect(
        Init.columns[0].xPosition - PROGRESS_BAR_WIDTH,
        Init.noteScrollWindowHeightPlusTimingBoxes - 1,
        Init.columns.length * Init.columnWidth - 1 + PROGRESS_BAR_WIDTH * 2,
        Init.canvas.height - (Init.noteScrollWindowHeightPlusTimingBoxes - 1),
    )
}

function drawYellowGlow(opacity: number) {
    let grd = Init.context.createLinearGradient(
        Init.columns[0].xPosition,
        -200, // arbitrary gradient
        Init.columns[0].xPosition,
        1.3 * Init.noteScrollWindowHeight
    );
    grd.addColorStop(0, "rgba(0, 0, 0, 0)");
    grd.addColorStop(1, "rgba(214, 185, 11, " + opacity);
    Init.context.fillStyle = grd;
    Init.context.fillRect(
        Init.columns[0].xPosition,
        0,
        Init.columnWidth * Init.columns.length - 1,
        Init.noteScrollWindowHeight
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
    let endColumnsXPosition = Init.columns.length * Init.columnWidth + Init.columns[0].xPosition - 1;
    let color;
    if (GameState.beetJuice >= GameState.SMOOTHIE_TIME_THRESHOlD && !GameState.smoothieTime) {
        color = "#ea3788"
    } else {
        color = "#9a294c";
    }
    let completionProgress = Init.noteScrollWindowHeightPlusTimingBoxes * GameState.beetJuice / 100.0;
    drawProgressBar(endColumnsXPosition, completionProgress, color);
    let smoothieTimeThresholdYPosition = Init.noteScrollWindowHeightPlusTimingBoxes - (Init.noteScrollWindowHeightPlusTimingBoxes * GameState.SMOOTHIE_TIME_THRESHOlD / 100.0);
    Init.context.fillStyle = "white";
    Init.context.fillRect(
        endColumnsXPosition,
        smoothieTimeThresholdYPosition,
        PROGRESS_BAR_WIDTH,
        1
    )
}

function computeNoteYPosition(noteTime: number) {
    let currentTime = GameState.song.currentTime || 0.0;
    let timeLeft = noteTime - GameState.song.currentTime;
    // delete note / dont draw after its negative later
    return Init.noteScrollWindowHeight - timeLeft * 300;
}

function computeNoteTailXPosition(columnX: number) {
    return columnX + (Init.columnWidth - 1) / 2.0 - NOTE_HEIGHT / 2.0;
}

function drawHitTimingBoxes() {
    for (let i = 0; i < Init.columns.length; i++) {
        // hit timing boxes
        let gradientColor = GameState.columns[i].keyDown ? "yellow" : "black";
        drawGradientTimingBoxes(
            i,
            Init.columns[i].color + " 1)",
            gradientColor
        );
    }
}

function drawFakeHeldNotes() {
    for (let i = 0; i < GameState.columns.length; i++) {
        // fake notes for correctly held down notes
        if (GameState.columns[i].holdingDownNote) {
            Init.context.fillStyle = Init.columns[i].color + " 1)";
            Init.context.fillRect(
                Init.columns[i].xPosition,
                Init.noteScrollWindowHeight - NOTE_HEIGHT / 2.0,
                Init.columnWidth - 1,
                NOTE_HEIGHT
            );
        }
    }
}

function drawNotes() {
    // notes, to look into optimization methods
    for (let i = 0; i < GameState.notes.length; i++) {
        let yPosition = computeNoteYPosition(GameState.notes[i].time);
        if (!NoteTypes.isCompletedNote(GameState.notes[i])) {
            if (yPosition >= 0 && yPosition <= Init.noteScrollWindowHeight) {
                Init.context.fillStyle =
                    Init.columns[GameState.notes[i].column].color + " 1)";
                Init.context.fillRect(
                    Init.columns[GameState.notes[i].column].xPosition,
                    yPosition,
                    Init.columnWidth - 1,
                    NOTE_HEIGHT
                );
            }
        }
        drawNoteTail(GameState.notes[i], yPosition);
        // TODO optimize to start loop later past old notes
    }
}

function drawColumnsAndGradients() {
    for (let i = 0; i < Init.columns.length; i++) {
        Init.context.fillStyle = "black";
        Init.context.fillRect(
            Init.columns[i].xPosition,
            0,
            Init.columnWidth - 1,
            Init.noteScrollWindowHeight
        );
        Init.context.fillStyle = "rgba(128, 0, 0, 1)";
        Init.context.fillRect(
            Init.columns[i].xPosition,
            Init.noteScrollWindowHeight - Init.columnWidth / 25,
            Init.columnWidth - 1,
            Init.columnWidth / 25
        );
        // draw full gradient timing boxes
        // grdOpacity = speed of gradient transparency
        let grdOpacity = 1 - columnFadeoutProgress[i] * 0.05;
        let gradientColor =
            columnFadeoutProgress[i] < Init.columnWidth / 2 ?
            Init.columns[i].color + grdOpacity :
            "rgba(0, 0, 0, " + grdOpacity;
        if (GameState.columns[i].keyDown) {
            columnFadeoutProgress[i] = 0;
        }
        drawGradientForNoteScrollWindowKeyHold(
            i,
            "rgba(0, 0, 0, " + grdOpacity,
            gradientColor
        );
        // speed
        if (columnFadeoutProgress[i] < Init.columnWidth / 2) {
            columnFadeoutProgress[i]++;
        }
    }
}

function drawNoteTail(note: NoteTypes.Note, yPosition: number) {
    if (
        NoteTypes.isHeldNote(note) &&
        (GameState.columns[note.column].holdingDownNote ||
            (!NoteTypes.isCompletedNote(note) &&
                GameState.song.currentTime < note.time + 0.2))
    ) {
        Init.context.fillStyle =
            Init.columns[note.column].color + " 1)";
        let endYPosition = computeNoteYPosition(note.endTime);
        let tailHeight = yPosition - endYPosition;
        if (tailHeight + endYPosition >= Init.noteScrollWindowHeight) {
            tailHeight = Init.noteScrollWindowHeight - endYPosition;
        }
        if (
            endYPosition + tailHeight >= 0 &&
            endYPosition <= Init.noteScrollWindowHeight
        ) {
            Init.context.fillRect(
                computeNoteTailXPosition(
                    Init.columns[note.column].xPosition
                ),
                endYPosition,
                NOTE_HEIGHT,
                tailHeight
            );
        }
    }
}

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
    let grd = Init.context.createLinearGradient(
        0,
        Init.noteScrollWindowHeight - hitNotePulse.height,
        0,
        Init.noteScrollWindowHeight
    );
    grd.addColorStop(0, "rgba(72, 209, 204, 0)");
    grd.addColorStop(1, "rgba(72, 209, 204, 0.8)");
    Init.context.fillStyle = grd;
    Init.context.fillRect(
        Init.columns[0].xPosition,
        Init.noteScrollWindowHeight - hitNotePulse.height,
        Init.columnWidth * 7 - 1,
        hitNotePulse.height + 1
    );
}

function drawNoteTimingEffects(noteTiming: string, hitY: number, index: number) {
    switch (noteTiming) {
        case GameState.NOTE_TIMINGS.PERFECT:
            HitNoteEffects.createHitNoteTextObject("Perfect", index, GOOD_COLOR_RGB);
            HitNoteEffects.createHitNoteCircleObject(hitY, index);
            hitNotePulse.direction = PULSE_DIRECTIONS.INCREASING;
            break;
        case GameState.NOTE_TIMINGS.GOOD:
            HitNoteEffects.createHitNoteTextObject(" Good", index, GOOD_COLOR_RGB);
            HitNoteEffects.createHitNoteCircleObject(hitY, index);
            hitNotePulse.direction = PULSE_DIRECTIONS.INCREASING;
            break;
        case GameState.NOTE_TIMINGS.BAD:
            HitNoteEffects.createHitNoteTextObject("  Bad", index, BAD_COLOR_RGB);
            break;
        case GameState.NOTE_TIMINGS.MISS:
            HitNoteEffects.createHitNoteTextObject(" Miss", index, MISS_COLOR_RGB);
    }
}

export {
    draw,
    drawNoteTimingEffects,
    drawFlairEffects,
    computeNoteYPosition
};