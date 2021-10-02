function isHeldNote(note) {
    return note.endTime !== undefined;
}
function isCompletedNote(note) {
    return note.noteTiming !== undefined;
}
function completeNote(note, noteTiming) {
    return Object.assign(note, {
        noteTiming: noteTiming
    });
}
export { isCompletedNote, isHeldNote, completeNote };
