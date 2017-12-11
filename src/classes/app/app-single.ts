import {AppInterface, AppSingleInterface, DrawingInterface, SingleGameInterface} from '../../types';
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
            .then(() => {
                this.drawing.initialize(document.getElementById('field') as HTMLCanvasElement);
                this.game.initialize();
                return true;
            }).catch((err) => {
                console.error(err);
                return false;
            });
    }
}
