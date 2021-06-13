"use strict";
let canvas;
let context;
let columnWidth;
let noteScrollWindowHeight;

// TODO eventually remap to indices instead of letters (so key remapping language is natural)
const S_KEYCODE = 83;
const D_KEYCODE = 68;
const F_KEYCODE = 70;
const SPACE_KEYCODE = 32;
const J_KEYCODE = 74;
const K_KEYCODE = 75;
const L_KEYCODE = 76;

const COLUMN_WIDTH_RATIO = (1 / 10.0);
const NOTE_SCROLL_WINDOW_HEIGHT_RATIO = (2.0 / 3.0);

window.onload = init;

const COLUMN_COLORS = ["#d011c8", "#e7bd0d", "#9cdf25", "#3baedb", "#9cdf25", "#e7bd0d", "#d011c8"];
const KEYS = ["S", "D", "F", "SPACE", "J", "K", "L"];
const KEY_CODES = [S_KEYCODE, D_KEYCODE, F_KEYCODE, SPACE_KEYCODE, J_KEYCODE, K_KEYCODE, L_KEYCODE];



function drawGradientTimingBoxes (timingBoxIndex, gradientColor1, gradientColor2) {
    // gradient dimensions is twice as big as the rectangle we draw since we dont wnat a full gradient to black / blue, we just want some partial shading
    var grd = context.createLinearGradient(0,noteScrollWindowHeight, 0, (2.0 / 3.0) * canvas.height + (2 * (columnWidth - 1)));
    grd.addColorStop(0, gradientColor1);
    grd.addColorStop(1, gradientColor2);
    context.fillStyle = grd;

    // draw timing box
    context.fillRect(1.5 * columnWidth + columnWidth * timingBoxIndex, noteScrollWindowHeight, columnWidth - 1, (columnWidth - 1));
}


function draw() {
  console.log('draw');
  context.fillStyle = '#000';

  // columns
  for (let i = 0; i < 7; i++) {
    let columnWidth = canvas.width * COLUMN_WIDTH_RATIO;
    context.fillRect(1.5 * columnWidth + columnWidth * i, 0, columnWidth - 1, noteScrollWindowHeight);
  }

  // hit timing boxes
  for (let i = 0; i < 7; i++) {
    drawGradientTimingBoxes(i, COLUMN_COLORS[i], "black");
  }
}

function keydownForIndex(index) {
  if(event.repeat) {
    console.log(KEYS[index] + 'was held down');
  } else {
    console.log(KEYS[index]+ ' was pressed');
    drawGradientTimingBoxes(index, COLUMN_COLORS[index], "yellow");
  }
}

function keydown(e) {
  console.log(e.keyCode);
  let keyCodeIndex = KEY_CODES.indexOf(e.keyCode);
  if (keyCodeIndex !== -1) {
    keydownForIndex(keyCodeIndex);
  }
}

function keyup(e) {
 let keyCodeIndex = KEY_CODES.indexOf(e.keyCode);
 if (keyCodeIndex !== -1) {
   drawGradientTimingBoxes(keyCodeIndex, COLUMN_COLORS[keyCodeIndex], "black");

 }

}

function init() {
  // Get a reference to the canvas
  canvas = document.getElementById('canvas');
  columnWidth = canvas.width * COLUMN_WIDTH_RATIO;
  noteScrollWindowHeight = canvas.height * NOTE_SCROLL_WINDOW_HEIGHT_RATIO;
  context = canvas.getContext('2d');
  draw();

  const button = document.querySelector('button');
  button.addEventListener('click', playSound);

  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);


}


function playSound() {
  const sound = new Audio();
  sound.src = 'mp3s/example.mp3';
  sound.play();
}