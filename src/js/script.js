"use strict";
let canvas;
let context;
let columnWidth;
let noteScrollWindowHeight;
let secondsPassed;
let oldTimeStamp;
let fps;

// TODO eventually remap to indices instead of letters (so key remapping language is natural)
const S_KEYCODE = 83;
const D_KEYCODE = 68;
const F_KEYCODE = 70;
const SPACE_KEYCODE = 32;
const J_KEYCODE = 74;
const K_KEYCODE = 75;
const L_KEYCODE = 76;
const sound = new Audio();

const COLUMN_WIDTH_RATIO = (1 / 10.0);
const NOTE_SCROLL_WINDOW_HEIGHT_RATIO = (2.0 / 3.0);

window.onload = init;

const KEYS = ["S", "D", "F", "SPACE", "J", "K", "L"];
const KEY_CODES = [S_KEYCODE, D_KEYCODE, F_KEYCODE, SPACE_KEYCODE, J_KEYCODE, K_KEYCODE, L_KEYCODE];


const COLUMNS = [
  {
     color: "#d011c8",
     keyDown: false
  },
  {
     color: "#e7bd0d",
     keyDown: false
  },
  {
     color: "#9cdf25",
     keyDown: false
  },
  {
     color: "#3baedb",
     keyDown: false
  },
  {
     color: "#9cdf25",
     keyDown: false
  },
  {
     color: "#e7bd0d",
     keyDown: false
  },
  {
     color: "#d011c8",
     keyDown: false
  },
];


const TITLE_NOTE_DATA = [0.01, 0.26, 0.52, 0.75];

for (let i = 0; i < 80; i += 0.03) {
  TITLE_NOTE_DATA.push(i + 1);
}

function drawGradientTimingBoxes (timingBoxIndex, gradientColor1, gradientColor2) {
    // gradient dimensions is twice as big as the rectangle we draw since we dont wnat a full gradient to black / blue, we just want some partial shading
    var grd = context.createLinearGradient(0,noteScrollWindowHeight, 0, (2.0 / 3.0) * canvas.height + (2 * (columnWidth - 1)));
    grd.addColorStop(0, gradientColor1);
    grd.addColorStop(1, gradientColor2);
    context.fillStyle = grd;

    // draw timing box
    context.fillRect(COLUMNS[timingBoxIndex].xPosition, noteScrollWindowHeight, columnWidth - 1, (columnWidth - 1));
}

function computeNoteYPosition(noteTime) {
  let currentTime = sound.currentTime || 0.00;
  let timeLeft = noteTime - sound.currentTime;
  // delete note / dont draw after its negative later
  return noteScrollWindowHeight - timeLeft * 260;
}


function draw() {
  context.clearRect(1.5 * columnWidth, 0, 7 * columnWidth, noteScrollWindowHeight + columnWidth - 1);
  // columns -- eventually just use a background image instead of having to redraw each time
  for (let i = 0; i < KEYS.length; i++) {
    context.fillStyle = "black";
    context.fillRect(COLUMNS[i].xPosition, 0, columnWidth - 1, noteScrollWindowHeight);
  }


    // notes, to look into optimization methods
    for (let i = 0; i < TITLE_NOTE_DATA.length; i++) {
      let noteHeight = computeNoteYPosition(TITLE_NOTE_DATA[i]);
      if (noteHeight <= noteScrollWindowHeight + 10) {
        context.fillStyle = "white";
        context.fillRect(1.5 * columnWidth, computeNoteYPosition(TITLE_NOTE_DATA[i]), columnWidth - 1, 7);
      }

    }


  // hit timing boxes
  for (let i = 0; i < KEYS.length; i++) {
    let gradientColor = COLUMNS[i].keyDown ? "orange" : "black";
    drawGradientTimingBoxes(i, COLUMNS[i].color, gradientColor);
  }

}

function gameLoop(timeStamp) {
  context.clearRect(0, 0, 50, 50);
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  fps = Math.round(1 / secondsPassed);
  if (!isNaN(fps)) {
    context.font = '12px Arial';
    context.fillStyle = 'black';
    context.fillText("FPS: " + fps, 5, 30);
  }

  draw();

  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function keydownForIndex(index) {
  if(event.repeat) {
    console.log(KEYS[index] + 'was held down');
  } else {
    console.log(KEYS[index]+ ' was pressed');
    drawGradientTimingBoxes(index, COLUMNS[index].color, "orange");
  }
}

function keydown(e) {
  console.log(e.keyCode);
  let keyCodeIndex = KEY_CODES.indexOf(e.keyCode);
  if (keyCodeIndex !== -1) {
    COLUMNS[keyCodeIndex].keyDown = true;
    keydownForIndex(keyCodeIndex);
  }
}

function keyup(e) {
 let keyCodeIndex = KEY_CODES.indexOf(e.keyCode);
 if (keyCodeIndex !== -1) {
   COLUMNS[keyCodeIndex].keyDown = false;
   drawGradientTimingBoxes(keyCodeIndex, COLUMNS[keyCodeIndex].color, "black");

 }

}

function init() {
  // Get a reference to the canvas
  canvas = document.getElementById('canvas');

  fixDPI();
  columnWidth = canvas.width * COLUMN_WIDTH_RATIO;
  noteScrollWindowHeight = canvas.height * NOTE_SCROLL_WINDOW_HEIGHT_RATIO;
  context = canvas.getContext('2d');

  const button = document.querySelector('button');
  button.addEventListener('click', playSound);

  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);

  // Compute column x positions
  for (let i = 0; i < KEYS.length; i++) {
    COLUMNS[i].xPosition = 1.5 * columnWidth + columnWidth * i;
  }

  window.requestAnimationFrame(gameLoop);
}


function fixDPI() {
  let dpi = window.devicePixelRatio;
  //get CSS height
  //the + prefix casts it to an integer
  //the slice method gets rid of "px"
  let styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  //get CSS width
  let styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  //scale the canvas
  canvas.setAttribute('height', styleHeight * dpi);
  canvas.setAttribute('width', styleWidth * dpi);
}


function playSound() {
  sound.src = 'mp3s/title.mp3';
  sound.play();
}