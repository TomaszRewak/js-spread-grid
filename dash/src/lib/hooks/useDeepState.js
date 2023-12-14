import { useMemo, useState } from "react";

export default function useDeepState(initialState, comparator) {
    const [state, setState] = useState(initialState);

    const setDeepState = useMemo(() => {
        if (!comparator)
            return setState;

        return (newState) => {
            setState(oldState => {
                if (comparator(oldState, newState))
                    return oldState;

                return newState;
            });
        };
    }, [setState, comparator]);

    return [state, setDeepState];
}