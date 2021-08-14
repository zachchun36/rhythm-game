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
const notes = [];
const heldNotesHit = [];
const song = new Audio("mp3s/snow-drop.mp3");
const columns = [
    {
        color: "rgba(208, 17, 200, ",
        keyDown: false,
        holdingDownNote: false
    },
    {
        color: "rgba(231, 189, 13, ",
        keyDown: false,
        holdingDownNote: false
    },
    {
        color: "rgba(156, 223, 37, ",
        keyDown: false,
        holdingDownNote: false
    },
    {
        color: "rgba(59, 174, 219, ",
        keyDown: false,
        holdingDownNote: false
    },
    {
        color: "rgba(156, 223, 37, ",
        keyDown: false,
        holdingDownNote: false
    },
    {
        color: "rgba(231, 189, 13, ",
        keyDown: false,
        holdingDownNote: false
    },
    {
        color: "rgba(208, 17, 200, ",
        keyDown: false,
        holdingDownNote: false
    }
];
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
// held note chords slow
for (var i = 0; i < 350; i++) {
    notes.push({
        time: i * 0.3 + 1,
        // endTime: (i + 1) * 2 + 1,
        column: (i * 2) % columns.length,
        hitY: -1
    });
}
function changeBeetJuice(amount) {
    beetJuice += amount;
    if (beetJuice > MAX_BEET_JUICE) {
        beetJuice = MAX_BEET_JUICE;
    }
    else if (beetJuice < MIN_BEET_JUICE) {
        beetJuice = MIN_BEET_JUICE;
        smoothieTime = false;
    }
    console.log("beetJuice: " + beetJuice);
}
function activateSmoothieTime() {
    smoothieTime = true;
}
function increaseScore(amount) {
    score += amount;
}
export { notes, columns, song, heldNotesHit, score, increaseScore, beetJuice, changeBeetJuice, activateSmoothieTime, smoothieTime, SMOOTHIE_TIME_THRESHOlD, SMOOTHIE_TIME_SCORE_MULTIPLIER, NOTE_TIMINGS };
