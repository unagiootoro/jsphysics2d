import { AABB } from "./AABB";
import { CollisionShape } from "./CollisionShape";
import { Vec2 } from "./Vec2";
import { EPSILON } from "./utils";

export class Circle extends CollisionShape {
    private _radius: number;

    get radius() { return this._radius; }
    get diameter() { return this._radius * 2; }

    constructor(radius: number) {
        super();
        this._radius = radius;
    }

    toAABB(): AABB {
        return new AABB(this.position.sub(this._radius), new Vec2(this.diameter, this.diameter));
    }

    checkCollidePoint(point: Vec2): boolean {
        return this.position.sub(point).length < this.radius - EPSILON;
    }

    clone(): Circle {
        const circle = new Circle(this._radius);
        circle.position = this.position;
        circle.angle = this.angle;
        return circle;
    }
}
