export interface PlayerItem {
    name: string;
    uuid: string;
    state: number;
}

export interface PlayerInterface {
    name: string;
    uuid: string;
    state: number;
    isReady: () => boolean;
    isLoser: () => boolean;
    isWinner: () => boolean;
}
