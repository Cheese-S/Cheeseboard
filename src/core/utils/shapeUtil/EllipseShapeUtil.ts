import { Shape, Ellipse, Point, Bound } from "../../type";
import { bound_ellipse_intersect, get_ellipse_bound } from "../geometry";
import { Vec } from "../vec";
import ShapeUtil from "./ShapeUtil";

export default class EllipseShapeUtil extends ShapeUtil {

    translate_shape(delta: Point, shape: Ellipse): void {
        shape.center = Vec.add(shape.center, delta);
    }

    get_shape_from_bound(bd: Bound): Ellipse {
        const width = bd.max_x - bd.min_x;
        const height = bd.max_y - bd.min_y;
        return {
            center: {x: (bd.max_x + bd.min_x) / 2, y: (bd.min_y + bd.max_y) / 2},
            rx: width / 2,
            ry: height / 2,
            r: 0
        }
    }

    rot_shape_about(p: Point, r: number, shape: Ellipse): void {
        shape.center = Vec.rot_about(shape.center, p, r);
        shape.r += r;
    }

    get_bound(e: Ellipse, rotated: boolean = false): Bound {
        return get_ellipse_bound(e, rotated);
    }

    intersect_bound(bd: Bound, e: Ellipse): boolean {
        return bound_ellipse_intersect(bd, e);
    }

    set_shape_top_left(shape: Ellipse, pt: Point): void {
        shape.center = { x: pt.x + shape.rx, y: pt.y + shape.ry }
    }

}