import React from "react"
import { useCornerHandle } from '../../hook/useCornerHandle'
import styles from '../../../styles.module.css'
import { CORNER_HANDLE_SIZE, HANDLE_PADDING } from './internal'
import { CB_CORNER_HANDLE } from "../../type";

interface CornerHandleProps {
    width: number,
    height: number,
    handle: CB_CORNER_HANDLE,
    on_select_handle: (e: React.MouseEvent) => void; 
}

export const CornerHandle: React.FC<CornerHandleProps> = ({ width, height, handle, on_select_handle }: CornerHandleProps) => {
    const { center, cursor } = useCornerHandle(width, height, handle, CORNER_HANDLE_SIZE / 2, HANDLE_PADDING / 2);
    return (
        <React.Fragment>
            <rect
                className={styles.cbHandleStroke}
                x={center.x} y={center.y} height={CORNER_HANDLE_SIZE} width={CORNER_HANDLE_SIZE}
                fill='none'
                rx={4}
            />
            <rect
                className={styles.cbHandleStroke}
                x={center.x} y={center.y} height={CORNER_HANDLE_SIZE} width={CORNER_HANDLE_SIZE}
                cursor={cursor}
                onMouseDown={on_select_handle}
                pointerEvents='all'
                fill='none'
                rx={4}
            />
            
        </React.Fragment>
    )
}