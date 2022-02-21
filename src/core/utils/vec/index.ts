import { point } from "../../type";

export class Vec {
    
    
    /**
    * Calculate the vector of two points
    * @param p1 
     * @param p2 
    * @returns The vector p1p2
    */
    static create_vec = (p1: point, p2: point): point => {
        return this.sub(p2, p1); 
    }
    
    /**
    * Subtract v2 from v1
    * @param v1 
    * @param v2 
    * @returns v1 - v2
    */
    
    static sub = (v1: point, v2: point): point => {
        return {x: v1.x - v2.x, y: v1.y - v2.y}; 
    }
    
    /**
    * Add two vectors 
    * @param v1 
    * @param v2 
    * @returns v1 + v2
    */
    static add = (v1: point, v2: point): point => {
        return {x: v1.x + v2.x, y: v1.y + v2.y}; 
    }
    
    /**
    * Add a vector with scalar 
    * @param v 
    * @param n 
    * @returns vec + scalar 
    */
    
    static add_n = (v: point, n: number): point => {
        return {x: v.x + n, y: v.y + n};
    }
    
    /**
    * Sub a vector with scalar 
    * @param v 
    * @param n 
    * @returns vec - scalar
    */
    static sub_n = (v: point, n: number): point => {
        return {x: v.x - n, y: v.y - n};
    }

    /**
     * Find the slope between two points 
     * @param p1 
     * @param p2 
     * @returns slope 
     */

    static slope = (p1: point, p2: point): number => {
        return (p2.y - p1.y) / (p2.x - p1.x); 
    }

    
    
    /**
     * Calculate the cross product of p1 and p2 
     * @param p1 
     * @param p2 
     * @returns p1 X p2 
     */
    static crp = (p1: point, p2: point): number => {
        return p1.x * p2.y - p2.x * p1.y; 
    }
    
    /**
     * Calculate the direction where p1p3 lies with respect to p1p2  
     * @param p1 
     * @param p2 
     * @param p3 
     * @returns < 0 counter-clock wise, > 0 clock wise, = 0 colinear
     */
    
    static direction = (p1: point, p2: point, p3: point): number => {
        return this.crp(this.create_vec(p1, p3), this.create_vec(p1, p2)); 
    }

    /**
     * Rotate a vector by the given degree
     * @param vec 
     * @param r angle in radian
     * @returns the rotated vector 
     */

    static rot = (vec: point, r: number): point => {
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
    static rot_about = (vec: point, pt: point, r: number): point => {
        let trans_vec = { x: vec.x - pt.x, y: vec.y - pt.y};
        return {
            x: trans_vec.x * Math.cos(r) - trans_vec.y * Math.sin(r) + pt.x, 
            y: trans_vec.x * Math.sin(r) + trans_vec.y * Math.cos(r) + pt.y
        }
    }
} 