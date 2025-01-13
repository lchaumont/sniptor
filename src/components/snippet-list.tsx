import { useStore } from "@tanstack/react-store";
import { AnimatePresence } from "motion/react";
import { Fragment, useContext, useState } from "react";
import { addSnippet, Snippet, store } from "../stores/data-store";
import { AppContext } from "./app-context";
import Editor from "./editor";
import SnippetCard from "./snippet-card";
import SnippetModal from "./snippet-modal";
import Tag from "./tag";
import ThemeSelector from "./theme-selector";

const SnippetList = () => {
    const { language, category } = useContext(AppContext);

    if (!language || !category) return null;

    return <SnippetListInner language={language} category={category} />;
};

type SnippetListInnerProps = {
    language: string;
    category: string;
};

const SnippetListInner = ({ language, category }: SnippetListInnerProps) => {
    const snippets = useStore(store, (state) => state[language][category]);
    const { snippet, setSnippet } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    const handleOpenModal = (
        clickedSnippet: {
            name: string;
        } & Snippet
    ) => {
        setIsModalOpen(true);
        setSnippet(clickedSnippet);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSnippet(undefined);
    };

    return (
        <Fragment>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <h4 className="text-2xl font-bold">{category}</h4>
                    <div className="flex flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="input input-bordered"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <NewSnippetButton
                            language={language}
                            category={category}
                        />

                        <ThemeSelector />
                    </div>
                </div>
                <div className="flex flex-row gap-4 [&>.card]:w-1/4">
                    {Object.entries(snippets)
                        .filter(([name, snippet]) => {
                            if (!search) return true;
                            return (
                                name.includes(search) ||
                                snippet.tags.find((tag) => tag.includes(search))
                            );
                        })
                        .map(([name, snippet]) => (
                            <SnippetCard
                                key={name}
                                snippet={{ name, ...snippet }}
                                onClick={() =>
                                    handleOpenModal({ name, ...snippet })
                                }
                            />
                        ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isModalOpen && snippet && (
                    <SnippetModal
                        snippet={snippet}
                        handleCloseModal={handleCloseModal}
                        language={language}
                    />
                )}
            </AnimatePresence>
        </Fragment>
    );
};

type SnippetListProps = {
    language: string;
    category: string;
};

const NewSnippetButton = ({ language, category }: SnippetListProps) => {
    const modalId = "new-snippet-modal";
    const formId = "new-snippet-form";

    const [tags, setTags] = useState<string[]>([]);

    const addTag = () => {
        const input = document.getElementById(
            "new-tag-input"
        ) as HTMLInputElement | null;
        if (!input) return;

        const tag = input.value;
        if (tags.includes(tag)) return;
        setTags([...tags, tag]);

        input.value = "";
    };

    const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

    const openModal = () => {
        const modal = document.getElementById(
            modalId
        ) as HTMLDialogElement | null;
        modal?.showModal();
    };

    const closeModal = () => {
        const modal = document.getElementById(
            modalId
        ) as HTMLDialogElement | null;
        modal?.close();

        const form = document.getElementById(formId) as HTMLFormElement | null;
        form?.reset();
        setTags([]);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const code = formData.get("code") as string;
        const description = formData.get("description") as string;
        const tags = formData.getAll("tags") as string[];

        addSnippet(language, category, name, { code, description, tags });
        form.reset();
        setTags([]);
    };

    const onCodeChange = (code: string) => {
        const input = document.getElementById("code-input") as HTMLInputElement;
        input.value = code;
    };

    return (
        <Fragment>
            <button
                className="btn bg-accent text-accent-content"
                onClick={openModal}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                Nouveau snippet
            </button>

            <dialog id={modalId} className="modal">
                <div className="modal-box max-w-5xl">
                    <form id={formId} method="dialog" onSubmit={onSubmit}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">
                                    Nom du snippet
                                </span>
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Nom du snippet"
                                className="input input-bordered [&:user-invalid]:border-error"
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Code</span>
                            </div>
                            <input
                                id="code-input"
                                type="hidden"
                                name="code"
                                required
                                placeholder="code"
                            />
                            <Editor value="" onChange={onCodeChange} />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Description</span>
                            </div>
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                className="input input-bordered [&:user-invalid]:border-error"
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Tags</span>
                            </div>

                            <div className="flex flex-row gap-2 flex-wrap">
                                {tags.map((tag) => (
                                    <Fragment key={tag}>
                                        <input
                                            type="hidden"
                                            name="tags"
                                            value={tag}
                                        />

                                        <Tag
                                            name={tag}
                                            onRemove={() => removeTag(tag)}
                                        />
                                    </Fragment>
                                ))}
                            </div>

                            <div className="flex flex-row gap-2 mt-2">
                                <input
                                    id="new-tag-input"
                                    type="text"
                                    placeholder="Nouveau tag"
                                    className="input input-bordered flex-1"
                                />
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={addTag}
                                >
                                    Valider
                                </button>
                            </div>
                        </label>

                        <div className="divider" />

                        <div className="modal-action float-right mt-0">
                            <button
                                type="button"
                                className="btn"
                                onClick={closeModal}
                            >
                                Annuler
                            </button>
                            <button type="submit" className="btn btn-accent">
                                Valider
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </Fragment>
    );
};

export default SnippetList;
