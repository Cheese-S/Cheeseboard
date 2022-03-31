import React from "react"
import { Canvas, CanvasContainer } from "../Canvas"
import { RecoilRoot, useSetRecoilState } from "recoil"






export const CheeseBoard: React.FC = () => {

    return (
        <RecoilRoot>
            <CanvasContainer>
                <Canvas />
            </CanvasContainer>
        </RecoilRoot>
    )
}