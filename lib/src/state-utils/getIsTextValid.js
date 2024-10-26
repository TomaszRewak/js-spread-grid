/**
 * @param {string} text
 * @param {EditableCell[]} editableCells
 * @returns {boolean}
 */
export default function getIsTextValid(text, editableCells) {
    return editableCells.every(cell => cell.edit.validate({ string: text }));
}
