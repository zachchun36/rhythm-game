"use strict";

const NOTE_TIMINGS = {
    PERFECT: "PERFECT",
    GOOD: "GOOD",
    BAD: "BAD",
    MISS: "MISS"
};

const MAX_BEET_JUICE = 100;
const MIN_BEET_JUICE = 0;
const SMOOTHIE_TIME_THRESHOlD = 69;

const SMOOTHIE_TIME_SCORE_MULTIPLIER = 8;
let beetJuice = 50;
let smoothieTime = false;

let score = 0;

type Note = {
    time: number,
    column: number,
    missTriggered: boolean
}

type CompletedNote = Note & {
    hitY: number
}

type HeldNote = Note & {
    endTime: number
}

type Column = {
    color: string,
    keyDown: boolean,
    holdingDownNote: boolean,
    xPosition: number
}


const notes: (Note | CompletedNote | HeldNote)[] = [];
const heldNotesHit: HeldNote[] = [];
const song = new Audio("mp3s/snow-drop.mp3");
const columns: Column[] = [
    {
        color: "rgba(208, 17, 200, ",
        keyDown: false,
        holdingDownNote: false,
        xPosition: -1
    },
    {
        color: "rgba(231, 189, 13, ",
        keyDown: false,
        holdingDownNote: false,
        xPosition: -1
    },
    {
        color: "rgba(156, 223, 37, ",
        keyDown: false,
        holdingDownNote: false,
        xPosition: -1
    },
    {
        color: "rgba(59, 174, 219, ",
        keyDown: false,
        holdingDownNote: false,
        xPosition: -1
    },
    {
        color: "rgba(156, 223, 37, ",
        keyDown: false,
        holdingDownNote: false,
        xPosition: -1
    },
    {
        color: "rgba(231, 189, 13, ",
        keyDown: false,
        holdingDownNote: false,
        xPosition: -1
    },
    {
        color: "rgba(208, 17, 200, ",
        keyDown: false,
        holdingDownNote: false,
        xPosition: -1
    }
];

function isHeldNote(note: Note | HeldNote): note is HeldNote {
    return (note as HeldNote).endTime !== undefined;
}

function isCompletedNote(note: Note | CompletedNote): note is CompletedNote {
    return (note as CompletedNote).hitY !== undefined;
}

function completeNote(note: Note, hitY: number): CompletedNote {
    return Object.assign(note, {
        hitY: hitY
    });
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

// held note chords slow
for (var i = 0; i < 350; i++) {
    notes.push({
        time: i * 0.3 + 1,
        endTime: i * 0.3 + 2,
        column: (i * 2) % columns.length,
        missTriggered: false
    });

}


function changeBeetJuice(amount: number) {
    beetJuice += amount;
    if (beetJuice > MAX_BEET_JUICE) {
        beetJuice = MAX_BEET_JUICE;
    } else if (beetJuice < MIN_BEET_JUICE) {
        beetJuice = MIN_BEET_JUICE;
        smoothieTime = false;
    }
    console.log("beetJuice: " + beetJuice);
}

function activateSmoothieTime() {
    smoothieTime = true;
}

function increaseScore(amount: number) {
    score += amount;
}

export { 
    notes, 
    columns, 
    song, 
    heldNotesHit, 
    score, 
    increaseScore, 
    beetJuice, 
    changeBeetJuice, 
    activateSmoothieTime, 
    smoothieTime, 
    SMOOTHIE_TIME_THRESHOlD, 
    SMOOTHIE_TIME_SCORE_MULTIPLIER, 
    NOTE_TIMINGS,
    Note,
    HeldNote,
    CompletedNote,
    Column,
    isCompletedNote,
    isHeldNote,
    completeNote
 };
