import { ItemCSS } from "../../state";
import { Shape } from "../../type";
import React from "react";

export interface ComponentProps<T extends Shape> extends React.SVGProps<SVGSVGElement> {
    shape: T,
    item_css: ItemCSS
}