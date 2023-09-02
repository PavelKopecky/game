export abstract class Obstacle {
    x: number = 1800;
    element: HTMLDivElement;
    abstract className: string;
    abstract imageSrc: string;
    abstract size: number;

    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('game-object');
        this.element.classList.add('obstacle');
    }

    render(container: HTMLElement) {
        const img = document.createElement('img');
        this.element.classList.add(this.className);
        img.src = this.imageSrc;
        this.element.appendChild(img);
        this.element.style.animation = '1.9s linear obstacle-move';
        container.appendChild(this.element);
    }

    destroy() {
        this.element.remove();
    }
}