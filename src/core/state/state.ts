import { atomFamily, atom, selectorFamily } from "recoil";
import { CBITEM_TYPE } from "../constant";
import { CBItem, Shape } from "../type";

function get_default_shape(type: CBITEM_TYPE): Shape {
    switch (type) {
        case CBITEM_TYPE.RECTANGLE:
            return {
                center: { x: 0, y: 0 },
                mx: 50,
                my: 50,
                r: 0
            }
        case CBITEM_TYPE.ELLIPSE:
            return {
                center: { x: 0, y: 0 },
                rx: 50,
                ry: 50,
                r: 0 
            }
        case CBITEM_TYPE.TRIANGLE:
            return {
                a: { x: 0, y: -50},
                b: { x: 50, y: 0},
                c: { x: 0, y: -100},
                r: 0 
            }
        case CBITEM_TYPE.PENCIL:
            return {
                points: [],
                r: 0
            }
    }
}

export const elementState = atomFamily<CBItem, number>({
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

export const elementIDState = atom<number[]>({
    key: "elementIDs",
    default: []
})

export const toolState = atom<CBITEM_TYPE>({
    key: "tool",
    default: CBITEM_TYPE.RECTANGLE
})

