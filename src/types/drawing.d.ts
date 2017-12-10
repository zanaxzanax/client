import {AppInterface} from './app';
import {PointInterface} from './point';

export interface DrawElement {
    x: number;
    y: number;
    height: number;
    width: number;
    callback: (event: Event) => any;
}

export interface DrawingInterface {
    app: AppInterface;
    stepVertical: number;
    stepHorizontal: number;
    canvasContext: CanvasRenderingContext2D;
    initialized: boolean;
    elem: HTMLCanvasElement;
    maxX: number;
    maxY: number;
    centerX: number;
    centerY: number;
    center: PointInterface;
    initialize: (elem: HTMLCanvasElement) => boolean;
    prepareCanvas: () => void;
    statsText: (text: string, x: number, y: number, color?: string, align?: string) => void;
    text: (text: string, x: number, y: number, color?: string, align?: string) => void;
    clear: () => void;
    setText: (font: string) => void;
    setPen: (width: number, color?: string) => void;
    drawPointByCoordinates: (x: number, y: number, color?: string) => void;
    drawButton: (x: number, y: number, width: number, height: number, text: string, color: string, callback: any) => void;
    elements: DrawElement[];
    drawField: () => void;
}
