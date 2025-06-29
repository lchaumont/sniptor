import clsx from "clsx";
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

    const classNames = clsx(css["snippet-item"], isSelected && css.selected);

    return (
        <div ref={hoverRef} className={classNames} onClick={onSnippetClick}>
            <span>{title}</span>

            {isHover && (
                <div className={css["snippet-actions"]}>
                    <Button onClick={onEditClick} variant="secondary" inverted icon={<EditIcon />} />
                    <Button onClick={onDeleteClick} variant="danger" inverted icon={<TrashIcon />} />
                </div>
            )}
        </div>
    );
};

export default SnippetItem;
