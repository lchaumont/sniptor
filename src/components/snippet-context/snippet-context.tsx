import React, {createContext, ReactNode, useContext, useState} from "react";
import {Snippet} from "../../types/snippet";

interface SnippetContextType {
    selectedSnippet: Snippet | null;
    setSelectedSnippet: (snippet: Snippet | null) => void;
    selectSnippetById: (id: string, snippets: Snippet[]) => void;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

interface SnippetContextProviderProps {
    children: ReactNode;
}

export const SnippetContextProvider: React.FC<SnippetContextProviderProps> = ({children}) => {
    const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

    const selectSnippetById = (id: string, snippets: Snippet[]) => {
        const snippet = snippets.find(s => s.id === id);
        setSelectedSnippet(snippet || null);
    };

    const value: SnippetContextType = {
        selectedSnippet,
        setSelectedSnippet,
        selectSnippetById,
    };

    return <SnippetContext.Provider value={value}>{children}</SnippetContext.Provider>;
};

export const useSelectedSnippet = (): SnippetContextType => {
    const context = useContext(SnippetContext);

    if (context === undefined) {
        throw new Error("useSelectedSnippet must be used within a SnippetContextProvider");
    }

    return context;
};
