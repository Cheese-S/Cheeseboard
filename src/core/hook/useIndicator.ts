import { RefObject, useLayoutEffect, useRef } from "react";

type IndicatorRefType = SVGRectElement | SVGEllipseElement | SVGPathElement;

export function useIndicator<T extends IndicatorRefType>(): RefObject<T>[] {
    let indicator_ref = useRef<T>(null); 
    let event_receiver_ref = useRef<T>(null); 
    useLayoutEffect(() => {
        if (!(event_receiver_ref && event_receiver_ref.current && indicator_ref && indicator_ref.current)) {
            return
        }

        const event_receiver_element = event_receiver_ref.current!; 
        const indicator_element = indicator_ref.current!; 
        const onMouseEnterHandler = () => {
            indicator_element.style.setProperty('visibility', 'visible');
        }
        const onMouseLeaveHandler = () => {
            indicator_element.style.setProperty('visibility', 'hidden');
        }
        event_receiver_element.addEventListener('mouseover', onMouseEnterHandler);
        event_receiver_element.addEventListener('mouseleave', onMouseLeaveHandler);

        return () => {
            event_receiver_element.removeEventListener("mouseenter", onMouseEnterHandler);
            event_receiver_element.removeEventListener("mouseleave", onMouseLeaveHandler);
        }
    }, [])

    return [indicator_ref, event_receiver_ref]; 
} 