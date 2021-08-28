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

export { 
    Note,
    HeldNote,
    CompletedNote,
    isCompletedNote,
    isHeldNote,
    completeNote
 };
