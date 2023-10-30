import { TestBase } from "./utils";
import { KinematicBody, Polygon, Vec2, World } from "../index";

export class Test_KinematicBody extends TestBase {
    test_move() {
        const world = new World(20, 20);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon1 = new Polygon(positions);
        const polygon2 = new Polygon(positions);

        const body1 = new KinematicBody(polygon1, { group: 0x01, category: 0x01, mask: 0x01 });
        body1.position = new Vec2(10, 10);
        world.add(body1);

        const body2 = new KinematicBody(polygon2, { group: 0x01, category: 0x01, mask: 0x01 });
        body2.position = new Vec2(11.1, 10);
        world.add(body2);

        const results = body1.move(new Vec2(0.2, 0));
        this.assertInDelta(body1.position.x, 10.1);
        this.assertInDelta(body1.position.y, 10);
        this.assertInDelta(results.length, 1);
    }
}
