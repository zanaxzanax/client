import {AppInterface, DrawElement, DrawingInterface, PointInterface} from '../../types';
import Point from '../game/point';

export class Drawing implements DrawingInterface {

    static canvasBgColor: string = 'white';

    static canvasHeight: number = 500;
    static canvasWidth: number = 500;

    static canvasTopPadding: number = 10;
    static canvasResolutionHeight: number = 100;
    static canvasResolutionWidth: number = 100;

    stepVertical: number;
    stepHorizontal: number;

    canvasContext: CanvasRenderingContext2D;
    initialized: boolean;
    elem: HTMLCanvasElement;
    elements: DrawElement[] = [];

    constructor(public  app: AppInterface) {

    }

    get maxX(): number {
        return Drawing.canvasResolutionWidth - 1;
    }

    get maxY(): number {
        return Drawing.canvasResolutionHeight - 1;
    }

    get centerX(): number {
        return Math.round(Drawing.canvasResolutionWidth / 2);
    }

    get centerY(): number {
        return Math.round(Drawing.canvasResolutionHeight / 2);
    }

    get center(): PointInterface {
        return new Point(this.centerX, this.centerY);
    }

    initialize(elem: HTMLCanvasElement): boolean {
        if (!this.initialized) {
            this.elem = elem;
            this.prepareCanvas();
            this._bindEvents();
            this.initialized = true;
        }
        return this.initialized;
    }

    drawButton(x: number, y: number, width: number, height: number, text: string, color: string, callback: any): void {
        y += Drawing.canvasTopPadding;
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(x * this.stepHorizontal - width / 2,
            y * this.stepVertical - height / 2, width, height);
        this.text(text, x, y - 10);
        this.elements.push({
            x: x * this.stepHorizontal - width / 2,
            y: y * this.stepVertical - height / 2,
            height,
            width,
            callback
        });
    }

    prepareCanvas(): void {
        const canvasElem: HTMLCanvasElement = this.elem;
        canvasElem.setAttribute('height', `${Drawing.canvasHeight}px`);
        canvasElem.setAttribute('width', `${Drawing.canvasWidth}px`);

        this.canvasContext = canvasElem.getContext('2d');
        this.canvasContext.fillStyle = Drawing.canvasBgColor;
        this.canvasContext.fillRect(0, 0, Drawing.canvasWidth, Drawing.canvasHeight);

        this.stepHorizontal = (Drawing.canvasWidth / Drawing.canvasResolutionWidth);
        this.stepVertical = (Drawing.canvasHeight / (Drawing.canvasResolutionHeight + Drawing.canvasTopPadding));

        this.setText('10px Arial');
        this.canvasContext.textAlign = 'center';
        this.canvasContext.textBaseline = 'middle';
    }

    statsText(text: string, x: number, y: number, color?: string, align?: string): void {
        y -= Drawing.canvasTopPadding;
        this.text(text, x, y, color, align || 'left');
    }

    text(text: string, x: number, y: number, color?: string, align?: string): void {
        y += Drawing.canvasTopPadding;
        this.canvasContext.fillStyle = color || 'black';
        this.canvasContext.textAlign = align || 'center';
        this.canvasContext.fillText(text, x * this.stepHorizontal, y * this.stepVertical);
    }

    clear(): void {
        this.elements.length = 0;
        this.canvasContext.clearRect(0, 0, Drawing.canvasWidth, Drawing.canvasHeight);
    }

    setText(font: string): void {
        this.canvasContext.font = font;
    }

    setPen(width: number, color?: string): void {
        this.canvasContext.lineWidth = width;
        if (color) {
            this.canvasContext.strokeStyle = color;
        }
    }

    drawPointByCoordinates(x: number, y: number, color?: string): void {
        y += Drawing.canvasTopPadding;
        if (color) {
            this.canvasContext.fillStyle = color;
        }
        x *= this.stepHorizontal;
        y *= this.stepVertical;
        this._drawPoint(x, y, this.stepHorizontal, this.stepVertical);
    }

    drawField(): void {
        this._drawBorders();
        this._drawDelimiter();
    }

    private _drawPoint(fromX: number, fromY: number, width: number, height: number): void {
        this.canvasContext.fillRect(fromX, fromY, width, height);
    }

    private _drawDelimiter(): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, Drawing.canvasTopPadding * this.stepVertical);
        this.canvasContext.lineTo(Drawing.canvasResolutionHeight * this.stepHorizontal,
            Drawing.canvasTopPadding * this.stepVertical);
        this.canvasContext.stroke();
    }

    private _drawBorders(): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 0);
        this.canvasContext.lineTo(Drawing.canvasResolutionWidth * this.stepHorizontal, 0);
        this.canvasContext.lineTo(Drawing.canvasResolutionWidth * this.stepHorizontal,
            (Drawing.canvasResolutionHeight + Drawing.canvasTopPadding) * this.stepVertical);
        this.canvasContext.lineTo(0, (Drawing.canvasResolutionHeight + Drawing.canvasTopPadding) * this.stepVertical);
        this.canvasContext.closePath();
        this.canvasContext.stroke();
    }

    private _bindEvents() {
        this.elem.addEventListener('click', (event: MouseEvent) => {
            const rect: ClientRect = this.elem.getBoundingClientRect();
            const x: number = event.pageX - rect.left;
            const y: number = event.pageY - rect.top;

            this.elements.forEach((element: DrawElement) => {
                // console.log('x', x);
                // console.log('y', y);
                // console.log('element.x', element.x, '-', element.x + element.width);
                // console.log('element.y', element.y, '-', element.y + element.height);

                if (y > element.y && y < element.y + element.height
                    && x > element.x && x < element.x + element.width) {
                    event.preventDefault();
                    element.callback(event);
                }
            });

        }, false);
    }
}
