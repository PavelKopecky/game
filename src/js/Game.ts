import {Obstacle} from "./Obstacle.js";
import {Obstacle1} from "./Obstacle1.js";
import {Obstacle2} from "./Obstacle2.js";
import {Obstacle3} from "./Obstacle3.js";
import {Player} from "./Player.js";

// @ts-ignore
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm'

let theme = new Audio('effects/main-theme-2.mp3');
theme.volume = 0.2;
let score10 = new Audio('effects/score10-1.mp3');
score10.volume = 0.1;
let endTheme = new Audio('effects/marche-funebre.mp3');
endTheme.volume = 0.25;
let buttonClick = new Audio('effects/button-press.mp3');
buttonClick.volume = 0.7;

export class Game {
    difficulty: number = 1;
    obstacles: Obstacle[] = [];
    state: "ready" | "running" | "over" = "ready";
    score: number = 0;
    frequency: number = 1500;
    difficulties = [[1,1,1,1,2], [1, 1, 2, 2, 2], [1, 2, 2, 2, 3], [1, 2, 2, 3, 3], [2, 2, 3, 3, 3], [2, 3, 3, 3, 3]];
    highScore: number = 0;
    groundInterval: number = 0;
    container: HTMLElement = document.getElementById('game')!;
    player: Player = new Player();

    startGame() {
        let begin = document.querySelector('.begin');
        let beginBtn = document.querySelector('.begin-btn');

        const hs = Number(localStorage.getItem('highscore')!);
        if (hs) this.highScore = hs;

        if (begin) {
            this.player.fly();
            setTimeout(() => {
                begin!.remove();
                this.createGround();
                if (beginBtn) beginBtn.remove();
                this.player.render(this.container);
                setTimeout(() => {
                    this.startMovement();
                }, 1050);
            }, 1000);
        } else {
            this.createGround();
            this.player.render(this.container)
            setTimeout(() => {
                this.startMovement();
            }, 1050);
        }
    }

    createGround() {
        const s = document.createElement('p');
        s.classList.add('score', 'game-object');
        s.innerHTML = '0';
        this.container.appendChild(s);
        this.addSky();
        const e = document.createElement('div');
        e.classList.add('ground', 'game-object');
        const img1 = document.createElement('img');
        img1.src = 'img/ground.png';
        img1.style.left = '0';
        e.classList.add('ground', 'game-object');
        const img2 = document.createElement('img');
        img2.src = 'img/ground.png';
        img2.style.left = '2560';
        e.appendChild(img1);
        e.appendChild(img2);
        this.container.appendChild(e);

        setTimeout(() => {
            document.querySelector('.score')!.classList.add('score-appear');
        }, 100);
    }

    addSky() {
        const sky = document.createElement('div');
        sky.classList.add('sky', 'game-object');
        const skyimg1 = document.createElement('img');
        skyimg1.style.left = '0';
        skyimg1.src = 'img/sky1-1.jpg';
        const skyimg2 = document.createElement('img');
        skyimg2.style.left = '2560';
        skyimg2.src = 'img/sky1-1.jpg';
        sky.appendChild(skyimg1);
        sky.appendChild(skyimg2);
        this.container.appendChild(sky);
    }

    startMovement() {
        document.querySelector('.ground')!.classList.add('ground-move');
        document.querySelector('.sky')!.classList.add('sky-move');
        theme.play();
        this.interval();
        this.addObstacle();
    }

    addObstacle() {
        let x: Obstacle;

        switch (this.randomType()) {
            case 1 : {
                x = new Obstacle1();
                break;
            }
            case 2 : {
                x = new Obstacle2();
                break;
            }
            case 3 : {
                x = new Obstacle3();
                break;
            }
            default : {
                x = new Obstacle1();
                break;
            }
        }

        x.render(this.container);
        this.obstacles.push(x);

        setTimeout(() => {
            if (this.state === "running") {
                this.obstacles[0].destroy();
                this.obstacles.shift();
            }
        }, 2000);

        setTimeout(() => {
            if (this.state === "running") {
                this.addObstacle();
            }
        }, this.randomFrequency())
    }

