import { useMemo } from "react";

export default function useResolvedColumns(columns, data) {
    const columnDefinitions = useMemo(() => {
        if (typeof columns === 'function')
            return columns(data);

        return columns;
    }, [columns, data]);

    
}