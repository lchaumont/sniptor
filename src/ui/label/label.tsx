import css from "./label.module.css";

type LabelProps = {
    children: React.ReactNode;
};

const Label = ({children}: LabelProps) => {
    return <span className={css["label"]}>{children}</span>;
};

export default Label;
