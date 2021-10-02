let hitNoteCircles: HitNoteCircle[] = [];
let hitNoteTexts: HitNoteText[] = [];

import * as Init from "./init.js"

type HitNoteText = {
    colorRGB: string,
    text: string,
    columnIndex: number,
    yOffset: number,
    opacity: number
}

type HitNoteCircle = {
    columnIndex: number,
    yHit: number,
    radius: number
}

function createHitNoteTextObject(text: string, index: number, colorRGB: string) {
    hitNoteTexts.push({
        colorRGB: colorRGB,
        text: text,
        columnIndex: index,
        yOffset: 0,
        opacity: 1.0
    });
}

function createHitNoteCircleObject(y: number, index: number) {
    hitNoteCircles.push({
        columnIndex: index,
        yHit: y,
        radius: 1
    });
}

function drawHitNoteCircles() {
    for (let i = 0; i < hitNoteCircles.length; i++) {
        // x, y, r,
        Init.context.strokeStyle =
            Init.columns[hitNoteCircles[i].columnIndex].color + " 1)";
        Init.context.lineWidth = 3;
        Init.context.beginPath();
        Init.context.arc(
            Init.columns[hitNoteCircles[i].columnIndex].xPosition +
            Init.columnWidth / 2.0,
            hitNoteCircles[i].yHit,
            hitNoteCircles[i].radius,
            0,
            2 * Math.PI
        );
        Init.context.stroke();
        // Increase circule radius
        hitNoteCircles[i].radius += 1;
        if (hitNoteCircles[i].radius > Init.columnWidth / 2.0) {
            hitNoteCircles.splice(i, 1);
            i--;
        }
    }
}

function drawHitNoteTexts() {
    for (let i = 0; i < hitNoteTexts.length; i++) {
        let noteText = hitNoteTexts[i];
        Init.context.fillStyle = noteText.colorRGB + hitNoteTexts[i].opacity + ")";
        Init.context.font = "8pt Monaco";
        Init.context.fillText(
            noteText.text,
            Init.columns[noteText.columnIndex].xPosition,
            Init.noteScrollWindowHeight - noteText.yOffset * 2
        );
        noteText.yOffset += 0.5;
        noteText.opacity -= 0.015;
        if (noteText.opacity <= 0) {
            hitNoteTexts.splice(i, 1);
            i--;
        }
    }
}

export {
    createHitNoteCircleObject,
    createHitNoteTextObject,
    drawHitNoteCircles,
    drawHitNoteTexts
}