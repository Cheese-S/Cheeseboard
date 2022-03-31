import { RefObject, useLayoutEffect, useRef, useState } from "react"

export function useContainerDimension(ref: RefObject<HTMLDivElement>): { width: number; height: number; } {
    const getDimension = () => ({
        width: ref.current!.offsetWidth,
        height: ref.current!.offsetHeight
    })

    const [dimension, setDimension] = useState({ width: 0, height: 0 })

    useLayoutEffect(() => {
        const handleResize = () => {
            setDimension(getDimension())
        }

        if (ref.current) {
            setDimension(getDimension())
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize); 
        }
    })

    return dimension;
} 