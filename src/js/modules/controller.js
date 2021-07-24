"use strict";

import * as Render from "./render.js";
import * as GameState from "./gameState.js";

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

const sevenRecentKeyPresses = [];

const FORWARDS_FLAIR = Array.from({length: KEYS.length}, (x, i) => i);
const BACKWARDS_FLAIR = Array.from({length: KEYS.length}, (x, i) => KEYS.length - i - 1);
console.log(FORWARDS_FLAIR);
console.log(BACKWARDS_FLAIR);

let mostRecentNoteIndex;

function start() {
    mostRecentNoteIndex = -1;
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    window.requestAnimationFrame(gameLoop);
}

function heldNoteActionsForIndex(index) {
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

function gameLoop(timeStamp) {
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
        GameState.changeBeetJuice(-0.2);
    }
    
    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function updateForMisses() {
    var currentTime = GameState.song.currentTime || 0.0;
    var i = getSafeStartingIndex();
    while (i < GameState.notes.length) {
        var timePassedSinceNoteTime = currentTime - GameState.notes[i].time;
        if (
            timePassedSinceNoteTime > 0.2 &&
            GameState.notes[i].hitY === -1 &&
            !GameState.notes[i].missTriggered
        ) {
            // note was missed
            mostRecentNoteIndex = i;
            console.log("note missed: " + i);
            GameState.notes[i].missTriggered = true;
            GameState.changeBeetJuice(-2);
            Render.drawNoteTimingEffects(
                GameState.NOTE_TIMINGS.MISS,
                null,
                GameState.notes[i].column
            );
        } else if (timePassedSinceNoteTime < 0) {
            break;
        }
        i++;
    }
}

function inputsMatchesFlair(idealFlair) {
    for (let i = 0; i < sevenRecentKeyPresses.length; i++) {
        if (sevenRecentKeyPresses[i] !== idealFlair[i]) {
            return false;
        }
    }
    return true;
}

function detectFlair(index) {
    sevenRecentKeyPresses.push(index);
    
    if (sevenRecentKeyPresses.length > KEYS.length) {
        sevenRecentKeyPresses.shift();
    }

    if (sevenRecentKeyPresses.length === KEYS.length) {
        console.log(sevenRecentKeyPresses);
        return inputsMatchesFlair(FORWARDS_FLAIR) || inputsMatchesFlair(BACKWARDS_FLAIR);
    }
}


function keydownForIndex(index) {
    let currentTime = GameState.song.currentTime || 0.0;
    if (event.repeat) {
        //no op for now
    } else {
        if (detectFlair(index)) {
            if (GameState.beetJuice >= GameState.SMOOTHIE_TIME_THRESHOlD) {
                GameState.activateSmoothieTime();
                console.log('smoothie time activated');
            }
            GameState.changeBeetJuice(2); 
            console.log('flair party!');
        }
        let i = getSafeStartingIndex();
        while (i < GameState.notes.length) {
            let currentNote = GameState.notes[i];
            if (currentNote.column === index && currentNote.hitY === -1) {
                let timingDelta = Math.abs(currentTime - currentNote.time);
                let noteTiming;
                if (timingDelta < 0.05) {
                    // note was hit successfully
                    console.log("perfect note hit: " + i);
                    noteTiming = GameState.NOTE_TIMINGS.PERFECT;
                    if (currentNote.endTime) {
                        GameState.heldNotesHit.push(currentNote);
                    }
                    GameState.changeBeetJuice(2);
                } else if (timingDelta < 0.08) {
                    console.log("good note hit: " + i);
                    noteTiming = GameState.NOTE_TIMINGS.GOOD;
                    GameState.changeBeetJuice(1);
                } else if (timingDelta < 0.2) {
                    console.log("bad note hit :" + i);
                    noteTiming = GameState.NOTE_TIMINGS.BAD;
                    GameState.changeBeetJuice(-1);
                }
                if (noteTiming) {
                    mostRecentNoteIndex = i;
                    currentNote.hitY = Render.computeNoteYPosition(currentNote.time);
                    Render.drawNoteTimingEffects(
                        noteTiming,
                        currentNote.hitY,
                        GameState.notes[i].column
                    );
                    break;
                }
            }
            i++;
        }
    }
}

function releaseHeldNoteForIndex(index) {
    for (let i = 0; i < GameState.heldNotesHit.length; i++) {
        if (GameState.heldNotesHit[i].column === index) {
            GameState.columns[index].holdingDownNote = false;
            console.log("column released for index: " + index);
            GameState.heldNotesHit.splice(i, 1);
            i--;
        }
    }
}

function keydown(e) {
    // console.log(e.keyCode);
    var keyCodeIndex = KEY_CODES.indexOf(e.keyCode);
    if (keyCodeIndex !== -1) {
        GameState.columns[keyCodeIndex].keyDown = true;
        keydownForIndex(keyCodeIndex);
    }
}

function keyup(e) {
    var keyCodeIndex = KEY_CODES.indexOf(e.keyCode);
    if (keyCodeIndex !== -1) {
        GameState.columns[keyCodeIndex].keyDown = false;
    }
}

function getSafeStartingIndex() {
    var i = mostRecentNoteIndex + 1;
    // TODO Clean this logic up
    // right now we're subtracting 7 if we can just in case the player hits a note of a 7 note chord
    // that's at the highest index of the 7 notes.  We don't want to skip the hit detection logic
    // for the earlier 6 notes so we subtract 7 from our starting index (unless that would go negative
    // and then we we just default to starting at index 0. We also make sure to only look at notse if the
    // .hitY is -1 (not hit yet)
    i = i - 7 >= 0 ? i - 7 : 0;
    return i;
}
export { start };
