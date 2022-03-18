import React from "react";
import {useRecoilState, useRecoilValue} from "recoil"
import { CBITEM_TYPE } from "../../constant";
import { itemState } from "../../state";
import { Ellipse, Rect, Triangle,  } from "../../type";
import { containerCssState } from "../../state/state";
import { 
    RectComponent,
    EllipseComponent 
} from "../shapeComponent";
import { TriangleComponent } from "../shapeComponent/TriangleComponent";




interface CanvasItemProps {
    id: number
};


export const CanvasItem: React.FC<CanvasItemProps> = React.memo(({id}: CanvasItemProps) => {
    const [CBItem, setCBItem] = useRecoilState(itemState(id));
    const container_css = useRecoilValue(containerCssState(id)); 


    switch (CBItem.type) {
        case CBITEM_TYPE.RECTANGLE:
            return <RectComponent shape={CBItem.shape as Rect} container_css={container_css}/>
        case CBITEM_TYPE.ELLIPSE:
            return <EllipseComponent shape={CBItem.shape as Ellipse} container_css={container_css}/>
        case CBITEM_TYPE.TRIANGLE:
            return <TriangleComponent shape={CBItem.shape as Triangle} container_css={container_css}/>
    }
    return <button> aaa </button>
    
})
