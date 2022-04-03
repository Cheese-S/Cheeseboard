import React from "react"
import { CB_CORNER_HANDLE, useCornerHandle } from '../../hook/useCornerHandle'
import styles from '../../../styles.module.css'
import { CORNER_HANDLE_SIZE, HANDLE_PADDING } from './internal'


interface CornerHandleProps {
    width: number,
    height: number,
    handle: CB_CORNER_HANDLE
}

export const CornerHandle: React.FC<CornerHandleProps> = ({ width, height, handle }: CornerHandleProps) => {
    const { center } = useCornerHandle(width, height, handle, CORNER_HANDLE_SIZE / 2, HANDLE_PADDING / 2);

    return (
        <rect className={styles.cbHandleStroke} x={center.x} y={center.y} height={CORNER_HANDLE_SIZE} width={CORNER_HANDLE_SIZE} fill='none' stroke='var(--cbBlack)' rx={4}/>
    )
}