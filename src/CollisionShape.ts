import { AABB } from "./AABB";
import { Vec2 } from "./Vec2";

export interface ICollisionShapeOption {
    position?: Vec2;
    angle?: number;
    anchor?: Vec2;
}

/**
 * Superclass of all collision shapes.
 */
export abstract class CollisionShape {
    static sequenceNumber = 0;

    private _id: number;
    private _position: Vec2;
    private _angle: number;
    private _anchor: Vec2;

    get position() { return this._position; }
    set position(value) { this._position = value; }
    get angle() { return this._angle; }
    set angle(value) { this._angle = value; }
    get anchor() { return this._anchor; }
    set anchor(value) { this._anchor = value; }
    get id() { return this._id; }

    constructor(opt: ICollisionShapeOption = {}) {
        this._position = opt.position ?? Vec2.ZERO;
        this._angle = opt.angle ?? 0;
        this._anchor = opt.anchor ?? Vec2.ZERO;
        this._id = CollisionShape.sequenceNumber;
        CollisionShape.sequenceNumber++;
    }

    abstract toAABB(): AABB;
    abstract checkCollidePoint(point: Vec2): boolean;
    abstract clone(): CollisionShape;
}
