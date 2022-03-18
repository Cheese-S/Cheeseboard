import React from "react";
import { CBITEM_TYPE } from "../../constant";
import { Triangle } from "../../type";
import { CanvasUtil } from "../../utils/CanvasUtil";
import TriangleShapeUtil from "../../utils/shapeUtil/TriangleShapeUtil";
import { Container } from "../container/Container";
import { SVGContainer } from "../container/SVGContainer";
import styles from '../../../styles.module.css'


interface TriangleComponentProps {
    shape: Triangle,
    container_css: React.CSSProperties
}

export const TriangleComponent: React.FC<TriangleComponentProps> = ({shape, container_css}: TriangleComponentProps) => {
    const path = (CanvasUtil.get_shape_util(CBITEM_TYPE.TRIANGLE) as TriangleShapeUtil).get_path(shape);
    console.log(path);

    return (
        <Container style={container_css}>
            <SVGContainer>
                <path className={styles.cbStroke} d={path} strokeLinejoin="round" rx="4" fill="none"/>
            </SVGContainer>
        </Container>
    )
}