import { CSSProperties } from "react";
import { atomFamily, atom, selectorFamily } from "recoil";
import { CBCOLOR, CBTOOL, CBSTROKE_WIDTH } from "../constant";
import { CBItem, Shape, CBStyle, Bound, CBPointer } from "../type";
import { CanvasUtil } from "../utils/CanvasUtil";



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

export interface ItemCSS {
    container_css: CSSProperties,
    component_css: CSSProperties
}

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

export const itemID_state = atom<number[]>({
    key: "itemIDs",
    default: []
})

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

export const select_state = atom<Bound>({
    key: "select",
    default: {
        min_x: 300,
        max_y: 500,
        max_x: 500,
        min_y: 300
    }
})

export const pointer_state = atom<CBPointer>({
    key: "pointer",
    default: {
        init_point: { x: 0, y: 0 },
        curr_point: { x: 0, y: 0 },
        is_active: false
    }
})

