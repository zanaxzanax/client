import {Game} from './game';
import {
    AppSingleInterface,
    GameItem,
    GoodPointInterface,
    PivotPointInterface,
    PointInterface,
    PointItem,
    SingleGameInterface
} from '../../types';
import {GameRule, GameState, PivotPointType, PlayerState} from '../enums';
import PivotPoint from './pivot-point';
import {Drawing} from '../drawing';
import GoodPoint from './good-point';
import Snake from './snake';

export class SingleGame extends Game {

    speed: number;
    rule: number;
    startTime: number;
    now: number;
    endTime: number;
    pivots: PivotPointInterface[] = [];
    good: GoodPointInterface;

    constructor(public app: AppSingleInterface) {
        super(app);
        this.drawing = this.app.drawing;
    }

    get game(): SingleGameInterface {
        return this;
    }

    initialize(game?: GameItem): boolean {
        if (!this.initialized) {
            this.player = this.app.player;
            this.speed = parseInt(document.getElementById('speed').innerHTML, 10) || 4;
            this.rule = parseInt(document.getElementById('rule').innerHTML, 10) || GameRule.WALL_THROW;
            this.redraw();
            this.initialized = true;
        }
        return this.initialized;
    }

    start(): void {
        this.player.state = PlayerState.READY;
        this.state = GameState.PLAY;
        this.startTime = Date.now();
        this.snake = new Snake(this, [{
            x: this.drawing.centerX,
            y: this.drawing.centerY,
            direction: PivotPointType.RIGHT
        }]);
        this.addGoods();
        this._startMovement();
        this.bindEvents(true);
    }

    stop(): void {
        this.state = GameState.DONE;
        this.endTime = Date.now();
        this.bindEvents(false);
        this._stopMovement();
    }

    addPivotPoint(data: PointItem) {
        this.pivots.push(new PivotPoint(this, {
            x: data.x,
            y: data.y,
            direction: data.direction
        }));
    }

    cleanPivots(): void {
        const pivots = this.pivots.slice();
        const snakePoints = this.snake.points;
        this.pivots.length = 0;
        pivots.forEach((pivot: PivotPoint) => {
            if (snakePoints.find((point: PointInterface) => point.x === pivot.x && point.y === pivot.y)) {
                this.pivots.push(pivot);
            }
        });
    }

    addGoods(): void {
        if (!this.good || this.good.isEaten()) {
            this.good = new GoodPoint(this, {x: this._getRandomX(), y: this._getRandomY()});
        }
    }

    isGameOver(): boolean {
        return (this.rule === GameRule.SIMPLE && this.snake.headPoint.x > this.drawing.maxX ||
            this.snake.headPoint.y > this.drawing.maxY ||
            this.snake.headPoint.y < 0 || this.snake.headPoint.x < 0) ||
            this.snake.isSelfHit();
    }

    tick(): void {

        this.now = Date.now();

        this.snake.move();

        this.addGoods();

        this.cleanPivots();

        if (this.isGameOver()) {
            this.player.state = PlayerState.LOSER;
            this.state = GameState.DONE;
            this.stop();
        }

        this.redraw();
    }

    ready(): void {
        this.start();
        this.redraw();
    }

    redraw(): void {

        this.drawing.clear();
        this.drawing.drawField();

        switch (this.state) {
            case GameState.CREATED:
                this.drawGameState();
                if (this.player) {
                    this.drawing.text(this.player.name, this.centerPoint.x, this.centerPoint.y - 10, 'blue');
                    if (!this.player.isReady()) {
                        this.drawing.drawButton(this.centerPoint.x, this.centerPoint.y, this.drawing.canvasWidth / 2,
                            this.drawing.canvasHeight / 10, Game.langPlayerState[PlayerState.READY], 'blue',
                            (event: Event) => this.ready());
                    } else {
                        this.drawing.text('READY', this.centerPoint.x, this.centerPoint.y);
                    }
                } else {
                    this.drawing.text('RELOAD PAGE', this.centerPoint.x, this.centerPoint.y);
                }
                break;
            case GameState.DONE:
                this.drawStats();
                this.drawGameState();
                if (this.player) {
                    this.drawing.text(this.player.name, this.centerPoint.x, this.centerPoint.y - 10, 'blue');
                    this.drawing.text(Game.langPlayerState[this.player.state], this.centerPoint.x,
                        this.centerPoint.y, 'blue');
                }
                break;
            case GameState.PLAY:
                this.drawGameState();
                this.drawing.statsText(this.player.name, this.drawing.maxX - 1,
                    this.drawing.canvasTopPadding / 2, 'black', 'right');
                this.drawStats();
                this.snake.draw();
                this.good.draw();
                break;
            default:
                break;
        }
    }

    private _startMovement(): void {
        debugger
        this.interval = setInterval(() => {
            this.tick();
        }, (this.app.config.relativeSpeed || 1000) / this.speed);
    }

    private _stopMovement(): void {
        clearInterval(this.interval);
    }

    private _randomInteger(min, max): number {
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }

    private _getRandomX(): number {
        return this._randomInteger(0, this.drawing.maxX);
    }

    private _getRandomY(): number {
        return this._randomInteger(0, this.drawing.maxY);
    }
}
