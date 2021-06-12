console.log('hello');

const sound = new Audio();
const button = document.querySelector('button');
button.addEventListener('click', playSound);

function playSound() {
  sound.src = 'mp3s/example.mp3';
  sound.play();
}