import { Bound } from "./type";
export enum CB_HANDLE {
    TL_CORNER,
    TR_CORNER,
    BL_CORNER,
    BR_CORNER,

    T_EDGE,
    L_EDGE,
    B_EDGE,
    R_EDGE,

    ROTATION,
    CENTER,

    IDLE
}

export enum CBTOOL {
    RECTANGLE,
    ELLIPSE,
    TRIANGLE,
    PEN,
    TEXT,
    IMAGE, 

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

export enum CBACTION_TYPE {
    TRANSLATING = 'Translating',
    ROTATING = 'Rotating',
    RESIZING = 'Resizing',
    CREATING = 'Creating',
    DRAWING = 'Drawing',
    DELETING = 'Deleting',
    IDLE = 'Idle'
}

export const LEFT_MOUSE = 0;
export const MID_MOUSE = 1;
export const RIGHT_MOUSE = 2;

export const MIN_SIZE = 20; 

export const EMPTY_ID = -1; 

export const EMPTY_BD: Bound = {
    min_x: 0,
    min_y: 0,
    max_x: 0,
    max_y: 0
}
