import * as React from 'react'
import { useRecoilState } from 'recoil'
import { itemIDState } from '../../state'
import { CanvasItem } from '../CanvasItem'
import styles from '../../../styles.module.css'
import { Point } from '../../type'
// import { Bound} from '../type';

// interface Camera extends Bound{
//     zoom: number
// }

// const CANVAS_SIZE = 65356; 

const mousePosition: Point = {
    x: 0,
    y: 0
}

export const Canvas: React.FC = ({ }) => {
    const [ids, setIds] = useRecoilState(itemIDState);
    const addId = () => setIds((ids) => [...ids, 1]);
    let pos = useMousePosition();
    return (
        <div className={`${styles.cbCanvas} ${styles.cbAbsolute}`}>
            <div> HELLO </div>
            <button onClick={addId}>
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
        </ div>
    )
}

export const useMousePosition = () => {
    
    console.log(mousePosition);

    React.useEffect(() => {
        const setFromEvent = (e: any) => { mousePosition.x = e.clientX; mousePosition.y = e.clientY };
        window.addEventListener("mousemove", setFromEvent);

        return () => {
            window.removeEventListener("mousemove", setFromEvent);
        };
    }, []);

    return mousePosition;
};




