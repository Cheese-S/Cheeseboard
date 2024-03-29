import produce from "immer";
import React, { useLayoutEffect } from "react";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import styles from '../../../styles.module.css';
import { useDivIndicator } from "../../hook/useDivIndicator";
import { useTextArea } from "../../hook/useTextArea";
import { item_state_accessor } from "../../state";
import { CBItem, ItemCSS, Rect, Text } from "../../type";
import { Container } from "../Container/Container";
import { HTMLContainer } from "../Container/HTMLContainer";


interface TextComponentProps extends React.HTMLProps<HTMLDivElement> {
    _id?: number
    _shape: Text,
    _text: string,
    item_css: ItemCSS,
    set_selectID?: (valOrUpdater: number[] | ((currVal: number[]) => number[])) => void;

}
let timer: NodeJS.Timeout;

export const TextComponent: React.FC<TextComponentProps> = ({ _id, _shape, _text, item_css, set_selectID, ...rest }: TextComponentProps) => {
    const { ref, is_editing, set_is_editing } = useTextArea();
    const { container_css, component_css } = item_css;
    const div_ref = useDivIndicator();
    let set_item: SetterOrUpdater<CBItem>;
    if (_id) {
        set_item = useSetRecoilState(item_state_accessor(_id));
    }

    const scaled_font_size = (component_css.fontSize as number) * _shape.scale;

    const on_click = (e: React.MouseEvent) => {
        if (e.detail === 1) {
            timer = setTimeout(() => {
                if (_id && set_selectID)
                    set_selectID(prev => [_id]);
            }, 200)
        }
    }
    const on_dbclick = (e: React.MouseEvent) => {
        clearTimeout(timer);
        console.log('dbclick');
        set_is_editing(true);
    }

    useLayoutEffect(() => {
        if (!(ref && ref.current)) {
            return;
        }
        const element = ref.current;
        element.style.height = 'auto';
        if (!!set_item) {
            set_item((prev) => {
                console.log("useLayoutEffect scroll height: %d", element.scrollHeight)
                element.style.height = element.scrollHeight + 'px';
                return produce(prev, draft => {
                    (draft.shape as Rect).my = (element.scrollHeight + 4) / 2;
                })
            })
        }
    }, [scaled_font_size])

    return (
        <Container style={container_css}>
            <HTMLContainer>
                <div
                    ref={div_ref}
                    className={styles.cbTextWrapper}
                    style={{
                        ...component_css,
                        pointerEvents: is_editing ? 'none' : 'all'
                    }}
                    onClick={on_click}
                    onDoubleClick={on_dbclick}
                >
                    <textarea
                        ref={ref}
                        className={styles.cbTextArea}
                        style={{
                            fontSize: scaled_font_size,
                            color: component_css.stroke,
                            pointerEvents: 'none',
                        }}
                        defaultValue={_text}
                        onMouseDown={(e) => { e.stopPropagation() }}
                        onMouseMove={(e) => { e.stopPropagation() }}
                        onBlur={() => set_is_editing(false)}
                        onClick={(e) => { e.stopPropagation() }}
                        onDoubleClick={(e) => { e.stopPropagation() }}
                        onInput={(e) => {
                            let target = e.currentTarget;
                            if (!!set_item) {
                                set_item((prev) => {
                                    console.log("scroll height: %d", target.scrollHeight)
                                    return produce(prev, draft => {
                                        (draft.shape as Rect).my = (target.scrollHeight + 4) / 2;
                                        draft.text = target.value;
                                    })
                                })
                            }
                        }}
                    />
                </div>
            </HTMLContainer>
        </Container>
    )
}