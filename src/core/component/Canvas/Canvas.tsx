import * as React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { itemID_state, pointer_state } from '../../state'
import { CanvasItem } from '../CanvasItem'
import styles from '../../../styles.module.css'
import { Point } from '../../type'
import { RectSelect } from '../RectangleSelect'
import { ToolbarWrapper } from '../Toolbar'
// import { Bound} from '../type';

// interface Camera extends Bound{
//     zoom: number
// }

// const CANVAS_SIZE = 65356; 

export const Canvas: React.FC = ({ }) => {
    const [ids, setIds] = useRecoilState(itemID_state);
    const set_pointer = useSetRecoilState(pointer_state); 
    const addId = () => setIds((ids) => [...ids, 1]);
    const on_mouse_move = (e: React.MouseEvent) => {
        
    }
    return (
        <div className={`${styles.cbCanvas} ${styles.cbAbsolute}`} onMouseMove={on_mouse_move}>
            <div> HELLO </div>
            <button className={styles.cbButton} onClick={addId}>
                CLICK ME
            </button>
            {ids.map((id) => {
                return <CanvasItem id={id} />
            })}
            <div style={{backgroundColor:'var(--cbRed)', width:100, height:100}}/>
            <div style={{backgroundColor:'var(--cbYellow)', width:100, height:100}}/>
            <div style={{backgroundColor:'var(--cbBlue)', width:100, height:100}}/>
            <div style={{backgroundColor:'var(--cbDarkBlue)', width:100, height:100}}/>
            <div style={{backgroundColor:'var(--cbGreen)', width:100, height:100}}/>
            <RectSelect/>
            <ToolbarWrapper/>
        </ div>
    )
}
