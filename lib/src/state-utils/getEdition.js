import Edition from "../types/Edition.js";

// TODO: Move
export default function getEdition(editedCellsAndFilters) {
    return new Edition(editedCellsAndFilters);
}
