import { AABB } from "./AABB";
import { CollisionObject } from "./CollisionObject";
import { Vec2 } from "./Vec2";

/**
 * This is a class that manages collisions caused by quadtrees.
 */
export class QuadTree {
    private _linear: { [key: number]: CollisionObject[] | undefined } = {};
    private _objects: Set<CollisionObject> = new Set();
    private _lastAABBs: Map<CollisionObject, AABB> = new Map();
    private _width: number;
    private _height: number;
    private _gridWidth: number;
    private _gridHeight: number;
    private _maxLevel: number;

    constructor(width: number, height: number, maxLevel: number) {
        this._width = width;
        this._height = height;
        this._maxLevel = maxLevel;
        this._gridWidth = this._width / 2 ** this._maxLevel;
        this._gridHeight = this._height / 2 ** this._maxLevel;
    }

    add(object: CollisionObject): void {
        if (this._objects.has(object)) return;
        const aabb = object.shape.toAABB();
        if (!this._aabbIsInTheArea(aabb)) return;
        this._lastAABBs.set(object, aabb);
        const index = this._calcLinearIndex(aabb);
        if (this._linear[index] == null) {
            this._linear[index] = [object];
        } else {
            this._linear[index]!.push(object);
        }
        this._objects.add(object);
    }

    remove(object: CollisionObject): void {
        if (!this._objects.has(object)) return;
        const aabb = this._lastAABBs.get(object)!;
        const index = this._calcLinearIndex(aabb);
        if (this._linear[index] != null) {
            this._linear[index] = this._linear[index]!.filter(o => o !== object);
        }
        this._objects.delete(object);
        this._lastAABBs.delete(object);
    }

    updateObject(object: CollisionObject): void {
        if (!this._objects.has(object)) return;

        const currentAABB = object.shape.toAABB();
        if (!this._aabbIsInTheArea(currentAABB)) {
            this.remove(object);
            return;
        }

        const lastAABB = this._lastAABBs.get(object)!;
        if (!lastAABB.equals(currentAABB)) {
            this._lastAABBs.set(object, currentAABB);
            const lastIndex = this._calcLinearIndex(lastAABB);
            if (this._linear[lastIndex] != null) {
                this._linear[lastIndex] = this._linear[lastIndex]!.filter(o => o !== object);
            }
            const currentIndex = this._calcLinearIndex(currentAABB);
            if (this._linear[currentIndex] == null) {
                this._linear[currentIndex] = [object];
            } else {
                this._linear[currentIndex]!.push(object);
            }
        }
    }

    objects(): Set<CollisionObject> {
        return this._objects;
    }

    findCollidableObjects(object: CollisionObject): CollisionObject[] {
        if (!this._objects.has(object)) return [];
        const aabb = this._lastAABBs.get(object)!;
        const [level, zOrder] = this._calcLevelAndZOrder(aabb);
        const index = this.calcLinearIndexByLevelAndZOrder(level, zOrder);
        const collidableObjects = this._linear[index]?.filter(_obj => _obj !== object) ?? [];
        const nextLevel = level + 1;
        if (nextLevel <= this._maxLevel) {
            for (let i = 0; i < 4; i++) {
                const zOrder2 = zOrder * 4 + i;
                this._findCollidableObjectsByChildren(collidableObjects, nextLevel, zOrder2);
            }
        }

        const nextParentLevel = level - 1;
        if (nextParentLevel >= 0) {
            const parentZOrder = zOrder >>> 2;
            this._findCollidableObjectsByParent(collidableObjects, nextParentLevel, parentZOrder);
        }

        return collidableObjects;
    }

    findObjectsByPoint(point: Vec2): CollisionObject[] {
        const numGridsInLine = this._maxLevel ** 2;
        let ix = Math.floor(point.x / this._gridWidth);
        if (ix < 0) ix = 0;
        if (ix >= numGridsInLine) ix = numGridsInLine - 1;

        let iy = Math.floor(point.y / this._gridHeight);
        if (iy < 0) iy = 0;
        if (iy >= numGridsInLine) iy = numGridsInLine - 1;

        const zOrder = this._calcZOrder(ix, iy);
        const level = this._maxLevel;
        const index = this.calcLinearIndexByLevelAndZOrder(level, zOrder);
        const collidableObjects = this._linear[index]?.concat() ?? [];

        const nextLevel = level + 1;
        if (nextLevel <= this._maxLevel) {
            for (let i = 0; i < 4; i++) {
                const zOrder2 = zOrder * 4 + i;
                this._findCollidableObjectsByChildren(collidableObjects, nextLevel, zOrder2);
            }
        }

        const nextParentLevel = level - 1;
        if (nextParentLevel >= 0) {
            const parentZOrder = zOrder >>> 2;
            this._findCollidableObjectsByParent(collidableObjects, nextParentLevel, parentZOrder);
        }

        return collidableObjects;
    }

