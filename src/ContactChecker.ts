import { Circle } from "./Circle";
import { CollisionShape } from "./CollisionShape";
import { Line } from "./Line";
import { Polygon } from "./Polygon";
import { Vec2 } from "./Vec2";

/**
 * This class detects contact points based on the collision detection results by SAT.
 */
export class ContactChecker {
    /**
     * Detects contact points based on collision detection results by SAT.
     * @param shapeA Collision shape A
     * @param shapeB Collision shape B
     * @param depth Penetration depth calculated by SAT.
     * @return List of contact points.
     */
    checkContacts(shapeA: CollisionShape, shapeB: CollisionShape, depth: Vec2): Vec2[] {
        if (shapeA instanceof Circle && shapeB instanceof Circle) {
            return this._checkContactsCircleAndCircle(shapeA, depth);
        } else if (shapeA instanceof Circle && shapeB instanceof Line) {
            return this._checkContactsCircleAndLine(shapeA, shapeB, depth);
        } else if (shapeA instanceof Polygon && shapeB instanceof Line) {
            return this._checkContactsPolygonAndLine(shapeA, shapeB, depth);
        } else if (shapeA instanceof Line && shapeB instanceof Polygon) {
            return this._checkContactsPolygonAndLine(shapeB, shapeA, depth.neg());
        } else if (shapeA instanceof Polygon && shapeB instanceof Polygon) {
            return this._checkContactsPolygonAndPolygon(shapeA, shapeB, depth);
        } else {
            return [];
        }
    }

    private _checkContactsCircleAndCircle(shapeA: Circle, depth: Vec2): Vec2[] {
        return [shapeA.position.sub(Vec2.polar(depth.rad, shapeA.radius))];
    }

    private _checkContactsCircleAndLine(circle: Circle, line: Line, depth: Vec2): Vec2[] {
        const contacts = [];

        const circle2 = circle.clone();
        circle2.position = circle.position.sub(depth.add(depth.norm().mul(0.1)));
        const line2 = new Line(depth.add(depth.norm().mul(0.2)));
        line2.position = circle2.worldPosition().add(depth.norm().mul(circle2.radius));
        const intersect = line2.intersectLine(line);
        if (intersect) contacts.push(intersect);

        const line3 = line.clone();
        line3.position = line3.position.sub(depth.add(depth.norm().mul(0.1)).neg());
        for (const vertice of line3.worldVertices()) {
            const line4 = new Line(depth.add(depth.norm().mul(0.2)).neg());
            line4.position = vertice;
            const intersects = line4.intersectCircle(circle);
            if (intersects.length === 1) {
                contacts.push(intersects[0]);
            } else if (intersects.length === 2) {
                if (vertice.sub(intersects[0]).magnitude < vertice.sub(intersects[1]).magnitude) {
                    contacts.push(intersects[0]);
                } else {
                    contacts.push(intersects[1]);
                }
            }
        }

        return this._uniqueVec2Array(contacts);
    }

    private _checkContactsPolygonAndLine(polygon: Polygon, line: Line, depth: Vec2): Vec2[] {
        const contacts = [];

        const polygon2 = polygon.clone();
        polygon2.position = polygon.position.sub(depth.add(depth.norm().mul(0.1)));
        for (const vertice of polygon2.worldVertices()) {
            const line2 = new Line(depth.add(depth.norm().mul(0.2)));
            line2.position = vertice;
            const intersect = line2.intersectLine(line);
            if (intersect) contacts.push(intersect);
        }

        const line3 = line.clone();
        line3.position = line3.position.sub(depth.add(depth.norm().mul(0.1)).neg());
        for (const vertice of line3.worldVertices()) {
            for (const polygonLine of polygon.lines()) {
                const line4 = new Line(depth.add(depth.norm().mul(0.2)).neg());
                line4.position = vertice;
                const intersect = line4.intersectLine(polygonLine);
                if (intersect) contacts.push(intersect);
            }
        }

        return this._uniqueVec2Array(contacts);
    }

    private _checkContactsPolygonAndPolygon(polygon1: Polygon, polygon2: Polygon, depth: Vec2): Vec2[] {
        const contacts = [];

        const polygon3 = polygon1.clone();
        polygon3.position = polygon1.position.sub(depth.mul(1.1));
        for (const vertice of polygon3.worldVertices()) {
            const line = new Line(depth.mul(1.2));
            line.position = vertice;
            for (const polygonLine of polygon2.lines()) {
                const intersect = line.intersectLine(polygonLine);
                if (intersect) contacts.push(intersect);
            }
        }

        const polygon4 = polygon2.clone();
        polygon4.position = polygon2.position.sub(depth.mul(1.1).neg());
        for (const vertice of polygon4.worldVertices()) {
            const line = new Line(depth.mul(1.2).neg());
            line.position = vertice;
            for (const polygonLine of polygon1.lines()) {
                const intersect = line.intersectLine(polygonLine);
                if (intersect) contacts.push(intersect);
            }
        }

        return this._uniqueVec2Array(contacts);
    }

    private _uniqueVec2Array(vec2Array: Vec2[]): Vec2[] {
        const results: Vec2[] = [];
        for (const vec2 of vec2Array) {
            let already = false;
            for (const result of results) {
                if (result.equals(vec2)) {
                    already = true;
                    break;
                }
            }
            if (!already) results.push(vec2);
        }
        return results;
    }
}
