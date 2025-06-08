import {useRef, useState} from "react";
import Accordion from "../../ui/accordion/accordion";
import Button from "../../ui/button/button";
import {useSnippetContext} from "../snippet-context/snippet-context";
import css from "./sidebar.module.css";
import SnippetItem from "./snippet-item";

const Sidebar = () => {
    const {selectedSnippet, snippets, clearSelectedSnippet, setSelectedSnippet, createSnippet, updateSnippet, deleteSnippet} = useSnippetContext();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const editDialogRef = useRef<HTMLDialogElement>(null);
    const deleteDialogRef = useRef<HTMLDialogElement>(null);
    const [editingSnippet, setEditingSnippet] = useState<{id: string; title: string; category: string} | null>(null);
    const [deletingSnippet, setDeletingSnippet] = useState<{id: string; title: string} | null>(null);

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

    const handleSnippetClick = (id: string) => setSelectedSnippet(id);

    // Add snippet handlers
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
                setSelectedSnippet(newSnippet.id);
                closeAddDialog();
            })
            .catch(error => {
                console.error("Error adding snippet:", error);
            });
    };

    // Edit snippet handlers
    const handleEditClick = (id: string) => {
        const snippet = snippets.find(s => s.id === id);
        if (snippet) {
            setEditingSnippet({id: snippet.id, title: snippet.title, category: snippet.category});
            editDialogRef.current?.showModal();
        }
    };

    const closeEditDialog = () => {
        editDialogRef.current?.close();
        setEditingSnippet(null);
    };

    const handleEditSnippet = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingSnippet) return;

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title") as string;
        const category = formData.get("category") as string;

        try {
            const updatedSnippet = await updateSnippet(editingSnippet.id, {title, category});
            if (updatedSnippet) {
                // Update selected snippet if it's the one being edited
                setSelectedSnippet(updatedSnippet.id);
                closeEditDialog();
            }
        } catch (error) {
            console.error("Error updating snippet:", error);
        }
    };

    // Delete snippet handlers
    const handleDeleteClick = (id: string) => {
        const snippet = snippets.find(s => s.id === id);
        if (snippet) {
            setDeletingSnippet({id: snippet.id, title: snippet.title});
            deleteDialogRef.current?.showModal();
        }
    };

    const closeDeleteDialog = () => {
        deleteDialogRef.current?.close();
        setDeletingSnippet(null);
    };

    const handleDeleteSnippet = async () => {
        if (!deletingSnippet) return;

        try {
            const success = await deleteSnippet(deletingSnippet.id);
            if (success) {
                // Clear selection if deleted snippet was selected
                if (selectedSnippet?.id === deletingSnippet.id) {
                    clearSelectedSnippet();
                }
                closeDeleteDialog();
            }
        } catch (error) {
            console.error("Error deleting snippet:", error);
        }
    };

    return (
        <div className={css["container"]}>
            {Object.entries(groupByCategories).map(([category, snippetItems]) => {
                return (
                    <Accordion key={category} title={category}>
                        {snippetItems.map(({title, id}) => (
                            <SnippetItem
                                key={id}
                                title={title}
                                isSelected={selectedSnippet?.id === id}
                                onRowClick={() => handleSnippetClick(id)}
                                onEditClick={() => handleEditClick(id)}
                                onDeleteClick={() => handleDeleteClick(id)}
                            />
                        ))}
                    </Accordion>
                );
            })}

            <Button onClick={openAddDialog} className={css["add-snippet-button"]}>
                Add Snippet
            </Button>

            {/* Add Snippet Dialog */}
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

            {/* Edit Snippet Dialog */}
            <dialog ref={editDialogRef} className={css["edit-dialog"]}>
                <form onSubmit={handleEditSnippet} className={css["edit-form"]} method="dialog">
                    <h4 className={css["dialog-title"]}>Edit Snippet</h4>

                    <div className={css["form-fields"]}>
                        <div className={css["form-field"]}>
                            <label className={css["form-label"]}>Title:</label>
                            <input type="text" name="title" defaultValue={editingSnippet?.title || ""} placeholder="Enter snippet title" className={css["form-input"]} autoFocus required />
                        </div>

                        <div className={css["form-field"]}>
                            <label className={css["form-label"]}>Category:</label>
                            <input
                                type="text"
                                name="category"
                                defaultValue={editingSnippet?.category || ""}
                                placeholder="Enter category"
                                className={css["form-input"]}
                                list="categories-list-edit"
                                required
                            />
                            <datalist id="categories-list-edit">
                                {existingCategories.map(category => (
                                    <option key={category} value={category} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className={css["form-actions"]}>
                        <Button type="button" onClick={closeEditDialog}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </dialog>

            {/* Delete Confirmation Dialog */}
            <dialog ref={deleteDialogRef} className={css["delete-dialog"]}>
                <div className={css["delete-content"]}>
                    <h4 className={css["dialog-title"]}>Delete Snippet</h4>
                    <p className={css["delete-message"]}>Are you sure you want to delete "{deletingSnippet?.title}"? This action cannot be undone.</p>
                    <div className={css["form-actions"]}>
                        <Button type="button" onClick={closeDeleteDialog}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleDeleteSnippet} className={css["delete-button"]}>
                            Delete
                        </Button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Sidebar;
