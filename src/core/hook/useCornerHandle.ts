import { CB_HANDLE } from "../constant";
import { CB_CORNER_HANDLE, Point } from "../type";

export function useCornerHandle(width: number, height: number, handle: CB_CORNER_HANDLE, handle_hsize: number, hpadding: number) {
    let center: Point;
    let cursor: string;
    
    switch (handle) {
        case CB_HANDLE.TL_CORNER:
            center = { x: -handle_hsize - hpadding, y: -handle_hsize - hpadding }
            cursor = 'nwse-resize'
            break;
        case CB_HANDLE.TR_CORNER:
            center = { x: width - handle_hsize + hpadding, y: -handle_hsize - hpadding }
            cursor = 'nesw-resize'
            break;
        case CB_HANDLE.BL_CORNER:
            center = { x: -handle_hsize - hpadding, y: height - handle_hsize + hpadding }
            cursor = 'nesw-resize'
            break;
        case CB_HANDLE.BR_CORNER:
            center = { x: width - handle_hsize + hpadding, y: height - handle_hsize + hpadding }
            cursor = 'nwse-resize'
            break;
    }

    return {
        center: center,
        cursor: cursor, 
    }
}