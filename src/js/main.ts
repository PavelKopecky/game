import {Game} from "./Game.js";

let currentGame = new Game();

let buttonClick = new Audio('effects/button-press.mp3');
buttonClick.volume = 0.7;

let startTrigger = false;
document.querySelector('.begin-btn')!.addEventListener('click', () => {
    buttonClick.play();
    let beginBtn = document.querySelector('.button-start')! as HTMLImageElement;
    beginBtn.src = 'img/button-start-1-1-pressed.png';
    startTrigger = true;
});

let rotateCount = 0;
const startJump = setInterval(() => {
    const startImg = document.querySelector('.player-start')! as HTMLElement;
    document.querySelector('.player-start')!.classList.add('player-start-jump');
    startImg.style.rotate = `${90*rotateCount}deg`;
    rotateCount += Math.floor(Math.random() * 10) % 5 - 2;
    setTimeout(() => {
        document.querySelector('.player-start')!.classList.remove('player-start-jump');
        if (startTrigger) {
            clearInterval(startJump);
            currentGame.startGame();
        }
    }, 1000);
}, 1050);
