import Edition from "../types/Edition";

// TODO: Move
export default function getEdition(editedCellsAndFilters) {
    return new Edition(editedCellsAndFilters);
}
