/** @import * as Types from "../typings.js"; */

import getCellPlacement from "./getCellPlacement.js";

/**
 * @param {Types.EditableCell[]} editableCells
 * @param {Types.CellId} focusedCell
 * @param {Types.ColumnLookup} columnLookup
 * @param {Types.RowLookup} rowLookup
 * @param {Types.Sections} sections
 * @returns {Types.ElementPlacement | null}
 */
export default function getInputPlacement(editableCells, focusedCell, columnLookup, rowLookup, sections) {
    if (editableCells.length === 0)
        return null;

    return getCellPlacement(focusedCell, columnLookup, rowLookup, sections);
}
