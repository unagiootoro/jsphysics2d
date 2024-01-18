import { Vec2 } from "./Vec2";
import { CollisionShape } from "./CollisionShape";
import { AABB } from "./AABB";
import { EPSILON, eq, lt } from "./utils";
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
    get begin() {
        let vec = this._vec.div(2).neg();
        vec = vec.sub(this.anchor);
        vec = vec.rotate(vec.rad + this.angle);
        return this.position.add(vec);
    }
    get end() {
        let vec = this._vec.div(2);
        vec = vec.sub(this.anchor);
        vec = vec.rotate(vec.rad + this.angle);
        return this.position.add(vec);
    }

    worldVertices(): Vec2[] {
        return [this.begin, this.end];
    }

    calcInertia(mass: number): number {
        return (1 / 12) * mass * (this._vec.magnitude ** 2);
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
        const b = this.end.sub(this.begin);
        return eq(a.dot(b), a.magnitude * b.magnitude) && a.magnitude < b.magnitude - EPSILON / 2;
    }

    clone(): Line {
        const line = new Line(this._vec);
        line.position = this.position;
        line.angle = this.angle;
        line.anchor = this.anchor;
        return line;
    }

    intersectLine(line: Line): Vec2 | undefined {
        const a = this.begin;
        const b = this.end
        const c = line.begin;
        const d = line.end;
        const ab = b.sub(a);
        const ac = c.sub(a);
        const ad = d.sub(a);
        const cd = d.sub(c);
        const ca = a.sub(c);
        const cb = b.sub(c);
        const s = ab.cross(ac);
        const t = ab.cross(ad);
        const u = cd.cross(ca);
        const v = cd.cross(cb);
        const isIntersect = lt(s * t, 0) && lt(u * v, 0);
        if (!isIntersect) return undefined;
        const n = ac.neg().cross(cd) / cd.cross(ab);
        return a.add(ab.mul(n));
    }

    intersectCircle(circle: Circle): Vec2[] {
        const a = this.begin;
        const b = this.end;
        const c = circle.worldPosition();
        const ab = b.sub(a);
        const ac = c.sub(a);
        const bc = c.sub(b);
        const r = circle.radius;
        const s = ab.norm().cross(ac);
        if (Math.abs(s) >= r - EPSILON) return [];
        const inA = lt(ac.magnitude, r);
        const inB = lt(bc.magnitude, r);
        if (inA && inB) {
            return [];
        } else {
            const t = Math.sqrt(r ** 2 - s ** 2);
            const d = c.add(ab.perp().norm().mul(s));
            if (inA) {
                return [d.add(ab.norm().mul(t))];
            } else if (inB) {
                return [d.add(ab.norm().mul(-t))];
            } else {
                return [d.add(ab.norm().mul(-t)), d.add(ab.norm().mul(t))];
            }
        }
    }
}
