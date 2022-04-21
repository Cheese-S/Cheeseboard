import produce from 'immer'
import * as React from 'react'
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil'
import styles from '../../../styles.module.css'
import { CBTOOL, CB_HANDLE, EMPTY_ID, LEFT_MOUSE } from '../../constant'
import { camera_state, itemID_state, item_state, item_state_accessor, pointer_state, selected_bound_state, selected_items_state } from '../../state'
import { CB_CORNER_HANDLE, CB_EDGE_HANDLE, Point, Polyline } from '../../type'
import { CanvasUtil } from '../../utils/CanvasUtil'
import { PenShapeUtil } from '../../utils/shapeUtil'
import { CanvasItem, CanvasItemsWrapper } from '../CanvasItem'
import { ToolWrapper } from '../Container/ToolWrapper'
import { SelectedWrapper } from '../Selected'
import { ToolbarWrapper } from '../Toolbar'
let is_active = false;

const pen_util = CanvasUtil.get_shapeutil(CBTOOL.PEN) as PenShapeUtil; 

export const Canvas: React.FC = ({ }) => {

    const set_pointer = useSetRecoilState(pointer_state);
    const set_selected_items = useSetRecoilState(selected_items_state);
    const set_drawing_polyline = useRecoilCallback(({ set }) => (is_drawing: number, pt: Point) => {
        set(item_state_accessor(is_drawing),
            (prev) => {
                return produce(prev, draft => {
                    (draft.shape as Polyline).points = [...(draft.shape as Polyline).points, pt];
                })
            })
    })

    const simplify_polyline = useRecoilCallback(({ set }) => (is_drawing: number) => {
        const tolerance = 0.4;
        set(item_state_accessor(is_drawing),
            (prev) => {
                return produce(prev, draft => {
                    const prev_length = (draft.shape as Polyline).points.length;
                    // (draft.shape as Polyline).points =pen_util.simplify(pen_util.smoothing((draft.shape as Polyline).points), tolerance, true); 
                    (draft.shape as Polyline).points = pen_util.smoothing(pen_util.simplify(((draft.shape as Polyline).points), tolerance, true)); 
                    const after_length = (draft.shape as Polyline).points.length;
                    console.log('Prev simiplify: %d, After simplify: %d', prev_length, after_length);
                })
            }
        )
    })

    const on_mouse_move = (e: React.MouseEvent) => {
        e.preventDefault();
        let handle: CB_HANDLE;
        let init_point: Point;
        let is_drawing: number = EMPTY_ID;
        switch (e.button) {
            case LEFT_MOUSE:
                set_pointer(prev => {
                    handle = prev.selected_handle;
                    init_point = prev.init_point;
                    is_drawing = prev.is_drawing;
                    return produce(prev, draft => {
                        draft.movement = { x: e.movementX, y: e.movementY };
                        draft.curr_point = { x: e.clientX, y: e.clientY };
                    })
                })
                if (is_drawing !== EMPTY_ID) {
                    set_drawing_polyline(is_drawing, { x: e.clientX, y: e.clientY }); 
                }
                if (is_active) {
                    // @ts-ignore
                    switch (handle) {
                        case CB_HANDLE.CENTER:
                            set_selected_items(prev => {
                                return produce(prev, draft => {
                                    CanvasUtil.translate_items({ x: e.movementX, y: e.movementY }, draft);
                                    return draft;
                                })
                            })
                            break;
                        case CB_HANDLE.ROTATION:
                            set_selected_items(prev => {
                                return produce(prev, draft => {
                                    const bd = CanvasUtil.get_items_bound(false, ...prev);
                                    CanvasUtil.rotate_items(bd, draft, { x: e.clientX, y: e.clientY }, { x: e.movementX, y: e.movementY });
                                    return draft;
                                })
                            })
                            break;
                        case CB_HANDLE.L_EDGE:
                        case CB_HANDLE.R_EDGE:
                        case CB_HANDLE.B_EDGE:
                        case CB_HANDLE.T_EDGE:
                        case CB_HANDLE.TL_CORNER:
                        case CB_HANDLE.BL_CORNER:
                        case CB_HANDLE.TR_CORNER:
                        case CB_HANDLE.BR_CORNER:
                            set_selected_items(prev => {
                                return produce(prev, draft => {
                                    const bd = CanvasUtil.get_items_bound(false, ...prev);
                                    CanvasUtil.resize_items(bd, draft, { x: e.movementX, y: e.movementY }, handle as CB_CORNER_HANDLE | CB_EDGE_HANDLE);
                                })
                            })
                            break;
                        default:
                            break;
                    }
                }
        }
    }
    const on_mouse_down = (e: React.MouseEvent<HTMLDivElement>) => {
        is_active = true;
        switch (e.button) {
            case LEFT_MOUSE:
                set_pointer(prev => {
                    return produce(prev, draft => {
                        draft.is_active = true;
                        draft.init_point = { x: e.clientX, y: e.clientY };
                    })
                })
        }


    }
    const on_mouse_up = (e: React.MouseEvent) => {
        e.preventDefault();
        is_active = false;
        switch (e.button) {
            case LEFT_MOUSE:
                let is_drawing = EMPTY_ID; 
                set_pointer(prev => {
                    is_drawing = prev.is_drawing;
                    return produce(prev, draft => {
                        draft.movement = { x: 0, y: 0 };
                        draft.is_active = false;
                        draft.selected_handle = CB_HANDLE.IDLE;
                        draft.is_drawing = EMPTY_ID;
                    })
                })
                if (is_drawing !== EMPTY_ID) {
                    simplify_polyline(is_drawing); 
                }
        }
    }

    return (
        <div id={'cbCanvas'}
            className={`${styles.cbCanvas} ${styles.cbAbsolute}`}
            onMouseDown={on_mouse_down}
            onMouseMove={on_mouse_move}
            onMouseUp={on_mouse_up}
        >
            <div> HELLO </div>
            <CanvasItemsWrapper />
            <SelectedWrapper />
            <textarea defaultValue={"hello"} />
            <div style={{ backgroundColor: 'var(--cbRed)', width: 100, height: 100 }} />
            <div style={{ backgroundColor: 'var(--cbYellow)', width: 100, height: 100 }} />
            <div style={{ backgroundColor: 'var(--cbBlue)', width: 100, height: 100 }} />
            <div style={{ backgroundColor: 'var(--cbDarkBlue)', width: 100, height: 100 }} />
            <div style={{ backgroundColor: 'var(--cbGreen)', width: 100, height: 100 }} />
            <ToolWrapper />
            <ToolbarWrapper />
        </ div>
    )
}
