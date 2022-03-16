import { TRANSFORM_HANDLE } from "../../constant";
import { Bound, Point } from "../../type"


export function get_scaled_bound(bd: Bound, delta: Point, handle: TRANSFORM_HANDLE) {
    let scaled_bd!: Bound; 
    switch (handle) {
        case TRANSFORM_HANDLE.T_EDGE:
        case TRANSFORM_HANDLE.TL_CORNER:
        case TRANSFORM_HANDLE.TR_CORNER:
            scaled_bd.top = bd.top + delta.y;
            break; 
        case TRANSFORM_HANDLE.B_EDGE:
        case TRANSFORM_HANDLE.BL_CORNER: 
        case TRANSFORM_HANDLE.BR_CORNER:
            scaled_bd.btm = bd.top - delta.y;
            break;
    }

    switch (handle) {
        case TRANSFORM_HANDLE.L_EDGE:
        case TRANSFORM_HANDLE.TL_CORNER:
        case TRANSFORM_HANDLE.BL_CORNER:
            scaled_bd.lft = bd.lft - delta.y;
            break; 
        case TRANSFORM_HANDLE.R_EDGE:
        case TRANSFORM_HANDLE.TR_CORNER: 
        case TRANSFORM_HANDLE.BR_CORNER:
            scaled_bd.rgt = bd.top - delta.y;
            break;
    }

    return scaled_bd; 
}

export function get_relative_scaled_bound(comm_bd: Bound, next_comm_bd: Bound, shape_bd: Bound) {
    let t_off_percent = (shape_bd.top - comm_bd.top) / (comm_bd.top - comm_bd.btm);
    let l_off_percent = (shape_bd.lft - comm_bd.lft) / (comm_bd.rgt - comm_bd.lft);
    let w_percent = (shape_bd.rgt - shape_bd.lft) / (comm_bd.rgt - comm_bd.lft);
    let h_percent = (shape_bd.top - shape_bd.btm) / (comm_bd.top - comm_bd.btm);
    let scaled_bd!: Bound; 
    scaled_bd.lft = next_comm_bd.lft + l_off_percent * (next_comm_bd.rgt - next_comm_bd.lft);
    scaled_bd.top = next_comm_bd.top + t_off_percent * (next_comm_bd.top - next_comm_bd.btm);
    scaled_bd.rgt = scaled_bd.rgt + w_percent * (next_comm_bd.rgt - next_comm_bd.lft);
    scaled_bd.btm = scaled_bd.btm + h_percent * (next_comm_bd.top - next_comm_bd.btm); 

    return scaled_bd; 
}



