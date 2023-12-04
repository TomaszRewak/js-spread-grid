import { useEffect } from "react";

export function useInteractions(element) {
    useEffect(() => {
        if (!element)
            return () => { };

        function onClick(event) {
            clientX = event.clientX;
            clientY = event.clientY;


        }

        element.addEventListener("click", onClick);

        return () => {
            element.removeEventListener("click", onClick);
        }
    }, [element]);
}