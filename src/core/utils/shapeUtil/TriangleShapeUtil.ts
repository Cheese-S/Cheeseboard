import { Shape, Bound, Point, Triangle } from "../../type";
import { bound_triangle_intersect, get_triangle_bound } from "../geometry";
import ShapeUtil from "./ShapeUtil";


export default class TriangleShapeUtil extends ShapeUtil {
    
    get_bound(t: Triangle): Bound {
        return get_triangle_bound(t);
    }

    get_path(t: Triangle): string {
        const h = t.a.y - t.b.y; 
        const w = t.c.x - t.a.x; 
        return `M 0 ${h} L ${w/2} 0 L ${w} ${h} Z`;
    }

    intersect_bound(bd: Bound, t: Triangle): boolean {
        return bound_triangle_intersect(bd, t);
    }

    transform_shape(t: Triangle, scale?: Point, trans?: Point, rot?: number): void {
        if (scale !== undefined) {
            t.c.x += scale.x; 
            t.a.y += scale.y; 
            t.c.y += scale.y; 
            t.b.x = (t.c.x + t.a.x ) / 2;
        }
        if (trans !== undefined) {
            t.a.x += trans.x; 
            t.a.y += trans.y;
            t.b.x += trans.x; 
            t.b.y += trans.y;
            t.c.x += trans.x; 
            t.c.y += trans.y;
        }
        if (rot !== undefined) {
            t.r = rot; 
        }
    }
}