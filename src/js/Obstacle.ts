export abstract class Obstacle {
    x: number = 1800;
    e: HTMLDivElement;
    abstract className: string;
    abstract src: string;
    abstract size: number;

    constructor() {
        this.e = document.createElement('div');
        this.e.classList.add('game-object');
        this.e.classList.add('obstacle');
    }

    render() {
        const img = document.createElement('img');
        this.e.classList.add(this.className);
        img.src = this.src;
        this.e.appendChild(img);
        this.e.style.animation = '1.9s linear obstacle-move';
        document.body.appendChild(this.e);
    }

    destroy () {
        this.e.remove();
    }
}