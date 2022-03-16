import React from "react";
import {useRecoilState} from "recoil"
import { CBITEM_TYPE } from "../../constant";
import {elementState} from "../../state"
import { Rect } from "../../type";
import { SVGContainer } from "../container/SVGContainer";


interface CanvasItemProps {
    id: number
};


export const CanvasItem: React.FC<CanvasItemProps> = React.memo(({id}: CanvasItemProps) => {
    const [CBItem, setCBItem] = useRecoilState(elementState(id));
    console.log("AAAAA");
    
    if (CBItem.type === CBITEM_TYPE.RECTANGLE) {
        return <RectComponent shape={CBItem.shape as Rect}></RectComponent>
    } else {
        return <button> aaa </button>
    }
})


interface RectComponentProps {
    shape: Rect 
}

const RectComponent: React.FC<RectComponentProps> = ({shape}: RectComponentProps) => {
    return <SVGContainer fill="white" stroke="black">
        <rect x="100" y="100" width={shape.mx * 2} height={shape.my * 2}/>
    </SVGContainer>
}