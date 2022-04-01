import React from "react";
import { CBTOOL } from "../../constant";
import { Triangle } from "../../type";
import { CanvasUtil } from "../../utils/CanvasUtil";
import TriangleShapeUtil from "../../utils/shapeUtil/TriangleShapeUtil";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import styles from '../../../styles.module.css'
import { ComponentProps } from './internal'
import { useIndicator } from "../../hook/useIndicator";

interface TriangleComponentProps extends ComponentProps<Triangle>{
}

export const TriangleComponent: React.FC<TriangleComponentProps> = ({shape, item_css, ...rest}: TriangleComponentProps) => {
    const [indicator_ref, event_reciever_ref] = useIndicator<SVGPathElement>(); 
    const path = (CanvasUtil.get_shapeutil(CBTOOL.TRIANGLE) as TriangleShapeUtil).get_path(shape);
    const {container_css, component_css} = item_css; 
    const pointer_events_type = (component_css.fill && component_css.fill === 'none') ? 'stroke' : 'all'; 
    
    return (
        <Container style={container_css}>
            <SVGContainer {...rest}>
                <path className={styles.cbStroke} style={component_css} d={path} rx={4}/>
                <path className={styles.cbIndicatorStroke} ref={indicator_ref} d={path} name="indicator" rx={4} />
                <path className={styles.cbEventRecieverStroke} ref={event_reciever_ref} d={path} name="eventReciever" pointerEvents={pointer_events_type} rx={4}/>
            </SVGContainer>
        </Container>
    )
}