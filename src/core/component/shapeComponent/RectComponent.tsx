import React from "react";
import { Rect } from "../../type";
import { SVGContainer } from "../container/SVGContainer";
import { Container } from "../container/Container";
import styles from '../../../styles.module.css'
import { useIndicator } from "../../hook/useIndicator";

interface RectComponentProps {
    shape: Rect,
    container_css: React.CSSProperties 
}

export const RectComponent: React.FC<RectComponentProps> = ({shape, container_css}: RectComponentProps) => {
    const [indicator_ref, event_reciever_ref] = useIndicator<SVGRectElement>(); 
    return (
        <React.Fragment>
            <Container style={container_css}>    
                <SVGContainer>
                    <rect className={styles.cbStroke} strokeLinejoin="round" rx="4" fill="none" width={shape.mx * 2} height={shape.my * 2}/>
                    <rect ref={indicator_ref} className={styles.cbIndicatorStroke} name="indicator" fill="none" strokeLinejoin="round" rx="4" width={shape.mx * 2} height={shape.my * 2}/>
                    <rect ref={event_reciever_ref} name="eventReciever" fill="none" strokeLinejoin="round" rx="4" width={shape.mx * 2} height={shape.my * 2} pointerEvents="all"/>
                </SVGContainer>
            </Container>
        </React.Fragment>
    )
}