import React from "react"
import { Point } from "../../type";

interface EdgeHandleProps {
    height: number,
    width: number,
    center: Point,
    onClick?: React.MouseEventHandler
}

export const EdgeHandle: React.FC<EdgeHandleProps> = ({height, width, center, onClick}) => {
    return (
        <rect height={height} width={width} x={center.x} y={center.y} onClick={onClick}/>
    ) 
}