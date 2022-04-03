import produce from 'immer'
import * as React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import styles from '../../../styles.module.css'
import { LEFT_MOUSE } from '../../constant'
import { camera_state, itemID_state, pointer_state } from '../../state'
import { CanvasItem } from '../CanvasItem'
import { ToolWrapper } from '../Container/ToolWrapper'
import { SelectedWrapper } from '../Selected'
import { ToolbarWrapper } from '../Toolbar'

export const Canvas: React.FC = ({ }) => {
    const [ids, setIds] = useRecoilState(itemID_state);
    const set_pointer = useSetRecoilState(pointer_state);
    const addId = () => setIds((ids) => [...ids, 1]);
    const [camera, set_camera] = useRecoilState(camera_state);
    const on_mouse_move = (e: React.MouseEvent) => {
        e.preventDefault();
        switch (e.button) {
            case LEFT_MOUSE:
                set_pointer(prev => {
                    return produce(prev, draft => {
                        draft.curr_point = { x: e.clientX, y: e.clientY };
                    })
                })
        }
    }
    const on_mouse_down = (e: React.MouseEvent<HTMLDivElement>) => {
        // @ts-ignore
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
        switch (e.button) {
            case LEFT_MOUSE:
                set_pointer(prev => {
                    return produce(prev, draft => {
                        draft.is_active = false;
                    })
                })
        }
    }

    return (
        <div id={'cbCanvas'} className={`${styles.cbCanvas} ${styles.cbAbsolute}`} onMouseDown={on_mouse_down} onMouseMove={on_mouse_move} onMouseUp={on_mouse_up}>
            <div> HELLO </div>
            <button className={styles.cbButton} onClick={addId}>
                CLICK ME
            </button>
            {ids.map((id) => {
                return <CanvasItem key={id} id={id} />
            })}
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
