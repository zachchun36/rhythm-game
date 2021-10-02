"use strict";

import * as GameState from "../gameState.js.js";
import * as Init from "./init.js.js";
import * as FPS from "./fps.js.js";
import * as Columns from "./columns.js.js";
import * as HitTimingBoxes from "./hitTimingBoxes.js.js";
import * as ProgressBar from "./progressBars.js.js";
import * as FlairGlow from "./flairGlow.js.js";
import * as Notes from "./notes.js.js";
import * as FakeNotes from "./fakeNotes.js.js";
import * as HeldNotePulse from "./heldNotePulse.js.js";
import * as TimingBarPulse from "./timingBarPulse.js.js";
import * as HitNoteEffects from "./hitNoteEffects.js.js";
import * as StatusBox from "./statusBox.js.js";
import * as ScoreMultiplier from "./scoreMultiplier.js.js";

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
    ScoreMultiplier.drawScoreMultiplier();
}

function drawNoteTimingEffects(noteTimingGrade: string, rawNoteTime: number, index: number) {
    let hitY = Notes.computeNoteYPosition(rawNoteTime);
    switch (noteTimingGrade) {
        case GameState.NOTE_TIMINGS.PERFECT:
            HitNoteEffects.createHitNoteTextObject("Perfect", index, GOOD_COLOR_RGB);
            HitNoteEffects.createHitNoteCircleObject(hitY, index);
            TimingBarPulse.startPulse();
            break;
        case GameState.NOTE_TIMINGS.GREAT:
            HitNoteEffects.createHitNoteTextObject("Great", index, GOOD_COLOR_RGB);
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