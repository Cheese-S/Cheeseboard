import { useEffect } from "react";
import { useActionStack } from "../../hook/useActionStack";

export const ActionStack: React.FC = ({ }) => {
    const { redo, undo } = useActionStack();

    useEffect(() => {
        const handleUndoRedo = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    undo();
                } else if (e.key === 'y') {
                    e.preventDefault();
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