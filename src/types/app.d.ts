import {PlayerInterface} from './player';
import {SocketInterface} from './socket';
import {GameItem, MultiGameInterface, SingleGameInterface} from './game';
import {DrawingInterface} from './drawing';

export interface AppInterface {
    initialized: boolean;
    elem: HTMLElement;
    SocketConnectStatus: number;
    socket: SocketInterface;
    player: PlayerInterface;
    type: number;
    initialize: (elem: HTMLElement) => Promise<boolean>;
    onSocketError: (err) => void;
    onSocketDisconnect: (arg) => void;
    onSocketConnect: (arg) => void;
    request: (url: string, options?: object) => Promise<any>;
    getToken: () => string;
}

export interface AppListInterface extends AppInterface {
    games: GameItem[];
    removeGames: (uuids: string[]) => void;
    addGame: (options: GameItem) => void;
    loadGames: () => Promise<GameItem[]>;
    removeGame: (uuid: string) => Promise<Response>;
    getRowActions: (game: GameItem) => string;
    getGameRow: (game: GameItem, i: number) => string;
    getTableHead: () => string;
    getTableBody: () => string;
    drawGames: () => void;
    updateGames: (games: GameItem[]) => void;
}

export interface AppMultiInterface extends AppInterface {
    drawingLeft: DrawingInterface;
    drawingRight: DrawingInterface;
    game: MultiGameInterface;
    updateGames: (games: GameItem[]) => void;
    removeGames: (uuids: string[]) => void;
}

export interface AppSingleInterface extends AppInterface {
    drawing: DrawingInterface;
    game: SingleGameInterface;
}
