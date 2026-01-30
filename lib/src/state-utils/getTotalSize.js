/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.MeasuredRow[]} rows
 * @param {number} borderWidth
 * @returns {number}
 */
function getTotalHeight(rows, borderWidth) {
    if (rows.length === 0)
        return 0;

    let totalHeight = borderWidth;

    for (const row of rows) {
        totalHeight += row.height;
        totalHeight += borderWidth;
    }

    return totalHeight;
}

/**
 * @param {Types.MeasuredColumn[]} columns
 * @param {number} borderWidth
 * @returns {number}
 */
function getTotalWidth(columns, borderWidth) {
    if (columns.length === 0)
        return 0;

    let totalWidth = borderWidth;

    for (const column of columns) {
        totalWidth += column.width;
        totalWidth += borderWidth;
    }

    return totalWidth;
}

/**
 * @param {Types.MeasuredColumn[]} columns
 * @param {Types.MeasuredRow[]} rows
 * @param {number} borderWidth
 * @returns {Types.TotalSize}
 */
export default function getTotalSize(columns, rows, borderWidth) {
    return {
        width: getTotalWidth(columns, borderWidth),
        height: getTotalHeight(rows, borderWidth)
    };
}
