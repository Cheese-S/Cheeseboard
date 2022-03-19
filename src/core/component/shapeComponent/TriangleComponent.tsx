import React from "react";
import { CBITEM_TYPE } from "../../constant";
import { Triangle } from "../../type";
import { CanvasUtil } from "../../utils/CanvasUtil";
import TriangleShapeUtil from "../../utils/shapeUtil/TriangleShapeUtil";
import { Container } from "../container/Container";
import { SVGContainer } from "../container/SVGContainer";
import styles from '../../../styles.module.css'
import { ComponentProps } from './internal'

interface TriangleComponentProps extends ComponentProps<Triangle>{
}

export const TriangleComponent: React.FC<TriangleComponentProps> = ({shape, item_css}: TriangleComponentProps) => {
    const path = (CanvasUtil.get_shape_util(CBITEM_TYPE.TRIANGLE) as TriangleShapeUtil).get_path(shape);
    const {container_css, component_css} = item_css; 
    const pointer_events_type = (component_css.fill && component_css.fill === 'none') ? 'stroke' : 'all'; 

    return (
        <Container style={container_css}>
            <SVGContainer>
                <path className={styles.cbStroke} d={path}/>
                <path className={styles.cbIndicatorStroke} d={path} name="indicator"/>
                <path className={styles.cbEventRecieverStroke} d={path} name="eventReciever" pointerEvents={pointer_events_type}/>
            </SVGContainer>
        </Container>
    )
}