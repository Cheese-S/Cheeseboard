export enum TRANSFORM_HANDLE {
    TL_CORNER,
    TR_CORNER,
    BL_CORNER,
    BR_CORNER,

    T_EDGE,
    L_EDGE,
    B_EDGE,
    R_EDGE,

    ROTATION,
    CENTER
}

export enum CBTOOL {
    RECTANGLE,
    ELLIPSE,
    TRIANGLE,
    PENCIL,
    TEXT,

    SELECT,
    ERASER
}

export enum CBCOLOR {
    RED = '--cbRed',
    BLUE = '--cbBlue',
    GREEN = '--cbGreen',
    BLACK = '--cbBlack',
    DARK_BLUE = '--cbDarkBlue',
    YELLOW = '--cbYellow'
}

export enum CBSTROKE_WIDTH {
    SMALL = '--cbStrokeWidthS',
    MEDIUM = '--cbStrokeWidthM',
    LARGE = '--cbStrokeWidthL'
}