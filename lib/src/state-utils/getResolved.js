import stringifyId from "../core-utils/stringifyId.js";
import getPinned from "./getPinned.js";
import roundToPixels from "../core-utils/roundToPixels.js";

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
    const type = element.type || "DATA";

    return {
        ...element,
        id: id,
        selector: selector,
        type: type,
        key: stringifyId(id),
        pinned: getPinned(index, elementsLength, pinnedBegin, pinnedEnd, type),
        header: 'header' in element ? element.header : id,
        labels: element.labels || [],
        index: index
    };
}

/**
 * @param {number | FittingType} value
 * @param {number} devicePixelRatio
 * @returns {number | FittingType}
 */
function roundToPixelsIfNumber(value, devicePixelRatio) {
    return typeof value === 'number' ? roundToPixels(value, devicePixelRatio) : value;
}

/**
 * @param {UnfoldedColumn[]} columns
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 * @param {ColumnWidth[]} columnWidths
 * @param {number} borderWidth
 * @param {number} devicePixelRatio
 * @returns {ResolvedColumn[]}
 */
export function getResolvedColumns(columns, pinnedBegin, pinnedEnd, columnWidths, borderWidth, devicePixelRatio) {
    const widthsLookup = new Map(columnWidths.map(({ columnId, width }) => [stringifyId(columnId), width]));

    return columns.map((column, index) => {
        if (column.type === 'DYNAMIC-BLOCK') {
            const resolved = getResolved(column, index, columns.length, pinnedBegin, pinnedEnd);
            const width = column.width * column.count + borderWidth * (column.count - 1);
            return {
                ...resolved,
                count: column.count,
                width: roundToPixels(width, devicePixelRatio),
                rowWidth: roundToPixels(column.width, devicePixelRatio)
            };
        } else {
            const resolved = getResolved(column, index, columns.length, pinnedBegin, pinnedEnd);
            const width = widthsLookup.has(resolved.key)
                ? widthsLookup.get(resolved.key)
                : 'width' in column
                    ? column.width
                    : 'fit';
            return {
                ...resolved,
                width: roundToPixelsIfNumber(width, devicePixelRatio)
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
 * @param {number} devicePixelRatio
 * @returns {ResolvedRow[]}
 */
export function getResolvedRows(rows, pinnedBegin, pinnedEnd, rowHeights, borderWidth, devicePixelRatio) {
    const heightsLookup = new Map(rowHeights.map(({ rowId, height }) => [stringifyId(rowId), height]));

    return rows.map((row, index) => {
        if (row.type === 'DYNAMIC-BLOCK') {
            const resolved = getResolved(row, index, rows.length, pinnedBegin, pinnedEnd);
            const height = row.height * row.count + borderWidth * (row.count - 1);
            return {
                ...resolved,
                count: row.count,
                height: roundToPixels(height, devicePixelRatio),
                rowHeight: roundToPixels(row.height, devicePixelRatio)
            };
        } else {
            const resolved = getResolved(row, index, rows.length, pinnedBegin, pinnedEnd);
            const height = heightsLookup.has(resolved.key)
                ? heightsLookup.get(resolved.key)
                : 'height' in row
                    ? row.height
                    : 'fit';
            return {
                ...resolved,
                height: roundToPixelsIfNumber(height, devicePixelRatio)
            };
        }
    });
}
