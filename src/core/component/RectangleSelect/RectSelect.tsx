import React, { useLayoutEffect } from "react";
import { useRecoilState, useRecoilValue, useRecoilCallback } from "recoil";
import { select_state, pointer_state, tool_state, selected_itemID_state, qt_state, camera_state, item_state_accessor, itemID_state } from "../../state";
import { Container } from "../Container/Container";
import { SVGContainer } from "../Container/SVGContainer";
import styles from '../../../styles.module.css'
import { CanvasUtil } from "../../utils/CanvasUtil";
import { CBTOOL, empty_bd } from "../../constant";
import { Bound } from "../../type";
let count = 0;

export const RectSelect: React.FC = () => {
    const bd = useRecoilValue(select_state);
    const container_css = CanvasUtil.get_container_css(bd);
    const test = useRecoilCallback(({ snapshot, set }) => async (select_bd: Bound) => {
        count++; 
        console.log("rect select", count);
        // const tool = await snapshot.getPromise(tool_state);
        // const camera = await snapshot.getPromise(camera_state);
        const qt = await snapshot.getPromise(qt_state);
        const candidateIDs = qt.query(select_bd);
        const candidate_items = await Promise.all(candidateIDs.map(async (id) => {
            return { ...await snapshot.getPromise(item_state_accessor(id)), id: id };
        }))
        console.log(candidate_items);
        const intersectedIDs = CanvasUtil.get_intersected_items(select_bd, candidate_items);
        console.log(`intersected IDs: ${intersectedIDs}`);
        set(selected_itemID_state, intersectedIDs);
    }, [])

    useLayoutEffect(() => {
        if (bd == empty_bd) {
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