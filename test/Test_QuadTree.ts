import { TestBase } from "./utils";
import { Polygon, Vec2, QuadTree, KinematicBody } from "../index";

export class Test_QuadTree extends TestBase {
    test_add() {
        const tree = new QuadTree(8, 8, 3);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(6.5, 4.5);
        const body = new KinematicBody(polygon);
        tree.add(body);
        this.assertEqualsArray((tree as any)._linear[73], [body]);
    }

    test_remove() {
        const tree = new QuadTree(8, 8, 3);
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(6.5, 4.5);
        const body = new KinematicBody(polygon);
        tree.add(body);
        tree.remove(body);
        this.assertEqualsArray((tree as any)._linear[73], []);
    }

    test_updateObject() {
        const tree = new QuadTree(8, 8, 3);

        const positions = [new Vec2(-0.49, -0.49), new Vec2(0.49, -0.49), new Vec2(0.49, 0.49), new Vec2(-0.49, 0.49)];
        const polygon = new Polygon(positions);
        const body1 = new KinematicBody(polygon);
        body1.position = new Vec2(6.5, 4.5);
        tree.add(body1);
        this.assertEqualsArray((tree as any)._linear[73], [body1]);

        body1.position = new Vec2(1.5, 2.5);
        tree.updateObject(body1);
        this.assertEqualsArray((tree as any)._linear[30], [body1]);
    }

    test_findCollidableObjects() {
        const tree = new QuadTree(8, 8, 3);

        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(6.5, 4.5);
        const body1 = new KinematicBody(polygon);
        tree.add(body1);

        const positions2 = [new Vec2(-1, -1), new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1)];
        const polygon2 = new Polygon(positions2);
        polygon2.position = new Vec2(6, 4);
        const body2 = new KinematicBody(polygon2);
        tree.add(body2);

        const positions3 = [new Vec2(-1, -1), new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1)];
        const polygon3 = new Polygon(positions3);
        polygon3.position = new Vec2(1, 2);
        const body3 = new KinematicBody(polygon3);
        tree.add(body3);

        this.assertEqualsArray(tree.findCollidableObjects(body1), [body2]);
    }

    test_findObjectsByPoint() {
        const tree = new QuadTree(8, 8, 3);

        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(6.5, 4.5);
        const body1 = new KinematicBody(polygon);
        tree.add(body1);

        const positions2 = [new Vec2(-1, -1), new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1)];
        const polygon2 = new Polygon(positions2);
        polygon2.position = new Vec2(6, 4);
        const body2 = new KinematicBody(polygon2);
        tree.add(body2);

        const positions3 = [new Vec2(-1, -1), new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1)];
        const polygon3 = new Polygon(positions3);
        polygon3.position = new Vec2(1, 2);
        const body3 = new KinematicBody(polygon3);
        tree.add(body3);

        this.assertEqualsArray(tree.findObjectsByPoint(new Vec2(6.5, 4.5)), [body1, body2]);
    }
}
