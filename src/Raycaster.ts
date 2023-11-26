import { Circle } from "./Circle";
import { CollisionArea } from "./CollisionArea";
import { CollisionBody } from "./CollisionBody";
import { CollisionShape } from "./CollisionShape";
import { Line } from "./Line";
import { Polygon } from "./Polygon";
import { Vec2 } from "./Vec2";
import { World } from "./World";

export interface IRayCasterOption {
    /** Collision group bit flags. */
    group?: number;
    /** Collision category bit flags. */
    category?: number;
    /** Collision bit mask. */
    mask?: number;
}

/**
 * A class for casting rays.
 */
export class Raycaster {
    private _world: World;
    private _group: number;
    private _category: number;
    private _mask: number;

    /**
     * @param workd The world where the raycaster is set.
     * @param opt Ray caster option.
     */
    constructor(world: World, opt: IRayCasterOption) {
        this._world = world;
        this._group = opt.group ?? 0;
        this._category = opt.category ?? 0;
        this._mask = opt.mask ?? 0;
    }

    /** Collision group bit flags. If the OR of this flag is 1, it is determined that they are the same group. */
    get group() { return this._group; }
    set group(value) { this._group = value; }
    /** Collision category bit flags. If they are in the same group and the OR of this flag and mask is 1,
     * they will be subject to collision. */
    get category() { return this._category; }
    set category(value) { this._category = value; }
    /** Collision category bit mask. If they are in the same group and the or of this mask and category is 1,
     * they will be subject to collision. */
    get mask() { return this._mask; }
    set mask(value) { this._mask = value; }
    /** The world where the raycaster is set. */
    get world() { return this._world; }

    /**
     * Execute ray cast.
     * @param begin Ray cast start position.
     * @param to Ray cast end position.
     * @return Ray cast result.
     */
    raycast(begin: Vec2, to: Vec2): RaycastResult {
        let nearContact: Vec2 | undefined;
        let hitBody: CollisionBody | undefined;
        const rayLine = Line.fromBeginToEnd(begin, to);
        const rayArea = new CollisionArea(rayLine, { group: this.group, category: this.category, mask: this.mask });
        this._world.add(rayArea);
        const aabb1 = rayLine.toAABB();
        for (const body of this._world.findCollidableBodies(rayArea)) {
            const aabb2 = body.shape.toAABB();
            if (!aabb1.isCollidedAABB(aabb2)) continue;
            const contact = this._checkContact(rayLine, body.shape);
            if (contact == null) continue;
            if (nearContact == null || contact.sub(begin).length < nearContact.sub(begin).length) {
                nearContact = contact;
                hitBody = body;
            }
        }
        this._world.remove(rayArea);
        let resultRayLine: Line;
        if (nearContact) {
            resultRayLine = Line.fromBeginToEnd(rayLine.begin, nearContact);
        } else {
            resultRayLine = rayLine;
        }
        const result = new RaycastResult(resultRayLine, nearContact, hitBody);
        this._world.dispatchEvent("raycast", result);
        return result;
    }

    private _checkContact(rayLine: Line, shape: CollisionShape): Vec2 | undefined {
        if (shape instanceof Line) {
            return this._checkContactByLine(rayLine, shape);
        } else if (shape instanceof Circle) {
            return this._checkContactByCircle(rayLine, shape);
        } else if (shape instanceof Polygon) {
            return this._checkContactByPolygon(rayLine, shape);
        }
        throw new Error("Invalid shape.");
    }

    private _checkContactByLine(rayLine: Line, line: Line): Vec2 | undefined {
        return rayLine.intersectLine(line);
    }

    private _checkContactByCircle(rayLine: Line, circle: Circle): Vec2 | undefined {
        const begin = rayLine.begin;
        const points = rayLine.intersectCircle(circle);
        let nearPoint: Vec2 | undefined;
        for (const point of points) {
            if (nearPoint == null || point.sub(begin).length < nearPoint.sub(begin).length) {
                nearPoint = point;
            }
        }
        return nearPoint;
    }

    private _checkContactByPolygon(rayLine: Line, polygon: Polygon): Vec2 | undefined {
        const begin = rayLine.begin;
        let nearPoint: Vec2 | undefined;
        for (const line of polygon.lines()) {
            const point = rayLine.intersectLine(line);
            if (!point) continue;
            if (nearPoint == null || point.sub(begin).length < nearPoint.sub(begin).length) {
                nearPoint = point;
            }
        }
        return nearPoint;
    }
}

/**
 * Execute ray cast result.
 */
export class RaycastResult {
    private _ray: Line;
    private _contact: Vec2 | undefined;
    private _body: CollisionBody | undefined;

    constructor(ray: Line, contact: Vec2 | undefined, body: CollisionBody | undefined) {
        this._ray = ray;
        this._contact = contact;
        this._body = body;
    }

    /** Ray line. */
    get ray() { return this._ray; }
    /** Ray contact point. */
    get contact() { return this._contact; }
    /** Ray contact body. */
    get body() { return this._body; }

    /**
     * Check if Ray was hit.
     * @return Returns true if Ray was hit.
     */
    isHit(): boolean {
        return !!this._contact;
    }
}
