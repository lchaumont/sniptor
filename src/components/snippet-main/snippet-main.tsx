import {langs, LanguageName} from "@uiw/codemirror-extensions-langs";
import ReactCodeMirror from "@uiw/react-codemirror";
import {useState} from "react";
import {Snippet} from "../../types/snippet";
import Label from "../../ui/label/label";
import {useSelectedSnippet} from "../snippet-context/snippet-context";
import css from "./snippet-main.module.css";
import {useDebounceCallback} from "usehooks-ts";
import { useSnippets } from "../../hooks/useSnippets";

const SnippetViewer = ({snippet}: {snippet: Snippet}) => {
    const { setSelectedSnippet } = useSelectedSnippet();
    const { updateSnippet } = useSnippets();
    const [localContent, setLocalContent] = useState<string>(snippet.content);
    const debounced = useDebounceCallback(async (value: string) => {
        const updated = await updateSnippet(snippet.id, {
            ...snippet,
            content: value,
        });

        if (updated) {
            setSelectedSnippet(updated);
        };
    }, 500)

    const createdAt = new Date(snippet.createdAt);
    const updatedAt = new Date(snippet.updatedAt);
    const category = snippet.category.toLocaleLowerCase();

    const languageExtension = [];
    if (category in langs) {
        languageExtension.push(langs[category as LanguageName]());
    }

    const onChange = (value: string): void => {
        setLocalContent(value);
        debounced(value);
    };

    return (
        <div className={css["container"]}>
            <div className={css["header"]}>
                <h2 className={css["title"]}>{snippet.title}</h2>
                <Label>{category}</Label>
            </div>

            <div className={css["editor-container"]}>
                <ReactCodeMirror value={localContent} readOnly={false} extensions={languageExtension} onChange={onChange} />
            </div>

            <div className={css["metadata"]}>
                <span className={css["metadata-item"]}>Created: {createdAt.toLocaleDateString() + " " + createdAt.toLocaleTimeString()}</span>
                <span className={css["metadata-item"]}>Updated: {updatedAt.toLocaleDateString() + " " + updatedAt.toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

const SnippetMain = () => {
    const {selectedSnippet} = useSelectedSnippet();

    if (!selectedSnippet) {
        return (
            <div className={css["container"]}>
                <div className={css["no-selection"]}>Select a snippet to view its content</div>
            </div>
        );
    }

    return <SnippetViewer snippet={selectedSnippet} />;
};

export default SnippetMain;
