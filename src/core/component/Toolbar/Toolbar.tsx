import React from "react";
import { tool_state } from "../../state";
import styles from '../../../styles.module.css'
import { Type, Circle, Triangle, PenTool, XCircle, Square, MousePointer } from 'react-feather'
import { CBTOOL } from "../../constant";
import { useRecoilState } from "recoil";


export const Toolbar: React.FC = () => {
    const [tool, set_tool] = useRecoilState(tool_state);
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.dataset.id) {
            set_tool(parseInt(e.currentTarget.dataset.id));
        }
    }

    const get_bgcolor = (id: CBTOOL) => {
        return id === tool ? { backgroundColor: 'var(--cbDutchWhite)'} : {}; 
    }


    return (

        <div className={styles.cbToolCotainer}>
            <button data-id={CBTOOL.SELECT} className={styles.cbToolButton} onClick={onClick}>
                <div className={styles.cbToolButtonHighlight} style={get_bgcolor(CBTOOL.SELECT)}>
                    <MousePointer />
                </div>
            </button>
            <button data-id={CBTOOL.PENCIL} className={styles.cbToolButton} onClick={onClick}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBTOOL.PENCIL)}>
                    <PenTool />
                </div>
            </button>
            <button data-id={CBTOOL.TEXT} className={styles.cbToolButton} onClick={onClick}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBTOOL.TEXT) }>
                    <Type />
                </div>
            </button>
            <button data-id={CBTOOL.RECTANGLE} className={styles.cbToolButton} onClick={onClick}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBTOOL.RECTANGLE)}>
                    <Square />
                </div>
            </button>
            <button data-id={CBTOOL.ELLIPSE} className={styles.cbToolButton} onClick={onClick}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBTOOL.ELLIPSE)}>
                    <Circle />
                </div>
            </button>
            <button data-id={CBTOOL.TRIANGLE} className={styles.cbToolButton} onClick={onClick}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBTOOL.TRIANGLE) }>
                    <Triangle />
                </div>
            </button>
            <button data-id={CBTOOL.ERASER} className={styles.cbToolButton} onClick={onClick}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBTOOL.ERASER)}>
                    <XCircle />
                </div>
            </button>
        </div>
    )
}

