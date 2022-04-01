import { Shape, Ellipse, Point, Bound } from "../../type";
import { bound_ellipse_intersect, get_ellipse_bound } from "../geometry";
import ShapeUtil from "./ShapeUtil";

export default class EllipseShapeUtil extends ShapeUtil {

    get_bound(e: Ellipse): Bound {
        return get_ellipse_bound(e);
    }

    intersect_bound(bd: Bound, e: Ellipse): boolean {
        return bound_ellipse_intersect(bd, e); 
    }
    
    transform_shape(e: Ellipse, scale?: Point, trans?: Point, rot?: number): void {
        if (scale !== undefined) {
            e.rx += scale.x / 2; 
            e.ry += scale.y / 2; 
            e.center.x += scale.x / 2;
            e.center.y += scale.y / 2;
        }
        if (trans !== undefined) {
            e.center.x += trans.x; 
            e.center.y += trans.y;
        }
        if (rot !== undefined) {
            e.r = rot; 
        }
    }

    set_shape_top_left(shape: Ellipse, pt: Point): void {
        shape.center =  {x: pt.x + shape.rx, y: pt.y + shape.ry }
    }

}