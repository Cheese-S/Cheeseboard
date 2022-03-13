import { Bound, Shape, Point } from "../type";

export default abstract class ShapeUtil {

    abstract get_bound(shape: Shape): Bound;

    abstract intersect_bound(bd: Bound, shape: Shape): boolean;

    abstract transform_shape(shape: Shape, scale?: Point, trans?: Point, rot?: number): void;



    
}