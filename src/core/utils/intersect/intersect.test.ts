import { Vec } from "../vec";
import { ellipse, point, rect } from "../../type"
import { seg_seg_intersect, pt_in_rect, rect_rect_intersect, rect_ellipse_intersect } from "."



test('seg_seg_intersection', () => {
    let p1: point = { x: 0, y: 0 };
    let p2: point = { x: 1, y: 1 };
    let p3: point = { x: 1, y: 0 };
    let p4: point = { x: 0, y: 1 };
    let p5: point = { x: 0.5, y: 0.5 };
    expect(seg_seg_intersect(p1, p2, p3, p4)).toBeTruthy();
    expect(seg_seg_intersect(p1, p3, p2, p4)).toBeFalsy();
    expect(seg_seg_intersect(p1, p3, p1, p4)).toBeTruthy(); 
    expect(seg_seg_intersect(p1, p5, p1, p2)).toBeTruthy(); 
});

test('pt_in_rect', () => {
    let rect: rect = {
        origin: {x: 0, y: 1},
        w: 1,
        h: 1,
        r: 0 
    };
    let p = {x: 0.5, y: 0.5};
    expect(pt_in_rect(p, rect)).toBeTruthy(); 
    rect.w = 0.5;
    rect.h = 0.5;
    expect(pt_in_rect(p, rect)).toBeTruthy(); 
    rect.r = Math.PI * 1.5; 
    expect(pt_in_rect(p, rect)).toBeFalsy();
    rect.w = 1;
    rect.h = 1;
    p.x = p.y = -0.5;  
    rect.r = Math.PI; 
    expect(pt_in_rect(p, rect)).toBeTruthy();
    p.x = 0.5
    rect.r = Math.PI * 1.5; 
    expect(pt_in_rect(p, rect)).toBeTruthy();
})

test('rect_rect_intersect', () => {
    let r1: rect = {
        origin: {x: 0, y: 1},
        w: 1,
        h: 1,
        r: 0 
    };
    let r2: rect = {
        origin: {x: 0, y: 1},
        w: 1,
        h: 1,
        r: 0 
    };
    expect(rect_rect_intersect(r1, r2)).toBeTruthy(); 
    r2.r = Math.PI * 0.5; 
    expect(rect_rect_intersect(r1, r2)).toBeTruthy(); 
    r2.r = Math.PI;
    expect(rect_rect_intersect(r1, r2)).toBeTruthy(); 
    
    r2.r = 0;

    r1.w = r2.h = 2; 
    r1.h = r2.w = 1; 
    r1.origin = {x: 0, y: 1.5};
    r2.origin = {x: 0.5, y: 2}; 
    expect(rect_rect_intersect(r1, r2)).toBeTruthy(); 
})


test('rect_ellipse_intersect', () => {
    let r: rect = {
        origin: {x: 0, y: 1},
        w: 1,
        h: 1,
        r: 0 
    };
    let e: ellipse = {
        center: {x: 0.5, y: 0.5},
        rx: 0.5, 
        ry: 0.5,
        rot: 0
    }

    expect(rect_ellipse_intersect(r, e)).toBeTruthy();
    e.rx = e.ry = 1;

    e.rot = Math.PI;
    r.r = Math.PI; 
    expect(rect_ellipse_intersect(r, e)).toBeTruthy();

})