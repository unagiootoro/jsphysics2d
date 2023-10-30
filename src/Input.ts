export class Input {
    static readonly KEY_A = 65;
    static readonly KEY_B = 66;
    static readonly KEY_C = 67;
    static readonly KEY_D = 68;
    static readonly KEY_E = 69;
    static readonly KEY_F = 70;
    static readonly KEY_G = 71;
    static readonly KEY_H = 72;
    static readonly KEY_I = 73;
    static readonly KEY_J = 74;
    static readonly KEY_K = 75;
    static readonly KEY_L = 76;
    static readonly KEY_M = 77;
    static readonly KEY_N = 78;
    static readonly KEY_O = 79;
    static readonly KEY_P = 80;
    static readonly KEY_Q = 81;
    static readonly KEY_R = 82;
    static readonly KEY_S = 83;
    static readonly KEY_T = 84;
    static readonly KEY_U = 85;
    static readonly KEY_V = 86;
    static readonly KEY_W = 87;
    static readonly KEY_X = 88;
    static readonly KEY_Y = 89;
    static readonly KEY_Z = 90;
    static readonly KEY_UP = 38;
    static readonly KEY_DOWN = 40;
    static readonly KEY_LEFT = 37;
    static readonly KEY_RIGHT = 39;
    static readonly KEY_SPACE = 32;

    private static _keySystem: KeySystem;

    static init() {
        this._keySystem = new KeySystem();
    }

    static update(): void {
        this._keySystem.update();
    }

    static isKeyPush(key: number) {
        return this._keySystem.isKeyPush(key);
    }

    static isKeyDown(key: number) {
        return this._keySystem.isKeyDown(key);
    }

    static isKeyUp(key: number) {
        return this._keySystem.isKeyUp(key);
    }

    static wasdDir4(): number | undefined {
        return this._keySystem.wasdDir4();
    }

    static wasdDir8(): number | undefined {
        return this._keySystem.wasdDir8();
    }

    static dir4(): number | undefined {
        return this._keySystem.dir4();
    }

    static dir8(): number | undefined {
        return this._keySystem.dir8();
    }
}

enum KeyState {
    UP,
    PUSH,
    DOWN
}

class KeySystem {
    private _keyState: Array<KeyState>;
    private _nextKeyState: Array<KeyState>;

    constructor() {
        this._keyState = new Array(245);
        this._nextKeyState = new Array(245);
        for (let i = 0; i < this._keyState.length; i++) {
            this._keyState[i] = KeyState.UP;
            this._nextKeyState[i] = this._keyState[i];
        }
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    update(): void {
        for (let i = 0; i < this._keyState.length; i++) {
            if (this._keyState[i] === KeyState.PUSH && this._nextKeyState[i] === KeyState.PUSH) {
                this._nextKeyState[i] = KeyState.DOWN;
            }
            this._keyState[i] = this._nextKeyState[i];
        }
    }

    isKeyPush(key: number) {
        return this._keyState[key] === KeyState.PUSH;
    }

    isKeyDown(key: number) {
        return this._keyState[key] === KeyState.PUSH || this._keyState[key] === KeyState.DOWN;
    }

    isKeyUp(key: number) {
        return this._keyState[key] === KeyState.UP;
    }

    dir4(): number | undefined {
        if (Input.isKeyDown(Input.KEY_UP)) {
            return 8;
        } else if (Input.isKeyDown(Input.KEY_RIGHT)) {
            return 6;
        } else if (Input.isKeyDown(Input.KEY_DOWN)) {
            return 2;
        } else if (Input.isKeyDown(Input.KEY_LEFT)) {
            return 4;
        }
    }

    dir8(): number | undefined {
        if (Input.isKeyDown(Input.KEY_UP) && Input.isKeyDown(Input.KEY_RIGHT)) {
            return 9;
        } else if (Input.isKeyDown(Input.KEY_RIGHT) && Input.isKeyDown(Input.KEY_DOWN)) {
            return 3;
        } else if (Input.isKeyDown(Input.KEY_DOWN) && Input.isKeyDown(Input.KEY_LEFT)) {
            return 1;
        } else if (Input.isKeyDown(Input.KEY_LEFT) && Input.isKeyDown(Input.KEY_UP)) {
            return 7;
        } else if (Input.isKeyDown(Input.KEY_UP)) {
            return 8;
        } else if (Input.isKeyDown(Input.KEY_RIGHT)) {
            return 6;
        } else if (Input.isKeyDown(Input.KEY_DOWN)) {
            return 2;
        } else if (Input.isKeyDown(Input.KEY_LEFT)) {
            return 4;
        }
    }

    wasdDir4(): number | undefined {
        if (Input.isKeyDown(Input.KEY_W)) {
            return 8;
        } else if (Input.isKeyDown(Input.KEY_D)) {
            return 6;
        } else if (Input.isKeyDown(Input.KEY_S)) {
            return 2;
        } else if (Input.isKeyDown(Input.KEY_A)) {
            return 4;
        }
    }

    wasdDir8(): number | undefined {
        if (Input.isKeyDown(Input.KEY_W) && Input.isKeyDown(Input.KEY_D)) {
            return 9;
        } else if (Input.isKeyDown(Input.KEY_D) && Input.isKeyDown(Input.KEY_S)) {
            return 3;
        } else if (Input.isKeyDown(Input.KEY_S) && Input.isKeyDown(Input.KEY_A)) {
            return 1;
        } else if (Input.isKeyDown(Input.KEY_A) && Input.isKeyDown(Input.KEY_W)) {
            return 7;
        } else if (Input.isKeyDown(Input.KEY_W)) {
            return 8;
        } else if (Input.isKeyDown(Input.KEY_D)) {
            return 6;
        } else if (Input.isKeyDown(Input.KEY_S)) {
            return 2;
        } else if (Input.isKeyDown(Input.KEY_A)) {
            return 4;
        }
    }

    private onKeyDown(e: KeyboardEvent) {
        switch (this._keyState[e.keyCode]) {
            case KeyState.UP:
                this._nextKeyState[e.keyCode] = KeyState.PUSH;
                break;
            case KeyState.PUSH:
                this._nextKeyState[e.keyCode] = KeyState.DOWN;
                break;
        }
    }

    private onKeyUp(e: KeyboardEvent) {
        this._nextKeyState[e.keyCode] = KeyState.UP;
    }
}
