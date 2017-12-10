import Point from './point';
import {BodyPointInterface, DrawingInterface, GameInterface, PointItem} from '../../types';

export default class BodyPoint extends Point implements BodyPointInterface {

    x: number;
    y: number;
    direction: number;
    drawing: DrawingInterface;

    constructor(public game: GameInterface, options: PointItem) {
        super(options.x, options.y);
        this.x = options.x;
        this.y = options.y;
        this.direction = options.direction;
        this.drawing = this.game.drawing;
    }

    draw(): void {
        this.drawing.drawPointByCoordinates(this.x, this.y/*, this.snake.options.headColor*/);
    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction
        }
    }

}
