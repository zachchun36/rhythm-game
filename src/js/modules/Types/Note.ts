type Note = {
    time: number,
    column: number,
    missTriggered: boolean
}

type CompletedNote = Note & {
    noteTiming: string
}

type HeldNote = Note & {
    endTime: number
}

function isHeldNote(note: Note | HeldNote): note is HeldNote {
    return (note as HeldNote).endTime !== undefined;
}

function isCompletedNote(note: Note | CompletedNote): note is CompletedNote {
    return (note as CompletedNote).noteTiming !== undefined;
}

function completeNote(note: Note, noteTiming: string): CompletedNote {
    return Object.assign(note, {
        noteTiming: noteTiming
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
