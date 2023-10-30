import { AABB } from "./AABB";
import { Vec2 } from "./Vec2";

/**
 * Superclass of all collision shapes.
 */
export abstract class CollisionShape {
    static sequenceNumber = 0;

    private _id: number;
    private _position: Vec2 = Vec2.ZERO;
    private _angle: number = 0;

    get position() { return this._position; }
    set position(value) { this._position = value; }
    get angle() { return this._angle; }
    set angle(value) { this._angle = value; }
    get id() { return this._id; }

    constructor() {
        this._id = CollisionShape.sequenceNumber;
        CollisionShape.sequenceNumber++;
    }

    abstract toAABB(): AABB;
    abstract checkCollidePoint(point: Vec2): boolean;
    abstract clone(): CollisionShape;
}
