import { ItemCSS } from "../../state";
import { Shape } from "../../type";

export interface ComponentProps<T extends Shape> {
    shape: T,
    item_css: ItemCSS
}