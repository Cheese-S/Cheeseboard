import { CBTOOL, empty_bd } from "../../constant";
import { Bound, CBItem, CBStyle, Shape, ItemCSS } from "../../type";
import { RectShapeUtil, EllipseShapeUtil, PencilShapeUtil, ShapeUtil } from "../shapeUtil";
import TriangleShapeUtil from "../shapeUtil/TriangleShapeUtil";
import React, { CSSProperties } from "react";
import { get_common_bound } from "../geometry";

type item_with_id = CBItem & {id: number}; 

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


    static get_item_css(bd: Bound, r: number, style: CBStyle): ItemCSS {
        let container_css: CSSProperties, component_css: CSSProperties;
        container_css = {
            ...(style.is_ghost && { opacity: 0.5 }),
            width: `calc(${bd.max_x - bd.min_x}px + 2 * var(--cbPadding))`,
            height: `calc(${bd.max_y - bd.min_y}px + 2 * var(--cbPadding))`,
            transform: `
                translate( 
                    calc(${bd.min_x}px - var(--cbPadding)),
                    calc(${bd.min_y}px - var(--cbPadding))
                )
                rotate(
                    ${r}rad
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

    static get_items_bound(...items: CBItem[]) {
        let bds = items.map((item) => {
            switch (item.type) {
                case CBTOOL.RECTANGLE:
                    return this.ShapeUtilMap.get(CBTOOL.RECTANGLE)!.get_bound(item.shape);
                case CBTOOL.TRIANGLE:
                    return this.ShapeUtilMap.get(CBTOOL.TRIANGLE)!.get_bound(item.shape);
                case CBTOOL.ELLIPSE:
                    return this.ShapeUtilMap.get(CBTOOL.ELLIPSE)!.get_bound(item.shape);
                case CBTOOL.PENCIL:
                    return this.ShapeUtilMap.get(CBTOOL.PENCIL)!.get_bound(item.shape);
                case CBTOOL.TEXT:
                    throw new Error("Text Bound Not Implemented")
                default:
                    return empty_bd;
            }
        })

        return bds.reduce((prev, curr) => get_common_bound(prev, curr));
    }

    

    static get_intersected_items(bd: Bound, items: item_with_id[]): number[] {
        return items.filter((item) => {
            switch (item.type) {
                case CBTOOL.RECTANGLE:
                    return this.ShapeUtilMap.get(CBTOOL.RECTANGLE)!.intersect_bound(bd, item.shape);
                case CBTOOL.TRIANGLE:
                    return this.ShapeUtilMap.get(CBTOOL.TRIANGLE)!.intersect_bound(bd, item.shape);
                case CBTOOL.ELLIPSE:
                    return this.ShapeUtilMap.get(CBTOOL.ELLIPSE)!.intersect_bound(bd, item.shape);
                case CBTOOL.PENCIL:
                    return this.ShapeUtilMap.get(CBTOOL.PENCIL)!.intersect_bound(bd, item.shape);
                case CBTOOL.TEXT:
                    throw new Error("NOT IMPLEMENTED"); 
                default:
                    return false;
            }
        }).map((item) => item.id); 
    }


}