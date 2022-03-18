import React from "react";
import { Ellipse } from "../../type";
import { SVGContainer } from "../container/SVGContainer";
import { Container } from "../container/Container";
import styles from '../../../styles.module.css'

interface EllipseComponentProps {
    shape: Ellipse,
    container_css: React.CSSProperties
}

export const EllipseComponent: React.FC<EllipseComponentProps> = ({ shape, container_css }: EllipseComponentProps) => {
    return (
        <Container style={container_css}>
            <SVGContainer>
                <ellipse className={styles.cbStroke} fill="none" cx={shape.rx} cy={shape.ry} rx={shape.rx} ry={shape.ry} shape-rendering="geometricPrecision"/>
            </SVGContainer>
        </Container>
    )
}