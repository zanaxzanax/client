
export enum AppType {
    list,
    single,
    multiplayer
}


export enum PivotPointType {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export enum GameState {
    CREATED, PLAY, WIN, LOSE, DELETED
}

export enum GameTypes {
    SINGLE, MULTIPLAYER
}

export enum GameEventType {
    PIVOT, TICK
}

export enum GameSide {
    LEFT, RIGHT
}

export enum PlayerState {
    NOT_READY, READY
}
