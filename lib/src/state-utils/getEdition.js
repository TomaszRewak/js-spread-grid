/** @import * as Types from "../typings.js"; */

import Edition from "../types/Edition.js";

/**
 * @param {Types.EditedCell[]} editedCellsAndFilters
 * @returns {Edition}
 */
export default function getEdition(editedCellsAndFilters) {
    return new Edition(editedCellsAndFilters);
}
