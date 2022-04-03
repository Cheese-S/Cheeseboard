import React from "react"
import { useEdgeHandle, CB_EDGE_HANDLE } from "../../hook/useEdgeHandle"
import styles from '../../../styles.module.css'
import { HANDLE_PADDING } from './internal'

interface EdgeHandleProps {
    // bound: number, 
    handle: CB_EDGE_HANDLE,
    width: number,
    height: number

}

export const EdgeHandle: React.FC<EdgeHandleProps> = ({ width, height, handle }: EdgeHandleProps) => {
    const { path } = useEdgeHandle(width, height, handle, HANDLE_PADDING);
    return (
        <path className={styles.cbHandleStroke} d={path} strokeWidth={4} />
    )
}