import React, {ButtonHTMLAttributes} from "react";
import css from "./button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: React.ReactNode;
};

const Button = ({children, className, icon, ...rest}: ButtonProps) => {
    const buttonClass = className ? `${css["button"]} ${className}` : css["button"];

    return (
        <button className={buttonClass} {...rest}>
            {children && !icon && <span className={css["button-text"]}>{children}</span>}
            {icon && <span className={css["button-icon"]}>{icon}</span>}
        </button>
    );
};

export default Button;
