import { Shape, ItemCSS } from "../../type";
import React from "react";

export interface ComponentProps<T extends Shape> extends React.SVGProps<SVGSVGElement> {
    _shape: T,
    item_css: ItemCSS
}