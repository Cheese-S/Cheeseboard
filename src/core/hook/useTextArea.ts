import { RefObject, useLayoutEffect, useRef, useState } from "react"

export function useTextArea(): 
{
    ref: RefObject<HTMLTextAreaElement>,
    is_editing: boolean,
    set_is_editing: React.Dispatch<React.SetStateAction<boolean>>
} {
    const [is_editing, set_is_editing] = useState(false); 
    let textarea_ref = useRef<HTMLTextAreaElement>(null);
    
    useLayoutEffect(() => {
        if (!(textarea_ref && textarea_ref.current)) {
            return;
        }

        const element = textarea_ref.current;



        if (is_editing) {
            element.style.pointerEvents = 'all';
            // element.select();
            element.focus(); 
        } else {
            element.style.pointerEvents = 'none';
        }
        //@ts-ignore
        const on_input_handler = (e) => {
            console.log(e.currentTarget.scrollHeight + 'px');
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; 
        }

        element.addEventListener('input', on_input_handler);

        return () => {
            element.removeEventListener('input', on_input_handler);
        };
    })

    return {
        ref: textarea_ref,
        is_editing: is_editing,
        set_is_editing: set_is_editing
    };
} 