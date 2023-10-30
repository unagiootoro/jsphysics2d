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
}
