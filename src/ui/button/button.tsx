import React, {ButtonHTMLAttributes} from "react";
import css from "./button.module.css";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    inverted?: boolean;
    icon?: React.ReactNode;
};

const Button = ({children, className, variant = "primary", inverted = false, icon, ...rest}: ButtonProps) => {
    const buttonClasses = clsx(css.button, {
        [css.primary]: variant === "primary",
        [css.secondary]: variant === "secondary",
        [css.success]: variant === "success",
        [css.warning]: variant === "warning",
        [css.danger]: variant === "danger",
        [css.inverted]: inverted,
        [css.icon]: icon
    }, className);

    return (
        <button className={buttonClasses} {...rest}>
            {children && !icon && <span className={css["button-text"]}>{children}</span>}
            {icon && <span className={css["button-icon"]}>{icon}</span>}
        </button>
    );
};

export default Button;
