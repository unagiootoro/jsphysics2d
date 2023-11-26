import { Circle } from "../../index";
import { KinematicBody } from "../../index";
import { Line } from "../../index";
import { Renderer } from "../../index";
import { Vec2 } from "../../index";
import { World } from "../../index";
import { Input } from "../../index";
import { Polygon } from "../../index";
import { Rect } from "../../index";

const WorldWidth = 20;
const WorldHeight = 15;

const MainGroup = 0x01;
const WallCategory = 0x01;

window.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    document.body.appendChild(canvas);

    const world = new World(WorldWidth, WorldHeight);

    const polygon = new Rect(new Vec2(1, 1));
    const body = new KinematicBody(polygon, { group: MainGroup, mask: WallCategory });
    body.position = new Vec2(8, 1);
    body.meta.fillStyle = "#ff0000ff";
    world.add(body);

    const wallTopLine = Line.fromBeginToEnd(new Vec2(0, 0), new Vec2(WorldWidth, 0));
    const wallTop = new KinematicBody(wallTopLine, { group: MainGroup, category: WallCategory });
    world.add(wallTop);

    const wallRightLine = Line.fromBeginToEnd(new Vec2(WorldWidth, 0), new Vec2(WorldWidth, WorldHeight));
    const wallRight = new KinematicBody(wallRightLine, { group: MainGroup, category: WallCategory });
    world.add(wallRight);

    const wallBottonLine = Line.fromBeginToEnd(new Vec2(0, WorldHeight), new Vec2(WorldWidth, WorldHeight));
    const wallBotton = new KinematicBody(wallBottonLine, { group: MainGroup, category: WallCategory });
    world.add(wallBotton);

    const wallLeftLine = Line.fromBeginToEnd(new Vec2(0, 0), new Vec2(0, WorldHeight));
    const wallLeft = new KinematicBody(wallLeftLine, { group: MainGroup, category: WallCategory });
    world.add(wallLeft);

    const terrain1PolygonVertices = [new Vec2(6, 0), new Vec2(8, 0), new Vec2(2, 4), new Vec2(0, 4)];
    const terrain1Polygon = new Polygon(terrain1PolygonVertices);
    const terrain1 = new KinematicBody(terrain1Polygon, { group: MainGroup, category: WallCategory });
    terrain1.position = new Vec2(2, 4);
    terrain1.meta.fillStyle = "#00ff00ff";
    world.add(terrain1);

    const terrain2Circle = new Circle(2);
    const terrain2 = new KinematicBody(terrain2Circle, { group: MainGroup, category: WallCategory });
    terrain2.position = new Vec2(14, 8);
    terrain2.meta.fillStyle = "#ffff00ff";
    world.add(terrain2);

    const renderer = new Renderer(world, canvas);

    Input.init(canvas);

    const loop = () => {
        Input.update();
        const delta = 1 / 60;
        const speed = 16;
        const velocity = Vec2.fromDirection(Input.dir8() ?? 0)?.mul(speed);
        if (velocity) {
            body.move(velocity.mul(delta));
        }
        const angularSpeed = 2;
        if (Input.isKeyDown(Input.KEY_Q)) {
            body.rotate(body.angle - angularSpeed * delta);
        } else if (Input.isKeyDown(Input.KEY_W)) {
            body.rotate(body.angle + angularSpeed * delta);
        }
        renderer.logs.x = body.position.x;
        renderer.logs.y = body.position.y;
        renderer.render();
        requestAnimationFrame(loop);
    };
    loop();
};
