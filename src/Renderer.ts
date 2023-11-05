import { Circle } from "./Circle";
import { CollisionObject } from "./CollisionObject";
import { Line } from "./Line";
import { Polygon } from "./Polygon";
import { Vec2 } from "./Vec2";
import { World } from "./World";

export interface IRendererOption {
    font?: string;
    backgroundStyle?: string;
    pixelPerMeter?: number;
}

export class Renderer {
    private _world: World;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _backgroundStyle: string;
    private _logs: { [key: string]: any } = {};
    private _pixelPerMeter: number;

    constructor(world: World, canvas: HTMLCanvasElement, opt: IRendererOption = {}) {
        this._world = world;
        this._canvas = canvas;
        this._context = canvas.getContext("2d")!;
        this._context.font = opt.font ?? "16px sans-serif";
        this._backgroundStyle = opt.backgroundStyle ?? "#000000ff";
        this._pixelPerMeter = opt.pixelPerMeter ?? 32;
    }

    get logs() { return this._logs; }
    get pixelPerMeter() { return this._pixelPerMeter; }

    render(): void {
        this._context.fillStyle = this._backgroundStyle;
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        for (const object of this._world.objects) {
            this._renderObject(object);
        }
        this._renderLogs();
    }

    private _renderObject(object: CollisionObject): void {
        if (object.meta.invisible) return;
        const shape = object.shape;
        const fillStyle: string = object.meta.fillStyle ?? "#00000000";
        const strokeStyle: string = object.meta.strokeStyle ?? "#ffffffff";
        if (shape instanceof Circle) {
            this._renderCircle(shape, fillStyle, strokeStyle);
        } else if (shape instanceof Line) {
            this._renderLine(shape, fillStyle, strokeStyle);
        } else if (shape instanceof Polygon) {
            this._renderPolygon(shape, fillStyle, strokeStyle);
        }
    }

    private _renderCircle(circle: Circle, fillStyle: string, strokeStyle: string): void {
        this._context.beginPath();
        this._context.lineWidth = 2;
        this._context.fillStyle = fillStyle;
        this._context.strokeStyle = strokeStyle;
        const worldPosition = circle.position;
        if (!worldPosition) return;
        this._context.arc(
            worldPosition.x * this._pixelPerMeter,
            worldPosition.y * this._pixelPerMeter,
            circle.radius * this._pixelPerMeter,
            0,
            Math.PI * 2
        );
        this._context.fill();
        this._context.stroke();
        this._context.closePath();
        this._context.strokeStyle = strokeStyle;
        this._context.beginPath();
        this._context.moveTo(worldPosition.x * this._pixelPerMeter, worldPosition.y * this._pixelPerMeter);
        const lineVec = Vec2.polar(circle.angle, circle.radius);
        this._context.lineTo((worldPosition.x + lineVec.x) * this._pixelPerMeter, (worldPosition.y + lineVec.y) * this._pixelPerMeter);
        this._context.stroke();
        this._context.closePath();
    }

    private _renderPolygon(polygon: Polygon, fillStyle: string, strokeStyle: string): void {
        this._context.beginPath();
        this._context.lineWidth = 2;
        this._context.fillStyle = fillStyle;
        this._context.strokeStyle = strokeStyle;
        const vertices = polygon.worldVertices();
        this._context.moveTo(vertices[0].x * this._pixelPerMeter, vertices[0].y * this._pixelPerMeter);
        for (let i = 1; i < vertices.length; i++) {
            this._context.lineTo(vertices[i].x * this._pixelPerMeter, vertices[i].y * this._pixelPerMeter);
        }
        this._context.lineTo(vertices[0].x * this._pixelPerMeter, vertices[0].y * this._pixelPerMeter);
        this._context.fill();
        this._context.stroke();
    }

    private _renderLine(line: Line, fillStyle: string, strokeStyle: string): void {
        this._context.beginPath();
        this._context.lineWidth = 2;
        this._context.fillStyle = fillStyle;
        this._context.strokeStyle = strokeStyle;
        const vertices = line.worldVertices();
        this._context.moveTo(vertices[0].x * this._pixelPerMeter, vertices[0].y * this._pixelPerMeter);
        for (let i = 1; i < vertices.length; i++) {
            this._context.lineTo(vertices[i].x * this._pixelPerMeter, vertices[i].y * this._pixelPerMeter);
        }
        this._context.lineTo(vertices[0].x * this._pixelPerMeter, vertices[0].y * this._pixelPerMeter);
        this._context.fill();
        this._context.stroke();
    }

    private _renderLogs(): void {
        let offsetY = 16;
        for (const key in this._logs) {
            if (this._logs[key] === undefined) continue;
            const text = `${key}: ${this._valueToText(this._logs[key])}`;
            this._context.fillStyle = "#ffffffff";
            this._context.fillText(text, 0, offsetY);
            offsetY += 16;
        }
    }

    private _valueToText(value: any): string {
        if (value instanceof Vec2) {
            return JSON.stringify([value.x, value.y]);
        }
        return value.toString();
    }
}
