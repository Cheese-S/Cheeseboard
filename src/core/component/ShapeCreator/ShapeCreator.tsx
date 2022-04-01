import React from "react";
import { useRecoilValue } from "recoil";
import { CBTOOL } from "../../constant";
import { pointer_state, style_state } from "../../state";
import { Rect, Ellipse, Triangle } from "../../type"
import { CanvasUtil } from "../../utils/CanvasUtil";
import { 
    RectComponent,
    EllipseComponent,
    TriangleComponent 
} from "../ShapeComponent";



interface ShapeCreatorProps {
    tool: CBTOOL.RECTANGLE | CBTOOL.ELLIPSE | CBTOOL.TRIANGLE
}


export const ShapeCreator: React.FC<ShapeCreatorProps> = ({ tool }: ShapeCreatorProps) => {
    const style = useRecoilValue(style_state);
    const pointer = useRecoilValue(pointer_state);
    
    const shapeUtil = CanvasUtil.get_shapeutil(tool); 
    let shape = CanvasUtil.get_default_shape(tool); 
    shapeUtil!.set_shape_top_left(shape, pointer.curr_point);
    const bd = shapeUtil!.get_bound(shape);  
    const item_style = CanvasUtil.get_item_css(bd, shape, {...style, is_ghost: true});
    let shape_component; 
    switch (tool) {
        case CBTOOL.RECTANGLE:
            shape_component = <RectComponent shape={shape as Rect} item_css={item_style}/>
            break;
        case CBTOOL.ELLIPSE:
            shape_component = <EllipseComponent shape={shape as Ellipse} item_css={item_style}/>
            break;
        case CBTOOL.TRIANGLE:
            shape_component = <TriangleComponent shape={shape as Triangle} item_css={item_style}/>
            break; 
    }

    return (
        <div onClick={() => {console.log("aaa")}}>
            {shape_component}
        </div>
    )
} 