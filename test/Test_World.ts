import { TestBase } from "./utils";
import { KinematicBody, Polygon, Vec2, World } from "../index";

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
}
