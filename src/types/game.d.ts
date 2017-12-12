import {AppMultiInterface, AppSingleInterface} from './app';
import {PlayerInterface, PlayerItem} from './player';
import {DrawingInterface} from './drawing';
import {SnakeInterface, SnakeItem} from './snake';
import {GoodPointInterface, PivotPointInterface, PointInterface, PointItem} from './point';

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

export interface GameSingleItem {
    name?: string;
    speed: number;
    rule: number;
    uuid: string;
    type: number;
}

export interface GameInterface {
    app: any;
    player: PlayerInterface;
    snake: SnakeInterface;
    drawing: DrawingInterface;
    centerPoint: PointInterface;
    game: any;
    keyPressHandler: any;
    initialized: boolean;
    initialize: (game?: any) => boolean;
    drawStats: () => void;
    redraw: () => void;
    bindEvents: (bool: boolean) => void;
    ready: () => void;
    drawSnakeInfo: () => void;
    drawTime: () => void;
    drawGameState: () => void;
    drawSpeed: () => void;
    addPivotPoint: (data: PointItem) => void;
}

export interface SingleGameInterface extends GameInterface {
    app: AppSingleInterface;
    game: GameInterface;
    good: GoodPointInterface;
    state: number;
    speed: number;
    rule: number;
    startTime: number;
    interval: any;
    now: number;
    endTime: number;
    start: () => void;
    stop: () => void;
    tick: () => void;
    cleanPivots: () => void;
    addGoods: () => void;
    isGameOver: () => boolean;
    pivots: PivotPointInterface[];
}

export interface MultiGameInterface extends GameInterface {
    app: AppMultiInterface;
    uuid: string;
    game: GameItem;
    opponentSnake: SnakeInterface;
    drawingLeft: DrawingInterface;
    drawingRight: DrawingInterface;
    updateGame: (game: GameItem) => void;
    removeGame: () => void;
}
