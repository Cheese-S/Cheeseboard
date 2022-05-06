import * as React from 'react';
import styles from '../../../styles.module.css';


interface SVGContainerProp extends React.SVGProps<SVGSVGElement> {
    children: React.ReactNode;
}

export const SVGContainer: React.FC<SVGContainerProp> = ({children, className="", ...rest}: SVGContainerProp) => {
    return (
        <svg className={`${styles.cbPositionedSvg} ${className}`} {...rest}>
            <g className = {styles.cbCenteredG}>
                {children}
            </g>
        </svg>
    )
}