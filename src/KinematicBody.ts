import { CollisionBody } from "./CollisionBody";
import { CollisionResult } from "./CollisionResult";
import { Vec2 } from "./Vec2";
import { EPSILON } from "./utils";

/**
 * This class handles geometric bodies that are not affected by physical calculations.
 */
export class KinematicBody extends CollisionBody {
    static MAX_COLLISION_RESOLVE_COUNT = 8;

    /**
     * Move the body at delta velocity.
     * @param deltaVelocity Delta velocity.
     * @return Collision result list.
     */
    move(deltaVelocity: Vec2): CollisionResult<CollisionBody>[] {
        if (!this.world) return [];
        const prevPosition = this.position;
        this.position = this.position.add(deltaVelocity);
        const [resolved, results] = this._collisionResolve();
        if (!resolved) {
            this.position = prevPosition;
        }
        return results;
    }

    /**
     * Rotate the body to the specified angle.
     * @param angle Angle.
     * @return Collision result list.
     */
    rotate(angle: number): CollisionResult<CollisionBody>[] {
        if (!this.world) return [];
        const prevAngle = this.angle;
        const prevPosition = this.position;
        this.angle = angle;
        const [resolved, results] = this._collisionResolve();
        if (!resolved) {
            this.angle = prevAngle;
            this.position = prevPosition;
        }
        return results;
    }

    private _collisionResolve(): [boolean, CollisionResult<CollisionBody>[]] {
        let collisionResults: CollisionResult<CollisionBody>[] = [];

        for (let i = 0; i < KinematicBody.MAX_COLLISION_RESOLVE_COUNT; i++) {
            let maxDepth: Vec2 | undefined;
            const results = this.checkCollideBodies();
            if (i === 0) {
                collisionResults = results;
            }
            for (const result of results) {
                const depth = result.depth;
                if (!maxDepth || maxDepth.magnitude < depth.magnitude) {
                    maxDepth = depth;
                }
            }
            if (maxDepth && maxDepth.magnitude >= EPSILON) {
                this.position = this.position.sub(maxDepth);
            } else {
                return [true, collisionResults];
            }
        }

        return [false, collisionResults];
    }
}
