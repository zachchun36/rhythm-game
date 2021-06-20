"use strict";
let canvas;
let context;
let columnWidth;
let noteScrollWindowHeight;
let secondsPassed;
let oldTimeStamp;
let fps;
let mostRecentNoteIndex;
let hitNoteCircles = [];
let hitNoteTexts = [];

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

const GOOD_COLOR_RGB = "rgba(232, 196, 16, ";
const BAD_COLOR_RGB = "rgba(227, 91, 45, ";
const MISS_COLOR_RGB = "rgba(227, 227, 227, ";


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


const TITLE_NOTE_DATA = [
//  {
//    time: 0.01,
//    column: 0,
//    hitY: -1,
//  },
//  {
//    time: 0.26,
//    column: 1,
//    hitY: -1,
//  },
//  {
//    time: 0.52,
//    column: 2,
//    hitY: -1,
//  },
//  {
//    time: 0.75,
//    column: 3,
//    hitY: -1,
//  }
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

for (let i = 0; i < 50; i++) {
  TITLE_NOTE_DATA.push(
    {
      time: i * 1 + 1,
      column: i % (COLUMNS.length),
      hitY: -1
    }
  )
  TITLE_NOTE_DATA.push(
    {
      time: i * 1 + 1,
      column: (i + 1 + getRandomInt(6)) % (COLUMNS.length),
      hitY: -1
    }
  )
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

function createHitNoteTextObject(text, index, colorRGB) {
  hitNoteTexts.push({
      colorRGB: colorRGB,
      text: text,
      columnIndex: index,
      yOffset: 0,
      opacity: 1.0
    }
  );
}


function createHitNoteCircleObject(y, index) {
  hitNoteCircles.push({
      columnIndex: index,
      yHit: y,
      radius: 1
    }
  );
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
    if (TITLE_NOTE_DATA[i].hitY === -1) {
      let noteHeight = computeNoteYPosition(TITLE_NOTE_DATA[i].time);
      if (noteHeight >= 0 && noteHeight <= noteScrollWindowHeight + 10) {
        context.fillStyle = COLUMNS[TITLE_NOTE_DATA[i].column].color;
        context.fillRect(COLUMNS[TITLE_NOTE_DATA[i].column].xPosition, noteHeight, columnWidth - 1, 7);
      }
    }
    // TODO optimize to start loop later past old notes
  }



  // hit timing boxes
  for (let i = 0; i < KEYS.length; i++) {
    let gradientColor = COLUMNS[i].keyDown ? "yellow" : "black";
    drawGradientTimingBoxes(i, COLUMNS[i].color, gradientColor);
  }

  for (let i = 0; i < hitNoteTexts.length; i++) {
    let noteText = hitNoteTexts[i];
    context.fillStyle = noteText.colorRGB + hitNoteTexts[i].opacity + ")";
    context.font = "8pt Monaco";
    context.fillText(noteText.text, COLUMNS[noteText.columnIndex].xPosition, noteScrollWindowHeight - noteText.yOffset * 2);
    noteText.yOffset += 0.5;
    noteText.opacity -= 0.015;
    if (noteText.opacity <= 0) {
      hitNoteTexts.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < hitNoteCircles.length; i++) {
    // x, y, r,
    context.strokeStyle = COLUMNS[hitNoteCircles[i].columnIndex].color;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(COLUMNS[hitNoteCircles[i].columnIndex].xPosition + columnWidth / 2.0, hitNoteCircles[i].yHit, hitNoteCircles[i].radius, 0, 2 * Math.PI);
    context.stroke();
    hitNoteCircles[i].radius += 1;
    if (hitNoteCircles[i].radius > columnWidth / 2.0) {
      hitNoteCircles.splice(i, 1);
      i--;
    }
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

  let currentTime = sound.currentTime || 0.00;
  let i = mostRecentNoteIndex + 1;
  while (i < TITLE_NOTE_DATA.length) {
    let timePassedSinceNoteTime = currentTime - TITLE_NOTE_DATA[i].time;
    if (timePassedSinceNoteTime > 0.2 && TITLE_NOTE_DATA[i].hitY === -1) {
      // note was missed
      mostRecentNoteIndex = i;
      console.log('note missed: ' + i);
      createHitNoteTextObject(" Miss", TITLE_NOTE_DATA[i].column, MISS_COLOR_RGB);
    } else if (timePassedSinceNoteTime < 0) {
      break;
    }
    i++;
  }

  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function keydownForIndex(index) {
  if(event.repeat) {
    // console.log(KEYS[index] + 'was held down');
  } else {
    let currentTime = sound.currentTime || 0.00;
    let i = mostRecentNoteIndex + 1;

    // TODO Clean this logic up
    // right now we're subtracting 7 if we can just in case the player hits a note of a 7 note chord
    // that's at the highest index of the 7 notes.  We don't want to skip the hit detection logic
    // for the earlier 6 notes so we subtract 7 from our starting index (unless that would go negative
    // and then we we just default to starting at index 0. We also make sure to only look at notse if the
    // .hitY is -1 (not hit yet)
    i = i - 7 >= 0 ? i - 7: 0;
    while (i < TITLE_NOTE_DATA.length) {
      let currentNote = TITLE_NOTE_DATA[i];
      if (currentNote.column === index && currentNote.hitY === -1) {
        let timingDelta = Math.abs(currentTime - currentNote.time);
        if (timingDelta < 0.05) {
          // note was hit successfully
          console.log('perfect note hit: ' + i);
          mostRecentNoteIndex = i;
          createHitNoteTextObject("Perfect", index, GOOD_COLOR_RGB);
          currentNote.hitY = computeNoteYPosition(currentNote.time);
          createHitNoteCircleObject(currentNote.hitY, index);
          break;
        } else if (timingDelta < 0.08) {
          console.log('good note hit: ' + i);
          mostRecentNoteIndex = i;
          createHitNoteTextObject(" Good", index, GOOD_COLOR_RGB);
          currentNote.hitY = computeNoteYPosition(currentNote.time);
          createHitNoteCircleObject(currentNote.hitY, index);
          break;
        } else if (timingDelta < 0.2) {
          console.log('bad note hit :' + i);
          mostRecentNoteIndex = i;
          createHitNoteTextObject("  Bad", index, BAD_COLOR_RGB);
          currentNote.hitY = computeNoteYPosition(currentNote.time);
          break;
        }
      }
      i++;
    }
    //console.log(KEYS[index]+ ' was pressed');
  }
}

function keydown(e) {
  // console.log(e.keyCode);
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
 }
}

function init() {
  // Get a reference to the canvas
  canvas = document.getElementById('canvas');
  fixDPI();
  columnWidth = canvas.width * COLUMN_WIDTH_RATIO;
  noteScrollWindowHeight = canvas.height * NOTE_SCROLL_WINDOW_HEIGHT_RATIO;
  context = canvas.getContext('2d');

  const button = document.querySelector('#play');
  button.addEventListener('click', playSound);

  const stopButton = document.querySelector('#stop');
  stopButton.addEventListener('click', () => sound.volume = 0.001);

  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);

  // Compute column x positions
  for (let i = 0; i < KEYS.length; i++) {
    COLUMNS[i].xPosition = 1.5 * columnWidth + columnWidth * i;
  }

  mostRecentNoteIndex = -1;
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
  sound.volume = 0.1;
}