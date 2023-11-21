import { CollisionObject } from "./CollisionObject";
import { CollisionResult } from "./CollisionResult";
import { SATChecker } from "./SATChecker";
import { EPSILON } from "./utils";

/**
 * Superclass of all collision bodies.
 */
export abstract class CollisionBody extends CollisionObject {
    /**
     * Check for collisions with all collision bodies.
     * @return Collision result list.
     */
    checkCollideBodies(): CollisionResult<CollisionBody, CollisionBody>[] {
        const results: CollisionResult<CollisionBody, CollisionBody>[] = [];
        if (!this.world) return results;
        const aabb1 = this.shape.toAABB();
        const satChecker = new SATChecker();
        for (const body of this.world.findCollidableBodies(this)) {
            const aabb2 = body.shape.toAABB();
            if (!aabb1.isCollidedAABB(aabb2)) continue;
            const depth = satChecker.checkSATCollision(this.shape, body.shape);
            if (depth && depth.length >= EPSILON) {
                results.push(new CollisionResult(this, body, depth));
            }
        }
        return results;
    }
}
