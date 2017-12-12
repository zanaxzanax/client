import {
    AppInterface,
    DrawingInterface,
    GameInterface,
    PlayerInterface,
    PointInterface,
    PointItem,
    SnakeInterface
} from '../../types';
import {GameState, PivotPointType, PlayerState} from '../enums';
import * as moment from 'moment';
import {Moment} from 'moment';

export class Game implements GameInterface {

    static langPlayerState: { [key: number]: string } = {
        [PlayerState.NOT_READY]: 'НЕ ГОТОВ',
        [PlayerState.READY]: 'ГОТОВ',
        [PlayerState.WINNER]: 'ВЫИГРАЛ',
        [PlayerState.LOSER]: 'ПРОИГРАЛ',
        [PlayerState.DRAW]: 'НИЧЬЯ',
    };

    static langGameState: { [key: number]: string } = {
        [GameState.CREATED]: 'ОЖИДАНИЕ',
        [GameState.DONE]: 'ИГРА ЗАКОНЧЕНА',
        [GameState.PLAY]: 'В ПРОЦЕССЕ',
        [GameState.DELETED]: 'ИГРА УДАЛЕНА',
    };

    static langOther: { [key: string]: string } = {
        WAITING: 'ОЖИДАНИЕ',
        ERROR: 'ОБНОВИТЕ СТРАНИЦУ'
    };

    uuid: string;
    state: number = GameState.CREATED;
    drawing: DrawingInterface;
    player: PlayerInterface;
    app: any;
    game: any;
    interval: any;
    keyPressHandler: any;
    initialized: boolean;
    snake: SnakeInterface;

    constructor(app: AppInterface) {
        this.app = app;
        this.keyPressHandler = this._onKeyPress.bind(this);
    }

    get centerPoint(): PointInterface {
        return this.drawing.center;
    }

    initialize(game?: any): boolean {
        return true;
    }

    ready(): void {
        //
    }

    redraw(): void {
        //
    }

    drawGameState(): void {
        this.drawing.statsText(Game.langGameState[this.state], this.centerPoint.x,
            this.drawing.canvasTopPadding / 2, 'blue', 'center');
    }

    addPivotPoint(data: PointItem) {
        //
    }

    drawTime(): void {
        const start: Moment = moment.utc(this.game.startTime);
        const now: Moment = moment.utc(this.game.now);
        this.drawing.statsText(`Time: ${moment.duration(now.diff(start), 'milliseconds')
            .format('mm:ss', {trim: false})}`, 1, this.drawing.canvasTopPadding / 4);
    }

    drawSnakeInfo(): void {
        this.drawing.statsText(`Points: ${this.snake.points.length}`, 1, this.drawing.canvasTopPadding / 4 * 3);
    }

    drawSpeed(): void {
        this.drawing.statsText(`Speed: ${this.game.speed}`, 1, this.drawing.canvasTopPadding / 4 * 2);
    }

    drawStats(): void {
        this.drawTime();
        this.drawSnakeInfo();
        this.drawSpeed();
    }

    bindEvents(bool: boolean) {
        if (bool) {
            this.bindEvents(false);
            document.addEventListener('keydown', this.keyPressHandler, false);
        } else {
            document.removeEventListener('keydown', this.keyPressHandler);
        }
    }

    private _onKeyPress(event: KeyboardEvent) {

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
}
