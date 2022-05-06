import React from "react";
import styles from '../../../styles.module.css';
import { useIndicator } from "../../hook/useIndicator";
import { Rect } from "../../type";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import { ComponentProps } from './internal';

interface RectComponentProps extends ComponentProps<Rect> {
}

export const RectComponent: React.FC<RectComponentProps> = ({ _shape: shape, item_css, ...rest }: RectComponentProps) => {
    const [indicator_ref, event_reciever_ref] = useIndicator<SVGRectElement>();
    const { container_css, component_css } = item_css;
    const pointer_events_type = (component_css.fill && component_css.fill === 'none') ? 'stroke' : 'all';
    return (
        <Container style={container_css} >
            <SVGContainer {...rest} >
                <rect className={styles.cbStroke} style={component_css} width={shape.mx * 2} height={shape.my * 2} rx={4} />
                <rect className={styles.cbIndicatorStroke} ref={indicator_ref} name="indicator" width={shape.mx * 2} height={shape.my * 2} rx={4} />
                <rect className={styles.cbEventRecieverStroke} ref={event_reciever_ref} name="eventReciever" width={shape.mx * 2} height={shape.my * 2} pointerEvents={pointer_events_type} rx={4} />
            </SVGContainer>
        </Container>
    )
}