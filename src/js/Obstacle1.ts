import {Obstacle} from "./Obstacle.js";

let obstacleType = new Image();
obstacleType.src = '/src/img/obstacle1-1.png';

export class Obstacle1 extends Obstacle {
    size = 72;
    src = obstacleType.src;
    className = 'obstacle-type1';
}
