import { useStore } from "@tanstack/react-store";
import { Fragment, useContext } from "react";
import { addCategory, store } from "../stores/data-store";
import { AppContext } from "./app-context";

const CategorySelector = () => {
    const {
        language,
        category: selectedCategory,
        setCategory,
    } = useContext(AppContext);
    const categories = useStore(store, (state) => {
        if (!language) return null;

        const l = state[language];
        if (!l) return null;

        return Object.keys(state[language]);
    });

    const onCategoryClick = (category: string) => setCategory(category);

    if (categories === null) return null;

    return (
        <ul className="menu bg-base-300 rounded-box w-96">
            <li>
                <h2 className="menu-title">{language}</h2>
                <ul>
                    {categories.map((category) => (
                        <Category
                            key={category}
                            category={category}
                            selected={category === selectedCategory}
                            onClick={onCategoryClick}
                        />
                    ))}
                </ul>
            </li>
            <NewCategoryButton />
        </ul>
    );
};

interface CategoryProps {
    category: string;
    selected: boolean;
    onClick: (category: string) => void;
}

const Category = ({ category, selected, onClick }: CategoryProps) => {
    const classes = selected
        ? "bg-primary text-primary-content rounded"
        : undefined;

    return (
        <li
            key={category}
            className={classes}
            onClick={() => onClick(category)}
        >
            <a>{category}</a>
        </li>
    );
};

const NewCategoryButton = () => {
    const { language } = useContext(AppContext);

    const modalId = "new-category-modal";
    const formId = "new-category-form";

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
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get("name") as string;
        addCategory(language!, name);
        form.reset();
    };

    return (
        <Fragment>
            <button className="btn mt-2 bg-accent text-accent-content" onClick={openModal}>
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
                Nouvelle catégorie
            </button>

            <dialog id={modalId} className="modal">
                <div className="modal-box">
                    <form id={formId} method="dialog" onSubmit={onSubmit}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">
                                    Nom de la catégorie
                                </span>
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Nom de la catégorie"
                                className="input input-bordered [&:user-invalid]:border-error"
                            />
                        </label>

                        <div className="modal-action mt-4 float-right">
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

export default CategorySelector;
