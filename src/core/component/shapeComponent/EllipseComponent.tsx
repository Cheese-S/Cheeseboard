import React from "react";
import { Ellipse } from "../../type";
import { SVGContainer } from "../container/SVGContainer";
import { Container } from "../container/Container";
import styles from '../../../styles.module.css'
import { ItemCSS } from '../../state'
import { ComponentProps } from './internal'

interface EllipseComponentProps extends ComponentProps<Ellipse> {
}

export const EllipseComponent: React.FC<EllipseComponentProps> = ({ shape, item_css }: EllipseComponentProps) => {
    const {container_css, component_css} = item_css; 
    const pointer_events_type = (component_css.fill && component_css.fill === 'none') ? 'stroke' : 'all'; 
    return (
        <Container style={container_css}>
            <SVGContainer>
                <ellipse className={styles.cbStroke} cx={shape.rx} cy={shape.ry} rx={shape.rx} ry={shape.ry} shape-rendering="geometricPrecision"/>
                <ellipse className={styles.cbIndicatorStroke} cx={shape.rx} cy={shape.ry} rx={shape.rx} ry={shape.ry} shape-rendering="geometricPrecision"/>
                <ellipse className={styles.cbEventRecieverStroke} cx={shape.rx} cy={shape.ry} rx={shape.rx} ry={shape.ry} pointerEvents={pointer_events_type}/>
            </SVGContainer>
        </Container>
    )
}