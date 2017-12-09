import Point from './point';
import {BodyPointInterface, DrawingInterface, PointItem, SnakeInterface} from '../../types';

export default class BodyPoint extends Point implements BodyPointInterface {

    drawing: DrawingInterface;

    constructor(public snake: SnakeInterface, public x: number, public y: number, public direction: number) {
        super(x, y);
        this.drawing = this.snake.game.drawing;
    }

    draw(): void {
        this.drawing.drawPointByCoordinates(this.x, this.y, this.snake.options.headColor);
    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction
        }
    }

}
