import {PlayerInterface} from './player';
import {SocketInterface} from './socket';
import {GameItem, MultiGameInterface, SingleGameInterface} from './game';
import {DrawingInterface} from './drawing';
import {ConfigItem} from './config';

export interface AppInterface {
    initialized: boolean;
    config: ConfigItem,
    elem: HTMLElement;
    socket: SocketInterface;
    socketConnectStatus: number;
    player: PlayerInterface;
    type: number;
    initialize: (elem: HTMLElement) => Promise<boolean>;
    onSocketError: (err) => void;
    onSocketDisconnect: (arg) => void;
    onSocketConnect: (arg) => void;
    request: (url: string, options?: object) => Promise<any>;
    getToken: () => string;
    getUUID: () => string;
}

export interface AppListInterface extends AppInterface {
    games: GameItem[];
    removeGames: (uuids: string[]) => void;
    addGame: (options: GameItem) => void;
    removeGame: (uuid: string) => Promise<Response>;
    updateGames: (games: GameItem[]) => void;
}

export interface AppMultiInterface extends AppInterface {
    drawingLeft: DrawingInterface;
    drawingRight: DrawingInterface;
    socket: SocketInterface;
    game: MultiGameInterface;
    updateGames: (games: GameItem[]) => void;
    removeGames: (uuids: string[]) => void;
}

export interface AppSingleInterface extends AppInterface {
    drawing: DrawingInterface;
    game: SingleGameInterface;
}
