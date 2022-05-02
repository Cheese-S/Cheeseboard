import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useActionStack } from "../../hook/useActionStack";
import { action_stack_state } from "../../state";

export const ActionStack: React.FC = ({ }) => {
    const { redo, undo } = useActionStack();

    useEffect(() => {
        const handleUndoRedo = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                if (e.key === 'z') {
                    undo();
                } else if (e.key === 'y') {
                    redo();
                }
            }
        }
        document.addEventListener("keydown", handleUndoRedo);

        return () => {
            document.removeEventListener("keydown", handleUndoRedo); 
        }
    }, [])




    return null;
}