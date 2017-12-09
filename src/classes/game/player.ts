import {PlayerInterface} from '../../types';
import {PlayerState} from '../enums';

export default class Player implements PlayerInterface {

    name: string;
    uuid: string;
    state: number = PlayerState.NOT_READY;

    constructor(options: any) {
        this.name = options.name;
        this.uuid = options.uuid;
    }

    isReady(): boolean {
        return this.state === PlayerState.READY;
    }

}
