import { TRANSFORM_HANDLE } from "../../constant";
import { Bound, Point } from "../../type"


export function get_scaled_bound(bd: Bound, delta: Point, handle: TRANSFORM_HANDLE) {
    let scaled_bd!: Bound; 
    switch (handle) {
        case TRANSFORM_HANDLE.T_EDGE:
        case TRANSFORM_HANDLE.TL_CORNER:
        case TRANSFORM_HANDLE.TR_CORNER:
            scaled_bd.max_y = bd.max_y + delta.y;
            break; 
        case TRANSFORM_HANDLE.B_EDGE:
        case TRANSFORM_HANDLE.BL_CORNER: 
        case TRANSFORM_HANDLE.BR_CORNER:
            scaled_bd.min_y = bd.max_y - delta.y;
            break;
    }

    switch (handle) {
        case TRANSFORM_HANDLE.L_EDGE:
        case TRANSFORM_HANDLE.TL_CORNER:
        case TRANSFORM_HANDLE.BL_CORNER:
            scaled_bd.min_x = bd.min_x - delta.y;
            break; 
        case TRANSFORM_HANDLE.R_EDGE:
        case TRANSFORM_HANDLE.TR_CORNER: 
        case TRANSFORM_HANDLE.BR_CORNER:
            scaled_bd.max_x = bd.max_y - delta.y;
            break;
    }

    return scaled_bd; 
}

export function get_relative_scaled_bound(comm_bd: Bound, next_comm_bd: Bound, shape_bd: Bound) {
    let t_off_percent = (shape_bd.max_y - comm_bd.max_y) / (comm_bd.max_y - comm_bd.min_y);
    let l_off_percent = (shape_bd.min_x - comm_bd.min_x) / (comm_bd.max_x - comm_bd.min_x);
    let w_percent = (shape_bd.max_x - shape_bd.min_x) / (comm_bd.max_x - comm_bd.min_x);
    let h_percent = (shape_bd.max_y - shape_bd.min_y) / (comm_bd.max_y - comm_bd.min_y);
    let scaled_bd!: Bound; 
    scaled_bd.min_x = next_comm_bd.min_x + l_off_percent * (next_comm_bd.max_x - next_comm_bd.min_x);
    scaled_bd.max_y = next_comm_bd.max_y + t_off_percent * (next_comm_bd.max_y - next_comm_bd.min_y);
    scaled_bd.max_x = scaled_bd.max_x + w_percent * (next_comm_bd.max_x - next_comm_bd.min_x);
    scaled_bd.min_y = scaled_bd.min_y + h_percent * (next_comm_bd.max_y - next_comm_bd.min_y); 

    return scaled_bd; 
}





