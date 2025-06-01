import {appDataDir, BaseDirectory} from "@tauri-apps/api/path";
import {create, exists, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {Snippet, SnippetsData} from "../types/snippet";

const SNIPPETS_FILE = "snippets.json";

export class SnippetStorage {
    private static dataFilePath: string | null = null;

    // Initialize the storage path
    private static async getDataFilePath(): Promise<string> {
        if (!this.dataFilePath) {
            const appDataDirPath = await appDataDir();
            this.dataFilePath = `${appDataDirPath}/${SNIPPETS_FILE}`;
        }
        return this.dataFilePath;
    }

    // Ensure data directory and file exist
    private static async ensureDataFile(): Promise<void> {
        const filePath = await this.getDataFilePath();
        const appDataDirPath = await appDataDir();

        // Create app data directory if it doesn't exist
        if (!(await exists(appDataDirPath))) {
            await create(appDataDirPath, {baseDir: BaseDirectory.AppData});
        }

        // Create snippets file if it doesn't exist
        if (!(await exists(filePath))) {
            const initialData: SnippetsData = {snippets: []};
            await writeTextFile(filePath, JSON.stringify(initialData, null, 2));
        }
    }

    // Read all snippets from storage
    static async loadSnippets(): Promise<Snippet[]> {
        try {
            await this.ensureDataFile();
            const filePath = await this.getDataFilePath();
            const fileContent = await readTextFile(filePath);
            const data: SnippetsData = JSON.parse(fileContent);
            return data.snippets || [];
        } catch (error) {
            console.error("Error loading snippets:", error);
            return [];
        }
    }

    // Save snippets to storage
    static async saveSnippets(snippets: Snippet[]): Promise<void> {
        try {
            await this.ensureDataFile();
            const filePath = await this.getDataFilePath();
            const data: SnippetsData = {snippets};
            await writeTextFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error saving snippets:", error);
            throw error;
        }
    }

    // Create a new snippet
    static async createSnippet(snippet: Omit<Snippet, "id" | "createdAt" | "updatedAt">): Promise<Snippet> {
        const snippets = await this.loadSnippets();
        const now = new Date().toISOString();

        const newSnippet: Snippet = {
            ...snippet,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        };

        snippets.push(newSnippet);
        await this.saveSnippets(snippets);
        return newSnippet;
    }

    // Update an existing snippet
    static async updateSnippet(id: string, updates: Partial<Omit<Snippet, "id" | "createdAt" | "updatedAt">>): Promise<Snippet | null> {
        const snippets = await this.loadSnippets();
        const index = snippets.findIndex(s => s.id === id);

        if (index === -1) {
            return null;
        }

        const updatedSnippet: Snippet = {
            ...snippets[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        snippets[index] = updatedSnippet;
        await this.saveSnippets(snippets);
        return updatedSnippet;
    }

    // Delete a snippet
    static async deleteSnippet(id: string): Promise<boolean> {
        const snippets = await this.loadSnippets();
        const filteredSnippets = snippets.filter(s => s.id !== id);

        if (filteredSnippets.length === snippets.length) {
            return false; // Snippet not found
        }

        await this.saveSnippets(filteredSnippets);
        return true;
    }

    // Get snippets by category
    static async getSnippetsByCategory(category: string): Promise<Snippet[]> {
        const snippets = await this.loadSnippets();
        return snippets.filter(s => s.category === category);
    }

    // Get all categories
    static async getCategories(): Promise<string[]> {
        const snippets = await this.loadSnippets();
        const categories = new Set(snippets.map(s => s.category));
        return Array.from(categories).sort();
    }
}
