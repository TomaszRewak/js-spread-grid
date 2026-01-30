/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";
import getInternalPosition from "./getInternalPosition.js";

const grabOffset = 5;

// TODO: not working when scrolled

/**
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.ColumnLookup} columnLookup
 * @param {Types.RowLookup} rowLookup
 * @param {Types.CellId} hoveredCell
 * @param {Types.Position} internalMousePosition
 * @param {boolean} isReordering
 * @returns {Types.Id}
 */
export function getResizableColumn(columns, columnLookup, rowLookup, hoveredCell, internalMousePosition, isReordering) {
    if (!hoveredCell)
        return null;
    if (isReordering)
        return null;

    const column = columnLookup.get(stringifyId(hoveredCell.columnId));
    const row = rowLookup.get(stringifyId(hoveredCell.rowId));

    if (row.type !== 'HEADER')
        return null;

    if (!internalMousePosition)
        return null;
    const x = internalMousePosition.x;

    if (x >= column.right - grabOffset && x <= column.right + grabOffset)
        return column.id;

    if (column.index === 0)
        return null;
    if (x < column.left - grabOffset || x > column.left + grabOffset)
        return null;

    return columns[column.index - 1].id;
}

/**
 * @param {Types.ResolvedRow[]} rows
 * @param {Types.ColumnLookup} columnLookup
 * @param {Types.RowLookup} rowLookup
 * @param {Types.CellId} hoveredCell
 * @param {Types.Position} internalMousePosition
 * @param {boolean} isReordering
 * @returns {Types.Id}
 */
export function getResizableRow(rows, columnLookup, rowLookup, hoveredCell, internalMousePosition, isReordering) {
    if (!hoveredCell)
        return null;
    if (isReordering)
        return null;

    const column = columnLookup.get(stringifyId(hoveredCell.columnId));
    const row = rowLookup.get(stringifyId(hoveredCell.rowId));

    if (column.type !== 'HEADER')
        return null;

    if (!internalMousePosition)
        return null;
    const y = internalMousePosition.y;

    if (y >= row.bottom - grabOffset && y <= row.bottom + grabOffset)
        return row.id;

    if (row.index === 0)
        return null;
    if (y < row.top - grabOffset || y > row.top + grabOffset)
        return null;

    return rows[row.index - 1].id;
}