import React from "react";
import {useRecoilState, useRecoilValue} from "recoil"
import { CBTOOL } from "../../constant";
import { item_state, item_css_state } from "../../state";
import { Ellipse, Rect, Triangle,  } from "../../type";
import { 
    RectComponent,
    EllipseComponent,
    TriangleComponent 
} from "../shapeComponent";




interface CanvasItemProps {
    id: number
};


export const CanvasItem: React.FC<CanvasItemProps> = React.memo(({id}: CanvasItemProps) => {
    const [CBItem, setCBItem] = useRecoilState(item_state(id));
    const item_style = useRecoilValue(item_css_state(id)); 

    


    switch (CBItem.type) {
        case CBTOOL.RECTANGLE:
            return <RectComponent shape={CBItem.shape as Rect} item_css={item_style}/>
        case CBTOOL.ELLIPSE:
            return <EllipseComponent shape={CBItem.shape as Ellipse} item_css={item_style}/>
        case CBTOOL.TRIANGLE:
            return <TriangleComponent shape={CBItem.shape as Triangle} item_css={item_style}/>
    }
    return <button> aaa </button>
    
})
