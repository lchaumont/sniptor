import Sidebar from "./components/sidebar/sidebar";
import {SnippetContextProvider} from "./components/snippet-context/snippet-context";
import SnippetMain from "./components/snippet-main/snippet-main";

const App = () => {
    return (
        <SnippetContextProvider>
            <div className="app">
                <Sidebar />
                <main>
                    <SnippetMain />
                </main>
            </div>
        </SnippetContextProvider>
    );
};

export default App;
