import React, { HTMLProps, useLayoutEffect, useRef }from "react";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { camera_state, selected_items_state } from "../../state";
import produce from "immer";

interface CanvasContainerProps extends HTMLProps<HTMLDivElement> {
    children: React.ReactNode
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({children, ...rest}) => {
    const ref = useRef<HTMLDivElement>(null);
    const set_camera = useSetRecoilState(camera_state);
    const reset_selected_items = useResetRecoilState(selected_items_state); 
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

        const handleDel = (e: KeyboardEvent) => {
            console.log(e.key);
            if (e.key === 'Backspace' || e.key === 'Delete') {
                reset_selected_items();
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
        window.addEventListener("keydown", handleDel);
        return () => {
            window.removeEventListener("resize", handleResize); 
            window.removeEventListener("keydown", handleDel);
        }
    })

    return (
        <div ref={ref} {...rest}>
            {children}
        </div>
    )
}