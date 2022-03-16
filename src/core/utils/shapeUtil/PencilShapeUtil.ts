import { Shape, Bound, Point } from "../type";
import ShapeUtil from "./ShapeUtil";

export default class PencilShapeUtil extends ShapeUtil {
    get_bound(shape: Shape): Bound {
        throw new Error("Method not implemented.");
    }
    intersect_bound(bd: Bound, shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }
    transform_shape(shape: Shape, scale?: Point, trans?: Point, rot?: number): void {
        throw new Error("Method not implemented.");
    }
    
}