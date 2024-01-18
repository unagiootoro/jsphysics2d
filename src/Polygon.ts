import { Vec2 } from "./Vec2";
import { CollisionShape, ICollisionShapeOption } from "./CollisionShape";
import { Line } from "./Line";
import { AABB } from "./AABB";

export class Polygon extends CollisionShape {
    private _vertices: Vec2[];

    get vertices() { return this._vertices; }

    constructor(vertices: Vec2[], opt: ICollisionShapeOption = {}) {
        super(opt);
        this._vertices = vertices;
    }

    worldVertices(): Vec2[] {
        return this._vertices.map(vertice => {
            vertice = vertice.sub(this.anchor);
            vertice = vertice.rotate(vertice.rad + this.angle);
            vertice = vertice.add(this.position);
            return vertice;
        });
    }

    calcInertia(mass: number): number {
        throw new Error("Currently, polygon intertia is not supported.");
    }

    lines(): Line[] {
        const lines: Line[] = [];
        const vertices = this.worldVertices();
        for (let i = 0; i < vertices.length; i++) {
            const p1 = vertices[i];
            const p2 = i < vertices.length - 1 ? vertices[i + 1] : vertices[0];
            const line = Line.fromBeginToEnd(p1, p2);
            lines.push(line);
        }
        return lines;
    }

    toAABB(): AABB {
        let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
        for (const line of this.lines()) {
            const linev1 = line.begin;
            const linev2 = line.end;
            if (linev1.x < x1) {
                x1 = linev1.x;
            }
            if (linev2.x < x1) {
                x1 = linev2.x;
            }
            if (linev1.x > x2) {
                x2 = linev1.x;
            }
            if (linev2.x > x2) {
                x2 = linev2.x;
            }

            if (linev1.y < y1) {
                y1 = linev1.y;
            }
            if (linev2.y < y1) {
                y1 = linev2.y;
            }
            if (linev1.y > y2) {
                y2 = linev1.y;
            }
            if (linev2.y > y2) {
                y2 = linev2.y;
            }
        }
        return new AABB(new Vec2(x1, y1), new Vec2(x2 - x1, y2 - y1));
    }

    checkCollidePoint(point: Vec2): boolean {
        let lastSign: number | undefined;
        for (const line of this.lines()) {
            const v = point.sub(line.position);
            const c = v.cross(line.vec);
            if (c === 0) return false;
            const sign = c < 0 ? -1 : 1;
            if (lastSign == null) {
                lastSign = sign;
            } else if (lastSign !== sign) {
                return false;
            }
        }
        return lastSign != null;
    }

    clone(): Polygon {
        const polygon = new Polygon(this._vertices);
        polygon.position = this.position;
        polygon.angle = this.angle;
        polygon.anchor = this.anchor;
        return polygon;
    }
}
