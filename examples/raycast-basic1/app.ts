import { Circle, RaycastResult, Raycaster } from "../../index";
import { KinematicBody } from "../../index";
import { Line } from "../../index";
import { Renderer } from "../../index";
import { Vec2 } from "../../index";
import { World } from "../../index";
import { Input } from "../../index";
import { Polygon } from "../../index";

const WorldWidth = 20;
const WorldHeight = 15;

const MainGroup = 0x01;
const WallCategory = 0x01;

let raycastBegin: Vec2 | undefined;
let raycastLine: Line | undefined;

window.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    document.body.appendChild(canvas);

    const world = new World(WorldWidth, WorldHeight);

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

    const terrain1PolygonVertices = [new Vec2(192 / 32, 0), new Vec2(256 / 32, 0), new Vec2(64 / 32, 128 / 32), new Vec2(0, 128 / 32)];
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

    const renderer = new Renderer(world, canvas, { pixelPerMeter: 32 });

    Input.init(canvas);

    const raycaster = new Raycaster(world, { group: MainGroup, mask: WallCategory });

    const loop = () => {
        Input.update();

        if (Input.isMouseDown(Input.MOUSE_LEFT)) {
            const worldPosition = Input.mousePosition().div(renderer.pixelPerMeter);
            if (raycastBegin == null) {
                raycastBegin = worldPosition;
            } else {
                const result = raycaster.raycast(raycastBegin, worldPosition);
                renderer.logs.raycastBeginX = raycastBegin.x;
                renderer.logs.raycastBeginY = raycastBegin.y;
                if (result.contact) {
                    renderer.logs.hit = true;
                    renderer.logs.raycastEndX = result.contact.x;
                    renderer.logs.raycastEndY = result.contact.y;
                    raycastLine = Line.fromBeginToEnd(raycastBegin, result.contact);
                } else {
                    renderer.logs.hit = false;
                    renderer.logs.raycastEndX = worldPosition.x;
                    renderer.logs.raycastEndY = worldPosition.y;
                    raycastLine = Line.fromBeginToEnd(raycastBegin, worldPosition);
                }
            }
        } else if (Input.isMouseUp(Input.MOUSE_LEFT)) {
            raycastBegin = undefined;
            renderer.logs.hit = undefined;
            renderer.logs.raycastBeginX = undefined;
            renderer.logs.raycastBeginY = undefined;
            renderer.logs.raycastEndX = undefined;
            renderer.logs.raycastEndY = undefined;
            raycastLine = undefined;
        }

        renderer.render();
        requestAnimationFrame(loop);
    };
    loop();
};
