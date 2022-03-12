import { Point, Rect, Ellipse, Triangle, Bound } from "../../type";
import { Vec } from "../vec/vec";

/* -------------------------------------------------------------------------- */
/*                                LINE SEGMENT                                */
/* -------------------------------------------------------------------------- */

/**
 * Check if a point lies a line segment 
 * @param lp1 Start of the Line Segment
 * @param lp2 End of the Line Segment 
 * @param p The point to be tested 
 * @returns true if point lies on a segment, false otherwise 
 */

function pt_on_seg(lp1: Point, lp2: Point, p: Point): boolean {
    return Math.min(lp1.x, lp2.x) <= p.x && p.x <= Math.max(lp1.x, lp2.x) &&
    Math.min(lp1.y, lp2.y) <= p.y && p.y <= Math.max(lp1.y, lp2.y)
}

/**
 * Check if line segment p1p2 intersects with line segment p3p4 
 * @param p1 Start of line1 
 * @param p2 End of line1
 * @param p3 Start of line2
 * @param p4 End of line2
 * @returns true if line segment p1p2 intersects with line segment p3p4 
 */

export function seg_seg_intersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
    let d1 = Vec.direction(p1, p2, p3);
    let d2 = Vec.direction(p1, p2, p4);
    let d3 = Vec.direction(p3, p4, p1);
    let d4 = Vec.direction(p3, p4, p2); 

    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) { 
            return true; 
        }
    
    if (!d1 && pt_on_seg(p1, p2, p3)) { return true; }
    if (!d2 && pt_on_seg(p1, p2, p4)) { return true; }
    if (!d3 && pt_on_seg(p3, p4, p1)) { return true; }
    if (!d4 && pt_on_seg(p3, p4, p2)) { return true; }

    return false; 
}

/* -------------------------------------------------------------------------- */
/*                                   ELLIPSE                                  */
/* -------------------------------------------------------------------------- */

export function get_ellipse_pts(e: Ellipse): Point[] {
    return [
        Vec.rot_about({x: e.center.x + e.rx, y: e.center.y}, e.center, e.r),
        Vec.rot_about({x: e.center.x - e.rx, y: e.center.y}, e.center, e.r),
        Vec.rot_about({x: e.center.x, y: e.center.y + e.ry}, e.center, e.r),
        Vec.rot_about({x: e.center.x, y: e.center.y - e.ry}, e.center, e.r),
    ]
}

/**
 * Check to see if a line segment intersect with an ellipse
 * See http://csharphelper.com/blog/2017/08/calculate-where-a-line-segment-and-an-ellipse-intersect-in-c/
 * @param p1 Start Point of Line Segment 
 * @param p2 End Point of Line Segment
 * @param e 
 * @returns True if a segment intersect with a ellipse, false otherwise 
 */

export function seg_ellipse_intersect(p1:Point, p2: Point, e: Ellipse): boolean {
    let trans_p1 = Vec.sub(Vec.rot_about(p1, e.center, -e.r), e.center); 
    let trans_p2 = Vec.sub(Vec.rot_about(p2, e.center, -e.r), e.center);
    
    const diff = Vec.sub(trans_p2, trans_p1);

    const A = (diff.x * diff.x) / e.rx / e.rx + (diff.y * diff.y) / e.ry / e.ry;
    const B = (2 * trans_p1.x * diff.x) / e.rx / e.rx + (2 * trans_p1.y * diff.y) / e.ry / e.ry; 
    const C = (trans_p1.x * trans_p1.x) / e.rx / e.rx + (trans_p1.y * trans_p1.y) / e.ry / e.ry - 1;

    const t_vals: number[] = [];

    const dis = B * B - 4 * A * C;

    if (dis === 0) {
        t_vals.push(-B / 2 / A);
    } else if (dis > 0) {
        const root = Math.sqrt(dis);
        t_vals.push((-B + root) / 2 / A);
        t_vals.push((-B - root) / 2 / A);
    }

    const int_pts = t_vals
        .filter((t) => t >=0 && t <= 1)
    return !!int_pts.length;  
}

/**
 * Check to see if a line segment intersect with a polyline
 * @param p1 Start of Line Segment 
 * @param p2 End of Line Segment
 * @param poly 
 * @returns True if the line segment intersect with a polyline, false otherwise
 */

export function seg_polyseg_intersect(p1: Point, p2: Point, poly: Point[]): boolean {
    for (let i = 1; i < poly.length; i++) {
        if (seg_seg_intersect(p1, p2, poly[i - 1], poly[i])) {
            return true; 
        }
    }
    return false; 
}


/* -------------------------------------------------------------------------- */
/*                                  RECTANGLE                                 */
/* -------------------------------------------------------------------------- */


/**
 * Return a rectangle's four vertecies 
 * @param rect 
 * @returns [top_left, top_right, bot_left, bot_right]
 */

