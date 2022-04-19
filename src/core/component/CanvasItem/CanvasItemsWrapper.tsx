import React from "react"
import { useRecoilValue } from "recoil"
import { itemID_state } from "../../state"
import { CanvasItem } from "./CanvasItem"

export const CanvasItemsWrapper: React.FC = ({ }) => {
    const ids = useRecoilValue(itemID_state);
    console.log(ids);
    return (
        <React.Fragment>
            {ids.map((id) => {
                return <CanvasItem key={id} id={id} />
            })}
        </React.Fragment>
    )

}