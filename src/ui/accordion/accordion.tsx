/// <reference types="vite-plugin-svgr/client" />

import {useRef, useState} from "react";
import css from "./accordion.module.css";
import Chevron from "./chevron.svg?react";

type AccordionProps = {
    title: string;
    children: React.ReactNode;
};

const Accordion = ({title, children}: AccordionProps) => {
    const contentHeight = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toogle = () => setIsOpen(current => !current);

    const chevronClass = isOpen ? `${css["chevron-icon"]} ${css["active"]}` : css["chevron-icon"];

    return (
        <div className={css["accordion-container"]}>
            <div className={css["accordion-trigger"]} onClick={toogle}>
                <Chevron className={chevronClass} />
                {title}
            </div>
            <div ref={contentHeight} className={css["accordion-content"]} style={isOpen && contentHeight.current ? {height: contentHeight.current.scrollHeight} : {height: "0px"}}>
                {children}
            </div>
        </div>
    );
};

export default Accordion;
