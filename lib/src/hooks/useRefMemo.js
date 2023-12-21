import { useMemo, useRef } from "react";

export default function useRefMemo(factory, deps)
{
    const ref = useRef(undefined);

    return useMemo(() => {
        ref.current = factory(ref.current);
        return ref.current;
    }, deps);
}