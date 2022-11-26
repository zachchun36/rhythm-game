"use strict";

import * as Render from "./Rendering/render.js";
import * as GameState from "./gameState.js";
import * as NoteTypes from "./Types/Note.js";
import * as Notes from "./Rendering/notes.js";
import * as Init from "./Rendering/init.js";

const S_KEYCODE = 83;
const D_KEYCODE = 68;
const F_KEYCODE = 70;
const SPACE_KEYCODE = 32;
const J_KEYCODE = 74;
const K_KEYCODE = 75;
const L_KEYCODE = 76;
const KEYS = ["S", "D", "F", "SPACE", "J", "K", "L"];
const KEY_CODES = [
    S_KEYCODE,
    D_KEYCODE,
    F_KEYCODE,
    SPACE_KEYCODE,
    J_KEYCODE,
    K_KEYCODE,
    L_KEYCODE
];

const sevenRecentKeyPresses: number[] = [];

const FORWARDS_FLAIR = Array.from({
    length: KEYS.length
}, (x, i) => i);
const BACKWARDS_FLAIR = Array.from({
    length: KEYS.length
}, (x, i) => KEYS.length - i - 1);

const NO_HIT_Y = -1;

let mostRecentNoteIndex: number;

function start() {
    mostRecentNoteIndex = -1;
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    window.requestAnimationFrame(gameLoop);
}

function heldNoteActionsForIndex(index: number) {
    let currentTime = GameState.song.currentTime || 0.0;
    let i = 0;
    while (i < GameState.heldNotesHit.length) {
        if (GameState.heldNotesHit[i].column === index) {
            // draw animations for held correctly
            GameState.columns[index].holdingDownNote = true;

            // console.log('held note correctly for index: ' + index);
            if (GameState.heldNotesHit[i].endTime - currentTime < 0.05) {
                GameState.columns[index].holdingDownNote = false;
                GameState.heldNotesHit.splice(i, 1);
                i--;
                console.log("held note completed for index: " + index);
            }
        }
        i++;
    }
}

