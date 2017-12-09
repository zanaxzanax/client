
export interface SocketInterface {
    initialized: boolean;
    socket: any;
    initialize: () => Promise<boolean>;
}
