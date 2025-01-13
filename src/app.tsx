import { useEffect } from "react";
import { themeChange } from "theme-change";
import { AppContextProvider } from "./components/app-context";
import CategorySelector from "./components/category-selector";
import LanguageSelector from "./components/language-selector";
import SnippetList from "./components/snippet-list";

const App = () => {
    useEffect(() => {
        themeChange(false);
    }, []);

    return (
        <AppContextProvider>
            <div className="container mx-auto my-12">
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-4 min-w-96">
                        <LanguageSelector />
                        <CategorySelector />
                    </div>
                    <div className="flex-1">
                        <SnippetList />
                    </div>
                </div>
            </div>

            <div id="modal-root" />
        </AppContextProvider>
    );
};

export default App;
