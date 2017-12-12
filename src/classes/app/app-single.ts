import {AppSingleInterface, DrawingInterface, GameSingleItem, SingleGameInterface} from '../../types';
import App from './app';
import {Drawing} from '../drawing';
import {SingleGame} from '../game';
import {AppType} from '../enums';

export default class AppSingle extends App implements AppSingleInterface {

    type: number = AppType.single;
    drawing: DrawingInterface;
    game: SingleGameInterface;

    initialize(elem: HTMLElement): Promise<boolean> {

        if (this.initialized) {
            return Promise.resolve(this.initialized);
        }

        this.drawing = new Drawing(this);
        this.game = new SingleGame(this);

        return Promise.resolve()
            .then(() => super.initialize(elem))
            .then(() => this._loadGameItem())
            .then((game: GameSingleItem) => {
                this.drawing.initialize(document.getElementById('field') as HTMLCanvasElement);
                this.game.initialize(game);
                return true;
            }).catch((err) => {
                console.error(err);
                return false;
            });
    }

    private _loadGameItem(): Promise<GameSingleItem> {
        return this.request(`/api/game/${this.getUUID()}`);
    }
}
