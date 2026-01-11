import stringifyId from "../core-utils/stringifyId.js";
import getPinned from "./getPinned.js";

/**
 * @template {Dimension} T
 * @param {T} element
 * @param {number} index
 * @param {number} elementsLength
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 * @returns {T & ResolvedDimension}
 */
function getResolved(element, index, elementsLength, pinnedBegin, pinnedEnd) {
    const id = 'id' in element ? element.id : element.type;
    const selector = 'selector' in element ? element.selector : id;

    return {
        ...element,
        id: id,
        selector: selector,
        type: element.type || "DATA",
        key: stringifyId(id),
        pinned: getPinned(index, elementsLength, pinnedBegin, pinnedEnd),
        header: 'header' in element ? element.header : id,
        labels: element.labels || [],
        index: index
    };
}

/**
 * @param {UnfoldedColumn[]} columns
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 * @param {ColumnWidth[]} columnWidths
 * @param {number} borderWidth
 * @returns {ResolvedColumn[]}
 */
export function getResolvedColumns(columns, pinnedBegin, pinnedEnd, columnWidths, borderWidth) {
    const widthsLookup = new Map(columnWidths.map(({ columnId, width }) => [stringifyId(columnId), width]));

    return columns.map((column, index) => {
        if (column.type === 'DYNAMIC-BLOCK') {
            const resolved = getResolved(column, index, columns.length, pinnedBegin, pinnedEnd);
            return {
                ...resolved,
                width: column.width * column.count + borderWidth * (column.count - 1),
                count: column.count,
                rowWidth: column.width
            };
        } else {
            const resolved = getResolved(column, index, columns.length, pinnedBegin, pinnedEnd);
            return {
                ...resolved,
                width: widthsLookup.has(resolved.key)
                    ? widthsLookup.get(resolved.key)
                    : 'width' in column
                        ? column.width
                        : 'fit'
            };
        }
    });
}

/**
 * @param {UnfoldedRow[]} rows
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 * @param {RowHeight[]} rowHeights
 * @param {number} borderWidth
 * @returns {ResolvedRow[]}
 */
export function getResolvedRows(rows, pinnedBegin, pinnedEnd, rowHeights, borderWidth) {
    const heightsLookup = new Map(rowHeights.map(({ rowId, height }) => [stringifyId(rowId), height]));

    return rows.map((row, index) => {
        if (row.type === 'DYNAMIC-BLOCK') {
            const resolved = getResolved(row, index, rows.length, pinnedBegin, pinnedEnd);
            return {
                ...resolved,
                height: row.height * row.count + borderWidth * (row.count - 1),
                count: row.count,
                rowHeight: row.height
            };
        } else {
            const resolved = getResolved(row, index, rows.length, pinnedBegin, pinnedEnd);
            return {
                ...resolved,
                height: heightsLookup.has(resolved.key)
                    ? heightsLookup.get(resolved.key)
                    : 'height' in row
                        ? row.height
                        : 'fit'
            };
        }
    });
}
