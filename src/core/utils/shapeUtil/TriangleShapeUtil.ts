import { Bound, Point, Shape, Triangle } from "../../type";
import { bound_triangle_intersect, get_triangle_bound } from "../geometry";
import { Vec } from "../vec";
import ShapeUtil from "./ShapeUtil";


export default class TriangleShapeUtil extends ShapeUtil {

    translate_shape(delta: Point, shape: Triangle): void {
        shape.a = Vec.add(shape.a, delta);
        shape.b = Vec.add(shape.b, delta);
        shape.c = Vec.add(shape.c, delta);
    }

    get_center(t: Triangle) {
        let center = {
            x: Math.abs(t.a.x + t.c.x) / 2,
            y: Math.abs(t.b.y + t.a.y) / 2
        }
        return center;
    }


    get_shape_from_bound(bd: Bound): Shape {
        return {
            a: { x: bd.min_x, y: bd.max_y },
            b: { x: (bd.max_x + bd.min_x) / 2, y: bd.min_y },
            c: { x: bd.max_x, y: bd.max_y },
            r: 0
        }
    }

    rot_shape_about(p: Point, r: number, shape: Triangle, is_alone: boolean = false): void {
        if (!is_alone) {
            const center = this.get_center(shape);
            const rot_center = Vec.rot_about(center, p, r);
            const a_diff = Vec.sub(shape.a, center);
            const b_diff = Vec.sub(shape.b, center);
            const c_diff = Vec.sub(shape.c, center);
    
            shape.a = Vec.add(rot_center, a_diff);
            shape.b = Vec.add(rot_center, b_diff);
            shape.c = Vec.add(rot_center, c_diff);
        }
        shape.r = (shape.r + r);
    }

    get_bound(t: Triangle, rotated: boolean = false): Bound {
        return get_triangle_bound(t, rotated);
    }

    get_path(t: Triangle): string {
        const h = Math.abs(t.a.y - t.b.y);
        const w = Math.abs(t.c.x - t.a.x);
        return `M 0 ${h} L ${w / 2} 0 L ${w} ${h} Z`;
    }

    intersect_bound(bd: Bound, t: Triangle): boolean {
        return bound_triangle_intersect(bd, t);
    }

    set_shape_top_left(shape: Triangle, pt: Point): void {
        const x_diff = shape.b.x - shape.a.x;
        const y_diff = shape.a.y - shape.b.y;
        shape.a = { x: pt.x, y: pt.y + y_diff };
        shape.b = { x: pt.x + x_diff, y: pt.y };
        shape.c = { x: pt.x + 2 * x_diff, y: pt.y + y_diff };
    }
}