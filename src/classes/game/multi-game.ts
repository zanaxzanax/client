import {
    AppMultiInterface,
    DrawingInterface,
    GameEvent,
    GameItem,
    MultiGameInterface,
    PlayerInterface,
    PointInterface,
    PointItem
} from '../../types';
import {Drawing} from '../drawing';
import Player from './player';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Game} from './game';
import {GameSide, GameState, PlayerState} from '../enums';
import Snake from './snake';
import GoodPoint from './good-point';

export class MultiGame extends Game implements MultiGameInterface {
    uuid: string;
    game: GameItem;
    player: PlayerInterface;
    opponent: PlayerInterface;
    drawingLeft: DrawingInterface;
    drawingRight: DrawingInterface;

    private curSide: GameSide;

    constructor(app: AppMultiInterface) {
        super(app);
        this.drawingLeft = app.drawingLeft;
        this.drawingRight = app.drawingRight;
    }

    get drawing(): DrawingInterface {
        switch (this.curSide) {
            case GameSide.LEFT:
                return this.drawingLeft;
            case GameSide.RIGHT:
                return this.drawingRight;
            default:
                break
        }
    }

    get curSidePlayer(): PlayerInterface {
        switch (this.curSide) {
            case GameSide.LEFT:
                return this.player;
            case GameSide.RIGHT:
                return this.opponent;
            default:
                break
        }
    }

    get curSideOpponent(): PlayerInterface {
        switch (this.curSide) {
            case GameSide.LEFT:
                return this.opponent;
            case GameSide.RIGHT:
                return this.player;
            default:
                break
        }
    }

    drawLeftSide() {
        this.curSide = GameSide.LEFT;
        this._redraw();
    }

    drawRightSide() {
        this.curSide = GameSide.RIGHT;
        this._redraw();
    }

    redraw(): void {
        this.drawLeftSide();
        this.drawRightSide();
    }

    initialize(game?: GameItem): boolean {
        if (!this.initialized) {
            this.updateGame(game);
            this._join(this.uuid);
            this.bindEvents(true);
            this.initialized = true;
        }
        return this.initialized;
    }

    updateGame(game: GameItem): void {
        // join
        console.log('updateGame', game);
        this.game = game;
        this.state = this.game.state;
        this.uuid = this.game.uuid;
        this._extractItems(game);
        this.redraw();
    }

    removeGame(): void {
        console.log('removeGame');
        this.game.state = GameState.DELETED;
        this.updateGame(this.game);
    }

    tick(events: GameEvent[]): void {
        this.processEvents(events);
    }

    addPivotPoint(data: PointItem): void {
        this.app.socket.socket.emit('pivot', _.extend({}, data, {uuid: this.uuid}));
    }

    private _extractItems(game: GameItem): void {
        const slots = game.slots;
        const snakes = game.snakes;
        this.player = null;
        this.opponent = null;
        this.snake = null;
        this.opponentSnake = null;
        slots.forEach((player: PlayerInterface) => {
            if (player.uuid === this.app.player.uuid) {
                this.player = new Player(player);
            } else {
                this.opponent = new Player(player);
            }
        });
        Object.keys(snakes).forEach((playerUUID: string) => {
            if (this.player && playerUUID === this.player.uuid) {
                this.snake = new Snake(this, snakes[playerUUID].points);
            } else {
                this.opponentSnake = new Snake(this, snakes[playerUUID].points);
            }
        });
    }

    private _isMainSide(): boolean {
        return this.curSide === GameSide.LEFT;
    }

