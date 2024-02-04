import stringifyId from "../core-utils/stringifyId";

export default function getInputPlacement(editableCells, focusedCell, columnLookup, rowLookup) {
    if (!focusedCell)
        return null;

    const focusedColumnKey = stringifyId(focusedCell.columnId);
    const focusedRowKey = stringifyId(focusedCell.rowId);

    if (!columnLookup.has(focusedColumnKey))
        return null;
    if (!rowLookup.has(focusedRowKey))
        return null;

    const column = columnLookup.get(focusedColumnKey);
    const row = rowLookup.get(focusedRowKey);

    if (editableCells.length === 0)
        return null;

    return {
        left: column.left,
        top: row.top,
        width: column.width,
        height: row.height,
        boxSizing: 'border-box',
    };
}
