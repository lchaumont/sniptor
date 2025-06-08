import React, {createContext, ReactNode, useContext, useState} from "react";
import {useSnippets} from "../../hooks/useSnippets";
import {Snippet} from "../../types/snippet";

interface SnippetContextType {
    selectedSnippet: Snippet | null;
    snippets: Snippet[];
    loading: boolean;
    error: string | null;
    clearSelectedSnippet: () => void;
    setSelectedSnippet: (id: string) => void;
    createSnippet: (snippet: Omit<Snippet, "id" | "createdAt" | "updatedAt">) => Promise<Snippet>;
    updateSnippet: (id: string, updates: Partial<Omit<Snippet, "id" | "createdAt">>) => Promise<Snippet | null>;
    deleteSnippet: (id: string) => Promise<boolean>;
    refreshSnippets: () => Promise<void>;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

interface SnippetContextProviderProps {
    children: ReactNode;
}

export const SnippetContextProvider: React.FC<SnippetContextProviderProps> = ({children}) => {
    const [selectedSnippet, setSelectedSnippet] = useState<string | null>(null);

    // Single instance of useSnippets - this is the source of truth
    const snippetsHook = useSnippets();

    const selectedSnippetObject = selectedSnippet ? snippetsHook.snippets.find(snippet => snippet.id === selectedSnippet) || null : null;

    const value: SnippetContextType = {
        selectedSnippet: selectedSnippetObject,
        clearSelectedSnippet: () => setSelectedSnippet(null),
        setSelectedSnippet,
        // Expose all snippet operations from the single hook instance
        snippets: snippetsHook.snippets,
        loading: snippetsHook.loading,
        error: snippetsHook.error,
        createSnippet: snippetsHook.createSnippet,
        updateSnippet: snippetsHook.updateSnippet,
        deleteSnippet: snippetsHook.deleteSnippet,
        refreshSnippets: snippetsHook.refreshSnippets,
    };

    return <SnippetContext.Provider value={value}>{children}</SnippetContext.Provider>;
};

export const useSnippetContext = (): SnippetContextType => {
    const context = useContext(SnippetContext);

    if (context === undefined) {
        throw new Error("useSnippetContext must be used within a SnippetContextProvider");
    }

    return context;
};
