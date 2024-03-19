import Selection from "../types/Selection.js";

export default function getReducedCells(previousCells, cellsToRemove) {
    const selection = new Selection(cellsToRemove);
    return previousCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId));
}
