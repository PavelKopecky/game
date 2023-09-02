import {Obstacle} from "./Obstacle.js";

let obstacleType = new Image();
obstacleType.src = '/src/img/obstacle3-1.png';

export class Obstacle3 extends Obstacle {
    size = 128;
    src = obstacleType.src;
    className = 'obstacle-type3';
}
