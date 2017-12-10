import io from 'socket.io-client';
import {AppInterface, AppListInterface, GameItem, SocketInterface} from './types';
import {AppType} from './classes/enums';

export default class Socket implements SocketInterface {

    initialized: boolean;
    socket: any;

    constructor(public app: AppInterface) {

    }

    initialize(): Promise<boolean> {

        if (this.initialized) {
            return Promise.resolve(this.initialized);
        }

        this.socket = io(`/?token=${this.app.getToken()}`, {
            transports: ['polling']
        });

        this.socket.on('connect', this.app.onSocketConnect.bind(this.app));

        this.socket.on('disconnect', this.app.onSocketDisconnect.bind(this.app));

        this.socket.on('error', this.app.onSocketError.bind(this.app));

        this.socket.on('reconnect', (arg) => {
            console.log('reconnect', arg);
        });
        this.socket.on('reconnect_attempt', (arg) => {
            console.log('reconnect_attempt', arg);
        });
        this.socket.on('reconnecting', (arg) => {
            console.log('reconnecting', arg);
        });
        this.socket.on('reconnect_error', (arg) => {
            console.log('reconnect_error', arg);
        });
        this.socket.on('reconnect_failed', (arg) => {
            console.log('reconnect_failed', arg);
        });

        this.socket.on('games:remove', (uuids: string[]) => {
            (this.app as any).removeGames(uuids);
        });

        this.socket.on('games:add', (game: GameItem) => {
            switch (this.app.type) {
                case  AppType.list:
                    (this.app as AppListInterface).addGame(game);
                    break;
                default:
                    break;
            }
        });

        this.socket.on('games:update', (games: GameItem[]) => {
            (this.app as any).updateGames(games);
        });

        this.initialized = true;

        return Promise.resolve(this.initialized);
    }
}
