import { Vec } from "."
import { point } from "../../type"


test('direction', () => {
    let p1: point = { x: 0, y: 0 };
    let p2: point = { x: 1, y: 1 };
    let p3: point = { x: 0.5, y: 0.5 };
    let p4: point = { x: 0, y: 1 };
    expect(Vec.direction(p1, p2, p3)).toBe(0);
    expect(Vec.direction(p1, p2, p4)).toBeLessThan(0);
    expect(Vec.direction(p1, p4, p2)).toBeGreaterThan(0);
});
