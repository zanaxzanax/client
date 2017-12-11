import {
    AppMultiInterface,
    DrawingInterface,
    GameItem,
    MultiGameInterface,
    PlayerInterface,
    PointItem,
    SnakeInterface
} from '../../types';
import {Drawing} from '../drawing';
import Player from './player';
import * as _ from 'lodash';
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
    opponentSnake: SnakeInterface;

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

    ready(): void {
        this.app.socket.socket.emit('ready', this.uuid);
    }

    addPivotPoint(data: PointItem): void {
        if (this.game.state === GameState.PLAY) {
            this.app.socket.socket.emit('pivot', _.extend({}, data, {uuid: this.uuid}));
        }
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

        const curSidePlayer: PlayerInterface = this.curSidePlayer;
        const curSideOpponent: PlayerInterface = this.curSideOpponent;

        switch (this.state) {
            case GameState.CREATED:
                this.drawGameState();
                if (this._isMainSide()) {
                    if (curSidePlayer) {
                        this.drawing.text(curSidePlayer.name, this.centerPoint.x, this.centerPoint.y - 10, 'blue');
                        if (!curSidePlayer.isReady()) {
                            this.drawing.drawButton(this.centerPoint.x, this.centerPoint.y, this.drawing.canvasWidth / 2,
                                this.drawing.canvasHeight / 10, Game.langPlayerState[PlayerState.READY], 'blue',
                                (event: Event) => this.ready());
                        } else {
                            this.drawing.text(Game.langPlayerState[PlayerState.READY],
                                this.centerPoint.x, this.centerPoint.y);
                        }
                    } else {
                        this.drawing.text('RELOAD PAGE', this.centerPoint.x, this.centerPoint.y);
                    }
                } else {
                    if (curSidePlayer) {
                        this.drawing.text(curSidePlayer.name, this.centerPoint.x, this.centerPoint.y - 10, 'blue');
                        this.drawing.text(PlayerState[curSidePlayer.state], this.centerPoint.x, this.centerPoint.y);
                    } else {
                        this.drawing.text('WAITING', this.centerPoint.x, this.centerPoint.y);
                    }
                }
                break;
            case GameState.DONE:
                this.drawStats();
                this.drawGameState();
                if (curSidePlayer) {
                    this.drawing.text(curSidePlayer.name, this.centerPoint.x, this.centerPoint.y - 10, 'blue');
                    let playerStateText: string = '';
                    if ((curSidePlayer.isWinner() && curSideOpponent.isWinner()) ||
                        (curSidePlayer.isLoser() && curSideOpponent.isLoser())) {
                        playerStateText = Game.langPlayerState[PlayerState.DRAW];
                    } else if (curSidePlayer.isLoser()) {
                        playerStateText = Game.langPlayerState[PlayerState.LOSER];
                    } else {
                        playerStateText = Game.langPlayerState[PlayerState.WINNER];
                    }
                    this.drawing.text(playerStateText, this.centerPoint.x, this.centerPoint.y, 'blue');
                }
                break;
            case GameState.DELETED:
                this.drawGameState();
                break;
            case GameState.PLAY:
                this.drawGameState();
                this.drawing.statsText(curSidePlayer.name, this.drawing.maxX - 1,
                    this.drawing.canvasTopPadding / 2, 'black', 'right');
                this.drawStats();
                this._drawSnake();
                this._drawGood();
                break;
            default:
                break;
        }
    }

    private _join(uuid: string): void {
        this.app.socket.socket.emit('join', uuid);
    }

    private _drawSnake(): void {
        new Snake(this, this.game.snakes[this.curSidePlayer.uuid].points).draw();
    }

    private _drawGood(): void {
        new GoodPoint(this, this.game.goods[this.curSidePlayer.uuid]).draw();
    }
}
