import { point } from "../../type";
export declare class Vec {
    /**
    * Calculate the vector of two points
    * @param p1
     * @param p2
    * @returns The vector p1p2
    */
    static create_vec: (p1: point, p2: point) => point;
    /**
    * Subtract v2 from v1
    * @param v1
    * @param v2
    * @returns v1 - v2
    */
    static sub: (v1: point, v2: point) => point;
    /**
    * Add two vectors
    * @param v1
    * @param v2
    * @returns v1 + v2
    */
    static add: (v1: point, v2: point) => point;
    /**
    * Add a vector with scalar
    * @param v
    * @param n
    * @returns vec + scalar
    */
    static add_n: (v: point, n: number) => point;
    /**
    * Sub a vector with scalar
    * @param v
    * @param n
    * @returns vec - scalar
    */
    static sub_n: (v: point, n: number) => point;
    /**
     * Find the slope between two points
     * @param p1
     * @param p2
     * @returns slope
     */
    static slope: (p1: point, p2: point) => number;
    /**
     * Calculate the cross product of p1 and p2
     * @param p1
     * @param p2
     * @returns p1 X p2
     */
    static crp: (p1: point, p2: point) => number;
    /**
     * Calculate the direction where p1p3 lies with respect to p1p2
     * @param p1
     * @param p2
     * @param p3
     * @returns < 0 counter-clock wise, > 0 clock wise, = 0 colinear
     */
    static direction: (p1: point, p2: point, p3: point) => number;
    /**
     * Rotate a vector by the given degree
     * @param vec
     * @param r angle in radian
     * @returns the rotated vector
     */
    static rot: (vec: point, r: number) => point;
    /**
     * Rotate a vector with respect to a point
     * @param vec
     * @param pt
     * @param r
     * @returns the rotated vector
     */
    static rot_about: (vec: point, pt: point, r: number) => point;
}
