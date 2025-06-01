import {ButtonHTMLAttributes} from "react";
import css from "./button.module.css";

const Button = ({children, className, ...rest}: ButtonHTMLAttributes<HTMLButtonElement>) => {
    const buttonClass = className ? `${css["button"]} ${className}` : css["button"];

    return (
        <button className={buttonClass} {...rest}>
            {children}
        </button>
    );
};

export default Button;
