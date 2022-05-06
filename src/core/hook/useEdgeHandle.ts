import { CB_HANDLE } from "../constant";
import { CB_EDGE_HANDLE } from "../type";


export function useEdgeHandle(width: number, height: number, handle: CB_EDGE_HANDLE, padding: number) {
    let path: string;
    let cursor: string;
    switch (handle) {
        case CB_HANDLE.B_EDGE:
            path = `M 0 ${height + padding} H ${width}`
            cursor = 'ns-resize'
            break;
        case CB_HANDLE.T_EDGE:
            path = `M 0 ${-padding} H ${width}`
            cursor = 'ns-resize'
            break;
        case CB_HANDLE.L_EDGE:
            path = `M ${-padding} 0 V ${height}`
            cursor = 'ew-resize'
            break;
        case CB_HANDLE.R_EDGE:
            path = `M ${width + padding} 0 V ${height}`
            cursor = 'ew-resize'
            break;
    }
    return {
        path: path,
        cursor: cursor
    }

}