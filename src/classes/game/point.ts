import {DrawingInterface, PointInterface, PointItem} from '../../types';

export default class Point implements PointInterface {

    drawing: DrawingInterface;

    constructor(public x: number, public y: number) {

    }

    draw(): void {
        //
    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y,
        }
    }
}
