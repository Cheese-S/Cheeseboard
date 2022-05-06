import React from "react"
import { RecoilRoot } from "recoil"
import { Canvas, CanvasContainer } from "../Canvas"


export const CheeseBoard: React.FC = () => {

    return (
        <RecoilRoot>
            <CanvasContainer>
                <Canvas />
            </CanvasContainer>
        </RecoilRoot>
    )
}