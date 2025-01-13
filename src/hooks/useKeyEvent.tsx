import { useCallback, useEffect } from "react";

export const useKeyEvent = (
    code: string,
    onKeyEvent: (event: KeyboardEvent) => void,
    deps: React.DependencyList = []
) => {
    onKeyEvent = useCallback(onKeyEvent, deps);

    useEffect(() => {
        const pressKey = (event: KeyboardEvent) => {
            if (event.code === code) {
                onKeyEvent(event);
            }
        };

        document.addEventListener("keydown", pressKey);

        return () => {
            document.removeEventListener("keydown", pressKey);
        };
    }, [code, onKeyEvent]);
};
