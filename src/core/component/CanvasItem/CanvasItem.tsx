import React from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil"
import { CBTOOL } from "../../constant";
import { item_state, item_css_state, selected_itemID_state } from "../../state";
import { Ellipse, Rect, Triangle,  } from "../../type";
import { 
    RectComponent,
    EllipseComponent,
    TriangleComponent 
} from "../ShapeComponent";




interface CanvasItemProps {
    id: number
};


export const CanvasItem: React.FC<CanvasItemProps> = React.memo(({id}: CanvasItemProps) => {
    const [CBItem, setCBItem] = useRecoilState(item_state(id));
    const item_style = useRecoilValue(item_css_state(id)); 
    const set_selectedIDs = useSetRecoilState(selected_itemID_state);
    const append_id = (e: React.MouseEvent) => {
        set_selectedIDs((prev) => [...prev, id]);
    }

    


    switch (CBItem.type) {
        case CBTOOL.RECTANGLE:
            return <RectComponent onClick={append_id} shape={CBItem.shape as Rect} item_css={item_style}/>
        case CBTOOL.ELLIPSE:
            return <EllipseComponent onClick={append_id} shape={CBItem.shape as Ellipse} item_css={item_style}/>
        case CBTOOL.TRIANGLE:
            return <TriangleComponent onClick={append_id} shape={CBItem.shape as Triangle} item_css={item_style}/>
    }
    return <button> aaa </button>
    
})
