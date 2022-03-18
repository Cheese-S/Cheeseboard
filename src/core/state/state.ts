import { CSSProperties } from "react";
import { atomFamily, atom, selectorFamily } from "recoil";
import { CBITEM_TYPE } from "../constant";
import { CBItem, Shape } from "../type";
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

export const itemState = atomFamily<CBItem, number>({
    key: "elements",
    default: selectorFamily({
        key: "element_default",
        get: () => ({get}) => {
            const tool = get(toolState);
            return {
                type: tool, 
                shape: get_default_shape(tool)
            }
        }
    })
});

export const containerCssState = selectorFamily<CSSProperties, number>({
    key: "container_css",
    get: (id: number) => ({get}) => {
        let style: CSSProperties = {}; 
        const item = get(itemState(id));
        const shapeUtil = CanvasUtil.get_shape_util(item.type);
        const bd = shapeUtil?.get_bound(item.shape);
        if (bd) {
            style = {
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
        return style; 
    }
})

export const itemIDState = atom<number[]>({
    key: "itemIDs",
    default: []
})

export const toolState = atom<CBITEM_TYPE>({
    key: "tool",
    default: CBITEM_TYPE.TRIANGLE
})

