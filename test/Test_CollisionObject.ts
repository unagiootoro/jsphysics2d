import { TestBase } from "./utils";
import { CollisionObject, Circle, Vec2, World } from "../index";

const EPSILON = 1e-7;

class TestCollisionObject extends CollisionObject {
}

export class Test_CollisionObject extends TestBase {
    test_checkCollidePoint() {
        const world = new World(20, 20);
        const circle = new Circle(0.5);

        const body1 = new TestCollisionObject(circle);
        body1.position = new Vec2(10, 10);
        world.add(body1);

        this.assertEquals(body1.checkCollidePoint(new Vec2(10.5 - EPSILON * 2, 10)), true);
    }

    test_checkCollidePoint_2() {
        const world = new World(20, 20);
        const circle = new Circle(0.5);

        const body1 = new TestCollisionObject(circle);
        body1.position = new Vec2(10, 10);
        world.add(body1);

        this.assertEquals(body1.checkCollidePoint(new Vec2(10.5, 10)), false);
        this.assertEquals(body1.checkCollidePoint(new Vec2(20, 20)), false);
    }

    test_checkCollideObjects() {
        const world = new World(20, 20);

        const circle1 = new Circle(0.5);
        const body1 = new TestCollisionObject(circle1, { group: 0x01, category: 0x01, mask: 0x01 });
        body1.position = new Vec2(10, 10);
        world.add(body1);

        const circle2 = new Circle(0.5);
        const body2 = new TestCollisionObject(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        body2.position = new Vec2(10.5, 10);
        world.add(body2);

        const circle3 = new Circle(0.5);
        const body3 = new TestCollisionObject(circle3, { group: 0x01, category: 0x01, mask: 0x01 });
        body3.position = new Vec2(15, 15);
        world.add(body3);

        const results = body1.checkCollideObjects();
        this.assertEquals(results.length, 1);
        this.assertInDelta(results[0].depth.x, 0.5);
        this.assertInDelta(results[0].depth.y, 0);
    }
}
