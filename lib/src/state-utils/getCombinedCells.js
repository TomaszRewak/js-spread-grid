/** @import * as Types from "../typings.js"; */

import Selection from "../types/Selection.js";

/**
 * @template {Types.CellId} T
 * @param {T[]} previousCells
 * @param {T[]} newCells
 * @returns {T[]}
 */
export default function getCombinedCells(previousCells, newCells) {
    const selection = new Selection(newCells);
    return [...newCells, ...previousCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId))];
}
