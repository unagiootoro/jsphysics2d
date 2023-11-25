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

    test_worldVertices() {
        const line = new Line(new Vec2(1, 0));
        line.anchor = new Vec2(-0.25, 0);
        line.position = new Vec2(10, 8);
        line.angle = Math.PI / 2;
        const worldVertices = line.worldVertices();
        this.assertEquals(worldVertices[0].x, 10);
        this.assertEquals(worldVertices[0].y, 7.75);
        this.assertEquals(worldVertices[1].x, 10);
        this.assertEquals(worldVertices[1].y, 8.75);
    }

    test_intersect() {
        const line1 = Line.fromBeginToEnd(new Vec2(0, 0), new Vec2(1, 1));
        const line2 = Line.fromBeginToEnd(new Vec2(1, 0), new Vec2(0, 1));
        const intersect = line1.intersectLine(line2)!;
        this.assertInDelta(intersect.x, 0.5);
        this.assertInDelta(intersect.y, 0.5);
    }

    test_intersect2() {
        const line1 = Line.fromBeginToEnd(new Vec2(0, 0), new Vec2(1, 1));
        const line2 = Line.fromBeginToEnd(new Vec2(1, 0), new Vec2(1, 1));
        const intersect = line1.intersectLine(line2);
        this.assertEquals(intersect, undefined);
    }

    test_intersect3() {
        const line1 = Line.fromBeginToEnd(new Vec2(0, 0), new Vec2(2, 1));
        const line2 = Line.fromBeginToEnd(new Vec2(1.5, 0.25), new Vec2(0.5, 1.3));
        const intersect = line1.intersectLine(line2)!;
        this.assertInDelta(intersect.x, 1.1774);
        this.assertInDelta(intersect.y, 0.5887);
    }

    test_intersectCircle() {
        const line = Line.fromBeginToEnd(new Vec2(0, 0.7), new Vec2(1, 0.7));
        const circle = new Circle(0.4);
        circle.position = new Vec2(0.5, 0.5);
        const result = line.intersectCircle(circle)!;
        this.assertEquals(result.length, 2);
        const [intersect1, intersect2] = result;
        this.assertInDelta(intersect1.x, 0.1535);
        this.assertInDelta(intersect1.y, 0.7);
        this.assertInDelta(intersect2.x, 0.8464);
        this.assertInDelta(intersect2.y, 0.7);
    }

    test_intersectCircle_2() {
        const line = Line.fromBeginToEnd(new Vec2(0, 0.7), new Vec2(0.5, 0.7));
        const circle = new Circle(0.4);
        circle.position = new Vec2(0.5, 0.5);
        const result = line.intersectCircle(circle)!;
        this.assertEquals(result.length, 1);
        const [intersect1] = result;
        this.assertInDelta(intersect1.x, 0.1535);
        this.assertInDelta(intersect1.y, 0.7);
    }

    test_intersectCircle_3() {
        const line = Line.fromBeginToEnd(new Vec2(0, 0.1), new Vec2(1, 0.1));
        const circle = new Circle(0.4);
        circle.position = new Vec2(0.5, 0.5);
        const result = line.intersectCircle(circle);
        this.assertEquals(result.length, 0);
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
