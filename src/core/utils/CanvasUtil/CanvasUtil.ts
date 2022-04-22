import { CBTOOL, CB_HANDLE, empty_bd, MIN_SIZE, CBSTROKE_WIDTH } from "../../constant";
import { Bound, CBItem, CBStyle, Shape, Point, ItemCSS, CB_EDGE_HANDLE, CB_CORNER_HANDLE, Triangle, Text, Image } from "../../type";
import { RectShapeUtil, EllipseShapeUtil, PenShapeUtil, ShapeUtil } from "../shapeUtil";
import TriangleShapeUtil from "../shapeUtil/TriangleShapeUtil";
import React, { CSSProperties } from "react";
import { get_common_bound } from "../geometry";
import { Vec } from "../vec";
import TextShapeUtil from "../shapeUtil/TextShapeUtil";

import { customAlphabet } from "nanoid";
import ImageShapeUtil from "../shapeUtil/ImageShapeUtil";
const nanoid = customAlphabet('1234567890', 9);

const font_size = {
    [CBSTROKE_WIDTH.SMALL]: 12,
    [CBSTROKE_WIDTH.MEDIUM]: 24,
    [CBSTROKE_WIDTH.LARGE]: 36,
}



export class CanvasUtil {

    private static ShapeUtilMap = new Map<number, ShapeUtil>([
        [CBTOOL.RECTANGLE, new RectShapeUtil()],
        [CBTOOL.ELLIPSE, new EllipseShapeUtil()],
        [CBTOOL.PEN, new PenShapeUtil()],
        [CBTOOL.TRIANGLE, new TriangleShapeUtil()],
        [CBTOOL.TEXT, new TextShapeUtil()],
        [CBTOOL.IMAGE, new ImageShapeUtil()]
    ])

    /**
     * Get a type's shape util object
     * @param type 
     * @returns A type's ShapeUtil 
     */

    static get_shapeutil(type: CBTOOL) {
        return this.ShapeUtilMap.get(type);
    }

    static get_container_css(bd: Bound, r: number = 0, is_ghost: boolean = false): CSSProperties {
        return {
            ...(is_ghost && { opacity: 0.5 }),
            width: `calc(${bd.max_x - bd.min_x}px + 2 * var(--cbPadding))`,
            height: `calc(${bd.max_y - bd.min_y}px + 2 * var(--cbPadding))`,
            transform: `
                translate( 
                    calc(${bd.min_x}px - var(--cbPadding)),
                    calc(${bd.min_y}px - var(--cbPadding))
                )
                rotate(
                    ${r}rad
                )
            `
        }
    }

    static get_component_css(style: CBStyle): CSSProperties {
        return {
            stroke: `var(${style.color})`,
            strokeWidth: `var(${style.size})`,
            fill: style.fill ? `var(${style.color}Fill)` : 'none',
            strokeDasharray: style.dotted ? 'var(--cbDotted)' : 0,
            fontSize: font_size[style.size]
        }
    }


    static get_item_css(bd: Bound, r: number, style: CBStyle): ItemCSS {
        let container_css: CSSProperties, component_css: CSSProperties;
        container_css = CanvasUtil.get_container_css(bd, r, style.is_ghost);
        component_css = CanvasUtil.get_component_css(style);
        return {
            container_css: container_css,
            component_css: component_css
        }
    }

    static get_CBItem(style: CBStyle, shape: Shape, tool: CBTOOL) {
        return {
            style: style,
            shape: shape,
            type: tool
        }
    }

