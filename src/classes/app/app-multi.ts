import {Drawing} from '../drawing';
import {MultiGame} from '../game';
import App from './app';
import {AppMultiInterface, DrawingInterface, GameItem, MultiGameInterface} from '../../types';
import {AppType} from '../enums';

export default class AppMulti extends App implements AppMultiInterface {

    type: number = AppType.multiplayer;
    drawingLeft: DrawingInterface;
    drawingRight: DrawingInterface;
    game: MultiGameInterface;

    initialize(elem: HTMLElement): Promise<boolean> {

        if (this.initialized) {
            return Promise.resolve(this.initialized);
        }

        this.drawingLeft = new Drawing(this);
        this.drawingRight = new Drawing(this);
        this.game = new MultiGame(this);

        return Promise.resolve()
            .then(() => super.initialize(elem))
            .then(() => {
                this.drawingLeft.initialize(document.getElementById('fieldLeft') as HTMLCanvasElement);
                this.drawingRight.initialize(document.getElementById('fieldRight') as HTMLCanvasElement);
                return true;
            }).catch((err) => {
                console.error(err);
                return false;
            });
    }

    onSocketConnect(arg: any): void {
        super.onSocketConnect(arg);
        this._loadGameItem().then((game: GameItem) => this.game.initialize(game));
    }

    onSocketDisconnect(arg: any): void {
        super.onSocketDisconnect(arg);

    }

    updateGames(games: GameItem[]): void {
        const founded: GameItem = games.find((game: GameItem) => game.uuid === this.game.uuid);
        if (founded) {
            this.game.updateGame(founded);
        }
    }

    removeGames(uuids: string[]): void {
        if (uuids.indexOf(this.game.uuid) > -1) {
            this.game.removeGame();
        }
    }

    private _getUUID(): string {
        const split: string[] = window.location.pathname.split('/');
        return split[split.length - 1];
    }

    private _loadGameItem(): Promise<GameItem> {
        return this.request(`/api/game/${this._getUUID()}`);
    }
}
