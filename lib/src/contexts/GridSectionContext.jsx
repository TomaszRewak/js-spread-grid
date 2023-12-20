import { createContext, useContext, useMemo } from "react";
import { useColumns, useFixedSize, usePinned, useRows } from "./StateContext";
import { useScrollRect } from "./ScrollRectContext";

const GridSectionContext = createContext();

export function GridSectionProvider({ children, horizontal, vertical }) {
    const scrollRect = useScrollRect();
    const columns = useColumns();
    const rows = useRows();
    const pinned = usePinned();
    const fixedSize = useFixedSize();

    const sectionColumns = useMemo(() => {
        if (horizontal === 'left')
            return columns.slice(0, pinned.left);
        if (horizontal === 'middle')
            return columns.slice(pinned.left, columns.length - pinned.right);
        if (horizontal === 'right')
            return columns.slice(columns.length - pinned.right, columns.length);
    }, [columns, horizontal, pinned]);

    const sectionRows = useMemo(() => {
        if (vertical === 'top')
            return rows.slice(0, pinned.top);
        if (vertical === 'middle')
            return rows.slice(pinned.top, rows.length - pinned.bottom);
        if (vertical === 'bottom')
            return rows.slice(rows.length - pinned.bottom, rows.length);
    }, [rows, vertical, pinned]);

    const sectionTopOffset = useMemo(() => {
        if (vertical === 'top')
            return 0;
        if (vertical === 'middle')
            return scrollRect.top;
        if (vertical === 'bottom')
            return 0;
    }, [vertical, scrollRect]);

    const sectionLeftOffset = useMemo(() => {
        if (horizontal === 'left')
            return 0;
        if (horizontal === 'middle')
            return scrollRect.left;
        if (horizontal === 'right')
            return 0;
    }, [horizontal, scrollRect]);

    const sectionWidth = useMemo(() => {
        if (horizontal === 'left')
            return fixedSize.left;
        if (horizontal === 'middle')
            return scrollRect.width;
        if (horizontal === 'right')
            return fixedSize.right;
    }, [horizontal, scrollRect, fixedSize]);

    const sectionHeight = useMemo(() => {
        if (vertical === 'top')
            return fixedSize.top;
        if (vertical === 'middle')
            return scrollRect.height;
        if (vertical === 'bottom')
            return fixedSize.bottom;
    }, [vertical, scrollRect, fixedSize]);

    const sectionRect = useMemo(() => ({
        left: sectionLeftOffset,
        top: sectionTopOffset,
        width: sectionWidth,
        height: sectionHeight
    }), [sectionLeftOffset, sectionTopOffset, sectionWidth, sectionHeight]);

    const value = useMemo(() => ({
        columns: sectionColumns,
        rows: sectionRows,
        rect: sectionRect
    }), [sectionColumns, sectionRows, sectionRect]);

    if (sectionColumns.length === 0 || sectionRows.length === 0)
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