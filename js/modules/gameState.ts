"use strict";

import {
    Note,
    HeldNote,
    CompletedNote
} from "./Types/Note.js";

const NOTE_TIMINGS = {
    PERFECT: "PERFECT",
    GREAT: "GREAT",
    GOOD: "GOOD",
    BAD: "BAD",
    MISS: "MISS"
};

const MAX_BEET_JUICE = 100;
const MIN_BEET_JUICE = 0;
const SMOOTHIE_TIME_THRESHOlD = 69;

const SMOOTHIE_TIME_SCORE_MULTIPLIER = 8;
let beetJuice = 70;
let smoothieTime = false;
let flairCount = 0;

let score = 0;
let combo = 0;
let health = 100;
let gameOver = false;

type ColumnState = {
    keyDown: boolean,
    holdingDownNote: boolean,
}


let notes: (Note | CompletedNote | HeldNote)[] = [];
let backupNotes: (Note | CompletedNote | HeldNote)[] = [];

const heldNotesHit: HeldNote[] = [];
const song = new Audio("mp3s/snow-drop.mp3");
const columns: ColumnState[] = [{
        keyDown: false,
        holdingDownNote: false,
    },
    {
        keyDown: false,
        holdingDownNote: false,
    },
    {
        keyDown: false,
        holdingDownNote: false,
    },
    {
        keyDown: false,
        holdingDownNote: false,
    },
    {
        keyDown: false,
        holdingDownNote: false,
    },
    {
        keyDown: false,
        holdingDownNote: false,
    },
    {
        keyDown: false,
        holdingDownNote: false,
    }
];

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

// held note chords slow
for (let i = 0; i < 350; i++) {
    notes.push({
        time: i * 0.3 + 1,
        endTime: i * 0.3 + 3,
        column: i % columns.length,
        missTriggered: false
    });

}

function copyNotesToBackup() {
    for (let i = 0; i < notes.length; i++) {
        backupNotes.push({
            time: notes[i].time,
            endTime: (notes[i] as HeldNote).endTime,
            column: notes[i].column,
            missTriggered: false
        })
    }
}

copyNotesToBackup();

function changeBeetJuice(amount: number) {
    beetJuice += amount;
    if (beetJuice > MAX_BEET_JUICE) {
        beetJuice = MAX_BEET_JUICE;
    } else if (beetJuice < MIN_BEET_JUICE) {
        beetJuice = MIN_BEET_JUICE;
        smoothieTime = false;
    }
}

function activateSmoothieTime() {
    smoothieTime = true;
}


// uses score multiplier, doesn't add raw amount
function increaseScore(amount: number) {
    score += amount * getScoreMultiplier();

}

function getScoreMultiplier() {
    if (smoothieTime) {
        return 8;
    }
    if (combo < 10) {
        return 1;
    } else if (combo < 20) {
        return 2;
    } else if (combo < 30) {
        return 3;
    } else if (combo < 40) {
        return 4;
    } else {
        return 5;
    }
}

function incrementCombo() {
    combo++;
}

function resetCombo() {
    combo = 0;
}

function incrementFlair() {
    flairCount++;
}

function increaseHealth(amount: number) {
    health += amount;
    if (health > 100) {
        health = 100;
    }
    
}

function decreaseHealth(amount: number) {
    health-= amount;
    if (health < 0) {
        health = 0;
    }
    if (health == 0) {
        gameOver = true;
    }
}

function reset() {
    notes = backupNotes;
    backupNotes = [];
    copyNotesToBackup();
    score = 0;
    health = 100;
    combo = 0;
    flairCount = 0;
    beetJuice = 0;
    smoothieTime = false;
    gameOver = false;      
    song.load();
    song.play();
}

export {
    notes,
    columns,
    song,
    heldNotesHit,
    score,
    increaseScore,
    getScoreMultiplier,
    combo,
    incrementCombo,
    resetCombo,
    health,
    increaseHealth,
    decreaseHealth,
    flairCount,
    incrementFlair,
    beetJuice,
    changeBeetJuice,
    activateSmoothieTime,
    smoothieTime,
    SMOOTHIE_TIME_THRESHOlD,
    SMOOTHIE_TIME_SCORE_MULTIPLIER,
    NOTE_TIMINGS,
    ColumnState,
    gameOver,
    reset
};