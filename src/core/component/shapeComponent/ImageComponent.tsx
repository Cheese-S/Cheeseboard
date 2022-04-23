import React, { Component, useLayoutEffect, useRef, useEffect } from "react";
import { Image, ItemCSS, Rect } from "../../type";
import { Container } from "../Container/Container";
import { HTMLContainer } from "../Container/HTMLContainer";
import { ComponentProps } from "./internal";
import styles from '../../../styles.module.css'
import { useSetRecoilState } from "recoil";
import { item_state_accessor } from "../../state";
import produce from "immer";
import { Vec } from "../../utils/vec";
import { useDivIndicator } from "../../hook/useDivIndicator";


interface ImageComponentProps extends React.HTMLProps<HTMLDivElement> {
    _id: number
    _shape: Image,
    item_css: ItemCSS
}

export const ImageComponent: React.FC<ImageComponentProps> = ({ _id, item_css, _shape, ...rest }: ImageComponentProps) => {
    const { container_css, component_css } = item_css;
    const set_item = useSetRecoilState(item_state_accessor(_id));
    const div_ref = useDivIndicator();
    return (
        <Container style={container_css} >
            <HTMLContainer _ref={div_ref} style={{ pointerEvents: 'all' }} {...rest} >
                <img onMouseDown={() => console.log("hello")} className={styles.cbImage} src={_shape.src} />
            </HTMLContainer>
        </Container>
    )
}