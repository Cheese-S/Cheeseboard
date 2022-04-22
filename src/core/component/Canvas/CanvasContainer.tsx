import React, { HTMLProps, useLayoutEffect, useRef } from "react";
import { useRecoilCallback, useResetRecoilState, useSetRecoilState } from "recoil";
import { camera_state, itemID_state, item_state_accessor, selected_itemID_state, selected_items_state, style_state } from "../../state";
import produce from "immer";
import { Image } from "../../type"
import { CBTOOL } from "../../constant";
import { CanvasUtil } from "../../utils/CanvasUtil";

interface CanvasContainerProps extends HTMLProps<HTMLDivElement> {
    children: React.ReactNode
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ children, ...rest }) => {
    const ref = useRef<HTMLDivElement>(null);
    const set_camera = useSetRecoilState(camera_state);
    const reset_selected_items = useResetRecoilState(selected_items_state);
    const reset_selected_ids = useResetRecoilState(selected_itemID_state);
    const paste_in_shapes = useRecoilCallback(({ snapshot, set }) => async (is_image: boolean, src: string) => {
        const style = await snapshot.getPromise(style_state);
        if (is_image) {
            const new_id = CanvasUtil.uuid();
            const img = new Image();
            img.src = src;
            img.onload = () => {
                set(item_state_accessor(new_id), {
                    id: new_id,
                    type: CBTOOL.IMAGE,
                    shape: {
                        src: src,
                        center: { x: 1280, y: 720 },
                        mx: img.naturalWidth / 2, 
                        my: img.naturalHeight / 2,
                        r: 0,
                    },
                    style: {
                        ...style,
                        is_ghost: false
                    },
                    qt_id: -1,
                    text:""
                })
            }
        }
    })
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
                reset_selected_ids();
            }
        }

        const handlePaste = (e: any) => {
            let items = (e.clipboardData || e.originalEvent.clipboardData).items;

            let blob = null;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    blob = items[i].getAsFile();
                }
            }

            if (blob !== null) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    // @ts-ignore
                    console.log(e.target.result);
                    console.log(JSON.stringify(e.target));
                    paste_in_shapes(true, (e.target?.result as string)); 
                };
                reader.readAsDataURL(blob);
                
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

        document.onpaste = handlePaste;
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("keydown", handleDel);
            document.onpaste = null;
        }
    })

    return (
        <div ref={ref} {...rest}>
            {children}
        </div>
    )
}