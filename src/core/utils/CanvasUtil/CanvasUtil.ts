import { CBTOOL } from "../../constant";
import { Bound, CBItem, CBStyle, Shape } from "../../type";
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
    

    static get_item_css(bd: Bound, shape: Shape, style: CBStyle): ItemCSS {
        let container_css: CSSProperties, component_css: CSSProperties;
        container_css = {
            ...(style.is_ghost && {opacity: 0.5}), 
            width: `calc(${bd.max_x - bd.min_x}px + 2 * var(--cbPadding))`,
            height: `calc(${bd.max_y - bd.min_y}px + 2 * var(--cbPadding))`,
            transform: `
                translate( 
                    calc(${bd.min_x}px - var(--cbPadding)),
                    calc(${bd.min_y}px - var(--cbPadding))
                )
                rotate(
                    ${shape.r}rad
                )
            `
        }
        component_css = {
            stroke: `var(${style.color})`,
            strokeWidth: `var(${style.size})`,
            fill: style.fill ? `var(${style.color}Fill)` : 'none',
            strokeDasharray: style.dotted ? 'var(--cbDotted)' : 0
        }
        
        return {
            container_css: container_css,
            component_css: component_css
        }
    }

    static get_CBItem(style: CBStyle, shape: Shape, tool: CBTOOL) {
        return {
            style: style,
            shape: shape,
            type: tool
        }
    }

    static get_default_shape(type: CBTOOL): Shape {
        switch (type) {
            case CBTOOL.RECTANGLE:
                return {
                    center: { x: 0, y: 0 },
                    mx: 50,
                    my: 50,
                    r: 0
                }
            case CBTOOL.ELLIPSE:
                return {
                    center: { x: 0, y: 0 },
                    rx: 50,
                    ry: 50,
                    r: 0
                }
            case CBTOOL.TRIANGLE:
                return {
                    a: { x: 100, y: 150 },
                    b: { x: 150, y: 50 },
                    c: { x: 200, y: 150 },
                    r: 0
                }
            case CBTOOL.PENCIL:
                return {
                    points: [],
                    r: 0
                }
            default:
                return {
                    center: { x: Math.random() * 2000, y: Math.random() * 1400 },
                    mx: 50,
                    my: 50,
                    r: 0
                }
        }
    }

    
}