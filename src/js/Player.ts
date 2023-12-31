// @ts-ignore
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm'

let jumpEffect = new Audio('effects/jump1.mp3');
jumpEffect.volume = 0.1;
let scream = new Audio('effects/wilhelmscream.mp3');
scream.volume = 0.1;

export class Player {
    isUp: boolean = false;
    isJumping: boolean = false;
    isRunning: boolean = false;
    jumpCount: number = 0;
    jumpDuration: number = 500;

    jump() {
        if (!this.isRunning || this.isJumping) return;
        else {
            gsap.to(".player", {ease: "power1.out", top: 355, duration: 0.24});
            gsap.to(".player-img", {ease: "power1.out", duration: 0.4, rotate: ++this.jumpCount * 90});
            setTimeout(() => {
                this.isRunning && gsap.to(".player", {ease: "power1.in", top: 498, duration: 0.24});
            }, 240);
            this.isJumping = true;
            jumpEffect.play();
            setTimeout(() => {
                this.isUp = true;
            }, 70);
            setTimeout(() => {
                this.isUp = false;
            }, 430);
            setTimeout(() => {
                this.isJumping = false;
                jumpEffect.currentTime = 0;
                jumpEffect.pause();
            }, this.jumpDuration);
        }
    }

    fly() {
        let playerStart = document.querySelector('.player-start')!;
        playerStart.classList.add('fly-start');
    }

    render(container: HTMLElement) {
        const e = document.createElement('div');
        const img = document.createElement('img');
        img.classList.add('player-img');
        img.src = 'img/player1.png'
        e.classList.add('player', 'game-object');
        e.appendChild(img);
        container.appendChild(e);
        setTimeout(() => {
            let plr = document.querySelector('.player')! as HTMLElement;
            plr.classList.add('player-move');
            setTimeout(() => {
                plr.classList.remove('player-move');
                plr.style.left = '180px';
                plr.style.top = '498px';
                document.addEventListener('click', () => this.jump());
                document.addEventListener('keydown', (event) => {
                    if (event.key === ' ') this.jump();
                });
                this.isRunning = true;
            }, 1000);
        }, 50);
    }

    die() {
        this.isRunning = false;
        gsap.killTweensOf('.player');
        gsap.killTweensOf('.player-img');
        scream.play();
    }

    reset() {
        this.isUp = false;
        this.jumpCount = 0;
    }
}