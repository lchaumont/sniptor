export interface Snippet {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export interface SnippetsData {
    snippets: Snippet[];
}
