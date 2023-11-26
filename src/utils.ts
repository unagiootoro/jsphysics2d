export const EPSILON = 1e-7;

export function lt(a: number, b: number) {
    const d = Math.abs(a - b);
    if (d < EPSILON) return false;
    return a < b;
}

export function gt(a: number, b: number) {
    const d = Math.abs(a - b);
    if (d < EPSILON) return false;
    return a > b;
}

export function eq(a: number, b: number) {
    const d = Math.abs(a - b);
    return d < EPSILON;
}

export function rad2deg(rad: number): number {
    return rad * 180 / Math.PI;
}

export function deg2rad(deg: number): number {
    return deg / 180 * Math.PI;
}
