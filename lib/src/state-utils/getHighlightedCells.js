/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {boolean} isMouseDown
 * @param {boolean} canHighlight
 * @param {Types.CellId} focusedCell
 * @param {Types.CellId} hoveredCell
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.ResolvedRow[]} rows
 * @param {Types.ColumnLookup} columnLookup
 * @param {Types.RowLookup} rowLookup
 * @returns {Types.CellId[]}
 */
export default function getHighlightedCells(isMouseDown, canHighlight, focusedCell, hoveredCell, columns, rows, columnLookup, rowLookup) {
    if (!isMouseDown)
        return [];
    if (!canHighlight)
        return [];
    if (!hoveredCell)
        return [];
    if (!focusedCell)
        return [];

    const focusedColumnKey = stringifyId(focusedCell.columnId);
    const focusedRowKey = stringifyId(focusedCell.rowId);
    const hoveredColumnKey = stringifyId(hoveredCell.columnId);
    const hoveredRowKey = stringifyId(hoveredCell.rowId);

    if (!columnLookup.has(focusedColumnKey))
        return [];
    if (!rowLookup.has(focusedRowKey))
        return [];
    if (!columnLookup.has(hoveredColumnKey))
        return [];
    if (!rowLookup.has(hoveredRowKey))
        return [];

    const minColumnIndex = Math.min(columnLookup.get(focusedColumnKey).index, columnLookup.get(hoveredColumnKey).index);
    const maxColumnIndex = Math.max(columnLookup.get(focusedColumnKey).index, columnLookup.get(hoveredColumnKey).index);
    const minRowIndex = Math.min(rowLookup.get(focusedRowKey).index, rowLookup.get(hoveredRowKey).index);
    const maxRowIndex = Math.max(rowLookup.get(focusedRowKey).index, rowLookup.get(hoveredRowKey).index);

    return columns.slice(minColumnIndex, maxColumnIndex + 1).flatMap(column => {
        return rows.slice(minRowIndex, maxRowIndex + 1).map(row => {
            return {
                rowId: row.id,
                columnId: column.id
            };
        });
    });
}
