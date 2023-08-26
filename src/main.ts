const jumpHeight = 500;
const playerX = 180;
let obstacleX = 1800;
let gameOver : boolean = false;
let playerUp : boolean = false;
let gameRunning : boolean = false;
let score = 0;
let difficulty = 1; //1-4

class obstacle {

    constructor(type:number) {
        switch (type) {
            case 1 : {
                this.height = 70;
                this.width = 70;
                break;
            }
            case 2 : {
                this.height = 80;
                this.width = 100;
                break;
            }
            case 3 : {
                this.height = 90;
                this.width = 140;
                break;
            }
            default : {
                this.height = 70;
                this.width = 70;
                break;
            }
        }
    }

    x : number = 1800;
    width : number;
    height : number;
}

class game {
    difficulty : number = 1;
    obstacles : (obstacle)[] = [];
    jumpHeight : number = 500;
    playerX : number = 180;
    gameOver : boolean = false;
    playerUp : boolean = false;
    gameRunning : boolean = false;
    score : number = 0;
}

const startGame = () => {
    let begin = document.querySelector('.begin');
    let beginBtn = document.querySelector('.begin-btn');
    if (beginBtn) beginBtn.remove();
    if (begin) {
        setTimeout(() => {
            begin!.remove();
            createGround();
            setTimeout(addPlayer, 1000);
        }, 1000);
    } else {
        setTimeout(() => {
            createGround();
            setTimeout(addPlayer, 1000);
        }, 1000);
    }
}

const createGround = () => {
    const s = document.createElement('p');
    s.classList.add('score','game-object');
    s.innerHTML = '0';
    document.body.appendChild(s);
    const e = document.createElement('p');
    e.classList.add('ground','game-object');
    document.body.appendChild(e);
    setTimeout(() => {
        document.querySelector('.ground')!.classList.add('ground-move');
        document.querySelector('.body')!.classList.add('bck-change');
        document.querySelector('.score')!.classList.add('score-appear');
    }, 100);
}

const addPlayer = () => {
    const e = document.createElement('div');
    e.classList.add('player','game-object');
    document.body.appendChild(e);
    setTimeout(() => {
        document.querySelector('.player')!.classList.add('player-move');
        setTimeout(() => {
            document.querySelector('.player')!.classList.add('player-moved');
            document.querySelector('.player')!.classList.remove('player-move');
            document.addEventListener('click', playerJump);
            addObstacles();
        }, 1000);
    }, 50);
}

const addObstacles = () => {
    const e = document.createElement('div');
    e.classList.add('obstacle','game-object');
    document.body.appendChild(e);
    startObstacleMovement();
}

const startObstacleMovement = () => {
    if (gameOver) return;
    document.querySelector('.obstacle')!.classList.add('obstacle-move');
    obstacleX = 1800;
    setTimeout( () => {
        document.querySelector('.obstacle')!.classList.remove('obstacle-move');
        setTimeout(startObstacleMovement, 150);
    }, 2000);
    if (!gameRunning) interval();
}

const interval = () => {
    gameRunning = true;
    const gameInt = setInterval(() => {
        obstacleX -= 10;
        if (obstacleX <= 250 && obstacleX >= 110 && !playerUp) {
            clearInterval(gameInt);
            gameLost();
        } else if (obstacleX === 100) {
            score++;
            document.querySelector('.score')!.innerHTML = String(score);
        }
    }, 10);
}

const playerJump = () => {
    if (!gameRunning) return;
    const player = document.querySelector('.player');
    if (player!.classList.contains('player-jump')) return;
    else {
        player!.classList.add('player-jump');
        setTimeout( () => {
            playerUp = true;
        }, 30);
        setTimeout( () => {
            playerUp = false;
        }, 470);
        setTimeout(() => {
            if (gameRunning) document.querySelector('.player')!.classList.remove('player-jump');
        }, jumpHeight);
    }
}

const gameLost = () => {
    gameOver = true;
    gameRunning = false;
    difficulty = 1;
    document.querySelector('.obstacle')!.classList.add('paused');
    document.querySelector('.player')!.classList.add('paused');

    setTimeout(() => {
        //end screen
        let e = document.createElement('div');
        e.classList.add('end-screen');
        //text you lost
        let l = document.createElement('p');
        l.classList.add('lost-text');
        l.innerHTML = 'You Lost.';
        e.appendChild(l);
        //final score
        let s = document.createElement('p');
        s.classList.add('fin-score');
        s.innerHTML = `Final score: ${score}`;
        e.appendChild(s);
        //repeat button
        let r = document.createElement('button');
        r.classList.add('repeat-btn');
        r.innerHTML = 'RETRY!';
        e.appendChild(r);

        document.body.appendChild(e);
        document.querySelector('.repeat-btn')!.addEventListener('click', restartGame);

        let elements = document.querySelectorAll('.game-object');
        for (let i = 0; i < elements.length; ++i) {
            elements[i].remove();
        }
    },600);
}

const restartGame = () => {
    playerUp = false;
    gameOver = false;
    score = 0;
    document.querySelector('.end-screen')!.remove();
    document.querySelector('.body')!.classList.remove('bck-change')
    startGame();
}

document.querySelector('.begin-btn')!.addEventListener('click', startGame);
