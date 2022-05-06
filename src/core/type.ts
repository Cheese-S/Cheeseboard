import { CSSProperties } from "react"
import { CBACTION_TYPE, CBCOLOR, CBSTROKE_WIDTH, CBTOOL, CB_HANDLE } from "./constant"

export type Shape = Rect | Ellipse | Triangle | Polyline | Text | Image

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

export interface Text {
    center: Point,
    mx: number,
    my: number,
    r: number,
    scale: number
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

export interface Image {
    src: string,
    center: Point,
    mx: number,
    my: number,
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
    id: number, 
    type: CBTOOL,
    shape: Shape,
    style: CBStyle,
    qt_id: number,
    text: string
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
    movement: Point, 
    selected_handle: CB_HANDLE,
    is_active: boolean,
    is_drawing: number,
    action: CBACTION_TYPE
}

export interface CBAction {
    type: CBACTION_TYPE,
    targets: CBItem[],
    before?: CBItem[]
}

export interface ItemCSS {
    container_css: CSSProperties,
    component_css: CSSProperties
}

export type CB_CORNER_HANDLE = CB_HANDLE.BR_CORNER | CB_HANDLE.BL_CORNER | CB_HANDLE.TR_CORNER | CB_HANDLE.TL_CORNER;
export type CB_EDGE_HANDLE = CB_HANDLE.B_EDGE | CB_HANDLE.T_EDGE | CB_HANDLE.L_EDGE | CB_HANDLE.R_EDGE;


