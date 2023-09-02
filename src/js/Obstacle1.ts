import {Obstacle} from "./Obstacle.js";

const obstacleType = new Image();
obstacleType.src = 'img/obstacle1-1.png';

export class Obstacle1 extends Obstacle {
    size = 72;
    imageSrc = obstacleType.src;
    className = 'obstacle-type1';
}
