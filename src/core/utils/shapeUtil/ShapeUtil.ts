import { Bound, Shape, Point } from "../../type";

export default abstract class ShapeUtil {

    /**
     * Get the bounding box of a shape
     * @param shape 
     */
    abstract get_bound(shape: Shape, rotated?: boolean): Bound;
    

    /**
     * Test to see if the given bound intersects / contains the shape
     * @param bd 
     * @param shape 
     */
    abstract intersect_bound(bd: Bound, shape: Shape): boolean;


    /**
     * Reconstruct the shape from a center ()
     * NOTE: The shape constructed will **NOT** be rotated
     * @param bd 
     */
    abstract get_shape_from_bound(bd: Bound): Shape;

    /**
     * Rotate the shape around a given point (rotate the center of the shape and reconstruct the shape)
     * @param p 
     * @param r 
     * @param shape 
     */
    abstract rot_shape_about(p: Point, r: number, shape: Shape): void;  

    /**
     * Translate a shape in place
     * @param delta 
     * @param shape 
     */
    abstract translate_shape(delta: Point, shape: Shape): void;

    /**
     * Translate a shape to the point's position. (The point is treated as a top left anchor)
     * @param shape 
     * @param pt 
     */
    abstract set_shape_top_left(shape: Shape, pt: Point): void; 
}