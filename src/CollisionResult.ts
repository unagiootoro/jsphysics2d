import { CollisionObject } from "./CollisionObject";
import { Vec2 } from "./Vec2";

export class CollisionResult<T extends CollisionObject> {
    readonly object: T;
    readonly depth: Vec2;

    constructor(object: T, depth: Vec2) {
        this.object = object;
        this.depth = depth;
    }
}
