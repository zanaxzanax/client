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

        this.socket.on('game:tick', (events: any[]) => {
            switch (this.app.type) {
                case  AppType.multiplayer:
                    (this.app as any).game.tick(events);
                    break;
                default:
                    break;
            }
        });

        this.initialized = true;

        return Promise.resolve(this.initialized);
    }
}
