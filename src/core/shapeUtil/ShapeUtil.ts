import { Bound, Shape } from "../type";

export default abstract class ShapeUtil {

    abstract getBound(shape: Shape): Bound;

    abstract intersectWithBound(bd: Bound): boolean;

    abstract transformShape(shape: Shape, scale?: number, trans?: number, rot?: number): void;



    
}