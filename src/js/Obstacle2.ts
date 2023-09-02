import {Obstacle} from "./Obstacle.js";

let obstacleType = new Image();
obstacleType.src = '/src/img/obstacle2-1.png';

export class Obstacle2 extends Obstacle {
    size = 96;
    src = obstacleType.src;
    className = 'obstacle-type2';
}
