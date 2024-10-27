import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {ResolvedDimension[]} entries
 * @param {Id} focusedId
 * @param {Id} hoveredId
 */
function findMove(entries, focusedId, hoveredId) {
    const focusedKey = stringifyId(focusedId);
    const hoveredKey = stringifyId(hoveredId);

    if (focusedKey === hoveredKey)
        return null;

    const focusedIndex = entries.findIndex(entry => entry.key === focusedKey);
    const hoveredIndex = entries.findIndex(entry => entry.key === hoveredKey);

    if (focusedIndex === -1)
        return null;
    if (hoveredIndex === -1)
        return null;
    if (focusedIndex === hoveredIndex)
        return null;

    return [focusedIndex, hoveredIndex];
}

/**
 * @param {PlacedColumn[]} columns
 * @param {Id} columnId
 * @param {CellId} hoveredCell
 * @param {Position} mousePosition
 */
export function getReorderedColumns(columns, columnId, hoveredCell, mousePosition) {
    if (!hoveredCell)
        return null;

    const move = findMove(columns, columnId, hoveredCell.columnId);

    if (!move)
        return null;

    const [from, to] = move;
    const adjustedTo = to <= from
        ? (mousePosition.x < columns[to].leftWithBorder + columns[from].width ? to : to + 1)
        : (mousePosition.x > columns[to].rightWithBorder - columns[from].width ? to : to - 1);

    if (adjustedTo === from)
        return null;

    const reordered = columns.map(entry => entry.id);
    reordered.splice(from, 1);
    reordered.splice(adjustedTo, 0, columnId);

    return reordered;
}

/**
 * @param {PlacedRow[]} rows
 * @param {Id} rowId
 * @param {CellId} hoveredCell
 * @param {Position} mousePosition
 */
export function getReorderedRows(rows, rowId, hoveredCell, mousePosition) {
    if (!hoveredCell)
        return null;

    const move = findMove(rows, rowId, hoveredCell.rowId);

    if (!move)
        return null;

    const [from, to] = move;
    const adjustedTo = to <= from
        ? (mousePosition.y < rows[to].topWithBorder + rows[from].height ? to : to + 1)
        : (mousePosition.y > rows[to].bottomWithBorder - rows[from].height ? to : to - 1);

    if (adjustedTo === from)
        return null;

    const reordered = rows.map(entry => entry.id);
    reordered.splice(from, 1);
    reordered.splice(adjustedTo, 0, rowId);

    return reordered;
}