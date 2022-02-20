import { point } from "../../type";
export declare class Vec {
    /**
     * Calculate the cross product of p1 and p2
     * @param p1
     * @param p2
     * @returns p1 X p2
     */
    static crp: (p1: point, p2: point) => number;
    /**
     * Calculate the vector of two points
     * @param p1
     * @param p2
     * @returns The vector p1p2
     */
    static create_vec: (p1: point, p2: point) => point;
    /**
     * Calculate the direction where p1p3 lies with respect to p1p2
     * @param p1
     * @param p2
     * @param p3
     * @returns < 0 counter-clock wise, > 0 clock wise, = 0 colinear
     */
    static direction: (p1: point, p2: point, p3: point) => number;
}
