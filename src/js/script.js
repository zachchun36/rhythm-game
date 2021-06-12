"use strict";
let canvas;
let context;
window.onload = init;

function draw() {
  let columnFraction = (1 / 10.0);
  console.log('draw');
  context.fillStyle = '#000';

  // columns
  for (let i = 0; i < 7; i++) {
    let columnWidth = canvas.width * columnFraction;
    context.fillRect(1.5 * columnWidth + columnWidth * i, 0, columnWidth - 1, (2.0 / 3.0) * canvas.height);
  }

  // hit timing boxes
  for (let i = 0; i < 7; i++) {
    let columnWidth = canvas.width * columnFraction;
    var grd = context.createLinearGradient(0,(2.0 / 3.0) * canvas.height, 0 ,(2.0 / 3.0) * canvas.height + (2 * (columnWidth - 1)));
    grd.addColorStop(0,"#d011c8");
    grd.addColorStop(1,"black");

    // Fill with gradient
    context.fillStyle = grd;
    context.fillRect(1.5 * columnWidth + columnWidth * i, (2.0 / 3.0) * canvas.height, columnWidth - 1, (columnWidth - 1));
  }
}

function init() {
  // Get a reference to the canvas
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  draw();

  const button = document.querySelector('button');
  button.addEventListener('click', playSound);
}


function playSound() {
  const sound = new Audio();
  sound.src = 'mp3s/example.mp3';
  sound.play();
}