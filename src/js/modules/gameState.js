"use strict";

const NOTE_TIMINGS = {
    PERFECT: "PERFECT",
    GOOD: "GOOD",
    BAD: "BAD",
    MISS: "MISS"
};
const notes = [];
const heldNotesHit = [];
const song = new Audio("mp3s/title.mp3");
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
for (var i = 0; i < 50; i++) {
    notes.push({
        time: i * 2 + 1,
        endTime: (i + 1) * 2 + 1,
        column: i % columns.length,
        hitY: -1
    });
    notes.push({
        time: i * 2 + 1,
        endTime: (i + 1) * 2 + 1,
        column: (i + 1) % columns.length,
        hitY: -1
    });
}

export { notes, columns, song, heldNotesHit, NOTE_TIMINGS };
