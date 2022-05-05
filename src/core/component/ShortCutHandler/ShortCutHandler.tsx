import { useEffect } from "react";
import { useRecoilCallback } from "recoil";
import { CBTOOL, CBACTION_TYPE } from "../../constant";
import { useActionStack } from "../../hook/useActionStack";
import { style_state, item_state_accessor, selected_items_state, selected_itemID_state, itemID_state } from "../../state";
import { CBItem } from "../../type";
import { CanvasUtil } from "../../utils/CanvasUtil";

export const ShortCutHandler: React.FC = ({}) => {
    const { push_action } = useActionStack(); 

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
        push_action({
            type: CBACTION_TYPE.CREATING,
            targets: items
        })

        
        set(selected_items_state, items); 
        set(selected_itemID_state, [...new_ids]);
        set(itemID_state, prev => {
            return [
                ...prev,
                ...new_ids.filter((id) => prev.indexOf(id) === -1)
            ]
        });
    })

    const del_shapes = useRecoilCallback(({snapshot, reset}) => async () => {
        const items = await snapshot.getPromise(selected_items_state);
        if (items && items.length > 0 ) {
            push_action({
                type: CBACTION_TYPE.DELETING,
                targets: items
            })
            reset(selected_items_state);
            reset(selected_itemID_state); 
        }
    })

    const get_copy_shapes = useRecoilCallback(({ snapshot }) => async () => {
        return await snapshot.getPromise(selected_items_state);
    })

    useEffect(() => {
        const handleCopy = async (e: ClipboardEvent) => {
            try {

                const selected_items = await get_copy_shapes();
                if (selected_items.length === 0) return;

                // @ts-ignore
                await navigator.clipboard.writeText(JSON.stringify({ type: 'CB/Shapes', shapes: selected_items }));

            } catch (e) {
                //@ts-ignore
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
                //@ts-ignore
                console.log(e.message);
            }
        }

        const handleDel = async (e: KeyboardEvent) => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                await del_shapes();
            }
        }

        document.onpaste = handlePaste;
        document.oncopy = handleCopy;
        window.addEventListener("keydown", handleDel);
        return () => {
            document.onpaste = null;
            document.oncopy = null;
            window.removeEventListener("keydown", handleDel);
        }
    })
    return null;
}