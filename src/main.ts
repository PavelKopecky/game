class obstacle {

    constructor() {

        const e = document.createElement('div');
        const img = document.createElement('img');
        e.classList.add('game-object');

        for (let i = 0; i < 3; ++i) {
            if (currentGame.availableObstacleId[i]) {
                currentGame.availableObstacleId[i] = false;
                this.id = i;
                break;
            }
        }
        e.classList.add(`obstacle${this.id}`);

        switch (this.randomType()) {

            case 1 : {
                this.height = 70;
                this.width = 70;
                e.classList.add('obstacle-type1');
                img.src = '/src/img/obstacle1.png';
                break;
            }
            case 2 : {
                this.height = 80;
                this.width = 100;
                e.classList.add('obstacle-type2');
                img.src = '/src/img/obstacle2.png';
                break;
            }
            case 3 : {
                this.height = 90;
                this.width = 140;
                e.classList.add('obstacle-type3');
                img.src = '/src/img/obstacle3.png';
                break;
            }
            default : {
                this.height = 70;
                this.width = 70;
                e.classList.add('obstacle-type1');
                img.src = '/src/img/obstacle1.png';
                break;
            }
        }

        e.appendChild(img);
        document.body.appendChild(e);
    }

    randomType = () : number => {
        return currentGame.difficulties[currentGame.difficulty - 1][Math.floor(Math.random() * 10) % 5];
    }

    startMovement = () => {
        if (currentGame.gameOver) return;
        document.querySelector(`.obstacle${this.id}`)!.classList.add(`obstacle-move${this.id}`);
        this.x = 1800;
        setTimeout( () => {
            if (currentGame.gameRunning) {
                document.querySelector(`.obstacle${this.id}`)!.remove();
                currentGame.availableObstacleId[this.id] = true;
                currentGame.obstacles.shift();
            }
        }, 2000);
        if (!currentGame.gameRunning) currentGame.interval();
    }

    x : number = 1800;
    width : number;
    height : number;
    id : number = 0;
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
    frequency : number = 1500;
    availableObstacleId : [boolean, boolean, boolean] = [true, true, true];
    difficulties = [[1,1,1,1,2],[1,1,2,2,2],[1,2,2,2,3],[1,2,2,3,3],[2,2,3,3,3]];
    highScore : number = 0;
    jmpCount : number = 0;

    startGame = () => {
        let begin = document.querySelector('.begin');
        let beginBtn = document.querySelector('.begin-btn');

        const hs = Number(localStorage.getItem('highscore')!);
        if (hs) this.highScore = hs;

        if (beginBtn) beginBtn.remove();
        if (begin) {
            setTimeout(() => {
                begin!.remove();
                this.createGround();
                setTimeout(this.addPlayer, 1000);
            }, 1000);
        } else {
            setTimeout(() => {
                this.createGround();
                setTimeout(this.addPlayer, 1000);
            }, 1000);
        }
    }

    createGround = () => {
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

    addPlayer = () => {
        const e = document.createElement('div');
        const img = document.createElement('img');
        img.src = '/src/img/player1.png'
        e.classList.add('player','game-object');
        e.appendChild(img);
        document.body.appendChild(e);
        setTimeout(() => {
            document.querySelector('.player')!.classList.add('player-move');
            setTimeout(() => {
                document.querySelector('.player')!.classList.add('player-moved');
                document.querySelector('.player')!.classList.remove('player-move');
                document.addEventListener('click', this.playerJump);
                this.addObstacle();
            }, 1000);
        }, 50);
    }

    addObstacle = () => {
        if (!this.gameOver) {
            let x = new obstacle();
            x.startMovement();
            this.obstacles.push(x);
            setTimeout(() => {
                this.addObstacle();
            }, this.randomFrequency())
        }
    }

    randomFrequency = () : number => {
        return this.frequency - (75 * this.difficulty + Math.floor((Math.random() * 1000)) % (500));
    }

    interval = () => {
        this.gameRunning = true;
        const gameInt = setInterval(() => {
            this.obstacles.forEach((obstacle) => {
                obstacle.x -= 10;
                if (obstacle.x <= 180 + obstacle.width/2 && obstacle.x >= 180 - obstacle.width/2 && !this.playerUp) {
                    clearInterval(gameInt);
                    this.gameLost();
                } else if (obstacle.x === 100) {
                    this.score++;
                    document.querySelector('.score')!.innerHTML = String(this.score);
                    if (this.score % 10 === 0 && this.difficulty < 5) this.difficulty++;
                }
            });
        }, 10);
    }

    playerJump = () => {
        if (!this.gameRunning) return;
        const player = document.querySelector('.player') as HTMLElement;
        player.style.rotate = `${(++this.jmpCount * 90)}deg`;
        if (player!.classList.contains('player-jump')) return;
        else {
            player!.classList.add('player-jump');
            setTimeout( () => {
                this.playerUp = true;
            }, 30);
            setTimeout( () => {
                this.playerUp = false;
            }, 470);
            setTimeout(() => {
                if (this.gameRunning) document.querySelector('.player')!.classList.remove('player-jump');
            }, this.jumpHeight);
        }
    }

    gameLost = () => {
        this.gameOver = true;
        this.gameRunning = false;
        this.difficulty = 1;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highscore', String(this.highScore));
        }

        for (let i = 0; i < 3; ++i) {
            if (!this.availableObstacleId[i]) {
                document.querySelector(`.obstacle${i}`)!.classList.add('paused');
            }
        }

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
            s.innerHTML = `Final score: ${this.score}<br>High score: ${this.highScore}`;
            e.appendChild(s);

            let r = document.createElement('div');
            r.classList.add('end-buttons');

            //repeat button
            let r1 = document.createElement('button');
            r1.classList.add('repeat-btn','end-btn');
            r1.innerHTML = 'RETRY!';
            //reset button
            let r2 = document.createElement('button');
            r2.classList.add('reset-btn','end-btn');
            r2.innerHTML = 'RESET';

            r.appendChild(r1);
            r.appendChild(r2);

            e.appendChild(r);

            document.body.appendChild(e);
            document.querySelector('.repeat-btn')!.addEventListener('click', this.restartGame);
            document.querySelector('.reset-btn')!.addEventListener('click', () => {
                this.highScore = 0;
                localStorage.removeItem('highscore');
                document.querySelector('.fin-score')!.innerHTML = `Final score: ${this.score}<br>High score: RESET`;
            });

            let elements = document.querySelectorAll('.game-object');
            for (let i = 0; i < elements.length; ++i) {
                elements[i].remove();
            }
        },600);
    }

    restartGame = () => {
        document.querySelector('.end-screen')!.remove();
        document.querySelector('.body')!.classList.remove('bck-change');
        this.difficulty = 1;
        this.availableObstacleId = [true, true, true];
        this.obstacles = [];
        this.jumpHeight = 500;
        this.gameOver = false;
        this.playerUp = false;
        this.gameRunning = false;
        this.score = 0;
        this.startGame();
    }
}

let currentGame = new game();

document.querySelector('.begin-btn')!.addEventListener('click', currentGame.startGame);
