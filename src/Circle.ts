import { AABB } from "./AABB";
import { CollisionShape, ICollisionShapeOption } from "./CollisionShape";
import { Vec2 } from "./Vec2";
import { EPSILON } from "./utils";

export class Circle extends CollisionShape {
    private _radius: number;

    get radius() { return this._radius; }
    get diameter() { return this._radius * 2; }

    constructor(radius: number, opt: ICollisionShapeOption = {}) {
        super(opt);
        this._radius = radius;
    }

    worldPosition(): Vec2 {
        const diff = this.anchor.neg(); // Difference from centroid (0, 0)
        return this.position.add(diff.rotate(diff.rad + this.angle));
    }

    toAABB(): AABB {
        return new AABB(this.worldPosition().sub(this._radius), new Vec2(this.diameter, this.diameter));
    }

    checkCollidePoint(point: Vec2): boolean {
        return this.worldPosition().sub(point).length < this.radius - EPSILON;
    }

    clone(): Circle {
        const circle = new Circle(this._radius);
        circle.position = this.position;
        circle.angle = this.angle;
        circle.anchor = this.anchor;
        return circle;
    }
}
