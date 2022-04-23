import React from "react"
import styles from '../../../styles.module.css'
interface HTMLContainerProp extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode
    _ref?: React.RefObject<HTMLDivElement>
}

export const HTMLContainer: React.FC<HTMLContainerProp> = ({children, className, _ref, ...rest}: HTMLContainerProp) => {
    return (
        <div className={`${styles.cbPositionedDiv} ${className || ''}`} {...rest}>
            <div ref={_ref} style={{position: "relative", width:"100%", height:"100%", background: 'transparent'}}>
                {children}
            </div>
        </div>
    )
}