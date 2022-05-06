import { Bound, Point, Polyline } from "../../type";
import { bound_poly_intersect, get_polyseg_bound, get_polyseg_center, sqdis_to_seg } from "../geometry";
import { Vec } from "../vec";
import ShapeUtil from "./ShapeUtil";

const BUFFER_SIZE = 4;

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
        const diff = Vec.sub(pt, { x: bd.min_x, y: bd.min_y });
        shape.points = shape.points.map((pt) => Vec.add(pt, diff));
    }

    get_path(shape: Polyline): string {
        const bd = this.get_bound(shape)
        const top_left = { x: bd.min_x, y: bd.min_y };
        let path = '';
        shape.points.forEach((pt, i) => {
            const diff = Vec.sub(pt, top_left);
            if (i === 0) {
                path = path + `M ${diff.x} ${diff.y} `
            } else {
                const start = Vec.sub(this.get_control_pt(shape.points[i - 1], shape.points[i - 2], pt), top_left);
                const end = Vec.sub(this.get_control_pt(pt, shape.points[i - 1], shape.points[i + 1], true), top_left);
                const diff = Vec.sub(pt, top_left);
                path = path + `C ${start.x} ${start.y} ${end.x} ${end.y} ${diff.x} ${diff.y} `;
                // path = path + `L ${diff.x} ${diff.y} `
            }
        })
        return path;
    }

    private simplify_dist(pts: Point[], sqtolerance: number): Point[] {
        let prev: Point = pts[0], curr: Point;
        let res: Point[] = [prev];
        for (let i = 1; i < pts.length; i++) {
            curr = pts[i];
            if (Vec.sqdis_to(curr, prev) > sqtolerance) {
                res.push(curr);
                prev = curr;
            }
        }
        // @ts-ignore
        if (curr && (prev !== curr)) res.push(curr);

        return res;
    }

    private simplify_dp_helper(pts: Point[], first: number, last: number, sqtolerance: number, res: Point[]) {
        let max_sqdist = sqtolerance;
        let index: number;

        for (let i = first + 1; i < last; i++) {
            const sqdist = sqdis_to_seg(pts[first], pts[last], pts[i]);
            if (sqdist > max_sqdist) {
                index = i;
                max_sqdist = sqdist;
            }
        }

        if (max_sqdist > sqtolerance) {
            // @ts-ignore
            if (index - first > 1) this.simplify_dp_helper(pts, first, index, sqtolerance, res);
            // @ts-ignore
            res.push(pts[index]);
            // @ts-ignore
            if (last - index > 1) this.simplify_dp_helper(pts, index, last, sqtolerance, res);
        }
    }

    private simplify_dp(pts: Point[], sqtolerance: number) {
        const last = pts.length - 1;
        let res = [pts[0]];
        this.simplify_dp_helper(pts, 0, last, sqtolerance, res);
        res.push(pts[last]);

        return res;
    }

    simplify(pts: Point[], tolerance: number, use_simplify_dist: boolean = false): Point[] {
        if (pts.length < 2) return pts;
        const sqtolerance = tolerance * tolerance;

        pts = use_simplify_dist ? this.simplify_dist(pts, sqtolerance) : pts;
        pts = this.simplify_dp(pts, sqtolerance);

        return pts;
    }

    get_opposed_line(p1: Point, p2: Point): {
        length: number,
        angle: number
    } {
        const diff = Vec.sub(p1, p2);

        return {
            length: Math.sqrt(diff.x * diff.x + diff.y * diff.y),
            angle: Math.atan2(diff.y, diff.x)
        }
    }

    get_control_pt(current: Point, previous?: Point, next?: Point, reverse?: boolean): Point {
        const p = previous || current;
        const n = next || current;

        const smoothing = 0.10;

        const o = this.get_opposed_line(p, n);

        const angle = o.angle + (reverse ? Math.PI : 0);
        const length = o.length * smoothing;

        return {
            x: current.x + Math.cos(angle) * length,
            y: current.y + Math.sin(angle) * length
        }
    }

    private get_avg_point(buffer: Point[], offset: number): Point | undefined {
        const len = buffer.length;
        if (len % 2 === 1 || len >= BUFFER_SIZE) {
            let total: Point = { x: 0, y: 0 };
            let count: number = 0;

            for (let i = offset; i < len; i++) {
                count++;
                total = Vec.add(total, buffer[i]);
            }

            return {
                x: total.x / count,
                y: total.y / count
            }
        }
        return;
    }

    smoothing(pts: Point[]): Point[] {
        const buffer: Point[] = [];
        const res: Point[] = []; 
        
        for (let i = 0; i < pts.length; i++) {
            buffer.push(pts[i]);
            while (buffer.length > BUFFER_SIZE) buffer.shift(); 
            let new_pt = this.get_avg_point(buffer, 0);
            if (new_pt) {
                res.push(new_pt);
            }
            if (i === pts.length - 1) {
                for (let j = 2; j < buffer.length; j += 2) {
                    new_pt = this.get_avg_point(buffer, j);
                    if (new_pt) res.push(new_pt); 
                }
            }
        }
        return res;
    }
}