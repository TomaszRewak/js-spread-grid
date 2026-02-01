/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";
import roundToPixels from "../core-utils/roundToPixels.js";

/**
 * @template {Types.StaticDimension} T
 * @param {T} element
 * @param {number} index
 * @returns {T & Types.ResolvedStaticDimension}
 */
function resolveStaticDimension(element, index) {
    const type = element.type || "DATA";
    const selector = 'selector' in element ? element.selector : ('id' in element ? element.id : undefined);
    const id = 'id' in element ? element.id : ('selector' in element ? element.selector : type);

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
 * @template {Types.DynamicDimension} T
 * @param {T} element
 * @param {number} index
 * @returns {T & Types.ResolvedDynamicDimension}
 */
function resolveDynamicDimension(element, index) {
    const selector = 'selector' in element ? element.selector : (/** @type {Types.DynamicDimensionSelectorContext} */ { index }) => index;
    const id = 'id' in element ? element.id : (/** @type {Types.DimensionIdContext} */ { selector }) => selector;
    const header = 'header' in element ? element.header : () => `#${index}`;

    return {
        ...element,
        id: id,
        selector: selector,
        type: 'DYNAMIC-BLOCK',
        header: header,
        labels: element.labels || [],
        index: index
    };
}

/**
 * @param {number | Types.FittingType} value
 * @param {number} devicePixelRatio
 * @returns {number | Types.FittingType}
 */
function roundToPixelsIfNumber(value, devicePixelRatio) {
    return typeof value === 'number' ? roundToPixels(value, devicePixelRatio) : value;
}

/**
 * @param {Types.UnfoldedColumn[]} columns
 * @param {Types.ColumnWidth[]} columnWidths
 * @param {number} borderWidth
 * @param {number} devicePixelRatio
 * @returns {Types.ResolvedColumn[]}
 */
export function getResolvedColumns(columns, columnWidths, borderWidth, devicePixelRatio) {
    const widthsLookup = new Map(columnWidths.map(({ columnId, width }) => [stringifyId(columnId), width]));

    return columns.map((column, index) => {
        if (column.type === 'DYNAMIC-BLOCK') {
            const resolved = resolveDynamicDimension(column, index);
            const width = column.width * column.count + borderWidth * (column.count - 1);
            return {
                ...resolved,
                count: column.count,
                width: roundToPixels(width, devicePixelRatio),
                columnWidth: roundToPixels(column.width, devicePixelRatio)
            };
        } else {
            const resolved = resolveStaticDimension(column, index);
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
 * @param {Types.UnfoldedRow[]} rows
 * @param {Types.RowHeight[]} rowHeights
 * @param {number} borderWidth
 * @param {number} devicePixelRatio
 * @returns {Types.ResolvedRow[]}
 */
export function getResolvedRows(rows, rowHeights, borderWidth, devicePixelRatio) {
    const heightsLookup = new Map(rowHeights.map(({ rowId, height }) => [stringifyId(rowId), height]));

    return rows.map((row, index) => {
        if (row.type === 'DYNAMIC-BLOCK') {
            const resolved = resolveDynamicDimension(row, index);
            const height = row.height * row.count + borderWidth * (row.count - 1);
            return {
                ...resolved,
                count: row.count,
                height: roundToPixels(height, devicePixelRatio),
                rowHeight: roundToPixels(row.height, devicePixelRatio)
            };
        } else {
            const resolved = resolveStaticDimension(row, index);
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
