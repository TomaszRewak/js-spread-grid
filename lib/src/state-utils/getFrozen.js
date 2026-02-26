/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {Types.ResolvedColumn[]} sortedColumns
 * @param {boolean} freezeOnHover
 * @param {Types.CellId | undefined} hoveredCell
 * @param {Types.ResolvedColumn[] | undefined} previousShapedColumns
 * @returns {Types.ResolvedColumn[]}
 */
export function getFrozenColumns(sortedColumns, freezeOnHover, hoveredCell, previousShapedColumns) {
    if (!freezeOnHover) return sortedColumns;
    if (!hoveredCell) return sortedColumns;
    if (!previousShapedColumns) return sortedColumns;

    const columnKey = stringifyId(hoveredCell.columnId);
    const column = previousShapedColumns.find(c => 'key' in c && c.key === columnKey);
    if (column?.type !== 'DATA') return sortedColumns;

    return previousShapedColumns;
}

/**
 * @param {Types.ResolvedRow[]} sortedRows
 * @param {boolean} freezeOnHover
 * @param {Types.CellId | undefined} hoveredCell
 * @param {Types.ResolvedRow[] | undefined} previousShapedRows
 * @returns {Types.ResolvedRow[]}
 */
export function getFrozenRows(sortedRows, freezeOnHover, hoveredCell, previousShapedRows) {
    if (!freezeOnHover) return sortedRows;
    if (!hoveredCell) return sortedRows;
    if (!previousShapedRows) return sortedRows;

    const rowKey = stringifyId(hoveredCell.rowId);
    const row = previousShapedRows.find(r => 'key' in r && r.key === rowKey);
    if (row?.type !== 'DATA') return sortedRows;

    return previousShapedRows;
}
