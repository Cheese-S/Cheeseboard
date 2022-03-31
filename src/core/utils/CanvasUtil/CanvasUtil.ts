import { CBTOOL } from "../../constant";
import { Bound, CBItem } from "../../type";
import { RectShapeUtil, EllipseShapeUtil, PencilShapeUtil, ShapeUtil } from "../shapeUtil";
import TriangleShapeUtil from "../shapeUtil/TriangleShapeUtil";
import { ItemCSS } from "../../state";
import React, { CSSProperties } from "react";

export class CanvasUtil {

    private static ShapeUtilMap = new Map<number, ShapeUtil>([
        [CBTOOL.RECTANGLE, new RectShapeUtil()],
        [CBTOOL.ELLIPSE, new EllipseShapeUtil()],
        [CBTOOL.PENCIL, new PencilShapeUtil()],
        [CBTOOL.TRIANGLE, new TriangleShapeUtil()]
    ])

    /**
     * Get a type's shape util object
     * @param type 
     * @returns A type's ShapeUtil 
     */

    static get_shapeutil(type: CBTOOL) {
        return this.ShapeUtilMap.get(type);
    }
    

    static get_item_css(bd: Bound, item: CBItem ): ItemCSS {
        let container_css: CSSProperties, component_css: CSSProperties;
        container_css = {
            width: `calc(${bd.max_x - bd.min_x}px + 2 * var(--cbPadding))`,
            height: `calc(${bd.max_y - bd.min_y}px + 2 * var(--cbPadding))`,
            transform: `
                translate( 
                    calc(${bd.min_x}px - var(--cbPadding)),
                    calc(${bd.min_y}px - var(--cbPadding))
                )
                rotate(
                    ${item.shape.r}rad
                )
            `
        }
        component_css = {
            stroke: `var(${item.style.color})`,
            strokeWidth: `var(${item.style.size})`,
            fill: item.style.fill ? `var(${item.style.color}Fill)` : 'none',
            strokeDasharray: item.style.dotted ? 'var(--cbDotted)' : 0
        }
        return {
            container_css: container_css,
            component_css: component_css
        }
    }

    
}