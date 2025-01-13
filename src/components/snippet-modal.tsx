import { motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { useKeyEvent } from "../hooks/useKeyEvent";
import { Snippet } from "../stores/data-store";
import Editor from "./editor";
import Tag from "./tag";

interface SnippetModalProps {
    snippet: {
        name: string;
    } & Snippet;
    language: string;
    handleCloseModal: () => void;
}

const SnippetModal = ({
    snippet,
    language,
    handleCloseModal,
}: SnippetModalProps) => {
    const modalRoot = document.getElementById("modal-root");

    const shouldReduceMotion = useReducedMotion();

    useKeyEvent("Escape", handleCloseModal);

    if (!modalRoot) return null;

    return createPortal(
        <motion.div
            key="modal-overlay"
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000] overflow-hidden"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleCloseModal();
                }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        >
            <motion.div
                key="modal-content"
                className="w-full max-w-[800px] bg-base-300 rounded-lg p-8 flex flex-col gap-4"
                layoutId={`${language}-${snippet.name}`}
                transition={{
                    ease: [0, 0.75, 0.25, 1],
                    duration: shouldReduceMotion ? 0 : 0.3,
                }}
            >
                <h3 className="font-bold text-lg">{snippet.name}</h3>

                <Editor value={snippet.code} readonly />

                <p>
                    <span className="font-bold">Description:&nbsp;</span>
                    {snippet.description}
                </p>

                <div className="flex flex-row flex-wrap gap-2">
                    {snippet.tags.map((tag) => (
                        <Tag key={tag} name={tag} />
                    ))}
                </div>
                <div className="flex flex-row justify-end">
                    <button className="btn" onClick={handleCloseModal}>
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>,
        modalRoot
    );
};

export default SnippetModal;
