import { Shape, Bound, Point, Polyline } from "../../type";
import { bound_poly_intersect, get_polyseg_bound, get_polyseg_center } from "../geometry";
import { Vec } from "../vec";
import ShapeUtil from "./ShapeUtil";


export default class PenShapeUtil extends ShapeUtil {

    get_bound(shape: Polyline, rotated: boolean = false): Bound {
        return get_polyseg_bound(shape, rotated);
    }

    intersect_bound(bd: Bound, shape: Polyline): boolean {
        return bound_poly_intersect(bd, shape);
    }

    get_shape_from_bound(bd: Bound, old_shape: Polyline): Polyline {
        const old_bd = this.get_bound(old_shape);
        const bd_width = bd.max_x - bd.min_x;
        const bd_height = bd.max_y - bd.min_y;
        return {
            points: old_shape.points.map((pt) => {
                const x_offset_ratio = (pt.x - old_bd.min_x) / (old_bd.max_x - old_bd.min_x);
                const y_offset_ratio = (pt.y - old_bd.min_y) / (old_bd.max_y - old_bd.min_y);
                return {
                    x: x_offset_ratio * bd_width + bd.min_x,
                    y: y_offset_ratio * bd_height + bd.min_y
                }
            }),
            r: 0
        }
    }

    rot_shape_about(p: Point, r: number, shape: Polyline, is_alone: boolean = false): void {
        if (!is_alone) {
            const center = get_polyseg_center(shape.points);
            const rot_center = Vec.rot_about(center, p, r);
            console.log(`center: ${center} rot_center: ${rot_center}`);
            shape.points = shape.points.map((pt) => Vec.add(rot_center, Vec.sub(pt, center))); 
        }
        shape.r = (shape.r + r); 
    }

    translate_shape(delta: Point, shape: Polyline): void {
        shape.points = shape.points.map((pt) => Vec.add(pt, delta)); 
    }

    set_shape_top_left(shape: Polyline, pt: Point): void {
        const bd = get_polyseg_bound(shape); 
        const diff = Vec.sub(pt, {x: bd.min_x, y: bd.min_y });
        shape.points = shape.points.map((pt) => Vec.add(pt, diff)); 
    }

    get_path(shape: Polyline): string {
        const bd = this.get_bound(shape)
        const top_left = {x: bd.min_x, y: bd.min_y}; 
        let path = '';
        shape.points.forEach((pt, i) => {
            const diff = Vec.sub(pt, top_left); 
            if (i === 0) {
                path = path + `M ${diff.x} ${diff.y} `
            } else {
                path = path + `L ${diff.x} ${diff.y} `
            }
        })
        return path;
    }

}