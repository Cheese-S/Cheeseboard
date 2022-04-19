import React, { useRef, useState } from "react";
import { CBItem, ItemCSS, Rect, Text } from "../../type";
import { HTMLContainer } from "../Container/HTMLContainer";
import { ComponentProps } from './internal'
import styles from '../../../styles.module.css'
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import { useDivIndicator } from "../../hook/useDivIndicator";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { item_state_accessor, selected_itemID_state } from "../../state";
import { useTextArea } from "../../hook/useTextArea";
import produce from "immer";


interface TextComponentProps extends React.HTMLProps<HTMLDivElement> {
    _id?: number
    _shape: Text,
    item_css: ItemCSS
}
let timer: NodeJS.Timeout; 

export const TextComponent: React.FC<TextComponentProps> = ({ _id, _shape, item_css, ...rest }: TextComponentProps) => {
    const { ref, is_editing, set_is_editing } = useTextArea(); 
    const { container_css, component_css } = item_css;
    const div_ref = useDivIndicator();
    let set_item: SetterOrUpdater<CBItem>;
    if (_id) {
        set_item = useSetRecoilState(item_state_accessor(_id)); 
    }
    let on_input = () => {

    }

    const scaled_font_size = (component_css.fontSize as number) * _shape.scale;
    console.log(component_css.fontSize);
    console.log(_shape.scale);

    

    const on_click = (e: React.MouseEvent) => {
        if (e.detail === 1) {
           timer = setTimeout(() => {
               console.log('click');
           }, 200) 
        }
    }
    const on_dbclick = (e: React.MouseEvent) => {
        clearTimeout(timer);
        console.log('dbclick'); 
        set_is_editing(true);
    }
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
                    onMouseDown={(e) => {e.stopPropagation()}}
                >
                    <textarea
                        ref={ref}
                        className={styles.cbTextArea}
                        style={{ 
                            fontSize: scaled_font_size, 
                            color: component_css.stroke, 
                            pointerEvents: 'none', 
                        }}
                        defaultValue={"THIS IS AN EXTREMELY LONG TEXT"}
                        // onMouseDown={(e) => { e.stopPropagation() }}
                        onMouseMove={(e) => { e.stopPropagation() }}
                        onBlur={() => set_is_editing(false)}
                        onClick={(e) => {e.stopPropagation()}}
                        onDoubleClick={(e) => {e.stopPropagation()}}
                        onInput={(e) => {
                            let target = e.currentTarget; 
                            if (!!set_item) {
                                set_item((prev) => {
                                    return produce(prev, draft => {
                                        (draft.shape as Rect).my = (target.scrollHeight + 8) / 2; 
                                    })
                                })
                            }
                        }}
                        


                    // datatype="wysiwyg"
                    // onInput={() => on_input(this)}
                    />
                </div>
            </HTMLContainer>
        </Container>
    )
}