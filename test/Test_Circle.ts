import { TestBase } from "./utils";
import { Circle, Vec2 } from "../index";

export class Test_Circle extends TestBase {
    test_toAABB() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 8);
        const aabb = circle.toAABB();
        this.assertEquals(aabb.x, 9.5);
        this.assertEquals(aabb.y, 7.5);
        this.assertEquals(aabb.x2, 10.5);
        this.assertEquals(aabb.y2, 8.5);
    }

    test_checkCollidePoint() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 8);
        this.assertEquals(circle.checkCollidePoint(new Vec2(10.1, 8.1)), true);
    }

    test_checkCollidePoint_2() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 8);
        this.assertEquals(circle.checkCollidePoint(new Vec2(10.5, 8.5)), false);
    }
}
