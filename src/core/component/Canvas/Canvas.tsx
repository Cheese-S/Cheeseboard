import * as React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { camera_state, itemID_state, pointer_state, visible_itemID_state } from '../../state'
import { CanvasItem } from '../CanvasItem'
import styles from '../../../styles.module.css'
import { Point } from '../../type'
import { RectSelect } from '../RectangleSelect'
import { ToolbarWrapper } from '../Toolbar'
import produce from 'immer'
import { LEFT_MOUSE, MID_MOUSE, RIGHT_MOUSE } from '../../constant'
import { useContainerDimension } from '../../hook/useContainerDimension'
// import { Bound} from '../type';

// interface Camera extends Bound{
//     zoom: number
// }

// const CANVAS_SIZE = 65356; 

export const Canvas: React.FC = ({ }) => {
    const [ids, setIds] = useRecoilState(itemID_state);
    const set_pointer = useSetRecoilState(pointer_state);
    const addId = () => setIds((ids) => [...ids, 1]);
    const [camera, set_camera] = useRecoilState(camera_state); 
    const visible = useRecoilValue(visible_itemID_state);
    console.log(visible);
    const on_mouse_move = (e: React.MouseEvent) => {
        switch(e.button) {
            case LEFT_MOUSE:
                set_pointer(prev => {
                    return produce(prev, draft => {
                        draft.curr_point = {x: e.clientX, y: e.clientY};
                    })
                })   
        }
    }
    const on_mouse_down = (e: React.MouseEvent) => {
        switch(e.button) {
            case LEFT_MOUSE:
                set_pointer(prev => {
                    return produce(prev, draft => {
                        draft.is_active = true; 
                        draft.init_point = {x: e.clientX, y: e.clientY}; 
                    }) 
                })
        }
    }
    const on_mouse_up = (e: React.MouseEvent) => {
        switch(e.button) {
            case LEFT_MOUSE:
                set_pointer(prev => {
                    return produce(prev, draft => {
                        draft.is_active = false;
                    })
                })
        }
    }

    return (
        <div className={`${styles.cbCanvas} ${styles.cbAbsolute}`} onMouseDown={on_mouse_down} onMouseMove={on_mouse_move} onMouseUp={on_mouse_up}>
            <div> HELLO </div>
            <button className={styles.cbButton} onClick={addId}>
                CLICK ME
            </button>
            {ids.map((id) => {
                return <CanvasItem id={id} />
            })}
            <div style={{ backgroundColor: 'var(--cbRed)', width: 100, height: 100 }} />
            <div style={{ backgroundColor: 'var(--cbYellow)', width: 100, height: 100 }} />
            <div style={{ backgroundColor: 'var(--cbBlue)', width: 100, height: 100 }} />
            <div style={{ backgroundColor: 'var(--cbDarkBlue)', width: 100, height: 100 }} />
            <div style={{ backgroundColor: 'var(--cbGreen)', width: 100, height: 100 }} />
            <RectSelect />
            <ToolbarWrapper />
        </ div>
    )
}
