import {AppInterface} from './app';
import {PlayerInterface, PlayerItem} from './player';
import {DrawingInterface} from './drawing';
import {SnakeInterface, SnakeItem} from './snake';
import {GoodPointInterface, PivotPointInterface, PointItem} from './point';

export interface GameItem {
    name: string;
    state: number;
    playersLimit: number;
    startTime: number;
    endTime: number;
    now: number;
    slots: PlayerItem[];
    snakes: { [key: string]: SnakeItem };
    goods: { [key: string]: PointItem };
    creator: PlayerItem;
    uuid: string;
}

export interface GameEvent {
    ts: number;
    type: number;
    data: any;
    game?: string;
    player?: string;
}

export interface GameStatistic {
    snakePosition?: PointItem;
    pastTime?: number;
}

export interface GameInterface {
    app: AppInterface;
    state: number;
    player: PlayerInterface;
    snake: SnakeInterface;
    drawing: DrawingInterface;
    speed: number;
    interval: any;
    keyPressHandler: any;
    type: number;
    pivots: PivotPointInterface[];
    good: GoodPointInterface;
    localEvents: GameEvent[];
    statistic: GameStatistic;
    startTime: number;
    endTime: number;
    initialized: boolean;
    //setState: (state: number) => void;
    initialize: (game?: GameItem) => boolean;
    start: () => void;
    stop: () => void;
    processEvents: (events: GameEvent[]) => void;
    randomInteger: (min, max) => number;
    getRandomX: () => number;
    getRandomY: () => number;
    addGoods: () => void;
    drawStats: () => void;
    updateStats: () => void;
    isWin: () => boolean;
    isGameOver: () => boolean;
    cleanPivots: () => void;
    redraw: () => void;
    startMovement: () => void;
    stopMovement: () => void;
    tick: (events: GameEvent[]) => void;
    addPivotPoint: (data: PointItem) => void;
    bindEvents: (bool: boolean) => void;
}

export interface MultiGameInterface extends GameInterface {
    uuid: string;
    game: GameItem;
    opponentSnake: SnakeInterface;
    drawingLeft: DrawingInterface;
    drawingRight: DrawingInterface;
    updateGame: (game: GameItem) => void;
    removeGame: () => void;
}

export interface SingleGameInterface extends GameInterface {
    drawing: DrawingInterface;
}
