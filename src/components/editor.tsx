import { langs, LanguageName } from "@uiw/codemirror-extensions-langs";
import CodeMirror from "@uiw/react-codemirror";
import { useContext } from "react";
import { AppContext } from "./app-context";

interface EditorProps {
    value: string;
    readonly?: boolean;
    onChange?: (value: string) => void;
}

const Editor = ({ value, readonly = false, onChange }: EditorProps) => {
    const { language } = useContext(AppContext);

    const languageExtension = [];
    if (language! in langs) {
        languageExtension.push(langs[language as LanguageName]());
    }

    return (
        <CodeMirror
            value={value}
            height="500px"
            extensions={languageExtension}
            readOnly={readonly}
            onChange={onChange}
        />
    );
};

export default Editor;
