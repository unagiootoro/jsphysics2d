import { CollisionArea } from "./CollisionArea";
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
    checkCollideBodies(): CollisionResult<CollisionBody>[] {
        if (!this.world) return [];
        return this._checkCollideByTargets(this.world.findCollidableBodies(this));
    }

    /**
     * Check for collisions with all collision areas.
     * @return Collision result list.
     */
    checkCollideAreas(): CollisionResult<CollisionArea>[] {
        if (!this.world) return [];
        return this._checkCollideByTargets(this.world.findCollidableAreas(this));
    }
}
