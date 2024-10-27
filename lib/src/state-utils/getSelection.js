import Selection from "../types/Selection.js";

/**
 * @param {CellId[]} selectedCells
 * @returns {Selection}
 */
export default function getSelection(selectedCells) {
    return new Selection(selectedCells);
}
