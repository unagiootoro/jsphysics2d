import { Test_Circle } from "./Test_Circle";
import { Test_Line } from "./Test_Line";
import { Test_Polygon } from "./Test_Polygon";
import { Test_SATChecker } from "./Test_SATChecker";
import { Test_QuadTree } from "./Test_QuadTree";
import { Test_World } from "./Test_World";
import { Test_CollisionObject } from "./Test_CollisionObject";
import { Test_CollisionArea } from "./Test_CollisionArea";
import { Test_CollisionBody } from "./Test_CollisionBody";
import { Test_KinematicBody } from "./Test_KinematicBody";
import { Test_Raycaster } from "./Test_Raycaster";
import { Test_ContactChecker } from "./Test_ContactChecker"
import { execTest } from "./utils";

if (process.argv.length >= 3) {
    let testcase, testmethod;
    const matchData = process.argv[2].match(/(.+)#(.+)/);
    if (matchData) {
        testcase = matchData[1];
        testmethod = matchData[2];
    } else {
        testcase = process.argv[2];
    }
    let testcaseClass;
    try {
        testcaseClass = eval(testcase);
    } catch (e) {
        // not process.
    }
    if (testcaseClass) {
        if (testmethod) {
            execTest([testcaseClass], { testCaseName: testmethod });
        } else {
            execTest([testcaseClass]);
        }
    }
} else {
    execTest([
        Test_Circle,
        Test_Line,
        Test_Polygon,
        Test_SATChecker,
        Test_QuadTree,
        Test_World,
        Test_CollisionObject,
        Test_CollisionArea,
        Test_CollisionBody,
        Test_KinematicBody,
        Test_Raycaster,
        Test_ContactChecker,
    ]);
}
