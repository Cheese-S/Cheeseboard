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

export interface Triangle extends Shape {
    a: Point,
    b: Point,
    c: Point,
    r: number
}

export interface Bound {
    lft: number, 
    top: number, 
    rgt: number,
    btm: number
}
