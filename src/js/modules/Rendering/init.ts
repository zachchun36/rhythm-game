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

function fixDPI() {
    let dpi = window.devicePixelRatio;
    console.log(dpi);
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let styleHeight = +getComputedStyle(canvas)
        .getPropertyValue("height")
        .slice(0, -2);
    //get CSS width
    let styleWidth = +getComputedStyle(canvas)
        .getPropertyValue("width")
        .slice(0, -2);
    //scale the canvas
    console.log(canvas.height);
    canvas.setAttribute("height", (styleHeight * dpi).toString());
    canvas.setAttribute("width", (styleWidth * dpi).toString());
    console.log(canvas.height);
}

function initialRender() {
    // Get a reference to the canvas
    console.log("hello");
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    fixDPI();
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