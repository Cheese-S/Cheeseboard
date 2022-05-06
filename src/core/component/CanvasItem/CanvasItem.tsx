import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CBTOOL } from "../../constant";
import { item_css_state, item_state, selected_itemID_state } from "../../state";
import { Ellipse, Image, Polyline, Rect, Text, Triangle } from "../../type";
import {
    EllipseComponent, RectComponent, TriangleComponent
} from "../ShapeComponent";
import { ImageComponent } from "../ShapeComponent/ImageComponent";
import { PenComponent } from "../ShapeComponent/PenComponent";
import { TextComponent } from "../ShapeComponent/TextComponent";




interface CanvasItemProps {
    id: number
};


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
            return <TextComponent _id={id} _shape={CBItem.shape as Text} _text={CBItem.text} item_css={item_style} set_selectID={set_selectedIDs} />
        case CBTOOL.PEN:
            return <PenComponent _shape={CBItem.shape as Polyline} item_css={item_style} onMouseDown={on_select} />
        case CBTOOL.IMAGE:
            return <ImageComponent _id={id} _shape={CBItem.shape as Image} item_css={item_style} onMouseDown={on_select} />
    }
    return <button> aaa </button>

})
