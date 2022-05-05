import React, { HTMLProps, useLayoutEffect, useRef } from "react";
import { useRecoilCallback, useResetRecoilState, useSetRecoilState } from "recoil";
import { camera_state, itemID_state, item_state_accessor, selected_itemID_state, selected_items_state, style_state } from "../../state";
import produce from "immer";
import { CBItem, Image } from "../../type"
import { CBACTION_TYPE, CBTOOL } from "../../constant";
import { CanvasUtil } from "../../utils/CanvasUtil";
import { useActionStack } from "../../hook/useActionStack";


interface CanvasContainerProps extends HTMLProps<HTMLDivElement> {
    children: React.ReactNode
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ children, ...rest }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { push_action } = useActionStack(); 
    const set_camera = useSetRecoilState(camera_state);
    const reset_selected_items = useResetRecoilState(selected_items_state);
    const reset_selected_ids = useResetRecoilState(selected_itemID_state);
    
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