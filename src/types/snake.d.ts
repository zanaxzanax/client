import {BodyPointInterface, PointItem} from './point';
import {GameInterface} from './game';

export interface SnakeOptions {
    length?: number;
    startX?: number;
    startY?: number;
    headColor?: string;
    bodyColor?: string;
    direction?: number;
}

export interface SnakeItem {
    points: PointItem[];
}

export interface SnakeInterface {
    game: GameInterface
    headPoint: BodyPointInterface;
    lastPoint: BodyPointInterface;
    points: BodyPointInterface[];
    isSelfHit: () => boolean;
    draw: () => void;
    grow: () => void;
    move: () => void;
}
