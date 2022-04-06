import React from "react";
import { useRotateHandle } from "../../hook/useRotateHandle";
import styles from '../../../styles.module.css'
const ROTATE_HANDLE_PADDING = 20;
const ROTATE_HANDLE_SIZE = 8;

interface RotateHandleProps {
    width: number,
    height: number,
    on_select_handle: (e: React.MouseEvent) => void; 
}

export const RotateHandle: React.FC<RotateHandleProps> = ({ width, height, on_select_handle }: RotateHandleProps) => {
    const { center } = useRotateHandle(width, height, ROTATE_HANDLE_PADDING, ROTATE_HANDLE_SIZE);
    return (
        <React.Fragment>
            <ellipse className={styles.cbHandleStroke} cx={center.x} cy={center.y} rx={ROTATE_HANDLE_SIZE} ry={ROTATE_HANDLE_SIZE} />
            <ellipse
                className={styles.cbEventRecieverStroke}
                cursor='grab'
                onMouseDown={on_select_handle}
                cx={center.x} cy={center.y} rx={ROTATE_HANDLE_SIZE} ry={ROTATE_HANDLE_SIZE}
            />
        </React.Fragment>
    )
}