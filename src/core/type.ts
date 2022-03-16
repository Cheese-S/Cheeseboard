import { CBITEM_TYPE } from "./constant"


export interface Shape {}; 

export interface Point {
    x: number,
    y: number
}

export interface Rect extends Shape  {
    center: Point,
    mx: number,
    my: number, 
    r: number
}

export interface Ellipse extends Shape {
    center: Point,
    rx: number,
    ry: number,
    r: number 
}

/**
 * In this particular application, triangle will only exists as a isosceles triangle. 
 * The vecrtices is arranged in the following order
 *                B (TOP)
 *              A   C (BOTTOM)
 */
export interface Triangle extends Shape {
    a: Point,
    b: Point,
    c: Point,
    r: number
}

export interface Polyline extends Shape {
    points: Point[],
    r: number
}

export interface Bound {
    lft: number, 
    top: number, 
    rgt: number,
    btm: number
}

export interface CBItem { 
    type: CBITEM_TYPE,
    shape: Shape
}


