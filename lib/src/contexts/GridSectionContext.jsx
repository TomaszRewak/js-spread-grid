import { createContext, useContext, useMemo } from "react";
import { useSections } from "./StateContext";
import { useScrollRect } from "./ScrollRectContext";

const GridSectionContext = createContext();

export function GridSectionProvider({ children, horizontal, vertical }) {
    const scrollRect = useScrollRect();
    const sections = useSections();

    const { rows, height, showTopBorder, showBottomBorder } = sections[vertical];
    const { columns, width, showLeftBorder, showRightBorder } = sections[horizontal];

    const top = vertical === 'middle'
        ? scrollRect.top
        : 0;
    const left = horizontal === 'center'
        ? scrollRect.left
        : 0;

    const actualHeight = vertical === 'middle'
        ? scrollRect.height
        : height;
    const actualWidth = horizontal === 'center'
        ? scrollRect.width
        : width;

    const sectionRect = useMemo(() => ({
        left: left,
        top: top,
        width: actualWidth,
        height: actualHeight
    }), [left, top, actualWidth, actualHeight]);

    const sectionBorders = useMemo(() => ({
        top: showTopBorder,
        bottom: showBottomBorder,
        left: showLeftBorder,
        right: showRightBorder
    }), [showTopBorder, showBottomBorder, showLeftBorder, showRightBorder]);

    const value = useMemo(() => ({
        columns: columns,
        rows: rows,
        rect: sectionRect,
        borders: sectionBorders
    }), [columns, rows, sectionRect, sectionBorders]);

    if (columns.length === 0 || rows.length === 0)
        return null;

    return (
        <GridSectionContext.Provider value={value}>
            {children}
        </GridSectionContext.Provider>
    );
}

export const useSectionColumns = () => useContext(GridSectionContext).columns;
export const useSectionRows = () => useContext(GridSectionContext).rows;
export const useSectionRect = () => useContext(GridSectionContext).rect;
export const useSectionBorders = () => useContext(GridSectionContext).borders;
