import { Vec } from "../vec/vec";
import { Ellipse, Point, Rect, Triangle } from "../../type"
import { seg_seg_intersect, pt_in_rect, rect_rect_intersect, rect_ellipse_intersect, get_rect_bound, get_ellipse_bound, get_triangle_bound, get_common_bound, get_bound_rect, rect_triangle_intersect } from "."
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });


test('seg_seg_intersection', () => {
    let p1: Point = { x: 0, y: 0 };
    let p2: Point = { x: 1, y: 1 };
    let p3: Point = { x: 1, y: 0 };
    let p4: Point = { x: 0, y: 1 };
    let p5: Point = { x: 0.5, y: 0.5 };
    expect(seg_seg_intersect(p1, p2, p3, p4)).toBeTruthy();
    expect(seg_seg_intersect(p1, p3, p2, p4)).toBeFalsy();
    expect(seg_seg_intersect(p1, p3, p1, p4)).toBeTruthy();
    expect(seg_seg_intersect(p1, p5, p1, p2)).toBeTruthy();
});

describe('pt_in_rect', () => {
    let r1: Rect, r2: Rect, pt: Point;
    beforeEach(() => {
        pt = { x: 0.7, y: 0.7 };
        r1 = { center: { x: 0.5, y: 0.5 }, mx: 0.5, my: 0.5, r: 0 };
        r2 = { center: { x: 1.5, y: 1.5 }, mx: 0.5, my: 0.5, r: 0 };
    })

    test('pt_in_rect with unrotated rectangles', () => {
        expect(pt_in_rect(pt, r1)).toBeTruthy();
        expect(pt_in_rect(pt, r2)).toBeFalsy();
    });

    test('pt_in_rect with rotated rectangles', () => {
        r1.r = Math.PI / 4;
        r2.r = Math.PI;
        pt.x = pt.y = 1;
        expect(pt_in_rect(pt, r1)).toBeFalsy();
        expect(pt_in_rect(pt, r2)).toBeTruthy();
    })
})

describe('rect_rect_intersect', () => {
    let r1: Rect, r2: Rect, r3: Rect, r4: Rect;
    beforeEach(() => {
        r1 = { center: { x: 0.5, y: 0.5 }, mx: 0.5, my: 0.5, r: 0 };
        r2 = { center: { x: 1.5, y: 1.5 }, mx: 0.5, my: 0.5, r: 0 };
        r3 = { center: { x: 0.5, y: 1.5 }, mx: 0.5, my: 0.5, r: 0 };
        r4 = { center: { x: 0.5, y: 0.5 }, mx: 0.3, my: 0.3, r: 0 };
    })

    test('rect intersects on corner', () => {
        expect(rect_rect_intersect(r1, r2)).toBeTruthy();
    })

    test('rect intersects with edge', () => {
        expect(rect_rect_intersect(r1, r3)).toBeTruthy();
        expect(rect_rect_intersect(r2, r3)).toBeTruthy();
    })

    test('r1 contains r4', () => {
        expect(rect_rect_intersect(r1, r4)).toBeTruthy();
        expect(rect_rect_intersect(r4, r1)).toBeFalsy();
    })
})

describe('get bounds from shapes', () => {

    test('unrotated rectangle', () => {
        let r = { center: { x: 0.5, y: 0.5 }, mx: 0.5, my: 0.5, r: 0 };
        expect(get_rect_bound(r)).toStrictEqual({ min_x: 0, max_y: 1, max_x: 1, min_y: 0 });
    });

    test('rotated rectangle', () => {
        let r = { center: { x: 0.5, y: 0.5 }, mx: 0.5, my: 0.5, r: Math.PI / 4 };
        let corner_dis = Math.sqrt(0.5 ** 2 + 0.5 ** 2);
        expect(get_rect_bound(r)).toMatchCloseTo({ min_x: 0.5 - corner_dis, max_y: 0.5 + corner_dis, max_x: 0.5 + corner_dis, min_y: 0.5 - corner_dis });
    });

    test('unrotated ellipse', () => {
        let e = { center: { x: 1, y: 1 }, rx: 1, ry: 4, r: 0 };
        expect(get_ellipse_bound(e)).toMatchCloseTo({ min_x: 0, max_y: 5, max_x: 2, min_y: -3 });
    })

    test('rotated ellipse', () => {
        let e = { center: { x: 1, y: 1 }, rx: 1, ry: 4, r: Math.PI / 2 };
        expect(get_ellipse_bound(e)).toMatchCloseTo({ min_x: -3, max_y: 2, max_x: 5, min_y: 0 });
    })

    test('unrotated triangle', () => {
        let t = { a: { x: 0, y: 0 }, b: { x: 1, y: 0 }, c: { x: 0.5, y: 0.5 }, r: 0 };
        expect(get_triangle_bound(t)).toStrictEqual({ min_x: 0, max_y: 0.5, max_x: 1, min_y: 0 });
    })

    test('rotated triangle', () => {
        let t = { a: { x: 0, y: 0 }, b: { x: 1, y: 0 }, c: { x: 0.5, y: 0.5 }, r: Math.PI };
        let center = Vec.mul_n(Vec.add_vecs(t.a, t.b, t.c), 1 / 3);
        let rotated_c = Vec.rot_about({ x: 0.5, y: 0.5 }, center, Math.PI);
        let rotated_a = Vec.rot_about({ x: 0, y: 0 }, center, Math.PI);

        expect(get_triangle_bound(t)).toMatchCloseTo({ min_x: 0, max_y: rotated_a.y, max_x: 1, min_y: rotated_c.y });
    })

    test('Get Common Bound', () => {
        let bd1 = { min_x: 0, max_y: 0.5, max_x: 1, min_y: 0 };
        let bd2 = { min_x: 5, max_y: 5, max_x: 5, min_y: 5 };

        expect(get_common_bound(bd1, bd2)).toStrictEqual({ min_x: 0, max_y: 5, max_x: 5, min_y: 0 });
        expect(get_common_bound(bd2, bd1)).toStrictEqual({ min_x: 0, max_y: 5, max_x: 5, min_y: 0 });
    })

    test('Get Rect Formed by Bound', () => {
        let bd = { min_x: 0, max_y: 1, max_x: 1, min_y: 0 };
        expect(get_bound_rect(bd)).toMatchCloseTo({ center: { x: 0.5, y: 0.5 }, mx: 0.5, my: 0.5, r: 0 });
    })
})

