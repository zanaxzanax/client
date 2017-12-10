import Point from './point';
import {DrawingInterface, GameInterface, GoodPointInterface, PointItem} from '../../types';

export default class GoodPoint extends Point implements GoodPointInterface {

    static color: 'magenta';

    drawing: DrawingInterface;
    x: number;
    y: number;
    eaten: boolean = false;

    constructor(public game: GameInterface, options: PointItem) {
        super(options.x, options.y);
        this.x = options.x;
        this.y = options.y;
        this.drawing = this.game.drawing;
    }

    draw(): void {
        this.drawing.drawPointByCoordinates(this.x, this.y, GoodPoint.color);
    }

    isEaten(): boolean {
        return this.eaten;
    }

    eat(): void {
        this.eaten = true;
    }
}
