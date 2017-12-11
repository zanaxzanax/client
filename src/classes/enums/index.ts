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

export enum SocketConnectStatus {
    connected,
    error,
    disconnected
}

export enum GameState {
    CREATED, PLAY, DONE, DELETED
}

export enum GameEventType {
    PIVOT, TICK
}

export enum GameRule {
    WALL_THROW, SIMPLE
}

export enum GameSide {
    LEFT, RIGHT
}

export enum PlayerState {
    NOT_READY, READY, WINNER, LOSER, DRAW
}

