import stringifyId from "../core-utils/stringifyId.js";

const grabOffset = 5;

// TODO: not working when scrolled

export function getResizableColumn(columns, columnLookup, rowLookup, hoveredCell, mousePosition) {
    if (!hoveredCell)
        return null;

    const column = columnLookup.get(stringifyId(hoveredCell.columnId));
    const row = rowLookup.get(stringifyId(hoveredCell.rowId));
    const x = mousePosition.x;

    if (row.type !== 'HEADER')
        return null;

    if (x >= column.right - grabOffset && x <= column.right + grabOffset)
        return column.id;

    if (column.index === 0)
        return null;
    if (x < column.left - grabOffset || x > column.left + grabOffset)
        return null;

    return columns[column.index - 1].id;
}

export function getResizableRow(rows, columnLookup, rowLookup, hoveredCell, mousePosition) {
    if (!hoveredCell)
        return null;

    const column = columnLookup.get(stringifyId(hoveredCell.columnId));
    const row = rowLookup.get(stringifyId(hoveredCell.rowId));
    const y = mousePosition.y;

    if (column.type !== 'HEADER')
        return null;

    if (y >= row.bottom - grabOffset && y <= row.bottom + grabOffset)
        return row.id;

    if (row.index === 0)
        return null;
    if (y < row.top - grabOffset || y > row.top + grabOffset)
        return null;

    return rows[row.index - 1].id;
}