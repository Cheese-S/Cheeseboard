import * as React from 'react'

interface SVGContainerProp extends React.SVGProps<SVGSVGElement> {
    children: React.ReactNode;
}

export const SVGContainer = ({children, className="", ...rest}: SVGContainerProp) => {
    return (
        <svg className={`${className}`} {...rest}>
            <g>
                {children}
            </g>
        </svg>
    )
}