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
            const playerImg = document.querySelector('.player-img') as HTMLElement;
            playerImg.style.rotate = `${(++this.jumpCount * 90)}deg`;
            document.querySelector('.player')!.classList.add('player-jump');
            this.isJumping = true;
            jumpEffect.play();
            setTimeout(() => {
                this.isUp = true;
            }, 70);
            setTimeout(() => {
                this.isUp = false;
            }, 430);
            setTimeout(() => {
                if (this.isRunning) document.querySelector('.player')!.classList.remove('player-jump');
                this.isJumping = false;
                jumpEffect.currentTime = 0;
                jumpEffect.pause();
            }, this.jumpDuration);
        }
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
            document.querySelector('.player')!.classList.add('player-move');
            setTimeout(() => {
                document.querySelector('.player')!.classList.add('player-moved');
                document.querySelector('.player')!.classList.remove('player-move');
                document.addEventListener('click', () => this.jump());
                document.addEventListener('keydown', (event) => {
                    if (event.key === ' ') this.jump();
                });
                this.isRunning = true;
            }, 1000);
        }, 50);
    }

    die() {
        this.isRunning = false
        scream.play();
    }

    reset() {
        this.isUp = false;
        this.jumpCount = 0;
    }
}