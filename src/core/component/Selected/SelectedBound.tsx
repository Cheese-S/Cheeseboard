import React from "react"
import { useRecoilValue } from "recoil";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import styles from '../../../styles.module.css'
import { selected_bound_state } from "../../state";

export const SelectedBound: React.FC = ({}) => {
    const bd = useRecoilValue(selected_bound_state);

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
                <rect className={styles.cbSelectStroke} width={bd.max_x - bd.min_x} height={bd.max_y - bd.min_y} strokeWidth={16}/>
            </SVGContainer>
        </Container>
    )
}