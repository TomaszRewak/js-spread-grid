import stringifyId from "../core-utils/stringifyId.js";
import roundToPixels from "../core-utils/roundToPixels.js";

/**
 * @template {Dimension} T
 * @param {T} element
 * @param {number} index
 * @returns {T & ResolvedDimension}
 */
function getResolved(element, index) {
    const id = 'id' in element ? element.id : element.type;
    const selector = 'selector' in element ? element.selector : id;
    const type = element.type || "DATA";

    return {
        ...element,
        id: id,
        selector: selector,
        type: type,
        key: stringifyId(id),
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
 * @param {ColumnWidth[]} columnWidths
 * @param {number} borderWidth
 * @param {number} devicePixelRatio
 * @returns {ResolvedColumn[]}
 */
export function getResolvedColumns(columns, columnWidths, borderWidth, devicePixelRatio) {
    const widthsLookup = new Map(columnWidths.map(({ columnId, width }) => [stringifyId(columnId), width]));

    return columns.map((column, index) => {
        if (column.type === 'DYNAMIC-BLOCK') {
            const resolved = getResolved(column, index);
            const width = column.width * column.count + borderWidth * (column.count - 1);
            return {
                ...resolved,
                count: column.count,
                width: roundToPixels(width, devicePixelRatio),
                columnWidth: roundToPixels(column.width, devicePixelRatio)
            };
        } else {
            const resolved = getResolved(column, index);
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
 * @param {RowHeight[]} rowHeights
 * @param {number} borderWidth
 * @param {number} devicePixelRatio
 * @returns {ResolvedRow[]}
 */
export function getResolvedRows(rows, rowHeights, borderWidth, devicePixelRatio) {
    const heightsLookup = new Map(rowHeights.map(({ rowId, height }) => [stringifyId(rowId), height]));

    return rows.map((row, index) => {
        if (row.type === 'DYNAMIC-BLOCK') {
            const resolved = getResolved(row, index);
            const height = row.height * row.count + borderWidth * (row.count - 1);
            return {
                ...resolved,
                count: row.count,
                height: roundToPixels(height, devicePixelRatio),
                rowHeight: roundToPixels(row.height, devicePixelRatio)
            };
        } else {
            const resolved = getResolved(row, index);
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
