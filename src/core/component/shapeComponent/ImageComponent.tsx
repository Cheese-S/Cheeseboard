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


interface ImageComponentProps extends React.HTMLProps<HTMLDivElement>  {
    _id: number
    _shape: Image,
    item_css: ItemCSS
}

export const ImageComponent: React.FC<ImageComponentProps> = ({ _id, item_css, _shape, ...rest }: ImageComponentProps) => {
    const { container_css, component_css } = item_css;
    const set_item = useSetRecoilState(item_state_accessor(_id));
    const ref = useRef<HTMLImageElement>(null);

    // useLayoutEffect(() => {
    //     if (!(ref && ref.current)) {
    //         return;
    //     }
    //     const element = ref.current;
    //     element.onload = () => {
    //         const natural_mx = element.naturalWidth / 2;
    //         const natural_my = element.naturalHeight / 2
    //         if (_shape.mx !== natural_mx || _shape.my !== natural_my) {
    //             set_item((prev) => {
    //                 console.log("RESET ITEM: ", prev); 
    //                 return produce(prev, draft => {
    //                     (draft.shape as Image).mx = natural_mx;
    //                     (draft.shape as Image).my = natural_my;
    //                 })
    //             })
    //         }
    //     }
    // }, [])

    return (
        <Container style={container_css}>
            <HTMLContainer >
                <img ref={ref} className={styles.cbImage} src={_shape.src} />
            </HTMLContainer>
        </Container>
    )
}