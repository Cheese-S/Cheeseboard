import { customAlphabet } from "nanoid";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CBTOOL, LEFT_MOUSE } from "../../constant";
import { item_state_accessor, pointer_state, style_state } from "../../state";
import { Rect, Ellipse, Triangle } from "../../type"
import { CanvasUtil } from "../../utils/CanvasUtil";
import {
    RectComponent,
    EllipseComponent,
    TriangleComponent
} from "../ShapeComponent";


interface ShapeCreatorProps {
    tool: CBTOOL.RECTANGLE | CBTOOL.ELLIPSE | CBTOOL.TRIANGLE
}


export const ShapeCreator: React.FC<ShapeCreatorProps> = ({ tool }: ShapeCreatorProps) => {
    const style = useRecoilValue(style_state);
    const pointer = useRecoilValue(pointer_state);
    const nanoid = customAlphabet('1234567890', 9);
    const new_id = parseInt(nanoid()); 
    const set_shape = useSetRecoilState(item_state_accessor(new_id));

    const shapeUtil = CanvasUtil.get_shapeutil(tool);
    let shape = CanvasUtil.get_default_shape(tool);
    shapeUtil!.set_shape_top_left(shape, pointer.curr_point);
    const bd = shapeUtil!.get_bound(shape);
    const item_style = CanvasUtil.get_item_css(bd, shape.r, { ...style, is_ghost: true });

    const on_create_shape = (e: React.MouseEvent) => {
        switch (e.button) {
            case LEFT_MOUSE:
                set_shape({
                    id: new_id, 
                    type: tool,
                    shape: shape,
                    style: {
                        ...style,
                        is_ghost: false
                    },
                    qt_id: -1
                })
                console.log(new_id);
        }
    }

    let shape_component;
    switch (tool) {
        case CBTOOL.RECTANGLE:
            shape_component = <RectComponent shape={shape as Rect} item_css={item_style} pointerEvents="all" />
            break;
        case CBTOOL.ELLIPSE:
            shape_component = <EllipseComponent shape={shape as Ellipse} item_css={item_style} pointerEvents="all" />
            break;
        case CBTOOL.TRIANGLE:
            shape_component = <TriangleComponent shape={shape as Triangle} item_css={item_style} pointerEvents="all" />
            break;
    }

    return (
        <div onClick={on_create_shape}>
            {shape_component}
        </div>
    )
} 