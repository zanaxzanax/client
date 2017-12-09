import BodyPoint from './body-point';
import {DrawingInterface, HeadPointInterface, HeadPointOptions, PointItem, SnakeInterface} from '../../types';

export default class HeadPoint extends BodyPoint implements HeadPointInterface {

    drawing: DrawingInterface;

    x: number;
    y: number;

    constructor(public snake: SnakeInterface, options: HeadPointOptions) {

        super(snake, options.x, options.y, options.direction);

        this.x = options.x;
        this.y = options.y;
        this.direction = options.direction;

        this.drawing = this.snake.game.drawing;
    }

    draw(): void {
        this.drawing.drawPointByCoordinates(this.x, this.y, this.snake.options.headColor);
    }

    toPoint(): PointItem {
        return this.toJSON();
    }

}
