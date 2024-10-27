import Selection from "../types/Selection.js";

/**
 * @template {CellId} T
 * @param {T[]} previousCells
 * @param {CellId[]} cellsToRemove
 * @returns {T[]}
 */
export default function getReducedCells(previousCells, cellsToRemove) {
    const selection = new Selection(cellsToRemove);
    return previousCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId));
}
