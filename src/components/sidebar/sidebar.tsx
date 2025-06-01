import {useRef} from "react";
import {useSnippets} from "../../hooks/useSnippets";
import Accordion from "../../ui/accordion/accordion";
import Button from "../../ui/button/button";
import {useSelectedSnippet} from "../snippet-context/snippet-context";
import css from "./sidebar.module.css";

const Sidebar = () => {
    const {snippets, createSnippet} = useSnippets();
    const {selectedSnippet, selectSnippetById} = useSelectedSnippet();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const groupByCategories = snippets.reduce(
        (categories, snippet) => {
            const {category, title, id} = snippet;
            if (!categories[category]) categories[category] = [];
            categories[category].push({title, id});
            return categories;
        },
        {} as Record<string, Array<{title: string; id: string}>>
    );

    const existingCategories = Object.keys(groupByCategories);

    const handleSnippetClick = (id: string) => selectSnippetById(id, snippets);

    const openAddDialog = () => dialogRef.current?.showModal();
    const closeAddDialog = () => dialogRef.current?.close();
    const onDialogClose = () => (document.getElementById("add-snippet-form") as HTMLFormElement).reset();

    const handleAddSnippet = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title") as string;
        const category = formData.get("category") as string;

        createSnippet({title, category, content: ""})
            .then(newSnippet => {
                selectSnippetById(newSnippet.id, [...snippets, newSnippet]);
                closeAddDialog();
            })
            .catch(error => {
                console.error("Error adding snippet:", error);
            });
    };

    return (
        <div className={css["container"]}>
            {Object.entries(groupByCategories).map(([category, snippetItems]) => {
                return (
                    <Accordion key={category} title={category}>
                        {snippetItems.map(({title, id}) => {
                            const isSelected = selectedSnippet?.id === id;
                            return (
                                <div key={id} className={`${css["snippet-item"]} ${isSelected ? css["selected"] : ""}`} onClick={() => handleSnippetClick(id)}>
                                    {title}
                                </div>
                            );
                        })}
                    </Accordion>
                );
            })}

            <Button onClick={openAddDialog} className={css["add-snippet-button"]}>
                Add Snippet
            </Button>

            <dialog ref={dialogRef} className={css["add-dialog"]} onClose={onDialogClose}>
                <form id="add-snippet-form" onSubmit={handleAddSnippet} className={css["add-form"]} method="dialog">
                    <h4 className={css["dialog-title"]}>Add New Snippet</h4>

                    <div className={css["form-fields"]}>
                        <div className={css["form-field"]}>
                            <label className={css["form-label"]}>Title:</label>
                            <input type="text" name="title" placeholder="Enter snippet title" className={css["form-input"]} autoFocus required />
                        </div>

                        <div className={css["form-field"]}>
                            <label className={css["form-label"]}>Category:</label>
                            <input type="text" name="category" placeholder="Enter category" className={css["form-input"]} list="categories-list" required />
                            <datalist id="categories-list">
                                {existingCategories.map(category => (
                                    <option key={category} value={category} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className={css["form-actions"]}>
                        <Button type="button" onClick={closeAddDialog}>
                            Cancel
                        </Button>
                        <Button type="submit">Confirm</Button>
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default Sidebar;
