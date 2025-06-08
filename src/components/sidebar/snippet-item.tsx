import {useRef} from "react";
import {useHover} from "usehooks-ts";
import EditIcon from "../../assets/svg/edit.svg?react";
import TrashIcon from "../../assets/svg/trash.svg?react";
import Button from "../../ui/button/button";
import css from "./sidebar.module.css";

type SnippetItemProps = {
    title: string;
    isSelected: boolean;
    onRowClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
};

const SnippetItem = ({title, isSelected, onRowClick: onSnippetClick, onEditClick, onDeleteClick}: SnippetItemProps) => {
    const hoverRef = useRef<HTMLDivElement>(null);
    const isHover = useHover(hoverRef);

    return (
        <div ref={hoverRef} className={`${css["snippet-item"]} ${isSelected ? css["selected"] : ""}`} onClick={onSnippetClick}>
            <span>{title}</span>

            {isHover && (
                <div className={css["snippet-actions"]}>
                    <Button onClick={onEditClick} className={css["snippet-action-button"]} icon={<EditIcon color="blue" />} />
                    <Button onClick={onDeleteClick} className={css["snippet-action-button"]} icon={<TrashIcon color="red" />} />
                </div>
            )}
        </div>
    );
};

export default SnippetItem;
