import { CollisionResult } from "./CollisionResult";
import { CollisionShape } from "./CollisionShape";
import { SATChecker } from "./SATChecker";
import { Vec2 } from "./Vec2";
import { World } from "./World";

export interface ICollisionObject {
    /** Collision group bit flags. */
    group?: number;
    /** Collision category bit flags. */
    category?: number;
    /** Collision bit mask. */
    mask?: number;
    /** Meta information. */
    meta?: { [key: string]: any };
}

/**
 * Superclass of all collision objects.
 */
export abstract class CollisionObject {
    private _shape: CollisionShape;
    private _group: number;
    private _category: number;
    private _mask: number;
    private _world?: World;
    private _meta: { [key: string]: any };

    /** Collision shape. */
    get shape() { return this._shape; }
    set shape(value) {
        this._shape = value.clone();
        if (this.world) this.world._updateObject(this);
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
    /** Body position. */
    get position() { return this._shape.position; }
    set position(value) {
        this._shape.position = value;
        if (this.world) this.world._updateObject(this);
    }
    /** Body angle. */
    get angle() { return this._shape.angle; }
    set angle(value) {
        this._shape.angle = value;
        if (this.world) this.world._updateObject(this);
    }
    /** The world where the body is set. */
    get world() { return this._world; }
    /** Meta information. This value is used by the application to provide specific meta information to the Body. */
    get meta() { return this._meta; }
    set meta(value) { this._meta = value; }

    /**
     * @param shape Collision shape.
     * @param opt Initialize option.
     */
    constructor(shape: CollisionShape, opt: ICollisionObject = {}) {
        this._shape = shape.clone();
        this._group = opt.group ?? 0;
        this._category = opt.category ?? 0;
        this._mask = opt.mask ?? 0;
        this._meta = opt.meta ?? {};
    }

    _setWorld(world: World | undefined): void {
        this._world = world;
    }

    /**
     * Check for collisions with all collision objects.
     * @return Collision result list.
     */
    checkCollideObjects(): CollisionResult[] {
        const results: CollisionResult[] = [];
        if (!this.world) return results;
        const aabb1 = this.shape.toAABB();
        const satChecker = new SATChecker();
        for (const object of this.world.findCollidableObjects(this)) {
            const aabb2 = object.shape.toAABB();
            if (!aabb1.isCollidedAABB(aabb2)) continue;
            const depth = satChecker.checkSATCollision(this.shape, object.shape);
            if (depth) {
                results.push(new CollisionResult(this, object, depth));
            }
        }
        return results;
    }

    /**
     * Check if point collide.
     * @return Whether there was a collision or not.
     */
    checkCollidePoint(point: Vec2): boolean {
        return this._shape.checkCollidePoint(point);
    }

    canCollideObject(object: CollisionObject): boolean {
        if (!(this.world && object.world)) return false;
        if ((this.group | object.group) === 0) return false;
        if ((this.category & object.mask) === 0 && (object.category & this.mask) === 0) return false;
        return true;
    }
}
