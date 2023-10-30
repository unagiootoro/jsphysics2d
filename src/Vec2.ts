export class Vec2 {
    private _x: number;
    private _y: number;
    private _length?: number;
    private _rad?: number;

    static readonly ZERO = new Vec2(0, 0);
    static readonly UP = Vec2.polar(Math.PI + Math.PI / 2, 1);
    static readonly UP_RIGHT = Vec2.polar(Math.PI + Math.PI / 2 + Math.PI / 4, 1);
    static readonly RIGHT = Vec2.polar(0, 1);
    static readonly RIGHT_DOWN = Vec2.polar(Math.PI / 4, 1);
    static readonly DOWN = Vec2.polar(Math.PI / 2, 1);
    static readonly DOWN_LEFT = Vec2.polar(Math.PI / 2 + Math.PI / 4, 1);
    static readonly LEFT = Vec2.polar(Math.PI, 1);
    static readonly LEFT_UP = Vec2.polar(Math.PI + Math.PI / 4, 1);

    static fromDirection(direction: number): Vec2 | undefined {
        switch (direction) {
            case 8:
                return this.UP;
            case 9:
                return this.UP_RIGHT;
            case 6:
                return this.RIGHT;
            case 3:
                return this.RIGHT_DOWN
            case 2:
                return this.DOWN;
            case 1:
                return this.DOWN_LEFT;
            case 4:
                return this.LEFT;
            case 7:
                return this.LEFT_UP;
        }
        return undefined;
    }

    static polar(rad: number, length: number) {
        const x = length * Math.cos(rad);
        const y = length * Math.sin(rad);
        return new Vec2(x, y);
    }

    get x() { return this._x; }
    get y() { return this._y; }

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get length() {
        if (this._length == null) {
            this._length = Math.sqrt(this.x ** 2 + this.y ** 2);
        }
        return this._length;
    }

    get rad() {
        if (this._rad == null) {
            this._rad = Math.atan2(this.y, this.x);
        }
        return this._rad;
    }

    equals(v: Vec2): boolean {
        return this._x === v.x && this._y === v.y;
    }

    add(v: number | Vec2): Vec2 {
        if (typeof v === "number") {
            return new Vec2(this.x + v, this.y + v);
        } else {
            return new Vec2(this.x + v.x, this.y + v.y);
        }
    }

    sub(v: number | Vec2): Vec2 {
        if (typeof v === "number") {
            return new Vec2(this.x - v, this.y - v);
        } else {
            return new Vec2(this.x - v.x, this.y - v.y);
        }
    }

    mul(v: number | Vec2): Vec2 {
        if (typeof v === "number") {
            return new Vec2(this.x * v, this.y * v);
        } else {
            return new Vec2(this.x * v.x, this.y * v.y);
        }
    }

    div(v: number | Vec2): Vec2 {
        if (typeof v === "number") {
            return new Vec2(this.x / v, this.y / v);
        } else {
            return new Vec2(this.x / v.x, this.y / v.y);
        }
    }

    mod(v: number | Vec2): Vec2 {
        if (typeof v === "number") {
            return new Vec2(this.x % v, this.y % v);
        } else {
            return new Vec2(this.x % v.x, this.y % v.y);
        }
    }

    neg(): Vec2 {
        return new Vec2(-this.x, -this.y);
    }

    norm(): Vec2 {
        return Vec2.polar(this.rad, 1);
    }

    rotate(rad: number): Vec2 {
        return Vec2.polar(rad, this.length);
    }

    dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vec2): number {
        return this.x * v.y - this.y * v.x;
    }

    perp(): Vec2 {
        return new Vec2(this.y, -this.x);
    }
}
