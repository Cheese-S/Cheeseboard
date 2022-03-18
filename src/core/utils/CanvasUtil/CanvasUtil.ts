import { CBITEM_TYPE } from "../../constant";
import { RectShapeUtil, EllipseShapeUtil, PencilShapeUtil, ShapeUtil } from "../shapeUtil";
import TriangleShapeUtil from "../shapeUtil/TriangleShapeUtil";


export class CanvasUtil {

    private static ShapeUtilMap = new Map<number, ShapeUtil>([
        [CBITEM_TYPE.RECTANGLE, new RectShapeUtil()],
        [CBITEM_TYPE.ELLIPSE, new EllipseShapeUtil()],
        [CBITEM_TYPE.PENCIL, new PencilShapeUtil()],
        [CBITEM_TYPE.TRIANGLE, new TriangleShapeUtil()]
    ])

    /**
     * Get a type's shape util object
     * @param type 
     * @returns A type's ShapeUtil 
     */

    static get_shape_util(type: CBITEM_TYPE) {
        return this.ShapeUtilMap.get(type);
    }

    
}