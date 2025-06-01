import {useEffect, useState} from "react";
import {SnippetStorage} from "../stores/snippet-store";
import {Snippet} from "../types/snippet";

export const useSnippets = () => {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSnippets = async () => {
        try {
            setLoading(true);
            const loadedSnippets = await SnippetStorage.loadSnippets();
            setSnippets(loadedSnippets);
            setError(null);
        } catch (err) {
            setError("Failed to load snippets");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createSnippet = async (snippet: Omit<Snippet, "id" | "createdAt" | "updatedAt">) => {
        try {
            const newSnippet = await SnippetStorage.createSnippet(snippet);
            setSnippets(prev => [...prev, newSnippet]);
            return newSnippet;
        } catch (err) {
            setError("Failed to create snippet");
            throw err;
        }
    };

    const updateSnippet = async (id: string, updates: Partial<Omit<Snippet, "id" | "createdAt">>) => {
        console.log("Updating snippet with ID:", id, "Updates:", updates);
        try {
            const updatedSnippet = await SnippetStorage.updateSnippet(id, updates);
            if (updatedSnippet) {
                setSnippets(prev => prev.map(s => (s.id === id ? updatedSnippet : s)));
            }
            return updatedSnippet;
        } catch (err) {
            setError("Failed to update snippet");
            throw err;
        }
    };

    const deleteSnippet = async (id: string) => {
        try {
            const success = await SnippetStorage.deleteSnippet(id);
            if (success) {
                setSnippets(prev => prev.filter(s => s.id !== id));
            }
            return success;
        } catch (err) {
            setError("Failed to delete snippet");
            throw err;
        }
    };

    useEffect(() => {
        loadSnippets();
    }, []);

    return {
        snippets,
        loading,
        error,
        createSnippet,
        updateSnippet,
        deleteSnippet,
        refreshSnippets: loadSnippets,
    };
};
