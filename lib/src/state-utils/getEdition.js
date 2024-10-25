import Edition from "../types/Edition.js";

/**
 * @param {EditedCell[]} editedCellsAndFilters
 * @returns {Edition}
 */
export default function getEdition(editedCellsAndFilters) {
    return new Edition(editedCellsAndFilters);
}
