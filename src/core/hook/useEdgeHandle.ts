import { CB_HANDLE } from "../constant"

export type CB_EDGE_HANDLE = CB_HANDLE.B_EDGE | CB_HANDLE.T_EDGE | CB_HANDLE.L_EDGE | CB_HANDLE.R_EDGE;

export function useEdgeHandle(width: number, height: number, handle: CB_EDGE_HANDLE, padding: number) {
    let path: string; 
    switch(handle) {
        case CB_HANDLE.B_EDGE:
        path = `M 0 ${height + padding} H ${width}`
            break; 
        case CB_HANDLE.T_EDGE:
            path = `M 0 ${-padding} H ${width}`
            break; 
        case CB_HANDLE.L_EDGE:
            path = `M ${-padding} 0 V ${height}`
            break; 
            case CB_HANDLE.R_EDGE:
            path = `M ${width + padding} 0 V ${height}`
            break; 
        }
    return {
        path: path
    }
    
}