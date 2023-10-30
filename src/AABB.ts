import { Vec2 } from "./Vec2";

/**
 * This class deals with AABB.
 */
export class AABB {
    private _position: Vec2;
    private _size: Vec2;

    constructor(position: Vec2, size: Vec2) {
        this._position = position;
        this._size = size;
    }

    get position() { return this._position; }
    get size() { return this._size; }
    get x() { return this._position.x; }
    get y() { return this._position.y; }
    get width() { return this._size.x; }
    get height() { return this._size.y; }
    get x2() { return this.x + this.width; }
    get y2() { return this.y + this.height; }

    equals(aabb: AABB): boolean {
        return this._position.equals(aabb.position) && this._size.equals(aabb.size);
    }

    isCollidedAABB(aabb: AABB): boolean {
        const ax1 = this.x;
        const ay1 = this.y;
        const ax2 = this.x2;
        const ay2 = this.y2;
        const bx1 = aabb.x;
        const by1 = aabb.y;
        const bx2 = aabb.x2;
        const by2 = aabb.y2;
        if ((ax1 >= bx1 && ax1 <= bx2 || ax2 >= bx1 && ax2 <= bx2 || bx1 >= ax1 && bx2 <= ax2) &&
            (ay1 >= by1 && ay1 <= by2 || ay2 >= by1 && ay2 <= by2 || by1 >= ay1 && by2 <= ay2)) {
            return true;
        }
        return false;
    }
}
