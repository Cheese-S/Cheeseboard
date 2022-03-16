import ShapeUtil from "../shapeUtil/ShapeUtil";
import { CBITEM_TYPE } from "../../constant";
import { RectShapeUtil, EllipseShapeUtil, PencilShapeUtil } from "../shapeUtil";
import { Point } from "../../type";


export class CanvasUtil {

    private static ShapeUtilMap = new Map<number, ShapeUtil>([
        [CBITEM_TYPE.RECTANGLE, new RectShapeUtil()],
        [CBITEM_TYPE.ELLIPSE, new EllipseShapeUtil()],
        [CBITEM_TYPE.PENCIL, new PencilShapeUtil()]
    ])

    /**
     * Get a type's shape util object
     * @param type 
     * @returns A type's ShapeUtil 
     */

    static get_shape_util(type: CBITEM_TYPE) {
        return this.ShapeUtilMap.get(type);
    }
    
    /**
     * Convert vectors from canvas space into cartesian sapce 
     * @param vec 
     * @returns Converted Vectors 
     */

    static canvas_to_cart = (...vecs: Point[]): Point[] => {
        return vecs.map((e) => {
            return {x: e.x, y: -e.y}
        }); 
    }

    /**
     * Convert vectors from cartesian space into canvas space
     * @param vecs 
     * @returns Converted Vectors
     */

    static cart_to_canvas = (...vecs: Point[]): Point[] => {
        return this.canvas_to_cart(...vecs); 
    }
}