export function get_rect_pts(rect: Rect): Point[] {
    return [
        Vec.rot_about({x: rect.center.x - rect.mx, y: rect.center.y - rect.my}, rect.center, rect.r), 
        Vec.rot_about({x: rect.center.x + rect.mx, y: rect.center.y - rect.my}, rect.center, rect.r), 
        Vec.rot_about({x: rect.center.x - rect.mx, y: rect.center.y + rect.my}, rect.center, rect.r), 
        Vec.rot_about({x: rect.center.x + rect.mx, y: rect.center.y + rect.my}, rect.center, rect.r) 
    ]; 
}

/**
 * Return a rectangle's four edges 
 * @param rect 
 * @param pts vertecies of the rectangle, expects to be orderd as [top_left, top_right, bot_left, bot_right]
 * @returns [top_edge, left_edge, bot_edge, right_edge]
 */
export function get_rect_edges(rect: Rect, pts?: Point[]): Point[][] {
    if (!pts) {
        pts = get_rect_pts(rect);
    }
    return [
        [pts[0], pts[1]],
        [pts[0], pts[2]],
        [pts[2], pts[3]],
        [pts[1], pts[3]]
    ]
}


/**
 * Test if a given point is inside a rectangle
 * @param p 
 * @param rect 
 * @returns True if pt in rectangle, false otherwise 
 */
export function pt_in_rect(p: Point, rect: Rect): boolean {
    let r_p = Vec.rot_about(p, rect.center, -rect.r);
    return ((rect.center.x - rect.mx <= r_p.x) && (r_p.x <= rect.center.x + rect.mx)) &&
        ((rect.center.y - rect.my <= r_p.y) && (r_p.y <= rect.center.y + rect.my));
}

/**
 * Test to see if r1 intersects/contains r2
 * @param r1 
 * @param r2 
 * @returns True if r1 intersects/contains r2, false otherwise (return false if r2 contains r1)
 */

export function rect_rect_intersect(r1: Rect, r2: Rect): boolean {
    let r2_pts = get_rect_pts(r2);
    if (r2_pts.some((pt) => { return pt_in_rect(pt, r1) })) {
        return true; 
    }
    let r1_edges = get_rect_edges(r1);
    let r2_edges = get_rect_edges(r2, r2_pts);
    return r1_edges.some((e1) => {
        return r2_edges.some((e2) => {
            return seg_seg_intersect(e1[0],e1[1],e2[0], e2[1]); 
        }) 
    }) 
}

/**
 * Test to see if the given rectangle intersect (or enclose) with the ellipse 
 * @param r 
 * @param e 
 * @returns True if the rectangle intersect (or enclose) with the ellipse, false otherwise. 
 */

export function rect_ellipse_intersect(r: Rect, e: Ellipse): boolean {
    let r_edges = get_rect_edges(r);
    return r_edges.some((edge) => seg_ellipse_intersect(edge[0], edge[1], e)) || pt_in_rect(e.center, r); 
}

/**
 * Test to see if the given retangle intersect (or enclose) with the triangle
 * @param r 
 * @param t 
 * @returns True if the rectangle intersect (or enclose) with the ellipse, false otherwise. 
 */

export function rect_triangle_intersect(r: Rect, t: Triangle): boolean {
    let r_edges = get_rect_edges(r); 
    let t_edges = get_triangle_edges(t);
    return r_edges.some((e1) => {
        return t_edges.some((e2) => {
            return seg_seg_intersect(e1[0], e1[1], e2[0], e2[1]); 
        })
    }) || pt_in_rect(t.a, r) || pt_in_rect(t.b, r) || pt_in_rect(t.c, r); 
}

/**
 * Test to see if the given rectangle intersect (or enclose) with a polyline 
 * @param r 
 * @param poly 
 * @returns True if the rectangle intersect (or enclose) with the polyline, false otherwsie. 
 */

export function rect_poly_intersect(r: Rect, poly: Point[]): boolean {
    let r_edges = get_rect_edges(r);
    return poly.some((p) => pt_in_rect(p, r)) || 
        r_edges.some((e) => seg_polyseg_intersect(e[0], e[1], poly));
}

/* -------------------------------------------------------------------------- */
/*                                  TRIANGLE                                  */
/* -------------------------------------------------------------------------- */

function get_triangle_pts(t: Triangle): Point[] {
    let center = Vec.mul_n(Vec.add_vecs(t.a, t.b, t.c), 1/3); 
    return [
        Vec.rot_about(t.a, center, t.r),
        Vec.rot_about(t.b, center, t.r),
        Vec.rot_about(t.c, center, t.r)
    ]
}

/**
 * Given a triangle with vertices A, B, C, return the three edges associated with it. 
 * @param t 
 * @returns [AB, AC, BC]
 */
function get_triangle_edges(t: Triangle): Point[][] {
    let pts = get_triangle_pts(t);
    return [
        [pts[0], pts[1]],
        [pts[0], pts[2]], 
        [pts[1], pts[2]]
    ]
}

