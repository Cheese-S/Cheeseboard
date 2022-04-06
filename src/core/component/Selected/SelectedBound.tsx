import React from "react"
import { useRecoilValue } from "recoil";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import styles from '../../../styles.module.css'
import { selected_bound_state } from "../../state";
import { EdgeHandle } from "./EdgeHandle";
import { CB_HANDLE } from "../../constant";
import { CornerHandle } from "./CornerHandle";
import { RotateHandle } from "./RotateHandle";
import { CenterHandle } from "./CenterHandle";
import { CB_CORNER_HANDLE, CB_EDGE_HANDLE } from "../../type";

const edge_handles: CB_EDGE_HANDLE[] = [CB_HANDLE.L_EDGE, CB_HANDLE.R_EDGE, CB_HANDLE.B_EDGE, CB_HANDLE.T_EDGE];

const corner_handles: CB_CORNER_HANDLE[] = [CB_HANDLE.TL_CORNER, CB_HANDLE.TR_CORNER, CB_HANDLE.BL_CORNER, CB_HANDLE.BR_CORNER];

export const SelectedBound: React.FC = ({ }) => {
    const bd = useRecoilValue(selected_bound_state);
    const width = bd.max_x - bd.min_x;
    const height = bd.max_y - bd.min_y;

    return (
        <Container style={{
            width: `calc(${bd.max_x - bd.min_x}px + 2 * var(--cbPadding))`,
            height: `calc(${bd.max_y - bd.min_y}px + 2 * var(--cbPadding))`,
            transform: `
                    translate(
                        calc(${bd.min_x}px - var(--cbPadding)),
                        calc(${bd.min_y}px - var(--cbPadding))
                    )
                `
        }}>
            <SVGContainer pointerEvents={'none'}>
                {edge_handles.map((handle) => {
                    return <EdgeHandle width={width} height={height} handle={handle}/>
                })}
                {corner_handles.map((handle) => {
                    return <CornerHandle width={width} height={height} handle={handle} />
                })}
                <RotateHandle width={width} height={height} />
                <CenterHandle width={width} height={height} />
            </SVGContainer>
        </Container>
    )
}