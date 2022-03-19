import React from "react";
import { Rect } from "../../type";
import { SVGContainer } from "../container/SVGContainer";
import { Container } from "../container/Container";
import styles from '../../../styles.module.css'
import { useIndicator } from "../../hook/useIndicator";
import { ComponentProps } from './internal'

interface RectComponentProps extends ComponentProps<Rect>{
}

export const RectComponent: React.FC<RectComponentProps> = ({shape, item_css}: RectComponentProps) => {
    const [indicator_ref, event_reciever_ref] = useIndicator<SVGRectElement>(); 
    const {container_css, component_css} = item_css; 
    const pointer_events_type = (component_css.fill && component_css.fill === 'none') ? 'stroke' : 'all'; 
    return (
            <Container style={container_css}>    
                <SVGContainer>
                    <rect className={styles.cbStroke} style={component_css} width={shape.mx * 2} height={shape.my * 2}/>
                    <rect className={styles.cbIndicatorStroke} ref={indicator_ref} name="indicator" width={shape.mx * 2} height={shape.my * 2}/>
                    <rect className={styles.cbEventRecieverStroke} ref={event_reciever_ref} name="eventReciever" width={shape.mx * 2} height={shape.my * 2} pointerEvents={pointer_events_type}/>
                </SVGContainer>
            </Container>
    )
}