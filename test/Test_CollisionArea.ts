import { TestBase } from "./utils";
import { Circle, Vec2, World, CollisionBody, CollisionArea } from "../index";

class TestCollisionBody extends CollisionBody {
}

class TestCollisionArea extends CollisionArea {
}

export class Test_CollisionArea extends TestBase {
    test_checkCollideAreas() {
        const world = new World(20, 20);

        const circle1 = new Circle(0.5);
        const area = new TestCollisionArea(circle1, { group: 0x01, category: 0x01, mask: 0x01 });
        area.position = new Vec2(10, 10);
        world.add(area);

        const circle2 = new Circle(0.5);
        const area2 = new TestCollisionArea(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        area2.position = new Vec2(10.5, 10);
        world.add(area2);

        const body = new TestCollisionBody(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        body.position = new Vec2(10.5, 10);
        world.add(body);

        const results = area.checkCollideAreas();
        this.assertEquals(results.length, 1);
        this.assertEquals(results[0].object, area2);
    }

    test_checkCollideBodies() {
        const world = new World(20, 20);

        const circle1 = new Circle(0.5);
        const area = new TestCollisionArea(circle1, { group: 0x01, category: 0x01, mask: 0x01 });
        area.position = new Vec2(10, 10);
        world.add(area);

        const circle2 = new Circle(0.5);
        const area2 = new TestCollisionArea(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        area2.position = new Vec2(10.5, 10);
        world.add(area2);

        const body = new TestCollisionBody(circle2, { group: 0x01, category: 0x01, mask: 0x01 });
        body.position = new Vec2(10.5, 10);
        world.add(body);

        const results = area.checkCollideBodies();
        this.assertEquals(results.length, 1);
        this.assertEquals(results[0].object, body);
    }
}
