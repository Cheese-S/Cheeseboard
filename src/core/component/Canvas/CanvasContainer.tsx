import React, { HTMLProps, useLayoutEffect, useRef }from "react";
import { useSetRecoilState } from "recoil";
import { camera_state } from "../../state";
import produce from "immer";

interface CanvasContainerProps extends HTMLProps<HTMLDivElement> {
    children: React.ReactNode
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({children, ...rest}) => {
    const ref = useRef<HTMLDivElement>(null);
    const set_camera = useSetRecoilState(camera_state);
    
    useLayoutEffect(() => {

        const handleResize = () => {
            if (ref.current) {
                set_camera(prev => {
                    return produce(prev, draft => {
                        draft.max_x = draft.min_x + ref.current!.children[0].getBoundingClientRect().width,
                        draft.max_y = draft.min_y + ref.current!.children[0].getBoundingClientRect().height
                    })
                })
            }
        }

        if (ref.current) {
            set_camera(prev => {
                return produce(prev, draft => {
                    draft.max_x = draft.min_x + ref.current!.offsetWidth,
                    draft.max_y = draft.min_y + ref.current!.offsetHeight
                })
            })
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize); 
        }
    })

    return (
        <div ref={ref} {...rest}>
            {children}
        </div>
    )
}