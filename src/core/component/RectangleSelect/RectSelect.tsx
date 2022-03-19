import React from "react";
import { useRecoilState } from "recoil";
import { select_state } from "../../state";
import { Container } from "../container/Container";
import { SVGContainer } from "../container/SVGContainer";
import styles from '../../../styles.module.css'

export const RectSelect: React.FC = () => {
    const [bd, setBd] = useRecoilState(select_state);
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