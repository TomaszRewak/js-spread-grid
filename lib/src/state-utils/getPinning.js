/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.ResolvedColumn} column
 * @returns {number}
 */
function getColumns(column) {
    return column.type === 'DYNAMIC-BLOCK' ? column.count : 1;
}

/**
 * @param {Types.ResolvedRow} row
 * @returns {number}
 */
function getRows(row) {
    return row.type === 'DYNAMIC-BLOCK' ? row.count : 1;
}

/**
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.ResolvedRow[]} rows
 * @param {number} pinnedTop
 * @param {number} pinnedBottom
 * @param {number} pinnedLeft
 * @param {number} pinnedRight
 * @returns {Types.Pinning}
 */
export default function getPinning(columns, rows, pinnedTop, pinnedBottom, pinnedLeft, pinnedRight) {
    const totalColumns = columns.reduce((sum, column) => sum + getColumns(column), 0);
    const totalRows = rows.reduce((sum, row) => sum + getRows(row), 0);

    const left = Math.min(pinnedLeft, totalColumns);
    const top = Math.min(pinnedTop, totalRows);
    const right = Math.min(pinnedRight, totalColumns - left);
    const bottom = Math.min(pinnedBottom, totalRows - top);

    return {
        left,
        top,
        right,
        bottom
    };
}