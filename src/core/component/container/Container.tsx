import React from "react";
import { HTMLProps } from "react";
import styles from '../../../styles.module.css'

interface ContainerProps extends HTMLProps<HTMLDivElement> {
    children: React.ReactNode
}

export const Container: React.FC<ContainerProps> = ({children, ...rest}: ContainerProps) => {
    return (
        <div className={`${styles.cbPositioned}`} {...rest}>
            {children}
        </div>
    )
}