import React, { HTMLProps, useLayoutEffect, useRef } from "react";
import { useRecoilCallback, useResetRecoilState, useSetRecoilState } from "recoil";
import { camera_state, itemID_state, item_state_accessor, selected_itemID_state, selected_items_state, style_state } from "../../state";
import produce from "immer";
import { CBItem, Image } from "../../type"
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
    const paste_in_image = useRecoilCallback(({ snapshot, set }) => async (src: string) => {
        const style = await snapshot.getPromise(style_state);
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
                text: ""
            })
        }
    })

    const paste_in_shapes = useRecoilCallback(({ snapshot, set }) => async (items: CBItem[]) => {
        const new_ids: number[] = []
        items.forEach((item) => {
            item.id = CanvasUtil.uuid();
            new_ids.push(item.id); 
            item.qt_id = -1;
            CanvasUtil.get_shapeutil(item.type)?.translate_shape({x: 10, y: 10}, item.shape);
        })
        set(selected_items_state, items); 
        set(selected_itemID_state, [...new_ids]);
        set(itemID_state, prev => [...prev, ...new_ids]); 
    })

    const get_copy_shapes = useRecoilCallback(({ snapshot }) => async () => {
        return await snapshot.getPromise(selected_items_state);
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

        const handleCopy = async (e: ClipboardEvent) => {
            try {

                const selected_items = await get_copy_shapes();
                if (selected_items.length === 0) return;

                // @ts-ignore
                await navigator.clipboard.writeText(JSON.stringify({ type: 'CB/Shapes', shapes: selected_items }));

            } catch (e) {
                console.log(e.message);
            }
        }
        const handlePaste = async (e: ClipboardEvent) => {
            try {
                // @ts-ignore
                const clipobardCotents = await navigator.clipboard.read();
                console.log(clipobardCotents);
                for (const item of clipobardCotents) {
                    if (item.types[0] === 'image/png') {
                        const src = URL.createObjectURL(await item.getType('image/png'));
                        paste_in_image(src);
                    } else if (item.types[0] === 'text/plain') {
                        const blob = await item.getType('text/plain');
                        const { type, shapes } = JSON.parse(await blob.text());

                        if (type && type === 'CB/Shapes') {
                            await paste_in_shapes(shapes as CBItem[]); 
                        }
                    }
                }

            } catch (e) {
                console.log(e.message);
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
        document.oncopy = handleCopy;
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("keydown", handleDel);
            document.onpaste = null;
            document.oncopy = null;
        }
    })

    return (
        <div ref={ref} {...rest}>
            {children}
        </div>
    )
}