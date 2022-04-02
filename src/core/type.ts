import { CBCOLOR, CBTOOL, CBSTROKE_WIDTH } from "./constant"
import { CSSProperties } from "react"

export type Shape = Rect | Ellipse | Triangle | Polyline

export interface Point {
    x: number,
    y: number
}

export interface Rect {
    center: Point,
    mx: number,
    my: number, 
    r: number
}

export interface Ellipse {
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
export interface Triangle {
    a: Point,
    b: Point,
    c: Point,
    r: number
}

export interface Polyline {
    points: Point[],
    r: number
}

// The usual top/left/bottom/right representation is not well defined in browser space.
export interface Bound {
    min_x: number, 
    max_y: number, 
    max_x: number,
    min_y: number
}

export interface CBItem { 
    type: CBTOOL,
    shape: Shape,
    style: CBStyle,
    qt_id: number
}

export interface CBStyle {
    color: CBCOLOR,
    fill: boolean,
    size: CBSTROKE_WIDTH,
    dotted: boolean,
    is_ghost: boolean
}

export interface CBPointer {
    init_point: Point,
    curr_point: Point, 
    is_active: boolean
}

export interface ItemCSS {
    container_css: CSSProperties,
    component_css: CSSProperties
}

