import {
    BodyPointInterface,
    GoodPointInterface,
    MultiGameInterface,
    PivotPointInterface,
    PointInterface,
    PointItem,
    SingleGameInterface,
    SnakeInterface,
    SnakeOptions
} from '../../types';
import BodyPoint from './body-point';
import {GameRule, PivotPointType} from '../enums';

export default class Snake implements SnakeInterface {

    points: BodyPointInterface[] = [];

    constructor(public game: SingleGameInterface | MultiGameInterface, points: PointItem[]) {
        this.points = points.map((point: PointItem) => new BodyPoint(this.game, point));
    }

    get headPoint(): BodyPointInterface {
        return this.points[0];
    }

    get lastPoint(): BodyPoint {
        return this.points[this.points.length - 1];
    }

    isSelfHit(): boolean {
        return !!this.points.find((point: PointInterface) =>
            !!this.points.find((p: PointInterface) => p !== point && p.x === point.x && p.y === point.y));
    }

    draw(): void {
        this.points.forEach((point: BodyPointInterface) => point.draw());
    }

    grow(): void {

        let x: number = this.lastPoint.x;
        let y: number = this.lastPoint.y;

        switch (this.lastPoint.direction) {
            case PivotPointType.UP:
                y += 1;
                break;
            case PivotPointType.DOWN:
                y -= 1;
                break;
            case PivotPointType.LEFT:
                x += 1;
                break;
            case PivotPointType.RIGHT:
                x -= 1;
                break;
            default:
                break;
        }

        this.points.push(new BodyPoint(this.game, {x, y, direction: this.lastPoint.direction}));
    }

    move(): void {

        const pivots: PivotPointInterface[] = (this.game as SingleGameInterface).pivots;
        const good: GoodPointInterface = (this.game as SingleGameInterface).good;
        let direction;

        this.points.forEach((point: BodyPointInterface, i: number, array: BodyPointInterface[]) => {

            const pivot: PivotPointInterface = pivots.find((pivotPoint: PivotPointInterface) =>
                pivotPoint.x === point.x && pivotPoint.y === point.y);

            direction = pivot ? pivot.direction : point.direction;
            point.direction = direction;

            switch (direction) {
                case PivotPointType.UP:
                    point.y -= 1;
                    break;
                case PivotPointType.DOWN:
                    point.y += 1;
                    break;
                case PivotPointType.LEFT:
                    point.x -= 1;
                    break;
                case PivotPointType.RIGHT:
                    point.x += 1;
                    break;
                default:
                    break;
            }

            if ((this.game as SingleGameInterface).rule === GameRule.WALL_THROW) {
                if (point.x > this.game.drawing.maxX) {
                    point.x = 0;
                }
                if (point.x < 0) {
                    point.x = this.game.drawing.maxX;
                }
                if (point.y > this.game.drawing.maxY) {
                    point.y = 0;
                }
                if (point.y < 0) {
                    point.y = this.game.drawing.maxY;
                }
            }

            if (this.points.indexOf(point) === 0) { // is head
                if (point.x === good.x && point.y === good.y) {
                    good.eat();
                }
            }
        });

        if (good.isEaten()) {
            this.grow();
        }
    }
}
