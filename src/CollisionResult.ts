import { CollisionObject } from "./CollisionObject";
import { Vec2 } from "./Vec2";

export class CollisionResult<T extends CollisionObject, U extends CollisionObject> {
    readonly objectA: T;
    readonly objectB: U;
    readonly depth: Vec2;

    constructor(objectA: T, objectB: U, depth: Vec2) {
        this.objectA = objectA;
        this.objectB = objectB;
        this.depth = depth;
    }
}
