import { TestBase } from "./utils";
import { Circle, Vec2, World, CollisionBody, CollisionArea } from "../index";

class TestCollisionBody extends CollisionBody {
}

class TestCollisionArea extends CollisionArea {
}

export class Test_CollisionBody extends TestBase {
    test_checkCollideBodies() {
        const world = new World(20, 20);

        const circle1 = new Circle(0.5);
        const body1 = new TestCollisionBody(circle1, { group: 0x01, category: 0x01, mask: 0x01 });
        body1.position = new Vec2(10, 10);
        world.add(body1);

        const circle2 = new Circle(0.5);
        const body2 = new TestCollisionBody(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        body2.position = new Vec2(10.5, 10);
        world.add(body2);

        const area = new TestCollisionArea(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        area.position = new Vec2(10.5, 10);
        world.add(area);

        const results = body1.checkCollideBodies();
        this.assertEquals(results.length, 1);
        this.assertEquals(results[0].object, body2);
    }

    test_checkCollideAreas() {
        const world = new World(20, 20);

        const circle1 = new Circle(0.5);
        const body1 = new TestCollisionBody(circle1, { group: 0x01, category: 0x01, mask: 0x01 });
        body1.position = new Vec2(10, 10);
        world.add(body1);

        const circle2 = new Circle(0.5);
        const body2 = new TestCollisionBody(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        body2.position = new Vec2(10.5, 10);
        world.add(body2);

        const area = new TestCollisionArea(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        area.position = new Vec2(10.5, 10);
        world.add(area);

        const results = body1.checkCollideAreas();
        this.assertEquals(results.length, 1);
        this.assertEquals(results[0].object, area);
    }
}
