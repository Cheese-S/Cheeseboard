import React from "react"
import styles from '../../../styles.module.css'
interface HTMLContainerProp extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode
}

export const HTMLContainer: React.FC<HTMLContainerProp> = ({children, className, ...rest}: HTMLContainerProp) => {
    return (
        <div className={`${styles.cbPositionedDiv} ${className || ''}`} {...rest}>
            <div style={{position: "relative", width:"100%", height:"100%"}}>
                {children}
            </div>
        </div>
    )
}