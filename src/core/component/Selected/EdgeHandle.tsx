import React from "react";
import styles from '../../../styles.module.css';
import { useEdgeHandle } from "../../hook/useEdgeHandle";
import { CB_EDGE_HANDLE } from "../../type";
import { HANDLE_PADDING } from './internal';

interface EdgeHandleProps {
    // bound: number, 
    handle: CB_EDGE_HANDLE,
    width: number,
    height: number,
    on_select_handle: (e: React.MouseEvent) => void; 

}

export const EdgeHandle: React.FC<EdgeHandleProps> = ({ width, height, handle, on_select_handle }: EdgeHandleProps) => {
    const { path, cursor } = useEdgeHandle(width, height, handle, HANDLE_PADDING);
    return (
        <React.Fragment>
            <path
                className={styles.cbHandleStroke}
                d={path}
                strokeWidth={4}
            />
            <path 
                className={styles.cbEventRecieverStroke}
                cursor={cursor}
                onMouseDown={on_select_handle}
                d={path}
                pointerEvents='all'
            />
        </ React.Fragment>

    )
}