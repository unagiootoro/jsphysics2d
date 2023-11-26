import { Vec2 } from "./Vec2";
import { CollisionObject } from "./CollisionObject";
import { QuadTree } from "./QuadTree";
import { CollisionBody } from "./CollisionBody";
import { CollisionArea } from "./CollisionArea";
import { EventDispatcherImpl } from "./EventDispatcherImpl";
import { Callback, IEventDispatcher } from "./IEventDispatcher";

export interface IWorldOption {
    /** Maximum split level of quadtree. */
    maxQuadTreeLevel?: number;
    /** If collision object extends outside the world, it will automatically resize the world. */
    autoResize?: boolean;
}

export class World implements IEventDispatcher {
    private static _DEFAULT_MAX_QUAD_TREE_LEVEL = 8;

    private _width: number;
    private _height: number;
    private _objects: Set<CollisionObject> = new Set();
    private _gravity: Vec2 = new Vec2(0, 9.8);
    private _quadTree: QuadTree;
    private _maxQuadTreeLevel: number;
    private _autoResize: boolean;
    private _eventDispatcherImpl: EventDispatcherImpl;

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
        this._maxQuadTreeLevel = opt.maxQuadTreeLevel ?? World._DEFAULT_MAX_QUAD_TREE_LEVEL;
        this._autoResize = opt.autoResize ?? false;
        this._quadTree = new QuadTree(width, height, this._maxQuadTreeLevel);
        this._eventDispatcherImpl = new EventDispatcherImpl();
    }

    addEventListener(eventType: string, callback: Callback): void {
        this._eventDispatcherImpl.addEventListener(eventType, callback);
    }

    removeEventListener(eventType: string, callback: Callback): void {
        this._eventDispatcherImpl.removeEventListener(eventType, callback);
    }

    dispatchEvent(eventType: string, ...callbackArgs: unknown[]): void {
        this._eventDispatcherImpl.dispatchEvent(eventType, ...callbackArgs);
    }

    /**
     * Add collision object to world.
     * @param object Collision object.
     */
    add(object: CollisionObject): void {
        if (this._objects.has(object)) return;
        if (this._autoResize) {
            const aabb = object.shape.toAABB();
            const aabbRightDownPos = aabb.position.add(aabb.size);
            if (aabbRightDownPos.x > this._width || aabbRightDownPos.y > this._height) {
                this.resize(aabbRightDownPos.x, aabbRightDownPos.y);
            }
        }
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

    /**
     * Returns all collision objects that collide with the specified point.
     * @return Collision object list.
     */
    checkCollideObjectsByPoint(point: Vec2): CollisionObject[] {
        const objects = [];
        for (const object of this.findObjectsByPoint(point)) {
            if (object.checkCollidePoint(point)) objects.push(object);
        }
        return objects;
    }

    /**
     * Resize the world.
     * @param width World width.
     * @param height World height.
     * @param opt Resize option.
     */
    resize(width: number, height: number, opt: { maxQuadTreeLevel?: number } = {}): void {
        this._width = width;
        this._height = height;
        const maxQuadTreeLevel = opt.maxQuadTreeLevel ?? this._maxQuadTreeLevel;
        this._quadTree = new QuadTree(width, height, maxQuadTreeLevel);
        for (const object of this._objects) {
            this._quadTree.add(object);
        }
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

    findCollidableAreas(subject: CollisionObject): CollisionArea[] {
        const areas: CollisionArea[] = [];
        const objects = this.findCollidableObjects(subject);
        for (const object of objects) {
            if (object instanceof CollisionArea) areas.push(object);
        }
        return areas;
    }

    findObjectsByPoint(point: Vec2): CollisionObject[] {
        return this._quadTree.findObjectsByPoint(point);
    }
}
