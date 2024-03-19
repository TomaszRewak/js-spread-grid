import Selection from "../types/Selection.js";

export default function getCombinedCells(previousCells, newCells) {
    const selection = new Selection(newCells);
    return [...newCells, ...previousCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId))];
}
