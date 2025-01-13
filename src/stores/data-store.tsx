import { Store } from "@tanstack/react-store";
import { BaseDirectory } from "@tauri-apps/api/path";
import { create, readFile } from "@tauri-apps/plugin-fs";

const DATA_FILE = "data.json";

export interface Snippet {
    code: string;
    description?: string;
    tags: string[];
}

interface Data {
    [language: string]: {
        [category: string]: {
            [snippet: string]: Snippet;
        };
    };
}

const createDefaultData = async (): Promise<Data> => {
    const data = { javascript: {} } as Data;

    const file = await create(DATA_FILE, { baseDir: BaseDirectory.AppData });
    await file.write(new TextEncoder().encode(JSON.stringify(data)));
    await file.close();
    return data;
};

const initialData: Data = await readFile(DATA_FILE, {
    baseDir: BaseDirectory.AppData,
})
    .then(async (fileContent) => {
        const data = JSON.parse(new TextDecoder().decode(fileContent)) as Data;
        return data;
    })
    .catch(async () => await createDefaultData());

const updateFileContent = async (nextData: Data) => {
    const file = await create(DATA_FILE, { baseDir: BaseDirectory.AppData });
    await file.write(new TextEncoder().encode(JSON.stringify(nextData)));
    await file.close();
};

const store = new Store(initialData, {
    updateFn: (previousState) => {
        return (defaultUpdater) => {
            const nextValues = defaultUpdater(previousState);
            updateFileContent(nextValues);
            return nextValues;
        };
    },
});

// ------- Language functions -------
const addLanguage = (language: string) => {
    store.setState((data) => {
        if (data[language]) {
            return data;
        }

        return { ...data, [language]: {} };
    });
};

const updateLanguageName = (oldLanguage: string, newLanguage: string) => {
    store.setState((data) => {
        const nextData = { ...data };
        nextData[newLanguage] = nextData[oldLanguage];
        delete nextData[oldLanguage];
        return nextData;
    });
};

const removeLanguage = (language: string) => {
    store.setState((data) => {
        const nextData = { ...data };
        delete nextData[language];
        return nextData;
    });
};

// ------- Category functions -------
const addCategory = (language: string, category: string) => {
    store.setState((data) => {
        if (data[language][category]) {
            return data;
        }

        return { ...data, [language]: { ...data[language], [category]: {} } };
    });
};

const updateCategoryName = (
    language: string,
    oldCategory: string,
    newCategory: string
) => {
    store.setState((data) => {
        const nextData = { ...data };
        nextData[language][newCategory] = nextData[language][oldCategory];
        delete nextData[language][oldCategory];
        return nextData;
    });
};

const removeCategory = (language: string, category: string) => {
    store.setState((data) => {
        const nextData = { ...data };
        delete nextData[language][category];
        return nextData;
    });
};

// ------- Snippet functions -------
const addSnippet = (
    language: string,
    category: string,
    name: string,
    snippet: Snippet
) => {
    store.setState((data) => {
        return {
            ...data,
            [language]: {
                ...data[language],
                [category]: {
                    ...data[language][category],
                    [name]: snippet,
                },
            },
        };
    });
};

const updateSnippet = (
    language: string,
    category: string,
    oldName: string,
    newName: string,
    snippet: Snippet
) => {
    store.setState((data) => {
        const nextData = { ...data };
        nextData[language][category][newName] = snippet;
        delete nextData[language][category][oldName];
        return nextData;
    });
};

const removeSnippet = (language: string, category: string, name: string) => {
    store.setState((data) => {
        const nextData = { ...data };
        delete nextData[language][category][name];
        return nextData;
    });
};

export {
    addCategory,
    addLanguage,
    addSnippet,
    removeCategory,
    removeLanguage,
    removeSnippet,
    store,
    updateCategoryName,
    updateLanguageName,
    updateSnippet,
};
