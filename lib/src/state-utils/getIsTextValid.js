/** @import * as Types from "../typings.js"; */

/**
 * @param {string} text
 * @param {Types.EditableCell[]} editableCells
 * @returns {boolean}
 */
export default function getIsTextValid(text, editableCells) {
    return editableCells.every(cell => cell.edit.validate({ string: text }));
}
