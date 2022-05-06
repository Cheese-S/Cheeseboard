import React from "react";
import styles from '../../../styles.module.css';
import { CBTOOL } from "../../constant";
import { useIndicator } from "../../hook/useIndicator";
import { Polyline } from "../../type";
import { CanvasUtil } from "../../utils/CanvasUtil";
import PenShapeUtil from "../../utils/shapeUtil/PenShapeUtil";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import { ComponentProps } from "./internal";

interface PenComponentProps extends ComponentProps<Polyline> {
}

export const PenComponent: React.FC<PenComponentProps> = ({ _shape: shape, item_css, ...rest }: PenComponentProps) => {
    const [indicator_ref, event_reciever_ref] = useIndicator<SVGPathElement>();
    const path = (CanvasUtil.get_shapeutil(CBTOOL.PEN) as PenShapeUtil).get_path(shape);
    const { container_css, component_css } = item_css;

    return (
        <Container style={container_css} >
            <SVGContainer {...rest} >
                <path className={styles.cbStroke} style={{ ...component_css, fill: 'none' }} d={path} rx={4} />
                <path className={styles.cbIndicatorStroke} ref={indicator_ref} d={path} name="indicator" rx={4} />
                <path className={styles.cbEventRecieverStroke} ref={event_reciever_ref} d={path} name="eventReciever" pointerEvents='stroke' rx={4} />
            </SVGContainer>
        </Container>
    )

}