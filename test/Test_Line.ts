import { TestBase } from "./utils";
import { Circle, Line, Vec2 } from "../index";

export class Test_Line extends TestBase {
    test_toAABB() {
        const line = Line.fromBeginToEnd(new Vec2(10, 8), new Vec2(10.5, 8.5));
        const aabb = line.toAABB();
        this.assertEquals(aabb.x, 10);
        this.assertEquals(aabb.y, 8);
        this.assertEquals(aabb.x2, 10.5);
        this.assertEquals(aabb.y2, 8.5);
    }

    test_checkCollidePoint() {
        const line = Line.fromBeginToEnd(new Vec2(2, 2), new Vec2(3, 3));
        this.assertEquals(line.checkCollidePoint(new Vec2(2.5, 2.5)), true);
    }

    test_checkCollidePoint_2() {
        const line = Line.fromBeginToEnd(new Vec2(2, 2), new Vec2(3, 3));
        this.assertEquals(line.checkCollidePoint(new Vec2(2.6, 2.5)), false);
    }

    test_checkCollidePoint_3() {
        const line = Line.fromBeginToEnd(new Vec2(2, 2), new Vec2(3, 3));
        this.assertEquals(line.checkCollidePoint(new Vec2(1.5, 1.5)), false);
    }
}
