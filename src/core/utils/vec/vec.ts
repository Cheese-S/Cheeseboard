import { Point } from "../../type";

export class Vec {


    /**
    * Calculate the vector of two points
    * @param p1 
     * @param p2 
    * @returns The vector p1p2
    */
    static create_vec = (p1: Point, p2: Point): Point => {
        return Vec.sub(p2, p1);
    }

    /**
    * Subtract v2 from v1
    * @param v1 
    * @param v2 
    * @returns v1 - v2
    */

    static sub = (v1: Point, v2: Point): Point => {
        return { x: v1.x - v2.x, y: v1.y - v2.y };
    }

    /**
    * Add two vectors 
    * @param v1 
    * @param v2 
    * @returns v1 + v2
    */
    static add = (v1: Point, v2: Point): Point => {
        return { x: v1.x + v2.x, y: v1.y + v2.y };
    }

    /**
    * Add a vector with scalar 
    * @param v 
    * @param n 
    * @returns vec + scalar 
    */

    static add_n = (v: Point, n: number): Point => {
        return { x: v.x + n, y: v.y + n };
    }

    static add_vecs = (...vecs: Point[]): Point => {
        return vecs.reduce((prev, current) => Vec.add(prev, current));
    }

    /**
    * Sub a vector with scalar 
    * @param v 
    * @param n 
    * @returns vec - scalar
    */
    static sub_n = (v: Point, n: number): Point => {
        return { x: v.x - n, y: v.y - n };
    }

    /**
     * Multiply a vector with scalar
     * @param v 
     * @param n 
     * @returns vec * scalar
     */

    static mul_n = (v: Point, n: number): Point => {
        return {
            x: v.x * n,
            y: v.y * n
        };
    }

    /**
     * Get the median of two vectors
     * @param v1 
     * @param v2 
     * @returns the median
     */
    static med = (v1: Point, v2: Point): Point => {
        return Vec.mul_n(Vec.add(v1, v2), 0.5);
    }

    /**
     * Find the slope between two points 
     * @param p1 
     * @param p2 
     * @returns slope 
     */

    static slope = (p1: Point, p2: Point): number => {
        return (p2.y - p1.y) / (p2.x - p1.x);
    }

    /**
     * Calculate the cross product of p1 and p2 
     * @param p1 
     * @param p2 
     * @returns p1 X p2 
     */
    static crp = (p1: Point, p2: Point): number => {
        return p1.x * p2.y - p2.x * p1.y;
    }


    /**
     * Find the dot product of p1 and p2
     * @param p1 
     * @param p2 
     * @returns |p1 · p2|
     */
    static dot = (p1: Point, p2: Point): number => {
        return p1.x * p2.x + p1.y * p2.y;
    }

    /**
     * Calculate the direction where p1p3 lies with respect to p1p2  
     * @param p1 
     * @param p2 
     * @param p3 
     * @returns < 0 counter-clock wise, > 0 clock wise, = 0 colinear
     */

    static direction = (p1: Point, p2: Point, p3: Point): number => {
        return Vec.crp(Vec.create_vec(p1, p3), Vec.create_vec(p1, p2));
    }

    /**
     * Get the angle (radian) between two vectors
     * @param p1 
     * @param p2 
     * @returns The angle in radian
     */

    static get_angle = (p1: Point, p2: Point): number => {
        return Math.atan2(Vec.crp(p1, p2), Vec.dot(p1, p2));
    }

    /**
     * Get the angle (radian) between two vectors
     * @param p1 
     * @param p2 
     * @returns The angle in radian
     */

    static get_ang = (p1: Point, p2: Point): number => {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    /**
     * Rotate a vector by the given degree
     * @param vec 
     * @param r angle in radian
     * @returns the rotated vector 
     */

    static rot = (vec: Point, r: number): Point => {
        return {
            x: vec.x * Math.cos(r) - vec.y * Math.sin(r),
            y: vec.x * Math.sin(r) + vec.y * Math.cos(r)
        };
    }

    /**
     * Rotate a vector with respect to a point
     * @param vec 
     * @param pt 
     * @param r 
     * @returns the rotated vector
     */
    static rot_about = (vec: Point, pt: Point, r: number): Point => {
        let trans_vec = { x: vec.x - pt.x, y: vec.y - pt.y };
        return {
            x: trans_vec.x * Math.cos(r) - trans_vec.y * Math.sin(r) + pt.x,
            y: trans_vec.x * Math.sin(r) + trans_vec.y * Math.cos(r) + pt.y
        }
    }

    static sqdis_to = (v1: Point, v2: Point): number => {
        const diff = Vec.sub(v1, v2);
        return diff.x * diff.x + diff.y * diff.y; 
    }


} 