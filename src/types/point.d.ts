import {GameInterface} from './game';
import {DrawingInterface} from './drawing';

export interface PointInterface {
    x: number;
    y: number;
    draw: () => void;
    drawing: DrawingInterface;
    toJSON: () => PointItem;
}

export interface PointItem {
    x: number;
    y: number;
    direction?: number;
}

export interface HeadPointOptions {
    x: number;
    y: number;
    direction: number;
}

export interface PivotPointInterface extends PointInterface {
    direction: number;
    isUp: () => boolean;
    isDown: () => boolean;
    isLeft: () => boolean;
    isRight: () => boolean;
    isOpposite: (direction: PivotPointInterface) => boolean;
}

export interface BodyPointInterface extends PointInterface {
    direction: number;
    game: GameInterface;
}

export interface GoodPointInterface extends PointInterface {
    game: GameInterface;
    eat: () => void;
    isEaten: () => boolean;
    eaten: boolean;
}
