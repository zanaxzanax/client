import {
    AppMultiInterface,
    DrawingInterface,
    GameEvent,
    GameItem,
    MultiGameInterface,
    PivotPointEventData,
    PlayerInterface,
    PointInterface
} from '../../types';
import PivotPoint from './pivot-point';
import {Drawing} from '../drawing';
import Player from './player';
import * as _ from 'lodash';
import {Game} from './game';
import {GameSide, GameState} from '../enums';

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
            this.initialized = true;
        }
        return this.initialized;
    }

    updateGame(game: GameItem): void {
        // join
        console.log('updateGame');
        this.game = game;
        this.uuid = this.game.uuid;
        this._extractPlayers(game);
        this.redraw();
    }

    removeGame(): void {
        this.game.state = GameState.DELETED;
        this.redraw();
    }

    tick(events: GameEvent[]): void {
        this.processEvents(events);
    }

    addPivotPoint(data: PivotPointEventData): void {
        this.app.socket.socket.emit('pivot', _.extend({}, data, {uuid: this.uuid}));
    }

    private _extractPlayers(game: GameItem): void {
        const slots = game.slots;
        this.player = null;
        this.opponent = null;
        slots.forEach((player: PlayerInterface) => {
            if (player.uuid === this.app.player.uuid) {
                this.player = new Player(player);
            } else {
                this.opponent = new Player(player);
            }
        });
    }

    private _drawPlayers() {
        const centerPoint: PointInterface = this.drawing.center;
        const curSidePlayer: PlayerInterface = this.curSidePlayer;
        if (curSidePlayer) {
            this.drawing.text(this.curSidePlayer.name, centerPoint.x, centerPoint.y - 10, 'blue');
        }
    }

    private _isMainSide(): boolean {
        return this.curSide === GameSide.LEFT;
    }

    private _redraw(): void {

        this.drawing.clear();

        switch (this.state) {
            case GameState.CREATED:
                console.log('GameState.CREATED');
                const centerPoint: PointInterface = this.drawing.center;
                if (this._isMainSide()) {
                    if (!this.player.isReady()) {
                        this.drawing.drawButton(centerPoint.x, centerPoint.y, Drawing.canvasWidth / 2,
                            Drawing.canvasHeight / 10, 'READY', 'blue', (event: Event) => {
                                this._ready();
                            });
                    } else {
                        this.drawing.text('READY', centerPoint.x, centerPoint.y);
                    }
                }
                this._drawPlayers();
                break;
            case GameState.WIN:
                break;
            case GameState.LOSE:
                break;
            case GameState.DELETED:
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

    private _join(uuid: string): void {
        console.log('_join', uuid)
        this.app.socket.socket.emit('join', uuid);
    }

    private _ready(): void {
        this.app.socket.socket.emit('ready', this.uuid);
    }

}
