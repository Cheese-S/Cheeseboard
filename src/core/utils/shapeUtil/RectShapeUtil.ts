import React from "react";
import { Bound, Point, Rect, Shape } from "../../type";
import { bound_rect_intersect, get_rect_bound } from "../geometry";
import { Vec } from "../vec";
import ShapeUtil from "./ShapeUtil";


export default class RectShapeUtil extends ShapeUtil {

    translate_shape(delta: Point, shape: Rect): void {
        shape.center = Vec.add(shape.center, delta);
    }
    
    get_bound(rect: Rect, rotated: boolean): Bound {
        return get_rect_bound(rect, rotated);
    }
    
    intersect_bound(bd: Bound, r: Rect): boolean {
        return bound_rect_intersect(bd, r);
    }
    
    set_shape_top_left(shape: Rect, pt: Point): void {
        shape.center = { x: pt.x + shape.mx, y: pt.y + shape.my }
    }
    
    get_shape_from_bound(bd: Bound): Rect {
        const height = bd.max_y - bd.min_y;
        const width = bd.max_x - bd.min_x;
        return {
            mx: width / 2,
            my: height / 2,
            center: {x: (bd.max_x + bd.min_x) / 2, y: (bd.min_y + bd.max_y) / 2},
            r: 0
        }
    }

    rot_shape_about(p: Point, r: number, shape: Rect): void {
        shape.center = Vec.rot_about(shape.center, p, r);
        shape.r += r; 
        shape.r %= 2 * Math.PI
    }
}
