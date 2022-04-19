import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { CBTOOL } from "../../constant";
import { item_state, item_css_state, selected_itemID_state } from "../../state";
import { Ellipse, Rect, Text, Triangle, } from "../../type";
import {
    RectComponent,
    EllipseComponent,
    TriangleComponent
} from "../ShapeComponent";
import { TextComponent } from "../ShapeComponent/TextComponent";




interface CanvasItemProps {
    id: number
};

let timer: NodeJS.Timeout; 

export const CanvasItem: React.FC<CanvasItemProps> = React.memo(({ id }: CanvasItemProps) => {
    const [CBItem, setCBItem] = useRecoilState(item_state(id));
    const item_style = useRecoilValue(item_css_state(id));
    const set_selectedIDs = useSetRecoilState(selected_itemID_state);
    const on_select = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("YOU TRRIGERD?")
        set_selectedIDs(prev => [id]);
    }
    
    

    switch (CBItem.type) {
        case CBTOOL.RECTANGLE:
            return <RectComponent _shape={CBItem.shape as Rect} item_css={item_style} onMouseDown={on_select} />
        case CBTOOL.ELLIPSE:
            return <EllipseComponent _shape={CBItem.shape as Ellipse} item_css={item_style} onMouseDown={on_select} />
        case CBTOOL.TRIANGLE:
            return <TriangleComponent _shape={CBItem.shape as Triangle} item_css={item_style} onMouseDown={on_select} />
        case CBTOOL.TEXT:
            return <TextComponent _id={id}  _shape={CBItem.shape as Text} item_css={item_style} onMouseDown={on_select} />
    }
    return <button> aaa </button>

})
