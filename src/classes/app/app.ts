import {extend} from 'lodash';
import Player from '../game/player';
import {AppInterface, ConfigItem, PlayerInterface, SocketInterface} from '../../types';
import {SocketConnectStatus} from '../enums';

export default class App implements AppInterface {

    initialized: boolean = false;
    elem: HTMLElement;
    socketConnectStatus: number;
    player: PlayerInterface;
    socket: SocketInterface;
    config: ConfigItem;
    type: number;

    initialize(elem: HTMLElement): Promise<boolean> {

        if (this.initialized) {
            return Promise.resolve(this.initialized);
        }

        this.elem = elem;
        (window as any).appSnake = this;

        return Promise.resolve()
            .then(() => this._loadUser())
            .then((player: PlayerInterface) => this._setPlayer(player))
            .then(() => this._loadConfig())
            .then((config: ConfigItem) => this._setConfig(config))
            .then(() => true);
    }

    onSocketError(err: any): void {
        this.socketConnectStatus = SocketConnectStatus.error;
        this._toggleConnectInformerClass(true);
    }

    onSocketDisconnect(arg: any): void {
        this.socketConnectStatus = SocketConnectStatus.disconnected;
        this._toggleConnectInformerClass(false, true);
    }

    onSocketConnect(arg: any): void {
        this.socketConnectStatus = SocketConnectStatus.connected;
        this._toggleConnectInformerClass(false, false, true);
    }

    request(url: string, options?: object): Promise<any> {
        return fetch(url, extend({}, options, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        })).then((response: Response) => response.json());
    }

    getToken(): string {
        return this._getCookie('token');
    }

    getUUID(): string {
        const split: string[] = window.location.pathname.split('/');
        return split[split.length - 1];
    }

    private _loadUser(): Promise<PlayerInterface> {
        return this.request('/api/user').then((data: any) => new Player(data))
    }

    private _loadConfig(): Promise<ConfigItem> {
        return this.request('/api/config');
    }

    private _setPlayer(player: PlayerInterface): void {
        this.player = player;
    }

    private _setConfig(config: ConfigItem): void {
        this.config = config;
    }

    private _getCookie(cname) {
        const name: string = `${cname}=`;
        const decodedCookie: string = decodeURIComponent(document.cookie);
        const ca: string[] = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    private _toggleConnectInformerClass(error: boolean = false, warning: boolean = false, success: boolean = false) {
        const elem = document.getElementById('connect-informer');
        elem.classList.toggle('error', error);
        elem.classList.toggle('warning', warning);
        elem.classList.toggle('success', success);
    }
}