    private _findCollidableObjectsByChildren(collidableObjects: CollisionObject[], level: number, zOrder: number): void {
        const index = this.calcLinearIndexByLevelAndZOrder(level, zOrder);
        if (this._linear[index]) {
            collidableObjects.push(...this._linear[index]!);
        }
        const nextLevel = level + 1;
        if (nextLevel <= this._maxLevel) {
            for (let i = 0; i < 4; i++) {
                const zOrder2 = zOrder * 4 + i;
                this._findCollidableObjectsByChildren(collidableObjects, nextLevel, zOrder2);
            }
        }
    }

    private _findCollidableObjectsByParent(collidableObjects: CollisionObject[], level: number, zOrder: number): void {
        const index = this.calcLinearIndexByLevelAndZOrder(level, zOrder);
        if (this._linear[index]) {
            collidableObjects.push(...this._linear[index]!);
        }
        const nextLevel = level - 1;
        if (nextLevel >= 0) {
            const zOrder2 = zOrder >>> 2;
            this._findCollidableObjectsByParent(collidableObjects, nextLevel, zOrder2);
        }
    }

    private _calcLinearIndex(aabb: AABB): number {
        const [level, zOrder] = this._calcLevelAndZOrder(aabb);
        return this.calcLinearIndexByLevelAndZOrder(level, zOrder);
    }

    private _calcLevelAndZOrder(aabb: AABB): [number, number] {
        const numGridsInLine = this._maxLevel ** 2;
        let ix1 = Math.floor(aabb.x / this._gridWidth);
        if (ix1 < 0) ix1 = 0;
        if (ix1 >= numGridsInLine) ix1 = numGridsInLine - 1;

        let iy1 = Math.floor(aabb.y / this._gridHeight);
        if (iy1 < 0) iy1 = 0;
        if (iy1 >= numGridsInLine) iy1 = numGridsInLine - 1;

        let ix2 = Math.ceil(aabb.x2 / this._gridWidth) - 1;
        if (ix2 < 0) ix2 = 0;
        if (ix2 >= numGridsInLine) ix2 = numGridsInLine - 1;

        let iy2 = Math.ceil(aabb.y2 / this._gridHeight) - 1;
        if (iy2 < 0) iy2 = 0;
        if (iy2 >= numGridsInLine) iy2 = numGridsInLine - 1;

        const p1z = this._calcZOrder(ix1, iy1);
        const p2z = this._calcZOrder(ix2, iy2);
        const xor = p1z ^ p2z;
        let s;
        if (xor === 0) {
            s = 0;
        } else {
            const msb = Math.floor(Math.log2(xor));
            s = Math.floor(msb / 2) + 1;
        }
        const z = p1z >>> (s * 2);
        const l = this._maxLevel - s;
        return [l, z];
    }

    private calcLinearIndexByLevelAndZOrder(level: number, index: number): number {
        return index + ((4 ** level) - 1) / 3;
    }

    private _calcZOrder(x: number, y: number): number {
        return (this._skip1bit(x) | (this._skip1bit(y) << 1));
    }

    private _skip1bit(n: number): number {
        n = (n | (n << 8)) & 0x00ff00ff;
        n = (n | (n << 4)) & 0x0f0f0f0f;
        n = (n | (n << 2)) & 0x33333333;
        return (n | (n << 1)) & 0x55555555;
    }

    private _aabbIsInTheArea(aabb: AABB): boolean {
        if (aabb.x2 < 0) return false;
        if (aabb.y2 < 0) return false;
        if (aabb.x > this._width) return false;
        if (aabb.y > this._height) return false;
        return true;
    }
}
