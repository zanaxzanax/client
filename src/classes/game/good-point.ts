import Point from './point';
import {DrawingInterface, GameInterface, GoodPointInterface} from '../../types';

export default class GoodPoint extends Point implements GoodPointInterface {

    static color: 'magenta';

    drawing: DrawingInterface;
    eaten: boolean = false;

    constructor(public game: GameInterface, public x: number, public y: number) {
        super(x, y);
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
