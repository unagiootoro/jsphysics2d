import { TestBase } from "./utils";
import { Polygon, Vec2 } from "../index";

export class Test_Polygon extends TestBase {
    test_toAABB() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 8);
        const aabb = polygon.toAABB();
        this.assertEquals(aabb.x, 9.5);
        this.assertEquals(aabb.y, 7.5);
        this.assertEquals(aabb.x2, 10.5);
        this.assertEquals(aabb.y2, 8.5);
    }

    test_worldVertices() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.anchor = new Vec2(0, -0.25);
        polygon.position = new Vec2(10, 8);
        polygon.angle = Math.PI / 2;
        const worldVertices = polygon.worldVertices();
        this.assertEquals(worldVertices[0].x, 10.25);
        this.assertEquals(worldVertices[0].y, 7.5);
        this.assertEquals(worldVertices[1].x, 10.25);
        this.assertEquals(worldVertices[1].y, 8.5);
        this.assertEquals(worldVertices[2].x, 9.25);
        this.assertEquals(worldVertices[2].y, 8.5);
        this.assertEquals(worldVertices[3].x, 9.25);
        this.assertEquals(worldVertices[3].y, 7.5);
    }
}
