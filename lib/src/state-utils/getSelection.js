/** @import * as Types from "../typings.js"; */

import Selection from "../types/Selection.js";

/**
 * @param {Types.CellId[]} selectedCells
 * @returns {Selection}
 */
export default function getSelection(selectedCells) {
    return new Selection(selectedCells);
}
