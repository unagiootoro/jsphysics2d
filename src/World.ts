import { Vec2 } from "./Vec2";
import { CollisionObject } from "./CollisionObject";
import { QuadTree } from "./QuadTree";
import { CollisionBody } from "./CollisionBody";

export interface IWorldOption {
    /** Maximum split level of quadtree. */
    maxQuadTreeLevel?: number;
}

export class World {
    private _width: number;
    private _height: number;
    private _objects: Set<CollisionObject> = new Set();
    private _gravity: Vec2 = new Vec2(0, 9.8);
    private _quadTree: QuadTree;

    /** World width. */
    get width() { return this._width; }
    /** World height. */
    get height() { return this._height; }
    /** collision objects that world has. */
    get objects() { return this._objects; }
    get gravity() { return this._gravity; }
    set gravity(value) { this._gravity = value; }

    /**
     * @param width World width.
     * @param height World height.
     * @param opt Initialize option.
     */
    constructor(width: number, height: number, opt: IWorldOption = {}) {
        this._width = width;
        this._height = height;
        const maxQuadTreeLevel = opt.maxQuadTreeLevel ?? 8;
        this._quadTree = new QuadTree(width, height, maxQuadTreeLevel);
    }

    /**
     * Add collision object to world.
     * @param object Collision object.
     */
    add(object: CollisionObject): void {
        if (this._objects.has(object)) return;
        this._objects.add(object);
        object._setWorld(this);
        this._quadTree.add(object);
    }

    /**
     * Remove collision object from world.
     * @param object Collision object.
     */
    remove(object: CollisionObject): void {
        this._objects.delete(object);
        object._setWorld(undefined);
        this._quadTree.remove(object);
    }

    /**
     * Returns all collision bodies that world has.
     * @return Collision body list.
     */
    bodies(): CollisionBody[] {
        const bodies = [];
        for (const object of this.objects) {
            if (object instanceof CollisionBody) bodies.push(object);
        }
        return bodies;
    }

    _updateObject(object: CollisionObject): void {
        this._quadTree.updateObject(object);
    }

    findCollidableObjects(subject: CollisionObject): CollisionObject[] {
        return this._quadTree.findCollidableObjects(subject).filter(target => {
            return subject.canCollideObject(target);
        });
    }

    findCollidableBodies(subject: CollisionObject): CollisionBody[] {
        const bodies: CollisionBody[] = [];
        const objects = this.findCollidableObjects(subject);
        for (const object of objects) {
            if (object instanceof CollisionBody) bodies.push(object);
        }
        return bodies;
    }

    findObjectsByPoint(point: Vec2): CollisionObject[] {
        return this._quadTree.findObjectsByPoint(point);
    }
}
