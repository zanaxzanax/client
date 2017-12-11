import {AppListInterface, GameItem} from '../../types';
import App from './app';
import {AppType} from '../enums';
import Socket from '../../socket';
import {SocketInterface} from '../../types/socket';

export default class AppList extends App implements AppListInterface {

    type: number = AppType.list;
    games: GameItem[] = [];
    socket: SocketInterface;

    initialize(elem: HTMLElement): Promise<boolean> {

        if (this.initialized) {
            return Promise.resolve(this.initialized);
        }

        this.socket = new Socket(this);

        return Promise.resolve()
            .then(() => super.initialize(elem))
            .then(() => this.socket.initialize())
            .catch((err) => {
                console.error(err);
                return false;
            });
    }

    onSocketConnect(arg: any): void {
        super.onSocketConnect(arg);
        this.refresh();
    }

    onSocketDisconnect(arg: any): void {
        super.onSocketDisconnect(arg);
        this.games.length = 0;
        this.drawGames();
    }

    refresh(): Promise<any> {
        return this.loadGames().then((games: GameItem[]) => {
            this.games = games;
            this.drawGames();
        });
    }

    removeGames(uuids: string[]): void {
        uuids.forEach((uuid: string) => {
            const founded: GameItem = this.games.find((game: GameItem) => game.uuid === uuid);
            if (founded) {
                this.games.splice(this.games.indexOf(founded), 1);
            }
        });
        this.drawGames();
    }

    addGame(options: GameItem): void {
        this.games.push(options);
        this.drawGames();
    }

    updateGames(games: GameItem[]): void {
        console.log('updateGames', games);
        this.games.forEach((game: GameItem, i: number) => {
            const founded = games.find((g: GameItem) => g.uuid === game.uuid);
            if (founded) {
                this.games.splice(i, 1, founded);
            }
        });
        this.drawGames();
    }

    loadGames(): Promise<GameItem[]> {
        return this.request(`/api/game`);
    }

    removeGame(uuid: string): Promise<Response> {
        return this.request(`/api/game/${uuid}`, {
            method: 'DELETE',
        });
    }

    getRowActions(game: GameItem): string {
        let result: string = '';
        if (this.player.uuid === game.creator.uuid) {
            result += `<button class="btn btn-link  btn-sm" onclick="appSnake.removeGame('${game.uuid}')">remove</button>`;
        }
        if (!this._isGameFull(game)) {
            result += `<a class="btn btn-primary btn-sm" href="/game/${game.uuid}">join</a>`;
        }
        return result;
    }

    getSlots(game: GameItem): string {
        return `[${game.slots.length}/${game.playersLimit}]`;
    }

    getGameRow(game: GameItem, i: number): string {
        let row: string = '';
        row += `<tr id="${game.uuid}">`;
        row += `<td>${i}</td>`;
        row += `<td>${game.name}</td>`;
        row += `<td>${this.getSlots(game)}</td>`;
        row += `<td>${this.getRowActions(game)}</td>`;
        row += `</tr>`;
        return row;
    }

    getTableHead(): string {
        return `
            <thead>
                <tr>
                  <th>#</th>
                  <th>Название</th>
                  <th>Слоты</th>
                  <th>Действия</th>
                </tr>
            </thead>`
    }

    getTableBody(): string {
        let body: string = `<tbody>`;
        body += this.games.map((game: GameItem, i: number) => this.getGameRow(game, i + 1)).join('');
        body += `</tbody>`;
        return body;
    }

    drawGames(): void {
        const container: HTMLElement = document.getElementById('games');
        let content: string = `<table class="table table-striped">`;
        content += this.getTableHead();
        content += this.getTableBody();
        content += `</table>`;
        container.innerHTML = content;
    }

    private _isGameFull(game: GameItem): boolean {
        return game.playersLimit === game.slots.length;
    }
}
