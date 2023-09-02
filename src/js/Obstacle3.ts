import {Obstacle} from "./Obstacle.js";

const obstacleType = new Image();
obstacleType.src = 'img/obstacle3-1.png';

export class Obstacle3 extends Obstacle {
    size = 128;
    imageSrc = obstacleType.src;
    className = 'obstacle-type3';
}
