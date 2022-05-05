import produce from "immer"
import { current } from "immer"
import { useRecoilCallback } from "recoil"
import { CBACTION_STATE } from "../constant"
import { action_stack_state, itemID_state, item_state_accessor, selected_itemID_state, selected_items_state } from "../state"
import { CBAction, CBItem } from "../type"

export function useActionStack() {

    const push_action = useRecoilCallback(({ set }) => (action: CBAction) => {
        set(action_stack_state, (prev) => {
            return produce(prev, draft => {
                draft.pointer++;
                console.log("PARAMS: index: %d, count: %d", draft.pointer, draft.stack.length - draft.pointer);
                draft.stack.splice(draft.pointer, draft.stack.length - draft.pointer, action);

                console.log(prev, current(draft));
            })
        })
    })

    const reset_item_state = useRecoilCallback(({ reset }) => (id: number) => {
        reset(item_state_accessor(id));
    })

    const set_item_state = useRecoilCallback(({ set }) => (id: number, item: CBItem) => {
        set(item_state_accessor(id), item);
    })

    const redo = useRecoilCallback(({ snapshot, set }) => async () => {
        const action_stack = await snapshot.getPromise(action_stack_state);
        const action = action_stack.stack[action_stack.pointer + 1];
        if (!action) return;

        set(action_stack_state, (prev) => {
            return produce(prev, draft => {
                ++draft.pointer;
            })
        })
        switch (action.type) {
            case CBACTION_STATE.CREATING:
                action.targets.forEach((item) => {
                    set_item_state(item.id, item);
                })
                break;
            case CBACTION_STATE.RESIZING:
            case CBACTION_STATE.ROTATING:
            case CBACTION_STATE.TRANSLATING:
                action.targets.forEach((item) => {
                    set(item_state_accessor(item.id), (prev) => {
                        return produce(prev, draft => {
                            draft.shape = item.shape;
                        })
                    })
                })
        }
    })

    const undo = useRecoilCallback(({ snapshot, set, reset }) => async () => {
        const action_stack = await snapshot.getPromise(action_stack_state);
        const action = action_stack.stack[action_stack.pointer];
        if (!action) return;
        set(action_stack_state, (prev) => {
            return produce(prev, draft => {
                --draft.pointer;
            })
        })
        
        switch (action.type) {
            case CBACTION_STATE.CREATING:
                action.targets.forEach((item) => {
                    reset_item_state(item.id);
                })
                reset(selected_itemID_state);
                break;
            case CBACTION_STATE.RESIZING:
            case CBACTION_STATE.ROTATING:
            case CBACTION_STATE.TRANSLATING:
                action.before?.forEach((item) => {
                    set(item_state_accessor(item.id), (prev) => {
                        return produce(prev, draft => {
                            draft.shape = item.shape;
                        })
                    })
                })
        }
        const itemID = await snapshot.getPromise(itemID_state);
        console.log(itemID);
    })

    return {
        push_action: push_action,
        redo: redo,
        undo: undo
    }
}