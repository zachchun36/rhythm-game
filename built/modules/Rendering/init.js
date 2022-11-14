const columns = [
    {
        color: "rgba(208, 17, 200, ",
        xPosition: -1
    },
    {
        color: "rgba(231, 189, 13, ",
        xPosition: -1
    },
    {
        color: "rgba(156, 223, 37, ",
        xPosition: -1
    },
    {
        color: "rgba(59, 174, 219, ",
        xPosition: -1
    },
    {
        color: "rgba(156, 223, 37, ",
        xPosition: -1
    },
    {
        color: "rgba(231, 189, 13, ",
        xPosition: -1
    },
    {
        color: "rgba(208, 17, 200, ",
        xPosition: -1
    }
];
let canvas;
let context;
let columnWidth;
let noteScrollWindowHeight;
let noteScrollWindowHeightPlusTimingBoxes;
const COLUMN_WIDTH_RATIO = 1 / 10.0;
const NOTE_SCROLL_WINDOW_HEIGHT_RATIO = 2.0 / 3.0;
function initialRender() {
    // Get a reference to the canvas
    console.log("hello");
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth * .25;
    canvas.height = window.innerHeight * .7;
    columnWidth = canvas.width * COLUMN_WIDTH_RATIO;
    noteScrollWindowHeight = canvas.height * NOTE_SCROLL_WINDOW_HEIGHT_RATIO;
    noteScrollWindowHeightPlusTimingBoxes = noteScrollWindowHeight + columnWidth - 1;
    let tempContext;
    if (!(tempContext = canvas.getContext("2d"))) {
        throw new Error(`2d context not supported or canvas already initialized`);
    }
    context = tempContext;
    // Compute column x positions
    for (let i = 0; i < columns.length; i++) {
        columns[i].xPosition = 1.5 * columnWidth + columnWidth * i;
    }
}
export { columns, canvas, context, columnWidth, noteScrollWindowHeight, noteScrollWindowHeightPlusTimingBoxes, initialRender };
