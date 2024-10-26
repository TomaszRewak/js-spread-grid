import stringifyId from "../core-utils/stringifyId.js";
import getInternalPosition from "./getInternalPosition.js";

const grabOffset = 5;

// TODO: not working when scrolled

/**
 * @param {ResolvedColumn[]} columns
 * @param {ColumnLookup} columnLookup
 * @param {RowLookup} rowLookup
 * @param {CellId} hoveredCell
 * @param {HTMLElement} element
 * @param {Position} mousePosition
 * @param {boolean} isReordering
 * @param {FixedSize} fixedSize
 * @param {TotalSize} totalSize
 * @returns {Id}
 */
export function getResizableColumn(columns, columnLookup, rowLookup, hoveredCell, element, mousePosition, isReordering, fixedSize, totalSize) {
    if (!hoveredCell)
        return null;
    if (isReordering)
        return null;

    const column = columnLookup.get(stringifyId(hoveredCell.columnId));
    const row = rowLookup.get(stringifyId(hoveredCell.rowId));

    if (row.type !== 'HEADER')
        return null;

    const internalPosition = getInternalPosition(element, mousePosition, fixedSize, totalSize);
    if (!internalPosition)
        return null;
    const x = internalPosition.x;

    if (x >= column.right - grabOffset && x <= column.right + grabOffset)
        return column.id;

    if (column.index === 0)
        return null;
    if (x < column.left - grabOffset || x > column.left + grabOffset)
        return null;

    return columns[column.index - 1].id;
}

/**
 * @param {ResolvedRow[]} rows
 * @param {ColumnLookup} columnLookup
 * @param {RowLookup} rowLookup
 * @param {CellId} hoveredCell
 * @param {HTMLElement} element
 * @param {Position} mousePosition
 * @param {boolean} isReordering
 * @param {FixedSize} fixedSize
 * @param {TotalSize} totalSize
 * @returns {Id}
 */
export function getResizableRow(rows, columnLookup, rowLookup, hoveredCell, element, mousePosition, isReordering, fixedSize, totalSize) {
    if (!hoveredCell)
        return null;
    if (isReordering)
        return null;

    const column = columnLookup.get(stringifyId(hoveredCell.columnId));
    const row = rowLookup.get(stringifyId(hoveredCell.rowId));

    if (column.type !== 'HEADER')
        return null;

    const internalPosition = getInternalPosition(element, mousePosition, fixedSize, totalSize);
    if (!internalPosition)
        return null;
    const y = internalPosition.y;

    if (y >= row.bottom - grabOffset && y <= row.bottom + grabOffset)
        return row.id;

    if (row.index === 0)
        return null;
    if (y < row.top - grabOffset || y > row.top + grabOffset)
        return null;

    return rows[row.index - 1].id;
}