// @ts-ignore
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm'

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
        gsap.fromTo(this.element, {left: 1800}, {rotation: 0.01, left: -100, duration: 1.9, ease: "power0.in"});
        this.element.classList.add('obstacle-move');
        container.appendChild(this.element);
    }

    destroy() {
        this.element.remove();
    }
}