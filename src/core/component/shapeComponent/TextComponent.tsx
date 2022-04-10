import React from "react";
import { ItemCSS, Rect } from "../../type";
import { HTMLContainer } from "../Container/HTMLContainer";
import { ComponentProps } from './internal'
import styles from '../../../styles.module.css'
import { Container } from "../Container/Container";


interface TextComponentProps extends React.HTMLProps<HTMLDivElement> {
    _shape: Rect,
    item_css: ItemCSS
}

export const TextComponent : React.FC<TextComponentProps> = ({_shape, item_css,...rest}: TextComponentProps) => {
    const {container_css, component_css} = item_css; 
    return (
        <Container style={container_css}>
            <HTMLContainer >
                <div className={styles.cbTextWrapper} {...rest}>
                    THIS IS AN EXTREMELY LONG TEXT
                </div>
            </HTMLContainer>
        </Container>
    )
}