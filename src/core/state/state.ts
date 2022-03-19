import { CSSProperties } from "react";
import { atomFamily, atom, selectorFamily } from "recoil";
import { CBCOLOR, CBITEM_TYPE, CBSTROKE_WIDTH } from "../constant";
import { CBItem, Shape, CBStyle } from "../type";
import { CanvasUtil } from "../utils/CanvasUtil";
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890', 9);


function get_default_shape(type: CBITEM_TYPE): Shape {
    switch (type) {
        case CBITEM_TYPE.RECTANGLE:
            return {
                center: { x: Math.random() * 2000, y: Math.random() * 1400},
                mx: 50,
                my: 50,
                r: 0
            }
        case CBITEM_TYPE.ELLIPSE:
            return {
                center: { x: Math.random() * 2000, y: Math.random() * 1400},
                rx: 50,
                ry: 50,
                r: 0 
            }
        case CBITEM_TYPE.TRIANGLE:
            return {
                a: { x: 100, y: 100},
                b: { x: 150, y: 50},
                c: { x: 200, y: 100},
                r: 0 
            }
        case CBITEM_TYPE.PENCIL:
            return {
                points: [],
                r: 0
            }
    }
}

export const item_state = atomFamily<CBItem, number>({
    key: "elements",
    default: selectorFamily({
        key: "element_default",
        get: () => ({get}) => {
            const tool = get(tool_state);
            const style = get(style_state);
            return {
                type: tool, 
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
    key: "container_css",
    get: (id: number) => ({get}) => {
        let container_css: CSSProperties = {}, component_css: CSSProperties; 
        const item = get(item_state(id));; 
        const shapeUtil = CanvasUtil.get_shape_util(item.type);
        const bd = shapeUtil?.get_bound(item.shape);
        if (bd) {
            container_css = {
                width: `calc(${bd.max_x - bd.min_x}px + 2 * var(--cbPadding))`,
                height: `calc(${bd.max_y - bd.min_y}px + 2 * var(--cbPadding))`,
                transform: `
                    translate( 
                        calc(${bd.min_x}px - var(--cbPadding)),
                        calc(${bd.min_y}px - var(--cbPadding))
                    )
                    rotate(
                        ${item.shape.r}rad
                    )
                `
            }
        }
        component_css = {
            stroke:`var(${item.style.color})`,
            strokeWidth:`var(${item.style.size})`,
            fill: item.style.fill ? `var(${item.style.color}Fill)` : 'none',
            strokeDasharray: 'var(--cbDotted)'
        }
        return {
            container_css: container_css,
            component_css: component_css
        }; 
    }
})

export const itemID_state = atom<number[]>({
    key: "itemIDs",
    default: []
})

export const tool_state = atom<CBITEM_TYPE>({
    key: "tool",
    default: CBITEM_TYPE.RECTANGLE
})

export const style_state = atom<CBStyle>({
    key: "style",
    default: {
        color: CBCOLOR.BLACK,
        fill: false,
        size: CBSTROKE_WIDTH.MEDIUM,
        dotted: false
    }
})

