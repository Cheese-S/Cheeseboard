import { Shape, Point, Bound } from "../../type";
import ShapeUtil from "./ShapeUtil";

export default class PencilShapeUtil extends ShapeUtil {
    
    translate_shape(delta: Point, shape: Shape): void {
        throw new Error("Method not implemented.");
    }
    get_shape_center(shape: Shape): Point {
        throw new Error("Method not implemented.");
    }
    get_shape_from_center(center: Point): Shape {
        throw new Error("Method not implemented.");
    }
    get_shape_from_bound(bd: Bound): Shape {
        throw new Error("Method not implemented.");
    }
    rot_shape_about(p: Point, r: number, shape: Shape): void {
        throw new Error("Method not implemented.");
    }
    get_bound(shape: Shape): Bound {
        throw new Error("Method not implemented.");
    }
    intersect_bound(bd: Bound, shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }
    transform_shape(shape: Shape, scale?: Point, trans?: Point, rot?: number): void {
        throw new Error("Method not implemented.");
    }

    set_shape_top_left(shape: Shape, pt: Point): void {
        throw new Error("Method not implemented.");
    }
    
}