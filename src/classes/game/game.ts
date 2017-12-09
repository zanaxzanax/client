import {
    AppInterface,
    DrawingInterface,
    GameEvent,
    GameInterface,
    GameStatistic,
    GoodPointInterface,
    PivotPointEventData,
    PivotPointInterface,
    PlayerInterface,
    PointInterface,
    SnakeInterface
} from '../../types';
import Snake from './snake';
import PivotPoint from './pivot-point';
import GoodPoint from './good-point';
import {GameEventType, GameState, GameTypes, PivotPointType} from '../enums';

export class Game implements GameInterface {

    uuid: string;
    state: number;
    drawing: DrawingInterface;
    player: PlayerInterface;
    app: AppInterface;
    snake: SnakeInterface;
    speed: number = 10;
    interval: any;
    keyPressHandler: any;
    type: number = GameTypes.SINGLE;
    pivots: PivotPointInterface[] = [];
    good: GoodPointInterface;
    localEvents: GameEvent[] = [];
    statistic: GameStatistic;
    startTime: number;
    endTime: number;
    initialized: boolean;

    constructor(app: AppInterface) {

        this.app = app;
        this.state = GameState.CREATED;

        this.keyPressHandler = this.onKeyPress.bind(this);
    }

    setState(state: GameState): void {
        this.state = state;
    }

    initialize(): boolean {

        if (!this.initialized) {
            this.player = this.app.player;
            this.snake = new Snake(this, {
                length: 1
            });
            this.statistic = {};

            this.snake.draw();

            this.setState(GameState.CREATED);
        }

        return this.initialized;
    }

    start(): void {
        this.state = GameState.PLAY;
        this.startTime = Date.now();
        this.startMovement();
        this._bindEvents(true);
    }

    stop(): void {
        this._bindEvents(false);
        this.stopMovement();
    }

    processEvents(events: GameEvent[]): void {

        /* const eventsSliced: GameEvent[] = events.slice();
         events.length = 0;*/

        events.forEach((event: GameEvent) => {
            switch (event.type) {
                case GameEventType.PIVOT:
                    event.data = event.data as PivotPointEventData;
                    this.pivots.push(new PivotPoint(this, event.data.x, event.data.y, event.data.direction));
                    break;
                case GameEventType.TICK:
                    this.snake.move();
                    break;
                default:
                    break;
            }
        });
    }

    randomInteger(min, max): number {
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }

    getRandomX(): number {
        return this.randomInteger(0, this.drawing.maxX);
    }

    getRandowY(): number {
        return this.randomInteger(0, this.drawing.maxY);
    }

    addGoods(): void {
        if (!this.good || this.good.isEaten()) {
            this.good = new GoodPoint(this, this.getRandomX(), this.getRandowY());
        }
    }

    drawStats(): void {
        this.drawing.text(`Snake position: x${this.statistic.snakePosition.x} y ${this.statistic.snakePosition.y}`, 0, 0);
        this.drawing.text(`Time: ${this.statistic.pastTime.toFixed(0)}`, 20, 0);
    }

    updateStats(): void {
        const curTime: number = Date.now();
        this.statistic.snakePosition = this.snake.headPoint.toPoint();
        this.statistic.pastTime = (curTime - this.startTime) / 1000;
    }

    tick(events: GameEvent[]): void {

        this.processEvents(events);

        this.localEvents.length = 0;

        this.addGoods();

        this.cleanPivots();

        this.updateStats();

        if (this.isGameOver()) {
            this.state = GameState.LOSE;
            this.stop();
        } else if (this.isWin()) {
            this.state = GameState.WIN;
            this.stop();
        }

        this.redraw();
    }

    isWin(): boolean {
        return false;
    }

    isGameOver(): boolean {
        return this.snake.headPoint.x > this.drawing.maxX ||
            this.snake.headPoint.y > this.drawing.maxY ||
            this.snake.headPoint.y < 0 || this.snake.headPoint.x < 0 ||
            this.snake.isSelfHit();
    }

    cleanPivots(): void {
        const pivots = this.pivots.slice();
        const snakePoints = this.snake.points;
        this.pivots.length = 0;
        pivots.forEach((pivot: PivotPoint) => {
            if (snakePoints.find((point: PointInterface) => {
                    return point.x === pivot.x && point.y === pivot.y;
                })) {
                this.pivots.push(pivot);
            }
        });
    }

    redraw(): void {

        this.drawing.clear();

        switch (this.state) {
            case GameState.CREATED:
                console.log('GameState.CREATED');
                const centerPoint: PointInterface = this.drawing.center;
                // this.drawing.drawButton(centerPoint.x, centerPoint.y, Drawing.canvasWidth / 2, Drawing.canvasHeight / 10, 'sadasd', 'red');
                break;
            case GameState.WIN:
                break;
            case GameState.LOSE:
                break;
            case GameState.PLAY:

                this.good.draw();

                this.pivots.forEach((pivot: PivotPoint) => {
                    pivot.draw();
                });

                this.drawStats();

                this.snake.draw();

                break;
            default:
                break;
        }
    }

    onKeyPress(event: KeyboardEvent) {
        let direction;

        switch (event.which) {
            case 37:
            case 38:
            case 39:
            case 40:
                event.preventDefault();
                break;
            default:
                break;
        }

        switch (event.which) {
            case 40: // down
                direction = PivotPointType.DOWN;
                break;
            case 38: // up
                direction = PivotPointType.UP;
                break;
            case 39: // right
                direction = PivotPointType.RIGHT;
                break;
            case 37: // left
                direction = PivotPointType.LEFT;
                break;
            default:
                break;
        }

        if (direction !== undefined) {
            this.addPivotPoint({
                x: this.snake.headPoint.x,
                y: this.snake.headPoint.y,
                direction
            });
        }
    }

    addPivotPoint(data: PivotPointEventData) {
        this.localEvents.push({
            ts: Date.now(),
            type: GameEventType.PIVOT,
            data
        });
    }

    startMovement(): void {
        this.interval = setInterval(() => {
            this.tick(this.localEvents);
        }, 1000 / this.speed);
    }

    stopMovement(): void {
        clearInterval(this.interval);
    }

    private _bindEvents(bool: boolean) {
        if (bool) {
            this._bindEvents(false);
            document.addEventListener('keydown', this.keyPressHandler, false);
        } else {
            document.removeEventListener('keydown', this.keyPressHandler);
        }
    }
}
