import { Point } from "../../type";

export class Vec {
    
    
    /**
    * Calculate the vector of two points
    * @param p1 
     * @param p2 
    * @returns The vector p1p2
    */
    static create_vec = (p1: Point, p2: Point): Point => {
        return this.sub(p2, p1); 
    }
    
    /**
    * Subtract v2 from v1
    * @param v1 
    * @param v2 
    * @returns v1 - v2
    */
    
    static sub = (v1: Point, v2: Point): Point => {
        return {x: v1.x - v2.x, y: v1.y - v2.y}; 
    }
    
    /**
    * Add two vectors 
    * @param v1 
    * @param v2 
    * @returns v1 + v2
    */
    static add = (v1: Point, v2: Point): Point => {
        return {x: v1.x + v2.x, y: v1.y + v2.y}; 
    }
    
    /**
    * Add a vector with scalar 
    * @param v 
    * @param n 
    * @returns vec + scalar 
    */
    
    static add_n = (v: Point, n: number): Point => {
        return {x: v.x + n, y: v.y + n};
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
        return {x: v.x - n, y: v.y - n};
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
     * Calculate the direction where p1p3 lies with respect to p1p2  
     * @param p1 
     * @param p2 
     * @param p3 
     * @returns < 0 counter-clock wise, > 0 clock wise, = 0 colinear
     */
    
    static direction = (p1: Point, p2: Point, p3: Point): number => {
        return this.crp(this.create_vec(p1, p3), this.create_vec(p1, p2)); 
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
        let trans_vec = { x: vec.x - pt.x, y: vec.y - pt.y};
        return {
            x: trans_vec.x * Math.cos(r) - trans_vec.y * Math.sin(r) + pt.x, 
            y: trans_vec.x * Math.sin(r) + trans_vec.y * Math.cos(r) + pt.y
        }
    }

    /**
     * Convert vectors from canvas space into cartesian sapce 
     * @param vec 
     * @returns Converted Vectors 
     */

    static canvas_to_cart = (...vecs: Point[]): Point[] => {
        return vecs.map((e) => {
            return {x: e.x, y: -e.y}
        }); 
    }

    /**
     * Convert vectors from cartesian space into canvas space
     * @param vecs 
     * @returns Converted Vectors
     */

    static cart_to_canvas = (...vecs: Point[]): Point[] => {
        return this.canvas_to_cart(...vecs); 
    }
} 