    static get_default_shape(type: CBTOOL): Shape {
        switch (type) {
            case CBTOOL.TEXT:
                return {
                    center: { x: 0, y: 0 },
                    mx: 50,
                    my: 50,
                    r: 0,
                    scale: 1
                }
            case CBTOOL.RECTANGLE:
                return {
                    center: { x: 0, y: 0 },
                    mx: 50,
                    my: 50,
                    r: 0
                }
            case CBTOOL.ELLIPSE:
                return {
                    center: { x: 0, y: 0 },
                    rx: 100,
                    ry: 50,
                    r: 0
                }
            case CBTOOL.TRIANGLE:
                return {
                    a: { x: 100, y: 150 },
                    b: { x: 150, y: 50 },
                    c: { x: 200, y: 150 },
                    r: 0
                }
            case CBTOOL.PEN:
                return {
                    points: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
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

    static match_bound_anchor(bd: Bound, to_be_matched_bd: Bound, r: number, handle: CB_CORNER_HANDLE | CB_EDGE_HANDLE): Bound {
        const bd_center = CanvasUtil.get_bound_center(bd);
        const to_be_matched_bd_center = CanvasUtil.get_bound_center(to_be_matched_bd);
        let diff = {
            x: 0,
            y: 0
        };
        switch (handle) {
            case CB_HANDLE.L_EDGE:
                diff = Vec.sub(
                    Vec.rot_about(
                        Vec.med(
                            { x: to_be_matched_bd.max_x, y: to_be_matched_bd.min_y },
                            { x: to_be_matched_bd.max_x, y: to_be_matched_bd.max_y }
                        ),
                        to_be_matched_bd_center,
                        r),
                    Vec.rot_about(
                        Vec.med(
                            { x: bd.max_x, y: bd.min_y },
                            { x: bd.max_x, y: bd.max_y }),
                        bd_center,
                        r),
                )
                break;
            case CB_HANDLE.R_EDGE:
                diff = Vec.sub(
                    Vec.rot_about(
                        Vec.med(
                            { x: to_be_matched_bd.min_x, y: to_be_matched_bd.min_y },
                            { x: to_be_matched_bd.min_x, y: to_be_matched_bd.max_y }
                        ),
                        to_be_matched_bd_center,
                        r),
                    Vec.rot_about(
                        Vec.med(
                            { x: bd.min_x, y: bd.min_y },
                            { x: bd.min_x, y: bd.max_y }),
                        bd_center,
                        r),
                )
                break;
            case CB_HANDLE.B_EDGE:
                diff = Vec.sub(
                    Vec.rot_about(
                        Vec.med(
                            { x: to_be_matched_bd.min_x, y: to_be_matched_bd.min_y },
                            { x: to_be_matched_bd.max_x, y: to_be_matched_bd.min_y }
                        ),
                        to_be_matched_bd_center,
                        r),
                    Vec.rot_about(
                        Vec.med(
                            { x: bd.min_x, y: bd.min_y },
                            { x: bd.max_x, y: bd.min_y }),
                        bd_center,
                        r),
                )
                break;
            case CB_HANDLE.T_EDGE:
                diff = Vec.sub(
                    Vec.rot_about(
                        Vec.med(
                            { x: to_be_matched_bd.min_x, y: to_be_matched_bd.max_y },
                            { x: to_be_matched_bd.max_x, y: to_be_matched_bd.max_y }
                        ),
                        to_be_matched_bd_center,
                        r),
                    Vec.rot_about(
                        Vec.med(
                            { x: bd.min_x, y: bd.max_y },
                            { x: bd.max_x, y: bd.max_y }),
                        bd_center,
                        r),
                )
                break;
            case CB_HANDLE.TL_CORNER:
                diff = Vec.sub(
                    Vec.rot_about({ x: to_be_matched_bd.max_x, y: to_be_matched_bd.max_y }, to_be_matched_bd_center, r),
                    Vec.rot_about({ x: bd.max_x, y: bd.max_y }, bd_center, r),
                )
                break;
            case CB_HANDLE.TR_CORNER:
                diff = Vec.sub(
                    Vec.rot_about({ x: to_be_matched_bd.min_x, y: to_be_matched_bd.max_y }, to_be_matched_bd_center, r),
                    Vec.rot_about({ x: bd.min_x, y: bd.max_y }, bd_center, r),
                )
                break;
            case CB_HANDLE.BL_CORNER:
                diff = Vec.sub(
                    Vec.rot_about({ x: to_be_matched_bd.max_x, y: to_be_matched_bd.min_y }, to_be_matched_bd_center, r),
                    Vec.rot_about({ x: bd.max_x, y: bd.min_y }, bd_center, r),
                )
                break;
            case CB_HANDLE.BR_CORNER:
                diff = Vec.sub(
                    Vec.rot_about({ x: to_be_matched_bd.min_x, y: to_be_matched_bd.min_y }, to_be_matched_bd_center, r),
                    Vec.rot_about({ x: bd.min_x, y: bd.min_y }, bd_center, r),
                )
                break;
        }
        const new_top_left = Vec.sub({ x: to_be_matched_bd.min_x, y: to_be_matched_bd.min_y }, diff);
        const new_bot_right = Vec.sub({ x: to_be_matched_bd.max_x, y: to_be_matched_bd.max_y }, diff);

        return {
            min_x: new_top_left.x,
            min_y: new_top_left.y,
            max_x: new_bot_right.x,
            max_y: new_bot_right.y,
        }
    }

    static get_items_bound(rotated: boolean = false, ...items: CBItem[]) {
        let bds = items.map((item) => {
            switch (item.type) {
                case CBTOOL.RECTANGLE:
                    return this.ShapeUtilMap.get(CBTOOL.RECTANGLE)!.get_bound(item.shape, rotated);
                case CBTOOL.TRIANGLE:
                    return this.ShapeUtilMap.get(CBTOOL.TRIANGLE)!.get_bound(item.shape, rotated);
                case CBTOOL.ELLIPSE:
                    return this.ShapeUtilMap.get(CBTOOL.ELLIPSE)!.get_bound(item.shape, rotated);
                case CBTOOL.PEN:
                    return this.ShapeUtilMap.get(CBTOOL.PEN)!.get_bound(item.shape, rotated);
                case CBTOOL.TEXT:
                    return this.ShapeUtilMap.get(CBTOOL.TEXT)!.get_bound(item.shape, rotated);
                case CBTOOL.IMAGE:
                    return this.ShapeUtilMap.get(CBTOOL.IMAGE)!.get_bound(item.shape, rotated);
                default:
                    return empty_bd;
            }
        })
        return bds.reduce((prev, curr) => get_common_bound(prev, curr));
    }


    static get_intersected_items(bd: Bound, items: CBItem[]): number[] {
        return items.filter((item) => {
            return CanvasUtil.get_shapeutil(item.type)!.intersect_bound(bd, item.shape);
        }).map((item) => item.id);
    }

    static translate_bound(bd: Bound, delta: Point): Bound {
        return {
            min_x: bd.min_x + delta.x,
            max_x: bd.max_x + delta.x,
            min_y: bd.min_y + delta.y,
            max_y: bd.max_y + delta.y
        }
    }


    static get_bound_center(bd: Bound): Point {
        return { x: (bd.max_x + bd.min_x) / 2, y: (bd.max_y + bd.min_y) / 2 }
    }

    static resize_bound(bd: Bound, delta: Point, handle: CB_EDGE_HANDLE | CB_CORNER_HANDLE, is_locked: boolean = false, r: number = 0): Bound {
        if (r) {
            delta = Vec.rot(delta, -r);
        }
        let new_bd = { ...bd };

        switch (handle) {
            case CB_HANDLE.T_EDGE:
            case CB_HANDLE.TL_CORNER:
            case CB_HANDLE.TR_CORNER:
                new_bd.min_y += delta.y;
                if (is_locked && (new_bd.max_y - new_bd.min_y) <= MIN_SIZE) {
                    new_bd.min_y = new_bd.max_y - MIN_SIZE;
                }
                break;
            case CB_HANDLE.B_EDGE:
            case CB_HANDLE.BL_CORNER:
            case CB_HANDLE.BR_CORNER:
                new_bd.max_y += delta.y;
                if (is_locked && (new_bd.max_y - new_bd.min_y) <= MIN_SIZE) {
                    new_bd.max_y = new_bd.min_y + MIN_SIZE;
                }
                break;
        }
        switch (handle) {
            case CB_HANDLE.L_EDGE:
            case CB_HANDLE.BL_CORNER:
            case CB_HANDLE.TL_CORNER:
                new_bd.min_x += delta.x;
                if (is_locked && (new_bd.max_x - new_bd.min_x) <= MIN_SIZE) {
                    new_bd.min_x = new_bd.max_x - MIN_SIZE;
                }
                break;
            case CB_HANDLE.R_EDGE:
            case CB_HANDLE.TR_CORNER:
            case CB_HANDLE.BR_CORNER:
                new_bd.max_x += delta.x;
                if (is_locked && (new_bd.max_x - new_bd.min_x) <= MIN_SIZE) {
                    new_bd.max_x = new_bd.min_x + MIN_SIZE;
                }
                break;
        }
        if (new_bd.min_x > new_bd.max_x) {
            let temp = new_bd.min_x;
            new_bd.min_x = new_bd.max_x;
            new_bd.max_x = temp;
        }
        if (new_bd.min_y > new_bd.max_y) {
            let temp = new_bd.min_y;
            new_bd.min_y = new_bd.max_y;
            new_bd.max_y = temp;
        }
        return new_bd;
    }

    static rotate_items(bd: Bound, items: CBItem[], curr_point: Point, movement: Point): void {
        const prev_point = Vec.sub(curr_point, movement);
        const bd_center = CanvasUtil.get_bound_center(bd);
        const curr_r = Vec.get_ang(bd_center, curr_point);
        const prev_r = Vec.get_ang(bd_center, prev_point);
        items.forEach((item) => {
            const shapeutil = CanvasUtil.get_shapeutil(item.type);
            switch (item.type) {
                case CBTOOL.IMAGE:
                case CBTOOL.ELLIPSE:
                case CBTOOL.RECTANGLE:
                case CBTOOL.TEXT:
                    shapeutil?.rot_shape_about(bd_center, curr_r - prev_r, item.shape);
                    break;
                case CBTOOL.TRIANGLE:
                case CBTOOL.PEN:
                    //@ts-ignore
                    shapeutil?.rot_shape_about(bd_center, curr_r - prev_r, item.shape, items.length === 1);
                    break;

            }
        })
    }

    static translate_items(delta: Point, items: CBItem[]): void {
        items.forEach((item) => {
            const shapeutil = CanvasUtil.get_shapeutil(item.type);
            shapeutil?.translate_shape(delta, item.shape);
        })
    }

    static get_aspect_ratio_param(image: Image, movement: Point, handle: CB_CORNER_HANDLE | CB_EDGE_HANDLE): {
        movement: Point,
        handle: CB_CORNER_HANDLE | CB_EDGE_HANDLE
    } {
        const xy_ratio = image.mx / image.my;
        const abs_deltay = Math.max(Math.abs(movement.x), Math.abs(movement.y));
        const abs_deltax = xy_ratio * abs_deltay;
        let res = {
            movement: {
                x: movement.x >= 0 ? abs_deltax : -abs_deltax,
                y: movement.y >= 0 ? abs_deltay : -abs_deltay
            },
            handle: handle
        };
        if (handle < 4) {
            res.handle = handle;
        } else if (handle < 6) {
            // T_EDGE & L_EDGE
            res.handle = CB_HANDLE.TL_CORNER;
        } else {
            // B_EDGE & R_EDGE
            res.handle = CB_HANDLE.BR_CORNER;
        }

        switch (handle) {
            case CB_HANDLE.B_EDGE:
            case CB_HANDLE.T_EDGE:
            case CB_HANDLE.BR_CORNER:
            case CB_HANDLE.TL_CORNER:
                res.movement.y = movement.y >= 0 ? abs_deltay : -abs_deltay;
                break;
            case CB_HANDLE.L_EDGE:
            case CB_HANDLE.R_EDGE:
                res.movement.y = movement.x >= 0 ? abs_deltay : -abs_deltay;
                break;
            case CB_HANDLE.BL_CORNER:
            case CB_HANDLE.TR_CORNER:
                break;
        }
        return res;
    }

    static get_resized_item_bd(item_bd: Bound, common_bd: Bound, resized_common_bd: Bound): Bound {
        const length_ratio = (item_bd.max_x - item_bd.min_x) / (common_bd.max_x - common_bd.min_x);
        const height_ratio = (item_bd.max_y - item_bd.min_y) / (common_bd.max_y - common_bd.min_y);
        const offset_x_ratio = (item_bd.min_x - common_bd.min_x) / (common_bd.max_x - common_bd.min_x);
        const offset_y_ratio = (item_bd.min_y - common_bd.min_y) / (common_bd.max_y - common_bd.min_y);
        const resized_common_bound_length = resized_common_bd.max_x - resized_common_bd.min_x;
        const resized_common_bound_height = resized_common_bd.max_y - resized_common_bd.min_y;

        const min_x = resized_common_bd.min_x + offset_x_ratio * resized_common_bound_length;
        const max_x = min_x + length_ratio * resized_common_bound_length;
        const min_y = resized_common_bd.min_y + offset_y_ratio * resized_common_bound_height;
        const max_y = min_y + height_ratio * resized_common_bound_height;

        return {
            min_x: min_x,
            max_x: max_x,
            min_y: min_y,
            max_y: max_y
        }
    }

    static resize_items(bd: Bound, items: CBItem[], movement: Point, handle: CB_EDGE_HANDLE | CB_CORNER_HANDLE): void {
        const image_found = items.find((e) => e.type === CBTOOL.IMAGE);
        if (image_found) {
            console.log("pre locked", movement, handle);
            const res = CanvasUtil.get_aspect_ratio_param(image_found.shape as Image, movement, handle);
            movement = res.movement;
            handle = res.handle;
            console.log("aspect ratio locked: ", res);
        }
        const is_single_item = items.length === 1;
        const r = is_single_item ? items[0].shape.r : 0;
        const resized_common_bound = CanvasUtil.resize_bound(bd, movement, handle, true, r);

        items.forEach((item) => {
            const shapeutil = CanvasUtil.get_shapeutil(item.type);
            const item_bd = shapeutil!.get_bound(item.shape);
            let resized_item_bd = CanvasUtil.get_resized_item_bd(item_bd, bd, resized_common_bound);

            if (is_single_item) {
                resized_item_bd = CanvasUtil.match_bound_anchor(bd, resized_item_bd, r, handle);
            }

            switch (item.type) {
                case CBTOOL.ELLIPSE:
                case CBTOOL.RECTANGLE:
                case CBTOOL.TRIANGLE:
                    item.shape = { ...shapeutil!.get_shape_from_bound(resized_item_bd), r: item.shape.r };
                    break;
                case CBTOOL.IMAGE:
                case CBTOOL.PEN:
                    item.shape = { ...shapeutil!.get_shape_from_bound(resized_item_bd, item.shape), r: item.shape.r };
                    break;
                case CBTOOL.TEXT:
                    let x_scale = (resized_item_bd.max_x - resized_item_bd.min_x) / (item_bd.max_x - item_bd.min_x);
                    let y_scale = (resized_item_bd.max_y - resized_item_bd.min_y) / (item_bd.max_y - item_bd.min_y);
                    let new_scale: number;
                    if (x_scale >= 1 && y_scale >= 1) {
                        new_scale = (item.shape as Text).scale * Math.max(x_scale, y_scale);
                    } else {
                        new_scale = (item.shape as Text).scale * Math.min(x_scale, y_scale);
                    }

                    item.shape = { ...shapeutil!.get_shape_from_bound(resized_item_bd), r: item.shape.r, scale: new_scale };
                    break;
            }
        })

    }

    static uuid(): number {
        return parseInt(nanoid());
    }


}