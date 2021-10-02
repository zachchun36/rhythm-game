import * as GameState from "../gameState.js";
import * as Init from "./init.js";
import * as Notes from "./notes.js";
function drawFakeHeldNotes() {
    for (let i = 0; i < GameState.columns.length; i++) {
        // fake notes for correctly held down notes
        if (GameState.columns[i].holdingDownNote) {
            Init.context.fillStyle = Init.columns[i].color + " 1)";
            Init.context.fillRect(Init.columns[i].xPosition, Init.noteScrollWindowHeight - Notes.NOTE_HEIGHT / 2.0, Init.columnWidth - 1, Notes.NOTE_HEIGHT);
        }
    }
}
export { drawFakeHeldNotes };
