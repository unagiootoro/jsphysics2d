import { ICollisionShapeOption } from "./CollisionShape";
import { Polygon } from "./Polygon";
import { Vec2 } from "./Vec2";

export class Rect extends Polygon {
    private _size: Vec2;

    constructor(size: Vec2, opt: ICollisionShapeOption = {}) {
        const vertices = [
            new Vec2(-size.x / 2, -size.y / 2),
            new Vec2(size.x / 2, -size.y / 2),
            new Vec2(size.x / 2, size.y / 2),
            new Vec2(-size.x / 2, size.y / 2)
        ];
        super(vertices, opt);
        this._size = size;
    }

    get size() { return this._size; }

    calcInertia(mass: number): number {
        const lines = this.lines();
        const width = lines[0].vec.magnitude;
        const height = lines[1].vec.magnitude;
        return (1 / 12) * mass * (width ** 2 + height ** 2);
    }

    clone(): Rect {
        const rect = new Rect(this._size);
        rect.position = this.position;
        rect.angle = this.angle;
        rect.anchor = this.anchor;
        return rect;
    }
}
