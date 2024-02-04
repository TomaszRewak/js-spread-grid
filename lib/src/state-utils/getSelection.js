import Selection from "../types/Selection";

export default function getSelection(selectedCells) {
    return new Selection(selectedCells);
}