describe('rect_ellipse_intersect', () => {
    let e: Ellipse, r: Rect;
    beforeEach(() => {
        e = { center: { x: 1, y: 1 }, rx: 1, ry: 4, r: 0 };
        r = { center: { x: 0.5, y: 0.5 }, mx: 0.5, my: 0.5, r: 0 };
    });

    test('unrotated ellipse', () => {
        expect(rect_ellipse_intersect(r, e)).toBeTruthy();
    });

    test('rotated ellipse', () => {
        e.r = Math.PI;
        expect(rect_ellipse_intersect(r, e)).toBeTruthy();
    })

    test('falsy ellipse', () => {
        e.center = { x: 2, y: 2 };
        expect(rect_ellipse_intersect(r, e)).toBeFalsy();
    })

    test('Rect contains ellipse', () => {
        r = { center: { x: 5, y: 5 }, mx: 10, my: 10, r: 0 };
        expect(rect_ellipse_intersect(r, e)).toBeTruthy();
    })

    test('Ellipse contains rect', () => {
        r = { center: { x: 1, y: 1 }, mx: 0.1, my: 0.1, r: 0 };
        expect(rect_ellipse_intersect(r, e)).toBeFalsy();
    })

    test('Rect intersects circle', () => {
        e = {center: {x: 1, y: 0.5}, rx: 1, ry: 1, r: 0};
        expect(rect_ellipse_intersect(r, e)).toBeTruthy(); 
    })

    test('Rect contains circle', () => {
        r = { center: { x: 5, y: 5 }, mx: 10, my: 10, r: 0 };
        e = {center: {x: 0.5, y: 0.5}, rx: 1, ry: 1, r: 0};
        expect(rect_ellipse_intersect(r, e)).toBeTruthy(); 
    })

    test('Circle contains rect', () => {
        e = {center: {x: 0.5, y: 0.5}, rx: 10, ry: 10, r: 0};
        expect(rect_ellipse_intersect(r, e)).toBeFalsy(); 
    })
});

describe('rect_triangle_intersect', () => {
    let t: Triangle, r: Rect;
    beforeEach(() => {
        t = { a: { x: 0, y: 0 }, b: { x: 1, y: 0 }, c: { x: 0.5, y: 0.5 }, r: 0 };
        r = { center: { x: 0.5, y: 0.5 }, mx: 0.5, my: 0.5, r: 0 };
    });

    test('unrotated triangle', () => {
        expect(rect_triangle_intersect(r, t)).toBeTruthy();
    });

    test('rotated triangle', () => {
        r = { center: { x: 0.5, y: -0.5 }, mx: 0.5, my: 0.4, r: 0 };
        t.r = Math.PI;
        expect(rect_triangle_intersect(r, t)).toBeTruthy();
    });

    test('Rect contains triangle', () => {
        r = { center: { x: 0.5, y: 0.5 }, mx: 10, my: 10, r: 0 };
        expect(rect_triangle_intersect(r, t)).toBeTruthy(); 
    })

    test('Triangle contains Rect', () => {
        t = { a: { x: 0.5, y: 2 }, b: { x: 2, y: -0.5 }, c: { x: -1, y: -0.5 }, r: 0 };
        expect(rect_triangle_intersect(r, t)).toBeFalsy();
    })

    test('Browser Space', () => {
        t = { a: {x: 0, y: 1}, b: { x: 1, y: 0 }, c: { x: 2, y: 1}, r: 0}
        expect(rect_triangle_intersect(r, t)).toBeTruthy(); 
    })
});