    randomType(): number {
        if (this.difficulty >= 7) {
            return 3;
        }

        return this.difficulties[this.difficulty - 1][Math.floor(Math.random() * 10) % 5];
    }

    randomFrequency(): number {
        return this.frequency - (75 * this.difficulty + Math.floor(Math.random() * 1000) % 500);
    }

    interval() {
        this.state = "running";
        const gameClock = setInterval(() => {
            this.obstacles.forEach((obstacle) => {
                let player = document.querySelector('.player')! as HTMLElement;
                obstacle.x -= 5;
                if (Math.abs(parseInt(obstacle.element.style.left) - parseInt(player.style.left)) <= obstacle.size / 2 + 36
                        && !this.player.isUp) {
                    clearInterval(gameClock);
                    this.gameLost();
                } else if (obstacle.x === 100) {
                    document.querySelector('.score')!.innerHTML = String(++this.score);
                    if (this.score % 10 === 0) {
                        if (this.difficulty < 10) {
                            this.difficulty++;
                        }
                        score10.play();
                    }
                }
            });
        }, 10);
    }

    gameLost() {
        this.state = "over";
        this.difficulty = 1;
        theme.pause();
        theme.currentTime = 0;
        this.player.die();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highscore', String(this.highScore));
        }

        document.querySelectorAll('.game-object').forEach((element) => {
            element.classList.add('paused');
        });

        gsap.killTweensOf('.obstacle');

        clearInterval(this.groundInterval);

        setTimeout(() => {
            //end screen
            let e = document.createElement('div');
            e.classList.add('end-screen');
            //background
            let img = document.createElement('img');
            img.classList.add('end-background');
            img.src = 'img/ground-2-3.jpg';
            e.appendChild(img);
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
            r1.classList.add('repeat-btn', 'end-btn');
            let r1img = document.createElement('img');
            r1img.classList.add('retry-img');
            r1img.src = 'img/button-retry.png';
            r1.appendChild(r1img);
            //reset button
            let r2 = document.createElement('button');
            r2.classList.add('reset-btn', 'end-btn');
            let r2img = document.createElement('img');
            r2img.classList.add('reset-img');
            r2img.src = 'img/button-reset.png';
            r2.appendChild(r2img);

            r.appendChild(r1);
            r.appendChild(r2);

            e.appendChild(r);

            this.container.appendChild(e);
            document.querySelector('.repeat-btn')!.addEventListener('click', () => {
                if (resetPressed) {
                    buttonClick.pause();
                    buttonClick.currentTime = 0;
                }
                buttonClick.play();
                let img = document.querySelector('.retry-img')! as HTMLImageElement;
                img.src = 'img/button-retry-pressed.png';
                this.restartGame();
            });

            let resetPressed = false;
            document.querySelector('.reset-btn')!.addEventListener('click', () => {
                if (!resetPressed) {
                    buttonClick.play();
                    let img = document.querySelector('.reset-img')! as HTMLImageElement;
                    img.src = 'img/button-reset-pressed.png';
                    this.highScore = 0;
                    localStorage.removeItem('highscore');
                    document.querySelector('.fin-score')!.innerHTML = `Final score: ${this.score}<br>High score: RESET`;
                    resetPressed = true;
                }
            });

            setTimeout(() => endTheme.play(), 250);

            let elements = document.querySelectorAll('.game-object');
            for (let i = 0; i < elements.length; ++i) {
                elements[i].remove();
            }
        }, 600);
    }

    restartGame() {
        document.querySelector('.end-screen')!.remove();
        endTheme.pause();
        endTheme.currentTime = 0;
        this.difficulty = 1;
        this.obstacles = [];
        this.state = "ready";
        this.score = 0;
        this.player.reset();
        this.startGame();
    }
}
