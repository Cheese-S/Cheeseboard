import { Bound, Shape } from "../type";

export default abstract class ShapeUtil<T extends Shape> {

    abstract getBound(shape: T): Bound;

    abstract intersectWithBound(bd: Bound): boolean;

    abstract transformShape(shape: T, scale?: number, trans?: number, rot?: number): T;

}