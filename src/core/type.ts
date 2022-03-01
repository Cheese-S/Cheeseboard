export interface point {
    x: number,
    y: number
}

export interface rect {
    origin: point, // Top Left Pt 
    h: number, 
    w: number, 
    r: number
}

export interface ellipse {
    center: point,
    rx: number,
    ry: number,
    rot: number 
}

export interface triangle {
    a: point,
    b: point,
    c: point,
    r?: number
}

export interface bound {
    lft: number, 
    top: number, 
    rgt: number,
    btm: number
}
