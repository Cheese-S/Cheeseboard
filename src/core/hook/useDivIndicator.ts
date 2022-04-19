import { RefObject, useLayoutEffect, useRef } from "react"

export function useDivIndicator(): RefObject<HTMLDivElement> {
    let indicator_ref = useRef<HTMLDivElement>(null); 
    useLayoutEffect(() => {
        if (!(indicator_ref && indicator_ref.current)) {
            return;
        }

        const indicator_element = indicator_ref.current!; 
        const onMouseEnterHandler = () => {
            indicator_element.style.setProperty('outline', '2px solid var(--cbViolet)');
        }
        const onMouseLeaveHandler = () => {
            indicator_element.style.setProperty('outline', '2px solid transparent');
        }
        indicator_element.addEventListener('mouseover', onMouseEnterHandler);
        indicator_element.addEventListener('mouseleave', onMouseLeaveHandler);

        return () => {
            indicator_element.removeEventListener("mouseenter", onMouseEnterHandler);
            indicator_element.removeEventListener("mouseleave", onMouseLeaveHandler);
        }
    }, [])

    return indicator_ref;  
} 