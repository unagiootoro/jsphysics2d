import { Vec2 } from "./Vec2";
import { Polygon } from "./Polygon";
import { Circle } from "./Circle";
import { CollisionShape } from "./CollisionShape";
import { Line } from "./Line";
import { EPSILON } from "./utils";

/**
 * This class performs collision detection using SAT.
 */
export class SATChecker {
    checkSATCollision(shape1: CollisionShape, shape2: CollisionShape): Vec2 | undefined {
        let min: Vec2 | undefined;
        for (const axis of this.getAxes(shape1, shape2)) {
            const norm = axis.norm();
            const pr1 = this.projection(shape1, axis);
            pr1.min += EPSILON / 2;
            pr1.max -= EPSILON / 2;
            const pr2 = this.projection(shape2, axis);
            if (
                (pr2.min <= pr1.min && pr1.min <= pr2.max) ||
                (pr2.min <= pr1.max && pr1.max <= pr2.max) ||
                (pr1.min <= pr2.min && pr2.min <= pr1.max) ||
                (pr1.min <= pr2.max && pr2.max <= pr1.max)
            ) {
                let vec;
                if ((pr2.min <= pr1.min && pr1.min <= pr2.max) && (pr1.max > pr2.max)) {
                    vec = norm.mul(pr1.min - pr2.max);
                } else if ((pr2.min <= pr1.max && pr1.max <= pr2.max) && (pr1.min < pr2.min)) {
                    vec = norm.mul(pr1.max - pr2.min);
                } else if ((pr2.min <= pr1.min && pr1.min <= pr2.max) && (pr2.min <= pr1.max && pr1.max <= pr2.max)) {
                    if (pr1.max - pr2.min < pr2.max - pr1.min) {
                        vec = norm.mul(pr1.max - pr2.min);
                    } else {
                        vec = norm.mul(pr1.min - pr2.max);
                    }
                } else {
                    if (pr2.max - pr1.min < pr1.max - pr2.min) {
                        vec = norm.mul(pr1.min - pr2.max);
                    } else {
                        vec = norm.mul(pr1.max - pr2.min);
                    }
                }
                if (!min || vec.length < min.length) {
                    min = vec;
                }
            } else {
                return undefined;
            }
        }
        if (min) {
            return min;
        }
        return undefined;
    }

    projection(shape: CollisionShape, axis: Vec2): { min: number, max: number } {
        const vertices = this.getSATVertices(shape, axis);
        let min = axis.norm().dot(vertices[0]);
        let max = min;
        for (let i = 1; i < vertices.length; i++) {
            const len = axis.norm().dot(vertices[i]);
            if (len < min) {
                min = len;
            } else if (len > max) {
                max = len;
            }
        }
        return { min, max };
    }

    getAxes(shape1: CollisionShape, shape2: CollisionShape): Vec2[] {
        let axes: Vec2[] = [];
        if ((shape1 instanceof Line) && (shape2 instanceof Line)) {
            axes = this.getAxesWhenLine(shape1);
            axes = axes.concat(this.getAxesWhenLine(shape2));
        } else if ((shape1 instanceof Line) && (shape2 instanceof Polygon)) {
            axes = this.getAxesWhenLine(shape1);
            axes = axes.concat(this.getAxesWhenPolygon(shape2));
        } else if ((shape1 instanceof Polygon) && (shape2 instanceof Line)) {
            axes = this.getAxesWhenPolygon(shape1);
            axes = axes.concat(this.getAxesWhenLine(shape2));
        } else if ((shape1 instanceof Polygon) && (shape2 instanceof Polygon)) {
            axes = this.getAxesWhenPolygon(shape1);
            axes = axes.concat(this.getAxesWhenPolygon(shape2));
        } else if ((shape1 instanceof Line) && (shape2 instanceof Circle)) {
            axes = this.getAxesWhenLineAndCircle(shape1, shape2);
        } else if ((shape1 instanceof Circle) && (shape2 instanceof Line)) {
            axes = this.getAxesWhenLineAndCircle(shape2, shape1);
        } else if ((shape1 instanceof Polygon) && (shape2 instanceof Circle)) {
            axes = this.getAxesWhenPolygonAndCircle(shape1, shape2);
        } else if ((shape1 instanceof Circle) && (shape2 instanceof Polygon)) {
            axes = this.getAxesWhenPolygonAndCircle(shape2, shape1);
        } else if ((shape1 instanceof Circle) && (shape2 instanceof Circle)) {
            axes = this.getAxesWhenCircleAndCircle(shape1, shape2);
        }
        return axes;
    }

    getAxesWhenLine(line: Line): Vec2[] {
        return [line.vec.perp()];
    }

    getAxesWhenPolygon(polygon: Polygon): Vec2[] {
        return polygon.lines().map(line => line.vec.perp());
    }

    getAxesWhenLineAndCircle(line: Line, circle: Circle): Vec2[] {
        const axes = this.getAxesWhenLine(line);
        for (const vertice of line.worldVertices()) {
            if (!vertice.equals(circle.position)) axes.push(vertice.sub(circle.position));
        }
        return axes;
    }

    getAxesWhenPolygonAndCircle(polygon: Polygon, circle: Circle): Vec2[] {
        const axes = this.getAxesWhenPolygon(polygon);
        for (const vertice of polygon.worldVertices()) {
            if (!vertice.equals(circle.position)) axes.push(vertice.sub(circle.position));
        }
        return axes;
    }

    getAxesWhenCircleAndCircle(circle1: Circle, circle2: Circle) {
        const vec = circle2.position.sub(circle1.position);
        if (vec.equals(Vec2.ZERO)) return [Vec2.UP];
        return [circle2.position.sub(circle1.position)];
    }

    getSATVertices(shape: CollisionShape, axis: Vec2): Vec2[] {
        if (shape instanceof Line) {
            return this.getSATVerticesWhenLine(shape);
        } else if (shape instanceof Polygon) {
            return this.getSATVerticesWhenPolygon(shape);
        } else if (shape instanceof Circle) {
            return this.getSATVerticesWhenCircle(shape, axis);
        }
        return [];
    }

    getSATVerticesWhenLine(line: Line): Vec2[] {
        return line.worldVertices();
    }

    getSATVerticesWhenPolygon(polygon: Polygon): Vec2[] {
        return polygon.worldVertices();
    }

    getSATVerticesWhenCircle(circle: Circle, axis: Vec2): Vec2[] {
        const v1 = axis.norm();
        const v2 = v1.neg();
        const pos1 = circle.position.add(v1.mul(circle.radius));
        const pos2 = circle.position.add(v2.mul(circle.radius));
        return [pos1, pos2];
    }
}
