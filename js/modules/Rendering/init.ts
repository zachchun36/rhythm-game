type Column = {
    color: string,
    xPosition: number
}

const columns: Column[] = [
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


let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let columnWidth;
let noteScrollWindowHeight;
let noteScrollWindowHeightPlusTimingBoxes;

const COLUMN_WIDTH_RATIO = 1 / 10.0;
const NOTE_SCROLL_WINDOW_HEIGHT_RATIO = 2.0 / 3.0;

function initialRender() {
    // Get a reference to the canvas
    console.log("hello");
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    

    if (window.innerWidth <= 1024 || window.innerHeight <= 768 ) {
        canvas.width = 333;
        canvas.height = 600;
    } else if (window.innerWidth <= 1600 || window.innerHeight <= 900) {
        canvas.width = 427;
        canvas.height = 768; // chosen so that if inner height is 769 it will still fit on the page
    } else { // 1920 x 1080
        canvas.width = 500;
        canvas.height = 900;
    }

    console.log(window.innerWidth);
    console.log(window.innerHeight);
    console.log(canvas.width);
    console.log(canvas.height);
    // canvas.width  = window.innerWidth * .25;
    // canvas.height = window.innerHeight * .7;
    columnWidth = canvas.width * COLUMN_WIDTH_RATIO;
    noteScrollWindowHeight = canvas.height * NOTE_SCROLL_WINDOW_HEIGHT_RATIO;
    noteScrollWindowHeightPlusTimingBoxes = noteScrollWindowHeight + columnWidth - 1
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

export {
    Column,
    columns,
    canvas,
    context,
    columnWidth,
    noteScrollWindowHeight,
    noteScrollWindowHeightPlusTimingBoxes,
    initialRender
}