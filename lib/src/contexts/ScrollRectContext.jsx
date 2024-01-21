import { createContext, useContext } from "react";
import { useFixedSize, useTotalSize } from "./StateContext";
import { useScrollOffset, useSize } from "./SizeAndScrollContext";
import useRefMemo from "../hooks/useRefMemo";
import { area, clip, contains, expand, subtract } from "../utils/rect";

const ScrollRectContext = createContext();

const requiredMargin = 200;
const preloadedMargin = 400;
const emptyRect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
};

export function ScrollRectProvider({ children }) {
    const totalSize = useTotalSize();
    const fixedSize = useFixedSize();
    const size = useSize();
    const scrollOffset = useScrollOffset();

    const value = useRefMemo(previous => {
        const prevScrollRect = previous || emptyRect;

        const totalRect = { left: 0, top: 0, ...totalSize };
        const bounds = subtract(totalRect, fixedSize);
        const scrollRect = subtract({ ...scrollOffset, ...size }, fixedSize);
        const requiredScrollRect = clip(bounds, expand(scrollRect, requiredMargin));
        const preloadedScrollRect = clip(bounds, expand(scrollRect, preloadedMargin));

        if (!contains(bounds, prevScrollRect))
            return preloadedScrollRect;

        if (!contains(prevScrollRect, requiredScrollRect))
            return preloadedScrollRect;

        if (area(prevScrollRect) > 2 * area(preloadedScrollRect))
            return preloadedScrollRect;

        return prevScrollRect;
    }, [fixedSize, size, scrollOffset]);

    return (
        <ScrollRectContext.Provider value={value}>
            {children}
        </ScrollRectContext.Provider>
    )
}

export const useScrollRect = () => useContext(ScrollRectContext);