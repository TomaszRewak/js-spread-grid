import getCellPlacement from "./getCellPlacement.js";

/**
 * @param {EditableCell[]} editableCells
 * @param {CellId} focusedCell
 * @param {ColumnLookup} columnLookup
 * @param {RowLookup} rowLookup
 * @param {Sections} sections
 * @returns {ElementPlacement | null}
 */
export default function getInputPlacement(editableCells, focusedCell, columnLookup, rowLookup, sections) {
    if (editableCells.length === 0)
        return null;

    return getCellPlacement(focusedCell, columnLookup, rowLookup, sections);
}
