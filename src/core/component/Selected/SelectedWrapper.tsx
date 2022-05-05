import produce from "immer";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CBACTION_TYPE, CB_HANDLE, EMPTY_BD } from "../../constant";
import { pointer_state, selected_bound_state } from "../../state";
import { CB_CORNER_HANDLE, CB_EDGE_HANDLE } from "../../type";
import { CanvasUtil } from "../../utils/CanvasUtil";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import { CenterHandle } from "./CenterHandle";
import { CornerHandle } from "./CornerHandle";
import { EdgeHandle } from "./EdgeHandle";
import { RotateHandle } from "./RotateHandle";

const edge_handles: CB_EDGE_HANDLE[] = [CB_HANDLE.L_EDGE, CB_HANDLE.R_EDGE, CB_HANDLE.B_EDGE, CB_HANDLE.T_EDGE];
const corner_handles: CB_CORNER_HANDLE[] = [CB_HANDLE.TL_CORNER, CB_HANDLE.TR_CORNER, CB_HANDLE.BL_CORNER, CB_HANDLE.BR_CORNER];


export const SelectedWrapper: React.FC = ({ }) => {
    const bd = useRecoilValue(selected_bound_state);
    const width = bd.max_x - bd.min_x;
    const height = bd.max_y - bd.min_y;
    const container_css = CanvasUtil.get_container_css(bd, bd.r);
    const set_pointer_state = useSetRecoilState(pointer_state);
    const on_select_handle = (handle: CB_HANDLE, action: CBACTION_TYPE) => (e: React.MouseEvent) => {
        e.preventDefault();
        set_pointer_state((prev) => {
            return produce(prev, draft => {
                draft.curr_point = { x: e.clientX, y: e.clientY };
                draft.selected_handle = handle; 
                draft.action = action; 
            })
        })

    }
    
    if (CanvasUtil.is_bound_equal(bd, EMPTY_BD)) return null;

    return (
        <Container style={container_css}>
            <SVGContainer pointerEvents={'none'}>
                {edge_handles.map((handle) => {
                    return <EdgeHandle width={width} height={height} handle={handle} on_select_handle={on_select_handle(handle, CBACTION_TYPE.RESIZING)}/>
                })}
                {corner_handles.map((handle) => {
                    return <CornerHandle width={width} height={height} handle={handle}  on_select_handle={on_select_handle(handle, CBACTION_TYPE.RESIZING)}/>
                })}
                <RotateHandle width={width} height={height}  on_select_handle={on_select_handle(CB_HANDLE.ROTATION, CBACTION_TYPE.ROTATING)}/>
                <CenterHandle width={width} height={height}  on_select_handle={on_select_handle(CB_HANDLE.CENTER, CBACTION_TYPE.TRANSLATING)}/>
            </SVGContainer>
        </Container>
    )
}