/* -------------------------------------------------------------------------- */
/*                                    BOUND                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get a rectangle represented by bound
 * @param bd 
 * @returns Rectangle with 0 rotation
 */
export function get_bound_rect(bd: Bound): Rect {
    let mx = Math.abs(bd.lft - bd.rgt) / 2;
    let my = Math.abs(bd.top - bd.btm) / 2;
    return {
        center: {x: bd.lft + mx, y: bd.top - my},
        mx: mx, 
        my: my, 
        r: 0 
    }; 
}


/**
 * Get a rectangle's bound
 * @param rect 
 * @returns Bound 
 */
export function get_rect_bound(rect: Rect): Bound {
    let pts = get_rect_pts(rect);
    let t:number, l:number, b:number, r:number; 
    pts.forEach((pt) => {
        if (t === undefined || t < pt.y) t = pt.y;
        if (b === undefined || b > pt.y) b = pt.y;
        if (l === undefined || l > pt.x) l = pt.x;
        if (r === undefined || r < pt.x) r = pt.x;
    })
    return {
        //@ts-ignore
        lft: l,
        //@ts-ignore
        top: t,
        //@ts-ignore
        rgt: r,
        //@ts-ignore
        btm: b
    }
} 

/**
 * Get a ellipse's bound 
 * @param e 
 * @returns Bound
 */
export function get_ellipse_bound(e: Ellipse): Bound {
    let pts = get_ellipse_pts(e);
    let t: number, l:number, b: number, r:number;
    pts.forEach((pt) => {
        if (t === undefined || t < pt.y) t = pt.y;
        if (b === undefined || b > pt.y) b = pt.y;
        if (l === undefined || l > pt.x) l = pt.x;
        if (r === undefined || r < pt.x) r = pt.x;
    })
    return {
        //@ts-ignore
        lft: l,
        //@ts-ignore
        top: t,
        //@ts-ignore
        rgt: r,
        //@ts-ignore
        btm: b
    }
}

/**
 * Get a triangle's bound
 * @param tri 
 * @returns Bound 
 */

export function get_triangle_bound(tri: Triangle): Bound {
    let pts = get_triangle_pts(tri);
    let t: number, l:number, b: number, r:number;
    pts.forEach((pt) => {
        if (t === undefined || t < pt.y) t = pt.y;
        if (b === undefined || b > pt.y) b = pt.y;
        if (l === undefined || l > pt.x) l = pt.x;
        if (r === undefined || r < pt.x) r = pt.x;
    })
    return {
        //@ts-ignore
        lft: l,
        //@ts-ignore
        top: t,
        //@ts-ignore
        rgt: r,
        //@ts-ignore
        btm: b
    }
}

/**
 * Get a common bounding box
 * @param bd1 
 * @param bd2 
 * @returns The bouding box that bounds both bd1 and bd2 
 */

export function get_common_bound(bd1: Bound, bd2: Bound): Bound {
    return {
        lft: bd1.lft < bd2.lft ? bd1.lft : bd2.lft, 
        top: bd1.top > bd2.top ? bd1.top : bd2.top, 
        rgt: bd1.rgt > bd2.rgt ? bd1.rgt : bd2.rgt, 
        btm: bd1.btm < bd2.btm ? bd1.btm : bd2.btm, 
    }
}

/**
 * Check if two bounds intersect with each other
 * @param bd1 
 * @param bd2 
 * @returns True if two bounds intersect, false otherwise 
 */

export function bound_bound_intersect(bd1: Bound, bd2: Bound): Boolean {
    return bd2.lft <= bd1.rgt && bd2.rgt >= bd1.lft && bd2.top <= bd1.btm && bd2.btm >= bd1.top; 
}

function bound_circle_intersect(bd: Bound, e: Ellipse): Boolean {
    let rect = get_bound_rect(bd); 
    let dis_x = Math.abs(rect.center.x - e.center.x); 
    let dis_y = Math.abs(rect.center.y - e.center.y);
    
    if (dis_x > rect.mx + e.rx) return false;
    if (dis_y > rect.my + e.ry) return false;

    if (dis_x <= rect.mx) return true; 
    if (dis_y <= rect.my) return true; 

    let corner_sq = (e.rx - rect.mx) ** 2 + (e.ry - rect.my) ** 2; 

    return corner_sq <= (e.rx ** 2); 
}

export function bound_ellipse_intersect(bd: Bound, e: Ellipse): Boolean {
    if (e.rx === e.ry) return bound_circle_intersect(bd, e);
    return rect_ellipse_intersect(get_bound_rect(bd), e); 
}

export function bound_triangle_intersect(bd: Bound, t: Triangle): Boolean {
    return rect_triangle_intersect(get_bound_rect(bd), t);
}

export function bound_poly_intersect(bd: Bound, poly: Point[]): Boolean {
    return rect_poly_intersect(get_bound_rect(bd), poly); 
}