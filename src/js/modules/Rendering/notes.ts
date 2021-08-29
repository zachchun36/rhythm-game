import * as GameState from "../gameState.js";
import * as Init from "./init.js";
import * as NoteTypes from "../Types/Note.js";

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