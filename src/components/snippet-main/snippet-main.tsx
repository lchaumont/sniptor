import {langs, LanguageName} from "@uiw/codemirror-extensions-langs";
import ReactCodeMirror from "@uiw/react-codemirror";
import {useDebounceCallback} from "usehooks-ts";
import {Snippet} from "../../types/snippet";
import Label from "../../ui/label/label";
import {useSnippetContext} from "../snippet-context/snippet-context";
import css from "./snippet-main.module.css";

const SnippetViewer = ({snippet}: {snippet: Snippet}) => {
    const {setSelectedSnippet, updateSnippet} = useSnippetContext();

    const debounced = useDebounceCallback(async (value: string) => {
        updateSnippet(snippet.id, {
            ...snippet,
            content: value,
        }).then(() => {
            setSelectedSnippet(snippet.id);
        });
    }, 2000);

    const createdAt = new Date(snippet.createdAt);
    const updatedAt = new Date(snippet.updatedAt);
    const category = snippet.category.toLocaleLowerCase();

    const languageExtension = [];
    if (category in langs) {
        languageExtension.push(langs[category as LanguageName]());
    }

    return (
        <div className={css["container"]}>
            <div className={css["header"]}>
                <h2 className={css["title"]}>{snippet.title}</h2>
                <Label>{category}</Label>
            </div>

            <div className={css["editor-container"]}>
                <ReactCodeMirror value={snippet.content} readOnly={false} extensions={languageExtension} onChange={debounced} />
            </div>

            <div className={css["metadata"]}>
                <span className={css["metadata-item"]}>Created: {createdAt.toLocaleDateString() + " " + createdAt.toLocaleTimeString()}</span>
                <span className={css["metadata-item"]}>Updated: {updatedAt.toLocaleDateString() + " " + updatedAt.toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

const SnippetMain = () => {
    const {selectedSnippet} = useSnippetContext();

    if (!selectedSnippet) {
        return (
            <div className={css["container"]}>
                <div className={css["no-selection"]}>Select a snippet to view its content</div>
            </div>
        );
    }

    return <SnippetViewer key={selectedSnippet.id} snippet={selectedSnippet} />;
};

export default SnippetMain;
