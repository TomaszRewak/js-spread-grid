/* eslint-disable react-hooks/exhaustive-deps */

import { useMemo } from "react";

export default function useInvoked(expression, args) {
    return useMemo(() => {
        if (typeof expression === 'function')
            return expression(...args);

        return expression;
    }, [expression, ...args]);
}