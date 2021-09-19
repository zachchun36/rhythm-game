"use strict";

import * as GameState from "../gameState.js";
import * as Init from "./init.js";
import * as FPS from "./fps.js";
import * as Columns from "./columns.js";
import * as HitTimingBoxes from "./hitTimingBoxes.js";
import * as ProgressBar from "./progressBars.js";
import * as FlairGlow from "./flairGlow.js";
import * as Notes from "./notes.js";
import * as FakeNotes from "./fakeNotes.js";
import * as HeldNotePulse from "./heldNotePulse.js";
import * as TimingBarPulse from "./timingBarPulse.js";
import * as HitNoteEffects from "./hitNoteEffects.js";
import * as StatusBox from "./statusBox.js";

// TODO refactor this out into hitNoteEffects.ts?
const GOOD_COLOR_RGB = "rgba(232, 196, 16, ";
const BAD_COLOR_RGB = "rgba(227, 91, 45, ";
const MISS_COLOR_RGB = "rgba(227, 227, 227, ";

function draw(timeStamp: number) {
    Init.context.clearRect(0, 0, Init.canvas.width, Init.canvas.height);
    Init.context.fillStyle = "black";
    Init.context.fillRect(0, 0, Init.canvas.width, Init.canvas.height);
    FPS.update(timeStamp);
    Init.context.clearRect(
        1.5 * Init.columnWidth,
        0,
        7 * Init.columnWidth - 1,
        Init.noteScrollWindowHeight + Init.columnWidth - 1
    );
    Columns.drawColumnsAndGradients();
    HitTimingBoxes.drawHitTimingBoxes();
    ProgressBar.drawBeetJuiceBar();
    ProgressBar.drawSongProgressBar();
    FlairGlow.drawFlairGlowFade();
    FlairGlow.drawSmoothieTimeGlow();
    Notes.drawNotes();
    FakeNotes.drawFakeHeldNotes();
    HeldNotePulse.drawHeldNodePulse();
    TimingBarPulse.drawTimingBarPulse();
    HitNoteEffects.drawHitNoteTexts();
    HitNoteEffects.drawHitNoteCircles();
    StatusBox.drawStatusBox();
}

function drawNoteTimingEffects(noteTimingGrade: string, rawNoteTime: number, index: number) {
    let hitY = Notes.computeNoteYPosition(rawNoteTime);
    switch (noteTimingGrade) {
        case GameState.NOTE_TIMINGS.PERFECT:
            HitNoteEffects.createHitNoteTextObject("Perfect", index, GOOD_COLOR_RGB);
            HitNoteEffects.createHitNoteCircleObject(hitY, index);
            TimingBarPulse.startPulse();
            break;
        case GameState.NOTE_TIMINGS.GOOD:
            HitNoteEffects.createHitNoteTextObject(" Good", index, GOOD_COLOR_RGB);
            HitNoteEffects.createHitNoteCircleObject(hitY, index);
            TimingBarPulse.startPulse();
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
    drawNoteTimingEffects
};