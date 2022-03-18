import React from "react";
import { Bound, Point, Rect } from "../../type";
import { bound_rect_intersect, get_rect_bound } from "../geometry";
import ShapeUtil from "./ShapeUtil";


export default class RectShapeUtil extends ShapeUtil {
    get_bound(rect: Rect): Bound {
        return get_rect_bound(rect);
    }
    
    intersect_bound(bd: Bound, r: Rect): boolean {
        return bound_rect_intersect(bd, r); 
    }

    transform_shape(r: Rect, scale?: Point, trans?: Point, rot?: number): void {
        if (scale !== undefined) {
            r.mx += scale.x / 2; 
            r.my += scale.y / 2; 
            r.center.x += scale.x / 2;
            r.center.y += scale.y / 2;
        }
        if (trans !== undefined) {
            r.center.x += trans.x; 
            r.center.y += trans.y;
        }
        if (rot !== undefined) {
            r.r = rot; 
        }
    }

}
