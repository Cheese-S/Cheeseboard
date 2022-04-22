import { Point, Rect, Ellipse, Triangle, Bound, Polyline } from "../../type";
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
 * Get the squared distance between a pt and a line segment
 * @param lp1 Start of the line segement
 * @param lp2 End of the line segement
 * @param p 
 * @returns The squared distance from p to the line segment
 */
export function sqdis_to_seg(lp1: Point, lp2: Point, p: Point): number {
    const diff = Vec.sub(lp2, lp1); 
    let close_pt: Point = lp1;
    if (diff.x || diff.y) {
        const t = ((p.x - lp1.x) * diff.x + (p.y - lp1.y) * diff.y) / (diff.x * diff.x + diff.y * diff.y);

        if (t > 1) {
            close_pt = lp2;
        } else if (t > 0) {
            close_pt = {
                x: lp1.x + diff.x * t,
                y: lp1.y + diff.y * t
            }
        }
    }
    const d = Vec.sub(p, close_pt);
    return d.x * d.x + d.y * d.y;
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
/*                                  POLYLINE                                  */
/* -------------------------------------------------------------------------- */

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

/**
 * Get the center of a polyline
 * @param poly polyseg
 * @returns The center of the polyline
 */

export function get_polyseg_center(poly: Point[]): Point {
    let t: number, l:number, b: number, r: number;

    if (poly.length === 0) {
        throw new Error("Passed in an empty array"); 
    }
    if (poly.length === 1) {
        return { x: poly[0].x, y: poly[0].y }; 
    }

    poly.forEach((pt) => {
        if (t === undefined || t < pt.y) t = pt.y;
        if (b === undefined || b > pt.y) b = pt.y;
        if (l === undefined || l > pt.x) l = pt.x;
        if (r === undefined || r < pt.x) r = pt.x;
    })
    return {
        //@ts-ignore
        x: (r + l) / 2,
        //@ts-ignore
        y: (b + t) / 2,
    }
}

export function get_rotated_polyseg(poly: Point[], r: number): Point[] {
    if (poly.length === 1 || poly.length === 0) {
        return poly.map((pt) => pt);
    }
    const center = get_polyseg_center(poly);
    console.log("center", center);
    return poly.map((pt) => Vec.rot_about(pt, center, r)); 
}


/* -------------------------------------------------------------------------- */
/*                                   ELLIPSE                                  */
/* -------------------------------------------------------------------------- */

export function pt_in_ellipse(pt: Point, e: Ellipse): boolean {
    let r_pt = Vec.rot_about(pt, e.center, -e.r);
    return r_pt.x <= e.center.x + e.rx && r_pt.x >= e.center.x - e.rx &&
        r_pt.y <= e.center.y + e.ry && r_pt.y >= e.center.y - e.ry
}

/**
 * Get the four end points lying on an ellipse's axis
 * @param e 
 * @returns The four end points 
 */

export function get_ellipse_pts(e: Ellipse): Point[] {
    return [
        Vec.rot_about({ x: e.center.x + e.rx, y: e.center.y }, e.center, e.r),
        Vec.rot_about({ x: e.center.x - e.rx, y: e.center.y }, e.center, e.r),
        Vec.rot_about({ x: e.center.x, y: e.center.y + e.ry }, e.center, e.r),
        Vec.rot_about({ x: e.center.x, y: e.center.y - e.ry }, e.center, e.r),
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

export function seg_ellipse_intersect(p1: Point, p2: Point, e: Ellipse): boolean {
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
        .filter((t) => t >= 0 && t <= 1)
    return !!int_pts.length;
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
        Vec.rot_about({ x: rect.center.x - rect.mx, y: rect.center.y - rect.my }, rect.center, rect.r),
        Vec.rot_about({ x: rect.center.x + rect.mx, y: rect.center.y - rect.my }, rect.center, rect.r),
        Vec.rot_about({ x: rect.center.x - rect.mx, y: rect.center.y + rect.my }, rect.center, rect.r),
        Vec.rot_about({ x: rect.center.x + rect.mx, y: rect.center.y + rect.my }, rect.center, rect.r)
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

function rect_inside_ellipse(r: Rect, e: Ellipse): boolean {
    let pts = get_rect_pts(r);
    return pts.every((pt) => {
        return pt_in_ellipse(pt, e);
    })
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
            return seg_seg_intersect(e1[0], e1[1], e2[0], e2[1]);
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
    return r_edges.some((edge) => seg_ellipse_intersect(edge[0], edge[1], e)) || (pt_in_rect(e.center, r) && !rect_inside_ellipse(r, e));
}

/**
 * Test to see if the given retangle intersect (or enclose) with the triangle
 * @param r 
 * @param t 
 * @returns True if the rectangle intersect (or enclose) with the ellipse, false otherwise. 
 */

export function rect_triangle_intersect(r: Rect, t: Triangle): boolean {
    let r_edges = get_rect_edges(r);
    let t_pts = get_triangle_pts(t);
    let t_edges = get_triangle_edges(t, t_pts);
    return r_edges.some((e1) => {
        return t_edges.some((e2) => {
            return seg_seg_intersect(e1[0], e1[1], e2[0], e2[1]);
        })
    }) || pt_in_rect(t_pts[0], r) || pt_in_rect(t_pts[1], r) || pt_in_rect(t_pts[2], r);
}

/**
 * Test to see if the given rectangle intersect (or enclose) with a polyline 
 * @param r 
 * @param poly 
 * @returns True if the rectangle intersect (or enclose) with the polyline, false otherwsie. 
 */

export function rect_polyseg_intersect(r: Rect, poly: Polyline): boolean {
    let r_edges = get_rect_edges(r);
    let rot_pts = get_rotated_polyseg(poly.points, poly.r); 
    return rot_pts.some((p) => pt_in_rect(p, r)) ||
        r_edges.some((e) => seg_polyseg_intersect(e[0], e[1], rot_pts));
}




/* -------------------------------------------------------------------------- */
/*                                  TRIANGLE                                  */
/* -------------------------------------------------------------------------- */

function get_triangle_pts(t: Triangle): Point[] {
    let center = {
        x: Math.abs(t.a.x + t.c.x) / 2,
        y: Math.abs(t.b.y + t.a.y) / 2
    }
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
function get_triangle_edges(t: Triangle, pts?: Point[]): Point[][] {
    if (!pts) {
        pts = get_triangle_pts(t);
    }
    return [
        [pts[0], pts[1]],
        [pts[0], pts[2]],
        [pts[1], pts[2]]
    ]
}

/* -------------------------------------------------------------------------- */
/*                                    BOUND                                   */
/* -------------------------------------------------------------------------- */

export function rotate_bound(bd: Bound, r: number): Bound {
    const top_left = {x: bd.min_x, y: bd.min_y};
    const btm_right = {x: bd.max_x, y: bd.max_y};
    const bd_center = Vec.med(top_left, btm_right); 
    const r_top_left = Vec.rot_about(top_left, bd_center, r);
    const r_btm_right = Vec.rot_about(btm_right, bd_center, r);
    return {
        min_x: r_top_left.x,
        min_y: r_top_left.y,
        max_x: r_btm_right.x,
        max_y: r_btm_right.y
    }
}

export function is_bound_equal(bd1: Bound, bd2: Bound): boolean {
    return bd1.min_x === bd2.min_x &&
        bd2.max_x === bd2.max_x &&
        bd2.min_y === bd2.min_y &&
        bd2.max_y === bd2.max_y 
}



/**
 * Get a rectangle represented by bound
 * @param bd 
 * @returns Rectangle with 0 rotation
 */
export function get_bound_rect(bd: Bound): Rect {
    let mx = Math.abs(bd.min_x - bd.max_x) / 2;
    let my = Math.abs(bd.max_y - bd.min_y) / 2;
    return {
        center: { x: bd.min_x + mx, y: bd.max_y - my },
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
export function get_rect_bound(rect: Rect, rotated: boolean = false): Bound {
    let pts: Point[];
    if (rotated) {
        pts = get_rect_pts(rect);
    } else {
        pts = get_rect_pts({ ...rect, r: 0 });
    }
    let t: number, l: number, b: number, r: number;
    pts.forEach((pt) => {
        if (t === undefined || t < pt.y) t = pt.y;
        if (b === undefined || b > pt.y) b = pt.y;
        if (l === undefined || l > pt.x) l = pt.x;
        if (r === undefined || r < pt.x) r = pt.x;
    })
    return {
        //@ts-ignore
        min_x: l,
        //@ts-ignore
        max_y: t,
        //@ts-ignore
        max_x: r,
        //@ts-ignore
        min_y: b
    }
}

/**
 * Get a ellipse's bound 
 * @param e 
 * @returns Bound
 */
export function get_ellipse_bound(e: Ellipse, rotated: boolean = false): Bound {
    let r: number;
    if (rotated) {
        r = e.r;
    } else {
        r = 0;
    }
    const ux = e.rx * Math.cos(r);
    const uy = e.rx * Math.sin(r);
    const vx = e.ry * Math.cos(r + Math.PI / 2);
    const vy = e.ry * Math.sin(r + Math.PI / 2);
    const mx = Math.sqrt(ux * ux + vx * vx);
    const my = Math.sqrt(uy * uy + vy * vy);
    return {

        min_x: e.center.x - mx,

        max_y: e.center.y + my,

        max_x: e.center.x + mx,

        min_y: e.center.y - my
    }
}

/**
 * Get a triangle's bound
 * @param tri 
 * @returns Bound 
 */

export function get_triangle_bound(tri: Triangle, rotated: boolean = false): Bound {
    let pts: Point[];
    if (rotated) {
        pts = get_triangle_pts(tri);
    } else {
        pts = get_triangle_pts({ ...tri, r: 0 });
    }
    let t: number, l: number, b: number, r: number;
    pts.forEach((pt) => {
        if (t === undefined || t < pt.y) t = pt.y;
        if (b === undefined || b > pt.y) b = pt.y;
        if (l === undefined || l > pt.x) l = pt.x;
        if (r === undefined || r < pt.x) r = pt.x;
    })
    return {
        //@ts-ignore
        min_x: l,
        //@ts-ignore
        max_y: t,
        //@ts-ignore
        max_x: r,
        //@ts-ignore
        min_y: b
    }
}

export function get_polyseg_bound(line: Polyline, rotated: boolean = false): Bound {
    let pts: Point[];
    let t: number, l:number, b: number, r: number;
    if (rotated) {
        pts = get_rotated_polyseg(line.points, line.r); 
        console.log(pts); 
        console.log(line.r); 
    } else {
        pts = line.points;
    }
    pts.forEach((pt) => {
        if (t === undefined || t < pt.y) t = pt.y;
        if (b === undefined || b > pt.y) b = pt.y;
        if (l === undefined || l > pt.x) l = pt.x;
        if (r === undefined || r < pt.x) r = pt.x;
    })
    return {
        //@ts-ignore
        min_x: l,
        //@ts-ignore
        max_y: t,
        //@ts-ignore
        max_x: r,
        //@ts-ignore
        min_y: b
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
        min_x: bd1.min_x < bd2.min_x ? bd1.min_x : bd2.min_x,
        max_y: bd1.max_y > bd2.max_y ? bd1.max_y : bd2.max_y,
        max_x: bd1.max_x > bd2.max_x ? bd1.max_x : bd2.max_x,
        min_y: bd1.min_y < bd2.min_y ? bd1.min_y : bd2.min_y,
    }
}

/**
 * Check if two bounds intersect with each other
 * @param bd1 
 * @param bd2 
 * @returns True if two bounds intersect, false otherwise 
 */

export function bound_bound_intersect(bd1: Bound, bd2: Bound): boolean {
    return bd2.min_x <= bd1.max_x && bd2.max_x >= bd1.min_x && bd2.max_y <= bd1.min_y && bd2.min_y >= bd1.max_y;
}

/**
 * Check if a Bound intersects / contains a circle
 * @param bd 
 * @param e 
 * @returns True if a bound intersects / contains a circle, false otherwise
 */

function bound_circle_intersect(bd: Bound, e: Ellipse): boolean {
    let rect = get_bound_rect(bd);
    let dis_x = Math.abs(rect.center.x - e.center.x);
    let dis_y = Math.abs(rect.center.y - e.center.y);

    if (dis_x > rect.mx + e.rx) return false;
    if (dis_y > rect.my + e.ry) return false;
    if (rect_inside_ellipse(rect, e)) return false;

    if (dis_x <= rect.mx) return true;
    if (dis_y <= rect.my) return true;

    let corner_sq = (e.rx - rect.mx) ** 2 + (e.ry - rect.my) ** 2;

    return corner_sq <= (e.rx ** 2);
}

/**
 * Check if a Bound intersects / contains a ellipse
 * @param bd 
 * @param e 
 * @returns True if a bound intersects / contains a ellipse, false otherwise
 */

export function bound_ellipse_intersect(bd: Bound, e: Ellipse): boolean {
    return rect_ellipse_intersect(get_bound_rect(bd), e);
}

/**
 * Check if a Bound intersects / contains a triangle
 * @param bd 
 * @param t 
 * @returns True if a bound intersects / contains a triangle, false otherwise
 */
export function bound_triangle_intersect(bd: Bound, t: Triangle): boolean {
    return rect_triangle_intersect(get_bound_rect(bd), t);
}

/**
 * Check if a Bound intersects / contains poly line segments
 * @param bd 
 * @param poly 
 * @returns True if a bound intersects / contains poly line segments, false otherwise
 */
export function bound_poly_intersect(bd: Bound, poly: Polyline): boolean {
    return rect_polyseg_intersect(get_bound_rect(bd), poly);
}

/**
 * Check if a Bound intersects / contains a rectangle
 * @param bd 
 * @param r 
 * @returns True if a bound intersects / contains a rectangle, false otherwise
 */

export function bound_rect_intersect(bd: Bound, r: Rect): boolean {
    return rect_rect_intersect(get_bound_rect(bd), r);
}