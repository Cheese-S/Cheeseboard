import produce from "immer";

import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CBACTION_STATE, CBTOOL, CB_HANDLE, EMPTY_ID, LEFT_MOUSE } from "../../constant";
import { item_state_accessor, pointer_state, selected_itemID_state, style_state, tool_state } from "../../state";
import { Rect, Ellipse, Triangle, Text, Polyline } from "../../type"
import { CanvasUtil } from "../../utils/CanvasUtil";
import {
    RectComponent,
    EllipseComponent,
    TriangleComponent
} from "../ShapeComponent";
import { PenComponent } from "../ShapeComponent/PenComponent";
import { TextComponent } from "../ShapeComponent/TextComponent";



interface ShapeCreatorProps {
    tool: CBTOOL.RECTANGLE | CBTOOL.ELLIPSE | CBTOOL.TRIANGLE | CBTOOL.TEXT | CBTOOL.PEN
}

export const ShapeCreator: React.FC<ShapeCreatorProps> = ({ tool }: ShapeCreatorProps) => {
    const style = useRecoilValue(style_state);
    const [pointer, set_pointer] = useRecoilState(pointer_state);
    const new_id = CanvasUtil.uuid();
    const set_shape = useSetRecoilState(item_state_accessor(new_id));
    const set_selected_item = useSetRecoilState(selected_itemID_state);
    const set_tool = useSetRecoilState(tool_state);
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
                    qt_id: -1,
                    text: "placeholder"
                })
                if (tool === CBTOOL.PEN) {
                    set_pointer(prev => {
                        return produce(prev, draft => {
                            draft.is_drawing = new_id;
                            draft.action = CBACTION_STATE.DRAWING;
                        })
                    })
                } else {
                    set_pointer(prev => {
                        return produce(prev, draft => {
                            draft.is_active = true;
                            draft.selected_handle = CB_HANDLE.BR_CORNER;
                            draft.init_point = { x: e.clientX, y: e.clientY };
                            draft.action = CBACTION_STATE.CREATING; 
                        })
                    })
                    set_selected_item([new_id])
                    set_tool(CBTOOL.SELECT);
                }
        }
    }

    let shape_component;
    switch (tool) {
        case CBTOOL.RECTANGLE:
            shape_component = <RectComponent _shape={shape as Rect} item_css={item_style} pointerEvents="all" />
            break;
        case CBTOOL.ELLIPSE:
            shape_component = <EllipseComponent _shape={shape as Ellipse} item_css={item_style} pointerEvents="all" />
            break;
        case CBTOOL.TRIANGLE:
            shape_component = <TriangleComponent _shape={shape as Triangle} item_css={item_style} pointerEvents="all" />
            break;
        case CBTOOL.TEXT:
            shape_component = <TextComponent _shape={shape as Text} _text={'placeholder'} item_css={item_style} style={{ pointerEvents: "all" }} />
            break;
        case CBTOOL.PEN:
            if (pointer.is_drawing === EMPTY_ID) {
                shape_component = <PenComponent _shape={shape as Polyline} item_css={item_style} style={{ pointerEvents: "all" }} />
            }
            break;
    }

    return (
        <div onMouseDown={on_create_shape}>
            {shape_component}
        </div>
    )
} 