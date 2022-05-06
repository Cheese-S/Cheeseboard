import React from "react";
import { useSetRecoilState } from "recoil";
import styles from '../../../styles.module.css';
import { useDivIndicator } from "../../hook/useDivIndicator";
import { item_state_accessor } from "../../state";
import { Image, ItemCSS } from "../../type";
import { Container } from "../Container/Container";
import { HTMLContainer } from "../Container/HTMLContainer";


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