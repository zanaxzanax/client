import * as _ from 'lodash';
import {AppInterface, AppType, PlayerInterface, SocketConnectStatus, SocketInterface} from '../../types';
import Socket from '../../socket';
import Player from '../game/player';

export default class App implements AppInterface {

    initialized: boolean = false;
    elem: HTMLElement;
    SocketConnectStatus: SocketConnectStatus;
    socket: SocketInterface;
    player: PlayerInterface;
    type: AppType;

    initialize(elem: HTMLElement): Promise<boolean> {

        if (this.initialized) {
            return Promise.resolve(this.initialized);
        }

        this.elem = elem;
        this.socket = new Socket(this);
        (window as any).appSnake = this;

        return Promise.resolve()
            .then(() => this.socket.initialize())
            .then(() => this._loadUser())
            .then((player: PlayerInterface) => {
                this._setPlayer(player);
                return true;
            });
    }

    onSocketError(err): void {
        this.SocketConnectStatus = SocketConnectStatus.error;
        this._toggleConnectInformerClass(true);
    }

    onSocketDisconnect(): void {
        this.SocketConnectStatus = SocketConnectStatus.disconnected;
        this._toggleConnectInformerClass(false, true);
    }

    onSocketConnect(): void {
        this.SocketConnectStatus = SocketConnectStatus.connected;
        this._toggleConnectInformerClass(false, false, true);
    }

    request(url: string, options?: object): Promise<any> {
        return fetch(url, _.extend({}, options, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        })).then((response: Response) => response.json());
    }

    getToken(): string {
        return this._getCookie('token');
    }

    private _loadUser(): Promise<PlayerInterface> {
        return this.request('/api/user').then((data: any) => new Player(data))
    }

    private _setPlayer(userData: any): void {
        this.player = new Player(userData);
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
