import Selection from "../types/Selection.js";

export default function getSelection(selectedCells) {
    return new Selection(selectedCells);
}
