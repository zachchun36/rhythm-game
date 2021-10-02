import * as GameState from "../gameState.js.js";
import * as Init from "./init.js.js";
import * as NoteTypes from "../Types/Note.js.js";

const NOTE_HEIGHT = 7;

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


            let grd = Init.context.createLinearGradient(
                computeNoteTailXPosition(
                    Init.columns[note.column].xPosition
                ) + NOTE_HEIGHT / 2,
                0,
                computeNoteTailXPosition(
                    Init.columns[note.column].xPosition
                ) + NOTE_HEIGHT,
                0
            );

            grd.addColorStop(0, "rgba(0, 0, 0, 0.2");
            grd.addColorStop(1, "rgba(0, 0, 0, 0.7");
            Init.context.fillStyle = grd;
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
                
                // Core Shadow
                let grdRight = Init.context.createLinearGradient(
                    Init.columns[GameState.notes[i].column].xPosition + Init.columnWidth / 2,
                    0,
                    Init.columns[GameState.notes[i].column].xPosition + Init.columnWidth,
                    0
                );
                grdRight.addColorStop(0, "rgba(0, 0, 0, 0");
                grdRight.addColorStop(1, "rgba(0, 0, 0, 0.7");
                Init.context.fillStyle = grdRight;
                Init.context.fillRect(
                    Init.columns[GameState.notes[i].column].xPosition + Init.columnWidth / 2,
                    yPosition,
                    Init.columnWidth - Init.columnWidth / 2 - 1.5, // 1.5 for reflected light
                    NOTE_HEIGHT
                );
                // Half-tone
                let grdLeft = Init.context.createLinearGradient(
                    Init.columns[GameState.notes[i].column].xPosition,
                    0,
                    Init.columns[GameState.notes[i].column].xPosition + Init.columnWidth / 3,
                    0
                );
                grdLeft.addColorStop(0, "rgba(0, 0, 0, 0.2");
                grdLeft.addColorStop(1, "rgba(0, 0, 0, 0");
                Init.context.fillStyle = grdLeft;
                Init.context.fillRect(
                    Init.columns[GameState.notes[i].column].xPosition,
                    yPosition,
                    Init.columnWidth / 3,
                    NOTE_HEIGHT
                );
            }
        }
        drawNoteTail(GameState.notes[i], yPosition);
        // TODO optimize to start loop later past old notes
    }
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

export {
    drawNoteTail,
    drawNotes,
    computeNoteYPosition,
    NOTE_HEIGHT
}