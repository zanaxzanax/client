import {Drawing} from '../drawing';
import {MultiGame} from '../game';
import App from './app';
import {AppMultiInterface, AppType, DrawingInterface, GameItem, MultiGameInterface} from '../../types';

export default class AppMulti extends App implements AppMultiInterface {

    type: AppType = AppType.multiplayer;
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
            .then(() => this._loadGameItem())
            .then((game: GameItem) => {
                if (game) {
                    this.drawingLeft.initialize(document.getElementById('fieldLeft') as HTMLCanvasElement);
                    this.drawingRight.initialize(document.getElementById('fieldRight') as HTMLCanvasElement);
                    this.game.initialize(game);
                    this.game.redraw();
                    return true;
                } else {
                    throw new Error('no game for page');
                }
            }).catch((err) => {
                console.error(err);
                return false;
            });
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
