import React, { useLayoutEffect } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import styles from '../../../styles.module.css';
import { EMPTY_BD } from "../../constant";
import { item_state_accessor, qt_state, selected_itemID_state, select_state } from "../../state";
import { Bound } from "../../type";
import { CanvasUtil } from "../../utils/CanvasUtil";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
let count = 0;

export const RectSelect: React.FC = () => {
    const bd = useRecoilValue(select_state);
    const container_css = CanvasUtil.get_container_css(bd);
    const test = useRecoilCallback(({ snapshot, set }) => async (select_bd: Bound) => {
        count++; 
        // const tool = await snapshot.getPromise(tool_state);
        // const camera = await snapshot.getPromise(camera_state);
        const qt = await snapshot.getPromise(qt_state);
        const candidateIDs = qt.query(select_bd);
        const candidate_items = await Promise.all(candidateIDs.map(async (id) => {
            return { ...await snapshot.getPromise(item_state_accessor(id)), id: id };
        }))
        const intersectedIDs = CanvasUtil.get_intersected_items(select_bd, candidate_items);
        set(selected_itemID_state, intersectedIDs);
    }, [])

    useLayoutEffect(() => {
        if (bd == EMPTY_BD) {
            return;
        }
        test(bd);
    }, [bd])

    return (
        <Container style={container_css}>
            <SVGContainer pointerEvents={'none'}>
                <rect className={styles.cbSelectStroke} width={bd.max_x - bd.min_x} height={bd.max_y - bd.min_y} />
            </SVGContainer>
        </Container>
    )



}