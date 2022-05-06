import React from "react";
import { ItemCSS, Shape } from "../../type";

export interface ComponentProps<T extends Shape> extends React.SVGProps<SVGSVGElement> {
    _shape: T,
    item_css: ItemCSS
}