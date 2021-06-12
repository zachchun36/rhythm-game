"use strict";
let canvas;
let context;
window.onload = init;

function draw() {
  let columnFraction = (1 / 8.0);
  console.log('draw');
  context.fillStyle = '#000';
  for (let i = 0; i < 7; i++) {
    let columnWidth = canvas.width * columnFraction;
    context.fillRect((columnWidth / 2.0) + columnWidth * i, 0, columnWidth, canvas.height);
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