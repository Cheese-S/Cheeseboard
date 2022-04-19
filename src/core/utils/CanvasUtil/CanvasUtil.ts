import { CBTOOL, CB_HANDLE, empty_bd, MIN_SIZE, CBSTROKE_WIDTH } from "../../constant";
import { Bound, CBItem, CBStyle, Shape, Point, ItemCSS, CB_EDGE_HANDLE, CB_CORNER_HANDLE, Triangle, Text } from "../../type";
import { RectShapeUtil, EllipseShapeUtil, PencilShapeUtil, ShapeUtil } from "../shapeUtil";
import TriangleShapeUtil from "../shapeUtil/TriangleShapeUtil";
import React, { CSSProperties } from "react";
import { get_common_bound } from "../geometry";
import { Vec } from "../vec";
import TextShapeUtil from "../shapeUtil/TextShapeUtil";

const font_size = {
    [CBSTROKE_WIDTH.SMALL]: 12,
    [CBSTROKE_WIDTH.MEDIUM]: 24,
    [CBSTROKE_WIDTH.LARGE]: 36,
}

export class CanvasUtil {

    private static ShapeUtilMap = new Map<number, ShapeUtil>([
        [CBTOOL.RECTANGLE, new RectShapeUtil()],
        [CBTOOL.ELLIPSE, new EllipseShapeUtil()],
        [CBTOOL.PENCIL, new PencilShapeUtil()],
        [CBTOOL.TRIANGLE, new TriangleShapeUtil()],
        [CBTOOL.TEXT, new TextShapeUtil()]
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
                case CBTOOL.PENCIL:
                    return this.ShapeUtilMap.get(CBTOOL.PENCIL)!.get_bound(item.shape, rotated);
                case CBTOOL.TEXT:
                    return this.ShapeUtilMap.get(CBTOOL.TEXT)!.get_bound(item.shape, rotated);
                default:
                    return empty_bd;
            }
        })
        return bds.reduce((prev, curr) => get_common_bound(prev, curr));
    }


    static get_intersected_items(bd: Bound, items: CBItem[]): number[] {
        return items.filter((item) => {
            switch (item.type) {
                case CBTOOL.RECTANGLE:
                    return this.ShapeUtilMap.get(CBTOOL.RECTANGLE)!.intersect_bound(bd, item.shape);
                case CBTOOL.TRIANGLE:
                    return this.ShapeUtilMap.get(CBTOOL.TRIANGLE)!.intersect_bound(bd, item.shape);
                case CBTOOL.ELLIPSE:
                    return this.ShapeUtilMap.get(CBTOOL.ELLIPSE)!.intersect_bound(bd, item.shape);
                case CBTOOL.PENCIL:
                    return this.ShapeUtilMap.get(CBTOOL.PENCIL)!.intersect_bound(bd, item.shape);
                case CBTOOL.TEXT:
                    return this.ShapeUtilMap.get(CBTOOL.TEXT)!.intersect_bound(bd, item.shape);
                default:
                    return false;
            }
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
            if (item.type === CBTOOL.TRIANGLE) {
                (shapeutil as TriangleShapeUtil)?.rot_shape_about(bd_center, curr_r - prev_r, item.shape as Triangle, items.length === 1);
            } else {
                shapeutil?.rot_shape_about(bd_center, curr_r - prev_r, item.shape);
            }
        })
    }

    static translate_items(delta: Point, items: CBItem[]): void {
        items.forEach((item) => {
            const shapeutil = CanvasUtil.get_shapeutil(item.type);
            shapeutil?.translate_shape(delta, item.shape);
        })
    }

    static resize_items(bd: Bound, items: CBItem[], movement: Point, handle: CB_EDGE_HANDLE | CB_CORNER_HANDLE): void {
        const is_single_item = items.length === 1;
        const r = is_single_item ? items[0].shape.r : 0;
        const resized_common_bound = CanvasUtil.resize_bound(bd, movement, handle, true, r);

        items.forEach((item) => {
            const shapeutil = CanvasUtil.get_shapeutil(item.type);
            const item_bd = shapeutil!.get_bound(item.shape);
            const length_ratio = (item_bd.max_x - item_bd.min_x) / (bd.max_x - bd.min_x);
            const height_ratio = (item_bd.max_y - item_bd.min_y) / (bd.max_y - bd.min_y);
            const offset_x_ratio = (item_bd.min_x - bd.min_x) / (bd.max_x - bd.min_x);
            const offset_y_ratio = (item_bd.min_y - bd.min_y) / (bd.max_y - bd.min_y);
            const resized_common_bound_length = resized_common_bound.max_x - resized_common_bound.min_x;
            const resized_common_bound_height = resized_common_bound.max_y - resized_common_bound.min_y;



            const min_x = resized_common_bound.min_x + offset_x_ratio * resized_common_bound_length;
            const max_x = min_x + length_ratio * resized_common_bound_length;
            const min_y = resized_common_bound.min_y + offset_y_ratio * resized_common_bound_height;
            const max_y = min_y + height_ratio * resized_common_bound_height;

            let resized_item_bd = {
                min_x: min_x,
                max_x: max_x,
                min_y: min_y,
                max_y: max_y
            }

            if (is_single_item) {
                resized_item_bd = CanvasUtil.match_bound_anchor(bd, resized_item_bd, r, handle);
            }
            if (item.type === CBTOOL.TEXT) {
                let x_scale = (resized_item_bd.max_x - resized_item_bd.min_x) / (item_bd.max_x - item_bd.min_x);
                let y_scale = (resized_item_bd.max_y - resized_item_bd.min_y) / (item_bd.max_y - item_bd.min_y);
                let new_scale: number;
                if (x_scale >= 1 && y_scale >= 1) {
                    new_scale = (item.shape as Text).scale * Math.max(x_scale, y_scale);
                } else {
                    new_scale = (item.shape as Text).scale * Math.min(x_scale, y_scale);
                }
                console.log(`x_scale: ${x_scale}, y_scale: ${y_scale}, new_scale: ${new_scale}`);
                
                item.shape = { ...shapeutil!.get_shape_from_bound(resized_item_bd), r: item.shape.r, scale: new_scale };
            } else {
                item.shape = { ...shapeutil!.get_shape_from_bound(resized_item_bd), r: item.shape.r };
            }
        })

    }


}