import { useStore } from "@tanstack/react-store";
import { langNames } from "@uiw/codemirror-extensions-langs";
import { Fragment, useContext } from "react";
import { addLanguage, store } from "../stores/data-store";
import { AppContext } from "./app-context";

const LanguageSelector = () => {
    const languages = useStore(store, (state) => Object.keys(state));
    const { language, setLanguage } = useContext(AppContext);

    return (
        <Fragment>
            <div className="flex flex-row gap-2">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="select select-bordered w-full p-2"
                >
                    {languages.map((language) => (
                        <option key={language} value={language}>
                            {language}
                        </option>
                    ))}
                </select>
                <NewLanguageButton />
            </div>
        </Fragment>
    );
};

const NewLanguageButton = () => {
    const modalId = "new-language-modal";
    const formId = "new-language-form";

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
        addLanguage(name);
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
                Nouveau
            </button>

            <dialog id={modalId} className="modal">
                <div className="modal-box">
                    <form id={formId} method="dialog" onSubmit={onSubmit}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">
                                    Nom du langage
                                </span>
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                list="languages-list"
                                placeholder="Nom du langage"
                                className="input input-bordered [&:user-invalid]:border-error"
                            />

                            <datalist id="languages-list">
                                {langNames.map((lang) => (
                                    <option key={lang} value={lang} />
                                ))}
                            </datalist>
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

export default LanguageSelector;
