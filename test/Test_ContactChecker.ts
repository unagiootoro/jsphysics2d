import { TestBase } from "./utils";
import { Circle, Line, Polygon, SATChecker, Vec2 } from "../index";
import { ContactChecker } from "../src/ContactChecker";

export class Test_ContactChecker extends TestBase {
    test_checkContacts_PolygonAndLine() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 10);
        const line = Line.fromBeginToEnd(new Vec2(10.2, 10), new Vec2(11.2, 10));
        const satChecker = new SATChecker();
        const depth = satChecker.checkSATCollision(polygon, line)!;

        const contactChecker = new ContactChecker();
        const contacts = contactChecker.checkContacts(polygon, line, depth);
        this.assertEquals(contacts.length, 1);
        this.assertInDelta(contacts[0].x, 10.5);
        this.assertInDelta(contacts[0].y, 10);
    }

    test_checkContacts_PolygonAndLine_2() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon = new Polygon(positions);
        polygon.position = new Vec2(10, 10);
        const line = Line.fromBeginToEnd(new Vec2(9.8, 8), new Vec2(9.8, 12));
        const satChecker = new SATChecker();
        const depth = satChecker.checkSATCollision(polygon, line)!;

        const contactChecker = new ContactChecker();
        const contacts = contactChecker.checkContacts(polygon, line, depth);
        this.assertEquals(contacts.length, 2);
        this.assertInDelta(contacts[0].x, 9.8);
        this.assertInDelta(contacts[0].y, 9.5);
        this.assertInDelta(contacts[1].x, 9.8);
        this.assertInDelta(contacts[1].y, 10.5);
    }

    test_checkContacts_PolygonAndPolygon() {
        const positions = [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)]
        const polygon1 = new Polygon(positions);
        polygon1.position = new Vec2(10, 10);
        const polygon2 = new Polygon(positions);
        polygon2.position = new Vec2(10.2, 10.2);
        const satChecker = new SATChecker();
        const depth = satChecker.checkSATCollision(polygon1, polygon2)!;

        const contactChecker = new ContactChecker();
        const contacts = contactChecker.checkContacts(polygon1, polygon2, depth);
        this.assertEquals(contacts.length, 2);
        this.assertInDelta(contacts[0].x, 10.5);
        this.assertInDelta(contacts[0].y, 9.7);
        this.assertInDelta(contacts[1].x, 9.7);
        this.assertInDelta(contacts[1].y, 10.5);
    }

    test_checkContacts_CircleAndLine() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const line = Line.fromBeginToEnd(new Vec2(10.2, 10), new Vec2(11.2, 10));
        const satChecker = new SATChecker();
        const depth = satChecker.checkSATCollision(circle, line)!;

        const contactChecker = new ContactChecker();
        const contacts = contactChecker.checkContacts(circle, line, depth);
        this.assertEquals(contacts.length, 1);
        this.assertInDelta(contacts[0].x, 10.5);
        this.assertInDelta(contacts[0].y, 10);
    }

    test_checkContacts_CircleAndLine_2() {
        const circle = new Circle(0.5);
        circle.position = new Vec2(10, 10);
        const line = Line.fromBeginToEnd(new Vec2(9.8, 8), new Vec2(9.8, 12));
        const satChecker = new SATChecker();
        const depth = satChecker.checkSATCollision(circle, line)!;

        const contactChecker = new ContactChecker();
        const contacts = contactChecker.checkContacts(circle, line, depth);
        this.assertEquals(contacts.length, 1);
        this.assertInDelta(contacts[0].x, 9.8);
        this.assertInDelta(contacts[0].y, 10);
    }

    test_checkContacts_CircleAndCircle() {
        const circle1 = new Circle(0.5);
        circle1.position = new Vec2(10, 10);

        const circle2 = new Circle(0.5);
        circle2.position = new Vec2(10.2, 10.2);

        const satChecker = new SATChecker();
        const depth = satChecker.checkSATCollision(circle1, circle2)!;

        const contactChecker = new ContactChecker();
        const contacts = contactChecker.checkContacts(circle1, circle2, depth);
        this.assertEquals(contacts.length, 1);
        this.assertInDelta(contacts[0].x, 9.6464);
        this.assertInDelta(contacts[0].y, 9.6464);
    }
}
