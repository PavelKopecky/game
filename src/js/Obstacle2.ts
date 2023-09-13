import {Obstacle} from "./Obstacle.js";

const obstacleType = new Image();
obstacleType.src = 'img/obstacle2-1.png';

export class Obstacle2 extends Obstacle {
    size = 92;
    imageSrc = obstacleType.src;
    className = 'obstacle-type2';
}