    private _redraw(): void {

        this.drawing.clear();

        this.drawing.drawField();

        const centerPoint: PointInterface = this.drawing.center;
        const curSidePlayer: PlayerInterface = this.curSidePlayer;
        const curSideOpponent: PlayerInterface = this.curSideOpponent;

        switch (this.state) {
            case GameState.CREATED:
                console.log('GameState.CREATED');
                this.drawing.statsText('WAITING', centerPoint.x, Drawing.canvasTopPadding / 2, 'blue', 'center');
                if (this._isMainSide()) {
                    if (curSidePlayer) {
                        this.drawing.text(curSidePlayer.name, centerPoint.x, centerPoint.y - 10, 'blue');
                        if (!curSidePlayer.isReady()) {
                            this.drawing.drawButton(centerPoint.x, centerPoint.y, Drawing.canvasWidth / 2,
                                Drawing.canvasHeight / 10, 'READY', 'blue', (event: Event) => {
                                    this._ready();
                                });
                        } else {
                            this.drawing.text('READY', centerPoint.x, centerPoint.y);
                        }
                    } else {
                        this.drawing.text('RELOAD PAGE', centerPoint.x, centerPoint.y);
                    }
                } else {
                    if (curSidePlayer) {
                        this.drawing.text(curSidePlayer.name, centerPoint.x, centerPoint.y - 10, 'blue');
                        this.drawing.text(PlayerState[curSidePlayer.state], centerPoint.x, centerPoint.y);
                    } else {
                        this.drawing.text('WAITING', centerPoint.x, centerPoint.y);
                    }
                }
                break;
            case GameState.DONE:

                this._drawStats();

                this.drawing.statsText('GAME OVER', centerPoint.x, Drawing.canvasTopPadding / 2, 'blue', 'center');
                //this.drawing.statsText('PLAY', this.drawing.maxX - 1, Drawing.canvasTopPadding / 2, 'black', 'right');
                if (curSidePlayer) {
                    this.drawing.text(curSidePlayer.name, centerPoint.x, centerPoint.y - 10, 'blue');
                    let playerStateText: string = '';

                    if ((curSidePlayer.isWinner() && curSideOpponent.isWinner()) ||
                        (curSidePlayer.isLoser() && curSideOpponent.isLoser())) {
                        playerStateText = 'DRAW';
                    } else if (curSidePlayer.isLoser()) {
                        playerStateText = 'LOSER';
                    } else {
                        playerStateText = 'WINNER';
                    }

                    this.drawing.text(playerStateText, centerPoint.x, centerPoint.y, 'blue');
                }
                break;
            case GameState.DELETED:
                this.drawing.statsText('DELETED', centerPoint.x, Drawing.canvasTopPadding / 2, 'blue', 'center');
                // this.drawing.text('DELETED', centerPoint.x, centerPoint.y, 'blue');
                break;
            case GameState.PLAY:
                this.drawing.statsText('PLAY', centerPoint.x, Drawing.canvasTopPadding / 2, 'blue', 'center');
                this.drawing.statsText(curSidePlayer.name, this.drawing.maxX - 1, Drawing.canvasTopPadding / 2, 'black', 'right');
                this._drawStats();
                this._drawSnakes();
                this._drawGoods();

                break;
            default:
                break;
        }
    }

    private _join(uuid: string): void {
        console.log('_join', uuid)
        this.app.socket.socket.emit('join', uuid);
    }

    private _ready(): void {
        console.log('_ready')
        this.app.socket.socket.emit('ready', this.uuid);
    }

    private _drawTime(): void {
        const start: Moment = moment.utc(this.game.startTime);
        const now: Moment = moment.utc(this.game.now);
        this.drawing.statsText(`Time: ${moment.duration(now.diff(start), 'milliseconds')
            .format('mm:ss', {trim: false})}`, 1, Drawing.canvasTopPadding / 4 * 1);
    }

    private _drawSnakeInfo(): void {
        this.drawing.statsText(`Points: ${this.game.snakes[this.curSidePlayer.uuid].points.length}`, 1, Drawing.canvasTopPadding / 4 * 3);
    }

    private _drawStats(): void {

        this._drawTime();
        this._drawSnakeInfo();
    }

    private _drawSnakes(): void {
        new Snake(this, this.game.snakes[this.curSidePlayer.uuid].points).draw();
    }

    private _drawGoods(): void {
        new GoodPoint(this, this.game.goods[this.curSidePlayer.uuid]).draw();
    }
}
