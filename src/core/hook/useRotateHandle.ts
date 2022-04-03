import { Point } from "../type";


export function useRotateHandle(width: number, height: number, padding: number, r: number) {
    const center: Point = {x: width / 2, y: -(padding + r)}; 

    return {
        center: center
    }
}