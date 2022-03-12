import { Vec } from "./vec"
import { Point } from "../../type"


test('direction', () => {
    let p1: Point = { x: 0, y: 0 };
    let p2: Point = { x: 1, y: 1 };
    let p3: Point = { x: 0.5, y: 0.5 };
    let p4: Point = { x: 0, y: 1 };
    expect(Vec.direction(p1, p2, p3)).toBe(0);
    expect(Vec.direction(p1, p2, p4)).toBeLessThan(0);
    expect(Vec.direction(p1, p4, p2)).toBeGreaterThan(0);
});

test('canvas_to_math', () => {
    let p1: Point = { x: 0, y: 0 };
    let p2: Point = { x: 1, y: 1 };
    let p3: Point = { x: 0.5, y: 0.5 };
    let p4: Point = { x: 0, y: 1 };
    expect(Vec.canvas_to_cart(p1, p2, p3, p4)).toStrictEqual([{x: 0, y: -0}, {x: 1, y: -1}, {x: 0.5, y: -0.5}, {x: 0, y: -1}]);
})
