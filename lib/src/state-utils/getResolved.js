import stringifyId from "../core-utils/stringifyId.js";
import getPinned from "./getPinned.js";

/**
 * @template {Dimension} T
 * @param {T[]} elements
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 * @returns {(T & ResolvedDimension)[]}
 */
function getResolved(elements, pinnedBegin, pinnedEnd) {
    return elements.map((element, index) => {
        const id = 'id' in element ? element.id : element.type;
        const selector = 'selector' in element ? element.selector : id;

        return {
            ...element,
            id: id,
            selector: selector,
            type: element.type || "DATA",
            key: stringifyId(id),
            pinned: getPinned(index, elements.length, pinnedBegin, pinnedEnd),
            header: 'header' in element ? element.header : id,
            labels: element.labels || [],
            index: index
        };
    });
}

/**
 * @param {UnfoldedColumn[]} columns
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 * @param {ColumnWidth[]} columnWidths
 * @returns {ResolvedColumn[]}
 */
export function getResolvedColumns(columns, pinnedBegin, pinnedEnd, columnWidths) {
    const widthsLookup = new Map(columnWidths.map(({ columnId, width }) => [stringifyId(columnId), width]));
    const resolvedColumns = getResolved(columns, pinnedBegin, pinnedEnd);

    return resolvedColumns.map(column => ({
        ...column,
        width: widthsLookup.has(column.key)
            ? widthsLookup.get(column.key)
            : 'width' in column
                ? column.width
                : 'fit'
    }));
}

/**
 * @param {UnfoldedRow[]} rows
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 * @param {RowHeight[]} rowHeights
 * @returns {ResolvedRow[]}
 */
export function getResolvedRows(rows, pinnedBegin, pinnedEnd, rowHeights) {
    const heightsLookup = new Map(rowHeights.map(({ rowId, height }) => [stringifyId(rowId), height]));
    const resolvedRows = getResolved(rows, pinnedBegin, pinnedEnd);

    return resolvedRows.map(row => ({
        ...row,
        height: heightsLookup.has(row.key)
            ? heightsLookup.get(row.key)
            : 'height' in row
                ? row.height
                : 'fit'
    }));
}
