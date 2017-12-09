import {AppInterface, DrawElement, DrawingInterface, PointInterface} from '../../types';
import Point from '../game/point';

export class Drawing implements DrawingInterface {

    static canvasBgColor: string = 'white';

    static canvasHeight: number = 500;
    static canvasWidth: number = 500;

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
        return Drawing.canvasResolutionWidth;
    }

    get maxY(): number {
        return Drawing.canvasResolutionHeight;
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
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(x * this.stepHorizontal - width / 2, y * this.stepVertical - height / 2, width, height);
        this.text(text, x, y);
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
        this.stepVertical = (Drawing.canvasHeight / Drawing.canvasResolutionHeight);

        this.setText('10px Arial');
        this.canvasContext.textAlign = 'center';
        this.canvasContext.textBaseline = 'middle';
    }

    text(text: string, x: number, y: number, color?: string): void {
        this.canvasContext.fillStyle = color || 'black';
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

    drawCells(): void {
        const stepCountVertical: number = Drawing.canvasWidth / this.stepHorizontal;
        const stepCountHorizontal: number = Drawing.canvasHeight / this.stepVertical;
        this.setPen(1);
        for (let i = 1; i < stepCountVertical; i++) {
            this.drawLine(i * this.stepHorizontal, 0, i * this.stepHorizontal, Drawing.canvasHeight);
        }
        for (let i = 1; i < stepCountHorizontal; i++) {
            this.drawLine(0, i * this.stepVertical, Drawing.canvasWidth, i * this.stepVertical);
        }
    }

    drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(fromX, fromY);
        this.canvasContext.lineTo(toX, toY);
        this.canvasContext.stroke();
    }

    drawPointByCoordinates(x: number, y: number, color?: string): void {
        if (color) {
            this.canvasContext.fillStyle = color;
        }
        x *= this.stepHorizontal;
        y *= this.stepVertical;
        this.drawPoint(x, y, this.stepHorizontal, this.stepVertical);
    }

    removePointByCoordinates(x: number, y: number): void {
        x *= this.stepHorizontal;
        y *= this.stepVertical;
        this.canvasContext.fillStyle = Drawing.canvasBgColor;
        this.drawPoint(x, y, this.stepHorizontal, this.stepVertical);
    }

    drawPoint(fromX: number, fromY: number, width: number, height: number): void {
        this.canvasContext.fillRect(fromX, fromY, width, height);
        // this.canvasContext.fill();
    }

    clearPoint(fromX: number, fromY: number, width: number, height: number): void {
        this.canvasContext.clearRect(fromX, fromY, width, height);
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
