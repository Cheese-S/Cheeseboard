import { point, rect, ellipse, triangle } from "../../type";
/**
 * Check if line segment p1p2 intersects with line segment p3p4
 * @param p1 Start of line1
 * @param p2 End of line1
 * @param p3 Start of line2
 * @param p4 End of line2
 * @returns true if line segment p1p2 intersects with line segment p3p4
 */
export declare function seg_seg_intersect(p1: point, p2: point, p3: point, p4: point): boolean;
/**
 * Check to see if a line segment intersect with an ellipse
 * See http://csharphelper.com/blog/2017/08/calculate-where-a-line-segment-and-an-ellipse-intersect-in-c/
 * @param p1 Start Point of Line Segment
 * @param p2 End Point of Line Segment
 * @param e
 * @returns True if a segment intersect with a ellipse, false otherwise
 */
export declare function seg_ellipse_intersect(p1: point, p2: point, e: ellipse): boolean;
/**
 * Check to see if a line segment intersect with a polyline
 * @param p1 Start of Line Segment
 * @param p2 End of Line Segment
 * @param poly
 * @returns True if the line segment intersect with a polyline, false otherwise
 */
export declare function seg_polyseg_intersect(p1: point, p2: point, poly: point[]): boolean;
/**
 * Test if a given point is inside a rectangle
 * @param p
 * @param rect
 * @returns True if pt in rectangle, false otherwise
 */
export declare function pt_in_rect(p: point, rect: rect): boolean;
/**
 * Test to see if two rectangles intersect (or enclose)
 * @param r1
 * @param r2
 * @returns True if two rectangles intersect (or enclose), false otherwise
 */
export declare function rect_rect_intersect(r1: rect, r2: rect): boolean;
/**
 * Test to see if the given rectangle intersect (or enclose) with the ellipse
 * @param r
 * @param e
 * @returns True if the rectangle intersect (or enclose) with the ellipse, false otherwise.
 */
export declare function rect_ellipse_intersect(r: rect, e: ellipse): boolean;
/**
 * Test to see if the given retangle intersect (or enclose) with the triangle
 * @param r
 * @param t
 * @returns True if the rectangle intersect (or enclose) with the ellipse, false otherwise.
 */
export declare function rect_triangle_intersect(r: rect, t: triangle): boolean;
/**
 * Test to see if the given rectangle intersect (or enclose) with a polyline
 * @param r
 * @param poly
 * @returns True if the rectangle intersect (or enclose) with the polyline, false otherwsie.
 */
export declare function rect_poly_intersect(r: rect, poly: point[]): boolean;
