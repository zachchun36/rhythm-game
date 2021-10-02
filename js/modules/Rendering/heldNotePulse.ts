import * as GameState from "../gameState.js.js"
import * as Init from "./init.js.js";
import * as Notes from "./notes.js.js";
import * as NoteTypes from "../Types/Note.js.js";

const PULSE_DIRECTIONS = {
    INCREASING: 0.4,
    DECREASING: -0.4
};

type HeldNotePulse = {
    width: number,
    height: number,
    direction: number
}

const HeldNotePulseInfo: HeldNotePulse[] = [
    {
        width: 0,
        height: 0,
        direction: PULSE_DIRECTIONS.DECREASING
    },
    {
        width: 0,
        height: 0,
        direction: PULSE_DIRECTIONS.DECREASING
    },
    {
        width: 0,
        height: 0,
        direction: PULSE_DIRECTIONS.DECREASING
    },
    {
        width: 0,
        height: 0,
        direction: PULSE_DIRECTIONS.DECREASING
    },
    {
        width: 0,
        height: 0,
        direction: PULSE_DIRECTIONS.DECREASING
    },
    {
        width: 0,
        height: 0,
        direction: PULSE_DIRECTIONS.DECREASING
    },
    {
        width: 0,
        height: 0,
        direction: PULSE_DIRECTIONS.DECREASING
    }
];

const activeHeldNotesHit: Set<NoteTypes.HeldNote> = new Set();

function startHeldNotePulse(
    columnIndex: number
){
    HeldNotePulseInfo[columnIndex].width = 0;
    HeldNotePulseInfo[columnIndex].height = 0;
    HeldNotePulseInfo[columnIndex].direction = PULSE_DIRECTIONS.INCREASING;
}

function stopHeldNotePulse(
    columnIndex: number
){
    HeldNotePulseInfo[columnIndex].width = 0;
    HeldNotePulseInfo[columnIndex].height = 0;
    HeldNotePulseInfo[columnIndex].direction = PULSE_DIRECTIONS.DECREASING;
}

function drawHeldNodePulse() {
    for (let i = 0; i < GameState.heldNotesHit.length; i++) {
        if (!activeHeldNotesHit.has(GameState.heldNotesHit[i])) {
            activeHeldNotesHit.add(GameState.heldNotesHit[i]);
            startHeldNotePulse(GameState.heldNotesHit[i].column);
        } 
    }

    activeHeldNotesHit.forEach(function (note: NoteTypes.HeldNote) {
        if (GameState.heldNotesHit.indexOf(note) === -1) {
            activeHeldNotesHit.delete(note);
            stopHeldNotePulse(note.column);
        }
    })


    for (let i = 0; i < Init.columns.length; i++) {
        if (HeldNotePulseInfo[i].width >= 0.35 * Init.columnWidth) {
            HeldNotePulseInfo[i].direction = PULSE_DIRECTIONS.DECREASING;
        }
        if (HeldNotePulseInfo[i].width <= 0.15 * Init.columnWidth) {
            HeldNotePulseInfo[i].direction = PULSE_DIRECTIONS.INCREASING;
        }
        if (HeldNotePulseInfo[i].width < 0) {
            HeldNotePulseInfo[i].width = 0;
        }

        if (GameState.columns[i].holdingDownNote) {
            let gradientColor = Init.columns[i].color;

            let j = 0;
            while (j < GameState.heldNotesHit.length) {
                if (GameState.heldNotesHit[j].column === i) {
                    let currentNote = GameState.heldNotesHit[j]

                    let endYPosition = Notes.computeNoteYPosition(currentNote.endTime);
                    if (HeldNotePulseInfo[i].height >= Init.noteScrollWindowHeight - endYPosition){
                        HeldNotePulseInfo[i].height = Init.noteScrollWindowHeight - endYPosition;
                    } else if (HeldNotePulseInfo[i].height <=0){
                        HeldNotePulseInfo[i].height =0;
                    }

                    // set gradient
                    let grdLeft = Init.context.createLinearGradient(
                        Init.columns[i].xPosition,
                        0,
                        Init.columns[i].xPosition + Init.columnWidth,
                        0
                    );
                    grdLeft.addColorStop(0, gradientColor + " 0.5)");
                    grdLeft.addColorStop(1, gradientColor + " 0)");
                    // draw left side gradient
                    Init.context.fillStyle = grdLeft;
                    Init.context.fillRect(
                        Init.columns[i].xPosition + (Init.columnWidth - 1) / 2 - HeldNotePulseInfo[i].width,
                        Init.noteScrollWindowHeight - HeldNotePulseInfo[i].height,
                        HeldNotePulseInfo[i].width,
                        HeldNotePulseInfo[i].height
                    );
                    // set gradient
                    let grdRight = Init.context.createLinearGradient(
                        Init.columns[i].xPosition,
                        0,
                        Init.columns[i].xPosition + Init.columnWidth,
                        0
                    );
                    grdRight.addColorStop(0, gradientColor + " 0)");
                    grdRight.addColorStop(1, gradientColor + " 0.5)");
                    // draw right side gradient
                    Init.context.fillStyle = grdRight;
                    Init.context.fillRect(
                        Init.columns[i].xPosition + (Init.columnWidth - 1) / 2,
                        Init.noteScrollWindowHeight - HeldNotePulseInfo[i].height,
                        HeldNotePulseInfo[i].width,
                        HeldNotePulseInfo[i].height
                    );
                }
                j++;
            }
            HeldNotePulseInfo[i].height += 2;
        }
    HeldNotePulseInfo[i].width += HeldNotePulseInfo[i].direction; // colon?
    }
}

export {
    drawHeldNodePulse,
    startHeldNotePulse, 
    stopHeldNotePulse
}