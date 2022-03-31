import { CSSProperties } from "react";
import { atomFamily, atom, selectorFamily, selector } from "recoil";
import { CBCOLOR, CBTOOL, CBSTROKE_WIDTH } from "../constant";
import { CBItem, Shape, CBStyle, Bound, CBPointer } from "../type";
import { CanvasUtil } from "../utils/CanvasUtil";
import { Quadtree } from "../utils/qudatree";

export const empty_bd: Bound = {
    min_x: 0,
    min_y: 0,
    max_x: 0,
    max_y: 0
}


/* -------------------------------------------------------------------------- */
/*                                 ITEM STATTE                                */
/* -------------------------------------------------------------------------- */

export interface ItemCSS {
    container_css: CSSProperties,
    component_css: CSSProperties
}


export const itemID_state = atom<number[]>({
    key: "itemIDs",
    default: []
})

export const selected_itemID_state = atom<number[]>({
    key: "selected_itemIDs",
    default: []
})

export const visible_itemID_state = selector<number[]>({
    key: "visible_itemIDs", 
    get: ({get}) => {
        const camera = get(camera_state);
        const qt = get(qt_state);
        return qt.query(camera); 
    }
})

export const item_state = atomFamily<CBItem, number>({
    key: "elements",
    default: selectorFamily({
        key: "element_default",
        get: () => ({ get }) => {
            const tool = get(tool_state);
            const style = get(style_state);
            return {
                type: CBTOOL.RECTANGLE,
                shape: get_default_shape(tool),
                style: style
            }
        }
    })
});


export const item_css_state = selectorFamily<ItemCSS, number>({
    key: "item_css",
    get: (id: number) => ({ get }) => {
        let res: ItemCSS = { container_css: {}, component_css: {} };
        const item = get(item_state(id));;
        const shapeUtil = CanvasUtil.get_shapeutil(item.type);
        const bd = shapeUtil?.get_bound(item.shape);
        if (bd) {
            res = CanvasUtil.get_item_css(bd, item);
        }
        return res;
    }
})





function get_default_shape(type: CBTOOL): Shape {
    switch (type) {
        case CBTOOL.RECTANGLE:
            return {
                center: { x: Math.random() * 2000, y: Math.random() * 1400 },
                mx: 50,
                my: 50,
                r: 0
            }
        case CBTOOL.ELLIPSE:
            return {
                center: { x: Math.random() * 2000, y: Math.random() * 1400 },
                rx: 50,
                ry: 50,
                r: 0
            }
        case CBTOOL.TRIANGLE:
            return {
                a: { x: 100, y: 100 },
                b: { x: 150, y: 50 },
                c: { x: 200, y: 100 },
                r: 0
            }
        case CBTOOL.PENCIL:
            return {
                points: [],
                r: 0
            }
        default:
            return {
                center: { x: Math.random() * 2000, y: Math.random() * 1400 },
                mx: 50,
                my: 50,
                r: 0
            }
    }
}

/* -------------------------------------------------------------------------- */
/*                                 TOOL STATE                                 */
/* -------------------------------------------------------------------------- */

export const tool_state = atom<CBTOOL>({
    key: "tool",
    default: CBTOOL.RECTANGLE
})

export const style_state = atom<CBStyle>({
    key: "style",
    default: {
        color: CBCOLOR.RED,
        size: CBSTROKE_WIDTH.MEDIUM,
        fill: true,
        dotted: false
    }
})

export const select_state = selector<Bound>({
    key: "select",
    get: ({ get }) => {
        const tool = get(tool_state);

        if (tool !== CBTOOL.SELECT) {
            return empty_bd;
        }

        const pointer = get(pointer_state);

        if (!pointer.is_active) {
            return empty_bd;
        }

        let min_x, min_y, max_x, max_y;

        if (pointer.init_point.x < pointer.curr_point.x) {
            min_x = pointer.init_point.x;
            max_x = pointer.curr_point.x;
        } else {
            max_x = pointer.init_point.x;
            min_x = pointer.curr_point.x;
        }

        if (pointer.init_point.y < pointer.curr_point.y) {
            min_y = pointer.init_point.y;
            max_y = pointer.curr_point.y;
        } else {
            max_y = pointer.init_point.y;
            min_y = pointer.curr_point.y;
        }

        return {
            min_x: min_x,
            max_x: max_x,
            min_y: min_y,
            max_y: max_y
        }
    }
})

/* -------------------------------------------------------------------------- */
/*                                CANVAS STATE                                */
/* -------------------------------------------------------------------------- */

const CANVAS_SIZE = 2147483648; 

export const camera_state = atom<Bound>({
    key: "camera",
    default: {
        min_x: CANVAS_SIZE / 2,
        min_y: CANVAS_SIZE / 2,
        max_x: 0,
        max_y: 0
    }
})

export const qt_state = atom<Quadtree>({
    key: "quadtree",
    default: new Quadtree(CANVAS_SIZE, CANVAS_SIZE, 8, 10),
    dangerouslyAllowMutability: true
})


export const pointer_state = atom<CBPointer>({
    key: "pointer",
    default: {
        init_point: { x: 0, y: 0 },
        curr_point: { x: 0, y: 0 },
        is_active: false
    }
})