function gameLoop(timeStamp: number) {
    Render.draw(timeStamp);

    updateForMisses();
    for (let i = 0; i < GameState.columns.length; i++) {
        if (GameState.columns[i].keyDown) {
            heldNoteActionsForIndex(i);
        } else {
            releaseHeldNoteForIndex(i);
        }
    }

    if (GameState.smoothieTime) {
        GameState.changeBeetJuice(-0.1);
    }

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function updateForMisses() {
    let currentTime = GameState.song.currentTime || 0.0;
    let i = getSafeStartingIndex();
    while (i < GameState.notes.length) {
        let timePassedSinceNoteTime = currentTime - GameState.notes[i].time;
        if (
            timePassedSinceNoteTime > 0.2 &&
            !NoteTypes.isCompletedNote(GameState.notes[i]) &&
            !GameState.notes[i].missTriggered
        ) {
            // note was missed
            mostRecentNoteIndex = i;
            console.log("note missed: " + i);
            GameState.notes[i].missTriggered = true;
            GameState.resetCombo();
            GameState.changeBeetJuice(-2);
            GameState.decreaseHealth(15);
            Render.drawNoteTimingEffects(
                GameState.NOTE_TIMINGS.MISS,
                NO_HIT_Y,
                GameState.notes[i].column
            );
            if (GameState.health <= 0) {
                processGameOver();
            }
        } else if (timePassedSinceNoteTime < 0) {
            break;
        }
        i++;
    }
}

function processGameOver() {
    GameState.song.pause();
}

function inputsMatchesFlair(idealFlair: number[]) {
    for (let i = 0; i < sevenRecentKeyPresses.length; i++) {
        if (sevenRecentKeyPresses[i] !== idealFlair[i]) {
            return false;
        }
    }
    return true;
}

function detectFlair(index: number) {
    sevenRecentKeyPresses.push(index);

    if (sevenRecentKeyPresses.length > KEYS.length) {
        sevenRecentKeyPresses.shift();
    }

    if (sevenRecentKeyPresses.length === KEYS.length) {
        console.log(sevenRecentKeyPresses);
        return inputsMatchesFlair(FORWARDS_FLAIR) || inputsMatchesFlair(BACKWARDS_FLAIR);
    }
}


function keydownForIndex(index: number, event: KeyboardEvent) {
    let currentTime = GameState.song.currentTime || 0.0;
    if (event.repeat) {
        console.log('event.repeat');
    } else {
        console.log('not event.repeat ')
        if (detectFlair(index)) {
            if (GameState.beetJuice >= GameState.SMOOTHIE_TIME_THRESHOlD) {
                GameState.activateSmoothieTime();
                console.log('smoothie time activated');
            }
            GameState.changeBeetJuice(.7);
            GameState.incrementFlair();
            console.log('flair party!');
        }
        let i = getSafeStartingIndex();
        while (i < GameState.notes.length) {
            let currentNote: NoteTypes.Note | NoteTypes.HeldNote | NoteTypes.CompletedNote = GameState.notes[i];
            if (currentNote.column === index && !NoteTypes.isCompletedNote(currentNote)) {
                let noteHitByKeydown: boolean = processNoteHit(currentTime, currentNote, i);
                if (noteHitByKeydown) {
                    break;
                }
            }
            i++;
        }
    }
}

function processNoteHit(currentTime: number, currentNote: NoteTypes.Note, i: number): boolean {
    let timingDelta = Math.abs(currentTime - currentNote.time);
    let noteTiming;
    let changeScore = 0;
    let changeBeet = 0;
    const GOOD_TIMING_THRESHOLD = 0.14;



    if (timingDelta < GOOD_TIMING_THRESHOLD) {
        GameState.incrementCombo();
        if (NoteTypes.isHeldNote(currentNote)) {
            GameState.heldNotesHit.push(currentNote);
        }
        if (timingDelta < 0.05) {
            noteTiming = GameState.NOTE_TIMINGS.PERFECT;
            changeBeet = 1;
            changeScore = 100;
            GameState.increaseHealth(4);
        } else if (timingDelta < 0.08) {
            noteTiming = GameState.NOTE_TIMINGS.GREAT;
            changeBeet = .6;
            changeScore = 75;
            GameState.increaseHealth(2);
        } else {
            noteTiming = GameState.NOTE_TIMINGS.GOOD;
            changeBeet = .2;
            changeScore = 50;
            GameState.increaseHealth(1);
        } 
    } else if (timingDelta < 0.2) {
        GameState.resetCombo();
        noteTiming = GameState.NOTE_TIMINGS.BAD;
        changeBeet = -1;
        changeScore = 25;
        GameState.decreaseHealth(10);
        if (GameState.health <= 0) {
            processGameOver();
        }
    }

    GameState.changeBeetJuice(changeBeet);
    GameState.increaseScore(changeScore);


    if (noteTiming) {
        mostRecentNoteIndex = i;

        let completedNote: NoteTypes.CompletedNote = NoteTypes.completeNote(currentNote, noteTiming);
        GameState.notes[i] = completedNote;

        Render.drawNoteTimingEffects(
            noteTiming,
            currentNote.time,
            GameState.notes[i].column
        );
        return true;
    }
    return false;
}

function releaseHeldNoteForIndex(index: number) {
    for (let i = 0; i < GameState.heldNotesHit.length; i++) {
        if (GameState.heldNotesHit[i].column === index) {
            GameState.columns[index].holdingDownNote = false;
            console.log("column released for index: " + index);
            GameState.heldNotesHit.splice(i, 1);
            i--;
        }
    }
}

function keydown(e: KeyboardEvent) {
    if (GameState.gameOver) {
        return;
    }
    // console.log(e.keyCode);
    let keyCodeIndex = KEY_CODES.indexOf(e.keyCode);
    if (keyCodeIndex !== -1) {
        GameState.columns[keyCodeIndex].keyDown = true;
        keydownForIndex(keyCodeIndex, e);
    }
}

function keyup(e: KeyboardEvent) {
    let keyCodeIndex = KEY_CODES.indexOf(e.keyCode);
    if (keyCodeIndex !== -1) {
        GameState.columns[keyCodeIndex].keyDown = false;
    }
}

function getSafeStartingIndex() {
    let i = mostRecentNoteIndex + 1;
    // TODO Clean this logic up
    // right now we're subtracting 7 if we can just in case the player hits a note of a 7 note chord
    // that's at the highest index of the 7 notes.  We don't want to skip the hit detection logic
    // for the earlier 6 notes so we subtract 7 from our starting index (unless that would go negative
    // and then we we just default to starting at index 0. We also make sure to only look at notse if the
    // .hitY is -1 (not hit yet)
    i = i - 7 >= 0 ? i - 7 : 0;
    return i;
}
export {
    start
};