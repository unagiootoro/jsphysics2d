import { Vec2 } from "./Vec2";
import { CollisionShape } from "./CollisionShape";
import { AABB } from "./AABB";
import { EPSILON, eq, gt, lt } from "./utils";
import { Circle } from "./Circle";

export class Line extends CollisionShape {
    private _vec: Vec2;

    static fromBeginToEnd(begin: Vec2, end: Vec2): Line {
        const vec = end.sub(begin);
        const line = new Line(vec);
        line.position = begin.add(vec.div(2));
        return line;
    }

    constructor(vec: Vec2) {
        super();
        this._vec = vec;
    }

    get vec() { return this._vec; }
    get begin() { return this.position.sub(this._vec.div(2)); }
    get end() { return this.position.add(this._vec.div(2)); }

    worldVertices(): Vec2[] {
        return [this.begin, this.end];
    }

    toAABB(): AABB {
        let x1, y1, x2, y2;
        const v1 = this.begin;
        const v2 = this.end;
        if (v1.x < v2.x) {
            x1 = v1.x;
            x2 = v2.x;
        } else {
            x1 = v2.x;
            x2 = v1.x;
        }
        if (v1.y < v2.y) {
            y1 = v1.y;
            y2 = v2.y;
        } else {
            y1 = v2.y;
            y2 = v1.y;
        }
        return new AABB(new Vec2(x1, y1), new Vec2(x2 - x1, y2 - y1));
    }

    checkCollidePoint(point: Vec2): boolean {
        const a = point.sub(this.begin);
        const b = this._vec;
        return eq(a.dot(b), a.length * b.length) && a.length < b.length - EPSILON / 2;
    }

    clone(): Line {
        const line = new Line(this._vec);
        line.position = this.position;
        return line;
    }
}
