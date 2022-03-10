export interface Point {
    x: number,
    y: number
}

export interface Rect {
    origin: Point, // Top Left Pt 
    h: number, 
    w: number, 
    r: number
}

export interface Ellipse {
    center: Point,
    rx: number,
    ry: number,
    rot: number 
}

export interface Triangle {
    a: Point,
    b: Point,
    c: Point,
    r?: number
}

export interface Bound {
    lft: number, 
    top: number, 
    rgt: number,
    btm: number
}
