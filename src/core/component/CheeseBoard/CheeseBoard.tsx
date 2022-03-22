import React from "react"
import { Canvas } from "../Canvas"
import { RecoilRoot } from "recoil"





export const CheeseBoard: React.FC = () => {
    return (
        <RecoilRoot>
            <Canvas/>
        </RecoilRoot>
    )
}