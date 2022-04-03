import { CB_HANDLE } from "../constant"
import { Point } from "../type";

export type CB_CORNER_HANDLE = CB_HANDLE.BR_CORNER | CB_HANDLE.BL_CORNER | CB_HANDLE.TR_CORNER | CB_HANDLE.TL_CORNER;

export function useCornerHandle(width: number, height: number, handle: CB_CORNER_HANDLE, handle_hsize: number, hpadding: number) {
    let center: Point;


    switch (handle) {
        case CB_HANDLE.TL_CORNER:
            center = { x: -handle_hsize - hpadding, y: -handle_hsize - hpadding }
            break;
        case CB_HANDLE.TR_CORNER:
            center = { x: width - handle_hsize + hpadding, y: -handle_hsize - hpadding }
            break;
        case CB_HANDLE.BL_CORNER:
            center = { x: -handle_hsize - hpadding, y: height - handle_hsize + hpadding }
            break;
        case CB_HANDLE.BR_CORNER:
            center = { x: width - handle_hsize + hpadding, y: height - handle_hsize + hpadding }
            break;
    }

    return {
        center: center
    }
}