import { CollisionObject } from "./CollisionObject";
import { Vec2 } from "./Vec2";

export class CollisionResult {
    readonly objectA: CollisionObject;
    readonly objectB: CollisionObject;
    readonly depth: Vec2;

    constructor(objectA: CollisionObject, objectB: CollisionObject, depth: Vec2) {
        this.objectA = objectA;
        this.objectB = objectB;
        this.depth = depth;
    }
}
