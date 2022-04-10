import { CSSProperties } from "react";
import { atomFamily, atom, selectorFamily, selector, DefaultValue } from "recoil";
import { CBCOLOR, CBTOOL, CBSTROKE_WIDTH, empty_bd, CB_HANDLE } from "../constant";
import { CBItem, Shape, CBStyle, Bound, CBPointer, ItemCSS } from "../type";
import { CanvasUtil } from "../utils/CanvasUtil";
import { Quadtree } from "../utils/qudatree";

/* -------------------------------------------------------------------------- */
/*                                 ITEM STATTE                                */
/* -------------------------------------------------------------------------- */


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
    get: ({ get }) => {
        const camera = get(camera_state);
        const qt = get(qt_state);
        return qt.query(camera);
    }
})

export const item_state = atomFamily<CBItem, number>({
    key: "elements",
    default: {
        id: -1,
        type: CBTOOL.RECTANGLE,
        shape: {
            center: { x: Math.random() * 2000, y: Math.random() * 1400 },
            mx: 50,
            my: 50,
            r: 0
        },
        style: {
            color: CBCOLOR.BLACK,
            fill: false,
            size: CBSTROKE_WIDTH.MEDIUM,
            dotted: false,
            is_ghost: false
        },
        qt_id: -1,
        text: 'aa'
    }
});

export const item_css_state = selectorFamily<ItemCSS, number>({
    key: "item_css",
    get: (id: number) => ({ get }) => {
        let res: ItemCSS = { container_css: {}, component_css: {} };
        const item = get(item_state(id));;
        const shapeUtil = CanvasUtil.get_shapeutil(item.type);
        const bd = shapeUtil?.get_bound(item.shape);
        if (bd) {
            res = CanvasUtil.get_item_css(bd, item.shape.r, item.style);
        }
        return res;
    }
})

export const item_state_accessor = selectorFamily<CBItem, number>({
    key: "items_selector",
    get: (itemID: number) => ({ get }) => {
        return get(item_state(itemID));
    },
    set: (itemID: number) => ({ get, set, reset }, new_CBItem: CBItem | DefaultValue) => {
        const qt = get(qt_state);
        if (new_CBItem instanceof DefaultValue) {
            reset(item_state(itemID));
            set(itemID_state, (prev) => prev.filter((id) => id !== itemID));
            qt.remove(itemID);
        } else {
            set(item_state(itemID),
                (prev) => {

                    if (prev.qt_id !== -1) {
                        qt.remove(prev.qt_id);

                    }
                    const bd = CanvasUtil.get_shapeutil(new_CBItem.type)!.get_bound(new_CBItem.shape, true);
                    const qt_id = qt.insert(itemID, bd.min_x, bd.min_y, bd.max_x, bd.max_y);
                    console.log(bd);
                    return {
                        ...new_CBItem,
                        qt_id: qt_id
                    };
                });
            set(itemID_state, (prev) => {
                if (prev.indexOf(itemID) === -1) {
                    return [...prev, itemID]
                }
                return prev;
            });

        }
        qt.cleanup();
    }
})

export const selected_items_state = selector<CBItem[]>({
    key: "selected_items",
    get: ({ get }) => {
        const selected_IDs = get(selected_itemID_state);
        if (!selected_IDs.length) { return [] };
        const items = selected_IDs.map((id) => get(item_state_accessor(id)))
        return items;
    },
    set: ({ get, set, reset }, new_selected_items: CBItem[] | DefaultValue) => {
        if (new_selected_items instanceof DefaultValue) {
            const selected_IDs = get(selected_itemID_state);
            selected_IDs.forEach((id) => reset(item_state_accessor(id)))
        } else {
            new_selected_items.forEach((item) => {
                set(item_state_accessor(item.id), item);
            })
        }
    }
})




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
        dotted: false,
        is_ghost: false
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

        if (!pointer.is_active || pointer.selected_handle !== CB_HANDLE.IDLE) {
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

        let bd = {
            min_x: min_x,
            max_x: max_x,
            min_y: min_y,
            max_y: max_y
        }
        return bd;


    }
})


/* -------------------------------------------------------------------------- */
/*                                CANVAS STATE                                */
/* -------------------------------------------------------------------------- */

const CANVAS_SIZE = 2147483648;

export const camera_state = atom<Bound>({
    key: "camera",
    default: {
        min_x: 0,
        min_y: 0,
        max_x: CANVAS_SIZE / 2,
        max_y: CANVAS_SIZE / 2
    }
})

export const qt_state = atom<Quadtree>({
    key: "quadtree",
    default: new Quadtree(CANVAS_SIZE, CANVAS_SIZE, 4, 10),
    dangerouslyAllowMutability: true
})


export const pointer_state = atom<CBPointer>({
    key: "pointer",
    default: {
        init_point: { x: 0, y: 0 },
        curr_point: { x: 0, y: 0 },
        movement: { x: 0, y: 0 },
        is_active: false,
        selected_handle: CB_HANDLE.IDLE
    }
})

export const selected_bound_state = selector<Bound & { r: number }>({
    key: "selected_bound",
    get: ({ get }) => {
        const selected_items = get(selected_items_state);
        const single_selected = selected_items.length === 1; 
        const r = single_selected ? selected_items[0].shape.r : 0;
        if (!selected_items.length) { return { ...empty_bd, r: 0 } };
        return { ...CanvasUtil.get_items_bound(!single_selected, ...selected_items), r: r };
    }
})



