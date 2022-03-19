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

export enum CBITEM_TYPE {
    RECTANGLE,
    ELLIPSE,
    TRIANGLE,
    PENCIL
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
    SMALL = '--cbStrokeWidthL',
    MEDIUM = '--cbStrokeWidthM',
    LARGE = '--cbStrokeWidthS'
}