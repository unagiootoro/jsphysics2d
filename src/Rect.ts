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

    clone(): Rect {
        const rect = new Rect(this._size);
        rect.position = this.position;
        rect.angle = this.angle;
        rect.anchor = this.anchor;
        return rect;
    }
}
