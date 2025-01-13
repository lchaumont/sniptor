import { useStore } from "@tanstack/react-store";
import { createContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Snippet, store } from "../stores/data-store";

interface AppContextValue {
    language: string | undefined;
    setLanguage: (language: string) => void;
    category: string | undefined;
    setCategory: (category: string) => void;
    snippet: ({ name: string } & Snippet) | undefined;
    setSnippet: (snippet: ({ name: string } & Snippet) | undefined) => void;
}

const AppContext = createContext<AppContextValue>({
    language: undefined,
    setLanguage: () => {},
    category: undefined,
    setCategory: () => {},
    snippet: undefined,
    setSnippet: () => {},
});

interface AppContextProviderProps {
    children: React.ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [language, innerSetLanguage] = useLocalStorage<string | undefined>(
        "selected-language",
        "javascript"
    );
    const [category, setCategory] = useLocalStorage<string | undefined>(
        "selected-category",
        undefined
    );
    const [snippet, setSnippet] = useLocalStorage<
        ({ name: string } & Snippet) | undefined
    >("selected-snippet", undefined);
    const dataStore = useStore(store);

    const setLanguage = (language: string) => {
        innerSetLanguage(language);

        const categories = dataStore[language];
        if (categories && Object.keys(categories).length > 0) {
            setCategory(Object.keys(categories)[0]);
        } else {
            setCategory(undefined);
        }
    };

    return (
        <AppContext.Provider
            value={{
                language,
                setLanguage,
                category,
                setCategory,
                snippet,
                setSnippet,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };
