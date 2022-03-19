import React from "react";
import { CBITEM_TYPE } from "../../constant";
import { Triangle } from "../../type";
import { CanvasUtil } from "../../utils/CanvasUtil";
import TriangleShapeUtil from "../../utils/shapeUtil/TriangleShapeUtil";
import { Container } from "../container/Container";
import { SVGContainer } from "../container/SVGContainer";
import styles from '../../../styles.module.css'
import { ComponentProps } from './internal'
import { useIndicator } from "../../hook/useIndicator";

interface TriangleComponentProps extends ComponentProps<Triangle>{
}

export const TriangleComponent: React.FC<TriangleComponentProps> = ({shape, item_css}: TriangleComponentProps) => {
    const [indicator_ref, event_reciever_ref] = useIndicator<SVGPathElement>(); 
    const path = (CanvasUtil.get_shape_util(CBITEM_TYPE.TRIANGLE) as TriangleShapeUtil).get_path(shape);
    const {container_css, component_css} = item_css; 
    const pointer_events_type = (component_css.fill && component_css.fill === 'none') ? 'stroke' : 'all'; 

    return (
        <Container style={container_css}>
            <SVGContainer>
                <path className={styles.cbStroke} d={path}/>
                <path className={styles.cbIndicatorStroke} ref={indicator_ref} d={path} name="indicator"/>
                <path className={styles.cbEventRecieverStroke} ref={event_reciever_ref} d={path} name="eventReciever" pointerEvents={pointer_events_type}/>
            </SVGContainer>
        </Container>
    )
}