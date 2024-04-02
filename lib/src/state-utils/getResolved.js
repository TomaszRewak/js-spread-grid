import stringifyId from "../core-utils/stringifyId.js";
import getPinned from "./getPinned.js";

function getResolved(elements, pinnedBegin, pinnedEnd) {
    return elements.map((element, index) => {
        const id = 'id' in element ? element.id : element.type;
        return {
            ...element,
            id: id,
            type: element.type || "DATA",
            index: index,
            key: stringifyId(id),
            pinned: getPinned(index, elements.length, pinnedBegin, pinnedEnd),
            header: element.header || id
        };
    });
}

export function getResolvedColumns(columns, pinnedBegin, pinnedEnd, columnWidths) {
    const widthsLookup = new Map(columnWidths.map(({ columnId, width }) => [stringifyId(columnId), width]));
    const resolvedColumns = getResolved(columns, pinnedBegin, pinnedEnd);

    return resolvedColumns.map(column => ({
        ...column,
        width: widthsLookup.has(column.key)
            ? widthsLookup.get(column.key)
            : column.width
    }));
}

export function getResolvedRows(rows, pinnedBegin, pinnedEnd, rowHeights) {
    const heightsLookup = new Map(rowHeights.map(({ rowId, height }) => [stringifyId(rowId), height]));
    const resolvedRows = getResolved(rows, pinnedBegin, pinnedEnd);

    return resolvedRows.map(row => ({
        ...row,
        height: heightsLookup.has(row.key)
            ? heightsLookup.get(row.key)
            : row.height
    }));
}
