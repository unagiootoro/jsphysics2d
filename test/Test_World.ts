import { TestBase } from "./utils";
import { Circle, KinematicBody, Polygon, Vec2, World } from "../index";

export class Test_World extends TestBase {
    test_add() {
        const world = new World(8, 8, { maxQuadTreeLevel: 3 });
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        const body1 = new KinematicBody(polygon);
        body1.position = new Vec2(6.5, 4.5);
        world.add(body1);
        this.assertEqualsArray([...world.findObjectsByPoint(new Vec2(6.5, 4.5))], [body1]);
    }

    test_remove() {
        const world = new World(8, 8, { maxQuadTreeLevel: 3 });
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        const body1 = new KinematicBody(polygon);
        body1.position = new Vec2(6.5, 4.5);
        world.add(body1);
        world.remove(body1);
        this.assertEqualsArray([...world.findObjectsByPoint(new Vec2(6.5, 4.5))], []);
    }

    test_updateBody() {
        const world = new World(8, 8, { maxQuadTreeLevel: 3 });
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        const body1 = new KinematicBody(polygon);
        body1.position = new Vec2(6.5, 4.5);
        world.add(body1);
        this.assertEqualsArray([...world.findObjectsByPoint(new Vec2(6.5, 4.5))], [body1]);

        body1.position = new Vec2(1.5, 2.5); // Execute World#updateBody when position update.
        this.assertEqualsArray([...world.findObjectsByPoint(new Vec2(6.5, 4.5))], []);
    }

    test_checkCollideObjectsByPoint() {
        const world = new World(20, 20);
        const circle = new Circle(0.5);

        const body1 = new KinematicBody(circle);
        body1.position = new Vec2(10, 10);
        world.add(body1);

        const body2 = new KinematicBody(circle);
        body2.position = new Vec2(10.25, 10.25);
        world.add(body2);

        const body3 = new KinematicBody(circle);
        body3.position = new Vec2(15, 15);
        world.add(body3);

        this.assertEqualsArray(world.checkCollideObjectsByPoint(new Vec2(10, 10)), [body1, body2]);
    }

    test_resize() {
        const world = new World(8, 8, { maxQuadTreeLevel: 3 });
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        const body1 = new KinematicBody(polygon);
        body1.position = new Vec2(6.5, 4.5);
        world.add(body1);
        world.resize(32, 16, { maxQuadTreeLevel: 3 });
        this.assertEquals(world.width, 32);
        this.assertEquals(world.height, 16);
        this.assertEqualsArray([...world.findObjectsByPoint(new Vec2(6.5, 4.5))], [body1]);
    }
}
