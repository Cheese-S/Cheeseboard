import {  CBTOOL, CB_HANDLE, empty_bd, MIN_SIZE } from "../../constant";
import { Bound, CBItem, CBStyle, Shape, Point, ItemCSS, CB_EDGE_HANDLE, CB_CORNER_HANDLE } from "../../type";
import { RectShapeUtil, EllipseShapeUtil, PencilShapeUtil, ShapeUtil } from "../shapeUtil";
import TriangleShapeUtil from "../shapeUtil/TriangleShapeUtil";
import React, { CSSProperties } from "react";
import { get_common_bound } from "../geometry";
import { Vec } from "../vec";

export class CanvasUtil {

    private static ShapeUtilMap = new Map<number, ShapeUtil>([
        [CBTOOL.RECTANGLE, new RectShapeUtil()],
        [CBTOOL.ELLIPSE, new EllipseShapeUtil()],
        [CBTOOL.PENCIL, new PencilShapeUtil()],
        [CBTOOL.TRIANGLE, new TriangleShapeUtil()]
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


    static get_item_css(bd: Bound, r: number, style: CBStyle): ItemCSS {
        let container_css: CSSProperties, component_css: CSSProperties;
        container_css = CanvasUtil.get_container_css(bd, r, style.is_ghost); 
        component_css = {
            stroke: `var(${style.color})`,
            strokeWidth: `var(${style.size})`,
            fill: style.fill ? `var(${style.color}Fill)` : 'none',
            strokeDasharray: style.dotted ? 'var(--cbDotted)' : 0
        }
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
                    throw new Error("Text Bound Not Implemented")
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
                    throw new Error("NOT IMPLEMENTED"); 
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
        return {x: (bd.max_x + bd.min_x) / 2, y: (bd.max_y + bd.min_y) / 2}
    }

    static resize_bound(bd: Bound, delta: Point, handle: CB_EDGE_HANDLE | CB_CORNER_HANDLE, is_locked: boolean = false): Bound {
        let new_bd = {...bd}; 
        switch(handle) {
            case CB_HANDLE.T_EDGE:
            case CB_HANDLE.TL_CORNER:
            case CB_HANDLE.TR_CORNER:
                new_bd.min_y += delta.y;
                if (is_locked && new_bd.min_y >= new_bd.max_y) {
                    new_bd.min_y = new_bd.max_y - MIN_SIZE; 
                }
                break; 
            case CB_HANDLE.B_EDGE:
            case CB_HANDLE.BL_CORNER:
            case CB_HANDLE.BR_CORNER:
                new_bd.max_y += delta.y;
                if (is_locked && new_bd.min_y >= new_bd.max_y) {
                    new_bd.max_y = new_bd.min_y + MIN_SIZE; 
                }
                break; 
        }
        switch(handle) {
            case CB_HANDLE.L_EDGE:
            case CB_HANDLE.BL_CORNER:
            case CB_HANDLE.TL_CORNER:
                new_bd.min_x += delta.x;
                if (is_locked && new_bd.min_x >= new_bd.max_x) {
                    new_bd.min_x = new_bd.max_x - MIN_SIZE; 
                }
                break; 
            case CB_HANDLE.R_EDGE:
            case CB_HANDLE.TR_CORNER:
            case CB_HANDLE.BR_CORNER:
                new_bd.min_x += delta.x;
                if (is_locked && new_bd.min_x >= new_bd.max_x) {
                    new_bd.max_x = new_bd.min_x - MIN_SIZE; 
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

    static rotate_items(bd: Bound, items: CBItem[], init_point: Point, curr_point: Point, movement: Point): void {
        const prev_point = Vec.sub(curr_point, movement);
        const bd_center = CanvasUtil.get_bound_center(bd); 
        const curr_r = Vec.get_angle(curr_point, bd_center);
        const init_r = Vec.get_angle(init_point, bd_center);
        const prev_r = Vec.get_angle(prev_point, bd_center);
        console.log(curr_r);
        console.log(init_r);
        console.log(curr_r - init_r);
        items.forEach((item) => {
            const shapeutil = CanvasUtil.get_shapeutil(item.type); 
            shapeutil?.rot_shape_about(bd_center, curr_r - prev_r, item.shape);
        })
    }

    static translate_items(delta: Point, items: CBItem[]): void {
        items.forEach((item) => {
            const shapeutil = CanvasUtil.get_shapeutil(item.type);
            shapeutil?.translate_shape(delta, item.shape);
        })
    } 

    static resize_items(new_bd: Bound, items: CBItem[], handle: CB_EDGE_HANDLE | CB_CORNER_HANDLE): void {
        
    }


}