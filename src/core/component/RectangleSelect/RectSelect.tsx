import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { select_state, pointer_state, tool_state } from "../../state";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import styles from '../../../styles.module.css'
import { CanvasUtil } from "../../utils/CanvasUtil";
import { CBTOOL } from "../../constant";
import { empty_bd } from "../../state";

export const RectSelect: React.FC = () => {
    const bd = useRecoilValue(select_state);
    if (bd == empty_bd){
        return null; 
    } else {
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
                <SVGContainer>
                    <rect className={styles.cbSelectStroke} width={bd.max_x - bd.min_x} height={bd.max_y - bd.min_y}/>
                </SVGContainer>
            </Container>
        )
    }


}