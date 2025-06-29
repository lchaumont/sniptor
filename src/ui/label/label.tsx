import css from "./label.module.css";
import clsx from "clsx";
import {HTMLAttributes} from "react";

type LabelProps = HTMLAttributes<HTMLSpanElement> & {
    variant?: "primary" | "secondary";
};

const Label = ({children, className, variant = "primary"}: LabelProps) => {
    const labelClasses = clsx(css.label, {
        [css.primary]: variant === "primary",
        [css.secondary]: variant === "secondary",
    }, className);

    return <span className={labelClasses}>{children}</span>;
};

export default Label;
