import React from "react";
import { useRecoilValue } from "recoil";
import { CBTOOL } from "../../constant";
import { tool_state } from "../../state";
import { RectSelect } from "../RectangleSelect";
import { ShapeCreator } from "../ShapeCreator";



export const ToolWrapper: React.FC = () => {
    const tool = useRecoilValue(tool_state);

    switch (tool) {
        case CBTOOL.RECTANGLE:
        case CBTOOL.ELLIPSE:
        case CBTOOL.TRIANGLE:
            return <ShapeCreator tool={tool} />
        case CBTOOL.SELECT:
            return <RectSelect />
        default:
            return null;
    }
}