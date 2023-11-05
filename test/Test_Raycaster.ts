import { TestBase } from "./utils";
import { Circle, Line, Vec2, World, Raycaster, KinematicBody, Rect } from "../index";

export class Test_Raycaster extends TestBase {
    test_raycast_Line() {
        const world = new World(20, 20);

        const line = Line.fromBeginToEnd(new Vec2(11, 10), new Vec2(11, 11));
        const lineBody = new KinematicBody(line, { group: 0x01, category: 0x01, mask: 0x01 });
        world.add(lineBody);

        const line2 = Line.fromBeginToEnd(new Vec2(12, 10), new Vec2(12, 11));
        const lineBody2 = new KinematicBody(line2, { group: 0x01, category: 0x01, mask: 0x01 });
        world.add(lineBody2);

        const raycaster = new Raycaster(world, { group: 0x01, category: 0x01, mask: 0x01 });
        const result = raycaster.raycast(new Vec2(10, 10.5), new Vec2(13, 10.5));
        this.assertInDelta(result.contact!.x, 11);
        this.assertInDelta(result.contact!.y, 10.5);
        this.assertEquals(result.body!, lineBody);
    }

    // Raycast from the opposite direction
    test_raycast_Line2() {
        const world = new World(20, 20);

        const line = Line.fromBeginToEnd(new Vec2(11, 10), new Vec2(11, 11));
        const lineBody = new KinematicBody(line, { group: 0x01, category: 0x01, mask: 0x01 });
        world.add(lineBody);

        const line2 = Line.fromBeginToEnd(new Vec2(12, 10), new Vec2(12, 11));
        const lineBody2 = new KinematicBody(line2, { group: 0x01, category: 0x01, mask: 0x01 });
        world.add(lineBody2);

        const raycaster = new Raycaster(world, { group: 0x01, category: 0x01, mask: 0x01 });
        const result = raycaster.raycast(new Vec2(13, 10.5), new Vec2(10, 10.5));
        this.assertInDelta(result.contact!.x, 12);
        this.assertInDelta(result.contact!.y, 10.5);
        this.assertEquals(result.body!, lineBody2);
    }

    test_raycast_Circle() {
        const world = new World(20, 20);

        const circle = new Circle(0.5);
        const circleBody = new KinematicBody(circle, { group: 0x01, category: 0x01, mask: 0x01 });
        circleBody.position = new Vec2(11.5, 10.5);
        world.add(circleBody);

        const line2 = Line.fromBeginToEnd(new Vec2(13, 10), new Vec2(13, 11));
        const lineBody2 = new KinematicBody(line2, { group: 0x01, category: 0x01, mask: 0x01 });
        world.add(lineBody2);

        const raycaster = new Raycaster(world, { group: 0x01, category: 0x01, mask: 0x01 });
        const result = raycaster.raycast(new Vec2(10, 10.5), new Vec2(14, 10.5));
        this.assertInDelta(result.contact!.x, 11);
        this.assertInDelta(result.contact!.y, 10.5);
        this.assertEquals(result.body!, circleBody);
    }

    test_raycast_Polygon() {
        const world = new World(20, 20);

        const rect = new Rect(new Vec2(1, 1));
        const rectBody = new KinematicBody(rect, { group: 0x01, category: 0x01, mask: 0x01 });
        rectBody.position = new Vec2(11.5, 10.5);
        world.add(rectBody);

        const line2 = Line.fromBeginToEnd(new Vec2(13, 10), new Vec2(13, 11));
        const lineBody2 = new KinematicBody(line2, { group: 0x01, category: 0x01, mask: 0x01 });
        world.add(lineBody2);

        const raycaster = new Raycaster(world, { group: 0x01, category: 0x01, mask: 0x01 });
        const result = raycaster.raycast(new Vec2(10, 10.5), new Vec2(14, 10.5));
        this.assertInDelta(result.contact!.x, 11);
        this.assertInDelta(result.contact!.y, 10.5);
        this.assertEquals(result.body!, rectBody);
    }
}
