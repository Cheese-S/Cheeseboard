import produce from 'immer'
import * as React from 'react'
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil'
import styles from '../../../styles.module.css'
import { CB_HANDLE, LEFT_MOUSE } from '../../constant'
import { camera_state, itemID_state, pointer_state, selected_bound_state, selected_items_state } from '../../state'
import { Point } from '../../type'
import { CanvasUtil } from '../../utils/CanvasUtil'
import { CanvasItem, CanvasItemsWrapper } from '../CanvasItem'
import { ToolWrapper } from '../Container/ToolWrapper'
import { SelectedWrapper } from '../Selected'
import { ToolbarWrapper } from '../Toolbar'
let is_active = false; 
export const Canvas: React.FC = ({ }) => {

    const set_pointer = useSetRecoilState(pointer_state);
    const set_selected_items = useSetRecoilState(selected_items_state);
    const get_selected_bound = useRecoilCallback(({ snapshot }) => () => {
        return snapshot.getLoadable(selected_bound_state).getValue(); 
    })
    const on_mouse_move = (e: React.MouseEvent) => {
        e.preventDefault();
        let handle: CB_HANDLE; 
        let init_point: Point; 
        switch (e.button) {
            case LEFT_MOUSE:
                set_pointer(prev => {
                    handle = prev.selected_handle;
                    init_point = prev.init_point; 
                    return produce(prev, draft => {
                        draft.movement = { x: e.movementX, y: e.movementY };
                        draft.curr_point = { x: e.clientX, y: e.clientY };
                    })
                })
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
                                    const bound = get_selected_bound(); 
                                    console.log(bound);
                                    CanvasUtil.rotate_items(bound, draft, init_point, {x: e.clientX, y: e.clientY}, {x: e.movementX, y: e.movementY});
                                    return draft;
                                })
                            })
                            break;
                        default:
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
                set_pointer(prev => {
                    return produce(prev, draft => {
                        draft.movement = { x: 0, y: 0 };
                        draft.is_active = false;
                        draft.selected_handle = CB_HANDLE.IDLE;
                    })
                })
        }
    }

    return (
        <div id={'cbCanvas'} className={`${styles.cbCanvas} ${styles.cbAbsolute}`} onMouseDown={on_mouse_down} onMouseMove={on_mouse_move} onMouseUp={on_mouse_up}>
            <div> HELLO </div>
            <CanvasItemsWrapper />
            <SelectedWrapper />
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
