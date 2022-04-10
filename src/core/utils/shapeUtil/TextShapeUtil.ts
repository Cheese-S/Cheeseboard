import { Shape, Bound, Point, Rect } from "../../type";
import { bound_rect_intersect, get_rect_bound } from "../geometry";
import { Vec } from "../vec";
import ShapeUtil from "./ShapeUtil";


export default class TextShapeUtil extends ShapeUtil {
    get_bound(shape: Rect, rotated?: boolean): Bound {
        return get_rect_bound(shape, rotated);
    }
    intersect_bound(bd: Bound, shape: Rect): boolean {
        return bound_rect_intersect(bd, shape);
    }
    get_shape_from_bound(bd: Bound): Shape {
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
        shape.r = (shape.r + r);
    }

    translate_shape(delta: Point, shape: Rect): void {
        shape.center = Vec.add(shape.center, delta);
    }

    set_shape_top_left(shape: Rect, pt: Point): void {
        shape.center = { x: pt.x + shape.mx, y: pt.y + shape.my }
    }

}