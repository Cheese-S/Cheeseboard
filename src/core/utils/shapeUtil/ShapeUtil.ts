import { Bound, Shape, Point } from "../../type";

export default abstract class ShapeUtil {

    /**
     * Get the bounding box of a shape
     * @param shape 
     */
    abstract get_bound(shape: Shape): Bound;

    /**
     * Test to see if the given bound intersects / contains the shape
     * @param bd 
     * @param shape 
     */
    abstract intersect_bound(bd: Bound, shape: Shape): boolean;

    /**
     * Transform the geometry of a shape by the given input (SHOULD BE IN CARTESIAN SPACE)
     * @param shape 
     * @param scale Scale should be passed in as change in (x, y) rather than ratio
     * @param trans 
     * @param rot 
     */

    abstract transform_shape(shape: Shape, scale?: Point, trans?: Point, rot?: number): void;

    /**
     * Translate a shape to the point's position. (The point is treated as a top left anchor)
     * @param shape 
     * @param pt 
     */
    abstract set_shape_top_left(shape: Shape, pt: Point): void; 

    

    
}