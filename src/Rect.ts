import { ICollisionShapeOption } from "./CollisionShape";
import { Polygon } from "./Polygon";
import { Vec2 } from "./Vec2";

export class Rect extends Polygon {
    constructor(size: Vec2, opt: ICollisionShapeOption = {}) {
        const vertices = [
            new Vec2(-size.x / 2, -size.y / 2),
            new Vec2(size.x / 2, -size.y / 2),
            new Vec2(size.x / 2, size.y / 2),
            new Vec2(-size.x / 2, size.y / 2)
        ];
        super(vertices, opt);
    }
}
