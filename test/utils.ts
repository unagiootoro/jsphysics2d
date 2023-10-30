export class TestBase {
    executingTestName: string = "";

    async execAllTest(): Promise<void> {
        for (const name of Object.getOwnPropertyNames(this.constructor.prototype)) {
            const matchData = name.match(/test_.+/);
            if (matchData) {
                await this.startTest(name);
            }
        }
    }

    async execTest(testCaseName: string): Promise<void> {
        const matchData = testCaseName.match(/test_.+/);
        if (matchData && !!(this as any)[testCaseName]) {
            await this.startTest(testCaseName);
        }
    }

    private async startTest(testCaseName: string): Promise<void> {
        console.log(`exec: ${this.constructor.name}#${testCaseName}`);
        this.executingTestName = testCaseName;
        await (this as any)[testCaseName]();
    }

    assert(test: boolean): void {
        if (!test) {
            throw new Error(`${this.executingTestName} is failed.`);
        }
    }

    assertEquals(actual: any, expected: any): void {
        if (actual !== expected) {
            throw new Error(`${this.executingTestName} is failed. (actual = ${actual}, expected = ${expected})`);
        }
    }

    assertEqualsObject(actual: { [key: string]: any }, expected: { [key: string]: any }): void {
        for (const key in expected) {
            const v1 = actual[key];
            const v2 = expected[key];
            if (v1 !== v2) {
                throw new Error(`${this.executingTestName} is failed. (actual = ${JSON.stringify(actual)}, expected = ${JSON.stringify(expected)})`);
            }
        }
    }

    assertEqualsArray(actual: ArrayLike<any>, expected: ArrayLike<any>): void {
        let failed = false;
        if (actual.length !== expected.length) {
            failed = true;
        }
        if (!failed) {
            for (let i = 0; i < actual.length; i++) {
                if (actual[i] !== expected[i]) {
                    failed = true;
                    break;
                }
            }
        }
        if (failed) {
            throw new Error(`${this.executingTestName} is failed. (actual = ${JSON.stringify(actual)}, expected = ${JSON.stringify(expected)})`);
        }
    }

    assertInDelta(actual: any, expected: any, delta = 1e-4): void {
        if (typeof actual !== "number" || Math.abs(actual - expected) > delta) {
            throw new Error(`${this.executingTestName} is failed. (actual = ${actual}, expected = ${expected})`);
        }
    }
}

export async function execTest(testClasses: (new () => TestBase)[], opt: { testCaseName?: string } = {}): Promise<void> {
    for (const testClass of testClasses) {
        if (opt.testCaseName) {
            await new testClass().execTest(opt.testCaseName);
            break;
        } else {
            await new testClass().execAllTest();
        }
    }
    console.log("All tests were completed with a pass.");
}

export function saveCanvas(filePath: string, canvas: HTMLCanvasElement): void {
    const fs = require("fs");
    const dataUrl = canvas.toDataURL("image/png");
    const base64Img = dataUrl.split(",")[1];
    const base64Buf = new Buffer(base64Img, "base64");
    fs.writeFileSync(filePath, base64Buf);
}

export function compareCanvas(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement): boolean {
    const ctx1 = canvas1.getContext("2d")!;
    const imageData1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    const ctx2 = canvas2.getContext("2d")!;
    const imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    if (imageData1.data.length !== imageData2.data.length) {
        return false;
    }
    for (let i = 0; i < imageData1.data.length; i++) {
        if (imageData1.data[i] !== imageData2.data[i]) {
            return false;
        }
    }
    return true;
}
