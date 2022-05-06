import React from "react";
import styles from '../../../styles.module.css';

interface CenterHandleProp {
    width: number, 
    height: number,
    on_select_handle: (e: React.MouseEvent) => void; 
}

export const CenterHandle: React.FC<CenterHandleProp> = ({width, height, on_select_handle}: CenterHandleProp) => {
    
    return (
        <rect 
            className={styles.cbCenterHandle} stroke="var(--cbDarkblue)" 
            strokeWidth={1} fill='var(--cbTest)' 
            opacity={0.1} 
            width={width} 
            height={height}
            pointerEvents="fill"
            onMouseDown={on_select_handle}
        />
    )
}