import Point from './point';
import {DrawingInterface, GameInterface, PivotPointInterface} from '../../types';
import {PivotPointType} from '../enums';

export default class PivotPoint extends Point implements PivotPointInterface {

    static color: 'black';

    drawing: DrawingInterface;

    constructor(public game: GameInterface, public x, public y, public direction: number) {
        super(x, y);
        this.drawing = this.game.drawing;
    }

    isUp(): boolean {
        return this.direction === PivotPointType.UP;
    }

    isDown(): boolean {
        return this.direction === PivotPointType.DOWN;
    }

    isLeft(): boolean {
        return this.direction === PivotPointType.LEFT;
    }

    isRight(): boolean {
        return this.direction === PivotPointType.RIGHT;
    }

    isOpposite(direction: PivotPointInterface): boolean {
        return this.isUp() && direction.isDown() || this.isDown() && direction.isUp() ||
            this.isLeft() && direction.isRight() || this.isRight() && direction.isLeft();
    }

    draw(): void {
        this.drawing.drawPointByCoordinates(this.x, this.y, PivotPoint.color);
    }
}
