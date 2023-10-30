import { TestBase } from "./utils";
import { Circle } from "../index";
import { Polygon } from "../index";
import { Line } from "../index";
import { Vec2 } from "../index";
import { SATChecker } from "../index";

const EPSILON = 1e-7;

export class Test_SATChecker extends TestBase {
    test_Circle_projection() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const checker = new SATChecker();
        const { min, max } = checker.projection(circle, Vec2.RIGHT);
        this.assertEquals(min, 9.5);
        this.assertEquals(max, 10.5);
    }

    test_Polygon_projection() {
        const positions = [new Vec2(-0.5, -0.25), new Vec2(0.5, -0.25), new Vec2(0.5, 0.25), new Vec2(-0.5, 0.25)]
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 10);
        const checker = new SATChecker();
        const { min, max } = checker.projection(polygon, Vec2.RIGHT);
        this.assertInDelta(min, 9.5);
        this.assertInDelta(max, 10.5);
        const { min: min2, max: max2 } = checker.projection(polygon, Vec2.DOWN);
        this.assertInDelta(min2, 9.75);
        this.assertInDelta(max2, 10.25);
    }

    test_Circle_isCollidedCircle() {
        const circle1 = new Circle(0.5);
        circle1.position = new Vec2(10, 10);
        const circle2 = new Circle(0.5);
        circle2.position = new Vec2(10.5, 10.5);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle1, circle2)!;
        this.assertInDelta(depth.x, 0.2071);
        this.assertInDelta(depth.y, 0.2071);
    }

    test_Circle_isCollidedCircle_2() {
        const circle1 = new Circle(0.5);
        circle1.position = new Vec2(10, 10);
        const circle2 = new Circle(0.5);
        circle2.position = new Vec2(11, 11);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle1, circle2);
        this.assertEquals(depth, undefined);
    }

    test_Circle_isCollidedCircle_3() {
        const circle1 = new Circle(0.5);
        circle1.position = new Vec2(10, 10);
        const circle2 = new Circle(0.5);
        circle2.position = new Vec2(11, 10);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle1, circle2);
        this.assertEquals(depth, undefined);
    }

    test_Circle_isCollidedCircle_4() {
        const circle1 = new Circle(0.5);
        circle1.position = new Vec2(10, 10);
        const circle2 = new Circle(0.5);
        circle2.position = new Vec2(11 - EPSILON * 1.1, 10);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle1, circle2)!;
        this.assertInDelta(depth.x, 0);
        this.assertInDelta(depth.y, 0);
    }

    test_Circle_isCollidedPolygon() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10.5, 10.5);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle, polygon)!;
        this.assertInDelta(depth.x, 0.3535);
        this.assertInDelta(depth.y, 0.3535);
    }

    test_Circle_isCollidedPolygon_2() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(11, 11);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle, polygon);
        this.assertEquals(depth, undefined);
    }

    test_Circle_isCollidedPolygon_3() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 11);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle, polygon);
        this.assertEquals(depth, undefined);
    }

    test_Circle_isCollidedPolygon_4() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 11 - EPSILON * 1.1);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle, polygon)!;
        this.assertInDelta(depth.x, 0);
        this.assertInDelta(depth.y, 0);
    }

    test_Circle_isCollidedPolygon_5() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.25), new Vec2(0, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 9);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle, polygon);
        this.assertEquals(depth, undefined);
    }

    test_Circle_isCollidedPolygon_6() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.25), new Vec2(0, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 9 + EPSILON * 1.1);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle, polygon)!;
        this.assertInDelta(depth.x, 0);
        this.assertInDelta(depth.y, 0);
    }

    test_Circle_isCollidedPolygon_7() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 9 + 0.125);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle, polygon)!;
        this.assertInDelta(depth.x, 0);
        this.assertInDelta(depth.y, -0.125);
    }

    test_Circle_isCollidedLine() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const line = Line.fromBeginToEnd(new Vec2(9.5, 9.5 + 0.125), new Vec2(10.5, 9.5 + 0.125));
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(circle, line)!;
        this.assertInDelta(depth.x, 0);
        this.assertInDelta(depth.y, -0.125);
    }

    test_Line_isCollidedCircle() {
        const line = Line.fromBeginToEnd(new Vec2(9.5, 9.5 + 0.125), new Vec2(10.5, 9.5 + 0.125));
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(line, circle)!;
        this.assertInDelta(depth.x, 0);
        this.assertInDelta(depth.y, 0.125);
    }

    test_Polygon_isCollidedPolygon() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon1 = new Polygon(positions);
        polygon1.position = new Vec2(10, 10);
        const polygon2 = new Polygon(positions);
        polygon2.position = new Vec2(10.5, 10.5);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(polygon1, polygon2)!;
        this.assertInDelta(depth.x, 0);
        this.assertInDelta(depth.y, 0.5);
    }

    test_Polygon_isCollidedPolygon_2() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon1 = new Polygon(positions);
        polygon1.position = new Vec2(10, 10);
        const polygon2 = new Polygon(positions);
        polygon2.position = new Vec2(11, 11);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(polygon1, polygon2);
        this.assertEquals(depth, undefined);
    }

    test_Polygon_isCollidedPolygon_3() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon1 = new Polygon(positions);
        polygon1.position = new Vec2(10, 10);
        const polygon2 = new Polygon(positions);
        polygon2.position = new Vec2(11, 10);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(polygon1, polygon2);
        this.assertEquals(depth, undefined);
    }

    test_Polygon_isCollidedPolygon_4() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon1 = new Polygon(positions);
        polygon1.position = new Vec2(10, 10);
        const polygon2 = new Polygon(positions);
        polygon2.position = new Vec2(11 - EPSILON * 1.1, 10);
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(polygon1, polygon2)!;
        this.assertInDelta(depth.x, 0);
        this.assertInDelta(depth.y, 0);
    }

    test_Polygon_isCollidedLine() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 10);
        const line = Line.fromBeginToEnd(new Vec2(10.2, 10), new Vec2(11.2, 10));
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(polygon, line)!;
        this.assertInDelta(depth.x, 0.3);
        this.assertInDelta(depth.y, 0);
    }

    test_Polygon_isCollidedLine_2() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 10);
        const line = Line.fromBeginToEnd(new Vec2(10.5, 10), new Vec2(11.5, 10));
        const checker = new SATChecker();
        const depth = checker.checkSATCollision(polygon, line)!;
        this.assertEquals(depth, undefined);
    }
}
